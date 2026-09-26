import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = "https://mxstnicoyfytfxfahybx.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_SqfaSNnNQut2t8eKD2vj6w_06fo4GPt";

function getValidSupabaseUrl(): string {
  const raw = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL) : undefined;
  if (!raw || typeof raw !== 'string') return DEFAULT_SUPABASE_URL;
  const trimmed = raw.trim();
  // Must start with http:// or https://, otherwise it is an invalid key mistakenly entered as URL
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return DEFAULT_SUPABASE_URL;
}

function getValidSupabaseAnonKey(): string {
  const raw = typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) : undefined;
  if (!raw || typeof raw !== 'string') return DEFAULT_SUPABASE_ANON_KEY;
  const trimmed = raw.trim();
  // If user accidentally put the URL into the key field, fallback
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return DEFAULT_SUPABASE_ANON_KEY;
  }
  return trimmed || DEFAULT_SUPABASE_ANON_KEY;
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey = getValidSupabaseAnonKey();

// Safe initialization that will never crash the app
let clientInstance: ReturnType<typeof createClient<any, any, any>>;
try {
  clientInstance = createClient<any, any, any>(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn("Falling back to default Supabase client due to invalid configuration:", err);
  clientInstance = createClient<any, any, any>(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
}

export const supabase = clientInstance as any;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabase);
};
