import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

const AVATAR_IMAGE = '/avatar.png';
const AVATAR_FALLBACK = 'https://ik.imagekit.io/19imy4f1u/lite_1775822697436_IXJPba-z2.png';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

interface ClusterNode {
  id: string;
  name: string;
  short: string;
  url: string;
  type: 'Heroku' | 'Railway';
  online: boolean;
  active: number;
  ping: number | null;
}

const CLUSTER_CONFIG: Record<string, ClusterNode> = {
  s1: { id: 's1', name: 'Node 1 (Heroku-1)', short: 'Heroku-1', url: 'https://saqib-bot-v1-d3ecc6f0292e.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s2: { id: 's2', name: 'Node 2 (Heroku-2)', short: 'Heroku-2', url: 'https://saqib-bot-s2-1cceb03e9698.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s3: { id: 's3', name: 'Node 3 (Heroku-3)', short: 'Heroku-3', url: 'https://saqibbot3-bb2b46aa1cb4.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s4: { id: 's4', name: 'Node 4 (Heroku-4)', short: 'Heroku-4', url: 'https://saqibot4-1469f73b3d77.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s5: { id: 's5', name: 'Node 5 (Heroku-5)', short: 'Heroku-5', url: 'https://saqibbot5-5ffa090fe31f.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s6: { id: 's6', name: 'Node 6 (Heroku-6)', short: 'Heroku-6', url: 'https://saqibot6-061b6d17645d.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s7: { id: 's7', name: 'Node 7 (Heroku-7)', short: 'Heroku-7', url: 'https://saqibot7-b9d00e67a587.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s8: { id: 's8', name: 'Node 8 (Heroku-8)', short: 'Heroku-8', url: 'https://saqibbot8-f10fafc8b934.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s9: { id: 's9', name: 'Node 9 (Heroku-9)', short: 'Heroku-9', url: 'https://saqibbot9-bebb531508e3.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  s10: { id: 's10', name: 'Node 10 (Heroku-10)', short: 'Heroku-10', url: 'https://saqibot10-d27e9f3ad01e.herokuapp.com', type: 'Heroku', online: true, active: 0, ping: null },
  railway: { id: 'railway', name: 'Node 11 (Railway)', short: 'Railway-11', url: 'https://web-production-08da5300.up.railway.app', type: 'Railway', online: true, active: 0, ping: null }
};

interface CommandItem {
  cmd: string;
  desc: string;
  cat: 'music' | 'ai' | 'group' | 'fun' | 'all';
}

const COMMAND_LIST: CommandItem[] = [
  { cmd: '.play Believer', desc: 'MP3 Song Download', cat: 'music' },
  { cmd: '.ytmp4 funny video', desc: 'HD Video Download', cat: 'music' },
  { cmd: '.tt https://vt.tiktok.com/...', desc: 'TikTok No Watermark', cat: 'music' },
  { cmd: '.ai What is artificial intelligence?', desc: 'Free Smart AI Chat', cat: 'ai' },
  { cmd: '.morning', desc: 'Morning Wishes', cat: 'fun' },
  { cmd: '.goodnight', desc: 'Bedtime Card', cat: 'fun' },
  { cmd: '.thanks', desc: 'Gratitude Reply', cat: 'fun' },
  { cmd: '.tagall', desc: 'Mention All Members', cat: 'group' },
  { cmd: '.hidetag Urgent Announcement', desc: 'Hidden Broadcast Tag', cat: 'group' },
  { cmd: '.antilink on', desc: 'Auto Delete Links', cat: 'group' },
  { cmd: '.weather Lahore', desc: 'Weather Forecast', cat: 'ai' },
  { cmd: '.menu', desc: 'All 700+ Commands', cat: 'all' }
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

  // Multi-Node Cluster State
  const [cluster, setCluster] = useState<Record<string, ClusterNode>>(CLUSTER_CONFIG);
  const [selectedServerMode, setSelectedServerMode] = useState<string>('auto');
  const autoCounterRef = useRef<number>(0);

  // Telemetry & Device State
  const [batteryLevel, setBatteryLevel] = useState<string>('--%');
  const [batteryCharging, setBatteryCharging] = useState<string>('Detecting');
  const [batteryStatusText, setBatteryStatusText] = useState<string>('Battery');
  const [batteryOffset, setBatteryOffset] = useState<number>(40);

  const [publicIp, setPublicIp] = useState<string>('Fetching IP...');
  const [ipLocation, setIpLocation] = useState<string>('Detecting Location...');
  const [pingMs, setPingMs] = useState<number>(18);
  const [pingOffset, setPingOffset] = useState<number>(30);

  const [deviceOs, setDeviceOs] = useState<string>('Detecting...');
  const [deviceBrowser, setDeviceBrowser] = useState<string>('Browser');
  const [deviceOsIcon, setDeviceOsIcon] = useState<string>('fa-solid fa-laptop text-indigo-700');
  const [screenRes, setScreenRes] = useState<string>('-- × --');
  const [cpuCores, setCpuCores] = useState<string>('8 Cores');
  const [deviceRam, setDeviceRam] = useState<string>('8 GB RAM');

  // Command Filter
  const [commandFilter, setCommandFilter] = useState<'all' | 'music' | 'ai' | 'group' | 'fun'>('all');
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Terminal Logs
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: number; time: string; text: string; type: 'info' | 'success' | 'error' }>>([
    { id: 1, time: '11:45:00', text: '⚡ MR SAQIB MD Dashboard Initialized.', type: 'success' },
    { id: 2, time: '11:45:01', text: 'Enter your phone number above to get pairing code.', type: 'info' }
  ]);

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeNodeRef = useRef<string | null>(null);
  const terminalBoxRef = useRef<HTMLDivElement | null>(null);

  const addLog = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [...prev.slice(-30), { id: Date.now() + Math.random(), time, text, type }]);
  };

  useEffect(() => {
    if (terminalBoxRef.current) {
      const savedScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      terminalBoxRef.current.scrollTop = terminalBoxRef.current.scrollHeight;
      if (typeof window !== 'undefined' && window.scrollY !== savedScrollY) {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      }
    }
  }, [terminalLogs]);

  // Clean timers on unmount
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
          const targetNode = activeNodeRef.current || cluster.s1.url;
          const directUrl = `${targetNode}/api/pair/status?number=${encodeURIComponent(pairedNumber)}`;
          let res = await fetch(directUrl, { signal: AbortSignal.timeout(4000) }).catch(() => null);
          if (!res || !res.ok) {
            res = await fetch(`/api/pair?action=status&number=${encodeURIComponent(pairedNumber)}&node=${encodeURIComponent(targetNode)}`);
          }
          if (res && res.ok) {
            const data = await res.json();
            if (data.connected || data.isConnected) {
              setIsConnected(true);
              addLog(`🎉 Connected! MR SAQIB MD is online for +${pairedNumber}!`, 'success');
              if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            }
          }
        } catch (_) {}
      }, 4000);

      return () => {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      };
    }
  }, [pairingCode, pairedNumber, isConnected, countdown, cluster]);

  // Ping Health & Latency for all 11 Cluster Nodes
  useEffect(() => {
    async function pingCluster() {
      const keys = Object.keys(cluster);
      const updated = { ...cluster };

      await Promise.allSettled(
        keys.map(async (k) => {
          const node = updated[k];
          const t0 = performance.now();
          try {
            const res = await fetch(`${node.url}/health`, { signal: AbortSignal.timeout(4000) });
            const lat = Math.round(performance.now() - t0);
            if (res.ok) {
              const data = await res.json();
              node.online = true;
              node.ping = lat;
              node.active = typeof data.activeSessions === 'number' ? data.activeSessions : (data.pairedSessions || 0);
            } else {
              node.online = false;
            }
          } catch (_) {
            node.online = false;
          }
        })
      );

      setCluster({ ...updated });
    }

    pingCluster();
    const interval = setInterval(pingCluster, 18000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry: Battery, Device Info, Screen & Location
  useEffect(() => {
    // Battery API
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          const lvl = Math.round(battery.level * 100);
          setBatteryLevel(`${lvl}%`);
          setBatteryCharging(battery.charging ? '⚡ Charging' : '🔋 On Battery');
          setBatteryStatusText(battery.charging ? 'Charging' : 'Battery');
          const circ = 150.79;
          setBatteryOffset(Number((circ * (1 - lvl / 100)).toFixed(1)));
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    } else {
      setBatteryLevel('100%');
      setBatteryCharging('Plugged In');
      setBatteryStatusText('AC Power');
      setBatteryOffset(0);
    }

    // IP & Location
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.ip) {
          setPublicIp(data.ip);
          fetch('https://ipwho.is/' + data.ip)
            .then((r) => r.json())
            .then((geo) => {
              if (geo && (geo.city || geo.country)) {
                setIpLocation(`${geo.city || 'Islamabad'}, ${geo.country_code || geo.country || 'PK'}`);
              }
            })
            .catch(() => setIpLocation('Pakistan · Online'));
        }
      })
      .catch(() => {
        setPublicIp('223.123.100.41');
        setIpLocation('Pakistan · Online');
      });

    // Hardware & OS
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const platform = ((navigator as any).userAgentData?.platform || navigator.platform || '').toLowerCase();

      let os = 'Windows';
      let icon = 'fa-brands fa-windows text-sky-600';
      if (platform.includes('win') || ua.includes('Windows')) {
        os = 'Windows 11 / 10';
        icon = 'fa-brands fa-windows text-sky-600';
      } else if (ua.includes('Android')) {
        os = 'Android';
        icon = 'fa-brands fa-android text-emerald-600';
      } else if (/iPad|iPhone|iPod/.test(ua)) {
        os = 'Apple iOS';
        icon = 'fa-brands fa-apple text-slate-800';
      } else if (platform.includes('mac') || ua.includes('Macintosh')) {
        os = 'macOS';
        icon = 'fa-brands fa-apple text-slate-800';
      } else if (platform.includes('linux')) {
        os = 'Linux';
        icon = 'fa-brands fa-linux text-amber-700';
      }
      setDeviceOs(os);
      setDeviceOsIcon(icon);

      let br = 'Chrome';
      if (ua.includes('Edg/')) br = 'Edge';
      else if (ua.includes('Firefox/')) br = 'Firefox';
      else if (ua.includes('Safari/') && !ua.includes('Chrome')) br = 'Safari';
      else if (ua.includes('OPR/') || ua.includes('Opera')) br = 'Opera';
      setDeviceBrowser(br);

      setScreenRes(`${window.screen.width} × ${window.screen.height}`);
      setCpuCores(`${navigator.hardwareConcurrency || 8} Cores`);
      setDeviceRam((navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB RAM` : '8 GB RAM');
    }

    // Ping Jitter Simulation
    const pingInt = setInterval(() => {
      const p = Math.floor(Math.random() * 10) + 16;
      setPingMs(p);
      setPingOffset(Number((150.79 * (1 - p / 60)).toFixed(1)));
    }, 4500);

    return () => clearInterval(pingInt);
  }, []);

  const getTargetNode = (): ClusterNode => {
    if (selectedServerMode !== 'auto' && cluster[selectedServerMode]) {
      const node = cluster[selectedServerMode];
      if (node.online) return node;
      addLog(`⚠️ ${node.short} is offline, falling back to smart auto...`, 'error');
    }

    const all = Object.values(cluster);
    const online = all.filter((n) => n.online);
    if (online.length === 0) return cluster.s1;

    online.sort((a, b) => a.active - b.active);
    autoCounterRef.current++;
    return online[autoCounterRef.current % online.length];
  };

  const handleGenerateCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeof document !== 'undefined') {
      (document.activeElement as HTMLElement)?.blur();
    }
    const savedScrollPos = typeof window !== 'undefined' ? window.scrollY : 0;
    setErrorText(null);
    setCopied(false);

    let cleanInput = phoneNumber.trim().replace(/[^0-9]/g, '');
    if (!cleanInput || cleanInput.length < 10) {
      setErrorText('Enter valid WhatsApp phone number with country code (e.g. 923001234567 or 03001234567)');
      return;
    }

    if (cleanInput.startsWith('03') && cleanInput.length === 11) {
      cleanInput = '92' + cleanInput.slice(1);
    } else if (cleanInput.startsWith('3') && cleanInput.length === 10) {
      cleanInput = '92' + cleanInput;
    }

    setPhoneNumber(cleanInput);
    setPairedNumber(cleanInput);
    setLoading(true);
    setPairingCode(null);
    setCountdown(120);
    setIsConnected(false);

    const target = getTargetNode();
    activeNodeRef.current = target.url;
    addLog(`⚡ Dispatching pairing request to ${target.name}...`, 'info');

    let finalCode: string | null = null;
    let successfulNode = target;

    try {
      const customParam = showCustomCode && customCode.trim() ? `&custom=${encodeURIComponent(customCode.trim().toUpperCase())}` : '';
      const directUrl = `${target.url}/api/pair?number=${encodeURIComponent(cleanInput)}${customParam}`;
      const res = await fetch(directUrl, { signal: AbortSignal.timeout(9000) });
      if (res.ok) {
        const data = await res.json();
        if (data.code || data.pairingCode) {
          finalCode = data.code || data.pairingCode;
        }
      }
    } catch (_) {
      // Failover to Railway Node 11 or Heroku 1
      const backupNode = target.id === 'railway' ? cluster.s1 : cluster.railway;
      addLog(`⚠️ ${target.short} busy, switching to ${backupNode.name}...`, 'info');
      try {
        const customParam = showCustomCode && customCode.trim() ? `&custom=${encodeURIComponent(customCode.trim().toUpperCase())}` : '';
        const res = await fetch(`${backupNode.url}/api/pair?number=${encodeURIComponent(cleanInput)}${customParam}`, { signal: AbortSignal.timeout(9000) });
        if (res.ok) {
          const data = await res.json();
          if (data.code || data.pairingCode) {
            finalCode = data.code || data.pairingCode;
            successfulNode = backupNode;
            activeNodeRef.current = backupNode.url;
          }
        }
      } catch (_) {}
    }

    // Fallback: If both fail, route via Vercel edge proxy
    if (!finalCode) {
      try {
        const customParam = showCustomCode && customCode.trim() ? `&custom=${encodeURIComponent(customCode.trim().toUpperCase())}` : '';
        const res = await fetch(`/api/pair?number=${encodeURIComponent(cleanInput)}${customParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.code || data.pairingCode) {
            finalCode = data.code || data.pairingCode;
          }
        }
      } catch (err: any) {
        setErrorText(err.message || 'All cluster nodes are busy. Please try again in a few moments.');
        addLog(`❌ Pairing Error: ${err.message}`, 'error');
      }
    }

    setLoading(false);

    if (finalCode) {
      setRawCode(finalCode);
      const clean = finalCode.replace(/[^A-Za-z0-9]/g, '');
      const formatted = clean.length === 8 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : finalCode;
      setPairingCode(formatted);
      addLog(`🔑 [${successfulNode.short}] Pairing Code Generated: ${formatted}`, 'success');
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          window.scrollTo({ top: savedScrollPos, behavior: 'instant' });
        });
      }
    } else if (!errorText) {
      setErrorText('Cluster timed out. Please check your phone number and try again.');
      addLog('❌ Cluster timed out. Retrying recommended.', 'error');
    }
  };

  const handleGenerateQR = async () => {
    setQrLoading(true);
    setQrImage(null);
    const target = getTargetNode();
    addLog(`📷 Requesting QR code via ${target.name}...`, 'info');

    try {
      const res = await fetch(`${target.url}/api/qr/start`, { signal: AbortSignal.timeout(8000) });
      const data = await res.json();
      if (data && data.qr) {
        setQrImage(data.qr);
        addLog(`📷 QR Code loaded on ${target.short}! Scan with WhatsApp.`, 'success');
      } else {
        throw new Error('No QR image received');
      }
    } catch (e: any) {
      addLog(`❌ QR Error on ${target.short}: ${e.message}`, 'error');
    } finally {
      setQrLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = rawCode || pairingCode;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      addLog(`📋 Copied Pairing Code: ${textToCopy}`, 'info');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedToast(cmd);
    addLog(`📋 Copied Command: ${cmd}`, 'info');
    setTimeout(() => setCopiedToast(null), 2500);
  };

  const onlineNodesCount = Object.values(cluster).filter((n) => n.online).length;
  const totalPairedCount = Object.values(cluster).reduce((sum, n) => sum + (n.active || 0), 0);

  const filteredCommands = commandFilter === 'all' ? COMMAND_LIST : COMMAND_LIST.filter((c) => c.cat === commandFilter || c.cat === 'all');

  return (
    <div className="min-h-screen bg-[#ecfdf5] text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 relative overflow-x-hidden antialiased py-3 sm:py-6 px-3 sm:px-6">
      <Head>
        <title>MR SAQIB MD · Official WhatsApp Bot Linker &amp; Web Pairing Portal</title>
        <meta
          name="description"
          content="Link your WhatsApp account to the 24/7 high-speed cloud cluster. Free pairing code & QR scan engine created by Muhammad Saqib."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta property="og:title" content="MR SAQIB MD · WhatsApp Pairing Portal" />
        <meta
          property="og:description"
          content="Fast, 24/7 Active, Multi-Node WhatsApp Bot Pairing Engine by Muhammad Saqib."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      {/* Ambient Radial Glow Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(167, 243, 208, 0.75) 0%, rgba(204, 251, 241, 0.3) 70%, transparent 100%)' }}
        />
        <div
          className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full opacity-55 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(186, 230, 253, 0.75) 0%, rgba(224, 242, 254, 0.35) 70%, transparent 100%)' }}
        />
        <div
          className="absolute -bottom-32 left-1/4 w-[32rem] h-[32rem] rounded-full opacity-50 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(221, 214, 254, 0.6) 0%, rgba(243, 232, 255, 0.25) 70%, transparent 100%)' }}
        />
      </div>

      <main className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        {/* =================================================================== */}
        {/* 1. TOP CREATOR & OWNER HEADER (Exact Match With Screenshot)         */}
        {/* =================================================================== */}
        <header className="glass-slab p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-white/60">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 via-teal-500 to-sky-500 shadow-md">
                <img
                  src={AVATAR_IMAGE}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = AVATAR_FALLBACK; }}
                  alt="Muhammad Saqib"
                  className="w-full h-full object-cover rounded-full border border-white"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  MR SAQIB MD
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                  <i className="fa-solid fa-circle-check text-[9px] text-emerald-600"></i>
                  Verified ID
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Created by{' '}
                <a
                  href="https://www.mrsaqib.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 font-bold hover:underline"
                >
                  Muhammad Saqib
                </a>{' '}
                · Full-Stack Engineer &amp; Cyber Security Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href="https://www.mrsaqib.me"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <i className="fa-solid fa-globe text-sky-600"></i>
              <span>mrsaqib.me</span>
            </a>
            <a
              href="https://wa.me/923464616487"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-pill px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 transition active:scale-95 shadow-sm"
            >
              <i className="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
              <span>Chat</span>
            </a>
          </div>
        </header>

        {/* =================================================================== */}
        {/* 2. HERO SECTION & WHATSAPP PAIRING CARD (Exact User Screenshot)     */}
        {/* =================================================================== */}
        <section className="glass-slab p-4 sm:p-6 text-center shadow-xl border border-white/70 relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-3 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Instant Bot Linker · 24/7 Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">
            Connect Your WhatsApp
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-4">
            Pair your number with 8-digit code or scan QR code instantly with zero wait time.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 mb-5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-key text-xs"></i>
              <span>8-Digit Pair Code</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <i className="fa-solid fa-qrcode text-xs"></i>
              <span>QR Code Scan</span>
            </button>
          </div>

          {/* TAB 1: 8-DIGIT PAIR CODE */}
          {activeTab === 'code' && (
            <div className="max-w-xl mx-auto space-y-3.5">
              <form onSubmit={handleGenerateCode} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600 text-sm">
                      <i className="fa-solid fa-phone"></i>
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter WhatsApp number (e.g. 923001234567)"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/90 border border-slate-200/90 text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-xs transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin text-sm"></i>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-bolt text-xs"></i>
                        <span>Get Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Custom Code Accordion */}
                <div className="text-left">
                  <button
                    type="button"
                    onClick={() => setShowCustomCode(!showCustomCode)}
                    className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <i className={`fa-solid ${showCustomCode ? 'fa-chevron-down' : 'fa-chevron-right'} text-[10px]`}></i>
                    <span>Custom 8-Character Pairing Code (Optional: e.g. SAQ1BXMD)</span>
                  </button>
                  {showCustomCode && (
                    <div className="mt-2 p-3 rounded-xl bg-white/70 border border-slate-200/80 space-y-1.5 animate-in fade-in duration-200">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                        Desired Custom Code (8 Alpha-Numeric Chars)
                      </label>
                      <input
                        type="text"
                        maxLength={8}
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 font-mono text-xs font-bold text-slate-800 tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                </div>
              </form>

              {/* Error Message */}
              {errorText && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-xs">
                  <i className="fa-solid fa-circle-exclamation text-rose-600 text-sm"></i>
                  <span>{errorText}</span>
                </div>
              )}

              {/* Pairing Code Result Box */}
              {pairingCode && (
                <div className="pairing-box p-4 sm:p-5 rounded-2xl bg-white/90 border-2 border-dashed border-emerald-400 text-center shadow-lg animate-in zoom-in-95 duration-200">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-1 flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-key"></i>
                    <span>Your WhatsApp Pairing Code</span>
                  </div>

                  {/* Monospace Code Display */}
                  <div
                    onClick={handleCopy}
                    className="my-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 text-2xl sm:text-3xl font-black font-mono tracking-widest text-emerald-800 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-inner select-all"
                    title="Click to copy code"
                  >
                    {pairingCode}
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className={`fa-regular ${copied ? 'fa-circle-check' : 'fa-copy'}`}></i>
                      <span>{copied ? 'Copied to Clipboard!' : 'Tap to Copy Code'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 max-w-sm mx-auto font-medium mb-2">
                    Open WhatsApp &gt; <strong>Linked Devices</strong> &gt; <strong>Link with phone number instead</strong> &gt; Enter the code above.
                  </p>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    <i className="fa-regular fa-clock text-emerald-600"></i>
                    <span>Code expires in: </span>
                    <span className="font-mono text-emerald-700 font-extrabold">{countdown}s</span>
                  </div>

                  {isConnected && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold text-xs flex items-center justify-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
                      <span>🎉 WhatsApp Successfully Linked! Bot is now active 24/7.</span>
                    </div>
                  )}
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
                {onlineNodesCount}/11 Online • {totalPairedCount} Paired
              </span>
            </div>
            <div className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
              <i className="fa-solid fa-bolt text-[10px]"></i>
              <span>
                {selectedServerMode === 'auto'
                  ? 'Smart Auto (11 Nodes Balanced)'
                  : `Dedicated: ${cluster[selectedServerMode]?.short || selectedServerMode}`}
              </span>
            </div>
          </div>

          {/* Master Auto Load-Balancer Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedServerMode('auto');
              addLog('⚡ Smart Load-Balancer activated: Traffic distributed across all 11 Cloud Nodes', 'info');
            }}
            className={`w-full mb-2.5 p-2.5 sm:p-3 rounded-xl text-left transition relative cursor-pointer shadow-md group ${
              selectedServerMode === 'auto'
                ? 'border-2 border-emerald-400 bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-sky-500/20 ring-2 ring-emerald-400/30'
                : 'border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <i className="fa-solid fa-shuffle text-xs"></i> Smart Auto Load-Balancer
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {totalPairedCount} Paired Active
                </span>
                {selectedServerMode === 'auto' && (
                  <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
                )}
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
          </button>

          {/* Individual 11 Nodes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.keys(cluster).map((key) => {
              const node = cluster[key];
              const isSelected = selectedServerMode === key;
              const isRailway = key === 'railway';

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    setSelectedServerMode(key);
                    addLog(`📍 Dedicated Routing: Locked to ${node.name}`, 'info');
                  }}
                  className={`p-2 rounded-xl text-left transition relative cursor-pointer group ${
                    isRailway ? 'col-span-2 sm:col-span-2' : ''
                  } ${
                    isSelected
                      ? isRailway
                        ? 'border-2 border-sky-400 bg-sky-500/25 ring-2 ring-sky-400/40 shadow-md'
                        : 'border-2 border-purple-400 bg-purple-500/25 ring-2 ring-purple-400/40 shadow-md'
                      : 'border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isRailway ? 'text-sky-300' : 'text-purple-300'
                      }`}
                    >
                      <i className={`text-[10px] ${isRailway ? 'fa-solid fa-server' : 'fa-brands fa-docker'}`}></i>
                      <span>{isRailway ? 'Node 11 (Railway Scale)' : `Node ${node.id.replace('s', '')}`}</span>
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        node.online ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
                      }`}
                    ></span>
                  </div>

                  <div className="text-[11px] font-black text-white truncate flex items-center justify-between">
                    <span>{isRailway ? 'Railway Cloud Engine' : node.short}</span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">
                      {node.ping ? `${node.ping}ms` : '--ms'}
                    </span>
                  </div>

                  <div className="text-[9px] text-slate-300 font-semibold truncate mt-0.5 flex items-center justify-between">
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        node.online ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <i className={`text-[8px] fa-solid ${node.online ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                      <span>{node.online ? 'Online' : 'Offline'}</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[8px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          node.active > 0
                            ? 'bg-teal-500/25 border border-teal-500/50 text-teal-300 font-bold'
                            : 'bg-slate-900/60 border border-slate-700/50 text-slate-400'
                        }`}
                      >
                        <i className="fa-solid fa-link text-[7px]"></i>
                        <span>{node.active} Paired</span>
                      </span>
                      {isRailway && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold">
                          Fast
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. COMPACT 2-COLUMN MOBILE TELEMETRY GRID                          */}
        {/* =================================================================== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* CARD 1: BATTERY */}
          <article className="glass-slab p-3.5 sm:p-4 flex flex-col justify-between min-h-[140px] shadow-sm">
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                style={{ background: 'radial-gradient(circle at 30% 25%, #ecfdf5 0%, #bbf7d0 70%, #86efac 100%)' }}
              >
                <i className="fa-solid fa-battery-three-quarters text-emerald-700 text-sm"></i>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {batteryStatusText}
              </span>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {batteryLevel}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-1 truncate">
                  {batteryCharging}
                </div>
              </div>

              {/* Mini Gauge */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(167, 243, 208, 0.45)" stroke-width="5" />
                  <circle
                    cx="32"
                    cy="32"
                    r="24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="150.79"
                    strokeDashoffset={batteryOffset}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs">
                  <i className="fa-solid fa-bolt text-emerald-600 text-xs"></i>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 2: LIVE PUBLIC IP & NETWORK */}
          <article className="glass-slab p-3.5 sm:p-4 flex flex-col justify-between min-h-[140px] shadow-sm">
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                style={{ background: 'radial-gradient(circle at 30% 25%, #f0f9ff 0%, #bae6fd 70%, #7dd3fc 100%)' }}
              >
                <i className="fa-solid fa-network-wired text-sky-700 text-sm"></i>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Public IP
              </span>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div className="min-w-0 pr-1">
                <div className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-none truncate font-mono">
                  {publicIp}
                </div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 truncate">
                  {ipLocation}
                </div>
              </div>

              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="24" fill="none" stroke="rgba(186, 230, 253, 0.45)" stroke-width="5" />
                  <circle
                    cx="32"
                    cy="32"
                    r="24"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="150.79"
                    strokeDashoffset={pingOffset}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs">
                  <span className="text-[10px] font-extrabold text-sky-700">{pingMs}ms</span>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 3: DEVICE OS & PLATFORM */}
          <article className="glass-slab p-3.5 sm:p-4 flex flex-col justify-between min-h-[140px] shadow-sm">
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                style={{ background: 'radial-gradient(circle at 30% 25%, #f5f3ff 0%, #ddd6fe 70%, #c4b5fd 100%)' }}
              >
                <i className={`${deviceOsIcon} text-sm`}></i>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                Device OS
              </span>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div className="min-w-0 pr-1">
                <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none truncate">
                  {deviceOs}
                </div>
                <div className="text-[10px] font-bold text-slate-500 mt-1 truncate">
                  {deviceBrowser} · Detected
                </div>
              </div>

              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs">
                  <i className="fa-solid fa-shield-halved text-indigo-600 text-sm"></i>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 4: ANTI-SLEEP & CLOUD UPTIME */}
          <article className="glass-slab p-3.5 sm:p-4 flex flex-col justify-between min-h-[140px] shadow-sm">
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                style={{ background: 'radial-gradient(circle at 30% 25%, #fff7ed 0%, #fed7aa 70%, #fdba74 100%)' }}
              >
                <i className="fa-solid fa-clock text-orange-700 text-sm"></i>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200">
                24/7 Active
              </span>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div>
                <div className="text-xl font-extrabold text-slate-900 tracking-tight leading-none font-mono">
                  99.9%
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-1">
                  Anti-Sleep ON
                </div>
              </div>

              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-2xs">
                  <i className="fa-solid fa-cloud text-orange-600 text-sm"></i>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* =================================================================== */}
        {/* 5. LIVE BROWSER & CLIENT API METRICS                               */}
        {/* =================================================================== */}
        <section className="glass-slab p-3.5 sm:p-4 shadow-md border border-white/60">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 text-xs shadow-xs">
                <i className="fa-solid fa-code"></i>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                  Live Browser &amp; Device APIs
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Real-time client hardware &amp; navigator specs</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live API</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {/* 1: Public IP */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-network-wired"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Public IP</div>
                <div className="text-xs font-extrabold text-slate-800 truncate font-mono">{publicIp}</div>
              </div>
            </div>

            {/* 2: System OS */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs flex-shrink-0">
                <i className={deviceOsIcon}></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">System OS</div>
                <div className="text-xs font-extrabold text-slate-800 truncate">{deviceOs}</div>
              </div>
            </div>

            {/* 3: Browser */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-compass"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Browser</div>
                <div className="text-xs font-extrabold text-slate-800 truncate">{deviceBrowser}</div>
              </div>
            </div>

            {/* 4: Screen */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-display"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Screen</div>
                <div className="text-xs font-extrabold text-slate-800 truncate font-mono">{screenRes}</div>
              </div>
            </div>

            {/* 5: Battery API */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-battery-half"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Battery API</div>
                <div className="text-xs font-extrabold text-slate-800 truncate">{batteryLevel}</div>
              </div>
            </div>

            {/* 6: CPU Cores */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CPU Cores</div>
                <div className="text-xs font-extrabold text-slate-800 truncate">{cpuCores}</div>
              </div>
            </div>

            {/* 7: RAM */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-memory"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Memory RAM</div>
                <div className="text-xs font-extrabold text-slate-800 truncate">{deviceRam}</div>
              </div>
            </div>

            {/* 8: Location */}
            <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/80 shadow-xs flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-xs flex-shrink-0">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="min-w-0">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location / ISP</div>
                <div className="text-xs font-extrabold text-slate-800 truncate">{ipLocation}</div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 6. BOT COMMANDS SHOWCASE                                           */}
        {/* =================================================================== */}
        <section className="glass-slab p-4 sm:p-5 shadow-md border border-white/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3.5">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <i className="fa-solid fa-terminal text-emerald-600 text-xs"></i>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Popular Commands</h3>
              </div>
              <p className="text-[11px] text-slate-500">Kisi bhi command par click karein foran copy ho jayegi:</p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1 flex-wrap">
              {(['all', 'music', 'ai', 'group', 'fun'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCommandFilter(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] cursor-pointer transition capitalize ${
                    commandFilter === cat
                      ? 'bg-emerald-500 text-white font-bold shadow-xs'
                      : 'text-slate-600 bg-white/80 hover:bg-white font-semibold'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat === 'music' ? 'Media' : cat === 'fun' ? 'Greetings' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Commands Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {filteredCommands.map((item, idx) => (
              <div
                key={idx}
                onClick={() => copyCommand(item.cmd)}
                className="p-2.5 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 transition cursor-pointer shadow-xs group active:scale-95"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                  <span className="font-mono text-emerald-700 truncate">{item.cmd}</span>
                  <i
                    className={`text-[10px] ${
                      copiedToast === item.cmd
                        ? 'fa-solid fa-check text-emerald-600'
                        : 'fa-regular fa-copy text-slate-400 group-hover:text-emerald-500'
                    }`}
                  ></i>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================== */}
        {/* 7. OFFICIAL DEVELOPER & CONTACT HUB                                */}
        {/* =================================================================== */}
        <section className="glass-slab p-3.5 sm:p-4 shadow-md border border-white/60">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 text-xs shadow-xs">
                <i className="fa-solid fa-address-card"></i>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight">
                  Official Developer &amp; Contact Hub
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Real-time profile &amp; verified contact links</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>API Synced</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-500 shadow-md">
                  <img
                    src={AVATAR_IMAGE}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = AVATAR_FALLBACK; }}
                    alt="Muhammad Saqib"
                    className="w-full h-full object-cover rounded-full border border-white"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">Muhammad Saqib</h4>
                  <i className="fa-solid fa-circle-check text-sky-500 text-xs" title="Verified Creator"></i>
                </div>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 truncate">
                  Full-Stack Engineer &amp; Cyber Security Specialist
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[9px] sm:text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-location-dot text-rose-500"></i> Gojra, Faisalabad, Pakistan
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
              <a
                href="https://wa.me/923464616487"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition text-center shadow-xs active:scale-95 group flex flex-col items-center justify-center cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-emerald-600 text-sm group-hover:scale-110 transition-transform"></i>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-800 mt-0.5">WhatsApp</span>
              </a>

              <a
                href="https://www.mrsaqib.me"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 transition text-center shadow-xs active:scale-95 group flex flex-col items-center justify-center cursor-pointer"
              >
                <i className="fa-solid fa-globe text-sky-600 text-sm group-hover:scale-110 transition-transform"></i>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-sky-800 mt-0.5">Portfolio</span>
              </a>

              <a
                href="https://www.instagram.com/mr_saqib242"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 transition text-center shadow-xs active:scale-95 group flex flex-col items-center justify-center cursor-pointer"
              >
                <i className="fa-brands fa-instagram text-rose-600 text-sm group-hover:scale-110 transition-transform"></i>
                <span className="text-[9px] sm:text-[10px] font-extrabold text-rose-800 mt-0.5">Instagram</span>
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 8. COMPACT LIVE TERMINAL LOGS                                      */}
        {/* =================================================================== */}
        <section className="glass-slab p-3.5 sm:p-4 shadow-md border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800">Live Bot Activity Feed</span>
            </div>
            <button
              type="button"
              onClick={() => setTerminalLogs([])}
              className="glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div ref={terminalBoxRef} className="terminal-console rounded-xl p-3 h-28 overflow-y-auto text-[11px] text-slate-200 space-y-1 bg-slate-950 font-mono shadow-inner">
            {terminalLogs.map((log) => (
              <div
                key={log.id}
                className={
                  log.type === 'success'
                    ? 'text-emerald-400 font-semibold'
                    : log.type === 'error'
                    ? 'text-rose-400 font-semibold'
                    : 'text-sky-300'
                }
              >
                [{log.time}] {log.text}
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================== */}
        {/* 9. CLEAN FOOTER WITH OWNER LINK                                    */}
        {/* =================================================================== */}
        <footer className="pt-1 pb-4 flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
          <div className="glass-pill rounded-full px-4 py-2 flex flex-wrap items-center justify-center gap-3 shadow-xs text-center">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-shield-halved text-emerald-600"></i>
              <strong>MR SAQIB MD</strong>
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a
              href="https://www.mrsaqib.me"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 hover:text-slate-900 transition flex items-center gap-1"
            >
              <i className="fa-solid fa-globe text-sky-600"></i>
              <span>mrsaqib.me</span>
            </a>
          </div>
          <p className="text-[10px] text-slate-400">
            © 2026 MR SAQIB MD · Designed by{' '}
            <span className="font-semibold text-slate-600">Muhammad Saqib</span> · All Rights Reserved
          </p>
        </footer>
      </main>
    </div>
  );
}
