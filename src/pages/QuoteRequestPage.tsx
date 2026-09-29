/**
 * =====================================================================
 * SMART QUOTATION REQUEST FORM - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Route: /request-quote
 * 5-Step guided engineering quotation wizard:
 *   Step 1: Client Information & Preferred Contact
 *   Step 2: Required Services Selection (from servicesData)
 *   Step 3: Project Specifications & Private Document Attachments
 *   Step 4: Budget (UGX) & Delivery Timeline
 *   Step 5: Review, Privacy Consent & Direct Submission
 * =====================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Coins,
  ShieldCheck,
  Send,
  Calendar,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
} from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { SEOHead } from '../components/common/SEOHead';
import { companyConfig } from '../config/company';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import {
  submitQuotationRequest,
  uploadQuotationFile,
} from '../lib/quotationService';
import {
  QuotationRequest,
  BudgetRangeUGX,
  TimelineOption,
  QuotationUploadedFile,
} from '../types';

const BUDGET_OPTIONS: BudgetRangeUGX[] = [
  'Below UGX 500,000',
  'UGX 500,000–1,000,000',
  'UGX 1,000,000–3,000,000',
  'UGX 3,000,000–5,000,000',
  'Above UGX 5,000,000',
  'Not sure — I need guidance',
];

const TIMELINE_OPTIONS: TimelineOption[] = [
  'As soon as possible',
  'Within 1–2 weeks',
  'Within 3–4 weeks',
  'Within 1–2 months',
  'More than 2 months',
  'Flexible',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'png', 'jpg', 'jpeg', 'webp'];

export const QuoteRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service');

  // Step state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'email' | 'phone' | 'whatsapp'>('email');

  // Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [hasOtherService, setHasOtherService] = useState(false);
  const [otherServiceDescription, setOtherServiceDescription] = useState('');

  // Project Details
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [mainGoals, setMainGoals] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [requiredFeatures, setRequiredFeatures] = useState('');
  const [existingUrl, setExistingUrl] = useState('');
  const [preferredTechnology, setPreferredTechnology] = useState('');
  const [projectType, setProjectType] = useState<'new' | 'improvement'>('new');

  // Files
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [uploadedMeta, setUploadedMeta] = useState<QuotationUploadedFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Budget & Timeline
  const [budgetRange, setBudgetRange] = useState<BudgetRangeUGX>('UGX 1,000,000–3,000,000');
  const [timeline, setTimeline] = useState<TimelineOption>('Within 3–4 weeks');
  const [preferredStartDate, setPreferredStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isDeadlineFlexible, setIsDeadlineFlexible] = useState(true);
  const [additionalComments, setAdditionalComments] = useState('');

  // Consent & Anti-spam
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedQuotation, setSubmittedQuotation] = useState<QuotationRequest | null>(null);

  // Handle service preselection from URL
  useEffect(() => {
    if (initialService) {
      const match = servicesData.find(
        (s) => s.title.toLowerCase() === initialService.toLowerCase() || s.slug === initialService
      );
      if (match && !selectedServices.includes(match.title)) {
        setSelectedServices([match.title]);
      } else if (!selectedServices.includes(initialService)) {
        setSelectedServices([initialService]);
      }
    }
  }, [initialService]);

  // Synchronize WhatsApp with phone if left empty
  const handlePhoneBlur = () => {
    if (phone && !whatsapp) {
      setWhatsapp(phone);
    }
  };

  // Service toggle handler
  const toggleService = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    );
  };

  // File Upload Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;
    const incoming = Array.from(e.target.files) as File[];
    addValidFiles(incoming);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileError(null);
    if (e.dataTransfer.files) {
      const incoming = Array.from(e.dataTransfer.files) as File[];
      addValidFiles(incoming);
    }
  };

  const addValidFiles = (incoming: File[]) => {
    for (const f of incoming) {
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setFileError(`File type ".${ext}" is not supported. Please upload PDF, Word, Excel, PowerPoint, Text, or image files.`);
        return;
      }
      if (f.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File "${f.name}" exceeds the maximum 10MB limit.`);
        return;
      }
    }
    setAttachedFiles((prev) => [...prev, ...incoming].slice(0, 5));
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Step Validations
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        errs.fullName = 'Please provide your full legal or representative name.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
        errs.email = 'Please provide a valid corporate or professional email address.';
      }
      const phoneDigits = phone.replace(/\D/g, '');
      if (!phone.trim() || phoneDigits.length < 9) {
        errs.phone = 'Please provide a valid phone number with country or regional code.';
      }
      if (!location.trim()) {
        errs.location = 'Please state your town, district, or primary operational location.';
      }
    } else if (step === 2) {
      if (selectedServices.length === 0 && !hasOtherService) {
        errs.services = 'Please select at least one technology capability or describe a custom requirement under "Other".';
      }
      if (hasOtherService && !otherServiceDescription.trim()) {
        errs.otherServiceDescription = 'Please describe the custom service or technical task you need.';
      }
    } else if (step === 3) {
      if (!projectTitle.trim() || projectTitle.trim().length < 4) {
        errs.projectTitle = 'Please enter a clear project title or system name.';
      }
      if (!projectDescription.trim() || projectDescription.trim().length < 20) {
        errs.projectDescription = 'Please provide an overview of your project (at least 20 characters).';
      }
      if (!mainGoals.trim() || mainGoals.trim().length < 10) {
        errs.mainGoals = 'Please outline your primary project goals.';
      }
      if (!targetUsers.trim()) {
        errs.targetUsers = 'Who will use this system or service (e.g. students, customers, staff)?';
      }
      if (!requiredFeatures.trim()) {
        errs.requiredFeatures = 'Please list the key features or deliverables you require.';
      }
    } else if (step === 4) {
      if (!budgetRange) {
        errs.budgetRange = 'Please select an estimated budget bracket.';
      }
      if (!timeline) {
        errs.timeline = 'Please select your target project timeline.';
      }
    } else if (step === 5) {
      if (!privacyConsent) {
        errs.privacyConsent = 'You must accept the Privacy Policy to proceed.';
      }
      if (!accuracyConfirmed) {
        errs.accuracyConfirmed = 'Please confirm that the project specifications provided are accurate.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePreviousStep = () => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    // Spam honeypot trap
    if (honeypot) {
      console.warn('Bot submission trapped.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // SECURITY: Private client attachments are validated and stored in private Supabase storage.
      // 1. Process and upload files
      const uploadedFileMetas: QuotationUploadedFile[] = [];
      const tempRef = `TEMP-${Date.now()}`;

      for (const file of attachedFiles) {
        const res = await uploadQuotationFile(file, tempRef);
        uploadedFileMetas.push(res);
      }

      // 2. Submit quotation payload
      const allServices = [...selectedServices];
      if (hasOtherService && otherServiceDescription.trim()) {
        allServices.push(`Other: ${otherServiceDescription.trim()}`);
      }

      // BACKEND SETUP: Save quotation request to Supabase PostgreSQL table 'quotation_requests'
      const result = await submitQuotationRequest({
        fullName: fullName.trim(),
        company: company.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        location: location.trim(),
        preferredContactMethod,
        services: allServices,
        otherServiceDescription: hasOtherService ? otherServiceDescription.trim() : undefined,
        projectTitle: projectTitle.trim(),
        description: projectDescription.trim(),
        mainGoals: mainGoals.trim(),
        targetUsers: targetUsers.trim(),
        requiredFeatures: requiredFeatures.trim(),
        existingUrl: existingUrl.trim() || undefined,
        preferredTechnology: preferredTechnology.trim() || undefined,
        projectType,
        files: uploadedFileMetas,
        currency: 'UGX',
        budgetRange,
        timeline,
        preferredStartDate: preferredStartDate || undefined,
        deadline: deadline || undefined,
        isDeadlineFlexible,
        additionalComments: additionalComments.trim() || undefined,
        privacyConsent,
        accuracyConfirmed,
      });

      if (result.success && result.quotation) {
        setSubmittedQuotation(result.quotation);
        window.scrollTo({ top: 150, behavior: 'smooth' });
      } else {
        setSubmitError(result.error || 'Failed to submit quotation. Please check your connection and try again.');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'An unexpected error occurred while submitting your quotation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Client Info' },
    { num: 2, label: 'Services' },
    { num: 3, label: 'Project Specs' },
    { num: 4, label: 'Budget & Timeline' },
    { num: 5, label: 'Review & Submit' },
  ];

  return (
    <div className="bg-[#0A192F] text-slate-200 min-h-screen">
      <SEOHead
        title="Request a Detailed Project Quotation | KJT TECHNOLOGIES"
        description="Submit your enterprise project specifications for custom software, web & mobile applications, CCTV security installation, networking, or cybersecurity audits. Receive a transparent itemized quotation."
        canonicalPath="/request-quote"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Request a Quote', item: '/request-quote' },
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
            <span>Fast &bull; Transparent &bull; Confidential NDA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Smart Project Quotation Request
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Provide your technical specifications, timeline, and goals below. Our senior engineering architects will review your requirements and prepare an itemized commercial proposal.
          </p>
        </div>
      </section>

      {/* Main Quotation Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {submittedQuotation ? (
          /* SUCCESS CONFIRMATION SCREEN */
          <div className="bg-slate-900/90 rounded-2xl border border-[#00D4FF]/40 p-8 sm:p-12 shadow-2xl space-y-8 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#00D4FF]/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
                Submission Received Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Thank You, {submittedQuotation.fullName}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Your project quotation request has been securely dispatched to the KJT TECHNOLOGIES solutions team. A certified engineer will review your deliverables and contact you via your preferred method ({submittedQuotation.preferredContactMethod}).
              </p>
            </div>

            {/* Reference Number Card */}
            <div className="bg-[#050D1A] border border-slate-700/80 rounded-xl p-6 max-w-md mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">
                Official Quotation Reference Number
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#00D4FF] tracking-wider selection:bg-[#00D4FF] selection:text-[#0A192F]">
                {submittedQuotation.referenceNumber}
              </div>
              <p className="text-[11px] text-slate-400">
                Please quote this reference number in all future communications or inquiries.
              </p>
            </div>

            {/* Next Steps Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto pt-2">
              <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#00D4FF]">1. Technical Audit</span>
                <p className="text-xs text-slate-300">Engineers review your project requirements and scope.</p>
              </div>
              <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#00D4FF]">2. Cost Breakdown</span>
                <p className="text-xs text-slate-300">Itemized quotation prepared in UGX based on deliverables.</p>
              </div>
              <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#00D4FF]">3. Direct Dispatch</span>
                <p className="text-xs text-slate-300">Sent via official email &amp; WhatsApp within 24 business hours.</p>
              </div>
            </div>

            {/* Follow-up Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              {/* WhatsApp follow-up button as required */}
              <WhatsAppButton
                variant="quote-followup"
                quoteReference={submittedQuotation.referenceNumber}
                label="Follow Up via WhatsApp"
                className="px-6 py-3 rounded-xl text-xs"
              />

              {/* Consultation booking button as required */}
              <Link
                to={`/book-consultation?service=${encodeURIComponent(submittedQuotation.services[0] || '')}`}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] hover:brightness-110 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Live Consultation</span>
              </Link>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="text-xs font-semibold text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
              >
                <span>Return to KJT Homepage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Step Progress Bar */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
                {stepsList.map((step) => {
                  const isCompleted = step.num < currentStep;
                  const isActive = step.num === currentStep;

                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => {
                        if (step.num < currentStep) {
                          setCurrentStep(step.num);
                        }
                      }}
                      disabled={step.num > currentStep}
                      className={`flex flex-col items-center gap-1.5 text-center transition-all ${
                        isCompleted
                          ? 'text-[#00D4FF] cursor-pointer hover:opacity-80'
                          : isActive
                          ? 'text-white font-bold'
                          : 'text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-[#00D4FF] text-[#0A192F]'
                            : isActive
                            ? 'bg-transparent border-2 border-[#00D4FF] text-[#00D4FF]'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                      </div>
                      <span className="text-[10px] sm:text-xs tracking-wider hidden sm:block">
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Visual Track Line */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00D4FF] to-[#0055FF] h-full transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Interactive Form Card */}
            <form onSubmit={handleSubmit} noValidate className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8">
              {/* Spam Honeypot (hidden) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="quote-botcheck">Leave this field blank</label>
                <input
                  id="quote-botcheck"
                  type="text"
                  name="botcheck"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* ============================================================ */}
              {/* STEP 1: CLIENT INFORMATION */}
              {/* ============================================================ */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                      Step 1 of 5
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Client &amp; Contact Details
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Provide contact information for receiving the formal quotation and scope assessment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="client-fullname" className="text-xs font-semibold text-slate-300 block">
                        Full Name or Representative <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="client-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Eng. David Mukasa"
                        className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition ${
                          errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.fullName && <p className="text-[11px] text-rose-400">{errors.fullName}</p>}
                    </div>

                    {/* Company / Organisation */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-company" className="text-xs font-semibold text-slate-300 block">
                        Company or Organisation Name
                      </label>
                      <input
                        id="client-company"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Mukasa Logistics Ltd (or Individual)"
                        className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-location" className="text-xs font-semibold text-slate-300 block">
                        Town, District or Location <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="client-location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Kampala, Entebbe, Jinja, or International"
                        className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition ${
                          errors.location ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.location && <p className="text-[11px] text-rose-400">{errors.location}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-email" className="text-xs font-semibold text-slate-300 block">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="david@company.com"
                        className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition ${
                          errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-phone" className="text-xs font-semibold text-slate-300 block">
                        Telephone Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        value={phone}
                        onBlur={handlePhoneBlur}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+256 700 000 000"
                        className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition ${
                          errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.phone && <p className="text-[11px] text-rose-400">{errors.phone}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-whatsapp" className="text-xs font-semibold text-slate-300 block">
                        WhatsApp Number
                      </label>
                      <input
                        id="client-whatsapp"
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="+256 700 000 000"
                        className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition"
                      />
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-1.5">
                      <label htmlFor="client-contact-method" className="text-xs font-semibold text-slate-300 block">
                        Preferred Contact Method
                      </label>
                      <select
                        id="client-contact-method"
                        value={preferredContactMethod}
                        onChange={(e) => setPreferredContactMethod(e.target.value as any)}
                        className="w-full px-4 py-3 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition cursor-pointer"
                      >
                        <option value="email">Email Address</option>
                        <option value="phone">Direct Phone Call</option>
                        <option value="whatsapp">WhatsApp Messaging</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 2: REQUIRED SERVICES */}
              {/* ============================================================ */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                      Step 2 of 5
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Select Required Services
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose one or multiple capabilities from our standard engineering catalog or describe custom needs.
                    </p>
                  </div>

                  {errors.services && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.services}</span>
                    </div>
                  )}

                  {/* Services Grid from servicesData */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                    {servicesData.map((svc) => {
                      const isSelected = selectedServices.includes(svc.title);

                      return (
                        <div
                          key={svc.id}
                          onClick={() => toggleService(svc.title)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-0.5">
                              {svc.badge}
                            </span>
                            <h4 className="text-xs sm:text-sm font-semibold">{svc.title}</h4>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                              isSelected
                                ? 'bg-[#00D4FF] border-[#00D4FF] text-[#0A192F]'
                                : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}

                    {/* "Other" Option */}
                    <div
                      onClick={() => setHasOtherService(!hasOtherService)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        hasOtherService
                          ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                          Custom
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold">Other (Custom Requirement)</h4>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                          hasOtherService
                            ? 'bg-[#00D4FF] border-[#00D4FF] text-[#0A192F]'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {hasOtherService && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {/* If Other is checked, show description field as mandated */}
                  {hasOtherService && (
                    <div className="space-y-1.5 p-4 bg-slate-950/80 rounded-xl border border-slate-800 animate-fadeIn">
                      <label htmlFor="other-service-desc" className="text-xs font-semibold text-slate-300 block">
                        Describe the Custom Technical Service or Scope <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        id="other-service-desc"
                        rows={3}
                        value={otherServiceDescription}
                        onChange={(e) => setOtherServiceDescription(e.target.value)}
                        placeholder="Describe any specialized hardware, legacy integrations, custom scripting, or custom engineering tasks..."
                        className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                      />
                      {errors.otherServiceDescription && (
                        <p className="text-[11px] text-rose-400">{errors.otherServiceDescription}</p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-slate-400">
                    Selected services:{' '}
                    <span className="text-[#00D4FF] font-bold">
                      {selectedServices.length + (hasOtherService ? 1 : 0)} selected
                    </span>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 3: PROJECT DETAILS */}
              {/* ============================================================ */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                      Step 3 of 5
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Project Details &amp; Specifications
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Tell our solutions architects what you are building, target users, and key features.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Project Title */}
                    <div className="space-y-1.5">
                      <label htmlFor="proj-title" className="text-xs font-semibold text-slate-300 block">
                        Project Title or Working Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="proj-title"
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Uganda Campus Biometric Attendance & Tuition Portal"
                        className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                          errors.projectTitle ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.projectTitle && <p className="text-[11px] text-rose-400">{errors.projectTitle}</p>}
                    </div>

                    {/* New vs Improvement */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Is this a new project or an improvement to an existing system? <span className="text-rose-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setProjectType('new')}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                            projectType === 'new'
                              ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF]'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Brand New Project</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectType('improvement')}
                          className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                            projectType === 'improvement'
                              ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF]'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Layers className="w-4 h-4" />
                          <span>Improvement / Upgrade</span>
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label htmlFor="proj-description" className="text-xs font-semibold text-slate-300 block">
                        Description of the Project <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        id="proj-description"
                        rows={3}
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Provide a comprehensive summary of what your business or institution intends to accomplish..."
                        className={`w-full px-4 py-3 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                          errors.projectDescription ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.projectDescription && <p className="text-[11px] text-rose-400">{errors.projectDescription}</p>}
                    </div>

                    {/* Main Goals & Target Users in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="proj-goals" className="text-xs font-semibold text-slate-300 block">
                          Main Project Goals <span className="text-rose-400">*</span>
                        </label>
                        <textarea
                          id="proj-goals"
                          rows={2}
                          value={mainGoals}
                          onChange={(e) => setMainGoals(e.target.value)}
                          placeholder="e.g. Automate report card generation, prevent payroll fraud..."
                          className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                            errors.mainGoals ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                          }`}
                        />
                        {errors.mainGoals && <p className="text-[11px] text-rose-400">{errors.mainGoals}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="proj-users" className="text-xs font-semibold text-slate-300 block">
                          Target Users <span className="text-rose-400">*</span>
                        </label>
                        <textarea
                          id="proj-users"
                          rows={2}
                          value={targetUsers}
                          onChange={(e) => setTargetUsers(e.target.value)}
                          placeholder="e.g. School bursars, 1,200 students, IT administrators..."
                          className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                            errors.targetUsers ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                          }`}
                        />
                        {errors.targetUsers && <p className="text-[11px] text-rose-400">{errors.targetUsers}</p>}
                      </div>
                    </div>

                    {/* Required Features */}
                    <div className="space-y-1.5">
                      <label htmlFor="proj-features" className="text-xs font-semibold text-slate-300 block">
                        Required Features / Modules <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        id="proj-features"
                        rows={2}
                        value={requiredFeatures}
                        onChange={(e) => setRequiredFeatures(e.target.value)}
                        placeholder="List specific functionalities (e.g. Mobile money payment gateway, SMS notifications, fingerprint scanner integration, export to Excel)..."
                        className={`w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] ${
                          errors.requiredFeatures ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                        }`}
                      />
                      {errors.requiredFeatures && <p className="text-[11px] text-rose-400">{errors.requiredFeatures}</p>}
                    </div>

                    {/* Existing URL & Preferred Tech in 2 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="proj-existing-url" className="text-xs font-semibold text-slate-300 block">
                          Existing Website or System URL (Optional)
                        </label>
                        <input
                          id="proj-existing-url"
                          type="url"
                          value={existingUrl}
                          onChange={(e) => setExistingUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="proj-tech" className="text-xs font-semibold text-slate-300 block">
                          Preferred Technology, if known (Optional)
                        </label>
                        <input
                          id="proj-tech"
                          type="text"
                          value={preferredTechnology}
                          onChange={(e) => setPreferredTechnology(e.target.value)}
                          placeholder="e.g. React, Node.js, Python, Hikvision, Mikrotik..."
                          className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                        />
                      </div>
                    </div>

                    {/* File Upload Zone (Private Storage) */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Optional Specification Documents &amp; Reference Images
                      </label>

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-[#00D4FF] bg-slate-950/50 text-center cursor-pointer transition space-y-2 group"
                      >
                        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#00D4FF] mx-auto transition-transform group-hover:-translate-y-0.5" />
                        <div className="text-xs text-slate-300">
                          <span className="font-bold text-[#00D4FF]">Click to upload</span> or drag and drop files here
                        </div>
                        <p className="text-[11px] text-slate-500">
                          PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx), TXT, PNG, JPG, or WEBP (Up to 10MB per file, max 5 files)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.webp"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>

                      {fileError && (
                        <p className="text-xs text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{fileError}</span>
                        </p>
                      )}

                      {/* File preview chips */}
                      {attachedFiles.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Attached Files ({attachedFiles.length}/5):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {attachedFiles.map((file, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <FileText className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
                                  <span className="truncate text-slate-200">{file.name}</span>
                                  <span className="text-[10px] text-slate-500 flex-shrink-0">
                                    ({(file.size / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(i);
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-400 transition"
                                  aria-label="Remove attached file"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 4: BUDGET & TIMELINE */}
              {/* ============================================================ */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                      Step 4 of 5
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Budget &amp; Delivery Timeline
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      All standard project estimates are benchmarked in Uganda Shillings (UGX).
                    </p>
                  </div>

                  {/* Budget Options */}
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Estimated Project Budget (UGX) <span className="text-rose-400">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {BUDGET_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setBudgetRange(opt)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            budgetRange === opt
                              ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{opt}</span>
                            {budgetRange === opt && <CheckCircle2 className="w-4 h-4 text-[#00D4FF]" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Options */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Expected Timeline <span className="text-rose-400">*</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {TIMELINE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setTimeline(opt)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            timeline === opt
                              ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{opt}</span>
                            {timeline === opt && <CheckCircle2 className="w-4 h-4 text-[#00D4FF]" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates & Deadlines */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label htmlFor="proj-start-date" className="text-xs font-semibold text-slate-300 block">
                        Preferred Start Date (Optional)
                      </label>
                      <input
                        id="proj-start-date"
                        type="date"
                        value={preferredStartDate}
                        onChange={(e) => setPreferredStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="proj-deadline" className="text-xs font-semibold text-slate-300 block">
                        Target Project Deadline (Optional)
                      </label>
                      <input
                        id="proj-deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                      />
                    </div>
                  </div>

                  {/* Flexible Deadline Checkbox */}
                  <div className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                    <input
                      id="deadline-flex"
                      type="checkbox"
                      checked={isDeadlineFlexible}
                      onChange={(e) => setIsDeadlineFlexible(e.target.checked)}
                      className="w-4 h-4 rounded text-[#00D4FF] focus:ring-[#00D4FF] bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="deadline-flex" className="text-xs text-slate-300 cursor-pointer">
                      Is this deadline flexible? (Recommended for agile phased milestones)
                    </label>
                  </div>

                  {/* Additional Comments */}
                  <div className="space-y-1.5">
                    <label htmlFor="proj-comments" className="text-xs font-semibold text-slate-300 block">
                      Additional Comments, SLA Constraints or Requirements
                    </label>
                    <textarea
                      id="proj-comments"
                      rows={2}
                      value={additionalComments}
                      onChange={(e) => setAdditionalComments(e.target.value)}
                      placeholder="e.g. Needs payment via bank wire or mobile money, requires on-site training in Jinja..."
                      className="w-full px-4 py-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                    />
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 5: REVIEW & SUBMIT */}
              {/* ============================================================ */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                      Step 5 of 5
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Review Quotation Summary
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Please verify all technical requirements before submitting to the KJT solutions team.
                    </p>
                  </div>

                  {/* Review Cards */}
                  <div className="space-y-4">
                    {/* Section 1 Review */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF]">
                          1. Client &amp; Contact
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Name</span>
                          <span className="text-white font-medium">{fullName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Company</span>
                          <span className="text-white font-medium">{company || 'Individual'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Email</span>
                          <span className="text-white font-medium truncate block">{email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Phone / WhatsApp</span>
                          <span className="text-white font-medium">{phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Location</span>
                          <span className="text-white font-medium">{location}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Preferred Contact</span>
                          <span className="text-white font-medium uppercase text-[11px]">{preferredContactMethod}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2 Review */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF]">
                          2. Selected Services
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedServices.map((svc) => (
                          <span
                            key={svc}
                            className="px-2.5 py-1 bg-slate-900 rounded-md border border-slate-700 text-xs text-slate-200"
                          >
                            {svc}
                          </span>
                        ))}
                        {hasOtherService && (
                          <span className="px-2.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/40 text-xs text-[#00D4FF]">
                            Custom: {otherServiceDescription}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Section 3 Review */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF]">
                          3. Project Scope
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Title</span>
                          <span className="text-white font-semibold">{projectTitle}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Overview</span>
                          <p className="text-slate-300 line-clamp-2">{projectDescription}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Type</span>
                            <span className="text-slate-200 font-medium">
                              {projectType === 'new' ? 'Brand New Project' : 'Improvement to Existing'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Files Attached</span>
                            <span className="text-slate-200 font-medium">{attachedFiles.length} file(s)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4 Review */}
                    <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF]">
                          4. Budget &amp; Delivery
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Budget Bracket</span>
                          <span className="text-[#00D4FF] font-bold">{budgetRange}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Timeline</span>
                          <span className="text-white font-medium">{timeline}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Deadline</span>
                          <span className="text-white font-medium">
                            {deadline || 'Not specified'}{' '}
                            {isDeadlineFlexible ? '(Flexible)' : '(Strict)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Consents & Verification Checklist */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                      <input
                        id="quote-privacy-consent"
                        type="checkbox"
                        checked={privacyConsent}
                        onChange={(e) => setPrivacyConsent(e.target.checked)}
                        className="w-4 h-4 rounded text-[#00D4FF] focus:ring-[#00D4FF] bg-slate-900 border-slate-700 mt-0.5"
                      />
                      <label htmlFor="quote-privacy-consent" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                        I agree to the KJT TECHNOLOGIES{' '}
                        <Link to="/privacy-policy" target="_blank" className="text-[#00D4FF] underline">
                          Privacy Policy
                        </Link>{' '}
                        and consent to having my project specifications securely processed under professional confidentiality.
                      </label>
                    </div>
                    {errors.privacyConsent && <p className="text-[11px] text-rose-400 pl-7">{errors.privacyConsent}</p>}

                    <div className="flex items-start gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                      <input
                        id="quote-accuracy-confirmed"
                        type="checkbox"
                        checked={accuracyConfirmed}
                        onChange={(e) => setAccuracyConfirmed(e.target.checked)}
                        className="w-4 h-4 rounded text-[#00D4FF] focus:ring-[#00D4FF] bg-slate-900 border-slate-700 mt-0.5"
                      />
                      <label htmlFor="quote-accuracy-confirmed" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                        I confirm that the technical requirements and contact information provided are accurate to the best of my knowledge.
                      </label>
                    </div>
                    {errors.accuracyConfirmed && <p className="text-[11px] text-rose-400 pl-7">{errors.accuracyConfirmed}</p>}
                  </div>

                  {submitError && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:brightness-110 flex items-center gap-2 shadow-lg shadow-[#00D4FF]/20 transition cursor-pointer"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 flex items-center gap-2 shadow-xl shadow-[#00D4FF]/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin" />
                        <span>Submitting Quotation...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Quotation Request</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
