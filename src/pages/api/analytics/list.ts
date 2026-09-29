import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { verifyAdminSessionToken, extractSessionToken } from '../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow GET or POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
  }

  // 1. Verify Admin Session Token (from HttpOnly cookie, Authorization header, or body)
  const token = extractSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required to view traffic telemetry.' });
  }

  const auth = await verifyAdminSessionToken(token);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Invalid or expired admin session token.' });
  }

  // 2. Optional: Clear or delete actions if requested by admin
  const action = req.body?.action || req.query?.action;
  if (action === 'clear') {
    try {
      const client = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
      if (client) {
        await client.from('site_analytics').delete().neq('id', 'keep_table_placeholder');
      }
      return res.status(200).json({ success: true, message: 'All analytics logs cleared.' });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // 3. Fetch latest 300 visitor entries
  try {
    const client = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
    if (!client) {
      return res.status(200).json({
        success: true,
        fromDatabase: false,
        entries: [],
        error: 'Supabase client is not configured'
      });
    }

    const { data, error } = await client
      .from('site_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10000);

    if (error) {
      console.warn('Error fetching analytics from Supabase:', error.message);
      return res.status(200).json({
        success: true,
        fromDatabase: false,
        entries: [],
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      fromDatabase: true,
      entries: data || [],
      count: data?.length || 0
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
