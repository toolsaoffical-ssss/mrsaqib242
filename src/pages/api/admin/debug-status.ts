import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminRecord } from '../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { record, fromDatabase, error } = await getAdminRecord();
    if (!record) {
      return res.status(200).json({ found: false, fromDatabase, error });
    }
    return res.status(200).json({
      found: true,
      fromDatabase,
      id: record.id,
      username: record.username,
      saltPrefix: record.salt ? record.salt.slice(0, 8) : null,
      hashPrefix: record.password_hash ? record.password_hash.slice(0, 8) : null,
      updated_at: record.updated_at
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
