/**
 * =====================================================================
 * WHY CHOOSE US - KJT TECHNOLOGIES
 * =====================================================================
 * Modernized with stagger-reveal animations, glowing card hovers,
 * animated icon rings, and gradient accent backgrounds.
 * =====================================================================
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Zap, HeartHandshake, Lock, Layers } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { AnimatedTechBg } from '../common/AnimatedTechBg';

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Security-First by Design',
    description:
      'We don\'t tack security on as an afterthought. Every software line, network switch, and cloud container is built to rigorous Zero-Trust principles and OWASP standards.',
    badge: 'Air-Tight Defense',
    color: '#00D4FF',
  },
  {
    icon: Award,
    title: 'Certified Enterprise Engineers',
    description:
      'Our specialists hold gold-standard industry certifications including CISSP, AWS Certified Solutions Architect, Cisco CCNP, and Microsoft Enterprise Administrator.',
    badge: 'Industry Certified',
    color: '#38BDF8',
  },
  {
    icon: Zap,
    title: 'High Performance & Zero Fluff',
    description:
      'We engineer lean, high-throughput systems. By eliminating bloated frameworks and optimizing queries, we deliver sub-second response times and 99.99% uptime.',
    badge: 'Extreme Speed',
    color: '#34D399',
  },
  {
    icon: Layers,
    title: 'Complete End-to-End Stack',
    description:
      'From physical Cat6A cabling and 4K optical CCTV to scalable cloud Kubernetes clusters and bespoke web software, we handle your entire technology lifecycle.',
    badge: 'Turnkey Coverage',
    color: '#A78BFA',
  },
  {
    icon: Lock,
    title: 'Strict Confidentiality & NDAs',
    description:
      'Your intellectual property and proprietary trade data are completely safeguarded with binding corporate NDAs, encrypted communications, and restricted access vaults.',
    badge: 'Confidential',
    color: '#F59E0B',
  },
  {
    icon: HeartHandshake,
    title: 'Transparent & Accountable SLA',
    description:
      'No hidden fees or unexpected downtime. Our Service Level Agreements clearly specify response windows under 15 minutes for mission-critical alerts.',
    badge: 'Guaranteed SLA',
    color: '#FB7185',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#081528] border-b border-slate-800 overflow-hidden">
      {/* Animated background */}
      <AnimatedTechBg variant="particles" opacity={0.1} />

      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why KJT TECHNOLOGIES"
          title="Engineered for Reliability. Built for Defense."
          subtitle="We bridge the gap between aggressive business innovation and impenetrable data protection. Here is why leading enterprises trust our technology advisory."
          align="center"
          theme="dark"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: 'easeOut' }}
                className="group relative bg-slate-800/40 rounded-2xl p-7 border border-slate-700/50 hover:border-opacity-60 transition-all duration-300 flex flex-col justify-between shadow-lg overflow-hidden"
                style={{
                  ['--card-color' as string]: item.color,
                }}
              >
                {/* Hover glow border */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${item.color}50, 0 0 30px -8px ${item.color}30` }}
                />

                {/* Corner accent */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-[80px] opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none"
                  style={{ backgroundColor: item.color }}
                />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    {/* Icon ring */}
                    <div
                      className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${item.color}18`, border: `1px solid ${item.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                      {/* Pulse ring */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 animate-ping"
                        style={{ border: `1px solid ${item.color}40` }}
                      />
                    </div>

                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm border"
                      style={{
                        color: item.color,
                        backgroundColor: `${item.color}12`,
                        borderColor: `${item.color}30`,
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <h3
                    className="text-lg font-bold text-white mb-2 group-hover:transition-colors duration-200"
                    style={{ color: undefined }}
                  >
                    <span className="group-hover:text-white">{item.title}</span>
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
