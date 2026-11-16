import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';
const AVATAR_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png';

// High-Availability Multi-Node Cluster Pool
const CLUSTER_NODES = [
  'https://web-production-08da5300.up.railway.app',
  'https://saqib-bot-v1-d3ecc6f0292e.herokuapp.com',
  'https://web-production-f30a34e9.up.railway.app',
  'https://saqib-bot-v2-4c28fce8995a.herokuapp.com'
];

export default function PairPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customCode, setCustomCode] = useState('SAQ1BXMD');
  const [showCustomCode, setShowCustomCode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [rawCode, setRawCode] = useState<string | null>(null);
  const [pairedNumber, setPairedNumber] = useState<string | null>(null);

  // Live cluster stats
  const [apiOnline, setApiOnline] = useState<boolean>(true);
  const [apiSessionCount, setApiSessionCount] = useState<number>(6);
  const [botCount, setBotCount] = useState<number>(6);

  const [countdown, setCountdown] = useState<number>(120);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeNodeRef = useRef<string | null>(null);

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

  // Polling for connection status with sticky node affinity (Zero Vercel quota used)
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
              setSuccessText('🎉 Device Successfully Linked! Bot is now active 24/7.');
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

  // Real-time API Ping & Active Bot Counter
  useEffect(() => {
    async function checkHealthAndCounts() {
      for (const node of CLUSTER_NODES) {
        try {
          const res = await fetch(`${node}/ping`, { signal: AbortSignal.timeout(3500) });
          if (res.ok) {
            const data = await res.json();
            setApiOnline(true);
            const count = data.activeSessions || data.pairedSessions || data.activesession || 6;
            setApiSessionCount(count);
            setBotCount(count);
            return;
          }
        } catch (_) {}
      }
      setApiOnline(false);
    }

    checkHealthAndCounts();
    const interval = setInterval(checkHealthAndCounts, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorText(null);
    setSuccessText(null);
    setCopied(false);

    let cleanInput = phoneNumber.trim().replace(/[^0-9]/g, '');
    if (!cleanInput || cleanInput.length < 10) {
      setErrorText('Enter valid WhatsApp phone number with country code (e.g. 923478936242 or 03478936242)');
      return;
    }

    // Auto fix Pakistani 03xxxxxxxxx -> 923xxxxxxxxx
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
      
      // Dynamic Multi-Node Cluster Failover (0 Vercel compute!)
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

      // Fallback to internal proxy if direct fetch fails
      if (!data || (!data.success && !data.code)) {
        const response = await fetch('/api/pair', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number: cleanInput,
            code: codeToSend
          })
        });
        data = await response.json();
        matchedNode = data?.clusterNode || null;
      }

      if (!data || (!data.success && !data.code)) {
        throw new Error(data?.error || 'Failed to generate code. Please check your number.');
      }

      activeNodeRef.current = matchedNode;
      const returnedCode = data.code || 'SAQ1-BXMD';
      const cleanRaw = returnedCode.replace(/[^A-Za-z0-9]/g, '');
      const formatted = returnedCode.includes('-') ? returnedCode : (cleanRaw.match(/.{1,4}/g)?.join('-') || cleanRaw);

      setPairingCode(formatted);
      setRawCode(cleanRaw);
      setPairedNumber(cleanInput);
      setSuccessText('✅ Code generated! Click button below to copy.');
      if (data.isConnected) {
        setIsConnected(true);
      }
    } catch (err: any) {
      setErrorText(err.message || '❌ API Connection Failed. Check server or try again.');
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
      setSuccessText(`✅ Code copied to clipboard: ${textToCopy}`);
      setTimeout(() => setCopied(false), 4000);
    } catch (_) {
      setCopied(false);
    }
  };

  return (
    <div className="pair-page-wrapper">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
        <title>Saqib • Bot Connect</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="canonical" href="https://www.mrsaqib.me/pair" />
        <meta property="og:title" content="Saqib • Bot Connect | WhatsApp Web Pairing" />
        <meta property="og:description" content="Official WhatsApp web pairing code generator for Saqib MD Bot. Connect your account in 5 seconds." />
        <meta property="og:image" content={PREVIEW_IMAGE} />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        .pair-page-wrapper {
          font-family: 'Outfit', sans-serif;
          background: #050508;
          min-height: 100vh;
          color: white;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* ========== RGB BORDER ========== */
        .avatar-rgb-border {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .avatar-rgb-border::before {
          content: '';
          position: absolute;
          top: -4px; left: -4px; right: -4px; bottom: -4px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
          animation: rotateRGB 3s linear infinite;
          z-index: 1;
        }

        .avatar-rgb-border img {
          position: relative;
          width: 92px;
          height: 92px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #0a0a14;
          z-index: 2;
        }

        @keyframes rotateRGB {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .rgb-border-rotate {
          position: relative;
          border-radius: 32px;
          background: #050508;
          padding: 3px;
          width: 100%;
        }

        .rgb-border-rotate::before {
          content: '';
          position: absolute;
          inset: -3px;
          background: conic-gradient(from 0deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
          animation: rotateRGB 4s linear infinite;
          z-index: 0;
          border-radius: 34px;
        }

        .rgb-border-static {
          position: relative;
          border-radius: 28px;
          background: #050508;
          padding: 2px;
          width: 100%;
        }

        .rgb-border-static::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #4285F4, #A855F7, #EC4899, #34A853, #FBBC05, #EA4335, #4285F4);
          background-size: 400% 400%;
          animation: gradientShift 5s ease infinite;
          z-index: 0;
          border-radius: 30px;
        }

        .card-inner {
          position: relative;
          background: rgba(15, 15, 25, 0.98);
          backdrop-filter: blur(25px);
          border-radius: 24px;
          padding: 18px;
          z-index: 1;
        }

        .stat-card-rgb {
          position: relative;
          border-radius: 18px;
          background: #050508;
          padding: 1.5px;
        }

        .stat-card-rgb::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          background: linear-gradient(135deg, #4285F4, #A855F7, #EC4899);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          z-index: 0;
          opacity: 0.7;
          border-radius: 19px;
        }

        .stat-card-inner {
          position: relative;
          background: rgba(20, 20, 35, 0.95);
          border-radius: 16px;
          padding: 14px 8px;
          text-align: center;
          z-index: 1;
        }

        .input-wrapper-rgb {
          position: relative;
          border-radius: 18px;
          background: #050508;
          padding: 2px;
        }

        .input-wrapper-rgb::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335);
          background-size: 300% 300%;
          animation: gradientShift 4s ease infinite;
          z-index: 0;
          opacity: 0.6;
          border-radius: 20px;
        }

        .input-rgb {
          position: relative;
          width: 100%;
          padding: 16px 20px 16px 50px;
          background: rgba(15, 15, 30, 0.9);
          border: none;
          border-radius: 16px;
          color: white;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          z-index: 1;
        }

        .input-rgb:focus {
          outline: none;
          background: rgba(25, 25, 45, 1);
        }

        .input-rgb::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .btn-rgb {
          padding: 16px 20px;
          border-radius: 18px;
          font-weight: 600;
          font-size: 15px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          color: white;
          font-family: 'Outfit', sans-serif;
          transition: transform 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4285F4, #A855F7, #EC4899);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
        }

        .btn-primary:active { transform: scale(0.97); }

        .btn-copy-action {
          background: linear-gradient(135deg, #34A853, #4ADE80);
          box-shadow: 0 8px 25px rgba(52, 168, 83, 0.4);
        }

        .code-box-rgb {
          position: relative;
          border-radius: 20px;
          background: #050508;
          padding: 2px;
        }

        .code-box-rgb::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: conic-gradient(from 0deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
          animation: rotateRGB 4s linear infinite;
          z-index: 0;
          opacity: 0.7;
          border-radius: 22px;
        }

        .code-box-inner {
          position: relative;
          background: rgba(0, 0, 0, 0.65);
          border-radius: 18px;
          padding: 20px;
          text-align: center;
          z-index: 1;
        }

        .code-number {
          font-size: 38px;
          font-weight: 800;
          letter-spacing: 8px;
          background: linear-gradient(135deg, #4285F4, #A855F7, #EC4899);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Courier New', monospace;
        }

        .social-icon-rgb {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          color: white;
          text-decoration: none;
        }

        .social-icon-rgb:hover {
          transform: translateY(-4px);
          background: linear-gradient(135deg, #4285F4, #A855F7);
          border-color: transparent;
        }

        .msg-box {
          padding: 14px 16px;
          border-radius: 16px;
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }

        .msg-error {
          background: rgba(234, 67, 53, 0.12);
          border: 1.5px solid rgba(234, 67, 53, 0.3);
          color: #F85149;
        }

        .msg-success {
          background: rgba(52, 168, 83, 0.12);
          border: 1.5px solid rgba(52, 168, 83, 0.3);
          color: #3FB950;
        }

        .badge-rgb {
          background: linear-gradient(135deg, #4285F4, #34A853);
          padding: 4px 10px;
          border-radius: 30px;
          font-size: 10px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .spinner {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .api-status {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 10px;
        }

        .api-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #34A853;
          animation: pulse 1.5s infinite;
        }

        .api-dot.offline {
          background: #F85149;
          animation: none;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 400px) {
          .pair-page-wrapper { padding: 8px; }
          .card-inner { padding: 14px; }
          .code-number { font-size: 30px; letter-spacing: 5px; }
          .avatar-rgb-border { width: 85px; height: 85px; }
          .avatar-rgb-border img { width: 78px; height: 78px; }
        }
      `}</style>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto space-y-3">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-2 text-xs font-mono text-gray-400">
          <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
            <i className="fas fa-arrow-left"></i> mrsaqib.me
          </Link>
          <Link href="/bot" className="hover:text-purple-400 transition-colors flex items-center gap-1.5">
            <i className="fas fa-robot"></i> Bot Hub
          </Link>
        </div>

        {/* ========== PROFILE SECTION ========== */}
        <div className="rgb-border-rotate">
          <div className="card-inner">
            <div className="flex items-start gap-4">
              <div className="avatar-rgb-border">
                <img src={AVATAR_IMAGE} alt="Saqib" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-rgb">
                    <i className="fas fa-check-circle text-white text-[8px]"></i> VERIFIED
                  </span>
                  <span className="text-gray-400 text-xs">🎂 17 Y/O</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">MUHAMMAD SAQIB</h1>
                <p className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                  <i className="fas fa-map-pin text-blue-400 text-[10px]"></i> Faisalabad, Pakistan
                </p>
                <p className="text-gray-500 text-[10px] mt-1">
                  <i className="fas fa-phone text-green-400"></i> +92 347 8936242
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="stat-card-rgb">
                <div className="stat-card-inner">
                  <i className="fas fa-robot text-blue-400 text-lg mb-1"></i>
                  <div className="text-xl font-bold">{botCount}</div>
                  <div className="text-[9px] text-gray-400 uppercase">Active</div>
                </div>
              </div>
              <div className="stat-card-rgb">
                <div className="stat-card-inner">
                  <i className="fas fa-code text-purple-400 text-lg mb-1"></i>
                  <div className="text-xl font-bold">150+</div>
                  <div className="text-[9px] text-gray-400 uppercase">Commands</div>
                </div>
              </div>
              <div className="stat-card-rgb">
                <div className="stat-card-inner">
                  <i className="fas fa-globe text-green-400 text-lg mb-1"></i>
                  <div className="text-xl font-bold">24/7</div>
                  <div className="text-[9px] text-gray-400 uppercase">Online</div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex justify-around mt-4">
              <a href="https://wa.me/923478936242" target="_blank" rel="noopener noreferrer" className="social-icon-rgb">
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
              <a href="https://www.instagram.com/mr_saqib242" target="_blank" rel="noopener noreferrer" className="social-icon-rgb">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="https://www.tiktok.com/@mr_saqib_242" target="_blank" rel="noopener noreferrer" className="social-icon-rgb">
                <i className="fab fa-tiktok text-lg"></i>
              </a>
              <a href="https://www.mrsaqib.me" target="_blank" rel="noopener noreferrer" className="social-icon-rgb">
                <i className="fas fa-globe text-xl"></i>
              </a>
              <a href="mailto:mrsaqib242242@gmail.com" className="social-icon-rgb">
                <i className="fas fa-envelope text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        {/* ========== PAIRING SECTION ========== */}
        <div className="rgb-border-static">
          <div className="card-inner">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <i className="fas fa-link text-white"></i>
              </div>
              <div>
                <h2 className="font-bold text-base">Connect WhatsApp Bot</h2>
                <p className="text-gray-400 text-[10px]">Pair your number to get started</p>
              </div>
            </div>
            
            {/* API Status */}
            <div className="api-status">
              <span className={`api-dot ${apiOnline ? '' : 'offline'}`}></span>
              <span className="text-gray-400">
                {apiOnline ? `✅ API Online • ${apiSessionCount} sessions` : '⚠️ Cluster Reconnecting...'}
              </span>
            </div>
            
            {/* Form */}
            <form onSubmit={handleGenerateCode}>
              {/* Phone Input */}
              <div className="input-wrapper-rgb mt-2">
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10"></i>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input-rgb"
                    placeholder="923001234567"
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* Custom Code Accordion Toggle */}
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowCustomCode(!showCustomCode)}
                  className="text-[10px] text-gray-400 hover:text-cyan-400 transition-colors font-mono cursor-pointer"
                >
                  <i className="fas fa-key text-[9px] mr-1"></i>
                  {showCustomCode ? 'Hide Custom Code' : 'Custom Code: SAQ1BXMD'}
                </button>
              </div>

              {showCustomCode && (
                <div className="input-wrapper-rgb mt-1.5">
                  <div className="relative">
                    <i className="fas fa-fingerprint absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10"></i>
                    <input
                      type="text"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      className="input-rgb tracking-widest uppercase font-mono text-cyan-300"
                      placeholder="SAQ1BXMD"
                      maxLength={8}
                    />
                  </div>
                </div>
              )}
              
              {/* Generate Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-rgb btn-primary mt-3 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>Connecting Cluster...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-key"></i>
                    <span>Generate Pairing Code</span>
                  </>
                )}
              </button>
            </form>
            
            {/* Code Display */}
            {pairingCode && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <div className="code-box-rgb mt-3">
                  <div className="code-box-inner">
                    {/* Countdown / Connection Banner */}
                    <div className="mb-2 text-xs font-mono text-gray-400">
                      {isConnected ? (
                        <span className="text-green-400 font-bold">🎉 Linked Successfully!</span>
                      ) : countdown > 0 ? (
                        <span>Valid for: <strong className="text-cyan-400">{countdown}s</strong></span>
                      ) : (
                        <span className="text-amber-400">Code Expired</span>
                      )}
                    </div>

                    <div className="code-number select-all">{pairingCode}</div>
                    
                    <button
                      type="button"
                      className="btn-rgb btn-copy-action mt-4 cursor-pointer"
                      onClick={handleCopyCode}
                    >
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Code & Continue'}</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                    
                    <p className="text-gray-400 text-[9px] mt-3">
                      <i className="fas fa-info-circle"></i> Open WhatsApp &gt; Linked Devices &gt; Link with phone number instead
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Messages */}
            {errorText && (
              <div className="msg-box msg-error">
                <i className="fas fa-exclamation-circle shrink-0"></i>
                <span>{errorText}</span>
              </div>
            )}
            {successText && (
              <div className="msg-box msg-success">
                <i className="fas fa-check-circle shrink-0"></i>
                <span>{successText}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center py-3">
          <p className="text-gray-500 text-[9px]">
            <i className="fas fa-heart text-red-400"></i> Developed by{' '}
            <span className="text-white font-semibold">MUHAMMAD SAQIB</span> •{' '}
            <a href="https://www.mrsaqib.me" className="text-blue-400 hover:underline">
              mrsaqib.me
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
