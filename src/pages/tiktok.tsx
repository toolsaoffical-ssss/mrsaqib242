import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaExternalLinkAlt, FaCheckCircle, FaVideo, FaShareAlt, FaShieldAlt } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_TIKTOK_URL = DEFAULT_PROFILE_SETTINGS.tiktok_url || 'https://www.tiktok.com/@mr_saqib_242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://www.mrsaqib.me/tiktok#webpage',
      url: 'https://www.mrsaqib.me/tiktok',
      name: 'Mr Saqib Official TikTok Profile | Tech Drops & Web Tutorials (@mr_saqib_242)',
      description: 'Official verified TikTok account of Muhammad Saqib (Mr Saqib / Saqib 242). Short-form coding tips, Next.js tricks, cyber security alerts, and tech highlights.',
      inLanguage: ['en-US', 'ur-PK'],
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.mrsaqib.me/#website',
        name: 'Mr Saqib Developer Portfolio',
        url: 'https://www.mrsaqib.me'
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: PREVIEW_IMAGE,
        width: 1200,
        height: 630
      }
    },
    {
      '@type': 'Person',
      '@id': 'https://www.mrsaqib.me/#person',
      name: 'Muhammad Saqib',
      alternateName: ['Mr Saqib', 'Saqib 242', 'mr_saqib_242', 'Saqib Visuals'],
      jobTitle: 'Lead Full-Stack Web Architect & Tech Creator',
      url: 'https://www.mrsaqib.me',
      sameAs: [
        FALLBACK_TIKTOK_URL,
        'https://wa.me/923478936242',
        'https://github.com/techai342',
        'https://instagram.com/mr_saqib242'
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mrsaqib.me/tiktok#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.mrsaqib.me'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'TikTok Profile',
          item: 'https://www.mrsaqib.me/tiktok'
        }
      ]
    }
  ]
};

export default function TikTokRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_TIKTOK_URL);

  useEffect(() => {
    let isMounted = true;

    async function resolveAndRedirect() {
      if (typeof window === 'undefined') return;

      // Never redirect search engine bots or crawlers (Googlebot, Bing, etc.)
      const ua = (navigator.userAgent || '').toLowerCase();
      const isBot = /google|bot|crawler|spider|inspection|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|lighthouse/i.test(ua);
      if (isBot) return;

      // 1. Try local storage cache first for instant redirect
      try {
        const cached = localStorage.getItem('saqib_profile_settings_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.tiktok_url && parsed.tiktok_url.trim()) {
            const url = parsed.tiktok_url.trim();
            if (isMounted) setTargetUrl(url);
            window.location.replace(url);
            return;
          }
        }
      } catch {}

      // 2. Fetch fresh dynamic URL from Supabase in real-time
      try {
        const { data } = await supabase
          .from('profile_settings')
          .select('tiktok_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.tiktok_url && data.tiktok_url.trim()) ? data.tiktok_url.trim() : FALLBACK_TIKTOK_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_TIKTOK_URL);
      }
    }

    resolveAndRedirect();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        {/* Instant 0ms Script: executes before React hydration only for real human visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){var u=(navigator.userAgent||"").toLowerCase();var b=/google|bot|crawler|spider|inspection|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|lighthouse/i.test(u);if(!b){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.tiktok_url){window.location.replace(d.tiktok_url);}}}catch(e){}window.location.replace("${FALLBACK_TIKTOK_URL}");}}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://www.tiktok.com" />
        <link rel="preconnect" href="https://www.tiktok.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Mr Saqib Official TikTok Profile | Tech Drops &amp; Coding Tips (@mr_saqib_242)</title>
        <meta name="title" content="Mr Saqib Official TikTok Profile | Tech Drops & Coding Tips (@mr_saqib_242)" />
        <meta
          name="description"
          content="Follow Muhammad Saqib (Mr Saqib / Saqib 242) on TikTok (@mr_saqib_242). Watch short-form full-stack coding tutorials, Next.js web tricks, and cyber security insights."
        />
        <meta
          name="keywords"
          content="mr saqib tiktok, saqib tiktok, mr_saqib_242, saqib 242 tiktok, muhammad saqib tiktok, web developer tiktok pakistan, coding tutorials tiktok, tech tips saqib"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://www.mrsaqib.me/tiktok" />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.mrsaqib.me/tiktok" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Follow Mr Saqib on TikTok (@mr_saqib_242)" />
        <meta
          property="og:description"
          content="Watch viral web development clips, coding hacks, and AI demonstrations by Muhammad Saqib."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.mrsaqib.me/tiktok" />
        <meta name="twitter:title" content="Follow Mr Saqib on TikTok (@mr_saqib_242)" />
        <meta
          name="twitter:description"
          content="Watch viral web development clips, coding hacks, and AI demonstrations by Muhammad Saqib."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk TikTok Glow (Neon Pink & Cyan) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff0050]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/85 border border-[#ff0050]/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-rose-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#ff0050] to-[#00f2fe] p-0.5 shadow-lg shadow-[#ff0050]/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#080912] rounded-[14px] flex items-center justify-center">
            <SiTiktok className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff0050]/10 border border-[#ff0050]/20 text-[#ff0050] text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-[#ff0050]" />
          <span>Verified Official Profile</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to TikTok...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Connecting to <span className="text-rose-400 font-semibold">@mr_saqib_242</span> on TikTok for daily web development tutorials, source code drops, and coding shorts.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaVideo className="w-3.5 h-3.5 text-rose-400" />
            <span>Dev Shorts</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShareAlt className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tech Tips</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified ID</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#ff0050] animate-ping" />
          <span className="text-xs text-rose-300 font-mono font-medium">Opening TikTok profile...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ff0050] to-[#e00046] hover:from-[#e00046] hover:to-[#c4003d] text-white font-semibold text-sm transition-all shadow-lg shadow-[#ff0050]/30 active:scale-[0.98]"
        >
          <SiTiktok className="w-4 h-4" />
          <span>Click Here if Not Redirected</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Portal</span>
          <span className="font-mono text-rose-400/80">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
