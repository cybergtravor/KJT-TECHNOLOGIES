import React from 'react';
import { companyConfig } from '../../config/company';
import { ShieldCheck, CheckCircle, Clock, Server } from 'lucide-react';

const icons = [CheckCircle, ShieldCheck, Server, Clock];

export const StatsCounter: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {companyConfig.stats.map((stat, idx) => {
        const Icon = icons[idx % icons.length];
        return (
          <div
            key={stat.label}
            className="relative bg-slate-800/40 p-6 sm:p-7 rounded-2xl border border-slate-700/50 border-l-4 border-l-[#00D4FF] shadow-lg hover:border-[#00D4FF]/60 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display group-hover:text-[#00D4FF] transition-colors">
                {stat.value}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#00D4FF] group-hover:text-[#0A192F] transition-colors">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-bold text-white text-sm mb-1">{stat.label}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
};
