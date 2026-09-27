import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAdminSessionWithDevice } from '../../../../lib/serverAdminAuth';
import { verifyMirageOtp, setMirageUnlockedCookie, verifyMirageState, clearMirageCookie } from '../../../../lib/mirageService';

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

  // 3. Verify OTP
  const { code } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Matrix code is required' });
  }

  const isValid = await verifyMirageOtp(code);

  if (isValid) {
    setMirageUnlockedCookie(res);
    return res.status(200).json({ success: true, message: 'Visual verification successful.' });
  } else {
    // DO NOT reveal if it's fake or what. Just say invalid. 
    // They can try again, but the 60s timer is still ticking!
    return res.status(400).json({ error: 'Matrix mismatch. Sequence rejected.' });
  }
}
