import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FaRobot,
  FaWhatsapp,
  FaKey,
  FaCopy,
  FaCheck,
  FaSyncAlt,
  FaArrowLeft,
  FaBolt,
  FaShieldAlt,
  FaMobileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTerminal,
  FaCode,
  FaExternalLinkAlt
} from 'react-icons/fa';

const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://www.mrsaqib.me/pair#webapp',
      name: 'Saqib MD WhatsApp Web Pairing Portal',
      alternateName: ['Saqib MD Pairing Code', 'Saqib Bot Pair', 'SAQ1-BXMD Web Pair'],
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Android, iOS, Windows, macOS, Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      description: 'Official WhatsApp web pairing code generator for Saqib MD Bot. Connect your WhatsApp multi-device session instantly using custom pairing code SAQ1-BXMD with zero latency and 24/7 cloud uptime.',
      url: 'https://www.mrsaqib.me/pair',
      author: {
        '@type': 'Person',
        name: 'Muhammad Saqib',
        url: 'https://www.mrsaqib.me'
      }
    }
  ]
};

export default function PairPage() {
  const [phonePrefix, setPhonePrefix] = useState('92');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customCode, setCustomCode] = useState('SAQ1BXMD');
  const [useCustomCode, setUseCustomCode] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [rawCode, setRawCode] = useState<string | null>(null);
  const [pairedNumber, setPairedNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [countdown, setCountdown] = useState<number>(120);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Countdown handler
  useEffect(() => {
    if (pairingCode && countdown > 0 && !isConnected) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      };
    }
  }, [pairingCode, countdown, isConnected]);

  // Polling for connection status
  useEffect(() => {
    if (pairingCode && pairedNumber && !isConnected && countdown > 0) {
      pollTimerRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/pair?action=status&number=${encodeURIComponent(pairedNumber)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.connected || data.isConnected) {
              setIsConnected(true);
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            }
          }
        } catch (_) {}
      }, 4000);

      return () => {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      };
    }
  }, [pairingCode, pairedNumber, isConnected, countdown]);

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCopied(false);

    let cleanInput = phoneNumber.trim().replace(/[^0-9]/g, '');
    if (!cleanInput) {
      setError('Please enter your WhatsApp phone number.');
      return;
    }

    // Auto fix leading 0
    if (cleanInput.startsWith('0')) {
      cleanInput = cleanInput.substring(1);
    }

    // Full international number
    const fullNumber = cleanInput.startsWith(phonePrefix) ? cleanInput : `${phonePrefix}${cleanInput}`;

    if (fullNumber.length < 10 || fullNumber.length > 15) {
      setError('Invalid phone number length. Please check country code and number.');
      return;
    }

    setLoading(true);
    setPairingCode(null);
    setRawCode(null);
    setIsConnected(false);
    setCountdown(120);

    try {
      const codeToSend = useCustomCode ? (customCode.trim().toUpperCase() || 'SAQ1BXMD') : '';
      const response = await fetch('/api/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: fullNumber,
          code: codeToSend
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate pairing code. Please try again.');
      }

      setPairingCode(data.code || 'SAQ1-BXMD');
      setRawCode(data.rawCode || data.code?.replace(/[^A-Za-z0-9]/g, '') || 'SAQ1BXMD');
      setPairedNumber(fullNumber);
      if (data.isConnected) {
        setIsConnected(true);
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Please verify cluster status and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!rawCode && !pairingCode) return;
    const textToCopy = rawCode || (pairingCode ? pairingCode.replace(/[^A-Za-z0-9]/g, '') : '');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch (_) {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setPairingCode(null);
    setRawCode(null);
    setPairedNumber(null);
    setIsConnected(false);
    setError(null);
    setCountdown(120);
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col items-center justify-between p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      <Head>
        <title>Pair Saqib MD Bot | Connect WhatsApp Web Pairing Code (SAQ1-BXMD)</title>
        <meta
          name="description"
          content="Generate an instant WhatsApp Web Pairing Code for Saqib MD Bot. Connect your account in 5 seconds with custom pairing code SAQ1-BXMD. 100% free, 24/7 cloud uptime."
        />
        <meta
          name="keywords"
          content="saqib md pair, saqib bot pair code, whatsapp bot pairing code, saq1bxmd, link whatsapp bot, saqib md vercel, mr saqib bot pair, baileys pairing code"
        />
        <link rel="canonical" href="https://www.mrsaqib.me/pair" />
        <meta property="og:title" content="Pair Saqib MD Bot | Instant WhatsApp Pairing Code" />
        <meta property="og:description" content="Generate instant WhatsApp pairing code (SAQ1-BXMD) to run your Saqib MD user bot 24/7 with zero server configuration." />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:url" content="https://www.mrsaqib.me/pair" />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-xl flex items-center justify-between py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>mrsaqib.me</span>
        </Link>
        <Link
          href="/bot"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors font-mono"
        >
          <FaRobot className="w-3 h-3 text-cyan-400" />
          <span>Bot Hub</span>
        </Link>
      </header>

      {/* Main Container Card */}
      <main className="relative z-10 max-w-md w-full my-auto bg-slate-900/85 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-cyan-950/60 text-center">
        {/* Animated Robot / QR Icon */}
        <div className="w-18 h-18 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center">
          <div className="w-full h-full bg-[#08171b] rounded-[14px] flex items-center justify-center">
            <FaRobot className="w-9 h-9 text-cyan-400 animate-pulse" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-emerald-400" />
          <span>Official Web Pairing Engine</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Pair Saqib MD Bot
        </h1>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Link your WhatsApp account to the 24/7 cloud cluster with custom pairing code{' '}
          <span className="text-cyan-400 font-mono font-semibold">SAQ1-BXMD</span>.
        </p>

        {/* State 1: Input Form */}
        {!pairingCode && (
          <form onSubmit={handleGenerateCode} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FaMobileAlt className="text-cyan-400 w-3.5 h-3.5" />
                <span>WhatsApp Phone Number</span>
              </label>
              <div className="flex gap-2">
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                    +
                  </span>
                  <input
                    type="text"
                    value={phonePrefix}
                    onChange={e => setPhonePrefix(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="92"
                    maxLength={4}
                    className="w-full pl-6 pr-2 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-center"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="3478936242"
                    className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    autoFocus
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Enter your WhatsApp number without spaces or dashes (e.g. 03478936242).
              </p>
            </div>

            {/* Custom Code Accordion / Option */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer">
                  <FaKey className="text-emerald-400 w-3 h-3" />
                  <span>Custom Pairing Code</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="useCustom"
                    checked={useCustomCode}
                    onChange={e => setUseCustomCode(e.target.checked)}
                    className="w-3.5 h-3.5 accent-cyan-500 rounded cursor-pointer"
                  />
                  <label htmlFor="useCustom" className="text-[11px] text-slate-400 cursor-pointer">
                    Enable
                  </label>
                </div>
              </div>
              {useCustomCode && (
                <input
                  type="text"
                  value={customCode}
                  onChange={e => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="SAQ1BXMD"
                  maxLength={8}
                  className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-700/60 rounded-xl text-cyan-300 text-xs font-mono tracking-widest uppercase focus:outline-none focus:border-cyan-500"
                />
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <FaExclamationTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <>
                  <FaSyncAlt className="w-3.5 h-3.5 animate-spin" />
                  <span>Requesting Pairing Code...</span>
                </>
              ) : (
                <>
                  <FaKey className="w-3.5 h-3.5" />
                  <span>Get WhatsApp Pairing Code</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* State 2: Code Display */}
        {pairingCode && (
          <div className="space-y-5 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Connection Status Banner */}
            {isConnected ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/60 text-emerald-300 text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40">
                <FaCheckCircle className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span className="font-semibold">Successfully Connected! Bot is now Live.</span>
              </div>
            ) : countdown === 0 ? (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-center gap-2">
                <FaExclamationTriangle className="w-3.5 h-3.5" />
                <span>Pairing code expired. Please generate a fresh code.</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Code active for: </span>
                <span className="font-bold text-cyan-400">{countdown}s</span>
              </div>
            )}

            {/* Glowing Pairing Code Block */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
              <div className="relative bg-[#050c14] border border-cyan-500/50 rounded-xl p-5 shadow-inner">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-mono mb-2">
                  Your WhatsApp Pairing Code
                </p>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-wider text-cyan-300 select-all">
                  {pairingCode}
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  Linked number: +{pairedNumber}
                </p>
              </div>
            </div>

            {/* Action Buttons: 1-Click Copy & Reset */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCopyCode}
                className={`py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <FaCheck className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <FaCopy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <FaSyncAlt className="w-3 h-3" />
                <span>Pair Another</span>
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left text-xs space-y-2.5">
              <p className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px]">
                <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to link on your phone:</span>
              </p>
              <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>
                  Open <strong className="text-white">WhatsApp</strong> on your mobile.
                </li>
                <li>
                  Tap <strong className="text-white">Settings</strong> (or ⋮ menu) &gt; <strong className="text-white">Linked Devices</strong>.
                </li>
                <li>
                  Tap <strong className="text-white">Link a Device</strong>.
                </li>
                <li>
                  Tap <span className="text-cyan-400 font-medium">&quot;Link with phone number instead&quot;</span> at the bottom.
                </li>
                <li>
                  Type this 8-digit code:{' '}
                  <span className="font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {rawCode || pairingCode}
                  </span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-slate-800/80 text-[10px] text-slate-300">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Device</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaBolt className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero Lag</span>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-cyan-400" />
            <span>Encrypted</span>
          </div>
        </div>

        {/* SEO Information & FAQ */}
        <article className="mt-6 pt-4 border-t border-slate-800/80 text-left text-xs text-slate-400 space-y-3">
          <div>
            <h2 className="text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
              <FaTerminal className="text-cyan-400 w-3 h-3" />
              What is Saqib MD Web Pairing?
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Web pairing allows users to connect their WhatsApp account to <strong>Saqib MD Bot</strong> without scanning a QR code from another screen. Using WhatsApp official phone-number linking, your account connects directly to the Baileys cloud cluster.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold text-zinc-200 mb-1 flex items-center gap-1.5">
              <FaCode className="text-emerald-400 w-3 h-3" />
              Also Available in WhatsApp Chat
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-400">
              You can also generate your pairing code directly inside WhatsApp by messaging any bot group or DM with:{' '}
              <code className="text-cyan-400 font-mono">.pair 0347xxxxxxx</code> or{' '}
              <code className="text-cyan-400 font-mono">/pair 0347xxxxxxx</code>.
            </p>
          </div>
        </article>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Engineered by Muhammad Saqib</span>
          <span className="font-mono text-cyan-500/80">Saqib 242 • Gojra, PK</span>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 w-full max-w-xl text-center py-4 text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} Mr Saqib (mrsaqib.me) • All rights reserved.
      </footer>
    </div>
  );
}
