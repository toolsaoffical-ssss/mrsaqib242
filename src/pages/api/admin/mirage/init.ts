import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    // 1. Create Config Table
    await supabaseAdmin.rpc('exec_sql', {
      sql_string: `
        CREATE TABLE IF NOT EXISTS admin_mirage_config (
          id TEXT PRIMARY KEY,
          generator_pin_hash TEXT NOT NULL,
          generator_pin_salt TEXT NOT NULL,
          true_colors JSONB NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
        );

        CREATE TABLE IF NOT EXISTS admin_mirage_otps (
          id TEXT PRIMARY KEY,
          otp_hash TEXT NOT NULL,
          otp_salt TEXT NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          is_used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
        );
      `
    });
  } catch (err) {
    // exec_sql might not exist, so let's just insert directly to test if tables exist, 
    // if not, we can't create tables without direct SQL access.
  }

  // Generate initial hash for 242242
  const initialPin = '242242';
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(initialPin, salt, 50000, 32, 'sha256').toString('hex');

  const { error } = await supabaseAdmin.from('admin_mirage_config').upsert({
    id: 'master_mirage',
    generator_pin_hash: hash,
    generator_pin_salt: salt,
    true_colors: ['#10b981', '#10b981', '#10b981', '#10b981'],
    updated_at: new Date().toISOString()
  });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, message: 'Mirage initialized' });
}
