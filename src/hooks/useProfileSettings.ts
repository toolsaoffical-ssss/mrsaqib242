import { useState, useEffect } from 'react';
import {
  ProfileSettings,
  DEFAULT_PROFILE_SETTINGS,
  fetchProfileSettingsFromDB
} from '../lib/profileSettingsService';

export function useProfileSettings() {
  const [profile, setProfile] = useState<ProfileSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('saqib_profile_settings_cache');
        if (cached) return { ...DEFAULT_PROFILE_SETTINGS, ...JSON.parse(cached) };
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_PROFILE_SETTINGS;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await fetchProfileSettingsFromDB();
        if (isMounted && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.warn('Failed loading profile settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setProfile(e.detail);
      }
    };

    window.addEventListener('profile-settings-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('profile-settings-updated', handleUpdate);
    };
  }, []);

  return { profile, loading };
}
