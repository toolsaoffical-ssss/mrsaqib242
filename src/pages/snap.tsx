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
      '@id': 'https://mrsaqib242.vercel.app/snap#webpage',
      url: 'https://mrsaqib242.vercel.app/snap',
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
      '@id': 'https://mrsaqib242.vercel.app/snap#breadcrumb',
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

export default function SnapchatShortRedirectPage() {
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
        {/* Instant 0ms Script: executes before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.snapchat_url){window.location.replace(d.snapchat_url);return;}}}catch(e){}window.location.replace("${FALLBACK_SNAPCHAT_URL}");}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://www.snapchat.com" />
        <link rel="preconnect" href="https://www.snapchat.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Add Mr Saqib on Snapchat | Daily Tech Stories (@mrsaqib242)</title>
        <meta name="title" content="Add Mr Saqib on Snapchat | Daily Tech Stories (@mrsaqib242)" />
        <meta
          name="description"
          content="Connect with Muhammad Saqib on Snapchat (@mrsaqib242). Follow for behind-the-scenes coding, tech equipment showcases, and development updates."
        />
        <meta
          name="keywords"
          content="mr saqib snapchat, saqib snapchat, mrsaqib242, saqib 242 snap, add saqib on snap"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/snapchat" />

        {/* Fallback Refresh Meta */}
        <meta httpEquiv="refresh" content={`0; url=${FALLBACK_SNAPCHAT_URL}`} />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/snap" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Add Mr Saqib on Snapchat (@mrsaqib242)" />
        <meta
          property="og:description"
          content="Connect directly with Muhammad Saqib on Snapchat for real-time stories and tech life updates."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/snap" />
        <meta name="twitter:title" content="Add Mr Saqib on Snapchat (@mrsaqib242)" />
        <meta
          name="twitter:description"
          content="Connect directly with Muhammad Saqib on Snapchat for real-time stories and tech life updates."
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-yellow-950/20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-yellow-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#080b12] rounded-[14px] flex items-center justify-center">
            <SiSnapchat className="w-10 h-10 text-yellow-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-yellow-400" />
          <span>Official Snapchat</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to Snapchat...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Adding <span className="text-yellow-400 font-semibold">@mrsaqib242</span> on Snapchat for behind-the-scenes engineering and setup stories.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaCamera className="w-3.5 h-3.5 text-yellow-400" />
            <span>Stories</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaBolt className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Updates</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
          <span className="text-xs text-slate-400 font-mono">Opening Snapchat...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-yellow-500/30 active:scale-[0.98]"
        >
          <span>Open Snapchat Profile</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-80" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Short Redirect Hub</span>
          <span className="font-mono text-yellow-500/80">@mrsaqib242</span>
        </div>
      </div>
    </div>
  );
}
