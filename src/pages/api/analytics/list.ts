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

  // 3. Fetch visitor entries and exact database aggregates
  try {
    const client = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
    if (!client) {
      return res.status(200).json({
        success: true,
        fromDatabase: false,
        entries: [],
        totalHits: 0,
        totalPageViews: 0,
        totalToolClicks: 0,
        error: 'Supabase client is not configured'
      });
    }

    const fetchAll = req.query.fetch_all === 'true' || req.body?.fetch_all === true;

    // Run exact counts and initial 500 records concurrently in PostgreSQL
    const [totalCountRes, pageViewCountRes, toolClickCountRes, initialBatchRes] = await Promise.all([
      client.from('site_analytics').select('id', { count: 'exact', head: true }),
      client.from('site_analytics').select('id', { count: 'exact', head: true }).eq('event_type', 'page_view'),
      client.from('site_analytics').select('id', { count: 'exact', head: true }).eq('event_type', 'tool_click'),
      client
        .from('site_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, fetchAll ? 999 : 499)
    ]);

    if (initialBatchRes.error) {
      console.warn('Error fetching analytics from Supabase:', initialBatchRes.error.message);
      return res.status(200).json({
        success: true,
        fromDatabase: false,
        entries: [],
        totalHits: 0,
        totalPageViews: 0,
        totalToolClicks: 0,
        error: initialBatchRes.error.message
      });
    }

    let allEntries = initialBatchRes.data || [];
    const totalCount = typeof totalCountRes.count === 'number' ? totalCountRes.count : allEntries.length;
    const totalPageViews = typeof pageViewCountRes.count === 'number' ? pageViewCountRes.count : 0;
    const totalToolClicks = typeof toolClickCountRes.count === 'number' ? toolClickCountRes.count : 0;

    // If fetchAll is requested and total records exceed 1000, fetch remaining in parallel up to 5,000
    if (fetchAll && totalCount > 1000) {
      const maxToFetch = Math.min(totalCount, 5000);
      const batchPromises: Promise<any>[] = [];
      for (let offset = 1000; offset < maxToFetch; offset += 1000) {
        batchPromises.push(
          client
            .from('site_analytics')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + 999)
        );
      }

      if (batchPromises.length > 0) {
        const batchResults = await Promise.all(batchPromises);
        for (const res of batchResults) {
          if (res.data && Array.isArray(res.data)) {
            allEntries = allEntries.concat(res.data);
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      fromDatabase: true,
      entries: allEntries,
      count: allEntries.length,
      totalHits: totalCount,
      totalPageViews,
      totalToolClicks,
      hasMore: totalCount > allEntries.length
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
