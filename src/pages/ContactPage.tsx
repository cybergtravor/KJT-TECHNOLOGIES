import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ContactForm } from '../components/common/ContactForm';
import { companyConfig } from '../config/company';
import { SEOHead } from '../components/common/SEOHead';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  Share2,
  FileText,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { SocialMediaIcons } from '../components/common/SocialMediaIcons';
import { FaWhatsapp } from 'react-icons/fa';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const ContactPage: React.FC = () => {
  const [activeQuoteSubject, setActiveQuoteSubject] = useState<string>('');

  const prefilledGeneralWhatsApp = `https://wa.me/${companyConfig.contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello KJT TECHNOLOGIES. I would like to inquire about your technology and engineering services.'
  )}`;

  const prefilledQuoteWhatsApp = (serviceName: string) =>
    `https://wa.me/${companyConfig.contact.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
      `Hello KJT TECHNOLOGIES. I would like an itemized quick quote for: ${serviceName}.`
    )}`;

  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="Contact KJT TECHNOLOGIES | Engineering Consultations & Support"
        description="Get in touch with KJT TECHNOLOGIES for enterprise software inquiries, emergency cybersecurity incident response, CCTV installation site surveys, and IT network consultations."
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Contact & Support', item: '/contact' },
        ]}
        customSchema={{
          '@type': 'ContactPage',
          mainEntity: {
            '@type': 'LocalBusiness',
            name: 'KJT TECHNOLOGIES',
            telephone: companyConfig.contact.primaryPhone,
            email: companyConfig.contact.primaryEmail,
            address: {
              '@type': 'PostalAddress',
              streetAddress: companyConfig.address.street,
              addressLocality: companyConfig.address.city,
              addressRegion: companyConfig.address.state,
              addressCountry: companyConfig.address.country,
            },
          },
        }}
      />
      {/* Contact Hero */}
      <section className="relative py-24 bg-[#0A192F] text-slate-200 overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00D4FF]">Contact Us</span>
          </div>

          <div className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
            Contact &amp; Enquiry Channels
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto">
            Let’s Build and Protect Your Digital Future
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Reach out for a confidential technical consultation, security audit, or turnkey software and infrastructure deployment quote.
          </p>

          {/* Dedicated Action Channels: Quote & Consultation */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <Link
              to="/request-quote"
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1f38] border border-[#00D4FF]/40 hover:border-[#00D4FF] transition shadow-lg group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/30 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#00D4FF] flex items-center gap-1">
                  Start Form <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="font-bold text-white text-base">Request a Formal Quote</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                5-step smart quotation request with service selection, timeline, budget in UGX/USD, and document upload.
              </p>
            </Link>

            <Link
              to="/book-consultation"
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1f38] border border-[#00D4FF]/40 hover:border-[#00D4FF] transition shadow-lg group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/30 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#00D4FF] flex items-center gap-1">
                  Book Slot <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <h3 className="font-bold text-white text-base">Book a Consultation</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Schedule a 30, 45, or 60-min meeting with senior engineers in Africa/Kampala time (In-Person or Online).
              </p>
            </Link>
          </div>

          {/* Quick Quote Trigger Pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">
              Quick Quotes:
            </span>
            {[
              'Web & Mobile App',
              'School Management System',
              'CCTV & Surveillance',
              'Cybersecurity Audit',
              'Networking & Cabling',
            ].map((quickService) => (
              <a
                key={quickService}
                href={prefilledQuoteWhatsApp(quickService)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-sm bg-slate-800/80 hover:bg-[#25D366] text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition flex items-center gap-1.5"
                title={`Request quick quote for ${quickService} on WhatsApp`}
              >
                <span className="text-[#25D366] group-hover:text-white flex items-center justify-center">
                  <FaWhatsapp size={14} />
                </span>
                <span>{quickService}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 bg-[#081528] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Direct Corporate Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              {/* Official Brand Identity Card */}
              <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  {/* CUSTOMIZE HERE: Replace the file in public/images/branding/kjt-technologies-logo.png with the official company logo. */}
                  <img
                    src={companyConfig.logoPath || companyConfig.logo.path}
                    alt="KJT TECHNOLOGIES — Accelerating Innovation, Securing Data"
                    width={220}
                    height={55}
                    className="h-10 w-auto object-contain"
                  />
                  <p className="text-xs text-slate-400 mt-2 italic font-medium">
                    “{companyConfig.motto}”
                  </p>
                </div>
                <div className="inline-block px-2.5 py-1 rounded bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-[10px] font-mono uppercase tracking-wider font-bold">
                  Verified Engineering
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                  Corporate Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Headquarters &amp; Direct Support
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Our certified solutions architects and threat mitigation engineers are available across phone, email, and WhatsApp.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Physical Address */}
                <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-lg flex items-start gap-4 hover:border-[#00D4FF]/40 transition">
                  <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Physical Office Location
                    </h4>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {companyConfig.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {companyConfig.address.fullFormatted}
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-lg flex items-start gap-4 hover:border-[#00D4FF]/40 transition">
                  <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Direct Telephone (Click to Call)
                    </h4>
                    <p className="text-sm font-bold text-white">
                      <a
                        href={`tel:${companyConfig.contact.primaryPhone.replace(/[^+\d]/g, '')}`}
                        className="hover:text-[#00D4FF] transition"
                      >
                        {companyConfig.contact.displayPhone}
                      </a>
                    </p>
                    <p className="text-xs text-slate-400">
                      International Desk:{' '}
                      <a
                        href={`tel:${companyConfig.contact.secondaryPhone.replace(/[^+\d]/g, '')}`}
                        className="hover:text-[#00D4FF] transition"
                      >
                        {companyConfig.contact.secondaryPhone}
                      </a>
                    </p>
                  </div>
                </div>

                {/* WhatsApp Direct with Prefilled Message */}
                <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-lg flex items-start gap-4 hover:border-[#25D366]/40 transition">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center flex-shrink-0">
                    <FaWhatsapp size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      WhatsApp Quick Chat
                    </h4>
                    <p className="text-sm font-bold text-white">
                      +{companyConfig.contact.whatsappNumber}
                    </p>
                    <a
                      href={prefilledGeneralWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-wider text-[#25D366] hover:text-[#20bd5a] underline inline-flex items-center gap-1.5"
                      aria-label="Chat with KJT TECHNOLOGIES on WhatsApp"
                    >
                      <span>Start WhatsApp conversation</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                </div>

                {/* Email Addresses (Click to Email) */}
                <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-lg flex items-start gap-4 hover:border-[#00D4FF]/40 transition">
                  <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Electronic Mail (Click to Email)
                    </h4>
                    <p className="text-sm font-bold text-white">
                      <a href={`mailto:${companyConfig.contact.primaryEmail}`} className="hover:text-[#00D4FF] transition">
                        {companyConfig.contact.primaryEmail}
                      </a>
                    </p>
                    <p className="text-xs text-slate-400">
                      Support Desk:{' '}
                      <a href={`mailto:${companyConfig.contact.supportEmail}`} className="hover:text-[#00D4FF] transition">
                        {companyConfig.contact.supportEmail}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-lg flex items-start gap-4 hover:border-[#00D4FF]/40 transition">
                  <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Working Hours
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      {companyConfig.businessHours.weekdays}
                    </p>
                    <p className="text-xs text-slate-300 font-medium">
                      {companyConfig.businessHours.saturday}
                    </p>
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-2.5 py-1 rounded-sm inline-block border border-[#00D4FF]/30">
                      {companyConfig.businessHours.emergencySupport}
                    </div>
                  </div>
                </div>

                {/* Official Social Media Channels */}
                <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#00D4FF]" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Connect on Social Media
                    </h4>
                  </div>
                  <div className="pt-1">
                    <SocialMediaIcons variant="circular" size="md" align="left" theme="colored" />
                  </div>
                </div>
              </div>

              {/* Emergency Security Response */}
              <div className="p-6 bg-slate-800/60 rounded-2xl border border-amber-500/40 text-white space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Experiencing an Active Cyber Incident?</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Call our emergency hotline directly at <strong className="text-white">{companyConfig.contact.primaryPhone}</strong> or select "Urgent Cyber Incident Response" in the consultation form for prioritized SLA dispatch within 15 minutes.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm defaultService={activeQuoteSubject} />
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Google Map Section */}
      <section className="py-24 bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm mb-2">
              Locate Our Facilities
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              {companyConfig.maps.locationLabel}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visitors are welcomed by prior appointment for security badging and visitor protocols.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl h-96 w-full relative bg-slate-900">
            <iframe
              title="KJT TECHNOLOGIES Office Location Map"
              src={companyConfig.maps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
