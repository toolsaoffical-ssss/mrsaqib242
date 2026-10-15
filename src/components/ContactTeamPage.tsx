import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  Code2,
  Smartphone,
  Cpu,
  Globe,
  PenTool,
  Database,
  Layout,
  Video,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Users,
  Send,
  Sparkles,
  Clock,
  DollarSign,
  AlertCircle,
  Check,
  MessageSquare,
  ShieldCheck,
  Server,
  Layers,
  Bot,
  Copy,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Zap,
  Lock,
  Star,
  Compass,
  FileText
} from 'lucide-react';
import { 
  SiWhatsapp, 
  SiInstagram, 
  SiTiktok, 
  SiFacebook, 
  SiSnapchat, 
  SiGithub 
} from 'react-icons/si';
import { useProfileSettings } from '../hooks/useProfileSettings';

interface ContactTeamPageProps {
  onBack: () => void;
}

export default function ContactTeamPage({ onBack }: ContactTeamPageProps) {
  const { profile } = useProfileSettings();

  // Inquiry Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceType, setServiceType] = useState('Full-Stack Web App');
  const [budget, setBudget] = useState('$300 - $500');
  const [timeline, setTimeline] = useState('1-2 weeks');
  const [customBudgetAmount, setCustomBudgetAmount] = useState('');
  const [customTimelineDate, setCustomTimelineDate] = useState('');
  const [customFeatures, setCustomFeatures] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [queryDetails, setQueryDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // UI Interactive States
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [livePktTime, setLivePktTime] = useState('');

  // Pakistan Timezone Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLivePktTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string, field: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const SERVICES = [
    { name: 'Full-Stack Web App', desc: 'Next.js 15, React 19 & Cloud DB', icon: <Code2 size={18} className="text-cyan-600" /> },
    { name: 'Cyber Security & RLS', desc: 'Zero-Trust, Pentesting & API Guard', icon: <ShieldCheck size={18} className="text-emerald-600" /> },
    { name: 'Mobile App (React Native/PWA)', desc: 'iOS, Android & Offline Cache', icon: <Smartphone size={18} className="text-purple-600" /> },
    { name: 'AI Solution & Gemini API', desc: 'Smart Chatbots & Automated LLMs', icon: <Bot size={18} className="text-amber-600" /> },
    { name: 'E-Commerce Marketplace', desc: 'High Converting & WhatsApp Order', icon: <Layers size={18} className="text-emerald-600" /> },
    { name: 'Custom Tool / API', desc: 'High-Throughput Node/Express APIs', icon: <Server size={18} className="text-sky-600" /> },
    { name: 'Portfolio / Landing Page', desc: 'Ultra-Fast 98+ SEO & Conversions', icon: <Globe size={18} className="text-indigo-600" /> },
    { name: 'UI/UX & Brand Design', desc: 'Modern SaaS Interfaces & Identity', icon: <PenTool size={18} className="text-pink-600" /> }
  ];

  const BUDGETS = [
    '$100 - $300',
    '$300 - $500',
    '$500 - $1000',
    '$1000+',
    'Flexible',
    'Custom'
  ];

  const TIMELINES = [
    'Urgent (1-3 days)',
    '1-2 weeks',
    '1 month',
    'Flexible',
    'Custom'
  ];

  const QUICK_PROMPTS = [
    { title: '🚀 Full-Stack Web App', msg: 'Hi Muhammad Saqib! I need a custom Full-Stack Web App built with Next.js and high performance.' },
    { title: '🛡️ Cyber Security & RLS Audit', msg: 'Hi Saqib! I want a Cyber Security and Supabase Row-Level Security (RLS) audit for my web app.' },
    { title: '📱 Mobile App / PWA', msg: 'Hi Saqib! I need a cross-platform Mobile App or Progressive Web App (PWA) with fast loading.' },
    { title: '🤖 AI Chatbot / Gemini Solution', msg: 'Hi Saqib! I want to integrate Gemini AI or OpenAI chatbots and automations into my website.' },
    { title: '⚡ 15-Min Quick Consultation', msg: 'Hi Muhammad Saqib! I want to schedule a quick 15-minute consultation to discuss an idea.' }
  ];

  const FAQS = [
    {
      q: 'How fast can we start my project?',
      a: 'We can initiate requirements discovery within 24 to 48 hours of project alignment. Urgent sprint deliveries (1-3 days) are also available upon request.'
    },
    {
      q: 'Do you work with international clients across different time zones?',
      a: 'Yes, absolutely! I regularly collaborate with international founders, agencies, and businesses across the US, UK, UAE, Europe, and Pakistan via WhatsApp, Zoom, and async updates.'
    },
    {
      q: 'What are your milestone and payment terms?',
      a: 'Standard enterprise engagements are milestone-based: typically 50% upfront deposit upon contract signing, and the remaining 50% only after full live demo verification and final sign-off.'
    },
    {
      q: 'Is cyber security and database hardening included?',
      a: 'Yes, 100%! Every web application is built with fortress-grade defense: Supabase Row-Level Security (RLS), sanitized API endpoints, token authentication, and bot mitigations included by default.'
    },
    {
      q: 'Do you provide post-launch support and warranty?',
      a: 'Yes! Every delivered project includes a 30-day complimentary post-launch warranty covering bug fixes, server monitoring, and seamless cloud deployment handoff.'
    }
  ];

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!clientEmail.trim() && !clientPhone.trim()) {
      setErrorMsg('Please enter at least an email or WhatsApp number so we can reach you');
      return;
    }
    if (!queryDetails.trim()) {
      setErrorMsg('Please briefly describe your project requirements');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName.trim(),
          email: clientEmail.trim() || 'contact@client.com',
          phone: clientPhone.trim(),
          service_type: serviceType,
          budget,
          timeline,
          subject: `Project Inquiry: ${serviceType}`,
          message: queryDetails.trim(),
          priority: 'high',
          custom_budget_amount: budget === 'Custom' ? customBudgetAmount.trim() : undefined,
          custom_features: budget === 'Custom' ? customFeatures.trim() : undefined,
          reference_links: budget === 'Custom' ? referenceLinks.trim() : undefined,
          custom_timeline_date: timeline === 'Custom' ? customTimelineDate.trim() : undefined
        })
      });
      const res = await apiRes.json();

      if (res.success && res.data) {
        setSubmittedId(res.data.id);
        setIsSubmitted(true);
      } else {
        setErrorMsg('Could not submit inquiry. Please try again or WhatsApp directly.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDispatch = () => {
    const text = `*New Project Inquiry via mrsaqib242.vercel.app*
━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${clientName || 'Not provided'}
📞 *Phone/WhatsApp:* ${clientPhone || 'Not provided'}
📧 *Email:* ${clientEmail || 'Not provided'}
🎯 *Service Needed:* ${serviceType}
💰 *Budget:* ${budget === 'Custom' && customBudgetAmount ? `${budget} (${customBudgetAmount})` : budget}
⏳ *Timeline:* ${timeline === 'Custom' && customTimelineDate ? `${timeline} (${customTimelineDate})` : timeline}
${customFeatures ? `✨ *Custom Features:* ${customFeatures}\n` : ''}${referenceLinks ? `🔗 *References:* ${referenceLinks}\n` : ''}
📝 *Project Requirements:*
${queryDetails || 'Looking to discuss project requirements directly.'}
━━━━━━━━━━━━━━━━━━`;

    window.open(getWhatsAppLink(text), '_blank');
  };

  const handleResetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setQueryDetails('');
    setCustomBudgetAmount('');
    setCustomFeatures('');
    setReferenceLinks('');
    setCustomTimelineDate('');
    setIsSubmitted(false);
    setSubmittedId('');
  };

  const phoneDisplay = profile.phone || '+92 347 8936242';
  const emailDisplay = profile.email || 'saqibsaqqibsaqib@gmail.com';
  const rawPhone = phoneDisplay.replace(/[\s\-\+]/g, '');
  const avatarDisplay = profile.avatar_url || 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90';
  const locationDisplay = profile.location || 'Gojra, Faisalabad, Pakistan';
  const taglineDisplay = profile.tagline || 'Full-Stack Engineer & Cyber Security Specialist';
  const whatsappBaseUrl = profile.whatsapp_url || `https://wa.me/${rawPhone || '923478936242'}`;
  const getWhatsAppLink = (customText?: string) => {
    const cleanBase = (whatsappBaseUrl || '').split('?')[0] || `https://wa.me/${rawPhone || '923478936242'}`;
    if (!customText) return cleanBase;
    return `${cleanBase}?text=${encodeURIComponent(customText)}`;
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-zinc-800 selection:bg-pink-300 selection:text-white font-sans relative overflow-x-hidden">
      
      {/* Soft Background Decorative Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[55%] h-[55%] bg-white/70 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-100/50 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-[-5%] w-[35%] h-[35%] bg-emerald-100/30 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Floating Glass Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-[#F0F2F5]/85 backdrop-blur-xl border-b border-white/60 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault();
                onBack();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-[3px_3px_6px_#d9dadc,-3px_-3px_6px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] border border-white text-zinc-700 hover:text-black transition-all text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-800 hidden sm:inline">
              Contact &amp; VIP Founder Desk
            </span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-600">
              <Link href="/projects" className="hover:text-black transition-colors">Projects</Link>
              <Link href="/skills" className="hover:text-black transition-colors">Skills</Link>
              <Link href="/plans" className="hover:text-black transition-colors">Plans</Link>
              <Link href="/tools" className="hover:text-black transition-colors">Tools</Link>
            </nav>
            <a
              href={getWhatsAppLink('Hi Muhammad Saqib! I would like to chat about a new project.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md shadow-emerald-500/25 transition-all hover:scale-105"
            >
              <SiWhatsapp size={14} />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* ========================================================== */}
        {/* HERO TITLE & LIVE OPERATIONAL STATUS */}
        {/* ========================================================== */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] text-emerald-700 text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-6 border border-white"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>DIRECT FOUNDER VIP ACCESS • 24/7 PRIORITY INBOX</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-zinc-800 tracking-tight mb-4 leading-none"
          >
            Contact Mr Saqib
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-zinc-500 font-bold tracking-widest uppercase text-xs sm:text-sm max-w-2xl mx-auto"
          >
            Hire Muhammad Saqib (Saqib 242) | Official Phone, WhatsApp &amp; Consultations
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-4 text-base sm:text-xl font-serif italic text-zinc-600 max-w-xl mx-auto"
          >
            &ldquo;Turning Ideas into Powerful Digital Experiences.&rdquo;
          </motion.div>

          {/* Real-time Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-5 py-2.5 rounded-2xl bg-white shadow-[4px_4px_10px_#d9dadc,-4px_-4px_10px_#ffffff] border border-white text-xs text-zinc-600"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 font-bold uppercase tracking-wider">Active Now</span>
            </div>
            <div className="hidden sm:block h-3.5 w-px bg-zinc-200" />
            <div className="flex items-center gap-1.5 font-mono text-zinc-700">
              <Clock size={13} className="text-cyan-600" />
              <span>{livePktTime || 'PKT (UTC+5)'}</span>
              <span className="text-[10px] text-zinc-400 uppercase">Faisalabad, PK</span>
            </div>
            <div className="hidden sm:block h-3.5 w-px bg-zinc-200" />
            <div className="flex items-center gap-1.5 font-mono text-amber-700">
              <Zap size={13} className="text-amber-500" />
              <span>WhatsApp Reply: &lt; 15 Mins</span>
            </div>
          </motion.div>
        </div>

        {/* ========================================================== */}
        {/* VIP FOUNDER PROFILE & 4 DIRECT ACTION HUBS */}
        {/* ========================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-[#F0F2F5] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] sm:shadow-[12px_12px_24px_#d9dadc,-12px_-12px_24px_#ffffff] border border-white/60 relative overflow-hidden mb-16"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Top Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-200/60 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              
              {/* Avatar with White Inset Border */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white shadow-[inset_4px_4px_8px_#d9dadc,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center shrink-0 border-2 border-white relative">
                <img 
                  src={avatarDisplay} 
                  alt={profile.name || "Muhammad Saqib"} 
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-200,h-200,fo-auto,q-90';
                  }}
                />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 mb-1 text-xs font-bold uppercase tracking-widest text-emerald-700">
                  <Briefcase size={13} className="text-emerald-600" />
                  <span>{taglineDisplay}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-800 tracking-tight flex items-center gap-2">
                  <span>{profile.name || 'Muhammad Saqib'}</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
                    Verified ID
                  </span>
                </h2>
                <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-1 max-w-xl">
                  Based in {locationDisplay} • Available for Remote Worldwide Contracts &amp; Security Audits.
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="w-full md:w-auto p-4 rounded-2xl bg-white/70 border border-white shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] text-left md:text-right shrink-0">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CONTRACT STATUS</div>
              <div className="text-sm font-black text-emerald-600 flex items-center md:justify-end gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for New Projects</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">Remote Worldwide • NDA Protected</div>
            </div>
          </div>

          {/* Bio statement */}
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium my-6 relative z-10">
            {profile.bio || "Passionate Cyber Security Specialist, Full-Stack Engineer, and Cross-Platform App Developer building zero-trust web architectures, hardened cloud databases, and lightning-fast Next.js applications. Direct consultations, security audits, and enterprise project inquiries welcome."}
          </p>

          {/* 4 Direct VIP Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6 relative z-10">
            
            {/* WhatsApp */}
            <motion.a 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href={getWhatsAppLink('Hi Muhammad Saqib! I came from your portfolio website and want to discuss a project with you.')}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#25D366] text-white shadow-lg shadow-emerald-500/25 flex flex-col justify-between group cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <SiWhatsapp size={22} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider bg-black/15 px-2 py-0.5 rounded-full">
                  Instant
                </span>
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-wide">WhatsApp Chat</div>
                <div className="text-[11px] text-white/90 font-medium mt-0.5">Direct priority messaging</div>
                <div className="text-[10px] font-mono font-bold text-white/80 mt-2 flex items-center gap-1">
                  <span>{phoneDisplay}</span>
                  <ExternalLink size={10} />
                </div>
              </div>
            </motion.a>

            {/* Direct Call */}
            <motion.a 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href={`tel:${rawPhone}`}
              className="p-5 rounded-2xl bg-white shadow-[4px_4px_10px_#d9dadc,-4px_-4px_10px_#ffffff] border border-white flex flex-col justify-between group cursor-pointer hover:border-emerald-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Voice
                </span>
              </div>
              <div>
                <div className="text-sm font-black text-zinc-800 uppercase tracking-wide">Direct Call</div>
                <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Phone &amp; Cell consultation</div>
                <div className="text-[10px] font-mono font-bold text-zinc-800 mt-2 truncate">
                  {phoneDisplay}
                </div>
              </div>
            </motion.a>

            {/* Email with 1-click Copy */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              onClick={() => copyToClipboard(emailDisplay, 'email')}
              className="p-5 rounded-2xl bg-white shadow-[4px_4px_10px_#d9dadc,-4px_-4px_10px_#ffffff] border border-white flex flex-col justify-between group cursor-pointer hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {copiedField === 'email' ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                  {copiedField === 'email' ? 'Copied!' : 'Copy Email'}
                </span>
              </div>
              <div>
                <div className="text-sm font-black text-zinc-800 uppercase tracking-wide">Official Email</div>
                <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Formal RFP &amp; Contracts</div>
                <div className="text-[10px] font-mono font-bold text-blue-600 mt-2 truncate">
                  {emailDisplay}
                </div>
              </div>
            </motion.div>

            {/* CV Download */}
            <motion.a 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href={profile.resume_url || '/resume.pdf'}
              download="Muhammad_Saqib_CV.pdf"
              className="p-5 rounded-2xl bg-white shadow-[4px_4px_10px_#d9dadc,-4px_-4px_10px_#ffffff] border border-white flex flex-col justify-between group cursor-pointer hover:border-purple-300 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  PDF 2026/27
                </span>
              </div>
              <div>
                <div className="text-sm font-black text-zinc-800 uppercase tracking-wide">Download CV</div>
                <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Verified credentials &amp; certs</div>
                <div className="text-[10px] font-mono font-bold text-purple-600 mt-2 flex items-center gap-1">
                  <span>Instant Download</span>
                  <span>↓</span>
                </div>
              </div>
            </motion.a>
          </div>

          {/* Trust & Guarantee Badges */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600 mb-6 relative z-10">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-emerald-500">⚡</span> &lt; 15 Mins WhatsApp Response
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-blue-500">🔒</span> 100% NDA &amp; Privacy Protected
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-purple-500">🛡️</span> Zero-Trust Hardened Code
            </div>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-amber-500">⭐</span> 30-Day Post-Launch Support
            </div>
          </div>

          {/* Link to Skills Hub */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 to-black text-white shadow-lg relative z-10">
            <div className="text-center sm:text-left">
              <div className="text-xs font-black uppercase tracking-wider text-emerald-400">Looking for Technical Stacks &amp; Frameworks?</div>
              <div className="text-[11px] text-zinc-400 font-medium">Inspect our full production tech stack, architecture pipeline &amp; AI sandbox.</div>
            </div>
            <Link 
              href="/skills"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Skills Matrix</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>

        {/* ========================================================== */}
        {/* 1-TAP WHATSAPP QUICK STARTER PROMPTS */}
        {/* ========================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-800">
                Quick-Start Inquiries (1-Tap WhatsApp Connect)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Instant Pre-filled Message</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <a
                key={idx}
                href={getWhatsAppLink(prompt.msg)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-white shadow-[4px_4px_8px_#d9dadc,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] border border-white flex items-center justify-between group transition-all cursor-pointer"
              >
                <div className="pr-2">
                  <div className="text-xs font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors">
                    {prompt.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate max-w-[240px] mt-0.5">
                    {prompt.msg}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <SiWhatsapp size={15} />
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* ========================================================== */}
        {/* INTERACTIVE 3-STEP PROJECT ESTIMATOR & INQUIRY FORM */}
        {/* ========================================================== */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-[#F0F2F5] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] sm:shadow-[12px_12px_24px_#d9dadc,-12px_-12px_24px_#ffffff] border border-white/60 relative overflow-hidden"
          >
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-3 border border-white">
                <Sparkles size={14} className="text-emerald-500 animate-pulse" />
                <span>Quick &amp; Easy Project Details</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-800 tracking-tight">
                Send Project Query &amp; Details
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-2 leading-relaxed">
                Fill this simple 3-step form. We review every requirement immediately and reply via WhatsApp or Email within a few hours!
              </p>

              {/* Instant WhatsApp Shortcut Banner */}
              <div className="mt-5 p-3.5 rounded-2xl bg-white/70 border border-white shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                    <SiWhatsapp size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-zinc-800">Prefer Instant WhatsApp Chat?</div>
                    <div className="text-[11px] text-zinc-500 font-medium">Skip typing and discuss directly with Saqib right now</div>
                  </div>
                </div>
                <a
                  href={getWhatsAppLink('Hi Muhammad Saqib! I came from your portfolio website and want to discuss a new project with you.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 shrink-0"
                >
                  <SiWhatsapp size={14} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* SUCCESS STATE */}
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 rounded-3xl p-8 sm:p-12 text-center border border-white shadow-[inset_4px_4px_8px_#d9dadc,inset_-4px_-4px_8px_#ffffff] relative z-10 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                  <Check size={42} className="stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Query Received
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-zinc-800">
                    Thank You, {clientName}! 🚀
                  </h3>
                  <p className="text-zinc-600 text-sm max-w-lg mx-auto leading-relaxed">
                    Your project inquiry has been delivered directly to Muhammad Saqib&apos;s priority desk. Reference ID: <code className="text-xs bg-zinc-100 px-2.5 py-1 rounded-lg font-mono font-bold text-zinc-900 border border-zinc-200">{submittedId}</code>
                  </p>
                </div>

                {/* Submitted Recap Card */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#F0F2F5] shadow-[inset_3px_3px_6px_#d9dadc,inset_-3px_-3px_6px_#ffffff] border border-white text-left text-xs space-y-1.5">
                  <div className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">SUBMITTED DETAILS:</div>
                  <div className="flex justify-between text-zinc-700"><span>Service:</span> <strong className="text-zinc-900">{serviceType}</strong></div>
                  <div className="flex justify-between text-zinc-700"><span>Budget:</span> <strong className="text-emerald-600">{budget}</strong></div>
                  <div className="flex justify-between text-zinc-700"><span>Timeline:</span> <strong className="text-zinc-900">{timeline}</strong></div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={getWhatsAppLink(`Hi Saqib! I submitted my project query on your website (${submittedId}) for ${serviceType} (Budget: ${budget}). My Name: ${clientName} (${clientPhone || clientEmail}). Let's discuss!`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <SiWhatsapp size={18} />
                    <span>Ping Saqib on WhatsApp Now</span>
                  </a>

                  <button
                    onClick={handleResetForm}
                    className="px-6 py-3.5 bg-[#F0F2F5] hover:bg-white text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-2xl shadow-[4px_4px_8px_#d9dadc,-4px_-4px_8px_#ffffff] border border-white transition-all cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                </div>
              </motion.div>
            ) : (
              /* THE 3-STEP FORM */
              <form onSubmit={handleSubmitInquiry} className="space-y-8 relative z-10">
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-red-100/90 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* STEP 1: CONTACT INFO */}
                <div className="bg-white/40 p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[inset_2px_2px_5px_#d9dadc,inset_-2px_-2px_5px_#ffffff]">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-white text-xs font-black flex items-center justify-center">1</span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">Your Contact Info</h3>
                    <span className="text-[11px] text-zinc-500 font-normal ml-auto">(How we reach you)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        placeholder="e.g. Asad Malik"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] shadow-[inset_3px_3px_6px_#d9dadc,inset_-3px_-3px_6px_#ffffff] border border-white/60 text-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5 flex items-center justify-between">
                        <span>WhatsApp / Phone</span>
                        <span className="text-[10px] text-emerald-600 font-bold">Fastest Reply</span>
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] shadow-[inset_3px_3px_6px_#d9dadc,inset_-3px_-3px_6px_#ffffff] border border-white/60 text-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={e => setClientEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] shadow-[inset_3px_3px_6px_#d9dadc,inset_-3px_-3px_6px_#ffffff] border border-white/60 text-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* STEP 2: SELECT WHAT YOU NEED */}
                <div className="bg-white/40 p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[inset_2px_2px_5px_#d9dadc,inset_-2px_-2px_5px_#ffffff] space-y-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-white text-xs font-black flex items-center justify-center">2</span>
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">Select What You Need</h3>
                    <span className="text-[11px] text-zinc-500 font-normal ml-auto">(Click to choose)</span>
                  </div>

                  {/* Services Grid */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-2.5">
                      Service Type: <strong className="text-emerald-600">{serviceType}</strong>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {SERVICES.map((svc) => {
                        const isSelected = svc.name === serviceType;
                        return (
                          <button
                            key={svc.name}
                            type="button"
                            onClick={() => setServiceType(svc.name)}
                            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                              isSelected
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md scale-102'
                                : 'bg-[#F0F2F5] text-zinc-700 hover:text-black hover:bg-white/70 border-white shadow-[3px_3px_6px_#d9dadc,-3px_-3px_6px_#ffffff]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              {svc.icon}
                              <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                                {isSelected ? '✓ Selected' : 'Choose'}
                              </span>
                            </div>
                            <span className="text-xs font-bold leading-tight">{svc.name}</span>
                            <span className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                              {svc.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget & Timeline Selectors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-zinc-200/50">
                    
                    {/* Budget */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <DollarSign size={14} className="text-emerald-500" />
                          <span>Estimated Budget:</span>
                        </span>
                        <strong className="text-emerald-600 font-black">{budget}</strong>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map(b => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBudget(b)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              budget === b
                                ? 'bg-emerald-600 text-white shadow-md scale-105'
                                : 'bg-[#F0F2F5] shadow-[3px_3px_6px_#d9dadc,-3px_-3px_6px_#ffffff] text-zinc-600 hover:text-black border border-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-amber-500" />
                          <span>Desired Timeline:</span>
                        </span>
                        <strong className="text-amber-600 font-black">{timeline}</strong>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTimeline(t)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              timeline === t
                                ? 'bg-amber-500 text-black font-black shadow-md scale-105'
                                : 'bg-[#F0F2F5] shadow-[3px_3px_6px_#d9dadc,-3px_-3px_6px_#ffffff] text-zinc-600 hover:text-black border border-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM BUDGET EXTENDED PORTAL */}
                  <AnimatePresence>
                    {budget === 'Custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-2"
                      >
                        <div className="bg-emerald-50 border border-emerald-500/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-[inset_0_2px_10px_rgba(16,185,129,0.05)]">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h4 className="text-sm font-black uppercase text-emerald-800 tracking-widest">Custom Rate &amp; Scope Portal</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                Your Desired Rate / Budget
                              </label>
                              <input
                                type="text"
                                value={customBudgetAmount}
                                onChange={e => setCustomBudgetAmount(e.target.value)}
                                placeholder="e.g. $2000, 50K PKR, Flexible"
                                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 font-bold focus:outline-none focus:border-emerald-500 shadow-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                                Reference Websites / Links (Optional)
                              </label>
                              <input
                                type="text"
                                value={referenceLinks}
                                onChange={e => setReferenceLinks(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 focus:outline-none focus:border-emerald-500 shadow-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                              Special Features Needed
                            </label>
                            <textarea
                              value={customFeatures}
                              onChange={e => setCustomFeatures(e.target.value)}
                              rows={2}
                              placeholder="Any specific complex features, API integrations, etc."
                              className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs text-emerald-900 focus:outline-none focus:border-emerald-500 resize-none shadow-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CUSTOM TIMELINE EXTENDED PORTAL */}
                  <AnimatePresence>
                    {timeline === 'Custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-2"
                      >
                        <div className="bg-amber-50 border border-amber-500/20 rounded-2xl p-4 sm:p-6 shadow-[inset_0_2px_10px_rgba(245,158,11,0.05)]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <h4 className="text-sm font-black uppercase text-amber-800 tracking-widest">Select Target Date</h4>
                          </div>
                          
                          <div>
                            <input
                              type="date"
                              value={customTimelineDate}
                              onChange={e => setCustomTimelineDate(e.target.value)}
                              className="w-full bg-white border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-900 font-bold focus:outline-none focus:border-amber-500 shadow-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* STEP 3: REQUIREMENTS & LIVE SUMMARY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left 2 Cols: Textarea */}
                  <div className="lg:col-span-2 bg-white/40 p-5 sm:p-6 rounded-3xl border border-white/80 shadow-[inset_2px_2px_5px_#d9dadc,inset_-2px_-2px_5px_#ffffff] space-y-3">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 text-white text-xs font-black flex items-center justify-center">3</span>
                      <h3 className="text-sm font-black uppercase tracking-wider text-zinc-800">Project Requirements</h3>
                      <span className="text-[11px] text-zinc-500 font-normal ml-auto">(Key features &amp; ideas)</span>
                    </div>

                    <textarea
                      required
                      rows={4}
                      value={queryDetails}
                      onChange={e => setQueryDetails(e.target.value)}
                      placeholder="Describe what you want to build (e.g., An e-commerce store with WhatsApp checkout, a custom AI chatbot, portfolio with admin panel, reference links, etc.)..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#F0F2F5] shadow-[inset_3px_3px_6px_#d9dadc,inset_-3px_-3px_6px_#ffffff] border border-white/60 text-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all font-medium leading-relaxed"
                    />

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
                      <span className="font-bold text-zinc-600">Quick suggestions:</span>
                      <button
                        type="button"
                        onClick={() => setQueryDetails(prev => prev ? `${prev}, needs responsive mobile design` : 'Need a modern responsive web app with high performance and mobile optimization.')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-black shadow-sm cursor-pointer"
                      >
                        + Mobile Responsive
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueryDetails(prev => prev ? `${prev}, include WhatsApp integration` : 'Need 1-click WhatsApp order notification and direct customer chat.')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-black shadow-sm cursor-pointer"
                      >
                        + WhatsApp Order Flow
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueryDetails(prev => prev ? `${prev}, custom admin dashboard` : 'Need an intuitive admin control panel to manage content and leads.')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-black shadow-sm cursor-pointer"
                      >
                        + Admin Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueryDetails(prev => prev ? `${prev}, zero-trust database security` : 'Require zero-trust Supabase RLS database policies and API bot traps.')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:text-black shadow-sm cursor-pointer"
                      >
                        + Zero-Trust Security
                      </button>
                    </div>
                  </div>

                  {/* Right 1 Col: Live Instant Summary Card */}
                  <div className="bg-gradient-to-br from-zinc-900 to-black text-white p-5 rounded-3xl shadow-xl flex flex-col justify-between border border-zinc-800">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Query Summary</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase">Client:</div>
                          <div className="font-bold text-white truncate">{clientName || 'Your Name'}</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-zinc-400 uppercase">Selected Service:</div>
                          <div className="font-bold text-emerald-400">{serviceType}</div>
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
                          <div>
                            <div className="text-[10px] text-zinc-400 uppercase">Budget:</div>
                            <div className="font-bold text-white">{budget}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-zinc-400 uppercase">Timeline:</div>
                            <div className="font-bold text-amber-400">{timeline}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                        <span>100% Free Initial Consultation</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                        <Clock size={12} className="text-amber-400 shrink-0" />
                        <span>Typical turnaround: &lt; 2 hours</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* DUAL ACTION DISPATCH BAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-200">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Your query is saved directly to Muhammad Saqib&apos;s active portal.</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* WhatsApp Fast Dispatch */}
                    <button
                      type="button"
                      onClick={handleWhatsAppDispatch}
                      className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider border border-emerald-300 shadow-[4px_4px_8px_#d9dadc,-4px_-4px_8px_#ffffff] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <SiWhatsapp size={16} className="text-[#25D366]" />
                      <span>Dispatch via WhatsApp</span>
                    </button>

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none px-10 py-4 rounded-2xl bg-zinc-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Query...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} className="text-emerald-400" />
                          <span>Submit Project Query 🚀</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

              </form>
            )}

          </motion.div>
        </div>

        {/* ========================================================== */}
        {/* WHAT WE BUILD / DELIVER SECTION */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 md:mb-24">
          
          {/* What We Build */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 bg-[#F0F2F5] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] border border-white/50"
          >
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-zinc-800 tracking-tight">What We Build 🚀</h3>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase">
                Production Ready
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 sm:gap-y-4 gap-x-6">
              {[
                "Business & Corporate Websites",
                "Portfolio & Personal Brands",
                "Admin Control Dashboards",
                "AI-Powered Chatbots & Gemini Apps",
                "Custom Full-Stack Web Applications",
                "Cross-Platform Mobile Apps (React Native)",
                "High-Converting Landing Pages",
                "E-Commerce & WhatsApp Order Checkout",
                "Zero-Trust Supabase RLS Security",
                "RESTful API & Microservice Integration",
                "UI/UX Design Systems & Micro-Interactions",
                "Search Engine Optimization (98+ Score)"
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2.5 sm:gap-3 text-sm text-zinc-700 font-medium"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F0F2F5] shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center shrink-0 text-emerald-600">
                    <CheckCircle2 size={13} className="sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Details Quick Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#F0F2F5] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] border border-white/50 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-200/40 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-black text-zinc-800 tracking-tight mb-6 flex items-center gap-2">
                Connect With Us <span className="text-2xl">🌍</span>
              </h3>
              
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-3.5 bg-white/50 p-3.5 rounded-2xl shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] border border-white">
                  <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-0.5">Location</h4>
                    <p className="text-zinc-800 font-extrabold text-sm">{locationDisplay}</p>
                  </div>
                </div>

                {/* Call */}
                <a 
                  href={`tel:${rawPhone}`}
                  className="flex items-center gap-3.5 bg-white/50 p-3.5 rounded-2xl shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] border border-white hover:bg-white transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-0.5">Contact</h4>
                    <p className="text-zinc-800 font-extrabold text-sm">{phoneDisplay}</p>
                  </div>
                </a>

                {/* Email */}
                <a 
                  href={`mailto:${emailDisplay}`}
                  className="flex items-center gap-3.5 bg-white/50 p-3.5 rounded-2xl shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] border border-white hover:bg-white transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-0.5">Email</h4>
                    <p className="text-zinc-800 font-extrabold text-xs sm:text-sm truncate">{emailDisplay}</p>
                  </div>
                </a>

                {/* Resume Download */}
                <a 
                  href={profile.resume_url || '/resume.pdf'}
                  download="Muhammad_Saqib_Resume.pdf"
                  className="flex items-center gap-3.5 bg-white/50 p-3.5 rounded-2xl shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] border border-white hover:bg-white transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-110 transition-transform">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-0.5">Resume / CV</h4>
                    <p className="text-zinc-800 font-extrabold text-sm">Download Verified PDF</p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ========================================================== */}
        {/* INTERACTIVE CLIENT FAQ ACCORDION */}
        {/* ========================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-600 mb-2 border border-white">
              <HelpCircle size={12} className="text-emerald-600" />
              <span>Client FAQ &amp; Assurance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-800">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-[#F0F2F5] shadow-[4px_4px_8px_#d9dadc,-4px_-4px_8px_#ffffff] border border-white overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-bold text-zinc-800 tracking-wide">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-zinc-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} 
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-600 leading-relaxed font-medium border-t border-zinc-200/60 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ========================================================== */}
        {/* MISSION & SOCIAL MEDIA CHANNELS */}
        {/* ========================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-4">Our Mission 🎯</h3>
              <p className="text-zinc-300 leading-relaxed font-medium mb-6 sm:mb-8 text-sm sm:text-base">
                We combine <strong className="text-white">technology, creativity, and innovation</strong> to build high-quality digital products that are fast, modern, secure, and visually outstanding. Every project is developed with attention to detail, performance, and user experience.
              </p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              <p className="text-xs sm:text-sm font-semibold text-white/90 leading-relaxed">
                ✨ Need a Website, Mobile App, AI Solution, or Custom Software?
              </p>
              <p className="mt-1 text-sm sm:text-base text-white font-bold tracking-tight">
                📩 Let&apos;s work together and turn your vision into reality.
              </p>
            </motion.div>
          </motion.div>

          {/* Socials Neumorphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#F0F2F5] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] border border-white/50 flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl font-black text-zinc-800 tracking-tight mb-6 sm:mb-8 text-center">
              Connect With Us 📱
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { name: 'WhatsApp', icon: SiWhatsapp, link: getWhatsAppLink(), color: "text-[#25D366]" },
                { name: 'Instagram', icon: SiInstagram, link: profile.instagram_url || "https://www.instagram.com/mr_saqib242", color: "text-[#E1306C]" },
                { name: 'TikTok', icon: SiTiktok, link: profile.tiktok_url || "https://www.tiktok.com/@mr_saqib_242", color: "text-zinc-900" },
                { name: 'Facebook', icon: SiFacebook, link: profile.facebook_url || "https://www.facebook.com/profile.php?id=100085188689033", color: "text-[#1877F2]" },
                { name: 'Snapchat', icon: SiSnapchat, link: profile.snapchat_url || "https://www.snapchat.com/add/mrsaqib242", color: "text-[#FFFC00] drop-shadow-md" },
                { name: 'GitHub', icon: SiGithub, link: profile.github_url || "https://github.com/mrsaqib242", color: "text-zinc-800" }
              ].filter(item => Boolean(item.link && item.link.trim())).map((social, i) => {
                const Icon = social.icon;
                return (
                  <motion.a 
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 10 }}
                    whileHover={{ scale: 1.15, rotate: 4 }}
                    whileTap={{ scale: 0.9 }}
                    title={social.name}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F0F2F5] shadow-[4px_4px_8px_#d9dadc,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#d9dadc,-6px_-6px_12px_#ffffff] flex items-center justify-center border border-white hover:shadow-[inset_4px_4px_8px_#d9dadc,inset_-4px_-4px_8px_#ffffff] transition-shadow ${social.color}`}
                  >
                    <Icon size={24} />
                  </motion.a>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200/60 text-center text-xs font-mono text-zinc-500">
              Direct Inquiries Available 7 Days a Week
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
