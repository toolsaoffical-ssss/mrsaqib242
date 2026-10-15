import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, isSupabaseConfigured } from './supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseServer';

// Helper to extract clean domain/hostname for comparison (removes protocol, port, www, trailing slashes)
function normalizeDomain(input?: string | null): string | null {
  if (!input) return null;
  const raw = String(input).trim().toLowerCase();
  if (!raw || raw === 'null' || raw === 'undefined') return null;

  try {
    const withProto = raw.startsWith('http://') || raw.startsWith('https://') 
      ? raw 
      : 'https://' + raw;
    const parsed = new URL(withProto);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return raw.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split(':')[0];
  }
}

// Built-in master trusted domains (Saqib's own official portfolio & local dev)
const MASTER_TRUSTED_DOMAINS = [
  'mrsaqib242.vercel.app',
  'localhost',
  '127.0.0.1'
];

export async function apiGuard(
  req: NextApiRequest, 
  res: NextApiResponse, 
  apiName: 'projects' | 'picks' | 'contact'
): Promise<boolean> {
  const rawOrigin = req.headers.origin || req.headers.referer;
  const callerDomain = normalizeDomain(rawOrigin);

  // Database client (prefers service role to bypass RLS)
  const client = isSupabaseAdminConfigured() 
    ? supabaseAdmin 
    : isSupabaseConfigured() 
      ? supabase 
      : null;

  // 1. Fetch Global API Settings & Whitelisted Domains
  let isEnabled = true;
  let allowedDomainsList: string[] = [];

  if (client) {
    try {
      const [settingsRes, domainsRes] = await Promise.all([
        client.from('api_settings').select('*').limit(1).maybeSingle(),
        client.from('api_allowed_domains').select('domain').eq('is_active', true)
      ]);

      if (settingsRes.data) {
        const flag = settingsRes.data[`${apiName}_api_enabled`];
        if (flag === false) {
          isEnabled = false;
        }
      }

      if (domainsRes.data) {
        allowedDomainsList = domainsRes.data
          .map((d: any) => normalizeDomain(d.domain))
          .filter(Boolean) as string[];
      }
    } catch (dbErr) {
      console.error('API Guard DB error:', dbErr);
    }
  }

  // 2. Check if API is enabled
  if (!isEnabled) {
    res.status(403).json({ 
      success: false, 
      error: `The ${apiName} API is currently disabled by Admin.` 
    });
    return false;
  }

  // 3. Strict Domain Verification:
  // Direct access with no origin/referer is strictly blocked
  if (!callerDomain) {
    res.status(403).json({ 
      success: false, 
      error: 'Direct API access is blocked. Requests must originate from an authorized whitelisted domain.' 
    });
    return false;
  }

  // Check if callerDomain matches any trusted domain or allowed domain in DB
  const isAuthorized = 
    MASTER_TRUSTED_DOMAINS.includes(callerDomain) ||
    allowedDomainsList.includes(callerDomain);

  if (!isAuthorized) {
    res.status(403).json({ 
      success: false, 
      error: `Domain [${callerDomain}] is not authorized to use this API. Please whitelist this domain in the Admin Panel.` 
    });
    return false;
  }

  // Set CORS headers strictly for authorized caller
  let corsOrigin = rawOrigin;
  try {
    if (rawOrigin && rawOrigin.startsWith('http')) {
      corsOrigin = new URL(rawOrigin).origin;
    } else {
      corsOrigin = `https://${callerDomain}`;
    }
  } catch {
    corsOrigin = `https://${callerDomain}`;
  }

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Vary', 'Origin');

  // Handle CORS Preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  // 4. Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ 
      success: false, 
      error: 'Method Not Allowed. Only GET requests are permitted.' 
    });
    return false;
  }

  return true;
}
