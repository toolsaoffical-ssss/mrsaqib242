import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaExternalLinkAlt, FaCheckCircle, FaCamera, FaPalette, FaShieldAlt } from 'react-icons/fa';
import { SiInstagram } from 'react-icons/si';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_INSTAGRAM_URL = DEFAULT_PROFILE_SETTINGS.instagram_url || 'https://www.instagram.com/mr_saqib242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://mrsaqib242.vercel.app/insta#webpage',
      url: 'https://mrsaqib242.vercel.app/insta',
      name: 'Muhammad Saqib Official Instagram | Saqib Visuals (@mr_saqib242)',
      description: 'Official verified Instagram profile of Muhammad Saqib (Mr Saqib / Saqib 242). Aesthetic web design showcases, visual branding, creative tech drops, and client portfolios.',
      inLanguage: ['en-US', 'ur-PK'],
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://mrsaqib242.vercel.app/#website',
        name: 'Mr Saqib Developer Portfolio',
        url: 'https://mrsaqib242.vercel.app'
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
      '@id': 'https://mrsaqib242.vercel.app/#person',
      name: 'Muhammad Saqib',
      alternateName: ['Mr Saqib', 'Saqib 242', 'mr_saqib242', 'Saqib Visuals'],
      jobTitle: 'Lead Full-Stack Web Architect & Creative Director',
      url: 'https://mrsaqib242.vercel.app',
      sameAs: [
        FALLBACK_INSTAGRAM_URL,
        'https://wa.me/923478936242',
        'https://github.com/techai342'
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://mrsaqib242.vercel.app/insta#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://mrsaqib242.vercel.app'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Instagram Profile',
          item: 'https://mrsaqib242.vercel.app/instagram'
        }
      ]
    }
  ]
};

export default function InstagramShortRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_INSTAGRAM_URL);

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
          if (parsed.instagram_url && parsed.instagram_url.trim()) {
            const url = parsed.instagram_url.trim();
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
          .select('instagram_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.instagram_url && data.instagram_url.trim()) ? data.instagram_url.trim() : FALLBACK_INSTAGRAM_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_INSTAGRAM_URL);
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
            __html: `if(typeof window!=="undefined"){var u=(navigator.userAgent||"").toLowerCase();var b=/google|bot|crawler|spider|inspection|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|lighthouse/i.test(u);if(!b){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.instagram_url){window.location.replace(d.instagram_url);}}}catch(e){}window.location.replace("${FALLBACK_INSTAGRAM_URL}");}}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="preconnect" href="https://www.instagram.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Follow Mr Saqib on Instagram | Saqib Visuals (@mr_saqib242)</title>
        <meta name="title" content="Follow Mr Saqib on Instagram | Saqib Visuals (@mr_saqib242)" />
        <meta
          name="description"
          content="Follow Muhammad Saqib on Instagram (@mr_saqib242). Curated aesthetic UI designs, developer culture, and premium tech visuals."
        />
        <meta
          name="keywords"
          content="mr saqib instagram, saqib instagram, mr_saqib242, saqib visuals instagram, web developer instagram pakistan"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/instagram" />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/insta" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Follow Mr Saqib on Instagram (@mr_saqib242)" />
        <meta
          property="og:description"
          content="Aesthetic UI designs, developer workflows, and premium tech visuals by Muhammad Saqib."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/insta" />
        <meta name="twitter:title" content="Follow Mr Saqib on Instagram (@mr_saqib242)" />
        <meta
          name="twitter:description"
          content="Aesthetic UI designs, developer workflows, and premium tech visuals by Muhammad Saqib."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Favicon & Touch Icons */}
        <link rel="icon" href={PREVIEW_IMAGE} />
        <link rel="apple-touch-icon" href={PREVIEW_IMAGE} />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-fuchsia-950/30">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg shadow-fuchsia-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#080b12] rounded-[14px] flex items-center justify-center">
            <SiInstagram className="w-10 h-10 text-rose-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-rose-400" />
          <span>Official Visual Showcase</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to Instagram...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Opening <span className="text-rose-400 font-semibold">@mr_saqib242</span> for modern UI concepts, tech stories, and creative developer logs.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaCamera className="w-3.5 h-3.5 text-rose-400" />
            <span>Showcases</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaPalette className="w-3.5 h-3.5 text-purple-400" />
            <span>Visuals</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
          <span className="text-xs text-slate-400 font-mono">Opening Instagram...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30 active:scale-[0.98]"
        >
          <span>Open Instagram Profile</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Short Redirect Hub</span>
          <span className="font-mono text-rose-500/80">@mr_saqib242</span>
        </div>
      </div>
    </div>
  );
}
