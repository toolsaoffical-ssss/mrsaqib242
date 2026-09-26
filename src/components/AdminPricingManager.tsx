import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Layers, 
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Tag,
  Zap,
  Star
} from 'lucide-react';
import { 
  PricingPlan, 
  PricingAddOn, 
  DEFAULT_PLANS, 
  DEFAULT_ADDONS,
  fetchPricingPlansFromDB,
  fetchPricingAddOnsFromDB,
  savePricingPlanToDB,
  savePricingAddOnToDB,
  deletePricingPlanFromDB,
  deletePricingAddOnFromDB,
  resetPricingToDefaults
} from '../lib/pricingService';

interface AdminPricingManagerProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const COLOR_PRESETS = [
  { label: 'Emerald / Green', value: 'from-emerald-500 to-green-600' },
  { label: 'Blue / Indigo', value: 'from-blue-500 to-indigo-600' },
  { label: 'Purple / Violet', value: 'from-purple-500 to-violet-600' },
  { label: 'Amber / Gold', value: 'from-yellow-500 to-amber-600' },
  { label: 'Orange / Red', value: 'from-orange-500 to-red-600' },
  { label: 'Rose / Pink', value: 'from-rose-500 to-pink-600' },
  { label: 'Cyan / Teal', value: 'from-cyan-500 to-teal-600' }
];

export default function AdminPricingManager({ onNotify }: AdminPricingManagerProps) {
  const [subTab, setSubTab] = useState<'plans' | 'addons'>('plans');
  const [plans, setPlans] = useState<PricingPlan[]>(DEFAULT_PLANS);
  const [addOns, setAddOns] = useState<PricingAddOn[]>(DEFAULT_ADDONS);
  const [loading, setLoading] = useState(true);
  const [isFromDB, setIsFromDB] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Action States
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [isAddOnModalOpen, setIsAddOnModalOpen] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState<PricingAddOn | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingType, setDeletingType] = useState<'plan' | 'addon'>('plan');
  const [actionLoading, setActionLoading] = useState(false);

  // Plan Form State
  const [planForm, setPlanForm] = useState<{
    id: string;
    name: string;
    price: number;
    is_starting: boolean;
    color: string;
    emoji: string;
    badge: string;
    recommended: boolean;
    description: string;
    features: string[];
    newFeatureInput: string;
    display_order: number;
    is_active: boolean;
  }>({
    id: '',
    name: '',
    price: 49,
    is_starting: false,
    color: 'from-orange-500 to-amber-600',
    emoji: '🚀',
    badge: '',
    recommended: false,
    description: '',
    features: ['Responsive UI', 'Contact Integration'],
    newFeatureInput: '',
    display_order: 1,
    is_active: true
  });

  // AddOn Form State
  const [addOnForm, setAddOnForm] = useState({
    id: '',
    name: '',
    price: 15,
    is_starting: false,
    emoji: '⚡',
    category: 'Features',
    display_order: 1,
    is_active: true
  });

  const loadPricingData = async () => {
    setLoading(true);
    try {
      const [plansRes, addOnsRes] = await Promise.all([
        fetchPricingPlansFromDB(),
        fetchPricingAddOnsFromDB()
      ]);
      if (plansRes.plans) setPlans(plansRes.plans);
      if (addOnsRes.addons) setAddOns(addOnsRes.addons);
      setIsFromDB(Boolean(plansRes.fromDatabase || addOnsRes.fromDatabase));
    } catch (err: any) {
      onNotify('Failed to load pricing: ' + (err.message || 'Error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPricingData();
  }, []);

  // Open Plan Modal
  const openAddPlanModal = () => {
    setEditingPlan(null);
    setPlanForm({
      id: `plan-${Date.now().toString().slice(-4)}`,
      name: '',
      price: 49,
      is_starting: false,
      color: 'from-orange-500 to-amber-600',
      emoji: '🚀',
      badge: '',
      recommended: false,
      description: '',
      features: ['High-Performance Codebase', 'Mobile Responsive Layout'],
      newFeatureInput: '',
      display_order: plans.length + 1,
      is_active: true
    });
    setIsPlanModalOpen(true);
  };

  const openEditPlanModal = (p: PricingPlan) => {
    setEditingPlan(p);
    setPlanForm({
      id: p.id,
      name: p.name,
      price: p.price,
      is_starting: Boolean(p.is_starting),
      color: p.color || 'from-blue-500 to-indigo-600',
      emoji: p.emoji || '💼',
      badge: p.badge || '',
      recommended: Boolean(p.recommended),
      description: p.description || '',
      features: p.features ? [...p.features] : [],
      newFeatureInput: '',
      display_order: p.display_order ?? 1,
      is_active: p.is_active !== false
    });
    setIsPlanModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!planForm.newFeatureInput.trim()) return;
    setPlanForm(prev => ({
      ...prev,
      features: [...prev.features, prev.newFeatureInput.trim()],
      newFeatureInput: ''
    }));
  };

  const handleRemoveFeature = (idx: number) => {
    setPlanForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      onNotify('Plan name is required.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const planPayload: PricingPlan = {
        id: planForm.id.trim() || planForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: planForm.name.trim(),
        price: Number(planForm.price) || 0,
        is_starting: planForm.is_starting,
        color: planForm.color,
        emoji: planForm.emoji.trim() || '💼',
        badge: planForm.badge.trim() || undefined,
        recommended: planForm.recommended,
        description: planForm.description.trim(),
        features: planForm.features.filter(Boolean),
        display_order: Number(planForm.display_order) || 1,
        is_active: planForm.is_active
      };

      const res = await savePricingPlanToDB(planPayload, plans);
      if (!res.success) {
        onNotify(`Save error: ${res.error || 'Failed to save plan'}`, 'error');
      } else {
        onNotify(`Plan "${planPayload.name}" saved successfully!`, 'success');
        setIsPlanModalOpen(false);
        loadPricingData();
      }
    } catch (err: any) {
      onNotify('Failed to save plan: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Open AddOn Modal
  const openAddAddOnModal = () => {
    setEditingAddOn(null);
    setAddOnForm({
      id: `addon-${Date.now().toString().slice(-4)}`,
      name: '',
      price: 15,
      is_starting: false,
      emoji: '⚡',
      category: 'Services',
      display_order: addOns.length + 1,
      is_active: true
    });
    setIsAddOnModalOpen(true);
  };

  const openEditAddOnModal = (a: PricingAddOn) => {
    setEditingAddOn(a);
    setAddOnForm({
      id: a.id,
      name: a.name,
      price: a.price,
      is_starting: Boolean(a.is_starting),
      emoji: a.emoji || '⚡',
      category: a.category || 'Services',
      display_order: a.display_order ?? 1,
      is_active: a.is_active !== false
    });
    setIsAddOnModalOpen(true);
  };

  const handleSaveAddOn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addOnForm.name.trim()) {
      onNotify('Add-on name is required.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const addOnPayload: PricingAddOn = {
        id: addOnForm.id.trim() || addOnForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: addOnForm.name.trim(),
        price: Number(addOnForm.price) || 0,
        is_starting: addOnForm.is_starting,
        emoji: addOnForm.emoji.trim() || '⚡',
        category: addOnForm.category.trim() || 'Services',
        display_order: Number(addOnForm.display_order) || 1,
        is_active: addOnForm.is_active
      };

      const res = await savePricingAddOnToDB(addOnPayload, addOns);
      if (!res.success) {
        onNotify(`Save error: ${res.error || 'Failed to save add-on'}`, 'error');
      } else {
        onNotify(`Add-on "${addOnPayload.name}" saved successfully!`, 'success');
        setIsAddOnModalOpen(false);
        loadPricingData();
      }
    } catch (err: any) {
      onNotify('Failed to save add-on: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingId) return;
    setActionLoading(true);
    try {
      if (deletingType === 'plan') {
        const res = await deletePricingPlanFromDB(deletingId);
        if (!res.success) {
          onNotify(`Delete error: ${res.error || 'Failed'}`, 'error');
        } else {
          onNotify('Plan deleted successfully.', 'success');
          setPlans(prev => prev.filter(p => p.id !== deletingId));
        }
      } else {
        const res = await deletePricingAddOnFromDB(deletingId);
        if (!res.success) {
          onNotify(`Delete error: ${res.error || 'Failed'}`, 'error');
        } else {
          onNotify('Add-on deleted successfully.', 'success');
          setAddOns(prev => prev.filter(a => a.id !== deletingId));
        }
      }
      setDeletingId(null);
    } catch (err: any) {
      onNotify('Delete failed: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Reset all website pricing plans and add-ons to initial presets?')) return;
    setActionLoading(true);
    try {
      await resetPricingToDefaults();
      onNotify('Pricing reset to defaults successfully.', 'success');
      loadPricingData();
    } catch (err: any) {
      onNotify('Reset error: ' + (err.message || 'Error'), 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPlans = plans.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.features?.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAddOns = addOns.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <CreditCard size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-wide">Website Pricing & Plans</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isFromDB 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {isFromDB ? 'Supabase Synced' : 'Preset Mode'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Control packages, deliverables, starting rates, and add-on services shown to clients.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={loadPricingData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleResetDefaults}
            disabled={actionLoading}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reset to default packages"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {subTab === 'plans' ? (
            <button
              onClick={openAddPlanModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Plan</span>
            </button>
          ) : (
            <button
              onClick={openAddAddOnModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add New Add-On</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs: Plans vs Add-Ons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setSubTab('plans')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'plans'
                ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers size={14} />
            <span>Website Packages ({plans.length})</span>
          </button>

          <button
            onClick={() => setSubTab('addons')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === 'addons'
                ? 'bg-orange-500 text-black font-black shadow-lg shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Zap size={14} />
            <span>Add-Ons & Extras ({addOns.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder={subTab === 'plans' ? 'Search packages...' : 'Search add-ons...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>
      </div>

      {/* Plans View */}
      {subTab === 'plans' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-white/5">
              <CreditCard size={40} className="mx-auto text-zinc-600 mb-3" />
              <p className="text-sm font-bold text-zinc-300">No plans found</p>
              <p className="text-xs text-zinc-500 mt-1">Click "Add New Plan" to create pricing options.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.map(plan => {
                const isActive = plan.is_active !== false;
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-zinc-900/70 border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-orange-500/40 ${
                      isActive ? 'border-white/10' : 'border-rose-900/40 opacity-70 bg-zinc-950'
                    }`}
                  >
                    {/* Top gradient bar */}
                    <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${plan.color || 'from-orange-500 to-amber-500'} mb-3`} />

                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{plan.emoji || '💼'}</span>
                          <div>
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                              {plan.name}
                              {plan.recommended && (
                                <Star size={13} className="text-amber-400 fill-amber-400" />
                              )}
                            </h3>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              {plan.is_starting && (
                                <span className="text-[10px] text-zinc-500 font-semibold">Starting at</span>
                              )}
                              <span className="text-lg font-black text-white">${plan.price}</span>
                              <span className="text-[10px] text-zinc-500">USD</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {plan.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-sm">
                              {plan.badge}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            isActive 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                          }`}>
                            {isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400 mt-2.5 line-clamp-2">
                        {plan.description || 'No description.'}
                      </p>

                      {/* Features preview */}
                      <div className="mt-3.5 space-y-1.5 border-t border-white/5 pt-3">
                        {plan.features?.slice(0, 4).map((f, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-[11px] text-zinc-300">
                            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                        {plan.features && plan.features.length > 4 && (
                          <p className="text-[10px] text-zinc-500 font-medium pl-5">
                            +{plan.features.length - 4} more features included
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3.5 mt-3.5 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Order #{plan.display_order ?? 1} • {plan.id}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditPlanModal(plan)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                          title="Edit Package"
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          onClick={() => {
                            setDeletingId(plan.id);
                            setDeletingType('plan');
                          }}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                          title="Delete Package"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Add-Ons View */}
      {subTab === 'addons' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-28 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : filteredAddOns.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/30 rounded-3xl border border-white/5">
              <Zap size={40} className="mx-auto text-zinc-600 mb-3" />
              <p className="text-sm font-bold text-zinc-300">No add-ons found</p>
              <p className="text-xs text-zinc-500 mt-1">Click "Add New Add-On" to register extra services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAddOns.map(addon => {
                const isActive = addon.is_active !== false;
                return (
                  <div
                    key={addon.id}
                    className={`bg-zinc-900/70 border rounded-2xl p-4 flex items-center justify-between gap-3 transition-all hover:border-orange-500/40 ${
                      isActive ? 'border-white/10' : 'border-rose-900/40 opacity-70 bg-zinc-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                        {addon.emoji || '⚡'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{addon.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-orange-400">
                            {addon.is_starting && <span className="text-[10px] text-zinc-400 font-normal">from </span>}
                            ${addon.price}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/5 text-zinc-400 border border-white/5">
                            {addon.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => openEditAddOnModal(addon)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                        title="Edit Add-On"
                      >
                        <Edit3 size={13} />
                      </button>

                      <button
                        onClick={() => {
                          setDeletingId(addon.id);
                          setDeletingType('addon');
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Delete Add-On"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Plan Add / Edit Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <CreditCard size={16} />
                </div>
                <h3 className="text-sm font-black text-white">
                  {editingPlan ? 'Edit Website Package' : 'Create New Website Package'}
                </h3>
              </div>
              <button
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-400 font-semibold mb-1">Package Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Portfolio Pro"
                    value={planForm.name}
                    onChange={e => setPlanForm({ ...planForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={planForm.emoji}
                    onChange={e => setPlanForm({ ...planForm, emoji: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white text-center text-lg focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Price (USD $) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={planForm.price}
                    onChange={e => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular"
                    value={planForm.badge}
                    onChange={e => setPlanForm({ ...planForm, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-zinc-400 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={planForm.display_order}
                    onChange={e => setPlanForm({ ...planForm, display_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Color Theme Accent</label>
                <select
                  value={planForm.color}
                  onChange={e => setPlanForm({ ...planForm, color: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                >
                  {COLOR_PRESETS.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <div className={`mt-2 h-2 rounded-full w-full bg-gradient-to-r ${planForm.color}`} />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Summary Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of this website package..."
                  value={planForm.description}
                  onChange={e => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              {/* Dynamic Features List */}
              <div>
                <label className="block text-zinc-400 font-semibold mb-1.5">Deliverables & Features</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add feature e.g. '5 Responsive Pages'..."
                    value={planForm.newFeatureInput}
                    onChange={e => setPlanForm({ ...planForm, newFeatureInput: e.target.value })}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500/60"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {planForm.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-white/5 text-zinc-300 text-xs">
                      <span className="flex items-center gap-2 truncate">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(fIdx)}
                        className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={planForm.is_starting}
                    onChange={e => setPlanForm({ ...planForm, is_starting: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>"Starting at" price</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={planForm.recommended}
                    onChange={e => setPlanForm({ ...planForm, recommended: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>Featured / Recommended</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={planForm.is_active}
                    onChange={e => setPlanForm({ ...planForm, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>Active on Live Site</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {actionLoading ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>{editingPlan ? 'Save Package' : 'Create Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add-On Add / Edit Modal */}
      {isAddOnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Zap size={16} />
                </div>
                <h3 className="text-sm font-black text-white">
                  {editingAddOn ? 'Edit Add-On Service' : 'Add New Add-On Service'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddOnModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveAddOn} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-400 font-semibold mb-1">Add-On Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Domain Setup"
                    value={addOnForm.name}
                    onChange={e => setAddOnForm({ ...addOnForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    value={addOnForm.emoji}
                    onChange={e => setAddOnForm({ ...addOnForm, emoji: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white text-center text-lg focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Price (USD $) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={addOnForm.price}
                    onChange={e => setAddOnForm({ ...addOnForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Domain, Hosting, SEO"
                    value={addOnForm.category}
                    onChange={e => setAddOnForm({ ...addOnForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Display Order</label>
                <input
                  type="number"
                  min="1"
                  value={addOnForm.display_order}
                  onChange={e => setAddOnForm({ ...addOnForm, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500/60"
                />
              </div>

              <div className="flex items-center gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={addOnForm.is_starting}
                    onChange={e => setAddOnForm({ ...addOnForm, is_starting: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>"Starting at" price</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={addOnForm.is_active}
                    onChange={e => setAddOnForm({ ...addOnForm, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 bg-zinc-950 border-white/20 focus:ring-0"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddOnModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {actionLoading ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>{editingAddOn ? 'Save Add-On' : 'Create Add-On'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/15 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                Delete {deletingType === 'plan' ? 'Package' : 'Add-On'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Are you sure you want to remove this {deletingType === 'plan' ? 'package' : 'add-on'}?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteItem}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {actionLoading ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
