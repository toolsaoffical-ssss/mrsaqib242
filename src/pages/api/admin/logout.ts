import type { NextApiRequest, NextApiResponse } from 'next';
import { clearAdminSessionCookie } from '../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Clear server-side HttpOnly session cookie
  clearAdminSessionCookie(res);

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
