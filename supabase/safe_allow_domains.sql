-- =========================================================================
-- ⚡ SUPABASE FIX: SAFELY ALLOW DOMAIN (Zero-Error Version)
-- =========================================================================

-- 1. Safely add missing columns to api_allowed_domains if they don't exist
ALTER TABLE public.api_allowed_domains ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.api_allowed_domains ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Allow your domain without causing column errors
-- (Replace 'https://your-domain.com' with the website you want to connect)
INSERT INTO public.api_allowed_domains (domain, is_active)
VALUES ('https://your-domain.com', true)
ON CONFLICT (domain) DO UPDATE 
SET is_active = true;

-- 3. View all currently active allowed domains
SELECT id, domain, is_active, created_at FROM public.api_allowed_domains;
