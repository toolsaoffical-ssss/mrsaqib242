import { CLIENT_INQUIRIES_SQL } from './inquiriesService';
import { SITE_ANALYTICS_SQL } from './analyticsService';

export interface SqlScriptItem {
  id: string;
  title: string;
  tableName: string;
  description: string;
  badge: string;
  sql: string;
}

export const MASTER_SUPABASE_SQL = `-- =========================================================================
-- ⚡ SAQIB VISUALS: FULL DATABASE INITIALIZATION SCRIPT (ALL-IN-ONE)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- This creates all tables, indexes, row level security, and public policies.
-- =========================================================================

-- 1. SITE VISITORS & TOOL ANALYTICS TABLE (LIVE INTEL & GEO TRACKING!)
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id TEXT PRIMARY KEY,
    ip_address TEXT NOT NULL,
    city TEXT DEFAULT 'Unknown',
    country TEXT DEFAULT 'Pakistan',
    country_code TEXT DEFAULT 'PK',
    region TEXT,
    referrer TEXT DEFAULT 'Direct',
    path TEXT DEFAULT '/',
    event_type TEXT DEFAULT 'page_view', -- 'page_view', 'tool_click'
    tool_id TEXT,
    tool_name TEXT,
    tool_category TEXT,
    browser TEXT DEFAULT 'Chrome',
    os TEXT DEFAULT 'WINDOWS',
    device_type TEXT DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
    screen_resolution TEXT DEFAULT '1920x1080',
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'Asia/Karachi',
    battery_level INTEGER,
    is_charging BOOLEAN,
    network_type TEXT,
    hardware_concurrency INTEGER,
    device_memory INTEGER,
    webgl_renderer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CLIENT INQUIRIES & DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.client_inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_type TEXT DEFAULT 'Custom Web Application',
    budget TEXT DEFAULT 'Flexible',
    timeline TEXT DEFAULT 'Flexible',
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'in_progress', 'completed', 'archived'
    priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'normal'
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Portfolio',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    gradient TEXT DEFAULT 'from-cyan-500 to-blue-600',
    restricted BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GALLERY / VISUALS TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Visual',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILE & CONTACT SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT DEFAULT 'Muhammad Saqib',
    short_name TEXT DEFAULT 'Saqib',
    brand_name TEXT DEFAULT 'Saqib Visuals',
    tagline TEXT DEFAULT 'Creative Visual Artist | Content Creator | Tech Enthusiast',
    bio TEXT DEFAULT 'I am a passionate Full-Stack Web Developer, App Developer, AI Enthusiast, and Creative Content Creator with a strong focus on building modern, fast, and scalable digital solutions.',
    phone TEXT DEFAULT '+92 343 673242',
    email TEXT DEFAULT 'mrsaqib242242@gmail.com',
    location TEXT DEFAULT 'Faisalabad, Pakistan',
    portfolio_url TEXT DEFAULT 'https://mrsaqib.vercel.app/',
    resume_url TEXT DEFAULT '/resume.pdf',
    whatsapp_url TEXT DEFAULT 'https://wa.me/92343673242',
    instagram_url TEXT DEFAULT 'https://www.instagram.com/mr_saqib242',
    facebook_url TEXT DEFAULT 'https://www.facebook.com/profile.php?id=100085188689033',
    tiktok_url TEXT DEFAULT 'https://www.tiktok.com/@mr_saqib_242',
    snapchat_url TEXT DEFAULT 'https://www.snapchat.com/add/mrsaqib242',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRICING PLANS TABLE
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    is_starting BOOLEAN DEFAULT false,
    color TEXT DEFAULT 'from-blue-500 to-indigo-600',
    emoji TEXT DEFAULT '💎',
    description TEXT DEFAULT '',
    features JSONB DEFAULT '[]'::jsonb,
    recommended BOOLEAN DEFAULT false,
    badge TEXT DEFAULT '',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRICING ADD-ONS TABLE
CREATE TABLE IF NOT EXISTS public.pricing_addons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    is_starting BOOLEAN DEFAULT false,
    emoji TEXT DEFAULT '⚡',
    category TEXT DEFAULT 'Features',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TOOL CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.tool_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT DEFAULT 'Sparkles',
    emoji TEXT DEFAULT '🔮',
    color TEXT DEFAULT 'from-purple-500 to-pink-500',
    description TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TOOLS TABLE
CREATE TABLE IF NOT EXISTS public.tools (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category_id TEXT REFERENCES public.tool_categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    icon TEXT DEFAULT 'Wrench',
    badge TEXT DEFAULT '',
    gradient TEXT DEFAULT 'from-blue-600 to-indigo-600',
    action_type TEXT DEFAULT 'external_url',
    modal_target TEXT DEFAULT '',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TOOL PAGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.tool_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    page_title TEXT DEFAULT 'Explore All Tools & Utilities',
    page_subtitle TEXT DEFAULT 'Instant access to AI predictors, developer portals, free coding repos, modded APKs, and custom web utilities.',
    badge_text TEXT DEFAULT 'Dynamic Tools Engine',
    announcement_text TEXT DEFAULT '🔥 Live Update: New AI predictors, free source repos & web utilities updated today!',
    show_announcement BOOLEAN DEFAULT true,
    featured_section_title TEXT DEFAULT 'Featured & Staff Picks',
    show_featured_section BOOLEAN DEFAULT true,
    default_view_mode TEXT DEFAULT 'grid',
    show_categories_count BOOLEAN DEFAULT true,
    enable_favorites BOOLEAN DEFAULT true,
    enable_copy_link BOOLEAN DEFAULT true,
    cta_banner_title TEXT DEFAULT 'Need a bespoke custom tool or API?',
    cta_banner_subtitle TEXT DEFAULT 'Request custom automation, calculators, scrapers, or AI apps built specifically for you.',
    cta_banner_button_text TEXT DEFAULT 'Explore Plans',
    cta_banner_action_type TEXT DEFAULT 'modal',
    cta_banner_target TEXT DEFAULT 'website_plans',
    show_cta_banner BOOLEAN DEFAULT true,
    quick_stat_1_val TEXT DEFAULT '15+',
    quick_stat_1_label TEXT DEFAULT 'Verified Tools',
    quick_stat_2_val TEXT DEFAULT '100%',
    quick_stat_2_label TEXT DEFAULT 'Free & Safe',
    quick_stat_3_val TEXT DEFAULT '24/7',
    quick_stat_3_label TEXT DEFAULT 'Cloud Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_auth (
    id TEXT PRIMARY KEY DEFAULT 'master_admin',
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    session_secret TEXT NOT NULL,
    role TEXT DEFAULT 'super_admin',
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_login_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared login rate limits across all Vercel serverless instances
CREATE TABLE IF NOT EXISTS public.admin_rate_limits (
    ip TEXT PRIMARY KEY,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Enables safe anonymous read/write access)
-- =========================================================================

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_rate_limits ENABLE ROW LEVEL SECURITY;

-- Secure Row Level Security Policies
DROP POLICY IF EXISTS "Public site analytics access" ON public.site_analytics;
DROP POLICY IF EXISTS "Public can record analytics" ON public.site_analytics;
DROP POLICY IF EXISTS "Public can view analytics" ON public.site_analytics;
DROP POLICY IF EXISTS "Public can only record analytics" ON public.site_analytics;
CREATE POLICY "Public can record analytics" ON public.site_analytics FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public inquiries access" ON public.client_inquiries;
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.client_inquiries;
DROP POLICY IF EXISTS "Public can view inquiries" ON public.client_inquiries;
DROP POLICY IF EXISTS "Public can only submit inquiries" ON public.client_inquiries;
DROP POLICY IF EXISTS "Public can view and manage inquiries" ON public.client_inquiries;
CREATE POLICY "Public can submit inquiries" ON public.client_inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public projects access" ON public.projects;
DROP POLICY IF EXISTS "Public read-only projects" ON public.projects;
CREATE POLICY "Public read-only projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public gallery access" ON public.gallery;
DROP POLICY IF EXISTS "Public read-only gallery" ON public.gallery;
CREATE POLICY "Public read-only gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public profile access" ON public.profile_settings;
DROP POLICY IF EXISTS "Public read-only profile" ON public.profile_settings;
CREATE POLICY "Public read-only profile" ON public.profile_settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public pricing plans access" ON public.pricing_plans;
DROP POLICY IF EXISTS "Public read-only pricing plans" ON public.pricing_plans;
CREATE POLICY "Public read-only pricing plans" ON public.pricing_plans FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public pricing addons access" ON public.pricing_addons;
DROP POLICY IF EXISTS "Public read-only pricing addons" ON public.pricing_addons;
CREATE POLICY "Public read-only pricing addons" ON public.pricing_addons FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public tool categories access" ON public.tool_categories;
DROP POLICY IF EXISTS "Public can view tool categories" ON public.tool_categories;
DROP POLICY IF EXISTS "Public can manage tool categories" ON public.tool_categories;
DROP POLICY IF EXISTS "Public read-only tool categories" ON public.tool_categories;
CREATE POLICY "Public read-only tool categories" ON public.tool_categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public tools access" ON public.tools;
DROP POLICY IF EXISTS "Public can view tools" ON public.tools;
DROP POLICY IF EXISTS "Public can manage tools" ON public.tools;
DROP POLICY IF EXISTS "Public read-only tools" ON public.tools;
CREATE POLICY "Public read-only tools" ON public.tools FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public tool settings access" ON public.tool_settings;
DROP POLICY IF EXISTS "Public can view tool settings" ON public.tool_settings;
DROP POLICY IF EXISTS "Public can manage tool settings" ON public.tool_settings;
DROP POLICY IF EXISTS "Public read-only tool settings" ON public.tool_settings;
CREATE POLICY "Public read-only tool settings" ON public.tool_settings FOR SELECT TO anon, authenticated USING (true);

-- 🛡️ SECURITY SHIELD: Strictly deny public anonymous access to admin_auth
-- Supabase Service Role Key automatically bypasses RLS safely from the Next.js server backend.
DROP POLICY IF EXISTS "Public backend auth access" ON public.admin_auth;
DROP POLICY IF EXISTS "Public admin_auth access" ON public.admin_auth;
DROP POLICY IF EXISTS "Strict deny anon admin_auth" ON public.admin_auth;
DROP POLICY IF EXISTS "Deny anonymous access to admin_auth" ON public.admin_auth;
CREATE POLICY "Deny anonymous access to admin_auth" 
ON public.admin_auth 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny anonymous access to admin_rate_limits" ON public.admin_rate_limits;
CREATE POLICY "Deny anonymous access to admin_rate_limits" 
ON public.admin_rate_limits 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- Insert default row for master_admin using ENV variables (handled via Next.js backend)
-- (Initial seeding should happen via the backend application code on startup to avoid hardcoded credentials in SQL)

-- Insert default row for profile_settings if not present
INSERT INTO public.profile_settings (id, name, short_name, brand_name, tagline, bio, phone, email, location)
VALUES (
  'default', 
  'Muhammad Saqib', 
  'Saqib', 
  'Saqib Visuals', 
  'Creative Visual Artist | Content Creator | Tech Enthusiast', 
  'I am a passionate Full-Stack Web Developer, App Developer, AI Enthusiast, and Creative Content Creator.',
  '+92 343 673242', 
  'mrsaqib242242@gmail.com', 
  'Faisalabad, Pakistan'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default row for tool_settings if not present
INSERT INTO public.tool_settings (id, page_title, page_subtitle)
VALUES ('default', 'Explore All Tools & Utilities', 'Instant access to AI predictors, developer portals, free coding repos, modded APKs, and custom web utilities.')
ON CONFLICT (id) DO NOTHING;

-- =========================================================================
-- 🛡️ ATOMIC RATE LIMIT FUNCTION (Prevents race conditions in concurrent requests)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.record_failed_login_attempt(
    p_ip TEXT,
    p_max_attempts INT DEFAULT 5,
    p_lock_duration_seconds INT DEFAULT 60
)
RETURNS TABLE (
    locked BOOLEAN,
    remaining_lock_seconds INT,
    attempts_left INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_now TIMESTAMPTZ := NOW();
    v_locked_until TIMESTAMPTZ;
    v_failed_attempts INT;
    v_rem_sec INT := 0;
BEGIN
    INSERT INTO public.admin_rate_limits (
        ip,
        failed_attempts,
        locked_until,
        last_attempt_at,
        created_at,
        updated_at
    )
    VALUES (
        p_ip,
        1,
        NULL,
        v_now,
        v_now,
        v_now
    )
    ON CONFLICT (ip) DO UPDATE SET
        failed_attempts = CASE
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until > v_now THEN admin_rate_limits.failed_attempts + 1
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until <= v_now THEN 1
            ELSE admin_rate_limits.failed_attempts + 1
        END,
        locked_until = CASE
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until > v_now THEN admin_rate_limits.locked_until
            WHEN (CASE 
                    WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until <= v_now THEN 1 
                    ELSE admin_rate_limits.failed_attempts + 1 
                  END) >= p_max_attempts THEN v_now + (p_lock_duration_seconds || ' seconds')::INTERVAL
            ELSE NULL
        END,
        last_attempt_at = v_now,
        updated_at = v_now
    RETURNING admin_rate_limits.failed_attempts, admin_rate_limits.locked_until
    INTO v_failed_attempts, v_locked_until;

    IF v_locked_until IS NOT NULL AND v_locked_until > v_now THEN
        v_rem_sec := CEIL(EXTRACT(EPOCH FROM (v_locked_until - v_now)));
        RETURN QUERY SELECT TRUE, v_rem_sec, 0;
    ELSE
        RETURN QUERY SELECT FALSE, 0, GREATEST(0, p_max_attempts - v_failed_attempts);
    END IF;
END;
$$;

-- 🛡️ STRICT PERMISSIONS: Revoke public execution on SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) FROM authenticated;

-- Grant execution strictly to trusted backend role (Service Role Key)
GRANT EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) TO service_role;
`;

export const ADMIN_AUTH_SQL = `-- =========================================================================
-- 🛡️ TABLE: MASTER ADMIN AUTH & RATE LIMIT SECURITY SHIELD
-- Tables: public.admin_auth, public.admin_rate_limits
-- Security: Passwords stored as SHA-256 PBKDF2 hashes with cryptographic salt.
--           Rate limits synchronized across all Vercel serverless instances.
--           Frontend receives ONLY boolean true/false responses.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.admin_auth (
    id TEXT PRIMARY KEY DEFAULT 'master_admin',
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    session_secret TEXT NOT NULL,
    role TEXT DEFAULT 'super_admin',
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_login_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared login rate limits across all Vercel serverless instances
CREATE TABLE IF NOT EXISTS public.admin_rate_limits (
    ip TEXT PRIMARY KEY,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial master admin credentials:
-- (Initial seeding should happen via the backend application code on startup to avoid hardcoded credentials in SQL)

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_rate_limits ENABLE ROW LEVEL SECURITY;

-- 🛡️ SECURITY SHIELD: Completely deny all public anonymous access!
-- Since our backend uses the SUPABASE_SERVICE_ROLE_KEY, it bypasses RLS safely.
-- Any attacker attempting to query admin_auth or admin_rate_limits via public Anon Key will be rejected!
DROP POLICY IF EXISTS "Public backend auth access" ON public.admin_auth;
DROP POLICY IF EXISTS "Deny anonymous access to admin_auth" ON public.admin_auth;
CREATE POLICY "Deny anonymous access to admin_auth" 
ON public.admin_auth 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny anonymous access to admin_rate_limits" ON public.admin_rate_limits;
CREATE POLICY "Deny anonymous access to admin_rate_limits" 
ON public.admin_rate_limits 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_admin_auth_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_admin_auth ON public.admin_auth;
CREATE TRIGGER trg_update_admin_auth
BEFORE UPDATE ON public.admin_auth
FOR EACH ROW
EXECUTE FUNCTION update_admin_auth_timestamp();

-- =========================================================================
-- 🛡️ ATOMIC RATE LIMIT FUNCTION (Prevents race conditions in concurrent requests)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.record_failed_login_attempt(
    p_ip TEXT,
    p_max_attempts INT DEFAULT 5,
    p_lock_duration_seconds INT DEFAULT 60
)
RETURNS TABLE (
    locked BOOLEAN,
    remaining_lock_seconds INT,
    attempts_left INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_now TIMESTAMPTZ := NOW();
    v_locked_until TIMESTAMPTZ;
    v_failed_attempts INT;
    v_rem_sec INT := 0;
BEGIN
    INSERT INTO public.admin_rate_limits (
        ip,
        failed_attempts,
        locked_until,
        last_attempt_at,
        created_at,
        updated_at
    )
    VALUES (
        p_ip,
        1,
        NULL,
        v_now,
        v_now,
        v_now
    )
    ON CONFLICT (ip) DO UPDATE SET
        failed_attempts = CASE
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until > v_now THEN admin_rate_limits.failed_attempts + 1
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until <= v_now THEN 1
            ELSE admin_rate_limits.failed_attempts + 1
        END,
        locked_until = CASE
            WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until > v_now THEN admin_rate_limits.locked_until
            WHEN (CASE 
                    WHEN admin_rate_limits.locked_until IS NOT NULL AND admin_rate_limits.locked_until <= v_now THEN 1 
                    ELSE admin_rate_limits.failed_attempts + 1 
                  END) >= p_max_attempts THEN v_now + (p_lock_duration_seconds || ' seconds')::INTERVAL
            ELSE NULL
        END,
        last_attempt_at = v_now,
        updated_at = v_now
    RETURNING admin_rate_limits.failed_attempts, admin_rate_limits.locked_until
    INTO v_failed_attempts, v_locked_until;

    IF v_locked_until IS NOT NULL AND v_locked_until > v_now THEN
        v_rem_sec := CEIL(EXTRACT(EPOCH FROM (v_locked_until - v_now)));
        RETURN QUERY SELECT TRUE, v_rem_sec, 0;
    ELSE
        RETURN QUERY SELECT FALSE, 0, GREATEST(0, p_max_attempts - v_failed_attempts);
    END IF;
END;
$$;

-- 🛡️ STRICT PERMISSIONS: Revoke public execution on SECURITY DEFINER function
REVOKE EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) FROM anon;
REVOKE EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) FROM authenticated;

-- Grant execution strictly to trusted backend role (Service Role Key)
GRANT EXECUTE ON FUNCTION public.record_failed_login_attempt(TEXT, INT, INT) TO service_role;
`;

export const SQL_SCRIPTS_CATALOG: SqlScriptItem[] = [
  {
    id: 'master',
    title: '⚡ Master All-In-One Database Setup',
    tableName: 'ALL TABLES',
    badge: 'Recommended',
    description: 'Creates all 10 tables, indexes, row level security policies, and initial records in a single run.',
    sql: MASTER_SUPABASE_SQL
  },
  {
    id: 'analytics',
    title: '🌐 Visitor Traffic & Tool Click Intel',
    tableName: 'site_analytics',
    badge: 'Live Analytics',
    description: 'Logs IP address, geolocation (city/country), device/OS, hardware specs, and which tools were visited.',
    sql: SITE_ANALYTICS_SQL
  },
  {
    id: 'inquiries',
    title: '📬 Client Inquiries & Project Queries',
    tableName: 'client_inquiries',
    badge: 'New & Active',
    description: 'Stores project requests, client contact details, budget, timelines, requirements, and admin notes.',
    sql: CLIENT_INQUIRIES_SQL
  },
  {
    id: 'projects',
    title: '🚀 Portfolio Projects Showcase',
    tableName: 'projects',
    badge: 'Projects',
    description: 'Stores your live web apps, GitHub repos, tags, categories, and direct application links.',
    sql: `-- Projects Table Schema & Policies
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Portfolio',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    gradient TEXT DEFAULT 'from-cyan-500 to-blue-600',
    restricted BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public projects access" ON public.projects;
DROP POLICY IF EXISTS "Public read-only projects" ON public.projects;
CREATE POLICY "Public read-only projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
`
  },
  {
    id: 'gallery',
    title: '📸 Visuals & Photography Gallery',
    tableName: 'gallery',
    badge: 'Gallery',
    description: 'Stores high-resolution photography, portrait shoots, thumbnails, and visual art items.',
    sql: `-- Gallery Table Schema & Policies
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Visual',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public gallery access" ON public.gallery;
DROP POLICY IF EXISTS "Public read-only gallery" ON public.gallery;
CREATE POLICY "Public read-only gallery" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
`
  },
  {
    id: 'profile',
    title: '👤 Profile, Brand & Contact Details',
    tableName: 'profile_settings',
    badge: 'Profile',
    description: 'Stores phone, email, bio, resume download link, and social media handles.',
    sql: `-- Profile Settings Table Schema & Policies
CREATE TABLE IF NOT EXISTS public.profile_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT DEFAULT 'Muhammad Saqib',
    short_name TEXT DEFAULT 'Saqib',
    brand_name TEXT DEFAULT 'Saqib Visuals',
    tagline TEXT,
    bio TEXT,
    phone TEXT DEFAULT '+92 343 673242',
    email TEXT DEFAULT 'mrsaqib242242@gmail.com',
    location TEXT DEFAULT 'Faisalabad, Pakistan',
    portfolio_url TEXT DEFAULT 'https://mrsaqib.vercel.app/',
    resume_url TEXT DEFAULT '/resume.pdf',
    whatsapp_url TEXT DEFAULT 'https://wa.me/92343673242',
    instagram_url TEXT,
    facebook_url TEXT,
    tiktok_url TEXT,
    snapchat_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profile access" ON public.profile_settings;
DROP POLICY IF EXISTS "Public read-only profile" ON public.profile_settings;
CREATE POLICY "Public read-only profile" ON public.profile_settings FOR SELECT TO anon, authenticated USING (true);
`
  },
  {
    id: 'pricing',
    title: '💎 Website Pricing Plans & Add-ons',
    tableName: 'pricing_plans & pricing_addons',
    badge: 'Pricing',
    description: 'Stores package pricing, features list, badges, and optional custom add-on services.',
    sql: `-- Pricing Plans & Add-ons Tables
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    is_starting BOOLEAN DEFAULT false,
    color TEXT DEFAULT 'from-blue-500 to-indigo-600',
    emoji TEXT DEFAULT '💎',
    description TEXT DEFAULT '',
    features JSONB DEFAULT '[]'::jsonb,
    recommended BOOLEAN DEFAULT false,
    badge TEXT DEFAULT '',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.pricing_addons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    is_starting BOOLEAN DEFAULT false,
    emoji TEXT DEFAULT '⚡',
    category TEXT DEFAULT 'Features',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public pricing plans access" ON public.pricing_plans;
DROP POLICY IF EXISTS "Public read-only pricing plans" ON public.pricing_plans;
CREATE POLICY "Public read-only pricing plans" ON public.pricing_plans FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public pricing addons access" ON public.pricing_addons;
DROP POLICY IF EXISTS "Public read-only pricing addons" ON public.pricing_addons;
CREATE POLICY "Public read-only pricing addons" ON public.pricing_addons FOR SELECT TO anon, authenticated USING (true);
`
  },
  {
    id: 'tools',
    title: '🔮 Tools Engine, Categories & Page Settings',
    tableName: 'tools, tool_categories, tool_settings',
    badge: 'Tools Hub',
    description: 'Full schema for tools repository, categories with icons, and announcement banner configs.',
    sql: `-- Tools, Categories & Settings Tables
CREATE TABLE IF NOT EXISTS public.tool_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT DEFAULT 'Sparkles',
    emoji TEXT DEFAULT '🔮',
    color TEXT DEFAULT 'from-purple-500 to-pink-500',
    description TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tools (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category_id TEXT REFERENCES public.tool_categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    icon TEXT DEFAULT 'Wrench',
    badge TEXT DEFAULT '',
    gradient TEXT DEFAULT 'from-blue-600 to-indigo-600',
    action_type TEXT DEFAULT 'external_url',
    modal_target TEXT DEFAULT '',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tool_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    page_title TEXT DEFAULT 'Explore All Tools & Utilities',
    page_subtitle TEXT DEFAULT 'Instant access to AI predictors, developer portals, free coding repos, modded APKs, and custom web utilities.',
    badge_text TEXT DEFAULT 'Dynamic Tools Engine',
    announcement_text TEXT DEFAULT '🔥 Live Update: New AI predictors, free source repos & web utilities updated today!',
    show_announcement BOOLEAN DEFAULT true,
    featured_section_title TEXT DEFAULT 'Featured & Staff Picks',
    show_featured_section BOOLEAN DEFAULT true,
    default_view_mode TEXT DEFAULT 'grid',
    show_categories_count BOOLEAN DEFAULT true,
    enable_favorites BOOLEAN DEFAULT true,
    enable_copy_link BOOLEAN DEFAULT true,
    cta_banner_title TEXT DEFAULT 'Need a bespoke custom tool or API?',
    cta_banner_subtitle TEXT DEFAULT 'Request custom automation, calculators, scrapers, or AI apps built specifically for you.',
    cta_banner_button_text TEXT DEFAULT 'Explore Plans',
    cta_banner_action_type TEXT DEFAULT 'modal',
    cta_banner_target TEXT DEFAULT 'website_plans',
    show_cta_banner BOOLEAN DEFAULT true,
    quick_stat_1_val TEXT DEFAULT '15+',
    quick_stat_1_label TEXT DEFAULT 'Verified Tools',
    quick_stat_2_val TEXT DEFAULT '100%',
    quick_stat_2_label TEXT DEFAULT 'Free & Safe',
    quick_stat_3_val TEXT DEFAULT '24/7',
    quick_stat_3_label TEXT DEFAULT 'Cloud Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public tool categories access" ON public.tool_categories;
DROP POLICY IF EXISTS "Public read-only tool categories" ON public.tool_categories;
CREATE POLICY "Public read-only tool categories" ON public.tool_categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public tools access" ON public.tools;
DROP POLICY IF EXISTS "Public read-only tools" ON public.tools;
CREATE POLICY "Public read-only tools" ON public.tools FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public tool settings access" ON public.tool_settings;
DROP POLICY IF EXISTS "Public read-only tool settings" ON public.tool_settings;
CREATE POLICY "Public read-only tool settings" ON public.tool_settings FOR SELECT TO anon, authenticated USING (true);
`
  },
  {
    id: 'admin_auth',
    title: '🛡️ Master Admin Authentication & Security Credentials',
    tableName: 'public.admin_auth',
    description: 'Secured server-authoritative table for admin login, salted SHA-256 PBKDF2 password hashes, session secrets, and brute force lockout tracking. Passwords NEVER leak to frontend.',
    badge: 'Security Shield',
    sql: ADMIN_AUTH_SQL
  }
];
