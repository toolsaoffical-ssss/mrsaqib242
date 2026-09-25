// Client-side helper for Admin Authentication & Credential Management
// Guarantees passwords NEVER leak to frontend or persist insecurely in browser

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  token?: string;
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
  newToken?: string;
}

export async function loginAdmin(username: string, password: string): Promise<AdminAuthResponse> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      sessionStorage.setItem('ms_admin_token', data.token);
      sessionStorage.setItem('ms_admin_auth', 'true');
      if (data.username) {
        sessionStorage.setItem('ms_admin_user', data.username);
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

export async function verifyAdminSession(): Promise<VerifySessionResponse> {
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ms_admin_token') : null;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // credentials: 'include' ensures HttpOnly cookie ms_admin_token is sent to the server
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({ token: token || undefined })
    });

    if (!res.ok) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ms_admin_token');
        sessionStorage.removeItem('ms_admin_auth');
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
        sessionStorage.removeItem('ms_admin_token');
        sessionStorage.removeItem('ms_admin_auth');
      }
      return { authenticated: false };
    }
  } catch {
    return { authenticated: false };
  }
}

export async function changeAdminCredentials(
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<ChangeCredentialsResponse> {
  try {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ms_admin_token') : '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/admin/change-credentials', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        currentPassword,
        newUsername,
        newPassword
      })
    });

    const data = await res.json();

    if (data.success && data.newToken) {
      sessionStorage.setItem('ms_admin_token', data.newToken);
      if (data.newUsername) {
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
