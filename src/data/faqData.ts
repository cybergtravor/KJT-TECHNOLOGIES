/**
 * =====================================================================
 * FREQUENTLY ASKED QUESTIONS - KJT TECHNOLOGIES
 * =====================================================================
 * Categorized under:
 * - General
 * - Technical
 * - Pricing
 * - Support
 * - Security
 * - Project
 * =====================================================================
 */

import { FAQItem } from '../types';

export const faqData: FAQItem[] = [
  // General Questions
  {
    id: "faq-gen-1",
    question: "What core technology capabilities does KJT TECHNOLOGIES offer?",
    answer: "KJT TECHNOLOGIES offers 22 specialized capabilities organized across software engineering (custom websites, web apps, mobile apps, desktop software), enterprise systems (school management systems, business ERPs), cybersecurity (threat auditing, penetration testing, data backup), and physical infrastructure (fiber optic networking, server installation, commercial 4K CCTV surveillance, and access control).",
    category: "General"
  },
  {
    id: "faq-gen-2",
    question: "What types of organizations do you typically support?",
    answer: "We partner with growing startups, mid-market businesses, educational institutions (schools and universities), healthcare networks, retail chains, and logistics warehouses seeking dependable, secure technology solutions without unnecessary overhead.",
    category: "General"
  },
  {
    id: "faq-gen-3",
    question: "Where is KJT TECHNOLOGIES located and do you handle remote projects?",
    answer: "Our operations desk handles both on-site physical infrastructure rollouts (cabling, server racks, CCTV) and fully remote international software engineering and cloud consulting projects with clients globally.",
    category: "General"
  },

  // Technical Questions
  {
    id: "faq-tech-1",
    question: "What technology stacks and frameworks do your developers use?",
    answer: "For web and cloud applications, we utilize modern TypeScript, React, Next.js, Node.js, Python, and Go with PostgreSQL and Redis databases. For cross-platform mobile apps, we deploy React Native and Flutter. For desktop software and POS terminals, we engineer C#/.NET and Electron desktop solutions.",
    category: "Technical"
  },
  {
    id: "faq-tech-2",
    question: "Can KJT TECHNOLOGIES integrate with our existing legacy databases and software?",
    answer: "Yes. We regularly build secure REST and GraphQL API adapters, custom data pipelines, and database replication tools to seamlessly bridge legacy databases (SQL Server, Oracle, older MySQL instances) into modern web dashboards.",
    category: "Technical"
  },
  {
    id: "faq-tech-3",
    question: "What network cabling standards and CCTV equipment do you deploy?",
    answer: "We install certified Cat6/Cat6A shielded copper drops and OM4/single-mode fiber optic backbones with Fluke-tested certification. For security surveillance, we deploy commercial 4K Ultra-HD IP PoE cameras with motorized zoom, color night vision, and on-premise NVR vaults with secure remote mobile access.",
    category: "Technical"
  },

  // Pricing Questions
  {
    id: "faq-price-1",
    question: "How are your software and infrastructure projects priced?",
    answer: "We believe in honest, transparent pricing. We offer itemized fixed-price quotes for well-defined software developments and network/CCTV installations. For ongoing IT management, we offer predictable monthly retainers. Every proposal breaks down labor, licensing, and hardware clearly with zero hidden fees.",
    category: "Pricing"
  },
  {
    id: "faq-price-2",
    question: "Do you require full payment upfront before beginning work?",
    answer: "No. Our standard contracts operate on milestone-based billing: an initial mobilization deposit (typically 30–40%), followed by intermediate progress milestones upon live demo approval, and the remaining balance only upon final delivery, acceptance testing, and staff training.",
    category: "Pricing"
  },
  {
    id: "faq-price-3",
    question: "Are there ongoing subscription fees for custom software you build for us?",
    answer: "No mandatory subscription fees. When we build custom web, mobile, or desktop applications for your organisation, you own 100% of the intellectual property and code upon full payment. You only pay for your own hosting infrastructure or optional maintenance retainers if you choose.",
    category: "Pricing"
  },

  // Support Questions
  {
    id: "faq-supp-1",
    question: "What kind of post-launch warranty and ongoing support do you provide?",
    answer: "All our delivered systems include a complimentary 30- to 90-day post-launch warranty covering any bug fixes and performance adjustments. For long-term continuity, we offer flexible Service Level Agreements (SLAs) with 24/7 emergency response and proactive system patching.",
    category: "Support"
  },
  {
    id: "faq-supp-2",
    question: "How fast does your team respond to critical IT downtime or outages?",
    answer: "For clients on our managed IT support and security retainers, critical severity-1 incidents receive an initial response and diagnostic triage within 15 to 30 minutes, supported by direct engineer phone and WhatsApp escalation channels.",
    category: "Support"
  },
  {
    id: "faq-supp-3",
    question: "Do you train our staff on how to use new systems, like the School Management System?",
    answer: "Yes, thorough staff and administrator training is included with every deployment. We provide interactive on-site or video training sessions, step-by-step PDF user manuals, and recorded walkthroughs so your team feels completely confident.",
    category: "Support"
  },

  // Security Questions
  {
    id: "faq-sec-1",
    question: "How does KJT TECHNOLOGIES safeguard our company data during an engagement?",
    answer: "In line with our motto ('Accelerating Innovation, Securing Data'), data protection is prioritized from day one. We sign mutual Non-Disclosure Agreements (NDAs) prior to reviewing any client data, enforce role-based access, utilize AES-256 encrypted channels, and follow strict least-privilege security protocols.",
    category: "Security"
  },
  {
    id: "faq-sec-2",
    question: "What does a cybersecurity penetration test and vulnerability audit include?",
    answer: "Our security audits assess external attack surfaces, internal network segments, web application vulnerabilities (OWASP Top 10), firewall configurations, and endpoint health. You receive an executive summary and an actionable technical remediation roadmap prioritized by risk level.",
    category: "Security"
  },
  {
    id: "faq-sec-3",
    question: "How do your automated data backup and disaster recovery solutions work?",
    answer: "We implement the industry-standard 3-2-1 backup rule: three copies of your critical data stored across two different media types, with at least one immutable, air-gapped or encrypted off-site cloud copy. We also perform regular test restores to verify recovery readiness.",
    category: "Security"
  },

  // Project Questions
  {
    id: "faq-proj-1",
    question: "What is your typical working process for a new project?",
    answer: "Our process follows five proven phases: 1) Discovery & Requirements Gathering; 2) Architecture & Scope Planning; 3) Iterative Engineering & Milestone Demos; 4) Security Hardening & Quality Assurance; and 5) Turnkey Deployment, Staff Training, and Post-Launch Warranty.",
    category: "Project"
  },
  {
    id: "faq-proj-2",
    question: "How long does a typical project take from kickoff to handover?",
    answer: "Structured cabling, CCTV installation, and network rollouts typically take 1 to 3 weeks depending on facility size. Standard website design and CMS setup takes 2 to 4 weeks. Complex enterprise software, school systems, and custom mobile apps range from 6 to 14 weeks with regular progress demos.",
    category: "Project"
  },
  {
    id: "faq-proj-3",
    question: "How can we get started with a consultation or project quote?",
    answer: "Simply submit our website contact form, click the 'Request This Service' button on any service detail page, call our desk directly, or start a chat via our floating WhatsApp button. We will schedule a free consultation within 24 business hours.",
    category: "Project"
  }
];
