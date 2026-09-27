import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  verifyAdminSessionWithDevice, 
  assertUnrestrictedAdmin, 
  validateRequestOrigin 
} from '../../../lib/serverAdminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { DEFAULT_INQUIRIES } from '../../../lib/inquiriesService';

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
    // GET: Fetch all inquiries (Allowed in restricted mode so admin can view client leads)
    if (req.method === 'GET') {
      const { data, error } = await client
        .from('client_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ success: true, inquiries: data || [] });
    }

    // 🛡️ 48-Hour Travel Security Gatekeeper for State Modifications:
    if (!assertUnrestrictedAdmin(auth, res)) return;

    // POST: Seed or manual admin insert
    if (req.method === 'POST') {
      const { action, inquiries, inquiry } = req.body || {};

      if (action === 'seed') {
        const { data, error } = await client
          .from('client_inquiries')
          .upsert(inquiries || DEFAULT_INQUIRIES)
          .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, count: data?.length || 0 });
      }

      if (inquiry) {
        const { data, error } = await client
          .from('client_inquiries')
          .insert([inquiry])
          .select()
          .single();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, data });
      }

      return res.status(400).json({ error: 'Invalid POST body.' });
    }

    // PUT: Update inquiry status, priority, or admin notes
    if (req.method === 'PUT') {
      const { id, updates } = req.body || {};
      if (!id || !updates) {
        return res.status(400).json({ error: 'Inquiry ID and updates required.' });
      }

      const payload = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('client_inquiries')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    }

    // DELETE: Delete inquiry
    if (req.method === 'DELETE') {
      const { id } = req.body || req.query;
      if (!id) {
        return res.status(400).json({ error: 'Inquiry ID is required.' });
      }

      const { error } = await client
        .from('client_inquiries')
        .delete()
        .eq('id', id);

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Admin inquiries API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
