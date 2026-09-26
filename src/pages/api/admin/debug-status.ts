import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminRecord } from '../../../lib/serverAdminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { record, fromDatabase, error } = await getAdminRecord();
    if (!record) {
      return res.status(200).json({ found: false, fromDatabase, error });
    }
    const { computeHash, safeCompare, verifyPassword } = await import('../../../lib/serverAdminAuth');
    const testHash = computeHash('Saqib@Visuals2026!', record.salt, 100000);
    const testCheck = verifyPassword('Saqib@Visuals2026!', record.salt, record.password_hash);

    return res.status(200).json({
      found: true,
      fromDatabase,
      id: record.id,
      username: record.username,
      salt: record.salt,
      saltLen: record.salt?.length,
      dbHashLen: record.password_hash?.length,
      testHashLen: testHash.length,
      hashesIdentical: testHash === record.password_hash,
      safeCompareResult: safeCompare(testHash, record.password_hash),
      testCheckMatch: testCheck.match,
      dbHashFirst10: record.password_hash?.slice(0, 10),
      dbHashLast10: record.password_hash?.slice(-10),
      testHashFirst10: testHash.slice(0, 10),
      testHashLast10: testHash.slice(-10)
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
