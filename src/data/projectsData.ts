/**
 * =====================================================================
 * PROJECTS / PORTFOLIO DATA - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * --- CUSTOMIZATION GUIDE ---
 * This file contains realistic demonstration projects across all 8 categories:
 *  1. Websites
 *  2. Mobile applications
 *  3. Desktop applications
 *  4. School systems
 *  5. Business systems
 *  6. Cybersecurity
 *  7. Networking
 *  8. CCTV installations
 * 
 * Each project is labeled as a [Sample Project] until you replace it with your
 * real completed project data.
 * You can safely edit:
 *  - `title`, `clientName`, `category`, `shortDescription`, `fullDescription`
 *  - `challenge`, `solution`, `results`
 *  - `technologiesUsed`
 *  - `image` (replace with photos of your real work or screenshots)
 *  - `projectLink` (optional live URL or preview link)
 * =====================================================================
 */

import { ProjectItem } from '../types';

export const projectsData: ProjectItem[] = [
  {
    id: "horizon-group-corporate-portal",
    slug: "horizon-group-corporate-portal",
    title: "Horizon Global Corporate Portal & Brand Website",
    category: "Websites",
    clientName: "Horizon Investment Group [Sample Client]",
    industry: "Corporate & Finance",
    year: 2025,
    isSampleProject: true,
    shortDescription: "A high-speed, multilingual corporate website featuring interactive investor relation charts, dynamic press rooms, and sub-second page loads.",
    fullDescription: "Horizon Investment Group required a modern digital flagship to replace their decade-old legacy website. KJT TECHNOLOGIES engineered a custom React and Tailwind web portal with headless CMS integration, compliant WCAG AA accessibility, and automated SEO schema markup.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    challenge: "The previous site was slow (6+ seconds load time), non-responsive on smartphones, and difficult for non-technical staff to publish investor announcements.",
    solution: "Architected a static-optimized frontend using React, Vite, and Tailwind CSS with automated global CDN caching, responsive mobile breakpoints, and structured data.",
    results: [
      "Page load speed accelerated from 6.2s down to 0.7s (Core Web Vitals 99/100)",
      "140% surge in mobile session engagement and investor inquiries",
      "100% compliance with international accessibility (WCAG 2.1 AA) standards"
    ],
    technologiesUsed: ["React", "TypeScript", "Tailwind CSS", "Vite", "Cloudflare CDN", "SEO Schema"],
    projectLink: "https://example.com/sample-portfolio/horizon"
  },
  {
    id: "quicklogix-field-mobile-app",
    slug: "quicklogix-field-mobile-app",
    title: "QuickLogix Field Operations & Dispatch Mobile App",
    category: "Mobile applications",
    clientName: "QuickLogix Courier Express [Sample Client]",
    industry: "Logistics & Supply Chain",
    year: 2025,
    isSampleProject: true,
    shortDescription: "Cross-platform iOS and Android mobile app empowering 300+ dispatch couriers with offline parcel scanning, route guidance, and digital proof-of-delivery.",
    fullDescription: "QuickLogix couriers struggled with unreliable cellular connectivity in remote areas, leading to delayed parcel status updates. KJT TECHNOLOGIES built an offline-first mobile application in React Native featuring background SQLite synchronization, barcode scanning, and electronic signature capture.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    challenge: "Drivers frequently lost connectivity inside basements and warehouses, resulting in lost delivery confirmations and customer dispute delays.",
    solution: "Implemented an offline-first architecture with local encrypted SQLite databases, automated background syncing upon reconnection, and camera barcode scanning.",
    results: [
      "Zero lost delivery records across 45,000+ monthly shipments",
      "Courier drop-off check-in time reduced from 3 minutes to 15 seconds",
      "4.8/5-star driver satisfaction rating across iOS and Android stores"
    ],
    technologiesUsed: ["React Native", "TypeScript", "SQLite", "CameraKit", "Node.js", "Firebase Push"],
    projectLink: "https://example.com/sample-portfolio/quicklogix"
  },
  {
    id: "medivault-offline-desktop-pos",
    slug: "medivault-offline-desktop-pos",
    title: "MediVault Pharmacy Point-of-Sale & Inventory Desktop Software",
    category: "Desktop applications",
    clientName: "MediVault Pharmacy Chain [Sample Client]",
    industry: "Healthcare & Retail",
    year: 2024,
    isSampleProject: true,
    shortDescription: "High-throughput offline desktop POS and prescription dispensing software for Windows, integrated with thermal receipt printers and barcode hardware.",
    fullDescription: "MediVault needed a mission-critical desktop POS system that would never stop operating during internet service outages. KJT TECHNOLOGIES engineered a fast, reliable Windows/macOS desktop application with instant barcode scanning, drug expiration tracking, and multi-till cashier reconciliation.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    challenge: "Frequent broadband dropouts paralyzed store sales and led to long pharmacy queues and prescription dispensing errors.",
    solution: "Built a standalone Electron and C#/.NET desktop application communicating directly with USB thermal printers and cash drawers, synchronizing to head office asynchronously.",
    results: [
      "100% store uptime during regional internet outages",
      "Checkout transaction time cut by 60% with instant hotkey barcode input",
      "Eliminated inventory shrinkage by $28,000 via automated batch-expiry alerts"
    ],
    technologiesUsed: ["Electron", "TypeScript", "C# / .NET", "SQLite", "ESC/POS USB Protocols"],
    projectLink: "https://example.com/sample-portfolio/medivault"
  },
  {
    id: "oakridge-academy-school-system",
    slug: "oakridge-academy-school-system",
    title: "Oakridge Integrated Digital Campus & School Management System",
    category: "School systems",
    clientName: "Oakridge International Schools [Sample Client]",
    industry: "Education (K-12)",
    year: 2024,
    isSampleProject: true,
    shortDescription: "End-to-end digital campus system managing student admissions, automated gradebooks, fees reconciliation, and parent SMS notification portals.",
    fullDescription: "Oakridge Academy was bogged down by manual paper gradebooks, chaotic term-end report card production, and difficult fee follow-ups. KJT TECHNOLOGIES deployed our comprehensive School Management System, transitioning 1,800 students and 95 faculty members to a paperless campus.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    challenge: "Teachers spent 2 full weeks compiling paper report cards each term, with high rates of calculation errors and uncollected tuition fees.",
    solution: "Configured our custom School Management System with centralized grade calculation, automated PDF report generation, and SMS fee balance reminders.",
    results: [
      "Term report card generation accelerated from 14 days down to 20 minutes",
      "94% on-time fee collection achieved within the first 30 days of term",
      "Eliminated 100,000+ sheets of printed paper per academic session"
    ],
    technologiesUsed: ["React", "Node.js", "PostgreSQL", "Docker", "Twilio SMS API", "PDFKit"],
    projectLink: "https://example.com/sample-portfolio/oakridge"
  },
  {
    id: "vanguard-manufacturing-erp",
    slug: "vanguard-manufacturing-erp",
    title: "Vanguard Enterprise Resource Planning & Inventory System",
    category: "Business systems",
    clientName: "Vanguard Industrial Products [Sample Client]",
    industry: "Manufacturing & Distribution",
    year: 2024,
    isSampleProject: true,
    shortDescription: "Unified business management software synchronizing raw material inventory, multi-warehouse stock, accounting ledgers, and sales pipelines.",
    fullDescription: "Vanguard struggled with fragmented spreadsheets that caused costly inventory discrepancies between production plants and regional depots. KJT TECHNOLOGIES deployed a custom web-based ERP system linking procurement, assembly line tracking, invoicing, and real-time executive profit/loss reporting.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    challenge: "Stockouts and manual spreadsheet errors delayed manufacturing orders by up to 10 days, costing hundreds of thousands in idle plant time.",
    solution: "Developed an integrated ERP system with automated reorder thresholds, barcode bin tracking, and double-entry accounting ledgers.",
    results: [
      "Raw material stockout incidents plummeted by 88%",
      "Real-time financial visibility delivered to CFO with one-click balance sheets",
      "Reduced monthly invoice processing overhead by 35 staff hours"
    ],
    technologiesUsed: ["TypeScript", "React", "Python Django", "PostgreSQL", "Redis", "Tailwind CSS"],
    projectLink: "https://example.com/sample-portfolio/vanguard"
  },
  {
    id: "sentinel-zero-trust-defense",
    slug: "sentinel-zero-trust-defense",
    title: "Zero-Trust Cybersecurity Hardening & SOC Defense",
    category: "Cybersecurity",
    clientName: "HealthPulse Diagnostics Network [Sample Client]",
    industry: "Healthcare & Data Privacy",
    year: 2025,
    isSampleProject: true,
    shortDescription: "Complete vulnerability remediation, Next-Gen firewall deployment, and endpoint threat containment protecting 450,000+ sensitive medical records.",
    fullDescription: "HealthPulse Diagnostics faced elevated cybersecurity threats and required immediate ISO 27001 compliance. KJT TECHNOLOGIES conducted external and internal penetration tests, eradicated 48 vulnerabilities, deployed enterprise EDR agents, and trained staff against spear-phishing attacks.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    challenge: "Unpatched servers, unencrypted workstation drives, and weak employee password hygiene exposed confidential electronic medical records.",
    solution: "Architected a Zero-Trust defense perimeter with mandatory multi-factor authentication, next-generation firewall rules, and automated SIEM threat alarms.",
    results: [
      "100% audit pass score on official ISO 27001 and Data Privacy audits",
      "Neutralized 48 critical/high security vulnerabilities within 14 days",
      "Zero successful intrusion or ransomware attempts across all testing clinics"
    ],
    technologiesUsed: ["Fortinet NGFW", "CrowdStrike EDR", "Wazuh SIEM", "TLS 1.3", "Vulnerability Scanners"],
    projectLink: "https://example.com/sample-portfolio/sentinel"
  },
  {
    id: "apex-fiber-campus-networking",
    slug: "apex-fiber-campus-networking",
    title: "Campus Structured Cabling & 10G Fiber Network Deployment",
    category: "Networking",
    clientName: "Crestview Corporate Park [Sample Client]",
    industry: "Commercial Real Estate",
    year: 2024,
    isSampleProject: true,
    shortDescription: "Turnkey structured CAT6A cabling, 10-Gigabit inter-building fiber optic backbone, and enterprise Wi-Fi 6 mesh covering a 4-story facility.",
    fullDescription: "Crestview Corporate Park suffered from constant network congestion, Wi-Fi dead zones, and messy unlabelled patch panels. KJT TECHNOLOGIES overhauled the entire infrastructure: running 240+ CAT6A shielded drops, installing managed 10G PoE switches, and deploying 32 ceiling-mounted Wi-Fi 6 access points.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    challenge: "Tenant complaints regarding Wi-Fi drops, video conference lag, and an unmanageable rat's nest of cables in the server closet.",
    solution: "Designed and certified a structured cabling plan with tidy server rack enclosures, VLAN isolation (Tenants, Voice, Security), and seamless Wi-Fi roaming.",
    results: [
      "Network throughput increased from 80 Mbps to 1,000+ Mbps symmetrical",
      "Zero Wi-Fi dead zones across 45,000 square feet of office space",
      "Certified 25-year manufacturer warranty on all structured cabling runs"
    ],
    technologiesUsed: ["CAT6A Shielded Cabling", "OM4 Multi-mode Fiber", "Cisco Managed Switches", "UniFi Wi-Fi 6 APs"],
    projectLink: "https://example.com/sample-portfolio/crestview-networking"
  },
  {
    id: "grand-logistics-4k-cctv",
    slug: "grand-logistics-4k-cctv",
    title: "Commercial 4K IP CCTV & Perimeter Surveillance Deployment",
    category: "CCTV installations",
    clientName: "Grand Central Logistics Hub [Sample Client]",
    industry: "Warehousing & Transportation",
    year: 2025,
    isSampleProject: true,
    shortDescription: "Turnkey installation of 48 commercial 4K IP security cameras, AI-powered vehicle license plate recognition, and multi-screen control room NVRs.",
    fullDescription: "Grand Central Logistics needed high-definition 24/7 visual oversight across their 60,000 sq ft freight depot to deter cargo theft and monitor loading dock operations. KJT TECHNOLOGIES installed an enterprise IP surveillance network with weatherproof vandal-proof dome cameras and remote smartphone monitoring.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    challenge: "Unmonitored perimeter blind spots, night-time cargo tampering, and an outdated blurry analog camera system.",
    solution: "Installed 48 Ultra-HD 4K IP cameras with motorized optical zoom, color night-vision, AI human/vehicle line-crossing alarms, and 60-day redundant NVR storage.",
    results: [
      "Cargo shrinkage and theft reduced by 95% within the first 60 days",
      "Crystal-clear facial and vehicle license plate recognition in zero light",
      "Management monitors live loading dock feeds on smartphones anywhere, anytime"
    ],
    technologiesUsed: ["4K IP PoE Cameras", "Hikvision / Dahua NVRs", "AI Motion Analytics", "Industrial PoE Switches"],
    projectLink: "https://example.com/sample-portfolio/grand-cctv"
  }
];
