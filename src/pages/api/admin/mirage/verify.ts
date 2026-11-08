import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminSessionWithDevice } from '../../../../lib/serverAdminAuth';
import { 
  verifyMirageOtp, 
  setMirageUnlockedCookie, 
  verifyMirageState, 
  clearMirageCookie, 
  getMirageConfig,
  type MirageConfig 
} from '../../../../lib/mirageService';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. You must be authenticated to even attempt a Mirage verification
  const auth = await verifyAdminSessionWithDevice(req);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Check session state
  const state = verifyMirageState(req);
  if (state.isUnlocked) {
    return res.status(200).json({ success: true, message: 'Already unlocked' });
  }

  // 3. Config with safe fallback
  const config = await getMirageConfig();
  const fallbackConfig: MirageConfig = {
    generator_pin_hash: 'UNINITIALIZED',
    generator_pin_salt: 'UNINITIALIZED',
    true_colors: ['#ef4444', '#3b82f6', '#eab308', '#10b981'],
    true_port: 8,
    mirage_strikes: 0
  };
  const activeConfig = config || fallbackConfig;

  // 4. Verify Code & Port
  const { code, port = 8 } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Sequence or OTP is required.' });
  }

  const cleanCode = code.trim();
  let strikes = activeConfig.mirage_strikes || 0;

  // A. Verify OTP from active DB otps
  let isValid = await verifyMirageOtp(cleanCode);

  // B. Master PIN verification (242242 or password123 or PBKDF2 hash)
  if (!isValid && (cleanCode === '242242' || cleanCode === 'password123')) {
    isValid = true;
  }

  if (!isValid && activeConfig.generator_pin_hash && activeConfig.generator_pin_salt && activeConfig.generator_pin_hash !== 'UNINITIALIZED') {
    try {
      const pinHash = crypto.pbkdf2Sync(cleanCode, activeConfig.generator_pin_salt, 50000, 32, 'sha256').toString('hex');
      if (crypto.timingSafeEqual(Buffer.from(pinHash), Buffer.from(activeConfig.generator_pin_hash))) {
        isValid = true;
      }
    } catch {}
  }

  if (isValid) {
    if (isSupabaseAdminConfigured()) {
      try {
        await supabaseAdmin.from('admin_mirage_config').update({
          mirage_strikes: 0,
          mirage_locked_until: null
        }).eq('id', 'master_mirage');
      } catch {}
    }

    const existing = res.getHeader('Set-Cookie') || [];
    const existingArray = Array.isArray(existing) ? existing : [String(existing)];
    res.setHeader('Set-Cookie', [
      ...existingArray,
      `ms_mirage_strikes=0; Path=/; Max-Age=0`,
      `ms_mirage_penalty=0; Path=/; Max-Age=0`
    ]);
    setMirageUnlockedCookie(req, res);
    return res.status(200).json({ success: true, message: 'Visual verification confirmed. Dashboard unlocked.' });
  } else {
    strikes += 1;
    
    if (strikes >= 5) {
      clearMirageCookie(res);
      if (isSupabaseAdminConfigured()) {
        try {
          await supabaseAdmin.from('admin_mirage_config').update({
            mirage_strikes: 0,
            mirage_locked_until: null
          }).eq('id', 'master_mirage');
        } catch {}
      }

      const existing = res.getHeader('Set-Cookie') || [];
      const existingArray = Array.isArray(existing) ? existing : [String(existing)];
      res.setHeader('Set-Cookie', [
        ...existingArray,
        `ms_mirage_strikes=0; Path=/; Max-Age=0`,
        `ms_mirage_penalty=0; Path=/; Max-Age=0`
      ]);
      return res.status(403).json({ error: 'Maximum attempts reached. Please re-authenticate.' });
    }

    if (isSupabaseAdminConfigured()) {
      try {
        await supabaseAdmin.from('admin_mirage_config').update({
          mirage_strikes: strikes
        }).eq('id', 'master_mirage');
      } catch {}
    }

    return res.status(400).json({ 
      error: `Sequence rejected (${strikes}/5 attempts). Please check your OTP or use Master PIN 242242.` 
    });
  }
}
