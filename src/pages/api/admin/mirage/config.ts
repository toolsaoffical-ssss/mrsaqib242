import type { NextApiRequest, NextApiResponse } from 'next';
import { assertUnrestrictedAdmin, verifyAdminSessionWithDevice } from '../../../../lib/serverAdminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../../../lib/supabaseServer';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyAdminSessionWithDevice(req);
  if (!assertUnrestrictedAdmin(auth, res, req)) return;

  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  if (req.method === 'GET') {
    const { data } = await supabaseAdmin.from('admin_mirage_config').select('true_colors, true_port, port_labels').eq('id', 'master_mirage').maybeSingle();
    return res.status(200).json({ 
      success: true, 
      colors: data?.true_colors || ['#10b981', '#10b981', '#10b981', '#10b981'],
      truePort: data?.true_port || 8,
      portLabels: data?.port_labels || Array(12).fill('').map((_, i) => String(i + 1).padStart(2, '0'))
    });
  }

  if (req.method === 'POST') {
    const { newPin, newColors, newTruePort, newPortLabels } = req.body;
    
    if (!newPin || !newColors || !Array.isArray(newColors) || newColors.length !== 4) {
      return res.status(400).json({ error: 'Invalid configuration payload' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(newPin.trim(), salt, 50000, 32, 'sha256').toString('hex');
    const portToSave = newTruePort ? parseInt(newTruePort, 10) : 8;
    const labelsToSave = (Array.isArray(newPortLabels) && newPortLabels.length === 12) 
      ? newPortLabels 
      : Array(12).fill('').map((_, i) => String(i + 1).padStart(2, '0'));

    const { error } = await supabaseAdmin.from('admin_mirage_config').upsert({
      id: 'master_mirage',
      generator_pin_hash: hash,
      generator_pin_salt: salt,
      true_colors: newColors,
      true_port: portToSave,
      port_labels: labelsToSave,
      updated_at: new Date().toISOString()
    });

    if (error) {
      return res.status(500).json({ error: 'Failed to update mirage configuration.' });
    }

    return res.status(200).json({ success: true, message: 'Visual PIN Matrix updated successfully.' });
  }
}
