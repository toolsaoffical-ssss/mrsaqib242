import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, isSupabaseAdminConfigured } from '../../lib/supabaseServer';

// Server-side rate limiting per IP
const rateLimitMap = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isSupabaseAdminConfigured()) {
    return res.status(500).json({ error: 'Service unavailable' });
  }

  // 1. Server-side IP-based rate limiting (5 seconds per IP)
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const lastSubmit = rateLimitMap.get(clientIp) || 0;

  if (now - lastSubmit < 5000) {
    return res.status(429).json({ error: 'Please wait a few seconds before submitting again.' });
  }
  rateLimitMap.set(clientIp, now);

  // 2. Extract and validate body
  const { name, email, phone, service_type, budget, timeline, subject, message, honeypot,
    custom_budget_amount, custom_features, reference_links, custom_timeline_date } = req.body;

  // 3. Honeypot check (silent kill)
  if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
    return res.status(200).json({ success: true, data: { id: 'fake_' + Date.now() } });
  }

  // 4. Basic validation
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 1) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 5. Sanitize all inputs
  const sanitize = (val: string | undefined, maxLen: number): string => {
    if (!val || typeof val !== 'string') return '';
    return val.replace(/<[^>]*>?/gm, '').trim().substring(0, maxLen);
  };

  const newId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowIso = new Date().toISOString();

  const inquiry = {
    id: newId,
    name: sanitize(name, 100),
    email: sanitize(email, 150) || 'contact@client.com',
    phone: sanitize(phone, 50),
    service_type: sanitize(service_type || 'Custom Web Application', 100),
    budget: sanitize(budget || 'Flexible', 50),
    timeline: sanitize(timeline || 'Flexible', 50),
    subject: sanitize(subject || `Inquiry for ${service_type || 'Services'}`, 200),
    message: sanitize(message, 3000),
    status: 'new',
    priority: 'high',
    admin_notes: '',
    custom_budget_amount: sanitize(custom_budget_amount, 200),
    custom_features: sanitize(custom_features, 2000),
    reference_links: sanitize(reference_links, 500),
    custom_timeline_date: sanitize(custom_timeline_date, 50),
    created_at: nowIso,
    updated_at: nowIso
  };

  try {
    const { data, error } = await supabaseAdmin
      .from('client_inquiries')
      .insert([inquiry])
      .select()
      .single();

    if (error) {
      console.error('Contact form DB error:', error);
      return res.status(500).json({ error: 'Failed to save inquiry' });
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Contact form server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
