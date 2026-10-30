import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FaExternalLinkAlt,
  FaCheckCircle,
  FaShieldAlt,
  FaCopy,
  FaCheck,
  FaGithub,
  FaCode,
  FaLaptopCode,
  FaArrowLeft,
  FaStar,
  FaCodeBranch,
  FaTerminal
} from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_GITHUB_URL = DEFAULT_PROFILE_SETTINGS.github_url || 'https://github.com/mr-saqib-242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

interface GitHubStats {
  user: {
    login: string;
    name: string;
    avatar_url: string;
    html_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    location: string;
  };
  featuredRepos: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
    updatedAt: string;
  }>;
  latestActivity: {
    title: string;
    repo: string;
    timestamp: string;
  };
}

const DEFAULT_STATS: GitHubStats = {
  user: {
    login: 'mr-saqib-242',
    name: 'Muhammad Saqib',
    avatar_url: PREVIEW_IMAGE,
    html_url: 'https://github.com/mr-saqib-242',
    bio: 'Lead Full-Stack Web Architect & Cyber Security Specialist. Building high-performance Next.js architectures.',
    public_repos: 3,
    followers: 0,
    following: 0,
    location: 'Pakistan',
  },
  featuredRepos: [
    {
      name: 'crptotrading',
      description: 'TOARK Terminal — Real-Time BTC/USDT Prediction Engine & VIP Trading Signals Architecture.',
      language: 'TypeScript / Next.js',
      stars: 0,
      forks: 0,
      url: 'https://github.com/mr-saqib-242/crptotrading',
      updatedAt: 'Active Today',
    },
    {
      name: 'mrsaqib1',
      description: 'Official Developer Portfolio & Zero Trust Cyber Security Architecture.',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      url: 'https://github.com/mr-saqib-242/mrsaqib1',
      updatedAt: 'Verified',
    },
  ],
  latestActivity: {
    title: 'TOARK Terminal BTC/USDT Prediction System',
    repo: 'crptotrading',
    timestamp: 'Active today',
  },
};

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': 'https://www.mrsaqib.me/github#webpage',
      url: 'https://www.mrsaqib.me/github',
      name: 'Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile & Repositories',
      description: 'Official GitHub profile of Muhammad Saqib (@mr-saqib-242). Explore verified open-source software, full-stack Next.js production codebases, and cyber security tools.',
      inLanguage: ['en-US', 'ur-PK'],
      dateCreated: '2024-01-01T00:00:00+05:00',
      dateModified: '2026-10-30T11:45:00+05:00',
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
        description: 'Muhammad Saqib (Mr Saqib / Saqib 242) is an elite cyber security specialist, full-stack engineer, and open-source software architect recognized for building impenetrable digital systems.',
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
          name: 'Mr Saqib GitHub',
          item: 'https://www.mrsaqib.me/github'
        }
      ]
    }
  ]
};

export default function GitHubPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_GITHUB_URL);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [stats, setStats] = useState<GitHubStats>(DEFAULT_STATS);
  const [showRepos, setShowRepos] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch dynamic profile URL from cache or Supabase
    async function loadTargetUrl() {
      try {
        const cached = localStorage.getItem('saqib_profile_settings_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.github_url && parsed.github_url.trim()) {
            if (isMounted) setTargetUrl(parsed.github_url.trim());
          }
        }
      } catch {}

      try {
        const { data } = await supabase
          .from('profile_settings')
          .select('github_url')
          .eq('id', 'default')
          .maybeSingle();

        if (isMounted && data?.github_url && data.github_url.trim()) {
          setTargetUrl(data.github_url.trim());
        }
      } catch {}
    }

    // 2. Fetch Live GitHub API Stats
    async function loadGitHubStats() {
      try {
        const res = await fetch('/api/github/stats');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.user) {
            setStats(json);
          }
        }
      } catch {}
    }

    loadTargetUrl();
    loadGitHubStats();

    return () => { isMounted = false; };
  }, []);

  const copyUsername = () => {
    navigator.clipboard.writeText('mr-saqib-242');
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  const copyCloneCmd = (repoName: string) => {
    const cmd = `git clone https://github.com/mr-saqib-242/${repoName}.git`;
    navigator.clipboard.writeText(cmd);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      <Head>
        {/* DNS Prefetch & Preconnect for Fast Handshake */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile &amp; Repositories</title>
        <meta name="title" content="Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile & Repositories" />
        <meta
          name="description"
          content="Official GitHub profile of Muhammad Saqib (@mr-saqib-242). Explore verified open-source software, full-stack Next.js production codebases, and cyber security tools."
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
        <meta property="og:title" content="Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile & Repositories" />
        <meta
          property="og:description"
          content="Official GitHub profile of Muhammad Saqib (@mr-saqib-242). Explore verified open-source software, Next.js production codebases, and developer tools."
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
        <meta name="twitter:title" content="Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile & Repositories" />
        <meta
          name="twitter:description"
          content="Official GitHub profile of Muhammad Saqib (@mr-saqib-242). Explore verified open-source software, Next.js production codebases, and developer tools."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk Ambient Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-lg w-full bg-zinc-950/90 border border-white/15 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
        
        {/* Header Profile Section */}
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-zinc-700 via-purple-600/40 to-emerald-500/40 p-0.5 shadow-lg shadow-white/10 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1117] rounded-[14px] flex items-center justify-center overflow-hidden">
                <FaGithub className="w-11 h-11 text-white" />
              </div>
            </div>
            {/* Live Indicator Dot */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-zinc-950 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-3">
            <FaCheckCircle className="w-3 h-3 text-emerald-400" />
            <span>Verified GitHub Profile • @mr-saqib-242</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Mr Saqib GitHub
          </h1>
          <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
            Official developer profile and repositories for <span className="text-white font-semibold font-mono">@mr-saqib-242</span>. Explore Next.js architectures, AI prediction engines, and cybersecurity codebases.
          </p>
        </div>

        {/* Live GitHub Stats Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center">
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
            <div className="text-lg font-bold font-mono text-purple-400">
              {stats.user.public_repos > 0 ? `${stats.user.public_repos}+` : '3+'}
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Repositories</div>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
            <div className="text-lg font-bold font-mono text-emerald-400">100%</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Clean Code</div>
          </div>
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-3">
            <div className="text-lg font-bold font-mono text-sky-400">Full-Stack</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Next.js &amp; TS</div>
          </div>
        </div>

        {/* Live Activity Radar Banner */}
        <div className="bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-purple-950/30 border border-emerald-500/20 rounded-xl p-3 mb-5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-zinc-300">
              <strong className="text-white">Active Repository:</strong> crptotrading (TOARK)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
            Live Sync
          </span>
        </div>

        {/* Featured Codebases Section */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
              <FaCode className="text-purple-400" />
              <span>Featured Codebases</span>
            </div>
            <button
              type="button"
              onClick={() => setShowRepos(!showRepos)}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showRepos ? 'Hide Codebases' : 'Show Codebases'}
            </button>
          </div>

          {showRepos && (
            <div className="space-y-2.5">
              {stats.featuredRepos.map((repo) => (
                <div
                  key={repo.name}
                  className="group bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3.5 transition-all text-left"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm font-semibold text-white group-hover:text-purple-300 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{repo.name}</span>
                      <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-60" />
                    </a>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/20">
                      {repo.language}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-2.5">
                    {repo.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span className="text-emerald-400/90 font-medium">● Verified Production</span>
                    <button
                      type="button"
                      onClick={() => copyCloneCmd(repo.name)}
                      className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10"
                    >
                      <FaTerminal className="w-2.5 h-2.5" />
                      <span>{copiedClone ? 'Copied clone!' : 'Copy Clone URL'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 hover:from-zinc-700 hover:to-zinc-600 text-white font-semibold text-sm transition-all shadow-lg shadow-black/50 border border-white/20 active:scale-[0.98]"
          >
            <FaGithub className="w-4 h-4" />
            <span>Open Verified GitHub Profile</span>
            <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
          </a>

          <button
            type="button"
            onClick={copyUsername}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 transition-colors cursor-pointer"
          >
            {copiedHandle ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
            <span>{copiedHandle ? 'Copied mr-saqib-242 to clipboard!' : 'Copy GitHub Handle (@mr-saqib-242)'}</span>
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <Link href="/" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
            <FaArrowLeft className="w-2.5 h-2.5" />
            <span>Return to Portfolio</span>
          </Link>
          <span className="font-mono text-zinc-400">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
