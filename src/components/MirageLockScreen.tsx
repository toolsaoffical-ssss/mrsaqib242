import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Timer, Cpu, AlertOctagon, KeyRound, Check, RefreshCw, Lock, Unlock } from 'lucide-react';
import { logoutAdmin } from '../lib/adminAuthClient';

export default function MirageLockScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes comfortable window
  const [penaltyTimeLeft, setPenaltyTimeLeft] = useState(0);
  
  // 12 ports array
  const [ports, setPorts] = useState<string[]>(Array(12).fill(''));
  const [portLabels, setPortLabels] = useState<string[]>(Array(12).fill('').map((_, i) => String(i + 1).padStart(2, '0')));
  const [activePortIndex, setActivePortIndex] = useState<number | null>(null);

  // Emergency Master PIN Unlock mode
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [emergencyPin, setEmergencyPin] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // 120-second session countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      logoutAdmin();
      window.location.href = '/yourareadmin?reason=mirage_timeout';
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Penalty timer
  useEffect(() => {
    if (penaltyTimeLeft > 0) {
      const timer = setInterval(() => setPenaltyTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [penaltyTimeLeft]);

  const handlePortChange = (index: number, rawValue: string) => {
    // Only allow numeric digits up to 4 chars
    const val = rawValue.replace(/[^0-9]/g, '').slice(0, 4);
    const newPorts = Array(12).fill('');
    newPorts[index] = val;
    setPorts(newPorts);
    setActivePortIndex(index);
    setError('');
  };

  const handlePortKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = ports[index];
      if (code && code.length === 4) {
        handleVerify(index + 1, code);
      }
    }
  };

  const handleVerify = async (portNumber: number, code: string) => {
    if (loading || penaltyTimeLeft > 0) return;
    if (!code || code.length < 4) {
      setError('Sequence must be exactly 4 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/mirage/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, port: portNumber })
      });
      const data = await res.json();
      
      if (data.success) {
        window.location.reload();
        return;
      } else {
        if (data.error?.includes('COMPROMISE') || data.error?.includes('Expired')) {
          logoutAdmin();
          window.location.href = '/yourareadmin?reason=mirage_3_strikes';
          return;
        }
        
        setError(data.error || `Port ${portLabels[portNumber - 1] || portNumber} sequence rejected.`);
        if (data.lockedUntil) {
          const remaining = Math.ceil((data.lockedUntil - Date.now()) / 1000);
          setPenaltyTimeLeft(remaining > 0 ? remaining : 20);
        }
        
        // Reset all port inputs
        setPorts(Array(12).fill(''));
        setActivePortIndex(null);
      }
    } catch {
      setError('Transmission failed. Check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyPin || emergencyPin.length < 4) {
      setError('Please enter a valid Master PIN.');
      return;
    }
    // Port 8 fallback with master pin
    await handleVerify(8, emergencyPin);
  };

  const clearAllPorts = () => {
    setPorts(Array(12).fill(''));
    setActivePortIndex(null);
    setError('');
  };

  const selectedCode = activePortIndex !== null ? ports[activePortIndex] : '';
  const canSubmit = activePortIndex !== null && selectedCode.length === 4 && !loading && penaltyTimeLeft === 0;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-[#0a0a0c] border border-cyan-500/20 rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.15)] p-6 sm:p-10 relative overflow-hidden">
        
        {/* Animated background scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        {/* Header Strip */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="text-white text-xl sm:text-2xl font-black tracking-tight uppercase flex items-center gap-2">
                <span>Multi-Port Matrix Lock</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
                  Protected
                </span>
              </h2>
              <p className="text-xs text-cyan-400/80 uppercase tracking-widest font-bold mt-0.5">
                Inject sequence into your true designated port
              </p>
            </div>
          </div>
          
          <div className={`flex flex-col items-end gap-0.5 ${timeLeft < 20 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Session Expiration</div>
            <div className="flex items-center gap-1.5 text-2xl font-mono font-black">
              <Timer size={18} />
              <span>{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 animate-in fade-in">
            <AlertOctagon size={20} className="text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="text-rose-300 text-xs sm:text-sm font-bold uppercase tracking-wider">{error}</p>
              {penaltyTimeLeft > 0 && (
                <p className="text-rose-400 text-xs mt-1 font-mono">PORTS LOCKED FOR {penaltyTimeLeft}s (COOLDOWN)</p>
              )}
            </div>
          </div>
        )}

        {/* Penalty Freeze Display */}
        {penaltyTimeLeft > 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-rose-400 gap-3">
            <AlertOctagon size={56} className="animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-black tracking-widest">SECURITY COOLDOWN ACTIVE</h3>
            <p className="font-mono text-base text-zinc-400">PORTS RESUMING IN <strong className="text-white">{penaltyTimeLeft}s</strong></p>
          </div>
        ) : !isEmergencyMode ? (
          /* Normal Matrix Mode */
          <div className="relative z-10 space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              {ports.map((portValue, idx) => {
                const isSelected = activePortIndex === idx;
                const hasValue = portValue.length > 0;
                
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setActivePortIndex(idx);
                      inputRefs.current[idx]?.focus();
                    }}
                    className={`relative rounded-xl p-3 flex flex-col items-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] scale-[1.02]'
                        : hasValue
                        ? 'bg-zinc-900 border border-cyan-500/30'
                        : 'bg-black/90 border border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2 flex items-center gap-1">
                      <Cpu size={11} className={isSelected ? 'text-cyan-400' : 'text-zinc-600'} />
                      <span className={isSelected ? 'text-cyan-300 font-black' : 'text-zinc-500'}>
                        {portLabels[idx] || String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Anti-autofill Masked Input */}
                    <input
                      ref={(el) => { inputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      data-lpignore="true"
                      data-1p-ignore="true"
                      data-form-type="other"
                      name={`mirage_port_${idx}`}
                      value={portValue}
                      onChange={(e) => handlePortChange(idx, e.target.value)}
                      onKeyDown={(e) => handlePortKeyDown(e, idx)}
                      disabled={loading || penaltyTimeLeft > 0}
                      style={{
                        WebkitTextSecurity: 'disc',
                        textSecurity: 'disc'
                      } as React.CSSProperties}
                      className="w-full bg-zinc-900/90 border border-white/10 rounded-lg p-2.5 text-center text-cyan-300 font-mono text-base tracking-[0.4em] focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/50 transition-colors disabled:opacity-40"
                      placeholder="----"
                      maxLength={4}
                    />
                  </div>
                );
              })}
            </div>

            {/* Action Bar Below Grid */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="text-xs text-zinc-400 font-mono">
                {activePortIndex !== null ? (
                  <span>Selected Port: <strong className="text-cyan-400">Port {portLabels[activePortIndex]}</strong> ({selectedCode.length}/4 digits)</span>
                ) : (
                  <span className="text-zinc-500">Click any port box to enter sequence</span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {activePortIndex !== null && selectedCode.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllPorts}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-zinc-400 hover:text-white font-mono transition-colors"
                  >
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => {
                    if (activePortIndex !== null) {
                      handleVerify(activePortIndex + 1, selectedCode);
                    }
                  }}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    canSubmit
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <Unlock size={14} />
                  <span>
                    {loading
                      ? 'Transmitting...'
                      : activePortIndex !== null
                      ? `Inject Into Port ${portLabels[activePortIndex]}`
                      : 'Select Port & Enter 4 Digits'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Emergency Master PIN Unlock Form */
          <form onSubmit={handleEmergencyUnlock} className="relative z-10 py-6 max-w-md mx-auto space-y-5 animate-in fade-in">
            <div className="text-center space-y-1">
              <KeyRound className="mx-auto text-amber-400 mb-2" size={32} />
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Master Generator PIN Unlock</h3>
              <p className="text-xs text-zinc-400">
                Directly unlock the panel using your Master Security PIN.
              </p>
            </div>

            <div>
              <input
                type="password"
                autoComplete="off"
                data-lpignore="true"
                value={emergencyPin}
                onChange={(e) => setEmergencyPin(e.target.value)}
                placeholder="Enter Master PIN"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center text-white font-mono tracking-widest focus:outline-none focus:border-amber-400 focus:bg-zinc-950 transition-colors"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setIsEmergencyMode(false); setError(''); }}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Back to Matrix
              </button>
              <button
                type="submit"
                disabled={loading || emergencyPin.length < 4}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Direct Unlock'}
              </button>
            </div>
          </form>
        )}

        {/* Footer Toggle */}
        <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-mono relative z-10">
          <span>Anti-Brute Force Honeypot Active</span>
          <button
            type="button"
            onClick={() => {
              setIsEmergencyMode(!isEmergencyMode);
              setError('');
            }}
            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors flex items-center gap-1"
          >
            <KeyRound size={12} />
            <span>{isEmergencyMode ? 'Return to Multi-Port Matrix' : 'Forgot Port? Master PIN Unlock'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
