import type { NextApiRequest, NextApiResponse } from 'next';
import { generateMirageOtp } from '../../../../lib/mirageService';
import { checkRateLimit, registerFailedAttempt } from '../../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  // 1. IP Rate Limiting (Brute Force Protection)
  const rateLimit = await checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: 'Too many requests. Generator locked.',
      lockedUntil: Date.now() + (rateLimit.remainingLockSeconds || 60) * 1000
    });
  }

  const { pin } = req.body || {};
  
  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'PIN is required' });
  }

  // Artificial delay to prevent timing attacks (honeypot standard practice)
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  try {
    const result = await generateMirageOtp(pin);
    
    // 2. Register failure if the PIN was wrong (fake)
    if (result.isFake) {
      const failResult = await registerFailedAttempt(clientIp);
      if (failResult.locked) {
        return res.status(429).json({ 
          error: 'Security Lockout. Maximum attempts reached.',
          lockedUntil: Date.now() + (failResult.remainingLockSeconds || 60) * 1000
        });
      }
    }

    // Note: Whether it was correct or fake, the frontend receives a 200 OK
    // with { code: string, colors: string[] }. It has no idea if it's the real one.
    return res.status(200).json({ success: true, code: result.code, colors: result.colors });
  } catch (err: any) {
    console.error('Mirage Generate Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
