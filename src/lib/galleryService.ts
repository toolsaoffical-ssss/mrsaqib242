import { supabase } from './supabase';
import { _0xGI } from '../core/sys';

export interface GalleryItem {
  id?: string;
  title?: string;
  image_url: string;
  category?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = _0xGI.map((url, idx) => ({
  title: `Visual Photo ${idx + 1}`,
  image_url: url,
  category: idx === 0 || idx === 12 ? 'Portrait' : 'Visual',
  display_order: idx + 1,
  is_active: true
}));

export async function fetchGalleryFromDB(): Promise<{
  items: GalleryItem[];
  fromDatabase: boolean;
  error?: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetch gallery error (falling back to defaults):', error.message);
      return { items: DEFAULT_GALLERY_ITEMS, fromDatabase: false, error: error.message };
    }

    if (data && data.length > 0) {
      const parsed: GalleryItem[] = data.map((item: any, idx: number) => ({
        id: item.id,
        title: item.title || `Visual Photo ${idx + 1}`,
        image_url: item.image_url,
        category: item.category || 'Visual',
        display_order: item.display_order ?? (idx + 1),
        is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      return { items: parsed, fromDatabase: true };
    }

    return { items: DEFAULT_GALLERY_ITEMS, fromDatabase: false };
  } catch (err: any) {
    console.error('Exception fetching gallery:', err);
    return { items: DEFAULT_GALLERY_ITEMS, fromDatabase: false, error: err.message || 'Unknown network error' };
  }
}

export async function createGalleryItemInDB(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: any; error: string | null }> {
  try {
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ item })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) return { data: json.data, error: null };
      return { data: null, error: json.error || 'Failed to insert gallery image' };
    }

    const errJson = await res.json().catch(() => ({ error: 'Request failed' }));
    return { data: null, error: errJson.error || `Server error: ${res.status}` };
  } catch (err: any) {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert([
          {
            title: item.title || 'Visual Photo',
            image_url: item.image_url,
            category: item.category || 'Visual',
            display_order: item.display_order || 0,
            is_active: item.is_active !== undefined ? item.is_active : true
          }
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (fallbackErr: any) {
      return { data: null, error: fallbackErr.message || err.message || 'Failed to insert gallery image' };
    }
  }
}

export async function updateGalleryItemInDB(id: string, updates: Partial<GalleryItem>): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch('/api/admin/gallery', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, updates })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) return { success: true, error: null };
      return { success: false, error: json.error || 'Failed to update gallery image' };
    }

    const errJson = await res.json().catch(() => ({ error: 'Request failed' }));
    return { success: false, error: errJson.error || `Server error: ${res.status}` };
  } catch (err: any) {
    try {
      const payload: any = {
        updated_at: new Date().toISOString()
      };
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.image_url !== undefined) payload.image_url = updates.image_url;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.display_order !== undefined) payload.display_order = updates.display_order;
      if (updates.is_active !== undefined) payload.is_active = updates.is_active;

      const { error } = await supabase
        .from('gallery')
        .update(payload)
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (fallbackErr: any) {
      return { success: false, error: fallbackErr.message || err.message };
    }
  }
}

export async function deleteGalleryItemInDB(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch('/api/admin/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) return { success: true, error: null };
      return { success: false, error: json.error || 'Failed to delete gallery image' };
    }

    const errJson = await res.json().catch(() => ({ error: 'Request failed' }));
    return { success: false, error: errJson.error || `Server error: ${res.status}` };
  } catch (err: any) {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (fallbackErr: any) {
      return { success: false, error: fallbackErr.message || err.message };
    }
  }
}
