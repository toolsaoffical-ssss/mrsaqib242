require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data, error } = await supabase.from('admin_devices').update({ status: 'trusted', restricted_until: null }).eq('status', 'pending_48h');
  console.log('Approve result:', error ? error : 'Success');
}
main();
