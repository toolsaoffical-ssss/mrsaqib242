import type { NextApiRequest, NextApiResponse } from 'next';
import { generateMirageOtp } from '../../../../lib/mirageService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pin } = req.body || {};
  
  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'PIN is required' });
  }

  // Artificial delay to prevent timing attacks (honeypot standard practice)
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  try {
    const result = await generateMirageOtp(pin);
    // Note: Whether it was correct or fake, the frontend receives a 200 OK
    // with { code: string, colors: string[] }. It has no idea if it's the real one.
    return res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    console.error('Mirage Generate Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
