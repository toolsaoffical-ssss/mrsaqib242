import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { apiGuard } from '../../../lib/apiGuard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Run the Security & CORS Guard
  const isAllowed = await apiGuard(req, res, 'projects');
  if (!isAllowed) return; // Guard already sent the error response

  // 2. Fetch Projects if Allowed
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    const formatted = (projects || []).map((p: any) => {
      const rawTags = Array.isArray(p.tags) ? p.tags : [];
      const imgTag = rawTags.find((t: any) => typeof t === 'string' && t.startsWith('__img__:'));
      const imageUrl = p.image_url || (imgTag ? imgTag.replace('__img__:', '') : '');
      const cleanTags = rawTags.filter((t: any) => typeof t === 'string' && !t.startsWith('__img__:'));

      return {
        ...p,
        image_url: imageUrl,
        tags: cleanTags
      };
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
