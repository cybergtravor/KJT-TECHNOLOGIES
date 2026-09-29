import React from 'react';
import { Link } from 'react-router-dom';
import { companyConfig } from '../config/company';
import { ChevronRight, ShieldCheck, Database, Lock, Clock, UserCheck, Trash2, Mail } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="Privacy Policy & Client Data Protection | KJT TECHNOLOGIES"
        description="Learn how KJT TECHNOLOGIES collects, processes, stores, and protects client quotations, consultation bookings, and technical specifications."
        canonicalPath="/privacy"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Privacy Policy', item: '/privacy' },
        ]}
      />

      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#071324] text-slate-200 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D4FF]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00D4FF]">Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Effective Date: March 2025 &bull; Operational Privacy Notice for KJT TECHNOLOGIES
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20 bg-[#081528] border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-300 text-sm sm:text-base leading-relaxed">
          
          {/* Core commitment */}
          <div className="p-6 bg-slate-900/80 border border-[#00D4FF]/30 rounded-xl text-slate-200 text-xs sm:text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#00D4FF] uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Our Data Protection Commitment</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              At {companyConfig.name} (motto: “<em>{companyConfig.motto}</em>”), we treat your confidential business data, technical project specifications, and personal information with utmost security. We never sell, rent, monetize, or trade client data or confidential project files under any circumstances.
            </p>
          </div>

          {/* Section 1: Information Collected */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#00D4FF]">1.</span> Information We Collect
            </h2>
            <p className="text-slate-400 mb-3">
              We collect information that you voluntarily provide to us when using our website and services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
              <li>
                <strong className="text-white">Contact &amp; Identification Data:</strong> Full name, company/organization name, professional email address, telephone number, and WhatsApp number when you contact us, request a quotation, or book an engineering consultation.
              </li>
              <li>
                <strong className="text-white">Project Specifications &amp; RFPs:</strong> Project titles, technical descriptions, feature requirements, budget expectations (in Uganda Shillings), timelines, and confidential file attachments (such as architecture briefs, system diagrams, or PDFs).
              </li>
              <li>
                <strong className="text-white">Consultation Details:</strong> Preferred meeting date, time, topic of discussion, and preferred communication medium (Google Meet, Zoom, telephone, WhatsApp, or in-person at our Kampala office).
              </li>
              <li>
                <strong className="text-white">Newsletter Subscriptions:</strong> Corporate email addresses submitted to receive technical cybersecurity insights and company announcements.
              </li>
              <li>
                <strong className="text-white">Technical Usage Data:</strong> Anonymized server logs, browser type, and device category used purely for performance optimization and abuse mitigation.
              </li>
            </ul>
          </div>

          {/* Section 2: Reasons for Collection */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#00D4FF]">2.</span> Why We Collect This Information
            </h2>
            <p className="text-slate-400 mb-3">
              We collect and process your information solely for legitimate technical and commercial purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
              <li>To review your technical requirements and prepare detailed, itemized commercial quotations.</li>
              <li>To schedule, confirm, and conduct senior engineer consultations and technical assessments.</li>
              <li>To respond promptly to inquiries submitted through our contact form.</li>
              <li>To prevent fraudulent activity, spam submissions, and automated attacks against our forms.</li>
              <li>To dispatch requested news, technical articles, and cybersecurity bulletins (only if opted in).</li>
            </ul>
          </div>

          {/* Section 3: Storage & Security */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#00D4FF]" />
              <span>3. How and Where Your Data Is Stored</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Your submissions are stored in an enterprise PostgreSQL cloud database managed via Supabase. All data transmissions between your browser and our servers are encrypted using modern Transport Layer Security (TLS 1.3 / HTTPS). Database storage and backups are encrypted at rest using industry-standard AES-256 encryption.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Confidential files attached to quotation requests are stored in a private, access-restricted storage bucket. They are never exposed publicly and can only be downloaded via short-lived, time-limited cryptographic signed URLs accessible exclusively by authorized engineering personnel.
            </p>
          </div>

          {/* Section 4: Who Can Access It */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00D4FF]" />
              <span>4. Who Can Access Your Data</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Access to submitted quotation details, client files, and consultation requests is strictly restricted to authorized staff, system architects, and designated project managers of KJT TECHNOLOGIES. All staff members are bound by confidentiality agreements. We enforce strict database Row Level Security (RLS), meaning anonymous public visitors can never view, query, or enumerate requests submitted by other clients.
            </p>
          </div>

          {/* Section 5: Retention Period */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00D4FF]" />
              <span>5. Data Retention Period</span>
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
              <li>
                <strong className="text-white">Quotation Requests &amp; Project Files:</strong> Retained during the proposal and evaluation process and for up to 24 months thereafter for reference in ongoing project discussions, unless a shorter deletion period is requested.
              </li>
              <li>
                <strong className="text-white">Consultation Records:</strong> Retained for 12 months following the appointment to maintain historical advisory context.
              </li>
              <li>
                <strong className="text-white">General Inquiries:</strong> Retained for 6 months after the inquiry is resolved.
              </li>
              <li>
                <strong className="text-white">Newsletter Subscriptions:</strong> Retained until you click the unsubscribe link or request removal.
              </li>
            </ul>
          </div>

          {/* Section 6: Third-Party Service Providers */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#00D4FF]">6.</span> Third-Party Service Providers
            </h2>
            <p className="text-slate-400 mb-3">
              We work with trusted infrastructure providers to deliver our digital services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
              <li>
                <strong className="text-white">Supabase:</strong> Cloud database, authentication, and encrypted object storage provider.
              </li>
              <li>
                <strong className="text-white">Vercel:</strong> Cloud hosting infrastructure for fast, global edge delivery and SSL termination.
              </li>
              <li>
                <strong className="text-white">Web3Forms:</strong> Encrypted email relay API used to deliver instantaneous form notification alerts directly to the KJT TECHNOLOGIES corporate inbox without exposing server-side mail passwords in the browser.
              </li>
              <li>
                <strong className="text-white">Google Fonts:</strong> Open-source web font delivery (Plus Jakarta Sans, JetBrains Mono).
              </li>
            </ul>
            <p className="text-slate-400 text-xs mt-3">
              None of these providers are permitted to use your data for advertising, independent profiling, or any purpose other than providing contracted infrastructure services.
            </p>
          </div>

          {/* Section 7: Cookies and Local Storage */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#00D4FF]">7.</span> Cookies &amp; Browser Storage
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Our website uses modern browser <code>localStorage</code> solely for functional operations:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-300 text-sm">
              <li>Maintaining authenticated administrator dashboard sessions.</li>
              <li>Temporarily caching client quotation and consultation submissions locally to ensure zero data loss in the event of brief network interruptions.</li>
              <li>Remembering user interface preferences (such as collapsed panels or dismissed notifications).</li>
            </ul>
            <p className="text-slate-400 text-xs mt-3">
              We do not use invasive third-party cross-site advertising trackers, behavioral tracking pixels, or data broker cookies.
            </p>
          </div>

          {/* Section 8: Your Rights & Deletion Requests */}
          <div>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#00D4FF]" />
              <span>8. Your Rights &amp; How to Request Data Deletion</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              You maintain full ownership and control over your personal data. At any time, you have the right to:
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">Access &amp; Review</span>
                <p className="text-slate-400">Request a copy of the personal records and project briefs we hold associated with your email address.</p>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">Correction &amp; Update</span>
                <p className="text-slate-400">Request corrections to inaccurate, incomplete, or outdated personal or company details.</p>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">Complete Deletion</span>
                <p className="text-slate-400">Request immediate permanent erasure of your consultation bookings, quotation requests, and uploaded files.</p>
              </div>
              <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">Revoke Consent</span>
                <p className="text-slate-400">Opt out of future technical newsletters or marketing dispatches with one click.</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[#00D4FF]/5 border border-[#00D4FF]/20 rounded-lg flex items-start gap-3 text-xs text-slate-300">
              <Trash2 className="w-4 h-4 text-[#00D4FF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">How to submit a deletion or access request:</strong>
                Send an email with the subject line <em>“Data Deletion Request”</em> to our privacy desk at{' '}
                <a href={`mailto:${companyConfig.contact.primaryEmail}`} className="text-[#00D4FF] underline font-semibold">
                  {companyConfig.contact.primaryEmail}
                </a>{' '}
                or reach out by phone at {companyConfig.contact.primaryPhone}. We process and confirm all verified requests within five (5) business days without charge.
              </div>
            </div>
          </div>

          {/* Corporate Contact Details */}
          <div className="pt-8 border-t border-slate-800 text-slate-400 text-xs space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#00D4FF]">
              9. Contact Information for Privacy Matters
            </h2>
            <p className="text-slate-300">
              For any questions, clarifications, or formal data protection requests regarding this policy, please contact:
            </p>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 text-xs space-y-1">
              <p className="font-bold text-white">{companyConfig.legalName}</p>
              <p>Attn: Privacy &amp; Data Protection Officer</p>
              <p>{companyConfig.address.fullFormatted}</p>
              <p>Telephone: {companyConfig.contact.primaryPhone} / {companyConfig.contact.secondaryPhone}</p>
              <p>Email: <a href={`mailto:${companyConfig.contact.primaryEmail}`} className="text-[#00D4FF] underline">{companyConfig.contact.primaryEmail}</a></p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
