import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { faqData } from '../data/faqData';
import { Button } from '../components/common/Button';
import { ChevronDown, Search, HelpCircle, MessageSquare, ChevronRight, Phone } from 'lucide-react';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { companyConfig } from '../config/company';
import { CTASection } from '../components/home/CTASection';
import { SEOHead } from '../components/common/SEOHead';

export const FAQPage: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([faqData[0]?.id || '']);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Technical', 'Pricing', 'Support', 'Security', 'Project'];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="Frequently Asked Questions & IT Support FAQs | KJT TECHNOLOGIES"
        description="Find answers to common questions about our custom software development, cybersecurity assessments, 4K CCTV systems, cloud migration, and project SLAs."
        canonicalPath="/faq"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Frequently Asked Questions', item: '/faq' },
        ]}
        customSchema={{
          '@type': 'FAQPage',
          mainEntity: faqData.slice(0, 10).map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }}
      />
      {/* FAQ Hero */}
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
            <span className="text-[#00D4FF]">FAQ</span>
          </div>

          <div className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
            Knowledge Base &amp; Common Queries
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto">
            Frequently Asked Questions
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Find prompt, straightforward answers regarding our software engineering, network installations, security protocols, pricing models, and project lifecycle.
          </p>

          {/* Search bar */}
          <div className="pt-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword (e.g. pricing, backup, CCTV, React)..."
                aria-label="Search frequently asked questions"
                className="w-full pl-10 pr-4 py-3 rounded-sm bg-slate-800/80 border border-slate-700/80 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-[#00D4FF]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="py-6 bg-[#081528] border-b border-slate-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#00D4FF] text-[#0A192F] shadow-lg shadow-[#00D4FF]/20 font-bold'
                  : 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:border-[#00D4FF]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="py-24 bg-[#081528] border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Showing {filteredFaqs.length} Questions in {activeCategory}</span>
            {(searchQuery || activeCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-[#00D4FF] hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700/50 p-8">
              <HelpCircle className="w-12 h-12 text-[#00D4FF]/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">No matching questions found</h3>
              <p className="text-slate-400 text-sm mb-4">
                Have a specific question or custom technical requirement? Our lead architects are ready to assist.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button to="/contact" variant="cyan" size="sm">
                  Ask Us Directly
                </Button>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-sm hover:text-white border border-slate-700"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => {
                const isOpen = openIds.includes(faq.id);
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-slate-800/60 border-[#00D4FF]/40 shadow-xl'
                        : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF]">
                          {faq.category}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                          {faq.question}
                        </h2>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? 'bg-[#00D4FF] text-[#0A192F] rotate-180'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Still Have Questions Box */}
          <div className="mt-16 p-8 bg-slate-800/40 rounded-2xl border border-slate-700/50 text-center space-y-4 shadow-xl">
            <h3 className="text-xl font-bold text-white">Still have a question?</h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Our engineering desk is available to answer any questions about your project scope, security compliance, or system integration.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button to="/contact" variant="cyan" size="sm">
                Submit a Question
              </Button>
              <WhatsAppButton
                variant="standard"
                size="sm"
                customMessage="Hello KJT TECHNOLOGIES. I have a question about your services."
                label="Chat on WhatsApp"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
};
