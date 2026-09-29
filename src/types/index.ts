/**
 * =====================================================================
 * GLOBAL TYPES - KJT TECHNOLOGIES WEB PLATFORM
 * =====================================================================
 */

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  iconName: string; // Lucide icon name
  badge: string;
  shortDescription: string;
  detailedDescription: string;
  keyBenefits: ServiceBenefit[];
  keyFeatures?: string[];
  whatIsIncluded: string[];
  workingProcess: ServiceProcessStep[];
  suitableCustomers: string[];
  relatedServices: string[]; // slugs of related services
  image: string;
  imageAlt?: string;
  techStack?: string[];
  pricingRange?: string;
  deliveryTimeframe?: string;
}

export type ProjectCategory =
  | 'Websites'
  | 'Mobile applications'
  | 'Desktop applications'
  | 'School systems'
  | 'Business systems'
  | 'Cybersecurity'
  | 'Networking'
  | 'CCTV installations';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  fullDescription: string;
  image: string;
  technologiesUsed: string[];
  challenge: string;
  solution: string;
  results: string[];
  projectLink?: string;
  clientName?: string;
  client?: string;
  featured?: boolean;
  industry?: string;
  year?: number;
  isSampleProject?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  serviceCategory: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Technical' | 'Pricing' | 'Support' | 'Security' | 'Project' | 'Services' | 'Security & Compliance' | 'Support & Pricing' | string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string;
  metaDescription?: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  coverImage: string;
  imageAlt?: string;
  imageCaption?: string;
  tags: string[];
  relatedPostSlugs?: string[];
  status?: 'draft' | 'published' | 'scheduled';
  scheduledFor?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isEditorPick?: boolean;
  isNews?: boolean;
  isSample?: boolean;
  originalSource?: string;
  sourceUrl?: string;
  eventDate?: string;
  tableOfContents?: { id: string; title: string; level: number }[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  caption?: string;
  sizeBytes?: number;
  mimeType?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  specialties: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface NavLinkItem {
  name: string;
  path: string;
  badge?: string;
  children?: { name: string; path: string; description: string }[];
}

/**
 * =====================================================================
 * SMART QUOTATION REQUEST TYPES
 * =====================================================================
 */
export type QuotationStatus =
  | 'New'
  | 'Reviewing'
  | 'Contacted'
  | 'Quotation Prepared'
  | 'Accepted'
  | 'Declined'
  | 'Completed';

export type BudgetRangeUGX =
  | 'Below UGX 500,000'
  | 'UGX 500,000–1,000,000'
  | 'UGX 1,000,000–3,000,000'
  | 'UGX 3,000,000–5,000,000'
  | 'Above UGX 5,000,000'
  | 'Not sure — I need guidance';

export type TimelineOption =
  | 'As soon as possible'
  | 'Within 1–2 weeks'
  | 'Within 3–4 weeks'
  | 'Within 1–2 months'
  | 'More than 2 months'
  | 'Flexible';

export interface QuotationUploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  path?: string;
}

export interface QuotationRequest {
  id: string;
  referenceNumber: string; // e.g. KJT-Q-0001
  createdAt: string;
  updatedAt?: string;
  status: QuotationStatus;

  // Step 1: Client information
  fullName: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';

  // Step 2: Required services
  services: string[];
  otherServiceDescription?: string;

  // Step 3: Project details
  projectTitle: string;
  description: string;
  mainGoals: string;
  targetUsers: string;
  requiredFeatures: string;
  existingUrl?: string;
  preferredTechnology?: string;
  projectType: 'new' | 'improvement';
  files: QuotationUploadedFile[];

  // Step 4: Budget and timeline
  currency: 'UGX';
  budgetRange: BudgetRangeUGX;
  timeline: TimelineOption;
  preferredStartDate?: string;
  deadline?: string;
  isDeadlineFlexible: boolean;
  additionalComments?: string;

  // Step 5: Consents & Admin
  privacyConsent: boolean;
  accuracyConfirmed: boolean;
  adminNotes?: string;
}

/**
 * =====================================================================
 * CONSULTATION BOOKING SYSTEM TYPES
 * =====================================================================
 */
export type ConsultationStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Rescheduled'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export type MeetingMethod =
  | 'Telephone call'
  | 'WhatsApp call'
  | 'Google Meet'
  | 'Zoom'
  | 'Physical meeting';

export interface ConsultationBooking {
  id: string;
  bookingReference: string; // e.g. KJT-C-0001
  createdAt: string;
  updatedAt?: string;
  status: ConsultationStatus;

  // Client Details
  fullName: string;
  organization?: string;
  email: string;
  phone: string;
  whatsapp: string;

  // Consultation Details
  service: string;
  topic: string;
  description: string;

  // Date & Time
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:00"
  endTime: string; // e.g. "10:45"
  timeZone: string; // "Africa/Kampala"
  meetingMethod: MeetingMethod;

  // Notes & History
  additionalNotes?: string;
  privacyConsent: boolean;
  adminNotes?: string;
  rescheduledFrom?: {
    date: string;
    startTime: string;
    endTime: string;
    rescheduledAt: string;
  };
}

export interface ConsultationAvailabilityConfig {
  id: string;
  availableWeekdays: number[]; // 1 = Monday, 5 = Friday
  openingTime: string; // "08:30"
  closingTime: string; // "17:30"
  consultationDurationMinutes: number; // e.g. 45
  breakPeriods: { start: string; end: string }[]; // e.g. [{ start: "13:00", end: "14:00" }]
  maxBookingsPerDay: number; // e.g. 6
  minimumBookingNoticeHours: number; // e.g. 12
  maxAdvanceBookingDays: number; // e.g. 60
  timeZone: string; // "Africa/Kampala"
}

export interface BlockedDateItem {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  createdAt: string;
}
