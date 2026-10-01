/**
 * =====================================================================
 * TECH STACK SECTION - KJT TECHNOLOGIES
 * =====================================================================
 * Modernized with:
 * - AnimatedTechBg canvas particle overlay
 * - Motion-powered stagger-reveal on tab switch
 * - Glowing active-tab pill with cyan accent
 * - Tech cards with pulsing icon dots and hover glow
 * =====================================================================
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, ShieldAlert, Network, Video, Cloud, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { AnimatedTechBg } from '../common/AnimatedTechBg';

const categories = [
  {
    id: 'software',
    name: 'Software & Web',
    icon: Code2,
    color: '#00D4FF',
    technologies: [
      { name: 'TypeScript', role: 'Type-safe Engineering' },
      { name: 'React / Next.js', role: 'Enterprise Web UI' },
      { name: 'Node.js / Express', role: 'High-throughput APIs' },
      { name: 'Python / FastAPI', role: 'Data Engines & AI' },
      { name: 'Go (Golang)', role: 'Low-latency Microservices' },
      { name: 'PostgreSQL', role: 'Relational Storage' },
      { name: 'Redis', role: 'In-memory Caching' },
      { name: 'Docker & K8s', role: 'Containerization' },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cyber Defense',
    icon: ShieldAlert,
    color: '#38BDF8',
    technologies: [
      { name: 'Zero-Trust Architecture', role: 'Perimeterless Access' },
      { name: 'CrowdStrike Falcon', role: 'Endpoint Detection & EDR' },
      { name: 'Splunk / Elastic SIEM', role: 'Security Event Telemetry' },
      { name: 'Palo Alto NGFW', role: 'Next-Gen Firewalling' },
      { name: 'Burp Suite Pro', role: 'Penetration Testing' },
      { name: 'Okta / Azure AD', role: 'Identity Governance & MFA' },
      { name: 'WireGuard & IPsec', role: 'Encrypted Tunnels' },
      { name: 'OWASP Top 10', role: 'Secure SDLC Auditing' },
    ],
  },
  {
    id: 'networking',
    name: 'Networking & Fiber',
    icon: Network,
    color: '#60A5FA',
    technologies: [
      { name: 'Cisco Catalyst', role: 'L2/L3 Switching' },
      { name: 'Ubiquiti UniFi', role: 'High-density Wi-Fi 6/7' },
      { name: 'Cat6A / Cat7 Cabling', role: 'Structured Infrastructure' },
      { name: 'OM4 Optical Fiber', role: '10G/40G Campus Links' },
      { name: 'Fortinet FortiGate', role: 'SD-WAN Routing' },
      { name: 'VLAN Segmentation', role: 'Traffic Isolation' },
      { name: 'MikroTik RouterOS', role: 'ISP Gateway Routing' },
      { name: 'SNMP Telemetry', role: 'Bandwidth Monitoring' },
    ],
  },
  {
    id: 'cctv',
    name: 'CCTV & Access',
    icon: Video,
    color: '#A78BFA',
    technologies: [
      { name: '4K Ultra HD IP Optics', role: 'High-res Camera Sensors' },
      { name: 'Starlight Night Vision', role: 'Zero-light Detection' },
      { name: 'Edge AI Analytics', role: 'Human & Vehicle Filter' },
      { name: 'ANPR / LPR Systems', role: 'License Plate Recognition' },
      { name: 'Biometric Turnstiles', role: 'Facial / Fingerprint Gates' },
      { name: 'NVR RAID Storage', role: '90-Day Encrypted Video' },
      { name: 'PoE+ Managed Power', role: 'Surge-protected Wiring' },
      { name: 'Mobile VMS Client', role: 'Secure Remote Monitoring' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    icon: Cloud,
    color: '#34D399',
    technologies: [
      { name: 'Amazon Web Services', role: 'Compute & Storage' },
      { name: 'Google Cloud Platform', role: 'Kubernetes & BigData' },
      { name: 'Microsoft Azure', role: 'Enterprise Integration' },
      { name: 'Terraform', role: 'Infrastructure as Code' },
      { name: 'GitHub Actions', role: 'Automated CI/CD' },
      { name: 'Datadog / Prometheus', role: 'Observability & Metrics' },
      { name: 'Cloudflare', role: 'DDoS Mitigation & CDN' },
      { name: 'FinOps Optimization', role: 'Cloud Cost Control' },
    ],
  },
];

export const TechStackSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section className="relative py-24 bg-[#081528] text-white border-b border-slate-800 overflow-hidden">
      {/* Animated background */}
      <AnimatedTechBg variant="grid" opacity={0.12} />

      {/* Radial accent behind section heading */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#00D4FF]/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Technology Stack"
          title="Battle-Tested Enterprise Technologies"
          subtitle="We select industry-leading frameworks, hardware vendors, and security protocols designed for high availability and rigorous standards."
          align="center"
          theme="dark"
        />

        {/* Tab Buttons */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeTab;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#0A192F] shadow-lg'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-[#00D4FF]/40'
                }`}
                style={isActive ? { backgroundColor: cat.color, boxShadow: `0 0 20px -4px ${cat.color}60` } : {}}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: cat.color, opacity: 0.15 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Category description bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + '-label'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: currentCategory.color }}
            />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: currentCategory.color }}>
              {currentCategory.technologies.length} Technologies
            </span>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentCategory.color }} />
          </motion.div>
        </AnimatePresence>

        {/* Technology Cards Matrix */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {currentCategory.technologies.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.045, duration: 0.3 }}
                className="group relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800/70 transition-all duration-250 overflow-hidden cursor-default"
                style={{
                  ['--hover-color' as string]: currentCategory.color,
                }}
              >
                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 1px ${currentCategory.color}50` }}
                />

                {/* Accent dot */}
                <div
                  className="w-2 h-2 rounded-full mb-3 group-hover:scale-125 transition-transform duration-200"
                  style={{ backgroundColor: currentCategory.color }}
                />

                <div
                  className="text-white font-bold text-sm sm:text-base transition-colors duration-200 group-hover:text-[inherit] leading-snug"
                  style={{ color: undefined }}
                >
                  <span className="group-hover:text-white text-slate-100">{tech.name}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1.5 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {tech.role}
                </div>

                {/* Bottom check mark (shows on hover) */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: currentCategory.color }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
