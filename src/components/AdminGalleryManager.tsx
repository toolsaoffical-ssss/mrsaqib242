import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Search, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { 
  GalleryItem, 
  fetchGalleryFromDB, 
  createGalleryItemInDB, 
  updateGalleryItemInDB, 
  deleteGalleryItemInDB, 
  DEFAULT_GALLERY_ITEMS 
} from '../lib/galleryService';

interface AdminGalleryManagerProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

export default function AdminGalleryManager({ onNotify }: AdminGalleryManagerProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFromDB, setIsFromDB] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: 'Visual',
    display_order: 1,
    is_active: true
  });

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetchGalleryFromDB();
      if (res.items) {
        setItems(res.items);
        setIsFromDB(Boolean(res.fromDatabase));
      }
    } catch (err: any) {
      onNotify('Failed to load gallery items: ' + (err.message || 'Network error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: `Visual Photo ${items.length + 1}`,
      image_url: '',
      category: 'Visual',
      display_order: items.length + 1,
      is_active: true
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      image_url: item.image_url || '',
      category: item.category || 'Visual',
      display_order: item.display_order ?? 1,
      is_active: item.is_active !== false
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      onNotify('Image URL is required.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const payload = {
        title: formData.title.trim() || 'Visual Photo',
        image_url: formData.image_url.trim(),
        category: formData.category.trim() || 'Visual',
        display_order: Number(formData.display_order) || 1,
        is_active: formData.is_active
      };

      if (editingItem && editingItem.id) {
        const res = await updateGalleryItemInDB(editingItem.id, payload);
        if (res.error) {
          onNotify(`Update error: ${res.error}`, 'error');
        } else {
          onNotify('Gallery image updated successfully!', 'success');
          setIsAddModalOpen(false);
          loadGallery();
        }
      } else {
        const res = await createGalleryItemInDB(payload);
        if (res.error) {
          onNotify(`Create error: ${res.error}`, 'error');
        } else {
          onNotify('New gallery photo added successfully!', 'success');
          setIsAddModalOpen(false);
          loadGallery();
        }
      }
    } catch (err: any) {
      onNotify('Failed to save image: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (item: GalleryItem) => {
    if (!item.id) {
      onNotify('Item has no database ID.', 'error');
      return;
    }
    const newStatus = item.is_active === false ? true : false;
    const res = await updateGalleryItemInDB(item.id, { is_active: newStatus });
    if (res.error) {
      onNotify(`Toggle error: ${res.error}`, 'error');
    } else {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: newStatus } : i));
      onNotify(`Image status set to ${newStatus ? 'Active' : 'Hidden'}`, 'success');
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await deleteGalleryItemInDB(id);
      if (res.error) {
        onNotify(`Delete error: ${res.error}`, 'error');
      } else {
        onNotify('Gallery image removed successfully.', 'success');
        setDeletingId(null);
        setItems(prev => prev.filter(i => i.id !== id));
      }
    } catch (err: any) {
      onNotify('Delete failed: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const allCategories = Array.from(new Set(items.map(i => i.category || 'Visual'))).filter(Boolean);

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.image_url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      categoryFilter === 'all' || 
      (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <ImageIcon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">Gallery Visuals</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isFromDB 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isFromDB ? 'Supabase Synced' : 'Preset Mode'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage photography, portrait shots, and showcases displayed on the homepage gallery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadGallery}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Photo</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search gallery by title, category, or URL..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-orange-500 text-black font-black'
                : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            All ({items.length})
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-orange-500 text-black font-black'
                  : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="aspect-square rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-white/5">
          <ImageIcon size={40} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-bold text-zinc-300">No photos found</p>
          <p className="text-xs text-zinc-500 mt-1">Click "Add New Photo" to add images to your portfolio gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map(item => {
            const isActive = item.is_active !== false;
            return (
              <div
                key={item.id || item.image_url}
                className={`group relative bg-zinc-900/70 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:border-orange-500/40 ${
                  isActive ? 'border-white/10' : 'border-rose-900/40 opacity-60 bg-zinc-950'
                }`}
              >
                {/* Image Preview Container */}
                <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Visual photo'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.opacity = '0.3';
                    }}
                  />

                  {/* Top floating tags */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                      #{item.display_order ?? 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-md border ${
                      isActive 
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' 
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                    }`}>
                      {isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  {/* Hover Overlay Button to Zoom */}
                  <button
                    onClick={() => setPreviewImageUrl(item.image_url)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20">
                      <Maximize2 size={16} />
                    </div>
                  </button>
                </div>

                {/* Info & Actions */}
                <div className="p-3 bg-zinc-900/90 flex flex-col justify-between gap-2 border-t border-white/5">
                  <div>
                    <h4 className="text-xs font-bold text-white truncate" title={item.title || ''}>
                      {item.title || 'Untitled Visual'}
                    </h4>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-zinc-400 border border-white/5">
                      {item.category || 'Visual'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {item.id && (
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`p-1.5 rounded-lg border text-zinc-400 hover:text-white transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-300' 
                            : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                        }`}
                        title={isActive ? 'Hide image from site' : 'Show image on site'}
                      >
                        {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Edit photo info"
                    >
                      <Edit3 size={12} />
                    </button>

                    <a
                      href={item.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                      title="Open full image URL"
                    >
                      <ExternalLink size={12} />
                    </a>

                    {item.id && (
                      <button
                        onClick={() => setDeletingId(item.id!)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Lightbox Preview Modal */}
      {previewImageUrl && (
        <div 
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] p-2 bg-zinc-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <img
              src={previewImageUrl}
              alt="High resolution preview"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <ImageIcon size={16} />
                </div>
                <h3 className="text-sm font-black text-white">
                  {editingItem ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... or /assets/..."
                  value={formData.image_url}
                  onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* Instant Image Preview */}
              {formData.image_url && (
                <div className="relative aspect-video w-full rounded-xl bg-zinc-950 border border-white/10 overflow-hidden flex items-center justify-center">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white">
                    Live Preview
                  </span>
                </div>
              )}

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Title / Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Studio Portrait #1"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Visual, Portrait"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order}
                    onChange={e => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>Active on Live Portfolio</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {actionLoading ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>{editingItem ? 'Save Changes' : 'Add Photo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Delete Photo</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Are you sure you want to remove this photo from your gallery?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {actionLoading ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
