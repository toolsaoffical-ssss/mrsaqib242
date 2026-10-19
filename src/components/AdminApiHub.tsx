import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Server, 
  Globe, 
  Power, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  ShieldCheck, 
  Copy, 
  Check,
  Bot,
  Sparkles,
  Code2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Zap,
  Info,
  Terminal,
  FileJson
} from 'lucide-react';

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

type TabType = 'prompt' | 'js' | 'react' | 'json';

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
  const [copiedAiApi, setCopiedAiApi] = useState<string | null>(null);
  const [copiedAllAi, setCopiedAllAi] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  
  // Accordion state: which API is currently expanded to view usage method & code
  const [expandedApi, setExpandedApi] = useState<string | null>(null);
  // Active code tab per API
  const [activeTabs, setActiveTabs] = useState<Record<string, TabType>>({
    projects_api_enabled: 'prompt',
    picks_api_enabled: 'prompt',
    contact_api_enabled: 'prompt',
  });

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

  // Helper to copy text to clipboard with toast
  const copyText = (text: string, identifier: string, message: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(identifier);
    setTimeout(() => setCopiedSnippet(null), 2500);
    onNotify(message, 'success');
  };

  const getOrigin = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return 'https://mrsaqib242.vercel.app';
  };

  // API Catalog Definitions with Code, Sample JSON & AI Prompts
  const apiDefinitions = [
    {
      key: 'projects_api_enabled' as keyof ApiSettings,
      label: 'Projects API',
      badge: 'Portfolio Data',
      desc: 'Fetches all published active projects with image URLs, categories, live demo links, and GitHub repositories.',
      endpoint: '/api/public/projects',
      method: 'GET',
      sampleResponse: {
        success: true,
        count: 6,
        data: [
          {
            id: 'uuid-1',
            title: 'Cinematic AI Web Portfolio',
            category: 'Web Development',
            description: 'Ultra-fast Next.js 15 portfolio with Gemini AI integration.',
            image_url: 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
            live_url: 'https://mrsaqib242.vercel.app',
            github_url: 'https://github.com/mrsaqib242',
            tags: ['React', 'Next.js', 'Tailwind CSS'],
            display_order: 1,
            is_active: true
          }
        ]
      },
      jsCode: (url: string) => `// Fetch active projects from Mr Saqib's Central API
async function getMrSaqibProjects() {
  try {
    const response = await fetch('${url}', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }

    const result = await response.json();
    if (result.success) {
      console.log('Projects loaded:', result.data);
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to load projects');
    }
  } catch (err) {
    console.error('Error fetching projects:', err);
    return [];
  }
}`,
      reactCode: (url: string) => `import React, { useState, useEffect } from 'react';

export default function ProjectsShowcase() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const res = await fetch('${url}');
        if (!res.ok) throw new Error(\`Failed to fetch: \${res.status}\`);
        const json = await res.json();
        if (json.success) {
          setProjects(json.data);
        } else {
          throw new Error(json.error || 'API Error');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) return <div className="p-8 text-center text-zinc-400">Loading projects...</div>;
  if (error) return <div className="p-8 text-center text-red-400">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.map((item) => (
        <div key={item.id} className="bg-zinc-900 border border-white/10 rounded-2xl p-5 overflow-hidden">
          {item.image_url && (
            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4" />
          )}
          <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{item.category}</span>
          <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
          <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{item.description}</p>
          <div className="mt-4 flex gap-3">
            {item.live_url && (
              <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-400 hover:underline">
                Live Demo →
              </a>
            )}
            {item.github_url && (
              <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-zinc-400 hover:text-white">
                GitHub Repo
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}`,
      aiPrompt: (url: string, isActive: boolean) => `### 🤖 AI Integration Instructions & Note for Mr Saqib Projects API

**API Endpoint**: ${url}
**HTTP Method**: GET
**Current Status**: ${isActive ? 'ACTIVE (Enabled)' : '⚠️ CURRENTLY DISABLED in Central API Hub'}
**Content-Type**: application/json

#### ⚠️ CRITICAL DEVELOPER & AI NOTE:
1. **CORS & Domain Whitelisting**:
   - This API is protected by Mr Saqib's Central API Hub CORS Guard.
   - The website/domain making this request (e.g., https://your-portfolio.vercel.app or http://localhost:3000) MUST be added to the "Allowed Domains" list in Mr Saqib's Master Admin API Hub.
   - If the domain is not whitelisted, the API returns HTTP 403 Forbidden ("Access denied: domain not authorized").
2. **Data Structure**:
   - Returns JSON: { success: true, count: number, data: Array<{ id, title, category, description, image_url, live_url, github_url, tags, display_order }> }

#### 🎯 Task for AI Assistant:
"Please use the API endpoint '${url}' (Method: GET) to build a modern, high-performance portfolio projects showcase component in React and Tailwind CSS. Include skeleton loaders, responsive grid layout, error handling with a friendly retry button, and links to live demos and GitHub repos."`
    },

    {
      key: 'picks_api_enabled' as keyof ApiSettings,
      label: 'Gallery Picks API',
      badge: 'Visual Gallery',
      desc: 'Fetches active high-resolution photography and creative visual works curated by Muhammad Saqib.',
      endpoint: '/api/public/picks',
      method: 'GET',
      sampleResponse: {
        success: true,
        count: 12,
        data: [
          {
            id: 'uuid-pick-1',
            title: 'Cinematic Visual Shot',
            category: 'Creative Photography',
            image_url: 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png',
            display_order: 1,
            is_active: true
          }
        ]
      },
      jsCode: (url: string) => `// Fetch active gallery photos from Mr Saqib's Central API
async function getMrSaqibGalleryPicks() {
  try {
    const response = await fetch('${url}', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (err) {
    console.error('Error fetching gallery:', err);
    return [];
  }
}`,
      reactCode: (url: string) => `import React, { useState, useEffect } from 'react';

export default function GalleryShowcase() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await fetch('${url}');
        if (!res.ok) throw new Error(\`Failed to fetch: \${res.status}\`);
        const json = await res.json();
        if (json.success) setPicks(json.data);
        else throw new Error(json.error || 'Failed to load');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  if (loading) return <div className="text-center p-8 text-zinc-400">Loading gallery...</div>;
  if (error) return <div className="text-center p-8 text-red-400">Error: {error}</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {picks.map((item) => (
        <div key={item.id} className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 aspect-square">
          <img src={item.image_url} alt={item.title || 'Gallery Pick'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
            <span className="text-white text-xs font-bold">{item.title}</span>
            <span className="text-zinc-400 text-[10px]">{item.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}`,
      aiPrompt: (url: string, isActive: boolean) => `### 🤖 AI Integration Instructions & Note for Mr Saqib Gallery Picks API

**API Endpoint**: ${url}
**HTTP Method**: GET
**Current Status**: ${isActive ? 'ACTIVE (Enabled)' : '⚠️ CURRENTLY DISABLED in Central API Hub'}
**Content-Type**: application/json

#### ⚠️ CRITICAL DEVELOPER & AI NOTE:
1. **CORS & Domain Whitelisting**:
   - This API is CORS-protected. The calling domain (e.g. https://your-site.vercel.app or http://localhost:3000) MUST be registered in the "Allowed Domains" list in Mr Saqib's Master Admin API Hub.
   - Unregistered domains will receive HTTP 403 Forbidden.
2. **Data Structure**:
   - Returns JSON: { success: true, count: number, data: Array<{ id, title, category, image_url, display_order, is_active }> }

#### 🎯 Task for AI Assistant:
"Please use the API endpoint '${url}' (Method: GET) to build a smooth, luxury photography & visual showcase gallery component with an interactive fullscreen image lightbox in React and Tailwind CSS. Ensure lazy loading, responsive masonry/grid styling, and image aspect-ratio optimization."`
    },

    {
      key: 'contact_api_enabled' as keyof ApiSettings,
      label: 'Contact & Profile API',
      badge: 'Live Contact Info',
      desc: 'Fetches real-time contact details, phone (03478936242), direct WhatsApp link, verified bio, avatar, and social handles.',
      endpoint: '/api/public/contact',
      method: 'GET',
      sampleResponse: {
        success: true,
        data: {
          name: "Muhammad Saqib",
          short_name: "Saqib",
          tagline: "Full-Stack Engineer & Cyber Security Specialist",
          bio: "Available for high-performance Next.js SaaS apps & AI systems",
          email: "mrsaqib242242@gmail.com",
          phone: "03478936242",
          whatsapp: "https://wa.me/923478936242",
          location: "Gojra, Faisalabad, Pakistan",
          avatar: "https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png",
          instagram: "https://www.instagram.com/mr_saqib242",
          facebook: "https://www.facebook.com/profile.php?id=100085188689033",
          tiktok: "https://www.tiktok.com/@mr_saqib_242",
          snapchat: "https://www.snapchat.com/add/mrsaqib242",
          portfolio: "https://mrsaqib242.vercel.app",
          github: "https://github.com/mrsaqib242",
          contract_status: "Open for New Projects",
          availability_note: "Available for Remote Worldwide Contracts & Security Audits."
        }
      },
      jsCode: (url: string) => `// Fetch live contact and profile info from Mr Saqib's Central API
async function getMrSaqibProfile() {
  try {
    const response = await fetch('${url}', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (err) {
    console.error('Error fetching contact info:', err);
    return null;
  }
}`,
      reactCode: (url: string) => `import React, { useState, useEffect } from 'react';

export default function ContactHero() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('${url}');
        const json = await res.json();
        if (json.success) setProfile(json.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading || !profile) return <div className="text-zinc-400 p-6">Loading profile...</div>;

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto text-white">
      <div className="flex items-center gap-4 mb-4">
        {profile.avatar && (
          <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-500" />
        )}
        <div>
          <h2 className="text-xl font-bold">{profile.name}</h2>
          <p className="text-xs text-orange-400 font-medium">{profile.tagline}</p>
        </div>
      </div>
      <p className="text-xs text-zinc-300 leading-relaxed mb-6">{profile.bio}</p>
      <div className="flex flex-wrap gap-3">
        {profile.whatsapp && (
          <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-2">
            Chat on WhatsApp ({profile.phone})
          </a>
        )}
        {profile.email && (
          <a href={\`mailto:\${profile.email}\`} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
            {profile.email}
          </a>
        )}
      </div>
    </div>
  );
}`,
      aiPrompt: (url: string, isActive: boolean) => `### 🤖 AI Integration Instructions & Note for Mr Saqib Contact & Profile API

**API Endpoint**: ${url}
**HTTP Method**: GET
**Current Status**: ${isActive ? 'ACTIVE (Enabled)' : '⚠️ CURRENTLY DISABLED in Central API Hub'}
**Content-Type**: application/json

#### ⚠️ CRITICAL DEVELOPER & AI NOTE:
1. **CORS & Domain Whitelisting**:
   - This API is CORS-protected. The calling domain (e.g. https://your-site.vercel.app or http://localhost:3000) MUST be registered in the "Allowed Domains" list in Mr Saqib's Master Admin API Hub.
   - Without whitelisting, you will receive HTTP 403 Forbidden.
2. **Data Structure**:
   - Returns live JSON: { success: true, data: { name, short_name, tagline, bio, email, phone, whatsapp, location, avatar, instagram, facebook, tiktok, snapchat, portfolio, github, contract_status, cv_badge } }

#### 🎯 Task for AI Assistant:
"Please use the API endpoint '${url}' (Method: GET) to build a modern Developer Bio & Contact Card in React and Tailwind CSS. Render live contact options including WhatsApp direct chat button (03478936242), official email (mrsaqib242242@gmail.com), social media links, location, and contract availability badge."`
    }
  ];

  // Copy Entire API Spec for AI
  const copyAllApisForAi = () => {
    const origin = getOrigin();
    const fullSpec = `# 🌐 Muhammad Saqib (Saqib 242) — Central API Hub Master Documentation for AI

This document contains official, live API endpoints hosted on **${origin}**.
Use these APIs to integrate Mr Saqib's projects, photography gallery, and contact information into any external website or application.

---

## 🛡️ IMPORTANT SECURITY & CORS NOTE FOR AI & DEVELOPERS:
1. **Domain Whitelisting Required**:
   - Every external client website calling these APIs (e.g. \`https://client-domain.com\` or \`http://localhost:3000\`) MUST have its origin added to the **Allowed Domains** whitelist in Mr Saqib's Master Admin API Hub.
   - If the caller's origin is not whitelisted, the API Guard returns **HTTP 403 Forbidden**.
2. **Headers**: All requests are \`GET\` requests accepting \`application/json\`.
3. **Always implement loading skeletons and error handling with retry mechanisms.**

---

${apiDefinitions.map(api => {
  const fullUrl = `${origin}${api.endpoint}`;
  const isActive = settings[api.key];
  return `### ${api.label}
- **Endpoint**: \`${fullUrl}\`
- **Method**: \`${api.method}\`
- **Status**: ${isActive ? 'ACTIVE' : 'DISABLED'}
- **Description**: ${api.desc}

#### JavaScript Usage:
\`\`\`javascript
const res = await fetch('${fullUrl}');
const json = await res.json();
console.log(json.data);
\`\`\`

#### Sample Response:
\`\`\`json
${JSON.stringify(api.sampleResponse, null, 2)}
\`\`\`
`;
}).join('\n---\n\n')}

### 🤖 Overall AI Assistant Prompt:
"Please build a full-featured, responsive portfolio or client portal using Muhammad Saqib's 3 Central APIs above. Include a Hero section with contact info, a Projects showcase grid, and a Photo Gallery. Handle loading states, graceful error alerts if the domain is not whitelisted, and use Tailwind CSS for modern dark-mode styling."
`;

    navigator.clipboard.writeText(fullSpec);
    setCopiedAllAi(true);
    setTimeout(() => setCopiedAllAi(false), 2500);
    onNotify('Master AI Spec for All APIs copied to clipboard! Paste directly into ChatGPT, Claude, or Cursor.', 'success');
  };

  const copyAiPromptForApi = (apiDef: typeof apiDefinitions[0]) => {
    const origin = getOrigin();
    const fullUrl = `${origin}${apiDef.endpoint}`;
    const isActive = settings[apiDef.key];
    const promptText = apiDef.aiPrompt(fullUrl, isActive);

    navigator.clipboard.writeText(promptText);
    setCopiedAiApi(apiDef.key);
    setTimeout(() => setCopiedAiApi(null), 2500);
    onNotify(`Copied ${apiDef.label} AI Prompt & Note to clipboard!`, 'success');
  };

  if (loading) {
    return (
      <div className="text-zinc-400 p-8 flex justify-center items-center h-64">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const origin = getOrigin();

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Page Header with Master AI Copy Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Server size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Central API Hub &amp; Developer Engine
              </h2>
              <p className="text-zinc-400 mt-0.5 text-xs sm:text-sm">
                Control external access, copy AI-ready prompts with methods &amp; notes, and manage CORS domain whitelists.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold">
            <ShieldCheck size={15} />
            <span>CORS Guard Protected</span>
          </div>

          <button
            onClick={copyAllApisForAi}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-300 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-102 cursor-pointer"
            title="Copy all 3 APIs with full method, code, and notes for AI"
          >
            {copiedAllAi ? <Check size={16} /> : <Bot size={16} />}
            <span>{copiedAllAi ? 'Master Spec Copied!' : '🤖 Copy All APIs for AI'}</span>
          </button>
        </div>
      </div>

      {/* Helpful AI Integration Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171725] via-[#141522] to-[#10111a] border border-orange-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0 mt-0.5 sm:mt-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Integration Note &amp; Usage Method Guide</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30">
                ChatGPT • Claude • Cursor • v0 Ready
              </span>
            </h4>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed max-w-3xl">
              Jab aap kisi AI ko API dena chahein, to har API k sath mojood <strong>"Copy for AI + Note"</strong> button dabayein! Is me API URL, HTTP Method (GET), complete code snippets, JSON schema aur zaroori <strong>CORS Whitelist Note</strong> shamil hota hai taakay AI perfect working code bana sake.
            </p>
          </div>
        </div>

        <button
          onClick={copyAllApisForAi}
          className="shrink-0 text-xs text-orange-400 hover:text-orange-300 font-bold underline flex items-center gap-1 cursor-pointer"
        >
          <span>Copy Complete Documentation</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: PUBLIC APIS WITH FULL USAGE METHOD, CODE TABS & AI PROMPTS */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-orange-400" />
            <h3 className="text-lg font-black text-white">Live API Endpoints &amp; Integration Methods</h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">
            Origin: <strong className="text-zinc-300">{origin}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {apiDefinitions.map((api) => {
            const isActive = settings[api.key];
            const fullUrl = `${origin}${api.endpoint}`;
            const isExpanded = expandedApi === api.key;
            const activeTab = activeTabs[api.key] || 'prompt';
            const isUrlCopied = copiedApi === api.key;
            const isAiCopied = copiedAiApi === api.key;

            return (
              <div 
                key={api.key} 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xl ${
                  isActive 
                    ? 'bg-[#12131d] border-white/10 hover:border-orange-500/30' 
                    : 'bg-[#101117] border-white/5 opacity-80'
                }`}
              >
                {/* API Card Top Header */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isActive ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        <Code2 size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base sm:text-lg font-black text-white">{api.label}</h4>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {api.method}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-zinc-400 border border-white/10">
                            {api.badge}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {isActive ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{api.desc}</p>
                      </div>
                    </div>

                    {/* Kill Switch Toggle */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-xs font-bold text-zinc-400">
                        {isActive ? 'API Active' : 'API Paused'}
                      </span>
                      <button 
                        onClick={() => toggleGlobalSetting(api.key)}
                        className={`w-13 h-7 rounded-full transition-colors relative flex items-center shrink-0 cursor-pointer ${
                          isActive ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-zinc-800'
                        }`}
                        title={isActive ? 'Click to disable API' : 'Click to enable API'}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white absolute transition-all shadow-md ${
                          isActive ? 'right-1' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* URL Bar with Copy & AI Prompt Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-black/60 p-2.5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1">
                      <Terminal size={14} className="text-orange-400 shrink-0" />
                      <code className="text-xs text-zinc-200 font-mono truncate select-all">
                        {fullUrl}
                      </code>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Copy Raw URL Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(fullUrl);
                          setCopiedApi(api.key);
                          setTimeout(() => setCopiedApi(null), 2000);
                          onNotify(`Copied ${api.label} URL`, 'success');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Copy direct API URL"
                      >
                        {isUrlCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{isUrlCopied ? 'URL Copied!' : 'Copy URL'}</span>
                      </button>

                      {/* COPY FOR AI BUTTON WITH FULL NOTE & PROMPT */}
                      <button
                        onClick={() => copyAiPromptForApi(api)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md hover:scale-102 cursor-pointer"
                        title="Copy complete AI prompt, integration method, and CORS instructions"
                      >
                        {isAiCopied ? <Check size={13} /> : <Bot size={13} />}
                        <span>{isAiCopied ? 'Copied for AI!' : '🤖 Copy for AI + Note'}</span>
                      </button>

                      {/* Test in New Tab Link */}
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                        title="Test API directly in new browser tab"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Toggle Collapsible Drawer for Method & Code */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setExpandedApi(isExpanded ? null : api.key)}
                      className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      <BookOpen size={14} />
                      <span>{isExpanded ? 'Hide Usage Method & AI Note' : '📖 View Usage Method, Code & AI Note'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2">
                      <span>Method: <strong className="text-emerald-400 font-bold">{api.method}</strong></span>
                      <span>•</span>
                      <span>Format: <strong className="text-zinc-300">JSON</strong></span>
                    </div>
                  </div>
                </div>

                {/* ========================================== */}
                {/* COLLAPSIBLE METHOD & CODE TABS DRAWER */}
                {/* ========================================== */}
                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/50 p-5 sm:p-6 space-y-4">
                    
                    {/* Tab Navigation */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'prompt' as TabType, label: '🤖 AI Prompt & Note', icon: Bot },
                          { id: 'js' as TabType, label: '⚡ JavaScript (fetch)', icon: Terminal },
                          { id: 'react' as TabType, label: '⚛️ React Component', icon: Code2 },
                          { id: 'json' as TabType, label: '📦 Response JSON', icon: FileJson },
                        ].map((tab) => {
                          const isCurrent = activeTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTabs(prev => ({ ...prev, [api.key]: tab.id }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isCurrent
                                  ? 'bg-orange-500 text-black shadow-md'
                                  : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick Copy Active Tab Content */}
                      <button
                        onClick={() => {
                          let textToCopy = '';
                          if (activeTab === 'prompt') textToCopy = api.aiPrompt(fullUrl, isActive);
                          else if (activeTab === 'js') textToCopy = api.jsCode(fullUrl);
                          else if (activeTab === 'react') textToCopy = api.reactCode(fullUrl);
                          else if (activeTab === 'json') textToCopy = JSON.stringify(api.sampleResponse, null, 2);

                          copyText(textToCopy, `${api.key}-${activeTab}`, `Copied ${activeTab.toUpperCase()} snippet!`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedSnippet === `${api.key}-${activeTab}` ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                        <span>{copiedSnippet === `${api.key}-${activeTab}` ? 'Copied!' : 'Copy This Tab'}</span>
                      </button>
                    </div>

                    {/* Tab 1: AI Prompt with Note */}
                    {activeTab === 'prompt' && (
                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
                          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <strong>Developer &amp; AI Whitelist Rule:</strong>
                            <p className="text-zinc-300 mt-0.5">
                              Yeh API CORS-guarded hai. Jis website par yeh code chalega, uska domain (maslan <code className="text-amber-200">https://your-client-site.com</code> ya <code className="text-amber-200">http://localhost:3000</code>) neeche <strong>Allowed Domains</strong> list me add hona lazmi hai, warna AI or browser me <code>403 Forbidden</code> error aayega.
                            </p>
                          </div>
                        </div>

                        <div className="relative">
                          <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-zinc-300 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-orange-500 selection:text-black">
                            {api.aiPrompt(fullUrl, isActive)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: JavaScript (fetch) */}
                    {activeTab === 'js' && (
                      <div className="relative">
                        <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-emerald-300 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-orange-500 selection:text-black">
                          {api.jsCode(fullUrl)}
                        </pre>
                      </div>
                    )}

                    {/* Tab 3: React Component */}
                    {activeTab === 'react' && (
                      <div className="relative">
                        <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-sky-300 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-orange-500 selection:text-black max-h-96">
                          {api.reactCode(fullUrl)}
                        </pre>
                      </div>
                    )}

                    {/* Tab 4: Response JSON */}
                    {activeTab === 'json' && (
                      <div className="relative">
                        <pre className="p-4 rounded-xl bg-[#090a0f] border border-white/10 text-amber-200 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-orange-500 selection:text-black max-h-80">
                          {JSON.stringify(api.sampleResponse, null, 2)}
                        </pre>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: ALLOWED DOMAINS (CORS WHITELIST) & SECURITY RULES */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Left 2 Columns: Whitelist Domains Manager */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="text-orange-400" size={18} />
                  Allowed Domains (CORS Whitelist)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sirf in websites ko aap ki master database se data lene ki ijazat hogi.
                </p>
              </div>

              <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 font-mono text-xs">
                {domains.filter(d => d.is_active).length} Active Domains
              </div>
            </div>
            
            <form onSubmit={addDomain} className="flex flex-col sm:flex-row gap-2 mb-6">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="https://client-portfolio.vercel.app ya http://localhost:3000"
                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
              <button 
                type="submit"
                disabled={!newDomain.trim()}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Plus size={16} />
                <span>Add Domain</span>
              </button>
            </form>

            <div className="space-y-2">
              {domains.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs sm:text-sm border border-dashed border-white/10 rounded-xl p-6">
                  <Globe size={28} className="mx-auto mb-2 text-zinc-600" />
                  <p className="font-bold text-zinc-400">No external domains whitelisted yet.</p>
                  <p className="text-zinc-500 text-xs mt-1">
                    Add the URL of your other client websites above to allow them to fetch data from these APIs.
                  </p>
                </div>
              ) : (
                domains.map((domain) => (
                  <div 
                    key={domain.id} 
                    className="flex items-center justify-between p-3.5 bg-black/40 hover:bg-white/[0.02] border border-white/5 rounded-xl group transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        domain.is_active 
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' 
                          : 'bg-rose-500'
                      }`} />
                      <span className="text-xs sm:text-sm text-zinc-200 font-mono truncate">{domain.domain}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleDomain(domain.id, domain.is_active)}
                        className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-lg border font-bold transition-colors cursor-pointer ${
                          domain.is_active 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                        }`}
                      >
                        {domain.is_active ? 'ACTIVE' : 'BLOCKED'}
                      </button>

                      <button
                        onClick={() => deleteDomain(domain.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer"
                        title="Remove Domain from Whitelist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Security Guidelines & Localhost Tip */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={18} />
              CORS &amp; AI Security Rules
            </h3>

            <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-zinc-200 block">1. Localhost Testing:</span>
                <p>
                  Jab aap local machine par code test kar rahe hon (e.g. Next.js / Vite on port 3000 ya 5173), to <code className="text-orange-400">http://localhost:3000</code> ko Allowed Domains me add karein.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-zinc-200 block">2. Automatic Clean Protocol:</span>
                <p>
                  Domain add karte waqt trailing slash (/) ya path likhne ki zaroori nahi, system khud URL ka origin extract kar leta hai.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-zinc-200 block">3. Instant Kill Switches:</span>
                <p>
                  Kisi bhi API ka switch off karne se foran tamam external websites ka data access stop ho jata hai.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex gap-2">
              <Info className="shrink-0 mt-0.5" size={15} />
              <p>
                Aap jab bhi naya project ya client website banayein, AI ko prompt dete waqt is page se <strong>Copy for AI</strong> kar k de dein!
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
