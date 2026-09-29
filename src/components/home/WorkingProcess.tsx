import React from 'react';
import { Search, Compass, ShieldCheck, Activity } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery & Security Audit",
    description: "We analyze your existing workflows, vulnerabilities, network topology, and business objectives under a non-disclosure agreement."
  },
  {
    number: "02",
    icon: Compass,
    title: "Architecture & Blueprint",
    description: "Our certified engineers produce a concrete architecture blueprint, milestone roadmap, and cost-optimized tech stack specification."
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Deployment & Hardening",
    description: "We build, configure, and stress-test your software, cabling, CCTV, or cloud servers with penetration testing and quality verification."
  },
  {
    number: "04",
    icon: Activity,
    title: "24/7 Monitoring & SLA Support",
    description: "Continuous telemetry, proactive patching, rapid incident mitigation, and regular executive reviews keep your digital assets bulletproof."
  }
];

export const WorkingProcess: React.FC = () => {
  return (
    <section className="py-24 bg-[#0A192F] border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Execution Methodology"
          title="Our Structured Working Process"
          subtitle="A predictable, transparent delivery framework that ensures projects launch on schedule with zero security compromises."
          align="center"
          theme="dark"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between hover:border-[#00D4FF]/50 hover:shadow-lg transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-2xl font-bold text-[#00D4FF]">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] group-hover:bg-[#00D4FF] group-hover:text-[#0A192F] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-white mb-2 group-hover:text-[#00D4FF] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-bold uppercase tracking-widest text-[#00D4FF]">
                  Phase {step.number} Sign-off
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
