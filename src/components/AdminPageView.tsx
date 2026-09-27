import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Shield, 
  Lock, 
  Unlock, 
  User, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  RefreshCw, 
  ArrowLeft 
} from 'lucide-react';
import { loginAdmin, verifyAdminSession, logoutAdmin } from '../lib/adminAuthClient';
import MirageLockScreen from './MirageLockScreen';
import JarvisLoader from './JarvisLoader';

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

  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockedRemaining, setLockedRemaining] = useState<number | null>(null);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const res = await loginAdmin(loginUsername.trim(), loginPassword);
      if (res.success) {
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
        setLoginPassword('');
      } else {
        if (res.locked) {
          setLockedRemaining(res.remainingLockSeconds || 900);
        }
        if (res.attemptsLeft !== undefined) {
          setAttemptsRemaining(res.attemptsLeft);
        }
        setAuthError(res.message || 'Incorrect credentials. Please try again.');
      }
    } catch {
      setAuthError('Network error during authentication. Please retry.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setLoginPassword('');
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

  // 2. Unauthenticated: Renders login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
        <Head>
          <title>Master Admin Access | Mr Saqib Portfolio</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-orange-600/20 via-purple-600/20 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mb-6 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <ArrowLeft size={14} /> Back to Portfolio
            </Link>
            
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 mx-auto mb-4 shadow-[0_0_40px_rgba(249,115,22,0.4)] flex items-center justify-center">
              <div className="w-full h-full bg-[#0d0e12] rounded-[14px] flex items-center justify-center text-orange-400">
                <Shield size={28} />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-2">
              Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Admin Console</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Travel-Friendly Zero-Trust Protected: Unrecognized devices receive a 48-Hour Restricted Session with persistent security alerts.
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#121318]/90 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  className="w-full bg-[#1b1c24] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                  autoFocus
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <User size={16} />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Master Password
                </label>
                <span className="text-[10px] text-zinc-500">Zero frontend exposure</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter master password"
                  autoComplete="current-password"
                  className="w-full bg-[#1b1c24] border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Error & Lockout Messages */}
              {authError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{authError}</p>
                    {lockedRemaining && (
                      <p className="text-[11px] text-rose-400 font-mono">
                        Lockout cooldown: ~{Math.ceil(lockedRemaining / 60)} minutes
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black uppercase tracking-widest text-xs hover:from-orange-400 hover:to-amber-400 transition-all shadow-[0_10px_30px_rgba(249,115,22,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verifying Server Cryptography...</span>
                </>
              ) : (
                <>
                  <Unlock size={16} />
                  <span>Unlock Dashboard</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                Protected by SHA-256 PBKDF2 &amp; Travel Device Shield
              </span>
            </div>
          </form>
        </div>
      </div>
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
