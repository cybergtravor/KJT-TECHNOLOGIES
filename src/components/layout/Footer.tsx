/**
 * =====================================================================
 * CORPORATE FOOTER - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Features:
 * - Company introduction & official Motto
 * - Quick links & direct services links
 * - Contact information mapped from src/config/company.ts
 * - Social media placeholders with icons
 * - Newsletter subscription form
 * - Dynamic copyright year (new Date().getFullYear())
 * - "Designed and developed by KJT TECHNOLOGIES"
 * - Privacy Policy & Terms and Conditions links
 * =====================================================================
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Lock
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { companyConfig } from '../../config/company';
import { servicesData } from '../../data/servicesData';
import { BrandLogo } from '../common/BrandLogo';
import { NewsletterForm } from '../common/NewsletterForm';
import { SocialMediaIcons } from '../common/SocialMediaIcons';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Request a Quote', path: '/request-quote' },
    { name: 'Book a Consultation', path: '/book-consultation' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Featured Projects', path: '/projects' },
    { name: 'Technology News & Insights', path: '/blog' },
    { name: 'Frequently Asked Questions', path: '/faq' },
    { name: 'Contact & Inquiries', path: '/contact' },
  ];

  return (
    <footer className="bg-[#071324] text-slate-300 border-t border-slate-800" aria-label="Company Footer">
      {/* Geometric Balance Enterprise Trust Bar */}
      <div className="border-b border-slate-800 py-4 px-4 sm:px-12 bg-slate-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF]" />
            <span>Trusted by leading enterprises &amp; institutions</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-slate-400">
            <span className="font-serif tracking-wider hover:text-white transition">TECHCORE</span>
            <span className="font-sans font-extrabold tracking-widest hover:text-white transition">AURORA SYSTEMS</span>
            <span className="font-mono tracking-widest hover:text-[#00D4FF] transition">GLOBALSEC</span>
            <span className="font-sans font-bold tracking-wider hover:text-white transition">NETLINK</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Upper Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-slate-800">
          {/* Column 1: Company Profile & Motto (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="dark" />

            <div className="p-3.5 bg-slate-900/90 rounded-sm border border-slate-800 inline-block">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#00D4FF] mb-1">
                Company Motto
              </div>
              <p className="text-sm font-semibold text-white italic">
                “{companyConfig.motto}”
              </p>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {companyConfig.shortDescription}
            </p>

            {/* Official Social Media Channels */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest block mb-3">
                Connect With Our Engineers
              </span>
              <SocialMediaIcons variant="circular" size="md" align="left" theme="colored" />
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 hover:text-[#00D4FF] transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
              Core Services
            </h3>
            <ul className="space-y-2.5">
              {servicesData.map((svc) => (
                <li key={svc.id}>
                  <Link
                    to={`/services/${svc.slug}`}
                    className="text-sm text-slate-400 hover:text-[#00D4FF] transition-colors flex items-center justify-between group"
                  >
                    <span className="line-clamp-1 group-hover:text-white">
                      {svc.title}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#00D4FF] transition" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter (3 cols on lg) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D4FF]">
              Headquarters
            </h3>
            
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                <span>{companyConfig.address.fullFormatted}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
                <a
                  href={`tel:${companyConfig.contact.primaryPhone.replace(/[^+\d]/g, '')}`}
                  className="hover:text-[#00D4FF] transition"
                >
                  {companyConfig.contact.primaryPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
                <a
                  href={`mailto:${companyConfig.contact.primaryEmail}`}
                  className="hover:text-[#00D4FF] transition"
                >
                  {companyConfig.contact.primaryEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="text-[#25D366] flex-shrink-0 flex items-center justify-center">
                  <FaWhatsapp size={16} />
                </span>
                <a
                  href={`https://wa.me/${companyConfig.whatsappNumber}?text=${encodeURIComponent(
                    'Hello KJT TECHNOLOGIES. I would like to learn more about your technology services.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition"
                  aria-label="Direct WhatsApp chat with KJT TECHNOLOGIES"
                >
                  WhatsApp: +{companyConfig.whatsappNumber}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                <div>
                  <p>{companyConfig.businessHours.weekdays}</p>
                  <p className="text-xs text-[#00D4FF]/90 font-medium mt-0.5">
                    {companyConfig.businessHours.emergencySupport}
                  </p>
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Tech &amp; Security Newsletter
              </span>
              <NewsletterForm theme="dark" />
            </div>
          </div>
        </div>

        {/* Discreet Administrator Access Bar */}
        <div className="pt-6 pb-2 border-t border-slate-800/70 mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-800 border border-slate-700/60 text-[#00D4FF]">
                <Lock className="w-3 h-3" />
              </span>
              <span className="font-semibold text-slate-300">Website Administration</span>
              <span className="text-slate-600 hidden sm:inline">&bull;</span>
              <span className="text-slate-400 hidden sm:inline">Manage News &amp; Articles</span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={typeof window !== 'undefined' && localStorage.getItem('kjt_admin_authenticated') === 'true' ? '/admin/dashboard' : '/admin/login'}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-[#00D4FF] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition"
                title="KJT Technologies CMS Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>
                  {typeof window !== 'undefined' && localStorage.getItem('kjt_admin_authenticated') === 'true'
                    ? 'Manage News & Articles (Dashboard)'
                    : 'Administrator Login'}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Lower Row: Compliance, Copyright & Credits */}
        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>
              &copy; {currentYear} {companyConfig.legalName} All rights reserved.
            </span>
            <span className="text-slate-700 hidden sm:inline">&bull;</span>
            <Link to="/privacy-policy" className="hover:text-[#00D4FF] transition underline underline-offset-4">
              Privacy Policy
            </Link>
            <span className="text-slate-700">&bull;</span>
            <Link to="/terms-and-conditions" className="hover:text-[#00D4FF] transition underline underline-offset-4">
              Terms and Conditions
            </Link>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-[#00D4FF]" />
            <span>Designed and developed by <strong className="text-white font-bold">{companyConfig.name}</strong></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
