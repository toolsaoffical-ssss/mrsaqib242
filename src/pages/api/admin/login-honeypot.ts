import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Any request (POST/GET) sent here is a trap.
  // We use a pure server-side 302 redirect. 
  // The frontend JS has zero knowledge of this destination.
  
  // The destination page (/yourareadmin) will automatically trace 
  // their IP and log the intrusion in Supabase via its own SSR logic.
  
  res.redirect(302, '/yourareadmin?reason=honeypot_login');
}
