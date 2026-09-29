import React from 'react';
import { Link } from 'react-router-dom';
import { companyConfig } from '../config/company';
import { ChevronRight } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="Terms & Conditions of Engagement | KJT TECHNOLOGIES"
        description="Master Services Agreement, project milestones, warranty periods, and technical service delivery terms for KJT TECHNOLOGIES."
        canonicalPath="/terms"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Terms & Conditions', item: '/terms' },
        ]}
      />
      <section className="py-20 bg-[#0A192F] text-slate-200 border-b border-slate-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            <Link to="/" className="hover:text-[#00D4FF]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#00D4FF]">Terms and Conditions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Terms &amp; Conditions of Engagement
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Standard Master Services Agreement (MSA) Guidelines &bull; {companyConfig.legalName}
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#081528] border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p className="text-slate-400">
              By accessing this website, engaging {companyConfig.name} for technical audits, custom software engineering, network infrastructure, CCTV installations, or managed cybersecurity services, you agree to be bound by these Terms and Conditions. Individual enterprise statements of work (SOWs) and Master Services Agreements (MSAs) supersede these general terms in the event of any conflict.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">2. Intellectual Property Rights</h2>
            <p className="text-slate-400 mb-3">
              Unless otherwise agreed in a customized Statement of Work:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 text-sm">
              <li><strong className="text-white">Client Deliverables:</strong> Upon full payment of agreed project milestones, all custom software code, designs, database schemas, and documentation created specifically for the Client transfer entirely to Client ownership.</li>
              <li><strong className="text-white">Pre-Existing Tools &amp; Libraries:</strong> KJT TECHNOLOGIES retains ownership of proprietary scaffolding frameworks, security diagnostic scripts, and generic libraries used to accelerate delivery.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">3. Mutual Confidentiality &amp; Non-Disclosure</h2>
            <p className="text-slate-400">
              Both parties agree to hold in strict confidence all proprietary technical data, financial records, passwords, architecture diagrams, and trade secrets disclosed during any engagement. This obligation survives termination of the contract for a period of five (5) years.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">4. Warranties &amp; Service Level Agreements (SLAs)</h2>
            <p className="text-slate-400">
              KJT TECHNOLOGIES warrants that all services will be executed in a professional, workmanlike manner conforming to prevailing industry standards (including OWASP Top 10, IEEE cabling guidelines, and ISO 27001). We provide a standard 30-day post-launch warranty on custom code deliverables to remediate functional defects.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">5. Limitation of Liability</h2>
            <p className="text-slate-400">
              In no event shall {companyConfig.legalName} or its directors be liable for indirect, punitive, or consequential damages resulting from third-party ISP outages, zero-day vulnerabilities in third-party hardware, or client misconfiguration of credentials, beyond the total fees paid under the applicable Statement of Work.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-2">6. Governing Law</h2>
            <p className="text-slate-400">
              These terms are governed by and construed in accordance with the laws of California, United States, without regard to conflict of law principles.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              For legal inquiries regarding contracts or customized Master Services Agreements, please contact: <a href={`mailto:${companyConfig.contact.primaryEmail}`} className="text-[#00D4FF] font-semibold underline">{companyConfig.contact.primaryEmail}</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
