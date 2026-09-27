import crypto from 'crypto';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseServer';
import { NextApiRequest, NextApiResponse } from 'next';

const MIRAGE_ID = 'master_mirage';

// ----------------------------------------------------------------------
// Configuration & Defaults
// ----------------------------------------------------------------------

export interface MirageConfig {
  generator_pin_hash: string;
  generator_pin_salt: string;
  true_colors: string[];
  true_port?: number;
  mirage_strikes?: number;
  mirage_locked_until?: string;
}

export async function getMirageConfig(): Promise<MirageConfig | null> {
  if (!isSupabaseAdminConfigured()) return null;
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_mirage_config')
      .select('*')
      .eq('id', MIRAGE_ID)
      .maybeSingle();

    if (error || !data) return null;
    return data as MirageConfig;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------
// Phase 1: Generator Logic (/mradmin2)
// ----------------------------------------------------------------------

function generateRandomCode(): string {
  return crypto.randomInt(1000, 10000).toString(); // Secure 4 digits
}

function generateRandomColors(): string[] {
  const colors = ['#ef4444', '#3b82f6', '#eab308', '#a855f7', '#ec4899', '#f97316'];
  return Array.from({ length: 4 }, () => colors[crypto.randomInt(0, colors.length)]);
}

/**
 * Generates a True or Fake OTP based on the provided Master Generator PIN.
 * This function NEVER throws or reveals if the PIN was correct.
 */
export async function generateMirageOtp(inputPin: string, sessionToken: string = 'unknown'): Promise<{ code: string; colors: string[], isFake?: boolean }> {
  const config = await getMirageConfig();
  
  if (!config) {
    return { code: generateRandomCode(), colors: generateRandomColors(), isFake: true };
  }

  const inputHash = crypto.pbkdf2Sync(inputPin.trim(), config.generator_pin_salt, 50000, 32, 'sha256').toString('hex');
  const isMatch = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(config.generator_pin_hash));
  const generatedCode = generateRandomCode();

  if (isMatch) {
    const sessionHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const payloadToHash = `${generatedCode}:${sessionHash}`;
    const otpSalt = crypto.randomBytes(16).toString('hex');
    const otpHash = crypto.pbkdf2Sync(payloadToHash, otpSalt, 50000, 32, 'sha256').toString('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    await supabaseAdmin.from('admin_mirage_otps').insert({
      id: `otp_${crypto.randomBytes(8).toString('hex')}`,
      otp_hash: otpHash,
      otp_salt: otpSalt,
      expires_at: expiresAt,
      is_used: false
    });

    return { code: generatedCode, colors: config.true_colors, isFake: false };
  } else {
    return { code: generateRandomCode(), colors: generateRandomColors(), isFake: true };
  }
}

// ----------------------------------------------------------------------
// Phase 2: Verification Logic (Main Login Portal)
// ----------------------------------------------------------------------

export async function verifyMirageOtp(inputCode: string, sessionToken: string = 'unknown'): Promise<boolean> {
  if (!isSupabaseAdminConfigured()) return false;
  
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_mirage_otps')
      .select('*')
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString());

    if (error || !data || data.length === 0) return false;

    const sessionHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const payloadToHash = `${inputCode.trim()}:${sessionHash}`;

    for (const otp of data) {
      const expectedHash = crypto.pbkdf2Sync(payloadToHash, otp.otp_salt, 50000, 32, 'sha256').toString('hex');
      if (expectedHash === otp.otp_hash) {
        await supabaseAdmin.from('admin_mirage_otps').update({ is_used: true }).eq('id', otp.id);
        return true;
      }
    }
  } catch (err) {
    console.error('Mirage Verification Error:', err);
  }
  return false;
}

// ----------------------------------------------------------------------
// Session & Token Management (The 60-Second Lock)
// ----------------------------------------------------------------------

const MIRAGE_SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback_mirage_secret_secure_string';

export function setMirageChallengeCookie(res: NextApiResponse) {
  const startTimestamp = Date.now();
  const signature = crypto.createHmac('sha256', MIRAGE_SECRET).update(`challenge:${startTimestamp}`).digest('hex');
  const token = `challenge.${startTimestamp}.${signature}`;
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';

  const existing = res.getHeader('Set-Cookie') || [];
  const existingArray = Array.isArray(existing) ? existing : [String(existing)];

  res.setHeader('Set-Cookie', [
    ...existingArray,
    `ms_mirage_state=${token}; Path=/; HttpOnly; SameSite=Strict${secureFlag}; Max-Age=120`
  ]);
}

export function setMirageUnlockedCookie(req: NextApiRequest, res: NextApiResponse) {
  const sessionToken = req.cookies['ms_admin_token'] || 'unknown';
  const sessionHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
  const timestamp = Date.now();
  const signature = crypto.createHmac('sha256', MIRAGE_SECRET).update(`unlocked:${timestamp}:${sessionHash}`).digest('hex');
  const token = `unlocked.${timestamp}.${signature}`;
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';

  const existing = res.getHeader('Set-Cookie') || [];
  const existingArray = Array.isArray(existing) ? existing : [String(existing)];
  
  res.setHeader('Set-Cookie', [
    ...existingArray,
    `ms_mirage_state=${token}; Path=/; HttpOnly; SameSite=Strict${secureFlag}; Max-Age=${7 * 24 * 60 * 60}`
  ]);
}

export function clearMirageCookie(res: NextApiResponse) {
  const isProd = process.env.NODE_ENV === 'production';
  const secureFlag = isProd ? '; Secure' : '';
  const existing = res.getHeader('Set-Cookie') || [];
  const existingArray = Array.isArray(existing) ? existing : [String(existing)];
  res.setHeader('Set-Cookie', [
    ...existingArray,
    `ms_mirage_state=; Path=/; HttpOnly; SameSite=Strict${secureFlag}; Max-Age=0`
  ]);
}

export function verifyMirageState(req: NextApiRequest): { isUnlocked: boolean; challengeStartedAt?: number; isExpired: boolean } {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return { isUnlocked: false, isExpired: true };

  const match = cookieHeader.match(/ms_mirage_state=([^;]+)/);
  if (!match || !match[1]) return { isUnlocked: false, isExpired: true };

  const token = match[1];
  const parts = token.split('.');
  if (parts.length !== 3) return { isUnlocked: false, isExpired: true };

  const [state, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  
  const sessionToken = req.cookies['ms_admin_token'] || 'unknown';
  const sessionHash = crypto.createHash('sha256').update(sessionToken).digest('hex');

  let expectedSig = '';
  if (state === 'unlocked') {
    expectedSig = crypto.createHmac('sha256', MIRAGE_SECRET).update(`unlocked:${timestamp}:${sessionHash}`).digest('hex');
  } else {
    expectedSig = crypto.createHmac('sha256', MIRAGE_SECRET).update(`challenge:${timestamp}`).digest('hex');
  }

  if (expectedSig !== signature) return { isUnlocked: false, isExpired: true };

  if (state === 'unlocked') {
    return { isUnlocked: true, isExpired: false };
  }

  if (state === 'challenge') {
    const elapsed = Date.now() - timestamp;
    if (elapsed > 60000) { // 60 seconds strict!
      return { isUnlocked: false, challengeStartedAt: timestamp, isExpired: true };
    }
    return { isUnlocked: false, challengeStartedAt: timestamp, isExpired: false };
  }

  return { isUnlocked: false, isExpired: true };
}
