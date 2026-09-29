/**
 * =====================================================================
 * TEAM & LEADERSHIP DATA - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * --- WHERE TO UPDATE TEAM MEMBERS ---
 * Add or modify team members in this file.
 * Replace avatar images with assets in /public/images/team/
 * =====================================================================
 */

import { TeamMember } from '../types';

// CUSTOMIZE HERE: Add, edit, or remove leadership and engineering team members
export const teamData: TeamMember[] = [
  {
    id: "lead-1",
    name: "Kojo J. Thompson",
    role: "Founder & Chief Executive Officer",
    bio: "Visionary technologist with over 16 years leading mission-critical IT infrastructure, enterprise software deployments, and cybersecurity transformations across multi-national corporations.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    specialties: ["Executive Leadership", "Enterprise Strategy", "Cyber Defense", "Digital Transformation"],
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  },
  {
    id: "lead-2",
    name: "Elena Rostova",
    role: "Chief Technology Officer & Head of Engineering",
    bio: "Former cloud systems architect specializing in high-throughput distributed systems, Zero Trust microservices, and automated Kubernetes orchestration.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    specialties: ["Cloud Architecture", "Distributed Systems", "TypeScript / Go", "DevSecOps"],
    social: {
      linkedin: "https://linkedin.com",
      github: "https://github.com"
    }
  },
  {
    id: "lead-3",
    name: "Marcus Adebayo",
    role: "Director of Cybersecurity & Threat Intelligence",
    bio: "Certified Information Systems Security Professional (CISSP) with background in penetration testing, offensive red-teaming, and incident response governance.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    specialties: ["Ethical Hacking", "SIEM & SOC Operations", "Compliance (SOC2/ISO27001)", "Zero Trust"],
    social: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com"
    }
  },
  {
    id: "lead-4",
    name: "Aiden Vance",
    role: "Principal Infrastructure & Optical Network Engineer",
    bio: "Expert in physical structured cabling, 10G/40G fiber backbones, enterprise Wi-Fi 6/7 mapping, and commercial 4K AI CCTV surveillance networks.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    specialties: ["Structured Cabling", "Enterprise Wi-Fi", "Commercial CCTV", "SD-WAN Routing"],
    social: {
      linkedin: "https://linkedin.com"
    }
  }
];
