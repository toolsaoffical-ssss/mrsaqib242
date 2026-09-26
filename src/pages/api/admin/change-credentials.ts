import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  updateAdminCredentials, 
  verifyAdminSessionToken, 
  extractSessionToken, 
  validateRequestOrigin, 
  setAdminSessionCookie 
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

  const token = extractSessionToken(req);

  // Verify that an active admin session is making this change
  if (token) {
    const sessionCheck = await verifyAdminSessionToken(token);
    if (!sessionCheck.valid) {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Authentication required to modify credentials.' });
  }

  const { currentPassword, newUsername, newPassword } = req.body || {};

  try {
    const result = await updateAdminCredentials(
      currentPassword || '',
      newUsername || '',
      newPassword || ''
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    // Update HttpOnly session cookie with the new token
    if (result.newToken) {
      setAdminSessionCookie(res, result.newToken);
    }

    // Success response: Never returns tokens, passwords or hashes! Only boolean and clean status.
    return res.status(200).json({
      success: true,
      message: result.message,
      newUsername: result.newUsername
    });
  } catch (err: any) {
    console.error('Error changing admin credentials:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while encrypting new credentials.'
    });
  }
}
