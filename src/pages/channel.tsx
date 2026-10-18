import { useEffect } from 'react';
import Head from 'next/head';
import { FaWhatsapp, FaExternalLinkAlt } from 'react-icons/fa';

const WHATSAPP_CHANNEL_URL = 'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I';

export default function ChannelRedirectPage() {
  useEffect(() => {
    // Immediate client-side redirection
    if (typeof window !== 'undefined') {
      window.location.replace(WHATSAPP_CHANNEL_URL);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        <title>Joining Mr Saqib Official WhatsApp Channel...</title>
        <meta name="description" content="Connecting to Muhammad Saqib (Mr Saqib) official VIP WhatsApp Channel for exclusive tech drops, project updates, and developer tools." />
        <meta httpEquiv="refresh" content={`0; url=${WHATSAPP_CHANNEL_URL}`} />
        <meta property="og:title" content="Join Mr Saqib Official WhatsApp Channel" />
        <meta property="og:description" content="Get instant updates, VIP project source codes, and development tools directly on WhatsApp." />
        <meta property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta property="og:url" content="https://mrsaqib242.com/channel" />
        <link rel="icon" href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
      </Head>

      {/* Cyberpunk background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-emerald-950/50">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#081b13] rounded-[14px] flex items-center justify-center">
            <FaWhatsapp className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to WhatsApp Channel...
        </h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Connecting you to <span className="text-emerald-400 font-semibold">Mr Saqib Official VIP Channel</span> for code drops, live tools, and tech updates.
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-emerald-400/90 font-mono font-medium">Opening WhatsApp application...</span>
        </div>

        <a
          href={WHATSAPP_CHANNEL_URL}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>Click Here if Not Redirected</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Portal</span>
          <span className="font-mono text-emerald-500/80">Saqib242</span>
        </div>
      </div>
    </div>
  );
}
