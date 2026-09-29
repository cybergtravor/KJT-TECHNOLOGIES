/**
 * =====================================================================
 * TESTIMONIALS DATA - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * --- WHERE TO CHANGE TESTIMONIALS ---
 * To add, edit, or remove customer reviews, modify the `testimonialsData`
 * array below.
 * Update client names, roles, company logos/avatars, ratings, and quotes.
 * =====================================================================
 */

import { TestimonialItem } from '../types';

export const testimonialsData: TestimonialItem[] = [
  // CUSTOMIZE HERE: Replace these sample reviews with real client testimonials
  {
    id: "test-1",
    name: "Marcus Vance",
    role: "Chief Technology Officer",
    company: "Apex Financial Holdings [Sample Client]",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    content: "KJT TECHNOLOGIES engineered our payment gateway microservices from scratch. Their obsession with zero latency and airtight encryption allowed us to scale from $2M to over $12M monthly volume with 99.998% uptime. They are truly top-tier engineers.",
    rating: 5,
    serviceCategory: "Software Development",
    verified: true
  },
  {
    id: "test-2",
    name: "Dr. Evelyn Ross",
    role: "Director of Digital Infrastructure",
    company: "HealthPulse Diagnostics [Sample Client]",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    content: "When our healthcare group faced a mandatory SOC 2 audit, KJT TECHNOLOGIES conducted thorough penetration testing and locked down our clinical endpoints. They helped us achieve a 100% compliance pass and eliminated every severe vulnerability in weeks.",
    rating: 5,
    serviceCategory: "Cybersecurity",
    verified: true
  },
  {
    id: "test-3",
    name: "Arthur Pendelton",
    role: "Head of Operations",
    company: "St. Jude International Academy [Sample Client]",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    content: "Our campus had chronic Wi-Fi dead spots that disrupted student exams. KJT ran optical fiber across all four academic buildings and deployed 120+ access points. We now effortlessly host 3,500 simultaneous devices with zero packet drops. Exceptional professionalism.",
    rating: 5,
    serviceCategory: "Networking Infrastructure",
    verified: true
  },
  {
    id: "test-4",
    name: "Selena Gomez-Reyes",
    role: "Logistics Facilities Director",
    company: "MetroLine Logistics Hub [Sample Client]",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    content: "The 4K AI camera network and biometric turnstiles installed by KJT TECHNOLOGIES slashed our warehouse inventory discrepancies by 87%. The crystal clear video retention and mobile access give our management team total peace of mind.",
    rating: 5,
    serviceCategory: "CCTV & Security",
    verified: true
  },
  {
    id: "test-5",
    name: "David Chen",
    role: "VP of Engineering",
    company: "OmniTrack Supply Systems [Sample Client]",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    content: "KJT spearheaded our migration from costly legacy servers to Amazon EKS and Terraform. Not only did our annual cloud spend drop by 42%, but our deployment frequency increased tenfold. They understand enterprise cloud architecture inside and out.",
    rating: 5,
    serviceCategory: "Cloud Computing",
    verified: true
  }
];
