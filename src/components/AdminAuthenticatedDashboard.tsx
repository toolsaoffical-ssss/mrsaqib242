import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Shield, 
  Wrench, 
  Inbox, 
  Activity, 
  Database, 
  Lock, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';

import AdminInquiriesManager from './AdminInquiriesManager';
import AdminToolsManager from './AdminToolsManager';
import AdminTrafficAnalytics from './AdminTrafficAnalytics';
import AdminSqlStudio from './AdminSqlStudio';
import AdminSecurityManager from './AdminSecurityManager';

import { 
  ToolItem, 
  ToolCategory, 
  DEFAULT_TOOLS, 
  DEFAULT_TOOL_CATEGORIES,
  fetchToolsFromDB,
  fetchToolCategoriesFromDB
} from '../lib/toolsService';

interface AdminAuthenticatedDashboardProps {
  adminUsername: string;
  onLogout: () => void;
}

type TabType = 'tools' | 'inquiries' | 'analytics' | 'sql' | 'security';

export default function AdminAuthenticatedDashboard({
  adminUsername,
  onLogout
}: AdminAuthenticatedDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('inquiries');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Tools state for AdminToolsManager
  const [tools, setTools] = useState<ToolItem[]>(DEFAULT_TOOLS);
  const [toolCategories, setToolCategories] = useState<ToolCategory[]>(DEFAULT_TOOL_CATEGORIES);
  const [toolsLoading, setToolsLoading] = useState<boolean>(true);
  const [toolsFromDB, setToolsFromDB] = useState<boolean>(false);
  const [toolsSubTab, setToolsSubTab] = useState<'items' | 'categories' | 'settings'>('items');

  // Load tools on mount
  const loadTools = async () => {
    setToolsLoading(true);
    try {
      const [tRes, cRes] = await Promise.all([
        fetchToolsFromDB(),
        fetchToolCategoriesFromDB()
      ]);
      if (tRes.tools) setTools(tRes.tools);
      if (cRes.categories) setToolCategories(cRes.categories);
      setToolsFromDB(Boolean(tRes.fromDatabase || cRes.fromDatabase));
    } catch {
      // Fallback to local
    } finally {
      setToolsLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const navItems = [
    { id: 'inquiries' as TabType, label: 'Client Inquiries', icon: Inbox, badge: 'Leads' },
    { id: 'tools' as TabType, label: 'Tools & Utilities', icon: Wrench },
    { id: 'analytics' as TabType, label: 'Traffic & Geo', icon: Activity },
    { id: 'sql' as TabType, label: 'Database Studio', icon: Database },
    { id: 'security' as TabType, label: 'Security & PIN', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-orange-500 selection:text-white">
      <Head>
        <title>Master Control Dashboard | Mr Saqib Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs font-bold transition-all animate-bounce ${
          toast.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
            : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-white/10 bg-[#0d0e14]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Return to Public Portfolio"
            >
              <ArrowLeft size={16} />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-black font-black text-xs shadow-lg shadow-orange-500/20">
                <Shield size={16} />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-wider text-white">
                  Saqib <span className="text-orange-400">Master Console</span>
                </h1>
                <p className="text-[10px] text-zinc-400 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auth: {adminUsername || 'saqib'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20 font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-white/5 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-orange-500 text-black font-black'
                    : 'bg-white/5 text-zinc-400'
                }`}
              >
                <Icon size={13} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inquiries' && (
          <AdminInquiriesManager onNotify={showToast} />
        )}

        {activeTab === 'tools' && (
          <AdminToolsManager
            tools={tools}
            setTools={setTools}
            toolCategories={toolCategories}
            setToolCategories={setToolCategories}
            loading={toolsLoading}
            isFromDB={toolsFromDB}
            onRefresh={loadTools}
            showToast={showToast}
            subTab={toolsSubTab}
            setSubTab={setToolsSubTab}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminTrafficAnalytics onNotify={showToast} />
        )}

        {activeTab === 'sql' && (
          <AdminSqlStudio onNotify={showToast} />
        )}

        {activeTab === 'security' && (
          <AdminSecurityManager
            currentUsername={adminUsername || 'saqib'}
            onCredentialsUpdated={newU => showToast(`Username changed to ${newU}`, 'success')}
            onLogout={onLogout}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}
