-- =========================================================================
-- 🛡️ MASTER SECURITY PIN SYSTEM (Default: Ilove4HAD)
-- Run this SQL in Supabase SQL Editor to enable persistent Master Security PIN storage
-- =========================================================================

-- 1. Add security PIN columns to admin_auth table if not already present
ALTER TABLE public.admin_auth 
ADD COLUMN IF NOT EXISTS security_pin_hash TEXT,
ADD COLUMN IF NOT EXISTS security_pin_salt TEXT;

-- 2. Populate default PIN 'Ilove4HAD' for master_admin (Hashed with PBKDF2 100,000 iterations)
-- Default Salt: a1b2c3d4e5f60718293a4b5c6d7e8f90
-- Default Hash of 'Ilove4HAD': 5e98c05cea2f9cfbbe47119ad3560396f58b648c4254b2ba248b059e9db3dd4719d243b6a6427aadc0c14bff1aa4b773a86ae021ae3b2773e04ded4cd9d30e4d
UPDATE public.admin_auth
SET 
  security_pin_salt = COALESCE(security_pin_salt, 'a1b2c3d4e5f60718293a4b5c6d7e8f90'),
  security_pin_hash = COALESCE(security_pin_hash, '5e98c05cea2f9cfbbe47119ad3560396f58b648c4254b2ba248b059e9db3dd4719d243b6a6427aadc0c14bff1aa4b773a86ae021ae3b2773e04ded4cd9d30e4d'),
  updated_at = NOW()
WHERE id = 'master_admin';

-- 3. Verify that the table was successfully updated
SELECT 
  id, 
  username, 
  security_pin_salt, 
  LEFT(security_pin_hash, 20) || '...' AS security_pin_hash_preview, 
  updated_at
FROM public.admin_auth
WHERE id = 'master_admin';
