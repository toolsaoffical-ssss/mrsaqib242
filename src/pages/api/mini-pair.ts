import type { NextApiRequest, NextApiResponse } from 'next';
import {
  MINI_CLUSTER_CONFIG,
  MINI_CLUSTER_URLS,
  resolveAllowedMiniNodeUrl
} from '../../lib/miniClusterNodes';

const PORTAL_URL = (process.env.SIGMA_PORTAL_URL || 'https://sigmamini.vercel.app').trim().replace(/\/+$/, '');

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

function getConfiguredMiniNodes(): string[] {
  const envUrl = resolveAllowedMiniNodeUrl(process.env.SIGMA_MINI_WORKER_URL);
  const envList = String(process.env.MINI_CLUSTER_NODES || '')
    .split(/[\s,]+/)
    .map((u) => resolveAllowedMiniNodeUrl(u))
    .filter((u): u is string => Boolean(u));

  const combined = [...envList, ...(envUrl ? [envUrl] : []), ...MINI_CLUSTER_URLS];
  return Array.from(new Set(combined));
}

interface MiniHealthSnapshot {
  url: string;
  online: boolean;
  ping: number | null;
  active: number;
  maxSessions: number;
  mem: number;
  acceptingPairs: boolean;
}

async function probeMiniNodeHealth(url: string, timeoutMs = 4000): Promise<MiniHealthSnapshot> {
  const t0 = Date.now();
  try {
    const r = await fetch(`${url}/health`, {
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store'
    });
    const ping = Date.now() - t0;
    if (!r.ok) {
      return { url, online: false, ping: null, active: 0, maxSessions: 40, mem: 0, acceptingPairs: false };
    }
    const d = await r.json().catch(() => null);
    const active = typeof d?.activeSessions === 'number' ? d.activeSessions : Number(d?.pairedSessions || 0);
    const maxSessions = typeof d?.maxSessions === 'number' && d.maxSessions > 0 ? d.maxSessions : 40;
    const mem = typeof d?.ramUsageMb === 'number' ? d.ramUsageMb : Number(d?.memoryUsageMb || 0);
    const acceptingPairs =
      typeof d?.acceptingPairs === 'boolean'
        ? d.acceptingPairs
        : active < maxSessions && (mem === 0 || mem < 465);

    return { url, online: true, ping, active, maxSessions, mem, acceptingPairs };
  } catch {
    return { url, online: false, ping: null, active: 0, maxSessions: 40, mem: 0, acceptingPairs: false };
  }
}

async function checkStatusOnNode(nodeUrl: string, number: string, timeoutMs = 4500): Promise<string | null> {
  try {
    const stRes = await fetch(`${nodeUrl}/api/pair/status?number=${encodeURIComponent(number)}`, {
      signal: AbortSignal.timeout(timeoutMs),
      cache: 'no-store'
    });
    if (!stRes.ok) return null;
    const data = await stRes.json().catch(() => null);
    return data?.connected || data?.isConnected ? nodeUrl : null;
  } catch {
    return null;
  }
}

async function pairDirectOnMiniNode(
  workerUrl: string,
  number: string,
  refCode: string,
  force: boolean
): Promise<
  | { ok: true; code: string; rawCode: string; number: string; workerUrl: string }
  | { ok: false; status: number; alreadyConnected: boolean; error: string }
> {
  const targetUrl = `${workerUrl}/api/pair?number=${encodeURIComponent(number)}&defaultBot=1${
    refCode ? `&refq=${encodeURIComponent(refCode)}` : ''
  }${force ? '&force=true' : ''}`;

  const workerRes = await fetch(targetUrl, { signal: AbortSignal.timeout(18000), cache: 'no-store' });
  const workerJson = await workerRes.json().catch(() => null);
  const codeRaw = workerJson?.pairingCode || workerJson?.code || '';

  if (workerRes.ok && workerJson?.success && codeRaw) {
    const clean = String(codeRaw).toUpperCase().replace(/[^A-Z0-9]/g, '');
    return {
      ok: true,
      code: formatCode(clean),
      rawCode: clean,
      number: String(workerJson.number || number),
      workerUrl
    };
  }

  return {
    ok: false,
    status: workerRes.status >= 400 ? workerRes.status : 502,
    alreadyConnected: workerRes.status === 409,
    error: workerJson?.error || 'Default SIGMA MD worker could not generate pairing code.'
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = (req.query.action || req.body?.action || 'pair').toString().toLowerCase();

  // Action: CLUSTER HEALTH SNAPSHOT (probes all 28 Mini Bot servers server-side to bypass CORS)
  if (action === 'cluster') {
    const urls = getConfiguredMiniNodes();
    const results = await Promise.all(urls.map((u) => probeMiniNodeHealth(u, 4200)));
    const byUrl = new Map(results.map((r) => [r.url, r]));

    const nodes = Object.fromEntries(
      Object.entries(MINI_CLUSTER_CONFIG).map(([key, base]) => {
        const snap = byUrl.get(base.url);
        return [
          key,
          {
            ...base,
            online: snap ? snap.online : false,
            ping: snap ? snap.ping : null,
            active: snap ? snap.active : 0,
            maxSessions: snap ? snap.maxSessions : 40,
            mem: snap ? snap.mem : 0,
            acceptingPairs: snap ? snap.acceptingPairs : false
          }
        ];
      })
    );

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ success: true, totalNodes: Object.keys(nodes).length, nodes });
  }

  const rawNumber = (req.query.number || req.body?.number || req.body?.phone || '').toString();
  const number = sanitizePhoneNumber(rawNumber);

  if (!number || number.length < 10 || number.length > 15) {
    return res.status(400).json({
      success: false,
      error: 'Enter a valid WhatsApp number with country code (e.g. 923001234567).'
    });
  }

  const preferredNode = resolveAllowedMiniNodeUrl(req.query.node || req.body?.node);
  const allMiniNodes = getConfiguredMiniNodes();

  // Action: STATUS CHECK (checks dedicated node first, then fans out across all 28 Mini Bot servers)
  if (action === 'status') {
    if (preferredNode) {
      const hit = await checkStatusOnNode(preferredNode, number, 4000);
      if (hit) {
        return res.status(200).json({ success: true, connected: true, isConnected: true, number, clusterNode: hit });
      }
    }

    const candidates = preferredNode ? allMiniNodes.filter((u) => u !== preferredNode) : allMiniNodes;
    try {
      const checks = await Promise.all(candidates.map((u) => checkStatusOnNode(u, number, 4200)));
      const connectedNode = checks.find(Boolean) || null;
      if (connectedNode) {
        return res.status(200).json({
          success: true,
          connected: true,
          isConnected: true,
          number,
          clusterNode: connectedNode
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

  // If user explicitly picked a dedicated Mini Bot server, pair against it directly (and fail over if busy)
  if (preferredNode) {
    try {
      const directRes = await pairDirectOnMiniNode(preferredNode, number, refCode, force);
      if (directRes.ok) {
        return res.status(200).json({
          success: true,
          code: directRes.code,
          rawCode: directRes.rawCode,
          number: directRes.number,
          botName: 'SIGMA MD',
          clusterNode: directRes.workerUrl
        });
      }
      if (directRes.alreadyConnected || directRes.status === 400 || directRes.status === 429) {
        return res.status(directRes.status).json({
          success: false,
          alreadyConnected: directRes.alreadyConnected,
          error: directRes.error
        });
      }
    } catch {
      // Fall through to Portal / 28-node cluster fallback below
    }
  }

  // 1) Primary: route via SIGMA MINI Portal public pool (Default SIGMA MD + Supabase referral tracking across 28 workers)
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
      signal: AbortSignal.timeout(20000)
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
    // Fall back to direct 28-node smart cluster pairing below
  }

  // 2) Fallback: probe all 28 Mini Bot servers in parallel, sort by least load, and pair in strict Default SIGMA MD mode
  try {
    const healthSnapshots = await Promise.all(allMiniNodes.map((u) => probeMiniNodeHealth(u, 2800)));
    const onlineAccepting = healthSnapshots
      .filter((s) => s.online && s.acceptingPairs && s.url !== preferredNode)
      .sort((a, b) => (a.active - b.active) || (a.mem - b.mem));
    const onlineAny = healthSnapshots
      .filter((s) => s.online && s.url !== preferredNode)
      .sort((a, b) => (a.active - b.active) || (a.mem - b.mem));

    const candidates = Array.from(
      new Set([
        ...onlineAccepting.map((s) => s.url),
        ...onlineAny.map((s) => s.url),
        ...allMiniNodes.filter((u) => u !== preferredNode)
      ])
    ).slice(0, 6);

    let lastStatus = 502;
    let lastError = 'All 28 Mini Bot servers are currently busy. Please try again shortly.';

    for (const workerUrl of candidates) {
      try {
        const resPair = await pairDirectOnMiniNode(workerUrl, number, refCode, force);
        if (resPair.ok) {
          return res.status(200).json({
            success: true,
            code: resPair.code,
            rawCode: resPair.rawCode,
            number: resPair.number,
            botName: 'SIGMA MD',
            clusterNode: resPair.workerUrl
          });
        }
        lastStatus = resPair.status;
        lastError = resPair.error;
        if (resPair.alreadyConnected || resPair.status === 400 || resPair.status === 429) {
          return res.status(resPair.status).json({
            success: false,
            alreadyConnected: resPair.alreadyConnected,
            error: resPair.error
          });
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : lastError;
      }
    }

    return res.status(lastStatus).json({
      success: false,
      alreadyConnected: lastStatus === 409,
      error: lastError
    });
  } catch (err: unknown) {
    return res.status(502).json({
      success: false,
      error: err instanceof Error ? err.message : 'Mini Bot pairing error.'
    });
  }
}
