// Client-side helper for Admin Authentication & Credential Management
// Guarantees tokens & passwords NEVER leak to frontend JavaScript or persist insecurely in browser storage.
// Authentication is handled EXCLUSIVELY via HttpOnly, Secure, SameSite=Strict cookies.

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  username?: string;
  locked?: boolean;
  remainingLockSeconds?: number;
  attemptsLeft?: number;
}

export interface VerifySessionResponse {
  authenticated: boolean;
  username?: string;
}

export interface ChangeCredentialsResponse {
  success: boolean;
  message: string;
  newUsername?: string;
}

/**
 * Log in admin.
 * The session token is stored exclusively by the browser as an HttpOnly cookie.
 * No token is ever returned in JSON or stored in JavaScript storage.
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
 * Verify admin session.
 * Relies entirely on the browser sending the HttpOnly cookie with credentials: 'include'.
 */
export async function verifyAdminSession(): Promise<VerifySessionResponse> {
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!res.ok) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ms_admin_auth');
        sessionStorage.removeItem('ms_admin_user');
      }
      return { authenticated: false };
    }

    const data = await res.json();
    if (data.authenticated) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('ms_admin_auth', 'true');
        if (data.username) {
          sessionStorage.setItem('ms_admin_user', data.username);
        }
      }
      return { authenticated: true, username: data.username };
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ms_admin_auth');
        sessionStorage.removeItem('ms_admin_user');
      }
      return { authenticated: false };
    }
  } catch {
    return { authenticated: false };
  }
}

/**
 * Update administrative credentials.
 * Authorizes exclusively via the existing HttpOnly cookie.
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

    return data;
  } catch (err) {
    return {
      success: false,
      message: 'Network error occurred while updating administrative credentials.'
    };
  }
}

/**
 * Logout admin.
 * Clears client state and calls backend to expire the HttpOnly cookie.
 */
export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('ms_admin_token');
    sessionStorage.removeItem('ms_admin_auth');
    sessionStorage.removeItem('ms_admin_user');
  }
  // Inform server asynchronously with credentials: 'include' to clear HttpOnly cookie
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
