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

    if (!token) {
      return { authenticated: false };
    }

    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ token })
    });

    if (!res.ok) {
      sessionStorage.removeItem('ms_admin_token');
      sessionStorage.removeItem('ms_admin_auth');
      return { authenticated: false };
    }

    const data = await res.json();
    if (data.authenticated) {
      return { authenticated: true, username: data.username };
    } else {
      sessionStorage.removeItem('ms_admin_token');
      sessionStorage.removeItem('ms_admin_auth');
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

    const res = await fetch('/api/admin/change-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
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
  // Inform server asynchronously
  fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
}

export function getCachedAdminUsername(): string {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('ms_admin_user') || 'saqib';
  }
  return 'saqib';
}
