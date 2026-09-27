import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminSessionWithDevice, assertUnrestrictedAdmin } from '../../../../lib/serverAdminAuth';
import { supabaseAdmin } from '../../../../lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await verifyAdminSessionWithDevice(req);
  if (!assertUnrestrictedAdmin(auth, res, req)) return;

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('admin_banned_ips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch banned IPs' });
    }

    return res.status(200).json({ success: true, banned_ips: data });
  }

  if (req.method === 'DELETE') {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: 'IP is required' });

    const { error } = await supabaseAdmin
      .from('admin_banned_ips')
      .delete()
      .eq('ip_address', ip);

    if (error) {
      return res.status(500).json({ error: 'Failed to unban IP' });
    }

    return res.status(200).json({ success: true, message: 'IP unbanned successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
