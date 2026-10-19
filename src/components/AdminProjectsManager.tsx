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
  Database,
  Grid,
  FolderOpen,
  Tag,
  Star,
  Upload,
  Image as ImageIcon
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

export const KNOWN_CATEGORIES = [
  { name: 'Portfolio', emoji: '💼', gradient: 'from-blue-600 via-indigo-500 to-purple-600' },
  { name: 'E-Commerce', emoji: '🛍️', gradient: 'from-rose-500 to-pink-500' },
  { name: 'Restaurant', emoji: '🍽️', gradient: 'from-lime-500 to-emerald-600' },
  { name: 'Finance', emoji: '📈', gradient: 'from-green-500 to-emerald-600' },
  { name: 'Education', emoji: '🎓', gradient: 'from-blue-500 via-cyan-500 to-teal-500' },
  { name: 'Personal', emoji: '❤️', gradient: 'from-pink-500 via-rose-500 to-yellow-500' },
  { name: 'Business', emoji: '🏢', gradient: 'from-amber-500 to-orange-600' },
  { name: 'AI & Tech', emoji: '🤖', gradient: 'from-cyan-500 to-blue-600' },
  { name: 'Dev Tools', emoji: '⚡', gradient: 'from-purple-600 to-indigo-600' },
  { name: 'Utilities', emoji: '🔧', gradient: 'from-zinc-600 to-zinc-800' },
  { name: 'Security', emoji: '🛡️', gradient: 'from-red-600 to-rose-700' },
  { name: 'Community', emoji: '🌐', gradient: 'from-teal-500 to-emerald-600' },
  { name: 'Gaming', emoji: '🎮', gradient: 'from-violet-600 to-purple-800' },
  { name: 'Entertainment', emoji: '🎬', gradient: 'from-fuchsia-600 to-pink-600' },
  { name: 'Media Tools', emoji: '🎨', gradient: 'from-yellow-500 to-amber-500' },
  { name: 'Photo Tools', emoji: '📷', gradient: 'from-indigo-500 to-blue-500' },
  { name: 'UI Resources', emoji: '💎', gradient: 'from-cyan-400 to-teal-500' }
];

const GRADIENT_PRESETS = [
  { label: 'Blue to Indigo', value: 'from-blue-600 via-indigo-500 to-purple-600' },
  { label: 'Lime to Emerald', value: 'from-lime-500 to-emerald-600' },
  { label: 'Teal to Cyan', value: 'from-teal-500 to-emerald-600' },
  { label: 'Rose to Pink', value: 'from-rose-500 to-pink-500' },
  { label: 'Orange to Amber', value: 'from-orange-500 to-amber-500' },
  { label: 'Purple to Violet', value: 'from-purple-600 to-indigo-600' },
  { label: 'Pink to Yellow', value: 'from-pink-500 via-rose-500 to-yellow-500' },
  { label: 'Cyan to Blue', value: 'from-cyan-500 to-blue-600' },
  { label: 'Dark Carbon', value: 'from-zinc-800 via-zinc-900 to-black' }
];

export default function AdminProjectsManager({ onNotify }: AdminProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFromDB, setIsFromDB] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grouped');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    image_url: '',
    description: '',
    category: 'Portfolio',
    tags: 'Portfolio, Web App',
    gradient: 'from-blue-600 via-indigo-500 to-purple-600',
    restricted: false,
    is_active: true,
    display_order: 1
  });

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      onNotify('Image too large. Please select an image under 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, image_url: String(event.target?.result) }));
        onNotify('Project preview image loaded! Save to apply.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const getCategoryEmoji = (cat: string) => {
    const found = KNOWN_CATEGORIES.find(c => c.name.toLowerCase() === (cat || '').toLowerCase());
    return found ? found.emoji : '📁';
  };

  const getCategoryGradient = (cat: string) => {
    const found = KNOWN_CATEGORIES.find(c => c.name.toLowerCase() === (cat || '').toLowerCase());
    return found ? found.gradient : 'from-orange-500 to-amber-500';
  };

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

  // Compute all available categories (Known + DB projects)
  const allCategories = Array.from(
    new Set([
      ...KNOWN_CATEGORIES.map(c => c.name),
      ...projects.map(p => p.category || (p.tags && p.tags[0]) || '').filter(Boolean)
    ])
  );

  const openAddModal = (preselectedCategory?: string) => {
    const targetCat = preselectedCategory || (categoryFilter !== 'all' ? categoryFilter : 'Portfolio');
    const grad = getCategoryGradient(targetCat);
    setFormData({
      name: '',
      url: '',
      image_url: '',
      description: '',
      category: targetCat,
      tags: `${targetCat}, Web App`,
      gradient: grad,
      restricted: false,
      is_active: true,
      display_order: projects.length + 1
    });
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    const cat = p.category || (p.tags && p.tags[0]) || 'Portfolio';
    setFormData({
      name: p.name || '',
      url: p.url || '',
      image_url: p.image_url || '',
      description: p.description || '',
      category: cat,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : cat,
      gradient: p.gradient || getCategoryGradient(cat),
      restricted: Boolean(p.restricted),
      is_active: p.is_active !== false,
      display_order: p.display_order ?? 1
    });
    setIsAddModalOpen(true);
  };

  const handleSelectCategory = (cat: string) => {
    const grad = getCategoryGradient(cat);
    setFormData(prev => {
      // Ensure tags include the new category
      const currentTags = prev.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (!currentTags.includes(cat)) {
        currentTags.unshift(cat);
      }
      return {
        ...prev,
        category: cat,
        gradient: grad,
        tags: currentTags.join(', ')
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      onNotify('Project name and URL are required.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const selectedCategory = formData.category.trim() || 'Portfolio';
      let tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      if (!tagsArray.includes(selectedCategory)) {
        tagsArray.unshift(selectedCategory);
      }

      const payload = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        image_url: formData.image_url.trim(),
        description: formData.description.trim(),
        category: selectedCategory,
        tags: tagsArray,
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
          onNotify(`Project "${formData.name}" created under "${selectedCategory}" successfully!`, 'success');
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

  const handleTogglePick = async (p: ProjectItem) => {
    if (!p.id) return;
    const newStatus = !p.is_pick;
    const res = await updateProjectInDB(p.id, { is_pick: newStatus });
    if (res.error) {
      onNotify(`Toggle Pick failed: ${res.error}`, 'error');
    } else {
      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, is_pick: newStatus } : item));
      onNotify(newStatus ? 'Project added to Picks' : 'Project removed from Picks', 'success');
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

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      categoryFilter === 'all' || 
      (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase() === categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Group filtered projects by category for "Grouped View"
  const groupedCategories = allCategories
    .map(cat => {
      const catProjects = filteredProjects.filter(p => {
        const pCat = p.category || (p.tags && p.tags[0]) || 'Portfolio';
        return pCat.toLowerCase() === cat.toLowerCase();
      });
      return {
        name: cat,
        emoji: getCategoryEmoji(cat),
        gradient: getCategoryGradient(cat),
        projects: catProjects
      };
    })
    .filter(group => {
      // If filtering, only show matching categories; otherwise show categories that either have projects or match search
      if (categoryFilter !== 'all') {
        return group.name.toLowerCase() === categoryFilter.toLowerCase();
      }
      return group.projects.length > 0;
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
              <h2 className="text-xl font-black text-white tracking-wide">Projects & Categories Manager</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isFromDB 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isFromDB ? 'Supabase Synced' : 'Preset Mode'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select existing categories to organize, view, and add showcase projects easily.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-orange-500 text-black font-black shadow-md shadow-orange-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Group projects category-wise"
            >
              <FolderOpen size={13} />
              <span>Category-Wise</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-black font-black shadow-md shadow-orange-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Standard flat grid"
            >
              <Grid size={13} />
              <span>All Grid</span>
            </button>
          </div>

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
            onClick={() => openAddModal()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Categories Bar: Quick-Pick & Filter */}
      <div className="bg-zinc-900/50 p-4 rounded-3xl border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Select Category to View or Add
            </span>
          </div>

          {/* If a category is selected, provide direct "+ Add to [Category]" button */}
          {categoryFilter !== 'all' && (
            <button
              onClick={() => openAddModal(categoryFilter)}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Project in "{categoryFilter}"</span>
            </button>
          )}
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === 'all'
                ? 'bg-orange-500 text-black font-black shadow-md shadow-orange-500/20'
                : 'bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📁</span>
            <span>All Projects</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 text-white font-mono">
              {projects.length}
            </span>
          </button>

          {allCategories.map(cat => {
            const count = projects.filter(p => {
              const pCat = p.category || (p.tags && p.tags[0]) || '';
              return pCat.toLowerCase() === cat.toLowerCase();
            }).length;

            const isSelected = categoryFilter.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(isSelected ? 'all' : cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-orange-500 text-black font-black shadow-md shadow-orange-500/20'
                    : 'bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{getCategoryEmoji(cat)}</span>
                <span>{cat}</span>
                {count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-zinc-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          placeholder="Search projects by title, URL, tag, or description..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
        />
      </div>

      {/* Main Content Area */}
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
            {searchQuery ? 'Try clearing your search query or category filter.' : 'Click "Add New Project" or select a category to add projects.'}
          </p>
          <button
            onClick={() => openAddModal(categoryFilter !== 'all' ? categoryFilter : undefined)}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-black font-black text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/20"
          >
            <Plus size={14} />
            <span>Add Project {categoryFilter !== 'all' ? `to ${categoryFilter}` : ''}</span>
          </button>
        </div>
      ) : viewMode === 'grouped' ? (
        /* CATEGORY-WISE GROUPED VIEW */
        <div className="space-y-8">
          {groupedCategories.map(group => (
            <div
              key={group.name}
              className="bg-zinc-900/30 border border-white/5 rounded-3xl p-5 sm:p-6 space-y-4"
            >
              {/* Category Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {group.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{group.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-zinc-400 border border-white/10">
                        {group.projects.length} {group.projects.length === 1 ? 'Project' : 'Projects'}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Showcase items tagged under {group.name}
                    </p>
                  </div>
                </div>

                {/* Inline Add Button for this specific category */}
                <button
                  onClick={() => openAddModal(group.name)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-orange-500/20 text-zinc-300 hover:text-orange-300 border border-white/10 hover:border-orange-500/30 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add {group.name} Project</span>
                </button>
              </div>

              {/* Projects Grid for this Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.projects.map(p => (
                  <ProjectCard
                    key={p.id || p.name}
                    project={p}
                    onEdit={() => openEditModal(p)}
                    onToggleActive={() => handleToggleActive(p)}
                      onTogglePick={() => handleTogglePick(p)}
                    onDelete={() => p.id && setDeletingId(p.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* STANDARD ALL GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(p => (
            <ProjectCard
              key={p.id || p.name}
              project={p}
              onEdit={() => openEditModal(p)}
              onToggleActive={() => handleToggleActive(p)}
                      onTogglePick={() => handleTogglePick(p)}
              onDelete={() => p.id && setDeletingId(p.id)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal with Category Selector */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <FolderGit2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Category: <span className="text-orange-400 font-bold">{formData.category}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Category Selector Section: Clickable Old/Existing Categories */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-bold flex items-center gap-1.5">
                    <Tag size={13} className="text-orange-400" />
                    <span>Choose from Old / Existing Categories:</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">1-click to apply</span>
                </div>

                {/* Quick-Pick Clickable Category Badges */}
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 no-scrollbar">
                  {allCategories.map(cat => {
                    const isSelected = formData.category.toLowerCase() === cat.toLowerCase();
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black shadow-md shadow-orange-500/20 scale-105'
                            : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
                        }`}
                      >
                        <span>{getCategoryEmoji(cat)}</span>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dropdown / Custom Category Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Select from Dropdown</label>
                    <select
                      value={formData.category}
                      onChange={e => handleSelectCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                    >
                      {allCategories.map(cat => (
                        <option key={cat} value={cat}>
                          {getCategoryEmoji(cat)} {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Or Type Custom Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Custom SaaS"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                    />
                  </div>
                </div>
              </div>

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

              {/* Custom Preview Image (Upload from PC/Mobile or Paste Image URL) */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-200 font-bold flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-orange-400" />
                    <span>Project Preview Image (Custom Upload)</span>
                  </label>
                  {formData.image_url ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      ✓ Custom Image Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">
                      Fallback: Auto Screenshot
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Apne project ki preview image khud upload karein ya direct image link paste karein taakay AI screenshot ki jagah aap ki real HD image show ho.
                </p>

                {/* Upload Button + Image URL input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>Upload from Device</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageFileUpload}
                    />
                  </label>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Or paste direct image URL (https://... png/jpg)"
                      value={formData.image_url}
                      onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-orange-500/60"
                    />
                    {formData.image_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
                        title="Clear custom image"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Preview of Uploaded/Selected Image */}
                {formData.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/60 max-h-44 group">
                    <img 
                      src={formData.image_url} 
                      alt="Project Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Remove Image</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-[11px] text-zinc-500">
                    No custom image uploaded. Website will show automatic preview screenshot of <span className="text-zinc-400 font-mono">{formData.url || 'project URL'}</span>.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <span>{editingProject ? 'Save Changes' : `Create Project in ${formData.category}`}</span>
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

// Reusable Project Card Sub-Component
function ProjectCard({
  project,
  onEdit,
  onToggleActive,
  onTogglePick,
  onDelete
}: {
  project: ProjectItem;
  onEdit: () => void;
  onToggleActive: () => void;
  onTogglePick: () => void;
  onDelete: () => void;
}) {
  const isActive = project.is_active !== false;

  return (
    <div
      className={`group relative bg-zinc-900/70 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-orange-500/40 ${
        isActive ? 'border-white/10' : 'border-rose-900/30 opacity-70 bg-zinc-950'
      }`}
    >
      {/* Accent top gradient */}
      <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${project.gradient || 'from-orange-500 to-amber-500'} mb-3.5`} />

      {/* Project Thumbnail Preview */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/60 border border-white/10 mb-3">
        {project.image_url ? (
          <img 
            src={project.image_url} 
            alt={project.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950/80 p-3 text-center">
            <Globe size={24} className="text-zinc-600 mb-1.5" />
            <span className="text-[10px] font-mono text-zinc-500">Auto Screenshot Preview</span>
            <span className="text-[9px] text-zinc-600 truncate max-w-[180px]">{project.url}</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          {project.image_url ? (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/90 text-black shadow-md flex items-center gap-1">
              <Check size={10} /> Custom Image
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-black/70 text-zinc-400 border border-white/10 backdrop-blur-sm">
              Auto Screenshot
            </span>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                {project.name}
              </h4>
              {project.restricted && (
                <span className="p-1 rounded bg-amber-500/10 text-amber-400 text-[10px]" title="Restricted / Private Portal">
                  <Lock size={11} />
                </span>
              )}
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-zinc-400 hover:text-orange-300 flex items-center gap-1 mt-0.5 break-all line-clamp-1"
            >
              <Globe size={11} className="shrink-0" />
              <span>{project.url}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onTogglePick}
              className={`p-1.5 rounded-md transition-all ${project.is_pick ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
              title={project.is_pick ? 'Remove from Picks' : 'Add to Picks'}
            >
              <Star size={14} className={project.is_pick ? 'fill-amber-400' : ''} />
            </button>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isActive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
            }`}>
              {isActive ? 'Active' : 'Disabled'}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
          {project.description || 'No description provided.'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.category && (
            <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-300 text-[10px] font-semibold border border-orange-500/20">
              {project.category}
            </span>
          )}
          {project.tags?.slice(0, 3).map((tag, tIdx) => (
            <span key={tIdx} className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 text-[10px] font-medium border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-[11px] text-zinc-500 font-mono">
          Order: #{project.display_order ?? 1}
        </span>

        <div className="flex items-center gap-1.5">
          {project.id && (
            <button
              onClick={onToggleActive}
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
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Edit Project"
          >
            <Edit3 size={13} />
          </button>

          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
            title="Visit Live URL"
          >
            <ExternalLink size={13} />
          </a>

          {project.id && (
            <button
              onClick={onDelete}
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
}
