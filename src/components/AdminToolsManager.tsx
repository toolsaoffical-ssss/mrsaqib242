import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  Check,
  X,
  Copy,
  CheckCircle2,
  Layers,
  Sparkles,
  Terminal,
  Database,
  Code,
  Eye,
  EyeOff,
  RefreshCw,
  FolderPlus,
  Sliders,
  Star,
  Flame,
  ArrowRight,
  Globe,
  Radio,
  SlidersHorizontal,
  Compass,
  Save,
  CheckSquare,
  Crop,
  Upload,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';
import ToolIcon, { AVAILABLE_ICON_NAMES } from './ToolIcon';
import {
  ToolItem,
  ToolCategory,
  ToolPageSettings,
  DEFAULT_TOOL_PAGE_SETTINGS,
  fetchToolPageSettingsFromDB,
  saveToolPageSettingsToDB,
  resetToolPageSettingsToDefaults,
  saveToolItemToDB,
  deleteToolItemFromDB,
  saveToolCategoryToDB,
  deleteToolCategoryFromDB,
  resetToolsToDefaults,
  generateToolsSQLQuery
} from '../lib/toolsService';

interface AdminToolsManagerProps {
  tools: ToolItem[];
  setTools: React.Dispatch<React.SetStateAction<ToolItem[]>>;
  toolCategories: ToolCategory[];
  setToolCategories: React.Dispatch<React.SetStateAction<ToolCategory[]>>;
  loading: boolean;
  isFromDB: boolean;
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  subTab: 'items' | 'categories' | 'settings';
  setSubTab: (tab: 'items' | 'categories' | 'settings') => void;
}

const GRADIENT_OPTIONS = [
  { label: 'Orange Amber', value: 'from-orange-500 via-amber-500 to-yellow-500' },
  { label: 'Purple Indigo', value: 'from-purple-600 via-indigo-600 to-blue-600' },
  { label: 'Cyan Blue', value: 'from-blue-500 via-cyan-400 to-teal-400' },
  { label: 'Emerald Green', value: 'from-emerald-600 via-green-500 to-teal-600' },
  { label: 'WhatsApp Green', value: 'from-[#25D366] to-[#128C7E]' },
  { label: 'Rose Pink', value: 'from-rose-500 via-pink-500 to-purple-600' },
  { label: 'Red Fire', value: 'from-[#f12711] via-[#f5af19] to-[#ff4b2b]' },
  { label: 'Cyber Neon', value: 'from-[#00ff66] via-[#00e5ff] to-[#7f00ff]' },
  { label: 'Sunset Glow', value: 'from-[#ff9900] via-[#ff5500] to-[#ff0055]' },
  { label: 'Wingo Violet', value: 'from-[#ff007f] via-[#7f00ff] to-[#00f0ff]' },
  { label: 'Dark Sleek', value: 'from-zinc-800 via-zinc-900 to-black' }
];

const POPULAR_BADGES = ['HOT', 'NEW', 'AI 99%', 'PRO', 'FREE', 'VIP', 'POPULAR', 'FAST', 'REPOS'];

export default function AdminToolsManager({
  tools,
  setTools,
  toolCategories,
  setToolCategories,
  loading,
  isFromDB,
  onRefresh,
  showToast,
  subTab,
  setSubTab
}: AdminToolsManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sqlCopied, setSqlCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageSettings, setPageSettings] = useState<ToolPageSettings>(DEFAULT_TOOL_PAGE_SETTINGS);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Load page settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetchToolPageSettingsFromDB();
        if (res.settings) {
          setPageSettings(res.settings);
        }
      } catch (err) {
        console.warn('Failed to load settings:', err);
      }
    }
    loadSettings();
  }, []);

  // Tool Modals
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false);
  const [isEditToolModalOpen, setIsEditToolModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);
  const [deleteToolCandidate, setDeleteToolCandidate] = useState<ToolItem | null>(null);

  const [toolFormData, setToolFormData] = useState<ToolItem>({
    id: '',
    title: '',
    description: '',
    url: '',
    category_id: toolCategories[0]?.id || 'developer-tools',
    category_name: toolCategories[0]?.name || 'Developer Tools',
    icon: 'Wrench',
    logo_url: '',
    badge: '',
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    action_type: 'external_url',
    modal_target: undefined,
    display_order: 1,
    is_active: true,
    is_featured: false
  });

  // Interactive Logo Crop & Fit Adjuster States
  const [logoZoom, setLogoZoom] = useState<number>(100);
  const [logoOffsetX, setLogoOffsetX] = useState<number>(0);
  const [logoOffsetY, setLogoOffsetY] = useState<number>(0);
  const [logoFit, setLogoFit] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [logoPadding, setLogoPadding] = useState<number>(8);
  const [isBakingCrop, setIsBakingCrop] = useState<boolean>(false);

  const handleResetLogoCrop = () => {
    setLogoZoom(100);
    setLogoOffsetX(0);
    setLogoOffsetY(0);
    setLogoFit('contain');
    setLogoPadding(8);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showToast('Image too large. Please select an image under 3MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setToolFormData(prev => ({ ...prev, logo_url: String(event.target?.result) }));
        handleResetLogoCrop();
        showToast('Logo loaded! You can adjust zoom, pan, and crop below.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBakeCropCanvas = () => {
    if (!toolFormData.logo_url) return;
    setIsBakingCrop(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsBakingCrop(false);
          return;
        }

        ctx.clearRect(0, 0, 256, 256);

        const pad = (logoPadding / 100) * 256;
        const availableWidth = 256 - pad * 2;
        const availableHeight = 256 - pad * 2;

        const scale = logoZoom / 100;
        let drawW = availableWidth * scale;
        let drawH = availableHeight * scale;

        if (logoFit === 'contain') {
          const aspect = img.width / img.height;
          if (aspect > 1) {
            drawW = availableWidth * scale;
            drawH = (availableWidth / aspect) * scale;
          } else {
            drawH = availableHeight * scale;
            drawW = (availableHeight * aspect) * scale;
          }
        }

        const posX = pad + (availableWidth - drawW) / 2 + (logoOffsetX / 100) * 256;
        const posY = pad + (availableHeight - drawH) / 2 + (logoOffsetY / 100) * 256;

        ctx.drawImage(img, posX, posY, drawW, drawH);

        const bakedData = canvas.toDataURL('image/png', 0.95);
        setToolFormData(prev => ({ ...prev, logo_url: bakedData }));
        handleResetLogoCrop();
        setIsBakingCrop(false);
        showToast('Logo cropped & baked into high-resolution icon!', 'success');
      };
      img.onerror = () => {
        setIsBakingCrop(false);
        showToast('Could not load image into canvas. URL will be saved directly.', 'error');
      };
      img.src = toolFormData.logo_url;
    } catch {
      setIsBakingCrop(false);
      showToast('Crop baked with direct URL positioning.', 'success');
    }
  };

  // Category Modals
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ToolCategory | null>(null);
  const [deleteCategoryCandidate, setDeleteCategoryCandidate] = useState<ToolCategory | null>(null);

  const [categoryFormData, setCategoryFormData] = useState<ToolCategory>({
    id: '',
    name: '',
    slug: '',
    icon: 'Sparkles',
    emoji: '🔮',
    color: 'from-purple-500 via-indigo-500 to-pink-500',
    description: '',
    display_order: 1,
    is_active: true
  });

  // Filtered Tools
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCat =
        selectedCategory === 'All' ||
        tool.category_id === selectedCategory ||
        tool.category_name.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        (tool.description && tool.description.toLowerCase().includes(q)) ||
        (tool.badge && tool.badge.toLowerCase().includes(q)) ||
        tool.category_name.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [tools, selectedCategory, searchQuery]);

  // Handle Tool Actions
  const handleOpenAddTool = () => {
    setEditingTool(null);
    handleResetLogoCrop();
    setToolFormData({
      id: `tool-${Date.now().toString(36)}`,
      title: '',
      description: '',
      url: '',
      category_id: toolCategories[0]?.id || 'developer-tools',
      category_name: toolCategories[0]?.name || 'Developer Tools',
      icon: 'Wrench',
      logo_url: '',
      badge: '',
      gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
      action_type: 'external_url',
      modal_target: undefined,
      display_order: tools.length + 1,
      is_active: true,
      is_featured: false
    });
    setIsAddToolModalOpen(true);
  };

  const handleOpenEditTool = (tool: ToolItem) => {
    setEditingTool(tool);
    handleResetLogoCrop();
    setToolFormData({ 
      ...tool,
      logo_url: tool.logo_url || ''
    });
    setIsEditToolModalOpen(true);
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolFormData.title.trim()) {
      showToast('Please enter a tool title', 'error');
      return;
    }
    if (!toolFormData.url.trim() && toolFormData.action_type !== 'modal_action') {
      showToast('Please enter a destination URL', 'error');
      return;
    }

    setIsSubmitting(true);
    const cat = toolCategories.find(c => c.id === toolFormData.category_id);
    const payload: ToolItem = {
      ...toolFormData,
      category_name: cat ? cat.name : toolFormData.category_name
    };

    const res = await saveToolItemToDB(payload, tools);
    setIsSubmitting(false);

    if (res.success) {
      showToast(`Tool "${payload.title}" saved successfully!`, 'success');
      setIsAddToolModalOpen(false);
      setIsEditToolModalOpen(false);
      setEditingTool(null);
      onRefresh();
    } else {
      showToast(`Saved locally (${res.error})`, 'error');
      setIsAddToolModalOpen(false);
      setIsEditToolModalOpen(false);
      setEditingTool(null);
      onRefresh();
    }
  };

  const handleToggleToolActive = async (tool: ToolItem) => {
    const nextStatus = !tool.is_active;
    const updated = { ...tool, is_active: nextStatus };
    const nextList = tools.map(t => (t.id === tool.id ? updated : t));
    setTools(nextList);
    await saveToolItemToDB(updated, nextList);
    showToast(`Tool "${tool.title}" is now ${nextStatus ? 'visible' : 'hidden'}!`);
  };

  const handleToggleToolFeatured = async (tool: ToolItem) => {
    const nextFeatured = !tool.is_featured;
    const updated = { ...tool, is_featured: nextFeatured };
    const nextList = tools.map(t => (t.id === tool.id ? updated : t));
    setTools(nextList);
    await saveToolItemToDB(updated, nextList);
    showToast(`Tool "${tool.title}" is ${nextFeatured ? 'featured in top spotlight' : 'unpinned'}`);
  };

  const handleSavePageSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    const res = await saveToolPageSettingsToDB(pageSettings);
    setIsSavingSettings(false);
    if (res.success) {
      showToast('Tools page settings saved & published successfully!', 'success');
    } else {
      showToast(`Saved locally (${res.error})`, 'error');
    }
  };

  const handleResetPageSettings = async () => {
    if (typeof window !== 'undefined' && window.confirm('Reset all Tools page settings to original defaults?')) {
      setIsSavingSettings(true);
      await resetToolPageSettingsToDefaults();
      setPageSettings(DEFAULT_TOOL_PAGE_SETTINGS);
      setIsSavingSettings(false);
      showToast('Tools page settings restored to defaults!', 'success');
    }
  };

  const handleConfirmDeleteTool = async () => {
    if (!deleteToolCandidate) return;
    const { id, title } = deleteToolCandidate;
    const res = await deleteToolItemFromDB(id, tools);
    setDeleteToolCandidate(null);
    if (res.success) {
      showToast(`Deleted tool "${title}"`, 'success');
      onRefresh();
    } else {
      showToast(`Deleted locally (${res.error})`, 'error');
      onRefresh();
    }
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      id: `cat-${Date.now().toString(36)}`,
      name: '',
      slug: '',
      icon: 'Sparkles',
      emoji: '🔮',
      color: 'from-purple-500 via-indigo-500 to-pink-500',
      description: '',
      display_order: toolCategories.length + 1,
      is_active: true
    });
    setIsAddCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: ToolCategory) => {
    setEditingCategory(cat);
    setCategoryFormData({ ...cat });
    setIsEditCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showToast('Please enter category name', 'error');
      return;
    }
    const slug = categoryFormData.slug.trim() || categoryFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload: ToolCategory = {
      ...categoryFormData,
      slug
    };

    setIsSubmitting(true);
    const res = await saveToolCategoryToDB(payload, toolCategories);
    setIsSubmitting(false);

    if (res.success) {
      showToast(`Category "${payload.name}" saved!`, 'success');
      setIsAddCategoryModalOpen(false);
      setIsEditCategoryModalOpen(false);
      setEditingCategory(null);
      onRefresh();
    } else {
      showToast(`Saved locally (${res.error})`, 'error');
      setIsAddCategoryModalOpen(false);
      setIsEditCategoryModalOpen(false);
      setEditingCategory(null);
      onRefresh();
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deleteCategoryCandidate) return;
    const { id, name } = deleteCategoryCandidate;
    const res = await deleteToolCategoryFromDB(id, toolCategories);
    setDeleteCategoryCandidate(null);
    if (res.success) {
      showToast(`Deleted category "${name}"`, 'success');
      onRefresh();
    } else {
      showToast(`Deleted locally (${res.error})`, 'error');
      onRefresh();
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all tools and categories back to the complete initial defaults?')) {
      const res = await resetToolsToDefaults();
      if (res.success) {
        showToast('All tools & categories restored to default configuration!', 'success');
        onRefresh();
      } else {
        showToast(`Reset locally (${res.error})`, 'error');
        onRefresh();
      }
    }
  };

  const handleCopySQL = () => {
    const query = generateToolsSQLQuery();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(query);
      setSqlCopied(true);
      showToast('Supabase SQL query copied to clipboard!', 'success');
      setTimeout(() => setSqlCopied(false), 3000);
    } else {
      showToast('Could not access clipboard automatically. Please copy the text below.', 'error');
    }
  };

  const toolsSQL = useMemo(() => generateToolsSQLQuery(), []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                <Wrench size={22} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                  Tools & Categories Manager
                </h2>
                <p className="text-xs text-zinc-400">
                  Manage categories with icons, add/edit/delete tools, update actions, and run live database sync.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={subTab === 'categories' ? handleOpenAddCategory : handleOpenAddTool}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>{subTab === 'categories' ? 'New Category' : 'New Tool'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Total Tools</span>
            <div className="text-2xl font-black text-white">{tools.length}</div>
            <span className="text-[10px] text-zinc-400 font-medium">Configured Items</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Active Tools</span>
            <div className="text-2xl font-black text-emerald-400">
              {tools.filter(t => t.is_active !== false).length}
            </div>
            <span className="text-[10px] text-emerald-400/80 font-medium">Live on Site</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Categories</span>
            <div className="text-2xl font-black text-orange-400">{toolCategories.length}</div>
            <span className="text-[10px] text-zinc-400 font-medium">Icon Groupings</span>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-2xl p-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Database State</span>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isFromDB ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-sm uppercase tracking-wide">{isFromDB ? 'Supabase Live' : 'Local Cache'}</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">Auto-fallback enabled</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Tools vs Categories vs SQL */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 bg-[#121319] border border-white/10 rounded-2xl">
          <button
            onClick={() => setSubTab('items')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'items'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench size={14} />
            <span>Tools List ({tools.length})</span>
          </button>

          <button
            onClick={() => setSubTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'categories'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers size={14} />
            <span>Categories ({toolCategories.length})</span>
          </button>

          <button
            onClick={() => setSubTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'settings'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders size={14} />
            <span>Page Settings</span>
          </button>
        </div>

        {subTab === 'items' && (
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tools by title, category, badge..."
              className="w-full bg-[#14151f] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* SUBTAB 1: TOOLS LIST */}
      {subTab === 'items' && (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-orange-500 text-black shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              All Tools ({tools.length})
            </button>
            {toolCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id || selectedCategory === cat.name
                    ? 'bg-orange-500 text-black shadow-md'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                }`}
              >
                <ToolIcon name={cat.icon} fallbackEmoji={cat.emoji} size={13} />
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">
                  ({tools.filter(t => t.category_id === cat.id || t.category_name.toLowerCase() === cat.name.toLowerCase()).length})
                </span>
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          {filteredTools.length === 0 ? (
            <div className="text-center py-16 bg-[#121319] border border-white/10 rounded-2xl p-6">
              <Wrench className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-white font-bold text-sm">No tools found matching your filters</p>
              <p className="text-zinc-500 text-xs mt-1">Try clearing your search query or click &quot;New Tool&quot; to add one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => {
                return (
                  <div
                    key={tool.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      tool.is_active
                        ? 'bg-[#14151f] border-white/10 hover:border-orange-500/40 shadow-lg'
                        : 'bg-[#0f1015] border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      {/* Top bar with icon & status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.gradient || 'from-orange-500 to-amber-500'} flex items-center justify-center text-white shrink-0 shadow-md relative overflow-hidden`}>
                          {tool.logo_url ? (
                            <img src={tool.logo_url} alt={tool.title} className="w-full h-full object-cover" />
                          ) : (
                            <ToolIcon name={tool.icon} size={22} className="text-white drop-shadow" />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {tool.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              {tool.badge}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            tool.is_active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-500/20 text-zinc-400'
                          }`}>
                            {tool.is_active ? 'Live' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <h4 className="font-bold text-white text-base tracking-tight mb-1 flex items-center gap-1.5">
                        <span>{tool.title}</span>
                      </h4>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] text-zinc-400 font-mono uppercase bg-white/5 px-2 py-0.5 rounded">
                          {tool.category_name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Order: #{tool.display_order}
                        </span>
                      </div>

                      <p className="text-zinc-400 text-xs line-clamp-2 mb-3">
                        {tool.description || 'No description provided.'}
                      </p>

                      <div className="text-[11px] font-mono text-zinc-500 truncate mb-4 flex items-center gap-1.5">
                        <span className="text-zinc-400">Target:</span>
                        <span className="text-orange-400 truncate">{tool.url || tool.modal_target || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleToolActive(tool)}
                          className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                            tool.is_active
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              : 'bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 border-white/10'
                          }`}
                          title={tool.is_active ? 'Hide tool from visitors' : 'Show tool to visitors'}
                        >
                          {tool.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleToolFeatured(tool)}
                          className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                            tool.is_featured
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/40 shadow-sm'
                              : 'bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-amber-400 border-white/10'
                          }`}
                          title={tool.is_featured ? 'Pinned in Featured spotlight' : 'Pin to Featured spotlight'}
                        >
                          <Star size={14} className={tool.is_featured ? 'fill-amber-400' : ''} />
                        </button>

                        {tool.url && !tool.url.startsWith('#') && (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                            title="Test open link"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditTool(tool)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} className="text-orange-400" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteToolCandidate(tool)}
                          className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-colors cursor-pointer"
                          title="Delete tool"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: CATEGORIES LIST */}
      {subTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Tool Categories with Icons & Colors ({toolCategories.length})
            </h3>
            <button
              onClick={handleOpenAddCategory}
              className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus size={14} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolCategories.map(cat => {
              const linkedCount = tools.filter(
                t => t.category_id === cat.id || t.category_name.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
                <div
                  key={cat.id}
                  className="p-5 bg-[#14151f] border border-white/10 rounded-2xl flex flex-col justify-between hover:border-orange-500/40 transition-colors shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color || 'from-purple-500 to-pink-500'} flex items-center justify-center text-white shrink-0 shadow-md`}>
                        <ToolIcon name={cat.icon} fallbackEmoji={cat.emoji} size={22} className="text-white drop-shadow" />
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10">
                        {linkedCount} tools
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base tracking-tight mb-1 flex items-center gap-2">
                      <span>{cat.name}</span>
                      {cat.emoji && <span>{cat.emoji}</span>}
                    </h4>

                    <div className="text-[10px] font-mono text-zinc-500 mb-2">
                      Slug: {cat.slug} | Order: #{cat.display_order}
                    </div>

                    <p className="text-zinc-400 text-xs line-clamp-2 mb-4">
                      {cat.description || 'Category for organizing tools.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 size={13} className="text-orange-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteCategoryCandidate(cat)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: TOOLS PAGE SETTINGS */}
      {subTab === 'settings' && (
        <form onSubmit={handleSavePageSettings} className="space-y-6">
          {/* Header Action Strip */}
          <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono uppercase tracking-widest mb-2">
                <Sliders size={13} />
                <span>Live Page Configuration</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Tools Page UX & Content Controls
              </h3>
              <p className="text-xs text-zinc-400">
                Customize the hero headlines, announcement ticker, spotlight section, layouts, and call-to-action banner.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/#tools-page"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Preview Page</span>
              </a>

              <button
                type="button"
                onClick={handleResetPageSettings}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSavingSettings ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                <span>{isSavingSettings ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>

          {/* Section 1: Hero & Announcements */}
          <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles size={16} className="text-orange-400" />
              <span>Hero Header & Branding</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Page Headline Title
                </label>
                <input
                  type="text"
                  value={pageSettings.page_title}
                  onChange={e => setPageSettings({ ...pageSettings, page_title: e.target.value })}
                  placeholder="Explore All Tools & Utilities"
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Hero Badge Pill Text
                </label>
                <input
                  type="text"
                  value={pageSettings.badge_text}
                  onChange={e => setPageSettings({ ...pageSettings, badge_text: e.target.value })}
                  placeholder="Dynamic Tools Engine"
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Page Subtitle Description
              </label>
              <textarea
                rows={2}
                value={pageSettings.page_subtitle}
                onChange={e => setPageSettings({ ...pageSettings, page_subtitle: e.target.value })}
                placeholder="Instant access to AI predictors, developer portals, free coding repos..."
                className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            {/* Announcement bar control */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageSettings.show_announcement}
                    onChange={e => setPageSettings({ ...pageSettings, show_announcement: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-zinc-300">Show Top Announcement Ticker Bar</span>
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Animated notification banner at top of page</span>
              </div>

              {pageSettings.show_announcement && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Announcement Ticker Text
                  </label>
                  <input
                    type="text"
                    value={pageSettings.announcement_text}
                    onChange={e => setPageSettings({ ...pageSettings, announcement_text: e.target.value })}
                    placeholder="🔥 Live Update: New AI predictors, free source repos & web utilities updated today!"
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: UX & Layout Controls */}
          <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-orange-400" />
              <span>Layout & Interaction Options</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Default View Mode
                </label>
                <select
                  value={pageSettings.default_view_mode}
                  onChange={e => setPageSettings({ ...pageSettings, default_view_mode: e.target.value as 'grid' | 'compact' })}
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="grid">Grid Mode (Rich Cards with Big Icons)</option>
                  <option value="compact">Compact Mode (Sleek List Rows)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Featured Spotlight Section Heading
                </label>
                <input
                  type="text"
                  value={pageSettings.featured_section_title}
                  onChange={e => setPageSettings({ ...pageSettings, featured_section_title: e.target.value })}
                  placeholder="Featured & Staff Picks"
                  className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5">
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={pageSettings.show_featured_section}
                  onChange={e => setPageSettings({ ...pageSettings, show_featured_section: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Enable Featured Spotlight Section</span>
                  <span className="text-[10px] text-zinc-400">Shows pinned top tools in a dedicated showcase</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={pageSettings.enable_favorites}
                  onChange={e => setPageSettings({ ...pageSettings, enable_favorites: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Enable User Favorites (Bookmarking)</span>
                  <span className="text-[10px] text-zinc-400">Allows visitors to star/favorite tools to browser storage</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={pageSettings.enable_copy_link}
                  onChange={e => setPageSettings({ ...pageSettings, enable_copy_link: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Enable 1-Click Copy Link Buttons</span>
                  <span className="text-[10px] text-zinc-400">Allows visitors to copy direct URLs with instant feedback</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={pageSettings.show_categories_count}
                  onChange={e => setPageSettings({ ...pageSettings, show_categories_count: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Show Tool Count on Category Chips</span>
                  <span className="text-[10px] text-zinc-400">Displays numerical badge on each category filter</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Custom Call-to-Action Banner */}
          <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Compass size={16} className="text-orange-400" />
                <span>Bottom Call-to-Action Banner</span>
              </h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pageSettings.show_cta_banner}
                  onChange={e => setPageSettings({ ...pageSettings, show_cta_banner: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                />
                <span className="text-xs font-bold text-zinc-300">Show CTA Banner</span>
              </label>
            </div>

            {pageSettings.show_cta_banner && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Banner Heading
                    </label>
                    <input
                      type="text"
                      value={pageSettings.cta_banner_title}
                      onChange={e => setPageSettings({ ...pageSettings, cta_banner_title: e.target.value })}
                      placeholder="Need a bespoke custom tool or API?"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={pageSettings.cta_banner_button_text}
                      onChange={e => setPageSettings({ ...pageSettings, cta_banner_button_text: e.target.value })}
                      placeholder="Explore Plans"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Banner Subtitle Description
                  </label>
                  <input
                    type="text"
                    value={pageSettings.cta_banner_subtitle}
                    onChange={e => setPageSettings({ ...pageSettings, cta_banner_subtitle: e.target.value })}
                    placeholder="Request custom automation, calculators, scrapers, or AI apps built specifically for you."
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Button Action Type
                    </label>
                    <select
                      value={pageSettings.cta_banner_action_type}
                      onChange={e => setPageSettings({ ...pageSettings, cta_banner_action_type: e.target.value as 'modal' | 'url' })}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="modal">Trigger Modal Window</option>
                      <option value="url">Open External URL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Action Target ({pageSettings.cta_banner_action_type === 'modal' ? 'Modal Key' : 'URL'})
                    </label>
                    {pageSettings.cta_banner_action_type === 'modal' ? (
                      <select
                        value={pageSettings.cta_banner_target}
                        onChange={e => setPageSettings({ ...pageSettings, cta_banner_target: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="website_plans">Website Plans Modal</option>
                        <option value="source_code">Source Code Vault Modal</option>
                        <option value="hacks">Dev Hacks Modal</option>
                        <option value="free_courses">Free Courses Modal</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={pageSettings.cta_banner_target}
                        onChange={e => setPageSettings({ ...pageSettings, cta_banner_target: e.target.value })}
                        placeholder="https://wa.me/..."
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Live Stats Display Counters */}
          <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Radio size={16} className="text-emerald-400" />
              <span>Live Quick Metric Cards</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 p-3 bg-white/5 rounded-2xl">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Metric 1 (Value &amp; Label)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageSettings.quick_stat_1_val}
                    onChange={e => setPageSettings({ ...pageSettings, quick_stat_1_val: e.target.value })}
                    placeholder="15+"
                    className="w-20 bg-[#181a24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold text-center"
                  />
                  <input
                    type="text"
                    value={pageSettings.quick_stat_1_label}
                    onChange={e => setPageSettings({ ...pageSettings, quick_stat_1_label: e.target.value })}
                    placeholder="Verified Tools"
                    className="flex-1 bg-[#181a24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 bg-white/5 rounded-2xl">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Metric 2 (Value &amp; Label)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageSettings.quick_stat_2_val}
                    onChange={e => setPageSettings({ ...pageSettings, quick_stat_2_val: e.target.value })}
                    placeholder="100%"
                    className="w-20 bg-[#181a24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold text-center"
                  />
                  <input
                    type="text"
                    value={pageSettings.quick_stat_2_label}
                    onChange={e => setPageSettings({ ...pageSettings, quick_stat_2_label: e.target.value })}
                    placeholder="Free & Safe"
                    className="flex-1 bg-[#181a24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3 bg-white/5 rounded-2xl">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Metric 3 (Value &amp; Label)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pageSettings.quick_stat_3_val}
                    onChange={e => setPageSettings({ ...pageSettings, quick_stat_3_val: e.target.value })}
                    placeholder="24/7"
                    className="w-20 bg-[#181a24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold text-center"
                  />
                  <input
                    type="text"
                    value={pageSettings.quick_stat_3_label}
                    onChange={e => setPageSettings({ ...pageSettings, quick_stat_3_label: e.target.value })}
                    placeholder="Cloud Active"
                    className="flex-1 bg-[#181a24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between p-4 bg-[#121319] border border-white/10 rounded-2xl">
            <span className="text-xs text-zinc-400">
              Settings are saved to both Supabase cloud and instant local state.
            </span>
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingSettings ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
              <span>{isSavingSettings ? 'Saving...' : 'Save & Publish All Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ADD / EDIT TOOL MODAL */}
      <AnimatePresence>
        {(isAddToolModalOpen || isEditToolModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-[#12131a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Wrench size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                    {isEditToolModalOpen ? 'Edit Tool' : 'Add New Tool'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsAddToolModalOpen(false);
                    setIsEditToolModalOpen(false);
                    setEditingTool(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveTool} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Tool Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={toolFormData.title}
                    onChange={e => setToolFormData({ ...toolFormData, title: e.target.value })}
                    placeholder="e.g. Wingo AI Predictor, API Console, Mod APKs..."
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Category *
                    </label>
                    <select
                      value={toolFormData.category_id}
                      onChange={e => {
                        const selCat = toolCategories.find(c => c.id === e.target.value);
                        setToolFormData({
                          ...toolFormData,
                          category_id: e.target.value,
                          category_name: selCat ? selCat.name : toolFormData.category_name
                        });
                      }}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {toolCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji ? `${cat.emoji} ` : ''}{cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Badge / Tag (e.g. HOT, NEW, AI 99%)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={toolFormData.badge || ''}
                        onChange={e => setToolFormData({ ...toolFormData, badge: e.target.value })}
                        placeholder="HOT, FREE, AI 99%..."
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Popular Badges Quick Select */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-zinc-500">Presets:</span>
                  {POPULAR_BADGES.map(badge => (
                    <button
                      type="button"
                      key={badge}
                      onClick={() => setToolFormData({ ...toolFormData, badge })}
                      className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/5 hover:bg-white/10 text-zinc-300"
                    >
                      {badge}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setToolFormData({ ...toolFormData, badge: '' })}
                    className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-500/10 text-rose-400"
                  >
                    Clear
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Target URL or Action *
                  </label>
                  <input
                    type="text"
                    required
                    value={toolFormData.url}
                    onChange={e => setToolFormData({ ...toolFormData, url: e.target.value })}
                    placeholder="https://example.com, /admin, or #website-plans"
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Action Type
                    </label>
                    <select
                      value={toolFormData.action_type}
                      onChange={e => setToolFormData({ 
                        ...toolFormData, 
                        action_type: e.target.value as 'external_url' | 'internal_route' | 'modal_action' 
                      })}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="external_url">External Website Link</option>
                      <option value="internal_route">Internal Route (/admin)</option>
                      <option value="modal_action">Trigger Modal Window</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Icon Name or Emoji
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <ToolIcon name={toolFormData.icon} size={18} />
                      </div>
                      <input
                        type="text"
                        value={toolFormData.icon}
                        onChange={e => setToolFormData({ ...toolFormData, icon: e.target.value })}
                        placeholder="Sparkles, Code, Download, Gamepad2, Wrench, 🔮..."
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Popular Icon chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-zinc-500">Quick Icons:</span>
                  {['Sparkles', 'Code', 'Download', 'Gamepad2', 'Video', 'Film', 'Plane', 'DollarSign', 'Globe', 'Zap', 'BookOpen', 'Shield', 'Wrench', 'MessageSquare'].map(ic => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setToolFormData({ ...toolFormData, icon: ic })}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 hover:bg-white/10 text-zinc-300"
                    >
                      <ToolIcon name={ic} size={10} />
                      <span>{ic}</span>
                    </button>
                  ))}
                </div>

                {/* ======================================================== */}
                {/* TOOL LOGO IMAGE & MOBILE APP ICON STUDIO (CROP & FIT) */}
                {/* ======================================================== */}
                <div className="bg-[#141522] border border-orange-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <ImageIcon size={15} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-white">
                          Custom Logo Image &amp; App Icon
                        </h4>
                        <p className="text-[10px] text-zinc-400">
                          Use custom PNG, SVG, or JPEG logo for the mobile home screen squircle!
                        </p>
                      </div>
                    </div>

                    {toolFormData.logo_url && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Custom Logo Active
                      </span>
                    )}
                  </div>

                  {/* Image URL input + Upload File button */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={toolFormData.logo_url || ''}
                        onChange={e => {
                          setToolFormData({ ...toolFormData, logo_url: e.target.value });
                          handleResetLogoCrop();
                        }}
                        placeholder="Paste image URL (https://... png, svg, jpg) or upload below..."
                        className="flex-1 bg-[#181a24] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                      />

                      {/* File Upload Button */}
                      <label className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                        <Upload size={14} className="text-orange-400" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>

                      {toolFormData.logo_url && (
                        <button
                          type="button"
                          onClick={() => setToolFormData({ ...toolFormData, logo_url: '' })}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs cursor-pointer"
                          title="Remove custom logo"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Logo Quick Presets */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-zinc-500">Logo Presets:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setToolFormData({ ...toolFormData, logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' });
                          handleResetLogoCrop();
                        }}
                        className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/5"
                      >
                        React
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setToolFormData({ ...toolFormData, logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-plain.svg' });
                          handleResetLogoCrop();
                        }}
                        className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/5"
                      >
                        Android APK
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setToolFormData({ ...toolFormData, logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' });
                          handleResetLogoCrop();
                        }}
                        className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 hover:bg-white/10 text-yellow-400 border border-white/5"
                      >
                        Python AI
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setToolFormData({ ...toolFormData, logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' });
                          handleResetLogoCrop();
                        }}
                        className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 hover:bg-white/10 text-orange-400 border border-white/5"
                      >
                        Git Source
                      </button>
                    </div>
                  </div>

                  {/* Interactive Crop & Position Adjuster (Shown when logo_url exists) */}
                  {toolFormData.logo_url && (
                    <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        {/* Live Squircle App Icon Preview */}
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="relative">
                            {/* Realistic Phone Squircle Preview Container */}
                            <div className={`w-20 h-20 rounded-[26px] bg-gradient-to-tr ${toolFormData.gradient || 'from-orange-500 to-amber-500'} shadow-2xl border border-white/30 relative overflow-hidden flex items-center justify-center`}>
                              {/* Glossy Reflection Highlight */}
                              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[26px] pointer-events-none z-20" />

                              {/* Adjusted Logo Image */}
                              <div
                                style={{
                                  padding: `${logoPadding}px`,
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <img
                                  src={toolFormData.logo_url}
                                  alt="Preview"
                                  style={{
                                    transform: `scale(${logoZoom / 100}) translate(${logoOffsetX}%, ${logoOffsetY}%)`,
                                    objectFit: logoFit,
                                    width: '100%',
                                    height: '100%',
                                    transition: 'transform 0.05s linear'
                                  }}
                                  className="relative z-10 select-none pointer-events-none drop-shadow-md"
                                />
                              </div>
                            </div>

                            {/* Live Badge Preview */}
                            {toolFormData.badge && (
                              <div className="absolute -top-1.5 -right-1.5 z-30 px-1.5 py-0.5 min-w-[20px] h-[20px] rounded-full bg-rose-600 text-white text-[9px] font-black uppercase flex items-center justify-center shadow-lg border border-black animate-pulse">
                                {toolFormData.badge}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">Mobile Home Preview</span>
                        </div>

                        {/* Interactive Sliders & Fit Controls */}
                        <div className="flex-1 w-full space-y-3 text-xs">
                          {/* Zoom Slider */}
                          <div>
                            <div className="flex justify-between text-[11px] font-bold text-zinc-400 mb-1">
                              <span>Zoom / Scale</span>
                              <span className="text-orange-400 font-mono">{logoZoom}%</span>
                            </div>
                            <input
                              type="range"
                              min="40"
                              max="250"
                              value={logoZoom}
                              onChange={e => setLogoZoom(Number(e.target.value))}
                              className="w-full accent-orange-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                            />
                          </div>

                          {/* Pan X and Pan Y */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
                                <span>Pan Horizontal (X)</span>
                                <span className="font-mono text-zinc-300">{logoOffsetX}%</span>
                              </div>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={logoOffsetX}
                                onChange={e => setLogoOffsetX(Number(e.target.value))}
                                className="w-full accent-orange-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
                                <span>Pan Vertical (Y)</span>
                                <span className="font-mono text-zinc-300">{logoOffsetY}%</span>
                              </div>
                              <input
                                type="range"
                                min="-50"
                                max="50"
                                value={logoOffsetY}
                                onChange={e => setLogoOffsetY(Number(e.target.value))}
                                className="w-full accent-orange-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Fit Mode & Padding */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-zinc-400">Fit Mode:</span>
                              {(['contain', 'cover', 'fill'] as const).map(mode => (
                                <button
                                  type="button"
                                  key={mode}
                                  onClick={() => setLogoFit(mode)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                                    logoFit === mode
                                      ? 'bg-orange-500 text-black'
                                      : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                                  }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-zinc-400">Padding:</span>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                value={logoPadding}
                                onChange={e => setLogoPadding(Number(e.target.value))}
                                className="w-20 accent-orange-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                              />
                              <span className="text-[10px] font-mono text-zinc-400">{logoPadding}px</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bake Crop Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleBakeCropCanvas}
                            disabled={isBakingCrop}
                            className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Crop size={13} />
                            <span>{isBakingCrop ? 'Baking...' : 'Bake & Save Cropped Icon'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResetLogoCrop}
                            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <RotateCcw size={12} />
                            <span>Reset</span>
                          </button>
                        </div>

                        <span className="text-[10px] text-zinc-500">
                          Icon is previewed live and will save on submit!
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Description / Purpose
                  </label>
                  <textarea
                    rows={2}
                    value={toolFormData.description}
                    onChange={e => setToolFormData({ ...toolFormData, description: e.target.value })}
                    placeholder="Brief description of how this tool helps users or what it does..."
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Gradient Accent
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GRADIENT_OPTIONS.map(opt => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setToolFormData({ ...toolFormData, gradient: opt.value })}
                        className={`h-8 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase text-white bg-gradient-to-r ${opt.value} transition-transform ${
                          toolFormData.gradient === opt.value ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {toolFormData.gradient === opt.value && <Check size={12} />}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Display Order #
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={toolFormData.display_order}
                      onChange={e => setToolFormData({ ...toolFormData, display_order: Number(e.target.value) || 1 })}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-6 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={toolFormData.is_active}
                        onChange={e => setToolFormData({ ...toolFormData, is_active: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-xs font-bold text-zinc-300">Set as Active</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={toolFormData.is_featured || false}
                        onChange={e => setToolFormData({ ...toolFormData, is_featured: e.target.checked })}
                        className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-xs font-bold text-orange-400 flex items-center gap-1">
                        <Star size={12} className="fill-orange-400 text-orange-400" />
                        <span>Featured Spotlight</span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddToolModalOpen(false);
                      setIsEditToolModalOpen(false);
                      setEditingTool(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
                    <span>{isEditToolModalOpen ? 'Update Tool' : 'Save Tool'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT CATEGORY MODAL */}
      <AnimatePresence>
        {(isAddCategoryModalOpen || isEditCategoryModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#12131a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <Layers size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                    {isEditCategoryModalOpen ? 'Edit Category' : 'New Category'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setIsAddCategoryModalOpen(false);
                    setIsEditCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryFormData.name}
                    onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    placeholder="e.g. AI & Predictors, Gaming, Web Utilities..."
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Slug Identifier
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.slug}
                      onChange={e => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                      placeholder="e.g. ai-tools"
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Emoji Icon
                    </label>
                    <input
                      type="text"
                      value={categoryFormData.emoji || ''}
                      onChange={e => setCategoryFormData({ ...categoryFormData, emoji: e.target.value })}
                      placeholder="🔮, 💻, 🎮, 📥, 📚..."
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 text-center text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Lucide Icon Name
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <ToolIcon name={categoryFormData.icon} fallbackEmoji={categoryFormData.emoji} size={18} />
                    </div>
                    <input
                      type="text"
                      value={categoryFormData.icon}
                      onChange={e => setCategoryFormData({ ...categoryFormData, icon: e.target.value })}
                      placeholder="Sparkles, Code, Gamepad2, Download, BookOpen, Globe..."
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={categoryFormData.description || ''}
                    onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    placeholder="Short description of what tools fall into this category..."
                    className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    Color Accent
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GRADIENT_OPTIONS.slice(0, 6).map(opt => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setCategoryFormData({ ...categoryFormData, color: opt.value })}
                        className={`h-8 rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase text-white bg-gradient-to-r ${opt.value} transition-transform ${
                          categoryFormData.color === opt.value ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {categoryFormData.color === opt.value && <Check size={12} />}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddCategoryModalOpen(false);
                      setIsEditCategoryModalOpen(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
                    <span>{isEditCategoryModalOpen ? 'Update Category' : 'Save Category'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE TOOL CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteToolCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#12131a] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Tool</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Are you sure you want to delete <span className="text-white font-bold">&quot;{deleteToolCandidate.title}&quot;</span>? This will remove it from the Tools page.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteToolCandidate(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteTool}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CATEGORY CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteCategoryCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#12131a] border border-white/10 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Category</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Are you sure you want to delete category <span className="text-white font-bold">&quot;{deleteCategoryCandidate.name}&quot;</span>? Any tools assigned to this category will become unassigned.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteCategoryCandidate(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteCategory}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
