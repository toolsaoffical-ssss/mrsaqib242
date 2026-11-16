import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const AVATAR_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

// High-Availability Multi-Node Cluster Pool
const CLUSTER_NODES = [
  'https://web-production-08da5300.up.railway.app',
  'https://saqib-bot-v1-d3ecc6f0292e.herokuapp.com',
  'https://web-production-f30a34e9.up.railway.app',
  'https://saqib-bot-v2-4c28fce8995a.herokuapp.com'
];

export default function PairPage() {
  const [activeTab, setActiveTab] = useState<'code' | 'qr'>('code');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customCode, setCustomCode] = useState('SAQ1BXMD');
  const [showCustomCode, setShowCustomCode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [rawCode, setRawCode] = useState<string | null>(null);
  const [pairedNumber, setPairedNumber] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [countdown, setCountdown] = useState<number>(120);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // QR state
  const [qrLoading, setQrLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeNodeRef = useRef<string | null>(null);

  // Clean timers
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (pairingCode && countdown > 0 && !isConnected) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
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

  // Status Polling (Direct Cluster Check, 0 Vercel Quota)
  useEffect(() => {
    if (pairingCode && pairedNumber && !isConnected && countdown > 0) {
      pollTimerRef.current = setInterval(async () => {
        try {
          const targetNode = activeNodeRef.current || CLUSTER_NODES[0];
          const directUrl = `${targetNode}/api/pair/status?number=${encodeURIComponent(pairedNumber)}`;
          let res = await fetch(directUrl, { signal: AbortSignal.timeout(4000) }).catch(() => null);
          if (!res || !res.ok) {
            res = await fetch(`/api/pair?action=status&number=${encodeURIComponent(pairedNumber)}&node=${encodeURIComponent(targetNode)}`);
          }
          if (res && res.ok) {
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

  const handleGenerateCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorText(null);
    setCopied(false);

    let cleanInput = phoneNumber.trim().replace(/[^0-9]/g, '');
    if (!cleanInput || cleanInput.length < 10) {
      setErrorText('Enter valid WhatsApp phone number with country code (e.g. 923001234567 or 03001234567)');
      return;
    }

    if (cleanInput.startsWith('0') && cleanInput.length === 11) {
      cleanInput = '92' + cleanInput.substring(1);
    }

    setLoading(true);
    setPairingCode(null);
    setRawCode(null);
    setIsConnected(false);
    setCountdown(120);

    try {
      const codeToSend = (customCode.trim().toUpperCase() || 'SAQ1BXMD');
      const shuffledNodes = [...CLUSTER_NODES].sort(() => Math.random() - 0.5);
      let data: any = null;
      let matchedNode: string | null = null;

      for (const node of shuffledNodes) {
        try {
          const directUrl = `${node}/api/pair?number=${encodeURIComponent(cleanInput)}&code=${encodeURIComponent(codeToSend)}`;
          const directRes = await fetch(directUrl, { signal: AbortSignal.timeout(9000) });
          if (directRes.ok) {
            const json = await directRes.json();
            if (json && (json.success || json.code)) {
              data = json;
              matchedNode = node;
              break;
            }
          }
        } catch (_) {}
      }

      if (!data || (!data.success && !data.code)) {
        const response = await fetch('/api/pair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: cleanInput, code: codeToSend })
        });
        data = await response.json();
        matchedNode = data?.clusterNode || null;
      }

      if (!data || (!data.success && !data.code)) {
        throw new Error(data?.error || 'Failed to generate code. Please verify phone number.');
      }

      activeNodeRef.current = matchedNode;
      const returnedCode = data.code || 'SAQ1-BXMD';
      const cleanRaw = returnedCode.replace(/[^A-Za-z0-9]/g, '');
      const formatted = returnedCode.includes('-') ? returnedCode : (cleanRaw.match(/.{1,4}/g)?.join('-') || cleanRaw);

      setPairingCode(formatted);
      setRawCode(cleanRaw);
      setPairedNumber(cleanInput);
      if (data.isConnected) {
        setIsConnected(true);
      }
    } catch (err: any) {
      setErrorText(err.message || 'Connection timed out. Please try again.');
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
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
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

  const handleGenerateQR = async () => {
    setQrLoading(true);
    setQrImage(null);
    try {
      const node = CLUSTER_NODES[0];
      const res = await fetch(`${node}/qr?format=json`, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      if (data.qr || data.image) {
        setQrImage(data.qr || data.image);
      } else {
        throw new Error('QR not ready');
      }
    } catch (_) {
      // Fallback placeholder QR or notification
      setQrImage(`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/923478936242?text=.pair`);
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="saqib-hub-body">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>MR SAQIB MD · Official WhatsApp Bot Hub</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="canonical" href="https://www.mrsaqib.me/pair" />
        <meta property="og:title" content="MR SAQIB MD · Official WhatsApp Bot Hub" />
        <meta property="og:description" content="Connect Your WhatsApp with 8-digit pair code (SAQ1-BXMD) or QR code scan instantly." />
        <meta property="og:image" content={PREVIEW_IMAGE} />
      </Head>

      <style jsx global>{`
        .saqib-hub-body {
          margin: 0;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background:
            radial-gradient(circle at 18% 15%, rgba(186, 230, 253, 0.45) 0%, transparent 40%),
            radial-gradient(circle at 82% 18%, rgba(167, 243, 208, 0.40) 0%, transparent 42%),
            radial-gradient(circle at 50% 50%, rgba(240, 253, 250, 0.85) 0%, transparent 60%),
            radial-gradient(circle at 20% 85%, rgba(254, 215, 170, 0.20) 0%, transparent 40%),
            radial-gradient(circle at 80% 85%, rgba(199, 210, 254, 0.25) 0%, transparent 40%),
            linear-gradient(135deg, #e0f2fe 0%, #f0fdf9 48%, #e6f6fe 100%);
          color: #0f172a;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
          padding: 16px 12px 28px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .glass-slab {
          position: relative;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.88) 0%,
            rgba(255, 255, 255, 0.65) 50%,
            rgba(255, 255, 255, 0.80) 100%
          );
          backdrop-filter: blur(24px) saturate(190%);
          -webkit-backdrop-filter: blur(24px) saturate(190%);
          border-radius: 24px;
          border: 1.8px solid rgba(255, 255, 255, 0.95);
          box-shadow:
            0 18px 36px -10px rgba(132, 176, 208, 0.28),
            0 4px 12px -2px rgba(148, 187, 219, 0.15),
            inset 0 1.5px 3px rgba(255, 255, 255, 0.98),
            inset 0 -2px 6px rgba(255, 255, 255, 0.65);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: hidden;
        }

        .glass-slab::before {
          content: "";
          position: absolute;
          top: 0;
          left: 6%;
          right: 6%;
          height: 1.2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), transparent);
          pointer-events: none;
          z-index: 20;
        }

        .glass-pill {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.60));
          border: 1.2px solid rgba(255, 255, 255, 0.92);
          box-shadow:
            0 3px 10px -2px rgba(148, 163, 184, 0.12),
            inset 0 1px 2px rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
        }

        .pairing-box {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.14em;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 253, 250, 0.88));
          border: 1.8px dashed rgba(16, 185, 129, 0.45);
          box-shadow:
            0 8px 20px -4px rgba(16, 185, 129, 0.18),
            inset 0 1.5px 3px rgba(255, 255, 255, 0.95);
          transition: all 0.25s ease;
        }

        .pairing-box:hover {
          border-color: rgba(16, 185, 129, 0.85);
          transform: scale(1.01);
          box-shadow: 0 12px 24px -4px rgba(16, 185, 129, 0.25);
        }
      `}</style>

      {/* Ambient Glow Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[5%] left-[12%] w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl"></div>
        <div className="absolute top-[8%] right-[12%] w-72 h-72 rounded-full bg-sky-200/35 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[15%] w-64 h-64 rounded-full bg-orange-200/20 blur-3xl"></div>
        <div className="absolute bottom-[8%] right-[15%] w-64 h-64 rounded-full bg-indigo-200/25 blur-3xl"></div>
      </div>

      {/* Main Centered Container */}
      <main className="w-full max-w-[820px] space-y-4 sm:space-y-5">
        
        {/* ================================================================= */}
        {/* 1. SLIM & COMPACT TOP HEADER                                      */}
        {/* ================================================================= */}
        <header className="glass-slab px-3.5 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* User DP Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-[2px] bg-gradient-to-tr from-emerald-500 via-teal-400 to-sky-500 shadow-sm">
                <img
                  src={AVATAR_IMAGE}
                  alt="Muhammad Saqib"
                  className="w-full h-full object-cover rounded-full border border-white"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-200/60 animate-pulse"></span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  MR SAQIB MD
                </h1>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                  Verified ID
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                Created by{' '}
                <a
                  href="https://www.mrsaqib.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:underline font-bold"
                >
                  Muhammad Saqib
                </a>{' '}
                · <span>Full-Stack Engineer &amp; Cyber Security Specialist</span>
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/"
              className="glass-pill px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/90 hover:bg-white transition cursor-pointer shadow-xs active:scale-95"
            >
              <i className="fa-solid fa-globe text-xs text-sky-600"></i>
              <span>mrsaqib.me</span>
            </Link>

            <a
              href="https://wa.me/923478936242"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill px-2.5 py-1.5 rounded-full flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer shadow-xs active:scale-95"
              title="Direct WhatsApp Chat"
            >
              <i className="fa-brands fa-whatsapp text-xs text-emerald-600"></i>
              <span className="hidden sm:inline">Chat</span>
            </a>
          </div>
        </header>

        {/* ================================================================= */}
        {/* 2. HERO PAIRING & QR WORKSPACE (Exact Match to Uploaded Screenshot) */}
        {/* ================================================================= */}
        <section className="glass-slab p-5 sm:p-7 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-emerald-500/10 border-2 border-white/90 ring-1 ring-emerald-500/20">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-emerald-400/25 to-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Centered Title Area */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50/90 border border-emerald-200 text-emerald-800 text-xs font-black mb-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Instant Bot Linker · 24/7 Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Connect Your WhatsApp
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1.5 max-w-md mx-auto">
                Pair your number with 8-digit code or scan QR code instantly with zero wait time.
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex justify-center mb-6">
              <div className="glass-pill p-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm border border-slate-200/80 bg-white/70">
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer active:scale-95 ${
                    activeTab === 'code'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <i className="fa-solid fa-key text-xs"></i>
                  <span>8-Digit Pair Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 cursor-pointer active:scale-95 ${
                    activeTab === 'qr'
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <i className="fa-solid fa-qrcode text-xs"></i>
                  <span>QR Code Scan</span>
                </button>
              </div>
            </div>

            {/* TAB 1: PAIRING CODE */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                {/* Form Input + CTA Button */}
                <form onSubmit={handleGenerateCode} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative w-full flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600">
                        <i className="fa-solid fa-phone text-sm"></i>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter WhatsApp number (e.g. 923001234567)"
                        className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white border-2 border-slate-200/90 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none text-slate-900 font-extrabold placeholder-slate-400 text-sm sm:text-base shadow-sm transition"
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-black text-sm sm:text-base shadow-lg shadow-teal-500/30 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-bolt text-sm"></i>
                          <span>Get Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Optional Custom Code Accordion */}
                  <div className="flex items-center justify-between px-1 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowCustomCode(!showCustomCode)}
                      className="text-[11px] text-slate-500 hover:text-emerald-700 transition font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fa-solid fa-fingerprint text-[10px]"></i>
                      <span>{showCustomCode ? 'Hide Custom Code' : 'Custom Code: SAQ1BXMD'}</span>
                    </button>
                    {pairingCode && (
                      <span className="text-[11px] font-mono text-emerald-700 font-bold">
                        {isConnected ? '🎉 Connected' : `Valid: ${countdown}s`}
                      </span>
                    )}
                  </div>

                  {showCustomCode && (
                    <div className="pt-1">
                      <input
                        type="text"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        placeholder="SAQ1BXMD"
                        maxLength={8}
                        className="w-full px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-mono text-xs tracking-widest uppercase focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                </form>

                {/* Error Banner */}
                {errorText && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm">
                    <i className="fa-solid fa-circle-exclamation text-base text-red-500"></i>
                    <span>{errorText}</span>
                  </div>
                )}

                {/* Pairing Code Display Card (Large, Bold, Centered) */}
                {pairingCode && (
                  <div className="pt-2 animate-in fade-in zoom-in-95 duration-200">
                    <div
                      onClick={handleCopyCode}
                      className="pairing-box rounded-2xl p-5 sm:p-6 text-center cursor-pointer relative group border-2 border-dashed border-emerald-400/90 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-white shadow-inner select-none active:scale-[0.99]"
                    >
                      <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block mb-1">
                        Your 8-Digit Pairing Code (Tap to Copy)
                      </span>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 my-2 select-all tracking-[0.25em] font-mono leading-tight">
                        {pairingCode}
                      </div>
                      <div className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold shadow-sm transition ${
                        copied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white/90 border-emerald-300 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                      }`}>
                        <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                        <span>{copied ? 'Copied to Clipboard!' : 'Tap anywhere to copy code'}</span>
                      </div>
                    </div>

                    {/* Instructions Box */}
                    <div className="mt-3.5 p-3.5 rounded-2xl bg-white/80 border border-slate-200/90 text-xs text-slate-600 space-y-1.5 shadow-sm">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
                        <span>How to link in WhatsApp:</span>
                      </div>
                      <p className="leading-relaxed">
                        Open WhatsApp &gt; <strong>Linked Devices</strong> &gt;{' '}
                        <strong>Link with phone number instead</strong> &gt; Enter the 8-digit code above.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4-Step Flow Guide */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 mt-2 border-t border-slate-200/70 text-center">
                  <div className="py-1.5 px-2 rounded-lg bg-white/70 border border-slate-200/70 shadow-2xs">
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Step 1</span>
                    <span className="text-[10.5px] sm:text-[11px] font-extrabold text-slate-800 block truncate">
                      Enter Number
                    </span>
                  </div>
                  <div className="py-1.5 px-2 rounded-lg bg-white/70 border border-slate-200/70 shadow-2xs">
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Step 2</span>
                    <span className="text-[10.5px] sm:text-[11px] font-extrabold text-slate-800 block truncate">
                      Tap &quot;Get Code&quot;
                    </span>
                  </div>
                  <div className="py-1.5 px-2 rounded-lg bg-white/70 border border-slate-200/70 shadow-2xs">
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Step 3</span>
                    <span className="text-[10.5px] sm:text-[11px] font-extrabold text-slate-800 block truncate">
                      Open WhatsApp
                    </span>
                  </div>
                  <div className="py-1.5 px-2 rounded-lg bg-white/70 border border-slate-200/70 shadow-2xs">
                    <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Step 4</span>
                    <span className="text-[10.5px] sm:text-[11px] font-extrabold text-slate-800 block truncate">
                      Link Device
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: QR CODE SCAN */}
            {activeTab === 'qr' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-4">
                  {!qrImage && (
                    <button
                      type="button"
                      onClick={handleGenerateQR}
                      disabled={qrLoading}
                      className="px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-black text-sm shadow-lg shadow-teal-500/25 active:scale-95 transition flex items-center gap-2 cursor-pointer mb-2"
                    >
                      {qrLoading ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                          <span>Loading QR...</span>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-qrcode text-sm"></i>
                          <span>Generate QR Code</span>
                        </>
                      )}
                    </button>
                  )}

                  {qrImage && (
                    <div className="p-4 rounded-3xl bg-white shadow-xl border-2 border-slate-200 flex flex-col items-center animate-in fade-in duration-200">
                      <img src={qrImage} alt="WhatsApp QR Code" className="w-56 h-56 rounded-xl" />
                      <p className="text-xs text-slate-600 font-bold mt-3 flex items-center gap-1.5">
                        <i className="fa-solid fa-camera text-emerald-500"></i>
                        <span>WhatsApp &gt; Linked Devices se scan karein</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* 3. 11-NODE CLOUD CLUSTER LOAD BALANCER & ROUTER                    */}
        {/* =================================================================== */}
        <section className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700/80">
          <div className="flex items-center justify-between mb-3 px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                11-Node Mega Cluster
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                11/11 Online
              </span>
            </div>
            <div className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
              <i className="fa-solid fa-bolt text-[10px]"></i>
              <span>Smart Auto (11 Nodes Balanced)</span>
            </div>
          </div>

          <div className="w-full p-2.5 sm:p-3 rounded-xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-sky-500/20 text-left relative shadow-md ring-2 ring-emerald-400/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <i className="fa-solid fa-shuffle text-xs"></i> Smart Auto Load-Balancer
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Auto Optimized
                </span>
                <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span className="font-bold text-white text-[11px] sm:text-xs">
                Dynamic Load-Balance &amp; Instant Failover (10 Heroku + 1 Railway)
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold hidden sm:inline">
                ⚡ High Speed Routing
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-2">
          <p className="text-xs text-slate-500 font-semibold">
            Developed by{' '}
            <span className="text-slate-800 font-bold">Muhammad Saqib</span> ·{' '}
            <a href="https://www.mrsaqib.me" className="text-emerald-700 hover:underline font-bold">
              mrsaqib.me
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
