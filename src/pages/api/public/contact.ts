import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { apiGuard } from '../../../lib/apiGuard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAllowed = await apiGuard(req, res, 'contact');
  if (!isAllowed) return;

  try {
    const { data: profile } = await supabase
      .from('profile_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    res.status(200).json({ 
      success: true, 
      data: {
        name: profile?.name || "Saqib Developer",
        bio: profile?.bio || "Available for freelance work",
        email: profile?.email || "saqibsaqqibsaqib@gmail.com",
        whatsapp: profile?.whatsapp_url || profile?.phone || "https://wa.me/923478936242",
        instagram: profile?.instagram_url || "",
        facebook: profile?.facebook_url || "",
        tiktok: profile?.tiktok_url || "",
        snapchat: profile?.snapchat_url || "",
        portfolio: profile?.portfolio_url || "",
        resume: profile?.resume_url || "",
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
