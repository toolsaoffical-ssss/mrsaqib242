import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from './supabase';

export async function apiGuard(req: NextApiRequest, res: NextApiResponse, apiName: 'projects' | 'picks' | 'contact') {
  // 1. Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method Not Allowed. Only GET requests are permitted.' });
    return false;
  }

  try {
    // 2. Fetch Global API Settings
    const { data: settings, error: settingsError } = await supabase
      .from('api_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !settings) {
      res.status(500).json({ success: false, error: 'Internal Server Error fetching API config' });
      return false;
    }

    // 3. Check if specific API is enabled
    const isEnabled = settings[`${apiName}_api_enabled`];
    if (!isEnabled) {
      res.status(403).json({ success: false, error: `The ${apiName} API is currently disabled by Admin.` });
      return false;
    }

    // 4. CORS Whitelisting Logic
    const origin = req.headers.origin || req.headers.referer;
    
    // Allow local development (optional, you can remove this later for strict production)
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      return true;
    }

    // If there is an origin, check if it is whitelisted
    if (origin) {
      let cleanOrigin = origin;
      try {
        const url = new URL(origin);
        cleanOrigin = url.origin;
      } catch (e) {
        // invalid URL format in origin
      }

      const { data: domains } = await supabase
        .from('api_allowed_domains')
        .select('domain')
        .eq('is_active', true);

      const allowedList = domains?.map(d => d.domain) || [];

      if (!allowedList.includes(cleanOrigin)) {
        res.status(403).json({ success: false, error: `Domain [${cleanOrigin}] is not authorized to use this API.` });
        return false;
      }

      // Domain is authorized, set CORS header
      res.setHeader('Access-Control-Allow-Origin', cleanOrigin);
    } else {
      // STRICT MODE: Block requests that don't have an Origin (Direct browser visits / simple curls)
      res.status(403).json({ success: false, error: 'Direct API access is strictly prohibited. Missing Origin header.' });
      return false;
    }

    return true;

  } catch (err) {
    res.status(500).json({ success: false, error: 'API Gateway Error' });
    return false;
  }
}
