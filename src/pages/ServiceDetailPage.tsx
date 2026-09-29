import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesData } from '../data/servicesData';
import { ContactForm } from '../components/common/ContactForm';
import { Button } from '../components/common/Button';
import { ServiceIcon } from '../components/common/ServiceIcon';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { companyConfig } from '../config/company';
import {
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Layers,
  ArrowRight,
  ChevronRight,
  Zap,
  Users,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { CTASection } from '../components/home/CTASection';
import { SEOHead } from '../components/common/SEOHead';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // Support friendly URL aliases (e.g., /services/web-development or /services/cybersecurity)
  const slugAliases: Record<string, string> = {
    'web-development': 'website-design-and-development',
    'web-app-development': 'web-application-development',
    'cybersecurity': 'cybersecurity-services',
    'cctv-installation': 'cctv-and-security-camera-installation',
    'data-protection': 'data-protection-and-backup-solutions',
    'data-backup': 'data-protection-and-backup-solutions',
    'networking': 'computer-networking',
    'hosting': 'domain-registration-and-web-hosting',
    'seo': 'search-engine-optimization',
    'ui-ux': 'ui-ux-design',
    'biometric-systems': 'access-control-and-biometric-systems',
    'consulting': 'digital-transformation-consulting',
  };

  const resolvedSlug = slug && slugAliases[slug] ? slugAliases[slug] : slug;
  const service = servicesData.find((s) => s.slug === resolvedSlug || s.id === resolvedSlug || s.slug === slug || s.id === slug);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-[#0A192F] text-slate-200">
        <h2 className="text-3xl font-bold text-white mb-2">Service Not Found</h2>
        <p className="text-slate-400 mb-6 max-w-md text-sm">
          The requested technology service could not be located in our portfolio.
        </p>
        <Button to="/services" variant="cyan">
          Back to All Services
        </Button>
      </div>
    );
  }

  // Pre-filled WhatsApp enquiry link with the specific service title
  const whatsappCleanNumber = companyConfig.contact.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappServiceMessage = encodeURIComponent(
    `Hello KJT TECHNOLOGIES. I would like to ask about your ${service.title} service.`
  );
  const whatsappServiceUrl = `https://wa.me/${whatsappCleanNumber}?text=${whatsappServiceMessage}`;

  // Find related services by slug matching
  const relatedServicesList = (service.relatedServices || [])
    .map((relSlug) => servicesData.find((s) => s.slug === relSlug || s.id === relSlug))
    .filter((s): s is typeof service => !!s)
    .slice(0, 3);

  // If none matched, fallback to 3 other services
  const fallbackRelated = servicesData.filter((s) => s.id !== service.id).slice(0, 3);
  const displayRelated = relatedServicesList.length > 0 ? relatedServicesList : fallbackRelated;

  const scrollToContactForm = () => {
    const el = document.getElementById('service-consultation-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title={`${service.title} | KJT TECHNOLOGIES`}
        description={service.shortDescription}
        canonicalPath={`/services/${service.slug}`}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Services', item: '/services' },
          { name: service.title, item: `/services/${service.slug}` },
        ]}
        customSchema={{
          '@type': 'Service',
          name: service.title,
          description: service.shortDescription,
          provider: {
            '@type': 'LocalBusiness',
            name: 'KJT TECHNOLOGIES',
            telephone: companyConfig.contact.primaryPhone,
            url: 'https://kjttechnologies.com',
          },
          serviceType: service.badge,
          offers: {
            '@type': 'Offer',
            price: service.pricingRange || 'Custom Quote',
            priceCurrency: 'USD',
          },
        }}
      />
      {/* Header Banner */}
      <section className="relative py-20 lg:py-24 bg-[#0A192F] text-slate-200 overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex-wrap">
            <Link to="/" className="hover:text-[#00D4FF] transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/services" className="hover:text-[#00D4FF] transition">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00D4FF]">{service.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-sm bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/30">
                  <ServiceIcon name={service.iconName} className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
                  {service.badge}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {service.title}
              </h1>

              <p className="text-lg sm:text-xl text-[#00D4FF] font-medium leading-relaxed">
                {service.tagline}
              </p>

              {/* Short Summary */}
              <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
                {service.shortDescription}
              </p>

              {/* Delivery & Pricing pills */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium">
                {service.deliveryTimeframe && (
                  <div className="flex items-center gap-2 bg-slate-800/60 px-3.5 py-2 rounded-sm border border-slate-700/60 text-slate-300">
                    <Clock className="w-4 h-4 text-[#00D4FF]" />
                    <span>Timeframe: <strong className="text-white">{service.deliveryTimeframe}</strong></span>
                  </div>
                )}
                {service.pricingRange && (
                  <div className="flex items-center gap-2 bg-slate-800/60 px-3.5 py-2 rounded-sm border border-slate-700/60 text-slate-300">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Pricing: <strong className="text-white">{service.pricingRange}</strong></span>
                  </div>
                )}
              </div>

              {/* Header Action Buttons: Request Service & WhatsApp Enquiry */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  to={`/request-quote?service=${encodeURIComponent(service.title)}`}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] hover:brightness-110 transition shadow-lg flex items-center gap-2"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to={`/book-consultation?service=${encodeURIComponent(service.title)}`}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-[#00D4FF]" />
                  <span>Book Consultation</span>
                </Link>

                <WhatsAppButton
                  variant="service"
                  serviceName={service.title}
                  label="WhatsApp"
                  className="rounded-xl px-4 py-3"
                />
              </div>
            </div>

            {/* Service Visual Box */}
            <div className="lg:col-span-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-900">
                {/* CUSTOMIZE HERE: Replace this image with your own UI/UX design service image or other service images in public/images/services/ */}
                <img
                  src={service.image}
                  alt={service.imageAlt || `${service.title} - KJT TECHNOLOGIES`}
                  loading="lazy"
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700/80 text-xs text-white">
                  <span className="font-bold text-[#00D4FF] block mb-0.5">KJT Engineering Guarantee</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Zero-compromise security &bull; Strict NDA protection &bull; Direct senior engineer oversight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Detailed Breakdown */}
      <section className="py-24 bg-[#081528] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Main Column (8 cols) */}
            <div className="lg:col-span-8 space-y-12">

              {/* Detailed Description */}
              <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50 shadow-xl space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block">
                  Detailed Capability Overview
                </span>
                <h2 className="text-2xl font-bold text-white">
                  Engineered for High-Reliability &amp; Data Security
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {service.detailedDescription}
                </p>
              </div>

              {/* Key Benefits */}
              <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                  Why Choose KJT TECHNOLOGIES
                </span>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#00D4FF]" />
                  <span>Key Benefits &amp; Strategic Value</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.keyBenefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-slate-900/80 rounded-xl border border-slate-800/80 hover:border-[#00D4FF]/40 transition"
                    >
                      <h4 className="font-bold text-sm text-[#00D4FF] mb-1.5 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00D4FF] flex-shrink-0" />
                        <span>{benefit.title}</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What is Included */}
              <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                  Scope of Delivery
                </span>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#00D4FF]" />
                  <span>What is Included</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Every engagement with KJT TECHNOLOGIES produces complete, documented, and fully auditable assets:
                </p>
                <div className="space-y-3">
                  {service.whatIsIncluded.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-900/80 rounded-sm border border-slate-800 text-xs sm:text-sm text-slate-200 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-sm bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Working Process */}
              <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                  Methodology &amp; Execution
                </span>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#00D4FF]" />
                  <span>Our Step-by-Step Working Process</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.workingProcess.map((step) => (
                    <div
                      key={step.step}
                      className="p-6 bg-slate-900/90 rounded-xl border border-slate-800 relative"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center text-xs font-bold font-mono mb-3 border border-[#00D4FF]/40">
                        0{step.step}
                      </div>
                      <h4 className="font-bold text-sm text-white mb-1.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suitable Customers */}
              <div className="bg-slate-800/40 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                  Ideal Audiences
                </span>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#00D4FF]" />
                  <span>Suitable Customers &amp; Organizations</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.suitableCustomers.map((cust, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-900/80 rounded-sm border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300 font-medium"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#00D4FF] flex-shrink-0" />
                      <span>{cust}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Service & WhatsApp Callouts at bottom of main column */}
              <div className="p-8 bg-gradient-to-r from-slate-900 to-[#0A192F] rounded-2xl border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Ready to deploy this capability?</h4>
                  <p className="text-xs text-slate-400">
                    Submit your specifications for a fast quote or schedule an engineering consultation.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                  <Link
                    to={`/request-quote?service=${encodeURIComponent(service.title)}`}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-[#00D4FF] text-[#0A192F] hover:brightness-110 transition shadow-md"
                  >
                    Request a Quote
                  </Link>
                  <Link
                    to={`/book-consultation?service=${encodeURIComponent(service.title)}`}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
                  >
                    Book Consultation
                  </Link>
                  <WhatsAppButton
                    variant="icon-only"
                    serviceName={service.title}
                    tooltipText={`Inquire about ${service.title} on WhatsApp`}
                    ariaLabel={`WhatsApp enquiry for ${service.title}`}
                  />
                </div>
              </div>

            </div>

            {/* Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              <div id="service-consultation-form" className="sticky top-24 space-y-6">
                <ContactForm defaultService={service.title} />

                {/* Direct Hotline Box */}
                <div className="p-6 bg-slate-800/40 text-white rounded-2xl border border-slate-700/50 text-center space-y-3 shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center mx-auto">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Direct Engineering Desk</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Have urgent technical specifications or need an NDA prior to consultation? Speak directly with our lead architects.
                  </p>
                  <div className="pt-2 space-y-2">
                    <a
                      href={`tel:${companyConfig.contact.primaryPhone.replace(/[^0-9+]/g, '')}`}
                      className="block w-full py-2.5 rounded-sm bg-slate-900 hover:bg-slate-800 text-[#00D4FF] text-xs font-bold uppercase tracking-wider border border-slate-700 transition"
                    >
                      Call: {companyConfig.contact.displayPhone}
                    </a>
                    <WhatsAppButton
                      variant="service"
                      serviceName={service.title}
                      label={`WhatsApp: +${companyConfig.whatsappNumber}`}
                      className="w-full py-2.5 rounded-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Related Services Section */}
      <section className="py-24 bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block mb-1">
                Complementary Solutions
              </span>
              <h3 className="text-xl font-bold text-white">
                Related Technology Services
              </h3>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] hover:text-white inline-flex items-center gap-1 transition"
            >
              <span>View All 22 Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayRelated.map((item) => (
              <Link
                key={item.id}
                to={`/services/${item.slug}`}
                className="p-6 bg-slate-800/40 hover:bg-slate-800/70 rounded-2xl border border-slate-700/50 hover:border-[#00D4FF]/40 transition group shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-sm bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/30 mb-4 group-hover:scale-105 transition-transform">
                    <ServiceIcon name={item.iconName} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#00D4FF] uppercase tracking-widest block mb-1">
                    {item.badge}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-[#00D4FF] transition mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-[#00D4FF] uppercase tracking-wider">
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};
