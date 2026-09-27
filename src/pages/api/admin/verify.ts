import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  verifyAdminSessionWithDevice,
  validateRequestOrigin 
} from '../../../lib/serverAdminAuth';
import { verifyMirageState } from '../../../lib/mirageService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ authenticated: false, message: 'Method not allowed' });
  }

  // Origin verification
  if (!validateRequestOrigin(req)) {
    return res.status(403).json({ authenticated: false, message: 'Forbidden origin' });
  }

  try {
    const result = await verifyAdminSessionWithDevice(req);

    if (result.valid) {
      const mirage = verifyMirageState(req);

      return res.status(200).json({ 
        authenticated: true, 
        username: result.username,
        is_restricted: result.isRestricted,
        device_id: result.deviceId,
        device_status: result.deviceStatus,
        remaining_restriction_seconds: result.remainingRestrictionSeconds || 0,
        mirage_locked: !mirage.isUnlocked
      });
    }

    if (result.deviceStatus === 'blocked') {
      return res.status(403).json({
        authenticated: false,
        blocked: true,
        message: 'Security Alert: This device has been blocked by an administrator.'
      });
    }

    return res.status(401).json({ 
      authenticated: false, 
      message: result.reason || 'Invalid or expired session' 
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false, message: 'Token verification failed' });
  }
}
