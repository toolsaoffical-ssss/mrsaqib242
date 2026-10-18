import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaExternalLinkAlt, FaCheckCircle, FaCamera, FaBolt, FaShieldAlt } from 'react-icons/fa';
import { SiSnapchat } from 'react-icons/si';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_SNAPCHAT_URL = DEFAULT_PROFILE_SETTINGS.snapchat_url || 'https://www.snapchat.com/add/mrsaqib242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://mrsaqib242.vercel.app/snapchat#webpage',
      url: 'https://mrsaqib242.vercel.app/snapchat',
      name: 'Muhammad Saqib Official Snapchat | Add on Snap (@mrsaqib242)',
      description: 'Official verified Snapchat profile of Muhammad Saqib (Mr Saqib / Saqib 242). Behind-the-scenes developer stories, coding life in Pakistan, and instant snaps.',
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
      alternateName: ['Mr Saqib', 'Saqib 242', 'mrsaqib242'],
      jobTitle: 'Lead Full-Stack Web Architect',
      url: 'https://mrsaqib242.vercel.app',
      sameAs: [
        FALLBACK_SNAPCHAT_URL,
        'https://wa.me/923478936242',
        'https://github.com/techai342',
        'https://instagram.com/mr_saqib242'
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://mrsaqib242.vercel.app/snapchat#breadcrumb',
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
          name: 'Snapchat Profile',
          item: 'https://mrsaqib242.vercel.app/snapchat'
        }
      ]
    }
  ]
};

export default function SnapchatRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_SNAPCHAT_URL);

  useEffect(() => {
    let isMounted = true;

    async function resolveAndRedirect() {
      // 1. Try local storage cache first for instant redirect
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('saqib_profile_settings_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.snapchat_url && parsed.snapchat_url.trim()) {
              const url = parsed.snapchat_url.trim();
              if (isMounted) setTargetUrl(url);
              window.location.replace(url);
              return;
            }
          }
        } catch {}
      }

      // 2. Fetch fresh dynamic URL from Supabase in real-time
      try {
        const { data } = await supabase
          .from('profile_settings')
          .select('snapchat_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.snapchat_url && data.snapchat_url.trim()) ? data.snapchat_url.trim() : FALLBACK_SNAPCHAT_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_SNAPCHAT_URL);
      }
    }

    resolveAndRedirect();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        {/* Instant 0ms LocalCache Script: executes before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.snapchat_url){window.location.replace(d.snapchat_url);}}}catch(e){}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://www.snapchat.com" />
        <link rel="preconnect" href="https://www.snapchat.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Muhammad Saqib Official Snapchat | Add on Snap (@mrsaqib242)</title>
        <meta name="title" content="Muhammad Saqib Official Snapchat | Add on Snap (@mrsaqib242)" />
        <meta
          name="description"
          content="Add Muhammad Saqib (Mr Saqib / Saqib 242) on Snapchat (@mrsaqib242). Follow developer day-in-the-life, coding stories, and behind-the-scenes tech builds."
        />
        <meta
          name="keywords"
          content="mr saqib snapchat, saqib snapchat, mrsaqib242 snapchat, saqib 242 snap, add saqib on snapchat, pakistani developer snapchat"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/snapchat" />

        {/* Fallback Refresh Meta */}
        <meta httpEquiv="refresh" content={`1; url=${targetUrl}`} />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/snapchat" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Add Muhammad Saqib on Snapchat (@mrsaqib242)" />
        <meta
          property="og:description"
          content="Follow developer stories, lifestyle, and coding updates by Muhammad Saqib on Snapchat."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/snapchat" />
        <meta name="twitter:title" content="Add Muhammad Saqib on Snapchat (@mrsaqib242)" />
        <meta
          name="twitter:description"
          content="Follow developer stories and coding updates by Muhammad Saqib on Snapchat."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk Snapchat Yellow Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFFC00]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/85 border border-[#FFFC00]/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-yellow-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#FFFC00] to-[#f59e0b] p-0.5 shadow-lg shadow-[#FFFC00]/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#121105] rounded-[14px] flex items-center justify-center">
            <SiSnapchat className="w-10 h-10 text-[#FFFC00]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFC00]/10 border border-[#FFFC00]/20 text-[#FFFC00] text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-[#FFFC00]" />
          <span>Verified Official Profile</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to Snapchat...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Adding <span className="text-yellow-300 font-semibold">@mrsaqib242</span> on Snapchat for daily dev stories, live coding snaps, and quick interactions.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaCamera className="w-3.5 h-3.5 text-yellow-300" />
            <span>Dev Stories</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaBolt className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Drops</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#FFFC00] animate-ping" />
          <span className="text-xs text-yellow-200 font-mono font-medium">Opening Snapchat app...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FFFC00] to-[#e6e300] hover:from-[#e6e300] hover:to-[#ccc900] text-black font-black text-sm transition-all shadow-lg shadow-[#FFFC00]/30 active:scale-[0.98]"
        >
          <SiSnapchat className="w-4 h-4 text-black" />
          <span>Click Here if Not Redirected</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Portal</span>
          <span className="font-mono text-yellow-300/80">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
