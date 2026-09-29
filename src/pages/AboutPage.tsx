import React from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { companyConfig } from '../config/company';
import {
  ShieldCheck,
  Target,
  Eye,
  Server,
  Lock,
  Cpu,
  Globe,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  Hospital,
  Building2,
  ShoppingCart,
  Scale,
  Truck,
  ChevronRight,
  Code2,
  Network,
  Camera,
  Database,
  Cloud,
  Layers,
} from 'lucide-react';
import { CTASection } from '../components/home/CTASection';
import { SEOHead } from '../components/common/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-0 bg-[#0A192F] text-slate-200">
      <SEOHead
        title="About KJT TECHNOLOGIES | Engineering Excellence & Cyber Defense"
        description="Learn about KJT TECHNOLOGIES: our story, mission, core values, certified solutions engineering bench, and corporate commitment to Accelerating Innovation, Securing Data."
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'About Us', item: '/about' },
        ]}
      />
      {/* 1. Header Banner & Introduction */}
      <section className="relative py-24 bg-[#0A192F] text-slate-200 overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            <Link to="/" className="hover:text-[#00D4FF]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00D4FF]">About Us</span>
          </div>

          <div className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
            About {companyConfig.name}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto">
            Engineering Dependable Systems &amp; Securing Digital Assets
          </h1>

          <p className="text-lg sm:text-xl text-[#00D4FF] font-medium max-w-2xl mx-auto">
            “{companyConfig.motto}”
          </p>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {companyConfig.shortDescription}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button to="/contact" variant="cyan" size="md">
              Speak With Our Team
            </Button>
            <Button to="/services" variant="outline-white" size="md">
              Explore Our Capabilities
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Company Story & Introduction */}
      <section className="py-24 bg-[#081528] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm">
                Our Story &amp; Purpose
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                Built on Honest Engineering &amp; Unwavering Data Protection
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {companyConfig.name} was established with a singular focus: to provide organizations with reliable, well-engineered technology solutions that drive productivity without compromising security.
              </p>

              <p className="text-sm text-slate-400 leading-relaxed">
                Whether deploying custom web portals, configuring school and business management systems, running structured fiber optic cables, installing 4K security cameras, or hardening network firewalls, we work with direct technical honesty. We prioritize solid architecture over temporary shortcuts, ensuring that every system we deliver performs reliably day after day.
              </p>

              {/* Editable Placeholder Callout */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-sm text-xs text-slate-400">
                <span className="font-bold text-[#00D4FF] block mb-1 uppercase tracking-wider">
                  [Editable Placeholder: Your Detailed Company Background]
                </span>
                You can personalize your founding story, physical origins, and specific local milestones in <code>src/config/company.ts</code> or directly inside this section.
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  alt="KJT TECHNOLOGIES Team Collaborating"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[400px] object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0A192F]/90 backdrop-blur-md rounded-xl border border-slate-700/80 text-white">
                  <span className="text-[#00D4FF] text-xs font-bold uppercase tracking-wider block mb-1">
                    Direct Hands-On Implementation
                  </span>
                  <p className="text-xs text-slate-300">
                    From code repositories to server racks, our engineers personally design, build, test, and support every system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-24 bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Foundational Purpose"
            title="Our Mission and Vision"
            subtitle="The core guiding compass directing every technical recommendation and system implementation."
            align="center"
            theme="dark"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-800/40 rounded-2xl p-8 sm:p-10 border border-slate-700/50 shadow-xl relative overflow-hidden group hover:border-[#00D4FF]/50 transition">
              <div className="w-12 h-12 rounded-sm bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center mb-6 border border-[#00D4FF]/30">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To empower businesses, educational institutions, and organizations by engineering resilient, user-friendly digital systems and implementing robust data protection strategies that safeguard critical information and foster sustainable growth.
              </p>
            </div>

            <div className="bg-slate-800/40 rounded-2xl p-8 sm:p-10 border border-slate-700/50 shadow-xl relative overflow-hidden group hover:border-[#00D4FF]/50 transition">
              <div className="w-12 h-12 rounded-sm bg-[#00D4FF]/20 text-[#00D4FF] flex items-center justify-center mb-6 border border-[#00D4FF]/30">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To be the technology partner of choice—trusted for genuine technical integrity, uncompromising data security standards, and responsive, dependable support that clients can rely on through every stage of their growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="py-24 bg-[#081528] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Standards"
            title="Core Values That Drive Us"
            subtitle="How we conduct our business, treat our clients, and write our code."
            align="center"
            theme="dark"
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/50 transition">
              <ShieldCheck className="w-6 h-6 text-[#00D4FF] mb-3" />
              <h4 className="font-bold text-white text-base mb-2">Integrity First</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We provide truthful assessments, recommend only what you genuinely need, and avoid bloated sales pitches or unnecessary complexity.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/50 transition">
              <Lock className="w-6 h-6 text-[#00D4FF] mb-3" />
              <h4 className="font-bold text-white text-base mb-2">Uncompromising Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Security is built into our foundations from day one. Data privacy, encryption, and Zero-Trust access are non-negotiable standards.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/50 transition">
              <Cpu className="w-6 h-6 text-[#00D4FF] mb-3" />
              <h4 className="font-bold text-white text-base mb-2">Engineering Craft</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We take pride in clean code, organized network racks, tested backups, and durable hardware that functions without headaches.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/50 transition">
              <Globe className="w-6 h-6 text-[#00D4FF] mb-3" />
              <h4 className="font-bold text-white text-base mb-2">Prompt Dependability</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                When technical glitches happen, our responsive support team acts swiftly to resolve issues and minimize downtime for your staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Industries Served */}
      <section className="py-24 bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Target Sectors"
            title="Industries We Support"
            subtitle="Tailoring technical infrastructure and custom systems to the unique compliance and operational demands of diverse industries."
            align="center"
            theme="dark"
          />

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/40 transition">
              <GraduationCap className="w-7 h-7 text-[#00D4FF] mb-3" />
              <h3 className="font-bold text-white text-base mb-2">Schools &amp; Educational Institutions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turnkey digital campus management, computer laboratories, student report card generators, campus Wi-Fi, and CCTV security.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/40 transition">
              <Briefcase className="w-7 h-7 text-[#00D4FF] mb-3" />
              <h3 className="font-bold text-white text-base mb-2">Small &amp; Medium Enterprises (SMEs)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Affordable business management ERPs, inventory accounting, custom website development, automated backups, and managed IT support.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/40 transition">
              <Hospital className="w-7 h-7 text-[#00D4FF] mb-3" />
              <h3 className="font-bold text-white text-base mb-2">Healthcare &amp; Medical Facilities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict data privacy protections, encrypted patient database storage, air-gapped backups, and high-availability clinic workstations.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/40 transition">
              <ShoppingCart className="w-7 h-7 text-[#00D4FF] mb-3" />
              <h3 className="font-bold text-white text-base mb-2">Retail &amp; Supermarkets</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fast Point-of-Sale (POS) desktop software, barcode scanner integrations, optical security surveillance, and till access control.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/40 transition">
              <Scale className="w-7 h-7 text-[#00D4FF] mb-3" />
              <h3 className="font-bold text-white text-base mb-2">Legal &amp; Professional Services</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Confidential case file repositories, signed NDAs, encrypted email communication setup, and disaster recovery runbooks.
              </p>
            </div>

            <div className="p-6 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:border-[#00D4FF]/40 transition">
              <Truck className="w-7 h-7 text-[#00D4FF] mb-3" />
              <h3 className="font-bold text-white text-base mb-2">Logistics &amp; Warehousing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Field dispatch mobile applications, wide-area warehouse Wi-Fi, biometric turnstiles, and perimeter 4K CCTV monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Technology Expertise */}
      <section className="py-24 bg-[#081528] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Technical Domains"
            title="Our Core Technology Expertise"
            subtitle="The verified toolkits, stacks, and hardware standards we employ to engineer solutions."
            align="center"
            theme="dark"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/30">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Full-Stack Software</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Modern responsive frontends and resilient backend APIs using React, TypeScript, Node.js, Python, and C#/.NET.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind', 'Next.js', 'C#/.NET'].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-sm bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-7 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/30">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Networking &amp; Infrastructure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Certified CAT6 structured cabling, enterprise Wi-Fi 6 mesh, managed VLAN switches, and physical server virtualization.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['CAT6A Fluke', 'Fiber Optic', 'Wi-Fi 6', 'VLANs', 'VMware', 'Proxmox', 'Active Directory'].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-sm bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-7 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-4">
              <div className="w-10 h-10 rounded-sm bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/30">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Security &amp; Surveillance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ultra-HD 4K IP security cameras, biometric access control turnstiles, firewall hardening, and immutable backups.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {['4K IP Cameras', 'NVR Vaults', 'Biometrics', 'RFID Cards', 'NGFW Firewalls', 'AES-256'].map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-sm bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Clients Should Trust KJT TECHNOLOGIES */}
      <section className="py-24 bg-[#0A192F] border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Genuine Trust"
            title="Why Clients Choose KJT TECHNOLOGIES"
            subtitle="Honest reasons organizations partner with us for their critical IT and software projects."
            align="center"
            theme="dark"
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00D4FF]" />
                <span>Transparent, Fixed Estimates</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                No hidden surprises or surprise scope creep. We provide itemized proposals with clear deliverables, milestones, and timelines upfront before any work commences.
              </p>
            </div>

            <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00D4FF]" />
                <span>100% Client Intellectual Property Ownership</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                When you hire us to build custom software or databases, all source code, design assets, and schemas belong 100% to your organisation upon completion.
              </p>
            </div>

            <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00D4FF]" />
                <span>Direct Access to Working Engineers</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                You won't be shuffled between non-technical account managers. You communicate directly with the software developers and systems engineers building your solution.
              </p>
            </div>

            <div className="p-8 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#00D4FF]" />
                <span>Post-Launch Warranty &amp; Practical Training</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                We stand behind our work. Every project includes a post-launch warranty period to remediate defects, along with thorough user training for your staff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <CTASection />
    </div>
  );
};
