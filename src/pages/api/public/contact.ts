import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../lib/supabaseServer';
import { apiGuard } from '../../../lib/apiGuard';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Prevent any CDN / Browser caching so other websites get real-time live data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const isAllowed = await apiGuard(req, res, 'contact');
  if (!isAllowed) return;

  try {
    const client = isSupabaseAdminConfigured() ? supabaseAdmin : isSupabaseConfigured() ? supabase : null;
    let profile: any = null;
    
    if (client) {
      const { data } = await client
        .from('profile_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();
      profile = data;
    }

    res.status(200).json({ 
      success: true, 
      data: {
        name: profile?.name || "Muhammad Saqib",
        short_name: profile?.short_name || "Saqib",
        tagline: profile?.tagline || "Full-Stack Engineer & Cyber Security Specialist",
        bio: profile?.bio || "Available for high-performance Next.js SaaS apps & AI systems",
        email: profile?.email || "saqibsaqqibsaqib@gmail.com",
        phone: profile?.phone || "+92 347 8936242",
        whatsapp: profile?.whatsapp_url || (profile?.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : "https://wa.me/923478936242"),
        location: profile?.location || "Gojra, Faisalabad, Pakistan",
        avatar: profile?.avatar_url || "https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90",
        instagram: profile?.instagram_url || "https://www.instagram.com/mr_saqib242",
        facebook: profile?.facebook_url || "",
        tiktok: profile?.tiktok_url || "",
        snapchat: profile?.snapchat_url || "",
        portfolio: profile?.portfolio_url || "https://mrsaqib242.vercel.app",
        github: profile?.github_url || "https://github.com/mrsaqib242",
        resume: profile?.resume_url || "",
      } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
