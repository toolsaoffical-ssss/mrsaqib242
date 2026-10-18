import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { parseBrowser, parseOS, parseDeviceType } from '../../../lib/analyticsService';

const COUNTRY_NAMES: Record<string, string> = {
  PK: 'Pakistan',
  US: 'United States',
  GB: 'United Kingdom',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  CA: 'Canada',
  DE: 'Germany',
  AU: 'Australia',
  IN: 'India',
  TR: 'Turkey',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  SE: 'Sweden',
  CH: 'Switzerland',
  SG: 'Singapore',
  MY: 'Malaysia',
  ID: 'Indonesia',
  BR: 'Brazil',
  JP: 'Japan',
  KR: 'South Korea',
  CN: 'China',
  RU: 'Russia',
  QA: 'Qatar',
  KW: 'Kuwait',
  OM: 'Oman',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  ZA: 'South Africa',
  EG: 'Egypt',
  NG: 'Nigeria',
  NZ: 'New Zealand',
  IE: 'Ireland',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  BE: 'Belgium',
  AT: 'Austria'
};

// Rate limiter per IP to avoid telemetry flooding
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    // Keep map bounded to prevent memory growth
    if (rateLimitMap.size > 2000) {
      rateLimitMap.clear();
    }
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
    return false;
  }
  if (entry.count >= 15) {
    return true;
  }
  entry.count++;
  return false;
}

const BOT_REGEX = /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|AhrefsBot|SemrushBot|DotBot|MJ12bot|PetalBot|crawler|spider|curl|wget|python|headless|phantom|scrapy|bot/i;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // 0. Instant Bot / Crawler Rejection (< 1ms, 0 CPU, 0 DB calls)
  const ua = (req.headers['user-agent'] as string) || '';
  if (!ua || BOT_REGEX.test(ua)) {
    return res.status(204).end();
  }

  // 1. Extract Real Client IP
  const forwarded = req.headers['x-forwarded-for'];
  let clientIp = '';
  if (typeof forwarded === 'string') {
    clientIp = forwarded.split(',')[0].trim();
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    clientIp = forwarded[0].trim();
  } else {
    clientIp = (req.headers['x-real-ip'] as string) || req.socket.remoteAddress || '127.0.0.1';
  }

  // Sanitize IP
  if (clientIp.startsWith('::ffff:')) {
    clientIp = clientIp.substring(7);
  }

  // Rate Limiting: drop silently with 204 to prevent CPU consumption
  if (isRateLimited(clientIp)) {
    return res.status(204).end();
  }

  let body: any = {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body);
    } catch {
      body = {};
    }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body;
  }

  // 1.5 Filter out admin dashboard paths from recorded analytics
  const targetPath = String(body.path || '/');
  if (
    targetPath.startsWith('/mradmin') ||
    targetPath.startsWith('/admin') ||
    targetPath.startsWith('/yourareadmin') ||
    targetPath.startsWith('/api')
  ) {
    return res.status(204).end();
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0');

  // 2. Extract Geolocation from Vercel Edge Headers
  const vercelCountry = (req.headers['x-vercel-ip-country'] as string)?.toUpperCase();
  const vercelCityRaw = req.headers['x-vercel-ip-city'] as string;
  const vercelRegionRaw = req.headers['x-vercel-ip-country-region'] as string;

  let city = 'Unknown';
  if (vercelCityRaw) {
    try {
      city = decodeURIComponent(vercelCityRaw);
    } catch {
      city = vercelCityRaw;
    }
  } else if (body.city && body.city !== 'Unknown') {
    city = String(body.city).trim();
  }

  let region = '';
  if (vercelRegionRaw) {
    try {
      region = decodeURIComponent(vercelRegionRaw);
    } catch {
      region = vercelRegionRaw;
    }
  } else if (body.region) {
    region = String(body.region).trim();
  }

  const countryCode = vercelCountry || body.country_code || (clientIp.startsWith('103.') || clientIp.startsWith('182.') || clientIp.startsWith('39.') ? 'PK' : 'PK');
  const country = COUNTRY_NAMES[countryCode] || body.country || 'Pakistan';

  // 3. User Agent parsing (ua was extracted at top of handler)
  const browser = body.browser || parseBrowser(ua);
  const os = body.os || parseOS(ua);
  const deviceType = body.device_type || parseDeviceType(ua);

  // 4. Assemble clean analytics entry with persistent visitor identity
  const entryId = body.id || `vis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const visitorId = body.visitor_id
    ? String(body.visitor_id).slice(0, 64)
    : `usr_${Buffer.from(clientIp + ua).toString('hex').slice(0, 16)}`;
  const sessionId = body.session_id
    ? String(body.session_id).slice(0, 64)
    : `ses_${entryId.slice(4, 16)}`;

  const analyticsRecord = {
    id: entryId,
    visitor_id: visitorId,
    session_id: sessionId,
    is_new_visitor: typeof body.is_new_visitor === 'boolean' ? body.is_new_visitor : true,
    device_fingerprint: body.device_fingerprint ? String(body.device_fingerprint).slice(0, 64) : null,
    ip_address: clientIp || body.ip_address || '127.0.0.1',
    city: city || 'Faisalabad',
    country: country || 'Pakistan',
    country_code: countryCode || 'PK',
    region: region || 'Punjab',
    referrer: String(body.referrer || req.headers['referer'] || 'Direct').slice(0, 500),
    path: String(body.path || '/').slice(0, 255),
    event_type: body.event_type === 'tool_click' ? 'tool_click' : 'page_view',
    tool_id: body.tool_id ? String(body.tool_id).slice(0, 100) : null,
    tool_name: body.tool_name ? String(body.tool_name).slice(0, 200) : null,
    tool_category: body.tool_category ? String(body.tool_category).slice(0, 100) : null,
    browser: String(browser).slice(0, 100),
    os: String(os).slice(0, 50),
    device_type: deviceType,
    screen_resolution: body.screen_resolution ? String(body.screen_resolution).slice(0, 50) : '1920x1080',
    language: body.language ? String(body.language).slice(0, 30) : 'en',
    timezone: body.timezone ? String(body.timezone).slice(0, 80) : 'Asia/Karachi',
    battery_level: typeof body.battery_level === 'number' ? Math.round(body.battery_level) : null,
    is_charging: typeof body.is_charging === 'boolean' ? body.is_charging : null,
    network_type: body.network_type ? String(body.network_type).slice(0, 30) : null,
    hardware_concurrency: typeof body.hardware_concurrency === 'number' ? body.hardware_concurrency : null,
    device_memory: typeof body.device_memory === 'number' ? body.device_memory : null,
    webgl_renderer: body.webgl_renderer ? String(body.webgl_renderer).slice(0, 150) : null,
    created_at: new Date().toISOString()
  };

  // 5. Store in Supabase
  try {
    // Prefer admin client (bypasses RLS) if configured, else public client
    const clientToUse = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;

    if (clientToUse) {
      let { error } = await clientToUse
        .from('site_analytics')
        .insert([analyticsRecord]);

      // Graceful fallback: If columns haven't been added yet via SQL migration, retry with legacy fields
      if (error && (error.message.includes('column') || error.message.includes('visitor_id'))) {
        const { visitor_id, session_id, is_new_visitor, device_fingerprint, ...legacyRecord } = analyticsRecord;
        const retry = await clientToUse.from('site_analytics').insert([legacyRecord]);
        if (!retry.error) {
          error = null;
        }
      }

      if (error) {
        console.warn('Analytics DB insert warning:', error.message);
        return res.status(200).json({
          success: true,
          recorded: true,
          persisted_to_db: false,
          warning: error.message,
          entry: analyticsRecord
        });
      }
    }

    return res.status(200).json({
      success: true,
      recorded: true,
      persisted_to_db: true,
      entry: analyticsRecord
    });
  } catch (err: any) {
    console.warn('Analytics DB insert error:', err);
    return res.status(200).json({
      success: true,
      recorded: true,
      persisted_to_db: false,
      warning: err.message,
      entry: analyticsRecord
    });
  }
}
