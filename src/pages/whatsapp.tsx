import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaWhatsapp, FaExternalLinkAlt, FaCheckCircle, FaComments, FaBolt, FaShieldAlt } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_WHATSAPP_URL = DEFAULT_PROFILE_SETTINGS.whatsapp_url || 'https://wa.me/923478936242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://mrsaqib242.vercel.app/whatsapp#webpage',
      url: 'https://mrsaqib242.vercel.app/whatsapp',
      name: 'Chat with Mr Saqib on WhatsApp | Direct Contact & Consultation (03478936242)',
      description: 'Direct verified WhatsApp contact channel of Muhammad Saqib (Mr Saqib / Saqib 242). Connect for high-speed web application development, custom software, security audits, and client consultation in Pakistan (+92 347 8936242).',
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
      alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Visuals', 'Saqib Dev'],
      jobTitle: 'Lead Full-Stack Web Architect & Cyber Security Specialist',
      telephone: '+923478936242',
      email: 'mrsaqib242242@gmail.com',
      url: 'https://mrsaqib242.vercel.app',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gojra',
        addressRegion: 'Punjab',
        addressCountry: 'PK'
      },
      sameAs: [
        FALLBACK_WHATSAPP_URL,
        'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I',
        'https://github.com/techai342',
        'https://instagram.com/mr_saqib242'
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://mrsaqib242.vercel.app/whatsapp#breadcrumb',
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
          name: 'Direct WhatsApp Chat',
          item: 'https://mrsaqib242.vercel.app/whatsapp'
        }
      ]
    }
  ]
};

export default function WhatsAppRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_WHATSAPP_URL);

  useEffect(() => {
    let isMounted = true;

    async function resolveAndRedirect() {
      // 1. Try local storage cache first for instant redirect
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('saqib_profile_settings_cache');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.whatsapp_url && parsed.whatsapp_url.trim()) {
              const url = parsed.whatsapp_url.trim();
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
          .select('whatsapp_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.whatsapp_url && data.whatsapp_url.trim()) ? data.whatsapp_url.trim() : FALLBACK_WHATSAPP_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_WHATSAPP_URL);
      }
    }

    resolveAndRedirect();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        {/* Instant 0ms Script: executes before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.whatsapp_url){window.location.replace(d.whatsapp_url);return;}}}catch(e){}window.location.replace("${FALLBACK_WHATSAPP_URL}");}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://api.whatsapp.com" />
        <link rel="preconnect" href="https://wa.me" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.whatsapp.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Chat with Mr Saqib on WhatsApp | Direct Contact &amp; Consultation (03478936242)</title>
        <meta name="title" content="Chat with Mr Saqib on WhatsApp | Direct Contact & Consultation (03478936242)" />
        <meta
          name="description"
          content="Connect directly with Muhammad Saqib (Mr Saqib / Saqib 242) on WhatsApp (+92 347 8936242). Instant quotes for Next.js web applications, custom tools, cyber security audits, and bespoke software solutions."
        />
        <meta
          name="keywords"
          content="mr saqib whatsapp, saqib whatsapp, saqib 242 whatsapp, 03478936242 whatsapp, 923478936242, 03478936242, contact mr saqib whatsapp, chat with saqib, muhammad saqib whatsapp chat, whatsapp web developer pakistan, hire developer whatsapp"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/whatsapp" />

        {/* Geographic / Regional SEO Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1494;72.6842" />
        <meta name="ICBM" content="31.1494, 72.6842" />

        {/* Fallback Refresh Meta */}
        <meta httpEquiv="refresh" content={`0; url=${FALLBACK_WHATSAPP_URL}`} />

        {/* OpenGraph / WhatsApp Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/whatsapp" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Chat with Mr Saqib on WhatsApp (+92 347 8936242)" />
        <meta
          property="og:description"
          content="Direct WhatsApp chat with Muhammad Saqib for web development, custom software, security audits, and quick consultations."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/whatsapp" />
        <meta name="twitter:title" content="Chat with Mr Saqib on WhatsApp (+92 347 8936242)" />
        <meta
          name="twitter:description"
          content="Direct WhatsApp chat with Muhammad Saqib for web development, custom software, security audits, and quick consultations."
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/85 border border-emerald-500/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-emerald-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#081b13] rounded-[14px] flex items-center justify-center">
            <FaWhatsapp className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-emerald-400" />
          <span>Direct Contact Portal</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Opening WhatsApp Chat...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Connecting directly with <span className="text-emerald-400 font-semibold">Muhammad Saqib (03478936242)</span> for consultations, custom software quotes, and project discussions.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaComments className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Chat</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaBolt className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast Quote</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Verified</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-emerald-400/90 font-mono font-medium">Opening WhatsApp application...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>Click to Chat: 03478936242</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Contact</span>
          <span className="font-mono text-emerald-500/80">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
