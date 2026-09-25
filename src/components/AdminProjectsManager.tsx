import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Globe, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Layers, 
  Lock, 
  AlertCircle,
  Database
} from 'lucide-react';
import { 
  ProjectItem, 
  fetchProjectsFromDB, 
  createProjectInDB, 
  updateProjectInDB, 
  deleteProjectFromDB, 
  seedAllDefaultProjectsToDB,
  DEFAULT_PROJECTS 
} from '../lib/projectsService';

interface AdminProjectsManagerProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const GRADIENT_PRESETS = [
  { label: 'Blue to Indigo', value: 'from-blue-600 via-indigo-500 to-purple-600' },
  { label: 'Lime to Emerald', value: 'from-lime-500 to-emerald-600' },
  { label: 'Teal to Cyan', value: 'from-teal-500 to-emerald-600' },
  { label: 'Rose to Pink', value: 'from-rose-500 to-pink-500' },
  { label: 'Orange to Amber', value: 'from-orange-500 to-amber-500' },
  { label: 'Purple to Violet', value: 'from-purple-600 to-indigo-600' },
  { label: 'Pink to Yellow', value: 'from-pink-500 via-rose-500 to-yellow-500' },
  { label: 'Cyan to Blue', value: 'from-cyan-500 to-blue-600' }
];

export default function AdminProjectsManager({ onNotify }: AdminProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFromDB, setIsFromDB] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
    category: 'Portfolio',
    tags: 'Web App, React',
    gradient: 'from-blue-600 via-indigo-500 to-purple-600',
    restricted: false,
    is_active: true,
    display_order: 1
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchProjectsFromDB();
      if (res.projects) {
        setProjects(res.projects);
        setIsFromDB(Boolean(res.fromDatabase));
      }
    } catch (err: any) {
      onNotify('Failed to load projects: ' + (err.message || 'Network error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setFormData({
      name: '',
      url: '',
      description: '',
      category: 'Portfolio',
      tags: 'Web App, Next.js',
      gradient: 'from-orange-500 to-amber-500',
      restricted: false,
      is_active: true,
      display_order: projects.length + 1
    });
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setFormData({
      name: p.name || '',
      url: p.url || '',
      description: p.description || '',
      category: p.category || (p.tags && p.tags[0]) || 'Portfolio',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      gradient: p.gradient || 'from-blue-600 via-indigo-500 to-purple-600',
      restricted: Boolean(p.restricted),
      is_active: p.is_active !== false,
      display_order: p.display_order ?? 1
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      onNotify('Project name and URL are required.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || 'Portfolio',
        tags: tagsArray.length > 0 ? tagsArray : [formData.category.trim() || 'Portfolio'],
        gradient: formData.gradient,
        restricted: formData.restricted,
        is_active: formData.is_active,
        display_order: Number(formData.display_order) || 1
      };

      if (editingProject && editingProject.id) {
        // Update existing
        const res = await updateProjectInDB(editingProject.id, payload);
        if (res.error) {
          onNotify(`Update error: ${res.error}`, 'error');
        } else {
          onNotify(`Project "${formData.name}" updated successfully!`, 'success');
          setIsAddModalOpen(false);
          loadProjects();
        }
      } else {
        // Create new
        const res = await createProjectInDB(payload);
        if (res.error) {
          onNotify(`Create error: ${res.error}`, 'error');
        } else {
          onNotify(`Project "${formData.name}" created successfully!`, 'success');
          setIsAddModalOpen(false);
          loadProjects();
        }
      }
    } catch (err: any) {
      onNotify('Save failed: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (p: ProjectItem) => {
    if (!p.id) {
      onNotify('Project ID not found in Supabase.', 'error');
      return;
    }
    const newStatus = p.is_active === false ? true : false;
    const res = await updateProjectInDB(p.id, { is_active: newStatus });
    if (res.error) {
      onNotify(`Toggle failed: ${res.error}`, 'error');
    } else {
      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, is_active: newStatus } : item));
      onNotify(`Project status changed to ${newStatus ? 'Active' : 'Inactive'}`, 'success');
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await deleteProjectFromDB(id);
      if (res.error) {
        onNotify(`Delete failed: ${res.error}`, 'error');
      } else {
        onNotify('Project deleted successfully.', 'success');
        setDeletingId(null);
        setProjects(prev => prev.filter(item => item.id !== id));
      }
    } catch (err: any) {
      onNotify('Delete failed: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('This will seed the default showcase projects to your Supabase database. Continue?')) return;
    setActionLoading(true);
    try {
      const res = await seedAllDefaultProjectsToDB();
      if (res.error) {
        onNotify(`Seed error: ${res.error}`, 'error');
      } else {
        onNotify(`Seeded ${res.count} default projects successfully!`, 'success');
        loadProjects();
      }
    } catch (err: any) {
      onNotify('Seed failed: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Categories list for filter
  const allCategories = Array.from(new Set(projects.map(p => p.category || (p.tags && p.tags[0]) || 'General'))).filter(Boolean);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      categoryFilter === 'all' || 
      p.category?.toLowerCase() === categoryFilter.toLowerCase() ||
      p.tags?.some(t => t.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <FolderGit2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">Projects Manager</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isFromDB 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isFromDB ? 'Supabase Synced' : 'Preset Mode'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Add, update, or remove portfolio showcases shown on the live website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadProjects}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {projects.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              disabled={actionLoading}
              className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Database size={14} />
              <span>Seed Defaults</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects by title, URL, tag, or description..."
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
            All ({projects.length})
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

      {/* Project Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-white/5">
          <FolderGit2 size={40} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-sm font-bold text-zinc-300">No projects found</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Try clearing your search query or category filter.' : 'Click "Add New Project" or "Seed Defaults" to populate projects.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(p => {
            const isActive = p.is_active !== false;
            return (
              <div
                key={p.id || p.name}
                className={`group relative bg-zinc-900/70 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-orange-500/40 ${
                  isActive ? 'border-white/10' : 'border-rose-900/30 opacity-70 bg-zinc-950'
                }`}
              >
                {/* Accent top gradient */}
                <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${p.gradient || 'from-orange-500 to-amber-500'} mb-3.5`} />

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                          {p.name}
                        </h3>
                        {p.restricted && (
                          <span className="p-1 rounded bg-amber-500/10 text-amber-400 text-[10px]" title="Restricted / Private Portal">
                            <Lock size={11} />
                          </span>
                        )}
                      </div>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-zinc-400 hover:text-orange-300 flex items-center gap-1 mt-0.5 break-all line-clamp-1"
                      >
                        <Globe size={11} className="shrink-0" />
                        <span>{p.url}</span>
                      </a>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}>
                      {isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {p.description || 'No description provided.'}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.category && (
                      <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 text-[10px] font-semibold border border-orange-500/20">
                        {p.category}
                      </span>
                    )}
                    {p.tags?.slice(0, 3).map((tag, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-[10px] font-medium border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Order: #{p.display_order ?? 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {p.id && (
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`p-1.5 rounded-lg border text-zinc-400 hover:text-white transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-300' 
                            : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                        }`}
                        title={isActive ? 'Deactivate project' : 'Activate project'}
                      >
                        {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                    )}

                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit3 size={13} />
                    </button>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                      title="Visit Live URL"
                    >
                      <ExternalLink size={13} />
                    </a>

                    {p.id && (
                      <button
                        onClick={() => setDeletingId(p.id!)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <FolderGit2 size={16} />
                </div>
                <h3 className="text-sm font-black text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
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
                <label className="block text-zinc-400 font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MS Clothes or Modern Portfolio"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Live URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. E-Commerce, Restaurant, Portfolio"
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

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Supabase, Tailwind, Stripe"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Gradient Style Accent</label>
                <select
                  value={formData.gradient}
                  onChange={e => setFormData({ ...formData, gradient: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                >
                  {GRADIENT_PRESETS.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
                <div className={`mt-2 h-2 rounded-full w-full bg-gradient-to-r ${formData.gradient}`} />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Explain features, target audience, stack, and functionality..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>Active on Live Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.restricted}
                    onChange={e => setFormData({ ...formData, restricted: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>Restricted / Client Portal</span>
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
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
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
              <h3 className="text-sm font-black text-white">Delete Project</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Are you sure you want to permanently delete this project? This cannot be undone.
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
