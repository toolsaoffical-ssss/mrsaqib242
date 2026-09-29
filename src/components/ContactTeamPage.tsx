import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
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
  MessageSquare
} from 'lucide-react';
import { SiWhatsapp, SiInstagram, SiTiktok, SiFacebook, SiSnapchat } from 'react-icons/si';
import { useProfileSettings } from '../hooks/useProfileSettings';
import { submitInquiryToDB } from '../lib/inquiriesService';

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
  const [customFeatures, setCustomFeatures] = useState('');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [queryDetails, setQueryDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const SERVICES = [
    'Full-Stack Web App',
    'E-Commerce Marketplace',
    'Mobile App (React Native)',
    'AI Solution & Gemini API',
    'Portfolio / Landing Page',
    'Restaurant QR & Orders',
    'Custom Tool / API',
    'UI/UX & Branding'
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
      const res = await submitInquiryToDB({
        name: clientName.trim(),
        email: clientEmail.trim() || 'contact@client.com',
        phone: clientPhone.trim(),
        service_type: serviceType,
        budget,
        timeline,
        subject: `Project Inquiry: ${serviceType}`,
        message: queryDetails.trim(),
        priority: 'high'
      });

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

  const handleResetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setQueryDetails('');
    setIsSubmitted(false);
    setSubmittedId('');
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] selection:bg-pink-300 selection:text-white font-sans overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-[#F0F2F5]/80 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-600 hover:text-black transition-colors font-semibold tracking-widest uppercase text-xs"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        <div className="text-sm font-black uppercase tracking-[0.3em] text-zinc-800">
          Contact & Team
        </div>
        <div className="w-24"></div> {/* Spacer */}
      </nav>

      <div className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-800 tracking-tighter mb-4"
          >
            {profile.brand_name || 'SAQIB VISUALS'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-zinc-500 font-bold tracking-widest uppercase text-[10px] sm:text-xs md:text-sm"
          >
            {profile.tagline || 'Full-Stack Development & Creative Studio'}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-lg sm:text-xl md:text-2xl font-serif italic text-zinc-600 max-w-2xl mx-auto px-4"
          >
            "Turning Ideas into Powerful Digital Experiences."
          </motion.div>
        </div>

        {/* Team Section */}
        <div className="w-full max-w-4xl mx-auto mb-20 md:mb-24">
          
          {/* Saqib Card - White Neumorphic */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -5 }}
            className="bg-[#F0F2F5] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] sm:shadow-[12px_12px_24px_#d9dadc,-12px_-12px_24px_#ffffff] border border-white/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center mb-6 sm:mb-8 relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F0F2F5] shadow-[inset_6px_6px_12px_#d9dadc,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center shrink-0 border-[3px] border-white">
                <Code className="text-zinc-700 w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <div>
                <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                  <Briefcase size={12} className="sm:w-3.5 sm:h-3.5" />
                  Founder & Lead Developer
                </h3>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-800 tracking-tight">{profile.name || 'Muhammad Saqib'}</h2>
              </div>
            </div>
            
            <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-medium mb-6 sm:mb-8">
              {profile.bio || "I'm a passionate Full-Stack Web Developer, App Developer, AI Enthusiast, and Creative Content Creator with a strong focus on building modern, fast, and scalable digital solutions. My goal is to help businesses, creators, and startups bring their ideas to life through innovative technology and creative design."}
            </p>

            <div className="bg-[#F0F2F5] rounded-2xl p-5 sm:p-6 shadow-[inset_4px_4px_8px_#d9dadc,inset_-4px_-4px_8px_#ffffff] sm:shadow-[inset_6px_6px_12px_#d9dadc,inset_-6px_-6px_12px_#ffffff]">
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 sm:mb-4">Expertise</h4>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-zinc-700 mb-6">
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><Code size={14} className="text-zinc-500 shrink-0" /> Full-Stack Web</motion.div>
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><Smartphone size={14} className="text-zinc-500 shrink-0" /> Mobile Apps</motion.div>
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><Cpu size={14} className="text-zinc-500 shrink-0" /> AI Integration</motion.div>
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><Globe size={14} className="text-zinc-500 shrink-0" /> React & Next.js</motion.div>
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><Database size={14} className="text-zinc-500 shrink-0" /> Databases & APIs</motion.div>
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><Layout size={14} className="text-zinc-500 shrink-0" /> UI/UX Design</motion.div>
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><PenTool size={14} className="text-zinc-500 shrink-0" /> Branding</motion.div>
                <motion.div whileHover={{ scale: 1.05, x: 5 }} className="flex items-center gap-2"><Video size={14} className="text-zinc-500 shrink-0" /> Video Editing</motion.div>
              </div>

              {/* Core Expert Tech Stack */}
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 mt-6 border-t border-zinc-200/50 pt-4">Full Expert Tech Stack</h4>
              <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6">
                {/* React */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#61DAFB]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#61DAFB] transition-colors">React</span>
                </motion.div>
                
                {/* Next.js */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-zinc-800">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">Next.js</span>
                </motion.div>

                {/* Vite */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#646CFF]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" alt="Vite" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#646CFF] transition-colors">Vite</span>
                </motion.div>

                {/* Tailwind */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#06B6D4]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#06B6D4] transition-colors">Tailwind</span>
                </motion.div>

                {/* MongoDB */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#47A248]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#47A248] transition-colors">MongoDB</span>
                </motion.div>

                {/* Express */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-zinc-800">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" className="w-full h-full object-contain dark:invert" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">Express</span>
                </motion.div>

                {/* Node.js */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#339933]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#339933] transition-colors">Node.js</span>
                </motion.div>

                {/* Angular */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#DD0031]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" alt="Angular" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#DD0031] transition-colors">Angular</span>
                </motion.div>

                {/* TypeScript */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#3178C6]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#3178C6] transition-colors">TypeScript</span>
                </motion.div>
                
                {/* PostgreSQL */}
                <motion.div whileHover={{ y: -3, scale: 1.05 }} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md border border-zinc-100 flex items-center justify-center p-2.5 transition-colors group-hover:border-[#336791]">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-600 group-hover:text-[#336791] transition-colors">PostgreSQL</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ========================================================== */}
        {/* INTERACTIVE PROJECT INQUIRY & CLIENT DETAILS FORM */}
        {/* ========================================================== */}
        <div className="w-full max-w-4xl mx-auto mb-20 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="bg-[#F0F2F5] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-12 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] sm:shadow-[12px_12px_24px_#d9dadc,-12px_-12px_24px_#ffffff] border border-white/60 relative overflow-hidden"
          >
            {/* Ambient Background Gradient Accents */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 relative z-10">
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
              <div className="mt-5 p-3.5 rounded-2xl bg-white/60 border border-white shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
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
                  href={`https://wa.me/92343673242?text=${encodeURIComponent(
                    `Hi Muhammad Saqib! I came from your portfolio website and want to discuss a new project with you.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 shrink-0"
                >
                  <SiWhatsapp size={14} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Success State */}
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

                {/* Quick Summary Recap */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#F0F2F5] shadow-[inset_3px_3px_6px_#d9dadc,inset_-3px_-3px_6px_#ffffff] border border-white text-left text-xs space-y-1.5">
                  <div className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Submitted Details:</div>
                  <div className="flex justify-between text-zinc-700"><span>Service:</span> <strong className="text-zinc-900">{serviceType}</strong></div>
                  <div className="flex justify-between text-zinc-700"><span>Budget:</span> <strong className="text-emerald-600">{budget}</strong></div>
                  <div className="flex justify-between text-zinc-700"><span>Timeline:</span> <strong className="text-zinc-900">{timeline}</strong></div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/92343673242?text=${encodeURIComponent(
                      `Hi Saqib! I submitted my project query on your website (${submittedId}) for ${serviceType} (Budget: ${budget}). My Name: ${clientName} (${clientPhone || clientEmail}). Let's discuss!`
                    )}`}
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
              /* Form State - 3 Simple Clear Steps with Live Preview */
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

                {/* STEP 2: PROJECT SCOPE & BUDGET */}
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
                      {SERVICES.map(svc => {
                        const isSelected = svc === serviceType;
                        return (
                          <button
                            key={svc}
                            type="button"
                            onClick={() => setServiceType(svc)}
                            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                              isSelected
                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-md scale-102'
                                : 'bg-[#F0F2F5] text-zinc-700 hover:text-black hover:bg-white/70 border-white shadow-[3px_3px_6px_#d9dadc,-3px_-3px_6px_#ffffff]'
                            }`}
                          >
                            <span className="text-xs font-bold leading-tight">{svc}</span>
                            <span className={`text-[10px] mt-2 font-mono ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}>
                              {isSelected ? '✓ Selected' : 'Choose'}
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
                        className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600 hover:text-black cursor-pointer"
                      >
                        + Mobile Responsive
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueryDetails(prev => prev ? `${prev}, include WhatsApp integration` : 'Need 1-click WhatsApp order notification and direct customer chat.')}
                        className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600 hover:text-black cursor-pointer"
                      >
                        + WhatsApp Order Flow
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueryDetails(prev => prev ? `${prev}, custom admin dashboard` : 'Need an intuitive admin control panel to manage content and leads.')}
                        className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600 hover:text-black cursor-pointer"
                      >
                        + Admin Dashboard
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

                {/* Submit Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-200">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Your query is saved directly to Muhammad Saqib&apos;s active portal.</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-zinc-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
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
              </form>
            )}
          </motion.div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 md:mb-24">
          
          {/* What We Build */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 bg-[#F0F2F5] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] border border-white/50"
          >
            <h3 className="text-xl sm:text-2xl font-black text-zinc-800 tracking-tight mb-5 sm:mb-6">What We Build 🚀</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-6">
              {[
                "Business Websites",
                "Portfolio Websites",
                "Admin Dashboards",
                "AI-Powered Applications",
                "Custom Web Applications",
                "Mobile Applications",
                "Landing Pages",
                "E-Commerce Solutions",
                "API Integration",
                "UI/UX Design Systems",
                "Branding & Creative Content"
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base text-zinc-700 font-medium"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F0F2F5] shadow-[inset_2px_2px_4px_#d9dadc,inset_-2px_-2px_4px_#ffffff] flex items-center justify-center shrink-0 text-emerald-500">
                    <CheckCircle2 size={12} className="sm:w-3.5 sm:h-3.5" />
                  </div>
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Details */}
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
              <h3 className="text-xl sm:text-2xl font-black text-zinc-800 tracking-tight mb-6 sm:mb-8 flex items-center gap-2">
                Connect With Us <span className="text-2xl">🌍</span>
              </h3>
              
              <div className="space-y-4 sm:space-y-5">
                {/* Location */}
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex items-center gap-4 bg-white/40 p-4 sm:p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-2px_-2px_5px_rgba(0,0,0,0.03),2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.9)] flex items-center justify-center text-pink-500 shrink-0 border-2 border-white">
                    <MapPin size={22} className="drop-shadow-sm sm:w-6 sm:h-6" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-pink-400 mb-0.5">Location</h4>
                    <p className="text-zinc-800 font-extrabold text-sm sm:text-base">{profile.location || 'Faisalabad, Pakistan'}</p>
                  </div>
                </motion.div>

                {/* Call */}
                <motion.a 
                  whileHover={{ scale: 1.02, x: 5 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  href={`tel:${(profile.phone || '+92343673242').replace(/\s+/g, '')}`}
                  className="flex items-center gap-4 bg-white/40 p-4 sm:p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-2px_-2px_5px_rgba(0,0,0,0.03),2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-sm group cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.9)] flex items-center justify-center text-emerald-600 shrink-0 border-2 border-white group-hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] transition-all">
                    <Phone size={22} className="drop-shadow-sm sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="pt-0.5">
                    <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-0.5">Contact</h4>
                    <p className="text-zinc-800 font-extrabold text-sm sm:text-base">{profile.phone || '+92 343 673242'}</p>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a 
                  whileHover={{ scale: 1.02, x: 5 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  href={`mailto:${profile.email || 'mrsaqib242242@gmail.com'}`}
                  className="flex items-center gap-4 bg-white/40 p-4 sm:p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-2px_-2px_5px_rgba(0,0,0,0.03),2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-sm group cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.9)] flex items-center justify-center text-blue-600 shrink-0 border-2 border-white group-hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] transition-all">
                    <Mail size={22} className="drop-shadow-sm sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="pt-0.5 w-full overflow-hidden">
                    <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-blue-500 mb-0.5">Email</h4>
                    <p className="text-zinc-800 font-extrabold text-[13px] sm:text-base truncate w-full">{profile.email || 'mrsaqib242242@gmail.com'}</p>
                  </div>
                </motion.a>

                {/* Portfolio */}
                <motion.a 
                  whileHover={{ scale: 1.02, x: 5 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  href={profile.portfolio_url || 'https://mrsaqib.vercel.app/'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white/40 p-4 sm:p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-2px_-2px_5px_rgba(0,0,0,0.03),2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-sm group cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.9)] flex items-center justify-center text-violet-600 shrink-0 border-2 border-white group-hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] transition-all">
                    <Globe size={22} className="drop-shadow-sm sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="pt-0.5 w-full overflow-hidden">
                    <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-violet-500 mb-0.5">Portfolio</h4>
                    <p className="text-zinc-800 font-extrabold text-[13px] sm:text-base truncate w-full">
                      {(profile.portfolio_url || 'mrsaqib.vercel.app').replace(/^https?:\/\//, '')}
                    </p>
                  </div>
                </motion.a>

                {/* CV Download */}
                <motion.a 
                  whileHover={{ scale: 1.02, x: 5 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  href={profile.resume_url || '/resume.pdf'}
                  download="Saqib_Visual_Resume.pdf"
                  className="flex items-center gap-4 bg-white/40 p-4 sm:p-5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.8),inset_-2px_-2px_5px_rgba(0,0,0,0.03),2px_2px_8px_rgba(0,0,0,0.04)] border border-white/60 backdrop-blur-sm group cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-4px_-4px_8px_rgba(255,255,255,0.9)] flex items-center justify-center text-orange-600 shrink-0 border-2 border-white group-hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] transition-all">
                    <Briefcase size={22} className="drop-shadow-sm sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="pt-0.5 w-full overflow-hidden">
                    <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-orange-500 mb-0.5">Resume / CV</h4>
                    <p className="text-zinc-800 font-extrabold text-[13px] sm:text-base truncate w-full">Download Now</p>
                  </div>
                </motion.a>

              </div>
            </div>
          </motion.div>

        </div>

        {/* Social Media & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: -30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-4">Our Mission 🎯</h3>
            <p className="text-zinc-300 leading-relaxed font-medium mb-6 sm:mb-8 text-sm sm:text-lg">
              We combine <strong className="text-white">technology, creativity, and innovation</strong> to build high-quality digital products that are fast, modern, secure, and visually outstanding. Every project is developed with attention to detail, performance, and user experience.
            </p>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 border border-white/20 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
            >
              <p className="text-xs sm:text-sm font-semibold text-white/90 leading-relaxed">
                ✨ Need a Website, Mobile App, AI Solution, or Custom Software?
              </p>
              <p className="mt-2 text-sm sm:text-base text-white font-bold tracking-tight">
                📩 Let's work together and turn your vision into reality.
              </p>
            </motion.div>
          </motion.div>

          {/* Socials */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#F0F2F5] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-[8px_8px_16px_#d9dadc,-8px_-8px_16px_#ffffff] border border-white/50 flex flex-col justify-center"
          >
            <h3 className="text-xl sm:text-2xl font-black text-zinc-800 tracking-tight mb-6 sm:mb-8 text-center">Connect With Us 📱</h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { icon: SiWhatsapp, link: profile.whatsapp_url || "https://wa.me/92343673242", color: "text-[#25D366]" },
                { icon: SiInstagram, link: profile.instagram_url || "https://www.instagram.com/mr_saqib242", color: "text-[#E1306C]" },
                { icon: SiTiktok, link: profile.tiktok_url || "https://www.tiktok.com/@mr_saqib_242", color: "text-black" },
                { icon: SiFacebook, link: profile.facebook_url || "https://web.facebook.com/muhammad.saqib.718278", color: "text-[#1877F2]" },
                { icon: SiSnapchat, link: profile.snapchat_url || "https://www.snapchat.com/add/mrsaqib242", color: "text-[#FFFC00] drop-shadow-md" },
              ].map((social, i) => {
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
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 10 }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F0F2F5] shadow-[4px_4px_8px_#d9dadc,-4px_-4px_8px_#ffffff] sm:shadow-[6px_6px_12px_#d9dadc,-6px_-6px_12px_#ffffff] flex items-center justify-center border border-white hover:shadow-[inset_4px_4px_8px_#d9dadc,inset_-4px_-4px_8px_#ffffff] transition-shadow ${social.color}`}
                  >
                    <div className="sm:scale-[1.16]">
                      <Icon size={24} />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
