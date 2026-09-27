import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminSessionWithDevice } from '../../../../lib/serverAdminAuth';
import { verifyMirageOtp, setMirageUnlockedCookie, verifyMirageState, clearMirageCookie, getMirageConfig } from '../../../../lib/mirageService';
import { supabaseAdmin } from '../../../../lib/supabaseServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. You must be authenticated to even attempt a Mirage verification
  const auth = await verifyAdminSessionWithDevice(req);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Check if the 60 seconds have elapsed!
  const state = verifyMirageState(req);
  if (state.isUnlocked) {
    return res.status(200).json({ success: true, message: 'Already unlocked' });
  }

  if (state.isExpired) {
    // KICK OUT! 
    clearMirageCookie(res);
    return res.status(403).json({ error: 'Session Expired! You failed to verify the visual matrix in 60 seconds. You have been kicked out.' });
  }

  // 3. Penalty Check (20-second cooldown) via Supabase
  const config = await getMirageConfig();
  if (!config) {
    return res.status(500).json({ error: 'Mirage configuration not found.' });
  }

  const penaltyEnd = config.mirage_locked_until ? new Date(config.mirage_locked_until).getTime() : 0;
  if (Date.now() < penaltyEnd) {
    return res.status(429).json({ error: 'PORT LOCKED. Please wait before retrying.', lockedUntil: penaltyEnd });
  }

  // 4. Verify Code & Port
  const { code, port } = req.body || {};
  if (!code || typeof code !== 'string' || typeof port !== 'number') {
    return res.status(400).json({ error: 'Matrix code and port number are required.' });
  }

  // Check strike count from DB
  let strikes = config.mirage_strikes || 0;
  const truePort = config.true_port || 8;

  let isValid = false;
  if (port === truePort) {
    isValid = await verifyMirageOtp(code);
  }

  if (isValid) {
    await supabaseAdmin.from('admin_mirage_config').update({
      mirage_strikes: 0,
      mirage_locked_until: null
    }).eq('id', 'master_mirage');

    const existing = res.getHeader('Set-Cookie') || [];
    const existingArray = Array.isArray(existing) ? existing : [String(existing)];
    res.setHeader('Set-Cookie', [
      ...existingArray,
      `ms_mirage_strikes=0; Path=/; Max-Age=0`,
      `ms_mirage_penalty=0; Path=/; Max-Age=0`
    ]);
    setMirageUnlockedCookie(res);
    return res.status(200).json({ success: true, message: 'Visual verification successful.' });
  } else {
    strikes += 1;
    
    if (strikes >= 3) {
      clearMirageCookie(res);
      await supabaseAdmin.from('admin_mirage_config').update({
        mirage_strikes: 0,
        mirage_locked_until: null
      }).eq('id', 'master_mirage');

      const existing = res.getHeader('Set-Cookie') || [];
      const existingArray = Array.isArray(existing) ? existing : [String(existing)];
      res.setHeader('Set-Cookie', [
        ...existingArray,
        `ms_mirage_strikes=0; Path=/; Max-Age=0`,
        `ms_mirage_penalty=0; Path=/; Max-Age=0`
      ]);
      return res.status(403).json({ error: 'SYSTEM COMPROMISE DETECTED. 3 Strikes. Session Terminated.' });
    }

    // Lock for 20 seconds
    const lockedUntil = Date.now() + 20000;
    
    await supabaseAdmin.from('admin_mirage_config').update({
      mirage_strikes: strikes,
      mirage_locked_until: new Date(lockedUntil).toISOString()
    }).eq('id', 'master_mirage');

    const existing2 = res.getHeader('Set-Cookie') || [];
    const existingArray2 = Array.isArray(existing2) ? existing2 : [String(existing2)];
    res.setHeader('Set-Cookie', [
      ...existingArray2,
      `ms_mirage_strikes=0; Path=/; Max-Age=0`,
      `ms_mirage_penalty=0; Path=/; Max-Age=0`
    ]);

    return res.status(400).json({ error: 'Matrix mismatch. Sequence rejected.', lockedUntil });
  }
}
