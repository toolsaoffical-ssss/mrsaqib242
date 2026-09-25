import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  verifyAdminSessionToken, 
  extractSessionToken, 
  validateRequestOrigin 
} from '../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ authenticated: false, message: 'Method not allowed' });
  }

  // Origin verification
  if (!validateRequestOrigin(req)) {
    return res.status(403).json({ authenticated: false, message: 'Forbidden origin' });
  }

  // Extract from HttpOnly cookie, Authorization header, or body
  const token = extractSessionToken(req);

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'Missing token' });
  }

  try {
    const result = await verifyAdminSessionToken(token);
    if (result.valid) {
      return res.status(200).json({ authenticated: true, username: result.username });
    }
    return res.status(401).json({ authenticated: false, message: 'Invalid or expired session' });
  } catch (err) {
    return res.status(401).json({ authenticated: false, message: 'Token verification failed' });
  }
}
