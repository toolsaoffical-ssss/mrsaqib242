import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://mxstnicoyfytfxfahybx.supabase.co';

function getValidServerSupabaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

  if (typeof raw === 'string' && (raw.startsWith('https://') || raw.startsWith('http://'))) {
    return raw.trim();
  }
  return DEFAULT_SUPABASE_URL;
}

const supabaseUrl = getValidServerSupabaseUrl();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create admin client strictly from environment variable, never hardcoded in source files
let adminClient: ReturnType<typeof createClient>;
if (serviceRoleKey && serviceRoleKey.length > 20) {
  try {
    adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (err) {
    console.warn("Could not initialize Supabase Admin client from environment:", err);
    // Dummy fallback client
    adminClient = createClient(DEFAULT_SUPABASE_URL, 'placeholder-key', {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
} else {
  // If no environment variable is provided, avoid crashing Next.js builds or routes
  adminClient = createClient(DEFAULT_SUPABASE_URL, 'placeholder-key', {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

export const supabaseAdmin = adminClient;

export const isSupabaseAdminConfigured = () => {
  return Boolean(
    serviceRoleKey &&
    serviceRoleKey.length > 20 &&
    serviceRoleKey !== 'placeholder-key'
  );
};
