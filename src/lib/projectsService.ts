import { supabase } from './supabase';

export interface ProjectItem {
  id?: string;
  name: string;
  url: string;
  tags: string[];
  restricted?: boolean;
  description: string;
  gradient?: string;
  category?: string;
  is_active?: boolean;
  is_pick?: boolean;
  display_order?: number;
  created_at?: string;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  { 
    name: "PNK Group", 
    url: "https://pnkgroup.zone.id", 
    tags: ["Restaurant"], 
    restricted: false,
    description: "Restaurant management website with digital menu, QR ordering, reservations, billing, delivery management, and admin dashboard.",
    gradient: "from-lime-500 to-emerald-600",
    category: "Restaurant",
    is_active: true,
    display_order: 1
  },
  { 
    name: "Open Bazaar", 
    url: "https://openbazaar.vercel.app", 
    tags: ["E-Commerce"], 
    restricted: false,
    description: "Complete full-stack marketplace featuring buyer and seller dashboards, secure payments, chat, order tracking, inventory, and admin panel.",
    gradient: "from-teal-500 to-emerald-600",
    category: "E-Commerce",
    is_active: true,
    display_order: 2
  },
  { 
    name: "MS Clothes", 
    url: "https://ms-clothes.vercel.app", 
    tags: ["E-Commerce"], 
    restricted: false,
    description: "Premium fashion store with beautiful UI, product management, wishlist, payment gateway, inventory, and admin control.",
    gradient: "from-rose-500 to-pink-500",
    category: "E-Commerce",
    is_active: true,
    display_order: 3
  },
  { 
    name: "Profit Hub", 
    url: "https://profite-hub.vercel.app", 
    tags: ["Finance"], 
    restricted: false,
    description: "Investment platform with automated calculations, analytics dashboard, admin controls, referrals, reports, and profit tracking.",
    gradient: "from-green-500 to-emerald-600",
    category: "Finance",
    is_active: true,
    display_order: 4
  },
  { 
    name: "MS Web Learning", 
    url: "https://ms-weblearning.vercel.app/", 
    tags: ["Education"], 
    restricted: false,
    description: "Interactive web engineering educational platform designed to learn how internet systems, servers, APIs, and modern codebases function.",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    category: "Education",
    is_active: true,
    display_order: 5
  },
  { 
    name: "Birthday Creator", 
    url: "https://ms-birthday-seven.vercel.app", 
    tags: ["Personal"], 
    restricted: false,
    description: "Create beautiful and interactive birthday websites with custom names, photos, music, animations, countdowns, and surprise effects.",
    gradient: "from-pink-500 via-rose-500 to-yellow-500",
    category: "Personal",
    is_active: true,
    display_order: 6
  },
  { 
    name: "Friend Love", 
    url: "https://ms-friend.vercel.app", 
    tags: ["Personal"], 
    restricted: false,
    description: "A beautiful friendship website where users can create memorable friendship pages with photos, messages, animations, and special moments.",
    gradient: "from-rose-500 to-pink-600",
    category: "Personal",
    is_active: true,
    display_order: 7
  },
  { 
    name: "MS Pro Portfolio", 
    url: "https://mspro.zone.id", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "A premium personal portfolio showcasing skills, projects, achievements, experience, contact information, and social profiles with modern animations.",
    gradient: "from-zinc-800 via-zinc-900 to-black",
    category: "Portfolio",
    is_active: true,
    display_order: 8
  },
  { 
    name: "Saqib Dev Hub", 
    url: "https://saqib.zone.id/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "The primary high-performance online gateway showcasing premium digital experiences and software design.",
    gradient: "from-blue-600 via-indigo-500 to-purple-600",
    category: "Portfolio",
    is_active: true,
    display_order: 9
  },
  { 
    name: "Saqib Developer Portal", 
    url: "https://saqibdeveloper.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "Elite level client-facing web design showcase highlighting responsive, rapid-loading frontend capabilities.",
    gradient: "from-cyan-500 to-blue-600",
    category: "Portfolio",
    is_active: true,
    display_order: 10
  },
  { 
    name: "Creative Saqib Showcase", 
    url: "https://creativesaqib.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "Visual and interactive development portfolio centered around ultra-modern CSS animations and design systems.",
    gradient: "from-pink-500 via-purple-600 to-indigo-500",
    category: "Portfolio",
    is_active: true,
    display_order: 11
  },
  { 
    name: "Developers Saqib Space", 
    url: "https://developerssaqib.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "Innovative frontend engineering sandbox displaying modular React apps and highly responsive page layouts.",
    gradient: "from-emerald-500 to-teal-600",
    category: "Portfolio",
    is_active: true,
    display_order: 12
  },
  { 
    name: "Top Dev Platform", 
    url: "https://topdev.zone.id/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "A supreme developer showcase for Pakistan's leading freelance web engineering and digital solutions.",
    gradient: "from-amber-500 to-orange-600",
    category: "Portfolio",
    is_active: true,
    display_order: 13
  },
  { 
    name: "Saqib Visuals Hub", 
    url: "https://saqibvisual.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "Stunning creative media and aesthetic visual design collection engineered for flawless speed and responsiveness.",
    gradient: "from-fuchsia-600 via-rose-500 to-amber-500",
    category: "Portfolio",
    is_active: true,
    display_order: 14
  },
  { 
    name: "MrSaqib Personal Brand", 
    url: "https://mrsaqib.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "Minimalist, sleek dark-mode portfolio highlighting Muhammad Saqib's global client successes.",
    gradient: "from-zinc-700 via-zinc-800 to-zinc-950",
    category: "Portfolio",
    is_active: true,
    display_order: 15
  },
  { 
    name: "Earth Portfolio 3D", 
    url: "https://earthporfolio.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "A gorgeous 3D interactive global experience and layout designed to showcase universal software scaling.",
    gradient: "from-emerald-600 via-cyan-500 to-blue-600",
    category: "Portfolio",
    is_active: true,
    display_order: 16
  },
  { 
    name: "MrSaqib242 Hub", 
    url: "https://mrsaqib242.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "The ultimate showcase of custom web widgets, high-conversion landing pages, and API microservices.",
    gradient: "from-purple-600 to-fuchsia-600",
    category: "Portfolio",
    is_active: true,
    display_order: 17
  },
  { 
    name: "Saqib Space", 
    url: "https://mrsaqib242.vercel.app/", 
    tags: ["Portfolio"], 
    restricted: false,
    description: "An elegant, bespoke shared creative space designed with dynamic visual typography and fluid mechanics.",
    gradient: "from-red-500 via-rose-500 to-pink-500",
    category: "Portfolio",
    is_active: true,
    display_order: 18
  },
  { 
    name: "Pro Tool Kit", 
    url: "https://protool.zone.id", 
    tags: ["Dev Tools"], 
    restricted: false,
    description: "A complete toolkit for developers featuring database utilities, encoders, decoders, generators, converters, validators, productivity tools, and more.",
    gradient: "from-cyan-500 via-blue-600 to-indigo-700",
    category: "Dev Tools",
    is_active: true,
    display_order: 19
  },
  { 
    name: "Saqib API Hub", 
    url: "https://apisaqibs.vercel.app/api", 
    tags: ["Dev Tools"], 
    restricted: false,
    description: "A powerful API platform providing ChatGPT APIs, downloader APIs, SIM information APIs, AI APIs, utility APIs, and many developer endpoints.",
    gradient: "from-indigo-500 to-purple-600",
    category: "Dev Tools",
    is_active: true,
    display_order: 20
  },
  { 
    name: "Icons Lab", 
    url: "https://icons-lab.vercel.app", 
    tags: ["UI Resources"], 
    restricted: false,
    description: "A huge collection of social media icons in multiple styles with SVG, PNG, React components, HTML code, CSS snippets, and source files.",
    gradient: "from-amber-400 to-orange-600",
    category: "UI Resources",
    is_active: true,
    display_order: 21
  },
  { 
    name: "Animation Hub", 
    url: "https://animationhub-gamma.vercel.app", 
    tags: ["UI Resources"], 
    restricted: false,
    description: "Premium animation library with HTML, CSS, JavaScript, React components, GSAP effects, Framer Motion examples, and source code.",
    gradient: "from-violet-500 via-purple-600 to-fuchsia-500",
    category: "UI Resources",
    is_active: true,
    display_order: 22
  },
  { 
    name: "Mobile Viewer", 
    url: "https://mobileviewer-eight.vercel.app", 
    tags: ["Dev Tools"], 
    restricted: false,
    description: "A responsive device emulator allowing developers to preview websites on multiple mobile devices, tablets, and desktop screens.",
    gradient: "from-blue-500 to-cyan-500",
    category: "Dev Tools",
    is_active: true,
    display_order: 23
  },
  { 
    name: "Tech AI", 
    url: "https://techai.zone.id", 
    tags: ["AI & Tech"], 
    restricted: false,
    description: "An AI-powered technology platform offering AI tools, automation, software, utilities, developer resources, and modern digital services.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    category: "AI & Tech",
    is_active: true,
    display_order: 24
  },
  { 
    name: "TechAI Hosting", 
    url: "https://techai1.kesug.com/", 
    tags: ["AI & Tech"], 
    restricted: true,
    description: "Professional web hosting platform with HTML, CSS, JavaScript hosting, FTP access, domains, tutorials, and developer support.",
    gradient: "from-slate-700 via-zinc-800 to-zinc-950",
    category: "AI & Tech",
    is_active: true,
    display_order: 25
  },
  { 
    name: "MS Digital Hub", 
    url: "https://ms-digitalhub.vercel.app", 
    tags: ["AI & Tech"], 
    restricted: false,
    description: "A modern digital services platform providing web development, app development, AI services, automation, and business solutions.",
    gradient: "from-blue-600 via-indigo-500 to-purple-600",
    category: "AI & Tech",
    is_active: true,
    display_order: 26
  },
  { 
    name: "Image Toolkit", 
    url: "https://ms-imgtourl.vercel.app", 
    tags: ["Media Tools"], 
    restricted: false,
    description: "Complete image editing platform including image-to-URL conversion, background removal, compression, extraction, resizing, editing, and optimization.",
    gradient: "from-pink-500 to-rose-600",
    category: "Media Tools",
    is_active: true,
    display_order: 27
  },
  { 
    name: "Poster Editor", 
    url: "https://editings.vercel.app", 
    tags: ["Media Tools"], 
    restricted: false,
    description: "Modern online poster editor with glassmorphism UI, drag-and-drop editing, templates, layers, and export options.",
    gradient: "from-amber-500 to-yellow-600",
    category: "Media Tools",
    is_active: true,
    display_order: 28
  },
  { 
    name: "Saqib TV", 
    url: "https://saqibtv.vercel.app", 
    tags: ["Entertainment"], 
    restricted: false,
    description: "Watch live TV channels, movies, sports, entertainment, kids, and news in one modern streaming platform.",
    gradient: "from-red-600 to-orange-500",
    category: "Entertainment",
    is_active: true,
    display_order: 29
  },
  { 
    name: "PBX Official", 
    url: "https://pbxofficial.zone.id", 
    tags: ["Gaming"], 
    restricted: false,
    description: "Gaming platform for Free Fire resources, sensitivity settings, guides, optimization tips, gaming utilities, and community content.",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    category: "Gaming",
    is_active: true,
    display_order: 30
  },
  { 
    name: "Shoes Store", 
    url: "https://shoes.zone.id", 
    tags: ["E-Commerce"], 
    restricted: false,
    description: "Modern shoe shopping platform with categories, filters, cart, checkout, order management, and admin dashboard.",
    gradient: "from-blue-600 to-indigo-600",
    category: "E-Commerce",
    is_active: true,
    display_order: 31
  },
  { 
    name: "Fashion Jewellery", 
    url: "https://fashions-2026.vercel.app/", 
    tags: ["E-Commerce"], 
    restricted: false,
    description: "Luxury jewelry shopping website with elegant design, collections, secure checkout, and admin management.",
    gradient: "from-yellow-500 via-amber-500 to-orange-600",
    category: "E-Commerce",
    is_active: true,
    display_order: 32
  },
  { 
    name: "Mobile & Gadgets", 
    url: "https://ms-mobile-gules.vercel.app", 
    tags: ["E-Commerce"], 
    restricted: false,
    description: "Modern online gadget marketplace featuring smartphones, accessories, comparisons, reviews, and complete admin panel.",
    gradient: "from-cyan-600 to-blue-600",
    category: "E-Commerce",
    is_active: true,
    display_order: 33
  },
  { 
    name: "Sandwich Store", 
    url: "https://ms-sand-eight.vercel.app", 
    tags: ["Restaurant"], 
    restricted: false,
    description: "Modern sandwich restaurant website featuring online ordering, menu management, delivery tracking, and promotions.",
    gradient: "from-amber-500 to-yellow-500",
    category: "Restaurant",
    is_active: true,
    display_order: 34
  },
  { 
    name: "Bakery Rose", 
    url: "https://ms-bakery-rose.vercel.app", 
    tags: ["Restaurant"], 
    restricted: false,
    description: "Beautiful bakery website with cakes, pastries, ordering system, delivery management, and admin panel.",
    gradient: "from-rose-400 to-pink-500",
    category: "Restaurant",
    is_active: true,
    display_order: 35
  },
  { 
    name: "Cooling Products", 
    url: "https://ms-cold.vercel.app", 
    tags: ["Business"], 
    restricted: false,
    description: "Professional cooling products website featuring ACs, refrigerators, coolers, accessories, and service booking.",
    gradient: "from-sky-400 to-blue-500",
    category: "Business",
    is_active: true,
    display_order: 36
  },
  { 
    name: "MS King Army", 
    url: "https://mska.zone.id", 
    tags: ["Community"], 
    restricted: false,
    description: "Official team website featuring owner, leaders, members, achievements, events, announcements, and recruitment system.",
    gradient: "from-yellow-500 to-red-600",
    category: "Community",
    is_active: true,
    display_order: 37
  },
  { 
    name: "DP Maker", 
    url: "https://ms-dp-xi.vercel.app", 
    tags: ["Photo Tools"], 
    restricted: false,
    description: "Create stylish profile pictures with frames, effects, team logos, custom text, AI enhancements, and downloads.",
    gradient: "from-purple-500 to-pink-500",
    category: "Photo Tools",
    is_active: true,
    display_order: 38
  },
  { 
    name: "WhatsApp Unban", 
    url: "https://unban.zone.id", 
    tags: ["Utilities"], 
    restricted: false,
    description: "Professional platform for WhatsApp ban appeal guidance, request submission, account recovery information, and support resources.",
    gradient: "from-green-500 to-teal-600",
    category: "Utilities",
    is_active: true,
    display_order: 39
  },
  { 
    name: "Cyber Security Simulator", 
    url: "https://shortpro.vercel.app/", 
    tags: ["Security", "Education"], 
    restricted: false,
    description: "Interactive cyber security education simulator demonstrating authentication security and awareness best practices.",
    gradient: "from-blue-600 to-indigo-900",
    category: "Security",
    is_active: true,
    display_order: 40
  },
  { 
    name: "Saqib AI Chatbot", 
    url: "https://saqibaichabot.vercel.app/", 
    tags: ["AI & Tech"], 
    restricted: false,
    description: "Intelligent conversational chatbot built with advanced language models to assist users with answers, coding, and creative ideas.",
    gradient: "from-violet-600 to-indigo-600",
    category: "AI & Tech",
    is_active: true,
    display_order: 41
  },
  { 
    name: "Shot Link Tracker", 
    url: "https://shot.zone.id", 
    tags: ["Utilities"], 
    restricted: false,
    description: "A smart link management platform for shortening URLs, tracking clicks, collecting analytics, and managing shared links.",
    gradient: "from-teal-400 to-cyan-500",
    category: "Utilities",
    is_active: true,
    display_order: 42
  }
];

export async function fetchProjectsFromDB(): Promise<{ projects: ProjectItem[]; fromDatabase: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase projects fetch error, fallback to default:', error.message);
      return { projects: DEFAULT_PROJECTS, fromDatabase: false, error: error.message };
    }

    if (data && data.length > 0) {
      const parsed: ProjectItem[] = data.map((item: any, idx: number) => ({
        id: item.id,
        name: item.name || 'Untitled Project',
        url: item.url || '#',
        tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? item.tags.split(',').map((t: string) => t.trim()) : [item.category || 'Portfolio']),
        restricted: Boolean(item.restricted),
        description: item.description || '',
        gradient: item.gradient || 'from-blue-600 via-indigo-500 to-purple-600',
        category: item.category || (Array.isArray(item.tags) && item.tags[0]) || 'Portfolio',
        is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
        display_order: item.display_order ?? (idx + 1),
        created_at: item.created_at
      }));
      return { projects: parsed, fromDatabase: true };
    }

    return { projects: DEFAULT_PROJECTS, fromDatabase: false };
  } catch (err: any) {
    console.error('Exception fetching projects:', err);
    return { projects: DEFAULT_PROJECTS, fromDatabase: false, error: err.message || 'Unknown network error' };
  }
}

export async function createProjectInDB(project: Omit<ProjectItem, 'id' | 'created_at'>): Promise<{ data: any; error: string | null }> {
  try {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ project })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) return { data: json.data, error: null };
      return { data: null, error: json.error || 'Failed to insert project via admin API' };
    }

    const errJson = await res.json().catch(() => ({ error: 'Request failed' }));
    return { data: null, error: errJson.error || `Server error: ${res.status}` };
  } catch (err: any) {
    // Direct client fallback if API route unreachable
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            name: project.name,
            url: project.url,
            description: project.description,
            category: project.category || (project.tags && project.tags[0]) || 'Portfolio',
            tags: project.tags,
            gradient: project.gradient || 'from-blue-600 via-indigo-500 to-purple-600',
            restricted: project.restricted || false,
            is_active: project.is_active !== undefined ? project.is_active : true,
            display_order: project.display_order || 0
          }
        ])
        .select()
        .single();

      if (error) return { data: null, error: error.message };
      return { data, error: null };
    } catch (fallbackErr: any) {
      return { data: null, error: fallbackErr.message || err.message || 'Failed to insert project' };
    }
  }
}

export async function updateProjectInDB(id: string, updates: Partial<ProjectItem>): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, updates })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) return { success: true, error: null };
      return { success: false, error: json.error || 'Failed to update project' };
    }

    const errJson = await res.json().catch(() => ({ error: 'Request failed' }));
    return { success: false, error: errJson.error || `Server error: ${res.status}` };
  } catch (err: any) {
    try {
      const { error } = await supabase.from('projects').update(updates).eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (fallbackErr: any) {
      return { success: false, error: fallbackErr.message || err.message };
    }
  }
}

export async function deleteProjectFromDB(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await fetch('/api/admin/projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) return { success: true, error: null };
      return { success: false, error: json.error || 'Failed to delete project' };
    }

    const errJson = await res.json().catch(() => ({ error: 'Request failed' }));
    return { success: false, error: errJson.error || `Server error: ${res.status}` };
  } catch (err: any) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true, error: null };
    } catch (fallbackErr: any) {
      return { success: false, error: fallbackErr.message || err.message };
    }
  }
}

export async function seedAllDefaultProjectsToDB(): Promise<{ count: number; error: string | null }> {
  try {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'seed', projects: DEFAULT_PROJECTS })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) return { count: json.count || DEFAULT_PROJECTS.length, error: null };
      return { count: 0, error: json.error || 'Failed to seed projects' };
    }

    const errJson = await res.json().catch(() => ({ error: 'Request failed' }));
    return { count: 0, error: errJson.error || `Server error: ${res.status}` };
  } catch (err: any) {
    try {
      const rows = DEFAULT_PROJECTS.map((p, idx) => ({
        name: p.name,
        url: p.url,
        description: p.description,
        category: p.category || p.tags[0] || 'Portfolio',
        tags: p.tags,
        gradient: p.gradient,
        restricted: p.restricted || false,
        is_active: true,
        display_order: idx + 1
      }));

      const { data, error } = await supabase.from('projects').insert(rows).select();
      if (error) return { count: 0, error: error.message };
      return { count: data?.length || rows.length, error: null };
    } catch (fallbackErr: any) {
      return { count: 0, error: fallbackErr.message || err.message };
    }
  }
}
