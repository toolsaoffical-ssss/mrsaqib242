import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseServer';
import { supabase, isSupabaseConfigured } from './supabase';

export interface AdminCredentialRecord {
  id: string;
  username: string;
  password_hash: string;
  salt: string;
  session_secret: string;
  role: string;
  updated_at: string;
}

export interface AdminRecordResult {
  record: AdminCredentialRecord | null;
  fromDatabase: boolean;
  error?: string;
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

  // 1. Check 100,000 iterations (standard hardened PBKDF2)
  const hash100k = computeHash(inputPassword, salt, 100000);
  if (safeCompare(hash100k, storedHash)) {
    return { match: true, needsUpgrade: false };
  }

  // 2. Check 10,000 iterations (legacy PBKDF2 hash, triggers upgrade to 100k)
  const hash10k = computeHash(inputPassword, salt, 10000);
  if (safeCompare(hash10k, storedHash)) {
    return { match: true, needsUpgrade: true };
  }

  // Plaintext comparison is strictly disallowed
  return { match: false, needsUpgrade: false };
}

// In-memory runtime store fallback (ONLY active in development mode when DB is unavailable)
let memoryAdminState: AdminCredentialRecord = {
  id: 'master_admin',
  username: ENV_ADMIN_USERNAME,
  password_hash: process.env.ADMIN_PASSWORD_HASH || (ENV_ADMIN_PASSWORD ? computeHash(ENV_ADMIN_PASSWORD, DEFAULT_INITIAL_SALT, 100000) : crypto.randomBytes(32).toString('hex')),
  salt: DEFAULT_INITIAL_SALT,
  session_secret: DEFAULT_INITIAL_SECRET,
  role: 'super_admin',
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
        // Restrictive Protection: On database error in production, do not fail-open!
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
      // Restrictive Protection: In production, database failure restricts access
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

  // If memory had an expired lock, clean it up
  if (memRecord && memRecord.lockedUntil > 0 && memRecord.lockedUntil <= now) {
    rateLimitMap.delete(clientIp);
  }

  return { allowed: true };
}

/**
 * Registers a failed login attempt for a client IP.
 * Uses an ATOMIC database operation (PostgreSQL stored function or atomic upsert)
 * to prevent race conditions during simultaneous concurrent requests.
 * RESTRICTIVE PROTECTION: On database failure, locks access rather than failing open.
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

  // 1. In-memory update for fast local tracking (Node event loop ensures local atomicity)
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

  // 2. ATOMIC DATABASE OPERATION (Cross-instance Vercel synchronization)
  if (clientToUse) {
    try {
      // Execute atomic PostgreSQL RPC function (handles row-level lock and concurrency)
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

        // Keep local memory shield in sync with database atomic state
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

      // Fallback: If RPC is not created yet, execute direct database upsert
      if (rpcError) {
        console.warn('[SECURITY] record_failed_login_attempt RPC unavailable, using fallback:', rpcError.message);
        
        const { data: existing } = await clientToUse
          .from('admin_rate_limits')
          .select('failed_attempts, locked_until')
          .eq('ip', clientIp)
          .maybeSingle();

        let dbAttempts = 1;
        if (existing) {
          const existingLockTime = existing.locked_until ? new Date(existing.locked_until).getTime() : 0;
          if (existingLockTime > 0 && existingLockTime <= now) {
            dbAttempts = 1;
          } else {
            dbAttempts = (existing.failed_attempts || 0) + 1;
          }
        }

        const isLocked = dbAttempts >= MAX_ATTEMPTS;
        const lockedUntilIso = isLocked ? new Date(now + LOCK_DURATION_MS).toISOString() : null;

        await clientToUse
          .from('admin_rate_limits')
          .upsert({
            ip: clientIp,
            failed_attempts: dbAttempts,
            locked_until: lockedUntilIso,
            last_attempt_at: new Date(now).toISOString(),
            updated_at: new Date(now).toISOString()
          });

        if (isLocked) {
          return {
            locked: true,
            remainingLockSeconds: Math.ceil(LOCK_DURATION_MS / 1000),
            attemptsLeft: 0
          };
        }

        return {
          locked: false,
          attemptsLeft: Math.max(0, MAX_ATTEMPTS - dbAttempts)
        };
      }
    } catch (err: any) {
      console.error('[SECURITY ERROR] Failed to record attempt in database:', err?.message || err);
      // RESTRICTIVE PROTECTION: On database error in production, do NOT fail-open!
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
  } else if (isProd) {
    // Missing database client in production -> restrictive protection
    memRecord.lockedUntil = now + LOCK_DURATION_MS;
    rateLimitMap.set(clientIp, memRecord);
    return {
      locked: true,
      remainingLockSeconds: Math.ceil(LOCK_DURATION_MS / 1000),
      attemptsLeft: 0,
      restrictiveError: true
    };
  }

  // Memory fallback return for non-production
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
  // Clear memory
  rateLimitMap.delete(clientIp);

  // Clear shared database rate limit record across Vercel instances
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

  // In production, reject state-changing requests that have NO origin and NO referer (blind CSRF prevention)
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

  res.setHeader('Set-Cookie', cookieFlags.join('; '));
}

export function clearAdminSessionCookie(res: NextApiResponse): void {
  res.setHeader(
    'Set-Cookie',
    'ms_admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
  );
}

// Extract session token from cookie, Authorization header, or body
export function extractSessionToken(req: NextApiRequest): string | null {
  // 1. From HttpOnly Cookie (most secure)
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/ms_admin_token=([^;]+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // 2. From Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 3. From request body
  if (req.body && typeof req.body.token === 'string') {
    return req.body.token.trim();
  }

  return null;
}

/**
 * Retrieve admin credentials from Supabase using Service Role Key (bypasses anon RLS).
 * CRITICAL SECURITY: In production, in-memory credential fallback is strictly restricted
 * if the database connection fails or is unavailable.
 */
export async function getAdminRecord(): Promise<AdminRecordResult> {
  const isProd = process.env.NODE_ENV === 'production';
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  if (clientToUse) {
    try {
      const { data, error } = await clientToUse
        .from('admin_auth')
        .select('id, username, password_hash, salt, session_secret, role, updated_at')
        .eq('id', 'master_admin')
        .maybeSingle();

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
          username: data.username,
          password_hash: data.password_hash,
          salt: data.salt,
          session_secret: data.session_secret,
          role: data.role || 'super_admin',
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
        error: 'Database client not configured (SUPABASE_SERVICE_ROLE_KEY missing). In-memory fallback is strictly restricted in production.'
      };
    }
  }

  // Development environment only fallback:
  console.warn('[DEV SECURITY WARNING] Supabase database unavailable. Falling back to in-memory admin credentials for development only.');
  return { record: memoryAdminState, fromDatabase: false };
}

// Generate secure session token
export function generateSessionToken(username: string, sessionSecret: string): string {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', sessionSecret)
    .update(`${username}:${timestamp}`)
    .digest('hex');
  return `${username}.${timestamp}.${signature}`;
}

// Verify session token
export async function verifyAdminSessionToken(token: string): Promise<{ valid: boolean; username?: string }> {
  if (!token || typeof token !== 'string') return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false };

  const [username, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return { valid: false };

  // Session valid for 7 days
  const MAX_SESSION_AGE = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > MAX_SESSION_AGE) {
    return { valid: false };
  }

  const { record } = await getAdminRecord();
  if (!record) {
    return { valid: false };
  }

  const expectedSignature = crypto
    .createHmac('sha256', record.session_secret)
    .update(`${username}:${timestamp}`)
    .digest('hex');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: true, username: record.username };
  }

  return { valid: false };
}

/**
 * Authenticate Admin:
 * 1. Checks shared database-backed rate limit with restrictive fail-closed protection
 * 2. Fetches credentials from database (strictly disables memory fallback in production)
 * 3. Compares username and PBKDF2 cryptographic password hash (plaintext rejected)
 * 4. Token is generated and set ONLY in HttpOnly cookie, never exposed in JSON response!
 */
export async function authenticateAdmin(
  usernameInput: string,
  passwordInput: string,
  clientIp: string
): Promise<{
  success: boolean;
  token?: string;
  username?: string;
  message: string;
  locked?: boolean;
  remainingLockSeconds?: number;
  attemptsLeft?: number;
}> {
  // 1. IP & Rate Limiting Check (Atomic & Restrictive Protection across Vercel instances)
  const rateLimit = await checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    if (rateLimit.restrictiveBlock) {
      return {
        success: false,
        locked: true,
        remainingLockSeconds: rateLimit.remainingLockSeconds,
        message: 'Security Alert: Database rate-limiting service unavailable. Restrictive protection active: login requests are temporarily restricted for defense against brute-force attacks.'
      };
    }
    return {
      success: false,
      locked: true,
      remainingLockSeconds: rateLimit.remainingLockSeconds,
      message: `Security Lockout Triggered: Too many failed login attempts. System locked for ${rateLimit.remainingLockSeconds} seconds.`
    };
  }

  // 2. Fetch admin credentials (Strictly restricted in production if database is unavailable)
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
  const isUserMatch = safeCompare(record.username.toLowerCase(), cleanUser) || 
                      safeCompare(cleanUser, ENV_ADMIN_USERNAME);

  // 4. Password Verification (Strictly PBKDF2 Cryptographic Hashes - Plaintext NEVER accepted)
  const passwordCheck = verifyPassword(cleanPass, record.salt || DEFAULT_INITIAL_SALT, record.password_hash);
  let isPassMatch = passwordCheck.match;

  // 5. Environment override (hashed with salt, timing-safe compare)
  if (!isPassMatch && process.env.ADMIN_PASSWORD) {
    const envHash = computeHash(process.env.ADMIN_PASSWORD, record.salt || DEFAULT_INITIAL_SALT, 100000);
    const inputHash = computeHash(cleanPass, record.salt || DEFAULT_INITIAL_SALT, 100000);
    if (safeCompare(inputHash, envHash)) {
      isPassMatch = true;
    }
  }

  if (isUserMatch && isPassMatch) {
    await registerSuccessfulLogin(clientIp);
    const activeUsername = record.username || ENV_ADMIN_USERNAME || 'saqib';
    const activeSecret = record.session_secret || DEFAULT_INITIAL_SECRET;
    const token = generateSessionToken(activeUsername, activeSecret);

    // Update last login in DB if configured via Service Role
    const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
    if (clientToUse) {
      try {
        const updatePayload: any = {
          last_login_at: new Date().toISOString(),
          last_login_ip: clientIp,
          failed_attempts: 0
        };

        // If legacy 10k hash was used, auto-upgrade to 100k salted hash!
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
      message: 'Authentication successful. Access granted.'
    };
  }

  // Failed login attempt: Register atomically in shared database across Vercel instances
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
 * Requires current password verification using timing-safe PBKDF2 hash.
 * Encrypts new credentials with 100k iterations PBKDF2 and updates database.
 */
export async function updateAdminCredentials(
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
  newUsername?: string;
  newToken?: string;
}> {
  if (!currentPassword) {
    return { success: false, message: 'Current password is required to authorize credential changes.' };
  }

  if (!newUsername || newUsername.trim().length < 3) {
    return { success: false, message: 'New username must be at least 3 characters long.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: 'New password must be at least 6 characters long with strong entropy.' };
  }

  const { record, error: dbError } = await getAdminRecord();
  if (!record) {
    return {
      success: false,
      message: dbError || 'Database unavailable. Updating credentials requires an active database connection.'
    };
  }

  // Verify current password strictly using timing-safe PBKDF2 hash comparison
  const checkCurrent = verifyPassword(currentPassword, record.salt || DEFAULT_INITIAL_SALT, record.password_hash);
  let isCurrentValid = checkCurrent.match;
  if (!isCurrentValid && ENV_ADMIN_PASSWORD) {
    const envHash = computeHash(ENV_ADMIN_PASSWORD, record.salt || DEFAULT_INITIAL_SALT, 100000);
    const inputHash = computeHash(currentPassword, record.salt || DEFAULT_INITIAL_SALT, 100000);
    isCurrentValid = safeCompare(inputHash, envHash);
  }

  if (!isCurrentValid) {
    return { success: false, message: 'Current password verification failed. Unauthorized change.' };
  }

  // Generate fresh cryptographic salt & hash for the new password (100k iterations)
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = computeHash(newPassword, newSalt, 100000);
  const newSecret = crypto.randomBytes(32).toString('hex');
  const sanitizedUsername = newUsername.trim();

  // Update in-memory fallback
  memoryAdminState = {
    id: 'master_admin',
    username: sanitizedUsername,
    password_hash: newHash,
    salt: newSalt,
    session_secret: newSecret,
    role: 'super_admin',
    updated_at: new Date().toISOString()
  };

  // Persist to Supabase with Service Role Key
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
          updated_at: new Date().toISOString()
        });

      if (!error) {
        dbSaved = true;
      }
    } catch {
      // Continue with in-memory persistence
    }
  }

  // In production, require database persistence!
  if (process.env.NODE_ENV === 'production' && !dbSaved) {
    return {
      success: false,
      message: 'Failed to persist credentials to Supabase database. Changes not saved in production.'
    };
  }

  // Generate new session token with new secret
  const newToken = generateSessionToken(sanitizedUsername, newSecret);

  return {
    success: true,
    message: dbSaved
      ? 'Username & Password successfully updated and encrypted in Supabase cloud database!'
      : 'Username & Password successfully updated and encrypted in backend memory! (Run the Supabase SQL script to persist permanently in Cloud).',
    newUsername: sanitizedUsername,
    newToken
  };
}

// Supabase SQL initialization script specifically for the admin_auth & admin_rate_limits tables
export const ADMIN_AUTH_SQL_SCRIPT = `-- =========================================================================
-- 🛡️ SAQIB PORTFOLIO: MASTER ADMIN AUTH & SECURITY SHIELD TABLES
-- Execute in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.admin_auth (
    id TEXT PRIMARY KEY DEFAULT 'master_admin',
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    session_secret TEXT NOT NULL,
    role TEXT DEFAULT 'super_admin',
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_login_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared login rate limits across all Vercel serverless instances
CREATE TABLE IF NOT EXISTS public.admin_rate_limits (
    ip TEXT PRIMARY KEY,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial master admin credentials (Username from env, Password from env)
INSERT INTO public.admin_auth (
    id, 
    username, 
    password_hash, 
    salt, 
    session_secret, 
    role
)
VALUES (
    'master_admin',
    '${ENV_ADMIN_USERNAME}',
    '${memoryAdminState.password_hash}',
    '${DEFAULT_INITIAL_SALT}',
    '${DEFAULT_INITIAL_SECRET}',
    'super_admin'
)
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    role = EXCLUDED.role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_rate_limits ENABLE ROW LEVEL SECURITY;

-- 🛡️ SECURITY SHIELD: Strictly deny public anonymous access to both tables!
-- Supabase Service Role Key automatically bypasses RLS safely on the server.
DROP POLICY IF EXISTS "Public backend auth access" ON public.admin_auth;
DROP POLICY IF EXISTS "Public admin_auth access" ON public.admin_auth;
DROP POLICY IF EXISTS "Deny anonymous access to admin_auth" ON public.admin_auth;
CREATE POLICY "Deny anonymous access to admin_auth" 
ON public.admin_auth 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny anonymous access to admin_rate_limits" ON public.admin_rate_limits;
CREATE POLICY "Deny anonymous access to admin_rate_limits" 
ON public.admin_rate_limits 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- Auto-update updated_at timestamp trigger for admin_auth
CREATE OR REPLACE FUNCTION update_admin_auth_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_admin_auth ON public.admin_auth;
CREATE TRIGGER trg_update_admin_auth
BEFORE UPDATE ON public.admin_auth
FOR EACH ROW
EXECUTE FUNCTION update_admin_auth_timestamp();

-- =========================================================================
-- 🛡️ ATOMIC RATE LIMIT FUNCTION (Prevents race conditions in concurrent requests)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.record_failed_login_attempt(
    p_ip TEXT,
    p_max_attempts INT DEFAULT 5,
    p_lock_duration_seconds INT DEFAULT 60
)
RETURNS TABLE (
    locked BOOLEAN,
    remaining_lock_seconds INT,
    attempts_left INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_now TIMESTAMPTZ := NOW();
    v_locked_until TIMESTAMPTZ;
    v_failed_attempts INT;
    v_rem_sec INT := 0;
BEGIN
    INSERT INTO public.admin_rate_limits (
        ip,
        failed_attempts,
        locked_until,
        last_attempt_at,
        created_at,
        updated_at
    )
    VALUES (
        p_ip,
        1,
        NULL,
        v_now,
        v_now,
        v_now
    )
    ON CONFLICT (ip) DO UPDATE SET
        failed_attempts = CASE
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until > v_now THEN admin_rate_limits.failed_attempts + 1
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until <= v_now THEN 1
            ELSE admin_rate_limits.failed_attempts + 1
        END,
        locked_until = CASE
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until > v_now THEN admin_rate_limits.locked_until
            WHEN (CASE 
                    WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until <= v_now THEN 1 
                    ELSE admin_rate_limits.failed_attempts + 1 
                  END) >= p_max_attempts THEN v_now + (p_lock_duration_seconds || ' seconds')::INTERVAL
            ELSE NULL
        END,
        last_attempt_at = v_now,
        updated_at = v_now
    RETURNING admin_rate_limits.failed_attempts, admin_rate_limits.locked_until
    INTO v_failed_attempts, v_locked_until;

    IF v_locked_until IS NOT NULL AND v_locked_until > v_now THEN
        v_rem_sec := CEIL(EXTRACT(EPOCH FROM (v_locked_until - v_now)));
        RETURN QUERY SELECT TRUE, v_rem_sec, 0;
    ELSE
        RETURN QUERY SELECT FALSE, 0, GREATEST(0, p_max_attempts - v_failed_attempts);
    END IF;
END;
$$;
`;
