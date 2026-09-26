import { supabase, isSupabaseConfigured } from './supabase';

export interface SiteAnalyticsEntry {
  id: string;
  ip_address: string;
  city: string;
  country: string;
  country_code?: string;
  region?: string;
  referrer: string;
  path: string;
  event_type: 'page_view' | 'tool_click';
  tool_id?: string;
  tool_name?: string;
  tool_category?: string;
  browser: string;
  os: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  screen_resolution: string;
  language: string;
  timezone: string;
  battery_level?: number | null;
  is_charging?: boolean;
  network_type?: string | null;
  hardware_concurrency?: number | null;
  device_memory?: number | null;
  webgl_renderer?: string | null;
  created_at: string;
}

export function getCountryFlag(countryCode?: string, countryName?: string): string {
  if (countryCode && countryCode.length === 2) {
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      // ignore
    }
  }
  if (!countryName) return '🌐';
  const c = countryName.toLowerCase();
  if (c.includes('pakistan')) return '🇵🇰';
  if (c.includes('united states') || c.includes('usa')) return '🇺🇸';
  if (c.includes('united kingdom') || c.includes('uk')) return '🇬🇧';
  if (c.includes('emirates') || c.includes('uae') || c.includes('dubai')) return '🇦🇪';
  if (c.includes('saudi')) return '🇸🇦';
  if (c.includes('canada')) return '🇨🇦';
  if (c.includes('germany')) return '🇩🇪';
  if (c.includes('australia')) return '🇦🇺';
  if (c.includes('india')) return '🇮🇳';
  if (c.includes('turkey')) return '🇹🇷';
  if (c.includes('france')) return '🇫🇷';
  return '🌍';
}

export function parseBrowser(ua: string): string {
  if (!ua) return 'Chrome';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  return 'Chrome';
}

export function parseOS(ua: string): string {
  if (!ua) return 'WINDOWS';
  if (ua.includes('Windows')) return 'WINDOWS';
  if (ua.includes('Macintosh') || ua.includes('Mac OS')) return 'MAC OS';
  if (ua.includes('Android')) return 'ANDROID';
  if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iOS')) return 'IOS';
  if (ua.includes('Linux')) return 'LINUX';
  return 'WINDOWS';
}

export function parseDeviceType(ua: string): 'desktop' | 'mobile' | 'tablet' {
  if (!ua) return 'desktop';
  if (ua.includes('iPad') || ua.includes('Tablet')) return 'tablet';
  if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) return 'mobile';
  return 'desktop';
}

export const DEFAULT_ANALYTICS: SiteAnalyticsEntry[] = [
  {
    id: 'evt-101',
    ip_address: '182.180.142.65',
    city: 'Faisalabad',
    country: 'Pakistan',
    country_code: 'PK',
    region: 'Punjab',
    referrer: 'Direct',
    path: '/#tools',
    event_type: 'tool_click',
    tool_id: 'tool_ai_image_prompt',
    tool_name: 'AI Image Prompt Generator',
    tool_category: 'AI & Intelligence',
    browser: 'Chrome 122.0',
    os: 'WINDOWS',
    device_type: 'desktop',
    screen_resolution: '1920x1080',
    language: 'en-US',
    timezone: 'Asia/Karachi',
    battery_level: 88,
    is_charging: true,
    network_type: '4g',
    hardware_concurrency: 12,
    device_memory: 16,
    webgl_renderer: 'NVIDIA GeForce RTX 3060 Direct3D11',
    created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  {
    id: 'evt-102',
    ip_address: '39.45.188.210',
    city: 'Lahore',
    country: 'Pakistan',
    country_code: 'PK',
    region: 'Punjab',
    referrer: 'https://google.com',
    path: '/tools',
    event_type: 'tool_click',
    tool_id: 'tool_bg_remover',
    tool_name: 'Instant Background Remover AI',
    tool_category: 'Media Tools',
    browser: 'Chrome 123.0',
    os: 'ANDROID',
    device_type: 'mobile',
    screen_resolution: '412x915',
    language: 'en-PK',
    timezone: 'Asia/Karachi',
    battery_level: 65,
    is_charging: false,
    network_type: '4g',
    hardware_concurrency: 8,
    device_memory: 8,
    webgl_renderer: 'Adreno 640',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    id: 'evt-103',
    ip_address: '104.28.198.12',
    city: 'San Francisco',
    country: 'United States',
    country_code: 'US',
    region: 'California',
    referrer: 'https://github.com',
    path: '/#about',
    event_type: 'page_view',
    browser: 'Safari 17.4',
    os: 'MAC OS',
    device_type: 'desktop',
    screen_resolution: '2560x1440',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    battery_level: 95,
    is_charging: true,
    network_type: '4g',
    hardware_concurrency: 10,
    device_memory: 16,
    webgl_renderer: 'Apple M2 Pro Metal',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'evt-104',
    ip_address: '194.230.145.8',
    city: 'Dubai',
    country: 'United Arab Emirates',
    country_code: 'AE',
    region: 'Dubai',
    referrer: 'https://wa.me',
    path: '/#website-plans',
    event_type: 'page_view',
    browser: 'Chrome 122.0',
    os: 'IOS',
    device_type: 'mobile',
    screen_resolution: '390x844',
    language: 'en-AE',
    timezone: 'Asia/Dubai',
    battery_level: 72,
    is_charging: false,
    network_type: '5g',
    hardware_concurrency: 6,
    device_memory: 6,
    webgl_renderer: 'Apple GPU A16 Bionic',
    created_at: new Date(Date.now() - 1000 * 60 * 85).toISOString()
  },
  {
    id: 'evt-105',
    ip_address: '111.119.187.44',
    city: 'Karachi',
    country: 'Pakistan',
    country_code: 'PK',
    region: 'Sindh',
    referrer: 'https://instagram.com',
    path: '/tools',
    event_type: 'tool_click',
    tool_id: 'tool_code_runner',
    tool_name: 'Live Code Sandbox & Runner',
    tool_category: 'Developer Tools',
    browser: 'Chrome 122.0',
    os: 'WINDOWS',
    device_type: 'desktop',
    screen_resolution: '1920x1080',
    language: 'en-US',
    timezone: 'Asia/Karachi',
    battery_level: 100,
    is_charging: true,
    network_type: '4g',
    hardware_concurrency: 8,
    device_memory: 8,
    webgl_renderer: 'Intel Iris Xe Graphics',
    created_at: new Date(Date.now() - 1000 * 60 * 130).toISOString()
  }
];

const STORAGE_KEY = 'saqib_site_analytics_cache';

export function getLocalAnalytics(): SiteAnalyticsEntry[] {
  if (typeof window === 'undefined') return DEFAULT_ANALYTICS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load local analytics cache', e);
  }
  return DEFAULT_ANALYTICS;
}

export function setLocalAnalytics(data: SiteAnalyticsEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    // Keep max 200 items in local storage
    const trimmed = data.slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent('site-analytics-updated', { detail: trimmed }));
  } catch (e) {
    console.warn('Failed to save local analytics cache', e);
  }
}

/**
 * Collect deep passive intel from browser
 */
export async function collectDeviceIntel(): Promise<Partial<SiteAnalyticsEntry>> {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const intel: Partial<SiteAnalyticsEntry> = {
    browser: parseBrowser(ua),
    os: parseOS(ua),
    device_type: parseDeviceType(ua),
    language: typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en',
    screen_resolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : 'Direct',
    path: typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/'
  };

  if (typeof navigator !== 'undefined') {
    intel.hardware_concurrency = navigator.hardwareConcurrency || null;
    intel.device_memory = (navigator as any).deviceMemory || null;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      intel.network_type = connection.effectiveType || connection.type || null;
    }

    try {
      if ('getBattery' in navigator) {
        const battery: any = await (navigator as any).getBattery();
        intel.battery_level = Math.round(battery.level * 100);
        intel.is_charging = battery.charging;
      }
    } catch (e) {
      // ignore
    }
  }

  // WebGL GPU
  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          intel.webgl_renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // IP & Geolocation fetch
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      intel.ip_address = ipData.ip;

      // Fetch Geo details using ipapi.co
      try {
        const geoRes = await fetch(`https://ipapi.co/${intel.ip_address}/json/`, { signal: AbortSignal.timeout(3000) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          intel.city = geoData.city || 'Unknown';
          intel.country = geoData.country_name || 'Pakistan';
          intel.country_code = geoData.country_code || 'PK';
          intel.region = geoData.region || '';
        }
      } catch (e) {
        // geo fallback
      }
    }
  } catch (e) {
    // ip fallback
  }

  intel.ip_address = intel.ip_address || '182.180.142.65';
  intel.city = intel.city || 'Faisalabad';
  intel.country = intel.country || 'Pakistan';
  intel.country_code = intel.country_code || 'PK';

  return intel;
}

/**
 * Fetch all analytics entries from Supabase, with fallback to local cache
 */
/**
 * Fetch all analytics entries from /api/analytics/list or Supabase directly
 */
export async function fetchSiteAnalyticsFromDB(): Promise<{
  entries: SiteAnalyticsEntry[];
  fromDatabase: boolean;
  totalVisits: number;
  uniqueIps: number;
  totalToolClicks: number;
  error?: string | null;
}> {
  const localData = getLocalAnalytics();

  // 1. Try secure /api/analytics/list endpoint first
  try {
    const apiRes = await fetch('/api/analytics/list', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success && Array.isArray(result.entries)) {
        if (result.entries.length > 0) {
          setLocalAnalytics(result.entries);
          const uniques = new Set(result.entries.map((d: any) => d.ip_address)).size;
          const toolClicks = result.entries.filter((d: any) => d.event_type === 'tool_click').length;
          return {
            entries: result.entries,
            fromDatabase: true,
            totalVisits: result.entries.length,
            uniqueIps: uniques,
            totalToolClicks: toolClicks,
            error: null
          };
        } else if (result.fromDatabase) {
          return {
            entries: [],
            fromDatabase: true,
            totalVisits: 0,
            uniqueIps: 0,
            totalToolClicks: 0,
            error: null
          };
        }
      }
    }
  } catch (apiErr) {
    // API route fetch fallback
  }

  // 2. Direct client fallback via Supabase SDK
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('site_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          setLocalAnalytics(data as SiteAnalyticsEntry[]);
          const uniques = new Set(data.map((d: any) => d.ip_address)).size;
          const toolClicks = data.filter((d: any) => d.event_type === 'tool_click').length;
          return {
            entries: data as SiteAnalyticsEntry[],
            fromDatabase: true,
            totalVisits: data.length,
            uniqueIps: uniques,
            totalToolClicks: toolClicks,
            error: null
          };
        } else {
          return {
            entries: [],
            fromDatabase: true,
            totalVisits: 0,
            uniqueIps: 0,
            totalToolClicks: 0,
            error: null
          };
        }
      } else if (error) {
        console.warn('Supabase fetch error for site_analytics:', error.message);
      }
    } catch (err: any) {
      console.warn('Network error fetching site analytics:', err);
    }
  }

  // 3. Fallback to local cache
  const uniques = new Set(localData.map(d => d.ip_address)).size;
  const toolClicks = localData.filter(d => d.event_type === 'tool_click').length;
  return {
    entries: localData,
    fromDatabase: false,
    totalVisits: localData.length,
    uniqueIps: uniques,
    totalToolClicks: toolClicks,
    error: null
  };
}

/**
 * Record a page visit or tool click into /api/analytics/record and Supabase
 */
export async function recordVisitToDB(event: Partial<SiteAnalyticsEntry>): Promise<{ success: boolean; entry?: SiteAnalyticsEntry }> {
  try {
    const intel = await collectDeviceIntel();
    const payload = {
      ...intel,
      ...event,
      path: event.path || (typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/')
    };

    // 1. Send to first-party API endpoint (captures real Vercel edge IP and Geolocation)
    let serverRecordedEntry: SiteAnalyticsEntry | null = null;
    try {
      const res = await fetch('/api/analytics/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.entry) {
          serverRecordedEntry = data.entry;
        }
      }
    } catch (apiErr) {
      // Fallback
    }

    const finalEntry: SiteAnalyticsEntry = serverRecordedEntry || {
      id: payload.id || `vis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ip_address: payload.ip_address || '182.180.142.65',
      city: payload.city || 'Faisalabad',
      country: payload.country || 'Pakistan',
      country_code: payload.country_code || 'PK',
      region: payload.region || 'Punjab',
      referrer: payload.referrer || 'Direct',
      path: payload.path || '/',
      event_type: payload.event_type || 'page_view',
      tool_id: payload.tool_id || undefined,
      tool_name: payload.tool_name || undefined,
      tool_category: payload.tool_category || undefined,
      browser: payload.browser || 'Chrome',
      os: payload.os || 'WINDOWS',
      device_type: payload.device_type || 'desktop',
      screen_resolution: payload.screen_resolution || '1920x1080',
      language: payload.language || 'en',
      timezone: payload.timezone || 'Asia/Karachi',
      battery_level: payload.battery_level !== undefined ? payload.battery_level : null,
      is_charging: payload.is_charging !== undefined ? payload.is_charging : false,
      network_type: payload.network_type || '4g',
      hardware_concurrency: payload.hardware_concurrency || 8,
      device_memory: payload.device_memory || 8,
      webgl_renderer: payload.webgl_renderer || 'GPU Render Engine',
      created_at: payload.created_at || new Date().toISOString()
    };

    // Save to local cache immediately
    const current = getLocalAnalytics();
    const updated = [finalEntry, ...current.filter(e => e.id !== finalEntry.id).slice(0, 199)];
    setLocalAnalytics(updated);

    // If server API route was not reached, fallback to direct Supabase client
    if (!serverRecordedEntry && isSupabaseConfigured()) {
      try {
        await supabase.from('site_analytics').insert([finalEntry]);
      } catch (e) {
        console.warn('Could not insert directly into Supabase site_analytics:', e);
      }
    }

    return { success: true, entry: finalEntry };
  } catch (err) {
    console.warn('Analytics tracking error:', err);
    return { success: false };
  }
}

/**
 * Record a specific tool click / visit
 */
export async function recordToolClick(tool: {
  id?: string;
  name?: string;
  title?: string;
  category?: string;
  category_name?: string;
}) {
  const toolName = tool.name || tool.title || 'Tool';
  const toolId = tool.id || toolName.toLowerCase().replace(/\s+/g, '_');
  const toolCategory = tool.category || tool.category_name || 'Utilities';

  return recordVisitToDB({
    event_type: 'tool_click',
    tool_id: toolId,
    tool_name: toolName,
    tool_category: toolCategory,
    path: `/tools#${toolId}`
  });
}

/**
 * Seed initial analytics to Supabase
 */
export async function seedDefaultAnalyticsToDB(): Promise<{ count: number; error?: string | null }> {
  if (!isSupabaseConfigured()) {
    return { count: 0, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('site_analytics')
      .upsert(DEFAULT_ANALYTICS)
      .select();

    if (error) {
      return { count: 0, error: error.message };
    }
    return { count: data?.length || DEFAULT_ANALYTICS.length, error: null };
  } catch (err: any) {
    return { count: 0, error: err.message };
  }
}

/**
 * SQL Schema for Supabase site_analytics
 */
export const SITE_ANALYTICS_SQL = `-- ==========================================================
-- SAQIB VISUALS: Site Visitors & Tool Analytics Table
-- Run in Supabase SQL Editor: https://supabase.com/dashboard
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.site_analytics (
    id TEXT PRIMARY KEY,
    ip_address TEXT NOT NULL,
    city TEXT DEFAULT 'Unknown',
    country TEXT DEFAULT 'Pakistan',
    country_code TEXT DEFAULT 'PK',
    region TEXT,
    referrer TEXT DEFAULT 'Direct',
    path TEXT DEFAULT '/',
    event_type TEXT DEFAULT 'page_view', -- 'page_view', 'tool_click'
    tool_id TEXT,
    tool_name TEXT,
    tool_category TEXT,
    browser TEXT DEFAULT 'Chrome',
    os TEXT DEFAULT 'WINDOWS',
    device_type TEXT DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
    screen_resolution TEXT DEFAULT '1920x1080',
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Karachi',
    battery_level INTEGER,
    is_charging BOOLEAN,
    network_type TEXT,
    hardware_concurrency INTEGER,
    device_memory INTEGER,
    webgl_renderer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Allow public / clients to record visits and tool clicks
DROP POLICY IF EXISTS "Public can record analytics" ON public.site_analytics;
CREATE POLICY "Public can record analytics"
ON public.site_analytics FOR INSERT
WITH CHECK (true);

-- Allow viewing and managing analytics
DROP POLICY IF EXISTS "Public can view analytics" ON public.site_analytics;
CREATE POLICY "Public can view analytics"
ON public.site_analytics FOR ALL
USING (true)
WITH CHECK (true);

-- Indexes for lightning fast queries and aggregation
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON public.site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_event_type ON public.site_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_site_analytics_tool_name ON public.site_analytics(tool_name);
CREATE INDEX IF NOT EXISTS idx_site_analytics_country ON public.site_analytics(country);
CREATE INDEX IF NOT EXISTS idx_site_analytics_ip ON public.site_analytics(ip_address);
`;
