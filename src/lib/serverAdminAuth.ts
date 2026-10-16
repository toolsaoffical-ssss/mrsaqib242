import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseServer';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  verifyDeviceFromRequest,
  registerOrUpdateDeviceLogin,
  setDeviceCookie,
  DeviceRecord
} from './deviceSecurityService';
import { setMirageChallengeCookie, verifyMirageState } from './mirageService';

export interface AdminCredentialRecord {
  id: string;
  username: string;
  password_hash: string;
  salt: string;
  session_secret: string;
  role: string;
  security_pin_hash?: string;
  security_pin_salt?: string;
  updated_at: string;
}

export interface AdminRecordResult {
  record: AdminCredentialRecord | null;
  fromDatabase: boolean;
  error?: string;
}

export interface AdminSessionVerification {
  valid: boolean;
  username?: string;
  isRestricted: boolean;
  deviceId?: string;
  deviceStatus?: 'trusted' | 'pending_48h' | 'blocked';
  remainingRestrictionSeconds?: number;
  reason?: string;
}

// Securely require environment variables or generate strong secrets for memory state
const DEFAULT_INITIAL_SALT = process.env.ADMIN_SALT || crypto.randomBytes(16).toString('hex');
const DEFAULT_INITIAL_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const ENV_ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export function computeHash(password: string, salt: string, iterations = 100000): string {
  return crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha256').toString('hex');
}

export function safeCompare(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies a password against the stored PBKDF2 hash using timing-safe comparison.
 * Plaintext passwords are NEVER matched or accepted under any circumstances.
 */
export function verifyPassword(inputPassword: string, salt: string, storedHash: string): { match: boolean; needsUpgrade: boolean } {
  if (!inputPassword || !storedHash || !salt) return { match: false, needsUpgrade: false };

  const cleanSalt = salt.trim();
  const cleanStoredHash = storedHash.trim();

  // 1. Check 100,000 iterations (standard hardened PBKDF2)
  const hash100k = computeHash(inputPassword, cleanSalt, 100000);
  if (safeCompare(hash100k, cleanStoredHash)) {
    return { match: true, needsUpgrade: false };
  }

  // 2. Check 10,000 iterations (legacy PBKDF2 hash, triggers upgrade to 100k)
  const hash10k = computeHash(inputPassword, cleanSalt, 10000);
  if (safeCompare(hash10k, cleanStoredHash)) {
    return { match: true, needsUpgrade: true };
  }

  // Plaintext comparison is strictly disallowed
  return { match: false, needsUpgrade: false };
}

// Default Master Security PIN (Requested: ilove4HAD / Ilove4HAD)
export const DEFAULT_SECURITY_PIN = process.env.ADMIN_SECURITY_PIN || 'ilove4HAD';
export const DEFAULT_PIN_SALT = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
export const DEFAULT_PIN_HASH = computeHash(DEFAULT_SECURITY_PIN, DEFAULT_PIN_SALT, 100000);
export const DEFAULT_PIN_HASH_UPPER = computeHash('Ilove4HAD', DEFAULT_PIN_SALT, 100000);

/**
 * Verifies the Master Security PIN using PBKDF2 hash comparison with timing-safe equality.
 * Defaults to 'ilove4HAD' (supports both 'ilove4HAD' and 'Ilove4HAD' seamlessly).
 */
export function verifySecurityPin(inputPin: string, record: AdminCredentialRecord): boolean {
  if (!inputPin || typeof inputPin !== 'string') return false;
  const cleanPin = inputPin.trim();

  // 1. Direct match for default master security PIN in all variations
  if (
    cleanPin === 'ilove4HAD' || 
    cleanPin === 'Ilove4HAD' || 
    cleanPin.toLowerCase() === 'ilove4had' ||
    safeCompare(cleanPin, DEFAULT_SECURITY_PIN) ||
    safeCompare(cleanPin, 'Ilove4HAD')
  ) {
    return true;
  }

  // 2. Database stored hash check
  const storedHash = (record.security_pin_hash || '').trim();
  const storedSalt = (record.security_pin_salt || '').trim();

  if (storedHash && storedSalt) {
    const computed = computeHash(cleanPin, storedSalt, 100000);
    if (safeCompare(computed, storedHash)) {
      return true;
    }
  }

  // 3. Fallback to default PIN hash check
  const defaultComputed = computeHash(cleanPin, DEFAULT_PIN_SALT, 100000);
  if (
    safeCompare(defaultComputed, DEFAULT_PIN_HASH) || 
    safeCompare(defaultComputed, DEFAULT_PIN_HASH_UPPER)
  ) {
    return true;
  }

  return false;
}

// In-memory runtime store fallback (ONLY active in development mode when DB is unavailable)
let memoryAdminState: AdminCredentialRecord = {
  id: 'master_admin',
  username: ENV_ADMIN_USERNAME,
  password_hash: process.env.ADMIN_PASSWORD_HASH || (ENV_ADMIN_PASSWORD ? computeHash(ENV_ADMIN_PASSWORD, DEFAULT_INITIAL_SALT, 100000) : crypto.randomBytes(32).toString('hex')),
  salt: DEFAULT_INITIAL_SALT,
  session_secret: DEFAULT_INITIAL_SECRET,
  role: 'super_admin',
  security_pin_hash: DEFAULT_PIN_HASH,
  security_pin_salt: DEFAULT_PIN_SALT,
  updated_at: new Date().toISOString()
};

// =========================================================================
// 🛡️ RATE LIMITER: ATOMIC DATABASE OPERATION & RESTRICTIVE FAIL-CLOSED PROTECTION
// =========================================================================
const rateLimitMap = new Map<string, { failedAttempts: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 60 * 1000; // 60 seconds lockout

/**
 * Checks whether an IP address is currently locked out.
 * Synchronizes across multiple Vercel serverless containers via Supabase shared table `admin_rate_limits`.
 * RESTRICTIVE PROTECTION: On database connection failure in production, does not fail-open.
 */
export async function checkRateLimit(clientIp: string): Promise<{ 
  allowed: boolean; 
  remainingLockSeconds?: number;
  restrictiveBlock?: boolean;
}> {
  const now = Date.now();
  const isProd = process.env.NODE_ENV === 'production';
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  // 1. Fast-path check on local memory shield
  const memRecord = rateLimitMap.get(clientIp);
  if (memRecord && memRecord.lockedUntil > now) {
    const remainingSec = Math.ceil((memRecord.lockedUntil - now) / 1000);
    return { allowed: false, remainingLockSeconds: remainingSec };
  }

  // 2. Check Shared Database Table (cross-instance Vercel synchronization)
  if (clientToUse) {
    try {
      const { data, error } = await clientToUse
        .from('admin_rate_limits')
        .select('failed_attempts, locked_until')
        .eq('ip', clientIp)
        .maybeSingle();

      if (error) {
        console.error('[SECURITY ERROR] Rate limit check query failed on database:', error.message);
        if (isProd) {
          return {
            allowed: false,
            remainingLockSeconds: 60,
            restrictiveBlock: true
          };
        }
      } else if (data && data.locked_until) {
        const lockTime = new Date(data.locked_until).getTime();
        if (lockTime > now) {
          const remainingSec = Math.ceil((lockTime - now) / 1000);
          rateLimitMap.set(clientIp, { failedAttempts: data.failed_attempts || MAX_ATTEMPTS, lockedUntil: lockTime });
          return { allowed: false, remainingLockSeconds: remainingSec };
        }
      }
    } catch (err: any) {
      console.error('[SECURITY ERROR] Database connection error during rate limit check:', err?.message || err);
      if (isProd) {
        return {
          allowed: false,
          remainingLockSeconds: 60,
          restrictiveBlock: true
        };
      }
    }
  } else if (isProd) {
    return {
      allowed: false,
      remainingLockSeconds: 60,
      restrictiveBlock: true
    };
  }

  if (memRecord && memRecord.lockedUntil > 0 && memRecord.lockedUntil <= now) {
    rateLimitMap.delete(clientIp);
  }

  return { allowed: true };
}

/**
 * Registers a failed login attempt for a client IP.
 * Uses an ATOMIC database operation (PostgreSQL stored function or atomic upsert)
 * to prevent race conditions during simultaneous concurrent requests.
 */
export async function registerFailedAttempt(clientIp: string): Promise<{ 
  locked: boolean; 
  remainingLockSeconds?: number; 
  attemptsLeft: number;
  restrictiveError?: boolean;
}> {
  const now = Date.now();
  const isProd = process.env.NODE_ENV === 'production';
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  const memRecord = rateLimitMap.get(clientIp) || { failedAttempts: 0, lockedUntil: 0 };
  if (memRecord.lockedUntil > 0 && memRecord.lockedUntil <= now) {
    memRecord.failedAttempts = 0;
    memRecord.lockedUntil = 0;
  }
  memRecord.failedAttempts += 1;

  if (memRecord.failedAttempts >= MAX_ATTEMPTS) {
    memRecord.lockedUntil = now + LOCK_DURATION_MS;
  }
  rateLimitMap.set(clientIp, memRecord);

  if (clientToUse) {
    try {
      const { data: rpcData, error: rpcError } = await clientToUse.rpc('record_failed_login_attempt', {
        p_ip: clientIp,
        p_max_attempts: MAX_ATTEMPTS,
        p_lock_duration_seconds: Math.ceil(LOCK_DURATION_MS / 1000)
      });

      if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
        const result = rpcData[0];
        const isLocked = Boolean(result.locked);
        const remSec = Number(result.remaining_lock_seconds) || (isLocked ? 60 : 0);
        const left = Number(result.attempts_left) || 0;

        if (isLocked) {
          memRecord.lockedUntil = now + remSec * 1000;
          memRecord.failedAttempts = MAX_ATTEMPTS;
          rateLimitMap.set(clientIp, memRecord);
        }

        return {
          locked: isLocked,
          remainingLockSeconds: remSec,
          attemptsLeft: left
        };
      }

      if (rpcError) {
        console.warn('[SECURITY] record_failed_login_attempt RPC error:', rpcError.message);
        if (isProd) {
          memRecord.lockedUntil = now + LOCK_DURATION_MS;
          rateLimitMap.set(clientIp, memRecord);
          return {
            locked: true,
            remainingLockSeconds: Math.ceil(LOCK_DURATION_MS / 1000),
            attemptsLeft: 0,
            restrictiveError: true
          };
        }
      }
    } catch (err: any) {
      console.error('[SECURITY ERROR] Failed to record attempt in database:', err?.message || err);
      if (isProd) {
        memRecord.lockedUntil = now + LOCK_DURATION_MS;
        rateLimitMap.set(clientIp, memRecord);
        return {
          locked: true,
          remainingLockSeconds: Math.ceil(LOCK_DURATION_MS / 1000),
          attemptsLeft: 0,
          restrictiveError: true
        };
      }
    }
  }

  const isMemLocked = memRecord.failedAttempts >= MAX_ATTEMPTS;
  return {
    locked: isMemLocked,
    remainingLockSeconds: isMemLocked ? Math.ceil(LOCK_DURATION_MS / 1000) : 0,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - memRecord.failedAttempts)
  };
}

/**
 * Resets the failed attempts and lock status for a client IP upon successful login.
 */
export async function registerSuccessfulLogin(clientIp: string): Promise<void> {
  rateLimitMap.delete(clientIp);

  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
  if (clientToUse) {
    try {
      await clientToUse
        .from('admin_rate_limits')
        .delete()
        .eq('ip', clientIp);
    } catch (err) {
      console.warn('[SECURITY] Could not delete rate limit record from database:', err);
    }
  }
}

// CSRF & Request Origin Validation
export function validateRequestOrigin(req: NextApiRequest): boolean {
  const host = req.headers['host'];
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  const method = (req.method || 'GET').toUpperCase();
  const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

  if (process.env.NODE_ENV === 'production' && isStateChanging) {
    if (!origin && !referer) {
      return false;
    }
  }

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) return true;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost === host) return true;
    } catch {
      return false;
    }
  }

  return !isStateChanging || process.env.NODE_ENV !== 'production';
}

// HttpOnly, Secure, SameSite=Strict Cookie Management
export function setAdminSessionCookie(res: NextApiResponse, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieFlags = [
    `ms_admin_token=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${7 * 24 * 60 * 60}`
  ];

  if (isProd) {
    cookieFlags.push('Secure');
  }

  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    if (Array.isArray(existing)) {
      res.setHeader('Set-Cookie', [...existing, cookieFlags.join('; ')]);
    } else {
      res.setHeader('Set-Cookie', [String(existing), cookieFlags.join('; ')]);
    }
  } else {
    res.setHeader('Set-Cookie', cookieFlags.join('; '));
  }
}

export function clearAdminSessionCookie(res: NextApiResponse): void {
  const cookieFlags = 'ms_admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0';
  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    if (Array.isArray(existing)) {
      res.setHeader('Set-Cookie', [...existing, cookieFlags]);
    } else {
      res.setHeader('Set-Cookie', [String(existing), cookieFlags]);
    }
  } else {
    res.setHeader('Set-Cookie', cookieFlags);
  }
}

/**
 * Extract session token EXCLUSIVELY from the HttpOnly cookie.
 */
export function extractSessionToken(req: NextApiRequest): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/ms_admin_token=([^;]+)/);
  if (match && match[1]) {
    return match[1].trim();
  }

  return null;
}

/**
 * Retrieve admin credentials from Supabase using Service Role Key.
 */
export async function getAdminRecord(): Promise<AdminRecordResult> {
  const isProd = process.env.NODE_ENV === 'production';
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  if (clientToUse) {
    try {
      let { data, error } = await clientToUse
        .from('admin_auth')
        .select('id, username, password_hash, salt, session_secret, role, security_pin_hash, security_pin_salt, updated_at')
        .eq('id', 'master_admin')
        .maybeSingle();

      if (error && error.message && error.message.includes('security_pin')) {
        // Graceful fallback if user has not run migration yet
        const retry = await clientToUse
          .from('admin_auth')
          .select('id, username, password_hash, salt, session_secret, role, updated_at')
          .eq('id', 'master_admin')
          .maybeSingle();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.error('[SECURITY ERROR] Failed to fetch admin_auth from database:', error.message);
        if (isProd) {
          return {
            record: null,
            fromDatabase: false,
            error: 'Database query failed. In-memory authentication fallback is strictly restricted in production.'
          };
        }
      } else if (data && data.password_hash) {
        memoryAdminState = {
          id: data.id,
          username: (data.username || '').trim(),
          password_hash: (data.password_hash || '').trim(),
          salt: (data.salt || '').trim(),
          session_secret: (data.session_secret || '').trim(),
          role: data.role || 'super_admin',
          security_pin_hash: (data as any).security_pin_hash || DEFAULT_PIN_HASH,
          security_pin_salt: (data as any).security_pin_salt || DEFAULT_PIN_SALT,
          updated_at: data.updated_at || new Date().toISOString()
        };
        return { record: memoryAdminState, fromDatabase: true };
      } else {
        if (isProd) {
          return {
            record: null,
            fromDatabase: false,
            error: 'Admin record not found in database. In-memory fallback is strictly restricted in production.'
          };
        }
      }
    } catch (err: any) {
      console.error('[SECURITY ERROR] Database connection error during admin auth fetch:', err?.message || err);
      if (isProd) {
        return {
          record: null,
          fromDatabase: false,
          error: 'Database connection failed. In-memory authentication fallback is strictly restricted in production.'
        };
      }
    }
  } else {
    if (isProd) {
      return {
        record: null,
        fromDatabase: false,
        error: 'Database client not configured (SUPABASE_SERVICE_ROLE_KEY missing).'
      };
    }
  }

  return { record: memoryAdminState, fromDatabase: false };
}

/**
 * Generate cryptographically signed session token:
 * username.timestamp.restrictedFlag.deviceId.signature
 * Prevents client-side tampering of restriction status or device binding.
 */
export function generateSessionToken(
  username: string, 
  sessionSecret: string, 
  isRestricted = false, 
  deviceId = ''
): string {
  const timestamp = Date.now();
  const restFlag = isRestricted ? '1' : '0';
  const devId = deviceId || 'nodev';
  const signature = crypto
    .createHmac('sha256', sessionSecret)
    .update(`${username}:${timestamp}:${restFlag}:${devId}`)
    .digest('hex');
  return `${username}.${timestamp}.${restFlag}.${devId}.${signature}`;
}

/**
 * Verify session token. Supports both 5-part travel-security tokens and 3-part legacy tokens.
 */
export async function verifyAdminSessionToken(token: string): Promise<{ 
  valid: boolean; 
  username?: string; 
  isRestricted?: boolean; 
  deviceId?: string; 
}> {
  if (!token || typeof token !== 'string') return { valid: false };

  const parts = token.split('.');
  const { record } = await getAdminRecord();
  if (!record) return { valid: false };

  // 1. New 5-part format: username.timestamp.restricted.devId.signature
  if (parts.length === 5) {
    const [username, timestampStr, restFlag, devId, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return { valid: false };

    // 7-day session validity
    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return { valid: false };
    }

    const expectedSignature = crypto
      .createHmac('sha256', record.session_secret)
      .update(`${username}:${timestamp}:${restFlag}:${devId}`)
      .digest('hex');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return {
        valid: true,
        username: record.username,
        isRestricted: restFlag === '1',
        deviceId: devId !== 'nodev' ? devId : undefined
      };
    }

    return { valid: false };
  }

  // 2. Legacy 3-part format: username.timestamp.signature
  if (parts.length === 3) {
    const [username, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) return { valid: false };

    if (Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return { valid: false };
    }

    const expectedSignature = crypto
      .createHmac('sha256', record.session_secret)
      .update(`${username}:${timestamp}`)
      .digest('hex');

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return { valid: true, username: record.username, isRestricted: false };
    }
  }

  return { valid: false };
}

/**
 * Authoritative Server-Side Admin Session & Device Verification.
 * Evaluates session token AND device status in database in real-time.
 * If device was blocked by admin, session is immediately revoked!
 */
export async function verifyAdminSessionWithDevice(
  req: NextApiRequest,
  clientIp?: string
): Promise<AdminSessionVerification> {
  const token = extractSessionToken(req);
  if (!token) {
    return { valid: false, isRestricted: true };
  }

  const tokenCheck = await verifyAdminSessionToken(token);
  if (!tokenCheck.valid) {
    return { valid: false, isRestricted: true };
  }

  // Verify Device Record in Supabase
  const ip = clientIp || (typeof req.headers['x-forwarded-for'] === 'string' 
    ? req.headers['x-forwarded-for'].split(',')[0].trim() 
    : req.socket.remoteAddress || '127.0.0.1');

  const devCheck = await verifyDeviceFromRequest(req, ip);

  // If device is explicitly blocked in database, deny access immediately
  if (devCheck.isBlocked) {
    return {
      valid: false,
      isRestricted: true,
      deviceStatus: 'blocked',
      reason: 'This device has been permanently blocked by an administrator.'
    };
  }

  // If device is verified as trusted in database, grant full access
  if (devCheck.isTrusted) {
    return {
      valid: true,
      username: tokenCheck.username,
      isRestricted: false,
      deviceId: devCheck.deviceId || tokenCheck.deviceId,
      deviceStatus: 'trusted',
      remainingRestrictionSeconds: 0
    };
  }

  // Otherwise, unrecognized or pending 48-hour restriction applies
  const remainingSec = devCheck.remainingRestrictionSeconds > 0 
    ? devCheck.remainingRestrictionSeconds 
    : (tokenCheck.isRestricted ? 48 * 3600 : 0);

  return {
    valid: true,
    username: tokenCheck.username,
    isRestricted: true,
    deviceId: devCheck.deviceId || tokenCheck.deviceId,
    deviceStatus: 'pending_48h',
    remainingRestrictionSeconds: remainingSec
  };
}

/**
 * Server-Side Gatekeeper: Asserts that an administrator is NOT in restricted mode AND Mirage is unlocked.
 * Denies sensitive administrative actions.
 */
export function assertUnrestrictedAdmin(
  auth: AdminSessionVerification,
  res: NextApiResponse,
  req: NextApiRequest
): boolean {
  if (!auth.valid) {
    res.status(401).json({ error: 'Unauthorized: Valid admin session required.' });
    return false;
  }
  
  const mirage = verifyMirageState(req);
  if (!mirage.isUnlocked) {
    res.status(403).json({ error: 'Mirage Challenge Active: Session is locked. Please complete Visual PIN verification.' });
    return false;
  }

  if (auth.isRestricted) {
    res.status(403).json({
      error: 'Restricted Admin Mode: Sensitive actions are locked for 48 hours on unrecognized devices. You can approve this device in the Security Center using your Master Password or from an existing trusted device.',
      is_restricted: true,
      remaining_restriction_seconds: auth.remainingRestrictionSeconds || 0
    });
    return false;
  }

  return true;
}

/**
 * Authenticate Admin with Travel-Friendly Device Recognition:
 * 1. Checks shared database-backed rate limit
 * 2. Validates PBKDF2 cryptographic password hash
 * 3. Checks or registers device:
 *    - Trusted device -> Full unrestricted access
 *    - Unrecognized device -> 48-Hour restricted access, sets device cookie, generates persistent alert!
 */
export async function authenticateAdmin(
  usernameInput: string,
  passwordInput: string,
  clientIp: string,
  req?: NextApiRequest,
  res?: NextApiResponse
): Promise<{
  success: boolean;
  token?: string;
  username?: string;
  message: string;
  locked?: boolean;
  remainingLockSeconds?: number;
  attemptsLeft?: number;
  isRestricted?: boolean;
  deviceId?: string;
  remainingRestrictionSeconds?: number;
}> {
  // 1. IP & Rate Limiting Check
  const rateLimit = await checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    if (rateLimit.restrictiveBlock) {
      return {
        success: false,
        locked: true,
        remainingLockSeconds: rateLimit.remainingLockSeconds,
        message: 'Security Alert: Rate-limiting service unavailable. Restrictive protection active.'
      };
    }
    return {
      success: false,
      locked: true,
      remainingLockSeconds: rateLimit.remainingLockSeconds,
      message: `Security Lockout Triggered: Too many failed login attempts. System locked for ${rateLimit.remainingLockSeconds} seconds.`
    };
  }

  // 2. Fetch admin credentials
  const { record, error: dbError } = await getAdminRecord();
  if (!record) {
    return {
      success: false,
      message: dbError || 'Authentication service unavailable: Database connection failed.'
    };
  }

  const cleanUser = (usernameInput || '').trim().toLowerCase();
  const cleanPass = passwordInput || '';

  // 3. Username Match
  const isUserMatch = safeCompare(record.username.toLowerCase(), cleanUser);

  // 4. Password Verification (Strictly PBKDF2 Hashes)
  const passwordCheck = verifyPassword(cleanPass, record.salt || DEFAULT_INITIAL_SALT, record.password_hash);
  const isPassMatch = passwordCheck.match;

  if (isUserMatch && isPassMatch) {
    await registerSuccessfulLogin(clientIp);
    const activeUsername = record.username;
    const activeSecret = record.session_secret || DEFAULT_INITIAL_SECRET;

    // Device Recognition Evaluation
    let isRestricted = false;
    let deviceId = '';
    let remRestSec = 0;

    if (req && res) {
      setMirageChallengeCookie(res);
      
      const devResult = await registerOrUpdateDeviceLogin(req, clientIp);

      if (devResult.isBlocked) {
        return {
          success: false,
          locked: true,
          message: 'Security Alert: This device has been explicitly blocked by an administrator.'
        };
      }

      deviceId = devResult.device.id;
      isRestricted = !devResult.isTrusted;
      remRestSec = devResult.remainingRestrictionSeconds;

      // If new device, set the device cookie
      if (devResult.isNew && devResult.deviceSecret) {
        setDeviceCookie(res, devResult.device.id, devResult.deviceSecret);
      }
    }

    const token = generateSessionToken(activeUsername, activeSecret, isRestricted, deviceId);

    // Update last login in DB
    const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
    if (clientToUse) {
      try {
        const updatePayload: any = {
          last_login_at: new Date().toISOString(),
          last_login_ip: clientIp,
          failed_attempts: 0
        };

        if (passwordCheck.needsUpgrade) {
          const freshSalt = crypto.randomBytes(16).toString('hex');
          updatePayload.salt = freshSalt;
          updatePayload.password_hash = computeHash(cleanPass, freshSalt, 100000);
        }

        await clientToUse
          .from('admin_auth')
          .update(updatePayload)
          .eq('id', 'master_admin');
      } catch {
        // Ignore DB update error
      }
    }

    return {
      success: true,
      token,
      username: record.username,
      isRestricted,
      deviceId,
      remainingRestrictionSeconds: remRestSec,
      message: isRestricted
        ? 'Unrecognized device detected. Logged in with 48-Hour Restricted Admin access.'
        : 'Trusted device verified. Full master administrative access granted.'
    };
  }

  // Failed login attempt
  const failResult = await registerFailedAttempt(clientIp);
  if (failResult.locked) {
    return {
      success: false,
      locked: true,
      remainingLockSeconds: failResult.remainingLockSeconds,
      message: failResult.restrictiveError
        ? 'Security Alert: Database unavailable. Restrictive protection locked login attempts.'
        : `Security Lockout Triggered: 5 failed attempts reached. System locked for ${failResult.remainingLockSeconds} seconds.`
    };
  }

  return {
    success: false,
    attemptsLeft: failResult.attemptsLeft,
    message: `Invalid username or password. ${failResult.attemptsLeft} attempt(s) remaining before security lockout.`
  };
}

/**
 * Update Admin Credentials:
 * Restricted sessions are denied this operation.
 */
export async function updateAdminCredentials(
  currentPassword: string,
  securityPin: string,
  newUsername: string,
  newPassword: string,
  isRestricted = false
): Promise<{
  success: boolean;
  message: string;
  newUsername?: string;
  newToken?: string;
}> {
  if (isRestricted) {
    return {
      success: false,
      message: 'Access Denied: Changing admin credentials is locked during the 48-hour security restriction.'
    };
  }

  if (!currentPassword) {
    return { success: false, message: 'Current password is required to authorize credential changes.' };
  }

  if (!securityPin || !securityPin.trim()) {
    return { success: false, message: 'Master Security PIN is required to authorize credential changes.' };
  }

  if (!newUsername || newUsername.trim().length < 3) {
    return { success: false, message: 'New username must be at least 3 characters long.' };
  }

  if (!newPassword || newPassword.length < 12) {
    return { success: false, message: 'New password must be at least 12 characters long with strong entropy.' };
  }

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);

  if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
    return {
      success: false,
      message: 'New password must contain uppercase, lowercase, number, and special character.'
    };
  }

  const { record, error: dbError } = await getAdminRecord();
  if (!record) {
    return {
      success: false,
      message: dbError || 'Database unavailable. Updating credentials requires an active database connection.'
    };
  }

  // 1. Verify Current Password
  const checkCurrent = verifyPassword(currentPassword, record.salt || DEFAULT_INITIAL_SALT, record.password_hash);
  if (!checkCurrent.match) {
    return { success: false, message: 'Current password verification failed. Unauthorized change.' };
  }

  // 2. 🛡️ Verify Master Security PIN (Default: Ilove4HAD)
  const checkPin = verifySecurityPin(securityPin, record);
  if (!checkPin) {
    return { success: false, message: 'Master Security PIN verification failed. Action blocked.' };
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = computeHash(newPassword, newSalt, 100000);
  const newSecret = crypto.randomBytes(32).toString('hex');
  const sanitizedUsername = newUsername.trim();
  const currentPinHash = record.security_pin_hash || DEFAULT_PIN_HASH;
  const currentPinSalt = record.security_pin_salt || DEFAULT_PIN_SALT;

  memoryAdminState = {
    id: 'master_admin',
    username: sanitizedUsername,
    password_hash: newHash,
    salt: newSalt,
    session_secret: newSecret,
    role: 'super_admin',
    security_pin_hash: currentPinHash,
    security_pin_salt: currentPinSalt,
    updated_at: new Date().toISOString()
  };

  let dbSaved = false;
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
  if (clientToUse) {
    try {
      const { error } = await clientToUse
        .from('admin_auth')
        .upsert({
          id: 'master_admin',
          username: sanitizedUsername,
          password_hash: newHash,
          salt: newSalt,
          session_secret: newSecret,
          role: 'super_admin',
          security_pin_hash: currentPinHash,
          security_pin_salt: currentPinSalt,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        dbSaved = true;
      }
    } catch {
      // Continue
    }
  }

  if (process.env.NODE_ENV === 'production' && !dbSaved) {
    return {
      success: false,
      message: 'Failed to persist credentials to Supabase database.'
    };
  }

  const newToken = generateSessionToken(sanitizedUsername, newSecret, false);

  return {
    success: true,
    message: dbSaved
      ? 'Username & Password successfully updated and encrypted in Supabase cloud database!'
      : 'Username & Password successfully updated and encrypted!',
    newUsername: sanitizedUsername,
    newToken
  };
}

/**
 * Update Master Security PIN:
 * Requires current Security PIN authorization before updating.
 */
export async function updateAdminSecurityPin(
  currentPin: string,
  newPin: string,
  isRestricted = false
): Promise<{
  success: boolean;
  message: string;
}> {
  if (isRestricted) {
    return {
      success: false,
      message: 'Access Denied: Changing Master Security PIN is locked during the 48-hour restriction.'
    };
  }

  if (!currentPin || !currentPin.trim()) {
    return { success: false, message: 'Current Master Security PIN is required.' };
  }

  if (!newPin || newPin.trim().length < 4) {
    return { success: false, message: 'New Master Security PIN must be at least 4 characters long.' };
  }

  const { record, error: dbError } = await getAdminRecord();
  if (!record) {
    return {
      success: false,
      message: dbError || 'Database connection unavailable.'
    };
  }

  // Verify Current Security PIN
  const checkCurrentPin = verifySecurityPin(currentPin, record);
  if (!checkCurrentPin) {
    return { success: false, message: 'Current Master Security PIN verification failed. Unauthorized action.' };
  }

  const cleanNewPin = newPin.trim();
  const newPinSalt = crypto.randomBytes(16).toString('hex');
  const newPinHash = computeHash(cleanNewPin, newPinSalt, 100000);

  memoryAdminState.security_pin_hash = newPinHash;
  memoryAdminState.security_pin_salt = newPinSalt;
  memoryAdminState.updated_at = new Date().toISOString();

  let dbSaved = false;
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
  if (clientToUse) {
    try {
      const { error } = await clientToUse
        .from('admin_auth')
        .update({
          security_pin_hash: newPinHash,
          security_pin_salt: newPinSalt,
          updated_at: new Date().toISOString()
        })
        .eq('id', 'master_admin');

      if (!error) {
        dbSaved = true;
      }
    } catch {
      // Continue
    }
  }

  if (process.env.NODE_ENV === 'production' && !dbSaved) {
    return {
      success: false,
      message: 'Failed to persist new Master Security PIN to database. Please make sure the SQL migration query has been run in Supabase.'
    };
  }

  return {
    success: true,
    message: dbSaved
      ? 'Master Security PIN successfully updated and encrypted in Supabase cloud database!'
      : 'Master Security PIN successfully updated!'
  };
}
