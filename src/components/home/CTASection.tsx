import React from 'react';
import { ArrowRight, Phone, MessageSquare, Shield } from 'lucide-react';
import { companyConfig } from '../../config/company';
import { Button } from '../common/Button';

export const CTASection: React.FC = () => {
  return (
    <section className="relative py-24 bg-[#0A192F] text-slate-200 overflow-hidden border-t border-slate-800">
      {/* Signature Geometric Balance radial dot matrix */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
          Confidential Discovery &bull; Rapid NDA
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Ready to Accelerate Innovation and Safeguard Your Mission-Critical Data?
        </h2>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Whether you need a custom enterprise application, an impenetrable cybersecurity posture, or high-speed network infrastructure, our senior engineers are ready to assist.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Button
            to="/request-quote"
            variant="cyan"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Request a Quote
          </Button>

          <Button
            to="/book-consultation"
            variant="outline-cyan"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Book a Consultation
          </Button>

          <Button
            href={`tel:${companyConfig.contact.primaryPhone.replace(/[^+\d]/g, '')}`}
            variant="outline-white"
            size="lg"
            icon={<Phone className="w-4 h-4 text-[#00D4FF]" />}
            iconPosition="left"
          >
            Call {companyConfig.contact.displayPhone}
          </Button>

          <Button
            href={companyConfig.contact.whatsappLink}
            external
            variant="whatsapp"
            size="lg"
            icon={<MessageSquare className="w-4 h-4" />}
            iconPosition="left"
          >
            WhatsApp Direct
          </Button>
        </div>

        <p className="text-xs text-slate-500 uppercase tracking-widest pt-4 font-semibold">
          Direct response from certified solutions architects &bull; No obligation discovery assessment
        </p>
      </div>
    </section>
  );
};
