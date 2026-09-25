import { supabase, isSupabaseConfigured } from './supabase';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  is_starting?: boolean;
  color: string;
  emoji: string;
  features: string[];
  recommended?: boolean;
  badge?: string;
  description: string;
  display_order?: number;
  is_active?: boolean;
  updated_at?: string;
}

export interface PricingAddOn {
  id: string;
  name: string;
  price: number;
  is_starting?: boolean;
  emoji: string;
  category: string;
  display_order?: number;
  is_active?: boolean;
  updated_at?: string;
}

export const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Starter',
    price: 19,
    color: 'from-emerald-500 to-green-600',
    emoji: '🟢',
    description: 'Perfect for clean, simple single-page landing presentations.',
    features: ['1 Landing Page', 'Mobile Responsive Design', 'Contact Form Integration', 'Fast Loading Times'],
    display_order: 1,
    is_active: true
  },
  {
    id: 'personal',
    name: 'Personal Website',
    price: 39,
    color: 'from-blue-500 to-indigo-600',
    emoji: '🔵',
    description: 'Ideal for blogs, personal portfolios, and individual projects.',
    features: ['Up to 5 Pages', 'Modern Cyber-Glass UI', 'WhatsApp Chat Integration', 'Basic Search Engine Optimization'],
    display_order: 2,
    is_active: true
  },
  {
    id: 'business',
    name: 'Business Website',
    price: 69,
    color: 'from-purple-500 to-violet-600',
    emoji: '🟣',
    description: 'Tailored for small to medium businesses wanting high web visibility.',
    features: ['Up to 10 Pages', 'Interactive Visual Gallery', 'Advanced Contact Forms', 'Google Maps Platform Integration', 'SEO Meta Optimization'],
    display_order: 3,
    is_active: true
  },
  {
    id: 'portfolio',
    name: 'Portfolio Pro',
    price: 99,
    color: 'from-yellow-500 to-amber-600',
    emoji: '🟡',
    description: 'Showcase your skills, works, and resume in premium high-fidelity style.',
    features: ['Premium Interactive Portfolio', 'Advanced Framer Motion Animations', 'Skills Showcase Grid', 'Active Projects Embed System', 'One-Click Resume Download'],
    display_order: 4,
    is_active: true
  },
  {
    id: 'company',
    name: 'Company Website',
    price: 149,
    color: 'from-orange-500 to-red-600',
    emoji: '🟠',
    description: 'Full corporate sites with scalable blogs and system management.',
    features: ['Unlimited Pages', 'Interactive Blog System', 'CMS Support Integration', 'Enterprise-Grade Security Headers', 'High Performance CDN Caching'],
    display_order: 5,
    is_active: true
  },
  {
    id: 'ecommerce-starter',
    name: 'E-Commerce Starter',
    price: 249,
    color: 'from-rose-500 to-pink-600',
    emoji: '🔴',
    description: 'Launch your online storefront with beautiful shop features.',
    features: ['Up to 50 Digital/Physical Products', 'Interactive Shopping Cart', 'Secure Seamless Checkout Flow', 'Local & Global Payment Gateways'],
    display_order: 6,
    is_active: true
  },
  {
    id: 'ecommerce-pro',
    name: 'E-Commerce Pro',
    price: 399,
    recommended: true,
    badge: 'POPULAR SELLER',
    color: 'from-cyan-400 via-indigo-500 to-purple-600',
    emoji: '💎',
    description: 'An advanced, high-velocity e-commerce portal with analytics.',
    features: ['Unlimited Products Storefront', 'User Accounts & Order History', 'Smart Coupons & Discount Engines', 'Saved Wishlist System', 'In-App Analytics & Sales Tracking'],
    display_order: 7,
    is_active: true
  },
  {
    id: 'custom-web',
    name: 'Custom Web Application',
    price: 699,
    color: 'from-teal-400 to-emerald-600',
    emoji: '🚀',
    description: 'A full-stack product with backend systems and database structures.',
    features: ['Secure User Login & Auth System', 'Dynamic Control Dashboard', 'Durable Persistent SQL/NoSQL Database', 'External Third-Party API Proxying', 'Rich Admin Control Panel'],
    display_order: 8,
    is_active: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Solution',
    price: 1199,
    color: 'from-amber-600 via-yellow-500 to-yellow-600',
    emoji: '👑',
    description: 'Sophisticated multi-role applications for companies and networks.',
    features: ['Multi-User Access & Role Scopes', 'Advanced Intrusion Audit Logging', 'Automated Reporting Engines', 'Scale-to-Zero High Available Database', 'Bespoke Custom Components'],
    display_order: 9,
    is_active: true
  },
  {
    id: 'ultimate',
    name: 'Ultimate Premium Package',
    price: 2499,
    is_starting: true,
    color: 'from-pink-500 via-purple-600 to-cyan-400',
    emoji: '🌟',
    description: 'The highest caliber AI-driven design system with priority lifetime care.',
    features: ['Everything Included', 'Generative Gemini AI Integration', 'Ultra Premium Hand-Crafted UI/UX', 'Dedicated Interactive Admin Console', 'Full Raw Source Code Handovers', 'Fast Container Deployment (Cloud Run)', '24/7 Priority VIP Developer Support'],
    display_order: 10,
    is_active: true
  }
];

export const DEFAULT_ADDONS: PricingAddOn[] = [
  { id: 'ai-bot', name: 'AI Chatbot Integration', price: 99, emoji: '🤖', category: 'Smart features', display_order: 1, is_active: true },
  { id: 'multi-lang', name: 'Multi-language Support', price: 59, emoji: '🌍', category: 'Reach', display_order: 2, is_active: true },
  { id: 'adv-seo', name: 'Advanced SEO Campaign', price: 149, emoji: '📈', category: 'Marketing', display_order: 3, is_active: true },
  { id: 'payment-gate', name: 'Stripe/PayPal Gateway', price: 99, emoji: '💳', category: 'Finance', display_order: 4, is_active: true },
  { id: 'android-app', name: 'Android Application Build', price: 699, is_starting: true, emoji: '📱', category: 'Mobile', display_order: 5, is_active: true },
  { id: 'ios-app', name: 'iOS Application Build', price: 899, is_starting: true, emoji: '🍎', category: 'Mobile', display_order: 6, is_active: true },
  { id: 'hosting', name: 'Domain & Hosting Setup', price: 49, emoji: '☁️', category: 'Infrastructure', display_order: 7, is_active: true },
  { id: 'sec-shield', name: 'Advanced Security Shield', price: 99, emoji: '🔒', category: 'Security', display_order: 8, is_active: true },
  { id: 'admin-dash', name: 'Interactive Admin Dashboard', price: 199, emoji: '📊', category: 'Control', display_order: 9, is_active: true },
  { id: 'priority-sup', name: 'Lifetime Priority Support', price: 299, emoji: '⚡', category: 'Support', display_order: 10, is_active: true }
];

const PLANS_STORAGE_KEY = 'saqib_pricing_plans_cache';
const ADDONS_STORAGE_KEY = 'saqib_pricing_addons_cache';

export const PRICING_SQL_QUERY = `-- ==========================================
-- SUPABASE SQL FOR WEBSITE PRICING & ADD-ONS
-- Run this in your Supabase SQL Editor:
-- ==========================================

-- 1. Create Pricing Plans Table
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    is_starting BOOLEAN DEFAULT false,
    color TEXT DEFAULT 'from-blue-500 to-indigo-600',
    emoji TEXT DEFAULT '💎',
    description TEXT DEFAULT '',
    features JSONB DEFAULT '[]'::jsonb,
    recommended BOOLEAN DEFAULT false,
    badge TEXT DEFAULT '',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Pricing Add-Ons Table
CREATE TABLE IF NOT EXISTS public.pricing_addons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    is_starting BOOLEAN DEFAULT false,
    emoji TEXT DEFAULT '⚡',
    category TEXT DEFAULT 'Features',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_addons ENABLE ROW LEVEL SECURITY;

-- 4. Clean up any existing policies
DROP POLICY IF EXISTS "Public can view pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Public can manage pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Public can view pricing addons" ON public.pricing_addons;
DROP POLICY IF EXISTS "Public can manage pricing addons" ON public.pricing_addons;

-- 5. Create Permissive Policies
CREATE POLICY "Public can view pricing plans" 
ON public.pricing_plans FOR SELECT USING (true);

CREATE POLICY "Public can manage pricing plans" 
ON public.pricing_plans FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can view pricing addons" 
ON public.pricing_addons FOR SELECT USING (true);

CREATE POLICY "Public can manage pricing addons" 
ON public.pricing_addons FOR ALL USING (true) WITH CHECK (true);

-- 6. Insert Default Website Plans
INSERT INTO public.pricing_plans (id, name, price, is_starting, color, emoji, description, features, recommended, badge, display_order, is_active)
VALUES
('basic', 'Basic Starter', 19, false, 'from-emerald-500 to-green-600', '🟢', 'Perfect for clean, simple single-page landing presentations.', '["1 Landing Page", "Mobile Responsive Design", "Contact Form Integration", "Fast Loading Times"]'::jsonb, false, '', 1, true),
('personal', 'Personal Website', 39, false, 'from-blue-500 to-indigo-600', '🔵', 'Ideal for blogs, personal portfolios, and individual projects.', '["Up to 5 Pages", "Modern Cyber-Glass UI", "WhatsApp Chat Integration", "Basic Search Engine Optimization"]'::jsonb, false, '', 2, true),
('business', 'Business Website', 69, false, 'from-purple-500 to-violet-600', '🟣', 'Tailored for small to medium businesses wanting high web visibility.', '["Up to 10 Pages", "Interactive Visual Gallery", "Advanced Contact Forms", "Google Maps Platform Integration", "SEO Meta Optimization"]'::jsonb, false, '', 3, true),
('portfolio', 'Portfolio Pro', 99, false, 'from-yellow-500 to-amber-600', '🟡', 'Showcase your skills, works, and resume in premium high-fidelity style.', '["Premium Interactive Portfolio", "Advanced Framer Motion Animations", "Skills Showcase Grid", "Active Projects Embed System", "One-Click Resume Download"]'::jsonb, false, '', 4, true),
('company', 'Company Website', 149, false, 'from-orange-500 to-red-600', '🟠', 'Full corporate sites with scalable blogs and system management.', '["Unlimited Pages", "Interactive Blog System", "CMS Support Integration", "Enterprise-Grade Security Headers", "High Performance CDN Caching"]'::jsonb, false, '', 5, true),
('ecommerce-starter', 'E-Commerce Starter', 249, false, 'from-rose-500 to-pink-600', '🔴', 'Launch your online storefront with beautiful shop features.', '["Up to 50 Digital/Physical Products", "Interactive Shopping Cart", "Secure Seamless Checkout Flow", "Local & Global Payment Gateways"]'::jsonb, false, '', 6, true),
('ecommerce-pro', 'E-Commerce Pro', 399, false, 'from-cyan-400 via-indigo-500 to-purple-600', '💎', 'An advanced, high-velocity e-commerce portal with analytics.', '["Unlimited Products Storefront", "User Accounts & Order History", "Smart Coupons & Discount Engines", "Saved Wishlist System", "In-App Analytics & Sales Tracking"]'::jsonb, true, 'POPULAR SELLER', 7, true),
('custom-web', 'Custom Web Application', 699, false, 'from-teal-400 to-emerald-600', '🚀', 'A full-stack product with backend systems and database structures.', '["Secure User Login & Auth System", "Dynamic Control Dashboard", "Durable Persistent SQL/NoSQL Database", "External Third-Party API Proxying", "Rich Admin Control Panel"]'::jsonb, false, '', 8, true),
('enterprise', 'Enterprise Solution', 1199, false, 'from-amber-600 via-yellow-500 to-yellow-600', '👑', 'Sophisticated multi-role applications for companies and networks.', '["Multi-User Access & Role Scopes", "Advanced Intrusion Audit Logging", "Automated Reporting Engines", "Scale-to-Zero High Available Database", "Bespoke Custom Components"]'::jsonb, false, '', 9, true),
('ultimate', 'Ultimate Premium Package', 2499, true, 'from-pink-500 via-purple-600 to-cyan-400', '🌟', 'The highest caliber AI-driven design system with priority lifetime care.', '["Everything Included", "Generative Gemini AI Integration", "Ultra Premium Hand-Crafted UI/UX", "Dedicated Interactive Admin Console", "Full Raw Source Code Handovers", "Fast Container Deployment (Cloud Run)", "24/7 Priority VIP Developer Support"]'::jsonb, false, '', 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  is_starting = EXCLUDED.is_starting,
  color = EXCLUDED.color,
  emoji = EXCLUDED.emoji,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  recommended = EXCLUDED.recommended,
  badge = EXCLUDED.badge,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 7. Insert Default Add-Ons
INSERT INTO public.pricing_addons (id, name, price, is_starting, emoji, category, display_order, is_active)
VALUES
('ai-bot', 'AI Chatbot Integration', 99, false, '🤖', 'Smart features', 1, true),
('multi-lang', 'Multi-language Support', 59, false, '🌍', 'Reach', 2, true),
('adv-seo', 'Advanced SEO Campaign', 149, false, '📈', 'Marketing', 3, true),
('payment-gate', 'Stripe/PayPal Gateway', 99, false, '💳', 'Finance', 4, true),
('android-app', 'Android Application Build', 699, true, '📱', 'Mobile', 5, true),
('ios-app', 'iOS Application Build', 899, true, '🍎', 'Mobile', 6, true),
('hosting', 'Domain & Hosting Setup', 49, false, '☁️', 'Infrastructure', 7, true),
('sec-shield', 'Advanced Security Shield', 99, false, '🔒', 'Security', 8, true),
('admin-dash', 'Interactive Admin Dashboard', 199, false, '📊', 'Control', 9, true),
('priority-sup', 'Lifetime Priority Support', 299, false, '⚡', 'Support', 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  is_starting = EXCLUDED.is_starting,
  emoji = EXCLUDED.emoji,
  category = EXCLUDED.category,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;
`;

// Helper to parse features from DB
const parseFeatures = (val: any): string[] => {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return val.split('\n').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
};

/**
 * Fetch Pricing Plans from DB with LocalStorage and Default Fallback
 */
export async function fetchPricingPlansFromDB(): Promise<{
  plans: PricingPlan[];
  fromDatabase: boolean;
  error?: any;
}> {
  let cached: PricingPlan[] = DEFAULT_PLANS;
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(PLANS_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cached = parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { plans: cached, fromDatabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase pricing_plans fetch error:', error.message);
      return { plans: cached, fromDatabase: false, error: error.message };
    }

    if (data && data.length > 0) {
      const mapped: PricingPlan[] = data.map((item: any) => ({
        id: item.id,
        name: item.name || 'Untitled Plan',
        price: Number(item.price) || 0,
        is_starting: Boolean(item.is_starting),
        color: item.color || 'from-blue-500 to-indigo-600',
        emoji: item.emoji || '💎',
        description: item.description || '',
        features: parseFeatures(item.features),
        recommended: Boolean(item.recommended),
        badge: item.badge || '',
        display_order: Number(item.display_order) ?? 1,
        is_active: item.is_active !== false,
        updated_at: item.updated_at
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(mapped));
      }
      return { plans: mapped, fromDatabase: true };
    }

    return { plans: cached, fromDatabase: false };
  } catch (err: any) {
    console.error('Exception in fetchPricingPlansFromDB:', err);
    return { plans: cached, fromDatabase: false, error: err.message };
  }
}

/**
 * Fetch Pricing Add-Ons from DB with LocalStorage and Default Fallback
 */
export async function fetchPricingAddOnsFromDB(): Promise<{
  addons: PricingAddOn[];
  fromDatabase: boolean;
  error?: any;
}> {
  let cached: PricingAddOn[] = DEFAULT_ADDONS;
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(ADDONS_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cached = parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { addons: cached, fromDatabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('pricing_addons')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase pricing_addons fetch error:', error.message);
      return { addons: cached, fromDatabase: false, error: error.message };
    }

    if (data && data.length > 0) {
      const mapped: PricingAddOn[] = data.map((item: any) => ({
        id: item.id,
        name: item.name || 'Untitled Addon',
        price: Number(item.price) || 0,
        is_starting: Boolean(item.is_starting),
        emoji: item.emoji || '⚡',
        category: item.category || 'Features',
        display_order: Number(item.display_order) ?? 1,
        is_active: item.is_active !== false,
        updated_at: item.updated_at
      }));

      if (typeof window !== 'undefined') {
        localStorage.setItem(ADDONS_STORAGE_KEY, JSON.stringify(mapped));
      }
      return { addons: mapped, fromDatabase: true };
    }

    return { addons: cached, fromDatabase: false };
  } catch (err: any) {
    console.error('Exception in fetchPricingAddOnsFromDB:', err);
    return { addons: cached, fromDatabase: false, error: err.message };
  }
}

/**
 * Save or update a single Pricing Plan
 */
export async function savePricingPlanToDB(
  plan: PricingPlan,
  allPlans: PricingPlan[]
): Promise<{ success: boolean; data?: PricingPlan; error?: string }> {
  const updatedPlan: PricingPlan = {
    ...plan,
    price: Number(plan.price) || 0,
    updated_at: new Date().toISOString()
  };

  // Update local cache & notify
  const nextList = allPlans.map(p => (p.id === plan.id ? updatedPlan : p));
  if (typeof window !== 'undefined') {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent('pricing-updated', { detail: { plans: nextList } }));
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true, data: updatedPlan };
  }

  try {
    const { error } = await supabase
      .from('pricing_plans')
      .upsert(
        {
          id: updatedPlan.id,
          name: updatedPlan.name,
          price: updatedPlan.price,
          is_starting: updatedPlan.is_starting ?? false,
          color: updatedPlan.color,
          emoji: updatedPlan.emoji,
          description: updatedPlan.description,
          features: updatedPlan.features,
          recommended: updatedPlan.recommended ?? false,
          badge: updatedPlan.badge || '',
          display_order: updatedPlan.display_order ?? 1,
          is_active: updatedPlan.is_active ?? true,
          updated_at: updatedPlan.updated_at
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Supabase pricing_plans upsert error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: updatedPlan };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Save or update a single Pricing Add-On
 */
export async function savePricingAddOnToDB(
  addon: PricingAddOn,
  allAddOns: PricingAddOn[]
): Promise<{ success: boolean; data?: PricingAddOn; error?: string }> {
  const updatedAddOn: PricingAddOn = {
    ...addon,
    price: Number(addon.price) || 0,
    updated_at: new Date().toISOString()
  };

  // Update local cache & notify
  const nextList = allAddOns.map(a => (a.id === addon.id ? updatedAddOn : a));
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADDONS_STORAGE_KEY, JSON.stringify(nextList));
    window.dispatchEvent(new CustomEvent('pricing-updated', { detail: { addons: nextList } }));
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true, data: updatedAddOn };
  }

  try {
    const { error } = await supabase
      .from('pricing_addons')
      .upsert(
        {
          id: updatedAddOn.id,
          name: updatedAddOn.name,
          price: updatedAddOn.price,
          is_starting: updatedAddOn.is_starting ?? false,
          emoji: updatedAddOn.emoji,
          category: updatedAddOn.category,
          display_order: updatedAddOn.display_order ?? 1,
          is_active: updatedAddOn.is_active ?? true,
          updated_at: updatedAddOn.updated_at
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Supabase pricing_addons upsert error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: updatedAddOn };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Delete a Pricing Plan
 */
export async function deletePricingPlanFromDB(id: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(PLANS_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local).filter((p: PricingPlan) => p.id !== id);
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(parsed));
        window.dispatchEvent(new CustomEvent('pricing-updated', { detail: { plans: parsed } }));
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('pricing_plans').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete a Pricing Add-On
 */
export async function deletePricingAddOnFromDB(id: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(ADDONS_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local).filter((a: PricingAddOn) => a.id !== id);
        localStorage.setItem(ADDONS_STORAGE_KEY, JSON.stringify(parsed));
        window.dispatchEvent(new CustomEvent('pricing-updated', { detail: { addons: parsed } }));
      }
    } catch {
      // ignore
    }
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('pricing_addons').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Reset all plans and add-ons to default presets
 */
export async function resetPricingToDefaults(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(DEFAULT_PLANS));
    localStorage.setItem(ADDONS_STORAGE_KEY, JSON.stringify(DEFAULT_ADDONS));
    window.dispatchEvent(new CustomEvent('pricing-updated', { detail: { plans: DEFAULT_PLANS, addons: DEFAULT_ADDONS } }));
  }
}
