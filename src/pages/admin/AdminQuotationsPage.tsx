/**
 * =====================================================================
 * ADMINISTRATOR QUOTATION MANAGEMENT - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Route: /admin/quotations
 * Allows certified administrators to review incoming project quotation
 * requests, inspect private documents, record private notes, change statuses,
 * contact clients directly, and export/print specifications.
 * =====================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Trash2,
  Download,
  Printer,
  ExternalLink,
  X,
  AlertCircle,
  Save,
  Building,
  MapPin,
  Coins,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  getAllQuotations,
  updateQuotation,
  deleteQuotation,
  getQuotationFileDownloadUrl,
} from '../../lib/quotationService';
import { QuotationRequest, QuotationStatus } from '../../types';
import { servicesData } from '../../data/servicesData';
import { FaWhatsapp } from 'react-icons/fa';
import { companyConfig } from '../../config/company';

const STATUS_BADGES: Record<QuotationStatus, { bg: string; text: string; border: string }> = {
  New: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  Reviewing: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  Contacted: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Quotation Prepared': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  Accepted: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Declined: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  Completed: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
};

const ALL_STATUSES: QuotationStatus[] = [
  'New',
  'Reviewing',
  'Contacted',
  'Quotation Prepared',
  'Accepted',
  'Declined',
  'Completed',
];

export const AdminQuotationsPage: React.FC = () => {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL'); // 'ALL' | 'TODAY' | 'WEEK' | 'MONTH'

  // Selected Quotation Modal
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [fileDownloadUrls, setFileDownloadUrls] = useState<Record<string, string>>({});

  // Delete Dialog
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch quotations on mount
  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    setLoading(true);
    try {
      const data = await getAllQuotations();
      setQuotations(data);
    } catch (err) {
      console.error('Error fetching quotations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and initialize notes & file download links
  const handleOpenDetail = async (q: QuotationRequest) => {
    setSelectedQuotation(q);
    setEditingNotes(q.adminNotes || '');

    // Resolve file download URLs
    if (q.files && q.files.length > 0) {
      const urls: Record<string, string> = {};
      for (const f of q.files) {
        const link = await getQuotationFileDownloadUrl(f);
        urls[f.name] = link;
      }
      setFileDownloadUrls(urls);
    } else {
      setFileDownloadUrls({});
    }
  };

  // Status update
  const handleStatusChange = async (id: string, newStatus: QuotationStatus) => {
    await updateQuotation(id, { status: newStatus });
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
    if (selectedQuotation && selectedQuotation.id === id) {
      setSelectedQuotation((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Save notes
  const handleSaveNotes = async () => {
    if (!selectedQuotation) return;
    setIsSavingNotes(true);
    await updateQuotation(selectedQuotation.id, { adminNotes: editingNotes });
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === selectedQuotation.id ? { ...q, adminNotes: editingNotes } : q
      )
    );
    setSelectedQuotation((prev) => (prev ? { ...prev, adminNotes: editingNotes } : null));
    setIsSavingNotes(false);
  };

  // Delete quotation
  const handleDelete = async (id: string) => {
    await deleteQuotation(id);
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    setDeleteConfirmId(null);
    if (selectedQuotation?.id === id) {
      setSelectedQuotation(null);
    }
  };

  // Filtered list computation
  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      // Search
      const term = searchQuery.toLowerCase();
      const matchesSearch =
        !term ||
        q.referenceNumber.toLowerCase().includes(term) ||
        q.fullName.toLowerCase().includes(term) ||
        q.email.toLowerCase().includes(term) ||
        (q.company && q.company.toLowerCase().includes(term)) ||
        q.projectTitle.toLowerCase().includes(term);

      // Status
      const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;

      // Service
      const matchesService =
        serviceFilter === 'ALL' ||
        q.services.some((s) => s.toLowerCase().includes(serviceFilter.toLowerCase()));

      // Date
      let matchesDate = true;
      if (dateFilter !== 'ALL') {
        const created = new Date(q.createdAt);
        const now = new Date();
        if (dateFilter === 'TODAY') {
          matchesDate = created.toDateString() === now.toDateString();
        } else if (dateFilter === 'WEEK') {
          const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
          matchesDate = diffDays <= 7;
        } else if (dateFilter === 'MONTH') {
          const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
          matchesDate = diffDays <= 30;
        }
      }

      return matchesSearch && matchesStatus && matchesService && matchesDate;
    });
  }, [quotations, searchQuery, statusFilter, serviceFilter, dateFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
            Commercial Pipeline
          </span>
          <h1 className="text-2xl font-bold text-white">Smart Quotation Requests</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage incoming scopes, inspect private client attachments, prepare itemized estimates, and track client communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadQuotations}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Requests</span>
          <span className="text-xl font-bold text-white">{quotations.length}</span>
        </div>
        <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">New / Unread</span>
          <span className="text-xl font-bold text-sky-400">
            {quotations.filter((q) => q.status === 'New').length}
          </span>
        </div>
        <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Quotations Prepared</span>
          <span className="text-xl font-bold text-purple-400">
            {quotations.filter((q) => q.status === 'Quotation Prepared').length}
          </span>
        </div>
        <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Accepted / Won</span>
          <span className="text-xl font-bold text-emerald-400">
            {quotations.filter((q) => q.status === 'Accepted').length}
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-slate-900/70 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, reference (KJT-Q-XXXX), email or project..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#00D4FF] cursor-pointer"
          >
            <option value="ALL">All Statuses ({quotations.length})</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st} ({quotations.filter((q) => q.status === st).length})
              </option>
            ))}
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#00D4FF] cursor-pointer max-w-[180px] truncate"
          >
            <option value="ALL">All Services</option>
            {servicesData.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#00D4FF] cursor-pointer"
          >
            <option value="ALL">All Time</option>
            <option value="TODAY">Submitted Today</option>
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Quotations Table */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading quotation requests...</p>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-300">No quotation requests found</p>
            <p className="text-slate-500">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try resetting the search filters'
                : 'Incoming client quotation requests will appear here in real time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Ref &amp; Date</th>
                  <th className="py-3 px-4">Client &amp; Company</th>
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-4">Budget (UGX)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredQuotations.map((q) => {
                  const badge = STATUS_BADGES[q.status] || STATUS_BADGES.New;
                  const dateFormatted = new Date(q.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(q)}
                    >
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-[#00D4FF] block">{q.referenceNumber}</span>
                        <span className="text-[10px] text-slate-500">{dateFormatted}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{q.fullName}</span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                          {q.company || 'Individual Client'} &bull; {q.location}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-medium text-slate-200 block truncate">{q.projectTitle}</span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {q.services.slice(0, 2).join(', ')}
                          {q.services.length > 2 && ` +${q.services.length - 2} more`}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-medium text-[#00D4FF] whitespace-nowrap">
                        {q.budgetRange}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={q.status}
                          onChange={(e) => handleStatusChange(q.id, e.target.value as QuotationStatus)}
                          className={`px-2.5 py-1 rounded-md border text-[11px] font-semibold focus:outline-none cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-slate-900 text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(q)}
                            className="p-1.5 text-slate-400 hover:text-[#00D4FF] hover:bg-slate-800 rounded-lg transition"
                            title="View Complete Specifications"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <a
                            href={`mailto:${q.email}?subject=KJT%20TECHNOLOGIES%20Quotation%20[${q.referenceNumber}]`}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>

                          <a
                            href={`https://wa.me/${q.whatsapp?.replace(/[^0-9]/g, '') || q.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${q.fullName}, this is KJT TECHNOLOGIES regarding your quotation request ${q.referenceNumber} for "${q.projectTitle}".`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-[#25D366] hover:bg-slate-800 rounded-lg transition"
                            title="WhatsApp Chat"
                            aria-label={`Chat with ${q.fullName} on WhatsApp`}
                          >
                            <FaWhatsapp size={16} />
                          </a>

                          <button
                            onClick={() => setDeleteConfirmId(q.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* DETAILED SPECIFICATION MODAL */}
      {/* ===================================================================== */}
      {selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-lg text-[#00D4FF]">
                  {selectedQuotation.referenceNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                    STATUS_BADGES[selectedQuotation.status]?.bg
                  } ${STATUS_BADGES[selectedQuotation.status]?.text} ${
                    STATUS_BADGES[selectedQuotation.status]?.border
                  }`}
                >
                  {selectedQuotation.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Print button */}
                <button
                  onClick={() => window.print()}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Print Quotation Record"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedQuotation(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-slate-300">
              {/* Client & Contact Card */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF]">
                    Client Information
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Preferred Contact: <strong className="text-white uppercase">{selectedQuotation.preferredContactMethod}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Full Name</span>
                    <span className="font-semibold text-white">{selectedQuotation.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Company</span>
                    <span className="font-semibold text-white">{selectedQuotation.company || 'Individual Client'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Location</span>
                    <span className="font-semibold text-white">{selectedQuotation.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email Address</span>
                    <a href={`mailto:${selectedQuotation.email}`} className="text-[#00D4FF] underline">
                      {selectedQuotation.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Telephone</span>
                    <a href={`tel:${selectedQuotation.phone}`} className="text-slate-200">
                      {selectedQuotation.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">WhatsApp</span>
                    <a
                      href={`https://wa.me/${selectedQuotation.whatsapp?.replace(/[^0-9]/g, '') || selectedQuotation.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] font-semibold"
                    >
                      {selectedQuotation.whatsapp || selectedQuotation.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Project Scope & Goals */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] block">
                  Project Scope &amp; Specifications
                </span>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Project Title</span>
                    <h4 className="text-sm font-bold text-white">{selectedQuotation.projectTitle}</h4>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px]">Overview</span>
                    <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{selectedQuotation.description}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Primary Goals</span>
                      <p className="text-slate-300">{selectedQuotation.mainGoals}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Target Users</span>
                      <p className="text-slate-300">{selectedQuotation.targetUsers}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-500 block text-[10px]">Required Features &amp; Deliverables</span>
                    <p className="text-slate-300 whitespace-pre-wrap">{selectedQuotation.requiredFeatures}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Project Nature</span>
                      <span className="text-slate-200 font-medium">
                        {selectedQuotation.projectType === 'new' ? 'Brand New Project' : 'Improvement / Upgrade'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Existing URL</span>
                      {selectedQuotation.existingUrl ? (
                        <a href={selectedQuotation.existingUrl} target="_blank" rel="noreferrer" className="text-[#00D4FF] underline truncate block">
                          {selectedQuotation.existingUrl}
                        </a>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Preferred Technology</span>
                      <span className="text-slate-200">{selectedQuotation.preferredTechnology || 'Open to recommendations'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Services */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] block">
                  Required Services ({selectedQuotation.services.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuotation.services.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md text-xs text-slate-200">
                      {s}
                    </span>
                  ))}
                  {selectedQuotation.otherServiceDescription && (
                    <div className="w-full mt-2 p-2.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg text-xs text-[#00D4FF]">
                      <strong>Custom Request:</strong> {selectedQuotation.otherServiceDescription}
                    </div>
                  )}
                </div>
              </div>

              {/* Budget & Timeline */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] block">
                  Commercials &amp; Milestones
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Budget (UGX)</span>
                    <span className="font-bold text-[#00D4FF]">{selectedQuotation.budgetRange}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Timeline</span>
                    <span className="font-medium text-white">{selectedQuotation.timeline}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Target Deadline</span>
                    <span className="text-white">
                      {selectedQuotation.deadline || 'Flexible'}{' '}
                      {selectedQuotation.isDeadlineFlexible ? '(Flexible)' : '(Strict)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Preferred Start</span>
                    <span className="text-white">{selectedQuotation.preferredStartDate || 'Immediate'}</span>
                  </div>
                </div>

                {selectedQuotation.additionalComments && (
                  <div className="pt-2">
                    <span className="text-slate-500 block text-[10px]">Client Additional Comments</span>
                    <p className="text-slate-300 italic">{selectedQuotation.additionalComments}</p>
                  </div>
                )}
              </div>

              {/* Attached Files & Secure Download */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] block">
                  Uploaded Documents &amp; Images ({selectedQuotation.files?.length || 0})
                </span>

                {!selectedQuotation.files || selectedQuotation.files.length === 0 ? (
                  <p className="text-slate-500 text-xs">No files attached by client.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedQuotation.files.map((file, idx) => {
                      const downloadUrl = fileDownloadUrls[file.name] || file.url || '#';

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileText className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
                            <div className="truncate">
                              <span className="font-medium text-white truncate block">{file.name}</span>
                              <span className="text-[10px] text-slate-500 block">
                                {(file.size / 1024).toFixed(0)} KB &bull; {file.type || 'Document'}
                              </span>
                            </div>
                          </div>

                          <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={file.name}
                            className="px-2.5 py-1 bg-[#00D4FF]/20 hover:bg-[#00D4FF] hover:text-[#0A192F] text-[#00D4FF] rounded text-[11px] font-bold flex items-center gap-1 transition flex-shrink-0"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Administrator Notes */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Private Administrator Notes
                  </span>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500 hover:text-black text-amber-300 rounded text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record internal engineering deliberations, estimated hours, assigned lead engineer, follow-up call notes..."
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={selectedQuotation.status}
                  onChange={(e) => handleStatusChange(selectedQuotation.id, e.target.value as QuotationStatus)}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#00D4FF] cursor-pointer"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedQuotation.email}?subject=KJT%20TECHNOLOGIES%20Quotation%20[${selectedQuotation.referenceNumber}]`}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Client</span>
                </a>

                <a
                  href={`https://wa.me/${selectedQuotation.whatsapp?.replace(/[^0-9]/g, '') || selectedQuotation.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedQuotation.fullName}, this is KJT TECHNOLOGIES regarding your quotation request ${selectedQuotation.referenceNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  aria-label={`Message ${selectedQuotation.fullName} on WhatsApp`}
                >
                  <FaWhatsapp size={14} />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => setSelectedQuotation(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Delete Quotation Request?</h3>
              <p className="text-xs text-slate-400">
                This will permanently delete this client quotation record and all associated admin notes. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white rounded-xl transition cursor-pointer shadow-lg shadow-rose-600/20"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
