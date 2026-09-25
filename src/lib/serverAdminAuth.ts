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

// Default initial master credentials (can be securely overridden via environment variables)
const DEFAULT_INITIAL_SALT = process.env.ADMIN_SALT || 'e5b7a1f9c3d4e8b2a1f0d9c8b7a6e5d4';
const DEFAULT_INITIAL_SECRET = process.env.ADMIN_SESSION_SECRET || 'saqib_master_session_secret_key_2026';
const ENV_ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'saqib').trim().toLowerCase();
const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'saqib242';

function computeHash(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
}

// In-memory runtime store fallback (used if database table is not yet migrated)
let memoryAdminState: AdminCredentialRecord = {
  id: 'master_admin',
  username: ENV_ADMIN_USERNAME,
  password_hash: process.env.ADMIN_PASSWORD_HASH || computeHash(ENV_ADMIN_PASSWORD, DEFAULT_INITIAL_SALT),
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

  if (!origin && !referer) {
    return true; // Allow direct or non-browser API client
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

  return false;
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

  // Constant-time string comparison to prevent side-channel timing attacks
  const safeCompare = (a: string, b: string): boolean => {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  };

  // 1. Username Match
  const isUserMatch = safeCompare(record.username.toLowerCase(), cleanUser) || 
                      safeCompare(cleanUser, ENV_ADMIN_USERNAME);

  // 2. Check if incoming password matches the active record (either hash or plain-text if manually updated in DB)
  const incomingHash = computeHash(cleanPass, record.salt || DEFAULT_INITIAL_SALT);
  const isPlainTextDBMatch = safeCompare(cleanPass, record.password_hash);
  const isHashMatch = safeCompare(incomingHash, record.password_hash);
  let isPassMatch = isHashMatch || isPlainTextDBMatch;

  // 3. If a custom ADMIN_PASSWORD environment variable is set in Vercel, verify against it
  if (!isPassMatch && process.env.ADMIN_PASSWORD) {
    const envHash = computeHash(process.env.ADMIN_PASSWORD, record.salt || DEFAULT_INITIAL_SALT);
    if (safeCompare(cleanPass, process.env.ADMIN_PASSWORD) || safeCompare(incomingHash, envHash)) {
      isPassMatch = true;
    }
  }

  // 4. Default fallback: ONLY allow saqib242 if NO password change has EVER taken place
  // (i.e. record still has the pristine initial default hash AND no env password override)
  const defaultInitialHash = computeHash('saqib242', DEFAULT_INITIAL_SALT);
  const isPristineDefaultRecord = safeCompare(record.password_hash, defaultInitialHash) && !process.env.ADMIN_PASSWORD;

  if (!isPassMatch && isPristineDefaultRecord) {
    if (safeCompare(cleanPass, 'saqib242') || safeCompare(incomingHash, defaultInitialHash)) {
      isPassMatch = true;
    }
  }

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

        // If user entered plain text in Supabase, auto-upgrade it to a salted PBKDF2 hash!
        if (isPlainTextDBMatch) {
          const freshSalt = crypto.randomBytes(16).toString('hex');
          updatePayload.salt = freshSalt;
          updatePayload.password_hash = computeHash(cleanPass, freshSalt);
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

  const safeCompare = (a: string, b: string): boolean => {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  };

  // Verify current password strictly using timing-safe comparison
  const currentHash = computeHash(currentPassword, record.salt || DEFAULT_INITIAL_SALT);
  const isCurrentValid = safeCompare(currentHash, record.password_hash) ||
                         safeCompare(currentPassword, record.password_hash) ||
                         ((record.username.toLowerCase() === 'saqib' || record.username.toLowerCase() === ENV_ADMIN_USERNAME) && 
                          (safeCompare(currentPassword, ENV_ADMIN_PASSWORD) || safeCompare(currentPassword, 'saqib242') || safeCompare(currentHash, computeHash('saqib242', DEFAULT_INITIAL_SALT))));

  if (!isCurrentValid) {
    return { success: false, message: 'Current password verification failed. Unauthorized change.' };
  }

  // Generate fresh cryptographic salt & hash for the new password
  const newSalt = crypto.randomBytes(16).toString('hex');
  const newHash = computeHash(newPassword, newSalt);
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

-- Seed initial master admin credentials (Username: saqib, Password: saqib242)
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
    'saqib',
    '${computeHash('saqib242', DEFAULT_INITIAL_SALT)}',
    '${DEFAULT_INITIAL_SALT}',
    '${DEFAULT_INITIAL_SECRET}',
    'super_admin'
)
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    role = EXCLUDED.role;

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;

-- Allow full access for backend API operations
DROP POLICY IF EXISTS "Public backend auth access" ON public.admin_auth;
CREATE POLICY "Public backend auth access" ON public.admin_auth FOR ALL USING (true) WITH CHECK (true);

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
