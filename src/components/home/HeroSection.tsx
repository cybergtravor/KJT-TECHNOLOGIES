/**
 * =====================================================================
 * HERO SECTION - KJT TECHNOLOGIES
 * =====================================================================
 * Modernized with:
 * - Animated particle node canvas (AnimatedTechBg)
 * - SVG orbit rings (TechOrbitRings)
 * - Floating data-stream badges with pulse animations
 * - Stagger-reveal entrance via motion/react
 * - Circuit-style accent lines
 * =====================================================================
 */

import React from 'react';
import { ArrowRight, Lock, Video, Cloud, Network, Shield, Cpu, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { companyConfig } from '../../config/company';
import { Button } from '../common/Button';
import { AnimatedTechBg } from '../common/AnimatedTechBg';
import { TechOrbitRings } from '../common/TechOrbitRings';

// Floating status badge shown in the hero visual column
const StatusBadge: React.FC<{ icon: React.ReactNode; label: string; value: string; delay?: number }> = ({
  icon, label, value, delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.92 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.55, ease: 'easeOut' }}
    className="flex items-center gap-2.5 bg-[#0A192F]/90 border border-[#00D4FF]/30 backdrop-blur-sm rounded-xl px-3.5 py-2.5 shadow-lg"
  >
    <span className="text-[#00D4FF] flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{label}</div>
      <div className="text-xs font-bold text-white truncate">{value}</div>
    </div>
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0 ml-auto" />
  </motion.div>
);

// Service capability card for the staggered grid
const CapabilityCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
  offset?: string;
}> = ({ icon, title, desc, delay = 0, offset = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className={`aspect-square bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-end group hover:border-[#00D4FF]/60 hover:bg-slate-800/70 transition-all duration-300 ${offset}`}
    style={{ backdropFilter: 'blur(6px)' }}
  >
    <div className="w-11 h-11 bg-[#00D4FF]/15 rounded-xl mb-3.5 flex items-center justify-center text-[#00D4FF] group-hover:bg-[#00D4FF]/25 group-hover:scale-110 transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-base font-bold text-white group-hover:text-[#00D4FF] transition-colors leading-snug">
      {title}
    </h3>
    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{desc}</p>
  </motion.div>
);

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-[#0A192F] text-slate-200 overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 border-b border-slate-800">
      {/* Layer 1: Animated particle canvas */}
      <AnimatedTechBg variant="full" opacity={0.22} />

      {/* Layer 2: Radial vignette gradient */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[ellipse_80%_60%_at_50%_0%] from-[#00D4FF]/5 via-transparent to-transparent" />

      {/* Layer 3: Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A192F] to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6 text-left">

            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              {companyConfig.motto}
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.65, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] text-white tracking-tight"
            >
              Smart Technology{' '}
              <span className="relative inline-block">
                <span className="text-[#00D4FF]">Solutions</span>
                {/* Underline accent */}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="4"
                  viewBox="0 0 200 4"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 2 Q50 0 100 2 Q150 4 200 2"
                    stroke="#00D4FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </span>{' '}
              for a Secure Future
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
              className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl"
            >
              {companyConfig.shortDescription}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.55, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button to="/services" variant="cyan" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
                Explore Our Services
              </Button>
              <Button to="/about" variant="outline-white" size="lg">
                About KJT
              </Button>
            </motion.div>

            {/* Animated live metric badges */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <StatusBadge icon={<Shield className="w-3.5 h-3.5" />} label="Threat Status" value="All Systems Secure" delay={0.45} />
              <StatusBadge icon={<Cpu className="w-3.5 h-3.5" />} label="SOC Monitoring" value="24 / 7 / 365 Active" delay={0.5} />
              <StatusBadge icon={<Globe className="w-3.5 h-3.5" />} label="Service Region" value="Uganda & East Africa" delay={0.55} />
            </motion.div>

            {/* Key stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center gap-8 sm:gap-12"
            >
              {[
                { value: '99.9%', label: 'Uptime Security' },
                { value: '500+', label: 'Projects Delivered' },
                { value: '15+', label: 'Years Excellence' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.08, duration: 0.4 }}
                  className="border-l-2 border-[#00D4FF] pl-4"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────────────── */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-8 lg:pt-0">
            {/* Orbit rings (decorative, behind the grid) */}
            <TechOrbitRings
              size={400}
              className="-z-0 opacity-70 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            {/* Staggered 2×2 capability card grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-[480px] relative z-10">
              <CapabilityCard
                icon={<Lock className="w-5 h-5" />}
                title="Cybersecurity"
                desc="Advanced threat detection & Zero-Trust encryption."
                delay={0.3}
              />
              <CapabilityCard
                icon={<Video className="w-5 h-5" />}
                title="CCTV Systems"
                desc="Professional surveillance with AI edge analytics."
                delay={0.38}
                offset="sm:translate-y-6"
              />
              <CapabilityCard
                icon={<Cloud className="w-5 h-5" />}
                title="Cloud Computing"
                desc="Scalable container infrastructure & DevOps."
                delay={0.46}
                offset="sm:-translate-y-6"
              />
              <CapabilityCard
                icon={<Network className="w-5 h-5" />}
                title="Networking"
                desc="High-speed fiber connectivity & Wi-Fi 6/7."
                delay={0.54}
              />
            </div>

            {/* Radial cyan glow behind cards */}
            <div className="absolute -z-10 w-72 h-72 bg-[#00D4FF]/15 rounded-full blur-[110px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom circuit line accents */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full pointer-events-none opacity-20"
        height="32"
        preserveAspectRatio="none"
        viewBox="0 0 1440 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="0,28 80,28 100,8 200,8 220,28 400,28 420,8 520,8 540,28 720,28 740,8 840,8 860,28 1040,28 1060,8 1160,8 1180,28 1440,28"
          stroke="#00D4FF"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </section>
  );
};
