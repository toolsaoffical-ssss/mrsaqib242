import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  Shield, 
  Wrench, 
  Inbox, 
  Activity, 
  Lock, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  FolderGit2,
  Image as ImageIcon,
  CreditCard,
  Clock,
  KeyRound,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';

import AdminInquiriesManager from './AdminInquiriesManager';
import AdminProjectsManager from './AdminProjectsManager';
import AdminGalleryManager from './AdminGalleryManager';
import AdminPricingManager from './AdminPricingManager';
import AdminToolsManager from './AdminToolsManager';
import AdminTrafficAnalytics from './AdminTrafficAnalytics';
import AdminSecurityManager from './AdminSecurityManager';

import { 
  ToolItem, 
  ToolCategory, 
  DEFAULT_TOOLS, 
  DEFAULT_TOOL_CATEGORIES,
  fetchToolsFromDB,
  fetchToolCategoriesFromDB
} from '../lib/toolsService';

import { trustCurrentDevice } from '../lib/adminAuthClient';

interface AdminAuthenticatedDashboardProps {
  adminUsername: string;
  isRestricted?: boolean;
  remainingRestrictionSeconds?: number;
  deviceId?: string;
  deviceStatus?: string;
  onLogout: () => void;
  onDeviceApproved?: () => void;
}

type TabType = 'inquiries' | 'projects' | 'gallery' | 'pricing' | 'tools' | 'analytics' | 'security';

export default function AdminAuthenticatedDashboard({
  adminUsername,
  isRestricted: initialRestricted = false,
  remainingRestrictionSeconds: initialRemainingSec = 0,
  deviceId: initialDeviceId = '',
  deviceStatus: initialDeviceStatus = 'pending_48h',
  onLogout,
  onDeviceApproved
}: AdminAuthenticatedDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('inquiries');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Travel security restriction states
  const [isRestricted, setIsRestricted] = useState<boolean>(initialRestricted);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialRemainingSec);
  const [showTrustModal, setShowTrustModal] = useState<boolean>(false);
  const [masterPasswordInput, setMasterPasswordInput] = useState<string>('');
  const [isVerifyingTrust, setIsVerifyingTrust] = useState<boolean>(false);
  const [trustError, setTrustError] = useState<string>('');

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

  // Sync props
  useEffect(() => {
    setIsRestricted(Boolean(initialRestricted));
  }, [initialRestricted]);

  useEffect(() => {
    setRemainingSeconds(initialRemainingSec);
  }, [initialRemainingSec]);

  // Live countdown timer for the 48-hour restriction
  useEffect(() => {
    if (!isRestricted || remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestricted, remainingSeconds]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Format seconds into HH:MM:SS
  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Quick Self-Trust verification handler
  const handleTrustCurrentDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrustError('');
    if (!masterPasswordInput.trim()) {
      setTrustError('Please enter your Master Admin Password or Emergency Recovery Key.');
      return;
    }

    setIsVerifyingTrust(true);
    try {
      const res = await trustCurrentDevice(masterPasswordInput.trim());
      if (res.success) {
        setIsRestricted(false);
        setRemainingSeconds(0);
        setShowTrustModal(false);
        setMasterPasswordInput('');
        showToast('Device verified & trusted successfully! Full access granted.', 'success');
        if (onDeviceApproved) onDeviceApproved();
      } else {
        setTrustError(res.message || 'Verification failed. Incorrect Master Password.');
      }
    } catch {
      setTrustError('Network error during verification.');
    } finally {
      setIsVerifyingTrust(false);
    }
  };

  const navItems = [
    { id: 'inquiries' as TabType, label: 'Client Inquiries', icon: Inbox, badge: 'Leads' },
    { id: 'projects' as TabType, label: 'Projects', icon: FolderGit2 },
    { id: 'gallery' as TabType, label: 'Gallery', icon: ImageIcon },
    { id: 'pricing' as TabType, label: 'Pricing Plans', icon: CreditCard },
    { id: 'tools' as TabType, label: 'Tools & Utilities', icon: Wrench },
    { id: 'analytics' as TabType, label: 'Traffic & Geo', icon: Activity },
    { 
      id: 'security' as TabType, 
      label: 'Security & Devices', 
      icon: Lock,
      alertBadge: isRestricted ? '48h Active' : undefined
    }
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

      {/* 🛡️ 48-Hour Travel Security Alert Banner */}
      {isRestricted && (
        <div className="bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-purple-600/20 border-b border-amber-500/30 px-4 py-3 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 animate-pulse">
                <AlertTriangle size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-300 uppercase tracking-wider text-[11px]">
                    48-Hour Restricted Admin Session Active
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Clock size={10} />
                    {remainingSeconds > 0 ? formatCountdown(remainingSeconds) : '48h Elapsed (Ready for Recovery)'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Unrecognized travel device. Viewing leads &amp; telemetry is allowed; modifying projects, tools, or credentials is locked for 48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowTrustModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black uppercase tracking-wider text-[11px] flex items-center gap-1.5 shadow-lg shadow-orange-500/20 cursor-pointer transition-all"
              >
                <KeyRound size={13} />
                <span>Verify &amp; Trust Device</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Security Center
              </button>
            </div>
          </div>
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
                  <span className={`w-1.5 h-1.5 rounded-full ${isRestricted ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
                  {isRestricted ? 'Mode: 48h Restricted' : 'Mode: Fully Trusted'} ({adminUsername || 'saqib'})
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/20 font-black'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                  {item.alertBadge && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                  )}
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

        {/* Mobile & Medium screen Nav Tabs */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-white/5 no-scrollbar">
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
                {item.alertBadge && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
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

        {activeTab === 'projects' && (
          <AdminProjectsManager onNotify={showToast} />
        )}

        {activeTab === 'gallery' && (
          <AdminGalleryManager onNotify={showToast} />
        )}

        {activeTab === 'pricing' && (
          <AdminPricingManager onNotify={showToast} />
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

        {activeTab === 'security' && (
          <AdminSecurityManager
            currentUsername={adminUsername || 'saqib'}
            isRestricted={isRestricted}
            remainingRestrictionSeconds={remainingSeconds}
            currentDeviceId={initialDeviceId}
            onCredentialsUpdated={newU => showToast(`Username changed to ${newU}`, 'success')}
            onLogout={onLogout}
            showToast={showToast}
            onDeviceApproved={() => {
              setIsRestricted(false);
              setRemainingSeconds(0);
              if (onDeviceApproved) onDeviceApproved();
            }}
          />
        )}
      </main>

      {/* Modal: Quick Direct Device Verification (Solves UI self-approval without SQL) */}
      {showTrustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121318] border border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowTrustModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-white/5"
            >
              <X size={16} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-[#121318] rounded-[14px] flex items-center justify-center text-amber-400">
                <KeyRound size={24} />
              </div>
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
              Verify &amp; Trust This Device
            </h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Enter your <span className="text-emerald-400 font-bold">Emergency Travel Backup Code</span> to instantly promote this device to Trusted Status. If you don't have one, you must wait 48 hours to use your Master Password, or approve from another trusted device.
            </p>

            <form onSubmit={handleTrustCurrentDevice} className="space-y-4">
              {trustError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{trustError}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Master Password or Recovery Key
                </label>
                <input
                  type="password"
                  value={masterPasswordInput}
                  onChange={e => setMasterPasswordInput(e.target.value)}
                  placeholder="Enter Master Password / Recovery Code"
                  className="w-full bg-[#1b1c24] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono transition-colors"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTrustModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingTrust}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-black uppercase tracking-wider hover:from-amber-400 hover:to-orange-400 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifyingTrust ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield size={14} />
                      <span>Trust Device</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
