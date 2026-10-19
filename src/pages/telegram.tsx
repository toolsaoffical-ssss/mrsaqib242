import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaExternalLinkAlt, FaCheckCircle, FaPaperPlane, FaShieldAlt, FaComments, FaCopy, FaCheck } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_TELEGRAM_URL = DEFAULT_PROFILE_SETTINGS.telegram_url || 'https://t.me/mrsaqib242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://mrsaqib242.vercel.app/telegram#webpage',
      url: 'https://mrsaqib242.vercel.app/telegram',
      name: 'Mr Saqib Official Telegram (@mrsaqib242) | Direct Chat & Developer Channel',
      description: 'Official verified Telegram channel and priority direct chat for Muhammad Saqib (Mr Saqib / Saqib 242). Connect at https://t.me/mrsaqib242 for high-speed Next.js web application development, custom software, cyber security audits, and client consultation in Pakistan (@mrsaqib242).',
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
      alternateName: ['Mr Saqib', 'Saqib 242', 'mrsaqib242', 'Saqib Visuals', 'Saqib Dev'],
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
      knowsAbout: ['Next.js', 'React', 'Cyber Security', 'Full-Stack Web Development', 'Supabase', 'Generative AI API'],
      sameAs: [
        FALLBACK_TELEGRAM_URL,
        'https://wa.me/923478936242',
        'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I',
        'https://github.com/mrsaqib242',
        'https://instagram.com/mr_saqib242',
        'https://www.tiktok.com/@mr_saqib_242'
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://mrsaqib242.vercel.app/telegram#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How can I chat directly with Mr Saqib on Telegram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can start a priority conversation with Muhammad Saqib on Telegram via https://t.me/mrsaqib242 or handle @mrsaqib242 for direct client inquiries and web engineering consultations.'
          }
        },
        {
          '@type': 'Question',
          name: 'What services does Mr Saqib provide on Telegram?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Full-stack Next.js web application development, Supabase RLS cyber security audits, custom tools/APIs, and Google Gemini AI integrations.'
          }
        }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://mrsaqib242.vercel.app/telegram#breadcrumb',
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
          name: 'Telegram Profile',
          item: 'https://mrsaqib242.vercel.app/telegram'
        }
      ]
    }
  ]
};

export default function TelegramRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_TELEGRAM_URL);
  const [copied, setCopied] = useState(false);

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
          if (parsed.telegram_url && parsed.telegram_url.trim()) {
            const url = parsed.telegram_url.trim();
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
          .select('telegram_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.telegram_url && data.telegram_url.trim()) ? data.telegram_url.trim() : FALLBACK_TELEGRAM_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_TELEGRAM_URL);
      }
    }

    resolveAndRedirect();
    return () => { isMounted = false; };
  }, []);

  const copyUsername = () => {
    navigator.clipboard.writeText('@mrsaqib242');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        {/* Instant 0ms Script: executes before React hydration only for real human visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){var u=(navigator.userAgent||"").toLowerCase();var b=/google|bot|crawler|spider|inspection|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|lighthouse/i.test(u);if(!b){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.telegram_url){window.location.replace(d.telegram_url);}}}catch(e){}window.location.replace("${FALLBACK_TELEGRAM_URL}");}}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://t.me" />
        <link rel="preconnect" href="https://t.me" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Mr Saqib Official Telegram (@mrsaqib242) | Direct Chat &amp; Developer Channel</title>
        <meta name="title" content="Mr Saqib Official Telegram (@mrsaqib242) | Direct Chat & Developer Channel" />
        <meta
          name="description"
          content="Connect with Muhammad Saqib (Mr Saqib / Saqib 242) on Telegram (@mrsaqib242). Get priority developer support, Next.js code updates, cyber security alerts, and direct project consultations (https://t.me/mrsaqib242)."
        />
        <meta
          name="keywords"
          content="mr saqib telegram, saqib telegram, mr saqib tg, saqib tg, mrsaqib242 telegram, saqib 242 telegram, t.me/mrsaqib242, muhammad saqib telegram, saqib telegram channel, mr saqib, saqib 242, full stack developer telegram pakistan, hire saqib telegram, saqib visuals telegram, telegram web developer, 03478936242"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/telegram" />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/telegram" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Connect with Mr Saqib on Telegram (@mrsaqib242)" />
        <meta
          property="og:description"
          content="Instant direct chat, technical consultations, and exclusive tech updates with Muhammad Saqib on Telegram."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/telegram" />
        <meta name="twitter:title" content="Connect with Mr Saqib on Telegram (@mrsaqib242)" />
        <meta
          name="twitter:description"
          content="Instant direct chat, technical consultations, and exclusive tech updates with Muhammad Saqib on Telegram."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Telegram Blue Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#229ED9]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#0088cc]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/85 border border-[#229ED9]/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-sky-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#2AABEE] to-[#229ED9] p-0.5 shadow-lg shadow-[#229ED9]/30 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#080912] rounded-[14px] flex items-center justify-center">
            <FaTelegramPlane className="w-10 h-10 text-[#229ED9]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#229ED9]/10 border border-[#229ED9]/20 text-[#229ED9] text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-[#229ED9]" />
          <span>Verified Telegram Channel</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to Telegram...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Connecting to <span className="text-sky-400 font-semibold">@mrsaqib242</span> on Telegram for priority client chat, tech drops, and rapid project onboarding.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaPaperPlane className="w-3.5 h-3.5 text-sky-400" />
            <span>Direct Chat</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaComments className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fast Support</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-[#229ED9] animate-ping" />
          <span className="text-xs text-sky-300 font-mono font-medium">Opening Telegram messenger...</span>
        </div>

        <div className="space-y-3">
          <a
            href={targetUrl}
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#2AABEE] to-[#229ED9] hover:from-[#229ED9] hover:to-[#1d82b4] text-white font-semibold text-sm transition-all shadow-lg shadow-[#229ED9]/30 active:scale-[0.98]"
          >
            <FaTelegramPlane className="w-4 h-4" />
            <span>Open Telegram Now</span>
            <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
          </a>

          <button
            type="button"
            onClick={copyUsername}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 transition-colors cursor-pointer"
          >
            {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
            <span>{copied ? 'Copied @mrsaqib242 to clipboard!' : 'Copy Username (@mrsaqib242)'}</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Portal</span>
          <span className="font-mono text-sky-400/80">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
