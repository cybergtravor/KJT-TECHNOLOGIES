/**
 * =====================================================================
 * SERVICES DATA - KJT TECHNOLOGIES (22 Full Capabilities)
 * =====================================================================
 * 
 * --- CUSTOMIZATION INSTRUCTIONS ---
 * All 22 technology services are defined below in clean TypeScript format.
 * You can safely edit:
 *  - `title`, `tagline`, `shortDescription`, `detailedDescription`
 *  - `keyBenefits`, `whatIsIncluded`, `workingProcess`, `suitableCustomers`
 *  - `image` (replace with your own photos or CDN URLs)
 *  - `pricingRange` and `deliveryTimeframe`
 * 
 * Individual service pages are rendered dynamically via /services/:slug.
 * =====================================================================
 */

import { ServiceItem } from '../types';

// CUSTOMIZE HERE: Add a new service, or edit/remove any of the 22 services below
export const servicesData: ServiceItem[] = [
  {
    id: "website-design-and-development",
    slug: "website-design-and-development",
    title: "Website Design and Development",
    tagline: "Modern, responsive, high-speed corporate and commercial websites engineered for brand authority.",
    badge: "Web & Digital",
    iconName: "Globe",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Custom-crafted, mobile-first corporate websites, landing pages, and interactive brand portals built with modern responsive frameworks and clean code.",
    detailedDescription: "At KJT TECHNOLOGIES, we believe your website is your digital flagship. We deliver responsive, accessible, and ultra-fast web experiences engineered with modern frameworks (React, Next.js, and Tailwind CSS). Every site is designed from the ground up for optimal user engagement, search engine indexing, mobile responsiveness, and bank-grade data transmission security.",
    keyBenefits: [
      { title: "Blazing Load Speeds", description: "Sub-second load times engineered with lightweight asset bundling and global CDN caching." },
      { title: "Mobile-First Responsiveness", description: "Flawless rendering across mobile phones, tablets, laptops, and ultra-wide desktop screens." },
      { title: "High Conversion Architecture", description: "Strategic UI layouts designed to turn casual visitors into inquiries and paying clients." },
      { title: "Built-in Security", description: "Automatic SSL/TLS encryption, secure headers, and strict content security policies." }
    ],
    whatIsIncluded: [
      "Custom responsive design & interactive UI wireframes",
      "Fast, semantic HTML5, CSS3/Tailwind, and modern JavaScript/React",
      "Full mobile, tablet, and cross-browser testing",
      "Search Engine Optimization (SEO) foundation & Open Graph tags",
      "Contact forms with spam protection & WhatsApp integration",
      "Google Analytics and search console setup assistance",
      "Post-launch handover documentation and 30-day technical warranty"
    ],
    workingProcess: [
      { step: 1, title: "Discovery & Blueprint", description: "We analyze your brand, target audience, competitors, and functional objectives." },
      { step: 2, title: "UI/UX Design Mockup", description: "We craft interactive wireframes and visual design mockups for your review and approval." },
      { step: 3, title: "Clean Engineering", description: "We code responsive frontend layouts with clean code, fast APIs, and strict accessibility standards." },
      { step: 4, title: "Deployment & Training", description: "We configure DNS, launch to your hosting/cloud server, and train your team on updates." }
    ],
    suitableCustomers: [
      "Corporate enterprises seeking high-end digital presence",
      "Professional service firms (law, accounting, engineering, consulting)",
      "Educational institutions and training academies",
      "Growing SMEs looking to modernize an outdated legacy website",
      "Startups launching new commercial ventures"
    ],
    relatedServices: ["web-application-development", "ui-ux-design", "search-engine-optimization", "domain-registration-and-web-hosting"],
    deliveryTimeframe: "2 - 4 Weeks",
    pricingRange: "Custom quote based on scope"
  },
  {
    id: "web-application-development",
    slug: "web-application-development",
    title: "Web Application Development",
    tagline: "High-performance, secure, and scalable cloud-based web applications tailored to your business logic.",
    badge: "Web & Digital",
    iconName: "Code2",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Custom cloud web apps, client portals, SaaS platforms, and automated workflow engines architected for reliability and high concurrency.",
    detailedDescription: "When standard websites fall short, KJT TECHNOLOGIES develops sophisticated web applications that automate core business operations. From customer portals and interactive dashboards to multi-tenant SaaS platforms, our team writes resilient backend architectures and reactive frontends backed by relational and NoSQL databases.",
    keyBenefits: [
      { title: "Custom Business Logic", description: "Engineered specifically around your internal operational workflows without off-the-shelf constraints." },
      { title: "Zero-Trust Data Protection", description: "Granular role-based access control (RBAC), multi-factor authentication, and encrypted sessions." },
      { title: "Scalable Microservices", description: "Handles thousands of simultaneous transactions with containerized cloud architecture." },
      { title: "Seamless API Integrations", description: "Direct connectivity to payment gateways, ERPs, CRMs, and third-party accounting software." }
    ],
    whatIsIncluded: [
      "Technical architecture documentation & database ERD schema",
      "Full-stack development (React, Node.js, Python, TypeScript, PostgreSQL)",
      "Secure user authentication (OAuth2, JWT, Session RBAC)",
      "Interactive administrative dashboard with data exports (CSV/PDF)",
      "Automated automated testing suite and CI/CD pipelines",
      "Complete source code ownership and deployment scripts",
      "Admin user manual and technical API documentation"
    ],
    workingProcess: [
      { step: 1, title: "System Analysis", description: "Deep-dive workshop into requirements, user personas, database models, and security needs." },
      { step: 2, title: "Architecture & Schema", description: "Designing database models, API contracts, and interactive component prototypes." },
      { step: 3, title: "Sprint-Based Coding", description: "Iterative development cycles with bi-weekly demonstrations and client feedback." },
      { step: 4, title: "QA & Cloud Rollout", description: "Penetration testing, load stress testing, production cloud deployment, and handover." }
    ],
    suitableCustomers: [
      "Companies wanting to digitize manual paper/spreadsheet processes",
      "Tech startups building custom SaaS products",
      "Organizations requiring member or customer self-service portals",
      "Financial and logistics businesses requiring custom transaction platforms"
    ],
    relatedServices: ["website-design-and-development", "database-design-and-management", "cloud-solutions", "cybersecurity-services"],
    deliveryTimeframe: "6 - 12 Weeks",
    pricingRange: "Milestone-based enterprise quote"
  },
  {
    id: "mobile-app-development",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    tagline: "Intuitive, high-performance iOS and Android mobile applications that delight users on the go.",
    badge: "Mobile & Apps",
    iconName: "Smartphone",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Native and cross-platform iOS & Android mobile apps engineered with React Native and Flutter for seamless performance and engaging UX.",
    detailedDescription: "Reach your customers directly on their smartphones. KJT TECHNOLOGIES engineers cross-platform and native mobile applications that combine native-grade speed with beautiful user interfaces. We manage the entire lifecycle from wireframing and API integration to App Store and Google Play publication.",
    keyBenefits: [
      { title: "Cross-Platform Efficiency", description: "Deploy to both Apple iOS and Google Android from a single streamlined codebase." },
      { title: "Offline Capabilities", description: "Local SQLite/IndexedDB caching allowing users to work seamlessly even in low-connectivity areas." },
      { title: "Push Notification Engines", description: "Engage your audience with automated real-time alerts, reminders, and promotional updates." },
      { title: "Biometric Hardware Security", description: "Support for FaceID, fingerprint authentication, and hardware-backed keychains." }
    ],
    whatIsIncluded: [
      "Mobile UI/UX wireframes with interactive prototype testing",
      "Cross-platform codebase (React Native / Flutter) or native Swift/Kotlin",
      "Secure backend REST/GraphQL API connectivity",
      "Push notifications, geolocation, and camera/sensor integration",
      "App Store (iOS) and Google Play Store submission & approval support",
      "Analytics tracking & crash reporting telemetry setup",
      "3-month post-launch maintenance and bug-fix warranty"
    ],
    workingProcess: [
      { step: 1, title: "Concept & Wireframing", description: "Mapping out user flows, mobile screens, and hardware integration points." },
      { step: 2, title: "UI Prototype", description: "Figma mobile designs with tap-through mockups for client sign-off." },
      { step: 3, title: "Development & Testing", description: "Cross-device testing on real iOS and Android phones and tablets." },
      { step: 4, title: "Store Publication", description: "Preparing app store assets, metadata, privacy notices, and achieving store approval." }
    ],
    suitableCustomers: [
      "Businesses wanting direct customer loyalty and purchasing apps",
      "Logistics and field-service teams requiring mobile data collection",
      "Schools and universities providing mobile student portals",
      "Healthcare clinics offering mobile appointment and telehealth access"
    ],
    relatedServices: ["web-application-development", "ui-ux-design", "database-design-and-management", "cybersecurity-services"],
    deliveryTimeframe: "6 - 14 Weeks",
    pricingRange: "Custom quote based on features"
  },
  {
    id: "desktop-software-development",
    slug: "desktop-software-development",
    title: "Desktop Software Development",
    tagline: "Robust, high-throughput desktop applications for Windows, macOS, and Linux environments.",
    badge: "Enterprise Systems",
    iconName: "Monitor",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Specialized offline-first desktop software, hardware-integrated utilities, and POS systems for Windows, macOS, and Linux operating systems.",
    detailedDescription: "For mission-critical operations requiring direct hardware control, heavy computational processing, or air-gapped security, KJT TECHNOLOGIES develops dependable desktop software. Using modern desktop toolkits like Electron, C#/.NET, Python, and C++, we build software that communicates directly with serial ports, barcode scanners, printers, and industrial controllers.",
    keyBenefits: [
      { title: "Full Offline Autonomy", description: "Operates 100% reliably without requiring an active internet connection." },
      { title: "Direct Hardware Interfacing", description: "Seamless communication with thermal printers, biometrics, weight scales, and scanners." },
      { title: "High-Performance Computing", description: "Leverages local GPU and multi-core CPU processing for massive datasets." },
      { title: "Air-Gapped Deployment", description: "Installed strictly on local enterprise workstations for total confidentiality." }
    ],
    whatIsIncluded: [
      "Architecture specification and local database design (SQLite/SQL Server)",
      "Cross-platform or native Windows/macOS desktop application",
      "Hardware driver integration and peripheral communication protocols",
      "Automated installer packages (.exe, .msi, .dmg, .deb)",
      "Offline data synchronization engines with automatic conflict resolution",
      "Local backup utilities and audit trail logs",
      "Complete source code repository and compiled executables"
    ],
    workingProcess: [
      { step: 1, title: "Hardware & Workflow Audit", description: "We evaluate the workstations, operating systems, and connected peripherals." },
      { step: 2, title: "Core Engine Prototyping", description: "Building the backend processing modules and testing hardware serial communication." },
      { step: 3, title: "UI & Offline State Engine", description: "Designing an intuitive desktop interface optimized for rapid keyboard/barcode input." },
      { step: 4, title: "On-Site Installation & Training", description: "Deploying installers to client workstations and training operating staff." }
    ],
    suitableCustomers: [
      "Retail shops, supermarkets, and pharmacies requiring Point-of-Sale (POS)",
      "Manufacturing plants and industrial facilities with custom equipment",
      "Laboratories and medical diagnostics centers",
      "Financial brokerages and local data analysts"
    ],
    relatedServices: ["business-management-systems", "database-design-and-management", "computer-repair-and-upgrades", "it-support-and-maintenance"],
    deliveryTimeframe: "4 - 10 Weeks",
    pricingRange: "Custom project quote"
  },
  {
    id: "school-management-systems",
    slug: "school-management-systems",
    title: "School Management Systems",
    tagline: "Comprehensive, integrated educational software connecting administrators, teachers, students, and parents.",
    badge: "Specialized Systems",
    iconName: "GraduationCap",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Turnkey digital campus management covering admissions, gradebooks, attendance, fees payment, automated report cards, and parent SMS portals.",
    detailedDescription: "KJT TECHNOLOGIES develops and deploys complete School Management Systems (SMS/SIS) that modernize primary, secondary, and tertiary academic institutions. Our platform eliminates paper-based recordkeeping by unifying admissions, automated student attendance, fee tracking, continuous assessment gradebooks, and automated report card generation in one secure environment.",
    keyBenefits: [
      { title: "Paperless Campus Operations", description: "Digitize student records, staff registers, and academic transcripts in an encrypted central repository." },
      { title: "Automated Fee Reconciliation", description: "Track tuition payments, issue digital receipts, and automatically alert guardians of outstanding balances." },
      { title: "Instant Report Card Generation", description: "Teachers enter marks once; system calculates rankings, grades, and compiles printable PDF reports." },
      { title: "Parent Communication Portal", description: "Automated SMS/WhatsApp alerts for attendance, exam results, and school announcements." }
    ],
    whatIsIncluded: [
      "Student information database & historical academic records archive",
      "Teacher gradebook module with customizable grading scales and weighting",
      "Automated term report card generator with custom school branding",
      "School fees accounting, partial payment tracking, and receipt printing",
      "Staff management, timetable scheduler, and biometric attendance integration",
      "Secure Parent & Student web/mobile login portal",
      "Comprehensive staff training workshop and 12-month academic year technical support"
    ],
    workingProcess: [
      { step: 1, title: "Institutional Assessment", description: "We review your current academic calendar, grading formulas, and fee structures." },
      { step: 2, title: "System Configuration", description: "Setting up subjects, classes, grade thresholds, and importing existing student data." },
      { step: 3, title: "Staff & Teacher Training", description: "Hands-on training sessions for teachers, bursars, and administrative officers." },
      { step: 4, title: "Term Launch & Continuous Support", description: "Live deployment for term kickoff with dedicated priority hotline support." }
    ],
    suitableCustomers: [
      "Nursery, Primary, and Secondary Schools (K-12)",
      "Colleges of Education, Polytechnics, and Vocational Institutes",
      "Private Academies and International Schools",
      "University departments and educational consortiums"
    ],
    relatedServices: ["business-management-systems", "computer-networking", "cctv-and-security-camera-installation", "ict-training-and-consultancy"],
    deliveryTimeframe: "2 - 6 Weeks (Configured & Deployed)",
    pricingRange: "Institutional annual license or perpetual rollout"
  },
  {
    id: "business-management-systems",
    slug: "business-management-systems",
    title: "Business Management Systems (ERP/CRM)",
    tagline: "Unified ERP and CRM software to automate inventory, sales, accounting, payroll, and customer workflows.",
    badge: "Enterprise Systems",
    iconName: "Briefcase",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Custom Enterprise Resource Planning (ERP) and CRM tools to synchronize accounting, warehouse inventory, invoicing, HR, and sales pipelines.",
    detailedDescription: "Eliminate operational silos with a unified Business Management System custom-engineered by KJT TECHNOLOGIES. We provide medium and large organizations with a single pane of glass connecting inventory tracking, sales order processing, client relations, financial accounting, and staff payroll, backed by real-time business intelligence dashboards.",
    keyBenefits: [
      { title: "Real-Time Stock & Warehouse Visibility", description: "Prevent stockouts, track reorder levels automatically, and manage multi-location warehouses." },
      { title: "Automated Invoicing & Accounting", description: "Generate compliant quotes, purchase orders, invoices, and automated financial ledgers." },
      { title: "Sales Pipeline & CRM Tracking", description: "Track client interactions, close deals faster, and nurture long-term customer relationships." },
      { title: "Executive Intelligence Dashboards", description: "Instant profit/loss statements, cash flow analytics, and departmental performance KPIs." }
    ],
    whatIsIncluded: [
      "Inventory & warehouse management module with barcode scanning",
      "Customer Relationship Management (CRM) pipeline and contact history",
      "Accounting & financial reporting engine (P&L, Balance Sheet, Tax summaries)",
      "Human resources, employee leave tracking, and payroll generator",
      "Role-based permission controls (Admin, Cashier, Manager, Accountant)",
      "Data migration from legacy Excel sheets or older software",
      "On-site employee training and quarterly maintenance audits"
    ],
    workingProcess: [
      { step: 1, title: "Operational Audit", description: "Mapping your procurement, inventory, sales, and financial reporting workflows." },
      { step: 2, title: "Custom Module Architecture", description: "Configuring the system to mirror your chart of accounts and departmental approval trees." },
      { step: 3, title: "Historical Data Migration", description: "Sanitizing, converting, and importing your customer lists, vendor catalogs, and balances." },
      { step: 4, title: "Departmental Rollout", description: "Staged deployment with side-by-side verification and staff certification." }
    ],
    suitableCustomers: [
      "Wholesale distributors and retail chain operations",
      "Construction, real estate, and project engineering firms",
      "Hospitality venues, hotels, and restaurant groups",
      "Service businesses seeking unified billing and job tracking"
    ],
    relatedServices: ["database-design-and-management", "web-application-development", "it-support-and-maintenance", "digital-transformation-consulting"],
    deliveryTimeframe: "4 - 12 Weeks",
    pricingRange: "Enterprise tiered pricing"
  },
  {
    id: "cybersecurity-services",
    slug: "cybersecurity-services",
    title: "Cybersecurity Services",
    tagline: "Proactive, multi-layered cyber defense, vulnerability assessments, penetration testing, and 24/7 threat monitoring.",
    badge: "Security & Defense",
    iconName: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Zero-Trust enterprise cybersecurity, penetration testing, vulnerability remediation, firewall hardening, and incident response readiness.",
    detailedDescription: "In an era of rising cyber threats and ransomware extortion, security cannot be an afterthought. KJT TECHNOLOGIES delivers comprehensive cybersecurity audits, ethical penetration testing, endpoint hardening, and Security Operations Center (SOC) advisory. We lock down your servers, network perimeters, and internal credentials to guarantee your digital assets remain protected.",
    keyBenefits: [
      { title: "Zero-Trust Architecture", description: "Eliminate implicit trust; enforce multi-factor verification across every network packet and login." },
      { title: "Vulnerability Elimination", description: "Identify unpatched flaws and configuration blindspots before malicious actors exploit them." },
      { title: "Regulatory Compliance", description: "Achieve compliance with ISO 27001, GDPR, PCI-DSS, and local data privacy frameworks." },
      { title: "Rapid Incident Containment", description: "Actionable playbooks that isolate compromised systems within minutes to prevent lateral spread." }
    ],
    whatIsIncluded: [
      "External & internal network penetration testing with executive summary",
      "Web application security assessment (OWASP Top 10 auditing)",
      "Next-generation firewall (NGFW) deployment and intrusion detection configuration",
      "Endpoint Detection and Response (EDR) rollout across corporate machines",
      "Employee phishing simulation campaigns and security awareness training",
      "Incident response protocol and disaster containment playbook",
      "Formal Security Posture Certificate upon successful remediation"
    ],
    workingProcess: [
      { step: 1, title: "Reconnaissance & Scoping", description: "We identify all corporate digital assets, public IP ranges, domains, and cloud endpoints." },
      { step: 2, title: "Controlled Vulnerability Assessment", description: "Conducting automated scans and manual ethical hacking simulations." },
      { step: 3, title: "Remediation & Patching", description: "Collaborating with your IT staff to patch vulnerabilities, configure firewalls, and close ports." },
      { step: 4, title: "Validation & Continuous Guard", description: "Retesting patched systems and establishing continuous 24/7 monitoring protocols." }
    ],
    suitableCustomers: [
      "Financial institutions, credit unions, and fintech applications",
      "Healthcare facilities and medical record administrators",
      "Legal and accounting practices handling strictly confidential client files",
      "Enterprises subject to mandatory annual IT audits and cyber insurance requirements"
    ],
    relatedServices: ["data-protection-and-backup-solutions", "computer-networking", "server-installation-and-management", "cloud-solutions"],
    deliveryTimeframe: "1 - 3 Weeks (Audit) / Ongoing Retainer",
    pricingRange: "Audit package or monthly managed security retainer"
  },
  {
    id: "data-protection-and-backup-solutions",
    slug: "data-protection-and-backup-solutions",
    title: "Data Protection and Backup Solutions",
    tagline: "Automated, immutable 3-2-1 backup architectures guaranteeing rapid disaster recovery without data loss.",
    badge: "Security & Defense",
    iconName: "HardDrive",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Automated off-site and on-premise encrypted backups, ransomware disaster recovery systems, and business continuity planning.",
    detailedDescription: "Hard drive failures, accidental deletions, natural disasters, and ransomware attacks can instantly paralyze an unprepared organization. KJT TECHNOLOGIES implements robust 3-2-1 backup architectures: 3 copies of your data, across 2 different storage media, with 1 copy stored securely off-site in an immutable cloud vault.",
    keyBenefits: [
      { title: "Ransomware-Proof Immutability", description: "Write-Once-Read-Many (WORM) storage locks prevent ransomware from encrypting your backups." },
      { title: "Near-Zero RPO & RTO", description: "Recovery Point and Recovery Time Objectives measured in minutes, preventing costly downtime." },
      { title: "Bank-Grade Encryption", description: "AES-256 encryption at rest and in transit with client-held encryption keys." },
      { title: "Automated Daily Verification", description: "Self-testing backup routines that simulate sandbox boots to prove data integrity." }
    ],
    whatIsIncluded: [
      "Critical data audit (database servers, NAS storage, accounting files, emails)",
      "Local Network Attached Storage (NAS) installation with RAID redundancy",
      "Secure cloud replication to encrypted tier-4 data center vaults",
      "Automated scheduling for hourly snapshots and daily differential backups",
      "Disaster Recovery Runbook with step-by-step restoration protocols",
      "Quarterly restoration drill testing with written audit reports",
      "24/7 backup health alerting and storage threshold monitoring"
    ],
    workingProcess: [
      { step: 1, title: "Data Discovery Audit", description: "Identifying all critical data stores, databases, user profiles, and compliance requirements." },
      { step: 2, title: "Backup Architecture Design", description: "Selecting the optimal balance of local fast-restore NAS storage and encrypted cloud offsite tiers." },
      { step: 3, title: "Deployment & Seeding", description: "Installing backup agents, encrypting storage pools, and running initial baseline data seeding." },
      { step: 4, title: "Mock Disaster Recovery Drill", description: "Simulating a complete server failure to verify successful, rapid recovery." }
    ],
    suitableCustomers: [
      "All businesses relying on digital accounting, customer records, or CAD/design files",
      "Schools and universities safeguarding academic and financial archives",
      "Hospitals and diagnostic clinics maintaining electronic health records (EHR)",
      "Law firms maintaining critical litigation files"
    ],
    relatedServices: ["cybersecurity-services", "server-installation-and-management", "cloud-solutions", "database-design-and-management"],
    deliveryTimeframe: "1 - 2 Weeks Setup / Continuous Protection",
    pricingRange: "Storage tier based pricing"
  },
  {
    id: "cctv-and-security-camera-installation",
    slug: "cctv-and-security-camera-installation",
    title: "CCTV and Security Camera Installation",
    tagline: "Commercial-grade IP video surveillance with AI analytics, night vision, and encrypted mobile remote monitoring.",
    badge: "Security & Surveillance",
    iconName: "Camera",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "High-definition IP security camera deployments, NVR storage setups, perimeter motion alerts, and smartphone remote viewing.",
    detailedDescription: "Physical security is the indispensable foundation of enterprise data security. KJT TECHNOLOGIES engineers and installs turnkey commercial surveillance solutions utilizing ultra-HD 4K IP cameras, Power over Ethernet (PoE) switches, Network Video Recorders (NVRs), and AI-powered intrusion detection. Monitor your premises in real-time from anywhere in the world.",
    keyBenefits: [
      { title: "Crystal-Clear 4K Ultra-HD", description: "High-resolution optical zoom providing undeniable facial and license plate identification." },
      { title: "Smart AI Threat Detection", description: "Filter out false alarms with human shape detection, vehicle alerts, and line-crossing triggers." },
      { title: "Encrypted Mobile Remote View", description: "Watch live feeds and playback recorded incidents securely from your phone or laptop." },
      { title: "Extreme Durability & Night Vision", description: "Vandal-resistant IK10, IP67 weatherproof enclosures with full-color low-light night vision." }
    ],
    whatIsIncluded: [
      "On-site site survey, line-of-sight mapping, and blind-spot analysis",
      "Commercial PoE IP dome, bullet, and PTZ optical zoom cameras",
      "Heavy-duty Network Video Recorder (NVR) with surveillance-grade hard drives",
      "Structured CAT6 shielded cabling, conduit runs, and patch panel termination",
      "Centralized Uninterruptible Power Supply (UPS) for continuous power during outages",
      "Mobile app & desktop monitoring client setup with secure user accounts",
      "Comprehensive handover, administrator training, and 1-year equipment warranty"
    ],
    workingProcess: [
      { step: 1, title: "On-Site Physical Survey", description: "Evaluating perimeter boundaries, entry gates, server rooms, and lighting conditions." },
      { step: 2, title: "Surveillance Blueprints", description: "Designing camera angles, focal lengths, storage retention calculations, and cabling routes." },
      { step: 3, title: "Professional Installation", description: "Clean conduit installation, camera mounting, cable testing, and NVR rack mounting." },
      { step: 4, title: "Focus Calibration & Mobile App", description: "Fine-tuning detection zones, configuring remote mobile apps, and conducting staff training." }
    ],
    suitableCustomers: [
      "Offices, commercial corporate complexes, and headquarters",
      "Schools, boarding schools, and university campuses",
      "Warehouses, distribution hubs, and manufacturing plants",
      "Retail shopping plazas, supermarkets, and residential estates"
    ],
    relatedServices: ["access-control-and-biometric-systems", "computer-networking", "server-installation-and-management", "it-support-and-maintenance"],
    deliveryTimeframe: "3 - 7 Days (Depending on camera count)",
    pricingRange: "Itemized quote based on hardware & camera count"
  },
  {
    id: "computer-networking",
    slug: "computer-networking",
    title: "Computer Networking",
    tagline: "High-throughput structured cabling, enterprise Wi-Fi 6, managed switches, and secure VLAN network architectures.",
    badge: "Infrastructure & Hardware",
    iconName: "Network",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Structured CAT6/fiber optic cabling, enterprise seamless Wi-Fi mesh, managed switches, VLAN segmentations, and site-to-site VPNs.",
    detailedDescription: "A sluggish or unstable network bottlenecks your entire workforce. KJT TECHNOLOGIES designs and deploys robust wired and wireless network infrastructures. We engineer structured cabling networks, server racks, managed switches, VLANs that isolate guest traffic from confidential servers, and seamless Wi-Fi access points that support hundreds of simultaneous devices without drops.",
    keyBenefits: [
      { title: "Gigabit & 10G Speeds", description: "Eliminate video buffering, file transfer lag, and VoIP jitter across your entire facility." },
      { title: "Enterprise Wi-Fi Roaming", description: "Move between offices, floors, and buildings without losing connection or re-authenticating." },
      { title: "VLAN Security Isolation", description: "Prevent guests or compromised IoT devices from accessing your financial servers or student records." },
      { title: "Clean Cable Management", description: "Professionally routed, labeled, and certified cabling inside tidy server racks." }
    ],
    whatIsIncluded: [
      "Structured CAT6/CAT6A or fiber optic cabling with certified fluke test reports",
      "Server rack cabinet installation, patch panels, and cable management trays",
      "Enterprise managed Gigabit/10GbE PoE switches and routers",
      "Ceiling-mounted Wi-Fi 6 enterprise access points with zero-handoff roaming",
      "VLAN segmentation (Corporate, VoIP, CCTV, Guest Wi-Fi)",
      "Bandwidth management and Quality of Service (QoS) rules for Zoom/Teams",
      "Detailed network topology diagram and port labeling documentation"
    ],
    workingProcess: [
      { step: 1, title: "Site RF & Cabling Assessment", description: "Conducting Wi-Fi heatmap surveys, wall penetration tests, and measuring cable run lengths." },
      { step: 2, title: "Network Architecture Plan", description: "Drafting IP subnets, VLAN mappings, switch configurations, and equipment BOM." },
      { step: 3, title: "Structured Installation", description: "Pulling cables through conduits, terminating keystone jacks, dressing server racks." },
      { step: 4, title: "Speed Testing & Certification", description: "Certifying every single cable drop and tuning wireless channels for zero interference." }
    ],
    suitableCustomers: [
      "Offices moving into new buildings or renovating current premises",
      "Schools, colleges, and libraries requiring high-density campus Wi-Fi",
      "Hotels and multi-tenant residential or corporate facilities",
      "Warehouses requiring reliable barcode scanner wireless connectivity"
    ],
    relatedServices: ["server-installation-and-management", "cctv-and-security-camera-installation", "cybersecurity-services", "it-support-and-maintenance"],
    deliveryTimeframe: "1 - 3 Weeks (Depending on drop count)",
    pricingRange: "Itemized quote per network drop / hardware bundle"
  },
  {
    id: "server-installation-and-management",
    slug: "server-installation-and-management",
    title: "Server Installation and Management",
    tagline: "Enterprise server virtualization, active directory domain controllers, and high-availability hardware management.",
    badge: "Infrastructure & Hardware",
    iconName: "Server",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "On-premise physical and virtual server deployments (Windows Server, Linux, VMware, Proxmox), Active Directory, and ongoing server administration.",
    detailedDescription: "Empower your corporate applications with high-performance on-premise compute power. KJT TECHNOLOGIES designs, builds, and maintains mission-critical servers. From configuring hypervisors (VMware ESXi, Proxmox, Hyper-V) and Windows Active Directory domain controllers to RAID storage arrays and Linux database servers, we ensure your infrastructure runs 24/7 with zero hitches.",
    keyBenefits: [
      { title: "Virtualization Efficiency", description: "Consolidate multiple physical boxes onto redundant hypervisors, slashing power and maintenance costs." },
      { title: "Centralized User & Permission Control", description: "Manage all workstation logins, passwords, and security policies via Active Directory / LDAP." },
      { title: "High Hardware Redundancy", description: "Dual hot-swappable power supplies, ECC memory, and hardware RAID drive mirrors." },
      { title: "Proactive Health Monitoring", description: "Continuous CPU, RAM, disk health, and temperature alerting before failures happen." }
    ],
    whatIsIncluded: [
      "Hardware selection, rack-mounting, and power distribution setup",
      "Hypervisor installation (VMware ESXi, Proxmox VE, or Microsoft Hyper-V)",
      "Windows Server / Ubuntu / RHEL enterprise operating system deployment",
      "Active Directory Domain Services (AD DS), DNS, and DHCP configuration",
      "Centralized file sharing with departmental security permissions",
      "RAID storage pool configuration (RAID 1, 5, 6, or 10)",
      "System administration training and monthly server maintenance retainer"
    ],
    workingProcess: [
      { step: 1, title: "Workload Sizing Audit", description: "Calculating required CPU cores, RAM, and IOPS disk throughput for current and future growth." },
      { step: 2, title: "Hardware Procurement & Staging", description: "Bench-testing server hardware, updating firmware, and configuring BIOS & RAID." },
      { step: 3, title: "Hypervisor & OS Setup", description: "Deploying virtualization layer, spinning up virtual machines, and configuring networks." },
      { step: 4, title: "Data Migration & Domain Join", description: "Migrating enterprise data, joining client workstations, and testing performance." }
    ],
    suitableCustomers: [
      "Companies hosting local ERPs, databases, or accounting software",
      "Organizations requiring centralized user accounts and group policies",
      "Schools running local intranet exam portals and file repositories",
      "Engineering and architecture studios utilizing high-throughput file servers"
    ],
    relatedServices: ["computer-networking", "data-protection-and-backup-solutions", "cloud-solutions", "database-design-and-management"],
    deliveryTimeframe: "1 - 2 Weeks",
    pricingRange: "Project installation fee + optional monthly maintenance"
  },
  {
    id: "cloud-solutions",
    slug: "cloud-solutions",
    title: "Cloud Solutions (AWS, Azure, Google Cloud)",
    tagline: "Scalable cloud infrastructure migration, hybrid environments, and serverless optimization.",
    badge: "Cloud & DevOps",
    iconName: "Cloud",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Cloud strategy, seamless migration, AWS/Azure/GCP setup, serverless architecture, and cost-effective FinOps management.",
    detailedDescription: "Unlock unparalleled agility and eliminate on-premise hardware refresh cycles with modern cloud computing. KJT TECHNOLOGIES guides your organization through cloud discovery, planning, migration, and ongoing management. Whether you need a full public cloud deployment on AWS, Azure, or Google Cloud, or a secure hybrid model, we engineer cloud environments that scale dynamically with demand.",
    keyBenefits: [
      { title: "99.99% Cloud Availability", description: "Eliminate downtime risks with geographically distributed multi-zone cloud infrastructure." },
      { title: "FinOps Cost Optimization", description: "Pay only for what you use, with auto-scaling and rightsizing eliminating wasted cloud spend." },
      { title: "Rapid Elastic Scaling", description: "Instantly handle sudden spikes in user traffic without manual hardware procurement." },
      { title: "Automated Cloud Disaster Recovery", description: "Geo-replicated database backups and near-instant recovery in alternate cloud regions." }
    ],
    whatIsIncluded: [
      "Cloud readiness assessment and total cost of ownership (TCO) breakdown",
      "Virtual Private Cloud (VPC) network architecture with private subnets",
      "Server and database migration with minimal or zero downtime cutovers",
      "Identity and Access Management (IAM) hardening and multi-factor authentication",
      "Auto-scaling server groups and load balancer configuration",
      "Cloud budget alarms, billing thresholds, and cost-optimization recommendations",
      "Post-migration monitoring and ongoing cloud management services"
    ],
    workingProcess: [
      { step: 1, title: "Cloud Readiness Discovery", description: "Cataloging on-premise servers, data dependencies, compliance requirements, and latency targets." },
      { step: 2, title: "Cloud Architecture Design", description: "Designing secure VPCs, security groups, database instances, and storage buckets." },
      { step: 3, title: "Staged Data & App Migration", description: "Replicating databases, running parallel staging environments, and conducting user acceptance testing." },
      { step: 4, title: "DNS Cutover & Optimization", description: "Switching live traffic smoothly, decommissioning legacy instances, and rightsizing resources." }
    ],
    suitableCustomers: [
      "Growing companies outgrowing local physical server limitations",
      "Software development firms requiring reliable staging and production cloud tiers",
      "Distributed and remote teams requiring 24/7 cloud workspace access",
      "Enterprises looking to reduce capital expenditure on hardware"
    ],
    relatedServices: ["web-application-development", "cybersecurity-services", "data-protection-and-backup-solutions", "server-installation-and-management"],
    deliveryTimeframe: "3 - 8 Weeks",
    pricingRange: "Migration project fee + cloud usage"
  },
  {
    id: "it-support-and-maintenance",
    slug: "it-support-and-maintenance",
    title: "IT Support and Maintenance",
    tagline: "Proactive managed IT services, rapid helpdesk resolution, and preventative technology care.",
    badge: "Support & Maintenance",
    iconName: "Wrench",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Comprehensive outsourced IT department, SLA-backed helpdesk ticketing, on-site technician dispatches, and routine software patch management.",
    detailedDescription: "Focus on running your business while KJT TECHNOLOGIES handles your technology. Our Managed IT Support agreements provide end-to-end technical stewardship. We maintain your computers, printers, servers, networks, and software licenses, providing your staff with a friendly, fast-acting helpdesk team just a phone call or WhatsApp message away.",
    keyBenefits: [
      { title: "Predictable Monthly Investment", description: "Eliminate surprise emergency repair costs with all-inclusive managed IT retainers." },
      { title: "Sub-15-Minute Response SLA", description: "Prompt remote diagnosis and resolution to get your team back to productive work." },
      { title: "Preventative Maintenance", description: "We catch and fix drive errors, overheating, and software conflicts before staff notice." },
      { title: "Strategic Technology Advisory", description: "Quarterly virtual CIO reviews helping you plan hardware upgrades and software investments." }
    ],
    whatIsIncluded: [
      "Unlimited remote helpdesk support via phone, email, WhatsApp, and remote screen share",
      "Scheduled monthly on-site maintenance visits by certified engineers",
      "Automated OS patch management, software updates, and antivirus health tracking",
      "Printer, scanner, and peripheral troubleshooting across all workstations",
      "New employee workstation onboarding and decommission offboarding",
      "Network switch, Wi-Fi, and firewall routine firmware updates",
      "Monthly executive IT health report detailing resolved tickets and uptime statistics"
    ],
    workingProcess: [
      { step: 1, title: "Onboarding & Asset Tagging", description: "We inventory and audit all computers, printers, network gear, and software licenses." },
      { step: 2, title: "Agent Deployment & Hardening", description: "Installing our secure remote monitoring and patch management agents on all systems." },
      { step: 3, title: "Helpdesk Launch", description: "Providing your staff with dedicated hotline numbers, email desks, and ticketing shortcuts." },
      { step: 4, title: "Continuous Optimization", description: "Reviewing ticket trends, eliminating recurring bottlenecks, and conducting preventative care." }
    ],
    suitableCustomers: [
      "Small-to-medium businesses without a dedicated internal IT department",
      "Schools and colleges seeking dependable technical support for staff rooms and computer labs",
      "Corporate branch offices needing reliable local on-site technicians",
      "Medical clinics, law offices, and accounting firms requiring guaranteed response SLAs"
    ],
    relatedServices: ["computer-repair-and-upgrades", "computer-networking", "server-installation-and-management", "cybersecurity-services"],
    deliveryTimeframe: "Immediate Onboarding (1-3 days) / Monthly Retainer",
    pricingRange: "Per-workstation or fixed monthly tier"
  },
  {
    id: "computer-repair-and-upgrades",
    slug: "computer-repair-and-upgrades",
    title: "Computer Repair and Upgrades",
    tagline: "Professional hardware diagnostics, component repairs, SSD/RAM speed upgrades, and virus removal.",
    badge: "Hardware Care",
    iconName: "Cpu",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Certified hardware diagnostics, laptop screen/keyboard repairs, desktop power supply replacements, SSD speed boosts, and malware cleanups.",
    detailedDescription: "Don't discard sluggish or malfunctioning computers. KJT TECHNOLOGIES provides expert component-level repairs and cost-effective performance upgrades. From replacing aging mechanical hard drives with lightning-fast Solid State Drives (SSDs) and expanding RAM to repairing motherboards, power supplies, and thermal systems, we restore your computers to peak speed.",
    keyBenefits: [
      { title: "Massive Speed Multipliers", description: "Upgrade slow laptops with fast NVMe/SATA SSDs for boot times under 15 seconds." },
      { title: "Huge Capital Savings", description: "Extend the useful lifespan of existing office computers by 3-5 years for a fraction of new PC costs." },
      { title: "Zero Data Loss Guarantee", description: "We clone your operating system, files, and installed software intact during drive upgrades." },
      { title: "Clean Hardware Maintenance", description: "Deep internal dust cleaning and premium thermal paste re-application prevents thermal throttling." }
    ],
    whatIsIncluded: [
      "Thorough multi-point hardware diagnostic test (RAM, drive health, motherboard, PSU)",
      "High-speed Solid State Drive (SSD) upgrades with 1-to-1 data cloning",
      "RAM memory expansion for smoother multitasking and demanding software",
      "Laptop screen replacements, hinge repairs, and keyboard replacements",
      "Deep malware, spyware, and rootkit removal with operating system tune-up",
      "Internal thermal cooling cleanup and fresh thermal paste application",
      "Written repair warranty covering all replacement components and labor"
    ],
    workingProcess: [
      { step: 1, title: "Diagnostic Intake", description: "Bench-testing the hardware, assessing error logs, and pinpointing the root cause." },
      { step: 2, title: "Transparent Quote", description: "Providing a clear breakdown of replacement parts cost and labor prior to work." },
      { step: 3, title: "Precision Repair & Cloned Upgrade", description: "Executing component repair, cloning data with zero loss, and stress testing." },
      { step: 4, title: "Quality Assurance & Handover", description: "Running benchmark stability tests and returning the machine in spotless condition." }
    ],
    suitableCustomers: [
      "Offices seeking to speed up sluggish staff computers without purchasing new fleets",
      "Schools maintaining computer science labs and administrative workstations",
      "Professionals whose laptops have suffered broken screens, liquid spills, or charging faults",
      "Retail shops with malfunctioning POS terminals or inventory PCs"
    ],
    relatedServices: ["it-support-and-maintenance", "data-protection-and-backup-solutions", "server-installation-and-management", "ict-training-and-consultancy"],
    deliveryTimeframe: "24 - 48 Hours for standard repairs",
    pricingRange: "Diagnostic assessment + replacement parts"
  },
  {
    id: "domain-registration-and-web-hosting",
    slug: "domain-registration-and-web-hosting",
    title: "Domain Registration and Web Hosting",
    tagline: "Enterprise cloud hosting, domain acquisition, automatic SSL certificates, and 99.9% uptime servers.",
    badge: "Web & Digital",
    iconName: "Globe2",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Secure domain registration, DNS management, high-speed NVMe cloud web hosting, free SSL certificates, and automatic daily backups.",
    detailedDescription: "A great website requires a rock-solid hosting foundation. KJT TECHNOLOGIES delivers high-speed cloud web hosting and seamless domain portfolio management. We handle global (.com, .org, .net) and country-code (.ng, .co.uk, .ke, .za) domain registrations, configure bulletproof DNS records, and host websites on optimized NVMe cloud servers with built-in DDoS mitigation.",
    keyBenefits: [
      { title: "99.9% Server Uptime Guarantee", description: "Keep your website accessible to clients around the clock with redundant server clusters." },
      { title: "Ultra-Fast NVMe SSD Storage", description: "High I/O speed storage ensures rapid database queries and instant page deliveries." },
      { title: "Free Automated SSL Certificates", description: "Keep the secure padlock icon active with auto-renewing Let's Encrypt / Sectigo certificates." },
      { title: "Hassle-Free DNS Management", description: "We handle MX, SPF, DKIM, DMARC, and CNAME records with precision to prevent mail deliverability issues." }
    ],
    whatIsIncluded: [
      "Custom domain registration and annual renewal management",
      "High-speed NVMe cloud web hosting with cPanel/Plesk control panel",
      "Free automated SSL/TLS certificate installation and HTTP to HTTPS redirection",
      "Automated offsite daily backups with 30-day retention rollback",
      "Web Application Firewall (WAF) to block malicious bots, scrapers, and brute-force attacks",
      "Business email accounts with webmail and mobile IMAP/POP3 access",
      "Zero-downtime website migration from your previous hosting provider"
    ],
    workingProcess: [
      { step: 1, title: "Domain Search & Selection", description: "Verifying domain availability, securing trademark domains, and acquiring extensions." },
      { step: 2, title: "Hosting Provisioning", description: "Configuring dedicated web spaces, database limits, and PHP/Node.js runtimes." },
      { step: 3, title: "Migration & DNS Hardening", description: "Migrating existing files, setting up MX email records, and deploying SSL certificates." },
      { step: 4, title: "Live Monitoring", description: "Monitoring server response times, disk utilization, and uptime 24/7." }
    ],
    suitableCustomers: [
      "New businesses registering their brand domains and setting up their first website",
      "Established organizations experiencing slow speeds or frequent outages on cheap shared hosts",
      "E-commerce stores requiring high-speed database performance and PCI compliance",
      "Schools and institutions managing multiple subdomains for portals and libraries"
    ],
    relatedServices: ["website-design-and-development", "email-and-business-communication-setup", "search-engine-optimization", "cloud-solutions"],
    deliveryTimeframe: "Instant setup (within 2 hours)",
    pricingRange: "Annual subscription tiers"
  },
  {
    id: "search-engine-optimization",
    slug: "search-engine-optimization",
    title: "Search Engine Optimization (SEO)",
    tagline: "Data-driven organic search rankings, keyword targeting, technical SEO audits, and local Google visibility.",
    badge: "Marketing & Growth",
    iconName: "TrendingUp",
    image: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Strategic on-page, off-page, and technical SEO designed to position your business at the top of Google search results for high-intent keywords.",
    detailedDescription: "Having a stunning website means little if your target customers cannot find you. KJT TECHNOLOGIES executes technical and content-driven Search Engine Optimization (SEO) strategies. We audit your site architecture, optimize Core Web Vitals, research high-converting search terms, and build localized search authority that generates ongoing organic inquiries.",
    keyBenefits: [
      { title: "Top-Tier Organic Google Rankings", description: "Appear right when high-value clients are actively searching for your services." },
      { title: "Continuous Inbound Leads", description: "Generate qualified inquiries 24/7 without paying per click on expensive advertising." },
      { title: "Core Web Vitals Optimization", description: "Fine-tune website speed, Cumulative Layout Shift (CLS), and mobile responsiveness for search algorithms." },
      { title: "Local Map Pack Visibility", description: "Rank prominently in Google Maps and local business listings for nearby customers." }
    ],
    whatIsIncluded: [
      "Comprehensive technical SEO audit and site crawl error remediation",
      "Competitor keyword gap analysis and search intent mapping",
      "On-page optimization (title tags, meta descriptions, header structure, image ALT tags)",
      "Schema.org structured data markup (LocalBusiness, Organization, Service)",
      "Google Business Profile optimization and local citation consistency",
      "XML sitemap generation and Google Search Console indexing verification",
      "Monthly keyword ranking progress and organic traffic reporting"
    ],
    workingProcess: [
      { step: 1, title: "Technical & Benchmark Audit", description: "Auditing indexation, broken links, site speed, and existing keyword rankings." },
      { step: 2, title: "Keyword & Market Strategy", description: "Identifying high-volume, low-competition commercial search phrases relevant to your niche." },
      { step: 3, title: "On-Page & Architecture Optimization", description: "Restructuring URLs, headings, meta tags, and internal link architecture." },
      { step: 4, title: "Tracking & Content Growth", description: "Monitoring ranking movements, refining pages, and tracking inbound phone/form conversions." }
    ],
    suitableCustomers: [
      "Companies launching a new website that needs immediate search visibility",
      "Service businesses losing valuable leads to competitors on Google",
      "Schools and colleges wanting to boost admissions inquiries during enrollment windows",
      "E-commerce stores looking to drive organic product sales"
    ],
    relatedServices: ["website-design-and-development", "domain-registration-and-web-hosting", "ui-ux-design", "digital-transformation-consulting"],
    deliveryTimeframe: "Initial audit (1 week) / 3-6 month growth campaigns",
    pricingRange: "Monthly growth retainer"
  },
  {
    id: "ui-ux-design",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    tagline: "User-centered visual design, wireframing, interactive Figma prototypes, and conversion optimization.",
    badge: "Design & Product",
    iconName: "Palette",
    // CUSTOMIZE HERE: Replace this image with your own UI/UX design service image.
    image: "/images/services/ui-ux-design.webp",
    imageAlt: "UI and UX designer creating responsive website and mobile application interfaces for KJT TECHNOLOGIES",
    shortDescription: "Interactive Figma wireframing, polished design systems, user journey mapping, and conversion-focused UI/UX design for web and mobile.",
    detailedDescription: "Exceptional software begins with empathy for the user. KJT TECHNOLOGIES crafts human-centric UI/UX designs that transform complicated digital workflows into clean, frictionless experiences. We design design systems, interactive prototypes, user journey diagrams, and design specifications that developers can build with mathematical precision.",
    keyBenefits: [
      { title: "Higher Conversion Rates", description: "Remove friction points and guide visitors effortlessly toward booking, buying, or contacting." },
      { title: "Lower Development Costs", description: "Resolve design and workflow flaws in Figma prototypes before writing expensive code." },
      { title: "Consistent Brand Identity", description: "Unified design systems with standardized color palettes, typography scales, and UI components." },
      { title: "WCAG Accessibility Compliant", description: "High contrast ratios, legible typography, and intuitive touch targets for all users." }
    ],
    whatIsIncluded: [
      "User research, stakeholder discovery interviews, and user persona creation",
      "Information architecture, site maps, and low-fidelity user flow wireframes",
      "High-fidelity UI mockups in Figma with modern typography and iconography",
      "Clickable interactive prototypes for user testing and stakeholder presentations",
      "Design system component library (buttons, inputs, cards, navigation bars, modals)",
      "Developer handoff documentation with CSS tokens and exported SVG assets",
      "Two rounds of revisions and visual refinement"
    ],
    workingProcess: [
      { step: 1, title: "Research & Journey Mapping", description: "Understanding user goals, pain points, and mapping out the optimal path to completion." },
      { step: 2, title: "Wireframing & UX Structure", description: "Creating schematic layout wireframes focusing on content hierarchy and usability." },
      { step: 3, title: "Visual UI Design", description: "Applying color theory, typography, micro-interactions, and high-fidelity styling." },
      { step: 4, title: "Interactive Prototyping & Handoff", description: "Building click-through prototypes and providing pixel-perfect developer asset specs." }
    ],
    suitableCustomers: [
      "Startups validating software concepts before investing in full-stack development",
      "Enterprises redesigning complex internal software that staff struggle to navigate",
      "Businesses with high website drop-off rates wanting conversion improvements",
      "Product teams needing a comprehensive Figma design system"
    ],
    relatedServices: ["website-design-and-development", "web-application-development", "mobile-app-development", "digital-transformation-consulting"],
    deliveryTimeframe: "2 - 5 Weeks",
    pricingRange: "Scope-based project fee"
  },
  {
    id: "database-design-and-management",
    slug: "database-design-and-management",
    title: "Database Design and Management",
    tagline: "High-concurrency database architecture, normalization, query optimization, and enterprise replication.",
    badge: "Enterprise Systems",
    iconName: "Database",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Relational (PostgreSQL, MySQL, SQL Server) and NoSQL database modeling, query tuning, automated failover, and data migration.",
    detailedDescription: "Data is the lifeblood of your organization. A poorly architected database leads to data corruption, painfully slow queries, and crippling system crashes. KJT TECHNOLOGIES architects normalized, resilient database solutions. From designing Entity Relationship Diagrams (ERD) and indexing bottlenecks to setting up replication clusters and automating point-in-time recovery, we keep your data fast, consistent, and safe.",
    keyBenefits: [
      { title: "Sub-Millisecond Query Response", description: "Optimized indexing, query refactoring, and caching eliminate database sluggishness." },
      { title: "Strict ACID Data Integrity", description: "Foreign key constraints, transactional rollback safety, and normalized schemas prevent data duplication." },
      { title: "Automated High-Availability Failover", description: "Primary/replica configurations ensure immediate failover without transaction loss." },
      { title: "Safe Legacy Migration", description: "Zero-data-loss extraction, transformation, and loading (ETL) between legacy and modern databases." }
    ],
    whatIsIncluded: [
      "Database schema architecture, normalization, and Entity Relationship Diagrams (ERD)",
      "Database engine setup (PostgreSQL, MySQL, Microsoft SQL Server, MongoDB, Redis)",
      "Slow query auditing, index optimization, and performance benchmarking",
      "Automated point-in-time recovery (PITR) and backup scheduling",
      "Role-based database access permissions, connection pooling, and encryption at rest",
      "Data migration scripts and automated sanitization pipelines",
      "Database administrator documentation and schema dictionary"
    ],
    workingProcess: [
      { step: 1, title: "Data Entity Analysis", description: "Mapping out data entities, attributes, relationships, and anticipated read/write concurrency." },
      { step: 2, title: "Normalized Schema Design", description: "Creating normalized tables, indexing strategies, constraints, and audit logging triggers." },
      { step: 3, title: "Performance Stress Testing", description: "Simulating heavy traffic workloads and benchmarking query response times." },
      { step: 4, title: "Replication & Backup Vaults", description: "Configuring read-replicas, connection pooling, and continuous snapshot backups." }
    ],
    suitableCustomers: [
      "Companies whose internal software is slowing down due to bloated databases",
      "Applications experiencing lockups or deadlocks during peak customer traffic",
      "Organizations migrating away from legacy Access databases or fragile Excel files",
      "Enterprises preparing for high-volume transactions and compliance audits"
    ],
    relatedServices: ["web-application-development", "business-management-systems", "server-installation-and-management", "cloud-solutions"],
    deliveryTimeframe: "2 - 6 Weeks",
    pricingRange: "Milestone-based database engineering"
  },
  {
    id: "email-and-business-communication-setup",
    slug: "email-and-business-communication-setup",
    title: "Email and Business Communication Setup",
    tagline: "Professional branded corporate email, Google Workspace, Microsoft 365, and SPF/DKIM/DMARC deliverability.",
    badge: "Communication & Tools",
    iconName: "Mail",
    image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Custom domain email addresses (@yourcompany.com), Google Workspace & Microsoft 365 setup, email security (SPF, DKIM, DMARC), and spam filtering.",
    detailedDescription: "Sending business quotes from generic Gmail or Yahoo accounts damages credibility and invites cyber threats. KJT TECHNOLOGIES sets up and manages corporate business communication suites. We deploy Google Workspace and Microsoft 365 on your company domain, configure SPF, DKIM, and DMARC cryptographic signatures to prevent emails landing in spam folders, and secure accounts with multi-factor authentication.",
    keyBenefits: [
      { title: "Instant Professional Credibility", description: "Staff communicate with custom branded email addresses (e.g., name@yourcompany.com)." },
      { title: "100% Inbox Deliverability", description: "Cryptographic SPF, DKIM, and DMARC records prevent spoofing and ensure your emails reach inboxes." },
      { title: "Collaborative Cloud Storage", description: "Integrated Google Drive or Microsoft OneDrive for seamless team document sharing." },
      { title: "Business Continuity Protection", description: "Centralized admin controls allow you to instantly reassign or lock accounts when staff depart." }
    ],
    whatIsIncluded: [
      "Google Workspace / Microsoft 365 tenant setup and domain verification",
      "Creation of user mailboxes, shared departmental inboxes (e.g., info@, sales@, support@)",
      "Configuration of SPF, DKIM, and DMARC DNS security records",
      "Cross-device email synchronization across phones, tablets, Outlook, and web browsers",
      "Historical email migration from older webmail or cPanel hosts",
      "Multi-Factor Authentication (MFA) enforcement across all corporate accounts",
      "Staff onboarding quick-start guide and administrative handover"
    ],
    workingProcess: [
      { step: 1, title: "Domain & Identity Setup", description: "Verifying domain ownership and configuring cloud communication tenants." },
      { step: 2, title: "Mailbox Configuration", description: "Provisioning user accounts, aliases, distribution lists, and shared mailboxes." },
      { step: 3, title: "Security Record Signing", description: "Generating and publishing cryptographic DKIM and SPF DNS records." },
      { step: 4, title: "Device Sync & Testing", description: "Connecting phones, computers, and Outlook, then conducting live deliverability testing." }
    ],
    suitableCustomers: [
      "Businesses currently using generic free @gmail.com or @yahoo.com addresses",
      "Organizations whose emails are frequently flagged as spam or bounced by clients",
      "Companies wanting to adopt Microsoft Teams or Google Meet for team collaboration",
      "Schools setting up official student and faculty email addresses"
    ],
    relatedServices: ["domain-registration-and-web-hosting", "cybersecurity-services", "website-design-and-development", "it-support-and-maintenance"],
    deliveryTimeframe: "1 - 3 Business Days",
    pricingRange: "Setup fee + license provider costs"
  },
  {
    id: "digital-transformation-consulting",
    slug: "digital-transformation-consulting",
    title: "Digital Transformation Consulting",
    tagline: "Strategic roadmap planning, legacy modernization, workflow automation, and technology feasibility studies.",
    badge: "Consultancy & Support",
    iconName: "Compass",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Strategic IT roadmaps, software procurement guidance, legacy workflow automation, and executive technology advisory.",
    detailedDescription: "Digital transformation is not about buying trendy tools; it is about aligning technology with business outcomes. KJT TECHNOLOGIES serves as your trusted technology advisor. We audit your current operational bottlenecks, review existing software subscriptions, eliminate redundant tools, and create a phased, budget-conscious roadmap that scales your enterprise sustainably.",
    keyBenefits: [
      { title: "Objective Technology Guidance", description: "Vendor-agnostic recommendations focused purely on what benefits your organization's bottom line." },
      { title: "Elimination of Wasteful Software Spend", description: "Identify and cancel duplicate subscriptions and unused software licenses." },
      { title: "Phased, Low-Risk Modernization", description: "Step-by-step transition plans that upgrade systems without interrupting daily business." },
      { title: "Empowered Internal Teams", description: "Comprehensive change management and staff training ensures high software adoption rates." }
    ],
    whatIsIncluded: [
      "Comprehensive technology audit of current software, hardware, and operational processes",
      "Bottleneck identification report with quantifiable cost-savings analysis",
      "Phased 1-to-3-year Strategic Digital Roadmap tailored to your budget",
      "Vendor evaluation, RFP drafting, and commercial software selection assistance",
      "Workflow automation blueprints connecting separate business tools",
      "Executive presentations for board members and senior stakeholders",
      "Ongoing advisory check-ins to monitor implementation milestones"
    ],
    workingProcess: [
      { step: 1, title: "Stakeholder Discovery", description: "Interviews with management, department heads, and operational staff to map friction points." },
      { step: 2, title: "System & Tool Audit", description: "Evaluating current software utilization, licensing costs, and manual bottlenecks." },
      { step: 3, title: "Strategic Roadmap Formulation", description: "Drafting an actionable blueprint with prioritized recommendations, budgets, and timelines." },
      { step: 4, title: "Execution Governance", description: "Guiding software implementations, vendor negotiations, and measuring ROI metrics." }
    ],
    suitableCustomers: [
      "Established businesses burdened by manual paperwork, duplicate data entry, and slow processes",
      "Organizations preparing for rapid expansion or seeking investor funding",
      "Boards needing an objective, expert technical opinion before committing to major IT investments",
      "Institutions struggling to get staff to adopt new digital tools"
    ],
    relatedServices: ["business-management-systems", "cloud-solutions", "cybersecurity-services", "ict-training-and-consultancy"],
    deliveryTimeframe: "2 - 6 Weeks (Audit & Roadmap)",
    pricingRange: "Advisory engagement fee"
  },
  {
    id: "access-control-and-biometric-systems",
    slug: "access-control-and-biometric-systems",
    title: "Access Control and Biometric Systems",
    tagline: "RFID keycard entry, fingerprint and facial recognition turnstiles, and automated staff time-attendance tracking.",
    badge: "Security & Surveillance",
    iconName: "Fingerprint",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Biometric fingerprint & facial recognition access control, magnetic door locks, RFID card entry, and automated payroll attendance logging.",
    detailedDescription: "Control who enters your physical facilities and eliminate buddy-punching with professional access control solutions from KJT TECHNOLOGIES. We deploy facial recognition terminals, biometric fingerprint scanners, RFID smart card readers, electro-magnetic door locks, and optical turnstiles that log every entry attempt in real-time and export seamless attendance sheets for HR.",
    keyBenefits: [
      { title: "Strict Physical Access Security", description: "Ensure only authorized personnel can enter server rooms, executive suites, and storage areas." },
      { title: "Eliminate Time Theft", description: "Biometric fingerprint and facial recognition prevents employees clocking in for absent colleagues." },
      { title: "Instant Audit Trail Logs", description: "Full digital records of who entered which door, at what exact date and second." },
      { title: "Emergency Lockdown & Fire Release", description: "Integrated with fire alarms to automatically unlock exit doors in safety emergencies." }
    ],
    whatIsIncluded: [
      "Site survey of door frames (glass, wooden, metal, fire doors) and egress routes",
      "Biometric terminals (fingerprint, facial recognition, RFID, and PIN keypad)",
      "Heavy-duty 600lbs/1200lbs electromagnetic locks or electric strike releases",
      "Emergency break-glass units and touchless exit push buttons",
      "Central access controller with backup battery supply in case of power cuts",
      "Time & Attendance management software integration with CSV/Excel payroll export",
      "Administrator software training and 1-year hardware warranty"
    ],
    workingProcess: [
      { step: 1, title: "Door & Egress Survey", description: "Assessing door construction, fire code compliance, power sources, and user access levels." },
      { step: 2, title: "Hardware Engineering Plan", description: "Selecting compatible lock brackets, cabling pathways, and controller locations." },
      { step: 3, title: "Installation & Cabling", description: "Mounting magnetic locks, running concealed cabling, and terminating controllers." },
      { step: 4, title: "Enrollment & HR Sync", description: "Enrolling user biometrics/cards, setting up access schedules, and training HR managers." }
    ],
    suitableCustomers: [
      "Corporate offices protecting server rooms, accounting departments, and executive floors",
      "Factories, warehouses, and logistics facilities tracking shift attendance",
      "Schools and universities managing staff registers and hostel entry gates",
      "Gyms, fitness clubs, and private member facilities requiring automated turnstile entry"
    ],
    relatedServices: ["cctv-and-security-camera-installation", "computer-networking", "school-management-systems", "it-support-and-maintenance"],
    deliveryTimeframe: "2 - 5 Days per facility",
    pricingRange: "Itemized quote based on door count & terminal type"
  },
  {
    id: "ict-training-and-consultancy",
    slug: "ict-training-and-consultancy",
    title: "ICT Training and Consultancy",
    tagline: "Practical, hands-on corporate tech workshops, cybersecurity awareness, software mastery, and staff upskilling.",
    badge: "Consultancy & Support",
    iconName: "Users",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Corporate technology training, employee cybersecurity awareness workshops, computer literacy programs, and hands-on software certification.",
    detailedDescription: "Technology is only as effective as the human beings operating it. KJT TECHNOLOGIES delivers practical, highly engaging ICT training programs tailored to corporate teams, school faculty, and organizational staff. From defending against modern phishing attacks to mastering business software, spreadsheets, and cloud collaboration, we empower your team to work securely and efficiently.",
    keyBenefits: [
      { title: "Fortified Human Firewall", description: "Train employees to recognize sophisticated social engineering, spear-phishing, and spoofed emails." },
      { title: "Boosted Office Productivity", description: "Equip staff with fast keyboard shortcuts, advanced data workflows, and collaboration habits." },
      { title: "Customized to Your Software", description: "Curriculums built directly around the exact systems and workflows your company uses daily." },
      { title: "Measurable Knowledge Retention", description: "Interactive quizzes, hands-on lab exercises, and post-training competency assessments." }
    ],
    whatIsIncluded: [
      "Pre-training staff skills assessment and tailored curriculum design",
      "On-site classroom sessions or live interactive virtual workshops",
      "Comprehensive illustrated student handbooks and cheat sheets (PDF)",
      "Hands-on practical lab exercises using your actual software environments",
      "Phishing simulation tests to gauge security awareness retention",
      "Individual Certificates of Completion for participating employees",
      "Post-training executive report detailing staff progress and areas for improvement"
    ],
    workingProcess: [
      { step: 1, title: "Skills Needs Assessment", description: "Evaluating current staff competencies and identifying the exact operational skills gaps." },
      { step: 2, title: "Customized Curriculum", description: "Developing real-world exercises and presentations centered on your daily software." },
      { step: 3, title: "Interactive Workshop Delivery", description: "Engaging, jargon-free training sessions led by patient, certified instructors." },
      { step: 4, title: "Testing & Certification", description: "Evaluating practical knowledge, issuing certificates, and reporting progress to leadership." }
    ],
    suitableCustomers: [
      "Enterprises wanting to minimize human error and protect against phishing scams",
      "Schools training teachers on digital gradebooks, smart boards, and virtual classrooms",
      "Organizations rolling out new ERP, CRM, or cloud software to all staff",
      "Government agencies and non-profits upskilling administrative personnel"
    ],
    relatedServices: ["cybersecurity-services", "digital-transformation-consulting", "it-support-and-maintenance", "school-management-systems"],
    deliveryTimeframe: "Half-day, full-day, or multi-week modular training",
    pricingRange: "Per-attendee or corporate group session rate"
  }
];
