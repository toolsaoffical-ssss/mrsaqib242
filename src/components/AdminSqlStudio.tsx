import React, { useState } from 'react';
import {
  Database,
  Copy,
  CheckCircle2,
  ExternalLink,
  Code2,
  Server,
  Zap,
  ShieldCheck,
  Check,
  Sparkles,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { SQL_SCRIPTS_CATALOG, MASTER_SUPABASE_SQL } from '../lib/sqlQueriesService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminSqlStudioProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

export default function AdminSqlStudio({ onNotify }: AdminSqlStudioProps) {
  const [selectedScriptId, setSelectedScriptId] = useState<string>('master');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [tableStatus, setTableStatus] = useState<Record<string, { ok: boolean; count?: number; error?: string }>>({});

  const activeScript = SQL_SCRIPTS_CATALOG.find(s => s.id === selectedScriptId) || SQL_SCRIPTS_CATALOG[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onNotify('SQL script copied to clipboard! Paste it into Supabase SQL Editor.', 'success');
    setTimeout(() => {
      setCopiedId(null);
    }, 3000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const results: Record<string, { ok: boolean; count?: number; error?: string }> = {};

    const tablesToTest = [
      { name: 'site_analytics', label: 'Site & Tool Analytics' },
      { name: 'client_inquiries', label: 'Client Inquiries & Queries' },
      { name: 'projects', label: 'Projects' },
      { name: 'gallery', label: 'Gallery' },
      { name: 'profile_settings', label: 'Profile Settings' },
      { name: 'pricing_plans', label: 'Pricing Plans' },
      { name: 'pricing_addons', label: 'Pricing Add-ons' },
      { name: 'tools', label: 'Tools' },
      { name: 'tool_categories', label: 'Tool Categories' },
      { name: 'tool_settings', label: 'Tool Settings' }
    ];

    if (!isSupabaseConfigured()) {
      onNotify('Supabase credentials are not configured.', 'error');
      setTestingConnection(false);
      return;
    }

    for (const t of tablesToTest) {
      try {
        const { count, error } = await supabase
          .from(t.name)
          .select('*', { count: 'exact', head: true });

        if (error) {
          results[t.name] = { ok: false, error: error.message };
        } else {
          results[t.name] = { ok: true, count: count ?? 0 };
        }
      } catch (err: any) {
        results[t.name] = { ok: false, error: err.message };
      }
    }

    setTableStatus(results);
    setTestingConnection(false);

    const successful = Object.values(results).filter(r => r.ok).length;
    if (successful === tablesToTest.length) {
      onNotify('All 9 database tables are online and fully connected!', 'success');
    } else {
      onNotify(
        `${successful} of ${tablesToTest.length} tables are ready. Copy the Master SQL script and run it in Supabase SQL editor to create missing tables.`,
        'success'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#121319] to-zinc-950 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Zap size={13} className="animate-pulse" />
              <span>Supabase Database & Query Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready-to-Run SQL Queries & Schema
            </h2>
            <p className="text-zinc-300 text-sm max-w-2xl leading-relaxed">
              Copy-paste these SQL queries into your Supabase SQL Editor to instantly provision your tables,
              row level security (RLS) policies, and performance indexes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Direct Link to Supabase SQL editor */}
            <a
              href="https://supabase.com/dashboard/project/mxstnicoyfytfxfahybx/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 hover:scale-105"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink size={15} />
            </a>

            {/* One click Master copy */}
            <button
              onClick={() => handleCopy(MASTER_SUPABASE_SQL, 'master-quick')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2 hover:scale-105 cursor-pointer"
            >
              {copiedId === 'master-quick' ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedId === 'master-quick' ? 'Copied Master SQL!' : 'Copy Master SQL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Table Health Check Row */}
      <div className="bg-[#121319] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Server size={16} className="text-orange-400" />
              <span>Supabase Table Health Monitor</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Check which tables currently exist in your live Supabase database.
            </p>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw size={14} className={testingConnection ? 'animate-spin' : ''} />
            <span>{testingConnection ? 'Testing Connection...' : 'Test Database Tables'}</span>
          </button>
        </div>

        {Object.keys(tableStatus).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {[
              { id: 'site_analytics', name: 'site_analytics (Visitors & Tools)' },
              { id: 'client_inquiries', name: 'client_inquiries (Queries)' },
              { id: 'projects', name: 'projects' },
              { id: 'gallery', name: 'gallery' },
              { id: 'profile_settings', name: 'profile_settings' },
              { id: 'pricing_plans', name: 'pricing_plans' },
              { id: 'pricing_addons', name: 'pricing_addons' },
              { id: 'tools', name: 'tools' },
              { id: 'tool_categories', name: 'tool_categories' },
              { id: 'tool_settings', name: 'tool_settings' }
            ].map(tbl => {
              const status = tableStatus[tbl.id];
              return (
                <div
                  key={tbl.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    status?.ok
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  <span className="font-mono font-medium truncate">{tbl.name}</span>
                  <span className="font-bold flex items-center gap-1 shrink-0">
                    {status?.ok ? (
                      <>
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>Ready ({status.count ?? 0})</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={13} className="text-red-400" />
                        <span>Not Found</span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Script Selector Tabs & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Script Catalog */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 px-1 mb-2">
            SQL Scripts by Feature
          </h3>

          {SQL_SCRIPTS_CATALOG.map(script => {
            const isSelected = script.id === selectedScriptId;
            return (
              <button
                key={script.id}
                onClick={() => setSelectedScriptId(script.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-500/10 border-orange-500/40 text-white shadow-lg shadow-orange-500/10'
                    : 'bg-[#121319] border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-white">{script.title}</span>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-orange-500 text-black'
                        : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    {script.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {script.description}
                </p>
                <div className="text-[10px] font-mono text-zinc-500 mt-2">
                  Table: <code className="text-zinc-300">{script.tableName}</code>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-[#0D0E12] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 size={18} className="text-orange-400" />
                  <h3 className="text-lg font-bold text-white">{activeScript.title}</h3>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{activeScript.description}</p>
              </div>

              <button
                onClick={() => handleCopy(activeScript.sql, activeScript.id)}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer self-start sm:self-auto shadow-md shadow-orange-500/20"
              >
                {copiedId === activeScript.id ? <Check size={15} /> : <Copy size={15} />}
                <span>{copiedId === activeScript.id ? 'Copied Script!' : 'Copy SQL'}</span>
              </button>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl bg-black/80 border border-white/10 p-4 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed selection:bg-orange-500 selection:text-black">
              <pre className="whitespace-pre">
                <code>{activeScript.sql}</code>
              </pre>
            </div>
          </div>

          {/* Instructions Footer */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400 shrink-0" />
              <span>
                1. Click <strong>Copy SQL</strong> &bull; 2. Open Supabase Dashboard &bull; 3. Paste into SQL Editor and click <strong>RUN</strong>!
              </span>
            </div>

            <a
              href="https://supabase.com/dashboard/project/mxstnicoyfytfxfahybx/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 shrink-0"
            >
              <span>Go to SQL Editor</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
