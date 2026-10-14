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
    { name: 'Full-Stack Web App', desc: 'Next.js 15, React 19 & Cloud DB', icon: <Code2 size={18} />, color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'Cyber Security & RLS', desc: 'Zero-Trust, Pentesting & API Guard', icon: <ShieldCheck size={18} />, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },
    { name: 'Mobile App (React Native/PWA)', desc: 'iOS, Android & Offline Cache', icon: <Smartphone size={18} />, color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30' },
    { name: 'AI Solution & Gemini API', desc: 'Smart Chatbots & Automated LLMs', icon: <Bot size={18} />, color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30' },
    { name: 'E-Commerce Marketplace', desc: 'High Converting & WhatsApp Order', icon: <Layers size={18} />, color: 'from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30' },
    { name: 'Custom Tool / API', desc: 'High-Throughput Node/Express APIs', icon: <Server size={18} />, color: 'from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30' },
    { name: 'Portfolio / Landing Page', desc: 'Ultra-Fast 98+ SEO & Conversions', icon: <Globe size={18} />, color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30' },
    { name: 'UI/UX & Brand Design', desc: 'Modern Cyberpunk & SaaS Interfaces', icon: <PenTool size={18} />, color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30' }
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

    window.open(`https://wa.me/92343673242?text=${encodeURIComponent(text)}`, '_blank');
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

  const phoneDisplay = profile.phone || '+92 343 673242';
  const emailDisplay = profile.email || 'mrsaqib242242@gmail.com';
  const rawPhone = phoneDisplay.replace(/[\s\-\+]/g, '');

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans relative selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      
      {/* Dynamic Ambient Glow Highlights */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Floating Glass Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault();
                onBack();
              }
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold tracking-widest uppercase text-white/80 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Portfolio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-300 hidden sm:inline">
              Founder VIP Desk
            </span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link href="/skills" className="hover:text-white transition-colors">Skills</Link>
              <Link href="/plans" className="hover:text-white transition-colors">Plans</Link>
              <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            </nav>
            <a
              href={`https://wa.me/92343673242?text=${encodeURIComponent('Hi Muhammad Saqib! I would like to chat about a new project.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black text-xs font-black uppercase tracking-wider rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <SiWhatsapp size={13} />
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
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-6 shadow-inner"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DIRECT FOUNDER VIP GATEWAY • 24/7 PRIORITY INBOX</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-none mb-6"
          >
            Let's Build Something{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Legendary
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Connect directly with <strong className="text-white">Muhammad Saqib (Saqib 242)</strong> — Cyber Security Specialist, Backend Architect, Frontend Developer &amp; App Engineer based in Pakistan.
          </motion.p>

          {/* Real-time Pakistan Status Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-5 py-2.5 rounded-2xl bg-zinc-900/60 border border-white/10 text-xs text-zinc-400 backdrop-blur-md shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold font-mono uppercase tracking-wider">Active Now</span>
            </div>
            <div className="hidden sm:block h-3.5 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 font-mono text-zinc-300">
              <Clock size={13} className="text-cyan-400" />
              <span>{livePktTime || 'PKT (UTC+5)'}</span>
              <span className="text-[10px] text-zinc-500 uppercase">Faisalabad, PK</span>
            </div>
            <div className="hidden sm:block h-3.5 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 font-mono text-amber-300">
              <Zap size={13} className="text-amber-400" />
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
          className="max-w-5xl mx-auto bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-16"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Top Profile Strip */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              
              {/* Avatar with Glow Ring */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.25)] shrink-0">
                  <img 
                    src="https://ik.imagekit.io/19imy4f1u/lite_1791955994422_-jhmpCKzP.webp?tr=w-240,h-240,fo-face,q-90" 
                    alt="Muhammad Saqib" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center text-[10px] text-black font-black">
                  ✓
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Lead Architect &amp; Founder
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">ID: Saqib242</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>{profile.name || 'Muhammad Saqib'}</span>
                  <span className="text-xs text-cyan-400 font-mono font-bold border border-cyan-500/30 px-2 py-0.5 rounded-md bg-cyan-950/30">
                    Verified
                  </span>
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl font-medium">
                  Operating at the intersection of Zero-Trust Cyber Security, high-scale Backend microservices, and fluid Next.js 15 / React Native apps.
                </p>
              </div>
            </div>

            {/* Quick Consultation Badge */}
            <div className="w-full md:w-auto bg-zinc-950/70 border border-white/5 rounded-2xl p-4 shrink-0 text-left md:text-right space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">CONTRACT AVAILABILITY</div>
              <div className="text-sm font-black text-emerald-400 flex items-center md:justify-end gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open for Q4 &amp; 2027 Contracts</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-medium">Remote Worldwide • NDA Protected</div>
            </div>
          </div>

          {/* 4 Direct VIP Action Hubs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-b border-white/10 relative z-10">
            
            {/* WhatsApp */}
            <motion.a 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href={`https://wa.me/92343673242?text=${encodeURIComponent('Hi Muhammad Saqib! I came from your portfolio website and want to discuss a project with you.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-xl shadow-emerald-500/20 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <SiWhatsapp size={22} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                  Instant Reply
                </span>
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-wide">WhatsApp Chat</div>
                <div className="text-[11px] text-white/90 font-medium mt-0.5">Direct 1-on-1 Founder Chat</div>
                <div className="text-[10px] font-mono font-bold text-white/80 mt-2 flex items-center gap-1">
                  <span>+92 343 673242</span>
                  <ExternalLink size={10} />
                </div>
              </div>
            </motion.a>

            {/* Direct Call */}
            <motion.a 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href={`tel:${rawPhone}`}
              className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 shadow-lg flex flex-col justify-between group cursor-pointer transition-all relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Phone size={20} />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Direct Line
                </span>
              </div>
              <div>
                <div className="text-sm font-black text-white uppercase tracking-wide">Direct Voice Call</div>
                <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Phone &amp; Cell Consultation</div>
                <div className="text-[10px] font-mono font-bold text-cyan-400 mt-2 truncate">
                  {phoneDisplay}
                </div>
              </div>
            </motion.a>

            {/* Email with 1-click Copy */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              onClick={() => copyToClipboard(emailDisplay, 'email')}
              className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-blue-500/40 shadow-lg flex flex-col justify-between group cursor-pointer transition-all relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-blue-300 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {copiedField === 'email' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                  {copiedField === 'email' ? 'Copied!' : 'Click to Copy'}
                </span>
              </div>
              <div>
                <div className="text-sm font-black text-white uppercase tracking-wide">Official Email</div>
                <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Formal RFP &amp; Contracts</div>
                <div className="text-[10px] font-mono font-bold text-blue-400 mt-2 truncate">
                  {emailDisplay}
                </div>
              </div>
            </motion.div>

            {/* CV / Credentials Download */}
            <motion.a 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              href={profile.resume_url || '/resume.pdf'}
              download="Muhammad_Saqib_CV.pdf"
              className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-purple-500/40 shadow-lg flex flex-col justify-between group cursor-pointer transition-all relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <FileText size={20} />
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  PDF 2026/27
                </span>
              </div>
              <div>
                <div className="text-sm font-black text-white uppercase tracking-wide">Download CV</div>
                <div className="text-[11px] text-zinc-400 font-medium mt-0.5">Verified Credentials &amp; Certs</div>
                <div className="text-[10px] font-mono font-bold text-purple-400 mt-2 flex items-center gap-1">
                  <span>Instant PDF Download</span>
                  <span>↓</span>
                </div>
              </div>
            </motion.a>
          </div>

          {/* Trust, Security & SLA Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 relative z-10 text-xs text-zinc-300">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
              <span className="text-emerald-400"><Zap size={14} /></span>
              <span className="font-bold">&lt; 15 Mins WhatsApp Reply</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
              <span className="text-blue-400"><Lock size={14} /></span>
              <span className="font-bold">100% NDA &amp; IP Protection</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
              <span className="text-purple-400"><ShieldCheck size={14} /></span>
              <span className="font-bold">Zero-Trust Hardened Code</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/60 border border-white/5">
              <span className="text-amber-400"><Star size={14} /></span>
              <span className="font-bold">30-Day Post-Launch Support</span>
            </div>
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
              <Sparkles size={16} className="text-emerald-400 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                Quick-Start Inquiries (1-Tap WhatsApp Connect)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Instant Pre-filled Message</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <a
                key={idx}
                href={`https://wa.me/92343673242?text=${encodeURIComponent(prompt.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 hover:border-emerald-500/40 flex items-center justify-between group transition-all cursor-pointer shadow-md"
              >
                <div className="pr-2">
                  <div className="text-xs font-bold text-zinc-200 group-hover:text-emerald-300 transition-colors">
                    {prompt.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate max-w-[240px] mt-0.5">
                    {prompt.msg}
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                  <SiWhatsapp size={13} />
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
            className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-28 -mb-28" />

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-3">
                <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                <span>Smart Project Estimator &amp; RFP</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Send Project Requirements
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm font-medium mt-2 leading-relaxed">
                Fill this 3-step blueprint. Every inquiry is personally reviewed by Muhammad Saqib with actionable architectural feedback and milestone estimates.
              </p>
            </div>

            {/* SUCCESS STATE */}
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-950/80 rounded-3xl p-8 sm:p-12 text-center border border-emerald-500/30 shadow-2xl relative z-10 space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                  <Check size={40} className="stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                    Inquiry Logged on Portal
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Thank You, {clientName}! 🚀
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                    Your inquiry has been submitted directly to Muhammad Saqib&apos;s priority queue. Reference ID: <code className="text-xs bg-zinc-900 px-2 py-0.5 rounded font-mono font-bold text-emerald-400 border border-white/10">{submittedId}</code>
                  </p>
                </div>

                {/* Submitted Recap Card */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-zinc-900/60 border border-white/10 text-left text-xs space-y-2">
                  <div className="text-zinc-500 font-mono font-bold uppercase tracking-wider text-[10px]">SUBMISSION SNAPSHOT</div>
                  <div className="flex justify-between text-zinc-300"><span>Service:</span> <strong className="text-white">{serviceType}</strong></div>
                  <div className="flex justify-between text-zinc-300"><span>Budget:</span> <strong className="text-emerald-400">{budget}</strong></div>
                  <div className="flex justify-between text-zinc-300"><span>Timeline:</span> <strong className="text-amber-400">{timeline}</strong></div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/92343673242?text=${encodeURIComponent(
                      `Hi Saqib! I submitted my project inquiry on your website (${submittedId}) for ${serviceType} (Budget: ${budget}). My Name: ${clientName} (${clientPhone || clientEmail}). Let's discuss!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                  >
                    <SiWhatsapp size={16} />
                    <span>Ping Saqib on WhatsApp Now</span>
                  </a>

                  <button
                    onClick={handleResetForm}
                    className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/10 transition-all cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </motion.div>
            ) : (
              /* THE 3-STEP FORM */
              <form onSubmit={handleSubmitInquiry} className="space-y-8 relative z-10">
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
                    <AlertCircle size={16} className="shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* STEP 1: SERVICE TYPE */}
                <div className="bg-zinc-950/50 p-5 sm:p-6 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      Select Service Category
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-500 ml-auto">Active Selection: <strong className="text-emerald-400">{serviceType}</strong></span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {SERVICES.map((svc) => {
                      const isSelected = svc.name === serviceType;
                      return (
                        <button
                          key={svc.name}
                          type="button"
                          onClick={() => setServiceType(svc.name)}
                          className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between group ${
                            isSelected
                              ? 'bg-zinc-900 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.02]'
                              : 'bg-zinc-950/60 border-white/5 hover:border-white/20 hover:bg-zinc-900/60 text-zinc-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${svc.color} border flex items-center justify-center shrink-0`}>
                                {svc.icon}
                              </div>
                              <span className={`text-[9px] font-mono font-bold uppercase ${isSelected ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                {isSelected ? 'Selected ✓' : 'Select'}
                              </span>
                            </div>
                            <div className="text-xs font-black text-white tracking-tight">{svc.name}</div>
                            <div className="text-[10px] text-zinc-500 mt-1 leading-snug">{svc.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: BUDGET & TIMELINE */}
                <div className="bg-zinc-950/50 p-5 sm:p-6 rounded-2xl border border-white/5 space-y-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      Scope &amp; Investment Range
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Budget */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <DollarSign size={14} className="text-emerald-400" />
                          <span>Estimated Budget</span>
                        </label>
                        <span className="text-xs font-mono font-black text-emerald-400">{budget}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map(b => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBudget(b)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              budget === b
                                ? 'bg-emerald-500 text-black font-black shadow-lg shadow-emerald-500/25 scale-105'
                                : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                          <Clock size={14} className="text-amber-400" />
                          <span>Target Delivery</span>
                        </label>
                        <span className="text-xs font-mono font-black text-amber-400">{timeline}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTimeline(t)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              timeline === t
                                ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-500/25 scale-105'
                                : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Custom Scope Expandable Box */}
                  <AnimatePresence>
                    {budget === 'Custom' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-3 border-t border-white/5"
                      >
                        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <h4 className="text-xs font-black uppercase text-emerald-300 font-mono tracking-widest">
                              Custom Scope Specification
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                                Desired Budget / Rate
                              </label>
                              <input
                                type="text"
                                value={customBudgetAmount}
                                onChange={e => setCustomBudgetAmount(e.target.value)}
                                placeholder="e.g. $2500, PKR 150K, Flexible"
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                                Reference Links (Optional)
                              </label>
                              <input
                                type="text"
                                value={referenceLinks}
                                onChange={e => setReferenceLinks(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-400"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                              Special Complex Features
                            </label>
                            <textarea
                              rows={2}
                              value={customFeatures}
                              onChange={e => setCustomFeatures(e.target.value)}
                              placeholder="Any specific AI integrations, payment gateways, custom APIs..."
                              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-400 resize-none"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* STEP 3: CONTACT INFO & REQUIREMENTS */}
                <div className="bg-zinc-950/50 p-5 sm:p-6 rounded-2xl border border-white/5 space-y-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      Your Contact Info &amp; Requirements
                    </h3>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                        Your Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        placeholder="e.g. Asad Malik"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
                        <span>WhatsApp / Phone</span>
                        <span className="text-emerald-400 text-[9px] font-bold">Fastest Reply</span>
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={e => setClientEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Requirements Textarea & Live Holographic Ticket */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
                    
                    {/* Left: Textarea */}
                    <div className="lg:col-span-8 space-y-2">
                      <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Project Specifications &amp; Features <span className="text-red-400">*</span></span>
                        <span className="text-zinc-500 text-[9px]">(Be as detailed as possible)</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={queryDetails}
                        onChange={e => setQueryDetails(e.target.value)}
                        placeholder="Describe your vision (e.g. Modern restaurant booking system with WhatsApp order receipt, Next.js portfolio with admin panel, custom AI bot, design preferences, reference links)..."
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-purple-400 transition-colors leading-relaxed"
                      />

                      {/* Quick Suggestion Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                        <span className="text-zinc-500 font-mono">Suggestions:</span>
                        <button
                          type="button"
                          onClick={() => setQueryDetails(prev => prev ? `${prev}, mobile-first responsive UI` : 'Need a mobile-first responsive web app with 60fps animations.')}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 cursor-pointer"
                        >
                          + Mobile Responsive
                        </button>
                        <button
                          type="button"
                          onClick={() => setQueryDetails(prev => prev ? `${prev}, WhatsApp checkout flow` : 'Need 1-click WhatsApp order confirmation and customer dispatch.')}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 cursor-pointer"
                        >
                          + WhatsApp Checkout
                        </button>
                        <button
                          type="button"
                          onClick={() => setQueryDetails(prev => prev ? `${prev}, custom admin control dashboard` : 'Need an intuitive admin control panel to manage content and leads.')}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 cursor-pointer"
                        >
                          + Admin Dashboard
                        </button>
                        <button
                          type="button"
                          onClick={() => setQueryDetails(prev => prev ? `${prev}, zero-trust database security` : 'Require zero-trust Supabase RLS database policies and API bot traps.')}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 hover:border-white/30 text-zinc-300 cursor-pointer"
                        >
                          + Zero-Trust Security
                        </button>
                      </div>
                    </div>

                    {/* Right: Live Dynamic Blueprint Ticket */}
                    <div className="lg:col-span-4 bg-gradient-to-b from-zinc-950 to-zinc-900 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>LIVE RFP TICKET</span>
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500">v3.0</span>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div>
                            <div className="text-[9px] font-mono text-zinc-500 uppercase">CLIENT:</div>
                            <div className="font-bold text-white truncate">{clientName || 'Anonymous Founder'}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-mono text-zinc-500 uppercase">CATEGORY:</div>
                            <div className="font-bold text-cyan-400">{serviceType}</div>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-white/5">
                            <div>
                              <div className="text-[9px] font-mono text-zinc-500 uppercase">BUDGET:</div>
                              <div className="font-bold text-emerald-400">{budget}</div>
                            </div>
                            <div>
                              <div className="text-[9px] font-mono text-zinc-500 uppercase">TIMELINE:</div>
                              <div className="font-bold text-amber-400">{timeline}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 space-y-1 text-[9px] font-mono text-zinc-500">
                        <div className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 size={10} />
                          <span>Zero-Trust Hardening Included</span>
                        </div>
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Clock size={10} />
                          <span>Turnaround: &lt; 2 Hours</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* DUAL ACTION DISPATCH BAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Inquiry is securely logged into Muhammad Saqib&apos;s encrypted database.</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* WhatsApp Fast Dispatch */}
                    <button
                      type="button"
                      onClick={handleWhatsAppDispatch}
                      className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-emerald-500/40 text-emerald-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <SiWhatsapp size={14} className="text-[#25D366]" />
                      <span>Dispatch via WhatsApp</span>
                    </button>

                    {/* Standard Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Submit Project RFP 🚀</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )}

          </motion.div>
        </div>

        {/* ========================================================== */}
        {/* WHAT WE DELIVER — FULL PRODUCTION CAPABILITIES */}
        {/* ========================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-5 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full" />
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                  What You Get When Working With Saqib 🚀
                </h3>
                <p className="text-xs text-zinc-400">Battle-tested engineering standards applied to every client deliverable.</p>
              </div>
            </div>
            <Link 
              href="/skills"
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Explore Technical Architecture</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Zero-Trust Security', desc: 'Supabase Row-Level Security (RLS) & honeypot bot traps.', icon: <ShieldCheck size={20} className="text-emerald-400" /> },
              { title: 'Next.js 15 SSR / SSG', desc: 'Sub-second page speeds with React 19 architecture.', icon: <Code2 size={20} className="text-cyan-400" /> },
              { title: 'Node & Express APIs', desc: 'High-throughput async runtimes and microservices.', icon: <Server size={20} className="text-purple-400" /> },
              { title: 'Mobile Apps & PWA', desc: 'React Native & Progressive Web Apps with offline cache.', icon: <Smartphone size={20} className="text-sky-400" /> },
              { title: 'AI & Gemini Engine', desc: 'Custom OpenAI & Gemini LLM background automation.', icon: <Bot size={20} className="text-amber-400" /> },
              { title: 'E-Commerce Checkout', desc: 'Instant WhatsApp order ping & conversion flows.', icon: <Layers size={20} className="text-rose-400" /> },
              { title: 'Admin Dashboards', desc: 'Bespoke CMS portals to manage analytics and data.', icon: <Layout size={20} className="text-teal-400" /> },
              { title: '98+ Lighthouse SEO', desc: 'Strict semantic markup & Google schema structured data.', icon: <Globe size={20} className="text-indigo-400" /> }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  {feature.icon}
                </div>
                <h4 className="text-xs font-black uppercase text-white tracking-tight mb-1">{feature.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">
              <HelpCircle size={12} className="text-cyan-400" />
              <span>Client FAQ &amp; Assurance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-zinc-900/50 border border-white/5 overflow-hidden transition-colors hover:border-white/10"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-zinc-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} 
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
                        <div className="px-4 sm:px-5 pb-5 text-xs text-zinc-400 leading-relaxed font-medium border-t border-white/5 pt-3">
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
        {/* SOCIAL CHANNELS & LOCATION RADAR */}
        {/* ========================================================== */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Location & Timezone Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-white/10 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-pink-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
                    Base Coordinates
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  PKT (UTC+5)
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
                {profile.location || 'Faisalabad / Gojra, Pakistan'}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-6">
                Operating remotely across international borders. Available for synchronous audio/video consultations via Google Meet, Zoom, or WhatsApp.
              </p>

              <div className="p-3.5 rounded-2xl bg-zinc-950 border border-white/5 font-mono text-xs space-y-1 text-zinc-400">
                <div className="flex justify-between">
                  <span className="text-zinc-500">COORDINATES:</span>
                  <span className="text-zinc-300 font-bold">30.3753° N, 69.3451° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">LOCAL CLOCK:</span>
                  <span className="text-emerald-400 font-bold">{livePktTime || 'PKT Live'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">STATUS:</span>
                  <span className="text-cyan-400 font-bold">Ready for Inquiries</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>OFFICIAL DOMAIN:</span>
              <a href="https://mrsaqib.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-white font-bold flex items-center gap-1">
                <span>mrsaqib.vercel.app</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </motion.div>

          {/* Social Channels Radar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-white/10 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass size={16} className="text-purple-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">
                    Official Social Channels
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/40 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  Direct Verification
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
                Connect Across The Web
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-6">
                Follow behind-the-scenes engineering builds, design breakdowns, and short-form tutorials.
              </p>

              {/* Social Channels Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'WhatsApp', icon: SiWhatsapp, handle: '+92 343 673242', link: profile.whatsapp_url || 'https://wa.me/92343673242', color: 'hover:border-emerald-500/50 hover:text-emerald-400' },
                  { name: 'Instagram', icon: SiInstagram, handle: '@mr_saqib242', link: profile.instagram_url || 'https://www.instagram.com/mr_saqib242', color: 'hover:border-pink-500/50 hover:text-pink-400' },
                  { name: 'TikTok', icon: SiTiktok, handle: '@mr_saqib_242', link: profile.tiktok_url || 'https://www.tiktok.com/@mr_saqib_242', color: 'hover:border-white/50 hover:text-white' },
                  { name: 'Facebook', icon: SiFacebook, handle: 'Muhammad Saqib', link: profile.facebook_url || 'https://web.facebook.com/muhammad.saqib.718278', color: 'hover:border-blue-500/50 hover:text-blue-400' },
                  { name: 'Snapchat', icon: SiSnapchat, handle: 'mrsaqib242', link: profile.snapchat_url || 'https://www.snapchat.com/add/mrsaqib242', color: 'hover:border-yellow-500/50 hover:text-yellow-400' },
                  { name: 'GitHub', icon: SiGithub, handle: 'techai342', link: profile.github_url || 'https://github.com/techai342', color: 'hover:border-purple-500/50 hover:text-purple-400' }
                ].map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-2xl bg-zinc-950 border border-white/5 text-zinc-400 flex flex-col justify-between transition-all ${social.color} shadow-md group`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={18} />
                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{social.name}</div>
                        <div className="text-[9px] font-mono text-zinc-500 truncate mt-0.5">{social.handle}</div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>PRIORITY CONTACT:</span>
              <span className="text-emerald-400 font-bold">Available 7 Days a Week</span>
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
