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
      '@id': 'https://mrsaqib242.vercel.app/instagram#webpage',
      url: 'https://mrsaqib242.vercel.app/instagram',
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
      '@id': 'https://mrsaqib242.vercel.app/instagram#breadcrumb',
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

export default function InstagramRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_INSTAGRAM_URL);

  useEffect(() => {
    let isMounted = true;

    async function resolveAndRedirect() {
      // 1. Try local storage cache first for instant redirect
      if (typeof window !== 'undefined') {
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
      }

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
        {/* Instant 0ms LocalCache Script: executes before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.instagram_url){window.location.replace(d.instagram_url);}}}catch(e){}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="preconnect" href="https://www.instagram.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Muhammad Saqib Official Instagram | Saqib Visuals (@mr_saqib242)</title>
        <meta name="title" content="Muhammad Saqib Official Instagram | Saqib Visuals (@mr_saqib242)" />
        <meta
          name="description"
          content="Follow Muhammad Saqib (Mr Saqib / Saqib 242) on Instagram (@mr_saqib242). Explore Saqib Visuals UI designs, web animations, Next.js portfolios, and creative builds."
        />
        <meta
          name="keywords"
          content="mr saqib instagram, saqib instagram, mr_saqib242 instagram, saqib visuals, saqib 242 instagram, web designer instagram pakistan, ui ux developer instagram"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/instagram" />

        {/* Fallback Refresh Meta */}
        <meta httpEquiv="refresh" content={`1; url=${targetUrl}`} />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/instagram" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Follow Muhammad Saqib on Instagram (@mr_saqib242)" />
        <meta
          property="og:description"
          content="Explore cinematic web development, Saqib Visuals graphic posters, and Next.js applications by Muhammad Saqib."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/instagram" />
        <meta name="twitter:title" content="Follow Muhammad Saqib on Instagram (@mr_saqib242)" />
        <meta
          name="twitter:description"
          content="Explore cinematic web development, Saqib Visuals graphic posters, and Next.js applications by Muhammad Saqib."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk Instagram Gradient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E1306C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#833AB4]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/85 border border-[#E1306C]/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-pink-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5 shadow-lg shadow-[#E1306C]/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#12070f] rounded-[14px] flex items-center justify-center">
            <SiInstagram className="w-10 h-10 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1306C]/10 border border-[#E1306C]/20 text-[#E1306C] text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-[#E1306C]" />
          <span>Verified Official Profile</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to Instagram...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Opening official Instagram page of <span className="text-pink-400 font-semibold">@mr_saqib242</span> (Saqib Visuals) for web design galleries, reels, and stories.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaCamera className="w-3.5 h-3.5 text-pink-400" />
            <span>Design Reels</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaPalette className="w-3.5 h-3.5 text-amber-400" />
            <span>Saqib Visuals</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified ID</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#E1306C] animate-ping" />
          <span className="text-xs text-pink-300 font-mono font-medium">Opening Instagram profile...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-semibold text-sm transition-all shadow-lg shadow-[#E1306C]/30 active:scale-[0.98]"
        >
          <SiInstagram className="w-4 h-4" />
          <span>Click Here if Not Redirected</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Portal</span>
          <span className="font-mono text-pink-400/80">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
