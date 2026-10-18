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
      '@id': 'https://mrsaqib242.vercel.app/facebook#webpage',
      url: 'https://mrsaqib242.vercel.app/facebook',
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
      '@id': 'https://mrsaqib242.vercel.app/facebook#breadcrumb',
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

export default function FacebookRedirectPage() {
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
        <title>Muhammad Saqib Official Facebook Profile | Web Developer Pakistan</title>
        <meta name="title" content="Muhammad Saqib Official Facebook Profile | Web Developer Pakistan" />
        <meta
          name="description"
          content="Connect with Muhammad Saqib (Mr Saqib / Saqib 242) on Facebook. Hire for custom web development, e-commerce stores, Next.js apps, and digital branding."
        />
        <meta
          name="keywords"
          content="mr saqib facebook, saqib facebook, saqib 242 facebook, muhammad saqib facebook, web developer facebook pakistan, freelance developer faisalabad facebook"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/facebook" />

        {/* Fallback Refresh Meta */}
        <meta httpEquiv="refresh" content={`0; url=${FALLBACK_FACEBOOK_URL}`} />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/facebook" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Connect with Muhammad Saqib on Facebook" />
        <meta
          property="og:description"
          content="Official Facebook profile of Muhammad Saqib (Saqib 242) — Full-stack developer and cyber security specialist from Pakistan."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/facebook" />
        <meta name="twitter:title" content="Connect with Muhammad Saqib on Facebook" />
        <meta
          name="twitter:description"
          content="Official Facebook profile of Muhammad Saqib (Saqib 242) — Full-stack developer from Pakistan."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk Facebook Blue Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1877F2]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/85 border border-[#1877F2]/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-blue-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#1877F2] to-[#00c6ff] p-0.5 shadow-lg shadow-[#1877F2]/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#080d1a] rounded-[14px] flex items-center justify-center">
            <FaFacebookF className="w-10 h-10 text-[#1877F2]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-[#1877F2]" />
          <span>Verified Official Profile</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to Facebook...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Opening official Facebook profile of <span className="text-blue-400 font-semibold">Muhammad Saqib</span> for client reviews, project updates, and direct messaging.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaUsers className="w-3.5 h-3.5 text-blue-400" />
            <span>Community</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaGlobe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Projects</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#1877F2] animate-ping" />
          <span className="text-xs text-blue-300 font-mono font-medium">Opening Facebook profile...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#1877F2] to-[#0d62d9] hover:from-[#166fe5] hover:to-[#0a56bf] text-white font-semibold text-sm transition-all shadow-lg shadow-[#1877F2]/30 active:scale-[0.98]"
        >
          <FaFacebookF className="w-4 h-4" />
          <span>Click Here if Not Redirected</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Portal</span>
          <span className="font-mono text-blue-400/80">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
