/**
 * =====================================================================
 * EMERGING TECHNOLOGY TRENDS RADAR - COMPONENT
 * =====================================================================
 * 
 * Interactive trend showcase displaying the key technological waves
 * shaping East African enterprise and global commerce.
 * =====================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  ShieldAlert,
  Globe2,
  Zap,
  TrendingUp,
  Layers,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { emergingTrendsData, EmergingTrendItem } from '../../data/emergingTrendsData';

interface EmergingTrendsSectionProps {
  onSelectCategory?: (category: string) => void;
}

export const EmergingTrendsSection: React.FC<EmergingTrendsSectionProps> = ({ onSelectCategory }) => {
  const [selectedTrend, setSelectedTrend] = useState<EmergingTrendItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filterOptions = ['All', 'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'Emerging Technology', 'Business Technology'];

  const filteredTrends = activeFilter === 'All'
    ? emergingTrendsData
    : emergingTrendsData.filter((t) => t.categoryBadge === activeFilter || t.relatedCategory === activeFilter);

  return (
    <section className="py-16 bg-slate-900/60 border-y border-slate-800 relative overflow-hidden" id="emerging-trends-radar">
      {/* Background visual accents */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#0055FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Technology Horizon & Strategic Radar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Emerging Technology Trends to Watch
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore the critical technological forces—from Agentic AI and Industrial IoT to Quantum-Safe encryption and sustainable computing—reshaping enterprises across Uganda and the global economy.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition cursor-pointer ${
                  activeFilter === opt
                    ? 'bg-[#00D4FF] text-[#0A192F] shadow-lg shadow-[#00D4FF]/20'
                    : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:text-white hover:border-slate-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrends.map((trend) => (
            <div
              key={trend.id}
              className="group bg-slate-800/40 hover:bg-slate-800/70 rounded-2xl border border-slate-700/60 hover:border-[#00D4FF]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={trend.image}
                    alt={trend.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border backdrop-blur-md ${trend.badgeColor}`}>
                      {trend.categoryBadge}
                    </span>
                  </div>

                  {/* Impact Score */}
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-xs font-bold text-white flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#00D4FF]" />
                    <span>{trend.impactScore}/10</span>
                  </div>

                  {/* Maturity Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-semibold text-slate-300 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
                      Phase: {trend.maturityLevel}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00D4FF] transition-colors line-clamp-2">
                    {trend.title}
                  </h3>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {trend.summary}
                  </p>

                  {/* Real World Impact */}
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#00D4FF] font-bold uppercase tracking-wider text-[10px]">
                      <Zap className="w-3 h-3" />
                      <span>Real-World Application</span>
                    </div>
                    <p className="text-slate-300 leading-snug">
                      {trend.realWorldApplication}
                    </p>
                  </div>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trend.keyTechnologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-sm bg-slate-900/90 text-slate-400 text-[10px] font-medium border border-slate-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                {trend.relatedArticleSlug ? (
                  <Link
                    to={`/blog/${trend.relatedArticleSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00D4FF] hover:text-white transition group/link"
                  >
                    <span>Read In-Depth Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(trend.relatedCategory)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#00D4FF] transition"
                  >
                    <span>View {trend.relatedCategory} Insights</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setSelectedTrend(trend)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Quick Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Details Modal */}
        {selectedTrend && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedTrend(null)}
          >
            <div
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTrend(null)}
                aria-label="Close trend details modal"
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                &times;
              </button>

              <div className="space-y-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${selectedTrend.badgeColor}`}>
                  {selectedTrend.categoryBadge}
                </span>
                <h3 className="text-2xl font-bold text-white pt-1">
                  {selectedTrend.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Maturity Phase: <strong className="text-white">{selectedTrend.maturityLevel}</strong> | Impact Score: <strong className="text-[#00D4FF]">{selectedTrend.impactScore}/10</strong>
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedTrend.summary}
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <h4 className="text-xs font-bold text-[#00D4FF] uppercase tracking-wider">
                    Commercial & Industrial Application
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {selectedTrend.realWorldApplication}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Relevance to Uganda & East Africa
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {selectedTrend.eastAfricaRelevance}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
                {selectedTrend.relatedArticleSlug ? (
                  <Link
                    to={`/blog/${selectedTrend.relatedArticleSlug}`}
                    onClick={() => setSelectedTrend(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00D4FF] text-[#0A192F] font-bold text-xs uppercase tracking-wider hover:bg-[#00b8dc] transition"
                  >
                    <span>Read Full Technical Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => setSelectedTrend(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Close Radar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
