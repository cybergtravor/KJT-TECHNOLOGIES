import React from 'react';
import { ArrowRight, ShieldCheck, Video, Cloud, Network, Lock, Activity } from 'lucide-react';
import { companyConfig } from '../../config/company';
import { Button } from '../common/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#0A192F] text-slate-200 overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-800">
      {/* Signature Geometric Balance radial dot matrix */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography, Badge, Content & Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* CUSTOMIZE HERE: Motto badge displayed dynamically from src/config/company.ts */}
            <div className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
              {companyConfig.motto}
            </div>

            {/* CUSTOMIZE HERE: Main homepage hero display headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-white">
              Smart Technology Solutions for a{' '}
              <span className="text-[#00D4FF]">Secure Future</span>
            </h1>

            {/* CUSTOMIZE HERE: Short hero intro description */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl font-normal">
              {companyConfig.shortDescription}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                to="/services"
                variant="cyan"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Our Services
              </Button>
              <Button
                to="/about"
                variant="outline-white"
                size="lg"
              >
                About KJT
              </Button>
            </div>

            {/* Geometric Balance Key Stat Bars */}
            <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center gap-8 sm:gap-12">
              <div className="border-l-2 border-[#00D4FF] pl-4">
                <div className="text-2xl sm:text-3xl font-bold text-white font-display">99.9%</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">Uptime Security</div>
              </div>
              <div className="border-l-2 border-[#00D4FF] pl-4">
                <div className="text-2xl sm:text-3xl font-bold text-white font-display">500+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">Projects Delivered</div>
              </div>
              <div className="border-l-2 border-[#00D4FF] pl-4">
                <div className="text-2xl sm:text-3xl font-bold text-white font-display">15+</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">Years Excellence</div>
              </div>
            </div>
          </div>

          {/* Right Column: Geometric Balance Staggered 4-Card Grid (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
            {/* Staggered Geometric Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-[480px] relative z-10">
              
              {/* Card 1: Cybersecurity */}
              <div className="aspect-square bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-end group hover:border-[#00D4FF]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-[#00D4FF]/20 rounded-full mb-4 flex items-center justify-center text-[#00D4FF] group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                  Cybersecurity
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Advanced threat detection &amp; Zero-Trust encryption.
                </p>
              </div>

              {/* Card 2: CCTV Systems (Staggered Downwards) */}
              <div className="aspect-square bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-end group hover:border-[#00D4FF]/50 transition-all duration-300 transform sm:translate-y-6">
                <div className="w-12 h-12 bg-[#00D4FF]/20 rounded-full mb-4 flex items-center justify-center text-[#00D4FF] group-hover:scale-110 transition-transform">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                  CCTV Systems
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Professional surveillance and AI edge analytics.
                </p>
              </div>

              {/* Card 3: Cloud Computing (Staggered Upwards) */}
              <div className="aspect-square bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-end group hover:border-[#00D4FF]/50 transition-all duration-300 transform sm:-translate-y-6">
                <div className="w-12 h-12 bg-[#00D4FF]/20 rounded-full mb-4 flex items-center justify-center text-[#00D4FF] group-hover:scale-110 transition-transform">
                  <Cloud className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                  Cloud Computing
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Scalable container infrastructure &amp; DevOps.
                </p>
              </div>

              {/* Card 4: Networking */}
              <div className="aspect-square bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-end group hover:border-[#00D4FF]/50 transition-all duration-300">
                <div className="w-12 h-12 bg-[#00D4FF]/20 rounded-full mb-4 flex items-center justify-center text-[#00D4FF] group-hover:scale-110 transition-transform">
                  <Network className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00D4FF] transition-colors">
                  Networking
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  High-speed fiber connectivity &amp; Wi-Fi 6/7.
                </p>
              </div>

              {/* Radial Cyan Glow behind cards */}
              <div className="absolute -z-10 w-64 h-64 bg-[#00D4FF]/20 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
