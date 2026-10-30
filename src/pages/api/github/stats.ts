import type { NextApiRequest, NextApiResponse } from 'next';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

interface GitHubStatsResponse {
  success: boolean;
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
    updated_at: string;
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
  cachedAt: number;
}

// In-memory cache to guarantee sub-millisecond responses and protect GitHub rate limits
let memoryCache: { data: GitHubStatsResponse; expiresAt: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET only
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Check valid cache first
  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(memoryCache.data);
  }

  const token = process.env.GITHUB_API_TOKEN || '';
  const username = process.env.GITHUB_USERNAME || 'mr-saqib-242';

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'MrSaqib-Portfolio-Architect',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    let userData: any = null;
    if (userRes.ok) {
      userData = await userRes.json();
    }

    // 2. Fetch user repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, { headers });
    let reposData: GitHubRepo[] = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // Curated high-impact repos list (fallback + live blend)
    const featuredRepos = [
      {
        name: 'crptotrading',
        description: 'TOARK Terminal — Real-Time BTC/USDT Even/Odd Prediction Engine & VIP Trading Signals Architecture.',
        language: 'TypeScript / Next.js',
        stars: 0,
        forks: 0,
        url: `https://github.com/${username}/crptotrading`,
        updatedAt: 'Just now',
      },
      ...reposData
        .filter((r) => r.name !== 'crptotrading')
        .slice(0, 3)
        .map((repo) => ({
          name: repo.name,
          description: repo.description || 'Verified production codebase and open-source module by Muhammad Saqib.',
          language: repo.language || 'TypeScript',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          url: repo.html_url,
          updatedAt: new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        })),
    ];

    const statsPayload: GitHubStatsResponse = {
      success: true,
      user: {
        login: userData?.login || username,
        name: userData?.name || 'Muhammad Saqib',
        avatar_url: userData?.avatar_url || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
        html_url: userData?.html_url || `https://github.com/${username}`,
        bio: userData?.bio || 'Lead Full-Stack Web Architect & Cyber Security Specialist. Building high-performance Next.js architectures.',
        public_repos: userData?.public_repos || 3,
        followers: userData?.followers || 0,
        following: userData?.following || 0,
        location: userData?.location || 'Pakistan',
        updated_at: userData?.updated_at || new Date().toISOString(),
      },
      featuredRepos: featuredRepos.slice(0, 3),
      latestActivity: {
        title: 'TOARK Terminal BTC/USDT VIP Signals & Prediction System',
        repo: 'crptotrading',
        timestamp: 'Active today',
      },
      cachedAt: now,
    };

    memoryCache = {
      data: statsPayload,
      expiresAt: now + CACHE_TTL_MS,
    };

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(statsPayload);
  } catch (error: any) {
    // Fail-safe response so page never breaks
    const fallbackPayload: GitHubStatsResponse = {
      success: true,
      user: {
        login: username,
        name: 'Muhammad Saqib',
        avatar_url: 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
        html_url: `https://github.com/${username}`,
        bio: 'Lead Full-Stack Web Architect & Cyber Security Specialist',
        public_repos: 3,
        followers: 0,
        following: 0,
        location: 'Pakistan',
        updated_at: new Date().toISOString(),
      },
      featuredRepos: [
        {
          name: 'crptotrading',
          description: 'TOARK Terminal — Real-Time BTC/USDT Even/Odd Prediction Engine & VIP Trading Signals.',
          language: 'TypeScript / Next.js',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/crptotrading`,
          updatedAt: 'Active',
        },
        {
          name: 'mrsaqib1',
          description: 'Verified Next.js Portfolio & Zero Trust Cyber Security Architecture.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/mrsaqib1`,
          updatedAt: 'Recent',
        },
      ],
      latestActivity: {
        title: 'TOARK Terminal BTC/USDT VIP Signals & Prediction System',
        repo: 'crptotrading',
        timestamp: 'Active today',
      },
      cachedAt: now,
    };

    return res.status(200).json(fallbackPayload);
  }
}
