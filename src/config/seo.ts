/**
 * =====================================================================
 * KJT TECHNOLOGIES - CENTRAL TECHNICAL SEO CONFIGURATION
 * =====================================================================
 * 
 * CUSTOMIZATION GUIDE FOR DEPLOYMENT:
 * 1. DOMAIN: Update `siteUrl` once you connect your custom production domain
 *    (e.g., 'https://kjttechnologies.com' or 'https://www.kjttechnologies.com').
 * 2. LOCATION: Uganda is set as the default country. Clearly indicated below
 *    are the placeholders to input your exact registered City, District/Region,
 *    Street Address, and GPS coordinates for Google Maps & Local SEO.
 * 3. CONTACT: Update official telephone numbers, email addresses, and social handles.
 * 4. STRUCTURED DATA: JSON-LD schemas automatically read from this configuration
 *    to generate Organization, LocalBusiness, ProfessionalService, WebSite,
 *    and ContactPoint metadata.
 * =====================================================================
 */

export interface SEOConfig {
  // --- DOMAIN & BASE URL ---
  /**
   * Official canonical domain. DO NOT include a trailing slash.
   * Update this when deploying to production (e.g. Vercel, Netlify, VPS).
   */
  siteUrl: string;

  // --- CORPORATE BRANDING ---
  companyName: string;
  legalName: string;
  motto: string;
  tagline: string;

  // --- DEFAULT METADATA (FALLBACK) ---
  defaultTitle: string;
  titleTemplate: string; // e.g. "%s | KJT TECHNOLOGIES"
  defaultDescription: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  defaultTwitterImage: string;
  themeColor: string;
  locale: string;

  // --- OFFICIAL COMMUNICATION CHANNELS ---
  telephone: string;
  telephoneDisplay: string;
  secondaryTelephone?: string;
  whatsappNumber: string;
  email: string;
  supportEmail: string;

  // --- PHYSICAL LOCATION & LOCAL BUSINESS DISCOVERABILITY ---
  // Default country is Uganda. Update the placeholders below with your exact physical address.
  location: {
    country: string; // Default: 'Uganda'
    countryCode: string; // 'UG'
    city: string; // e.g., 'Kampala' (or Wakiso, Entebbe, Jinja, Mbarara, etc.)
    district: string; // e.g., 'Kampala District' or 'Central Region'
    streetAddress: string; // e.g., 'Plot 14 Lumumba Avenue / Kampala Road'
    buildingSuite: string; // e.g., 'Floor 3, Innovation House'
    postalCode: string; // e.g., 'P.O. Box 10245' or '00000'
    latitude: number; // e.g., 0.3476 (Kampala central latitude)
    longitude: number; // e.g., 32.5825 (Kampala central longitude)
    serviceAreas: string[]; // Areas served (e.g. ['Kampala', 'Wakiso', 'Entebbe', 'Mukono', 'Uganda', 'East Africa'])
    mapsUrl: string;
  };

  // --- BUSINESS HOURS ---
  businessHours: {
    days: string[];
    opens: string;
    closes: string;
    description: string;
  };

  // --- SOCIAL PROFILES (SAME AS FOR SCHEMA.ORG) ---
  socialProfiles: {
    linkedin: string;
    twitter: string;
    github: string;
    facebook: string;
    instagram: string;
    youtube?: string;
  };

  // --- SEARCH VERIFICATION TOKENS ---
  verification: {
    googleSiteVerification?: string; // Replace with Google Search Console verification token
    bingVerification?: string;
  };
}

export const seoConfig: SEOConfig = {
  // ===================================================================
  // 1. OFFICIAL DOMAIN (EDIT BEFORE PRODUCTION DEPLOYMENT)
  // ===================================================================
  // SEO: Replace this placeholder with the production domain.
  siteUrl: "https://kjttechnologies.com",

  // ===================================================================
  // 2. COMPANY IDENTITY & MOTTO
  // ===================================================================
  companyName: "KJT TECHNOLOGIES",
  legalName: "KJT Technologies Solutions Ltd.",
  motto: "Accelerating Innovation, Securing Data.",
  tagline: "Software Development, Cybersecurity, Network Infrastructure and Cloud Systems",

  // ===================================================================
  // 3. DEFAULT META TAGS & SOCIAL SHARING
  // ===================================================================
  defaultTitle: "KJT TECHNOLOGIES | Software, Cybersecurity and IT Solutions",
  titleTemplate: "%s | KJT TECHNOLOGIES",
  defaultDescription:
    "KJT TECHNOLOGIES provides enterprise custom software development, cybersecurity audits, CCTV camera installation, high-speed computer networking, school management systems, and managed IT support.",
  defaultKeywords: [
    "KJT TECHNOLOGIES",
    "software development company",
    "cybersecurity services",
    "IT support company",
    "CCTV camera installation",
    "computer networking",
    "school management system",
    "business management software",
    "web application development",
    "mobile app development",
    "data protection backup",
    "IT company Uganda",
    "software developers Kampala",
    "CCTV installation Kampala"
  ],
  defaultOgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=630&q=80",
  defaultTwitterImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&h=600&q=80",
  themeColor: "#0A192F",
  locale: "en_UG",

  // ===================================================================
  // 4. BUSINESS CONTACT TELEPHONE & EMAILS
  // ===================================================================
  // CUSTOMIZE HERE: Change the company telephone number.
  telephone: "+256700000000", // <-- EDIT: Add primary business telephone here (e.g. +256 700 000000)
  telephoneDisplay: "+256 (0) 700 000 000", // <-- EDIT: Friendly formatted display string
  secondaryTelephone: "+256750000000", // <-- EDIT: Optional secondary phone line
  whatsappNumber: "+256700000000", // <-- EDIT: WhatsApp direct line (international format without + or spaces for wa.me)
  email: "contact@kjttechnologies.com", // <-- EDIT: Main inquiries email
  supportEmail: "support@kjttechnologies.com", // <-- EDIT: Support/Incident email

  // ===================================================================
  // 5. PHYSICAL LOCATION & LOCAL SEO DISCOVERABILITY
  // ===================================================================
  // IMPORTANT: Set to Uganda by default.
  // Replace the placeholders below with the exact office coordinates and street address:
  location: {
    country: "Uganda", // Default country
    countryCode: "UG",
    city: "Kampala", // <-- EDIT: Change to your exact City (e.g. Kampala, Wakiso, Entebbe)
    district: "Kampala District", // <-- EDIT: Change to your exact District / Region (e.g. Central Region, Wakiso District)
    streetAddress: "Plot 18 Lumumba Avenue, Central Business District", // <-- EDIT: Street & Plot Number
    buildingSuite: "Level 4, Innovation Towers", // <-- EDIT: Building name, floor, or suite number
    postalCode: "P.O. Box 24810 Kampala", // <-- EDIT: Postal code or P.O. Box address
    latitude: 0.3176, // <-- EDIT: Exact GPS Latitude for Google Maps (0.3176 = Central Kampala)
    longitude: 32.5825, // <-- EDIT: Exact GPS Longitude for Google Maps (32.5825 = Central Kampala)
    // Key target regions and client markets for local discoverability:
    serviceAreas: [
      "Kampala",
      "Wakiso",
      "Entebbe",
      "Mukono",
      "Jinja",
      "Mbarara",
      "Uganda",
      "East Africa"
    ],
    mapsUrl: "https://maps.google.com/?q=0.3176,32.5825",
  },

  // ===================================================================
  // 6. BUSINESS OPERATING HOURS
  // ===================================================================
  businessHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "18:00",
    description: "Monday - Friday: 8:00 AM - 6:00 PM EAT; Saturday: 9:00 AM - 2:00 PM EAT (Emergency SOC Support 24/7/365)",
  },

  // ===================================================================
  // 7. SOCIAL MEDIA PROFILES (ORGANIZATION sameAs IN SCHEMA.ORG)
  // ===================================================================
  socialProfiles: {
    linkedin: "https://linkedin.com/company/kjt-technologies",
    twitter: "https://twitter.com/kjt_technologies",
    github: "https://github.com/kjt-technologies",
    facebook: "https://facebook.com/kjttechnologies",
    instagram: "https://instagram.com/kjttechnologies",
    youtube: "https://youtube.com/@kjttechnologies",
  },

  // ===================================================================
  // 8. SEARCH ENGINE VERIFICATION TOKENS
  // ===================================================================
  verification: {
    // Paste your Google Search Console verification meta tag token here when ready:
    googleSiteVerification: "GSC_VERIFICATION_TOKEN_PLACEHOLDER",
    bingVerification: "BING_VERIFICATION_TOKEN_PLACEHOLDER",
  },
};
