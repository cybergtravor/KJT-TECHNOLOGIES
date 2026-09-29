import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projectsData';
import { Button } from '../components/common/Button';
import { CheckCircle, ArrowRight, Calendar, Building, ExternalLink, ChevronRight, Info } from 'lucide-react';
import { CTASection } from '../components/home/CTASection';
import { SEOHead } from '../components/common/SEOHead';

const categories = [
  'All',
  'Websites',
  'Mobile applications',
  'Desktop applications',
  'School systems',
  'Business systems',
  'Cybersecurity',
  'Networking',
  'CCTV installations',
];

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects =
    selectedCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="Featured Client Projects & Engineering Portfolio | KJT TECHNOLOGIES"
        description="Explore verified client case studies: Enterprise ERPs, cybersecurity hardening, school management platforms, 4K CCTV surveillance networks, and corporate web applications."
        canonicalPath="/projects"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Projects & Case Studies', item: '/projects' },
        ]}
      />
      {/* Portfolio Header */}
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
            <Link to="/" className="hover:text-[#00D4FF]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00D4FF]">Portfolio</span>
          </div>

          <div className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
            Technical Deployments &amp; Case Studies
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto">
            Engineering Projects &amp; Proven Impact
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Explore our engineering case studies spanning custom websites, mobile apps, school management systems, business ERPs, cybersecurity defense, fiber networking, and 4K CCTV surveillance.
          </p>

          {/* Editable Portfolio Notice Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-sm text-xs text-slate-300 max-w-xl mx-auto">
            <Info className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
            <span>
              <strong>Note:</strong> Demonstration projects below are labeled as <em>[Sample Project]</em> for portfolio presentation until replaced with your live client data in <code>src/data/projectsData.ts</code>.
            </span>
          </div>
        </div>
      </section>

      {/* Category Filter Buttons */}
      <section className="py-6 bg-[#081528] border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none justify-start lg:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00D4FF] text-[#0A192F] shadow-lg shadow-[#00D4FF]/20 font-bold'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-[#00D4FF]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-[#081528] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Showing {filteredProjects.length} Projects in {selectedCategory}</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-[#00D4FF] hover:underline cursor-pointer"
              >
                View All Categories
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-800/40 rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden hover:border-[#00D4FF]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Header */}
                  <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-[#0A192F]/90 text-[#00D4FF] border border-[#00D4FF]/40">
                        {project.category}
                      </span>
                      {project.isSampleProject && (
                        <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Sample Project
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                      {project.clientName && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Building className="w-3.5 h-3.5 text-[#00D4FF]" />
                          {project.clientName}
                        </span>
                      )}
                      {project.year && (
                        <span className="flex items-center gap-1 text-slate-400 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-[#00D4FF]" />
                          {project.year}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#00D4FF] transition-colors leading-snug">
                      {project.title}
                    </h2>

                    {/* Short Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                      {project.shortDescription}
                    </p>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {project.fullDescription}
                    </p>

                    {/* Challenge & Solution Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-sm">
                        <span className="font-bold text-amber-400 block mb-1 uppercase text-[10px] tracking-widest">
                          The Challenge:
                        </span>
                        <p className="text-slate-400 leading-relaxed">{project.challenge}</p>
                      </div>
                      <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-sm">
                        <span className="font-bold text-[#00D4FF] block mb-1 uppercase text-[10px] tracking-widest">
                          The Solution:
                        </span>
                        <p className="text-slate-400 leading-relaxed">{project.solution}</p>
                      </div>
                    </div>

                    {/* Measurable Results Checklist */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-2">
                        Quantified Results &amp; ROI:
                      </span>
                      <div className="space-y-1.5">
                        {project.results.map((res, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                            <CheckCircle className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0 mt-0.5" />
                            <span>{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Tech Stack & Actions */}
                <div className="p-6 sm:p-8 pt-0 border-t border-slate-800 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologiesUsed.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-sm text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {project.projectLink && (
                      <a
                        href={project.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-xs font-bold text-slate-400 hover:text-[#00D4FF] inline-flex items-center gap-1 transition"
                        title="View Project Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <Button
                      to={`/contact?service=${encodeURIComponent(project.category)}`}
                      variant="cyan"
                      size="sm"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Inquire Similar Project
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
};
