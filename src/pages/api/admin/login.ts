import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  authenticateAdmin, 
  validateRequestOrigin, 
  setAdminSessionCookie 
} from '../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Layer 3 Security: CSRF & Request Origin Validation
  if (!validateRequestOrigin(req)) {
    return res.status(403).json({
      success: false,
      message: 'Cross-Site Request Forgery blocked: Unauthorized request origin.'
    });
  }

  const { username, password } = req.body || {};

  // Extract client IP address for brute-force protection
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' 
    ? forwarded.split(',')[0].trim() 
    : req.socket.remoteAddress || '127.0.0.1';

  try {
    const result = await authenticateAdmin(username || '', password || '', clientIp);

    if (result.success && result.token) {
      // Layer 2 Security: Set HttpOnly, Secure, SameSite=Strict Cookie
      setAdminSessionCookie(res, result.token);

      return res.status(200).json({
        success: true,
        token: result.token,
        username: result.username,
        message: result.message
      });
    }

    if (result.locked) {
      return res.status(429).json({
        success: false,
        locked: true,
        remainingLockSeconds: result.remainingLockSeconds,
        message: result.message
      });
    }

    if (result.attemptsLeft === undefined) {
      return res.status(503).json({
        success: false,
        message: result.message
      });
    }

    return res.status(401).json({
      success: false,
      attemptsLeft: result.attemptsLeft,
      message: result.message
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server security error. Please check server logs.'
    });
  }
}
