import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer';
import { verifyAdminSessionWithDevice } from '../../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyAdminSessionWithDevice(req);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('admin_hack_attempts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50); // Get last 50 logs

    if (error) {
      return res.status(500).json({ error: 'Database query failed' });
    }

    return res.status(200).json({ success: true, logs: data || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
