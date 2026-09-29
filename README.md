# KJT TECHNOLOGIES Corporate Website

> **Motto:** *“Accelerating Innovation, Securing Data.”*

A modern, high-performance, responsive enterprise website for **KJT TECHNOLOGIES**, engineered with React 19, TypeScript, Vite, Tailwind CSS v4, and React Router v7 following the **Geometric Balance** design theme.

---

## 🚀 Key Features

### 1. 22 Core Technology Services
Fully modular data architecture (`src/data/servicesData.ts`) with searchable directory, category filters, and individual dynamic detail routes (`/services/:slug`) for all 22 required offerings:
1. **Website Design and Development**
2. **Web Application Development**
3. **Mobile App Development**
4. **Desktop Software Development**
5. **School Management Systems**
6. **Business Management Systems (ERP/CRM)**
7. **Cybersecurity Services & Pen Testing**
8. **Data Protection and Backup Solutions**
9. **CCTV and Security Camera Installation**
10. **Computer Networking & Structured Cabling**
11. **Server Installation and Management**
12. **Cloud Solutions (AWS, GCP, Azure)**
13. **IT Support and Maintenance (SLA Helpdesk)**
14. **Computer Repair and Hardware Upgrades**
15. **Domain Registration and Web Hosting**
16. **Search Engine Optimization (Technical SEO)**
17. **UI/UX Design & Prototyping**
18. **Database Design and Management**
19. **Email and Business Communication Setup**
20. **Digital Transformation Consulting**
21. **Software Testing and Quality Assurance (QA)**
22. **Point of Sale (POS) Systems**

### 2. Comprehensive About Us Page
Includes 9 distinct sections:
- Executive Introduction & Corporate Identity
- Company Story & Evolution
- Core Mission & Vision
- Guiding Core Values (Integrity, Excellence, Security, Innovation, Partnership)
- Industries Served (Education, Healthcare, Retail, Financial, Logistics, Enterprise)
- Technical Expertise & Verified Tech Stacks
- Why Trust Us & Security Governance
- Certified Solutions Engineering Bench
- Strategic Call-to-Action

### 3. Portfolio & Case Studies
- Filterable case study catalog across 8 categories:
  - Web & Custom Portals
  - Mobile Applications
  - Enterprise Software
  - Cybersecurity Deployments
  - Network Infrastructure
  - CCTV & Surveillance
  - Cloud Migrations
  - School Management Systems
- Detailed challenge, technical solution, architecture stack, and quantified business impact metrics for each case study.

### 4. Interactive Contact System
- Direct click-to-call phone links (`tel:`)
- Direct click-to-email links (`mailto:`)
- Clickable WhatsApp integration with prefilled quote and consultation messages
- Interactive Google Maps embed for headquarters
- Full corporate contact form featuring:
  - Full Name, Corporate Email, Phone Number, Service Required dropdown (all 22 services + custom options), Subject, and Message
  - Anti-spam honeypot verification
  - Native Web3Forms API integration (`VITE_WEB3FORMS_ACCESS_KEY`)

### 5. FAQ & Knowledge Base
- Search bar with live keyword filtering
- Accordion-style expandable questions
- Organized across 6 categories: *General, Technical, Pricing, Support, Security, Project*
- Empty state fallbacks with direct technical consultation routing

### 6. Blog & Technical News
- Searchable articles across *Helpful Technology Articles, Cybersecurity Awareness, Company Updates, and Physical Security & Infrastructure*
- Dedicated article reading pages (`/blog/:slug`) with social share buttons (Twitter/X, LinkedIn, Facebook, WhatsApp, Copy Link)
- Related article suggestions and newsletter subscription strips

### 7. Global Utility & Compliance Components
- **Floating WhatsApp Quick-Chat button** on every page with active availability indicator
- **Back-to-top button** with smooth scroll
- **Cookie Consent Banner** with local persistence
- **Newsletter Subscription forms**
- **404 Resource Not Found page**

---

## 🎨 Design Theme: Geometric Balance

- **Primary Background:** Deep Navy (`#0A192F`, `#081528`)
- **Accent Color:** Electric Cyan (`#00D4FF`) with cyan glows
- **Supporting Palette:** Clean Slate (`slate-200`, `slate-400`, `slate-700/50`)
- **Visual Texture:** Subtle geometric dot matrix (`radial-gradient`), crisp mathematical borders, and high-contrast typography pairing **Space Grotesk** (display) and **Plus Jakarta Sans** (body).

---

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Iconography:** [Lucide React](https://lucide.dev/)

---

## 📦 Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional Web3Forms access key for live form submissions:
```env
VITE_WEB3FORMS_ACCESS_KEY="your-access-key-from-web3forms.com"
```
*(If no key is configured, the form operates in a safe demonstration mode with responsive feedback).*

### 3. Start Development Server
```bash
npm run dev
```
The server will bind to `http://0.0.0.0:3000`.

### 4. Build for Production
```bash
npm run build
```
Generates production-ready static assets in `/dist`.

---

## 📁 Project Structure

```
kjt-technologies/
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI controls (Button, ContactForm, CookieConsent, NewsletterForm, ServiceIcon, etc.)
│   │   ├── home/           # Homepage modular sections (Hero, ServicesGrid, WhyChooseUs, CTA, etc.)
│   │   └── layout/         # Header/Navbar, Footer, Shell Layout with Floating WhatsApp & Back-to-Top
│   ├── config/
│   │   └── company.ts      # Centralized branding, phone numbers, WhatsApp, emails, address, and social links
│   ├── data/
│   │   ├── servicesData.ts # Detailed specification for all 22 corporate services
│   │   ├── projectsData.ts # Case studies across 8 industry sectors
│   │   ├── faqData.ts      # Structured FAQ items categorized across 6 domains
│   │   └── blogData.ts     # Tech articles, cyber advisories, and company updates
│   ├── pages/              # 11 route pages (Home, About, Services, ServiceDetail, Projects, Blog, FAQ, Contact, Privacy, Terms, 404)
│   ├── types.ts            # Global TypeScript interfaces
│   ├── App.tsx             # Application router
│   ├── main.tsx            # DOM entry point
│   └── index.css           # Tailwind CSS imports and utility overrides
├── index.html              # HTML shell with meta tags synchronized to metadata.json
├── metadata.json           # AI Studio app metadata
├── package.json            # Scripts & dependencies
└── .env.example            # Environment configuration template
```

---

## ⚙️ Customizing Content & Branding

All core company information is centralized in a single configuration file:
- **Company Name, Phone, Email, Address, WhatsApp:** Edit `src/config/company.ts`
- **Services Catalog (22 Services):** Edit or append items in `src/data/servicesData.ts`
- **Portfolio & Case Studies:** Edit or add projects in `src/data/projectsData.ts`
- **FAQ Questions & Answers:** Edit or add FAQs in `src/data/faqData.ts`
- **Blog Articles:** Edit or publish posts in `src/data/blogData.ts`
