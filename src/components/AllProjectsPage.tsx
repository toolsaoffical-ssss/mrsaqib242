import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Search, ArrowLeft, LayoutGrid, Sparkles, Filter, Globe, Cpu, ShoppingCart, ShieldAlert, Laptop, Eye, Shield } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { fetchProjectsFromDB, DEFAULT_PROJECTS, ProjectItem } from '../lib/projectsService';

type Project = ProjectItem;

interface AllProjectsPageProps {
  onBack: () => void;
}

function ProjectCard({ project }: { project: Project; key?: any }) {
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-white/5 rounded-[1.25rem] overflow-hidden flex flex-col justify-between h-full relative skeleton-shimmer">
        <div>
          {/* Top colored accent indicator bar skeleton */}
          <div className="h-1 bg-zinc-800 w-full animate-pulse" />
          
          {/* Iframe Frame Skeleton */}
          <div className="h-[110px] min-[400px]:h-[140px] sm:h-[200px] md:h-[260px] bg-zinc-950 flex items-center justify-center relative overflow-hidden">
            {/* Pulsing Core Target icon skeleton */}
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Globe size={16} className="text-zinc-700 animate-pulse" />
            </div>
          </div>
          
          {/* Content Area Skeleton */}
          <div className="p-3 md:p-6 space-y-3">
            {/* Tag pills */}
            <div className="flex gap-1">
              <div className="h-3.5 bg-zinc-800 rounded w-12 animate-pulse" />
              <div className="h-3.5 bg-zinc-800 rounded w-16 animate-pulse" />
            </div>
            {/* Title */}
            <div className="h-4 sm:h-5 bg-zinc-800 rounded w-3/4 animate-pulse" />
            {/* Description lines */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3 bg-zinc-800 rounded w-full animate-pulse" />
              <div className="h-3 bg-zinc-800 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Bottom Actions Skeleton */}
        <div className="px-3 pb-3 md:px-6 md:pb-6 pt-1.5 border-t border-white/5 flex items-center justify-between">
          <div className="h-3 bg-zinc-800 rounded w-20 animate-pulse" />
          <div className="h-3 bg-zinc-800 rounded w-12 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rainbow-border bg-zinc-900 border border-white/5 rounded-[1.25rem] overflow-hidden flex flex-col justify-between group hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-cyan-500/30 transition-all relative"
    >
      {/* Link overlay */}
      <a 
        href={project.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="absolute inset-0 z-30"
        aria-label={`Open ${project.name}`}
      />

      <div>
        {/* Frame Container */}
        <div ref={ref} className="project-iframe-container h-[110px] min-[400px]:h-[140px] sm:h-[200px] md:h-[260px] relative">
          {/* Futuristic Hologram Laser Hover Overlay */}
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 flex flex-col items-center justify-center p-3 text-center cyber-grid-overlay">
            {/* Laser Scan Line */}
            <div className="scan-line" />
            
            {/* Satellite tracking target */}
            <div className="relative mb-2 flex items-center justify-center scale-75 md:scale-100">
              <div className="absolute w-12 h-12 rounded-full border border-cyan-500/30 animate-ping" />
              <div className="absolute w-16 h-16 rounded-full border border-cyan-500/10" />
              <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <Globe size={18} className="text-cyan-400 animate-pulse" />
              </div>
            </div>

            <span className="text-[7px] md:text-[9px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-bold mb-0.5 animate-pulse">
              SYSTEM LINK ONLINE
            </span>
            <h4 className="text-[10px] md:text-sm font-black tracking-wider uppercase text-white mb-2 line-clamp-1">
              {project.name}
            </h4>
            <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[8px] md:text-xs flex items-center gap-1 shadow-[0_0_20px_rgba(6,182,212,0.4)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              LAUNCH WEBSITE <ExternalLink size={10} />
            </div>
          </div>

          {project.restricted ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-4 text-center">
              <div className="mb-2 p-2 rounded-full bg-white/5 border border-white/10 scale-75 md:scale-100">
                <ShieldAlert size={20} className="text-rose-500 animate-pulse" />
              </div>
              <h4 className="text-[10px] md:text-sm font-bold mb-0.5">Security Sandbox</h4>
              <p className="text-[8px] md:text-[10px] text-zinc-500 max-w-[140px] md:max-w-[200px] line-clamp-2">Hosting sandbox restricts embed. Tap card to view safely.</p>
            </div>
          ) : inView ? (
            <iframe 
              src={project.url} 
              title={project.name}
              className="project-iframe"
              loading="lazy"
            />
          ) : null}

          {/* Top Gradient Accent */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient}`} />
        </div>

        {/* Content Area */}
        <div className="p-3 md:p-6">
          <div className="flex flex-wrap gap-1 mb-2">
            {project.tags.map(t => (
              <span key={t} className="text-[7px] md:text-[9px] font-black tracking-widest uppercase bg-white/5 border border-white/10 text-zinc-400 px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
          <h3 className="text-xs sm:text-base md:text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-colors mb-1 line-clamp-1">
            {project.name}
          </h3>
          <p className="text-[10px] md:text-xs text-zinc-400 leading-relaxed line-clamp-2 md:line-clamp-none">
            {project.description}
          </p>
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="px-3 pb-3 md:px-6 md:pb-6 pt-1.5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[8px] md:text-[10px] font-mono text-zinc-500 tracking-wider truncate max-w-[80px] md:max-w-none">
          {project.url.replace('https://', '').split('/')[0]}
        </span>
        <div className="flex items-center gap-1 text-[8px] md:text-xs font-black uppercase text-white/70 group-hover:text-white transition-colors">
          Explore <ExternalLink size={10} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AllProjectsPage({ onBack }: AllProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [projects, setProjects] = useState<ProjectItem[]>(DEFAULT_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetchProjectsFromDB();
        if (isMounted && res.projects) {
          const activeOnly = res.projects.filter(p => p.is_active !== false);
          setProjects(activeOnly.length > 0 ? activeOnly : res.projects);
        }
      } catch (err) {
        console.warn('Error loading dynamic projects:', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  // Filter projects based on search query and selected tag
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'All' || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-white selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-widest uppercase text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-zinc-400">SAQIB DEV PORTFOLIO</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase">Interactive Hub</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none mb-4 uppercase"
          >
            All <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Projects</span> Hub
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore the live, fully interactive website prototypes, utility builders, and design systems custom-developed by Saqib.
          </motion.p>
        </div>
      </section>

      {/* Filter and Search Section */}
      <section className="px-4 sm:px-6 mb-8 relative z-20">
        <div className="max-w-7xl mx-auto bg-zinc-900/50 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search projects, tags, or tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl sm:rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-wrap lg:justify-end no-scrollbar scroll-smooth snap-x">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all duration-300 shrink-0 snap-align-start ${
                    selectedTag === tag 
                      ? 'bg-white text-black shadow-lg scale-105' 
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="px-3 md:px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
              >
                {filteredProjects.map((project, idx) => (
                  <ProjectCard key={project.name} project={project} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center border border-dashed border-white/10 rounded-3xl"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <LayoutGrid size={24} className="text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold mb-1">No projects matched your search</h3>
                <p className="text-zinc-500 text-xs">Try selecting a different tag or checking spelling.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-zinc-500 font-mono">
        <p>&copy; {new Date().getFullYear()} Saqib Developer. Built for extreme response speed & high Google Search rankings.</p>
      </footer>
    </div>
  );
}
