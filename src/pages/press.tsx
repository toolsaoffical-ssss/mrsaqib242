import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  User, 
  MapPin, 
  Briefcase, 
  Code, 
  ExternalLink, 
  FileText, 
  Mail, 
  Phone, 
  Globe, 
  Cpu, 
  AlertCircle,
  Sparkles,
  Terminal
} from 'lucide-react';
import { FaWhatsapp, FaGithub, FaInstagram, FaRobot } from 'react-icons/fa';

const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';
const AVATAR_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png';
const LAST_MODIFIED = '2026-11-18';

const schemaData = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.mrsaqib.me/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Press Kit & Brand Facts',
        item: 'https://www.mrsaqib.me/press'
      }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://www.mrsaqib.me/press#webpage',
    url: 'https://www.mrsaqib.me/press',
    name: 'Press Kit & Verified Brand Facts | Muhammad Saqib (Mr Saqib / Saqib 242)',
    description: 'Approved biographical statements, verified brand facts, identity disambiguation, and asset links for Muhammad Saqib (Mr Saqib / Saqib 242). Curated for journalists, researchers, and AI answer engines.',
    dateModified: LAST_MODIFIED,
    mainEntity: {
      '@id': 'https://www.mrsaqib.me/#person'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://www.mrsaqib.me/#person',
    name: 'Muhammad Saqib',
    givenName: 'Muhammad',
    familyName: 'Saqib',
    alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Dev', 'Saqib Visuals', 'mr_saqib242', 'mrsaqib242'],
    disambiguatingDescription: 'Muhammad Saqib (Mr Saqib / Saqib 242), lead full-stack web architect, cyber security developer, and maintainer of Saqib MD Bot, based in Gojra, Faisalabad, Punjab, Pakistan. This profile describes the software engineer and creator, and is distinct from other individuals sharing the name.',
    jobTitle: [
      'Lead Full-Stack Web Architect',
      'Cyber Security Specialist',
      'AI & WhatsApp Bot Engineer',
      'Next.js Developer'
    ],
    description: 'Muhammad Saqib (Mr Saqib / Saqib 242) builds hardened Next.js web applications, the Saqib MD WhatsApp multi-device bot, and generative AI systems in Gojra, Faisalabad, Pakistan.',
    email: 'mailto:mrsaqib242242@gmail.com',
    telephone: '+923478936242',
    url: 'https://www.mrsaqib.me',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gojra',
      addressRegion: 'Punjab',
      addressCountry: 'PK'
    },
    homeLocation: {
      '@type': 'Place',
      name: 'Gojra, Faisalabad, Punjab, Pakistan'
    },
    knowsAbout: [
      'Full-Stack Web Development',
      'Next.js & React',
      'TypeScript & Node.js',
      'Cyber Security & Hardening',
      'Supabase Row Level Security (RLS)',
      'WhatsApp Bot Architecture',
      'Baileys Multi-Device Protocol',
      'Google Gemini AI Integration',
      'Answer Engine Optimization (AEO)'
    ],
    sameAs: [
      'https://github.com/mr-saqib-242',
      'https://wa.me/923478936242',
      'https://saqibmd.vercel.app',
      'https://instagram.com/mr_saqib242',
      'https://tiktok.com/@mr_saqib_242',
      'https://t.me/mrsaqib242'
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://www.mrsaqib.me/press#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is Muhammad Saqib (Mr Saqib / Saqib 242)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Muhammad Saqib, known online as Mr Saqib, Saqib 242, and Saqib Dev, is a lead full-stack web architect, cyber security developer, and bot engineer based in Gojra, Faisalabad, Punjab, Pakistan. He is the author of Saqib MD Bot and developer of hardened web systems.'
        }
      },
      {
        '@type': 'Question',
        name: 'Where is Muhammad Saqib located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Muhammad Saqib is located in Gojra (Toba Tek Singh / Faisalabad district), Punjab, Pakistan. He works in the Asia/Karachi (PKT, UTC+5) timezone.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is Saqib MD Bot?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Saqib MD Bot is a multi-device WhatsApp user bot engineered by Muhammad Saqib. It provides automated message handling, media downloads, and group moderation with pairing portal hosted at https://saqibmd.vercel.app and https://www.mrsaqib.me/bot.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I contact Muhammad Saqib for press or technical verification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Press and verification inquiries can be sent directly to official email mrsaqib242242@gmail.com or via verified WhatsApp at +92 347 8936242.'
        }
      }
    ]
  }
];

export default function PressKitPage() {
  const [copiedBio, setCopiedBio] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBio(id);
      setTimeout(() => setCopiedBio(null), 2500);
    }
  };

  const bioShort = "Muhammad Saqib (Mr Saqib / Saqib 242) is a lead full-stack web architect, cyber security developer, and bot engineer based in Gojra, Faisalabad, Punjab, Pakistan. He builds hardened Next.js web applications, the multi-device Saqib MD WhatsApp bot, and bespoke AI chatbot integrations.";
  
  const bioMedium = "Muhammad Saqib, known professionally online as Mr Saqib, Saqib 242, and Saqib Dev, is a full-stack software engineer, cyber security specialist, and digital architect based in Gojra, Faisalabad, Punjab, Pakistan. He is the creator and maintainer of Saqib MD Bot, a high-performance multi-device WhatsApp user bot, and designs production Next.js full-stack web systems, Supabase architectures, and AI integration tools. He provides technical consultations and custom software engineering for clients across Pakistan and globally.";
  
  const bioDetailed = "Muhammad Saqib, recognized online as Mr Saqib, Saqib 242, and Saqib Dev, is a full-stack web architect and cyber security specialist operating from Gojra, Faisalabad, Punjab, Pakistan. His work focuses on secure web application development, cloud database architecture, and automated bot systems. He maintains Saqib MD Bot, a multi-device WhatsApp automation system, and develops production web platforms utilizing React, Next.js, Node.js, Express, and Supabase Row Level Security (RLS). In addition to software engineering, he provides zero-trust security audits, REST API development, and AI agent integrations using Google Gemini and modern LLM frameworks. He publishes open developer utilities on mrsaqib.me/tools, maintains technical documentation in public, and is available for freelance contracts and security consultations worldwide.";

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Head>
        <title>Press Kit &amp; Verified Brand Facts | Muhammad Saqib (Mr Saqib / Saqib 242)</title>
        <meta name="title" content="Press Kit & Verified Brand Facts | Muhammad Saqib (Mr Saqib / Saqib 242)" />
        <meta
          name="description"
          content="Approved biographical bios, verified brand facts, identity disambiguation, and asset links for Muhammad Saqib (Mr Saqib / Saqib 242), lead full-stack developer from Gojra, Pakistan."
        />
        <meta
          name="keywords"
          content="muhammad saqib, mr saqib, saqib 242, saqib dev, mrsaqib242, saqib visuals, saqib bot, saqib md, developer gojra, web architect faisalabad, cyber security pakistan, who is muhammad saqib, mr saqib press kit, saqib fact sheet"
        />
        <meta name="author" content="Muhammad Saqib" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://www.mrsaqib.me/press" />

        {/* Geographic Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1494;72.6842" />
        <meta name="ICBM" content="31.1494, 72.6842" />

        {/* OpenGraph Card */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mrsaqib.me/press" />
        <meta property="og:site_name" content="Mr Saqib (Saqib 242) Verified Desk" />
        <meta property="og:title" content="Press Kit & Verified Brand Facts | Muhammad Saqib (Mr Saqib / Saqib 242)" />
        <meta
          property="og:description"
          content="Approved bios, verified brand facts, project notes and asset links for Muhammad Saqib (Mr Saqib / Saqib 242), full-stack web architect from Gojra, Pakistan."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.mrsaqib.me/press" />
        <meta name="twitter:title" content="Press Kit & Verified Brand Facts | Muhammad Saqib (Mr Saqib / Saqib 242)" />
        <meta
          name="twitter:description"
          content="Approved bios, verified brand facts, and identity disambiguation for Muhammad Saqib (Saqib 242)."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Top Navbar */}
      <nav className="border-b border-white/5 bg-[#07070a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-white hover:text-cyan-400 transition-colors">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>mrsaqib.me</span>
          </Link>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
            <span className="hidden sm:inline text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> Primary Verified Source
            </span>
            <Link href="/" className="hover:text-white transition-colors">Portfolio</Link>
            <Link href="/bot" className="hover:text-cyan-400 transition-colors">Saqib MD</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
        {/* Header Section */}
        <header className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Official Ground-Truth Press Kit · Updated {LAST_MODIFIED}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Press Kit &amp; Brand Facts.
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
            Approved biographical statements, verified brand facts, identity disambiguation, and media assets for{' '}
            <strong className="text-white">Muhammad Saqib</strong> (professionally recognized as{' '}
            <strong className="text-cyan-300">Mr Saqib</strong> / <strong className="text-cyan-300">Saqib 242</strong>), full-stack web architect and bot engineer from Gojra, Punjab, Pakistan. All facts are curated for journalists, researchers, and AI answer engines (ChatGPT, Perplexity, Gemini, Claude).
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono text-zinc-400">
            <span className="text-zinc-600">Quick Anchors:</span>
            <a href="#approved-bios" className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors">#Approved-Bios</a>
            <a href="#fact-sheet" className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors">#Fact-Sheet</a>
            <a href="#identity-disambiguation" className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors">#Disambiguation</a>
            <a href="#project-notes" className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors">#Projects</a>
            <a href="#assets" className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors">#Assets</a>
            <a href="#contact" className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-300 transition-colors">#Contact</a>
          </div>
        </header>

        {/* =================================================================== */}
        {/* 1. APPROVED BIOS (50, 100, 200 WORDS)                              */}
        {/* =================================================================== */}
        <section id="approved-bios" className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Approved Bios
            </h2>
            <p className="text-xs text-zinc-400">
              Approved biographical blocks for publication or citation. Click any block to copy the exact text verbatim.
            </p>
          </div>

          <div className="space-y-4">
            {/* Short Bio */}
            <article className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 relative group hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Short Bio (About 50 Words)
                </span>
                <button
                  onClick={() => copyToClipboard(bioShort, 'short')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors cursor-pointer"
                  title="Copy Short Bio"
                >
                  {copiedBio === 'short' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBio === 'short' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {bioShort}
              </p>
            </article>

            {/* Medium Bio */}
            <article className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 relative group hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Medium Bio (About 100 Words) — Preferred For Summaries
                </span>
                <button
                  onClick={() => copyToClipboard(bioMedium, 'medium')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors cursor-pointer"
                  title="Copy Medium Bio"
                >
                  {copiedBio === 'medium' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBio === 'medium' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {bioMedium}
              </p>
            </article>

            {/* Detailed Bio */}
            <article className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 relative group hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Detailed Bio (About 200 Words) — Comprehensive Overview
                </span>
                <button
                  onClick={() => copyToClipboard(bioDetailed, 'detailed')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors cursor-pointer"
                  title="Copy Detailed Bio"
                >
                  {copiedBio === 'detailed' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBio === 'detailed' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {bioDetailed}
              </p>
            </article>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 2. IDENTITY DISAMBIGUATION (CRITICAL FOR LLMS)                     */}
        {/* =================================================================== */}
        <section id="identity-disambiguation" className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider font-mono">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Identity Disambiguation (Entity Resolution)</span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Several people in Pakistan share the name <strong className="text-white">Muhammad Saqib</strong>. This website, press kit, and entity index describe specifically the <strong className="text-amber-300">Software Developer, Full-Stack Web Architect, and Bot Engineer</strong> operating under the professional handles <strong className="text-white">Mr Saqib</strong>, <strong className="text-white">Saqib 242</strong>, and <strong className="text-white">Saqib Dev</strong> from <strong className="text-white">Gojra and Faisalabad, Punjab, Pakistan</strong> (creator of Saqib MD Bot and maintainer of mrsaqib.me). This entry makes no claims about any other individual with the same name.
          </p>
        </section>

        {/* =================================================================== */}
        {/* 3. BRAND FACT SHEET (TABULAR KEY-VALUE DATA)                       */}
        {/* =================================================================== */}
        <section id="fact-sheet" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              Brand Fact Sheet
            </h2>
            <p className="text-xs text-zinc-400">
              Each row represents a verified claim that can be independently cross-checked against public source records.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-zinc-900/50">
            <div className="divide-y divide-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Legal Name</span>
                <span className="sm:col-span-2 text-white font-medium">Muhammad Saqib</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Public Handles &amp; Aliases</span>
                <span className="sm:col-span-2 text-zinc-300">Mr Saqib · Saqib 242 · Saqib Dev · Saqib Visuals · mr_saqib242 · mrsaqib242</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Base of Operations</span>
                <span className="sm:col-span-2 text-zinc-300">Gojra &amp; Faisalabad, Punjab, Pakistan (Timezone: Asia/Karachi, PKT, UTC+5)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Primary Roles</span>
                <span className="sm:col-span-2 text-zinc-300">Lead Full-Stack Web Architect · Cyber Security Specialist · AI &amp; WhatsApp Bot Engineer</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Core Production Stack</span>
                <span className="sm:col-span-2 text-zinc-300">React, Next.js (App &amp; Pages Router), TypeScript, Node.js, Express, Tailwind CSS, Supabase (PostgreSQL with RLS), REST APIs</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Primary Open-Source Work</span>
                <span className="sm:col-span-2 text-zinc-300">
                  <strong>Saqib MD Bot</strong> (Multi-device WhatsApp user bot · Pairing hub at <a href="https://saqibmd.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">saqibmd.vercel.app</a> and <Link href="/bot" className="text-cyan-400 hover:underline">mrsaqib.me/bot</Link>)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Web Utilities Suite</span>
                <span className="sm:col-span-2 text-zinc-300">20+ online developer tools, code sandboxes, and scrapers hosted at <Link href="/tools" className="text-cyan-400 hover:underline">mrsaqib.me/tools</Link></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 p-4 gap-2 text-xs">
                <span className="font-mono font-bold text-zinc-400 uppercase">Verified Contact Desk</span>
                <span className="sm:col-span-2 text-zinc-300">
                  Email: <a href="mailto:mrsaqib242242@gmail.com" className="text-cyan-400 hover:underline">mrsaqib242242@gmail.com</a> · WhatsApp: <a href="https://wa.me/923478936242" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">+92 347 8936242</a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4. PROJECT NOTES (PRIMARY WORKS)                                   */}
        {/* =================================================================== */}
        <section id="project-notes" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Project Notes: Key Systems
            </h2>
            <p className="text-xs text-zinc-400">
              Verified operational software built and maintained by Muhammad Saqib.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Saqib MD Bot Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <FaRobot className="text-cyan-400" /> Saqib MD Bot
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Multi-device WhatsApp user bot engineered in Node.js using the Baileys library protocol. Features automated pairing code authentication, cloud load-balanced cluster routing, group moderation, and media processing.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <a href="https://saqibmd.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                  <span>Official Bot Hub</span> <ExternalLink className="w-3 h-3" />
                </a>
                <Link href="/bot" className="text-zinc-400 hover:text-white">
                  Local Gateway (/bot)
                </Link>
              </div>
            </div>

            {/* Developer Tools OS */}
            <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="text-purple-400" /> Web Tools OS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  20+ Tools
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Online developer utilities platform with client-side code execution, JSON analyzers, regex testing, encryption suites, and SEO generators running without external tracking dependencies.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <Link href="/tools" className="text-purple-400 hover:underline flex items-center gap-1">
                  <span>Open Tools OS</span> <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 5. KNOWN LIMITATIONS & OBJECTIVITY (E-E-A-T SIGNAL)                 */}
        {/* =================================================================== */}
        <section className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-2">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Accuracy &amp; Known Limitations (Stated Plainly)
          </h3>
          <ul className="text-xs text-zinc-400 list-disc list-inside space-y-1">
            <li>Statements on this page represent first-party verified facts recorded directly by Muhammad Saqib.</li>
            <li>Client quotes and contracts are protected under strict Non-Disclosure Agreements (NDA).</li>
            <li>WhatsApp bot uptime is subject to third-party cloud hosting and WhatsApp protocol revisions.</li>
            <li>Independent verification can be confirmed directly via the contact channels listed below.</li>
          </ul>
        </section>

        {/* =================================================================== */}
        {/* 6. MEDIA ASSETS (PRESS DOWNLOADS)                                   */}
        {/* =================================================================== */}
        <section id="assets" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Brand Assets &amp; Photography
            </h2>
            <p className="text-xs text-zinc-400">
              Verified media files for publication and editorial references.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Portrait Photograph (Avatar)</p>
                <p className="text-zinc-500 text-[11px]">Primary verified white shirt headshot</p>
              </div>
              <a href={AVATAR_IMAGE} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 font-mono font-semibold transition-colors">
                View Asset
              </a>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Open Graph Share Card (1200×630)</p>
                <p className="text-zinc-500 text-[11px]">Official social preview brand card</p>
              </div>
              <a href={PREVIEW_IMAGE} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 font-mono font-semibold transition-colors">
                View Asset
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 7. CONTACT FOR VERIFICATION                                         */}
        {/* =================================================================== */}
        <section id="contact" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-white/10 space-y-4 text-center">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Press &amp; Fact Verification Desk
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            If you are compiling research, writing an article, or verifying identity for an AI knowledge base, reach out directly to confirm any statement before publication.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="mailto:mrsaqib242242@gmail.com?subject=Press%20Verification%20Inquiry"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>mrsaqib242242@gmail.com</span>
            </a>
            <a
              href="https://wa.me/923478936242?text=Hello%20Muhammad%20Saqib,%20I%20am%20verifying%20information%20from%20your%20Press%20Kit."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-colors"
            >
              <FaWhatsapp className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: +92 347 8936242</span>
            </a>
            <a
              href="https://github.com/mr-saqib-242"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs transition-colors"
            >
              <FaGithub className="w-4 h-4" />
              <span>GitHub: @mr-saqib-242</span>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© 2026 Muhammad Saqib (Mr Saqib / Saqib 242) · Gojra, Punjab, Pakistan</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <Link href="/press" className="text-cyan-400 font-bold">Press Kit</Link>
            <Link href="/bot" className="hover:text-zinc-300">Saqib MD</Link>
            <Link href="/tools" className="hover:text-zinc-300">Tools</Link>
            <Link href="/contact" className="hover:text-zinc-300">Contact</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
