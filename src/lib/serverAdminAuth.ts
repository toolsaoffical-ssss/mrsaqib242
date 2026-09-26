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

// Securely require environment variables, generate strong secrets if missing in memory
const DEFAULT_INITIAL_SALT = process.env.ADMIN_SALT || crypto.randomBytes(16).toString('hex');
const DEFAULT_INITIAL_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const ENV_ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Remove hardcoded fallback

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

export function verifyPassword(inputPassword: string, salt: string, storedHash: string): { match: boolean; needsUpgrade: boolean } {
  if (!inputPassword || !storedHash) return { match: false, needsUpgrade: false };

  // 1. Check 100,000 iterations (standard hardened PBKDF2)
  const hash100k = computeHash(inputPassword, salt, 100000);
  if (safeCompare(hash100k, storedHash)) {
    return { match: true, needsUpgrade: false };
  }

  // 2. Check 10,000 iterations (legacy fallback so existing passwords never break)
  const hash10k = computeHash(inputPassword, salt, 10000);
  if (safeCompare(hash10k, storedHash)) {
    return { match: true, needsUpgrade: true };
  }

  // 3. Check plain text (if password was manually updated directly in Supabase table)
  if (safeCompare(inputPassword, storedHash)) {
    return { match: true, needsUpgrade: true };
  }

  return { match: false, needsUpgrade: false };
}

// In-memory runtime store fallback (used if database table is not yet migrated)
let memoryAdminState: AdminCredentialRecord = {
  id: 'master_admin',
  username: ENV_ADMIN_USERNAME,
  password_hash: process.env.ADMIN_PASSWORD_HASH || (ENV_ADMIN_PASSWORD ? computeHash(ENV_ADMIN_PASSWORD, DEFAULT_INITIAL_SALT, 100000) : crypto.randomBytes(32).toString('hex')),
  salt: DEFAULT_INITIAL_SALT,
  session_secret: DEFAULT_INITIAL_SECRET,
  role: 'super_admin',
  updated_at: new Date().toISOString()
};

// Rate limiter / brute force shield: IP -> { failedAttempts, lockedUntil }
const rateLimitMap = new Map<string, { failedAttempts: number; lockedUntil: number }>();

export function checkRateLimit(clientIp: string): { allowed: boolean; remainingLockSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp);
  if (!record) return { allowed: true };

  if (record.lockedUntil > now) {
    const remainingSec = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingLockSeconds: remainingSec };
  }

  // If lock expired, reset
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    rateLimitMap.delete(clientIp);
  }

  return { allowed: true };
}

export function registerFailedAttempt(clientIp: string): { locked: boolean; remainingLockSeconds?: number; attemptsLeft: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIp) || { failedAttempts: 0, lockedUntil: 0 };
  record.failedAttempts += 1;

  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION_MS = 60 * 1000; // 60 seconds lockout (1 minute)

  if (record.failedAttempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCK_DURATION_MS;
    rateLimitMap.set(clientIp, record);
    return { locked: true, remainingLockSeconds: Math.ceil(LOCK_DURATION_MS / 1000), attemptsLeft: 0 };
  }

  rateLimitMap.set(clientIp, record);
  return { locked: false, attemptsLeft: MAX_ATTEMPTS - record.failedAttempts };
}

export function registerSuccessfulLogin(clientIp: string): void {
  rateLimitMap.delete(clientIp);
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

// Retrieve admin credentials from Supabase using Service Role Key (bypasses anon RLS) or fallback
export async function getAdminRecord(): Promise<AdminCredentialRecord> {
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  if (clientToUse) {
    try {
      const { data, error } = await clientToUse
        .from('admin_auth')
        .select('id, username, password_hash, salt, session_secret, role, updated_at')
        .eq('id', 'master_admin')
        .maybeSingle();

      if (!error && data && data.password_hash) {
        // Update memory cache
        memoryAdminState = {
          id: data.id,
          username: data.username,
          password_hash: data.password_hash,
          salt: data.salt,
          session_secret: data.session_secret,
          role: data.role || 'super_admin',
          updated_at: data.updated_at || new Date().toISOString()
        };
        return memoryAdminState;
      }
    } catch {
      // Fallback to memoryAdminState
    }
  }
  return memoryAdminState;
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

  const record = await getAdminRecord();

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

// Authenticate Admin (Check username & password OR legacy master PIN)
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
  const record = await getAdminRecord();

  const cleanUser = (usernameInput || '').trim().toLowerCase();
  const cleanPass = passwordInput || '';

  // 1. Username Match
  const isUserMatch = safeCompare(record.username.toLowerCase(), cleanUser) || 
                      safeCompare(cleanUser, ENV_ADMIN_USERNAME);

  // 2. Check if incoming password matches active record (100k iterations, 10k legacy, or plain-text)
  const passwordCheck = verifyPassword(cleanPass, record.salt || DEFAULT_INITIAL_SALT, record.password_hash);
  const isPlainTextDBMatch = safeCompare(cleanPass, record.password_hash);
  let isPassMatch = passwordCheck.match;

  // 3. If a custom ADMIN_PASSWORD environment variable is set in Vercel, verify against it
  if (!isPassMatch && process.env.ADMIN_PASSWORD) {
    if (safeCompare(cleanPass, process.env.ADMIN_PASSWORD)) {
      isPassMatch = true;
    } else {
      const envCheck = verifyPassword(cleanPass, record.salt || DEFAULT_INITIAL_SALT, computeHash(process.env.ADMIN_PASSWORD, record.salt || DEFAULT_INITIAL_SALT, 100000));
      if (envCheck.match) {
        isPassMatch = true;
      }
    }
  }

  // Removed hardcoded fallback password check
  if (isUserMatch && isPassMatch) {
    registerSuccessfulLogin(clientIp);
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

        // If legacy 10k hash or plain text was detected, auto-upgrade to 100k salted hash!
        if (passwordCheck.needsUpgrade || isPlainTextDBMatch) {
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

  // Failed login attempt
  const failResult = registerFailedAttempt(clientIp);
  if (failResult.locked) {
    return {
      success: false,
      locked: true,
      remainingLockSeconds: failResult.remainingLockSeconds,
      message: `Security Lockout Triggered: 5 failed attempts reached. System locked for ${failResult.remainingLockSeconds} seconds.`
    };
  }

  return {
    success: false,
    attemptsLeft: failResult.attemptsLeft,
    message: `Invalid username or password. ${failResult.attemptsLeft} attempt(s) remaining before security lockout.`
  };
}

// Change Credentials (Requires current password verification)
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

  const record = await getAdminRecord();

  // Verify current password strictly using timing-safe comparison
  const checkCurrent = verifyPassword(currentPassword, record.salt || DEFAULT_INITIAL_SALT, record.password_hash);
  const isCurrentValid = checkCurrent.match ||
                         (ENV_ADMIN_PASSWORD && safeCompare(currentPassword, ENV_ADMIN_PASSWORD));

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

// Supabase SQL initialization script specifically for the admin_auth table
export const ADMIN_AUTH_SQL_SCRIPT = `-- =========================================================================
-- 🛡️ SAQIB PORTFOLIO: MASTER ADMIN AUTH & SECURITY SHIELD TABLE
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

-- 🛡️ SECURITY SHIELD: Completely deny all public anonymous access!
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

-- Auto-update updated_at timestamp trigger
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
`;
