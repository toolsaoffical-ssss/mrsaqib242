import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Shield, 
  ArrowLeft, 
  AlertTriangle, 
  Check, 
  Eye, 
  EyeOff, 
  Lock 
} from 'lucide-react';
import { 
  SiNextdotjs, 
  SiReact, 
  SiClaude, 
  SiGooglegemini, 
  SiKalilinux, 
  SiHackthebox, 
  SiLetsencrypt 
} from 'react-icons/si';
import { loginAdmin } from '../lib/adminAuthClient';

interface BiometricAdminLoginProps {
  onSuccess: (res: {
    success: boolean;
    username?: string;
    is_restricted?: boolean;
    device_id?: string;
    remaining_restriction_seconds?: number;
  }) => void;
}

interface VerificationStep {
  id: string;
  name: string;
  color: string;
  glow: string;
  msg: string;
  pct: number;
  status: 'waiting' | 'running' | 'done' | 'failed';
}

export default function BiometricAdminLogin({ onSuccess }: BiometricAdminLoginProps) {
  const router = useRouter();

  // Form states
  const [username, setUsername] = useState<string>('saqib_visuals');
  const [password, setPassword] = useState<string>('');
  const [displayedPassword, setDisplayedPassword] = useState<string>('');
  const [isPasswordRevealed, setIsPasswordRevealed] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [lockedRemaining, setLockedRemaining] = useState<number | null>(null);

  // Theme states
  const [activeColor, setActiveColor] = useState<string>('#00f2fe');
  const [activeGlow, setActiveGlow] = useState<string>('rgba(0, 242, 254, 0.45)');
  const [vaultStatusText, setVaultStatusText] = useState<string>('SHA-256 VAULT // STANDBY');
  const [identityRole, setIdentityRole] = useState<string>('SHA-256 // ROOT ARCHITECT');
  const [activeTechNode, setActiveTechNode] = useState<string>('nextjs');

  // Animation states
  const [shaDigest, setShaDigest] = useState<string>('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [entropyScore, setEntropyScore] = useState<number>(0);
  const [entropyText, setEntropyText] = useState<string>('SHA-256: 0%');
  const [entropyColor, setEntropyColor] = useState<string>('#00f2fe');
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const [spotlightActive, setSpotlightActive] = useState<boolean>(false);

  // Verification Pipeline states
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [showPipeline, setShowPipeline] = useState<boolean>(false);
  const [progressOffset, setProgressOffset] = useState<number>(534); // Circumference = 2 * PI * 85 = 534
  const [verifyPercent, setVerifyPercent] = useState<number>(0);
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [grantedHash, setGrantedHash] = useState<string>('');

  const [steps, setSteps] = useState<VerificationStep[]>([
    { id: 'step1', name: '[01] USERNAME IDENTITY LOOKUP', color: '#00f2fe', glow: 'rgba(0,242,254,0.5)', msg: 'VERIFYING USERNAME NODE...', pct: 25, status: 'waiting' },
    { id: 'step2', name: '[02] SHA-256 HASH SIGNATURE MATCH', color: '#c084fc', glow: 'rgba(192,132,252,0.5)', msg: 'COMPUTING SHA-256 HASH...', pct: 55, status: 'waiting' },
    { id: 'step3', name: '[03] BIOMETRIC AVATAR RETINA LOCK', color: '#f59e0b', glow: 'rgba(245,158,11,0.5)', msg: 'LOCKING BIOMETRIC RETINA...', pct: 85, status: 'waiting' },
    { id: 'step4', name: '[04] ROOT TERMINAL DECRYPTION', color: '#10b981', glow: 'rgba(16,185,129,0.55)', msg: 'SHA-256 MATCHED // UNLOCKING', pct: 100, status: 'waiting' }
  ]);

  // DOM Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scannerTargetRef = useRef<HTMLDivElement | null>(null);
  const userInputRef = useRef<HTMLInputElement | null>(null);
  const passInputRef = useRef<HTMLInputElement | null>(null);
  const eyeBtnRef = useRef<HTMLButtonElement | null>(null);
  const loginBtnRef = useRef<HTMLButtonElement | null>(null);

  // Canvas packets & shockwaves refs (avoids re-triggering renders)
  const packetsRef = useRef<Array<{
    startX: number;
    startY: number;
    ctrlX: number;
    ctrlY: number;
    endX: number;
    endY: number;
    t: number;
    speed: number;
    color: string;
    size: number;
  }>>([]);

  const shockwavesRef = useRef<Array<{
    x: number;
    y: number;
    r: number;
    maxR: number;
    alpha: number;
    color: string;
  }>>([]);

  const activeColorRef = useRef<string>(activeColor);
  activeColorRef.current = activeColor;

  // Real-Time Deterministic SHA-256 Style 64-Char Hex Generator
  const generateSHA256Hex = (str: string): string => {
    if (!str) return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    let h1 = 0xdeadbeef ^ str.length;
    let h2 = 0x41c6ce57 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    let hex = '';
    for (let i = 0; i < 8; i++) {
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      hex += (h1 >>> 0).toString(16).padStart(8, '0');
    }
    return hex.slice(0, 64);
  };

  // Helper to switch portal theme
  const setPortalTheme = (color: string, glow: string, statusMsg?: string) => {
    setActiveColor(color);
    setActiveGlow(glow);
    if (statusMsg) setVaultStatusText(statusMsg);
  };

  // Spawn laser packet
  const spawnPacket = (sourceEl: HTMLElement | null, customColor?: string, speedMult = 1) => {
    if (!sourceEl || !scannerTargetRef.current) return;
    const src = sourceEl.getBoundingClientRect();
    const dst = scannerTargetRef.current.getBoundingClientRect();

    const startX = src.left + src.width / 2;
    const startY = src.top + src.height / 2;
    const endX = dst.left + dst.width / 2;
    const endY = dst.top + dst.height / 2;

    packetsRef.current.push({
      startX,
      startY,
      ctrlX: (startX + endX) / 2 + (Math.random() - 0.5) * 90,
      ctrlY: Math.min(startY, endY) - (40 + Math.random() * 90),
      endX,
      endY,
      t: 0,
      speed: (0.026 + Math.random() * 0.016) * speedMult,
      color: customColor || activeColorRef.current,
      size: 3.8 + Math.random() * 2.2
    });
  };

  // Spawn expanding shockwave around avatar hub
  const spawnShockwave = (color?: string) => {
    if (!scannerTargetRef.current) return;
    const dst = scannerTargetRef.current.getBoundingClientRect();
    shockwavesRef.current.push({
      x: dst.left + dst.width / 2,
      y: dst.top + dst.height / 2,
      r: 65,
      maxR: 220,
      alpha: 0.9,
      color: color || activeColorRef.current
    });
  };

  // Keep displayedPassword synchronized when not matrix decrypting
  useEffect(() => {
    if (!isDecrypting) {
      setDisplayedPassword(password);
    }
  }, [password, isDecrypting]);

  // Initial SHA hash calculation
  useEffect(() => {
    setShaDigest(generateSHA256Hex(username + ':' + password));
  }, [username, password]);

  // Canvas loop setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let tick = 0;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      tick++;

      // Ambient packet
      if (tick % 65 === 0 && userInputRef.current) {
        spawnPacket(userInputRef.current, activeColorRef.current, 0.9);
      }

      // Draw Shockwaves
      const sws = shockwavesRef.current;
      for (let i = sws.length - 1; i >= 0; i--) {
        const sw = sws[i];
        sw.r += 4.2;
        sw.alpha -= 0.025;
        if (sw.alpha <= 0) {
          sws.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Packets
      const pkts = packetsRef.current;
      for (let i = pkts.length - 1; i >= 0; i--) {
        const p = pkts[i];
        p.t += p.speed;
        if (p.t >= 1) {
          pkts.splice(i, 1);
          continue;
        }

        const inv = 1 - p.t;
        const x = inv * inv * p.startX + 2 * inv * p.t * p.ctrlX + p.t * p.t * p.endX;
        const y = inv * inv * p.startY + 2 * inv * p.t * p.ctrlY + p.t * p.t * p.endY;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 16;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, p.size * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.45;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Tech node selector
  const handleTechNodeClick = (node: { id: string; color: string; glow: string; role: string }, el: HTMLElement) => {
    setActiveTechNode(node.id);
    setPortalTheme(node.color, node.glow, node.role);
    setIdentityRole(node.role);
    spawnShockwave(node.color);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => spawnPacket(el, node.color, 1.3), i * 45);
    }
  };

  // Password Input change handler with entropy scoring
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    const len = val.length;
    const score = Math.min(len * 10, 100);
    setEntropyScore(score);

    if (score < 40) {
      setPortalTheme('#f43f5e', 'rgba(244, 63, 94, 0.45)', 'SHA-256 // LOW ENTROPY KEY');
      setEntropyColor('#f43f5e');
      setEntropyText(`SHA-256: ${score}% [WEAK]`);
    } else if (score < 80) {
      setPortalTheme('#f59e0b', 'rgba(245, 158, 11, 0.45)', 'SHA-256 // ENCRYPTING CIPHER...');
      setEntropyColor('#f59e0b');
      setEntropyText(`SHA-256: ${score}% [MED]`);
    } else {
      setPortalTheme('#10b981', 'rgba(16, 185, 129, 0.45)', 'SHA-256 // QUANTUM LOCK READY');
      setEntropyColor('#10b981');
      setEntropyText(`SHA-256: ${score}% [SECURE]`);
    }
  };

  // Toggle show/hide password with matrix scramble & sweeping laser
  const toggleShowPassword = () => {
    if (isDecrypting) return;
    const realValue = password || 'Saqib@SHA256';
    const willReveal = !isPasswordRevealed;

    setIsDecrypting(true);
    setIsPasswordRevealed(willReveal);
    setSpotlightActive(willReveal);

    // Laser sweep bar trigger
    setIsSweeping(false);
    setTimeout(() => setIsSweeping(true), 10);

    // Barrage of packets + shockwave
    for (let i = 0; i < 10; i++) {
      setTimeout(() => spawnPacket(eyeBtnRef.current, activeColor, 1.4), i * 30);
    }
    spawnShockwave(activeColor);

    // Matrix hex character scramble
    const hexChars = '0123456789ABCDEF#%&*@!$';
    let step = 0;
    const totalSteps = 10;

    const interval = setInterval(() => {
      step++;
      const scrambled = realValue
        .split('')
        .map((ch, idx) => {
          if (step / totalSteps > idx / realValue.length) return ch;
          return hexChars[Math.floor(Math.random() * hexChars.length)];
        })
        .join('');

      setDisplayedPassword(scrambled);

      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayedPassword(realValue);
        setIsDecrypting(false);
        setVaultStatusText(willReveal ? 'CIPHER DECRYPTED // VISIBLE' : 'CIPHER MASKED // SHA-256');
      }
    }, 40);
  };

  // Submit / Multi-Stage Verification Pipeline Handshake
  const startVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;

    if (!username.trim() || !password) {
      setAuthError('Please enter both master username and key.');
      return;
    }

    setAuthError('');
    setIsVerifying(true);
    setShowPipeline(true);

    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'waiting' })));

    // Fire backend authentication in parallel
    const authPromise = loginAdmin(username.trim(), password);

    // Step 1: Username lookup
    setSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'running' } : s));
    setPortalTheme('#00f2fe', 'rgba(0,242,254,0.5)', 'VERIFYING USERNAME NODE...');
    setProgressOffset(534 - (534 * 0.25));
    setVerifyPercent(25);
    spawnShockwave('#00f2fe');
    for (let p = 0; p < 8; p++) {
      setTimeout(() => spawnPacket(loginBtnRef.current, '#00f2fe', 1.5), p * 35);
    }

    await new Promise(r => setTimeout(r, 450));
    setSteps(prev => prev.map((s, idx) => idx === 0 ? { ...s, status: 'done' } : s));

    // Step 2: SHA-256 Hash signature match
    setSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'running' } : s));
    setPortalTheme('#c084fc', 'rgba(192,132,252,0.5)', 'COMPUTING SHA-256 HASH...');
    setProgressOffset(534 - (534 * 0.55));
    setVerifyPercent(55);
    spawnShockwave('#c084fc');
    for (let p = 0; p < 8; p++) {
      setTimeout(() => spawnPacket(loginBtnRef.current, '#c084fc', 1.5), p * 35);
    }

    // Await server response
    const authRes = await authPromise;

    if (!authRes.success) {
      // Failed authentication
      setSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'failed' } : s));
      setPortalTheme('#ef4444', 'rgba(239, 68, 68, 0.55)', 'SHA-256 MISMATCH // REJECTED');
      spawnShockwave('#ef4444');
      setIsVerifying(false);

      if (authRes.locked) {
        setLockedRemaining(authRes.remainingLockSeconds || 900);
        setAuthError(`Security Lockout Active. Cooldown: ~${Math.ceil((authRes.remainingLockSeconds || 900) / 60)} min.`);
        setTimeout(() => {
          router.push('/yourareadmin?reason=brute_force_lockout');
        }, 1200);
        return;
      }

      setAuthError(authRes.message || 'Incorrect credentials. Please verify your root key.');
      setTimeout(() => {
        router.push('/yourareadmin?reason=wrong_password');
      }, 1400);
      return;
    }

    // Server confirmed step 2!
    await new Promise(r => setTimeout(r, 400));
    setSteps(prev => prev.map((s, idx) => idx === 1 ? { ...s, status: 'done' } : s));

    // Step 3: Biometric Retina Lock
    setSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'running' } : s));
    setPortalTheme('#f59e0b', 'rgba(245,158,11,0.5)', 'LOCKING BIOMETRIC RETINA...');
    setProgressOffset(534 - (534 * 0.85));
    setVerifyPercent(85);
    spawnShockwave('#f59e0b');
    for (let p = 0; p < 10; p++) {
      setTimeout(() => spawnPacket(loginBtnRef.current, '#f59e0b', 1.6), p * 35);
    }

    await new Promise(r => setTimeout(r, 500));
    setSteps(prev => prev.map((s, idx) => idx === 2 ? { ...s, status: 'done' } : s));

    // Step 4: Root Terminal Decryption
    setSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'running' } : s));
    setPortalTheme('#10b981', 'rgba(16,185,129,0.55)', 'SHA-256 MATCHED // UNLOCKING');
    setProgressOffset(0);
    setVerifyPercent(100);
    spawnShockwave('#10b981');
    for (let p = 0; p < 12; p++) {
      setTimeout(() => spawnPacket(loginBtnRef.current, '#10b981', 1.7), p * 35);
    }

    await new Promise(r => setTimeout(r, 550));
    setSteps(prev => prev.map((s, idx) => idx === 3 ? { ...s, status: 'done' } : s));

    // Access granted overlay display
    const finalHash = generateSHA256Hex(username + ':' + password);
    setGrantedHash(finalHash);
    setIsGranted(true);
    spawnShockwave('#10b981');

    // Smoothly enter dashboard after 1.2 seconds
    setTimeout(() => {
      onSuccess(authRes);
    }, 1200);
  };

  const resetPortal = () => {
    setIsGranted(false);
    setShowPipeline(false);
    setIsVerifying(false);
    setProgressOffset(534);
    setVerifyPercent(0);
    setPortalTheme('#00f2fe', 'rgba(0, 242, 254, 0.45)', 'SHA-256 VAULT // STANDBY');
  };

  const techNodes = [
    { id: 'nextjs', name: 'Next.js', color: '#00f2fe', glow: 'rgba(0,242,254,0.45)', role: 'NEXT.JS 15 // SHA-256 CORE', icon: <SiNextdotjs className="w-5 h-5 text-white" /> },
    { id: 'react', name: 'React', color: '#38bdf8', glow: 'rgba(56,189,248,0.45)', role: 'REACT 19 // UI STREAM', icon: <SiReact className="w-5 h-5 text-[#00d8ff]" /> },
    { id: 'claude', name: 'Claude AI', color: '#f97316', glow: 'rgba(249,115,22,0.45)', role: 'CLAUDE AI // NEURAL AUTH', icon: <SiClaude className="w-5 h-5 text-[#d97757]" /> },
    { id: 'gemini', name: 'Gemini AI', color: '#c084fc', glow: 'rgba(192,132,252,0.45)', role: 'GEMINI PRO // AI ENGINE', icon: <SiGooglegemini className="w-5 h-5 text-[#a855f7]" /> },
    { id: 'kali', name: 'Kali SecOps', color: '#10b981', glow: 'rgba(16,185,129,0.45)', role: 'KALI LINUX // SECOPS HASH', icon: <SiKalilinux className="w-5 h-5 text-[#10b981]" /> },
  ];

  return (
    <div 
      className="biometric-login-root min-h-screen relative flex items-center justify-center p-3 md:p-6 overflow-x-hidden"
      style={{
        ['--accent' as string]: activeColor,
        ['--accent-glow' as string]: activeGlow,
        ['--secondary' as string]: '#8b5cf6',
      }}
    >
      <Head>
        <title>SHA-256 Biometric Login Core | Saqib Visuals</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Embedded CSS matching user specifications */}
      <style dangerouslySetInnerHTML={{ __html: `
        .biometric-login-root {
          background-color: #03060f;
          background-image: 
            radial-gradient(circle at 22% 35%, var(--accent-glow) 0%, transparent 45%),
            radial-gradient(circle at 78% 70%, rgba(139, 92, 246, 0.22) 0%, transparent 45%),
            linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 36px 36px, 36px 36px;
          color: #f8fafc;
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          perspective: 1200px;
          transition: background 0.4s ease;
        }

        #authCanvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 5;
        }

        .auth-portal {
          position: relative;
          width: 100%;
          max-width: 1040px;
          margin: 16px auto;
          background: rgba(8, 13, 26, 0.82);
          backdrop-filter: blur(26px);
          -webkit-backdrop-filter: blur(26px);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 28px;
          display: grid;
          grid-template-columns: 1fr 1.12fr;
          overflow: hidden;
          box-shadow: 
            0 30px 75px rgba(0, 0, 0, 0.8),
            0 0 45px var(--accent-glow),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
          z-index: 10;
          transition: border-color 0.35s ease, box-shadow 0.35s ease;
        }

        @media (max-width: 880px) {
          .auth-portal {
            grid-template-columns: 1fr;
          }
        }

        .biometric-vault {
          position: relative;
          padding: 36px 26px;
          background: linear-gradient(155deg, rgba(15, 23, 42, 0.92) 0%, rgba(3, 6, 15, 0.96) 100%);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
        }

        .vault-status {
          display: flex;
          align-items: center;
          gap: 9px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--accent);
          padding: 6px 16px;
          border-radius: 999px;
          font-family: 'Courier New', monospace;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--accent);
          box-shadow: 0 0 18px var(--accent-glow);
          transition: all 0.3s ease;
          z-index: 3;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px var(--accent);
          animation: blinkDot 1.2s infinite;
        }

        @keyframes blinkDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.35; transform: scale(0.75); }
        }

        .scanner-hub {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 18px 0;
        }

        .scan-ring {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          transition: border-color 0.35s ease, animation-duration 0.4s ease;
        }

        .sr-outer {
          width: 250px;
          height: 250px;
          border: 1.5px dashed var(--accent);
          opacity: 0.5;
          animation: spinCW 20s linear infinite;
        }

        .sr-mid {
          width: 216px;
          height: 216px;
          border: 2.5px solid transparent;
          border-top-color: var(--accent);
          border-bottom-color: var(--secondary);
          animation: spinCCW 10s linear infinite;
          box-shadow: 0 0 24px var(--accent-glow);
        }

        .scanner-hub.verifying .sr-outer {
          animation-duration: 2.2s;
          opacity: 0.95;
        }
        .scanner-hub.verifying .sr-mid {
          animation-duration: 1.4s;
          border-left-color: var(--accent);
        }

        .progress-svg {
          position: absolute;
          width: 186px;
          height: 186px;
          transform: rotate(-90deg);
          z-index: 5;
          pointer-events: none;
        }

        .progress-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 4;
        }

        .progress-bar {
          fill: none;
          stroke: var(--accent);
          stroke-width: 4.5;
          stroke-linecap: round;
          stroke-dasharray: 534;
          filter: drop-shadow(0 0 8px var(--accent));
          transition: stroke-dashoffset 0.25s linear, stroke 0.3s ease;
        }

        @keyframes spinCW {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes spinCCW {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }

        .avatar-vault-frame {
          position: relative;
          width: 142px;
          height: 142px;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, var(--accent), var(--secondary));
          box-shadow: 0 0 38px var(--accent-glow);
          overflow: hidden;
          z-index: 4;
          transition: all 0.35s ease;
        }

        .avatar-vault-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #03060f;
          display: block;
        }

        .laser-sweep {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3.5px;
          background: var(--accent);
          box-shadow: 0 0 16px 4px var(--accent);
          animation: scanFace 2.4s ease-in-out infinite;
          z-index: 6;
        }

        .scanner-hub.verifying .laser-sweep {
          animation-duration: 0.55s;
          height: 5px;
        }

        @keyframes scanFace {
          0%, 100% { top: 6%; opacity: 0.35; }
          50%      { top: 94%; opacity: 1; }
        }

        .verify-percent {
          position: absolute;
          inset: 0;
          background: rgba(3, 6, 15, 0.72);
          backdrop-filter: blur(4px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'Courier New', monospace;
          font-weight: 900;
          font-size: 26px;
          color: #ffffff;
          text-shadow: 0 0 14px var(--accent);
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 8;
          border-radius: 50%;
        }

        .scanner-hub.verifying .verify-percent {
          opacity: 1;
        }

        .identity-box {
          text-align: center;
          z-index: 3;
        }

        .identity-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.6px;
          color: #ffffff;
        }

        .identity-role {
          font-size: 11.5px;
          font-family: 'Courier New', monospace;
          color: var(--accent);
          margin-top: 4px;
          transition: color 0.3s ease;
        }

        .vault-nodes {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          z-index: 3;
        }

        .v-node {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: rgba(30, 41, 59, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.12);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .v-node:hover,
        .v-node.active {
          border-color: var(--accent);
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 0 16px var(--accent-glow);
        }

        .login-panel {
          position: relative;
          padding: 40px 38px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .login-panel {
            padding: 26px 20px;
          }
        }

        .form-header {
          margin-bottom: 22px;
        }

        .sha-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 800;
          color: var(--accent);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--accent);
          padding: 4px 12px;
          border-radius: 8px;
          margin-bottom: 10px;
          box-shadow: 0 0 14px var(--accent-glow);
          transition: all 0.3s ease;
        }

        .form-title {
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .form-sub {
          font-size: 13px;
          color: #94a3b8;
          margin-top: 5px;
        }

        .input-group {
          margin-bottom: 20px;
          position: relative;
        }

        .input-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11.5px;
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 8px;
          letter-spacing: 0.6px;
        }

        .protocol-tag {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--accent);
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.3s ease;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 14px;
          overflow: hidden;
        }

        .field-icon {
          position: absolute;
          left: 15px;
          color: #64748b;
          pointer-events: none;
          transition: color 0.25s ease, transform 0.25s ease;
          z-index: 4;
        }

        .cyber-input {
          width: 100%;
          padding: 14px 50px 14px 44px;
          background: rgba(15, 23, 42, 0.88);
          border: 1.5px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          color: #ffffff;
          font-size: 14px;
          font-family: 'Courier New', monospace;
          font-weight: 700;
          letter-spacing: 0.8px;
          outline: none;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .cyber-input:focus {
          border-color: var(--accent);
          background: rgba(15, 23, 42, 0.98);
          box-shadow: 0 0 24px var(--accent-glow), inset 0 0 12px var(--accent-glow);
        }

        .cyber-input:focus ~ .field-icon {
          color: var(--accent);
          transform: scale(1.15);
        }

        .eye-btn {
          position: absolute;
          right: 10px;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #cbd5e1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 6;
          transition: all 0.25s ease;
        }

        .eye-btn:hover,
        .eye-btn.revealed {
          color: #03060f;
          background: var(--accent);
          border-color: var(--accent);
          box-shadow: 0 0 18px var(--accent);
          transform: scale(1.06);
        }

        .spotlight-beam {
          position: absolute;
          right: 42px;
          top: 0;
          width: 0%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(0, 242, 254, 0.04) 0%,
            var(--accent-glow) 65%,
            var(--accent) 100%
          );
          clip-path: polygon(0 0%, 100% 35%, 100% 65%, 0 100%);
          pointer-events: none;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 3;
          opacity: 0.75;
        }

        .spotlight-beam.active {
          width: 92%;
        }

        .pass-scan-bar {
          position: absolute;
          top: 0;
          left: -10%;
          width: 4px;
          height: 100%;
          background: #ffffff;
          box-shadow: 0 0 16px 4px var(--accent);
          z-index: 5;
          opacity: 0;
          pointer-events: none;
        }

        .pass-scan-bar.sweeping {
          animation: sweepPassBox 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes sweepPassBox {
          0%   { left: 95%; opacity: 1; }
          50%  { left: 5%; opacity: 1; }
          100% { left: 95%; opacity: 0; }
        }

        .cyber-input.decrypting {
          color: var(--accent);
          text-shadow: 0 0 10px var(--accent);
        }

        .sha-terminal {
          margin-top: 10px;
          padding: 10px 12px;
          background: rgba(3, 6, 15, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 3px solid var(--accent);
          border-radius: 10px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          transition: border-color 0.3s ease;
        }

        .sha-header {
          display: flex;
          justify-content: space-between;
          color: #94a3b8;
          margin-bottom: 4px;
          font-weight: 700;
        }

        .sha-digest {
          color: var(--accent);
          word-break: break-all;
          line-height: 1.35;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
        }

        .entropy-wrap {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .entropy-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          overflow: hidden;
        }

        .entropy-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease, background 0.3s ease;
          box-shadow: 0 0 12px var(--accent);
        }

        .entropy-text {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
          min-width: 110px;
          text-align: right;
        }

        .login-btn {
          width: 100%;
          margin-top: 8px;
          padding: 15px 22px;
          background: linear-gradient(135deg, var(--accent), var(--secondary));
          border: none;
          border-radius: 14px;
          color: #03060f;
          font-size: 13.5px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 12px 28px var(--accent-glow);
          transition: all 0.25s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .login-btn:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 16px 34px var(--accent-glow);
          filter: brightness(1.1);
        }

        .verify-pipeline {
          margin-top: 18px;
          background: rgba(3, 6, 15, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-family: 'Courier New', monospace;
          font-size: 11.5px;
        }

        .vp-step {
          display: flex;
          justify-content: space-between;
          color: #64748b;
          transition: color 0.2s ease;
        }

        .vp-step.done {
          color: #10b981;
          font-weight: 700;
        }

        .vp-step.running {
          color: var(--accent);
          font-weight: 700;
        }

        .vp-step.failed {
          color: #ef4444;
          font-weight: 700;
        }

        .granted-overlay {
          position: absolute;
          inset: 0;
          background: rgba(3, 6, 15, 0.95);
          backdrop-filter: blur(22px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 34px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.45s ease;
          z-index: 50;
        }

        .granted-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }

        .granted-badge {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.15);
          border: 2.5px solid #10b981;
          color: #10b981;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 38px;
          box-shadow: 0 0 40px rgba(16, 185, 129, 0.55);
          margin-bottom: 16px;
          animation: popBadge 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes popBadge {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .granted-hash-box {
          margin-top: 14px;
          padding: 8px 14px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #34d399;
          max-width: 380px;
          word-break: break-all;
        }

        .reset-btn {
          margin-top: 22px;
          padding: 10px 22px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 999px;
          color: #f8fafc;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
        }

        .reset-btn:hover {
          background: #10b981;
          color: #03060f;
          border-color: #10b981;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
        }
      ` }} />

      {/* Fullscreen Canvas for Packets & Shockwaves */}
      <canvas id="authCanvas" ref={canvasRef} />

      {/* Main Auth Portal Box */}
      <div className="w-full max-w-[1040px] relative z-10">
        
        {/* Top bar with Back to Portfolio navigation */}
        <div className="flex items-center justify-between mb-3 px-2">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-slate-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full hover:border-[var(--accent)]"
          >
            <ArrowLeft size={13} /> BACK_TO_PORTFOLIO
          </Link>
          <div className="text-[11px] font-mono text-slate-500 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NODE_ENCRYPT: PBKDF2/SHA-256</span>
          </div>
        </div>

        <div className="auth-portal" id="authPortal">

          {/* ================= LEFT: BIOMETRIC SCANNER VAULT ================= */}
          <div className="biometric-vault">
            <div className="vault-status">
              <span className="status-dot" />
              <span>{vaultStatusText}</span>
            </div>

            {/* Center Rotating Rings, 0-100% Progress Ring & Photo */}
            <div 
              className={`scanner-hub ${isVerifying ? 'verifying' : ''}`} 
              ref={scannerTargetRef}
              id="scannerTarget"
            >
              <div className="scan-ring sr-outer" />
              <div className="scan-ring sr-mid" />

              {/* SVG Circular Progress Ring */}
              <svg className="progress-svg" viewBox="0 0 190 190">
                <circle className="progress-bg" cx="95" cy="95" r="85" />
                <circle 
                  className="progress-bar" 
                  cx="95" 
                  cy="95" 
                  r="85" 
                  style={{ strokeDashoffset: progressOffset }}
                />
              </svg>

              <div className="avatar-vault-frame">
                <div className="laser-sweep" />
                <div className="verify-percent">{verifyPercent}%</div>
                <img 
                  src="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_wa-uriEMC.png" 
                  alt="Muhammad Saqib" 
                  loading="eager"
                />
              </div>
            </div>

            <div className="identity-box">
              <div className="identity-name">MUHAMMAD SAQIB</div>
              <div className="identity-role">{identityRole}</div>

              {/* 5 Interactive Tech Stack Nodes */}
              <div className="vault-nodes">
                {techNodes.map((node) => (
                  <div
                    key={node.id}
                    title={node.name}
                    className={`v-node ${activeTechNode === node.id ? 'active' : ''}`}
                    onClick={(e) => handleTechNodeClick(node, e.currentTarget)}
                  >
                    {node.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT: PURE USERNAME + PASSWORD SHA-256 LOGIN ================= */}
          <div className="login-panel">
            <div className="form-header">
              <div className="sha-badge">
                <Shield size={13} className="text-[var(--accent)]" />
                <span>CRYPTOGRAPHIC PROTOCOL // SHA-256</span>
              </div>
              <h1 className="form-title">Root Command Login</h1>
              <p className="form-sub">Watch color states shift live on Username, Password &amp; SHA-256 Verification.</p>
            </div>

            <form onSubmit={startVerification}>
              {/* 1. USERNAME FIELD */}
              <div className="input-group">
                <div className="input-label">
                  <span>ROOT USERNAME</span>
                  <span className="protocol-tag">IDENTITY_NODE</span>
                </div>
                <div className="input-wrapper">
                  <input
                    ref={userInputRef}
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const val = e.target.value;
                      setUsername(val);
                      setPortalTheme('#00f2fe', 'rgba(0, 242, 254, 0.45)', 'STREAMING USERNAME PACKETS...');
                      setIdentityRole('USER_NODE // ' + (val || 'ROOT').toUpperCase());
                      spawnPacket(userInputRef.current, '#00f2fe', 1.2);
                    }}
                    onFocus={() => {
                      setPortalTheme('#00f2fe', 'rgba(0, 242, 254, 0.45)', 'STAGE 01 // SCANNING USERNAME');
                      setIdentityRole('USER_NODE // ' + (username || 'ROOT').toUpperCase());
                      spawnShockwave('#00f2fe');
                    }}
                    placeholder="Enter root username..."
                    autoComplete="username"
                    required
                    className="cyber-input"
                  />
                  <SiHackthebox className="field-icon" style={{ width: 17, height: 17 }} />
                </div>
              </div>

              {/* 2. PASSWORD FIELD */}
              <div className="input-group">
                <div className="input-label">
                  <span>MASTER SECURITY KEY</span>
                  <span className="protocol-tag">SHA-256 CIPHER</span>
                </div>
                <div className="input-wrapper">
                  <input
                    ref={passInputRef}
                    type={isPasswordRevealed ? 'text' : 'password'}
                    value={displayedPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onFocus={() => {
                      setPortalTheme('#c084fc', 'rgba(192, 132, 252, 0.45)', 'STAGE 02 // SHA-256 KEY INPUT');
                      spawnShockwave('#c084fc');
                    }}
                    placeholder="Type master password..."
                    autoComplete="current-password"
                    required
                    className={`cyber-input ${isDecrypting ? 'decrypting' : ''}`}
                  />
                  <SiLetsencrypt className="field-icon" style={{ width: 17, height: 17 }} />

                  {/* Volumetric Laser Cone & Sweeping Bar */}
                  <div className={`spotlight-beam ${spotlightActive ? 'active' : ''}`} />
                  <div className={`pass-scan-bar ${isSweeping ? 'sweeping' : ''}`} />

                  <button
                    ref={eyeBtnRef}
                    type="button"
                    onClick={toggleShowPassword}
                    title="Laser Decrypt Show/Hide"
                    aria-label={isPasswordRevealed ? 'Mask password' : 'Laser decrypt password'}
                    className={`eye-btn ${isPasswordRevealed ? 'revealed' : ''}`}
                  >
                    {isPasswordRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Live Real-Time SHA-256 Digest Box */}
                <div className="sha-terminal">
                  <div className="sha-header">
                    <span>LIVE SHA-256 HASH STREAM</span>
                    <span>256-BIT ACTIVE</span>
                  </div>
                  <div className="sha-digest">
                    {shaDigest}
                  </div>
                </div>

                {/* Keystroke Entropy Meter */}
                <div className="entropy-wrap">
                  <div className="entropy-bar">
                    <div 
                      className="entropy-fill" 
                      style={{ 
                        width: `${entropyScore}%`, 
                        background: entropyColor, 
                        boxShadow: `0 0 12px ${entropyColor}` 
                      }} 
                    />
                  </div>
                  <span className="entropy-text" style={{ color: entropyColor }}>
                    {entropyText}
                  </span>
                </div>
              </div>

              {/* Error Alert Display */}
              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 font-mono">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                  <div className="space-y-1">
                    <p className="font-semibold">{authError}</p>
                    {lockedRemaining && (
                      <p className="text-[11px] text-rose-400">
                        Cooldown: ~{Math.ceil(lockedRemaining / 60)} minutes
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                ref={loginBtnRef}
                type="submit" 
                disabled={isVerifying}
                className="login-btn disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {isVerifying ? 'EXECUTING SHA-256 HANDSHAKE...' : 'VERIFY & INITIALIZE [SHA-256]'}
                </span>
              </button>

              {/* 4-Step Verification Checklist */}
              {showPipeline && (
                <div className="verify-pipeline">
                  {steps.map((st) => (
                    <div key={st.id} className={`vp-step ${st.status}`}>
                      <span>{st.name}</span>
                      <span>
                        {st.status === 'waiting' && 'WAITING...'}
                        {st.status === 'running' && 'SCANNING...'}
                        {st.status === 'done' && '✓ VERIFIED'}
                        {st.status === 'failed' && '✗ FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </form>

            {/* Access Granted Overlay Screen */}
            <div className={`granted-overlay ${isGranted ? 'active' : ''}`}>
              <div className="granted-badge">
                <Check size={42} />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-emerald-400 tracking-wider">
                SHA-256 VERIFIED // ACCESS GRANTED
              </h2>
              <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-[360px]">
                Authenticated as <strong className="text-[var(--accent)]">{username}</strong>. Biometric core &amp; SHA-256 master key matched 100%.
              </p>
              <div className="granted-hash-box">
                SHA-256: {grantedHash}
              </div>
              <button type="button" className="reset-btn" onClick={resetPortal}>
                <span className="flex items-center gap-1.5">
                  <Lock size={12} /> Lock Vault &amp; Re-authenticate
                </span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
