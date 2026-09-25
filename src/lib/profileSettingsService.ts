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
  updated_at?: string;
}

export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  id: 'default',
  name: 'Muhammad Saqib',
  short_name: 'Saqib',
  brand_name: 'Saqib Visuals',
  tagline: 'Creative Visual Artist | Content Creator | Tech Enthusiast',
  bio: "I'm a passionate Full-Stack Web Developer, App Developer, AI Enthusiast, and Creative Content Creator with a strong focus on building modern, fast, and scalable digital solutions.",
  phone: '+92 343 673242',
  email: 'mrsaqib242242@gmail.com',
  location: 'Faisalabad, Pakistan',
  portfolio_url: 'https://mrsaqib.vercel.app/',
  resume_url: '/resume.pdf',
  whatsapp_url: 'https://wa.me/92343673242',
  instagram_url: 'https://www.instagram.com/mr_saqib242',
  facebook_url: 'https://www.facebook.com/profile.php?id=100085188689033',
  tiktok_url: 'https://www.tiktok.com/@mr_saqib_242',
  snapchat_url: 'https://www.snapchat.com/add/mrsaqib242'
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
    } catch (e) {
      // ignore
    }
  }

  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: true,
      data: mergedPayload,
      error: 'Supabase client is not fully configured. Saved to local state.'
    };
  }

  try {
    const { data, error } = await supabase
      .from('profile_settings')
      .upsert(
        {
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
          updated_at: mergedPayload.updated_at
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

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
