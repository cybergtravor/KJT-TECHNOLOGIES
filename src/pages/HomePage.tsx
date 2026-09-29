import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { HeroSection } from '../components/home/HeroSection';
import { StatsCounter } from '../components/common/StatsCounter';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { WorkingProcess } from '../components/home/WorkingProcess';
import { TechStackSection } from '../components/home/TechStackSection';
import { CTASection } from '../components/home/CTASection';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { servicesData } from '../data/servicesData';
import { projectsData } from '../data/projectsData';
import { testimonialsData } from '../data/testimonialsData';
import { NewsletterForm } from '../components/common/NewsletterForm';
import { SEOHead } from '../components/common/SEOHead';

export const HomePage: React.FC = () => {
  const featuredProjects = projectsData.slice(0, 3);

  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="KJT TECHNOLOGIES | Software, Cybersecurity and IT Solutions"
        description="Accelerating Innovation, Securing Data. KJT TECHNOLOGIES delivers enterprise software development, cybersecurity defense, commercial CCTV installation, high-speed computer networking, and cloud IT infrastructure."
        canonicalPath="/"
      />
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Trusted Company Statistics Section */}
      <section className="py-16 bg-[#081528] border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm mb-3">
              Measurable Performance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Proven Track Record of Engineering &amp; Cyber Defense
            </h2>
          </div>
          <StatsCounter />
        </div>
      </section>

      {/* 3. Featured Services Section */}
      <section className="py-24 bg-[#0A192F] border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <SectionHeading
              badge="Core Capabilities"
              title="Enterprise Technology Solutions"
              subtitle="From bespoke software engineering and cloud transformation to physical optical CCTV and perimeter cyber defense."
              align="left"
              theme="dark"
            />
            <Button
              to="/services"
              variant="outline-white"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              View All Services
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((svc) => (
              <div
                key={svc.id}
                className="bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-xl hover:border-[#00D4FF]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Header with Badge */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-[#0A192F]/90 text-[#00D4FF] border border-[#00D4FF]/40">
                    {svc.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00D4FF] transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-5">
                      {svc.shortDescription}
                    </p>

                    {/* Key features checklist */}
                    <div className="space-y-2 pt-3 border-t border-slate-800 mb-6">
                      {(svc.keyFeatures || svc.whatIsIncluded || []).slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/services/${svc.slug}`}
                    className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-sm bg-slate-800/60 hover:bg-[#00D4FF] text-slate-200 hover:text-[#0A192F] text-xs uppercase tracking-widest font-bold transition-all duration-200 border border-slate-700/60"
                  >
                    <span>Detailed Specifications</span>
                    <ArrowRight className="w-4 h-4 text-[#00D4FF] group-hover:text-[#0A192F]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 5. Working Process Section */}
      <WorkingProcess />

      {/* 6. Featured Projects / Portfolio Section */}
      <section className="py-24 bg-[#081528] border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <SectionHeading
              badge="Case Studies"
              title="Recent Enterprise Deployments"
              subtitle="Real-world results delivered for fintech leaders, academic campuses, healthcare providers, and logistics hubs."
              align="left"
              theme="dark"
            />
            <Button
              to="/projects"
              variant="outline-white"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Browse Full Portfolio
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-xl hover:border-[#00D4FF]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm bg-[#0A192F]/90 text-[#00D4FF] border border-[#00D4FF]/40">
                      {proj.category}
                    </span>
                    <span className="absolute bottom-3 left-3 text-xs font-semibold text-white/90">
                      Client: {proj.clientName || proj.client || 'Enterprise Partner'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 sm:p-7">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00D4FF] transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {proj.shortDescription}
                    </p>

                    {/* Results Snapshot */}
                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block">
                        Measurable Outcome
                      </span>
                      <p className="text-xs font-semibold text-slate-200">
                        &bull; {proj.results[0]}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologiesUsed.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-sm text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#00D4FF] hover:text-white transition group-hover:underline"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials Section */}
      <section className="py-24 bg-[#0A192F] border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Client Feedback"
            title="Trusted by Chief Technology Officers &amp; Directors"
            subtitle="Representative client feedback highlighting our engineering rigor, SLA dependability, and rapid problem resolution across past deployments."
            align="center"
            theme="dark"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/40 rounded-2xl p-7 border border-slate-700/50 shadow-xl hover:border-[#00D4FF]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#00D4FF] text-[#00D4FF]" />
                    ))}
                    <span className="text-xs font-bold text-slate-400 ml-2">5.0 / 5.0</span>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                    “{item.content}”
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.role}</p>
                    <p className="text-[11px] font-bold text-[#00D4FF]">{item.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Technology Stack Section */}
      <TechStackSection />

      {/* 9. Standalone Newsletter Subscription Callout */}
      <section className="py-20 bg-[#081528] text-white border-b border-slate-800 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm mb-2">
            Stay Ahead of Emerging Cyber Threats
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Subscribe to KJT Technology &amp; Security Dispatch
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Get practical Zero-Trust checklists, cloud architecture benchmarks, and enterprise IT best practices directly to your inbox once a month.
          </p>
          <div className="pt-4 max-w-md mx-auto">
            <NewsletterForm theme="dark" />
          </div>
        </div>
      </section>

      {/* 10. Call To Action Section */}
      <CTASection />
    </div>
  );
};
