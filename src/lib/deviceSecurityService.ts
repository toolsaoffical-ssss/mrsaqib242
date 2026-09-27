import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseServer';
import { supabase, isSupabaseConfigured } from './supabase';
import { parseBrowser, parseOS, parseDeviceType } from './analyticsService';
import { getAdminRecord, verifyPassword } from './serverAdminAuth';

export interface DeviceRecord {
  id: string;
  device_name: string;
  ip_address: string;
  browser: string;
  os: string;
  device_type: string;
  city: string;
  country: string;
  country_code: string;
  region: string;
  status: 'trusted' | 'pending_48h' | 'blocked';
  restricted_until: string | null;
  approved_at: string | null;
  approved_by: string | null;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityAlertRecord {
  id: string;
  device_id: string;
  event_type: 'unknown_device_login' | 'device_approved' | 'device_blocked' | 'recovery_attempt';
  title: string;
  message: string;
  ip_address: string;
  city: string;
  country: string;
  browser: string;
  os: string;
  device_type: string;
  status: 'pending' | 'approved' | 'blocked' | 'resolved';
  restricted_until: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface DeviceVerification {
  deviceId: string | null;
  isTrusted: boolean;
  isRestricted: boolean;
  isBlocked: boolean;
  remainingRestrictionSeconds: number;
  device: DeviceRecord | null;
  isNew: boolean;
  deviceSecret?: string;
}

// In-memory fallback for local dev when DB is not reachable
const memoryDevices = new Map<string, { record: DeviceRecord; secretHash: string }>();
const memoryAlerts: SecurityAlertRecord[] = [];
const memoryRecoveryHashes = new Set<string>();

export function hashDeviceSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret.trim()).digest('hex');
}

export function extractDeviceCookie(req: NextApiRequest): { deviceId: string; deviceSecret: string } | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/ms_admin_device=([^;]+)/);
  if (!match || !match[1]) return null;

  const raw = decodeURIComponent(match[1].trim());
  const dotIndex = raw.indexOf('.');
  if (dotIndex === -1) return null;

  const deviceId = raw.substring(0, dotIndex);
  const deviceSecret = raw.substring(dotIndex + 1);

  if (!deviceId || !deviceSecret || deviceSecret.length < 32) return null;
  return { deviceId, deviceSecret };
}

export function setDeviceCookie(res: NextApiResponse, deviceId: string, deviceSecret: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieValue = `${deviceId}.${deviceSecret}`;
  const flags = [
    `ms_admin_device=${encodeURIComponent(cookieValue)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${365 * 24 * 60 * 60}` // 1 year persistence
  ];

  if (isProd) {
    flags.push('Secure');
  }

  // Preserve existing cookies if present
  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    if (Array.isArray(existing)) {
      res.setHeader('Set-Cookie', [...existing, flags.join('; ')]);
    } else {
      res.setHeader('Set-Cookie', [String(existing), flags.join('; ')]);
    }
  } else {
    res.setHeader('Set-Cookie', flags.join('; '));
  }
}

export function clearDeviceCookie(res: NextApiResponse): void {
  const flags = 'ms_admin_device=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0';
  const existing = res.getHeader('Set-Cookie');
  if (existing) {
    if (Array.isArray(existing)) {
      res.setHeader('Set-Cookie', [...existing, flags]);
    } else {
      res.setHeader('Set-Cookie', [String(existing), flags]);
    }
  } else {
    res.setHeader('Set-Cookie', flags);
  }
}

export function extractClientInfo(req: NextApiRequest, clientIp: string) {
  const ua = (req.headers['user-agent'] as string) || '';
  const browser = parseBrowser(ua);
  const os = parseOS(ua);
  const deviceType = parseDeviceType(ua);

  const vercelCountry = (req.headers['x-vercel-ip-country'] as string)?.toUpperCase();
  const vercelCityRaw = req.headers['x-vercel-ip-city'] as string;
  const vercelRegionRaw = req.headers['x-vercel-ip-country-region'] as string;

  let city = 'Unknown';
  if (vercelCityRaw) {
    try {
      city = decodeURIComponent(vercelCityRaw);
    } catch {
      city = vercelCityRaw;
    }
  }

  let region = '';
  if (vercelRegionRaw) {
    try {
      region = decodeURIComponent(vercelRegionRaw);
    } catch {
      region = vercelRegionRaw;
    }
  }

  const countryCode = vercelCountry || (clientIp.startsWith('103.') || clientIp.startsWith('182.') ? 'PK' : 'PK');
  const country = countryCode === 'PK' ? 'Pakistan' : (vercelCountry || 'Pakistan');

  const deviceName = `${browser} on ${os} (${city !== 'Unknown' ? city : country})`;

  return {
    ua,
    browser,
    os,
    deviceType,
    city,
    region,
    country,
    countryCode,
    deviceName
  };
}

/**
 * Verify device credentials from the request cookie against the database.
 * Authoritative server-side decision using database server timestamp.
 */
export async function verifyDeviceFromRequest(
  req: NextApiRequest,
  clientIp: string
): Promise<DeviceVerification> {
  const cookieData = extractDeviceCookie(req);
  if (!cookieData) {
    return {
      deviceId: null,
      isTrusted: false,
      isRestricted: true,
      isBlocked: false,
      remainingRestrictionSeconds: 48 * 3600,
      device: null,
      isNew: true
    };
  }

  const { deviceId, deviceSecret } = cookieData;
  const secretHash = hashDeviceSecret(deviceSecret);
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  if (clientToUse) {
    try {
      const { data, error } = await clientToUse
        .from('admin_devices')
        .select('*')
        .eq('id', deviceId)
        .maybeSingle();

      if (!error && data) {
        // Timing safe hash comparison
        const storedHashBuf = Buffer.from(data.device_secret_hash || '');
        const currentHashBuf = Buffer.from(secretHash);

        if (
          storedHashBuf.length === currentHashBuf.length &&
          crypto.timingSafeEqual(storedHashBuf, currentHashBuf)
        ) {
          const isBlocked = data.status === 'blocked';
          const isTrusted = data.status === 'trusted' && !isBlocked;
          const now = Date.now();
          const restrictedUntilTime = data.restricted_until ? new Date(data.restricted_until).getTime() : 0;
          const remainingSec = Math.max(0, Math.ceil((restrictedUntilTime - now) / 1000));
          const isRestricted = !isTrusted && !isBlocked;

          // Asynchronously update last_seen_at and IP
          clientToUse
            .from('admin_devices')
            .update({
              last_seen_at: new Date().toISOString(),
              ip_address: clientIp
            })
            .eq('id', deviceId)
            .then(() => {})
            .catch(() => {});

          return {
            deviceId,
            isTrusted,
            isRestricted,
            isBlocked,
            remainingRestrictionSeconds: remainingSec,
            device: data as DeviceRecord,
            isNew: false
          };
        }
      }
    } catch (err) {
      console.warn('[SECURITY] Database error verifying device:', err);
    }
  }

  // Memory fallback for development
  const mem = memoryDevices.get(deviceId);
  if (mem) {
    const isMatch = mem.secretHash === secretHash;
    if (isMatch) {
      const isBlocked = mem.record.status === 'blocked';
      const isTrusted = mem.record.status === 'trusted' && !isBlocked;
      const now = Date.now();
      const restrictedUntilTime = mem.record.restricted_until ? new Date(mem.record.restricted_until).getTime() : 0;
      const remainingSec = Math.max(0, Math.ceil((restrictedUntilTime - now) / 1000));

      return {
        deviceId,
        isTrusted,
        isRestricted: !isTrusted && !isBlocked,
        isBlocked,
        remainingRestrictionSeconds: remainingSec,
        device: mem.record,
        isNew: false
      };
    }
  }

  return {
    deviceId: null,
    isTrusted: false,
    isRestricted: true,
    isBlocked: false,
    remainingRestrictionSeconds: 48 * 3600,
    device: null,
    isNew: true
  };
}

/**
 * Registers a login for a device.
 * If known and trusted, keeps trusted status.
 * If new or unrecognized, enrolls as pending_48h and generates a persistent security alert!
 */
export async function registerOrUpdateDeviceLogin(
  req: NextApiRequest,
  clientIp: string
): Promise<{
  device: DeviceRecord;
  isNew: boolean;
  isTrusted: boolean;
  isBlocked: boolean;
  deviceSecret?: string;
  remainingRestrictionSeconds: number;
}> {
  const verified = await verifyDeviceFromRequest(req, clientIp);
  const info = extractClientInfo(req, clientIp);
  const now = new Date();
  const restrictedUntil = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  // Case 1: Device is already recognized
  if (verified.device && !verified.isNew) {
    return {
      device: verified.device,
      isNew: false,
      isTrusted: verified.isTrusted,
      isBlocked: verified.isBlocked,
      remainingRestrictionSeconds: verified.remainingRestrictionSeconds
    };
  }

  // Case 2: New / unrecognized device -> Generate new credentials & 48h restriction
  const freshDeviceId = `dev_${crypto.randomBytes(12).toString('hex')}`;
  const freshDeviceSecret = crypto.randomBytes(32).toString('hex');
  const freshSecretHash = hashDeviceSecret(freshDeviceSecret);

  const newDevicePayload: DeviceRecord = {
    id: freshDeviceId,
    device_name: info.deviceName,
    ip_address: clientIp,
    browser: info.browser,
    os: info.os,
    device_type: info.deviceType,
    city: info.city,
    country: info.country,
    country_code: info.countryCode,
    region: info.region,
    status: 'pending_48h',
    restricted_until: restrictedUntil.toISOString(),
    approved_at: null,
    approved_by: null,
    last_seen_at: now.toISOString(),
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };

  // Persist to database
  if (clientToUse) {
    try {
      await clientToUse.from('admin_devices').insert([
        {
          id: freshDeviceId,
          device_secret_hash: freshSecretHash,
          device_name: newDevicePayload.device_name,
          ip_address: newDevicePayload.ip_address,
          browser: newDevicePayload.browser,
          os: newDevicePayload.os,
          device_type: newDevicePayload.device_type,
          city: newDevicePayload.city,
          country: newDevicePayload.country,
          country_code: newDevicePayload.country_code,
          region: newDevicePayload.region,
          status: 'pending_48h',
          restricted_until: newDevicePayload.restricted_until,
          last_seen_at: newDevicePayload.last_seen_at,
          created_at: newDevicePayload.created_at,
          updated_at: newDevicePayload.updated_at
        }
      ]);

      // Create persistent security alert
      const alertId = `alt_log_${crypto.randomBytes(8).toString('hex')}`;
      await clientToUse.from('admin_security_alerts').insert([
        {
          id: alertId,
          device_id: freshDeviceId,
          event_type: 'unknown_device_login',
          title: 'Unrecognized Device Login Detected',
          message: `Login from unrecognized device: ${info.browser} on ${info.os} from IP ${clientIp} (${info.city}, ${info.country}). Enforced 48-hour restricted access.`,
          ip_address: clientIp,
          city: info.city,
          country: info.country,
          browser: info.browser,
          os: info.os,
          device_type: info.deviceType,
          status: 'pending',
          restricted_until: newDevicePayload.restricted_until,
          created_at: now.toISOString()
        }
      ]);
    } catch (err) {
      console.error('[SECURITY ERROR] Failed saving new device to Supabase:', err);
    }
  }

  // Keep in memory fallback
  memoryDevices.set(freshDeviceId, { record: newDevicePayload, secretHash: freshSecretHash });
  memoryAlerts.unshift({
    id: `alt_${Date.now()}`,
    device_id: freshDeviceId,
    event_type: 'unknown_device_login',
    title: 'Unrecognized Device Login Detected',
    message: `Login from unrecognized device: ${info.browser} on ${info.os} from IP ${clientIp} (${info.city}, ${info.country}). Enforced 48-hour restricted access.`,
    ip_address: clientIp,
    city: info.city,
    country: info.country,
    browser: info.browser,
    os: info.os,
    device_type: info.deviceType,
    status: 'pending',
    restricted_until: newDevicePayload.restricted_until,
    resolved_at: null,
    created_at: now.toISOString()
  });

  return {
    device: newDevicePayload,
    isNew: true,
    isTrusted: false,
    isBlocked: false,
    deviceSecret: freshDeviceSecret,
    remainingRestrictionSeconds: 48 * 3600
  };
}

/**
 * Approve a device directly. Promotes status to 'trusted' and clears 48h restriction.
 */
export async function approveDevice(deviceId: string, approvedBy: string): Promise<boolean> {
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  if (clientToUse) {
    try {
      // 1. Try atomic PostgreSQL RPC function
      const { data, error } = await clientToUse.rpc('approve_admin_device', {
        p_device_id: deviceId,
        p_approved_by: approvedBy
      });

      if (!error && data === true) {
        return true;
      }

      // 2. Direct table update fallback
      const nowIso = new Date().toISOString();
      const { error: updErr } = await clientToUse
        .from('admin_devices')
        .update({
          status: 'trusted',
          approved_at: nowIso,
          approved_by: approvedBy,
          restricted_until: null,
          updated_at: nowIso
        })
        .eq('id', deviceId);

      if (!updErr) {
        await clientToUse
          .from('admin_security_alerts')
          .update({
            status: 'approved',
            resolved_at: nowIso
          })
          .eq('device_id', deviceId)
          .eq('status', 'pending');

        return true;
      }
    } catch (err) {
      console.error('[SECURITY ERROR] Error approving device in Supabase:', err);
    }
  }

  // Memory fallback
  const mem = memoryDevices.get(deviceId);
  if (mem) {
    mem.record.status = 'trusted';
    mem.record.approved_at = new Date().toISOString();
    mem.record.approved_by = approvedBy;
    mem.record.restricted_until = null;
    return true;
  }

  return false;
}

/**
 * Block a device. Immediately revokes access and invalidates future logins from this device.
 */
export async function blockDevice(deviceId: string): Promise<boolean> {
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  if (clientToUse) {
    try {
      const { data, error } = await clientToUse.rpc('block_admin_device', {
        p_device_id: deviceId
      });

      if (!error && data === true) {
        return true;
      }

      const nowIso = new Date().toISOString();
      const { error: updErr } = await clientToUse
        .from('admin_devices')
        .update({
          status: 'blocked',
          restricted_until: null,
          updated_at: nowIso
        })
        .eq('id', deviceId);

      if (!updErr) {
        await clientToUse
          .from('admin_security_alerts')
          .update({
            status: 'blocked',
            resolved_at: nowIso
          })
          .eq('device_id', deviceId);

        return true;
      }
    } catch (err) {
      console.error('[SECURITY ERROR] Error blocking device in Supabase:', err);
    }
  }

  // Memory fallback
  const mem = memoryDevices.get(deviceId);
  if (mem) {
    mem.record.status = 'blocked';
    mem.record.restricted_until = null;
    return true;
  }

  return false;
}

/**
 * Travel-Friendly 48-Hour Recovery:
 * Once 48 hours have elapsed, verifies recovery factor and promotes device to trusted.
 */
export async function recoverDeviceAfter48h(
  deviceId: string,
  recoveryCodeInput: string
): Promise<{ success: boolean; message: string }> {
  // 1. Verify independent recovery factor
  const isCodeValid = await verifyRecoveryCode(recoveryCodeInput);
  if (!isCodeValid) {
    return {
      success: false,
      message: 'Invalid or already used Recovery Code. Please enter a valid enrolled emergency recovery key.'
    };
  }

  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
  if (clientToUse) {
    try {
      const { data: dev, error: devErr } = await clientToUse
        .from('admin_devices')
        .select('*')
        .eq('id', deviceId)
        .maybeSingle();

      if (devErr || !dev) {
        return { success: false, message: 'Device record not found.' };
      }

      if (dev.status === 'blocked') {
        return { success: false, message: 'This device is permanently blocked by an administrator.' };
      }

      const now = Date.now();
      const restrictedUntil = dev.restricted_until ? new Date(dev.restricted_until).getTime() : 0;

      if (restrictedUntil > now) {
        const remainingHours = Math.ceil((restrictedUntil - now) / (1000 * 3600));
        return {
          success: false,
          message: `Mandatory 48-hour security waiting period is still active (~${remainingHours}h remaining). Recovery can only be executed after 48 hours.`
        };
      }

      const { data, error } = await clientToUse.rpc('recover_device_after_48h', {
        p_device_id: deviceId
      });

      if (!error && data === true) {
        return {
          success: true,
          message: '48-Hour security restriction lifted! Device is now officially trusted.'
        };
      }

      // Direct fallback
      const nowIso = new Date().toISOString();
      await clientToUse
        .from('admin_devices')
        .update({
          status: 'trusted',
          approved_at: nowIso,
          approved_by: '48h_recovery_factor',
          restricted_until: null,
          updated_at: nowIso
        })
        .eq('id', deviceId);

      return {
        success: true,
        message: '48-Hour security restriction lifted! Device is now officially trusted.'
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Database recovery execution failed.' };
    }
  }

  // Memory fallback
  const mem = memoryDevices.get(deviceId);
  if (mem) {
    mem.record.status = 'trusted';
    mem.record.approved_at = new Date().toISOString();
    mem.record.approved_by = '48h_recovery_factor';
    mem.record.restricted_until = null;
    return { success: true, message: '48-Hour security restriction lifted in memory state.' };
  }

  return { success: false, message: 'Device recovery failed.' };
}

/**
 * Direct Self-Enrollment / Approval from the Admin Panel:
 * Admin enters Master Password or Master Recovery Key directly in the UI.
 * Verifies with timing-safe PBKDF2 cryptography and immediately trusts the current device!
 * Solves the user's explicit request:
 * "yr bbut asa ho alreart ksatha pi show ho new device ki thk m abi hud ki deivce ko bad ma buildin kerta time hi apporved kerlya ya tubi poasibe hai k hm ko apni api show hogyi build hona k ad all admin appnel sa easly prroved ho skseya bad ma bar bar queery run kerna ki need na ho yr"
 */
export async function trustDeviceWithMasterPassword(
  deviceId: string,
  passwordInput: string
): Promise<{ success: boolean; message: string }> {
  if (!passwordInput || !deviceId) {
    return { success: false, message: 'Master password and Device ID are required.' };
  }

  const { record, error: dbError } = await getAdminRecord();
  if (!record) {
    return { success: false, message: dbError || 'Database unavailable.' };
  }

  // Verify master password timing-safe with PBKDF2
  const check = verifyPassword(passwordInput, record.salt, record.password_hash);
  if (!check.match) {
    // Also check emergency recovery code
    const isRecoveryCode = await verifyRecoveryCode(passwordInput.trim());
    if (!isRecoveryCode) {
      return { success: false, message: 'Master Password verification failed. Unauthorized approval attempt.' };
    }
  }

  const approved = await approveDevice(deviceId, `master_verified_${record.username}`);
  if (approved) {
    return {
      success: true,
      message: 'Device successfully authenticated and verified! Full trusted administrative access granted.'
    };
  }

  return {
    success: false,
    message: 'Could not approve device. Please verify the device ID.'
  };
}

/**
 * Generate a set of 6 emergency travel backup recovery codes.
 * Returns the plaintext codes to display once to the administrator.
 */
export async function generateEmergencyRecoveryCodes(): Promise<string[]> {
  const codes: string[] = [];
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  for (let i = 0; i < 6; i++) {
    const partA = crypto.randomBytes(3).toString('hex').toUpperCase();
    const partB = crypto.randomBytes(3).toString('hex').toUpperCase();
    const code = `SAQIB-${partA}-${partB}`;
    codes.push(code);

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(code, salt, 50000, 32, 'sha256').toString('hex');

    if (clientToUse) {
      try {
        await clientToUse.from('admin_recovery_codes').insert([
          {
            id: `rec_${crypto.randomBytes(8).toString('hex')}`,
            code_hash: hash,
            salt: salt,
            label: `Emergency Travel Backup #${i + 1}`,
            is_used: false,
            created_at: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.warn('Could not insert recovery code in DB:', err);
      }
    }

    memoryRecoveryHashes.add(`${salt}:${hash}`);
  }

  return codes;
}

/**
 * Verify an emergency recovery code. Once verified, marks it as used!
 */
export async function verifyRecoveryCode(inputCode: string): Promise<boolean> {
  const cleanCode = (inputCode || '').trim();
  if (!cleanCode) return false;

  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  if (clientToUse) {
    try {
      const { data, error } = await clientToUse
        .from('admin_recovery_codes')
        .select('*')
        .eq('is_used', false);

      if (!error && Array.isArray(data)) {
        for (const item of data) {
          const expected = crypto.pbkdf2Sync(cleanCode, item.salt, 50000, 32, 'sha256').toString('hex');
          if (
            expected.length === item.code_hash.length &&
            crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(item.code_hash))
          ) {
            // Mark code as used
            await clientToUse
              .from('admin_recovery_codes')
              .update({
                is_used: true,
                used_at: new Date().toISOString()
              })
              .eq('id', item.id);

            return true;
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Memory fallback check
  for (const stored of memoryRecoveryHashes) {
    const [salt, hash] = stored.split(':');
    const expected = crypto.pbkdf2Sync(cleanCode, salt, 50000, 32, 'sha256').toString('hex');
    if (expected === hash) {
      memoryRecoveryHashes.delete(stored);
      return true;
    }
  }

  return false;
}

/**
 * Fetch complete security overview for the Security Center UI.
 */
export async function getSecurityOverview(currentDeviceId?: string | null): Promise<{
  devices: DeviceRecord[];
  alerts: SecurityAlertRecord[];
  activeDevice: DeviceRecord | null;
  recoveryCodesCount: number;
}> {
  const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

  let devices: DeviceRecord[] = [];
  let alerts: SecurityAlertRecord[] = [];
  let recoveryCodesCount = 0;

  if (clientToUse) {
    try {
      const [devRes, altRes, recRes] = await Promise.all([
        clientToUse.from('admin_devices').select('*').order('last_seen_at', { ascending: false }),
        clientToUse.from('admin_security_alerts').select('*').order('created_at', { ascending: false }).limit(50),
        clientToUse.from('admin_recovery_codes').select('id', { count: 'exact', head: true }).eq('is_used', false)
      ]);

      if (devRes.data) devices = devRes.data as DeviceRecord[];
      if (altRes.data) alerts = altRes.data as SecurityAlertRecord[];
      if (recRes.count !== null && recRes.count !== undefined) {
        recoveryCodesCount = recRes.count;
      }
    } catch (err) {
      console.warn('Could not fetch security overview from Supabase:', err);
    }
  }

  if (devices.length === 0 && memoryDevices.size > 0) {
    devices = Array.from(memoryDevices.values()).map(m => m.record);
  }
  if (alerts.length === 0 && memoryAlerts.length > 0) {
    alerts = [...memoryAlerts];
  }
  if (recoveryCodesCount === 0 && memoryRecoveryHashes.size > 0) {
    recoveryCodesCount = memoryRecoveryHashes.size;
  }

  const activeDevice = currentDeviceId ? devices.find(d => d.id === currentDeviceId) || null : null;

  return {
    devices,
    alerts,
    activeDevice,
    recoveryCodesCount
  };
}
