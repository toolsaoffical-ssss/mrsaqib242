import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Timer, Cpu, AlertOctagon, KeyRound, Unlock, CheckCircle2, RefreshCw } from 'lucide-react';
import { logoutAdmin } from '../lib/adminAuthClient';

interface MirageLockScreenProps {
  onUnlockSuccess?: () => void;
}

export default function MirageLockScreen({ onUnlockSuccess }: MirageLockScreenProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes comfortable window
  const [selectedPort, setSelectedPort] = useState<number>(8); // Default to Port 08
  const [portLabels, setPortLabels] = useState<string[]>(
    Array(12).fill('').map((_, i) => String(i + 1).padStart(2, '0'))
  );
  const [otpCode, setOtpCode] = useState('');
  const [isMasked, setIsMasked] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load dynamic port labels from backend if configured
  useEffect(() => {
    fetch('/api/admin/mirage/labels')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.labels && Array.isArray(data.labels)) {
          setPortLabels(data.labels);
        }
      })
      .catch(() => {});
  }, []);

  // Comfortable 10-minute session timer
  useEffect(() => {
    if (timeLeft <= 0) {
      logoutAdmin();
      window.location.href = '/yourareadmin?reason=mirage_timeout';
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = async (portNum: number, codeToVerify: string) => {
    if (loading) return;
    const clean = codeToVerify.trim();
    if (!clean || clean.length < 4) {
      setError('Please enter at least 4 digits (OTP or Security PIN).');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/mirage/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: clean, port: portNum })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || 'Access Granted! Initializing Dashboard...');
        setTimeout(() => {
          if (onUnlockSuccess) {
            onUnlockSuccess();
          } else {
            window.location.reload();
          }
        }, 500);
      } else {
        if (data.error?.includes('Maximum attempts') || data.error?.includes('COMPROMISE')) {
          logoutAdmin();
          window.location.href = '/yourareadmin?reason=mirage_strikes';
          return;
        }
        setError(data.error || 'Invalid sequence. Please check credentials and try again.');
      }
    } catch {
      setError('Connection issue. Please verify network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(selectedPort, otpCode);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#0a0a0e] border border-cyan-500/25 rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.18)] p-6 sm:p-10 relative overflow-hidden">
        
        {/* Animated Cyber Grid Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.04)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-50" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-500/15">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white text-xl sm:text-2xl font-black tracking-tight uppercase">
                  Multi-Port Matrix
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">
                  PORT {portLabels[selectedPort - 1] || '08'} ACTIVE
                </span>
              </div>
              <p className="text-xs text-cyan-400/80 font-mono uppercase tracking-wider mt-0.5">
                Inject OTP or Master PIN to finalize access
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-900/80 border border-white/10 px-3 py-1.5 rounded-xl font-mono text-cyan-400 text-xs">
            <Timer size={14} className="text-cyan-400" />
            <span>SESSION: {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-xs font-mono animate-in fade-in">
            <AlertOctagon size={18} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-300 text-xs font-mono animate-in fade-in">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 12 Ports Grid (Buttons Only - Zero Autofill Risk) */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
            <span>Matrix Ports (Select Target Node)</span>
            <span className="text-cyan-400 font-bold">Selected: Port {portLabels[selectedPort - 1] || String(selectedPort).padStart(2, '0')}</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {portLabels.map((lbl, idx) => {
              const portNum = idx + 1;
              const isSelected = selectedPort === portNum;
              return (
                <button
                  key={portNum}
                  type="button"
                  onClick={() => {
                    setSelectedPort(portNum);
                    setError('');
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-b from-cyan-500/30 to-cyan-500/10 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Cpu size={12} className={isSelected ? 'text-cyan-300' : 'text-zinc-600'} />
                  <span>{lbl}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Single Dedicated Anti-Autofill OTP/PIN Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 sm:p-5">
            <label className="block text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound size={13} className="text-cyan-400" />
                <span>Enter OTP Sequence / Master PIN</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMasked(!isMasked)}
                className="text-[10px] text-cyan-400 hover:underline uppercase"
              >
                {isMasked ? 'Show Digits' : 'Mask Digits'}
              </button>
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                name="admin_master_otp_sequence"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                  setError('');
                }}
                disabled={loading}
                placeholder="Enter 4 to 6 digit OTP / PIN"
                style={{
                  WebkitTextSecurity: isMasked ? 'disc' : 'none',
                  textSecurity: isMasked ? 'disc' : 'none'
                } as React.CSSProperties}
                className="w-full bg-black/80 border border-cyan-500/40 rounded-xl px-4 py-3.5 text-center text-cyan-300 font-mono text-xl tracking-[0.35em] focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-zinc-600 placeholder:text-sm placeholder:tracking-normal"
                maxLength={6}
                autoFocus
              />
            </div>
            
            <p className="text-[11px] text-zinc-500 font-mono mt-2 text-center">
              Enter the sequence generated from <span className="text-zinc-300">/mradmin2</span> or your Master PIN.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || otpCode.length < 4}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Verifying Node...</span>
                </>
              ) : (
                <>
                  <Unlock size={15} />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono relative z-10">
          <span>Protected by SHA-256 PBKDF2 Multi-Layer Auth</span>
          <span className="text-cyan-400/80">Mr Saqib v2.4.2</span>
        </div>

      </div>
    </div>
  );
}