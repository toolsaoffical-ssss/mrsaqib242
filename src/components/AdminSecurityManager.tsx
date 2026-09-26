import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  KeyRound,
  Lock,
  Unlock,
  Check,
  Copy,
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  ExternalLink,
  Cpu,
  RefreshCw,
  LogOut,
  Fingerprint
} from 'lucide-react';
import { ADMIN_AUTH_SQL } from '../lib/sqlQueriesService';
import { changeAdminCredentials, getCachedAdminUsername, logoutAdmin } from '../lib/adminAuthClient';

interface AdminSecurityManagerProps {
  currentUsername: string;
  onCredentialsUpdated: (newUsername: string) => void;
  onLogout: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export default function AdminSecurityManager({
  currentUsername,
  onCredentialsUpdated,
  onLogout,
  showToast
}: AdminSecurityManagerProps) {
  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentUsername || 'saqib');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // SQL Copy state
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (currentUsername) {
      setNewUsername(currentUsername);
    } else {
      setNewUsername(getCachedAdminUsername());
    }
  }, [currentUsername]);

  // Compute password strength
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!currentPassword.trim()) {
      setFormError('Please enter your Current Password to verify authorization.');
      return;
    }

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setFormError('New Username must be at least 3 characters long.');
      return;
    }

    if (!newPassword) {
      setFormError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 12) {
      setFormError('New Password must be at least 12–15 characters long for enterprise security.');
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      setFormError('New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('New password and confirm password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changeAdminCredentials(
        currentPassword.trim(),
        newUsername.trim(),
        newPassword
      );

      if (res.success) {
        setFormSuccess(res.message);
        showToast('Admin Credentials updated successfully!', 'success');
        onCredentialsUpdated(res.newUsername || newUsername.trim());
        // Clear sensitive inputs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setFormError(res.message || 'Failed to update credentials.');
        showToast(res.message || 'Update failed', 'error');
      }
    } catch (err: any) {
      setFormError('An unexpected network error occurred.');
      showToast('Network error while saving credentials.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(ADMIN_AUTH_SQL);
    setIsCopied(true);
    showToast('Admin Auth SQL Query copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner: Security Architecture Status */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10 border border-orange-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Backend Security Layer Active
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 flex items-center gap-1.5">
                <Shield size={11} /> Zero Password Leakage
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>Admin Security &amp; Credentials Center</span>
            </h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Change your admin username and password with backend-only cryptographic hashing.
              Your passwords never touch frontend storage or client logs. Responses are strictly boolean verified.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopySql}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
            >
              {isCopied ? <Check size={15} /> : <Copy size={15} />}
              <span>{isCopied ? 'SQL Copied!' : 'Copy Supabase SQL'}</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Log out from Admin Dashboard session?')) {
                  logoutAdmin();
                  onLogout();
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-zinc-300 hover:text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Logout Session</span>
            </button>
          </div>
        </div>

        {/* Security Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-[#0e0f14]/60 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">
              Active Admin User
            </span>
            <span className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
              <User size={13} className="text-orange-400" />
              {currentUsername || 'saqib'}
            </span>
          </div>

          <div className="bg-[#0e0f14]/60 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">
              Backend Encryption
            </span>
            <span className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <KeyRound size={13} />
              PBKDF2 SHA-256
            </span>
          </div>

          <div className="bg-[#0e0f14]/60 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">
              Brute-Force Shield
            </span>
            <span className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1.5">
              <Fingerprint size={13} />
              5 Attempts / Lock
            </span>
          </div>

          <div className="bg-[#0e0f14]/60 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">
              Cloud Database
            </span>
            <span className="text-sm font-mono font-bold text-cyan-400 flex items-center gap-1.5">
              <Cpu size={13} />
              Supabase RLS
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Change Credentials Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <KeyRound size={18} className="text-orange-400" />
                  <span>Update Credentials</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Change both Username and Password directly.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest">
                Protected Route
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Form Messages */}
              <AnimatePresence>
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
                  >
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </motion.div>
                )}
                {formSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5"
                  >
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    <span>{formSuccess}</span>
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
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors pr-10"
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
                <p className="text-[11px] text-zinc-500">
                  Required to prevent unauthorized modifications to administrative credentials.
                </p>
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
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors pl-10"
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
                    className="w-full bg-[#181920] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors pr-10 pl-10"
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

                {/* Password Strength Indicator */}
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
                    className={`w-full bg-[#181920] border rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors pr-10 pl-10 ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-500/50 focus:border-rose-500'
                        : confirmPassword && passwordsMatch
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-white/10 focus:border-orange-500'
                    }`}
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
                {confirmPassword && (
                  <p className={`text-[11px] font-semibold flex items-center gap-1 ${passwordsMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {passwordsMatch ? (
                      <>
                        <Check size={13} /> Passwords match perfectly!
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={13} /> Passwords do not match yet.
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
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

        {/* Right Column: Amazing SQL Query Viewer */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#111217] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Cpu size={18} className="text-cyan-400" />
                  <span>Supabase SQL Query</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Run this query in Supabase to create the persistent <code className="text-cyan-300">admin_auth</code> table.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{isCopied ? 'Copied' : 'Copy SQL'}</span>
              </button>
            </div>

            {/* Step-by-step guidance */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-4 text-xs text-zinc-300 space-y-2">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                How to setup permanent Supabase storage:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px]">
                <li>Click <span className="text-white font-semibold">&quot;Copy SQL&quot;</span> button above.</li>
                <li>Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline inline-flex items-center gap-1">Supabase Dashboard <ExternalLink size={10} /></a>.</li>
                <li>Go to the <span className="text-white font-semibold">SQL Editor</span> tab on the left menu.</li>
                <li>Paste the query and click <span className="text-emerald-400 font-bold">&quot;Run&quot;</span>.</li>
              </ol>
            </div>

            {/* SQL Code Block */}
            <div className="relative flex-1 bg-[#090a0d] border border-white/10 rounded-2xl overflow-hidden font-mono text-[11px] text-zinc-300">
              <div className="bg-[#0e0f14] px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                  admin_auth_setup.sql
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                  PostgreSQL
                </span>
              </div>
              <pre className="p-4 max-h-[340px] overflow-y-auto leading-relaxed text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-700">
                {ADMIN_AUTH_SQL}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
