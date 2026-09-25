import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Search,
  Filter,
  Download,
  Database,
  ExternalLink,
  Wrench,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Cpu,
  Battery,
  BatteryCharging,
  Wifi,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import {
  SiteAnalyticsEntry,
  fetchSiteAnalyticsFromDB,
  getCountryFlag,
  seedDefaultAnalyticsToDB
} from '../lib/analyticsService';

interface AdminTrafficAnalyticsProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

export default function AdminTrafficAnalytics({ onNotify }: AdminTrafficAnalyticsProps) {
  const [entries, setEntries] = useState<SiteAnalyticsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFromDB, setIsFromDB] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'page_view' | 'tool_click'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const loadData = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await fetchSiteAnalyticsFromDB();
      setEntries(res.entries);
      setIsFromDB(res.fromDatabase);
      if (res.error && !isBackground) {
        onNotify(`Supabase note: ${res.error}. Showing live local cache.`, 'error');
      }
    } catch (e) {
      if (!isBackground) onNotify('Failed to load traffic analytics', 'error');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setEntries(e.detail);
      }
    };
    window.addEventListener('site-analytics-updated', handleUpdate);

    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData(true);
      }, 15000);
    }

    return () => {
      window.removeEventListener('site-analytics-updated', handleUpdate);
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Sync sample analytics and tool visitors to your database?')) return;
    setLoading(true);
    const res = await seedDefaultAnalyticsToDB();
    if (res.error) {
      onNotify(`Could not seed: ${res.error}. Run SQL script in Supabase first!`, 'error');
    } else {
      onNotify(`Successfully synced ${res.count} visitor records!`, 'success');
      loadData();
    }
    setLoading(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'IP Address',
      'Event Type',
      'Path / Target',
      'Tool Name',
      'Tool Category',
      'City',
      'Country',
      'Browser',
      'OS',
      'Device',
      'Screen',
      'Referrer',
      'Created At'
    ];

    const rows = entries.map(e => [
      `"${e.id}"`,
      `"${e.ip_address}"`,
      `"${e.event_type}"`,
      `"${e.path}"`,
      `"${e.tool_name || ''}"`,
      `"${e.tool_category || ''}"`,
      `"${e.city}"`,
      `"${e.country}"`,
      `"${e.browser}"`,
      `"${e.os}"`,
      `"${e.device_type}"`,
      `"${e.screen_resolution}"`,
      `"${e.referrer}"`,
      `"${e.created_at}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saqib_traffic_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('Exported traffic analytics to CSV', 'success');
  };

  // High-level analytics metrics
  const stats = useMemo(() => {
    const total = entries.length;
    const uniques = new Set(entries.map(e => e.ip_address)).size;
    const toolClicks = entries.filter(e => e.event_type === 'tool_click').length;
    const pageViews = entries.filter(e => e.event_type === 'page_view').length;

    // Top Country
    const countries: Record<string, { count: number; code?: string }> = {};
    entries.forEach(e => {
      const c = e.country || 'Unknown';
      if (!countries[c]) countries[c] = { count: 0, code: e.country_code };
      countries[c].count++;
    });
    const sortedCountries = Object.entries(countries).sort((a, b) => b[1].count - a[1].count);
    const topCountry = sortedCountries[0] ? sortedCountries[0][0] : 'Pakistan';
    const topCountryCode = sortedCountries[0] ? sortedCountries[0][1].code : 'PK';

    // Top Browser
    const browsers: Record<string, number> = {};
    entries.forEach(e => {
      const b = (e.browser || 'Chrome').split(' ')[0];
      browsers[b] = (browsers[b] || 0) + 1;
    });
    const topBrowser = Object.entries(browsers).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Chrome';

    // Top OS
    const osMap: Record<string, number> = {};
    entries.forEach(e => {
      const o = e.os || 'WINDOWS';
      osMap[o] = (osMap[o] || 0) + 1;
    });
    const topOS = Object.entries(osMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'WINDOWS';

    // Device breakdown
    const mobileCount = entries.filter(e => e.device_type === 'mobile').length;
    const desktopCount = entries.filter(e => e.device_type === 'desktop').length;
    const mobilePercent = total > 0 ? Math.round((mobileCount / total) * 100) : 50;
    const desktopPercent = 100 - mobilePercent;

    // Tool Leaderboard
    const toolStats: Record<string, { count: number; category: string; lastSeen: string; uniqueIps: Set<string> }> = {};
    entries.filter(e => e.event_type === 'tool_click' && e.tool_name).forEach(e => {
      const name = e.tool_name!;
      if (!toolStats[name]) {
        toolStats[name] = {
          count: 0,
          category: e.tool_category || 'Utilities',
          lastSeen: e.created_at,
          uniqueIps: new Set()
        };
      }
      toolStats[name].count++;
      toolStats[name].uniqueIps.add(e.ip_address);
      if (new Date(e.created_at) > new Date(toolStats[name].lastSeen)) {
        toolStats[name].lastSeen = e.created_at;
      }
    });

    const sortedTools = Object.entries(toolStats)
      .map(([name, data]) => ({
        name,
        category: data.category,
        clicks: data.count,
        uniques: data.uniqueIps.size,
        lastSeen: data.lastSeen
      }))
      .sort((a, b) => b.clicks - a.clicks);

    return {
      total,
      uniques,
      toolClicks,
      pageViews,
      topCountry,
      topCountryCode,
      topBrowser,
      topOS,
      mobilePercent,
      desktopPercent,
      sortedCountries,
      sortedTools,
      lastActive: entries[0] ? new Date(entries[0].created_at) : null
    };
  }, [entries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        e.ip_address.toLowerCase().includes(q) ||
        (e.city && e.city.toLowerCase().includes(q)) ||
        (e.country && e.country.toLowerCase().includes(q)) ||
        (e.tool_name && e.tool_name.toLowerCase().includes(q)) ||
        (e.path && e.path.toLowerCase().includes(q)) ||
        (e.browser && e.browser.toLowerCase().includes(q)) ||
        (e.os && e.os.toLowerCase().includes(q));

      const matchesType =
        filterType === 'all' ||
        (filterType === 'tool_click' && e.event_type === 'tool_click') ||
        (filterType === 'page_view' && e.event_type === 'page_view');

      return matchesSearch && matchesType;
    });
  }, [entries, searchQuery, filterType]);

  const timeAgo = (dateStr: string) => {
    const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${Math.floor(diffHr / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Clicks */}
        <div className="bg-[#121319] border border-blue-500/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-400">Total Visits</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white">{stats.total}</div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">{stats.pageViews} Page Views</span>
            </div>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-[#121319] border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Unique Visitors</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Globe size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-white">{stats.uniques}</div>
            <div className="text-[11px] text-zinc-400 mt-1">Unique IP Addresses</div>
          </div>
        </div>

        {/* Tool Visitors & Clicks */}
        <div className="bg-[#121319] border border-orange-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-orange-950/20 to-[#121319] shadow-lg shadow-orange-500/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">Tool Visitors</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Wrench size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-orange-400">{stats.toolClicks}</div>
            <div className="text-[11px] text-zinc-300 mt-1 font-semibold flex items-center gap-1">
              <span>{stats.sortedTools.length} Tools Engaged</span>
            </div>
          </div>
        </div>

        {/* Top Geo / Last Active */}
        <div className="bg-[#121319] border border-purple-500/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-400">Top Geo Location</span>
            <div className="text-xl">{getCountryFlag(stats.topCountryCode, stats.topCountry)}</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-white truncate">{stats.topCountry}</div>
            <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-2">
              <span className="text-purple-400 font-bold">{stats.topBrowser}</span>
              <span>&bull;</span>
              <span>{stats.topOS}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#121319] border border-white/10 rounded-2xl p-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by IP, city, country, tool name, or browser..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors font-mono text-xs sm:text-sm"
          />
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Event Filter */}
          <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-orange-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Traffic ({entries.length})
            </button>
            <button
              onClick={() => setFilterType('tool_click')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                filterType === 'tool_click'
                  ? 'bg-orange-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Wrench size={12} />
              <span>Tool Visits ({stats.toolClicks})</span>
            </button>
            <button
              onClick={() => setFilterType('page_view')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'page_view'
                  ? 'bg-orange-500 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Page Views ({stats.pageViews})
            </button>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
            title="Auto-refresh every 15s"
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
            <span>{autoRefresh ? 'Live Sync ON' : 'Live Sync Paused'}</span>
          </button>

          {/* Refresh Manual */}
          <button
            onClick={() => loadData(false)}
            title="Refresh from Supabase"
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            title="Export Analytics CSV"
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Cloud Status Notice */}
      <div className="flex items-center justify-between text-xs px-2 text-zinc-400">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isFromDB ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>
            {isFromDB
              ? 'Connected to live Supabase site_analytics table'
              : 'Using high-speed local cache. Run the SQL Query to activate Supabase cloud persistence.'}
          </span>
        </div>
        <div>
          Showing {filteredEntries.length} of {entries.length} visitor logs
        </div>
      </div>

      {/* Tools Leaderboard & Geo Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tool Visitors Ranking */}
        <div className="lg:col-span-7 bg-[#121319] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Wrench size={16} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">Tool Visitors & Click Ranking</h3>
                <p className="text-xs text-zinc-400">Which tools visitors are exploring most</p>
              </div>
            </div>
            <span className="text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
              {stats.toolClicks} Total Tool Clicks
            </span>
          </div>

          {stats.sortedTools.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs">
              No tool clicks recorded yet. Clicks on the Tools page will automatically rank here!
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {stats.sortedTools.map((t, idx) => {
                const percent = stats.toolClicks > 0 ? Math.round((t.clicks / stats.toolClicks) * 100) : 0;
                return (
                  <div key={t.name} className="p-3 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-white font-mono font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">{t.name}</span>
                        <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md">
                          {t.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-orange-400 text-sm">{t.clicks}</span>
                        <span className="text-zinc-500 text-[10px] ml-1">clicks ({t.uniques} unique)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                        style={{ width: `${Math.max(percent, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Geo & Country Breakdown */}
        <div className="lg:col-span-5 bg-[#121319] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Globe size={16} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">Visitor Geo Origins</h3>
                <p className="text-xs text-zinc-400">Where traffic is arriving from</p>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {stats.sortedCountries.length} Countries
            </span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {stats.sortedCountries.map(([countryName, info]) => {
              const percent = stats.total > 0 ? Math.round((info.count / stats.total) * 100) : 0;
              const flag = getCountryFlag(info.code, countryName);
              return (
                <div key={countryName} className="p-3 bg-black/40 border border-white/5 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-lg leading-none">{flag}</span>
                      <span className="font-bold text-white">{countryName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-emerald-400">{info.count}</span>
                      <span className="text-zinc-500 text-[10px] ml-1">({percent}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.max(percent, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Visitor Detail Intel Table */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Activity size={18} className="text-emerald-400 animate-pulse" />
              <span>Real-Time Visitor Log & Deep Device Intel</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Live incoming traffic with IP, target page or tool, system specs, GPU, battery, and geolocation.
            </p>
          </div>

          {entries.length === 0 && (
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold hover:bg-orange-500/30"
            >
              Seed Sample Visitor Logs
            </button>
          )}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-black/40">
              <tr>
                <th className="px-5 py-4">Visitor & IP</th>
                <th className="px-5 py-4">Target / Action</th>
                <th className="px-5 py-4">Geolocation</th>
                <th className="px-5 py-4">Device & OS</th>
                <th className="px-5 py-4">Hardware Intel</th>
                <th className="px-5 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEntries.map(row => {
                const date = new Date(row.created_at);
                const flag = getCountryFlag(row.country_code, row.country);
                const isTool = row.event_type === 'tool_click';

                return (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Visitor & IP */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Monitor size={14} className="text-zinc-500 shrink-0" />
                        <span className="font-mono text-white text-xs font-bold tracking-wide">
                          {row.ip_address}
                        </span>
                        <button
                          onClick={() => handleCopyIp(row.ip_address)}
                          title="Copy IP"
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white transition-opacity"
                        >
                          {copiedIp === row.ip_address ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">
                        Ref: <span className="text-zinc-400">{row.referrer || 'Direct'}</span>
                      </div>
                    </td>

                    {/* Target / Action */}
                    <td className="px-5 py-4">
                      {isTool ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            <Wrench size={10} />
                            <span>Tool Click</span>
                          </span>
                          <div className="text-xs font-bold text-white">{row.tool_name}</div>
                          {row.tool_category && (
                            <div className="text-[10px] text-zinc-400">{row.tool_category}</div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <span>Page View</span>
                          </span>
                          <div className="text-xs font-mono text-zinc-300 truncate max-w-[180px]" title={row.path}>
                            {row.path}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Geolocation */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{flag}</span>
                        <div>
                          <div className="text-xs font-bold text-white">
                            {row.city && row.city !== 'Unknown' ? `${row.city}, ` : ''}{row.country || 'Pakistan'}
                          </div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            {row.timezone?.split('/').pop()?.replace(/_/g, ' ') || 'UTC'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Device & OS */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                        {row.device_type === 'mobile' ? (
                          <Smartphone size={13} className="text-zinc-400" />
                        ) : row.device_type === 'tablet' ? (
                          <Tablet size={13} className="text-zinc-400" />
                        ) : (
                          <Monitor size={13} className="text-zinc-400" />
                        )}
                        <span>{row.browser}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                        {row.os} &bull; {row.device_type}
                      </div>
                    </td>

                    {/* Hardware Intel */}
                    <td className="px-5 py-4 text-xs text-zinc-400 font-mono">
                      <div className="flex items-center gap-2 flex-wrap text-[11px] mb-1">
                        {row.battery_level !== null && row.battery_level !== undefined && (
                          <span className="inline-flex items-center gap-1 text-zinc-300">
                            {row.is_charging ? (
                              <BatteryCharging size={12} className="text-orange-400" />
                            ) : (
                              <Battery size={12} className="text-emerald-400" />
                            )}
                            <span>{row.battery_level}%</span>
                          </span>
                        )}

                        <span className="text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
                          {row.screen_resolution}
                        </span>

                        {row.network_type && (
                          <span className="text-cyan-400 text-[10px] font-bold">
                            {row.network_type.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-zinc-500 truncate max-w-[200px]" title={row.webgl_renderer || 'GPU'}>
                        {row.webgl_renderer ? row.webgl_renderer.replace(/(ANGLE|Direct3D|vs_.*|ps_.*)/gi, '').trim().slice(0, 32) : 'Hardware accelerated'}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="px-5 py-4 text-right font-mono text-xs">
                      <div className="text-white font-bold">{timeAgo(row.created_at)}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-mono text-xs">
                    No visitor records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
