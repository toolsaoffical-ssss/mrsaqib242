import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Timer, Cpu, AlertOctagon } from 'lucide-react';
import { useRouter } from 'next/router';
import { logoutAdmin } from '../lib/adminAuthClient';

export default function MirageLockScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [penaltyTimeLeft, setPenaltyTimeLeft] = useState(0);
  
  // Array of 12 ports
  const [ports, setPorts] = useState(Array(12).fill(''));
  const router = useRouter();

  // 60-second total lock
  useEffect(() => {
    if (timeLeft <= 0) {
      logoutAdmin();
      window.location.href = '/yourareadmin?reason=mirage_timeout';
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 20-second penalty lock timer
  useEffect(() => {
    if (penaltyTimeLeft > 0) {
      const timer = setInterval(() => setPenaltyTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [penaltyTimeLeft]);

  const handlePortChange = (index: number, value: string) => {
    const val = value.replace(/[^0-9]/g, '').slice(0, 4);
    const newPorts = [...ports];
    newPorts[index] = val;
    setPorts(newPorts);
    
    // Auto-submit if 4 digits
    if (val.length === 4) {
      handleVerify(index + 1, val);
    }
  };

  const handleVerify = async (portNumber: number, code: string) => {
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
      } else {
        if (data.error?.includes('COMPROMISE') || data.error?.includes('Expired')) {
          logoutAdmin();
          window.location.href = '/yourareadmin?reason=mirage_3_strikes';
          return;
        }
        
        setError(data.error || 'Sequence Rejected');
        if (data.lockedUntil) {
          const remaining = Math.ceil((data.lockedUntil - Date.now()) / 1000);
          setPenaltyTimeLeft(remaining > 0 ? remaining : 20);
        }
        
        // Clear all ports
        setPorts(Array(12).fill(''));
      }
    } catch (err) {
      setError('Network transmission failed.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-[#0a0a0c] border border-zinc-800 rounded-3xl shadow-[0_0_100px_rgba(6,182,212,0.1)] p-8 md:p-10 relative overflow-hidden">
        
        {/* Animated background scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-[scan_2s_linear_infinite] pointer-events-none opacity-50" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="text-white text-xl font-black tracking-tight uppercase">Multi-Port Matrix Lock</h2>
              <p className="text-sm text-cyan-500/70 uppercase tracking-widest font-bold">Inject Sequence into True Port</p>
            </div>
          </div>
          
          <div className={`flex flex-col items-end gap-1 ${timeLeft < 15 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Session Expiration</div>
            <div className="flex items-center gap-2 text-2xl font-mono font-black">
              <Timer size={20} />
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3">
            <AlertOctagon size={20} className="text-rose-500 shrink-0" />
            <div>
              <p className="text-rose-400 text-sm font-bold uppercase tracking-wider">{error}</p>
              {penaltyTimeLeft > 0 && (
                <p className="text-rose-500 text-xs mt-1">PORTS LOCKED FOR {penaltyTimeLeft}s</p>
              )}
            </div>
          </div>
        )}

        {penaltyTimeLeft > 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-rose-500 gap-4">
            <AlertOctagon size={64} className="animate-pulse" />
            <h3 className="text-2xl font-black tracking-widest">SYSTEM FREEZE</h3>
            <p className="font-mono text-xl">{penaltyTimeLeft} SECONDS REMAINING</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 relative z-10">
            {ports.map((portValue, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500/50 to-blue-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm pointer-events-none" />
                <div className="relative bg-black border border-zinc-800 hover:border-cyan-500/50 rounded-xl p-3 flex flex-col items-center transition-colors">
                  <div className="text-[9px] text-zinc-500 font-bold tracking-[0.2em] uppercase mb-2 flex items-center gap-1 opacity-50">
                    <Cpu size={10} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/20" />
                  </div>
                  <input
                    type="password"
                    value={portValue}
                    onChange={(e) => handlePortChange(idx, e.target.value)}
                    disabled={loading || penaltyTimeLeft > 0}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-center text-cyan-400 font-mono tracking-widest focus:outline-none focus:border-cyan-500 focus:bg-cyan-950 transition-colors disabled:opacity-50"
                    placeholder="----"
                    maxLength={4}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center relative z-10">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
            {loading ? 'Transmitting to secure server...' : 'Select the true port and inject 4-digit sequence.'}
          </p>
        </div>

      </div>
    </div>
  );
}
