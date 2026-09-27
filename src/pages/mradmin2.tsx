import { useState } from 'react';
import Head from 'next/head';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

export default function AdminMirageGenerator() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ code: string; colors: string[] } | null>(null);
  
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/mirage/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json();
      if (data.success) {
        setResult({ code: data.code, colors: data.colors });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-cyan-900 flex flex-col">
      <Head>
        <title>System Diagnostic &gt;_</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-md rounded-lg p-8 shadow-2xl relative overflow-hidden">
            {/* Hacker decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20"></div>
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <Terminal className="text-cyan-400" size={24} />
                <h1 className="text-xl font-bold tracking-widest text-zinc-300">SECURE_NODE</h1>
              </div>
              <Cpu className="text-zinc-600 animate-pulse" size={20} />
            </div>

            {!result ? (
              <form onSubmit={handleGenerate} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                    INIT SEQUENCE PIN
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-cyan-400 text-center tracking-[1em] focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="****"
                    autoFocus
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading || pin.length < 4}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 rounded uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {loading ? 'PROCESSING...' : 'GENERATE MATRIX'}
                </button>
              </form>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="text-center space-y-2">
                  <ShieldAlert className="mx-auto text-zinc-500 mb-4" size={32} />
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">RETURN_MATRIX_GENERATED</p>
                </div>

                <div className="flex justify-center gap-4">
                  {result.code.split('').map((digit, i) => (
                    <div 
                      key={i} 
                      className="w-16 h-20 rounded-md flex items-center justify-center text-4xl font-black shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10"
                      style={{ 
                        backgroundColor: result.colors[i] || '#333',
                        color: '#fff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => { setResult(null); setPin(''); }}
                    className="w-full text-xs text-zinc-500 hover:text-cyan-400 uppercase tracking-widest transition-colors"
                  >
                    RESET_NODE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import { GetServerSideProps } from 'next';
import { supabaseAdmin } from '../lib/supabaseServer';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ip = (context.req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || context.req.socket.remoteAddress || 'unknown';
  
  if (ip !== 'unknown') {
    const { data } = await supabaseAdmin
      .from('admin_banned_ips')
      .select('banned_until')
      .eq('ip_address', ip)
      .maybeSingle();

    if (data && new Date(data.banned_until) > new Date()) {
      return {
        redirect: {
          destination: '/yourareadmin?reason=banned_24h',
          permanent: false,
        }
      };
    }
  }

  return { props: {} };
};
