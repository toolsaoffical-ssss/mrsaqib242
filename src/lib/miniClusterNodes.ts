export interface MiniClusterNode {
  id: string;
  name: string;
  short: string;
  url: string;
  type: 'Heroku';
  online: boolean;
  active: number;
  maxSessions: number;
  mem: number;
  ping: number | null;
  acceptingPairs?: boolean;
}

const RAW_MINI_NODE_ENTRIES: Array<{ id: string; label: string; url: string }> = [
  { id: 'm1', label: 'Mini-Primary', url: 'https://sigmaminibot-8fdafb0f00ef.herokuapp.com' },
  { id: 'm2', label: 'Mini-1', url: 'https://sigmamd1-e9ba2ddb7952.herokuapp.com' },
  { id: 'm3', label: 'Mini-2', url: 'https://sigmamd2-dac52d0ec315.herokuapp.com' },
  { id: 'm4', label: 'Mini-3', url: 'https://sigmamd3-742ea8059ac5.herokuapp.com' },
  { id: 'm5', label: 'Mini-4', url: 'https://sigmamd4-3210191dd5b7.herokuapp.com' },
  { id: 'm6', label: 'Mini-5', url: 'https://sigmamd5-eeb628662210.herokuapp.com' },
  { id: 'm7', label: 'Mini-6', url: 'https://sigmamd6-d1980316af94.herokuapp.com' },
  { id: 'm8', label: 'Mini-7', url: 'https://sigmamd7-ac6c1ce80134.herokuapp.com' },
  { id: 'm9', label: 'Mini-8', url: 'https://sigmamd8-5a26c622514b.herokuapp.com' },
  { id: 'm10', label: 'Mini-9', url: 'https://saqibmd9-ce63fbf0652a.herokuapp.com' },
  { id: 'm11', label: 'Mini-10', url: 'https://saqibmd10-576e7bfc2db7.herokuapp.com' },
  { id: 'm12', label: 'Mini-11', url: 'https://sigmamd11-da6327734ba1.herokuapp.com' },
  { id: 'm13', label: 'Mini-12', url: 'https://sihmdmd12-f8ea58cbb097.herokuapp.com' },
  { id: 'm14', label: 'Mini-13', url: 'https://sigmamd13-2486f545961f.herokuapp.com' },
  { id: 'm15', label: 'Mini-14', url: 'https://sigmmd14-8543a0648b86.herokuapp.com' },
  { id: 'm16', label: 'Mini-15', url: 'https://saqibmd15-628cabe638c0.herokuapp.com' },
  { id: 'm17', label: 'Mini-16', url: 'https://sigmamd16-c00d15ff8c04.herokuapp.com' },
  { id: 'm18', label: 'Mini-17', url: 'https://sigmamd17-84dcd8aa20f4.herokuapp.com' },
  { id: 'm19', label: 'Mini-18', url: 'https://sigmamd18-f07152e853b0.herokuapp.com' },
  { id: 'm20', label: 'Mini-19', url: 'https://sigmamd19-d0a4e0873c5a.herokuapp.com' },
  { id: 'm21', label: 'Mini-20', url: 'https://sigmamd20-a30563efa030.herokuapp.com' },
  { id: 'm22', label: 'Mini-21', url: 'https://sigmamd21-1624ab74c49d.herokuapp.com' },
  { id: 'm23', label: 'Mini-22', url: 'https://sigmamd22-06b51f5e22f3.herokuapp.com' },
  { id: 'm24', label: 'Mini-23', url: 'https://sigmamd23-a0cf0f49bfe6.herokuapp.com' },
  { id: 'm25', label: 'Mini-24', url: 'https://sigmamd24-df0e0cd41a90.herokuapp.com' },
  { id: 'm26', label: 'Mini-26', url: 'https://sigmamd26-8fbba774768e.herokuapp.com' },
  { id: 'm27', label: 'Mini-28', url: 'https://sigdmamd28-bfcf8eb47785.herokuapp.com' },
  { id: 'm28', label: 'Mini-29', url: 'https://sigmamd29-342173701de1.herokuapp.com' }
];

export const MINI_CLUSTER_CONFIG: Record<string, MiniClusterNode> = Object.fromEntries(
  RAW_MINI_NODE_ENTRIES.map((entry, idx) => [
    entry.id,
    {
      id: entry.id,
      name: `${entry.label} (Mini Server ${idx + 1})`,
      short: entry.label,
      url: entry.url,
      type: 'Heroku' as const,
      online: true,
      active: 0,
      maxSessions: 40,
      mem: 0,
      ping: null
    }
  ])
);

export const MINI_CLUSTER_URLS: string[] = RAW_MINI_NODE_ENTRIES.map((e) => e.url);

export function normalizeMiniNodeUrl(raw: unknown): string {
  return String(raw || '').trim().replace(/\/+$/, '');
}

const MINI_URL_SET = new Set(MINI_CLUSTER_URLS);

/** Strictly allowlists only configured Mini Bot worker URLs to prevent SSRF. */
export function resolveAllowedMiniNodeUrl(raw: unknown): string | null {
  const clean = normalizeMiniNodeUrl(raw);
  if (!clean) return null;
  if (MINI_URL_SET.has(clean)) return clean;
  const byId = MINI_CLUSTER_CONFIG[clean];
  return byId ? byId.url : null;
}
