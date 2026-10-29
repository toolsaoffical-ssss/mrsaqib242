import { useEffect, useState } from 'react';
import Head from 'next/head';
import { FaExternalLinkAlt, FaCheckCircle, FaShieldAlt, FaCopy, FaCheck, FaGithub, FaCode, FaLaptopCode } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_GITHUB_URL = DEFAULT_PROFILE_SETTINGS.github_url || 'https://github.com/mr-saqib-242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': 'https://www.mrsaqib.me/github#webpage',
      url: 'https://www.mrsaqib.me/github',
      name: 'Mr Saqib Official GitHub (@mr-saqib-242) | Open Source Repositories & Developer Code',
      description: 'Official verified GitHub profile and open-source software repositories for Muhammad Saqib (Mr Saqib / Saqib 242). Access high-performance Next.js architectures, AI automations, security tools, and developer codebases at https://github.com/mr-saqib-242.',
      inLanguage: ['en-US', 'ur-PK'],
      dateCreated: '2024-01-01T00:00:00+05:00',
      dateModified: '2026-10-29T20:00:00+05:00',
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
      },
      mainEntity: {
        '@type': 'Person',
        '@id': 'https://www.mrsaqib.me/#person',
        name: 'Muhammad Saqib',
        alternateName: ['Mr Saqib', 'Saqib 242', 'mrsaqib242', 'mr-saqib-242', 'Saqib Visuals', 'Saqib Dev'],
        identifier: 'mr-saqib-242',
        jobTitle: 'Lead Full-Stack Web Architect & Cyber Security Specialist',
        description: 'Muhammad Saqib (Mr Saqib) is an elite cyber security specialist, full-stack engineer, and open-source software architect.',
        telephone: '+923478936242',
        email: 'mrsaqib242242@gmail.com',
        url: 'https://www.mrsaqib.me',
        image: PREVIEW_IMAGE,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Gojra',
          addressRegion: 'Punjab',
          addressCountry: 'PK'
        },
        knowsAbout: ['Next.js', 'React', 'Cyber Security', 'Full-Stack Web Development', 'Supabase', 'Generative AI API', 'Open Source Software'],
        sameAs: [
          FALLBACK_GITHUB_URL,
          'https://github.com/mrsaqib242',
          'https://t.me/mrsaqib242',
          'https://wa.me/923478936242',
          'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I',
          'https://instagram.com/mr_saqib242',
          'https://www.tiktok.com/@mr_saqib_242'
        ]
      }
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.mrsaqib.me/github#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How can I access Mr Saqib\'s public repositories on GitHub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can access Muhammad Saqib\'s official verified public GitHub repositories and open-source code at https://github.com/mr-saqib-242 (@mr-saqib-242).'
          }
        },
        {
          '@type': 'Question',
          name: 'What software and frameworks does Mr Saqib publish on GitHub?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Full-stack Next.js production codebases, React 19 UI systems, Supabase Row-Level Security templates, Node.js RESTful APIs, and Google Gemini AI tools.'
          }
        }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mrsaqib.me/github#breadcrumb',
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
          name: 'GitHub Profile',
          item: 'https://www.mrsaqib.me/github'
        }
      ]
    }
  ]
};

export default function GitHubRedirectPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_GITHUB_URL);
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
          if (parsed.github_url && parsed.github_url.trim()) {
            const url = parsed.github_url.trim();
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
          .select('github_url')
          .eq('id', 'default')
          .maybeSingle();

        const liveUrl = (data?.github_url && data.github_url.trim()) ? data.github_url.trim() : FALLBACK_GITHUB_URL;
        if (isMounted) {
          setTargetUrl(liveUrl);
          window.location.replace(liveUrl);
        }
      } catch {
        window.location.replace(FALLBACK_GITHUB_URL);
      }
    }

    resolveAndRedirect();
    return () => { isMounted = false; };
  }, []);

  const copyUsername = () => {
    navigator.clipboard.writeText('mr-saqib-242');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        {/* Instant 0ms Script: executes before React hydration only for real human visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){var u=(navigator.userAgent||"").toLowerCase();var b=/google|bot|crawler|spider|inspection|slurp|facebookexternalhit|whatsapp|telegram|discord|preview|lighthouse/i.test(u);if(!b){try{var c=localStorage.getItem("saqib_profile_settings_cache");if(c){var d=JSON.parse(c);if(d.github_url){window.location.replace(d.github_url);}}}catch(e){}window.location.replace("${FALLBACK_GITHUB_URL}");}}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Mr Saqib Official GitHub (@mr-saqib-242) | Open Source Repositories &amp; Developer Code</title>
        <meta name="title" content="Mr Saqib Official GitHub (@mr-saqib-242) | Open Source Repositories & Developer Code" />
        <meta
          name="description"
          content="Explore Muhammad Saqib's official public GitHub profile (@mr-saqib-242). Discover open-source software, high-performance Next.js templates, AI agents, and developer repositories (https://github.com/mr-saqib-242)."
        />
        <meta
          name="keywords"
          content="mr saqib github, mr-saqib-242, saqib github, mr saqib gh, saqib dev github, muhammad saqib github, github.com/mr-saqib-242, saqib 242 github, mrsaqib242, open source developer pakistan, full stack engineer github, nextjs developer github"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://www.mrsaqib.me/github" />

        {/* OpenGraph / Social Rich Preview Card */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://www.mrsaqib.me/github" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Connect with Mr Saqib on GitHub (@mr-saqib-242)" />
        <meta
          property="og:description"
          content="Explore open-source repositories, Next.js web applications, and developer tools by Muhammad Saqib on GitHub."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.mrsaqib.me/github" />
        <meta name="twitter:title" content="Connect with Mr Saqib on GitHub (@mr-saqib-242)" />
        <meta
          name="twitter:description"
          content="Explore open-source repositories, Next.js web applications, and developer tools by Muhammad Saqib on GitHub."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-zinc-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-zinc-950/85 border border-white/15 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-black/80">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-900 p-0.5 shadow-lg shadow-white/10 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#0d1117] rounded-[14px] flex items-center justify-center">
            <FaGithub className="w-11 h-11 text-white" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-300 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-emerald-400" />
          <span>Verified GitHub Profile</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to GitHub...
        </h1>
        <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
          Connecting to <span className="text-white font-semibold font-mono">@mr-saqib-242</span> on GitHub for open-source software, Next.js codebases, and developer tools.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-zinc-300">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaCode className="w-3.5 h-3.5 text-purple-400" />
            <span>Open Source</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clean Code</span>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaLaptopCode className="w-3.5 h-3.5 text-sky-400" />
            <span>Full-Stack</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-xs text-zinc-300 font-mono font-medium">Opening GitHub repositories...</span>
        </div>

        <div className="space-y-3">
          <a
            href={targetUrl}
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 hover:from-zinc-700 hover:to-zinc-600 text-white font-semibold text-sm transition-all shadow-lg shadow-black/50 border border-white/20 active:scale-[0.98]"
          >
            <FaGithub className="w-4 h-4" />
            <span>Open GitHub Now</span>
            <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
          </a>

          <button
            type="button"
            onClick={copyUsername}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 transition-colors cursor-pointer"
          >
            {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
            <span>{copied ? 'Copied mr-saqib-242 to clipboard!' : 'Copy Username (mr-saqib-242)'}</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span>Official Developer Repositories</span>
          <span className="font-mono text-zinc-400">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
