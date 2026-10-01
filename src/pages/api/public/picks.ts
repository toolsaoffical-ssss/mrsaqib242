import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { apiGuard } from '../../../lib/apiGuard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAllowed = await apiGuard(req, res, 'picks');
  if (!isAllowed) return;

  try {
    // Assuming 'restricted' or another flag defines "picks". For now, we fetch where it's a pick or featured
    // Adjust the query based on your actual database schema for 'My Picks'
    const { data: picks, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .eq('is_pick', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.status(200).json({ success: true, count: picks?.length || 0, data: picks });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
