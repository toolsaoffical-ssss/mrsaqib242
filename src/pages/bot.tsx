import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaRobot, FaWhatsapp, FaExternalLinkAlt, FaCheckCircle, FaBolt, FaShieldAlt, FaTerminal, FaCode } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_BOT_URL = DEFAULT_PROFILE_SETTINGS.bot_url || 'https://saqib-md.vercel.app';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.mrsaqib.me/bot#software',
      name: 'Saqib MD Bot',
      alternateName: ['Saqib Bot', 'Saqib MD', 'Saqib WhatsApp Bot', 'Saqib-MD Bot', 'Saqib MD User Bot'],
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Android, iOS, Windows, macOS, Linux, Cloud Engine',
      softwareVersion: '2.4.2',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      description: 'Saqib MD Bot is an elite multi-device WhatsApp user bot engineered by Muhammad Saqib (Saqib 242). Features lightning-fast auto replies, media downloaders, group moderation, and custom command modules.',
      url: 'https://www.mrsaqib.me/bot',
      downloadUrl: FALLBACK_BOT_URL,
      featureList: [
        'Multi-Device WhatsApp Web Pairing',
        'High-Speed Cloud Deployment on Vercel',
        'Automated Chat & Group Administration',
        'TikTok, YouTube, Facebook Media Downloader',
        'Custom Commands & Plugin Architecture',
        '24/7 Zero-Lag Uptime Engine'
      ],
      author: {
        '@type': 'Person',
        '@id': 'https://www.mrsaqib.me/#person',
        name: 'Muhammad Saqib',
        alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Dev', 'Saqib MD'],
        url: 'https://www.mrsaqib.me'
      }
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.mrsaqib.me/bot#webpage',
      url: 'https://www.mrsaqib.me/bot',
      name: 'Saqib MD Bot | Powerful WhatsApp User Bot by Muhammad Saqib',
      description: 'Official launch portal and gateway for Saqib MD Bot. Connect your WhatsApp, generate pairing codes, and automate your daily tasks with ultrasonic speed.',
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
      alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Visuals', 'Saqib Dev', 'Saqib MD'],
      jobTitle: 'Lead Full-Stack Web Architect & Bot Engineer',
      telephone: '+923478936242',
      email: 'mrsaqib242242@gmail.com',
      url: 'https://www.mrsaqib.me',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gojra',
        addressRegion: 'Punjab',
        addressCountry: 'PK'
      },
      sameAs: [
        FALLBACK_BOT_URL,
        'https://wa.me/923478936242',
        'https://github.com/techai342',
        'https://instagram.com/mr_saqib242',
        'https://tiktok.com/@mr_saqib_242'
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.mrsaqib.me/bot#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Saqib MD Bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Saqib MD Bot (also known as Saqib Bot) is a multi-device WhatsApp user bot built by Muhammad Saqib. It provides automated intelligent chat controls, group moderation, fast media downloaders, and custom plugin integration.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I connect and launch Saqib MD Bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can launch Saqib MD Bot directly by opening https://www.mrsaqib.me/bot or https://saqib-md.vercel.app. Click "Open Bot" to generate your pairing code and link your WhatsApp multi-device session securely.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Saqib MD Bot free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Saqib MD Bot is 100% free and open for users. It is optimized for zero latency and runs seamlessly on modern cloud hosting.'
          }
        },
        {
          '@type': 'Question',
          name: 'Who created Saqib MD Bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Saqib MD Bot was created and engineered by Muhammad Saqib (Mr Saqib / Saqib 242), a full-stack engineer and cyber security specialist from Gojra, Punjab, Pakistan.'
          }
        }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mrsaqib.me/bot#breadcrumb',
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
          name: 'Saqib MD Bot',
          item: 'https://www.mrsaqib.me/bot'
        }
      ]
    }
  ]
};

export default function BotShortRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_BOT_URL);

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
          if (parsed.bot_url && parsed.bot_url.trim()) {
            const url = parsed.bot_url.trim();
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
          .select('bot_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.bot_url && data.bot_url.trim()) ? data.bot_url.trim() : FALLBACK_BOT_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_BOT_URL);
      }
    }

    resolveAndRedirect();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        {/* Instant 0ms Script: executes before React hydration for real human visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){var u=(navigator.userAgent||"").toLowerCase();var b=/google|bot|crawler|spider|inspection|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|lighthouse/i.test(u);if(!b){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.bot_url){window.location.replace(d.bot_url);}}}catch(e){}window.location.replace("${FALLBACK_BOT_URL}");}}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://saqib-md.vercel.app" />
        <link rel="preconnect" href="https://saqib-md.vercel.app" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Saqib MD Bot | Powerful WhatsApp User Bot by Muhammad Saqib (mrsaqib.me/bot)</title>
        <meta name="title" content="Saqib MD Bot | Powerful WhatsApp User Bot by Muhammad Saqib (mrsaqib.me/bot)" />
        <meta
          name="description"
          content="Saqib MD Bot (Saqib Bot) is a powerful, multi-device WhatsApp user bot engineered by Muhammad Saqib. Automate chats, media downloading, group moderation, and custom commands. Launch Saqib MD instantly."
        />
        <meta
          name="keywords"
          content="saqib bot, saqib md, saqib md bot, saqib whatsapp bot, mr saqib bot, saqib bot vercel, saqib-md vercel, saqib md whatsapp user bot, whatsapp user bot by saqib, saqib242 bot, saqib md multi device bot, download saqib md bot, saqib md pair code, saqib md session id, saqib bot gojra, saqib bot faisalabad"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://www.mrsaqib.me/bot" />

        {/* Geographic / Regional SEO Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1494;72.6842" />
        <meta name="ICBM" content="31.1494, 72.6842" />

        {/* OpenGraph / WhatsApp Rich Preview Card */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mrsaqib.me/bot" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Saqib MD Bot | Powerful WhatsApp User Bot by Saqib" />
        <meta
          property="og:description"
          content="Connect and automate your WhatsApp chats with Saqib MD Bot. Built by Muhammad Saqib (Saqib 242). High-speed, multi-device, and 100% cloud hosted."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.mrsaqib.me/bot" />
        <meta name="twitter:title" content="Saqib MD Bot | Powerful WhatsApp User Bot by Saqib" />
        <meta
          name="twitter:description"
          content="Connect and automate your WhatsApp chats with Saqib MD Bot. Built by Muhammad Saqib (Saqib 242)."
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
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <main className="relative z-10 max-w-md w-full bg-slate-900/85 border border-cyan-500/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-cyan-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#08171b] rounded-[14px] flex items-center justify-center">
            <FaRobot className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-cyan-400" />
          <span>Official WhatsApp User Bot</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Saqib MD Bot
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Launching <span className="text-cyan-400 font-semibold">Saqib MD</span> cloud engine for high-speed WhatsApp multi-device pairing and automated workflows.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Multi-Device</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaBolt className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero Latency</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-cyan-400" />
            <span>100% Free</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs text-cyan-400/90 font-mono font-medium">Opening Saqib MD Bot...</span>
        </div>

        <a
          href={targetUrl}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-600/30 active:scale-[0.98]"
        >
          <FaRobot className="w-4 h-4 text-black" />
          <span>Launch Saqib MD Bot Now</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1 text-black" />
        </a>

        {/* SEO Information Section (Indexed by Search Crawlers) */}
        <article className="mt-8 pt-6 border-t border-slate-800/80 text-left text-xs text-slate-400 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center gap-2">
              <FaTerminal className="text-cyan-400 w-3.5 h-3.5" />
              About Saqib MD WhatsApp Bot
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-400">
              <strong>Saqib MD Bot</strong> (commonly searched as <em>saqib bot</em> or <em>saqib md</em>) is an automated WhatsApp bot system developed by <strong>Muhammad Saqib</strong> (Saqib 242). It allows users to link their WhatsApp account via web pairing, download status videos, moderate WhatsApp groups, and execute custom plugins with continuous uptime.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center gap-2">
              <FaCode className="text-emerald-400 w-3.5 h-3.5" />
              Key Features & Capabilities
            </h2>
            <ul className="text-[11px] list-disc list-inside space-y-1 text-slate-400">
              <li>Direct Pair Code generator for instant WhatsApp link.</li>
              <li>Multi-device synchronization without keeping phone connected.</li>
              <li>HD video & audio downloader (TikTok, YouTube, Reels, Facebook).</li>
              <li>Built-in group security, anti-link protection, and auto-greeting.</li>
            </ul>
          </div>
        </article>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Engineered by Muhammad Saqib</span>
          <span className="font-mono text-cyan-500/80">Saqib242 • Gojra, PK</span>
        </div>
      </main>
    </div>
  );
}
