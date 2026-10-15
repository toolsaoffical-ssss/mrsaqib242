import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  verifyAdminSessionWithDevice, 
  assertUnrestrictedAdmin, 
  validateRequestOrigin 
} from '../../../lib/serverAdminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !validateRequestOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden: Request origin invalid.' });
  }

  // 1. Session & Device Verification
  const auth = await verifyAdminSessionWithDevice(req);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session.' });
  }

  const client = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
  if (!client) {
    return res.status(500).json({ error: 'Database client is not configured.' });
  }

  try {
    // GET: Fetch settings and domains
    if (req.method === 'GET') {
      const [settingsRes, domainsRes] = await Promise.all([
        client.from('api_settings').select('*').limit(1).maybeSingle(),
        client.from('api_allowed_domains').select('*').order('created_at', { ascending: false })
      ]);

      return res.status(200).json({
        success: true,
        settings: settingsRes.data || {
          projects_api_enabled: true,
          picks_api_enabled: true,
          contact_api_enabled: true
        },
        domains: domainsRes.data || []
      });
    }

    // 🛡️ 48-Hour Travel Security Gatekeeper for State Modifications:
    if (!assertUnrestrictedAdmin(auth, res, req)) return;

    // POST: Add domain OR update settings
    if (req.method === 'POST') {
      const { action, domain, settingKey, settingValue } = req.body || {};

      if (action === 'update_setting') {
        const { error } = await client
          .from('api_settings')
          .update({ [settingKey]: settingValue, updated_at: new Date().toISOString() })
          .eq('id', '00000000-0000-0000-0000-000000000000');
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
      }

      // Add domain
      if (!domain) {
        return res.status(400).json({ error: 'Domain is required.' });
      }

      let cleanDomain = String(domain).trim().toLowerCase();
      try {
        if (!cleanDomain.startsWith('http')) cleanDomain = 'https://' + cleanDomain;
        const url = new URL(cleanDomain);
        cleanDomain = url.origin;
      } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      const { data, error } = await client
        .from('api_allowed_domains')
        .insert([{ domain: cleanDomain, is_active: true }])
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, data });
    }

    // PUT: Toggle domain status
    if (req.method === 'PUT') {
      const { id, is_active } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: 'Domain ID is required.' });
      }

      let { data, error } = await client
        .from('api_allowed_domains')
        .update({ is_active: Boolean(is_active), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error && (error.code === '42703' || error.message?.includes('column') || error.message?.includes('updated_at'))) {
        const retry = await client
          .from('api_allowed_domains')
          .update({ is_active: Boolean(is_active) })
          .eq('id', id)
          .select()
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    }

    // DELETE: Remove domain
    if (req.method === 'DELETE') {
      const { id } = req.body || req.query;
      if (!id) {
        return res.status(400).json({ error: 'Domain ID is required.' });
      }

      const { error } = await client
        .from('api_allowed_domains')
        .delete()
        .eq('id', id);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Admin API Hub error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
