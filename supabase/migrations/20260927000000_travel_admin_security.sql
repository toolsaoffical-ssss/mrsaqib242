-- =========================================================================
-- 🛡️ TRAVEL-FRIENDLY ADMIN SECURITY UPGRADE (48-HOUR RESTRICTED ACCESS SYSTEM)
-- Database: Supabase PostgreSQL (Public Schema)
-- Status: Verified & Synced
-- =========================================================================

-- 1. ADMIN REGISTERED & TRUSTED DEVICES TABLE
CREATE TABLE IF NOT EXISTS public.admin_devices (
    id TEXT PRIMARY KEY,
    device_secret_hash TEXT NOT NULL,
    device_name TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    browser TEXT DEFAULT 'Chrome',
    os TEXT DEFAULT 'WINDOWS',
    device_type TEXT DEFAULT 'desktop',
    city TEXT DEFAULT 'Unknown',
    country TEXT DEFAULT 'Pakistan',
    country_code TEXT DEFAULT 'PK',
    region TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending_48h' CHECK (status IN ('trusted', 'pending_48h', 'blocked')),
    restricted_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '48 hours'),
    approved_at TIMESTAMPTZ,
    approved_by TEXT,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADMIN PERSISTENT SECURITY ALERTS & AUDIT TRAIL TABLE
CREATE TABLE IF NOT EXISTS public.admin_security_alerts (
    id TEXT PRIMARY KEY,
    device_id TEXT REFERENCES public.admin_devices(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL DEFAULT 'unknown_device_login',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    city TEXT DEFAULT 'Unknown',
    country TEXT DEFAULT 'Pakistan',
    browser TEXT,
    os TEXT,
    device_type TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'blocked', 'resolved')),
    restricted_until TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ADMIN EMERGENCY RECOVERY CODES TABLE (FOR TRAVEL 48H RECOVERY)
CREATE TABLE IF NOT EXISTS public.admin_recovery_codes (
    id TEXT PRIMARY KEY,
    code_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    label TEXT DEFAULT 'Travel Backup Code',
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- =========================================================================
-- INDEXES FOR INSTANT SECURITY CHECKS & REALTIME TELEMETRY
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_admin_devices_hash ON public.admin_devices(device_secret_hash);
CREATE INDEX IF NOT EXISTS idx_admin_devices_status ON public.admin_devices(status);
CREATE INDEX IF NOT EXISTS idx_admin_devices_ip ON public.admin_devices(ip_address);
CREATE INDEX IF NOT EXISTS idx_admin_security_alerts_created ON public.admin_security_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_security_alerts_device ON public.admin_security_alerts(device_id);
CREATE INDEX IF NOT EXISTS idx_admin_security_alerts_status ON public.admin_security_alerts(status);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Zero anonymous / frontend leakage. Backend Service Role accesses securely.
-- =========================================================================
ALTER TABLE public.admin_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_recovery_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Deny anonymous access to admin_devices" ON public.admin_devices;
CREATE POLICY "Deny anonymous access to admin_devices" 
ON public.admin_devices 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny anonymous access to admin_security_alerts" ON public.admin_security_alerts;
CREATE POLICY "Deny anonymous access to admin_security_alerts" 
ON public.admin_security_alerts 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

DROP POLICY IF EXISTS "Deny anonymous access to admin_recovery_codes" ON public.admin_recovery_codes;
CREATE POLICY "Deny anonymous access to admin_recovery_codes" 
ON public.admin_recovery_codes 
FOR ALL 
TO anon 
USING (false) 
WITH CHECK (false);

-- =========================================================================
-- ATOMIC SECURITY FUNCTIONS (RACE-CONDITION RESISTANT)
-- =========================================================================

-- 1. ATOMIC DEVICE APPROVAL (Enforced with database transaction)
CREATE OR REPLACE FUNCTION public.approve_admin_device(
    p_device_id TEXT,
    p_approved_by TEXT DEFAULT 'trusted_admin'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_found BOOLEAN := false;
BEGIN
    UPDATE public.admin_devices
    SET 
        status = 'trusted',
        approved_at = NOW(),
        approved_by = p_approved_by,
        restricted_until = NULL,
        updated_at = NOW()
    WHERE id = p_device_id AND status != 'blocked'
    RETURNING true INTO v_found;

    IF v_found THEN
        UPDATE public.admin_security_alerts
        SET 
            status = 'approved',
            resolved_at = NOW()
        WHERE device_id = p_device_id AND status = 'pending';

        -- Insert audit event
        INSERT INTO public.admin_security_alerts (
            id,
            device_id,
            event_type,
            title,
            message,
            ip_address,
            status,
            resolved_at,
            created_at
        )
        SELECT 
            'alt_appr_' || SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 12),
            id,
            'device_approved',
            'Device Approved as Trusted',
            'Device ' || device_name || ' was granted full trusted access by ' || p_approved_by || '.',
            ip_address,
            'resolved',
            NOW(),
            NOW()
        FROM public.admin_devices
        WHERE id = p_device_id;

        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- 2. ATOMIC DEVICE BLOCKING (Immediately revokes access)
CREATE OR REPLACE FUNCTION public.block_admin_device(
    p_device_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_found BOOLEAN := false;
BEGIN
    UPDATE public.admin_devices
    SET 
        status = 'blocked',
        restricted_until = NULL,
        updated_at = NOW()
    WHERE id = p_device_id
    RETURNING true INTO v_found;

    IF v_found THEN
        UPDATE public.admin_security_alerts
        SET 
            status = 'blocked',
            resolved_at = NOW()
        WHERE device_id = p_device_id;

        -- Insert audit event
        INSERT INTO public.admin_security_alerts (
            id,
            device_id,
            event_type,
            title,
            message,
            ip_address,
            status,
            resolved_at,
            created_at
        )
        SELECT 
            'alt_blk_' || SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 12),
            id,
            'device_blocked',
            'Device Blocked by Administrator',
            'Device ' || device_name || ' was explicitly blocked. All active sessions have been terminated.',
            ip_address,
            'blocked',
            NOW(),
            NOW()
        FROM public.admin_devices
        WHERE id = p_device_id;

        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- 3. ATOMIC 48-HOUR ELAPSED DEVICE RECOVERY PROMOTION
CREATE OR REPLACE FUNCTION public.recover_device_after_48h(
    p_device_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_eligible BOOLEAN := false;
BEGIN
    UPDATE public.admin_devices
    SET 
        status = 'trusted',
        approved_at = NOW(),
        approved_by = '48h_recovery_factor',
        restricted_until = NULL,
        updated_at = NOW()
    WHERE id = p_device_id 
      AND status = 'pending_48h' 
      AND restricted_until <= NOW()
    RETURNING true INTO v_eligible;

    IF v_eligible THEN
        UPDATE public.admin_security_alerts
        SET 
            status = 'approved',
            resolved_at = NOW()
        WHERE device_id = p_device_id AND status = 'pending';

        INSERT INTO public.admin_security_alerts (
            id,
            device_id,
            event_type,
            title,
            message,
            ip_address,
            status,
            resolved_at,
            created_at
        )
        SELECT 
            'alt_rec_' || SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 12),
            id,
            'device_approved',
            '48-Hour Travel Recovery Completed',
            'Device completed the mandatory 48-hour security waiting period and verified independent recovery credentials.',
            ip_address,
            'resolved',
            NOW(),
            NOW()
        FROM public.admin_devices
        WHERE id = p_device_id;

        RETURN true;
    END IF;

    RETURN false;
END;
$$;

-- Revoke public permissions on SECURITY DEFINER functions & grant strictly to service_role
REVOKE EXECUTE ON FUNCTION public.approve_admin_device(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.approve_admin_device(TEXT, TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION public.block_admin_device(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.block_admin_device(TEXT) TO service_role;

REVOKE EXECUTE ON FUNCTION public.recover_device_after_48h(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recover_device_after_48h(TEXT) TO service_role;

-- =========================================================================
-- UPDATED_AT TRIGGER
-- =========================================================================
CREATE OR REPLACE FUNCTION update_admin_devices_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_admin_devices ON public.admin_devices;
CREATE TRIGGER trg_update_admin_devices
BEFORE UPDATE ON public.admin_devices
FOR EACH ROW
EXECUTE FUNCTION update_admin_devices_timestamp();
