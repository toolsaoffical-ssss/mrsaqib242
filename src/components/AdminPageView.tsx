import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { verifyAdminSession, logoutAdmin } from '../lib/adminAuthClient';
import MirageLockScreen from './MirageLockScreen';
import JarvisLoader from './JarvisLoader';
import BiometricAdminLogin from './BiometricAdminLogin';

const AdminAuthenticatedDashboard = dynamic(
  () => import('./AdminAuthenticatedDashboard'),
  {
    ssr: false,
    loading: () => (
      <>
        <Head>
          <title>Loading Master Admin Dashboard...</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <JarvisLoader text="S.A.Q.I.B." />
      </>
    )
  }
);

export default function AdminPageView() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [isRestricted, setIsRestricted] = useState<boolean>(false);
  const [isMirageLocked, setIsMirageLocked] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [deviceStatus, setDeviceStatus] = useState<string>('pending_48h');
  const [remainingRestrictionSeconds, setRemainingRestrictionSeconds] = useState<number>(0);
  const [, setAuthError] = useState<string>('');

  // Check stored session with backend verification on mount
  useEffect(() => {
    async function verifyInitialSession() {
      setIsCheckingSession(true);
      try {
        const result = await verifyAdminSession();
        if (result.authenticated) {
          setIsAuthenticated(true);
          if (result.username) setAdminUsername(result.username);
          setIsRestricted(Boolean(result.is_restricted));
          setIsMirageLocked(Boolean(result.mirage_locked));
          if (result.device_id) setDeviceId(result.device_id);
          if (result.device_status) setDeviceStatus(result.device_status);
          if (result.remaining_restriction_seconds !== undefined) {
            setRemainingRestrictionSeconds(result.remaining_restriction_seconds);
          }
        } else {
          setIsAuthenticated(false);
          setIsMirageLocked(false);
          if (result.blocked) {
            setAuthError(result.message || 'This device has been permanently blocked by an administrator.');
          }
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingSession(false);
      }
    }
    verifyInitialSession();
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setIsRestricted(false);
  };

  // 1. Initial Session Checking State
  if (isCheckingSession) {
    return (
      <>
        <Head>
          <title>Authenticating Master Session | Mr Saqib</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <JarvisLoader text="S.A.Q.I.B." />
      </>
    );
  }

  // 2. Unauthenticated: Renders Futuristic SHA-256 Biometric Login Core
  if (!isAuthenticated) {
    return (
      <BiometricAdminLogin
        onSuccess={(res) => {
          setIsAuthenticated(true);
          setIsMirageLocked(true); // Always locked immediately after login
          if (res.username) setAdminUsername(res.username);
          setIsRestricted(Boolean(res.is_restricted));
          if (res.device_id) setDeviceId(res.device_id);
          if (res.remaining_restriction_seconds !== undefined) {
            setRemainingRestrictionSeconds(res.remaining_restriction_seconds);
          }
          setDeviceStatus(res.is_restricted ? 'pending_48h' : 'trusted');
          setAuthError('');
        }}
      />
    );
  }

  // 3. Authenticated: Render dashboard with restriction status
  return (
    <>
      <AdminAuthenticatedDashboard
        adminUsername={adminUsername}
        isRestricted={isRestricted}
        remainingRestrictionSeconds={remainingRestrictionSeconds}
        deviceId={deviceId}
        deviceStatus={deviceStatus}
        onLogout={handleLogout}
        onDeviceApproved={() => {
          setIsRestricted(false);
          setDeviceStatus('trusted');
          setRemainingRestrictionSeconds(0);
        }}
      />
      {isMirageLocked && <MirageLockScreen />}
    </>
  );
}
