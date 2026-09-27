import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminSessionToken, extractSessionToken, validateRequestOrigin } from '../../../lib/serverAdminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { DEFAULT_PROFILE_SETTINGS } from '../../../lib/profileSettingsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET' && !validateRequestOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden: Request origin invalid.' });
  }

  // Session Token Verification for state-changing requests
  if (req.method !== 'GET') {
    const token = extractSessionToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Admin token required.' });
    }

    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session.' });
    }
  }

  const client = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
  if (!client) {
    return res.status(500).json({ error: 'Database client is not configured.' });
  }

  try {
    // GET: Fetch profile settings
    if (req.method === 'GET') {
      const { data, error } = await client
        .from('profile_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, settings: data || DEFAULT_PROFILE_SETTINGS });
    }

    // POST / PUT: Update profile settings (Admin only)
    if (req.method === 'POST' || req.method === 'PUT') {
      const raw = req.body || {};
      const payload = {
        id: 'default',
        name: raw.name !== undefined ? String(raw.name).trim() : DEFAULT_PROFILE_SETTINGS.name,
        short_name: raw.short_name !== undefined ? String(raw.short_name).trim() : DEFAULT_PROFILE_SETTINGS.short_name,
        brand_name: raw.brand_name !== undefined ? String(raw.brand_name).trim() : DEFAULT_PROFILE_SETTINGS.brand_name,
        tagline: raw.tagline !== undefined ? String(raw.tagline).trim() : DEFAULT_PROFILE_SETTINGS.tagline,
        bio: raw.bio !== undefined ? String(raw.bio).trim() : DEFAULT_PROFILE_SETTINGS.bio,
        phone: raw.phone !== undefined ? String(raw.phone).trim() : DEFAULT_PROFILE_SETTINGS.phone,
        email: raw.email !== undefined ? String(raw.email).trim() : DEFAULT_PROFILE_SETTINGS.email,
        location: raw.location !== undefined ? String(raw.location).trim() : DEFAULT_PROFILE_SETTINGS.location,
        portfolio_url: raw.portfolio_url !== undefined ? String(raw.portfolio_url).trim() : DEFAULT_PROFILE_SETTINGS.portfolio_url,
        resume_url: raw.resume_url !== undefined ? String(raw.resume_url).trim() : DEFAULT_PROFILE_SETTINGS.resume_url,
        whatsapp_url: raw.whatsapp_url !== undefined ? String(raw.whatsapp_url).trim() : DEFAULT_PROFILE_SETTINGS.whatsapp_url,
        instagram_url: raw.instagram_url !== undefined ? String(raw.instagram_url).trim() : DEFAULT_PROFILE_SETTINGS.instagram_url,
        facebook_url: raw.facebook_url !== undefined ? String(raw.facebook_url).trim() : DEFAULT_PROFILE_SETTINGS.facebook_url,
        tiktok_url: raw.tiktok_url !== undefined ? String(raw.tiktok_url).trim() : DEFAULT_PROFILE_SETTINGS.tiktok_url,
        snapchat_url: raw.snapchat_url !== undefined ? String(raw.snapchat_url).trim() : DEFAULT_PROFILE_SETTINGS.snapchat_url,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('profile_settings')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Admin profile settings API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
