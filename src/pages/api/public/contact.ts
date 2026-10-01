import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { apiGuard } from '../../../lib/apiGuard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAllowed = await apiGuard(req, res, 'contact');
  if (!isAllowed) return;

  try {
    // Fetch contact info from admin_mirage_config or similar settings table
    const { data: config, error } = await supabase
      .from('admin_mirage_config')
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      data: {
        email: "saqibsaqqibsaqib@gmail.com",
        whatsapp: config?.whatsapp_number || "+92 347 8936242",
        // Add more contact details here if needed
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
