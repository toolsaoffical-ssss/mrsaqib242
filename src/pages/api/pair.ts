import type { NextApiRequest, NextApiResponse } from 'next';

const CLUSTER_NODES = [
  'https://web-production-08da5300.up.railway.app',
  'https://saqib-bot-v1-d3ecc6f0292e.herokuapp.com',
  'https://saqib-bot-s2-1cceb03e9698.herokuapp.com',
  'https://saqibbot3-bb2b46aa1cb4.herokuapp.com',
  'https://saqibot4-1469f73b3d77.herokuapp.com',
  'https://saqibbot5-5ffa090fe31f.herokuapp.com',
  'https://saqibot6-061b6d17645d.herokuapp.com',
  'https://saqibot7-b9d00e67a587.herokuapp.com',
  'https://saqibbot8-f10fafc8b934.herokuapp.com',
  'https://saqibbot9-bebb531508e3.herokuapp.com',
  'https://saqibot10-d27e9f3ad01e.herokuapp.com',
  'https://saqibbot11-815563078799.herokuapp.com',
  'https://saqibbot12-2fb338ff529a.herokuapp.com',
  'https://saqibot13-392b066b37a5.herokuapp.com',
  'https://saqibbot14-d84e8d59500a.herokuapp.com',
  'https://saqibbot16-b071c813d801.herokuapp.com',
  'https://saqibot17-a471970ef223.herokuapp.com',
  'https://saqibbot18-45854000f60b.herokuapp.com',
  'https://saqibbot19-bb306a89a5f4.herokuapp.com',
  'https://saqibbot20-317bb68e4db0.herokuapp.com',
  'https://saqibbot22-9318c2de0250.herokuapp.com',
  'https://saqibot23-1f4bec48d0f2.herokuapp.com',
  'https://saqibbot25-46c4cf949a77.herokuapp.com',
  'https://saqibot25-0974df36edd8.herokuapp.com',
  'https://saqibot26-69a8011cc819.herokuapp.com',
  'https://saqibot27-1c1d295781fa.herokuapp.com',
  'https://saqibbot28-658e7de676c8.herokuapp.com'
];

function sanitizePhoneNumber(input: string): string {
  let cleaned = (input || '').replace(/[^0-9]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  // Pakistan standard 03xxxxxxxxx -> 923xxxxxxxxx
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '92' + cleaned.substring(1);
  }
  return cleaned;
}

function sanitizeCode(code?: string): string {
  const clean = (code || 'SAQ1BXMD').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return clean.length === 8 ? clean : 'SAQ1BXMD';
}

function formatCode(code: string): string {
  if (code.includes('-')) return code;
  const match = code.match(/.{1,4}/g);
  return match ? match.join('-') : code;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawNumber = (req.query.number || req.body?.number || '').toString();
  const rawCode = (req.query.code || req.body?.code || '').toString();
  const action = (req.query.action || req.body?.action || 'pair').toString().toLowerCase();
  const preferredNode = (req.query.node || req.body?.node || '').toString().trim();

  const number = sanitizePhoneNumber(rawNumber);

  if (!number || number.length < 10 || number.length > 15) {
    return res.status(400).json({
      success: false,
      error: 'Invalid phone number. Please enter a valid phone number with country code (e.g. +923478936242 or 03478936242).'
    });
  }

  // Dynamic Multi-Node Load Balancer (Randomized Round-Robin distribution)
  const availableNodes = preferredNode && CLUSTER_NODES.includes(preferredNode)
    ? [preferredNode, ...CLUSTER_NODES.filter(n => n !== preferredNode).sort(() => Math.random() - 0.5)]
    : [...CLUSTER_NODES].sort(() => Math.random() - 0.5);

  // Action: STATUS CHECK
  if (action === 'status') {
    for (const node of availableNodes) {
      try {
        const response = await fetch(`${node}/api/pair/status?number=${number}`, {
          signal: AbortSignal.timeout(6000)
        });
        if (response.ok) {
          const data = await response.json();
          return res.status(200).json({ ...data, clusterNode: node });
        }
      } catch (_) {
        // Continue to next node
      }
    }
    return res.status(200).json({ success: true, connected: false, number });
  }

  // Action: PAIR (GENERATE CODE)
  const customCode = sanitizeCode(rawCode);
  let lastError = 'Unable to reach bot cluster. Please try again in a few moments.';

  for (const node of availableNodes) {
    try {
      const targetUrl = `${node}/api/pair?number=${encodeURIComponent(number)}&code=${encodeURIComponent(customCode)}`;
      const response = await fetch(targetUrl, {
        signal: AbortSignal.timeout(18000)
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const errJson = JSON.parse(text);
          lastError = errJson.error || errJson.message || `Cluster node returned HTTP ${response.status}`;
        } catch {
          lastError = `Cluster node error: ${text.slice(0, 100)}`;
        }
        continue;
      }

      const data = await response.json();
      if (data && (data.success || data.code)) {
        const rawPairingCode = (data.code || customCode).toString().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const formattedPairingCode = formatCode(rawPairingCode);

        return res.status(200).json({
          success: true,
          code: formattedPairingCode,
          rawCode: rawPairingCode,
          number,
          isConnected: Boolean(data.isConnected),
          message: data.message || 'Pairing code generated successfully!',
          clusterNode: node
        });
      }
    } catch (err: any) {
      lastError = err.message || 'Connection timed out';
    }
  }

  return res.status(502).json({
    success: false,
    error: lastError,
    number
  });
}
