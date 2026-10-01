import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { apiGuard } from '../../../lib/apiGuard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAllowed = await apiGuard(req, res, 'contact');
  if (!isAllowed) return;

  try {
    const { data: profile } = await supabase
      .from('profile_settings')
      .select('email, whatsapp_url, phone')
      .eq('id', 'default')
      .maybeSingle();

    res.status(200).json({ 
      success: true, 
      data: {
        email: profile?.email || "saqibsaqqibsaqib@gmail.com",
        whatsapp: profile?.whatsapp_url || profile?.phone || "+92 347 8936242",
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
