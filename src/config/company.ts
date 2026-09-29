/**
 * =====================================================================
 * KJT TECHNOLOGIES - CENTRAL COMPANY CONFIGURATION
 * =====================================================================
 * 
 * CUSTOMIZATION GUIDE:
 * This file is the single source of truth for all corporate details.
 * Any updates made here automatically propagate across the entire website:
 * Navbar, Footer, Hero, Contact Page, About Page, Quotation System,
 * Consultation Booking Calendar, Meta/SEO Tags, and Admin Dashboards.
 * 
 * Instructions for Windows / PowerShell Users:
 * Open this file in your code editor (e.g., VS Code) at `src/config/company.ts`,
 * edit the values below, save the file, and your changes will reflect immediately.
 * =====================================================================
 */

export interface CompanyConfig {
  // CUSTOMIZE HERE: Official Company Identity
  name: string;
  legalName: string;
  motto: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  foundedYear: number;

  // CUSTOMIZE HERE: Domain and URL Settings
  domain: string;
  websiteUrl: string;

  // CUSTOMIZE HERE: Branding Assets & Logos
  logoPath: string;
  logo: {
    path: string;
    alt: string;
    textLogo: string;
    accentWord: string;
  };

  // CUSTOMIZE HERE: Favicon Icon Paths (located in public/)
  faviconPaths: {
    ico: string;
    svg: string;
    png16: string;
    png32: string;
    appleTouchIcon: string;
    manifest: string;
  };

  // CUSTOMIZE HERE: Telephone & Direct Communication Channels
  whatsappNumber: string;
  contact: {
    primaryPhone: string;
    secondaryPhone: string;
    displayPhone: string;
    whatsappNumber: string;
    whatsappLink: string;
    primaryEmail: string;
    supportEmail: string;
    careersEmail: string;
  };

  // CUSTOMIZE HERE: Physical Corporate Office Address
  address: {
    street: string;
    suite: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fullFormatted: string;
  };

  // CUSTOMIZE HERE: Standard Business Hours
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
    timezone: string;
    emergencySupport: string;
  };

  // CUSTOMIZE HERE: Social Media Channels
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    twitter: string;
    tiktok: string;
    whatsapp: string;
    github?: string;
  };

  // CUSTOMIZE HERE: Currency Configuration (Default: Uganda Shilling)
  currency: {
    defaultCode: string;
    defaultSymbol: string;
    defaultName: string;
    alternateCode: string;
    alternateSymbol: string;
    alternateName: string;
  };

  // CUSTOMIZE HERE: Consultation Booking Availability Settings
  consultationHours: {
    timeZone: string;
    timeZoneLabel: string;
    openingTime: string;
    closingTime: string;
    defaultDurationMinutes: number;
    allowedDurations: number[];
    slotIntervalMinutes: number;
    bufferMinutes: number;
    breakStart: string;
    breakEnd: string;
    workingDays: string[];
    maxAdvanceBookingDays: number;
    minimumNoticeHours: number;
  };

  // CUSTOMIZE HERE: Smart Quotation Budget Ranges
  quotationBudgetRanges: {
    UGX: string[];
    USD: string[];
  };

  // CUSTOMIZE HERE: Contact Form & Integration Keys
  contactFormKey: string;

  // CUSTOMIZE HERE: Interactive Map Embed URL & Coordinates
  maps: {
    embedUrl: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    locationLabel: string;
  };

  // CUSTOMIZE HERE: Verified Corporate Statistics / Counter Metrics
  stats: Array<{
    label: string;
    value: string;
    numericValue: number;
    suffix: string;
    description: string;
  }>;
}

export const companyConfig: CompanyConfig = {
  // CUSTOMIZE HERE: Change the company trade name and registered legal entity name.
  name: "KJT TECHNOLOGIES",
  legalName: "KJT Technologies Solutions Ltd.",

  // CUSTOMIZE HERE: Official corporate motto (Default: “Accelerating Innovation, Securing Data.”)
  motto: "Accelerating Innovation, Securing Data.",
  tagline: "Smart Technology Solutions for a Connected and Secure Future",
  shortDescription:
    "KJT TECHNOLOGIES helps businesses, schools and organisations grow through dependable software, secure digital systems, professional IT infrastructure and innovative technology solutions.",
  fullDescription:
    "Founded on the principles of engineering excellence and proactive cyber defense, KJT TECHNOLOGIES delivers high-performance custom software, bulletproof cybersecurity frameworks, high-throughput network infrastructures, CCTV surveillance, and frictionless cloud migrations. We empower global enterprises to innovate with confidence while safeguarding critical digital assets.",
  foundedYear: 2018,

  // CUSTOMIZE HERE: Set the primary website domain and URL (used for canonical SEO and OpenGraph tags).
  domain: "kjttechnologies.com",
  websiteUrl: "https://kjttechnologies.com",

  // CUSTOMIZE HERE: Primary company logo file path (stored in public/images/branding/)
  logoPath: "/images/branding/kjt-technologies-logo.png",

  // CUSTOMIZE HERE: Logo metadata and visual text styling
  logo: {
    path: "/images/branding/kjt-technologies-logo.png",
    alt: "KJT TECHNOLOGIES — Accelerating Innovation, Securing Data",
    textLogo: "KJT",
    accentWord: "TECHNOLOGIES",
  },

  // CUSTOMIZE HERE: Favicon files placed inside public/ directory.
  // Replace these image files when rebranding:
  // - public/favicon.ico (Standard browser icon)
  // - public/favicon.svg (Modern vector browser icon)
  // - public/favicon-16x16.png & favicon-32x32.png (Desktop tabs)
  // - public/apple-touch-icon.png (Apple iOS home screen bookmark, 180x180)
  faviconPaths: {
    ico: "/favicon.ico",
    svg: "/favicon.svg",
    png16: "/favicon-16x16.png",
    png32: "/favicon-32x32.png",
    appleTouchIcon: "/apple-touch-icon.png",
    manifest: "/site.webmanifest",
  },

  // CUSTOMIZE HERE: Enter the KJT TECHNOLOGIES WhatsApp number in international format without +, spaces or brackets.
  // For Uganda numbers, start with 256 (e.g. 256700000000).
  whatsappNumber: "256700000000",

  // CUSTOMIZE HERE: Telephone numbers and department emails.
  contact: {
    primaryPhone: "+256 700 000 000", // Official desk hotline (displayed in header & footer)
    secondaryPhone: "+256 750 000 000", // Secondary engineering line
    displayPhone: "+256 (0) 700 000 000", // Nicely formatted for visual display

    // WhatsApp configuration
    whatsappNumber: "256700000000",
    whatsappLink: "https://wa.me/256700000000?text=Hello%20KJT%20TECHNOLOGIES%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.",

    // Official company email addresses
    primaryEmail: "contact@kjttechnologies.com",
    supportEmail: "support@kjttechnologies.com",
    careersEmail: "careers@kjttechnologies.com",
  },

  // CUSTOMIZE HERE: Physical office location in Kampala, Uganda
  address: {
    street: "Plot 18 Lumumba Avenue",
    suite: "Level 4, Innovation Towers",
    city: "Kampala",
    state: "Central Region / Kampala District",
    postalCode: "P.O. Box 24810",
    country: "Uganda",
    fullFormatted: "Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda",
  },

  // CUSTOMIZE HERE: Official business hours
  businessHours: {
    weekdays: "Monday - Friday: 8:00 AM - 6:00 PM EAT",
    saturday: "Saturday: 9:00 AM - 2:00 PM EAT",
    sunday: "Sunday: Closed (Emergency SOC Support Active)",
    timezone: "Africa/Kampala (EAT / UTC+3)",
    emergencySupport: "24/7/365 Incident Response & SOC Monitoring",
  },

  // CUSTOMIZE HERE: Social media channel links.
  // Set any unused social media link to an empty string ("") to automatically hide its icon.
  socialLinks: {
    facebook: "https://facebook.com/kjttechnologies",
    instagram: "https://instagram.com/kjttechnologies",
    linkedin: "https://linkedin.com/company/kjt-technologies",
    youtube: "https://youtube.com/@kjttechnologies",
    twitter: "https://x.com/kjt_technologies",
    tiktok: "https://tiktok.com/@kjttechnologies",
    whatsapp: "https://wa.me/256700000000",
    github: "https://github.com/kjt-technologies",
  },

  // CUSTOMIZE HERE: Currency settings (Uganda Shilling as primary currency)
  currency: {
    defaultCode: "UGX",
    defaultSymbol: "USh",
    defaultName: "Uganda Shilling",
    alternateCode: "USD",
    alternateSymbol: "$",
    alternateName: "United States Dollar",
  },

  // CUSTOMIZE HERE: Consultation booking schedule rules
  // Timezone must follow IANA standard (e.g. 'Africa/Kampala')
  consultationHours: {
    timeZone: "Africa/Kampala",
    timeZoneLabel: "East Africa Time (EAT, UTC+3)",
    openingTime: "08:30",
    closingTime: "17:30",
    defaultDurationMinutes: 45,
    allowedDurations: [30, 45, 60],
    slotIntervalMinutes: 30,
    bufferMinutes: 15,
    breakStart: "13:00",
    breakEnd: "14:00",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    maxAdvanceBookingDays: 60,
    minimumNoticeHours: 12,
  },

  // CUSTOMIZE HERE: Budget ranges displayed in the smart quotation request form (/request-quote)
  quotationBudgetRanges: {
    UGX: [
      "Under USh 2,000,000 (Small Project / Consultation)",
      "USh 2,000,000 – USh 5,000,000 (Standard Business System)",
      "USh 5,000,000 – USh 15,000,000 (Custom Application / Multi-Cam CCTV)",
      "USh 15,000,000 – USh 35,000,000 (Enterprise Infrastructure / School System)",
      "USh 35,000,000+ (Turnkey Enterprise Platform & Defense Audit)",
      "Not sure / Need consultation",
    ],
    USD: [
      "Under $1,000 (Starter Project)",
      "$1,000 – $3,000 (Core System / Web App)",
      "$3,000 – $8,000 (Enterprise Software / Multi-Site Network)",
      "$8,000 – $20,000 (Turnkey Platform & High-End Security)",
      "$20,000+ (Large Institutional Architecture)",
      "Not sure / Request guidance",
    ],
  },

  // CUSTOMIZE HERE: Web3Forms access key for public forms.
  // You can also define VITE_WEB3FORMS_ACCESS_KEY in your .env.local file.
  contactFormKey: "YOUR_WEB3FORMS_ACCESS_KEY_HERE",

  // CUSTOMIZE HERE: Google Maps embed iframe URL and GPS coordinates
  maps: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7570417088463!2d32.57655037496464!3d0.3175883996792949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb7c02b3c37d%3A0x6b772c9183bebf0f!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1700000000000!5m2!1sen!2sug",
    coordinates: {
      lat: 0.3176,
      lng: 32.5825,
    },
    locationLabel: "KJT TECHNOLOGIES Operations Office - Kampala, Uganda",
  },

  // CUSTOMIZE HERE: Company statistics displayed across the homepage and about page
  stats: [
    {
      label: "Projects Completed",
      value: "250+",
      numericValue: 250,
      suffix: "+",
      description: "Enterprise software, cloud migrations & security installations delivered on time.",
    },
    {
      label: "Client Retention Rate",
      value: "99.4%",
      numericValue: 99.4,
      suffix: "%",
      description: "Long-term partnerships built on measurable uptime and cyber defense.",
    },
    {
      label: "Systems & Endpoints Secured",
      value: "50,000+",
      numericValue: 50000,
      suffix: "+",
      description: "Continuous 24/7 threat monitoring across distributed corporate environments.",
    },
    {
      label: "Average Response Time",
      value: "< 15 Mins",
      numericValue: 15,
      suffix: " min",
      description: "Dedicated rapid-action technical support and incident management SLA.",
    },
  ],
};
