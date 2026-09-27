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
    // GET: Fetch gallery items (Allowed in restricted mode)
    if (req.method === 'GET') {
      const { data, error } = await client
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, items: data || [] });
    }

    // 🛡️ 48-Hour Travel Security Gatekeeper for State Modifications:
    if (!assertUnrestrictedAdmin(auth, res)) return;

    if (req.method === 'POST') {
      const { item } = req.body || {};
      if (!item || !item.image_url) {
        return res.status(400).json({ error: 'Gallery image_url is required.' });
      }

      const payload = {
        title: item.title ? String(item.title).trim() : 'Visual Photo',
        image_url: String(item.image_url).trim(),
        category: item.category || 'Visual',
        display_order: Number(item.display_order) || 0,
        is_active: item.is_active !== undefined ? Boolean(item.is_active) : true
      };

      const { data, error } = await client.from('gallery').insert([payload]).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'PUT') {
      const { id, updates } = req.body || {};
      if (!id || !updates) {
        return res.status(400).json({ error: 'Gallery ID and updates are required.' });
      }

      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.title !== undefined) payload.title = String(updates.title).trim();
      if (updates.image_url !== undefined) payload.image_url = String(updates.image_url).trim();
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.display_order !== undefined) payload.display_order = Number(updates.display_order);
      if (updates.is_active !== undefined) payload.is_active = Boolean(updates.is_active);

      const { data, error } = await client.from('gallery').update(payload).eq('id', id).select().single();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || req.query;
      if (!id) {
        return res.status(400).json({ error: 'Gallery item ID is required.' });
      }

      const { error } = await client.from('gallery').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Admin gallery API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
