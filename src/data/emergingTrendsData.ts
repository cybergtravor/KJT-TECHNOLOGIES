/**
 * =====================================================================
 * EMERGING TECHNOLOGY TRENDS - DATA REPOSITORY
 * =====================================================================
 * 
 * Comprehensive trend radar covering:
 * - Artificial Intelligence and Machine Learning
 * - Internet of Things (IoT)
 * - Blockchain and Decentralised Systems
 * - Cloud and Edge Computing
 * - Robotics and Automation
 * - Smart Cities and Infrastructure
 * - Cybersecurity in the AI Era
 * - Virtual and Augmented Reality (VR/AR)
 * - Green and Sustainable Technology
 * - Quantum Computing
 * - Data Science and Big Data Analytics
 * =====================================================================
 */

export interface EmergingTrendItem {
  id: string;
  title: string;
  categoryBadge: string;
  badgeColor: string;
  summary: string;
  realWorldApplication: string;
  eastAfricaRelevance: string;
  impactScore: number; // 1 to 10
  maturityLevel: 'Early Innovation' | 'Rapid Growth' | 'Mainstream Adoption' | 'Enterprise Ready';
  image: string;
  imageAlt: string;
  relatedCategory: string;
  relatedArticleSlug?: string;
  keyTechnologies: string[];
}

export const emergingTrendsData: EmergingTrendItem[] = [
  {
    id: "ai-machine-learning",
    title: "Artificial Intelligence & Agentic Machine Learning",
    categoryBadge: "Artificial Intelligence",
    badgeColor: "border-[#00D4FF]/40 text-[#00D4FF] bg-[#00D4FF]/10",
    summary: "Autonomous neural pipelines capable of breaking complex business objectives into independent sub-tasks, reasoning across databases, and automating multi-platform operations without continuous human prompting.",
    realWorldApplication: "Autonomous customer triage, predictive inventory supply chains, automated invoice reconciliation, and medical triage diagnostics.",
    eastAfricaRelevance: "Enables regional SMBs and clinics to scale customer operations 24/7 without prohibitive staffing overheads.",
    impactScore: 9.8,
    maturityLevel: "Rapid Growth",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Digital neural network connections representing artificial intelligence computing node",
    relatedCategory: "Artificial Intelligence",
    relatedArticleSlug: "how-artificial-intelligence-is-changing-small-businesses",
    keyTechnologies: ["Transformer Models", "Agentic Systems", "RAG Pipelines", "Inference Optimization"]
  },
  {
    id: "cybersecurity-ai-era",
    title: "Cybersecurity in the AI Threat Era",
    categoryBadge: "Cybersecurity",
    badgeColor: "border-red-500/40 text-red-400 bg-red-500/10",
    summary: "Defending enterprises against AI-generated phishing, automated credential-stuffing botnets, and polymorphic ransomware using zero-trust architecture and behavioral heuristics.",
    realWorldApplication: "Continuous SOC monitoring, automated packet inspection, immutable air-gapped snapshots, and passwordless FIDO2 authentication.",
    eastAfricaRelevance: "Protects fintech operators, banks, and schools against a 43% annual spike in regional automated ransomware attempts.",
    impactScore: 9.6,
    maturityLevel: "Enterprise Ready",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Secure digital shield overlay with cybersecurity encryption locks and threat monitoring",
    relatedCategory: "Cybersecurity",
    relatedArticleSlug: "ten-cybersecurity-practices-every-business-should-follow",
    keyTechnologies: ["Zero Trust", "EDR / XDR", "MFA / FIDO2", "Immutable Backups"]
  },
  {
    id: "cloud-edge-computing",
    title: "Cloud and Edge Distributed Computing",
    categoryBadge: "Cloud Computing",
    badgeColor: "border-cyan-500/40 text-cyan-300 bg-cyan-500/10",
    summary: "Decentralizing computation away from distant global hyper-scalers down to local edge micro-servers positioned directly inside warehouses, factories, and telecommunications towers.",
    realWorldApplication: "Sub-millisecond machine vision inspection, localized video surveillance analytics, and resilient offline-first enterprise database caching.",
    eastAfricaRelevance: "Bypasses international bandwidth bottlenecks and ensures critical industrial systems operate continuously during internet disruptions.",
    impactScore: 9.2,
    maturityLevel: "Mainstream Adoption",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Earth glowing network lines visualizing global cloud and edge data transmission",
    relatedCategory: "Cloud Computing",
    relatedArticleSlug: "how-cloud-backup-protects-important-business-data",
    keyTechnologies: ["Micro-Datacenters", "Kubernetes Edge", "Low-Latency APIs", "ARM Architectures"]
  },
  {
    id: "internet-of-things",
    title: "Internet of Things (IoT) & Telemetry",
    categoryBadge: "Emerging Technology",
    badgeColor: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
    summary: "Pervasive low-power sensor arrays connected via cellular and satellite channels that monitor physical assets, equipment temperatures, agricultural soil, and vehicle fleets in real time.",
    realWorldApplication: "Cold-chain pharmaceutical delivery verification, remote solar mini-grid telemetry, smart water flow metering, and commercial vehicle fleet tracking.",
    eastAfricaRelevance: "Empowers commercial farmers and transport syndicates across Uganda to eradicate cargo losses and prevent mechanical breakdowns.",
    impactScore: 9.0,
    maturityLevel: "Mainstream Adoption",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    imageAlt: "High-tech semiconductor microchip visualizing connected IoT sensors and smart systems",
    relatedCategory: "Emerging Technology",
    relatedArticleSlug: "emerging-technology-trends-businesses-should-watch",
    keyTechnologies: ["NB-IoT", "LoRaWAN", "Edge Telemetry", "MQTT Protocols"]
  },
  {
    id: "blockchain-decentralized-systems",
    title: "Blockchain & Decentralized Trust Systems",
    categoryBadge: "Business Technology",
    badgeColor: "border-amber-500/40 text-amber-300 bg-amber-500/10",
    summary: "Cryptographically verified, tamper-proof ledgers that enable transparent multi-party transactions, automated smart contract execution, and decentralized digital asset settlement.",
    realWorldApplication: "Cross-border trade finance reconciliation, agricultural coffee origin verification, automated cargo releases, and digital land registries.",
    eastAfricaRelevance: "Cuts weeks out of cross-border customs paperwork across East African Community (EAC) trade corridors.",
    impactScore: 8.5,
    maturityLevel: "Rapid Growth",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Abstract decentralized digital ledger cubes connected by glowing cryptographic data links",
    relatedCategory: "Business Technology",
    relatedArticleSlug: "benefits-of-custom-software-for-growing-businesses",
    keyTechnologies: ["Smart Contracts", "Layer-2 Scaling", "Zero-Knowledge Proofs", "Consensus Protocols"]
  },
  {
    id: "robotics-automation",
    title: "Robotics & Industrial Process Automation",
    categoryBadge: "Software and Apps",
    badgeColor: "border-purple-500/40 text-purple-300 bg-purple-500/10",
    summary: "Pairing physical robotic arms and automated guided vehicles (AGVs) with software Robotic Process Automation (RPA) to eliminate high-volume repetitive physical and digital chores.",
    realWorldApplication: "Precision agricultural crop sorting, pharmaceutical packaging, automated warehouse parcel distribution, and automated bank statement reconciliations.",
    eastAfricaRelevance: "Boosts manufacturing output and eliminates packaging errors in agro-processing hubs across Uganda.",
    impactScore: 8.7,
    maturityLevel: "Rapid Growth",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Precision robotic arm interacting with automated assembly and sensory inputs",
    relatedCategory: "Software and Apps",
    relatedArticleSlug: "benefits-of-custom-software-for-growing-businesses",
    keyTechnologies: ["Cobots", "Computer Vision", "RPA Pipelines", "Embedded Kinematics"]
  },
  {
    id: "smart-cities-infrastructure",
    title: "Smart Cities & Intelligent Civil Infrastructure",
    categoryBadge: "Emerging Technology",
    badgeColor: "border-sky-500/40 text-sky-300 bg-sky-500/10",
    summary: "Integrating municipal camera networks, traffic sensors, automated license plate readers, and smart electric grids into unified urban command centers.",
    realWorldApplication: "Dynamic traffic light timing, smart parking guidance, automated municipal waste collection alerts, and centralized security monitoring.",
    eastAfricaRelevance: "Eases severe gridlock in fast-growing metropolitan centers like Kampala and Entebbe.",
    impactScore: 8.9,
    maturityLevel: "Rapid Growth",
    image: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Futuristic illuminated city skyline at dusk with high-speed digital light trails",
    relatedCategory: "Emerging Technology",
    relatedArticleSlug: "how-to-choose-the-right-cctv-system",
    keyTechnologies: ["Traffic Computer Vision", "Urban SCADA", "Smart Metering", "Geographic GIS"]
  },
  {
    id: "virtual-augmented-reality",
    title: "Virtual & Augmented Reality (Spatial Computing)",
    categoryBadge: "Software and Apps",
    badgeColor: "border-indigo-500/40 text-indigo-300 bg-indigo-500/10",
    summary: "Immersive spatial computing headsets and mobile AR engines that project digital blueprints, diagnostic schematics, and interactive 3D simulations directly into the user's field of view.",
    realWorldApplication: "Surgical medical training, virtual architectural walkthroughs for real estate buyers, and hands-free industrial equipment maintenance guidance.",
    eastAfricaRelevance: "Allows engineering and surgical students in Uganda to practice complex simulations with zero physical material waste.",
    impactScore: 8.3,
    maturityLevel: "Rapid Growth",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Professional testing immersive augmented reality headset with interactive digital floating interface",
    relatedCategory: "Software and Apps",
    relatedArticleSlug: "emerging-technology-trends-businesses-should-watch",
    keyTechnologies: ["Spatial Audio", "Hand-Tracking LiDAR", "WebXR", "3D CAD Rendering"]
  },
  {
    id: "green-sustainable-technology",
    title: "Green Computing & Sustainable Energy Systems",
    categoryBadge: "Emerging Technology",
    badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    summary: "Engineering low-wattage server architectures, solar-backed micro-grids, and liquid cooling systems that slash data center carbon footprints while guaranteeing uninterrupted uptime.",
    realWorldApplication: "Solar hybrid IT server rooms, energy-scavenging IoT sensor nodes, and intelligent power management software for commercial offices.",
    eastAfricaRelevance: "Ensures technology infrastructure runs uninterrupted 24/7 despite local electrical grid instability.",
    impactScore: 9.3,
    maturityLevel: "Enterprise Ready",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Modern solar panels and wind turbines powering sustainable green technology infrastructure",
    relatedCategory: "Emerging Technology",
    relatedArticleSlug: "emerging-technology-trends-businesses-should-watch",
    keyTechnologies: ["LiFePO4 Solar Arrays", "ARM Server Clusters", "Thermal Dissipation", "Smart Inverters"]
  },
  {
    id: "quantum-computing",
    title: "Quantum Computing & Post-Quantum Cryptography",
    categoryBadge: "Emerging Technology",
    badgeColor: "border-fuchsia-500/40 text-fuchsia-300 bg-fuchsia-500/10",
    summary: "Utilizing quantum superposition and entanglement to solve hyper-complex computational challenges in molecular drug discovery, financial modeling, and global logistics optimization.",
    realWorldApplication: "New pharmaceutical formulation simulations, portfolio risk stress-testing, and post-quantum NIST cryptographic hardening.",
    eastAfricaRelevance: "Critical for banks and telecom providers to safeguard sovereign financial databases against future decryption breakthroughs.",
    impactScore: 8.6,
    maturityLevel: "Early Innovation",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Intricate golden quantum computer chandelier dilution refrigerator in laboratory",
    relatedCategory: "Emerging Technology",
    relatedArticleSlug: "emerging-technology-trends-businesses-should-watch",
    keyTechnologies: ["Qubits", "Quantum Algorithms", "Kyber/Dilithium PQC", "Cryogenic Control"]
  },
  {
    id: "data-science-big-data",
    title: "Data Science & Real-Time Big Data Analytics",
    categoryBadge: "Business Technology",
    badgeColor: "border-blue-500/40 text-blue-300 bg-blue-500/10",
    summary: "Aggregating millions of unstructured transactional, demographic, and sensor data points to generate actionable executive dashboards and predictive market models.",
    realWorldApplication: "Credit risk scoring for unbanked populations, customer churn prediction, real-time fraud detection, and retail foot-traffic heatmaps.",
    eastAfricaRelevance: "Powers digital micro-finance and telecom credit underwriting for millions of Ugandan consumers.",
    impactScore: 9.1,
    maturityLevel: "Mainstream Adoption",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Financial and customer data analytics dashboard displaying multi-colored predictive charts",
    relatedCategory: "Business Technology",
    relatedArticleSlug: "benefits-of-custom-software-for-growing-businesses",
    keyTechnologies: ["Vector Databases", "Apache Kafka", "Automated Feature Engineering", "BI Dashboards"]
  }
];
