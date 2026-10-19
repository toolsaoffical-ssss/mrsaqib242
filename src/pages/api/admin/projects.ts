import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  verifyAdminSessionWithDevice, 
  assertUnrestrictedAdmin, 
  validateRequestOrigin 
} from '../../../lib/serverAdminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { DEFAULT_PROJECTS } from '../../../lib/projectsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate request origin for state-modifying requests
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
    // GET: Fetch all projects with full admin view (Allowed for restricted sessions)
    if (req.method === 'GET') {
      const { data, error } = await client
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      const formatted = (data || []).map((p: any) => {
        const imgTag = Array.isArray(p.tags) ? p.tags.find((t: any) => typeof t === 'string' && t.startsWith('__img__:')) : null;
        const imageUrl = p.image_url || (imgTag ? imgTag.replace('__img__:', '') : '');
        const cleanTags = (Array.isArray(p.tags) ? p.tags : []).filter((t: any) => typeof t === 'string' && !t.startsWith('__img__:'));
        return {
          ...p,
          image_url: imageUrl,
          tags: cleanTags
        };
      });

      return res.status(200).json({ success: true, projects: formatted });
    }

    // 🛡️ 48-Hour Travel Security Gatekeeper for State Modifications:
    if (!assertUnrestrictedAdmin(auth, res, req)) return;

    // POST: Create project OR seed projects
    if (req.method === 'POST') {
      const { action, project, projects } = req.body || {};

      // Seed bulk default projects
      if (action === 'seed') {
        const rows = (projects || DEFAULT_PROJECTS).map((p: any, idx: number) => ({
          name: p.name,
          url: p.url,
          description: p.description,
          category: p.category || (Array.isArray(p.tags) && p.tags[0]) || 'Portfolio',
          tags: p.tags,
          gradient: p.gradient || 'from-blue-600 via-indigo-500 to-purple-600',
          restricted: Boolean(p.restricted),
          is_active: true,
          display_order: idx + 1
        }));

        const { data, error } = await client.from('projects').insert(rows).select();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, count: data?.length || rows.length });
      }

      // Single project creation
      if (!project || !project.name || !project.url) {
        return res.status(400).json({ error: 'Project name and URL are required.' });
      }

      const rawTags = Array.isArray(project.tags) ? [...project.tags] : [];
      const imageUrl = project.image_url ? String(project.image_url).trim() : '';

      const payload: any = {
        name: String(project.name).trim(),
        url: String(project.url).trim(),
        description: project.description ? String(project.description).trim() : '',
        category: project.category || (rawTags && rawTags[0]) || 'Portfolio',
        tags: rawTags,
        gradient: project.gradient || 'from-blue-600 via-indigo-500 to-purple-600',
        restricted: Boolean(project.restricted),
        is_active: project.is_active !== undefined ? Boolean(project.is_active) : true,
        display_order: Number(project.display_order) || 0
      };

      if (imageUrl) {
        payload.image_url = imageUrl;
      }

      let { data, error } = await client.from('projects').insert([payload]).select().single();

      // If Supabase column image_url doesn't exist, fallback to storing inside tags
      if (error && (error.code === '42703' || error.message?.includes('image_url'))) {
        delete payload.image_url;
        if (imageUrl) {
          payload.tags = [...payload.tags.filter((t: string) => !t.startsWith('__img__:')), `__img__:${imageUrl}`];
        }
        const fallbackRes = await client.from('projects').insert([payload]).select().single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    }

    // PUT: Update project by ID
    if (req.method === 'PUT') {
      const { id, updates } = req.body || {};
      if (!id || !updates) {
        return res.status(400).json({ error: 'Project ID and updates are required.' });
      }

      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) payload.name = String(updates.name).trim();
      if (updates.url !== undefined) payload.url = String(updates.url).trim();
      if (updates.description !== undefined) payload.description = String(updates.description).trim();
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.tags !== undefined) payload.tags = Array.isArray(updates.tags) ? updates.tags : [];
      if (updates.gradient !== undefined) payload.gradient = updates.gradient;
      if (updates.restricted !== undefined) payload.restricted = Boolean(updates.restricted);
      if (updates.is_active !== undefined) payload.is_active = Boolean(updates.is_active);
      if (updates.display_order !== undefined) payload.display_order = Number(updates.display_order);

      const imageUrl = updates.image_url !== undefined ? String(updates.image_url).trim() : undefined;
      if (imageUrl !== undefined) {
        payload.image_url = imageUrl;
      }

      let { data, error } = await client.from('projects').update(payload).eq('id', id).select().single();

      // If Supabase column image_url doesn't exist, fallback to storing inside tags
      if (error && (error.code === '42703' || error.message?.includes('image_url'))) {
        delete payload.image_url;
        if (imageUrl !== undefined) {
          let currentTags = Array.isArray(payload.tags) ? [...payload.tags] : [];
          if (currentTags.length === 0) {
            // Fetch current tags if not provided in updates
            const currentRec = await client.from('projects').select('tags').eq('id', id).maybeSingle();
            if (currentRec.data?.tags) {
              currentTags = Array.isArray(currentRec.data.tags) ? currentRec.data.tags : [];
            }
          }
          const cleanTags = currentTags.filter((t: string) => typeof t === 'string' && !t.startsWith('__img__:'));
          if (imageUrl) {
            cleanTags.push(`__img__:${imageUrl}`);
          }
          payload.tags = cleanTags;
        }
        const fallbackRes = await client.from('projects').update(payload).eq('id', id).select().single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, data });
    }

    // DELETE: Delete project by ID
    if (req.method === 'DELETE') {
      const { id } = req.body || req.query;
      if (!id) {
        return res.status(400).json({ error: 'Project ID is required.' });
      }

      const { error } = await client.from('projects').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Admin projects API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}
