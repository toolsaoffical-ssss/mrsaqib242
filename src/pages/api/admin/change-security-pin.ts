import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  updateAdminSecurityPin, 
  verifyAdminSessionWithDevice, 
  assertUnrestrictedAdmin,
  validateRequestOrigin 
} from '../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Layer 3 Security: Origin / CSRF protection
  if (!validateRequestOrigin(req)) {
    return res.status(403).json({
      success: false,
      message: 'Cross-Site Request Forgery blocked: Invalid request origin.'
    });
  }

  // Device & Session Verification
  const auth = await verifyAdminSessionWithDevice(req);
  if (!auth.valid) {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please log in again.' });
  }

  // 🛡️ 48-Hour Travel Security Gatekeeper:
  // Restricted sessions on unrecognized devices CANNOT modify administrative security PIN!
  if (!assertUnrestrictedAdmin(auth, res, req)) {
    return;
  }

  const { currentPin, newPin } = req.body || {};

  try {
    const result = await updateAdminSecurityPin(
      currentPin || '',
      newPin || '',
      auth.isRestricted
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err: any) {
    console.error('Error changing Master Security PIN:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while encrypting new Master Security PIN.'
    });
  }
}
