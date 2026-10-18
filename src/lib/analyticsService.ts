import { supabase, isSupabaseConfigured } from './supabase';

export interface SiteAnalyticsEntry {
  id: string;
  ip_address: string;
  visitor_id?: string;
  session_id?: string;
  is_new_visitor?: boolean;
  device_fingerprint?: string;
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
    visitor_id: 'usr_f812a0e491',
    session_id: 'ses_a1b2c3d4',
    is_new_visitor: false,
    device_fingerprint: 'dfp_8b71d9a2',
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
    visitor_id: 'usr_c3948b2910',
    session_id: 'ses_e5f6g7h8',
    is_new_visitor: true,
    device_fingerprint: 'dfp_3a10e8f1',
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
    visitor_id: 'usr_90fa83bb19',
    session_id: 'ses_i9j0k1l2',
    is_new_visitor: false,
    device_fingerprint: 'dfp_c4199aa5',
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
    visitor_id: 'usr_761bca8901',
    session_id: 'ses_m3n4o5p6',
    is_new_visitor: true,
    device_fingerprint: 'dfp_5d918ba0',
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
    visitor_id: 'usr_f812a0e491',
    session_id: 'ses_q7r8s9t0',
    is_new_visitor: false,
    device_fingerprint: 'dfp_8b71d9a2',
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

const VID_STORAGE_KEY = 'ms_analytics_vid';
const SID_STORAGE_KEY = 'ms_analytics_sid';
const SID_EXPIRY_KEY = 'ms_analytics_sid_expiry';
const COOKIE_VID_KEY = 'ms_vid';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes sliding session window

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Persistent Visitor ID (localStorage + 1-Year Cookie fallback)
 * Distinguishes unique physical devices even when sharing identical public IP/Wi-Fi
 */
export function getOrCreateVisitorId(): { visitorId: string; isNew: boolean } {
  if (typeof window === 'undefined') {
    return { visitorId: `usr_${generateUUID().replace(/-/g, '').slice(0, 12)}`, isNew: true };
  }

  let vid = '';
  try {
    vid = localStorage.getItem(VID_STORAGE_KEY) || '';
  } catch {
    // storage disabled
  }

  if (!vid) {
    vid = getCookie(COOKIE_VID_KEY) || '';
  }

  let isNew = false;
  if (!vid) {
    vid = `usr_${generateUUID().replace(/-/g, '').slice(0, 12)}`;
    isNew = true;
  }

  try {
    localStorage.setItem(VID_STORAGE_KEY, vid);
    setCookie(COOKIE_VID_KEY, vid, 365);
  } catch {
    // ignore
  }

  return { visitorId: vid, isNew };
}

/**
 * Session ID (sessionStorage with 30-min inactivity sliding expiration)
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return `ses_${generateUUID().replace(/-/g, '').slice(0, 10)}`;
  }

  const now = Date.now();
  let sid = '';
  let expiry = 0;
  try {
    sid = sessionStorage.getItem(SID_STORAGE_KEY) || '';
    expiry = parseInt(sessionStorage.getItem(SID_EXPIRY_KEY) || '0', 10);
  } catch {
    // session storage disabled
  }

  if (!sid || !expiry || now > expiry) {
    sid = `ses_${generateUUID().replace(/-/g, '').slice(0, 10)}`;
  }

  try {
    sessionStorage.setItem(SID_STORAGE_KEY, sid);
    sessionStorage.setItem(SID_EXPIRY_KEY, String(now + SESSION_TIMEOUT_MS));
  } catch {
    // ignore
  }

  return sid;
}

/**
 * Non-invasive hardware fingerprint fallback (for private browsing / cleared storage)
 */
export function computeDeviceFingerprint(intel: Partial<SiteAnalyticsEntry>): string {
  const parts = [
    intel.screen_resolution || '',
    intel.timezone || '',
    intel.language || '',
    String(intel.hardware_concurrency || ''),
    String(intel.device_memory || ''),
    intel.os || '',
    intel.browser || '',
    intel.webgl_renderer || ''
  ].join('|');

  let hash = 2166136261;
  for (let i = 0; i < parts.length; i++) {
    hash ^= parts.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return 'dfp_' + (hash >>> 0).toString(16);
}

// Cached GPU renderer string to completely eliminate repeated WebGL context creation and GPU thread spikes
let cachedGpuRenderer: string | null = null;

export function getCachedGpuRenderer(): string {
  if (cachedGpuRenderer) return cachedGpuRenderer;
  if (typeof window === 'undefined') return 'Integrated Display';

  try {
    const stored = sessionStorage.getItem('saqib_gpu_cache');
    if (stored) {
      cachedGpuRenderer = stored;
      return stored;
    }
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { powerPreference: 'low-power' }) || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const detected = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const gpuName: string = typeof detected === 'string' && detected ? detected : 'Integrated GPU';
        cachedGpuRenderer = gpuName;
        try {
          sessionStorage.setItem('saqib_gpu_cache', gpuName);
        } catch {
          // ignore sessionStorage restrictions
        }
        return gpuName;
      }
    }
  } catch {
    // Graceful fallback without GPU pressure
  }
  cachedGpuRenderer = 'Integrated Graphics';
  return cachedGpuRenderer;
}

/**
 * Detect bots, scrapers, and headless crawlers
 */
export function isBotUser(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (navigator.webdriver) return true;
  const ua = navigator.userAgent || '';
  return /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|AhrefsBot|SemrushBot|DotBot|MJ12bot|PetalBot|crawler|spider|curl|wget|python|headless|phantom|scrapy|bot/i.test(ua);
}

// Timezone to location mapping for 0-latency, 0-compute geolocation
function inferLocationFromTimezone(tz: string): { country: string; country_code: string; city: string; region: string } {
  if (!tz) return { country: 'Pakistan', country_code: 'PK', city: 'Faisalabad', region: 'Punjab' };
  
  if (tz.includes('Karachi')) return { country: 'Pakistan', country_code: 'PK', city: 'Karachi', region: 'Sindh' };
  if (tz.includes('Islamabad') || tz.includes('Lahore')) return { country: 'Pakistan', country_code: 'PK', city: 'Lahore', region: 'Punjab' };
  if (tz.includes('Dubai') || tz.includes('Muscat')) return { country: 'United Arab Emirates', country_code: 'AE', city: 'Dubai', region: 'Dubai' };
  if (tz.includes('Riyadh')) return { country: 'Saudi Arabia', country_code: 'SA', city: 'Riyadh', region: 'Riyadh' };
  if (tz.includes('London')) return { country: 'United Kingdom', country_code: 'GB', city: 'London', region: 'England' };
  if (tz.includes('New_York')) return { country: 'United States', country_code: 'US', city: 'New York', region: 'New York' };
  if (tz.includes('Chicago')) return { country: 'United States', country_code: 'US', city: 'Chicago', region: 'Illinois' };
  if (tz.includes('Los_Angeles')) return { country: 'United States', country_code: 'US', city: 'Los Angeles', region: 'California' };
  if (tz.includes('Toronto')) return { country: 'Canada', country_code: 'CA', city: 'Toronto', region: 'Ontario' };
  if (tz.includes('Berlin') || tz.includes('Frankfurt')) return { country: 'Germany', country_code: 'DE', city: 'Berlin', region: 'Berlin' };
  if (tz.includes('Sydney') || tz.includes('Melbourne')) return { country: 'Australia', country_code: 'AU', city: 'Sydney', region: 'NSW' };
  if (tz.includes('Kolkata') || tz.includes('Delhi') || tz.includes('Mumbai')) return { country: 'India', country_code: 'IN', city: 'New Delhi', region: 'Delhi' };
  if (tz.includes('Singapore')) return { country: 'Singapore', country_code: 'SG', city: 'Singapore', region: 'Singapore' };
  if (tz.includes('Tokyo')) return { country: 'Japan', country_code: 'JP', city: 'Tokyo', region: 'Kanto' };
  if (tz.includes('Doha')) return { country: 'Qatar', country_code: 'QA', city: 'Doha', region: 'Ad Dawhah' };
  if (tz.includes('Kuwait')) return { country: 'Kuwait', country_code: 'KW', city: 'Kuwait City', region: 'Al Asimah' };

  if (tz.startsWith('America/')) return { country: 'United States', country_code: 'US', city: 'New York', region: 'United States' };
  if (tz.startsWith('Europe/')) return { country: 'United Kingdom', country_code: 'GB', city: 'London', region: 'Europe' };
  if (tz.startsWith('Asia/')) return { country: 'Pakistan', country_code: 'PK', city: 'Faisalabad', region: 'Punjab' };

  return { country: 'Pakistan', country_code: 'PK', city: 'Faisalabad', region: 'Punjab' };
}

let cachedClientIp: string | null = null;
async function getCachedClientIp(): Promise<string> {
  if (cachedClientIp) return cachedClientIp;
  if (typeof window === 'undefined') return 'Direct Visitor';

  try {
    const stored = sessionStorage.getItem('saqib_client_ip');
    if (stored) {
      cachedClientIp = stored;
      return stored;
    }
  } catch {
    // sessionStorage restrictions
  }

  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) {
        cachedClientIp = String(data.ip);
        try { sessionStorage.setItem('saqib_client_ip', cachedClientIp); } catch {}
        return cachedClientIp;
      }
    }
  } catch {
    // ip fallback
  }

  cachedClientIp = 'Direct Visitor';
  return cachedClientIp;
}

/**
 * Collect deep passive intel from browser
 */
export async function collectDeviceIntel(): Promise<Partial<SiteAnalyticsEntry>> {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const { visitorId, isNew } = getOrCreateVisitorId();
  const sessionId = getOrCreateSessionId();

  const intel: Partial<SiteAnalyticsEntry> = {
    visitor_id: visitorId,
    session_id: sessionId,
    is_new_visitor: isNew,
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

  // WebGL GPU - Uses cached string to eliminate GPU thread lag and repeated hardware context spins
  intel.webgl_renderer = getCachedGpuRenderer();

  // Instant location inference from browser timezone with zero network calls
  const loc = inferLocationFromTimezone(intel.timezone || 'Asia/Karachi');
  intel.country = loc.country;
  intel.country_code = loc.country_code;
  intel.city = loc.city;
  intel.region = loc.region;

  // Real IP cached once in sessionStorage (0 Vercel serverless compute)
  intel.ip_address = await getCachedClientIp();

  intel.device_fingerprint = computeDeviceFingerprint(intel);

  return intel;
}

/**
 * Fetch all analytics entries from Supabase, with fallback to local cache
 */
/**
 * Fetch all analytics entries from /api/analytics/list or Supabase directly
 */
export async function fetchSiteAnalyticsFromDB(params?: { fetchAll?: boolean }): Promise<{
  entries: SiteAnalyticsEntry[];
  fromDatabase: boolean;
  totalVisits: number;
  totalPageViews?: number;
  totalToolClicks: number;
  uniqueVisitors: number;
  totalSessions: number;
  uniqueIps: number;
  hasMore?: boolean;
  error?: string | null;
}> {
  const localData = getLocalAnalytics();

  // Helper to compute metrics with smart session grouping
  const computeMetrics = (data: SiteAnalyticsEntry[]) => {
    const uniqueVisitors = new Set(data.map((d: any) => d.visitor_id || d.ip_address)).size;
    const sessionSet = new Set<string>();
    data.forEach((e: any) => {
      const vid = e.visitor_id || e.ip_address;
      if (e.session_id) {
        sessionSet.add(e.session_id);
      } else {
        const hourSlot = e.created_at ? e.created_at.slice(0, 13) : e.id;
        sessionSet.add(`${vid}_${hourSlot}`);
      }
    });
    const totalSessions = sessionSet.size;
    const uniqueIps = new Set(data.map((d: any) => d.ip_address)).size;
    const toolClicks = data.filter((d: any) => d.event_type === 'tool_click').length;
    return { uniqueVisitors, totalSessions, uniqueIps, toolClicks };
  };

  // 1. Try secure /api/analytics/list endpoint first
  try {
    const queryStr = params?.fetchAll ? '?fetch_all=true' : '';
    const apiRes = await fetch(`/api/analytics/list${queryStr}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success && Array.isArray(result.entries)) {
        if (result.entries.length > 0) {
          setLocalAnalytics(result.entries);
          const { uniqueVisitors, totalSessions, uniqueIps, toolClicks } = computeMetrics(result.entries);
          const realTotal = typeof result.totalHits === 'number' && result.totalHits > 0 
            ? result.totalHits 
            : result.entries.length;
          const realToolClicks = typeof result.totalToolClicks === 'number' 
            ? result.totalToolClicks 
            : toolClicks;
          const realTrueVisitors = typeof result.totalTrueVisitors === 'number' && result.totalTrueVisitors > 0
            ? result.totalTrueVisitors
            : uniqueVisitors;
          const realSessions = typeof result.totalSessions === 'number' && result.totalSessions > 0
            ? result.totalSessions
            : totalSessions;
          const realUniqueIps = typeof result.totalUniqueIps === 'number' && result.totalUniqueIps > 0
            ? result.totalUniqueIps
            : uniqueIps;

          return {
            entries: result.entries,
            fromDatabase: true,
            totalVisits: realTotal,
            totalPageViews: result.totalPageViews,
            totalToolClicks: realToolClicks,
            uniqueVisitors: realTrueVisitors,
            totalSessions: realSessions,
            uniqueIps: realUniqueIps,
            hasMore: Boolean(result.hasMore),
            error: null
          };
        } else if (result.fromDatabase) {
          return {
            entries: [],
            fromDatabase: true,
            totalVisits: 0,
            totalPageViews: 0,
            totalToolClicks: 0,
            uniqueVisitors: 0,
            totalSessions: 0,
            uniqueIps: 0,
            hasMore: false,
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
      const { data, count: totalCount, error } = await supabase
        .from('site_analytics')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(0, 999);

      if (!error && Array.isArray(data)) {
        if (data.length > 0) {
          setLocalAnalytics(data as SiteAnalyticsEntry[]);
          const { uniqueVisitors, totalSessions, uniqueIps, toolClicks } = computeMetrics(data as SiteAnalyticsEntry[]);
          const realTotal = typeof totalCount === 'number' && totalCount > 0 ? totalCount : data.length;
          return {
            entries: data as SiteAnalyticsEntry[],
            fromDatabase: true,
            totalVisits: realTotal,
            uniqueVisitors,
            totalSessions,
            uniqueIps,
            totalToolClicks: toolClicks,
            error: null
          };
        } else {
          return {
            entries: [],
            fromDatabase: true,
            totalVisits: 0,
            uniqueVisitors: 0,
            totalSessions: 0,
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
  const { uniqueVisitors, totalSessions, uniqueIps, toolClicks } = computeMetrics(localData);
  return {
    entries: localData,
    fromDatabase: false,
    totalVisits: localData.length,
    uniqueVisitors,
    totalSessions,
    uniqueIps,
    totalToolClicks: toolClicks,
    error: null
  };
}

/**
 * Record a page visit or tool click into /api/analytics/record and Supabase
 */
export async function recordVisitToDB(event: Partial<SiteAnalyticsEntry>): Promise<{ success: boolean; entry?: SiteAnalyticsEntry }> {
  // 0. Skip automated bots and scrapers immediately to avoid unnecessary CPU/network churn
  if (isBotUser()) {
    return { success: true };
  }

  try {
    const intel = await collectDeviceIntel();
    const payload = {
      ...intel,
      ...event,
      path: event.path || (typeof window !== 'undefined' ? window.location.pathname + window.location.hash : '/')
    };

    const finalEntry: SiteAnalyticsEntry = {
      id: payload.id || `vis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      visitor_id: payload.visitor_id || undefined,
      session_id: payload.session_id || undefined,
      is_new_visitor: payload.is_new_visitor !== undefined ? payload.is_new_visitor : true,
      device_fingerprint: payload.device_fingerprint || undefined,
      ip_address: payload.ip_address || 'Direct Visitor',
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

    // Direct Supabase Insert: ZERO Vercel Fluid Compute usage!
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('site_analytics').insert([finalEntry]);
        if (error && (error.message.includes('column') || error.message.includes('visitor_id'))) {
          const { visitor_id, session_id, is_new_visitor, device_fingerprint, ...legacyRecord } = finalEntry;
          await supabase.from('site_analytics').insert([legacyRecord]);
        }
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
    visitor_id TEXT,
    session_id TEXT,
    is_new_visitor BOOLEAN DEFAULT true,
    device_fingerprint TEXT,
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

-- Allow public / clients to record visits and tool clicks (INSERT only)
DROP POLICY IF EXISTS "Public can record analytics" ON public.site_analytics;
DROP POLICY IF EXISTS "Public can view analytics" ON public.site_analytics;
DROP POLICY IF EXISTS "Public site analytics access" ON public.site_analytics;
CREATE POLICY "Public can record analytics"
ON public.site_analytics FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Indexes for lightning fast queries and aggregation
CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON public.site_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_event_type ON public.site_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_site_analytics_visitor_id ON public.site_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_session_id ON public.site_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_site_analytics_tool_name ON public.site_analytics(tool_name);
CREATE INDEX IF NOT EXISTS idx_site_analytics_country ON public.site_analytics(country);
CREATE INDEX IF NOT EXISTS idx_site_analytics_ip ON public.site_analytics(ip_address);

-- ----------------------------------------------------------
-- MIGRATION SCRIPT (For existing table in Supabase):
-- Run this if the table already exists:
-- ----------------------------------------------------------
-- ALTER TABLE public.site_analytics 
-- ADD COLUMN IF NOT EXISTS visitor_id TEXT,
-- ADD COLUMN IF NOT EXISTS session_id TEXT,
-- ADD COLUMN IF NOT EXISTS is_new_visitor BOOLEAN DEFAULT true,
-- ADD COLUMN IF NOT EXISTS device_fingerprint TEXT;
-- CREATE INDEX IF NOT EXISTS idx_site_analytics_visitor_id ON public.site_analytics(visitor_id);
-- CREATE INDEX IF NOT EXISTS idx_site_analytics_session_id ON public.site_analytics(session_id);
`;
