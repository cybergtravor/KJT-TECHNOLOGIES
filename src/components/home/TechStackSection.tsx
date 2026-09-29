import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Code2, ShieldAlert, Network, Video, Cloud } from 'lucide-react';

const categories = [
  {
    id: "software",
    name: "Software & Web",
    icon: Code2,
    technologies: [
      { name: "TypeScript", role: "Type-safe Engineering" },
      { name: "React / Next.js", role: "Enterprise Web UI" },
      { name: "Node.js / Express", role: "High-throughput APIs" },
      { name: "Python / FastAPI", role: "Data Engines & AI" },
      { name: "Go (Golang)", role: "Low-latency Microservices" },
      { name: "PostgreSQL", role: "Relational Storage" },
      { name: "Redis", role: "In-memory Caching" },
      { name: "Docker & K8s", role: "Containerization" },
    ]
  },
  {
    id: "cybersecurity",
    name: "Cyber Defense",
    icon: ShieldAlert,
    technologies: [
      { name: "Zero-Trust Architecture", role: "Perimeterless Access" },
      { name: "CrowdStrike Falcon", role: "Endpoint Detection & EDR" },
      { name: "Splunk / Elastic SIEM", role: "Security Event Telemetry" },
      { name: "Palo Alto NGFW", role: "Next-Gen Firewalling" },
      { name: "Burp Suite Pro", role: "Penetration Testing" },
      { name: "Okta / Azure AD", role: "Identity Governance & MFA" },
      { name: "WireGuard & IPsec", role: "Encrypted Tunnels" },
      { name: "OWASP Top 10", role: "Secure SDLC Auditing" },
    ]
  },
  {
    id: "networking",
    name: "Networking & Fiber",
    icon: Network,
    technologies: [
      { name: "Cisco Catalyst", role: "L2/L3 Switching" },
      { name: "Ubiquiti UniFi", role: "High-density Wi-Fi 6/7" },
      { name: "Cat6A / Cat7 Cabling", role: "Structured Infrastructure" },
      { name: "OM4 Optical Fiber", role: "10G/40G Campus Links" },
      { name: "Fortinet FortiGate", role: "SD-WAN Routing" },
      { name: "VLAN Segmentation", role: "Traffic Isolation" },
      { name: "MikroTik RouterOS", role: "ISP Gateway Routing" },
      { name: "SNMP Telemetry", role: "Bandwidth Monitoring" },
    ]
  },
  {
    id: "cctv",
    name: "CCTV & Physical Access",
    icon: Video,
    technologies: [
      { name: "4K Ultra HD IP Optics", role: "High-res Camera Sensors" },
      { name: "Starlight Color Night Vision", role: "Zero-light Detection" },
      { name: "Edge AI Analytics", role: "Human & Vehicle Filter" },
      { name: "ANPR / LPR Systems", role: "License Plate Recognition" },
      { name: "Biometric Turnstiles", role: "Facial / Fingerprint Gates" },
      { name: "NVR RAID Storage", role: "90-Day Encrypted Video" },
      { name: "PoE+ Managed Power", role: "Surge-protected Wiring" },
      { name: "Mobile VMS Client", role: "Secure Remote Monitoring" },
    ]
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    icon: Cloud,
    technologies: [
      { name: "Amazon Web Services", role: "Compute & Storage" },
      { name: "Google Cloud Platform", role: "Kubernetes & BigData" },
      { name: "Microsoft Azure", role: "Enterprise Integration" },
      { name: "Terraform", role: "Infrastructure as Code" },
      { name: "GitHub Actions", role: "Automated CI/CD" },
      { name: "Datadog / Prometheus", role: "Observability & Metrics" },
      { name: "Cloudflare", role: "DDoS Mitigation & CDN" },
      { name: "FinOps Optimization", role: "Cloud Cost Control" },
    ]
  }
];

export const TechStackSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(categories[0].id);

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <section className="py-24 bg-[#081528] text-white border-b border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00D4FF] text-[#0A192F] shadow-lg shadow-[#00D4FF]/20 font-bold'
                    : 'bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-[#00D4FF]/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Technology Cards Matrix */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentCategory.technologies.map((tech) => (
            <div
              key={tech.name}
              className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 hover:border-[#00D4FF]/50 hover:bg-slate-800/70 transition-all group"
            >
              <div className="text-white font-bold text-sm sm:text-base group-hover:text-[#00D4FF] transition-colors">
                {tech.name}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {tech.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
