/**
 * =====================================================================
 * CONSULTATION BOOKING SYSTEM - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Route: /book-consultation
 * Allows enterprise decision-makers, school administrators, and founders
 * to schedule live architecture and engineering consultations with
 * KJT TECHNOLOGIES technical leads.
 * 
 * Features:
 * - Dynamic available slot generation based on admin configuration
 * - Strict double booking elimination (client & database level)
 * - Blocked dates and working hour constraints
 * - Meeting method selector (Google Meet, Zoom, WhatsApp, Phone, Physical)
 * - Africa/Kampala time zone benchmark
 * - Instant .ics file download & Google Calendar link
 * - Direct WhatsApp follow-up link
 * =====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  PhoneCall,
  MessageSquare,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Send,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { SEOHead } from '../components/common/SEOHead';
import { FaWhatsapp } from 'react-icons/fa';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { companyConfig } from '../config/company';
import {
  getAvailableTimeSlotsForDate,
  submitConsultationBooking,
  generateIcsCalendarFile,
  generateGoogleCalendarUrl,
  GeneratedTimeSlot,
} from '../lib/consultationService';
import { ConsultationBooking, MeetingMethod } from '../types';

const MEETING_METHODS: { id: MeetingMethod; label: string; icon: any; note?: string }[] = [
  { id: 'Google Meet', label: 'Google Meet (HD Video)', icon: Video },
  { id: 'Zoom', label: 'Zoom Video Conference', icon: Video },
  { id: 'WhatsApp call', label: 'WhatsApp Audio / Video Call', icon: FaWhatsapp },
  { id: 'Telephone call', label: 'Direct Phone Call', icon: PhoneCall },
  {
    id: 'Physical meeting',
    label: 'Physical On-Premise Meeting',
    icon: MapPin,
    note: 'Physical meeting location must be confirmed by KJT TECHNOLOGIES engineers.',
  },
];

export const ConsultationBookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service');

  // Today + 1 day formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  // Selection States
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [availableSlots, setAvailableSlots] = useState<GeneratedTimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsNotice, setSlotsNotice] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<GeneratedTimeSlot | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedService, setSelectedService] = useState<string>(
    servicesData[0]?.title || 'Website Design and Development'
  );
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [meetingMethod, setMeetingMethod] = useState<MeetingMethod>('Google Meet');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  // Preselect service from query parameter
  useEffect(() => {
    if (initialService) {
      const match = servicesData.find(
        (s) => s.title.toLowerCase() === initialService.toLowerCase() || s.slug === initialService
      );
      if (match) {
        setSelectedService(match.title);
      } else {
        setSelectedService(initialService);
      }
    }
  }, [initialService]);

  // Load available time slots when date changes
  useEffect(() => {
    let isCancelled = false;

    async function loadSlots() {
      if (!selectedDate) return;
      setSlotsLoading(true);
      setSlotsNotice(null);
      setSelectedSlot(null);

      try {
        const result = await getAvailableTimeSlotsForDate(selectedDate);
        if (!isCancelled) {
          setAvailableSlots(result.slots);
          if (result.message) {
            setSlotsNotice(result.message);
          } else if (result.slots.filter((s) => s.available).length === 0) {
            setSlotsNotice('No available consultation slots on this date. Please pick an alternative working day.');
          }
        }
      } catch (e) {
        if (!isCancelled) {
          setSlotsNotice('Could not load time slots. Please try choosing another date.');
        }
      } finally {
        if (!isCancelled) {
          setSlotsLoading(false);
        }
      }
    }

    loadSlots();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  const handlePhoneBlur = () => {
    if (phone && !whatsapp) {
      setWhatsapp(phone);
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!selectedSlot) {
      errs.slot = 'Please select an available consultation time slot.';
    }
    if (!fullName.trim() || fullName.trim().length < 3) {
      errs.fullName = 'Please enter your full legal or representative name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      errs.email = 'Please provide a valid corporate or professional email address.';
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone.trim() || phoneDigits.length < 9) {
      errs.phone = 'Please provide a telephone number with country code.';
    }
    if (!topic.trim() || topic.trim().length < 5) {
      errs.topic = 'Please provide a consultation subject or topic (e.g. ERP System Migration).';
    }
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please describe what you want to discuss during the session (at least 15 characters).';
    }
    if (!privacyConsent) {
      errs.privacyConsent = 'You must agree to the consultation booking terms and privacy policy.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedSlot) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // BACKEND SETUP: Saves appointment reservation to Supabase table 'consultation_bookings'
      // and triggers double-booking validation against existing reservations.
      const res = await submitConsultationBooking({
        fullName: fullName.trim(),
        organization: organization.trim() || undefined,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        service: selectedService,
        topic: topic.trim(),
        description: description.trim(),
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        timeZone: 'Africa/Kampala',
        meetingMethod,
        additionalNotes: additionalNotes.trim() || undefined,
        privacyConsent,
      });

      if (res.success && res.booking) {
        setConfirmedBooking(res.booking);
        window.scrollTo({ top: 150, behavior: 'smooth' });
      } else {
        setSubmitError(res.error || 'Unable to confirm booking. Please choose another time slot.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download .ics file
  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const icsContent = generateIcsCalendarFile(confirmedBooking);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${confirmedBooking.bookingReference}_consultation.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Min date: tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  // Max date: +60 days
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="bg-[#0A192F] text-slate-200 min-h-screen">
      <SEOHead
        title="Book an Architecture & Technical Consultation | KJT TECHNOLOGIES"
        description="Schedule a 45-minute live engineering consultation with KJT TECHNOLOGIES systems architects. Available via Google Meet, Zoom, WhatsApp, or Kampala headquarters."
        canonicalPath="/book-consultation"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Book a Consultation', item: '/book-consultation' },
        ]}
      />

      {/* Hero Header */}
      <section className="relative py-16 lg:py-20 bg-[#071324] border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senior Systems Architect Sessions &bull; 45 Minutes</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Schedule an Engineering Consultation
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Reserve dedicated time with our senior engineers to diagnose enterprise bottlenecks, evaluate security architectures, or plan your next digital deployment.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {confirmedBooking ? (
          /* BOOKING CONFIRMATION SCREEN */
          <div className="bg-slate-900/90 rounded-2xl border border-[#00D4FF]/40 p-8 sm:p-12 shadow-2xl space-y-8 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#00D4FF]/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
                Consultation Request Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Booking Reserved, {confirmedBooking.fullName}
              </h2>
              {/* Mandatory pending confirmation note */}
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs max-w-xl mx-auto leading-relaxed">
                <strong>Notice:</strong> Your consultation request is currently{' '}
                <span className="underline font-bold">Pending</span> and will be confirmed by a KJT TECHNOLOGIES solutions architect shortly via email and WhatsApp.
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="bg-[#050D1A] border border-slate-700/80 rounded-2xl p-6 max-w-lg mx-auto space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Booking Reference
                </span>
                <span className="text-lg font-mono font-bold text-[#00D4FF]">
                  {confirmedBooking.bookingReference}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Date &amp; Time</span>
                  <span className="text-white font-bold block mt-0.5">
                    {confirmedBooking.date}
                  </span>
                  <span className="text-[#00D4FF] font-medium block">
                    {confirmedBooking.startTime} – {confirmedBooking.endTime} ({confirmedBooking.timeZone})
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Meeting Method</span>
                  <span className="text-white font-bold block mt-0.5">
                    {confirmedBooking.meetingMethod}
                  </span>
                  {confirmedBooking.meetingMethod === 'Physical meeting' && (
                    <span className="text-[11px] text-amber-400 block mt-0.5">
                      Subject to office confirmation
                    </span>
                  )}
                </div>

                <div className="col-span-2 border-t border-slate-800 pt-2">
                  <span className="text-slate-500 block text-[10px] uppercase">Service &amp; Topic</span>
                  <span className="text-slate-200 font-medium block">
                    {confirmedBooking.service} &bull; {confirmedBooking.topic}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Calendar & WhatsApp */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              {/* Download .ics */}
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Calendar (.ics)</span>
              </button>

              {/* Google Calendar Link */}
              <a
                href={generateGoogleCalendarUrl(confirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Add to Google Calendar</span>
              </a>

              {/* WhatsApp follow up button as mandated */}
              <WhatsAppButton
                variant="consultation-followup"
                consultationReference={confirmedBooking.bookingReference}
                bookingDetails={{
                  date: confirmedBooking.date,
                  time: confirmedBooking.startTime,
                  service: confirmedBooking.service,
                }}
                label="Confirm on WhatsApp"
                className="px-5 py-2.5 rounded-xl text-xs"
              />
            </div>

            <div className="pt-4 border-t border-slate-800 max-w-md mx-auto flex items-center justify-between text-xs text-slate-400">
              <Link to="/request-quote" className="hover:text-[#00D4FF] transition">
                Need an itemized project quote?
              </Link>
              <Link to="/" className="hover:text-white transition">
                Return to Homepage &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8"
          >
            {/* Step 1 Header: Choose Date & Slot */}
            <div className="border-b border-slate-800 pb-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block">
                Step 1: Pick a Date &amp; Available Slot
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Consultation Scheduling
              </h2>
              <p className="text-xs text-slate-400">
                Operating Hours: Monday – Friday &bull; 08:30 – 17:30 EAT &bull; Timezone: <span className="text-[#00D4FF] font-semibold">Africa/Kampala (UTC+3)</span>
              </p>
            </div>

            {/* Date Picker & Timezone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="booking-date" className="text-xs font-semibold text-slate-300 block">
                  Select Consultation Date <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="booking-date"
                    type="date"
                    min={minDateStr}
                    max={maxDateStr}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Standard Local Timezone
                </label>
                <div className="px-4 py-3 bg-slate-950/40 rounded-xl border border-slate-800 text-sm text-slate-300 flex items-center justify-between">
                  <span className="font-mono text-xs">Africa/Kampala (EAT)</span>
                  <span className="text-[11px] text-[#00D4FF] font-bold">UTC +03:00</span>
                </div>
              </div>
            </div>

            {/* Dynamic Slot Generator */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Available Consultation Slots (45 Minutes) <span className="text-rose-400">*</span></span>
                {slotsLoading && <span className="text-[11px] text-[#00D4FF] animate-pulse">Calculating availability...</span>}
              </label>

              {slotsNotice ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{slotsNotice}</span>
                </div>
              ) : availableSlots.length === 0 && !slotsLoading ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                  No slots available for this date. Please select another date above.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;

                    if (!slot.available) {
                      return (
                        <div
                          key={slot.startTime}
                          title={slot.reason || 'Slot unavailable'}
                          className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/40 text-slate-600 text-center text-xs line-through cursor-not-allowed"
                        >
                          {slot.startTime} – {slot.endTime}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#00D4FF] border-[#00D4FF] text-[#0A192F] shadow-lg shadow-[#00D4FF]/20 scale-[1.02]'
                            : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-[#00D4FF]/60 hover:text-white'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{slot.startTime} – {slot.endTime}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {errors.slot && <p className="text-[11px] text-rose-400">{errors.slot}</p>}
            </div>

            {/* Meeting Method Selection */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Preferred Consultation Meeting Method <span className="text-rose-400">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {MEETING_METHODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = meetingMethod === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMeetingMethod(m.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#00D4FF]' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold">{m.label}</span>
                      </div>
                      {m.note && (
                        <p className="text-[10px] text-amber-400 leading-tight mt-1">{m.note}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Client & Topic Details */}
            <div className="border-t border-slate-800 pt-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block">
                  Step 2: Client &amp; Topic Details
                </span>
                <h3 className="text-lg font-bold text-white">Your Technical Focus</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="book-name" className="text-xs font-semibold text-slate-300 block">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="book-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Nabirye"
                    className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                      errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-400">{errors.fullName}</p>}
                </div>

                {/* Organization */}
                <div className="space-y-1.5">
                  <label htmlFor="book-org" className="text-xs font-semibold text-slate-300 block">
                    Organization / Company
                  </label>
                  <input
                    id="book-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Nabirye Health Systems (or Individual)"
                    className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="book-email" className="text-xs font-semibold text-slate-300 block">
                    Corporate / Work Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="book-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@nabiryehealth.org"
                    className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                      errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="book-phone" className="text-xs font-semibold text-slate-300 block">
                    Telephone Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="book-phone"
                    type="tel"
                    value={phone}
                    onBlur={handlePhoneBlur}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+256 700 000 000"
                    className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                      errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-400">{errors.phone}</p>}
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label htmlFor="book-whatsapp" className="text-xs font-semibold text-slate-300 block">
                    WhatsApp Number
                  </label>
                  <input
                    id="book-whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+256 700 000 000"
                    className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                  />
                </div>

                {/* Service Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="book-service" className="text-xs font-semibold text-slate-300 block">
                    Primary Service Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="book-service"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF] cursor-pointer"
                  >
                    {servicesData.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="General Enterprise Consultation">General Enterprise Consultation</option>
                  </select>
                </div>
              </div>

              {/* Topic */}
              <div className="space-y-1.5 pt-1">
                <label htmlFor="book-topic" className="text-xs font-semibold text-slate-300 block">
                  Consultation Topic or Subject <span className="text-rose-400">*</span>
                </label>
                <input
                  id="book-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. School Biometric Attendance & Grade Portal Deployment"
                  className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                    errors.topic ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                  }`}
                />
                {errors.topic && <p className="text-[11px] text-rose-400">{errors.topic}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="book-description" className="text-xs font-semibold text-slate-300 block">
                  Detailed Discussion Objectives &amp; Background <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="book-description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what challenges your organization is facing, existing software in place, or specific questions for our solutions architect..."
                  className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                    errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                  }`}
                />
                {errors.description && <p className="text-[11px] text-rose-400">{errors.description}</p>}
              </div>

              {/* Additional Notes */}
              <div className="space-y-1.5">
                <label htmlFor="book-notes" className="text-xs font-semibold text-slate-300 block">
                  Additional Notes or Special Attendee Requirements
                </label>
                <input
                  id="book-notes"
                  type="text"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. 2 additional colleagues will join the call; please prepare screen sharing"
                  className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                />
              </div>

              {/* Privacy Consent */}
              <div className="pt-2">
                <div className="flex items-start gap-3 p-3.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <input
                    id="book-consent"
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00D4FF] focus:ring-[#00D4FF] bg-slate-900 border-slate-700 mt-0.5"
                  />
                  <label htmlFor="book-consent" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                    I agree to the KJT TECHNOLOGIES{' '}
                    <Link to="/privacy-policy" target="_blank" className="text-[#00D4FF] underline">
                      Privacy Policy
                    </Link>{' '}
                    and consent to receiving a meeting invitation and follow-up communication for this session.
                  </label>
                </div>
                {errors.privacyConsent && <p className="text-[11px] text-rose-400 pl-7 mt-1">{errors.privacyConsent}</p>}
              </div>

              {submitError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {selectedSlot ? (
                  <span>
                    Selected: <strong className="text-white">{selectedDate}</strong> at{' '}
                    <strong className="text-[#00D4FF]">{selectedSlot.startTime} EAT</strong>
                  </span>
                ) : (
                  <span className="text-slate-500">Please choose a date &amp; slot above</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 flex items-center gap-2 shadow-xl shadow-[#00D4FF]/20 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin" />
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <>
                    <CalendarIcon className="w-4 h-4" />
                    <span>Confirm Consultation Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
