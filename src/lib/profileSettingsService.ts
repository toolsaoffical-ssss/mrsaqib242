import { supabase, isSupabaseConfigured } from './supabase';

export interface ProfileSettings {
  id?: string;
  name: string;
  short_name: string;
  brand_name: string;
  tagline: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
  portfolio_url: string;
  resume_url: string;
  whatsapp_url: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  snapchat_url: string;
  telegram_url?: string;
  github_url?: string;
  avatar_url?: string;
  contract_status?: string;
  contract_subtitle?: string;
  availability_note?: string;
  badge_text?: string;
  cv_badge?: string;
  updated_at?: string;
}

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  id: 'default',
  name: 'Muhammad Saqib',
  short_name: 'Saqib',
  brand_name: 'Saqib Visuals',
  tagline: 'Full-Stack Engineer & Cyber Security Specialist',
  bio: 'Available for elite web applications, Next.js SaaS engineering, and AI chatbot integrations.',
  phone: '03478936242',
  email: 'mrsaqib242242@gmail.com',
  location: 'Gojra, Faisalabad, Pakistan',
  portfolio_url: 'https://www.mrsaqib.me',
  resume_url: '/resume.pdf',
  whatsapp_url: 'https://wa.me/923478936242',
  telegram_url: 'https://t.me/mrsaqib242',
  instagram_url: 'https://www.instagram.com/mr_saqib242',
  facebook_url: 'https://www.facebook.com/profile.php?id=100085188689033',
  tiktok_url: 'https://www.tiktok.com/@mr_saqib_242',
  snapchat_url: 'https://www.snapchat.com/add/mrsaqib242',
  github_url: 'https://github.com/mr-saqib-242',
  avatar_url: 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90',
  contract_status: 'Open for New Projects',
  contract_subtitle: 'Remote Worldwide • NDA Protected',
  availability_note: 'Available for Remote Worldwide Contracts & Security Audits.',
  badge_text: 'Verified ID',
  cv_badge: 'PDF 2026/27'
};

const STORAGE_KEY = 'saqib_profile_settings_cache';

export async function fetchProfileSettingsFromDB(): Promise<{
  data: ProfileSettings;
  fromFallback: boolean;
  error?: any;
}> {
  // Try local cache first for instant render
  let cached: ProfileSettings = DEFAULT_PROFILE_SETTINGS;
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        cached = { ...DEFAULT_PROFILE_SETTINGS, ...JSON.parse(local) };
      }
    } catch (e) {
      // ignore
    }
  }

  if (!isSupabaseConfigured() || !supabase) {
    return { data: cached, fromFallback: true };
  }

  try {
    const { data, error } = await supabase
      .from('profile_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      console.warn('Supabase profile_settings fetch error:', error.message);
      return { data: cached, fromFallback: true, error };
    }

    if (data) {
      const merged: ProfileSettings = {
        id: data.id || 'default',
        name: data.name || cached.name,
        short_name: data.short_name || cached.short_name,
        brand_name: data.brand_name || cached.brand_name,
        tagline: data.tagline || cached.tagline,
        bio: data.bio || cached.bio,
        phone: data.phone || cached.phone,
        email: data.email || cached.email,
        location: data.location || cached.location,
        portfolio_url: data.portfolio_url || cached.portfolio_url,
        resume_url: data.resume_url || cached.resume_url,
        whatsapp_url: data.whatsapp_url || cached.whatsapp_url,
        instagram_url: data.instagram_url || cached.instagram_url,
        facebook_url: data.facebook_url || cached.facebook_url,
        tiktok_url: data.tiktok_url || cached.tiktok_url,
        snapchat_url: data.snapchat_url || cached.snapchat_url,
        telegram_url: data.telegram_url || cached.telegram_url || DEFAULT_PROFILE_SETTINGS.telegram_url,
        github_url: data.github_url || cached.github_url || DEFAULT_PROFILE_SETTINGS.github_url,
        avatar_url: data.avatar_url || cached.avatar_url || DEFAULT_PROFILE_SETTINGS.avatar_url,
        contract_status: data.contract_status || cached.contract_status || DEFAULT_PROFILE_SETTINGS.contract_status,
        contract_subtitle: data.contract_subtitle || cached.contract_subtitle || DEFAULT_PROFILE_SETTINGS.contract_subtitle,
        availability_note: data.availability_note || cached.availability_note || DEFAULT_PROFILE_SETTINGS.availability_note,
        badge_text: data.badge_text || cached.badge_text || DEFAULT_PROFILE_SETTINGS.badge_text,
        cv_badge: data.cv_badge || cached.cv_badge || DEFAULT_PROFILE_SETTINGS.cv_badge,
        updated_at: data.updated_at
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
      return { data: merged, fromFallback: false };
    }

    return { data: cached, fromFallback: true };
  } catch (err: any) {
    console.error('Exception fetching profile settings:', err);
    return { data: cached, fromFallback: true, error: err };
  }
}

export async function saveProfileSettingsToDB(
  settings: Partial<ProfileSettings>
): Promise<{ success: boolean; data?: ProfileSettings; error?: any }> {
  const mergedPayload: ProfileSettings = {
    ...DEFAULT_PROFILE_SETTINGS,
    ...settings,
    id: 'default',
    updated_at: new Date().toISOString()
  };

  // Always update local cache immediately
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedPayload));
      // Dispatch custom event so components listening can update instantly
      window.dispatchEvent(new CustomEvent('profile-settings-updated', { detail: mergedPayload }));

      // Set cookies for Edge middleware instant redirects (<2ms)
      if (typeof document !== 'undefined') {
        if (mergedPayload.telegram_url) document.cookie = `ms_tg_url=${encodeURIComponent(mergedPayload.telegram_url)}; Path=/; Max-Age=31536000; SameSite=Lax`;
        if (mergedPayload.whatsapp_url) document.cookie = `ms_wa_url=${encodeURIComponent(mergedPayload.whatsapp_url)}; Path=/; Max-Age=31536000; SameSite=Lax`;
        if (mergedPayload.tiktok_url) document.cookie = `ms_tt_url=${encodeURIComponent(mergedPayload.tiktok_url)}; Path=/; Max-Age=31536000; SameSite=Lax`;
        if (mergedPayload.facebook_url) document.cookie = `ms_fb_url=${encodeURIComponent(mergedPayload.facebook_url)}; Path=/; Max-Age=31536000; SameSite=Lax`;
        if (mergedPayload.snapchat_url) document.cookie = `ms_sc_url=${encodeURIComponent(mergedPayload.snapchat_url)}; Path=/; Max-Age=31536000; SameSite=Lax`;
        if (mergedPayload.instagram_url) document.cookie = `ms_ig_url=${encodeURIComponent(mergedPayload.instagram_url)}; Path=/; Max-Age=31536000; SameSite=Lax`;
        if (mergedPayload.github_url) document.cookie = `ms_gh_url=${encodeURIComponent(mergedPayload.github_url)}; Path=/; Max-Age=31536000; SameSite=Lax`;
      }
    } catch (e) {
      // ignore
    }
  }

  // First try saving via the secure backend API route
  try {
    const res = await fetch('/api/admin/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(mergedPayload)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return { success: true, data: json.data };
      }
    }
  } catch {
    // Continue to fallback
  }

  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: true,
      data: mergedPayload,
      error: 'Supabase client is not fully configured. Saved to local state.'
    };
  }

  try {
    const upsertData: any = {
      id: 'default',
      name: mergedPayload.name,
      short_name: mergedPayload.short_name,
      brand_name: mergedPayload.brand_name,
      tagline: mergedPayload.tagline,
      bio: mergedPayload.bio,
      phone: mergedPayload.phone,
      email: mergedPayload.email,
      location: mergedPayload.location,
      portfolio_url: mergedPayload.portfolio_url,
      resume_url: mergedPayload.resume_url,
      whatsapp_url: mergedPayload.whatsapp_url,
      instagram_url: mergedPayload.instagram_url,
      facebook_url: mergedPayload.facebook_url,
      tiktok_url: mergedPayload.tiktok_url,
      snapchat_url: mergedPayload.snapchat_url,
      telegram_url: mergedPayload.telegram_url || 'https://t.me/mrsaqib242',
      github_url: mergedPayload.github_url || '',
      avatar_url: mergedPayload.avatar_url || '',
      updated_at: mergedPayload.updated_at
    };

    let { data, error } = await supabase
      .from('profile_settings')
      .upsert(upsertData, { onConflict: 'id' })
      .select()
      .single();

    if (error && (error.code === '42703' || error.message?.includes('column') || error.message?.includes('does not exist'))) {
      const { telegram_url, github_url, avatar_url, ...fallbackData } = upsertData;
      const retry = await supabase
        .from('profile_settings')
        .upsert(fallbackData, { onConflict: 'id' })
        .select()
        .single();
      if (!retry.error) {
        return { success: true, data: (retry.data as ProfileSettings) || mergedPayload };
      }
    }

    if (error) {
      console.error('Supabase profile_settings upsert error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as ProfileSettings) || mergedPayload };
  } catch (err: any) {
    console.error('Exception saving profile settings:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
