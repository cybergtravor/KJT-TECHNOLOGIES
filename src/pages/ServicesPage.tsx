/**
 * =====================================================================
 * SERVICES DIRECTORY & CATALOG - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Features:
 * - Real-time keyword search across titles, descriptions, deliverables & clients
 * - Quick-filter tags for high-demand capabilities (CCTV, Web, Security, etc.)
 * - 6 Domain-level category groups with live counts
 * - View mode toggle: Rich Grid View vs. High-Density Enterprise Directory List View
 * - Sorting options: Recommended, Alphabetical (A-Z), Delivery Timeframe
 * - Standardized WhatsAppButton integration for instant prefilled service inquiries
 * - Full responsive mobile/tablet/desktop layouts with clear action triggers
 * =====================================================================
 */

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import { ServiceIcon } from '../components/common/ServiceIcon';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { SEOHead } from '../components/common/SEOHead';
import { CTASection } from '../components/home/CTASection';
import {
  Search,
  X,
  Grid,
  List,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Code,
  ShieldCheck,
  Server,
  Headphones,
  Sparkles,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { ServiceItem } from '../types';

type ViewMode = 'grid' | 'list';
type SortOption = 'default' | 'alpha-asc' | 'alpha-desc';

interface DomainCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badges: string[];
}

const DOMAIN_CATEGORIES: DomainCategory[] = [
  {
    id: 'all',
    name: 'All Capabilities',
    icon: Layers,
    badges: [],
  },
  {
    id: 'software',
    name: 'Software & Web',
    icon: Code,
    badges: ['Web & Digital', 'Mobile & Apps', 'Design & Product'],
  },
  {
    id: 'security',
    name: 'Security & CCTV',
    icon: ShieldCheck,
    badges: ['Security & Defense', 'Security & Surveillance'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Systems',
    icon: Sparkles,
    badges: ['Enterprise Systems', 'Specialized Systems', 'Communication & Tools'],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Cloud',
    icon: Server,
    badges: ['Infrastructure & Hardware', 'Cloud & DevOps'],
  },
  {
    id: 'maintenance',
    name: 'Support & Consulting',
    icon: Headphones,
    badges: ['Hardware Care', 'Support & Maintenance', 'Consultancy & Support', 'Marketing & Growth'],
  },
];

const POPULAR_TAGS = [
  'Custom Software',
  'CCTV',
  'Cybersecurity',
  'School Management',
  'Networking',
  'Data Backup',
  'Mobile Apps',
  'Web Development',
];

export const ServicesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Calculate live count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: servicesData.length };
    DOMAIN_CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = servicesData.filter((svc) => cat.badges.includes(svc.badge)).length;
      }
    });
    return counts;
  }, []);

  // Filter and sort services
  const filteredServices = useMemo(() => {
    let result = servicesData.filter((svc) => {
      // Category filter
      if (activeCategory !== 'all') {
        const catObj = DOMAIN_CATEGORIES.find((c) => c.id === activeCategory);
        if (catObj && !catObj.badges.includes(svc.badge)) {
          return false;
        }
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = svc.title.toLowerCase().includes(q);
        const matchesDesc = svc.shortDescription.toLowerCase().includes(q);
        const matchesTagline = svc.tagline.toLowerCase().includes(q);
        const matchesDeliverable = svc.whatIsIncluded.some((item) => item.toLowerCase().includes(q));
        const matchesBadge = svc.badge.toLowerCase().includes(q);
        const matchesClient = svc.suitableCustomers.some((c) => c.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesTagline && !matchesDeliverable && !matchesBadge && !matchesClient) {
          return false;
        }
      }

      return true;
    });

    // Sort order
    if (sortBy === 'alpha-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'alpha-desc') {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('default');
  };

  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="Full-Spectrum Technology & Security Services | KJT TECHNOLOGIES"
        description="Explore our 22 core technology capabilities: Custom software, web development, cybersecurity audits, 4K CCTV surveillance, networking, and enterprise systems."
        canonicalPath="/services"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Services Directory', item: '/services' },
        ]}
      />

      {/* Hero Header Section */}
      <section className="relative pt-20 pb-16 bg-[#0A192F] border-b border-slate-800/80 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
            <Link to="/" className="hover:text-[#00D4FF] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00D4FF]">Services Directory</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>22 Core Technology Disciplines</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Full-Spectrum Technology &amp; Security Capabilities
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From modern web applications and proactive cyber defense to 4K CCTV installations, fiber optic networking, and complete school management systems.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/request-quote"
              id="services-hero-quote-btn"
              className="px-5 py-2.5 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#00D4FF]/20 flex items-center gap-2"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/book-consultation"
              id="services-hero-consultation-btn"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider border border-slate-700 transition flex items-center gap-2"
            >
              <span>Book a Consultation</span>
              <Clock className="w-4 h-4 text-[#00D4FF]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation, Search & Controls Bar */}
      <section className="sticky top-16 z-30 bg-[#0A192F]/95 backdrop-blur-md border-b border-slate-800 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Top Row: Search Box + Sort + View Mode Switcher */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Input Box */}
            <div className="relative flex-grow max-w-2xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search capabilities (e.g., CCTV, React, Penetration, School, Backup)..."
                aria-label="Search all 22 technology services"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label="Clear search text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls: Sorting & View Mode */}
            <div className="flex items-center justify-between md:justify-end gap-2.5">
              
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort services"
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
                >
                  <option value="default" className="bg-slate-900 text-slate-200">Recommended</option>
                  <option value="alpha-asc" className="bg-slate-900 text-slate-200">Alphabetical (A-Z)</option>
                  <option value="alpha-desc" className="bg-slate-900 text-slate-200">Alphabetical (Z-A)</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid'
                      ? 'bg-[#00D4FF] text-[#0A192F] shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="Card grid view"
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'list'
                      ? 'bg-[#00D4FF] text-[#0A192F] shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-label="Directory list view"
                  title="Directory List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Category Tabs Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {DOMAIN_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = activeCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  id={`cat-filter-${cat.id}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#00D4FF] text-[#0A192F] border-[#00D4FF] shadow-sm'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#0A192F]' : 'text-[#00D4FF]'}`} />
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                      isSelected
                        ? 'bg-[#0A192F]/20 text-[#0A192F]'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Popular Tag Suggestions (when no search query active) */}
          {!searchQuery && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Quick Jump:</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-0.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-[#00D4FF] border border-slate-700/60 text-[11px] transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog View Section */}
      <section className="py-12 sm:py-16 bg-[#081528] border-b border-slate-800 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Results Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 text-xs text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span>Showing <strong className="text-white">{filteredServices.length}</strong> of {servicesData.length} capabilities</span>
              {activeCategory !== 'all' && (
                <span className="px-2 py-0.5 bg-[#00D4FF]/10 text-[#00D4FF] rounded border border-[#00D4FF]/30 text-[11px]">
                  {DOMAIN_CATEGORIES.find((c) => c.id === activeCategory)?.name}
                </span>
              )}
            </div>

            {(searchQuery || activeCategory !== 'all' || sortBy !== 'default') && (
              <button
                onClick={handleResetFilters}
                className="text-[#00D4FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8 max-w-lg mx-auto shadow-xl">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/20 mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No matching services found</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                We did not find any service matching &ldquo;<span className="text-white font-medium">{searchQuery}</span>&rdquo;.
                KJT TECHNOLOGIES engineers custom solutions for specialized requirements.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleResetFilters}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-widest rounded-xl transition"
                >
                  Reset Filters
                </button>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl border border-slate-700 transition"
                >
                  Ask Engineering Desk
                </Link>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            
            /* =====================================================================
             * GRID VIEW: Rich Visual Cards
             * ===================================================================== */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((svc) => (
                <div
                  key={svc.id}
                  id={svc.slug}
                  className="bg-slate-800/40 rounded-2xl border border-slate-700/60 hover:border-[#00D4FF]/50 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
                >
                  <div>
                    {/* Visual Card Header */}
                    <div className="relative h-48 w-full bg-slate-900 overflow-hidden border-b border-slate-700/60">
                      <img
                        src={svc.image}
                        alt={svc.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      {/* Icon */}
                      <div className="absolute top-3.5 left-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#0A192F]/90 backdrop-blur-md text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/40 shadow-md">
                          <ServiceIcon name={svc.iconName} className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-[#0A192F]/90 text-[#00D4FF] border border-[#00D4FF]/30 shadow">
                        {svc.badge}
                      </span>

                      {/* Delivery Timeframe */}
                      {svc.deliveryTimeframe && (
                        <div className="absolute bottom-3 left-3.5 text-[11px] text-slate-300 font-medium flex items-center gap-1.5 bg-[#0A192F]/90 px-2.5 py-1 rounded-md border border-slate-700/60">
                          <Clock className="w-3 h-3 text-[#00D4FF]" />
                          <span>{svc.deliveryTimeframe}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#00D4FF] transition-colors leading-snug">
                        {svc.title}
                      </h3>

                      <p className="text-xs text-[#00D4FF] font-medium leading-relaxed">
                        {svc.tagline}
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {svc.shortDescription}
                      </p>

                      {/* Top Deliverables */}
                      <div className="pt-3 space-y-1.5 border-t border-slate-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Included Deliverables:
                        </span>
                        {svc.whatIsIncluded.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-6 pt-0 space-y-2.5">
                    <Link
                      to={`/services/${svc.slug}`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-[#00D4FF] text-slate-200 hover:text-[#0A192F] border border-slate-700 hover:border-[#00D4FF] transition flex items-center justify-center gap-2"
                    >
                      <span>Specifications &amp; Process</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Secondary Actions Row: Quote, Consultation & Direct WhatsApp */}
                    <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                      <Link
                        to={`/request-quote?service=${encodeURIComponent(svc.title)}`}
                        className="py-1.5 px-1.5 rounded-lg text-[11px] font-bold text-center border border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/10 transition flex items-center justify-center"
                        title={`Request quote for ${svc.title}`}
                      >
                        Quote
                      </Link>

                      <Link
                        to={`/book-consultation?service=${encodeURIComponent(svc.title)}`}
                        className="py-1.5 px-1.5 rounded-lg text-[11px] font-bold text-center bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition flex items-center justify-center"
                        title={`Book consultation for ${svc.title}`}
                      >
                        Consult
                      </Link>

                      <WhatsAppButton
                        variant="service"
                        serviceName={svc.title}
                        label="Chat"
                        size="sm"
                        className="py-1.5 px-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            
            /* =====================================================================
             * DIRECTORY LIST VIEW: High-Efficiency Scannable Table
             * ===================================================================== */
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Service &amp; Domain</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Key Deliverables</th>
                      <th className="py-3.5 px-4 hidden lg:table-cell">Delivery Window</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-ui">
                    {filteredServices.map((svc) => (
                      <tr
                        key={svc.id}
                        className="hover:bg-slate-800/40 transition group"
                      >
                        {/* Service Title, Badge, Description */}
                        <td className="py-4 px-4 sm:px-6 max-w-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 text-[#00D4FF] flex items-center justify-center flex-shrink-0 border border-slate-700/60 mt-0.5">
                              <ServiceIcon name={svc.iconName} className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/services/${svc.slug}`}
                                  className="font-bold text-white text-sm group-hover:text-[#00D4FF] transition"
                                >
                                  {svc.title}
                                </Link>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#0A192F] text-[#00D4FF] border border-[#00D4FF]/30">
                                  {svc.badge}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs line-clamp-1 leading-relaxed">
                                {svc.shortDescription}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Deliverables */}
                        <td className="py-4 px-4 hidden md:table-cell text-slate-400 max-w-xs">
                          <div className="space-y-1">
                            {svc.whatIsIncluded.slice(0, 2).map((inc, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                                <CheckCircle2 className="w-3 h-3 text-[#00D4FF] flex-shrink-0" />
                                <span className="truncate">{inc}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Delivery Timeframe */}
                        <td className="py-4 px-4 hidden lg:table-cell text-slate-300 font-medium">
                          {svc.deliveryTimeframe ? (
                            <div className="flex items-center gap-1.5 text-xs">
                              <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
                              <span>{svc.deliveryTimeframe}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* Quick Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/services/${svc.slug}`}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-[#00D4FF] text-slate-200 hover:text-[#0A192F] rounded-lg text-xs font-bold transition"
                            >
                              Details
                            </Link>
                            <Link
                              to={`/request-quote?service=${encodeURIComponent(svc.title)}`}
                              className="px-2.5 py-1.5 border border-[#00D4FF]/40 text-[#00D4FF] hover:bg-[#00D4FF]/10 rounded-lg text-xs font-semibold transition hidden sm:inline-block"
                            >
                              Quote
                            </Link>
                            <WhatsAppButton
                              variant="service"
                              serviceName={svc.title}
                              label="Chat"
                              size="sm"
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Corporate Call to Action Section */}
      <CTASection />
    </div>
  );
};
