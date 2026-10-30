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
    downloadUrl: string;
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
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) {
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
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
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, { headers });
    let reposData: GitHubRepo[] = [];
    if (reposRes.ok) {
      reposData = await reposRes.json();
    }

    // Map exact repos from user's account
    const repoDescriptions: Record<string, string> = {
      mrsaqib3: 'Production Next.js Web Architecture & High-Performance Developer Suite.',
      mrsaqib2: 'Full-Stack Developer Portfolio, UI Components & Cloud Integration.',
      mrsaqib1: 'Official Developer Portfolio & Zero Trust Cyber Security Architecture.',
    };

    const featuredRepos = reposData.map((repo) => ({
      name: repo.name,
      description: repoDescriptions[repo.name] || repo.description || 'Verified open-source repository by Muhammad Saqib.',
      language: repo.language || 'TypeScript',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      downloadUrl: `https://github.com/${username}/${repo.name}/archive/refs/heads/main.zip`,
      updatedAt: new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

    const statsPayload: GitHubStatsResponse = {
      success: true,
      user: {
        login: userData?.login || username,
        name: userData?.name || 'Muhammad Saqib',
        avatar_url: userData?.avatar_url || 'https://avatars.githubusercontent.com/u/349843210?v=4',
        html_url: userData?.html_url || `https://github.com/${username}`,
        bio: userData?.bio || 'Lead Full-Stack Web Architect & Cyber Security Specialist',
        public_repos: userData?.public_repos || featuredRepos.length || 3,
        followers: userData?.followers || 0,
        following: userData?.following || 0,
        location: userData?.location || 'Pakistan',
        updated_at: userData?.updated_at || new Date().toISOString(),
      },
      featuredRepos: featuredRepos.length > 0 ? featuredRepos : [
        {
          name: 'mrsaqib3',
          description: 'Production Next.js Web Architecture & High-Performance Developer Suite.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/mrsaqib3`,
          downloadUrl: `https://github.com/${username}/mrsaqib3/archive/refs/heads/main.zip`,
          updatedAt: 'Recent',
        },
        {
          name: 'mrsaqib2',
          description: 'Full-Stack Developer Portfolio, UI Components & Cloud Integration.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/mrsaqib2`,
          downloadUrl: `https://github.com/${username}/mrsaqib2/archive/refs/heads/main.zip`,
          updatedAt: 'Recent',
        },
        {
          name: 'mrsaqib1',
          description: 'Official Developer Portfolio & Zero Trust Cyber Security Architecture.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/mrsaqib1`,
          downloadUrl: `https://github.com/${username}/mrsaqib1/archive/refs/heads/main.zip`,
          updatedAt: 'Recent',
        },
      ],
      latestActivity: {
        title: 'Active Codebase Updates',
        repo: featuredRepos[0]?.name || 'mrsaqib3',
        timestamp: 'Active today',
      },
      cachedAt: now,
    };

    memoryCache = {
      data: statsPayload,
      expiresAt: now + CACHE_TTL_MS,
    };

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    return res.status(200).json(statsPayload);
  } catch (error: any) {
    const fallbackPayload: GitHubStatsResponse = {
      success: true,
      user: {
        login: username,
        name: 'Muhammad Saqib',
        avatar_url: 'https://avatars.githubusercontent.com/u/349843210?v=4',
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
          name: 'mrsaqib3',
          description: 'Production Next.js Web Architecture & High-Performance Developer Suite.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/mrsaqib3`,
          downloadUrl: `https://github.com/${username}/mrsaqib3/archive/refs/heads/main.zip`,
          updatedAt: 'Recent',
        },
        {
          name: 'mrsaqib2',
          description: 'Full-Stack Developer Portfolio, UI Components & Cloud Integration.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/mrsaqib2`,
          downloadUrl: `https://github.com/${username}/mrsaqib2/archive/refs/heads/main.zip`,
          updatedAt: 'Recent',
        },
        {
          name: 'mrsaqib1',
          description: 'Official Developer Portfolio & Zero Trust Cyber Security Architecture.',
          language: 'TypeScript',
          stars: 0,
          forks: 0,
          url: `https://github.com/${username}/mrsaqib1`,
          downloadUrl: `https://github.com/${username}/mrsaqib1/archive/refs/heads/main.zip`,
          updatedAt: 'Recent',
        },
      ],
      latestActivity: {
        title: 'Active Codebase Updates',
        repo: 'mrsaqib3',
        timestamp: 'Active today',
      },
      cachedAt: now,
    };

    return res.status(200).json(fallbackPayload);
  }
}
