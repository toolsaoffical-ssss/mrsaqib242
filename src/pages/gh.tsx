import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  FaExternalLinkAlt,
  FaCheckCircle,
  FaCopy,
  FaCheck,
  FaGithub,
  FaCode,
  FaArrowLeft,
  FaStar,
  FaTerminal,
  FaLock,
  FaUnlock,
  FaDownload,
  FaUserPlus,
  FaTimes
} from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../lib/profileSettingsService';

const FALLBACK_GITHUB_URL = DEFAULT_PROFILE_SETTINGS.github_url || 'https://github.com/mr-saqib-242';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

interface GitHubRepoItem {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  downloadUrl?: string;
  updatedAt: string;
}

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
  featuredRepos: GitHubRepoItem[];
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
    avatar_url: 'https://avatars.githubusercontent.com/u/349843210?v=4',
    html_url: 'https://github.com/mr-saqib-242',
    bio: 'Lead Full-Stack Web Architect & Cyber Security Specialist.',
    public_repos: 3,
    followers: 0,
    following: 0,
    location: 'Pakistan',
  },
  featuredRepos: [
    {
      name: 'mrsaqib3',
      description: 'Production Next.js Web Architecture & High-Performance Developer Suite.',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      url: 'https://github.com/mr-saqib-242/mrsaqib3',
      downloadUrl: 'https://github.com/mr-saqib-242/mrsaqib3/archive/refs/heads/main.zip',
      updatedAt: 'Updated 16h ago',
    },
    {
      name: 'mrsaqib2',
      description: 'Full-Stack Developer Portfolio, UI Components & Cloud Integration.',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      url: 'https://github.com/mr-saqib-242/mrsaqib2',
      downloadUrl: 'https://github.com/mr-saqib-242/mrsaqib2/archive/refs/heads/main.zip',
      updatedAt: 'Updated 17h ago',
    },
    {
      name: 'mrsaqib1',
      description: 'Official Developer Portfolio & Zero Trust Cyber Security Architecture.',
      language: 'TypeScript',
      stars: 0,
      forks: 0,
      url: 'https://github.com/mr-saqib-242/mrsaqib1',
      downloadUrl: 'https://github.com/mr-saqib-242/mrsaqib1/archive/refs/heads/main.zip',
      updatedAt: 'Updated 17h ago',
    },
  ],
  latestActivity: {
    title: 'Production Next.js Architecture',
    repo: 'mrsaqib3',
    timestamp: 'Updated 16h ago',
  },
};

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': 'https://www.mrsaqib.me/gh#webpage',
      url: 'https://www.mrsaqib.me/gh',
      name: 'Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile & Repositories',
      description: 'Official GitHub profile of Muhammad Saqib (@mr-saqib-242). Explore verified open-source software, full-stack Next.js production codebases, and cyber security tools.',
      inLanguage: ['en-US', 'ur-PK'],
      dateCreated: '2024-01-01T00:00:00+05:00',
      dateModified: '2026-10-30T11:55:00+05:00',
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
          'https://www.whatsapp.com/channel/0029VbDzLTD1iUxe8Hsv1D0M',
          'https://instagram.com/mr_saqib242',
          'https://www.tiktok.com/@mr_saqib_242'
        ]
      }
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.mrsaqib.me/gh#breadcrumb',
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
          item: 'https://www.mrsaqib.me/gh'
        }
      ]
    }
  ]
};

export default function GitHubShortPage() {
  const [targetUrl, setTargetUrl] = useState(FALLBACK_GITHUB_URL);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [copiedClone, setCopiedClone] = useState(false);
  const [stats, setStats] = useState<GitHubStats>(DEFAULT_STATS);
  const [showRepos, setShowRepos] = useState(true);

  const [selectedRepo, setSelectedRepo] = useState<GitHubRepoItem | null>(null);
  const [hasStarred, setHasStarred] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    try {
      const storedUnlock = localStorage.getItem('saqib_github_unlocked');
      if (storedUnlock === 'true') {
        setHasStarred(true);
        setHasFollowed(true);
      }
    } catch {}

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

  const openDownloadModal = (repo: GitHubRepoItem) => {
    setSelectedRepo(repo);
    setUnlockSuccess(false);
  };

  const closeModal = () => {
    setSelectedRepo(null);
  };

  const handleStarAction = () => {
    if (!selectedRepo) return;
    window.open(selectedRepo.url, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setHasStarred(true);
      checkFullUnlock(true, hasFollowed);
    }, 1000);
  };

  const handleFollowAction = () => {
    window.open('https://github.com/mr-saqib-242', '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setHasFollowed(true);
      checkFullUnlock(hasStarred, true);
    }, 1000);
  };

  const checkFullUnlock = (starred: boolean, followed: boolean) => {
    if (starred && followed) {
      try {
        localStorage.setItem('saqib_github_unlocked', 'true');
      } catch {}
      setUnlockSuccess(true);
    }
  };

  const triggerDownload = () => {
    if (!selectedRepo) return;
    const downloadLink = selectedRepo.downloadUrl || `${selectedRepo.url}/archive/refs/heads/main.zip`;
    window.open(downloadLink, '_blank');
  };

  const isUnlocked = hasStarred && hasFollowed;
  const progressPercent = (hasStarred ? 50 : 0) + (hasFollowed ? 50 : 0);

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden font-sans">
      <Head>
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        <title>Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile &amp; Repositories</title>
        <meta name="title" content="Mr Saqib GitHub (@mr-saqib-242) | Official Developer Profile & Repositories" />
        <meta
          name="description"
          content="Official GitHub profile of Muhammad Saqib (@mr-saqib-242). Explore verified open-source software, full-stack Next.js production codebases, and cyber security tools."
        />
        <link rel="canonical" href="https://www.mrsaqib.me/gh" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full bg-zinc-950/90 border border-white/15 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
        
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-zinc-700 via-purple-600/40 to-emerald-500/40 p-0.5 shadow-lg shadow-white/10 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1117] rounded-[14px] flex items-center justify-center overflow-hidden">
                <FaGithub className="w-11 h-11 text-white" />
              </div>
            </div>
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

        <div className="bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-purple-950/30 border border-emerald-500/20 rounded-xl p-3 mb-5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-zinc-300">
              <strong className="text-white">Active Repository:</strong> {stats.latestActivity?.repo || 'mrsaqib3'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
            Live Sync
          </span>
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
              <FaCode className="text-purple-400" />
              <span>Download &amp; Access Repositories</span>
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
            <div className="space-y-3">
              {stats.featuredRepos.map((repo) => (
                <div
                  key={repo.name}
                  className="group bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 rounded-xl p-4 transition-all text-left relative overflow-hidden"
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
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {repo.description}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => openDownloadModal(repo)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all cursor-pointer active:scale-95"
                    >
                      {isUnlocked ? <FaUnlock className="text-emerald-200 w-3 h-3" /> : <FaLock className="text-emerald-200 w-3 h-3" />}
                      <span>{isUnlocked ? 'Download Source Code' : 'Unlock & Download Code'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyCloneCmd(repo.name)}
                      className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 text-zinc-400 font-mono"
                    >
                      <FaTerminal className="w-2.5 h-2.5" />
                      <span>{copiedClone ? 'Copied!' : 'Clone URL'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <Link href="/" className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
            <FaArrowLeft className="w-2.5 h-2.5" />
            <span>Return to Portfolio</span>
          </Link>
          <span className="font-mono text-zinc-400">Saqib242 • Gojra, PK</span>
        </div>
      </div>

      {selectedRepo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-md w-full bg-zinc-950 border border-white/20 rounded-2xl p-6 sm:p-7 text-center shadow-2xl shadow-emerald-500/10">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-zinc-800 to-purple-500/20 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center">
                {isUnlocked ? (
                  <FaUnlock className="w-7 h-7 text-emerald-400 animate-bounce" />
                ) : (
                  <FaLock className="w-7 h-7 text-amber-400" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1.5">
              {isUnlocked ? 'Access Granted!' : 'Unlock Code Download'}
            </h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              To download <strong className="text-white font-mono">{selectedRepo.name}</strong>, please complete the 2 quick verification steps below to support open-source development!
            </p>

            <div className="mb-6">
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5 text-zinc-400">
                <span>Unlock Progress</span>
                <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                  {progressPercent}% Complete
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-emerald-400 to-teal-400 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div
                onClick={handleStarAction}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  hasStarred
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 hover:border-amber-500/40 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasStarred ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    <FaStar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Step 1: Star Repository</div>
                    <div className="text-[11px] text-zinc-400">Star {selectedRepo.name} on GitHub</div>
                  </div>
                </div>
                <div>
                  {hasStarred ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                      <FaCheck className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30">
                      Star Now
                    </span>
                  )}
                </div>
              </div>

              <div
                onClick={handleFollowAction}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  hasFollowed
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-800 hover:border-purple-500/40 text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasFollowed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    <FaUserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Step 2: Follow Muhammad Saqib</div>
                    <div className="text-[11px] text-zinc-400">Follow @mr-saqib-242 on GitHub</div>
                  </div>
                </div>
                <div>
                  {hasFollowed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                      <FaCheck className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                      Follow Now
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isUnlocked ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={triggerDownload}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <FaDownload className="w-4 h-4" />
                  <span>Download Source Code (.ZIP)</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyCloneCmd(selectedRepo.name)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 transition-colors"
                >
                  {copiedClone ? 'Copied Clone Command!' : `Copy Clone Command (git clone ...)`}
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-center gap-2">
                <FaLock className="text-amber-400 w-3.5 h-3.5" />
                <span>Complete both steps above to unlock instant download</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
