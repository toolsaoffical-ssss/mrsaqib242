import { supabase, isSupabaseConfigured } from './supabase';

export interface ToolCategory {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name or emoji
  emoji?: string;
  color: string; // Tailwind gradient or color
  description?: string;
  display_order: number;
  is_active: boolean;
  updated_at?: string;
}

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category_id: string;
  category_name: string;
  icon: string; // Lucide icon name, emoji, or icon keyword
  logo_url?: string; // Custom Logo Image URL or Cropped Base64 Data URL
  badge?: string; // e.g. 'AI 99%', 'POPULAR', 'HOT', 'FREE', 'VIP', 'NEW'
  gradient: string;
  action_type: 'external_url' | 'internal_route' | 'modal_action';
  modal_target?: 'website_plans' | 'hacks' | 'source_code' | 'free_courses';
  display_order: number;
  is_active: boolean;
  is_featured?: boolean;
  updated_at?: string;
}

export interface ToolPageSettings {
  id: string;
  page_title: string;
  page_subtitle: string;
  badge_text: string;
  announcement_text: string;
  show_announcement: boolean;
  featured_section_title: string;
  show_featured_section: boolean;
  default_view_mode: 'grid' | 'compact';
  show_categories_count: boolean;
  enable_favorites: boolean;
  enable_copy_link: boolean;
  cta_banner_title: string;
  cta_banner_subtitle: string;
  cta_banner_button_text: string;
  cta_banner_action_type: 'modal' | 'url';
  cta_banner_target: string;
  show_cta_banner: boolean;
  quick_stat_1_val: string;
  quick_stat_1_label: string;
  quick_stat_2_val: string;
  quick_stat_2_label: string;
  quick_stat_3_val: string;
  quick_stat_3_label: string;
  updated_at?: string;
}

export const DEFAULT_TOOL_PAGE_SETTINGS: ToolPageSettings = {
  id: 'default',
  page_title: 'Explore All Tools & Utilities',
  page_subtitle: 'Instant access to AI predictors, developer portals, free coding repos, modded APKs, and custom web utilities.',
  badge_text: 'Dynamic Tools Engine',
  announcement_text: '🔥 Live Update: New AI predictors, free source repos & web utilities updated today!',
  show_announcement: true,
  featured_section_title: 'Featured & Staff Picks',
  show_featured_section: true,
  default_view_mode: 'grid',
  show_categories_count: true,
  enable_favorites: true,
  enable_copy_link: true,
  cta_banner_title: 'Need a bespoke custom tool or API?',
  cta_banner_subtitle: 'Request custom automation, calculators, scrapers, or AI apps built specifically for you.',
  cta_banner_button_text: 'Explore Plans',
  cta_banner_action_type: 'modal',
  cta_banner_target: 'website_plans',
  show_cta_banner: true,
  quick_stat_1_val: '15+',
  quick_stat_1_label: 'Verified Tools',
  quick_stat_2_val: '100%',
  quick_stat_2_label: 'Free & Safe',
  quick_stat_3_val: '24/7',
  quick_stat_3_label: 'Cloud Active'
};

export const DEFAULT_TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'ai-predictors',
    name: 'AI & Predictors',
    slug: 'ai-predictors',
    icon: 'Sparkles',
    emoji: '🔮',
    color: 'from-purple-500 via-indigo-500 to-pink-500',
    description: 'Smart AI algorithms, video generators, and predictive models.',
    display_order: 1,
    is_active: true
  },
  {
    id: 'developer-tools',
    name: 'Developer Tools',
    slug: 'developer-tools',
    icon: 'Code',
    emoji: '💻',
    color: 'from-blue-600 via-indigo-600 to-cyan-500',
    description: 'APIs, web tool generators, developer consoles, and repositories.',
    display_order: 2,
    is_active: true
  },
  {
    id: 'downloads-apks',
    name: 'Downloads & APKs',
    slug: 'downloads-apks',
    icon: 'Download',
    emoji: '📥',
    color: 'from-emerald-500 via-teal-500 to-green-600',
    description: 'Verified mobile APKs, utility packages, and clean downloads.',
    display_order: 3,
    is_active: true
  },
  {
    id: 'gaming-tools',
    name: 'Gaming & Fun',
    slug: 'gaming-tools',
    icon: 'Gamepad2',
    emoji: '🎮',
    color: 'from-red-500 via-rose-500 to-orange-500',
    description: 'Gaming utilities, FreeFire mod setups, and gaming shortcuts.',
    display_order: 4,
    is_active: true
  },
  {
    id: 'education-courses',
    name: 'Education & Courses',
    slug: 'education-courses',
    icon: 'BookOpen',
    emoji: '📚',
    color: 'from-amber-500 via-orange-500 to-yellow-500',
    description: 'Free development courses, tutorials, and masterclasses.',
    display_order: 5,
    is_active: true
  },
  {
    id: 'web-builders',
    name: 'Web & Hosting',
    slug: 'web-builders',
    icon: 'Globe',
    emoji: '🌐',
    color: 'from-cyan-500 via-blue-500 to-teal-500',
    description: 'Build your website, register platforms, and launch pages.',
    display_order: 6,
    is_active: true
  },
  {
    id: 'services-plans',
    name: 'Services & Plans',
    slug: 'services-plans',
    icon: 'DollarSign',
    emoji: '💎',
    color: 'from-violet-600 via-purple-600 to-indigo-600',
    description: 'Custom client development plans, pricing, and system builds.',
    display_order: 7,
    is_active: true
  },
  {
    id: 'community-channels',
    name: 'Community & VIP',
    slug: 'community-channels',
    icon: 'MessageSquare',
    emoji: '💬',
    color: 'from-emerald-500 to-green-500',
    description: 'Direct VIP WhatsApp channels, alerts, and community links.',
    display_order: 8,
    is_active: true
  }
];

export const DEFAULT_TOOLS: ToolItem[] = [
  {
    id: 'pricing-plans',
    title: 'Pricing & Packages',
    description: 'Explore web development packages, pricing tiers, and custom quotes.',
    url: '#website-plans',
    category_id: 'services-plans',
    category_name: 'Services & Plans',
    icon: 'DollarSign',
    badge: 'POPULAR',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
    action_type: 'modal_action',
    modal_target: 'website_plans',
    display_order: 1,
    is_active: true,
    is_featured: true
  },
  {
    id: 'whatsapp-channel',
    title: 'VIP WhatsApp Channel',
    description: 'Join Saqib official WhatsApp channel for instant drops and updates.',
    url: 'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I',
    category_id: 'community-channels',
    category_name: 'Community & VIP',
    icon: 'MessageSquare',
    badge: 'ACTIVE',
    gradient: 'from-[#25D366] to-[#128C7E]',
    action_type: 'external_url',
    display_order: 3,
    is_active: true,
    is_featured: true
  },
  {
    id: 'explore-hacks',
    title: 'Explore Dev Hacks',
    description: 'Curated developer tricks, coding shortcuts, and productivity tips.',
    url: '#hacks',
    category_id: 'developer-tools',
    category_name: 'Developer Tools',
    icon: 'Zap',
    badge: 'HOT',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    action_type: 'modal_action',
    modal_target: 'hacks',
    display_order: 4,
    is_active: true
  },
  {
    id: 'saqib-api',
    title: 'Saqib API Services',
    description: 'High-performance cloud endpoints and programmatic REST APIs.',
    url: 'https://apisaqib.vercel.app',
    category_id: 'developer-tools',
    category_name: 'Developer Tools',
    icon: 'Globe',
    badge: 'FAST',
    gradient: 'from-blue-600 to-indigo-600',
    action_type: 'external_url',
    display_order: 5,
    is_active: true
  },
  {
    id: 'make-own-tools',
    title: 'Make Your Own Tools',
    description: 'Interactive builder to craft web utilities and tool pages without code.',
    url: 'https://protool.zone.id',
    category_id: 'developer-tools',
    category_name: 'Developer Tools',
    icon: 'Wrench',
    badge: 'CREATOR',
    gradient: 'from-emerald-600 to-green-600',
    action_type: 'external_url',
    display_order: 6,
    is_active: true
  },
  {
    id: 'own-web-builder',
    title: 'Own Web Builder',
    description: 'Launch websites and custom domains easily with instant cloud setup.',
    url: 'https://ownweb-theta.vercel.app/',
    category_id: 'web-builders',
    category_name: 'Web & Hosting',
    icon: 'Globe',
    badge: 'PRO',
    gradient: 'from-blue-500 to-cyan-400',
    action_type: 'external_url',
    display_order: 7,
    is_active: true
  },
  {
    id: 'mod-apks',
    title: 'Modded APKs & Tools',
    description: 'Explore top modified Android applications, utility apps, and tools.',
    url: 'https://liteapks.com/',
    category_id: 'downloads-apks',
    category_name: 'Downloads & APKs',
    icon: 'Download',
    badge: 'FREE',
    gradient: 'from-blue-500 to-cyan-400',
    action_type: 'external_url',
    display_order: 8,
    is_active: true
  },
  {
    id: 'source-code-vault',
    title: 'Source Code Vault',
    description: 'Free open-source codebases, React templates, and Next.js repositories.',
    url: '#source-code',
    category_id: 'developer-tools',
    category_name: 'Developer Tools',
    icon: 'Code',
    badge: 'REPOS',
    gradient: 'from-purple-600 to-pink-600',
    action_type: 'modal_action',
    modal_target: 'source_code',
    display_order: 9,
    is_active: true
  },
  {
    id: 'free-courses-hub',
    title: 'Free Courses Hub',
    description: 'Comprehensive software development, coding, and design courses.',
    url: '#free-courses',
    category_id: 'education-courses',
    category_name: 'Education & Courses',
    icon: 'BookOpen',
    badge: 'FREE',
    gradient: 'from-orange-500 to-amber-500',
    action_type: 'modal_action',
    modal_target: 'free_courses',
    display_order: 10,
    is_active: true
  },
  {
    id: 'wingo-predictor',
    title: 'Wingo AI Predictor',
    description: 'AI statistical predictor model with live trend analysis engine.',
    url: 'https://wingoaisite.com/wingo-prediction/',
    category_id: 'ai-predictors',
    category_name: 'AI & Predictors',
    icon: 'Sparkles',
    badge: 'AI 99%',
    gradient: 'from-[#ff007f] via-[#7f00ff] to-[#00f0ff]',
    action_type: 'external_url',
    display_order: 11,
    is_active: true
  },
  {
    id: 'aviator-predictor',
    title: 'Aviator AI Predictor',
    description: 'Smart probability & flight multiplier analytics engine.',
    url: 'https://theresanaiforthat.com/@puncvachongtham/aviator-predictor/',
    category_id: 'ai-predictors',
    category_name: 'AI & Predictors',
    icon: 'Plane',
    badge: 'TRENDING',
    gradient: 'from-[#ff3131] via-[#ff0055] to-[#800080]',
    action_type: 'external_url',
    display_order: 12,
    is_active: true
  },
  {
    id: 'h4k3r-ai-video',
    title: 'H4K3R AI Video Gen',
    description: 'Generate high-octane AI video animations, edits, and cyber visual clips.',
    url: 'https://h4k3r-ai.vercel.app/',
    category_id: 'ai-predictors',
    category_name: 'AI & Predictors',
    icon: 'Video',
    badge: 'AI GEN',
    gradient: 'from-[#00ff66] via-[#00e5ff] to-[#7f00ff]',
    action_type: 'external_url',
    display_order: 13,
    is_active: true
  },
  {
    id: 'qwen-ai-video',
    title: 'Qwen AI Video Studio',
    description: 'Next-generation AI video synthesis platform powered by Qwen.',
    url: 'https://qwen.ai/',
    category_id: 'ai-predictors',
    category_name: 'AI & Predictors',
    icon: 'Film',
    badge: 'HD',
    gradient: 'from-[#ff9900] via-[#ff5500] to-[#ff0055]',
    action_type: 'external_url',
    display_order: 14,
    is_active: true
  },
  {
    id: 'freefire-tool',
    title: 'FreeFire Pro Tool',
    description: 'Sensitivity optimizers, game configs, and custom layout utilities.',
    url: 'https://pbxofficial.zone.id/',
    category_id: 'gaming-tools',
    category_name: 'Gaming & Fun',
    icon: 'Gamepad2',
    badge: 'VIP',
    gradient: 'from-[#f12711] via-[#f5af19] to-[#ff4b2b]',
    action_type: 'external_url',
    display_order: 15,
    is_active: true
  }
];

const LOCAL_STORAGE_TOOLS_KEY = 'saqib_tools_data_v1';
const LOCAL_STORAGE_CATEGORIES_KEY = 'saqib_tool_categories_data_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'saqib_tool_page_settings_v1';

// Helper to get local cache
function getLocalTools(): ToolItem[] {
  if (typeof window === 'undefined') return DEFAULT_TOOLS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TOOLS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read local tools:', err);
  }
  return DEFAULT_TOOLS;
}

function setLocalTools(tools: ToolItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_TOOLS_KEY, JSON.stringify(tools));
  } catch (err) {
    console.warn('Failed to write local tools:', err);
  }
}

function getLocalCategories(): ToolCategory[] {
  if (typeof window === 'undefined') return DEFAULT_TOOL_CATEGORIES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to read local categories:', err);
  }
  return DEFAULT_TOOL_CATEGORIES;
}

function setLocalCategories(categories: ToolCategory[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.warn('Failed to write local categories:', err);
  }
}

function getLocalPageSettings(): ToolPageSettings {
  if (typeof window === 'undefined') return DEFAULT_TOOL_PAGE_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_TOOL_PAGE_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Failed to read local tool settings:', err);
  }
  return DEFAULT_TOOL_PAGE_SETTINGS;
}

function setLocalPageSettings(settings: ToolPageSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to write local tool settings:', err);
  }
}

/**
 * Fetch page settings from Supabase (with localStorage fallback)
 */
export async function fetchToolPageSettingsFromDB(): Promise<{
  settings: ToolPageSettings;
  fromDatabase: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { settings: getLocalPageSettings(), fromDatabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('tool_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error) {
      // Table may not exist yet, return local cache
      return {
        settings: getLocalPageSettings(),
        fromDatabase: false,
        error: error.message
      };
    }

    if (data) {
      const merged: ToolPageSettings = { ...DEFAULT_TOOL_PAGE_SETTINGS, ...data };
      setLocalPageSettings(merged);
      return { settings: merged, fromDatabase: true };
    }

    return { settings: getLocalPageSettings(), fromDatabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { settings: getLocalPageSettings(), fromDatabase: false, error: msg };
  }
}

/**
 * Save page settings to Supabase (with localStorage fallback)
 */
export async function saveToolPageSettingsToDB(
  settings: ToolPageSettings
): Promise<{ success: boolean; error?: string }> {
  setLocalPageSettings(settings);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('tool_settings')
      .upsert({
        ...settings,
        id: 'default',
        updated_at: new Date().toISOString()
      });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Reset page settings to initial default configuration
 */
export async function resetToolPageSettingsToDefaults(): Promise<{ success: boolean; error?: string }> {
  setLocalPageSettings(DEFAULT_TOOL_PAGE_SETTINGS);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    await supabase.from('tool_settings').upsert({
      ...DEFAULT_TOOL_PAGE_SETTINGS,
      id: 'default',
      updated_at: new Date().toISOString()
    });
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Fetch all tool categories from Supabase (with localStorage fallback)
 */
export async function fetchToolCategoriesFromDB(): Promise<{
  categories: ToolCategory[];
  fromDatabase: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { categories: getLocalCategories(), fromDatabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('tool_categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase categories fetch error:', error.message);
      return {
        categories: getLocalCategories(),
        fromDatabase: false,
        error: error.message
      };
    }

    if (data && data.length > 0) {
      setLocalCategories(data as ToolCategory[]);
      return { categories: data as ToolCategory[], fromDatabase: true };
    }

    // Table exists but empty, return defaults
    return { categories: getLocalCategories(), fromDatabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { categories: getLocalCategories(), fromDatabase: false, error: msg };
  }
}

/**
 * Fetch all tools from Supabase (with localStorage fallback)
 */
export async function fetchToolsFromDB(): Promise<{
  tools: ToolItem[];
  fromDatabase: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { tools: getLocalTools(), fromDatabase: false };
  }

  try {
    const { data, error } = await supabase
      .from('tools')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase tools fetch error:', error.message);
      return {
        tools: getLocalTools(),
        fromDatabase: false,
        error: error.message
      };
    }

    if (data && data.length > 0) {
      setLocalTools(data as ToolItem[]);
      return { tools: data as ToolItem[], fromDatabase: true };
    }

    return { tools: getLocalTools(), fromDatabase: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { tools: getLocalTools(), fromDatabase: false, error: msg };
  }
}

/**
 * Create or update a tool category
 */
export async function saveToolCategoryToDB(
  category: ToolCategory,
  currentList: ToolCategory[]
): Promise<{ success: boolean; error?: string }> {
  // Always update local cache immediately
  const exists = currentList.some(c => c.id === category.id);
  const updatedList = exists
    ? currentList.map(c => (c.id === category.id ? category : c))
    : [...currentList, category];
  setLocalCategories(updatedList);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('tool_categories')
      .upsert({
        ...category,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Delete a category
 */
export async function deleteToolCategoryFromDB(
  id: string,
  currentList: ToolCategory[]
): Promise<{ success: boolean; error?: string }> {
  const updatedList = currentList.filter(c => c.id !== id);
  setLocalCategories(updatedList);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('tool_categories')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Create or update a tool item
 */
export async function saveToolItemToDB(
  tool: ToolItem,
  currentList: ToolItem[]
): Promise<{ success: boolean; error?: string }> {
  const exists = currentList.some(t => t.id === tool.id);
  const updatedList = exists
    ? currentList.map(t => (t.id === tool.id ? tool : t))
    : [...currentList, tool];
  setLocalTools(updatedList);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('tools')
      .upsert({
        ...tool,
        updated_at: new Date().toISOString()
      });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Delete a tool item
 */
export async function deleteToolItemFromDB(
  id: string,
  currentList: ToolItem[]
): Promise<{ success: boolean; error?: string }> {
  const updatedList = currentList.filter(t => t.id !== id);
  setLocalTools(updatedList);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Reset tools and categories to initial default state
 */
export async function resetToolsToDefaults(): Promise<{ success: boolean; error?: string }> {
  setLocalCategories(DEFAULT_TOOL_CATEGORIES);
  setLocalTools(DEFAULT_TOOLS);

  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    // Attempt to upsert default categories
    await supabase.from('tool_categories').upsert(DEFAULT_TOOL_CATEGORIES);
    // Attempt to upsert default tools
    await supabase.from('tools').upsert(DEFAULT_TOOLS);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Generates the complete, production-ready Supabase SQL script
 * that sets up the tables, policies, and initial seeded data.
 */
export function generateToolsSQLQuery(): string {
  return `-- ==========================================================
-- 🛠️ SUPABASE SQL SETUP FOR TOOLS, CATEGORIES & PAGE SETTINGS
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ==========================================================

-- 1. Create tool_categories table
CREATE TABLE IF NOT EXISTS public.tool_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT DEFAULT 'Sparkles',
    emoji TEXT DEFAULT '🔮',
    color TEXT DEFAULT 'from-purple-500 to-pink-500',
    description TEXT,
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create tools table
CREATE TABLE IF NOT EXISTS public.tools (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    category_id TEXT REFERENCES public.tool_categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL,
    icon TEXT DEFAULT 'Wrench',
    badge TEXT DEFAULT '',
    gradient TEXT DEFAULT 'from-blue-600 to-indigo-600',
    action_type TEXT DEFAULT 'external_url',
    modal_target TEXT DEFAULT '',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create tool_settings table (Full Admin Control over Tools Page)
CREATE TABLE IF NOT EXISTS public.tool_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    page_title TEXT DEFAULT 'Explore All Tools & Utilities',
    page_subtitle TEXT DEFAULT 'Instant access to AI predictors, developer portals, free coding repos, modded APKs, and custom web utilities.',
    badge_text TEXT DEFAULT 'Dynamic Tools Engine',
    announcement_text TEXT DEFAULT '🔥 Live Update: New AI predictors, free source repos & web utilities updated today!',
    show_announcement BOOLEAN DEFAULT true,
    featured_section_title TEXT DEFAULT 'Featured & Staff Picks',
    show_featured_section BOOLEAN DEFAULT true,
    default_view_mode TEXT DEFAULT 'grid',
    show_categories_count BOOLEAN DEFAULT true,
    enable_favorites BOOLEAN DEFAULT true,
    enable_copy_link BOOLEAN DEFAULT true,
    cta_banner_title TEXT DEFAULT 'Need a bespoke custom tool or API?',
    cta_banner_subtitle TEXT DEFAULT 'Request custom automation, calculators, scrapers, or AI apps built specifically for you.',
    cta_banner_button_text TEXT DEFAULT 'Explore Plans',
    cta_banner_action_type TEXT DEFAULT 'modal',
    cta_banner_target TEXT DEFAULT 'website_plans',
    show_cta_banner BOOLEAN DEFAULT true,
    quick_stat_1_val TEXT DEFAULT '15+',
    quick_stat_1_label TEXT DEFAULT 'Verified Tools',
    quick_stat_2_val TEXT DEFAULT '100%',
    quick_stat_2_label TEXT DEFAULT 'Free & Safe',
    quick_stat_3_val TEXT DEFAULT '24/7',
    quick_stat_3_label TEXT DEFAULT 'Cloud Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_settings ENABLE ROW LEVEL SECURITY;

-- 5. Clean up any existing policies
DROP POLICY IF EXISTS "Public can view tool categories" ON public.tool_categories;
DROP POLICY IF EXISTS "Public can manage tool categories" ON public.tool_categories;
DROP POLICY IF EXISTS "Public can view tools" ON public.tools;
DROP POLICY IF EXISTS "Public can manage tools" ON public.tools;
DROP POLICY IF EXISTS "Public can view tool settings" ON public.tool_settings;
DROP POLICY IF EXISTS "Public can manage tool settings" ON public.tool_settings;

-- 6. Create Permissive Policies (Full read/write for Admin & App)
CREATE POLICY "Public can view tool categories" 
ON public.tool_categories FOR SELECT USING (true);

CREATE POLICY "Public can manage tool categories" 
ON public.tool_categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can view tools" 
ON public.tools FOR SELECT USING (true);

CREATE POLICY "Public can manage tools" 
ON public.tools FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public can view tool settings" 
ON public.tool_settings FOR SELECT USING (true);

CREATE POLICY "Public can manage tool settings" 
ON public.tool_settings FOR ALL USING (true) WITH CHECK (true);

-- 7. Insert Default Tool Categories
INSERT INTO public.tool_categories (id, name, slug, icon, emoji, color, description, display_order, is_active)
VALUES
('ai-predictors', 'AI & Predictors', 'ai-predictors', 'Sparkles', '🔮', 'from-purple-500 via-indigo-500 to-pink-500', 'Smart AI algorithms, video generators, and predictive models.', 1, true),
('developer-tools', 'Developer Tools', 'developer-tools', 'Code', '💻', 'from-blue-600 via-indigo-600 to-cyan-500', 'APIs, web tool generators, developer consoles, and repositories.', 2, true),
('downloads-apks', 'Downloads & APKs', 'downloads-apks', 'Download', '📥', 'from-emerald-500 via-teal-500 to-green-600', 'Verified mobile APKs, utility packages, and clean downloads.', 3, true),
('gaming-tools', 'Gaming & Fun', 'gaming-tools', 'Gamepad2', '🎮', 'from-red-500 via-rose-500 to-orange-500', 'Gaming utilities, FreeFire mod setups, and gaming shortcuts.', 4, true),
('education-courses', 'Education & Courses', 'education-courses', 'BookOpen', '📚', 'from-amber-500 via-orange-500 to-yellow-500', 'Free development courses, tutorials, and masterclasses.', 5, true),
('web-builders', 'Web & Hosting', 'web-builders', 'Globe', '🌐', 'from-cyan-500 via-blue-500 to-teal-500', 'Build your website, register platforms, and launch pages.', 6, true),
('services-plans', 'Services & Plans', 'services-plans', 'DollarSign', '💎', 'from-violet-600 via-purple-600 to-indigo-600', 'Custom client development plans, pricing, and system builds.', 7, true),
('community-channels', 'Community & VIP', 'community-channels', 'MessageSquare', '💬', 'from-emerald-500 to-green-500', 'Direct VIP WhatsApp channels, alerts, and community links.', 8, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  icon = EXCLUDED.icon,
  emoji = EXCLUDED.emoji,
  color = EXCLUDED.color,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- 8. Insert Default Tools
INSERT INTO public.tools (id, title, description, url, category_id, category_name, icon, badge, gradient, action_type, modal_target, display_order, is_active, is_featured)
VALUES
('pricing-plans', 'Pricing & Packages', 'Explore web development packages, pricing tiers, and custom quotes.', '#website-plans', 'services-plans', 'Services & Plans', 'DollarSign', 'POPULAR', 'from-purple-600 via-indigo-600 to-blue-600', 'modal_action', 'website_plans', 1, true, true),
('whatsapp-channel', 'VIP WhatsApp Channel', 'Join Saqib official WhatsApp channel for instant drops and updates.', 'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I', 'community-channels', 'Community & VIP', 'MessageSquare', 'ACTIVE', 'from-[#25D366] to-[#128C7E]', 'external_url', '', 3, true, true),
('explore-hacks', 'Explore Dev Hacks', 'Curated developer tricks, coding shortcuts, and productivity tips.', '#hacks', 'developer-tools', 'Developer Tools', 'Zap', 'HOT', 'from-amber-500 via-orange-500 to-red-500', 'modal_action', 'hacks', 4, true, false),
('saqib-api', 'Saqib API Services', 'High-performance cloud endpoints and programmatic REST APIs.', 'https://apisaqib.vercel.app', 'developer-tools', 'Developer Tools', 'Globe', 'FAST', 'from-blue-600 to-indigo-600', 'external_url', '', 5, true, false),
('make-own-tools', 'Make Your Own Tools', 'Interactive builder to craft web utilities and tool pages without code.', 'https://protool.zone.id', 'developer-tools', 'Developer Tools', 'Wrench', 'CREATOR', 'from-emerald-600 to-green-600', 'external_url', '', 6, true, false),
('own-web-builder', 'Own Web Builder', 'Launch websites and custom domains easily with instant cloud setup.', 'https://ownweb-theta.vercel.app/', 'web-builders', 'Web & Hosting', 'Globe', 'PRO', 'from-blue-500 to-cyan-400', 'external_url', '', 7, true, false),
('mod-apks', 'Modded APKs & Tools', 'Explore top modified Android applications, utility apps, and tools.', 'https://liteapks.com/', 'downloads-apks', 'Downloads & APKs', 'Download', 'FREE', 'from-blue-500 to-cyan-400', 'external_url', '', 8, true, false),
('source-code-vault', 'Source Code Vault', 'Free open-source codebases, React templates, and Next.js repositories.', '#source-code', 'developer-tools', 'Developer Tools', 'Code', 'REPOS', 'from-purple-600 to-pink-600', 'modal_action', 'source_code', 9, true, false),
('free-courses-hub', 'Free Courses Hub', 'Comprehensive software development, coding, and design courses.', '#free-courses', 'education-courses', 'Education & Courses', 'BookOpen', 'FREE', 'from-orange-500 to-amber-500', 'modal_action', 'free_courses', 10, true, false),
('wingo-predictor', 'Wingo AI Predictor', 'AI statistical predictor model with live trend analysis engine.', 'https://wingoaisite.com/wingo-prediction/', 'ai-predictors', 'AI & Predictors', 'Sparkles', 'AI 99%', 'from-[#ff007f] via-[#7f00ff] to-[#00f0ff]', 'external_url', '', 11, true, false),
('aviator-predictor', 'Aviator AI Predictor', 'Smart probability & flight multiplier analytics engine.', 'https://theresanaiforthat.com/@puncvachongtham/aviator-predictor/', 'ai-predictors', 'AI & Predictors', 'Plane', 'TRENDING', 'from-[#ff3131] via-[#ff0055] to-[#800080]', 'external_url', '', 12, true, false),
('h4k3r-ai-video', 'H4K3R AI Video Gen', 'Generate high-octane AI video animations, edits, and cyber visual clips.', 'https://h4k3r-ai.vercel.app/', 'ai-predictors', 'AI & Predictors', 'Video', 'AI GEN', 'from-[#00ff66] via-[#00e5ff] to-[#7f00ff]', 'external_url', '', 13, true, false),
('qwen-ai-video', 'Qwen AI Video Studio', 'Next-generation AI video synthesis platform powered by Qwen.', 'https://qwen.ai/', 'ai-predictors', 'AI & Predictors', 'Film', 'HD', 'from-[#ff9900] via-[#ff5500] to-[#ff0055]', 'external_url', '', 14, true, false),
('freefire-tool', 'FreeFire Pro Tool', 'Sensitivity optimizers, game configs, and custom layout utilities.', 'https://pbxofficial.zone.id/', 'gaming-tools', 'Gaming & Fun', 'Gamepad2', 'VIP', 'from-[#f12711] via-[#f5af19] to-[#ff4b2b]', 'external_url', '', 15, true, false)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  icon = EXCLUDED.icon,
  badge = EXCLUDED.badge,
  gradient = EXCLUDED.gradient,
  action_type = EXCLUDED.action_type,
  modal_target = EXCLUDED.modal_target,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured;

-- 9. Insert Default Page Settings
INSERT INTO public.tool_settings (
    id, page_title, page_subtitle, badge_text, announcement_text, show_announcement,
    featured_section_title, show_featured_section, default_view_mode, show_categories_count,
    enable_favorites, enable_copy_link, cta_banner_title, cta_banner_subtitle,
    cta_banner_button_text, cta_banner_action_type, cta_banner_target, show_cta_banner,
    quick_stat_1_val, quick_stat_1_label, quick_stat_2_val, quick_stat_2_label,
    quick_stat_3_val, quick_stat_3_label
) VALUES (
    'default',
    'Explore All Tools & Utilities',
    'Instant access to AI predictors, developer portals, free coding repos, modded APKs, and custom web utilities.',
    'Dynamic Tools Engine',
    '🔥 Live Update: New AI predictors, free source repos & web utilities updated today!',
    true,
    'Featured & Staff Picks',
    true,
    'grid',
    true,
    true,
    true,
    'Need a bespoke custom tool or API?',
    'Request custom automation, calculators, scrapers, or AI apps built specifically for you.',
    'Explore Plans',
    'modal',
    'website_plans',
    true,
    '15+',
    'Verified Tools',
    '100%',
    'Free & Safe',
    '24/7',
    'Cloud Active'
) ON CONFLICT (id) DO UPDATE SET
    page_title = EXCLUDED.page_title,
    page_subtitle = EXCLUDED.page_subtitle,
    badge_text = EXCLUDED.badge_text,
    announcement_text = EXCLUDED.announcement_text,
    show_announcement = EXCLUDED.show_announcement,
    featured_section_title = EXCLUDED.featured_section_title,
    show_featured_section = EXCLUDED.show_featured_section,
    default_view_mode = EXCLUDED.default_view_mode,
    show_categories_count = EXCLUDED.show_categories_count,
    enable_favorites = EXCLUDED.enable_favorites,
    enable_copy_link = EXCLUDED.enable_copy_link,
    cta_banner_title = EXCLUDED.cta_banner_title,
    cta_banner_subtitle = EXCLUDED.cta_banner_subtitle,
    cta_banner_button_text = EXCLUDED.cta_banner_button_text,
    cta_banner_action_type = EXCLUDED.cta_banner_action_type,
    cta_banner_target = EXCLUDED.cta_banner_target,
    show_cta_banner = EXCLUDED.show_cta_banner,
    quick_stat_1_val = EXCLUDED.quick_stat_1_val,
    quick_stat_1_label = EXCLUDED.quick_stat_1_label,
    quick_stat_2_val = EXCLUDED.quick_stat_2_val,
    quick_stat_2_label = EXCLUDED.quick_stat_2_label,
    quick_stat_3_val = EXCLUDED.quick_stat_3_val,
    quick_stat_3_label = EXCLUDED.quick_stat_3_label,
    updated_at = NOW();
`;
}
