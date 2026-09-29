import React from 'react';
import { Button } from '../components/common/Button';
import { Home, ShieldAlert } from 'lucide-react';
import { companyConfig } from '../config/company';
import { SEOHead } from '../components/common/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#0A192F] py-20 px-4 relative overflow-hidden">
      <SEOHead
        title="404 - Page Not Found | KJT TECHNOLOGIES"
        description="The requested page could not be found on KJT TECHNOLOGIES."
        robots="noindex, follow"
      />
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="max-w-md w-full text-center space-y-6 bg-slate-800/40 p-8 sm:p-10 rounded-2xl border border-slate-700/50 shadow-2xl relative">
        <div className="w-16 h-16 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-display font-black text-6xl sm:text-7xl text-white tracking-tight block">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Resource or Endpoint Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The page or route you are looking for has been moved, renamed, or does not exist in the {companyConfig.name} portal.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to="/" variant="cyan" size="md" icon={<Home className="w-4 h-4" />}>
            Return to Homepage
          </Button>
          <Button to="/services" variant="outline-white" size="md">
            Explore Services
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
          Need assistance? Email us at <a href={`mailto:${companyConfig.contact.supportEmail}`} className="text-[#00D4FF] font-semibold">{companyConfig.contact.supportEmail}</a>
        </div>
      </div>
    </div>
  );
};
