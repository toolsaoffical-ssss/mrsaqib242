import type { NextApiRequest, NextApiResponse } from 'next';

const PORTAL_URL = (process.env.SIGMA_PORTAL_URL || 'https://sigmamini.vercel.app').trim().replace(/\/+$/, '');
const MINI_WORKER_URL = (process.env.SIGMA_MINI_WORKER_URL || 'https://sigmaminibot-8fdafb0f00ef.herokuapp.com').trim().replace(/\/+$/, '');

function sanitizePhoneNumber(input: string): string {
  let cleaned = (input || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  if (cleaned.startsWith('03') && cleaned.length === 11) {
    cleaned = '92' + cleaned.substring(1);
  } else if (cleaned.startsWith('3') && cleaned.length === 10) {
    cleaned = '92' + cleaned;
  }
  return cleaned;
}

function formatCode(code: string): string {
  const clean = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = clean.match(/.{1,4}/g);
  return match ? match.join('-') : clean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = (req.query.action || req.body?.action || 'pair').toString().toLowerCase();
  const rawNumber = (req.query.number || req.body?.number || req.body?.phone || '').toString();
  const number = sanitizePhoneNumber(rawNumber);

  if (!number || number.length < 10 || number.length > 15) {
    return res.status(400).json({
      success: false,
      error: 'Enter a valid WhatsApp number with country code (e.g. 923001234567).'
    });
  }

  if (action === 'status') {
    try {
      const stRes = await fetch(
        `${MINI_WORKER_URL}/api/pair/status?number=${encodeURIComponent(number)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (stRes.ok) {
        const data = await stRes.json();
        return res.status(200).json({
          success: true,
          connected: Boolean(data?.connected || data?.isConnected),
          isConnected: Boolean(data?.connected || data?.isConnected),
          number
        });
      }
    } catch {
      // ignore timeout during polling
    }
    return res.status(200).json({ success: true, connected: false, isConnected: false, number });
  }

  const rawRef = (
    req.body?.refCode ||
    req.body?.refq ||
    req.body?.ref ||
    req.query.refq ||
    req.query.ref ||
    req.cookies?.sigma_ref ||
    ''
  )
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');
  const refCode = rawRef.length >= 3 && rawRef.length <= 24 ? rawRef : '';
  const force = Boolean(req.body?.force || req.query.force === '1' || req.query.force === 'true');

  // 1) Primary: route via SIGMA MINI Portal public pool (Default SIGMA MD + Supabase referral tracking)
  try {
    const portalRes = await fetch(`${PORTAL_URL}/api/tenant/pair`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: number,
        mode: 'pool',
        refCode,
        force
      }),
      signal: AbortSignal.timeout(22000)
    });

    const portalJson = await portalRes.json().catch(() => null);
    const codeRaw = portalJson?.pairingCode || portalJson?.cleanCode || portalJson?.code || '';
    if (portalRes.ok && portalJson?.success && codeRaw) {
      const clean = String(codeRaw).toUpperCase().replace(/[^A-Z0-9]/g, '');
      return res.status(200).json({
        success: true,
        code: formatCode(clean),
        rawCode: clean,
        number: String(portalJson.number || number),
        botName: 'SIGMA MD'
      });
    }

    // Preserve explicit 4xx client errors (400 / 409 already connected / 429 rate limit)
    if (portalRes.status >= 400 && portalRes.status < 500 && portalJson?.error) {
      return res.status(portalRes.status).json({
        success: false,
        alreadyConnected: Boolean(portalJson.alreadyConnected || portalRes.status === 409),
        error: portalJson.error
      });
    }
  } catch {
    // Fall back directly to default SIGMA MD worker
  }

  // 2) Fallback: pair directly on Mini Bot worker in strict Default SIGMA MD mode (?defaultBot=1)
  try {
    const fallbackUrl = `${MINI_WORKER_URL}/api/pair?number=${encodeURIComponent(number)}&defaultBot=1${
      refCode ? `&refq=${encodeURIComponent(refCode)}` : ''
    }${force ? '&force=true' : ''}`;
    const workerRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(22000) });
    const workerJson = await workerRes.json().catch(() => null);
    const codeRaw = workerJson?.pairingCode || workerJson?.code || '';
    if (workerRes.ok && workerJson?.success && codeRaw) {
      const clean = String(codeRaw).toUpperCase().replace(/[^A-Z0-9]/g, '');
      return res.status(200).json({
        success: true,
        code: formatCode(clean),
        rawCode: clean,
        number: String(workerJson.number || number),
        botName: 'SIGMA MD'
      });
    }

    return res.status(workerRes.status >= 400 ? workerRes.status : 502).json({
      success: false,
      alreadyConnected: workerRes.status === 409,
      error: workerJson?.error || 'Default SIGMA MD worker could not generate pairing code.'
    });
  } catch (err: unknown) {
    return res.status(502).json({
      success: false,
      error: err instanceof Error ? err.message : 'Mini Bot pairing error.'
    });
  }
}
