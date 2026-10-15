import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Server, Globe, Power, Trash2, Plus, AlertTriangle, ShieldCheck, Copy, Check } from 'lucide-react';

interface ApiSettings {
  projects_api_enabled: boolean;
  picks_api_enabled: boolean;
  contact_api_enabled: boolean;
}

interface AllowedDomain {
  id: string;
  domain: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminApiHub({ onNotify }: { onNotify: (message: string, type?: 'success' | 'error') => void }) {
  const [settings, setSettings] = useState<ApiSettings>({
    projects_api_enabled: true,
    picks_api_enabled: true,
    contact_api_enabled: true,
  });
  const [domains, setDomains] = useState<AllowedDomain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedApi, setCopiedApi] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Try server admin API route first
      const apiRes = await fetch('/api/admin/api-hub', { credentials: 'include' }).catch(() => null);
      if (apiRes && apiRes.ok) {
        const json = await apiRes.json();
        if (json.settings) setSettings(json.settings);
        if (json.domains) setDomains(json.domains);
        return;
      }

      // 2. Direct Supabase client fallback
      const [settingsRes, domainsRes] = await Promise.all([
        supabase.from('api_settings').select('*').limit(1).maybeSingle(),
        supabase.from('api_allowed_domains').select('*').order('created_at', { ascending: false })
      ]);

      if (settingsRes.data) {
        setSettings(settingsRes.data);
      }
      if (domainsRes.data) {
        setDomains(domainsRes.data);
      }
    } catch (error) {
      console.error('Error fetching API data', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGlobalSetting = async (key: keyof ApiSettings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    try {
      const res = await fetch('/api/admin/api-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'update_setting', settingKey: key, settingValue: newValue })
      }).catch(() => null);

      if (res && res.ok) {
        onNotify('API Setting updated', 'success');
        return;
      }

      // Direct fallback
      const { error } = await supabase.from('api_settings').update({ [key]: newValue }).eq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      onNotify('API Setting updated', 'success');
    } catch (err: any) {
      setSettings(prev => ({ ...prev, [key]: !newValue }));
      onNotify(err?.message || 'Failed to update setting', 'error');
    }
  };

  const toggleDomain = async (id: string, currentStatus: boolean) => {
    const newValue = !currentStatus;
    setDomains(prev => prev.map(d => d.id === id ? { ...d, is_active: newValue } : d));

    try {
      const res = await fetch('/api/admin/api-hub', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, is_active: newValue })
      }).catch(() => null);

      if (res && res.ok) {
        onNotify(newValue ? 'Domain Activated' : 'Domain Deactivated', 'success');
        return;
      }

      // Direct fallback
      const { error } = await supabase.from('api_allowed_domains').update({ is_active: newValue }).eq('id', id);
      if (error) throw error;
      onNotify(newValue ? 'Domain Activated' : 'Domain Deactivated', 'success');
    } catch (err: any) {
      fetchData(); // Revert
      onNotify(err?.message || 'Failed to update domain', 'error');
    }
  };

  const addDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    let cleanDomain = newDomain.trim().toLowerCase();
    
    if (!cleanDomain) return;
    
    // Auto format URL to origin
    try {
      if (!cleanDomain.startsWith('http')) cleanDomain = 'https://' + cleanDomain;
      const url = new URL(cleanDomain);
      cleanDomain = url.origin;
    } catch (e) {
      onNotify('Invalid URL format', 'error');
      return;
    }

    if (domains.find(d => d.domain === cleanDomain)) {
      onNotify('Domain already exists', 'error');
      return;
    }

    try {
      // 1. Try server admin route first (uses Supabase service-role admin client to bypass client RLS)
      const res = await fetch('/api/admin/api-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'add_domain', domain: cleanDomain })
      }).catch(() => null);

      if (res) {
        const json = await res.json().catch(() => null);
        if (res.ok && json?.data) {
          setDomains(prev => [json.data, ...prev]);
          setNewDomain('');
          onNotify('Domain added to whitelist', 'success');
          return;
        } else if (!res.ok && json?.error) {
          // If server returned specific error, notify and don't double-fail unless server is unreachable
          if (res.status === 401 || res.status === 403) {
            onNotify(json.error, 'error');
            return;
          }
        }
      }

      // 2. Direct client fallback
      const { data, error } = await supabase.from('api_allowed_domains').insert([{ domain: cleanDomain, is_active: true }]).select();
      
      if (error) {
        if (error.message?.includes('violates row-level security policy')) {
          onNotify('RLS Policy Error: Run fix SQL in Supabase SQL editor.', 'error');
        } else {
          onNotify(error.message, 'error');
        }
      } else if (data) {
        setDomains(prev => [data[0], ...prev]);
        setNewDomain('');
        onNotify('Domain added to whitelist', 'success');
      }
    } catch (err: any) {
      onNotify(err?.message || 'Failed to add domain', 'error');
    }
  };

  const deleteDomain = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this domain from whitelist?')) return;
    try {
      const res = await fetch('/api/admin/api-hub', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      }).catch(() => null);

      if (res && res.ok) {
        setDomains(prev => prev.filter(d => d.id !== id));
        onNotify('Domain removed', 'success');
        return;
      }

      // Direct fallback
      const { error } = await supabase.from('api_allowed_domains').delete().eq('id', id);
      if (error) {
        onNotify('Failed to delete domain', 'error');
      } else {
        setDomains(prev => prev.filter(d => d.id !== id));
        onNotify('Domain removed', 'success');
      }
    } catch (err: any) {
      onNotify(err?.message || 'Failed to delete domain', 'error');
    }
  };

  if (loading) {
    return <div className="text-zinc-400 p-8 flex justify-center items-center h-64"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <Server className="text-orange-500" />
            Central API Hub
          </h2>
          <p className="text-zinc-400 mt-1 text-sm">
            Control which of your external websites can fetch data from this master database.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold">
          <ShieldCheck size={18} />
          CORS Protected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Global Switches */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Power className="text-zinc-400" size={18} />
              Global API Kill Switches
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'projects_api_enabled', label: 'Projects API', desc: 'Allow fetching all active projects', endpoint: '/api/public/projects' },
                { key: 'picks_api_enabled', label: 'Gallery Picks API', desc: 'Allow fetching gallery photos (My Picks)', endpoint: '/api/public/picks' },
                { key: 'contact_api_enabled', label: 'Contact API', desc: 'Allow fetching contact information', endpoint: '/api/public/contact' }
              ].map((api) => {
                const isActive = settings[api.key as keyof ApiSettings];
                const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${api.endpoint}` : api.endpoint;
                
                return (
                  <div key={api.key} className="flex flex-col p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-white">{api.label}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{api.desc}</div>
                      </div>
                      <button 
                        onClick={() => toggleGlobalSetting(api.key as keyof ApiSettings)}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${isActive ? 'bg-orange-500' : 'bg-zinc-700'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute transition-all ${isActive ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-black/60 p-2 rounded-lg border border-white/5">
                      <code className="text-[10px] text-zinc-400 font-mono truncate flex-1 select-all">{fullUrl}</code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(fullUrl);
                          setCopiedApi(api.key);
                          setTimeout(() => setCopiedApi(null), 2000);
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white shrink-0"
                        title="Copy API URL"
                      >
                        {copiedApi === api.key ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex gap-3 text-orange-400 text-sm">
              <AlertTriangle className="shrink-0" size={18} />
              <p>Turning off a switch will immediately stop all external websites from receiving that data.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Whitelist Domains */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="text-zinc-400" size={18} />
              Allowed Domains (CORS Whitelist)
            </h3>
            
            <form onSubmit={addDomain} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="https://creativesaqib.vercel.app"
                className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
              />
              <button 
                type="submit"
                disabled={!newDomain.trim()}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Domain</span>
              </button>
            </form>

            <div className="space-y-2">
              {domains.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  No domains allowed yet. Add your portfolio websites above.
                </div>
              ) : (
                domains.map((domain) => (
                  <div key={domain.id} className="flex items-center justify-between p-4 bg-black/40 hover:bg-white/[0.02] border border-white/5 rounded-xl group transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${domain.is_active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                      <span className="text-sm text-zinc-300 font-mono truncate">{domain.domain}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleDomain(domain.id, domain.is_active)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-colors ${
                          domain.is_active 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {domain.is_active ? 'ACTIVE' : 'BLOCKED'}
                      </button>
                      <button
                        onClick={() => deleteDomain(domain.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-500/10"
                        title="Remove Domain"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
