import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  KeyRound,
  Lock,
  Unlock,
  Check,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Cpu,
  RefreshCw,
  LogOut,
  Fingerprint,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Ban,
  CheckCircle,
  Copy,
  Download,
  AlertCircle,
  MapPin,
  AlertOctagon,
  ShieldAlert
} from 'lucide-react';
import { 
  changeAdminCredentials, 
  getCachedAdminUsername, 
  logoutAdmin,
  fetchSecurityOverview,
  trustCurrentDevice,
  approveSecurityDevice,
  blockSecurityDevice,
  recoverDeviceAfter48h,
  generateEmergencyRecoveryCodes,
  SecurityDeviceItem,
  SecurityAlertItem,
  SecurityOverviewResponse,
  HackLogItem,
  fetchHackLogs
} from '../lib/adminAuthClient';
import { getCountryFlag } from '../lib/analyticsService';

interface AdminSecurityManagerProps {
  currentUsername: string;
  isRestricted?: boolean;
  remainingRestrictionSeconds?: number;
  currentDeviceId?: string;
  onCredentialsUpdated: (newUsername: string) => void;
  onLogout: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onDeviceApproved?: () => void;
}

type SecuritySubTab = 'overview' | 'devices' | 'alerts' | 'recovery' | 'credentials' | 'mirage' | 'hacklogs';

export default function AdminSecurityManager({
  currentUsername,
  isRestricted: initialRestricted = false,
  remainingRestrictionSeconds: initialRemainingSec = 0,
  currentDeviceId,
  onCredentialsUpdated,
  onLogout,
  showToast,
  onDeviceApproved
}: AdminSecurityManagerProps) {
  const [subTab, setSubTab] = useState<SecuritySubTab>('overview');

  // Security overview state
  const [securityData, setSecurityData] = useState<SecurityOverviewResponse | null>(null);
  const [isLoadingSecurity, setIsLoadingSecurity] = useState<boolean>(true);
  const [isRestricted, setIsRestricted] = useState<boolean>(initialRestricted);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(initialRemainingSec);

  // Quick Self-Trust state
  const [trustPassInput, setTrustPassInput] = useState<string>('');
  const [isSubmittingTrust, setIsSubmittingTrust] = useState<boolean>(false);
  const [trustError, setTrustError] = useState<string>('');

  // 48h Recovery state
  const [recoveryCodeInput, setRecoveryCodeInput] = useState<string>('');
  const [isSubmittingRecovery, setIsSubmittingRecovery] = useState<boolean>(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState<boolean>(false);

  // Action loading states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Credentials form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentUsername || 'saqib');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingCreds, setIsSubmittingCreds] = useState(false);
  const [credsError, setCredsError] = useState('');
  const [credsSuccess, setCredsSuccess] = useState('');

  // Mirage Config state
  const [miragePin, setMiragePin] = useState('');
  const [mirageColors, setMirageColors] = useState(['#10b981', '#10b981', '#10b981', '#10b981']);
  const [isSubmittingMirage, setIsSubmittingMirage] = useState(false);
  const [mirageMessage, setMirageMessage] = useState('');
  const [mirageError, setMirageError] = useState('');

  // Hack logs state
  const [hackLogs, setHackLogs] = useState<HackLogItem[]>([]);
  const [isLoadingHackLogs, setIsLoadingHackLogs] = useState(false);
  
  useEffect(() => {
    if (subTab === 'mirage') {
      fetch('/api/admin/mirage/config')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.colors) {
            setMirageColors(data.colors);
          }
        })
        .catch(() => {});
    } else if (subTab === 'hacklogs') {
      setIsLoadingHackLogs(true);
      fetchHackLogs().then(logs => {
        setHackLogs(logs);
        setIsLoadingHackLogs(false);
      });
    }
  }, [subTab]);

  // Load Security Overview
  const loadSecurity = async () => {
    setIsLoadingSecurity(true);
    try {
      const data = await fetchSecurityOverview();
      setSecurityData(data);
      if (data.is_restricted !== undefined) {
        setIsRestricted(data.is_restricted);
      }
      if (data.remaining_restriction_seconds !== undefined) {
        setCountdownSeconds(data.remaining_restriction_seconds);
      }
    } catch {
      showToast('Could not load security overview', 'error');
    } finally {
      setIsLoadingSecurity(false);
    }
  };

  useEffect(() => {
    loadSecurity();
  }, []);

  // Sync props
  useEffect(() => {
    setIsRestricted(Boolean(initialRestricted));
  }, [initialRestricted]);

  useEffect(() => {
    setCountdownSeconds(initialRemainingSec);
  }, [initialRemainingSec]);

  // Live countdown timer
  useEffect(() => {
    if (!isRestricted || countdownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCountdownSeconds(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestricted, countdownSeconds]);

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Quick Self-Trust / Approval
  const handleTrustCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrustError('');
    if (!trustPassInput.trim()) {
      setTrustError('Please enter your Master Admin Password or Recovery Key.');
      return;
    }

    setIsSubmittingTrust(true);
    try {
      const res = await trustCurrentDevice(trustPassInput.trim());
      if (res.success) {
        setIsRestricted(false);
        setCountdownSeconds(0);
        setTrustPassInput('');
        showToast('Device verified and promoted to Trusted! Full access granted.', 'success');
        if (onDeviceApproved) onDeviceApproved();
        loadSecurity();
      } else {
        setTrustError(res.message);
      }
    } catch {
      setTrustError('Network error during verification.');
    } finally {
      setIsSubmittingTrust(false);
    }
  };

  // Approve a target device
  const handleApproveDevice = async (deviceId: string) => {
    const verifyPass = isRestricted 
      ? window.prompt('Master Password required to authorize device approval:') 
      : undefined;

    if (isRestricted && !verifyPass) return;

    setActionLoadingId(deviceId);
    try {
      const res = await approveSecurityDevice(deviceId, verifyPass || undefined);
      if (res.success) {
        showToast('Device successfully approved as trusted!', 'success');
        loadSecurity();
      } else {
        showToast(res.message || 'Approval failed', 'error');
      }
    } catch {
      showToast('Error approving device', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Block a target device
  const handleBlockDevice = async (deviceId: string) => {
    if (!window.confirm('Are you sure you want to BLOCK this device? All its active sessions will be terminated.')) {
      return;
    }

    setActionLoadingId(deviceId);
    try {
      const res = await blockSecurityDevice(deviceId);
      if (res.success) {
        showToast('Device blocked and access revoked.', 'success');
        loadSecurity();
      } else {
        showToast(res.message || 'Blocking failed', 'error');
      }
    } catch {
      showToast('Error blocking device', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // 48h Recovery submission
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCodeInput.trim()) {
      showToast('Please enter an Emergency Recovery Code', 'error');
      return;
    }

    setIsSubmittingRecovery(true);
    try {
      const res = await recoverDeviceAfter48h(recoveryCodeInput.trim());
      if (res.success) {
        setIsRestricted(false);
        setCountdownSeconds(0);
        setRecoveryCodeInput('');
        showToast(res.message, 'success');
        if (onDeviceApproved) onDeviceApproved();
        loadSecurity();
      } else {
        showToast(res.message || 'Recovery failed', 'error');
      }
    } catch {
      showToast('Network error during recovery', 'error');
    } finally {
      setIsSubmittingRecovery(false);
    }
  };

  // Generate Emergency Recovery Codes
  const handleGenerateCodes = async () => {
    if (isRestricted) {
      showToast('Generating new recovery codes is locked during restricted session.', 'error');
      return;
    }

    setIsGeneratingCodes(true);
    try {
      const res = await generateEmergencyRecoveryCodes();
      if (res.success && res.codes) {
        setGeneratedCodes(res.codes);
        showToast('Generated 6 Emergency Backup Codes! Save them safely offline.', 'success');
        loadSecurity();
      } else {
        showToast(res.message || 'Failed generating codes', 'error');
      }
    } catch {
      showToast('Network error generating codes', 'error');
    } finally {
      setIsGeneratingCodes(false);
    }
  };

  // Password Strength
  const computeStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-zinc-700', width: 'w-0' };
    let score = 0;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 15) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Too Weak (< 12 chars)', color: 'bg-rose-500', width: 'w-1/5' };
      case 2:
        return { score: 2, label: 'Weak', color: 'bg-amber-500', width: 'w-2/5' };
      case 3:
        return { score: 3, label: 'Medium', color: 'bg-yellow-400', width: 'w-3/5' };
      case 4:
        return { score: 4, label: 'Strong (12+ chars)', color: 'bg-emerald-400', width: 'w-4/5' };
      case 5:
        return { score: 5, label: 'Enterprise Grade (15+ chars)', color: 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]', width: 'w-full' };
      default:
        return { score: 0, label: 'Too short (min. 12 chars)', color: 'bg-rose-500', width: 'w-1/5' };
    }
  };

  const strength = computeStrength(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Credential update submission
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredsError('');
    setCredsSuccess('');

    if (isRestricted) {
      setCredsError('Action Locked: Changing credentials is forbidden during 48-hour restriction. Please verify and trust this device first.');
      return;
    }

    if (!currentPassword.trim()) {
      setCredsError('Please enter your Current Password to verify authorization.');
      return;
    }

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setCredsError('New Username must be at least 3 characters long.');
      return;
    }

    if (!newPassword || newPassword.length < 12) {
      setCredsError('New Password must be at least 12–15 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setCredsError('New password and confirm password do not match.');
      return;
    }

    setIsSubmittingCreds(true);
    try {
      const res = await changeAdminCredentials(
        currentPassword.trim(),
        newUsername.trim(),
        newPassword
      );

      if (res.success) {
        setCredsSuccess(res.message);
        showToast('Admin Credentials updated successfully!', 'success');
        onCredentialsUpdated(res.newUsername || newUsername.trim());
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setCredsError(res.message || 'Failed to update credentials.');
      }
    } catch {
      setCredsError('Network error while saving credentials.');
    } finally {
      setIsSubmittingCreds(false);
    }
  };

  const handleUpdateMirage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!miragePin || miragePin.length < 4) {
      setMirageError('Master PIN must be at least 4 digits long.');
      return;
    }
    setMirageError('');
    setMirageMessage('');
    setIsSubmittingMirage(true);

    try {
      const res = await fetch('/api/admin/mirage/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPin: miragePin, newColors: mirageColors })
      });
      const data = await res.json();
      
      if (data.success) {
        setMirageMessage(data.message || 'Mirage Configuration Updated!');
        setMiragePin('');
        showToast('Mirage visual matrix configuration updated successfully!', 'success');
      } else {
        setMirageError(data.error || 'Failed to update configuration.');
      }
    } catch {
      setMirageError('Network error while updating configuration.');
    } finally {
      setIsSubmittingMirage(false);
    }
  };

  const activeDevice = securityData?.active_device;
  const currentIp = securityData?.current_client_ip || '127.0.0.1';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner: Travel Security Architecture */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10 border border-orange-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                isRestricted 
                  ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300' 
                  : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRestricted ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                {isRestricted ? '48-Hour Travel Security Restricted' : 'Master Trusted Environment Active'}
              </span>

              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center gap-1.5">
                <Globe size={11} /> IP: {currentIp}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>Travel-Friendly Security Center &amp; Device Trust</span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Log in while travelling from any computer or mobile without immediate access to your old devices.
              Unrecognized devices receive a 48-hour restricted session, protected by cryptographic device tokens and timing-safe PBKDF2 hashing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={loadSecurity}
              disabled={isLoadingSecurity}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Security Data"
            >
              <RefreshCw size={16} className={isLoadingSecurity ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => {
                if (window.confirm('Log out from Admin Dashboard session?')) {
                  logoutAdmin();
                  onLogout();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Security Sub-Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-white/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview' as SecuritySubTab, label: 'Live Device Intel', icon: Shield },
            { id: 'devices' as SecuritySubTab, label: `Registered Devices (${securityData?.devices.length || 0})`, icon: Laptop },
            { id: 'alerts' as SecuritySubTab, label: `Security Alerts (${securityData?.alerts.length || 0})`, icon: AlertTriangle },
            { id: 'recovery' as SecuritySubTab, label: 'Travel Recovery & Keys', icon: KeyRound },
            { id: 'credentials' as SecuritySubTab, label: 'Admin Credentials', icon: Lock },
            { id: 'mirage' as SecuritySubTab, label: 'Zero-Knowledge Matrix', icon: EyeOff },
            { id: 'hacklogs' as SecuritySubTab, label: 'Intrusion Logs', icon: AlertTriangle }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black shadow-lg shadow-orange-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB 1: LIVE DEVICE INTEL & INSTANT SELF-TRUST */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Device Card with Prominent IP (User's specific request!) */}
          <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                    Active Session Device
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isRestricted 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isRestricted ? '48-Hour Restricted Mode' : 'Verified Trusted Device'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-white font-mono tracking-tight flex items-center gap-3">
                    <span className="text-orange-400">{currentIp}</span>
                    <span className="text-sm font-normal text-zinc-400 font-sans">
                      ({activeDevice ? `${activeDevice.city}, ${activeDevice.country}` : 'Current Location'})
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Laptop size={13} className="text-orange-400" />
                    {activeDevice ? activeDevice.device_name : 'Current Browser & OS'}
                  </span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Fingerprint size={13} className="text-cyan-400" />
                    ID: {activeDevice?.id || currentDeviceId || 'dev_active'}
                  </span>
                </div>
              </div>

              {/* Countdown or Status Indicator */}
              <div className="shrink-0 bg-[#181920] border border-white/10 rounded-2xl p-4 min-w-[260px]">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-zinc-400 font-medium">Restriction Time Left:</span>
                  <span className={`font-mono font-bold ${countdownSeconds > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {countdownSeconds > 0 ? formatCountdown(countdownSeconds) : '00h 00m 00s (Unlocked)'}
                  </span>
                </div>

                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      countdownSeconds > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(0, (countdownSeconds / (48 * 3600)) * 100))}%`
                    }}
                  />
                </div>
                <p className="text-[10px] text-zinc-500">
                  {isRestricted 
                    ? '48-hour security buffer protecting against stolen credentials.' 
                    : 'Device has verified cryptographic trust credentials.'}
                </p>
              </div>
            </div>

            {/* Direct Self-Trust Box (No SQL query needed!) */}
            {isRestricted && (
              <div className="mt-8 pt-6 border-t border-white/10 bg-amber-500/5 -mx-6 -mb-6 md:-mx-8 md:-mb-8 p-6 md:p-8 rounded-b-3xl">
                <div className="max-w-xl">
                  <h4 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2 mb-1">
                    <KeyRound size={16} />
                    <span>Approve &amp; Trust This Device (48h Lock or Backup Code)</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mb-4">
                    To immediately promote this device to <span className="text-white font-bold">Trusted Status</span>, you must enter an <strong>Emergency Backup Code</strong>. Or, wait for 48 hours and use your Master Password.
                  </p>

                  <form onSubmit={handleTrustCurrent} className="space-y-3">
                    {trustError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{trustError}</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="password"
                        value={trustPassInput}
                        onChange={e => setTrustPassInput(e.target.value)}
                        placeholder="Enter Master Password / Recovery Key"
                        className="w-full bg-[#181920] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingTrust}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmittingTrust ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Trust Device Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB 2: REGISTERED DEVICES LIST */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'devices' && (
        <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Laptop size={18} className="text-orange-400" />
                <span>Enrolled &amp; Known Devices</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                All devices that have authenticated with your admin credentials.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">
              Total: {securityData?.devices.length || 0}
            </span>
          </div>

          {securityData?.devices && securityData.devices.length > 0 ? (
            <div className="space-y-3">
              {securityData.devices.map(device => {
                const isCurrent = device.id === (securityData.active_device?.id || currentDeviceId);
                const isDeviceTrusted = device.status === 'trusted';
                const isDeviceBlocked = device.status === 'blocked';

                return (
                  <div
                    key={device.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-orange-500/5 border-orange-500/30'
                        : isDeviceBlocked
                        ? 'bg-rose-950/20 border-rose-500/20'
                        : 'bg-[#181920]/80 border-white/5'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white flex items-center gap-2">
                            {getCountryFlag(device.country_code, device.country)}
                            {device.device_name}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase">
                              This Device
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isDeviceTrusted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isDeviceBlocked
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {device.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                          <span className="text-orange-400 font-bold">IP: {device.ip_address}</span>
                          <span>Location: {device.city}, {device.country}</span>
                          <span>Last Seen: {new Date(device.last_seen_at).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!isDeviceTrusted && !isDeviceBlocked && (
                          <button
                            onClick={() => handleApproveDevice(device.id)}
                            disabled={actionLoadingId === device.id}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {!isDeviceBlocked && (
                          <button
                            onClick={() => handleBlockDevice(device.id)}
                            disabled={actionLoadingId === device.id}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No registered devices recorded in database yet.
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB 3: PERSISTENT SECURITY ALERTS FEED */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'alerts' && (
        <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <span>Security Alerts &amp; Audit Trail</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Persistent log of unrecognized logins, device approvals, and block events.
              </p>
            </div>
          </div>

          {securityData?.alerts && securityData.alerts.length > 0 ? (
            <div className="space-y-3">
              {securityData.alerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-4 rounded-2xl bg-[#181920]/80 border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold text-white">{alert.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 text-[10px] font-mono">
                        {alert.event_type}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/5">
                    <span className="text-orange-400 font-bold">IP: {alert.ip_address}</span>
                    <span>Location: {alert.city}, {alert.country}</span>
                    <span>Status: <strong className="text-white">{alert.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No security alerts recorded.
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB 4: TRAVEL RECOVERY & EMERGENCY KEYS */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'recovery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 48-Hour Recovery Execution */}
          <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Clock size={18} className="text-amber-400" />
              <span>48-Hour Travel Recovery</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              If you are travelling and every previously trusted phone or laptop has been lost or unavailable, you can unlock full access after 48 hours using your Emergency Recovery Code or Master Password.
            </p>

            <form onSubmit={handleRecoverySubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Emergency Recovery Code
                </label>
                <input
                  type="text"
                  value={recoveryCodeInput}
                  onChange={e => setRecoveryCodeInput(e.target.value)}
                  placeholder="e.g. SAQIB-A1B2-C3D4"
                  className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRecovery}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black uppercase tracking-wider hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRecovery ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Unlock size={14} />
                )}
                <span>Verify &amp; Unlock After 48h</span>
              </button>
            </form>
          </div>

          {/* Card 2: Generate Emergency Travel Backup Codes */}
          <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
            <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <KeyRound size={18} className="text-cyan-400" />
              <span>Emergency Backup Codes</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate 6 one-time travel recovery codes to print or save offline before leaving on a trip.
            </p>

            <button
              onClick={handleGenerateCodes}
              disabled={isGeneratingCodes || isRestricted}
              className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingCodes ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <KeyRound size={14} className="text-cyan-400" />
              )}
              <span>Generate 6 Travel Backup Codes</span>
            </button>

            {generatedCodes.length > 0 && (
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                <span className="text-[11px] font-bold text-cyan-300 block">
                  Copy and save these codes offline now (shown only once):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {generatedCodes.map((code, idx) => (
                    <div key={idx} className="bg-black/40 p-2 rounded-lg font-mono text-xs text-cyan-200 select-all text-center border border-cyan-500/20">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB 5: ADMIN CREDENTIALS */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'credentials' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <KeyRound size={18} className="text-orange-400" />
                  <span>Update Credentials</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Change your admin username and password.
                </p>
              </div>
              {isRestricted && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                  Locked (48h Active)
                </span>
              )}
            </div>

            {isRestricted && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
                <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <p className="font-bold">Credential Updates Locked During 48-Hour Restriction</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    To change admin username or password, verify and trust this device first in the Live Device Intel tab using your Master Password.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <AnimatePresence>
                {credsError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>{credsError}</span>
                  </motion.div>
                )}
                {credsSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5"
                  >
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>{credsSuccess}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current Password Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Current Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    disabled={isRestricted}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors pr-10 disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Username Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  New Admin Username <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    placeholder="e.g. saqib or admin"
                    disabled={isRestricted}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors pl-10 disabled:opacity-50"
                    required
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  New Admin Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password (min. 12–15 chars)"
                    disabled={isRestricted}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors pr-10 pl-10 disabled:opacity-50"
                    required
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {newPassword && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">Strength:</span>
                      <span className="font-bold text-white">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Confirm New Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    disabled={isRestricted}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors pr-10 pl-10 disabled:opacity-50"
                    required
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingCreds || isRestricted}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingCreds ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Encrypting &amp; Updating...</span>
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    <span>Update Admin Credentials</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB 6: MIRAGE VISUAL MATRIX HONEYPOT CONFIGURATION              */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'mirage' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#13141a] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <EyeOff size={120} />
            </div>
            
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <EyeOff size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white uppercase">Mirage Matrix Configuration</h3>
                <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                  Configure the Zero-Knowledge Visual Honeypot system. Set the secret PIN for the generator portal and define the specific "True Colors" that indicate a valid OTP generation.
                </p>
              </div>
            </div>

            {mirageMessage && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-300">{mirageMessage}</p>
              </div>
            )}

            {mirageError && (
              <div className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-rose-400 mt-0.5 shrink-0" />
                <p className="text-sm text-rose-300">{mirageError}</p>
              </div>
            )}

            <form onSubmit={handleUpdateMirage} className="space-y-6 max-w-lg relative z-10">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Master Generator PIN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={miragePin}
                    onChange={e => setMiragePin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 242242"
                    disabled={isRestricted}
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors pl-10 disabled:opacity-50"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Numbers only. Used in /mradmin2 to generate the true OTP.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  True Colors Matrix (4 Digits)
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {mirageColors.map((color, index) => (
                    <div key={index} className="space-y-2">
                      <div className="text-center text-[10px] text-zinc-500 font-bold uppercase">D{index + 1}</div>
                      <div 
                        className="w-full aspect-square rounded-lg border-2 border-white/10 cursor-pointer overflow-hidden relative"
                        style={{ backgroundColor: color }}
                      >
                        <input
                          type="color"
                          value={color}
                          disabled={isRestricted}
                          onChange={e => {
                            const newColors = [...mirageColors];
                            newColors[index] = e.target.value;
                            setMirageColors(newColors);
                          }}
                          className="absolute inset-[-10px] w-[150%] h-[150%] opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmittingMirage || isRestricted}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmittingMirage ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Updating Matrix...</span>
                  </>
                ) : (
                  <>
                    <Shield size={16} />
                    <span>Save Mirage Configuration</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* SUB-TAB 7: HACKER INTRUSION LOGS                                    */}
      {/* ------------------------------------------------------------------- */}
      {subTab === 'hacklogs' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#13141a] border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <AlertOctagon size={120} className="text-rose-500" />
            </div>
            
            <div className="flex items-start justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0 border border-rose-500/30">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-rose-500 uppercase">Intrusion Logs (Shame List)</h3>
                  <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                    Details of hackers who attempted to breach the system. All their device and network traces have been logged.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsLoadingHackLogs(true);
                  fetchHackLogs().then(logs => {
                    setHackLogs(logs);
                    setIsLoadingHackLogs(false);
                  });
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <RefreshCw size={16} className={isLoadingHackLogs ? 'animate-spin' : ''} />
              </button>
            </div>

            {isLoadingHackLogs ? (
              <div className="flex justify-center items-center py-12 text-zinc-500 gap-3">
                <RefreshCw size={20} className="animate-spin text-rose-500" />
                <span className="text-sm font-bold uppercase tracking-widest">Scanning intrusion database...</span>
              </div>
            ) : hackLogs.length === 0 ? (
              <div className="bg-black/50 border border-white/5 rounded-xl p-8 text-center">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No intrusion attempts recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hackLogs.map((log) => (
                  <div key={log.id} className="bg-black/60 border border-rose-900/40 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-600" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-rose-400 font-black text-sm uppercase flex items-center gap-1.5">
                          <Globe size={14} />
                          {log.ip_address}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          {log.attempt_type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <MapPin size={12} className="text-zinc-500" />
                          <span className="truncate">{log.location}</span>
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <Shield size={12} className="text-zinc-500" />
                          <span className="truncate" title={log.isp}>{log.isp}</span>
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <Cpu size={12} className="text-zinc-500" />
                          <span className="truncate" title={log.user_agent}>{log.user_agent || 'Unknown Device'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left md:text-right shrink-0">
                      <div className="text-xs text-zinc-500 font-mono">
                        {new Date(log.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider mt-0.5">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
