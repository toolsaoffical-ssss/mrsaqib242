import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Layers, 
  Activity, 
  User, 
  Briefcase, 
  Cpu, 
  Calculator, 
  Plus, 
  MessageCircle, 
  ShieldCheck, 
  Zap, 
  Globe, 
  CheckCircle2, 
  Database, 
  TrendingUp, 
  Coins,
  Smartphone
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

import { 
  PricingPlan, 
  PricingAddOn, 
  DEFAULT_PLANS, 
  DEFAULT_ADDONS,
  fetchPricingPlansFromDB,
  fetchPricingAddOnsFromDB
} from '../lib/pricingService';

interface WebsitePlansPageProps {
  onBack: () => void;
}

export default function WebsitePlansPage({ onBack }: WebsitePlansPageProps) {
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);
  const [addOns, setAddOns] = useState<PricingAddOn[]>(DEFAULT_ADDONS);

  useEffect(() => {
    let isMounted = true;
    const loadPricing = async () => {
      try {
        const [plansRes, addOnsRes] = await Promise.all([
          fetchPricingPlansFromDB(),
          fetchPricingAddOnsFromDB()
        ]);
        if (isMounted) {
          if (plansRes.plans && plansRes.plans.length > 0) setPlans(plansRes.plans);
          if (addOnsRes.addons && addOnsRes.addons.length > 0) setAddOns(addOnsRes.addons);
        }
      } catch (err) {
        console.warn('Error loading dynamic pricing:', err);
      }
    };

    loadPricing();

    const handlePricingUpdate = (e: any) => {
      if (e.detail?.plans) setPlans(e.detail.plans);
      if (e.detail?.addons) setAddOns(e.detail.addons);
    };

    window.addEventListener('pricing-updated', handlePricingUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('pricing-updated', handlePricingUpdate);
    };
  }, []);

  const inclusions = [
    { name: 'Mobile Responsive Design', icon: Smartphone },
    { name: 'Modern UI/UX Styles', icon: Sparkles },
    { name: 'Fast Loading Speeds', icon: Zap },
    { name: 'Basic SEO Setup', icon: TrendingUp },
    { name: 'SSL Security Config', icon: ShieldCheck },
    { name: 'Active Contact Forms', icon: CheckCircle2 },
    { name: 'WhatsApp Chat Widget', icon: MessageCircle },
    { name: 'Social Media Integrations', icon: Globe },
    { name: 'Cross-Browser Match', icon: Layers },
    { name: 'Free Post-Delivery Support', icon: Coins }
  ];

  // Estimator States
  const [selectedEstimatorPlan, setSelectedEstimatorPlan] = useState<string>('ecommerce-pro');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['ai-bot', 'hosting']);

  const currentPlanObj = plans.find(p => p.id === selectedEstimatorPlan) || plans[6];

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    let total = currentPlanObj.price;
    selectedAddOns.forEach(addOnId => {
      const addOn = addOns.find(a => a.id === addOnId);
      if (addOn) {
        total += addOn.price;
      }
    });
    return total;
  };

  const handleWhatsAppOrder = () => {
    const activeAddOnNames = selectedAddOns
      .map(id => addOns.find(a => a.id === id))
      .filter(Boolean)
      .map(addon => `${addon?.emoji} ${addon?.name} (+$${addon?.price})`);

    const addOnText = activeAddOnNames.length > 0 
      ? `\n➕ *Premium Add-ons:* \n${activeAddOnNames.join('\n')}`
      : '\n➕ *Premium Add-ons:* None';

    const text = `Hi Saqib! I would like to order a website. Here are my selected configurations:

💻 *Base Plan:* ${currentPlanObj.emoji} ${currentPlanObj.name} ($${currentPlanObj.price})
${addOnText}

📊 *Total Estimated Budget:* $${calculateTotal()}

Please let me know how we can get started! Thanks.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/92343673242?text=${encodedText}`, '_blank');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-zinc-950 text-white min-h-screen relative font-sans selection:bg-purple-600 selection:text-white no-scrollbar pb-16">
      {/* Laser grids and background accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.06),transparent_45%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.05),transparent_40%)] pointer-events-none z-0" />
      
      {/* Background cyber grid style */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Sticky Sub-Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link 
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault();
                onBack();
              }
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-widest uppercase text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden sm:flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link href="/skills" className="hover:text-white transition-colors">Skills</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase text-zinc-400">SAQIB PRICING SUITE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden text-center z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase">Premium Solutions</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none mb-6 uppercase"
          >
            Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">Development</span> Plans
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-zinc-400 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Bespoke pricing solutions carefully constructed for high scalability, sleek visual elegance, and state-of-the-art interactive user experiences.
          </motion.p>
        </div>
      </section>

      {/* Bento Grid layout containing Plans and Interactive Estimator */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 sm:space-y-12">
        
        {/* Top Bento Highlight Cards (Recommended / Featured Plans) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* E-Commerce Pro Featured Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 relative bg-zinc-900/60 border border-purple-500/30 rounded-[2rem] p-6 sm:p-10 flex flex-col justify-between group overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)] hover:border-purple-500/60 transition-all"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-purple-500/15 transition-all pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-purple-500 text-white font-black px-3.5 py-1 rounded-full text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  💎 Best Value Package
                </span>
                <span className="text-sm font-mono text-zinc-500">PRO LEVEL</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-purple-400 mb-2">
                E-Commerce Pro
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mb-8 leading-relaxed">
                Unlock high-velocity digital sales. Outfitted with complete user portal frameworks, checkout flows, discount coupon engines, and analytics.
              </p>

              {/* Grid of features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {plans.find(p => p.id === 'ecommerce-pro')?.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
                    <div className="h-5 w-5 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                      <Check size={12} />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/5">
              <div>
                <span className="text-zinc-500 text-[10px] tracking-widest font-mono uppercase block">INVESTMENT</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-white">${plans.find(p => p.id === 'ecommerce-pro')?.price ?? 399}</span>
                  <span className="text-zinc-500 text-xs font-mono">/ Complete</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  setSelectedEstimatorPlan('ecommerce-pro');
                  const section = document.getElementById('estimator-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-black py-4 px-8 rounded-2xl text-xs sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_15px_30px_rgba(168,85,247,0.3)] hover:scale-105"
              >
                Estimate Customizations <Plus size={16} />
              </button>
            </div>
          </motion.div>

          {/* Ultimate AI Package Bento Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/60 border border-cyan-500/30 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between group overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:border-cyan-500/50 transition-all"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="bg-cyan-500 text-black font-black px-3.5 py-1 rounded-full text-[9px] tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  🌟 Enterprise & AI
                </span>
                <span className="text-xs font-mono text-cyan-400">NEXT-GEN</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Ultimate Premium
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                A masterpiece including full AI model integrations (Gemini API), luxury custom dashboards, raw source files, and lightning-fast cloud setup.
              </p>

              <div className="space-y-2.5 mb-6">
                {['Generative Gemini AI Backend', 'Custom Control Console', 'Raw Source Files Included', 'Priority VIP SLA Support'].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                    <div className="h-4.5 w-4.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Check size={10} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-end justify-between">
              <div>
                <span className="text-zinc-500 text-[9px] tracking-widest font-mono uppercase block">STARTING FROM</span>
                <span className="text-3xl sm:text-4xl font-black text-white">${(plans.find(p => p.id === 'ultimate')?.price ?? 2499).toLocaleString()}</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedEstimatorPlan('ultimate');
                  const section = document.getElementById('estimator-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/5 border border-white/10 hover:bg-white hover:text-black hover:border-transparent text-white font-black p-3.5 rounded-xl transition-all"
                aria-label="Select Ultimate Plan"
              >
                <Plus size={16} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Interactive Cost Estimator Bento Box (Calculator / Selector) */}
        <div id="estimator-section" className="scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-md relative overflow-hidden"
          >
            {/* Holographic laser scan background design */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse" />
            
            <div className="flex flex-col xl:flex-row gap-10">
              
              {/* Left Side: Controls */}
              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-cyan-400">
                    <Calculator size={18} className="animate-spin-slow" />
                    <span className="text-xs font-mono uppercase tracking-widest">Pricing Matrix</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase">Interactive Cost Estimator</h3>
                  <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                    Select a core package, add individual premium options, and dynamically compute custom quotes in real-time.
                  </p>
                </div>

                {/* Base Plan Dropdown Picker */}
                <div className="space-y-3">
                  <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">1. Select Core Web Package</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {plans.map((p, idx) => (
                      <motion.button
                        key={p.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedEstimatorPlan(p.id)}
                        className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all flex flex-col justify-between h-20 sm:h-24 relative overflow-hidden group ${
                          selectedEstimatorPlan === p.id 
                            ? 'bg-zinc-800 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                            : 'bg-zinc-950/80 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {/* Glow indicator on chosen */}
                        {selectedEstimatorPlan === p.id && (
                          <div className={`absolute top-0 right-0 h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-cyan-400 m-2 sm:m-2.5 animate-ping`} />
                        )}
                        
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-sm sm:text-lg shrink-0">{p.emoji}</span>
                          <span className="text-[10px] sm:text-xs md:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">{p.name}</span>
                        </div>
                        
                        <div className="flex items-baseline gap-0.5 sm:gap-1">
                          <span className="text-sm sm:text-lg md:text-xl font-black text-white">
                            ${p.price}
                          </span>
                          {p.is_starting && <span className="text-[8px] sm:text-[10px] text-zinc-500 font-mono">start</span>}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Premium Add-ons Multi-Select Checklist */}
                <div className="space-y-3">
                  <label className="text-zinc-400 text-xs font-black uppercase tracking-wider block">2. Inject Premium Add-ons</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    {addOns.map((addon, idx) => {
                      const isSelected = selectedAddOns.includes(addon.id);
                      return (
                        <motion.button
                          key={addon.id}
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.03 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleToggleAddOn(addon.id)}
                          className={`p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border text-left transition-all flex items-center justify-between group ${
                            isSelected 
                              ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)] text-white' 
                              : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                            <span className="text-sm sm:text-base shrink-0">{addon.emoji}</span>
                            <span className="text-[10px] sm:text-xs font-semibold truncate">{addon.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <span className="text-[10px] sm:text-xs font-black text-white">
                              +${addon.price}
                            </span>
                            <div className={`h-3.5 w-3.5 sm:h-4 sm:w-4 rounded border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-purple-500 border-transparent text-white' : 'border-zinc-700 bg-zinc-950'
                            }`}>
                              {isSelected && <Check size={8} className="sm:size-[10px]" strokeWidth={4} />}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Side: Dynamic Quote Summary Card */}
              <div className="w-full xl:w-[380px] shrink-0">
                <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-400/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <span className="text-zinc-400 text-xs font-mono uppercase tracking-widest">Configuration</span>
                      <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Active</span>
                    </div>

                    {/* Base Plan Line */}
                    <div className="space-y-2">
                      <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">Base Package</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          {currentPlanObj.emoji} {currentPlanObj.name}
                        </span>
                        <span className="text-sm font-black text-white">${currentPlanObj.price}</span>
                      </div>
                    </div>

                    {/* Add-ons line items list */}
                    <div className="space-y-2.5">
                      <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">Custom Add-ons ({selectedAddOns.length})</span>
                      
                      {selectedAddOns.length > 0 ? (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                          {selectedAddOns.map(addOnId => {
                            const addon = addOns.find(a => a.id === addOnId);
                            if (!addon) return null;
                            return (
                              <div key={addon.id} className="flex items-center justify-between text-xs text-zinc-400">
                                <span className="truncate pr-4">{addon.emoji} {addon.name}</span>
                                <span className="font-semibold text-white">+{addon.is_starting ? 'Starting ' : ''}${addon.price}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-zinc-600 text-xs italic">No add-ons selected yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase block">Estimated Total</span>
                        <span className="text-zinc-600 text-[8px] font-mono block">DEVELOPER DIRECT PRICE</span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-cyan-400">
                          ${calculateTotal()}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={handleWhatsAppOrder}
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 px-2 rounded-2xl text-[10px] sm:text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-1 sm:gap-2 shadow-[0_15px_30px_rgba(37,211,102,0.35)] active:scale-95"
                    >
                      <span className="flex-shrink-0 flex items-center justify-center"><SiWhatsapp size={16} /></span> 
                      <span className="text-center">Place Order</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Complete Grid of Web Development Packages */}
        <div>
          <div className="text-center md:text-left mb-8">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider">All Web Packages</h3>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">Browse the full spectrum of cataloged models for any business size.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {plans.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: (idx % 2) * 0.1 }}
                className={`bg-zinc-900/40 border rounded-2xl sm:rounded-[1.75rem] p-3.5 sm:p-6 flex flex-col justify-between relative group hover:shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:bg-zinc-900/60 transition-all ${
                  p.recommended ? 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {p.recommended && (
                  <span className="absolute top-0 right-4 sm:right-6 -translate-y-1/2 bg-purple-500 text-white font-black px-2 sm:px-3 py-0.5 rounded-full text-[7px] sm:text-[8px] tracking-wider uppercase">
                    {p.badge}
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-lg sm:text-2xl">{p.emoji}</span>
                      <h4 className="text-[11px] sm:text-base font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all line-clamp-1">
                        {p.name}
                      </h4>
                    </div>
                    <span className="text-[8px] sm:text-[10px] font-mono text-zinc-500 uppercase">0{idx + 1}</span>
                  </div>

                  <p className="text-zinc-400 text-[10px] sm:text-xs leading-relaxed mb-3 sm:mb-6 line-clamp-2 md:line-clamp-none">
                    {p.description}
                  </p>

                  <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-6">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1 sm:gap-2 text-[9px] sm:text-xs text-zinc-300">
                        <Check size={10} className="text-emerald-400 mt-0.5 shrink-0 sm:size-3.5" />
                        <span className="line-clamp-1 sm:line-clamp-none">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 sm:pt-4 border-t border-white/5 flex items-end justify-between mt-auto">
                  <div>
                    <span className="text-zinc-500 text-[7px] sm:text-[8px] tracking-widest font-mono uppercase block">Budget</span>
                    <div className="flex items-baseline gap-0.5 sm:gap-1">
                      <span className="text-base sm:text-2xl md:text-3xl font-black text-white">${p.price}</span>
                      {p.is_starting && <span className="text-[8px] sm:text-[10px] text-zinc-500 font-mono">start</span>}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedEstimatorPlan(p.id);
                      const section = document.getElementById('estimator-section');
                      if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-white/5 border border-white/10 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-transparent text-white font-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-xs uppercase tracking-wider transition-all"
                  >
                    Select
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bento Card: Included in Every Plan Standard Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-6 sm:p-10"
          >
            <div className="mb-8">
              <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest">STANDARD OFFERING</span>
              <h3 className="text-xl sm:text-2xl font-black uppercase mt-1">Included in Every Plan</h3>
              <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">High reliability metrics and digital inclusions configured out of the box.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {inclusions.map((inc, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <inc.icon className="size-4 sm:size-[18px]" />
                  </div>
                  <div>
                    <h5 className="text-[10px] sm:text-sm font-bold text-white leading-tight">{inc.name}</h5>
                    <p className="text-zinc-500 text-[8px] sm:text-xs leading-relaxed mt-0.5">Fully optimized and included at no cost.</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Special Custom Consultation Bento Box */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-indigo-900/20 via-zinc-900/60 to-zinc-950 border border-indigo-500/20 rounded-[2.5rem] p-6 sm:p-8 flex flex-col justify-between group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/5 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
            
            <div>
              <span className="text-indigo-400 text-xs font-mono uppercase tracking-widest">BESPOKE SERVICES</span>
              <h3 className="text-xl sm:text-2xl font-black uppercase mt-1 text-white group-hover:text-indigo-300 transition-colors">Need a Custom Layout?</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-4">
                Have specific design blueprints, special backend requests, complex database models, or an completely unique startup concept?
              </p>
              <p className="text-zinc-500 text-[10px] sm:text-xs leading-relaxed mt-4">
                Let's schedule a direct developer call. We will architecture a custom blueprint tailored to your brand constraints.
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-8">
              <a 
                href="https://wa.me/92343673242?text=Hi%20Saqib!%20I%27d%20like%20to%20discuss%20a%20completely%20custom%20website%20development%20project%20with%20you."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(79,70,229,0.25)] hover:scale-102"
              >
                <MessageCircle size={14} /> Talk on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

      </main>

    </div>
  );
}
