import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Plus,
  Download,
  Copy,
  Check,
  X,
  FileText,
  User,
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import {
  ClientInquiry,
  fetchInquiriesFromDB,
  submitInquiryToDB,
  updateInquiryInDB,
  deleteInquiryFromDB,
  seedDefaultInquiriesToDB
} from '../lib/inquiriesService';

interface AdminInquiriesManagerProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

export default function AdminInquiriesManager({ onNotify }: AdminInquiriesManagerProps) {
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFromDB, setIsFromDB] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClientInquiry['status']>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Detail Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<ClientInquiry | null>(null);

  // Manual Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newInquiry, setNewInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: 'Full-Stack Web App',
    budget: '$300 - $500',
    timeline: '1-2 weeks',
    subject: '',
    message: '',
    priority: 'high' as ClientInquiry['priority']
  });

  // Admin notes inline editing
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchInquiriesFromDB();
      setInquiries(res.inquiries);
      setIsFromDB(res.fromDatabase);
      if (res.error) {
        onNotify(`Notice: ${res.error}. Local cache is active.`, 'error');
      }
    } catch {
      onNotify('Failed to load client queries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setInquiries(e.detail);
      }
    };
    window.addEventListener('inquiries-updated', handleUpdate);
    return () => window.removeEventListener('inquiries-updated', handleUpdate);
  }, []);

  const handleStatusChange = async (id: string, newStatus: ClientInquiry['status']) => {
    const res = await updateInquiryInDB(id, { status: newStatus });
    if (res.success) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
      }
      onNotify(`Status updated to ${newStatus.toUpperCase()}`, 'success');
    } else {
      onNotify('Failed to update status', 'error');
    }
  };

  const handlePriorityChange = async (id: string, newPriority: ClientInquiry['priority']) => {
    const res = await updateInquiryInDB(id, { priority: newPriority });
    if (res.success) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, priority: newPriority } : i));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, priority: newPriority } : null);
      }
      onNotify(`Priority set to ${newPriority.toUpperCase()}`, 'success');
    } else {
      onNotify('Failed to update priority', 'error');
    }
  };

  const handleSaveNotes = async (id: string) => {
    const res = await updateInquiryInDB(id, { admin_notes: tempNotes });
    if (res.success) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, admin_notes: tempNotes } : i));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, admin_notes: tempNotes } : null);
      }
      setEditingNotesId(null);
      onNotify('Private admin note saved', 'success');
    } else {
      onNotify('Failed to save note', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client query?')) return;
    const res = await deleteInquiryFromDB(id);
    if (res.success) {
      setInquiries(prev => prev.filter(i => i.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      onNotify('Query removed successfully', 'success');
    } else {
      onNotify('Failed to delete query', 'error');
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Sync sample client inquiries to view the system layout?')) return;
    setLoading(true);
    const res = await seedDefaultInquiriesToDB();
    if (res.error) {
      onNotify(`Notice: ${res.error}`, 'error');
    } else {
      onNotify(`Added ${res.count} demo inquiries!`, 'success');
      loadData();
    }
  };

  const handleAddManualInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInquiry.name.trim() || !newInquiry.message.trim()) {
      onNotify('Name and Message are required', 'error');
      return;
    }

    const res = await submitInquiryToDB({
      name: newInquiry.name.trim(),
      email: newInquiry.email.trim() || 'direct@client.com',
      phone: newInquiry.phone.trim(),
      service_type: newInquiry.service_type,
      budget: newInquiry.budget,
      timeline: newInquiry.timeline,
      subject: newInquiry.subject.trim() || `Client Project: ${newInquiry.service_type}`,
      message: newInquiry.message.trim(),
      priority: newInquiry.priority
    });

    if (res.success) {
      onNotify('New inquiry logged successfully!', 'success');
      setIsAddModalOpen(false);
      setNewInquiry({
        name: '',
        email: '',
        phone: '',
        service_type: 'Full-Stack Web App',
        budget: '$300 - $500',
        timeline: '1-2 weeks',
        subject: '',
        message: '',
        priority: 'high'
      });
      loadData();
    } else {
      onNotify('Failed to save inquiry', 'error');
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(label);
    setTimeout(() => setCopiedId(null), 2000);
    onNotify(`Copied ${label} to clipboard`, 'success');
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) {
      onNotify('No inquiries to export', 'error');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Service', 'Budget', 'Timeline', 'Status', 'Priority', 'Date', 'Message', 'Notes'];
    const rows = inquiries.map(i => [
      `"${i.id}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.phone || ''}"`,
      `"${i.service_type}"`,
      `"${i.budget}"`,
      `"${i.timeline}"`,
      `"${i.status}"`,
      `"${i.priority}"`,
      `"${new Date(i.created_at).toISOString()}"`,
      `"${i.message.replace(/"/g, '""')}"`,
      `"${(i.admin_notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `saqib_client_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('Exported inquiries CSV successfully', 'success');
  };

  // Filtered queries
  const filtered = inquiries.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.budget && item.budget.toLowerCase().includes(q)) ||
      item.service_type.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Counts
  const newCount = inquiries.filter(i => i.status === 'new').length;
  const contactedCount = inquiries.filter(i => i.status === 'contacted').length;
  const inProgressCount = inquiries.filter(i => i.status === 'in_progress').length;
  const completedCount = inquiries.filter(i => i.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* TOP KPI COUNTERS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Leads */}
        <div className="bg-[#121319] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Total Leads</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-0.5">{inquiries.length}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Inbox size={22} />
          </div>
        </div>

        {/* New Unread */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'new' ? 'all' : 'new')}
          className={`bg-[#121319] border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
            statusFilter === 'new' ? 'border-emerald-500 bg-emerald-950/20' : 'border-emerald-500/20 hover:border-emerald-500/40'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>New Queries</span>
              {newCount > 0 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">{newCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles size={22} />
          </div>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
          className={`bg-[#121319] border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
            statusFilter === 'in_progress' ? 'border-amber-500 bg-amber-950/20' : 'border-amber-500/20 hover:border-amber-500/40'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">In Discussion</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5">{inProgressCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Clock size={22} />
          </div>
        </div>

        {/* Completed */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          className={`bg-[#121319] border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
            statusFilter === 'completed' ? 'border-purple-500 bg-purple-950/20' : 'border-purple-500/20 hover:border-purple-500/40'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400">Closed &amp; Done</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-0.5">{completedCount}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#121319] border border-white/10 rounded-2xl p-4 space-y-3">
        {/* Status Pipeline Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-black shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Leads ({inquiries.length})
          </button>

          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'new'
                ? 'bg-emerald-500 text-black font-black'
                : 'text-emerald-400/90 hover:bg-emerald-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>New ({newCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'contacted'
                ? 'bg-blue-500 text-white font-black'
                : 'text-blue-400/90 hover:bg-blue-500/10'
            }`}
          >
            Contacted ({contactedCount})
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'bg-amber-500 text-black font-black'
                : 'text-amber-400/90 hover:bg-amber-500/10'
            }`}
          >
            In Progress ({inProgressCount})
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-purple-500 text-white font-black'
                : 'text-purple-400/90 hover:bg-purple-500/10'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, phone, requirements, or budget..."
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh Leads"
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              onClick={handleExportCSV}
              title="Download CSV"
              className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} />
              <span>Record Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* LEADS LIST / CARDS */}
      {filtered.length === 0 ? (
        <div className="bg-[#121319] border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-zinc-500">
            <Inbox size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Client Queries Found</h3>
            <p className="text-zinc-400 text-xs max-w-md mx-auto mt-1">
              {searchQuery || statusFilter !== 'all'
                ? 'No client queries match your current search or filter criteria.'
                : 'You have not received any client inquiries yet. Visitors who submit project details on the Contact page will appear here.'}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20 cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={handleSeedDefaults}
              className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-bold hover:bg-orange-500/30 cursor-pointer"
            >
              Seed Demo Leads
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filtered.map(item => {
            const isUnread = item.status === 'new';
            const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');

            // Client initials for avatar
            const initials = item.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || 'CL';

            const whatsappMessage = encodeURIComponent(
              `Hi ${item.name}! Muhammad Saqib here regarding your inquiry for "${item.service_type}" on my website. I reviewed your requirements and would love to share a proposal and discuss timeline. Are you free to chat?`
            );

            return (
              <div
                key={item.id}
                className={`bg-[#121319] border transition-all rounded-2xl p-4 sm:p-5 relative ${
                  isUnread
                    ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/15 via-[#121319] to-[#121319] shadow-md shadow-emerald-500/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Avatar + Client Information */}
                  <div className="flex items-start gap-3.5 flex-1">
                    {/* Visual Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-black font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {initials}
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Name & Quick Status */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-base sm:text-lg text-white">
                          {item.name}
                        </span>

                        {/* Status Dropdown */}
                        <select
                          value={item.status}
                          onChange={e => handleStatusChange(item.id, e.target.value as any)}
                          className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer ${
                            item.status === 'new'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                              : item.status === 'in_progress'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : item.status === 'contacted'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                              : item.status === 'completed'
                              ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          <option value="new">🟢 New Query</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="in_progress">🟡 In Discussion</option>
                          <option value="completed">🟣 Completed</option>
                          <option value="archived">⚪ Archived</option>
                        </select>

                        {/* Service Badge */}
                        <span className="text-[11px] font-semibold text-zinc-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                          {item.service_type}
                        </span>

                        {/* Budget Tag */}
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                          {item.budget}
                        </span>

                        {/* Timeline Tag */}
                        <span className="text-[11px] font-medium text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                          {item.timeline}
                        </span>
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        {item.phone && (
                          <span className="flex items-center gap-1 text-zinc-300 font-mono">
                            <Phone size={12} className="text-emerald-400" />
                            <span>{item.phone}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-zinc-300">
                          <Mail size={12} className="text-blue-400" />
                          <span>{item.email}</span>
                        </span>

                        <span className="text-[11px] text-zinc-500">
                          {new Date(item.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Message Preview */}
                      <div className="text-xs sm:text-sm text-zinc-300 line-clamp-2 pt-0.5 leading-relaxed">
                        {item.message}
                      </div>

                      {/* Private Admin Notes Display */}
                      {item.admin_notes && editingNotesId !== item.id && (
                        <div className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300/90 px-3 py-1 rounded-xl inline-block mt-1">
                          <strong>Note:</strong> {item.admin_notes}
                        </div>
                      )}

                      {/* Inline Note Editor */}
                      {editingNotesId === item.id && (
                        <div className="flex items-center gap-2 pt-1.5">
                          <input
                            type="text"
                            value={tempNotes}
                            onChange={e => setTempNotes(e.target.value)}
                            placeholder="Add private note for this lead..."
                            className="flex-1 px-3 py-1.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => handleSaveNotes(item.id)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1.5 bg-white/10 text-zinc-400 hover:text-white text-xs rounded-xl cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    {/* WhatsApp Reply Button */}
                    {item.phone ? (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="1-Click WhatsApp Reply"
                        className="px-3 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <SiWhatsapp size={14} />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-zinc-600 px-2">No Phone</span>
                    )}

                    {/* Email Reply Button */}
                    <a
                      href={`mailto:${item.email}?subject=Project Query: ${encodeURIComponent(item.service_type)}&body=Hi ${encodeURIComponent(item.name)},\n\nThank you for reaching out regarding your project query on my website!`}
                      title="Send Email"
                      className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Mail size={14} />
                      <span className="hidden sm:inline">Email</span>
                    </a>

                    {/* Edit Note */}
                    <button
                      onClick={() => {
                        setEditingNotesId(item.id);
                        setTempNotes(item.admin_notes || '');
                      }}
                      title="Add Note"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      <FileText size={15} />
                    </button>

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedInquiry(item)}
                      title="View Full Details"
                      className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 transition-all cursor-pointer"
                    >
                      <Eye size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete Lead"
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL CLIENT DETAILS MODAL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121319] border border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedInquiry(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-black font-black text-lg flex items-center justify-center shadow-lg">
                {selectedInquiry.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{selectedInquiry.name}</h2>
                  <span className="text-[10px] font-mono text-zinc-500">ID: {selectedInquiry.id}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Submitted {new Date(selectedInquiry.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Contact & Deal Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">WhatsApp / Phone</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-sm">
                    {selectedInquiry.phone || 'Not provided'}
                  </span>
                  {selectedInquiry.phone && (
                    <button
                      onClick={() => handleCopyText(selectedInquiry.phone || '', 'Phone')}
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      {copiedId === 'Phone' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Email Address</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm truncate">
                    {selectedInquiry.email}
                  </span>
                  <button
                    onClick={() => handleCopyText(selectedInquiry.email, 'Email')}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    {copiedId === 'Email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Service Requested</span>
                <span className="font-bold text-orange-400 text-sm">{selectedInquiry.service_type}</span>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Estimated Budget</span>
                <span className="font-bold text-emerald-400 text-sm">{selectedInquiry.budget}</span>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Desired Timeline</span>
                <span className="font-bold text-amber-400 text-sm">{selectedInquiry.timeline}</span>
              </div>

              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Status</span>
                <select
                  value={selectedInquiry.status}
                  onChange={e => handleStatusChange(selectedInquiry.id, e.target.value as any)}
                  className="px-2.5 py-1 bg-black/80 border border-white/20 rounded-lg text-xs font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="new">🟢 New</option>
                  <option value="contacted">🔵 Contacted</option>
                  <option value="in_progress">🟡 In Discussion</option>
                  <option value="completed">🟣 Completed</option>
                  <option value="archived">⚪ Archived</option>
                </select>
              </div>
            </div>

            {/* Full Requirements */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Project Requirements &amp; Brief
                </h4>
                <button
                  onClick={() => handleCopyText(selectedInquiry.message, 'Brief')}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'Brief' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>Copy Text</span>
                </button>
              </div>
              <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap select-all">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Internal Admin Note */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Private Admin Notes (Internal Only)
              </h4>
              <textarea
                value={selectedInquiry.admin_notes || ''}
                onChange={e =>
                  setSelectedInquiry({ ...selectedInquiry, admin_notes: e.target.value })
                }
                onBlur={() => handleSaveNotes(selectedInquiry.id)}
                placeholder="Write private notes about agreed price, call notes, next steps..."
                rows={3}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <span className="text-[10px] text-zinc-500">Auto-saves when you click outside or close.</span>
            </div>

            {/* Fast Reply Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex gap-2">
                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hi ${selectedInquiry.name}! Muhammad Saqib here regarding your project inquiry for ${selectedInquiry.service_type}. Let's discuss!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <SiWhatsapp size={16} />
                    <span>WhatsApp Client</span>
                  </a>
                )}
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Project Discussion: ${encodeURIComponent(selectedInquiry.service_type)}`}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Mail size={16} />
                  <span>Send Email</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD NEW LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121319] border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>

            <div>
              <h2 className="text-xl font-black text-white">Record New Client Query</h2>
              <p className="text-zinc-400 text-xs mt-0.5">
                Log a lead received directly via phone call, WhatsApp, or referral.
              </p>
            </div>

            <form onSubmit={handleAddManualInquiry} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={newInquiry.name}
                  onChange={e => setNewInquiry({ ...newInquiry, name: e.target.value })}
                  placeholder="e.g. Asad Qureshi"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newInquiry.email}
                    onChange={e => setNewInquiry({ ...newInquiry, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    value={newInquiry.phone}
                    onChange={e => setNewInquiry({ ...newInquiry, phone: e.target.value })}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Service Required
                  </label>
                  <select
                    value={newInquiry.service_type}
                    onChange={e => setNewInquiry({ ...newInquiry, service_type: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Full-Stack Web App">Full-Stack Web App</option>
                    <option value="E-Commerce Marketplace">E-Commerce Marketplace</option>
                    <option value="Mobile App (React Native)">Mobile App (React Native)</option>
                    <option value="AI Solution & Gemini API">AI Solution &amp; Gemini API</option>
                    <option value="Portfolio / Landing Page">Portfolio / Landing Page</option>
                    <option value="Restaurant QR & Orders">Restaurant QR &amp; Orders</option>
                    <option value="Custom Tool / API">Custom Tool / API</option>
                    <option value="UI/UX & Branding">UI/UX &amp; Branding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                    Budget Range
                  </label>
                  <select
                    value={newInquiry.budget}
                    onChange={e => setNewInquiry({ ...newInquiry, budget: e.target.value })}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="$100 - $300">$100 - $300</option>
                    <option value="$300 - $500">$300 - $500</option>
                    <option value="$500 - $1000">$500 - $1000</option>
                    <option value="$1000+">$1000+</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                  Project Brief &amp; Requirements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newInquiry.message}
                  onChange={e => setNewInquiry({ ...newInquiry, message: e.target.value })}
                  placeholder="Describe the client requirements, notes, scope..."
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
