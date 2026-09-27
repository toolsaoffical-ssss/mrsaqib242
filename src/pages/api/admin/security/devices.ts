import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  verifyAdminSessionWithDevice, 
  validateRequestOrigin, 
  assertUnrestrictedAdmin,
  generateSessionToken,
  setAdminSessionCookie,
  getAdminRecord
} from '../../../../lib/serverAdminAuth';
import {
  getSecurityOverview,
  approveDevice,
  blockDevice,
  trustDeviceWithMasterPassword,
  recoverDeviceAfter48h,
  generateEmergencyRecoveryCodes
} from '../../../../lib/deviceSecurityService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CSRF / Request Origin Validation
  if (req.method !== 'GET' && !validateRequestOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden: Request origin invalid.' });
  }

  // Session & Device Verification
  const auth = await verifyAdminSessionWithDevice(req);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Unauthorized: Valid admin session required.' });
  }

  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' 
    ? forwarded.split(',')[0].trim() 
    : req.socket.remoteAddress || '127.0.0.1';

  try {
    // -------------------------------------------------------------------------
    // GET: Retrieve Security Overview (Devices, Alerts, Active Device, Status)
    // Both restricted and unrestricted sessions are allowed to view this
    // -------------------------------------------------------------------------
    if (req.method === 'GET') {
      const overview = await getSecurityOverview(auth.deviceId);

      return res.status(200).json({
        success: true,
        is_restricted: auth.isRestricted,
        current_device_id: auth.deviceId,
        current_device_status: auth.deviceStatus || (auth.isRestricted ? 'pending_48h' : 'trusted'),
        current_client_ip: clientIp,
        remaining_restriction_seconds: auth.remainingRestrictionSeconds || 0,
        devices: overview.devices,
        alerts: overview.alerts,
        active_device: overview.activeDevice,
        recovery_codes_count: overview.recoveryCodesCount
      });
    }

    // -------------------------------------------------------------------------
    // POST: Execute Security & Device Management Operations
    // -------------------------------------------------------------------------
    if (req.method === 'POST') {
      const { action } = req.body || {};

      // 1. Direct Self-Approval / Trust Current Device from Admin UI
      // Allows administrator to immediately verify their own device using Master Password
      if (action === 'trust_current_device') {
        const { masterPassword } = req.body || {};
        if (!masterPassword) {
          return res.status(400).json({ error: 'Master Password or Backup Code is required to verify and trust this device.' });
        }

        if (!auth.deviceId) {
          return res.status(400).json({ error: 'No active device identified for this session.' });
        }

        let result;
        // If it looks like a backup code (SAQIB-XXX-XXX), try that first. Or just try it.
        if (masterPassword.startsWith('SAQIB-')) {
          result = await recoverDeviceAfter48h(auth.deviceId, masterPassword);
        } else {
          result = await trustDeviceWithMasterPassword(auth.deviceId, masterPassword);
        }

        if (!result.success) {
          return res.status(400).json({ error: result.message });
        }

        // Issue fresh unrestricted session token cookie!
        const { record } = await getAdminRecord();
        if (record) {
          const freshToken = generateSessionToken(record.username, record.session_secret, false, auth.deviceId);
          setAdminSessionCookie(res, freshToken);
        }

        return res.status(200).json({
          success: true,
          message: result.message,
          is_restricted: false,
          remaining_restriction_seconds: 0
        });
      }

      // 2. Travel-Friendly 48-Hour Elapsed Recovery
      if (action === 'recover_after_48h') {
        const { recoveryCode } = req.body || {};
        if (!recoveryCode) {
          return res.status(400).json({ error: 'Emergency Recovery Code or Master Password is required.' });
        }

        if (!auth.deviceId) {
          return res.status(400).json({ error: 'No active device ID found.' });
        }

        const recovery = await recoverDeviceAfter48h(auth.deviceId, recoveryCode);
        if (!recovery.success) {
          return res.status(400).json({ error: recovery.message });
        }

        // Issue fresh unrestricted session cookie
        const { record } = await getAdminRecord();
        if (record) {
          const freshToken = generateSessionToken(record.username, record.session_secret, false, auth.deviceId);
          setAdminSessionCookie(res, freshToken);
        }

        return res.status(200).json({
          success: true,
          message: recovery.message,
          is_restricted: false
        });
      }

      // 3. Approve another device (Requires unrestricted admin or master password)
      if (action === 'approve_device') {
        const { targetDeviceId, verifyPassword } = req.body || {};
        if (!targetDeviceId) {
          return res.status(400).json({ error: 'Target Device ID is required.' });
        }

        // If current session is restricted, must supply master password to authorize approval
        if (auth.isRestricted) {
          if (!verifyPassword) {
            return res.status(403).json({
              error: 'Restricted Session: Master Password verification is required to approve devices while in restricted mode.'
            });
          }
          const check = await trustDeviceWithMasterPassword(targetDeviceId, verifyPassword);
          if (!check.success) {
            return res.status(400).json({ error: check.message });
          }
          return res.status(200).json({ success: true, message: check.message });
        }

        // Unrestricted admin approving device
        const approved = await approveDevice(targetDeviceId, `admin_${auth.username || 'trusted'}`);
        if (!approved) {
          return res.status(500).json({ error: 'Failed to approve device in database.' });
        }

        return res.status(200).json({
          success: true,
          message: `Device ${targetDeviceId} has been approved as trusted.`
        });
      }

      // 4. Block a device (Immediately revokes access)
      if (action === 'block_device') {
        const { targetDeviceId } = req.body || {};
        if (!targetDeviceId) {
          return res.status(400).json({ error: 'Target Device ID is required.' });
        }

        // Cannot let a restricted session block the current or other devices without master authentication
        if (auth.isRestricted) {
          return res.status(403).json({
            error: 'Restricted Session: Blocking devices is locked during 48-hour restriction.'
          });
        }

        const blocked = await blockDevice(targetDeviceId);
        if (!blocked) {
          return res.status(500).json({ error: 'Failed to block device in database.' });
        }

        return res.status(200).json({
          success: true,
          message: `Device ${targetDeviceId} has been blocked and access revoked.`
        });
      }

      // 5. Generate Emergency Travel Recovery Codes
      // Restricted sessions cannot generate recovery codes (requires unrestricted session)
      if (action === 'generate_recovery_codes') {
        if (!assertUnrestrictedAdmin(auth, res)) return;

        const codes = await generateEmergencyRecoveryCodes();
        return res.status(200).json({
          success: true,
          codes,
          message: 'Generated 6 Emergency Travel Recovery Codes. Store these safely offline before traveling.'
        });
      }

      return res.status(400).json({ error: 'Unrecognized security action.' });
    }

    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (err: any) {
    console.error('Security API error:', err);
    return res.status(500).json({ error: err.message || 'Internal security server error.' });
  }
}
