import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wrench, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Lock,
  Compass,
  Star,
  Copy,
  Check,
  Flame,
  LayoutGrid,
  ListFilter,
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
  Radio,
  Share2,
  Smartphone,
  Wifi,
  Battery,
  BatteryCharging,
  Calendar,
  Sliders,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';
import { SiWhatsapp, SiTiktok, SiYoutube, SiTelegram, SiInstagram } from 'react-icons/si';
import Link from 'next/link';
import ToolIcon from './ToolIcon';
import { recordToolClick } from '../lib/analyticsService';
import { 
  ToolItem, 
  ToolCategory, 
  ToolPageSettings,
  fetchToolsFromDB, 
  fetchToolCategoriesFromDB,
  fetchToolPageSettingsFromDB,
  DEFAULT_TOOLS,
  DEFAULT_TOOL_CATEGORIES,
  DEFAULT_TOOL_PAGE_SETTINGS
} from '../lib/toolsService';

interface ToolsPageProps {
  onClose: () => void;
  onOpenSourceCode: () => void;
  onOpenFreeCourses: () => void;
  onOpenHacks: () => void;
  onOpenWebsitePlans: () => void;
}

const FAVORITES_STORAGE_KEY = 'saqib_tool_favorites_v1';

export default function ToolsPage({ 
  onClose, 
  onOpenSourceCode, 
  onOpenFreeCourses, 
  onOpenHacks, 
  onOpenWebsitePlans 
}: ToolsPageProps) {
  const [tools, setTools] = useState<ToolItem[]>(DEFAULT_TOOLS);
  const [categories, setCategories] = useState<ToolCategory[]>(DEFAULT_TOOL_CATEGORIES);
  const [settings, setSettings] = useState<ToolPageSettings>(DEFAULT_TOOL_PAGE_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  // Default view is the requested mobile phone home screen!
  const [viewMode, setViewMode] = useState<'phone' | 'grid' | 'compact'>('phone');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState<boolean>(true);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [showWhatsappPopup, setShowWhatsappPopup] = useState<boolean>(false);
  
    useEffect(() => {
    if (settings.whatsapp_popup_enabled && settings.whatsapp_channel_link) {
      const timer = setTimeout(() => {
        setShowWhatsappPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [settings]);

  const dismissWhatsappPopup = () => {
    setShowWhatsappPopup(false);
  };
  
  // Mobile home screen states
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [selectedAppForSheet, setSelectedAppForSheet] = useState<ToolItem | null>(null);
  const [isPhoneFrameCentered, setIsPhoneFrameCentered] = useState<boolean>(false);

  // Live Clock for Mobile Home Screen
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load favorites from local storage on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse favorites:', e);
    }
  }, []);

  // Scroll to top and fetch data on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    async function loadData() {
      setLoading(true);
      try {
        const [toolsRes, catRes, settingsRes] = await Promise.all([
          fetchToolsFromDB(),
          fetchToolCategoriesFromDB(),
          fetchToolPageSettingsFromDB()
        ]);

        if (toolsRes.tools && toolsRes.tools.length > 0) {
          setTools(toolsRes.tools.filter(t => t.is_active !== false));
        }
        if (catRes.categories && catRes.categories.length > 0) {
          setCategories(catRes.categories.filter(c => c.is_active !== false));
        }
        if (settingsRes.settings) {
          setSettings(settingsRes.settings);
        }
      } catch (err) {
        console.warn('Failed to load tools dynamically:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (toolId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setFavorites(prev => {
      const next = prev.includes(toolId) 
        ? prev.filter(id => id !== toolId) 
        : [...prev, toolId];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to write favorites:', err);
      }
      return next;
    });
  };

  // Copy link handler
  const handleCopyLink = (tool: ToolItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const targetUrl = tool.url.startsWith('http') 
      ? tool.url 
      : `${typeof window !== 'undefined' ? window.location.origin : ''}${tool.url}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl);
      setCopiedId(tool.id);
      setCopiedToast(`Copied link for "${tool.title}"!`);
      setTimeout(() => {
        setCopiedId(null);
        setCopiedToast(null);
      }, 2500);
    }
  };

  // Filter tools based on category, favorites, and search query
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // Category / Filter check
      if (selectedCategory === 'Favorites') {
        if (!favorites.includes(tool.id)) return false;
      } else if (selectedCategory === 'Featured') {
        if (!tool.is_featured) return false;
      } else if (selectedCategory !== 'All') {
        const matchesCat =
          tool.category_id === selectedCategory ||
          tool.category_name.toLowerCase() === selectedCategory.toLowerCase();
        if (!matchesCat) return false;
      }

      // Search query check
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;

      return (
        tool.title.toLowerCase().includes(query) ||
        (tool.description && tool.description.toLowerCase().includes(query)) ||
        (tool.badge && tool.badge.toLowerCase().includes(query)) ||
        tool.category_name.toLowerCase().includes(query)
      );
    });
  }, [tools, selectedCategory, searchQuery, favorites]);

  // Featured spotlight tools
  const featuredTools = useMemo(() => {
    return tools.filter(t => t.is_featured && t.is_active !== false);
  }, [tools]);

  // Handle action execution for different tool types
  const handleToolClick = (tool: ToolItem, e?: React.MouseEvent) => {
    // Record analytics for tool visit / click in Supabase
    recordToolClick({
      id: tool.id,
      name: tool.title,
      category: tool.category_name
    });

    if (tool.action_type === 'modal_action') {
      if (e) e.preventDefault();
      switch (tool.modal_target) {
        case 'website_plans':
          onOpenWebsitePlans();
          break;
        case 'hacks':
          onOpenHacks();
          break;
        case 'source_code':
          onOpenSourceCode();
          break;
        case 'free_courses':
          onOpenFreeCourses();
          break;
        default:
          break;
      }
      return;
    }

    // In Phone view, show App Preview Sheet for rich mobile feel
    if (viewMode === 'phone' && !tool.url.startsWith('#')) {
      if (e) e.preventDefault();
      setSelectedAppForSheet(tool);
      return;
    }
  };

  // Handle banner action
  const handleBannerAction = () => {
    if (settings.cta_banner_action_type === 'modal') {
      switch (settings.cta_banner_target) {
        case 'website_plans':
          onOpenWebsitePlans();
          break;
        case 'source_code':
          onOpenSourceCode();
          break;
        case 'hacks':
          onOpenHacks();
          break;
        case 'free_courses':
          onOpenFreeCourses();
          break;
        default:
          onOpenWebsitePlans();
          break;
      }
    } else if (settings.cta_banner_target) {
      window.open(settings.cta_banner_target, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-[#08090e] text-white overflow-y-auto selection:bg-orange-500 selection:text-black"
    >
      {/* Dynamic Background Ambient Light Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-orange-500/15 via-purple-600/10 to-transparent blur-[140px] opacity-70" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 -left-40 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      </div>

      {/* Floating Copied Toast Alert */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-black px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-emerald-400"
          >
            <Check size={16} />
            <span>{copiedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#08090e]/85 backdrop-blur-xl border-b border-white/10 px-2 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Back Button */}
          <button 
            onClick={onClose}
            className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* View Mode Switcher Pills (Highlighting Mobile Home Screen!) */}
          <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-black/50 border border-white/10 rounded-2xl shadow-inner shrink-0">
            <button
              onClick={() => setViewMode('phone')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'phone'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/25 scale-102'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Mobile Home Screen App Launcher"
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Mobile Apps</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Classic Cards View"
            >
              <LayoutGrid size={14} />
              <span className="hidden sm:inline">Cards</span>
            </button>

            <button
              onClick={() => setViewMode('compact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Compact List"
            >
              <ListFilter size={14} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Favorites Trigger */}
            {settings.enable_favorites && (
              <button
                onClick={() => setSelectedCategory(selectedCategory === 'Favorites' ? 'All' : 'Favorites')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === 'Favorites'
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10'
                }`}
                title="View Favorites"
              >
                <Star size={14} className={selectedCategory === 'Favorites' ? 'fill-black' : 'text-amber-400'} />
                <span className="hidden sm:inline">Favorites</span>
                <span className="text-xs px-1.5 py-0.2 rounded-md bg-black/20 font-bold">
                  {favorites.length}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Announcement Bar */}
      {settings.show_announcement && showAnnouncement && settings.announcement_text && (
        
          <div className="relative z-20 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-orange-500/20 border-b border-orange-500/20 px-4 py-2.5 backdrop-blur-md overflow-hidden">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(100%); }
                100% { transform: translateX(-100%); }
              }
              .animate-marquee-slow { animation: marquee 30s linear infinite; }
              .animate-marquee-normal { animation: marquee 20s linear infinite; }
              .animate-marquee-fast { animation: marquee 10s linear infinite; }
            `}</style>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2 overflow-hidden flex-1 relative">
                <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/30 text-orange-400 z-10 relative">
                  <Flame size={12} />
                </span>
                
                <div className="flex-1 overflow-hidden relative" style={{ height: '18px' }}>
                  <p className={`absolute whitespace-nowrap ${
                    !settings.announcement_speed || settings.announcement_speed === 'static' 
                      ? 'relative truncate' 
                      : settings.announcement_speed === 'slow'
                        ? 'animate-marquee-slow'
                        : settings.announcement_speed === 'fast'
                          ? 'animate-marquee-fast'
                          : 'animate-marquee-normal'
                  } text-xs ${settings.announcement_color || 'text-orange-200'} ${settings.announcement_font || 'font-medium'}`}>
                    {settings.announcement_text}
                  </p>
                </div>
              </div>

            <button
              onClick={() => setShowAnnouncement(false)}
              className="shrink-0 p-1 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: MOBILE HOME SCREEN APP LAUNCHER (Requested by User) */}
      {/* ========================================================================= */}
      {viewMode === 'phone' && (
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-4 pb-32">
          {/* SEO-only: hidden from UI, readable by Googlebot */}
          <div className="sr-only">
            <h2>Muhammad Saqib Tools & Utilities OS</h2>
            <p>System Installed: {tools.length} Apps Ready. 100% Free, Verified Safe, Fast Launch. All Cloud Services Operational.</p>
          </div>

          {/* Main Mobile Screen — no outer border/frame on mobile */}
          <div className="relative p-4 sm:bg-gradient-to-b sm:from-[#131525]/90 sm:via-[#0e101c]/95 sm:to-[#08090f] sm:rounded-[48px] sm:border sm:border-white/20 sm:p-7 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] sm:overflow-hidden">
            
            {/* Top Status Bar — hidden on mobile to save space */}
            <div className="hidden sm:flex items-center justify-between text-xs font-semibold px-2 sm:px-4 pt-1 pb-4 border-b border-white/5">
              {/* Left: Clock */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black tracking-tight text-white">{currentTime}</span>
                <span className="text-[10px] text-zinc-400 font-medium">{currentDate}</span>
              </div>

              {/* Center: Dynamic Island Pill */}
              <div className="group relative flex items-center gap-2 px-3 py-1 bg-black/90 border border-white/15 rounded-full shadow-inner cursor-pointer transition-transform hover:scale-105">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 font-bold">
                  Saqib OS
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>

              {/* Right: Signal, Wifi, Battery */}
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-[10px] font-bold font-mono">5G</span>
                <Wifi size={14} className="text-zinc-200" />
                <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  <span className="text-[10px] font-mono font-bold text-emerald-400">100%</span>
                  <BatteryCharging size={13} className="text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Spotlight Search Bar */}
            <div className="relative mb-6">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search apps, tools, calculators, AI utilities..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 text-white text-xs sm:text-sm placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* App Category / Folder Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'All'
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                }`}
              >
                All Apps ({tools.length})
              </button>

              <button
                onClick={() => setSelectedCategory('Featured')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === 'Featured'
                    ? 'bg-orange-500 text-black shadow-md font-black'
                    : 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20'
                }`}
              >
                <Flame size={12} />
                <span>Featured</span>
              </button>

              {favorites.length > 0 && (
                <button
                  onClick={() => setSelectedCategory('Favorites')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    selectedCategory === 'Favorites'
                      ? 'bg-amber-400 text-black shadow-md font-black'
                      : 'bg-amber-400/10 text-amber-300 hover:bg-amber-400/20'
                  }`}
                >
                  <Star size={12} className="fill-current" />
                  <span>Favorites ({favorites.length})</span>
                </button>
              )}

              {categories.map(cat => {
                const isSelected = selectedCategory === cat.id || selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-white text-black shadow-md'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* ========================================== */}
            {/* APP ICONS GRID (Mobile App Launcher Grid) */}
            {/* ========================================== */}
            {filteredTools.length === 0 ? (
              <div className="text-center py-16 text-zinc-400">
                <Search size={32} className="mx-auto mb-2 text-zinc-600" />
                <p className="text-sm font-bold text-white">No Apps Found</p>
                <p className="text-xs text-zinc-400 mt-1">Try another keyword or select All Apps.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-3 px-4 py-2 bg-orange-500 text-black font-bold text-xs rounded-xl"
                >
                  Show All Apps
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-7 gap-x-3 sm:gap-x-4 py-3">
                {filteredTools.map(tool => {
                  const isFav = favorites.includes(tool.id);
                  const isModal = tool.action_type === 'modal_action';
                  const isInternal = tool.action_type === 'internal_route';

                  return (
                    <motion.div
                      key={tool.id}
                      whileHover={{ scale: 1.08, y: -4 }}
                      whileTap={{ scale: 0.90 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={(e) => handleToolClick(tool, e)}
                      className="group flex flex-col items-center cursor-pointer select-none"
                    >
                      {/* Squircle App Icon Container */}
                      <div className="relative">
                        {/* App Icon Body */}
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] sm:rounded-[26px] bg-gradient-to-tr ${
                          tool.gradient || 'from-orange-500 to-amber-500'
                        } flex items-center justify-center text-white shadow-[0_10px_25px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-white/25 relative overflow-hidden transition-all duration-300 group-hover:shadow-[0_15px_30px_rgba(249,115,22,0.35)]`}>
                          
                          {/* Glossy Glass Highlight on Top Half (Realistic iOS Look) */}
                          <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[22px] sm:rounded-t-[26px] pointer-events-none z-20" />

                          {tool.logo_url ? (
                            <img
                              src={tool.logo_url}
                              alt={tool.title}
                              className="w-full h-full object-cover object-center relative z-10 select-none"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            /* Lucide Tool Icon */
                            <ToolIcon name={tool.icon} size={28} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] relative z-10 transition-transform group-hover:scale-110" />
                          )}
                        </div>

                        {/* App Notification Badge (e.g. HOT, NEW, PRO, AI, 1) */}
                        {tool.badge && (
                          <div className="absolute -top-1.5 -right-1.5 z-20 px-1.5 py-0.5 min-w-[20px] h-[20px] rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider flex items-center justify-center shadow-lg border border-black animate-pulse">
                            {tool.badge}
                          </div>
                        )}

                        {/* Favorite Star Pin */}
                        {isFav && (
                          <div className="absolute -bottom-1 -left-1 z-20 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md border border-black">
                            <Star size={10} className="fill-black" />
                          </div>
                        )}
                      </div>

                      {/* App Label Below Icon */}
                      <span className="text-[11px] sm:text-xs font-semibold text-white/90 group-hover:text-orange-400 text-center mt-2.5 line-clamp-2 w-full px-0.5 leading-tight h-8 sm:h-9 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors">
                        {tool.title}
                      </span>
                      <span className="text-[9px] text-zinc-400 text-center truncate w-full px-1 font-normal">
                        {tool.category_name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ========================================== */}
            {/* FLOATING APP DOCK (Like iPhone / iPad Dock) */}
            {/* ========================================== */}
            <div className="mt-10 pt-4 border-t border-white/10">
              <div className="max-w-md mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[32px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex items-center justify-around">
                {/* Dock App 1: Website Plans */}
                <motion.button
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onOpenWebsitePlans}
                  className="flex flex-col items-center cursor-pointer"
                  title="Website Plans & Packages"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg border border-white/20 relative">
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[20px]" />
                    <Compass size={22} className="relative z-10" />
                    <span className="absolute -top-1 -right-1 px-1 rounded-full bg-rose-600 text-white text-[8px] font-black">VIP</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/90 mt-1">Plans</span>
                </motion.button>

                {/* Dock App 2: Free Courses */}
                <motion.button
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onOpenFreeCourses}
                  className="flex flex-col items-center cursor-pointer"
                  title="Free Development Courses"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg border border-white/20 relative">
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[20px]" />
                    <Flame size={22} className="relative z-10" />
                    <span className="absolute -top-1 -right-1 px-1 rounded-full bg-emerald-500 text-black text-[8px] font-black">FREE</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/90 mt-1">Courses</span>
                </motion.button>

                {/* Dock App 3: Source Code Repos */}
                <motion.button
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onOpenSourceCode}
                  className="flex flex-col items-center cursor-pointer"
                  title="Open Source Repositories"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg border border-white/20 relative">
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[20px]" />
                    <Zap size={22} className="relative z-10" />
                    <span className="absolute -top-1 -right-1 px-1 rounded-full bg-blue-500 text-white text-[8px] font-black">GIT</span>
                  </div>
                  <span className="text-[10px] font-bold text-white/90 mt-1">Code</span>
                </motion.button>

                {/* Dock App 4: Direct WhatsApp */}
                <motion.a
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  href="https://wa.me/92343673242"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center cursor-pointer"
                  title="Direct WhatsApp with Saqib"
                >
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-lg border border-white/20 relative">
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-[20px]" />
                    <SiWhatsapp size={22} className="relative z-10" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <span className="text-[10px] font-bold text-white/90 mt-1">WhatsApp</span>
                </motion.a>
              </div>

              {/* iPhone Home Swipe Bar Pill Indicator */}
              <div className="w-36 h-1 bg-white/40 rounded-full mx-auto mt-4" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CLASSIC GRID CARDS VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
              All Tools &amp; Utilities
            </h2>
            <p className="text-zinc-400 text-sm">
              Instant access to AI predictors, developer portals, free coding repos, and web utilities.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map(tool => {
              const isFav = favorites.includes(tool.id);
              const isCopied = copiedId === tool.id;

              return (
                <div
                  key={tool.id}
                  onClick={(e) => handleToolClick(tool, e)}
                  className="p-6 bg-[#13141f]/90 hover:bg-[#181a29] border border-white/10 hover:border-orange-500/50 rounded-3xl transition-all duration-300 shadow-xl cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.gradient || 'from-orange-500 to-amber-500'} flex items-center justify-center text-white shadow-lg relative overflow-hidden`}>
                        {tool.logo_url ? (
                          <img src={tool.logo_url} alt={tool.title} className="w-full h-full object-cover" />
                        ) : (
                          <ToolIcon name={tool.icon} size={24} />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            {tool.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => handleToggleFavorite(tool.id, e)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-amber-400"
                        >
                          <Star size={13} className={isFav ? 'fill-amber-400 text-amber-400' : ''} />
                        </button>
                      </div>
                    </div>
                    <span className="text-xs text-orange-400 font-bold block mb-1">{tool.category_name}</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 mt-5 flex items-center justify-between text-xs font-semibold text-orange-400">
                    <span className="flex items-center gap-1">
                      <span>Launch App</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <ExternalLink size={14} className="text-zinc-400 group-hover:text-white" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: COMPACT LIST VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'compact' && (
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-28 space-y-2.5">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              onClick={(e) => handleToolClick(tool, e)}
              className="p-3 bg-[#13141f]/90 hover:bg-[#181a29] border border-white/10 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-[10px] bg-gradient-to-tr ${tool.gradient || 'from-orange-500 to-amber-500'} flex items-center justify-center text-white shrink-0 relative overflow-hidden`}>
                  {tool.logo_url ? (
                    <img src={tool.logo_url} alt={tool.title} className="w-full h-full object-cover" />
                  ) : (
                    <ToolIcon name={tool.icon} size={16} />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate max-w-md">{tool.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                  {tool.category_name}
                </span>
                <ExternalLink size={14} className="text-zinc-500 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* APP PREVIEW SHEET (iOS Style App Card Modal when clicked in Phone Mode) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedAppForSheet && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#141525] border border-white/20 rounded-t-[36px] sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedAppForSheet(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* App Sheet Header */}
              <div className="flex items-start gap-4">
                <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-[24px] bg-gradient-to-tr ${
                  selectedAppForSheet.gradient || 'from-orange-500 to-amber-500'
                } flex items-center justify-center text-white shadow-xl border border-white/25 shrink-0 relative overflow-hidden`}>
                  {selectedAppForSheet.logo_url ? (
                    <img src={selectedAppForSheet.logo_url} alt={selectedAppForSheet.title} className="w-full h-full object-cover" />
                  ) : (
                    <ToolIcon name={selectedAppForSheet.icon} size={32} />
                  )}
                </div>
                <div className="space-y-1 flex-1 pr-6">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                    {selectedAppForSheet.category_name}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{selectedAppForSheet.title}</h3>
                  <p className="text-xs text-zinc-400">Verified by Saqib Visuals Engine</p>
                </div>
              </div>

              {/* App Description */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedAppForSheet.description}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <a
                  href={selectedAppForSheet.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    recordToolClick({
                      id: selectedAppForSheet.id,
                      name: selectedAppForSheet.title,
                      category: selectedAppForSheet.category_name
                    });
                    setSelectedAppForSheet(null);
                  }}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition-transform hover:scale-102 cursor-pointer"
                >
                  <span>Open App / Launch Tool</span>
                  <ExternalLink size={15} />
                </a>

                <button
                  onClick={(e) => handleCopyLink(selectedAppForSheet, e)}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={15} />
                  <span>Share</span>
                </button>

                <button
                  onClick={(e) => handleToggleFavorite(selectedAppForSheet.id, e)}
                  className={`w-full sm:w-auto px-4 py-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                    favorites.includes(selectedAppForSheet.id)
                      ? 'bg-amber-500 text-black border-amber-400 font-black'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                  }`}
                >
                  <Star size={15} className={favorites.includes(selectedAppForSheet.id) ? 'fill-black' : ''} />
                  <span>Fav</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WHATSAPP / SOCIAL POPUP MODAL */}
      <AnimatePresence>
        {showWhatsappPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`w-full max-w-sm bg-gradient-to-b from-[#181a24] to-[#121319] border rounded-[32px] p-6 shadow-2xl relative overflow-hidden ${
                settings.popup_platform === 'tiktok' ? 'border-[#ff0050]/30' :
                settings.popup_platform === 'youtube' ? 'border-[#ff0000]/30' :
                settings.popup_platform === 'telegram' ? 'border-[#229ED9]/30' :
                settings.popup_platform === 'instagram' ? 'border-[#E1306C]/30' :
                'border-[#25D366]/30' // whatsapp default
              }`}
            >
              <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[50px] rounded-full pointer-events-none ${
                settings.popup_platform === 'tiktok' ? 'bg-[#ff0050]/20' :
                settings.popup_platform === 'youtube' ? 'bg-[#ff0000]/20' :
                settings.popup_platform === 'telegram' ? 'bg-[#229ED9]/20' :
                settings.popup_platform === 'instagram' ? 'bg-[#E1306C]/20' :
                'bg-[#25D366]/20' // whatsapp default
              }`} />
              
              <button
                onClick={dismissWhatsappPopup}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center relative z-10 mt-2">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border shadow-xl ${
                  settings.popup_platform === 'tiktok' ? 'bg-[#ff0050]/10 text-[#ff0050] border-[#ff0050]/20 shadow-[0_0_30px_rgba(255,0,80,0.2)]' :
                  settings.popup_platform === 'youtube' ? 'bg-[#ff0000]/10 text-[#ff0000] border-[#ff0000]/20 shadow-[0_0_30px_rgba(255,0,0,0.2)]' :
                  settings.popup_platform === 'telegram' ? 'bg-[#229ED9]/10 text-[#229ED9] border-[#229ED9]/20 shadow-[0_0_30px_rgba(34,158,217,0.2)]' :
                  settings.popup_platform === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] bg-opacity-10 text-white border-white/20 shadow-[0_0_30px_rgba(225,48,108,0.2)]' :
                  'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 shadow-[0_0_30px_rgba(37,211,102,0.2)]'
                }`}>
                  {settings.popup_platform === 'tiktok' ? <SiTiktok size={32} /> :
                   settings.popup_platform === 'youtube' ? <SiYoutube size={32} /> :
                   settings.popup_platform === 'telegram' ? <SiTelegram size={32} /> :
                   settings.popup_platform === 'instagram' ? <SiInstagram size={32} /> :
                   <SiWhatsapp size={32} />}
                </div>
                
                <h3 className="text-lg font-black text-white mb-2 leading-tight">
                  {settings.whatsapp_popup_title || 'Join Our Community!'}
                </h3>
                
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {settings.whatsapp_popup_description || 'Get early access to premium content.'}
                </p>

                <a
                  href={settings.whatsapp_channel_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissWhatsappPopup}
                  className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] ${
                    settings.popup_platform === 'tiktok' ? 'bg-[#ff0050] hover:bg-[#e00046] text-white shadow-[#ff0050]/20' :
                    settings.popup_platform === 'youtube' ? 'bg-[#ff0000] hover:bg-[#e00000] text-white shadow-[#ff0000]/20' :
                    settings.popup_platform === 'telegram' ? 'bg-[#229ED9] hover:bg-[#1e8cc0] text-white shadow-[#229ED9]/20' :
                    settings.popup_platform === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-[#E1306C]/20' :
                    'bg-[#25D366] hover:bg-[#20bd5a] text-black shadow-[#25D366]/20'
                  }`}
                >
                  {settings.popup_platform === 'tiktok' ? <SiTiktok size={18} /> :
                   settings.popup_platform === 'youtube' ? <SiYoutube size={18} /> :
                   settings.popup_platform === 'telegram' ? <SiTelegram size={18} /> :
                   settings.popup_platform === 'instagram' ? <SiInstagram size={18} /> :
                   <SiWhatsapp size={18} />}
                  <span>Join / Follow Now</span>
                </a>
                
                <button
                  onClick={dismissWhatsappPopup}
                  className="mt-4 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
