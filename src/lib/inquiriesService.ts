import { supabase, isSupabaseConfigured } from './supabase';

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  budget: string;
  timeline: string;
  subject?: string;
  message: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';
  priority: 'high' | 'medium' | 'normal';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export const DEFAULT_INQUIRIES: ClientInquiry[] = [
  {
    id: 'inq-101',
    name: 'Hamza Malik',
    email: 'hamza.malik@example.com',
    phone: '+92 300 1234567',
    service_type: 'E-Commerce Marketplace',
    budget: '$500 - $1000',
    timeline: '1-2 weeks',
    subject: 'Multi-vendor Online Store with JazzCash & Stripe',
    message: 'Hello Saqib! We want a modern full-stack e-commerce marketplace for clothing and fashion with user authentication, cart, admin inventory control, and payment gateway integration. Please share your availability and quote.',
    status: 'new',
    priority: 'high',
    admin_notes: 'Urgent project lead. Client requested quick turnaround.',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'inq-102',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techvision.io',
    phone: '+1 415 890 2311',
    service_type: 'AI-Powered Application',
    budget: '$1000+',
    timeline: 'Flexible',
    subject: 'AI Video Transcription & Summarizer Dashboard',
    message: 'Hi Muhammad Saqib, I loved your portfolio and AI tools. We need a custom web application powered by Gemini / OpenAI APIs for automated audio/video transcription and summarization with real-time export options.',
    status: 'in_progress',
    priority: 'high',
    admin_notes: 'Sent initial discovery questions via WhatsApp and Email.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'inq-103',
    name: 'Zubair Tariq',
    email: 'zubair.tariq@gmail.com',
    phone: '+92 321 9876543',
    service_type: 'Restaurant Web & QR System',
    budget: '$300 - $500',
    timeline: '3-5 days',
    subject: 'Restaurant Digital Menu & Online Orders',
    message: 'AOA Saqib bhai, seen your PNK Group project demo. I want a similar responsive digital menu with QR code scan and table reservation for our cafe in Lahore.',
    status: 'contacted',
    priority: 'medium',
    admin_notes: 'Discussed requirements on phone. Sent menu template samples.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString()
  },
  {
    id: 'inq-104',
    name: 'Bilal Ahmed',
    email: 'bilal.ahmed@corporate.com.pk',
    phone: '+92 333 4455667',
    service_type: 'Business Portfolio Website',
    budget: '$100 - $300',
    timeline: '1 week',
    subject: 'Modern Corporate Agency Landing Page',
    message: 'Looking for a sleek, fast, ultra-modern agency portfolio with smooth animations, dark mode, and SEO optimization.',
    status: 'completed',
    priority: 'normal',
    admin_notes: 'Project completed and delivered successfully. Client left 5-star review.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  }
];

const STORAGE_KEY = 'saqib_client_inquiries_cache';

function getLocalInquiries(): ClientInquiry[] {
  if (typeof window === 'undefined') return DEFAULT_INQUIRIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read cached inquiries', e);
  }
  return DEFAULT_INQUIRIES;
}

function setLocalInquiries(inquiries: ClientInquiry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new CustomEvent('inquiries-updated', { detail: inquiries }));
  } catch (e) {
    console.error('Failed to cache inquiries', e);
  }
}

/**
 * Fetch all client inquiries and details from Supabase with fallback to local storage
 */
export async function fetchInquiriesFromDB(): Promise<{
  inquiries: ClientInquiry[];
  fromDatabase: boolean;
  error?: string | null;
}> {
  const localData = getLocalInquiries();

  if (!isSupabaseConfigured()) {
    return { inquiries: localData, fromDatabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('client_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error for client_inquiries:', error.message);
      return {
        inquiries: localData,
        fromDatabase: false,
        error: error.message
      };
    }

    if (data && Array.isArray(data)) {
      if (data.length === 0) {
        // If table exists but is empty, try seeding defaults or return local
        return { inquiries: localData, fromDatabase: true };
      }
      setLocalInquiries(data as ClientInquiry[]);
      return { inquiries: data as ClientInquiry[], fromDatabase: true, error: null };
    }

    return { inquiries: localData, fromDatabase: false };
  } catch (err: any) {
    console.warn('Network error fetching inquiries:', err);
    return {
      inquiries: localData,
      fromDatabase: false,
      error: err.message || 'Network error'
    };
  }
}

let lastInquirySubmissionTime = 0;

/**
 * Submit a new project query / inquiry from client to Supabase & local storage
 */
export async function submitInquiryToDB(inquiry: Omit<ClientInquiry, 'id' | 'created_at' | 'status' | 'priority'> & {
  id?: string;
  status?: ClientInquiry['status'];
  priority?: ClientInquiry['priority'];
  honeypot?: string;
}): Promise<{
  success: boolean;
  data?: ClientInquiry;
  error?: string | null;
}> {
  // 🛡️ Layer 4 Security: Honeypot trap check for automated spam bots
  if (inquiry.honeypot && inquiry.honeypot.trim().length > 0) {
    return { success: true }; // Silently neutralize bot
  }

  // Rate-limiting shield against rapid-fire form flooding
  const nowMs = Date.now();
  if (nowMs - lastInquirySubmissionTime < 5000) {
    return {
      success: false,
      error: 'Please wait a few seconds before submitting another inquiry.'
    };
  }
  lastInquirySubmissionTime = nowMs;

  const newId = inquiry.id || `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const sanitize = (val: string | undefined, maxLen: number) => {
    if (!val || typeof val !== 'string') return '';
    return val
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .trim()
      .substring(0, maxLen);
  };

  const fullInquiry: ClientInquiry = {
    id: newId,
    name: sanitize(inquiry.name, 100),
    email: sanitize(inquiry.email, 150),
    phone: sanitize(inquiry.phone, 50),
    service_type: sanitize(inquiry.service_type || 'Custom Web Application', 100),
    budget: sanitize(inquiry.budget || 'Flexible', 50),
    timeline: sanitize(inquiry.timeline || 'Flexible', 50),
    subject: sanitize(inquiry.subject || `Inquiry for ${inquiry.service_type || 'Services'}`, 200),
    message: sanitize(inquiry.message, 3000),
    status: inquiry.status || 'new',
    priority: inquiry.priority || 'medium',
    admin_notes: sanitize(inquiry.admin_notes || '', 1000),
    created_at: now,
    updated_at: now
  };

  // 1. Immediately update local state so UI responds instantly
  const current = getLocalInquiries();
  const updated = [fullInquiry, ...current.filter(i => i.id !== newId)];
  setLocalInquiries(updated);

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('client_inquiries')
        .insert([fullInquiry])
        .select()
        .single();

      if (error) {
        console.warn('Could not insert inquiry to Supabase, stored locally:', error.message);
        return { success: true, data: fullInquiry, error: error.message };
      }

      return { success: true, data: (data as ClientInquiry) || fullInquiry, error: null };
    } catch (err: any) {
      console.warn('Network error saving inquiry to Supabase:', err);
      return { success: true, data: fullInquiry, error: err.message };
    }
  }

  return { success: true, data: fullInquiry, error: null };
}

/**
 * Update an inquiry's status, priority, or admin notes
 */
export async function updateInquiryInDB(
  id: string,
  updates: Partial<ClientInquiry>
): Promise<{ success: boolean; error?: string | null }> {
  const now = new Date().toISOString();
  const payload = { ...updates, updated_at: now };

  // Update local cache
  const current = getLocalInquiries();
  const updated = current.map(item => (item.id === id ? { ...item, ...payload } : item));
  setLocalInquiries(updated);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('client_inquiries')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete an inquiry
 */
export async function deleteInquiryFromDB(id: string): Promise<{ success: boolean; error?: string | null }> {
  // Update local cache
  const current = getLocalInquiries();
  const updated = current.filter(item => item.id !== id);
  setLocalInquiries(updated);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('client_inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Seed initial sample inquiries to Supabase
 */
export async function seedDefaultInquiriesToDB(): Promise<{ count: number; error?: string | null }> {
  if (!isSupabaseConfigured()) {
    return { count: 0, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('client_inquiries')
      .upsert(DEFAULT_INQUIRIES)
      .select();

    if (error) {
      return { count: 0, error: error.message };
    }
    return { count: data?.length || DEFAULT_INQUIRIES.length, error: null };
  } catch (err: any) {
    return { count: 0, error: err.message };
  }
}

/**
 * SQL Schema definition for the `client_inquiries` table
 */
export const CLIENT_INQUIRIES_SQL = `-- ==========================================================
-- SAQIB VISUALS: Client Inquiries & Queries Table
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.client_inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_type TEXT DEFAULT 'Custom Web Application',
    budget TEXT DEFAULT 'Flexible',
    timeline TEXT DEFAULT 'Flexible',
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'in_progress', 'completed', 'archived'
    priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'normal'
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.client_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public to submit inquiries (INSERT)
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.client_inquiries;
CREATE POLICY "Public can submit inquiries"
ON public.client_inquiries FOR INSERT
WITH CHECK (true);

-- Allow viewing and managing inquiries (Admin access)
DROP POLICY IF EXISTS "Public can view and manage inquiries" ON public.client_inquiries;
CREATE POLICY "Public can view and manage inquiries"
ON public.client_inquiries FOR ALL
USING (true)
WITH CHECK (true);

-- Index for fast sorting and status queries
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.client_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.client_inquiries(status);
`;
