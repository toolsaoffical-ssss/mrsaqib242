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
    // GET: Fetch all tools, categories & settings (Allowed in restricted mode)
    if (req.method === 'GET') {
      const [toolsRes, catRes, setRes] = await Promise.all([
        client.from('tools').select('*').order('display_order', { ascending: true }),
        client.from('tool_categories').select('*').order('display_order', { ascending: true }),
        client.from('tool_settings').select('*').eq('id', 'default').maybeSingle()
      ]);

      return res.status(200).json({
        success: true,
        tools: toolsRes.data || [],
        categories: catRes.data || [],
        settings: setRes.data || null
      });
    }

    // 🛡️ 48-Hour Travel Security Gatekeeper for State Modifications:
    if (!assertUnrestrictedAdmin(auth, res)) return;

    if (req.method === 'POST') {
      const { type, tool, category, settings } = req.body || {};

      if (type === 'settings' || settings) {
        const item = settings || req.body;
        const payload = {
          ...item,
          id: 'default',
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('tool_settings').upsert(payload);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, data: payload });
      }

      if (type === 'category' || category) {
        const item = category || req.body;
        if (!item || !item.id || !item.name) {
          return res.status(400).json({ error: 'Category ID and name are required.' });
        }
        const payload = {
          ...item,
          updated_at: new Date().toISOString()
        };
        const { error } = await client.from('tool_categories').upsert(payload);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, data: payload });
      }

      // Default: tool item
      const item = tool || req.body;
      if (!item || !item.id || !item.title) {
        return res.status(400).json({ error: 'Tool ID and title are required.' });
      }
      const payload = {
        ...item,
        updated_at: new Date().toISOString()
      };
      const { error } = await client.from('tools').upsert(payload);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data: payload });
    }

    if (req.method === 'DELETE') {
      const { type, id } = req.body || req.query;
      if (!id) {
        return res.status(400).json({ error: 'Item ID is required for deletion.' });
      }

      const tableName = type === 'category' ? 'tool_categories' : 'tools';
      const { error } = await client.from(tableName).delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Admin tools API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
