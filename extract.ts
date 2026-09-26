import { MASTER_SUPABASE_SQL } from './src/lib/sqlQueriesService';
import fs from 'fs';
fs.writeFileSync('supabase/migrations/20260926000000_init.sql', MASTER_SUPABASE_SQL);
