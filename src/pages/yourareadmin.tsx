import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { ShieldAlert, MapPin, Globe, Cpu, AlertOctagon, Terminal } from 'lucide-react';
import { useRouter } from 'next/router';

interface HackerData {
  ip: string;
  city: string;
  country: string;
  isp: string;
  userAgent: string;
}

export default function ShamePage() {
  const [data, setData] = useState<HackerData | null>(null);
  const [logged, setLogged] = useState(false);
  const router = useRouter();
  const { reason } = router.query;

  useEffect(() => {
    // Only run once
    if (logged) return;

    const trackHacker = async () => {
      let ip = 'Unknown IP';
      let city = 'Unknown City';
      let country = 'Unknown Country';
      let isp = 'Unknown ISP';

      try {
        // Primary IP API
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        if (ipData.ip) {
          ip = ipData.ip;
          city = ipData.city || city;
          country = ipData.country_name || country;
          isp = ipData.org || isp;
        }
      } catch (err) {
        // Fallback API if adblocker blocks ipapi.co
        try {
          const fallbackRes = await fetch('https://api.ipify.org?format=json');
          const fallbackData = await fallbackRes.json();
          if (fallbackData.ip) ip = fallbackData.ip;
        } catch (fallbackErr) {
          console.error('Failed to trace IP');
        }
      }

      const hackerInfo = {
        ip,
        city,
        country,
        isp,
        userAgent: window.navigator.userAgent || 'Unknown Device'
      };
      
      setData(hackerInfo);

      // Send to our backend to log in Supabase
      try {
        await fetch('/api/admin/security/log-hack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ip: hackerInfo.ip,
            userAgent: hackerInfo.userAgent,
            location: `${hackerInfo.city}, ${hackerInfo.country}`,
            isp: hackerInfo.isp,
            reason: reason || 'Unauthorized Intrusion Attempt'
          })
        });
      } catch (logErr) {
        console.error('Failed to save log to database');
      }

      setLogged(true);
    };

    trackHacker();
  }, [reason, logged]);

  return (
    <div className="min-h-screen bg-black text-rose-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-rose-900 selection:text-white">
      <Head>
        <title>INTRUSION BLOCKED</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Red flashing background effect */}
      <div className="absolute inset-0 bg-rose-900/10 animate-pulse pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-rose-600 animate-[pulse_2s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-600 animate-[pulse_2s_ease-in-out_infinite]" />

      <div className="max-w-2xl w-full bg-[#0a0000] border border-rose-900/50 rounded-2xl p-8 relative z-10 shadow-[0_0_50px_rgba(225,29,72,0.15)]">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 bg-rose-950/50 border border-rose-900 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(225,29,72,0.3)] animate-bounce">
            <AlertOctagon size={40} className="text-rose-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-rose-600 tracking-tighter mb-4 glitch-text">
            ACCESS DENIED
          </h1>
          <div className="bg-rose-950/80 border border-rose-900 px-6 py-4 rounded-lg inline-block transform -rotate-1">
            <p className="text-lg md:text-xl text-rose-300 font-bold leading-relaxed">
              "Beta ji, tum hacker ban chuke ho. Jao ja ker apna kaam karo. Isko hack karna tumhare bas ki baat nahi!"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-rose-400 mb-2 border-b border-rose-900/50 pb-2">
            <Terminal size={18} />
            <span className="font-bold uppercase tracking-widest text-sm">Intrusion Source Traced</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black border border-rose-950 rounded-lg p-4 flex items-start gap-3">
              <Globe className="text-rose-700 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mb-1">IP Address</p>
                <p className="text-sm text-rose-400 font-bold">{data?.ip || 'Tracing...'}</p>
              </div>
            </div>

            <div className="bg-black border border-rose-950 rounded-lg p-4 flex items-start gap-3">
              <MapPin className="text-rose-700 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mb-1">Location</p>
                <p className="text-sm text-rose-400 font-bold">{data ? `${data.city}, ${data.country}` : 'Tracing...'}</p>
              </div>
            </div>

            <div className="bg-black border border-rose-950 rounded-lg p-4 flex items-start gap-3">
              <ShieldAlert className="text-rose-700 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mb-1">ISP / Network</p>
                <p className="text-sm text-rose-400 font-bold">{data?.isp || 'Tracing...'}</p>
              </div>
            </div>

            <div className="bg-black border border-rose-950 rounded-lg p-4 flex items-start gap-3">
              <Cpu className="text-rose-700 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wider mb-1">Device Fingerprint</p>
                <p className="text-[10px] text-rose-500 truncate max-w-[200px]" title={data?.userAgent}>
                  {data?.userAgent || 'Extracting...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center border-t border-rose-900/30 pt-6">
          <p className="text-xs text-rose-600 font-bold tracking-[0.2em] uppercase animate-pulse">
            Status: ALL DETAILS REPORTED TO MASTER ADMIN
          </p>
        </div>

      </div>
    </div>
  );
}
