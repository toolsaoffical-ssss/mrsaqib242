-- =========================================================================
-- ⚡ SAQIB VISUALS: PROFILE & SOCIAL MEDIA SETTINGS MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- Fixes: ERROR 42703: column "avatar_url" of relation "profile_settings" does not exist
-- =========================================================================

-- 1. Safely add any missing columns to profile_settings table
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT 'https://github.com/mrsaqib242';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS brand_name TEXT DEFAULT 'Saqib Visuals';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS short_name TEXT DEFAULT 'Saqib';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT 'Full-Stack Engineer & Cyber Security Specialist';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Available for elite web applications, Next.js SaaS engineering, and AI chatbot integrations.';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '+92 347 8936242';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'saqibsaqqibsaqib@gmail.com';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Gojra, Faisalabad, Pakistan';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS portfolio_url TEXT DEFAULT 'https://mrsaqib242.vercel.app';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS resume_url TEXT DEFAULT '/resume.pdf';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS whatsapp_url TEXT DEFAULT 'https://wa.me/923478936242';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT 'https://www.instagram.com/mr_saqib242';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT 'https://www.facebook.com/profile.php?id=100085188689033';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS tiktok_url TEXT DEFAULT 'https://www.tiktok.com/@mr_saqib_242';
ALTER TABLE public.profile_settings ADD COLUMN IF NOT EXISTS snapchat_url TEXT DEFAULT 'https://www.snapchat.com/add/mrsaqib242';

-- 2. Upsert the master default row with live values
INSERT INTO public.profile_settings (
  id,
  name,
  short_name,
  brand_name,
  tagline,
  bio,
  phone,
  email,
  location,
  avatar_url,
  github_url,
  portfolio_url,
  resume_url,
  whatsapp_url,
  instagram_url,
  facebook_url,
  tiktok_url,
  snapchat_url
) VALUES (
  'default',
  'Muhammad Saqib',
  'Saqib',
  'Saqib Visuals',
  'Full-Stack Engineer & Cyber Security Specialist',
  'Available for elite web applications, Next.js SaaS engineering, and AI chatbot integrations.',
  '+92 347 8936242',
  'saqibsaqqibsaqib@gmail.com',
  'Gojra, Faisalabad, Pakistan',
  'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90',
  'https://github.com/mrsaqib242',
  'https://mrsaqib242.vercel.app',
  '/resume.pdf',
  'https://wa.me/923478936242',
  'https://www.instagram.com/mr_saqib242',
  'https://www.facebook.com/profile.php?id=100085188689033',
  'https://www.tiktok.com/@mr_saqib_242',
  'https://www.snapchat.com/add/mrsaqib242'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  brand_name = EXCLUDED.brand_name,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  location = EXCLUDED.location,
  avatar_url = EXCLUDED.avatar_url,
  github_url = EXCLUDED.github_url,
  portfolio_url = EXCLUDED.portfolio_url,
  resume_url = EXCLUDED.resume_url,
  whatsapp_url = EXCLUDED.whatsapp_url,
  instagram_url = EXCLUDED.instagram_url,
  facebook_url = EXCLUDED.facebook_url,
  tiktok_url = EXCLUDED.tiktok_url,
  snapchat_url = EXCLUDED.snapchat_url,
  updated_at = NOW();

-- 3. Row Level Security: Allow public read, and allow admin/service role full control
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read-only profile" ON public.profile_settings;
CREATE POLICY "Public read-only profile" ON public.profile_settings 
  FOR SELECT TO anon, authenticated 
  USING (true);

DROP POLICY IF EXISTS "Service role full profile access" ON public.profile_settings;
CREATE POLICY "Service role full profile access" ON public.profile_settings 
  FOR ALL TO service_role 
  USING (true) 
  WITH CHECK (true);
