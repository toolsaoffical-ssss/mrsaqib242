import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaFacebookF, FaExternalLinkAlt, FaCheckCircle, FaUsers, FaGlobe, FaShieldAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_FACEBOOK_URL = DEFAULT_PROFILE_SETTINGS.facebook_url || 'https://www.facebook.com/profile.php?id=100085188689033';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://mrsaqib242.vercel.app/fb#webpage',
      url: 'https://mrsaqib242.vercel.app/fb',
      name: 'Muhammad Saqib Official Facebook Profile | Web Developer & Tech Lead',
      description: 'Official verified Facebook profile of Muhammad Saqib (Mr Saqib / Saqib 242). Connect for web development services, project showcases, and tech updates in Pakistan.',
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
      alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Visuals'],
      jobTitle: 'Lead Full-Stack Web Architect',
      url: 'https://mrsaqib242.vercel.app',
      sameAs: [
        FALLBACK_FACEBOOK_URL,
        'https://wa.me/923478936242',
        'https://github.com/techai342',
        'https://instagram.com/mr_saqib242'
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://mrsaqib242.vercel.app/fb#breadcrumb',
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
          name: 'Facebook Profile',
          item: 'https://mrsaqib242.vercel.app/facebook'
        }
      ]
    }
  ]
};

export default function FacebookShortRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_FACEBOOK_URL);

  useEffect(() => {
    let isMounted = true;

    async function resolveAndRedirect() {
      // 1. Try local storage cache first for instant redirect
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('saqib_profile_settings_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.facebook_url && parsed.facebook_url.trim()) {
              const url = parsed.facebook_url.trim();
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
          .select('facebook_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.facebook_url && data.facebook_url.trim()) ? data.facebook_url.trim() : FALLBACK_FACEBOOK_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_FACEBOOK_URL);
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
            __html: `if(typeof window!=="undefined"){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.facebook_url){window.location.replace(d.facebook_url);return;}}}catch(e){}window.location.replace("${FALLBACK_FACEBOOK_URL}");}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        <link rel="preconnect" href="https://www.facebook.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Muhammad Saqib Official Facebook | Web Development &amp; Tech Updates</title>
        <meta name="title" content="Muhammad Saqib Official Facebook | Web Development & Tech Updates" />
        <meta
          name="description"
          content="Follow Muhammad Saqib on Facebook. Insights on modern web architecture, Next.js optimization, and digital engineering."
        />
        <meta
          name="keywords"
          content="mr saqib facebook, saqib facebook, saqib visuals facebook, web developer facebook pakistan, muhammad saqib"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/facebook" />

        {/* Fallback Refresh Meta */}
        <meta httpEquiv="refresh" content={`0; url=${FALLBACK_FACEBOOK_URL}`} />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/fb" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Muhammad Saqib on Facebook | Official Profile" />
        <meta
          property="og:description"
          content="Connect with Muhammad Saqib on Facebook for technology updates and software engineering collaborations."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/fb" />
        <meta name="twitter:title" content="Muhammad Saqib on Facebook | Official Profile" />
        <meta
          name="twitter:description"
          content="Connect with Muhammad Saqib on Facebook for technology updates and software engineering collaborations."
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-blue-950/30">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-blue-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
            <FaFacebookF className="w-9 h-9 text-blue-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-sky-400" />
          <span>Official Social Page</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to Facebook...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Opening <span className="text-blue-400 font-semibold">Muhammad Saqib</span>&apos;s Facebook profile for tech articles, portfolio highlights, and community updates.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaUsers className="w-3.5 h-3.5 text-blue-400" />
            <span>Network</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaGlobe className="w-3.5 h-3.5 text-sky-400" />
            <span>Showcase</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span className="text-xs text-slate-400 font-mono">Opening application...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]"
        >
          <span>Open Facebook Profile</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Short Redirect Hub</span>
          <span className="font-mono text-blue-500/80">fb / profile</span>
        </div>
      </div>
    </div>
  );
}
