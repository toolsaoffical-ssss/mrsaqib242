import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminSessionToken, extractSessionToken, validateRequestOrigin } from '../../../lib/serverAdminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !validateRequestOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden: Request origin invalid.' });
  }

  const token = extractSessionToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Admin token required.' });
  }

  const auth = await verifyAdminSessionToken(token);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session.' });
  }

  const client = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
  if (!client) {
    return res.status(500).json({ error: 'Database client is not configured.' });
  }

  try {
    if (req.method === 'GET') {
      const [plansRes, addonsRes] = await Promise.all([
        client.from('pricing_plans').select('*').order('display_order', { ascending: true }),
        client.from('pricing_addons').select('*').order('display_order', { ascending: true })
      ]);

      return res.status(200).json({
        success: true,
        plans: plansRes.data || [],
        addons: addonsRes.data || []
      });
    }

    if (req.method === 'POST') {
      const { type, plan, addon } = req.body || {};

      if (type === 'addon' || addon) {
        const item = addon || req.body;
        if (!item || !item.id || !item.name) {
          return res.status(400).json({ error: 'Add-on ID and name are required.' });
        }

        const payload = {
          id: String(item.id).trim(),
          name: String(item.name).trim(),
          price: Number(item.price) || 0,
          is_starting: Boolean(item.is_starting),
          emoji: item.emoji || '⚡',
          category: item.category || 'Features',
          display_order: Number(item.display_order) ?? 1,
          is_active: item.is_active !== false,
          updated_at: new Date().toISOString()
        };

        const { error } = await client.from('pricing_addons').upsert(payload, { onConflict: 'id' });
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, data: payload });
      }

      // Default: plan
      const item = plan || req.body;
      if (!item || !item.id || !item.name) {
        return res.status(400).json({ error: 'Plan ID and name are required.' });
      }

      const payload = {
        id: String(item.id).trim(),
        name: String(item.name).trim(),
        price: Number(item.price) || 0,
        is_starting: Boolean(item.is_starting),
        color: item.color || 'from-blue-500 to-indigo-600',
        emoji: item.emoji || '💎',
        description: item.description || '',
        features: Array.isArray(item.features) ? item.features : [],
        recommended: Boolean(item.recommended),
        badge: item.badge || '',
        display_order: Number(item.display_order) ?? 1,
        is_active: item.is_active !== false,
        updated_at: new Date().toISOString()
      };

      const { error } = await client.from('pricing_plans').upsert(payload, { onConflict: 'id' });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data: payload });
    }

    if (req.method === 'DELETE') {
      const { type, id } = req.body || req.query;
      if (!id) {
        return res.status(400).json({ error: 'Item ID is required for deletion.' });
      }

      const tableName = type === 'addon' ? 'pricing_addons' : 'pricing_plans';
      const { error } = await client.from(tableName).delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Admin pricing API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
