// Client-side helper for Admin Authentication & Travel-Friendly Device Security
// Guarantees tokens & passwords NEVER leak to frontend JavaScript or persist insecurely in browser storage.
// Authentication is handled EXCLUSIVELY via HttpOnly, Secure, SameSite=Strict cookies.

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  username?: string;
  locked?: boolean;
  remainingLockSeconds?: number;
  attemptsLeft?: number;
  is_restricted?: boolean;
  device_id?: string;
  remaining_restriction_seconds?: number;
}

export interface VerifySessionResponse {
  authenticated: boolean;
  username?: string;
  is_restricted?: boolean;
  device_id?: string;
  device_status?: 'trusted' | 'pending_48h' | 'blocked';
  remaining_restriction_seconds?: number;
  blocked?: boolean;
  message?: string;
  mirage_locked?: boolean;
}

export interface ChangeCredentialsResponse {
  success: boolean;
  message: string;
  newUsername?: string;
  error?: string;
}

export interface SecurityDeviceItem {
  id: string;
  device_name: string;
  ip_address: string;
  browser: string;
  os: string;
  device_type: string;
  city: string;
  country: string;
  country_code: string;
  status: 'trusted' | 'pending_48h' | 'blocked';
  restricted_until: string | null;
  approved_at: string | null;
  approved_by: string | null;
  last_seen_at: string;
  created_at: string;
}

export interface SecurityAlertItem {
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

export interface SecurityOverviewResponse {
  success: boolean;
  is_restricted: boolean;
  current_device_id: string | null;
  current_device_status: 'trusted' | 'pending_48h' | 'blocked';
  current_client_ip: string;
  remaining_restriction_seconds: number;
  devices: SecurityDeviceItem[];
  alerts: SecurityAlertItem[];
  active_device: SecurityDeviceItem | null;
  recovery_codes_count: number;
  error?: string;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  username?: string;
  locked?: boolean;
  remainingLockSeconds?: number;
  attemptsLeft?: number;
  is_restricted?: boolean;
  device_id?: string;
  remaining_restriction_seconds?: number;
  mirage_locked?: boolean;
}

/**
 * Log in admin with device recognition.
 */
export async function loginAdmin(username: string, password: string): Promise<AdminAuthResponse> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ms_admin_auth', 'true');
        if (data.username) {
          sessionStorage.setItem('ms_admin_user', data.username);
        }
        if (data.is_restricted !== undefined) {
          sessionStorage.setItem('ms_admin_restricted', data.is_restricted ? 'true' : 'false');
        }
      }
    }
    return data;
  } catch (err) {
    return {
      success: false,
      message: 'Network connection error while contacting authentication server.'
    };
  }
}

/**
 * Verify admin session and device status.
 */
export async function verifyAdminSession(): Promise<VerifySessionResponse> {
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ms_admin_auth');
        sessionStorage.removeItem('ms_admin_user');
        sessionStorage.removeItem('ms_admin_restricted');
      }
      return { 
        authenticated: false, 
        blocked: Boolean(errData.blocked),
        message: errData.message 
      };
    }

    const data = await res.json();
    if (data.authenticated) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ms_admin_auth', 'true');
        if (data.username) {
          sessionStorage.setItem('ms_admin_user', data.username);
        }
        sessionStorage.setItem('ms_admin_restricted', data.is_restricted ? 'true' : 'false');
      }
      return { 
        authenticated: true, 
        username: data.username,
        is_restricted: Boolean(data.is_restricted),
        device_id: data.device_id,
        device_status: data.device_status,
        remaining_restriction_seconds: data.remaining_restriction_seconds || 0,
        mirage_locked: Boolean(data.mirage_locked)
      };
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ms_admin_auth');
        sessionStorage.removeItem('ms_admin_user');
        sessionStorage.removeItem('ms_admin_restricted');
      }
      return { authenticated: false };
    }
  } catch {
    return { authenticated: false };
  }
}

/**
 * Fetch full security devices, alerts & live session status.
 */
export async function fetchSecurityOverview(): Promise<SecurityOverviewResponse> {
  try {
    const res = await fetch('/api/admin/security/devices', {
      method: 'GET',
      credentials: 'include'
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      is_restricted: false,
      current_device_id: null,
      current_device_status: 'pending_48h',
      current_client_ip: '127.0.0.1',
      remaining_restriction_seconds: 0,
      devices: [],
      alerts: [],
      active_device: null,
      recovery_codes_count: 0,
      error: 'Network error fetching security overview.'
    };
  }
}

/**
 * Direct Self-Approval / Trust Current Device from the UI.
 * Verifies Master Password and immediately marks the current device as Trusted.
 */
export async function trustCurrentDevice(masterPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/security/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'trust_current_device',
        masterPassword
      })
    });
    const data = await res.json();
    if (data.success && typeof window !== 'undefined') {
      sessionStorage.setItem('ms_admin_restricted', 'false');
    }
    return {
      success: Boolean(data.success),
      message: data.message || data.error || 'Approval processed.'
    };
  } catch {
    return {
      success: false,
      message: 'Network error during device trust verification.'
    };
  }
}

/**
 * Approve a pending device.
 */
export async function approveSecurityDevice(
  targetDeviceId: string, 
  verifyPassword?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/security/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'approve_device',
        targetDeviceId,
        verifyPassword
      })
    });
    const data = await res.json();
    return {
      success: Boolean(data.success),
      message: data.message || data.error || 'Device approval failed.'
    };
  } catch {
    return {
      success: false,
      message: 'Network error during device approval.'
    };
  }
}

/**
 * Block a suspicious device.
 */
export async function blockSecurityDevice(targetDeviceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/security/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'block_device',
        targetDeviceId
      })
    });
    const data = await res.json();
    return {
      success: Boolean(data.success),
      message: data.message || data.error || 'Device blocking failed.'
    };
  } catch {
    return {
      success: false,
      message: 'Network error during device blocking.'
    };
  }
}

/**
 * Travel Recovery: Unlock access after 48 hours using recovery factor.
 */
export async function recoverDeviceAfter48h(recoveryCode: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/admin/security/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'recover_after_48h',
        recoveryCode
      })
    });
    const data = await res.json();
    if (data.success && typeof window !== 'undefined') {
      sessionStorage.setItem('ms_admin_restricted', 'false');
    }
    return {
      success: Boolean(data.success),
      message: data.message || data.error || '48-hour recovery failed.'
    };
  } catch {
    return {
      success: false,
      message: 'Network error during 48-hour recovery.'
    };
  }
}

/**
 * Generate 6 Emergency Travel Recovery Codes.
 */
export async function generateEmergencyRecoveryCodes(): Promise<{ success: boolean; codes?: string[]; message: string }> {
  try {
    const res = await fetch('/api/admin/security/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        action: 'generate_recovery_codes'
      })
    });
    const data = await res.json();
    return {
      success: Boolean(data.success),
      codes: data.codes,
      message: data.message || data.error || 'Failed generating recovery codes.'
    };
  } catch {
    return {
      success: false,
      message: 'Network error generating emergency codes.'
    };
  }
}

/**
 * Update administrative credentials.
 */
export async function changeAdminCredentials(
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<ChangeCredentialsResponse> {
  try {
    const res = await fetch('/api/admin/change-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword,
        newUsername,
        newPassword
      })
    });

    const data = await res.json();

    if (data.success && data.newUsername) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ms_admin_user', data.newUsername);
      }
    }

    return {
      success: Boolean(data.success),
      message: data.message || data.error || 'Failed to update credentials.',
      newUsername: data.newUsername
    };
  } catch (err) {
    return {
      success: false,
      message: 'Network error occurred while updating administrative credentials.'
    };
  }
}

/**
 * Logout admin.
 */
export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('ms_admin_token');
    sessionStorage.removeItem('ms_admin_auth');
    sessionStorage.removeItem('ms_admin_user');
    sessionStorage.removeItem('ms_admin_restricted');
  }
  fetch('/api/admin/logout', { 
    method: 'POST',
    credentials: 'include'
  }).catch(() => {});
}

export function getCachedAdminUsername(): string {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('ms_admin_user') || 'saqib';
  }
  return 'saqib';
}
  
export interface HackLogItem { id: string; ip_address: string; user_agent: string; location: string; isp: string; attempt_type: string; created_at: string; }  
  
export async function fetchHackLogs(): Promise<HackLogItem[]> { try { const res = await fetch('/api/admin/security/hack-logs', { credentials: 'include' }); const data = await res.json(); if (data.success && data.logs) return data.logs; return []; } catch (err) { return []; } } 
