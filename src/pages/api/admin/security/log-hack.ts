import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { ip, userAgent, location, isp, reason } = req.body;
  const clientIp = ip || (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  // 1. Strict Spam Rate Limit (Max 5 requests per IP per minute)
  const now = Date.now();
  const limitRecord = rateLimitMap.get(clientIp) || { count: 0, resetAt: now + 60000 };
  
  if (now > limitRecord.resetAt) {
    limitRecord.count = 0;
    limitRecord.resetAt = now + 60000;
  }
  
  if (limitRecord.count >= 5) {
    return res.status(429).json({ error: 'Honeypot logging rate limit exceeded.' });
  }
  
  limitRecord.count++;
  rateLimitMap.set(clientIp, limitRecord);

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

    // Auto-Ban Logic: Check if they hit 5 times in the last 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from('admin_hack_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', clientIp)
      .gte('created_at', twoHoursAgo);

    if (count && count >= 5) {
      const bannedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await supabaseAdmin.from('admin_banned_ips').upsert({
        ip_address: clientIp,
        banned_until: bannedUntil,
        reason: 'Auto-Banned: 5 Shame Page hits in 2 hours'
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
