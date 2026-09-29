import React from 'react';
import { ShieldCheck, Award, Zap, HeartHandshake, Lock, Layers } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const reasons = [
  {
    icon: ShieldCheck,
    title: "Security-First by Design",
    description:
      "We don't tack security on as an afterthought. Every software line, network switch, and cloud container is built to rigorous Zero-Trust principles and OWASP standards.",
    badge: "Air-Tight Defense"
  },
  {
    icon: Award,
    title: "Certified Enterprise Engineers",
    description:
      "Our specialists hold gold-standard industry certifications including CISSP, AWS Certified Solutions Architect, Cisco CCNP, and Microsoft Enterprise Administrator.",
    badge: "Industry Certified"
  },
  {
    icon: Zap,
    title: "High Performance & Zero Fluff",
    description:
      "We engineer lean, high-throughput systems. By eliminating bloated frameworks and optimizing queries, we deliver sub-second response times and 99.99% uptime.",
    badge: "Extreme Speed"
  },
  {
    icon: Layers,
    title: "Complete End-to-End Stack",
    description:
      "From physical Cat6A cabling and 4K optical CCTV to scalable cloud Kubernetes clusters and bespoke web software, we handle your entire technology lifecycle.",
    badge: "Turnkey Coverage"
  },
  {
    icon: Lock,
    title: "Strict Confidentiality & NDAs",
    description:
      "Your intellectual property and proprietary trade data are completely safeguarded with binding corporate NDAs, encrypted communications, and restricted access vaults.",
    badge: "Confidential"
  },
  {
    icon: HeartHandshake,
    title: "Transparent & Accountable SLA",
    description:
      "No hidden fees or unexpected downtime. Our Service Level Agreements clearly specify response windows under 15 minutes for mission-critical alerts.",
    badge: "Guaranteed SLA"
  }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-[#081528] border-b border-slate-800 relative">
      {/* Subtle geometric dot matrix */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why KJT TECHNOLOGIES"
          title="Engineered for Reliability. Built for Defense."
          subtitle="We bridge the gap between aggressive business innovation and impenetrable data protection. Here is why leading enterprises trust our technology advisory."
          align="center"
          theme="dark"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-slate-800/40 rounded-2xl p-7 border border-slate-700/50 hover:border-[#00D4FF]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] bg-[#00D4FF]/10 px-2.5 py-1 rounded-sm border border-[#00D4FF]/30">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00D4FF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
