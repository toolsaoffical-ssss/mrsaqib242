import React, { useState, useEffect, useRef } from 'react';
import { 
  SiNextdotjs, 
  SiReact, 
  SiTailwindcss, 
  SiClaude, 
  SiGooglegemini, 
  SiKalilinux 
} from 'react-icons/si';
import { Sparkles, Terminal, Cpu, Zap, Activity } from 'lucide-react';

interface TechNode {
  id: string;
  name: string;
  subtitle: string;
  accent: string;
  glow: string;
  icon: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
  command: string;
  desc: string;
  specs: string[];
}

const TECH_NODES: TechNode[] = [
  {
    id: 'nextjs',
    name: 'Next.js 15',
    subtitle: 'SSR // Full-Stack',
    accent: '#ffffff',
    glow: 'rgba(255, 255, 255, 0.45)',
    icon: SiNextdotjs,
    command: '> next_runtime: v15.5 TurboPack [Server Actions & SSR active]',
    desc: 'Hybrid SSR & Static generation with Zero-Trust Edge Routing and instant API hydration.',
    specs: ['TurboPack', 'Server Components', 'Edge Runtime', 'API Routes']
  },
  {
    id: 'react',
    name: 'React.js',
    subtitle: 'Interactive UI',
    accent: '#00d8ff',
    glow: 'rgba(0, 216, 255, 0.45)',
    icon: SiReact,
    command: '> react_core: React 19 Concurrent Mode [Framer Motion Physics]',
    desc: 'High-performance reactive interfaces with fluid physics transitions and state sync.',
    specs: ['React 19', 'Context & Hooks', 'Framer Motion', 'Virtual DOM']
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    subtitle: 'Modern Design',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.45)',
    icon: SiTailwindcss,
    command: '> tailwind_engine: JIT Compiler [3.4 Glassmorphic Neon Matrix]',
    desc: 'Utility-first modern design system with glassmorphic depth, responsive grids, and cyber glow.',
    specs: ['JIT Engine', 'Glassmorphism', 'Responsive Grid', 'Custom Tokens']
  },
  {
    id: 'claude',
    name: 'Claude AI',
    subtitle: 'Neural Coding',
    accent: '#d97757',
    glow: 'rgba(217, 119, 87, 0.45)',
    icon: SiClaude,
    command: '> neural_agent: Claude 3.5 Sonnet [Complex Refactoring & Arch]',
    desc: 'Deep multi-agent reasoning, algorithmic synthesis, and robust software architecture.',
    specs: ['Anthropic SDK', 'Sonnet 3.5', 'Tool Calling', 'System Prompts']
  },
  {
    id: 'gemini',
    name: 'Gemini AI',
    subtitle: 'AI API Engine',
    accent: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.45)',
    icon: SiGooglegemini,
    command: '> gemini_multimodal: Gemini 2.5 Flash API [1M Context & Tools]',
    desc: 'High-speed multimodal intelligence, real-time embeddings, and vision processing pipeline.',
    specs: ['Google GenAI SDK', 'Live Streaming', 'Multimodal', '1M Context']
  },
  {
    id: 'cyber',
    name: 'Cybersecurity',
    subtitle: 'Kali // SecOps',
    accent: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    icon: SiKalilinux,
    command: '> secops_firewall: Zero-Trust Defense [Kali Penetration Testing]',
    desc: 'Zero-trust architecture, Supabase RLS policies, honeypot traps, and biometric SHA-256 vault.',
    specs: ['Zero-Trust', 'Supabase RLS', 'SHA-256 Vault', 'Penetration Testing']
  }
];

export default function DeveloperCoreCircuit() {
  const [selectedNode, setSelectedNode] = useState<TechNode | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cmdText, setCmdText] = useState('> init_saqib_core()...');
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Default typewriter command cycle
  useEffect(() => {
    if (selectedNode) {
      setCmdText(selectedNode.command);
      return;
    }

    const defaultCommands = [
      '> init_saqib_core()... [ONLINE]',
      '> connecting_ai_models: Claude 3.5 & Gemini 2.5 active',
      '> compiling_nextjs_build: Next.js 15 SSR TurboPack [PASS]',
      '> firewall_secops: Kali Linux zero-trust shield ACTIVE',
      '> syncing_react_components: React 19 concurrent mode',
      '> status: 100% OPTIMIZED // SAQIB VISUALS'
    ];

    let cmdIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const current = defaultCommands[cmdIdx];
      if (!isDeleting) {
        if (charIdx <= current.length) {
          setCmdText(current.slice(0, charIdx) + '▋');
          charIdx++;
          timeoutId = setTimeout(tick, 45);
        } else {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 2000);
        }
      } else {
        if (charIdx > 0) {
          setCmdText(current.slice(0, charIdx) + '▋');
          charIdx -= 2;
          timeoutId = setTimeout(tick, 20);
        } else {
          isDeleting = false;
          charIdx = 0;
          cmdIdx = (cmdIdx + 1) % defaultCommands.length;
          timeoutId = setTimeout(tick, 300);
        }
      }
    };

    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedNode]);

  // 3D Parallax Mouse Tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = (rect.width / 2 - (e.clientX - rect.left)) / 45;
    const y = (rect.height / 2 - (e.clientY - rect.top)) / 45;
    setTilt({ x: -y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div className="w-full relative py-6">
      <style jsx>{`
        /* PCB Base Circuit Tracks */
        .pcb-track {
          fill: none;
          stroke: #1e293b;
          stroke-width: 2.2;
          stroke-linejoin: round;
          stroke-linecap: round;
          transition: stroke 0.3s ease;
        }

        /* Glowing Energy Pulses on PCB Tracks */
        .pcb-pulse {
          fill: none;
          stroke-width: 3.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 110 890;
          stroke-dashoffset: 1000;
          animation: circuitFlow linear infinite;
        }

        /* Reverse Data Return Pulses */
        .pcb-pulse-rev {
          fill: none;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 60 940;
          stroke-dashoffset: 0;
          animation: circuitFlowRev linear infinite;
          opacity: 0.85;
        }

        .p-next   { stroke: #ffffff; filter: drop-shadow(0 0 7px #ffffff); animation-duration: 2.8s; }
        .p-react  { stroke: #00d8ff; filter: drop-shadow(0 0 7px #00d8ff); animation-duration: 3.1s; animation-delay: -0.8s; }
        .p-tail   { stroke: #38bdf8; filter: drop-shadow(0 0 7px #38bdf8); animation-duration: 3.4s; animation-delay: -1.6s; }
        .p-claude { stroke: #f97316; filter: drop-shadow(0 0 7px #f97316); animation-duration: 2.9s; animation-delay: -0.4s; }
        .p-gemini { stroke: #a855f7; filter: drop-shadow(0 0 7px #a855f7); animation-duration: 3.2s; animation-delay: -1.3s; }
        .p-cyber  { stroke: #10b981; filter: drop-shadow(0 0 7px #10b981); animation-duration: 3.0s; animation-delay: -2.1s; }

        @keyframes circuitFlow {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }

        @keyframes circuitFlowRev {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: 1000; }
        }

        /* Glassmorphic Developer Tech Cards */
        .tech-card {
          width: 195px;
          height: 68px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(56, 189, 248, 0.22);
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          color: #f8fafc;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.12);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          user-select: none;
        }

        .tech-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }

        .tech-card:hover::before {
          left: 140%;
        }

        .tech-card:hover, .tech-card.active {
          transform: translateY(-4px) scale(1.05);
          border-color: var(--accent, #38bdf8);
          box-shadow: 0 0 26px var(--glow, rgba(56, 189, 248, 0.45));
        }

        .icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(30, 41, 59, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .terminal-hud {
          width: 380px;
          height: 42px;
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 999px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 10px;
          font-family: 'Courier New', monospace;
          font-size: 11.5px;
          color: #38bdf8;
          box-shadow: 0 0 24px rgba(14, 165, 233, 0.22);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          width: 310px;
          height: 40px;
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(16, 185, 129, 0.4);
          border-radius: 999px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 9px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #e2e8f0;
          box-shadow: 0 0 24px rgba(16, 185, 129, 0.25);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 12px #10b981;
          animation: blinkDot 1.4s infinite;
        }

        @keyframes blinkDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.75); }
        }
      `}</style>

      {/* Main Container Card with Futuristic Circuit Grid Background */}
      <div 
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full rounded-3xl bg-[#050814]/90 border border-white/10 overflow-hidden shadow-2xl p-4 sm:p-6 lg:p-8"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.12) 0%, transparent 65%),
            radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            linear-gradient(rgba(30, 41, 59, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 41, 59, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px',
          perspective: 1200
        }}
      >
        {/* Top Header Tag */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/5 relative z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu size={18} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-black text-sm sm:text-base text-white tracking-wide uppercase">
                  Developer Core Circuit Matrix
                </h3>
                <span className="text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase">
                  Live Hardware Bus
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Interactive real-time circuit feeding telemetry into the central AI developer reactor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>3D PARALLAX READY</span>
            </div>
          </div>
        </div>

        {/* 3D Scene Wrapper with Dynamic Tilt */}
        <div 
          className="w-full relative transition-transform duration-150 ease-out"
          style={{
            transform: `rotateY(${tilt.y}deg) rotateX(${tilt.x}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Main SVG Circuit Canvas */}
          <svg 
            viewBox="0 0 1150 640" 
            className="w-full h-auto block overflow-visible drop-shadow-[0_0_35px_rgba(14,165,233,0.15)]"
          >
            <defs>
              {/* Center Reactor Glow */}
              <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </radialGradient>

              {/* Radar Sweep Gradient */}
              <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>

              {/* Circular Clip for Avatar Photo */}
              <clipPath id="avatarClip">
                <circle cx="575" cy="320" r="56" />
              </clipPath>

              {/* 6 PCB 45-Degree Hardware Circuit Paths (From Outer Cards to Center CPU 575, 320) */}
              {/* Left Side Paths */}
              <path id="pcb1" pathLength="1000" d="M 245 125 L 355 125 L 445 215 L 495 265" />
              <path id="pcb2" pathLength="1000" d="M 215 320 L 330 320 L 355 295 L 420 295 L 445 320 L 475 320" />
              <path id="pcb3" pathLength="1000" d="M 245 515 L 355 515 L 445 425 L 495 375" />

              {/* Right Side Paths */}
              <path id="pcb4" pathLength="1000" d="M 905 125 L 795 125 L 705 215 L 655 265" />
              <path id="pcb5" pathLength="1000" d="M 935 320 L 820 320 L 795 345 L 730 345 L 705 320 L 675 320" />
              <path id="pcb6" pathLength="1000" d="M 905 515 L 795 515 L 705 425 L 655 375" />

              {/* Top & Bottom Vertical Bus Lines */}
              <path id="busTop" pathLength="1000" d="M 575 85 L 575 210" />
              <path id="busBot" pathLength="1000" d="M 575 555 L 575 430" />
            </defs>

            {/* 1. DECORATIVE BACKGROUND CIRCUIT TRACES */}
            <g stroke="#0f172a" strokeWidth="1.5" fill="none">
              <path d="M 380 60 L 420 100 L 520 100" />
              <path d="M 770 60 L 730 100 L 630 100" />
              <path d="M 380 580 L 420 540 L 520 540" />
              <path d="M 770 580 L 730 540 L 630 540" />
              <circle cx="380" cy="60" r="3" fill="#1e293b" />
              <circle cx="770" cy="60" r="3" fill="#1e293b" />
              <circle cx="380" cy="580" r="3" fill="#1e293b" />
              <circle cx="770" cy="580" r="3" fill="#1e293b" />
            </g>

            {/* 2. MAIN PCB CIRCUIT TRACKS */}
            <use href="#pcb1" className="pcb-track" />
            <use href="#pcb2" className="pcb-track" />
            <use href="#pcb3" className="pcb-track" />
            <use href="#pcb4" className="pcb-track" />
            <use href="#pcb5" className="pcb-track" />
            <use href="#pcb6" className="pcb-track" />
            <use href="#busTop" className="pcb-track" strokeDasharray="4 6" />
            <use href="#busBot" className="pcb-track" strokeDasharray="4 6" />

            {/* PCB Solder Joint Nodes at Corners */}
            <g fill="#0f172a" stroke="#334155" strokeWidth="2">
              <circle cx="355" cy="125" r="4" />
              <circle cx="445" cy="215" r="4" />
              <circle cx="355" cy="515" r="4" />
              <circle cx="445" cy="425" r="4" />
              <circle cx="795" cy="125" r="4" />
              <circle cx="705" cy="215" r="4" />
              <circle cx="795" cy="515" r="4" />
              <circle cx="705" cy="425" r="4" />
            </g>

            {/* 3. HIGH-SPEED LASER PULSES (Streams from Cards to Core) */}
            <use href="#pcb1" className="pcb-pulse p-next" />
            <use href="#pcb2" className="pcb-pulse p-react" />
            <use href="#pcb3" className="pcb-pulse p-tail" />
            <use href="#pcb4" className="pcb-pulse p-claude" />
            <use href="#pcb5" className="pcb-pulse p-gemini" />
            <use href="#pcb6" className="pcb-pulse p-cyber" />

            {/* Outgoing Response Signals from Core to Cards */}
            <use href="#pcb1" className="pcb-pulse-rev p-tail" />
            <use href="#pcb3" className="pcb-pulse-rev p-react" />
            <use href="#pcb4" className="pcb-pulse-rev p-gemini" />
            <use href="#pcb6" className="pcb-pulse-rev p-claude" />

            {/* Moving Glowing Data Packets */}
            <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)">
              <animateMotion dur="2.8s" repeatCount="indefinite" path="M 245 125 L 355 125 L 445 215 L 495 265" />
            </circle>
            <circle r="4" fill="#00d8ff" filter="drop-shadow(0 0 8px #00d8ff)">
              <animateMotion dur="3.1s" begin="-0.8s" repeatCount="indefinite" path="M 215 320 L 330 320 L 355 295 L 420 295 L 445 320 L 475 320" />
            </circle>
            <circle r="4" fill="#38bdf8" filter="drop-shadow(0 0 8px #38bdf8)">
              <animateMotion dur="3.4s" begin="-1.6s" repeatCount="indefinite" path="M 245 515 L 355 515 L 445 425 L 495 375" />
            </circle>
            <circle r="4" fill="#f97316" filter="drop-shadow(0 0 8px #f97316)">
              <animateMotion dur="2.9s" begin="-0.4s" repeatCount="indefinite" path="M 905 125 L 795 125 L 705 215 L 655 265" />
            </circle>
            <circle r="4" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)">
              <animateMotion dur="3.2s" begin="-1.3s" repeatCount="indefinite" path="M 935 320 L 820 320 L 795 345 L 730 345 L 705 320 L 675 320" />
            </circle>
            <circle r="4" fill="#10b981" filter="drop-shadow(0 0 8px #10b981)">
              <animateMotion dur="3.0s" begin="-2.1s" repeatCount="indefinite" path="M 905 515 L 795 515 L 705 425 L 655 375" />
            </circle>

            {/* 4. CENTER CPU REACTOR & SAQIB PHOTO */}
            {/* Ambient Core Glow */}
            <circle cx="575" cy="320" r="155" fill="url(#coreGlow)" />

            {/* Outer Hexagonal Cyber Frame (45s Rotation) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="0 575 320" 
                to="360 575 320" 
                dur="45s" 
                repeatCount="indefinite" 
              />
              <polygon 
                points="575,180 696,250 696,390 575,460 454,390 454,250" 
                fill="none" 
                stroke="#1e293b" 
                strokeWidth="1.5" 
                strokeDasharray="10 6" 
              />
            </g>

            {/* Radar Scanner Ring (8s Rotation) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="0 575 320" 
                to="360 575 320" 
                dur="8s" 
                repeatCount="indefinite" 
              />
              <circle cx="575" cy="320" r="115" fill="none" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="40 180" opacity="0.75" />
              <path d="M 575 320 L 575 205 A 115 115 0 0 1 675 262 Z" fill="url(#radarSweep)" />
            </g>

            {/* Counter-Rotating Tech Ring with Nodes (18s Rotation) */}
            <g>
              <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="360 575 320" 
                to="0 575 320" 
                dur="18s" 
                repeatCount="indefinite" 
              />
              <circle cx="575" cy="320" r="96" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 14 28 14" opacity="0.8" />
              <circle cx="575" cy="224" r="3.5" fill="#38bdf8" />
              <circle cx="575" cy="416" r="3.5" fill="#a855f7" />
              <circle cx="479" cy="320" r="3.5" fill="#10b981" />
              <circle cx="671" cy="320" r="3.5" fill="#f97316" />
            </g>

            {/* Inner Pulsing Energy Ring */}
            <circle cx="575" cy="320" r="74" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.6">
              <animate attributeName="r" values="70;78;70" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0.25;0.7" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* CPU Chip Pin Connectors Around Photo */}
            <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.85">
              <line x1="495" y1="265" x2="512" y2="278" />
              <line x1="475" y1="320" x2="498" y2="320" />
              <line x1="495" y1="375" x2="512" y2="362" />
              <line x1="655" y1="265" x2="638" y2="278" />
              <line x1="675" y1="320" x2="652" y2="320" />
              <line x1="655" y1="375" x2="638" y2="362" />
            </g>

            {/* Dark Backing Circle for Avatar */}
            <circle cx="575" cy="320" r="62" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />

            {/* Saqib Avatar Photo */}
            <image
              href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_wa-uriEMC.png"
              x="519"
              y="264"
              width="112"
              height="112"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#avatarClip)"
            />

            {/* Neon Cyan Border Ring on Avatar */}
            <circle 
              cx="575" 
              cy="320" 
              r="56" 
              fill="none" 
              stroke={selectedNode ? selectedNode.accent : "#38bdf8"} 
              strokeWidth="2.5" 
              className="transition-colors duration-300"
            />

            {/* 5. FLOATING GLASSMORPHIC TECH CARDS via foreignObject */}
            {/* Left 1: Next.js 15 */}
            <foreignObject x="50" y="91" width="195" height="68">
              <div 
                onClick={() => setSelectedNode(selectedNode?.id === 'nextjs' ? null : TECH_NODES[0])}
                className={`tech-card ${selectedNode?.id === 'nextjs' ? 'active' : ''}`}
                style={{ 
                  '--accent': '#ffffff', 
                  '--glow': 'rgba(255,255,255,0.4)' 
                } as React.CSSProperties}
              >
                <div className="icon-box">
                  <SiNextdotjs size={24} color="#ffffff" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-sm text-slate-100">Next.js 15</span>
                  <span className="text-[11px] font-mono text-slate-400">SSR // Full-Stack</span>
                </div>
              </div>
            </foreignObject>

            {/* Left 2: React.js */}
            <foreignObject x="20" y="286" width="195" height="68">
              <div 
                onClick={() => setSelectedNode(selectedNode?.id === 'react' ? null : TECH_NODES[1])}
                className={`tech-card ${selectedNode?.id === 'react' ? 'active' : ''}`}
                style={{ 
                  '--accent': '#00d8ff', 
                  '--glow': 'rgba(0,216,255,0.45)' 
                } as React.CSSProperties}
              >
                <div className="icon-box">
                  <SiReact size={24} color="#00d8ff" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-sm text-slate-100">React.js</span>
                  <span className="text-[11px] font-mono text-slate-400">Interactive UI</span>
                </div>
              </div>
            </foreignObject>

            {/* Left 3: Tailwind CSS */}
            <foreignObject x="50" y="481" width="195" height="68">
              <div 
                onClick={() => setSelectedNode(selectedNode?.id === 'tailwind' ? null : TECH_NODES[2])}
                className={`tech-card ${selectedNode?.id === 'tailwind' ? 'active' : ''}`}
                style={{ 
                  '--accent': '#38bdf8', 
                  '--glow': 'rgba(56,189,248,0.45)' 
                } as React.CSSProperties}
              >
                <div className="icon-box">
                  <SiTailwindcss size={24} color="#38bdf8" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-sm text-slate-100">Tailwind CSS</span>
                  <span className="text-[11px] font-mono text-slate-400">Modern Design</span>
                </div>
              </div>
            </foreignObject>

            {/* Right 1: Claude AI */}
            <foreignObject x="905" y="91" width="195" height="68">
              <div 
                onClick={() => setSelectedNode(selectedNode?.id === 'claude' ? null : TECH_NODES[3])}
                className={`tech-card ${selectedNode?.id === 'claude' ? 'active' : ''}`}
                style={{ 
                  '--accent': '#d97757', 
                  '--glow': 'rgba(217,119,87,0.45)' 
                } as React.CSSProperties}
              >
                <div className="icon-box">
                  <SiClaude size={24} color="#d97757" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-sm text-slate-100">Claude AI</span>
                  <span className="text-[11px] font-mono text-slate-400">Neural Coding</span>
                </div>
              </div>
            </foreignObject>

            {/* Right 2: Google Gemini */}
            <foreignObject x="935" y="286" width="195" height="68">
              <div 
                onClick={() => setSelectedNode(selectedNode?.id === 'gemini' ? null : TECH_NODES[4])}
                className={`tech-card ${selectedNode?.id === 'gemini' ? 'active' : ''}`}
                style={{ 
                  '--accent': '#a855f7', 
                  '--glow': 'rgba(168,85,247,0.45)' 
                } as React.CSSProperties}
              >
                <div className="icon-box">
                  <SiGooglegemini size={24} color="#a855f7" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-sm text-slate-100">Gemini AI</span>
                  <span className="text-[11px] font-mono text-slate-400">AI API Engine</span>
                </div>
              </div>
            </foreignObject>

            {/* Right 3: Cybersecurity Kali */}
            <foreignObject x="905" y="481" width="195" height="68">
              <div 
                onClick={() => setSelectedNode(selectedNode?.id === 'cyber' ? null : TECH_NODES[5])}
                className={`tech-card ${selectedNode?.id === 'cyber' ? 'active' : ''}`}
                style={{ 
                  '--accent': '#10b981', 
                  '--glow': 'rgba(16,185,129,0.45)' 
                } as React.CSSProperties}
              >
                <div className="icon-box">
                  <SiKalilinux size={26} color="#10b981" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-sm text-slate-100">Cybersecurity</span>
                  <span className="text-[11px] font-mono text-slate-400">Kali // SecOps</span>
                </div>
              </div>
            </foreignObject>

            {/* 6. TOP & BOTTOM LIVE HUD TERMINALS */}
            {/* Top Live Terminal Bar */}
            <foreignObject x="385" y="40" width="380" height="48">
              <div className="terminal-hud">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                </div>
                <span className="truncate">{cmdText}</span>
              </div>
            </foreignObject>

            {/* Bottom Developer Status Pill */}
            <foreignObject x="420" y="555" width="310" height="48">
              <div className="status-badge">
                <span className="live-dot" />
                <span>SAQIB VISUALS // DEV CORE</span>
              </div>
            </foreignObject>
          </svg>
        </div>

        {/* Selected Tech Inspector Drawer (Appears when any node is clicked or tapped) */}
        {selectedNode && (
          <div className="mt-5 p-4 bg-zinc-950/80 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ 
                  backgroundColor: `${selectedNode.accent}15`, 
                  border: `1px solid ${selectedNode.accent}40` 
                }}
              >
                <selectedNode.icon size={22} style={{ color: selectedNode.accent }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{selectedNode.name}</h4>
                  <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {selectedNode.subtitle}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{selectedNode.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedNode.specs.map(spec => (
                <span 
                  key={spec} 
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-zinc-300"
                >
                  {spec}
                </span>
              ))}
              <button 
                onClick={() => setSelectedNode(null)}
                className="ml-2 text-xs font-mono text-zinc-500 hover:text-white px-2 py-1 rounded border border-white/5"
              >
                ✕ Close
              </button>
            </div>
          </div>
        )}

        {/* Mobile Fast Quick-Tap Nodes Bar (Shown on small screens for easy touch navigation) */}
        <div className="mt-4 md:hidden grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TECH_NODES.map(node => {
            const isSel = selectedNode?.id === node.id;
            const Icon = node.icon;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(isSel ? null : node)}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition ${
                  isSel 
                    ? 'bg-zinc-800 border-cyan-400/50 shadow-lg' 
                    : 'bg-zinc-900/60 border-white/5 hover:border-white/10'
                }`}
              >
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${node.accent}15` }}
                >
                  <Icon size={16} style={{ color: node.accent }} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate">{node.name}</div>
                  <div className="text-[9px] font-mono text-zinc-500 truncate">{node.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
