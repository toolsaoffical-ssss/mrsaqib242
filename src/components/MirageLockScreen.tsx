import { useState, useEffect } from 'react';
import { ShieldAlert, Timer, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/router';
import { logoutAdmin } from '../lib/adminAuthClient';

export default function MirageLockScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const router = useRouter();

  // Simple client-side visual timer (actual enforcement is on server)
  useEffect(() => {
    if (timeLeft <= 0) {
      logoutAdmin();
      window.location.reload();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/mirage/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (data.success) {
        // Refresh the page to load the dashboard!
        window.location.reload();
      } else {
        setError(data.error || 'Verification Failed');
        if (data.error?.includes('Expired')) {
          logoutAdmin();
          window.location.reload();
        }
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold tracking-tight">VISUAL_MATRIX_LOCK</h2>
              <p className="text-xs text-zinc-400 uppercase">Authentication Required</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-full ${timeLeft < 15 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-zinc-800 text-zinc-300'}`}>
            <Timer size={14} />
            {timeLeft}s
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          System is currently locked. Please enter the visual matrix sequence to decrypt the session state.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <div className="relative">
              <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={4}
                className="w-full bg-black border border-zinc-800 rounded-lg pl-12 pr-4 py-4 text-white text-xl tracking-[1em] font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="0000"
                autoFocus
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || code.length < 4}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'DECRYPT SESSION'}
          </button>
        </form>
      </div>
    </div>
  );
}
