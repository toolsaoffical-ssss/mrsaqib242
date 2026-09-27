import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { ip, userAgent, location, isp, reason } = req.body;

  // We use supabaseAdmin to bypass RLS since this is an internal system log
  try {
    const { error } = await supabaseAdmin
      .from('admin_hack_attempts')
      .insert({
        ip_address: ip || 'Unknown',
        user_agent: userAgent || 'Unknown',
        location: location || 'Unknown',
        isp: isp || 'Unknown',
        attempt_type: reason || 'unauthorized_access'
      });

    if (error) {
      console.error('Failed to log hack attempt:', error);
      return res.status(500).json({ error: 'Failed to log' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
