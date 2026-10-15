-- =========================================================================
-- ⚡ SUPABASE FIX: ROW-LEVEL SECURITY FOR api_allowed_domains & api_settings
-- Run this in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run (Ctrl+Enter)
-- =========================================================================

-- 1. Ensure tables exist with proper structure
CREATE TABLE IF NOT EXISTS public.api_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    projects_api_enabled BOOLEAN DEFAULT true,
    picks_api_enabled BOOLEAN DEFAULT true,
    contact_api_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default row if not present
INSERT INTO public.api_settings (id, projects_api_enabled, picks_api_enabled, contact_api_enabled)
VALUES ('00000000-0000-0000-0000-000000000000'::uuid, true, true, true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.api_allowed_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add columns if table already existed without them
ALTER TABLE public.api_allowed_domains ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.api_allowed_domains ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- =========================================================================
-- 2. DISABLE ROW-LEVEL SECURITY (Recommended for instant, permanent fix)
-- This allows both direct frontend anon keys and backend API routes to insert,
-- update, and delete domains without permission blocks.
-- =========================================================================

ALTER TABLE public.api_allowed_domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_settings DISABLE ROW LEVEL SECURITY;

-- =========================================================================
-- 3. PERMISSIVE POLICIES (Alternative if you want RLS enabled)
-- =========================================================================

ALTER TABLE public.api_allowed_domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access on api_allowed_domains" ON public.api_allowed_domains;
DROP POLICY IF EXISTS "Allow all for api_allowed_domains" ON public.api_allowed_domains;
DROP POLICY IF EXISTS "Enable all access for api_allowed_domains" ON public.api_allowed_domains;

CREATE POLICY "Public full access on api_allowed_domains"
ON public.api_allowed_domains
FOR ALL
TO anon, authenticated, public
USING (true)
WITH CHECK (true);

ALTER TABLE public.api_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public full access on api_settings" ON public.api_settings;
DROP POLICY IF EXISTS "Allow all for api_settings" ON public.api_settings;
DROP POLICY IF EXISTS "Enable all access for api_settings" ON public.api_settings;

CREATE POLICY "Public full access on api_settings"
ON public.api_settings
FOR ALL
TO anon, authenticated, public
USING (true)
WITH CHECK (true);
