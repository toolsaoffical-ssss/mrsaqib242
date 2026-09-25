import { supabase } from './src/lib/supabase';

async function check() {
  const { data, error } = await supabase.from('link_analytics').select('*').limit(1);
  console.log("data:", data);
  console.log("error:", error);
}

check();
