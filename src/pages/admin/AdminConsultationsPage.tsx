/**
 * =====================================================================
 * ADMINISTRATOR CONSULTATION MANAGEMENT - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Route: /admin/consultations
 * Complete control center for client consultations:
 * - Upcoming & Past booking views (List and Calendar format)
 * - Confirmation, Rescheduling (with schedule history audit), and Cancellation
 * - Availability configuration (working hours, weekdays, breaks, slot duration)
 * - Blocked dates / holiday management
 * - Direct client contact via Email, Phone, and WhatsApp
 * =====================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  PhoneCall,
  MessageSquare,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  Plus,
  Trash2,
  Settings,
  User,
  Building,
  Mail,
  Phone,
  Save,
  X,
  Eye,
  CalendarCheck,
} from 'lucide-react';
import {
  getAllBookings,
  updateBookingStatus,
  rescheduleBooking,
  getAvailabilityConfig,
  saveAvailabilityConfig,
  getBlockedDates,
  addBlockedDate,
  removeBlockedDate,
  getAvailableTimeSlotsForDate,
  GeneratedTimeSlot,
} from '../../lib/consultationService';
import {
  ConsultationBooking,
  ConsultationStatus,
  ConsultationAvailabilityConfig,
  BlockedDateItem,
} from '../../types';
import { FaWhatsapp } from 'react-icons/fa';

const STATUS_BADGES: Record<ConsultationStatus, { bg: string; text: string; border: string }> = {
  Pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  Confirmed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Rescheduled: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  Completed: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  Cancelled: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  'No Show': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
};

const ALL_STATUSES: ConsultationStatus[] = [
  'Pending',
  'Confirmed',
  'Rescheduled',
  'Completed',
  'Cancelled',
  'No Show',
];

export const AdminConsultationsPage: React.FC = () => {
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab: 'upcoming' | 'past' | 'settings'
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'settings'>('upcoming');

  // View mode: 'list' | 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Booking Modal
  const [selectedBooking, setSelectedBooking] = useState<ConsultationBooking | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Reschedule Modal
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlots, setRescheduleSlots] = useState<GeneratedTimeSlot[]>([]);
  const [selectedRescheduleSlot, setSelectedRescheduleSlot] = useState<GeneratedTimeSlot | null>(null);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);

  // Availability & Blocked Dates State
  const [availabilityConfig, setAvailabilityConfig] = useState<ConsultationAvailabilityConfig>(
    getAvailabilityConfig()
  );
  const [blockedDates, setBlockedDates] = useState<BlockedDateItem[]>(getBlockedDates());
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllBookings();
      setBookings(data);
      setAvailabilityConfig(getAvailabilityConfig());
      setBlockedDates(getBlockedDates());
    } catch (e) {
      console.error('Error fetching consultation data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (b: ConsultationBooking) => {
    setSelectedBooking(b);
    setEditingNotes(b.adminNotes || '');
    setIsRescheduling(false);
    setRescheduleError(null);
  };

  const handleStatusChange = async (id: string, status: ConsultationStatus) => {
    await updateBookingStatus(id, status);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedBooking) return;
    setIsSavingNotes(true);
    await updateBookingStatus(selectedBooking.id, selectedBooking.status, editingNotes);
    setBookings((prev) =>
      prev.map((b) => (b.id === selectedBooking.id ? { ...b, adminNotes: editingNotes } : b))
    );
    setSelectedBooking((prev) => (prev ? { ...prev, adminNotes: editingNotes } : null));
    setIsSavingNotes(false);
  };

  // Reschedule slot calculation
  useEffect(() => {
    if (!rescheduleDate) return;
    let isCancelled = false;

    async function fetchSlots() {
      const res = await getAvailableTimeSlotsForDate(rescheduleDate, bookings);
      if (!isCancelled) {
        setRescheduleSlots(res.slots);
        setSelectedRescheduleSlot(null);
      }
    }

    fetchSlots();

    return () => {
      isCancelled = true;
    };
  }, [rescheduleDate, bookings]);

  const handleConfirmReschedule = async () => {
    if (!selectedBooking || !rescheduleDate || !selectedRescheduleSlot) return;
    setIsSubmittingReschedule(true);
    setRescheduleError(null);

    const res = await rescheduleBooking(
      selectedBooking.id,
      rescheduleDate,
      selectedRescheduleSlot.startTime,
      selectedRescheduleSlot.endTime,
      editingNotes
    );

    if (res.success) {
      await loadData();
      setIsRescheduling(false);
      setSelectedBooking(null);
    } else {
      setRescheduleError(res.error || 'Failed to reschedule. Please select another slot.');
    }
    setIsSubmittingReschedule(false);
  };

  // Add Blocked Date
  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;
    const added = await addBlockedDate(newBlockedDate, newBlockedReason);
    setBlockedDates(getBlockedDates());
    setNewBlockedDate('');
    setNewBlockedReason('');
  };

  // Remove Blocked Date
  const handleRemoveBlockedDate = async (id: string) => {
    await removeBlockedDate(id);
    setBlockedDates(getBlockedDates());
  };

  // Save Config
  const handleSaveAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveAvailabilityConfig(availabilityConfig);
    setConfigSavedNotice(true);
    setTimeout(() => setConfigSavedNotice(false), 3000);
  };

  // Filter Bookings by Upcoming vs Past
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === 'upcoming' && b.date < todayStr) return false;
      if (activeTab === 'past' && b.date >= todayStr) return false;

      // Status filter
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;

      // Search
      const term = searchQuery.toLowerCase();
      if (term) {
        const matches =
          b.bookingReference.toLowerCase().includes(term) ||
          b.fullName.toLowerCase().includes(term) ||
          b.email.toLowerCase().includes(term) ||
          (b.organization && b.organization.toLowerCase().includes(term)) ||
          b.topic.toLowerCase().includes(term);
        if (!matches) return false;
      }

      return true;
    });
  }, [bookings, activeTab, statusFilter, searchQuery, todayStr]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
            Consultation Desk
          </span>
          <h1 className="text-2xl font-bold text-white">Engineering Consultations</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage live technical sessions, confirm reservations, reschedule appointments, and tune availability constraints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Format toggle */}
          {activeTab !== 'settings' && (
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#00D4FF] text-[#0A192F]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-[#00D4FF] text-[#0A192F]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Calendar View
              </button>
            </div>
          )}

          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'upcoming'
              ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Upcoming Sessions ({bookings.filter((b) => b.date >= todayStr).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer ${
            activeTab === 'past'
              ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Past Sessions ({bookings.filter((b) => b.date < todayStr).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Availability &amp; Blackouts</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB: UPCOMING & PAST CONSULTATIONS */}
      {/* ===================================================================== */}
      {activeTab !== 'settings' && (
        <div className="space-y-4">
          {/* Search & Status Bar */}
          <div className="p-3.5 bg-slate-900/70 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client, reference (KJT-C-XXXX), email or topic..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00D4FF]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#00D4FF] cursor-pointer"
            >
              <option value="ALL">All Statuses ({bookings.length})</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st} ({bookings.filter((b) => b.status === st).length})
                </option>
              ))}
            </select>
          </div>

          {/* List or Calendar View */}
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Loading consultation sessions...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 bg-slate-900/40 rounded-xl border border-slate-800 text-center text-xs text-slate-400 space-y-2">
              <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300">No consultations found in this category</p>
              <p className="text-slate-500">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try modifying the active filters.'
                  : 'New client bookings will populate here automatically.'}
              </p>
            </div>
          ) : viewMode === 'list' ? (
            /* LIST VIEW TABLE */
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Ref &amp; Method</th>
                      <th className="py-3 px-4">Date &amp; Time (EAT)</th>
                      <th className="py-3 px-4">Client &amp; Org</th>
                      <th className="py-3 px-4">Topic &amp; Service</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredBookings.map((b) => {
                      const badge = STATUS_BADGES[b.status] || STATUS_BADGES.Pending;

                      return (
                        <tr
                          key={b.id}
                          onClick={() => handleOpenDetail(b)}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-4 font-mono">
                            <span className="font-bold text-[#00D4FF] block">{b.bookingReference}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              {b.meetingMethod}
                            </span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-bold text-white block">{b.date}</span>
                            <span className="text-[11px] text-[#00D4FF] block">
                              {b.startTime} – {b.endTime}
                            </span>
                            {b.rescheduledFrom && (
                              <span className="text-[10px] text-purple-400 block mt-0.5">
                                Rescheduled from {b.rescheduledFrom.date}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-white block">{b.fullName}</span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                              {b.organization || 'Individual'} &bull; {b.phone}
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            <span className="font-medium text-slate-200 block truncate">{b.topic}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{b.service}</span>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as ConsultationStatus)}
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
                                onClick={() => handleOpenDetail(b)}
                                className="p-1.5 text-slate-400 hover:text-[#00D4FF] hover:bg-slate-800 rounded-lg transition"
                                title="Open Details & Actions"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <a
                                href={`mailto:${b.email}?subject=KJT%20TECHNOLOGIES%20Consultation%20[${b.bookingReference}]`}
                                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                                title="Email Client"
                              >
                                <Mail className="w-4 h-4" />
                              </a>

                              <a
                                href={`https://wa.me/${b.whatsapp?.replace(/[^0-9]/g, '') || b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${b.fullName}, this is KJT TECHNOLOGIES regarding your scheduled consultation on ${b.date} at ${b.startTime} (${b.bookingReference}).`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-[#25D366] hover:bg-slate-800 rounded-lg transition"
                                title="WhatsApp Client"
                                aria-label={`WhatsApp message to ${b.fullName}`}
                              >
                                <FaWhatsapp size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* CALENDAR / TIMELINE GROUPED VIEW */
            <div className="space-y-4">
              {Object.entries(
                filteredBookings.reduce((acc, b) => {
                  acc[b.date] = acc[b.date] || [];
                  acc[b.date].push(b);
                  return acc;
                }, {} as Record<string, ConsultationBooking[]>)
              )
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, items]: [string, ConsultationBooking[]]) => (
                  <div key={date} className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-[#00D4FF]" />
                        <h3 className="font-bold text-sm text-white">
                          {new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">
                        {items.length} booking{items.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.map((b) => {
                        const badge = STATUS_BADGES[b.status] || STATUS_BADGES.Pending;

                        return (
                          <div
                            key={b.id}
                            onClick={() => handleOpenDetail(b)}
                            className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-[#00D4FF]/60 transition cursor-pointer space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-[#00D4FF]">
                                {b.startTime} – {b.endTime}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                              >
                                {b.status}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-white text-xs truncate">{b.fullName}</h4>
                              <p className="text-[11px] text-slate-400 truncate">
                                {b.organization || 'Individual'} &bull; {b.topic}
                              </p>
                            </div>

                            <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                              <span>{b.meetingMethod}</span>
                              <span className="font-mono">{b.bookingReference}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB: AVAILABILITY & BLACKOUTS CONFIGURATION */}
      {/* ===================================================================== */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
          {/* Working Hours & Slot Engine */}
          <form
            onSubmit={handleSaveAvailability}
            className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-5"
          >
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block">
                Rule Engine
              </span>
              <h3 className="text-base font-bold text-white">Consultation Availability Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Defines working windows, duration, buffers, and daily capacity limits.
              </p>
            </div>

            {configSavedNotice && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Availability rules saved and applied to calendar generator!</span>
              </div>
            )}

            {/* Weekdays */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Available Booking Weekdays
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { day: 1, name: 'Mon' },
                  { day: 2, name: 'Tue' },
                  { day: 3, name: 'Wed' },
                  { day: 4, name: 'Thu' },
                  { day: 5, name: 'Fri' },
                  { day: 6, name: 'Sat' },
                  { day: 0, name: 'Sun' },
                ].map(({ day, name }) => {
                  const isChecked = availabilityConfig.availableWeekdays.includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setAvailabilityConfig((prev) => ({
                          ...prev,
                          availableWeekdays: isChecked
                            ? prev.availableWeekdays.filter((d) => d !== day)
                            : [...prev.availableWeekdays, day],
                        }));
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                        isChecked
                          ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-[#00D4FF]'
                          : 'bg-slate-950 border-slate-800 text-slate-500'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operating Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Opening Time (EAT)</label>
                <input
                  type="time"
                  value={availabilityConfig.openingTime}
                  onChange={(e) =>
                    setAvailabilityConfig((prev) => ({ ...prev, openingTime: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Closing Time (EAT)</label>
                <input
                  type="time"
                  value={availabilityConfig.closingTime}
                  onChange={(e) =>
                    setAvailabilityConfig((prev) => ({ ...prev, closingTime: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            {/* Duration & Daily Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Duration (Minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={120}
                  step={15}
                  value={availabilityConfig.consultationDurationMinutes}
                  onChange={(e) =>
                    setAvailabilityConfig((prev) => ({
                      ...prev,
                      consultationDurationMinutes: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Max Bookings / Day</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={availabilityConfig.maxBookingsPerDay}
                  onChange={(e) =>
                    setAvailabilityConfig((prev) => ({
                      ...prev,
                      maxBookingsPerDay: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            {/* Minimum Notice & Advance Window */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Min Notice (Hours)</label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={availabilityConfig.minimumBookingNoticeHours}
                  onChange={(e) =>
                    setAvailabilityConfig((prev) => ({
                      ...prev,
                      minimumBookingNoticeHours: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Max Advance (Days)</label>
                <input
                  type="number"
                  min={7}
                  max={180}
                  value={availabilityConfig.maxAdvanceBookingDays}
                  onChange={(e) =>
                    setAvailabilityConfig((prev) => ({
                      ...prev,
                      maxAdvanceBookingDays: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Availability Rules</span>
            </button>
          </form>

          {/* Blocked Dates / Holiday Blackouts */}
          <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block">
                Blackouts
              </span>
              <h3 className="text-base font-bold text-white">Blocked Dates &amp; Holidays</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Block specific calendar dates from client booking (holidays, internal sprints, workshops).
              </p>
            </div>

            {/* Add Date Form */}
            <form onSubmit={handleAddBlockedDate} className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">Block a Specific Date</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="date"
                  required
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="px-3 py-2 bg-slate-900 rounded-lg border border-slate-800 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Reason (e.g. National Holiday)"
                  value={newBlockedReason}
                  onChange={(e) => setNewBlockedReason(e.target.value)}
                  className="px-3 py-2 bg-slate-900 rounded-lg border border-slate-800 text-xs text-white placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Block Selected Date</span>
              </button>
            </form>

            {/* List of Blocked Dates */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">
                Active Blocked Dates ({blockedDates.length})
              </span>

              {blockedDates.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No dates currently blocked.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {blockedDates.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-rose-400" />
                        <div>
                          <span className="font-bold text-white block">{b.date}</span>
                          <span className="text-[10px] text-slate-400 block">{b.reason}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveBlockedDate(b.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition"
                        title="Unblock this date"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DETAIL & RESCHEDULE MODAL */}
      {/* ===================================================================== */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-lg text-[#00D4FF]">
                  {selectedBooking.bookingReference}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                    STATUS_BADGES[selectedBooking.status]?.bg
                  } ${STATUS_BADGES[selectedBooking.status]?.text} ${
                    STATUS_BADGES[selectedBooking.status]?.border
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs text-slate-300">
              {/* Date & Reschedule History Card */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF]">
                    Session Time &amp; Channel
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRescheduling(!isRescheduling);
                      setRescheduleDate(selectedBooking.date);
                    }}
                    className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isRescheduling ? 'Cancel Rescheduling' : 'Reschedule Booking'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Date</span>
                    <span className="text-white font-bold text-sm">{selectedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Time Slot</span>
                    <span className="text-[#00D4FF] font-bold text-sm">
                      {selectedBooking.startTime} – {selectedBooking.endTime} EAT
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Meeting Method</span>
                    <span className="text-white font-semibold">{selectedBooking.meetingMethod}</span>
                  </div>
                </div>

                {/* Audit trail if rescheduled previously */}
                {selectedBooking.rescheduledFrom && (
                  <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-[11px] text-purple-300">
                    <strong>Schedule History:</strong> Originally reserved on{' '}
                    <span className="font-semibold">{selectedBooking.rescheduledFrom.date}</span> at{' '}
                    <span className="font-semibold">{selectedBooking.rescheduledFrom.startTime}</span> (Rescheduled on{' '}
                    {new Date(selectedBooking.rescheduledFrom.rescheduledAt).toLocaleDateString('en-GB')}).
                  </div>
                )}
              </div>

              {/* RESCHEDULING SUB-FORM */}
              {isRescheduling && (
                <div className="p-5 bg-purple-950/30 rounded-xl border border-purple-500/40 space-y-4 animate-fadeIn">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block">
                      Choose New Date &amp; Available Slot
                    </span>
                    <p className="text-[11px] text-slate-300">
                      The previous date and time will be permanently preserved in the audit log.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        New Consultation Date
                      </label>
                      <input
                        type="date"
                        min={todayStr}
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 rounded-lg border border-purple-500/50 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      Select Available Slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {rescheduleSlots.filter((s) => s.available).map((slot) => {
                        const isChosen = selectedRescheduleSlot?.startTime === slot.startTime;

                        return (
                          <button
                            key={slot.startTime}
                            type="button"
                            onClick={() => setSelectedRescheduleSlot(slot)}
                            className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                              isChosen
                                ? 'bg-purple-600 border-purple-400 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500'
                            }`}
                          >
                            {slot.startTime} – {slot.endTime}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {rescheduleError && (
                    <p className="text-xs text-rose-400">{rescheduleError}</p>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      disabled={!selectedRescheduleSlot || isSubmittingReschedule}
                      onClick={handleConfirmReschedule}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingReschedule ? 'Rescheduling...' : 'Confirm Rescheduled Appointment'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-3 py-2 text-slate-400 hover:text-white text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Client Details */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] block">
                  Client Information
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Client Name</span>
                    <span className="font-semibold text-white">{selectedBooking.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Organization</span>
                    <span className="font-semibold text-white">{selectedBooking.organization || 'Individual'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Email</span>
                    <a href={`mailto:${selectedBooking.email}`} className="text-[#00D4FF] underline">
                      {selectedBooking.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Phone</span>
                    <a href={`tel:${selectedBooking.phone}`} className="text-slate-200">
                      {selectedBooking.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">WhatsApp</span>
                    <a
                      href={`https://wa.me/${selectedBooking.whatsapp?.replace(/[^0-9]/g, '') || selectedBooking.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] font-semibold"
                    >
                      {selectedBooking.whatsapp || selectedBooking.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Topic & Scope */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF] block">
                  Consultation Focus
                </span>
                <div>
                  <span className="text-slate-500 block text-[10px]">Topic</span>
                  <h4 className="text-sm font-bold text-white">{selectedBooking.topic}</h4>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Service Area</span>
                  <span className="text-slate-200">{selectedBooking.service}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Objectives &amp; Notes</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedBooking.description}
                  </p>
                </div>
                {selectedBooking.additionalNotes && (
                  <div className="pt-2">
                    <span className="text-slate-500 block text-[10px]">Additional Client Notes</span>
                    <p className="text-slate-300 italic">{selectedBooking.additionalNotes}</p>
                  </div>
                )}
              </div>

              {/* Private Admin Notes */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Internal Engineering Notes
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
                  placeholder="Record meeting outcomes, assigned engineer, client action items, follow-up quote reference..."
                  className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 sticky bottom-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value as ConsultationStatus)}
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
                {selectedBooking.status === 'Pending' && (
                  <button
                    onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirm Session</span>
                  </button>
                )}

                <a
                  href={`mailto:${selectedBooking.email}?subject=KJT%20TECHNOLOGIES%20Consultation%20[${selectedBooking.bookingReference}]`}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>

                <a
                  href={`https://wa.me/${selectedBooking.whatsapp?.replace(/[^0-9]/g, '') || selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedBooking.fullName}, this is KJT TECHNOLOGIES regarding your consultation session on ${selectedBooking.date} at ${selectedBooking.startTime}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                  aria-label={`WhatsApp message to ${selectedBooking.fullName}`}
                >
                  <FaWhatsapp size={14} />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
