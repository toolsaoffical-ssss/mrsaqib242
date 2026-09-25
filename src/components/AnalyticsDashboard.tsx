import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Globe, Monitor, Clock, Wrench, RefreshCw, X, Shield, Cpu } from 'lucide-react';
import { fetchSiteAnalyticsFromDB, SiteAnalyticsEntry, getCountryFlag } from '../lib/analyticsService';
import { loginAdmin, verifyAdminSession } from '../lib/adminAuthClient';

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds <= 15) return "Just Now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export function AnalyticsDashboard({ 
  onClose, 
  initialAuthenticated = false 
}: { 
  onClose: () => void; 
  initialAuthenticated?: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [analytics, setAnalytics] = useState<SiteAnalyticsEntry[]>([]);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [uniqueIps, setUniqueIps] = useState<number>(0);
  const [totalToolClicks, setTotalToolClicks] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchSiteAnalyticsFromDB();
      setAnalytics(res.entries);
      setTotalClicks(res.totalVisits);
      setUniqueIps(res.uniqueIps);
      setTotalToolClicks(res.totalToolClicks);
    } catch (e) {
      console.warn('Analytics modal load error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify session on mount
  useEffect(() => {
    async function checkAuth() {
      if (!isAuthenticated) {
        const res = await verifyAdminSession();
        if (res.authenticated) {
          setIsAuthenticated(true);
        }
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        setIsAuthenticated(true);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    if (analytics.length === 0 && totalClicks === 0) {
      return { total: 0, uniques: 0, topBrowser: '--', lastActive: '--', toolClicks: 0 };
    }

    const browsers: Record<string, number> = {};
    analytics.forEach(row => {
      const b = (row.browser || 'Chrome').split(' ')[0];
      browsers[b] = (browsers[b] || 0) + 1;
    });

    let topB = '--';
    let max = 0;
    Object.entries(browsers).forEach(([b, count]) => {
      if (count > max) {
        max = count;
        topB = b;
      }
    });

    return {
      total: totalClicks,
      uniques: uniqueIps,
      topBrowser: topB,
      toolClicks: totalToolClicks,
      lastActive: analytics.length > 0 ? timeSince(new Date(analytics[0].created_at)) : '--'
    };
  }, [analytics, totalClicks, uniqueIps, totalToolClicks]);

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#111111] p-6 md:p-8 rounded-2xl md:rounded-[2rem] w-full max-w-sm shadow-2xl relative border border-white/5"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-3">
              <Shield size={22} />
            </div>
            <h2 className="font-display text-2xl text-white mb-1 uppercase tracking-widest font-bold">
              Visitor Intel
            </h2>
            <p className="text-white/40 text-xs uppercase tracking-widest">
              Live Cloud Traffic Monitor
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div>
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all font-mono text-xs"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 transition-all font-mono text-xs"
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs text-center font-mono uppercase tracking-wider">
                Invalid credentials. Access denied.
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-black font-black uppercase tracking-[0.2em] text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              Verify Identity
            </button>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#111111] p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[2rem] w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] shadow-2xl relative overflow-y-auto font-sans border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Visitor & Tool Intel</span>
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Active Supabase cloud analytics tracking IP, geo, tool visits, and hardware specs
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl md:rounded-2xl flex flex-col justify-between min-h-[120px] md:min-h-[140px] border border-white/5">
            <ArrowUpRight className="text-blue-500 mb-2 md:mb-4" size={20} />
            <div>
              <div className="text-3xl sm:text-4xl text-white font-light tracking-tight mb-1 md:mb-2">
                {stats.total}
              </div>
              <div className="text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white/40 uppercase">
                Total Clicks
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl md:rounded-2xl flex flex-col justify-between min-h-[120px] md:min-h-[140px] border border-white/5">
            <Globe className="text-emerald-500 mb-2 md:mb-4" size={20} />
            <div>
              <div className="text-3xl sm:text-4xl text-white font-light tracking-tight mb-1 md:mb-2">
                {stats.uniques}
              </div>
              <div className="text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white/40 uppercase">
                Uniques
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl md:rounded-2xl flex flex-col justify-between min-h-[120px] md:min-h-[140px] border border-orange-500/20 bg-gradient-to-br from-orange-950/20 to-[#1a1a1a]">
            <Wrench className="text-orange-500 mb-2 md:mb-4" size={20} />
            <div>
              <div className="text-3xl sm:text-4xl text-orange-400 font-light tracking-tight mb-1 md:mb-2">
                {stats.toolClicks}
              </div>
              <div className="text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-orange-300/60 uppercase">
                Tool Visitors
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-xl md:rounded-2xl flex flex-col justify-between min-h-[120px] md:min-h-[140px] border border-white/5">
            <Clock className="text-purple-500 mb-2 md:mb-4" size={20} />
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl text-white font-light tracking-tight mb-1 md:mb-2 truncate">
                {stats.lastActive}
              </div>
              <div className="text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white/40 uppercase">
                Last Active
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#161616] rounded-xl md:rounded-2xl border border-white/5 overflow-x-auto w-full">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="border-b border-white/5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
              <tr>
                <th className="px-6 py-5">Visitor Details</th>
                <th className="px-6 py-5">Target / Tool</th>
                <th className="px-6 py-5">System Specs</th>
                <th className="px-6 py-5">Device</th>
                <th className="px-6 py-5">Geo</th>
                <th className="px-6 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {analytics.map((row, i) => {
                const date = new Date(row.created_at);
                const flag = getCountryFlag(row.country_code, row.country);
                const isTool = row.event_type === 'tool_click';

                return (
                  <tr key={row.id || i} className="hover:bg-white/[0.02] transition-colors group">
                    {/* Visitor Details */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 mb-1">
                        <Monitor size={14} className="text-white/40" />
                        <span className="font-mono text-white tracking-wide text-xs">{row.ip_address}</span>
                      </div>
                      <div className="text-xs text-white/40 pl-6">{row.referrer || 'Direct'}</div>
                    </td>

                    {/* Target / Tool */}
                    <td className="px-6 py-5">
                      {isTool ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            <Wrench size={10} />
                            <span>Tool</span>
                          </span>
                          <div className="text-xs font-bold text-white">{row.tool_name || 'Tool'}</div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Page
                          </span>
                          <div className="text-xs font-mono text-white/60 truncate max-w-[140px]">{row.path || '/'}</div>
                        </div>
                      )}
                    </td>

                    {/* System Specs */}
                    <td className="px-6 py-5 text-xs text-white/50">
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        {row.battery_level !== null && row.battery_level !== undefined && (
                          <span className="flex items-center gap-1 text-[11px]">
                            <div className={`w-2 h-2 rounded-full ${row.is_charging ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                            <span>{row.battery_level}%</span>
                            {row.is_charging && <span className="text-orange-500">⚡</span>}
                          </span>
                        )}
                        <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded text-[10px]">
                          {row.timezone ? row.timezone.split('/').pop()?.replace(/_/g, ' ') : 'UTC'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] flex-wrap">
                        {row.network_type && (
                          <span className="bg-white/10 text-cyan-400 px-1.5 py-0.5 rounded">
                            {row.network_type.toUpperCase()}
                          </span>
                        )}
                        <span>{row.screen_resolution || '1920x1080'}</span>
                        {row.hardware_concurrency && (
                          <span className="text-red-400">Cores: {row.hardware_concurrency}</span>
                        )}
                      </div>
                      {row.device_memory && (
                        <div className="text-[10px] text-fuchsia-400 font-mono mt-1">
                          RAM: {row.device_memory}GB+
                        </div>
                      )}
                    </td>

                    {/* Device */}
                    <td className="px-6 py-5">
                      <div className="text-white text-xs font-semibold mb-0.5">{row.browser}</div>
                      <div className="text-[10px] tracking-widest text-white/40 uppercase mb-1">{row.os}</div>
                      <div
                        className="text-[10px] text-white/30 truncate max-w-[140px]"
                        title={row.webgl_renderer || 'GPU'}
                      >
                        GPU: {row.webgl_renderer ? row.webgl_renderer.replace(/(ANGLE|Direct3D|vs_.*|ps_.*)/gi, '').trim().slice(0, 24) : 'Integrated'}
                      </div>
                    </td>

                    {/* Geo */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{flag}</span>
                        <div>
                          <div className="text-white font-medium text-xs">
                            {row.city && row.city !== 'Unknown' ? `${row.city}, ` : ''}{row.country || 'Pakistan'}
                          </div>
                          <div className="text-[10px] text-white/40 uppercase tracking-widest">
                            {row.country_code || 'PK'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-5 text-right font-mono text-xs text-white/50">
                      <div className="text-white font-bold">{timeSince(date)}</div>
                      <div className="text-white/30 text-[10px] mt-0.5">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {analytics.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-white/40 font-mono text-sm">
                    No visitors recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
