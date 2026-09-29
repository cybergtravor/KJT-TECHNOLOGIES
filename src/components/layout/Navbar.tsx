/**
 * =====================================================================
 * PROFESSIONAL RESPONSIVE HEADER & NAVIGATION - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Motto: “Accelerating Innovation, Securing Data.”
 * 
 * Features:
 * - Sticky position with subtle shadow, border, and backdrop-blur on scroll
 * - Company logo and name with uncompressed aspect ratio on left
 * - Well-spaced desktop navigation: Home, About, Services, Projects, Blog, Contact
 * - Active page highlighting with cyan accent
 * - Grouped 5-category mega menu dropdown for Services:
 *     1. Web and Software Development
 *     2. Security and Surveillance
 *     3. Infrastructure and Networking
 *     4. Enterprise and Education Systems
 *     5. Support and Consulting
 * - Dropdown opens on hover or click, closes on outside click or Escape key
 * - "View All Services" direct link in the mega menu
 * - Visible "Get a Free Consultation" CTA button
 * - Fluid mobile menu with smooth accordion for services categories
 * =====================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  ArrowRight,
  Shield,
  Code,
  Lock,
  Network,
  GraduationCap,
  Wrench,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { companyConfig } from '../../config/company';
import { BrandLogo } from '../common/BrandLogo';
import { SocialMediaIcons } from '../common/SocialMediaIcons';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { motion, AnimatePresence } from 'motion/react';

interface ServiceCategoryGroup {
  name: string;
  icon: React.ElementType;
  color: string;
  items: { title: string; slug: string; short: string }[];
}

export const serviceCategories: ServiceCategoryGroup[] = [
  {
    name: 'Web and Software Development',
    icon: Code,
    color: '#00D4FF',
    items: [
      { title: 'Website Design & Development', slug: 'website-design-and-development', short: 'Modern, fast corporate websites' },
      { title: 'Web Application Development', slug: 'web-application-development', short: 'Scalable cloud apps & portals' },
      { title: 'Mobile App Development', slug: 'mobile-app-development', short: 'Native iOS & Android systems' },
      { title: 'Desktop Software Development', slug: 'desktop-software-development', short: 'Offline & high-performance tools' },
      { title: 'UI/UX Design', slug: 'ui-ux-design', short: 'Figma prototypes & design systems' },
      { title: 'Database Architecture & Management', slug: 'database-design-and-management', short: 'Secure SQL & scalable schemas' },
    ],
  },
  {
    name: 'Security and Surveillance',
    icon: Lock,
    color: '#38BDF8',
    items: [
      { title: 'Cybersecurity Services', slug: 'cybersecurity-services', short: 'Penetration testing & audits' },
      { title: 'CCTV & Camera Installation', slug: 'cctv-and-security-camera-installation', short: '4K IP cameras & remote viewing' },
      { title: 'Access Control & Biometrics', slug: 'access-control-and-biometric-systems', short: 'Time-attendance & smart doors' },
      { title: 'Data Protection & Backup', slug: 'data-protection-and-backup-solutions', short: 'Encrypted ransomware recovery' },
    ],
  },
  {
    name: 'Infrastructure and Networking',
    icon: Network,
    color: '#60A5FA',
    items: [
      { title: 'Computer Networking', slug: 'computer-networking', short: 'Structured cabling, fiber & LAN/WAN' },
      { title: 'Cloud Solutions & Hosting', slug: 'cloud-solutions', short: 'AWS, Azure, Google Cloud setups' },
      { title: 'Server Installation & Management', slug: 'server-installation-and-management', short: 'Windows & Linux domain servers' },
      { title: 'Domain Registration & Hosting', slug: 'domain-registration-and-web-hosting', short: 'Fast NVMe SSD hosting' },
      { title: 'Business Email Setup', slug: 'email-and-business-communication-setup', short: 'Google Workspace & Microsoft 365' },
    ],
  },
  {
    name: 'Enterprise and Education Systems',
    icon: GraduationCap,
    color: '#818CF8',
    items: [
      { title: 'School Management Systems', slug: 'school-management-systems', short: 'Tuition, report cards & portals' },
      { title: 'Business Management Systems', slug: 'business-management-systems', short: 'Custom ERP, CRM & inventory' },
    ],
  },
  {
    name: 'Support and Consulting',
    icon: Wrench,
    color: '#34D399',
    items: [
      { title: 'Managed IT Support', slug: 'it-support-and-maintenance', short: 'Helpdesk & SLA retainer plans' },
      { title: 'Computer Repair & Upgrades', slug: 'computer-repair-and-upgrades', short: 'Hardware diagnostics & servicing' },
      { title: 'Digital Transformation Consulting', slug: 'digital-transformation-consulting', short: 'Enterprise tech modernization' },
      { title: 'Search Engine Optimization (SEO)', slug: 'search-engine-optimization', short: 'Organic Google search rankings' },
      { title: 'ICT Training & Advisory', slug: 'ict-training-and-consultancy', short: 'Staff cybersecurity training' },
    ],
  },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileServicesExpanded, setMobileServicesExpanded] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Dynamic scroll listener for sticky elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesMenuOpen(false);
    setMobileServicesExpanded(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close dropdown on click outside or on Escape key
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setServicesMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services', isServices: true },
    { name: 'Projects', path: '/projects' },
    { name: 'News & Insights', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isServicesActive = location.pathname.startsWith('/services');

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Utility Bar (Contact desk, hours, and WhatsApp) */}
      <div className="bg-[#050D1A] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
              <Shield className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span className="text-[#00D4FF] font-semibold">{companyConfig.name}:</span>
              <span className="italic text-slate-300 font-normal">“{companyConfig.motto}”</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`tel:${companyConfig.contact.primaryPhone.replace(/[^+\d]/g, '')}`}
              className="inline-flex items-center gap-1.5 hover:text-[#00D4FF] transition-colors"
              aria-label={`Call KJT TECHNOLOGIES: ${companyConfig.contact.displayPhone}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>{companyConfig.contact.displayPhone}</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={`https://wa.me/${companyConfig.whatsappNumber}?text=${encodeURIComponent(
                'Hello KJT TECHNOLOGIES. I would like to learn more about your technology services.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              aria-label="Direct WhatsApp message to engineering desk"
            >
              <span className="flex items-center justify-center">
                <FaWhatsapp size={14} />
              </span>
              <span>WhatsApp Direct</span>
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Kampala, Uganda &bull; Mon-Sat
            </span>
          </div>
        </div>
      </div>

      {/* Main Header / Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-2xl shadow-black/40 border-b border-slate-800 py-3 sm:py-3.5'
            : 'bg-[#0A192F]/90 backdrop-blur-md border-b border-slate-800/80 py-3.5 sm:py-4'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Brand on Left */}
          <div className="flex-shrink-0 flex items-center">
            <BrandLogo variant="dark" size="md" />
          </div>

          {/* Well-Spaced Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 xl:gap-9 text-sm font-medium">
            {navItems.map((item) => {
              if (item.isServices) {
                return (
                  <div
                    key={item.name}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setServicesMenuOpen(true)}
                    onMouseLeave={() => setServicesMenuOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setServicesMenuOpen(!servicesMenuOpen)}
                      id="services-mega-menu-trigger"
                      aria-expanded={servicesMenuOpen}
                      aria-haspopup="true"
                      className={`inline-flex items-center gap-1.5 py-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] rounded-md ${
                        isServicesActive
                          ? 'text-[#00D4FF] font-semibold'
                          : 'text-slate-200 hover:text-[#00D4FF]'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          servicesMenuOpen ? 'rotate-180 text-[#00D4FF]' : 'text-slate-400'
                        }`}
                      />
                    </button>

                    {/* Active Route Indicator Bar */}
                    {isServicesActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF] rounded-full" />
                    )}

                    {/* Professional Mega Menu Dropdown */}
                    <AnimatePresence>
                      {servicesMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          id="services-mega-dropdown"
                          className="absolute top-full -left-28 xl:-left-16 w-[780px] xl:w-[860px] mt-1 bg-[#071324] rounded-2xl shadow-2xl border border-slate-700/80 p-6 z-50 text-slate-200"
                        >
                          {/* Mega Menu Header */}
                          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                                All 22 Engineering Capabilities
                              </span>
                            </div>
                            <Link
                              to="/services"
                              onClick={() => setServicesMenuOpen(false)}
                              className="text-xs font-bold text-[#00D4FF] hover:text-white inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                            >
                              <span>View All Services</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* 2-Column Mega Menu Body */}
                          <div className="grid grid-cols-12 gap-6">
                            {/* Left: Category Selector Tabs */}
                            <div className="col-span-5 space-y-1.5 border-r border-slate-800 pr-4">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 px-3">
                                Focus Sectors
                              </div>
                              {serviceCategories.map((category, idx) => {
                                const Icon = category.icon;
                                const isActive = activeCategoryTab === idx;
                                return (
                                  <button
                                    key={category.name}
                                    type="button"
                                    onClick={() => setActiveCategoryTab(idx)}
                                    onMouseEnter={() => setActiveCategoryTab(idx)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-150 ${
                                      isActive
                                        ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/30 shadow-sm'
                                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate">
                                      <Icon className="w-4 h-4 flex-shrink-0" style={{ color: category.color }} />
                                      <span className="truncate">{category.name}</span>
                                    </div>
                                    <span className="text-[10px] font-mono opacity-60">
                                      {category.items.length}
                                    </span>
                                  </button>
                                );
                              })}

                              {/* Quick Consult Callout in Left Sidebar */}
                              <div className="pt-4 mt-2 border-t border-slate-800/80 px-3">
                                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                                  Need a customized hybrid deployment?
                                </p>
                                <Link
                                  to="/contact"
                                  onClick={() => setServicesMenuOpen(false)}
                                  className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                                >
                                  <span>Talk to an Architect</span>
                                  <ArrowRight className="w-3 h-3 text-[#00D4FF]" />
                                </Link>
                              </div>
                            </div>

                            {/* Right: Active Category Service Items */}
                            <div className="col-span-7 pl-2">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-white uppercase tracking-wider">
                                  {serviceCategories[activeCategoryTab].name}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  Click service for details
                                </span>
                              </div>

                              <div className="grid grid-cols-1 gap-2 max-h-[340px] overflow-y-auto pr-2">
                                {serviceCategories[activeCategoryTab].items.map((svc) => (
                                  <Link
                                    key={svc.slug}
                                    to={`/services/${svc.slug}`}
                                    onClick={() => setServicesMenuOpen(false)}
                                    className="p-2.5 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all duration-150 group"
                                  >
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-[#00D4FF] transition-colors">
                                        {svc.title}
                                      </h4>
                                      <ArrowRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                      {svc.short}
                                    </p>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `py-2 transition-colors duration-150 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] rounded-md ${
                      isActive
                        ? 'text-[#00D4FF] font-semibold'
                        : 'text-slate-200 hover:text-[#00D4FF]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D4FF] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Right CTA Action Button */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              to="/request-quote"
              id="desktop-header-quote-btn"
              className="px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-200 border border-slate-700/80 hover:border-[#00D4FF] hover:text-[#00D4FF] bg-slate-900/60 hover:bg-[#00D4FF]/10 transition-all duration-150 inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Request a Quote</span>
            </Link>

            <Link
              to="/book-consultation"
              id="desktop-header-consultation-btn"
              className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] hover:brightness-110 active:scale-95 shadow-md shadow-[#00D4FF]/20 transition-all duration-150 inline-flex items-center gap-1.5 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Actions: Consult Shortcut + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/request-quote"
              id="mobile-header-consult-btn"
              className="px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-[#00D4FF] text-[#0A192F] shadow-sm whitespace-nowrap"
            >
              Quote
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-button"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-[#00D4FF] transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Smooth Animated Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            id="mobile-navigation-drawer"
            className="lg:hidden bg-[#0A192F] border-b border-slate-800 shadow-2xl overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div className="px-5 pt-3 pb-8 space-y-2">
              {/* Motto Tagline Card */}
              <div className="p-3.5 bg-[#050D1A] rounded-xl border border-slate-800 text-xs mb-3">
                <span className="text-[#00D4FF] font-bold block mb-0.5">{companyConfig.name}</span>
                <span className="text-slate-300 italic">“{companyConfig.motto}”</span>
              </div>

              {/* Mobile Links */}
              {navItems.map((item) => {
                if (item.isServices) {
                  return (
                    <div key={item.name} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40">
                      <div className="flex items-center justify-between px-4 py-3">
                        <NavLink
                          to="/services"
                          end
                          onClick={() => setMobileMenuOpen(false)}
                          className={`text-sm font-semibold uppercase tracking-wider ${
                            isServicesActive ? 'text-[#00D4FF]' : 'text-slate-200'
                          }`}
                        >
                          Services
                        </NavLink>

                        <button
                          type="button"
                          onClick={() => setMobileServicesExpanded(!mobileServicesExpanded)}
                          className="p-1 rounded-md text-slate-400 hover:text-white"
                          aria-label="Toggle services categories"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              mobileServicesExpanded ? 'rotate-180 text-[#00D4FF]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* Accordion List for Mobile Services */}
                      {mobileServicesExpanded && (
                        <div className="px-4 pb-3 space-y-4 border-t border-slate-800/80 pt-3">
                          {serviceCategories.map((cat) => (
                            <div key={cat.name} className="space-y-1.5">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-[#00D4FF]">
                                {cat.name}
                              </div>
                              <div className="space-y-1 pl-2 border-l border-slate-800">
                                {cat.items.map((svc) => (
                                  <Link
                                    key={svc.slug}
                                    to={`/services/${svc.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-xs text-slate-300 hover:text-[#00D4FF] py-1"
                                  >
                                    {svc.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                          <div className="pt-2">
                            <Link
                              to="/services"
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-xs font-bold text-[#00D4FF] inline-flex items-center gap-1.5 uppercase tracking-wider"
                            >
                              <span>View All Services Directory</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition ${
                        isActive
                          ? 'bg-[#00D4FF]/10 text-[#00D4FF] font-bold border-l-4 border-[#00D4FF]'
                          : 'text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </NavLink>
                );
              })}

              {/* Mobile CTAs & Direct Channels */}
              <div className="pt-4 space-y-2.5">
                <Link
                  to="/request-quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#00D4FF]/40 text-[#00D4FF] bg-[#00D4FF]/10 font-bold text-xs uppercase tracking-wider transition"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to="/book-consultation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold text-xs uppercase tracking-wider shadow-lg"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <WhatsAppButton
                  variant="standard"
                  label="Chat on WhatsApp"
                  className="w-full py-2.5 text-xs font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                />

                {/* Follow Us Social Icons */}
                <div className="pt-3 border-t border-slate-800/80 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    Follow KJT TECHNOLOGIES
                  </span>
                  <SocialMediaIcons variant="circular" size="sm" align="center" theme="colored" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
