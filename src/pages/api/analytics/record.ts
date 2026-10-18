import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Zero Vercel Compute Mode:
 * All live visitor telemetry writes directly to Supabase from the client browser.
 * This endpoint immediately returns 204 No Content in < 0.1ms to ensure
 * 0.00 seconds of Vercel Active CPU is consumed even if hit by crawlers or bots.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  return res.status(204).end();
}
