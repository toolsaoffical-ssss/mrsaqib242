import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  Save, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Eye, 
  MessageSquare, 
  Camera, 
  Link2
} from 'lucide-react';
import { FaTelegramPlane } from 'react-icons/fa';
import { 
  ProfileSettings, 
  DEFAULT_PROFILE_SETTINGS, 
  fetchProfileSettingsFromDB, 
  saveProfileSettingsToDB 
} from '../lib/profileSettingsService';

interface AdminProfileContactManagerProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
  isRestricted?: boolean;
}

export default function AdminProfileContactManager({ 
  onNotify, 
  isRestricted = false 
}: AdminProfileContactManagerProps) {
  const [profile, setProfile] = useState<ProfileSettings>(DEFAULT_PROFILE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'identity' | 'contact' | 'socials'>('identity');
  const [copiedApiUrl, setCopiedApiUrl] = useState<boolean>(false);

  // Load existing profile from backend
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch via admin API route first
      const res = await fetch('/api/admin/profile', { credentials: 'include' }).catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        if (json.settings) {
          setProfile({ ...DEFAULT_PROFILE_SETTINGS, ...json.settings });
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to Supabase service helper
      const { data } = await fetchProfileSettingsFromDB();
      if (data) {
        setProfile({ ...DEFAULT_PROFILE_SETTINGS, ...data });
      }
    } catch (err: any) {
      console.error('Failed to load profile settings:', err);
      onNotify('Could not load profile from cloud, loaded local cache', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Form Change
  const handleChange = (field: keyof ProfileSettings, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  // Helper to generate WhatsApp URL from phone
  const autoFormatWhatsApp = () => {
    const raw = (profile.phone || '').replace(/[^0-9]/g, '');
    if (!raw) {
      onNotify('Please enter a phone number first.', 'error');
      return;
    }
    const formatted = `https://wa.me/${raw}`;
    handleChange('whatsapp_url', formatted);
    onNotify('WhatsApp URL auto-generated!', 'success');
  };

  // Save Settings
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isRestricted) {
      onNotify('Travel Security Active: Saving is locked on this device for 48 hours.', 'error');
      return;
    }

    setSaving(true);
    try {
      // 1. Send to secure Admin API
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save profile');
      }

      // Also trigger service sync & local dispatch
      await saveProfileSettingsToDB(profile);

      if (json.warning) {
        onNotify(json.warning, 'error');
      } else {
        onNotify('Profile & Contact details saved successfully!', 'success');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      // Fallback save to local cache
      await saveProfileSettingsToDB(profile);
      onNotify(`Cloud save error: ${err.message}. Saved locally in browser.`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const copyPublicApiUrl = () => {
    navigator.clipboard.writeText('https://www.mrsaqib.me/api/public/contact');
    setCopiedApiUrl(true);
    onNotify('Public API URL copied!', 'success');
    setTimeout(() => setCopiedApiUrl(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 🚀 Header & Overview Card */}
      <div className="bg-[#12131a] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative group">
              <img
                src={profile.avatar_url || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90'}
                alt={profile.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-orange-500/40 shadow-xl"
                onError={(e: any) => {
                  e.target.src = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#12131a] rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{profile.name || 'Muhammad Saqib'}</h2>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-mono font-bold">
                  {profile.short_name || 'Saqib'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-0.5">{profile.tagline}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Synced with Central API
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  📍 {profile.location}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold flex items-center gap-1.5 border border-white/5 transition-colors cursor-pointer"
              title="Refresh from cloud"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            <a
              href="/live-contact.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
            >
              <Eye size={14} />
              <span>View Live Hub</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={copyPublicApiUrl}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
            >
              {copiedApiUrl ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedApiUrl ? 'Copied API!' : 'API URL'}</span>
            </button>

            <button
              onClick={() => handleSave()}
              disabled={saving || isRestricted}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* 48-Hour Restriction Notice */}
        {isRestricted && (
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-3">
            <AlertTriangle size={18} className="shrink-0 text-amber-400" />
            <div>
              <span className="font-bold">Travel Security Lock Active:</span> Profile updates are view-only until this device is verified or 48 hours elapse.
            </div>
          </div>
        )}
      </div>

      {/* 🧭 Section Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSection('identity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSection === 'identity'
              ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <User size={14} />
          <span>Profile &amp; Hero Details</span>
        </button>

        <button
          onClick={() => setActiveSection('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSection === 'contact'
              ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Phone size={14} />
          <span>Phone, WhatsApp &amp; Email</span>
        </button>

        <button
          onClick={() => setActiveSection('socials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSection === 'socials'
              ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20'
              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* 📝 FORM BODY */}
      <form onSubmit={handleSave} className="space-y-6">

        {/* ============================================================== */}
        {/* SECTION 1: IDENTITY & HERO */}
        {/* ============================================================== */}
        {activeSection === 'identity' && (
          <div className="bg-[#12131a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User size={16} className="text-orange-400" />
                  <span>Personal Brand &amp; Bio Information</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Controls your name, avatar image, title, and bio across the entire site.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Muhammad Saqib"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-sans transition-colors"
                  required
                />
              </div>

              {/* Short Name / Nickname */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Short Name / Nickname
                </label>
                <input
                  type="text"
                  value={profile.short_name || ''}
                  onChange={e => handleChange('short_name', e.target.value)}
                  placeholder="Saqib"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-sans transition-colors"
                />
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Brand / Studio Name
                </label>
                <input
                  type="text"
                  value={profile.brand_name || ''}
                  onChange={e => handleChange('brand_name', e.target.value)}
                  placeholder="Saqib Visuals"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-sans transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Current City &amp; Country
                </label>
                <input
                  type="text"
                  value={profile.location || ''}
                  onChange={e => handleChange('location', e.target.value)}
                  placeholder="Gojra, Faisalabad, Pakistan"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-sans transition-colors"
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Professional Headline / Tagline
              </label>
              <input
                type="text"
                value={profile.tagline || ''}
                onChange={e => handleChange('tagline', e.target.value)}
                placeholder="Full-Stack Engineer & Cyber Security Specialist"
                className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-sans transition-colors"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center justify-between">
                <span>Avatar Image URL (ImageKit / Cloudinary / Supabase Storage)</span>
                <span className="text-zinc-500 text-[10px] font-mono lowercase">Direct HTTPS URL</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={profile.avatar_url || ''}
                  onChange={e => handleChange('avatar_url', e.target.value)}
                  placeholder="https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleChange('avatar_url', 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90')}
                  className="shrink-0 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-300 text-xs font-mono border border-white/5 transition-colors cursor-pointer"
                  title="Reset to default official avatar"
                >
                  Official
                </button>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Executive Bio / Summary
              </label>
              <textarea
                rows={3}
                value={profile.bio || ''}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="Available for elite web applications, Next.js SaaS engineering, and AI chatbot integrations."
                className="w-full bg-[#181922] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-sans transition-colors leading-relaxed"
              />
            </div>

            {/* Hero Card Customizations (Status, Badges & Scope) */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Contact Page Hero Customizations</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contract Status */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Contract Availability Status
                  </label>
                  <input
                    type="text"
                    value={profile.contract_status || ''}
                    onChange={e => handleChange('contract_status', e.target.value)}
                    placeholder="Open for New Projects"
                    className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-sans transition-colors"
                  />
                </div>

                {/* Contract Subtitle */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Status Pill Subtitle
                  </label>
                  <input
                    type="text"
                    value={profile.contract_subtitle || ''}
                    onChange={e => handleChange('contract_subtitle', e.target.value)}
                    placeholder="Remote Worldwide • NDA Protected"
                    className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-sans transition-colors"
                  />
                </div>

                {/* Availability Note */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Location Scope &amp; Availability Note
                  </label>
                  <input
                    type="text"
                    value={profile.availability_note || ''}
                    onChange={e => handleChange('availability_note', e.target.value)}
                    placeholder="Available for Remote Worldwide Contracts & Security Audits."
                    className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-sans transition-colors"
                  />
                </div>

                {/* ID Badge */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Verified ID Badge Text
                  </label>
                  <input
                    type="text"
                    value={profile.badge_text || ''}
                    onChange={e => handleChange('badge_text', e.target.value)}
                    placeholder="Verified ID"
                    className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: CONTACT CHANNELS */}
        {/* ============================================================== */}
        {activeSection === 'contact' && (
          <div className="bg-[#12131a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Phone size={16} className="text-emerald-400" />
                  <span>Direct Communication Lines</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Used by prospective clients to initiate direct WhatsApp calls, voice calls, and emails.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Direct Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.phone || ''}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="03478936242"
                    className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                  />
                  <div className="absolute right-3 top-3.5 text-zinc-500">
                    <Phone size={15} />
                  </div>
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Official Client Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email || ''}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="mrsaqib242242@gmail.com"
                    className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                  />
                  <div className="absolute right-3 top-3.5 text-zinc-500">
                    <Mail size={15} />
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Link */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                  WhatsApp Direct URL / Link
                </label>
                <button
                  type="button"
                  onClick={autoFormatWhatsApp}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={12} />
                  <span>Auto-format from Phone</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="url"
                  value={profile.whatsapp_url || ''}
                  onChange={e => handleChange('whatsapp_url', e.target.value)}
                  placeholder="https://wa.me/923478936242"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                />
                <div className="absolute right-3 top-3.5 text-emerald-500">
                  <MessageSquare size={15} />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <span>⚡ Live short redirect: <strong className="text-emerald-400">/whatsapp</strong> (or /wa)</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://www.mrsaqib.me/whatsapp');
                    onNotify('Copied /whatsapp short redirect link!', 'success');
                  }}
                  className="text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                >
                  Copy Short Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: SOCIAL MEDIA CHANNELS */}
        {/* ============================================================== */}
        {activeSection === 'socials' && (
          <div className="bg-[#12131a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Share2 size={16} className="text-pink-400" />
                  <span>Social Profiles &amp; Digital Hubs</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Manage all social networks. Any empty URL will be automatically hidden from the public hub.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Instagram */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-pink-400 mb-2 flex items-center gap-1.5">
                  <Camera size={13} />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="url"
                  value={profile.instagram_url || ''}
                  onChange={e => handleChange('instagram_url', e.target.value)}
                  placeholder="https://www.instagram.com/mr_saqib242"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 font-mono transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <span>Redirects from: <strong className="text-pink-400">/instagram</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://www.mrsaqib.me/instagram');
                      onNotify('Copied /instagram short link!', 'success');
                    }}
                    className="text-pink-400 hover:underline cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                  <Globe size={13} />
                  <span>Facebook Profile URL</span>
                </label>
                <input
                  type="url"
                  value={profile.facebook_url || ''}
                  onChange={e => handleChange('facebook_url', e.target.value)}
                  placeholder="https://www.facebook.com/profile.php?id=100085188689033"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <span>Redirects from: <strong className="text-blue-400">/facebook</strong> (or /fb)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://www.mrsaqib.me/facebook');
                      onNotify('Copied /facebook short link!', 'success');
                    }}
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1.5">
                  <Share2 size={13} />
                  <span>TikTok Profile URL</span>
                </label>
                <input
                  type="url"
                  value={profile.tiktok_url || ''}
                  onChange={e => handleChange('tiktok_url', e.target.value)}
                  placeholder="https://www.tiktok.com/@mr_saqib_242"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 font-mono transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <span>Redirects from: <strong className="text-rose-400">/tiktok</strong> (or /tt)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://www.mrsaqib.me/tiktok');
                      onNotify('Copied /tiktok short link!', 'success');
                    }}
                    className="text-rose-400 hover:underline cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Snapchat */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-yellow-300 mb-2 flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  <span>Snapchat Profile URL</span>
                </label>
                <input
                  type="url"
                  value={profile.snapchat_url || ''}
                  onChange={e => handleChange('snapchat_url', e.target.value)}
                  placeholder="https://www.snapchat.com/add/mrsaqib242"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400 font-mono transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <span>Redirects from: <strong className="text-yellow-300">/snapchat</strong> (or /snap)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://www.mrsaqib.me/snapchat');
                      onNotify('Copied /snapchat short link!', 'success');
                    }}
                    className="text-yellow-300 hover:underline cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Telegram */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                  <FaTelegramPlane size={13} />
                  <span>Telegram Profile / Channel URL (@mrsaqib242)</span>
                </label>
                <input
                  type="url"
                  value={profile.telegram_url || ''}
                  onChange={e => handleChange('telegram_url', e.target.value)}
                  placeholder="https://t.me/mrsaqib242"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-sky-400 font-mono transition-colors"
                />
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  <span>Redirects from: <strong className="text-sky-400">/telegram</strong> (or /tg)</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('https://www.mrsaqib.me/telegram');
                      onNotify('Copied /telegram short link!', 'success');
                    }}
                    className="text-sky-400 hover:underline cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                  <Link2 size={13} />
                  <span>GitHub Profile URL</span>
                </label>
                <input
                  type="url"
                  value={profile.github_url || ''}
                  onChange={e => handleChange('github_url', e.target.value)}
                  placeholder="https://github.com/mrsaqib242"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 font-mono transition-colors"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
                  <Globe size={13} />
                  <span>Portfolio Domain URL</span>
                </label>
                <input
                  type="url"
                  value={profile.portfolio_url || ''}
                  onChange={e => handleChange('portfolio_url', e.target.value)}
                  placeholder="https://www.mrsaqib.me"
                  className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
                />
              </div>

              {/* Resume */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <FileText size={13} />
                    <span>Resume / CV PDF URL</span>
                  </label>
                  <a
                    href={profile.resume_url || '/resume.pdf'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-teal-400 hover:text-teal-300 font-mono flex items-center gap-1 underline"
                  >
                    <span>Test Download / Preview CV</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={profile.resume_url || ''}
                      onChange={e => handleChange('resume_url', e.target.value)}
                      placeholder="/resume.pdf"
                      className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 font-mono transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={profile.cv_badge || ''}
                      onChange={e => handleChange('cv_badge', e.target.value)}
                      placeholder="PDF 2026/27"
                      className="w-full bg-[#181922] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 font-mono transition-colors"
                      title="CV Download Pill Badge"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 font-mono">Use default <code>/resume.pdf</code> (official generated CV) or paste any direct Google Drive / Dropbox PDF link.</p>
              </div>
            </div>
          </div>
        )}

        {/* Sticky / Bottom Submit Bar */}
        <div className="flex items-center justify-between bg-[#12131a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sticky bottom-4 z-30">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Changes sync across database &amp; live REST API immediately.</span>
          </div>

          <button
            type="submit"
            disabled={saving || isRestricted}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save Profile Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
