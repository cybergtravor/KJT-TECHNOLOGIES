# KJT TECHNOLOGIES - Backend Setup & Architecture Guide

> **Company:** KJT TECHNOLOGIES  
> **Motto:** *“Accelerating Innovation, Securing Data.”*  
> **Target Audience:** Windows users working with PowerShell, GitHub, Supabase, and Vercel.

---

## 📑 Table of Contents

1. [Architectural Overview & Recommendation](#1-architectural-overview--recommendation)
2. [Backend Platforms Comparison Matrix](#2-backend-platforms-comparison-matrix)
3. [Recommended Architecture Deep-Dive](#3-recommended-architecture-deep-dive)
4. [Step-by-Step Supabase Setup (Windows & PowerShell)](#4-step-by-step-supabase-setup-windows--powershell)
5. [Storage Architecture (Public vs Private Buckets)](#5-storage-architecture-public-vs-private-buckets)
6. [Email Notification Options & Security](#6-email-notification-options--security)
7. [Article Lifecycle & Image Management](#7-article-lifecycle--image-management)
8. [Vercel Deployment & Environment Secrets](#8-vercel-deployment--environment-secrets)
9. [Security Directives & Cheat Sheet](#9-security-directives--cheat-sheet)

---

## 1. Architectural Overview & Recommendation

KJT TECHNOLOGIES requires a robust, scalable, and secure backend foundation capable of handling:
- **Corporate CMS Articles & News** with rich media attachments
- **5-Step Smart Quotation Requests** with confidential client project briefs
- **Kampala-Time Consultation Bookings** with strict double-booking prevention
- **Role-Based Administrator Access** with secure credential validation
- **Real-Time Transactional Email Alerts** without exposing private API keys

### Recommended Production Architecture:

| Layer | Recommended Technology | Role & Purpose |
| :--- | :--- | :--- |
| **Frontend Hosting** | **Vercel** | Global edge network, automatic HTTPS, SPA rewrites, and instant Git deployments. |
| **Database** | **Supabase PostgreSQL** | Relational data integrity, foreign keys, unique booking indexes, and Row Level Security (RLS). |
| **Authentication** | **Supabase Auth** | Built-in JWT management, password hashing, and session persistence for administrators. |
| **Media & File Storage** | **Supabase Storage** | Public bucket for article images; private bucket with signed URLs for client quotation files. |
| **Privileged Operations** | **Supabase Edge Functions / Vercel Serverless** | Isolated server-side execution for admin user invites and email dispatches. |
| **Email Relay** | **Web3Forms / Resend** | Client-safe contact forms via Web3Forms; transactional notifications via Resend. |

> **Note on Pricing & Quotas:** Free plans, usage limits, and commercial pricing structures change over time. Always verify the latest terms on each provider's official website before deploying high-volume production workloads.

---

## 2. Backend Platforms Comparison Matrix

| Evaluation Criteria | **Supabase (Recommended)** | **Firebase (Google)** | **Appwrite** | **Custom Node.js + Express** | **Headless CMS (Strapi / Sanity)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Database Engine** | PostgreSQL (Relational + JSONB) | NoSQL Firestore | MariaDB / PostgreSQL | PostgreSQL / MySQL / MongoDB | Custom / Proprietary Cloud |
| **Row-Level Security** | Native SQL RLS policies | Firestore Security Rules | Permissions / Roles API | Hand-crafted middleware in Node | Role-based permissions in CMS UI |
| **Authentication** | Built-in JWT + Social Logins | Firebase Auth | Built-in Auth service | Custom JWT / Passport.js / bcrypt | Built-in admin & API tokens |
| **File Storage** | S3-compatible Object Storage | Google Cloud Storage | Built-in Storage with encryption | AWS S3 / Cloudflare R2 SDK | Cloudinary / S3 / Vendor CDN |
| **Double-Booking Guard** | Unique partial SQL index | Firestore Transactions | Database unique constraints | Custom database transaction code | Difficult to enforce atomically |
| **Administrator Support** | Complete via Auth + SQL profiles | Custom Claims + Firestore | Teams & Roles API | Custom database roles table | Native admin panel out of the box |
| **Setup Difficulty** | **Low (Under 10 minutes)** | Moderate (Requires GCP setup) | Moderate (Self-hosted or Cloud) | **High (Requires DevOps & hosting)** | Moderate (Separate server or SaaS) |
| **Free-Tier Generosity** | Generous (500MB DB, 1GB storage) | Generous (1GB Firestore, 5GB storage) | Generous on Cloud free plan | None (Requires VPS e.g. DigitalOcean) | Limited on free cloud plans |
| **Portability** | **100% standard PostgreSQL** | Low (Proprietary Google NoSQL) | Moderate (Open-source self-hostable) | **100% portable code** | Moderate (Locked to CMS schema) |
| **Vendor Lock-in** | Extremely low (Standard SQL dumps) | High (Proprietary Firestore queries) | Low (Docker self-hostable) | Zero (Runs on any Linux server) | Moderate to High |
| **Suitability for KJT** | **Highest (Optimal fit for KJT)** | Medium (NoSQL makes relational joins hard) | Good (Solid alternative) | Medium (High ongoing maintenance) | Medium (Adds extra infrastructure) |

### Why Supabase is the Recommended Choice:
1. **Relational Rigor:** Booking systems need ACID transactions and unique indexes so that two people cannot book the same slot at the exact same minute (`idx_unique_booking_slot`).
2. **Built-in Security (RLS):** Data access rules are verified directly by PostgreSQL at the database level, preventing unauthorized access even if client code is manipulated.
3. **Low Maintenance:** Zero server provisioning, zero Linux patching, automated backups, and an intuitive web SQL Editor.

---

## 3. Recommended Architecture Deep-Dive

```text
+-------------------------------------------------------------------------------+
|                             CLIENT BROWSER                                    |
|   (React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7)          |
+------------------------------------+------------------------------------------+
                                     |
           +-------------------------+-------------------------+
           |                                                   |
           v                                                   v
+-------------------------------+             +---------------------------------+
|     VERCEL EDGE HOSTING       |             |     SUPABASE CLOUD PROJECT      |
|  - Static Assets (HTML/JS/CSS)|             |  - PostgreSQL (Articles, Quotes)|
|  - SPA Rewrites (vercel.json) |             |  - Auth (Admin Sessions)        |
|  - Serverless API Routes      |             |  - Storage (Public & Private)   |
+-------------------------------+             +---------------------------------+
           |                                                   |
           v                                                   v
+-------------------------------+             +---------------------------------+
|      EMAIL NOTIFICATIONS      |             |     SECURITY & ACCESS RULE      |
|  - Web3Forms (Public Forms)   |             |  - Row Level Security (RLS)     |
|  - Resend (Serverless Alerts) |             |  - Signed URLs (5-min expiry)   |
+-------------------------------+             +---------------------------------+
```

---

## 4. Step-by-Step Supabase Setup (Windows & PowerShell)

Follow these simple steps in Windows using PowerShell and your web browser:

### Step 4.1: Create Your Supabase Project
1. Open your browser and visit [https://supabase.com](https://supabase.com).
2. Click **Start your project** and sign in with your GitHub account.
3. Click **New project**.
4. Set the project details:
   - **Name:** `kjt-technologies`
   - **Database Password:** Enter a strong password (keep this safe in a password manager).
   - **Region:** Choose `Frankfurt (eu-central-1)`, `London (eu-west-2)`, or `Johannesburg (af-south-1)` for optimal East Africa latency.
5. Click **Create new project** and wait 1–2 minutes for the database to provision.

### Step 4.2: Execute the Database Schema
1. In the Supabase left sidebar, click the **SQL Editor** icon (`>_`).
2. Click **New query**.
3. Open `supabase/setup.sql` in your VS Code editor, copy the entire file contents (`Ctrl+A`, then `Ctrl+C`).
4. Paste it into the Supabase SQL editor (`Ctrl+V`).
5. Click the green **Run** button (or press `Ctrl+Enter`).
6. You will see `Success. No rows returned`. All tables, indexes, storage buckets, and security policies are now created!

### Step 4.3: Create an Administrator Account
1. In the Supabase left sidebar, click **Authentication** (person icon) &rarr; **Users**.
2. Click **Add user** &rarr; **Create user**.
3. Enter the administrator email (e.g. `admin@kjttechnologies.com`) and a strong password.
4. Set **Auto Confirm User** to **Enabled** so you can log in immediately.
5. Click **Create user**.
6. (Optional) Run this SQL query to link the profile:
   ```sql
   INSERT INTO public.admin_profiles (id, email, full_name, role, avatar_initials)
   SELECT id, email, 'KJT Administrator', 'superadmin', 'KA'
   FROM auth.users
   WHERE email = 'admin@kjttechnologies.com'
   ON CONFLICT (id) DO NOTHING;
   ```

### Step 4.4: Retrieve API Keys & Configure PowerShell
1. In Supabase, go to **Project Settings** (gear icon) &rarr; **API**.
2. Copy the **Project URL** (e.g. `https://xyzabcdefg.supabase.co`).
3. Copy the **anon / public** API Key (long JWT starting with `eyJhbGciOi...`).
4. In Windows PowerShell at the root of your project:
   ```powershell
   # Copy the example environment file
   Copy-Item .env.example .env.local

   # Open it in VS Code to insert your keys
   code .env.local
   ```
5. Paste your URL and anon key into `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your_anon_key...
   VITE_SITE_URL=http://localhost:5173
   ```

---

## 5. Storage Architecture (Public vs Private Buckets)

Security requires strict physical separation between public marketing assets and confidential client files:

```text
+---------------------------------------------------------------------------------+
|                               SUPABASE STORAGE                                  |
+---------------------------------------+-----------------------------------------+
|                                       |                                         |
|    BUCKET: 'article-images'           |    BUCKET: 'quotation-files'            |
|    Status: PUBLIC                     |    Status: PRIVATE                      |
|                                       |                                         |
|    Access: Anyone with URL            |    Access: Authenticated Admins ONLY    |
|    Download: Direct CDN link          |    Download: Short-Lived Signed URLs    |
|    Contents:                          |    Contents:                            |
|    - Article hero images              |    - Architectural briefs               |
|    - In-text technical diagrams       |    - Technical specification RFPs       |
|    - Team avatars                     |    - NDA documents                      |
+---------------------------------------+-----------------------------------------+
```

### Storage Security Verification Checklist:
- [x] `article-images` is set to **Public** (`public = true`).
- [x] `quotation-files` is set to **Private** (`public = false`).
- [x] Anonymous visitors can upload client briefs (`INSERT`) but cannot list or read files (`SELECT is denied to anon`).
- [x] Admins generate **5-minute signed URLs** (`createSignedUrl(filePath, 300)`) to inspect client documents.
- [x] File validation rejects executable formats (`.exe`, `.sh`, `.bat`, `.php`, `.js`).

---

## 6. Email Notification Options & Security

### Provider Comparison:

| Feature | **Web3Forms** | **Formspree** | **Resend** | **Brevo (Sendinblue)** |
| :--- | :--- | :--- | :--- | :--- |
| **Client-Safe Mode** | Yes (Free public Access Key) | Yes (Form endpoint URL) | No (Requires backend function) | No (Requires backend function) |
| **Setup Time** | 2 minutes | 5 minutes | 15 minutes | 20 minutes |
| **Cost** | Generous free tier | Free up to 50 submissions/mo | Free up to 3,000 emails/mo | Free up to 300 emails/day |
| **Custom HTML Templates**| Basic formatting | Basic | Full React Email / HTML | Full HTML Drag-and-Drop |
| **Best Used For** | Contact Form, Quote Alerts | Backup Contact Form | Corporate Receipts & Calendars| Marketing & High-Volume News |

### Recommendation for KJT TECHNOLOGIES:
1. **Phase 1 (Immediate Zero-Backend):** Use **Web3Forms**. Enter your access key in `src/config/company.ts` (`contactFormKey`) or `.env.local` (`VITE_WEB3FORMS_ACCESS_KEY`). Inquiries and booking alerts will arrive in your inbox instantly.
2. **Phase 2 (Enterprise Branded Notifications):** Deploy a Vercel Serverless Function (`api/send-email.ts`) using **Resend** to send customized HTML consultation confirmations containing the `.ics` calendar attachment.

> **CRITICAL SECURITY RULE:** Never place Resend or Brevo API keys in React code or variables starting with `VITE_`. Always execute them in an isolated server-side function.

---

## 7. Article Lifecycle & Image Management

### The 4-Stage Article Workflow:
1. **Drafting (`status = 'draft'`):**
   - Articles are saved locally in the browser (`localStorage`) and synced to Supabase with `status = 'draft'`.
   - Invisible to search engines (`noindex`) and hidden from the public blog catalog.
2. **Validation & Sanitization:**
   - The editor checks for a valid title (no hashtags), clean URL slug, excerpt, and featured image.
   - HTML content is sanitized via DOMPurify to prevent XSS attacks.
3. **Publication (`status = 'published'`):**
   - RLS policy immediately makes the article visible at `/blog/:slug`.
   - Dynamic OpenGraph tags, canonical tags, and structured JSON-LD schemas are generated for Google Search.
4. **Image Upload:**
   - Validated: JPG, PNG, WebP, AVIF, SVG up to 5MB.
   - Stored in `article-images` with a unique timestamp filename: `${timestamp}_${random}_${name}.ext`.

---

## 8. Vercel Deployment & Environment Secrets

### Deployment from Windows PowerShell:
1. Push your repository to GitHub:
   ```powershell
   git add .
   git commit -m "feat: complete backend and customization configuration"
   git push origin main
   ```
2. Open [https://vercel.com](https://vercel.com) and click **Add New...** &rarr; **Project**.
3. Import your GitHub repository.
4. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
   - `VITE_SITE_URL` = `https://kjttechnologies.com`
   - `VITE_WEB3FORMS_ACCESS_KEY` = `your-web3forms-key`
5. Click **Deploy**. Vercel will build the production bundle and provide a live URL in ~60 seconds.

---

## 9. Security Directives & Cheat Sheet

```text
+---------------------------------------------------------------------------------+
|                              SECURITY CHEAT SHEET                               |
+---------------------------------------------------------------------------------+
| [x] NEVER put SUPABASE_SERVICE_ROLE_KEY into .env.local or frontend files      |
| [x] NEVER prefix private API keys with VITE_                                    |
| [x] ALWAYS keep Row Level Security (RLS) enabled on all tables                 |
| [x] ALWAYS keep the quotation-files storage bucket set to private               |
| [x] ALWAYS add .env and .env.local to .gitignore                                |
| [x] ALWAYS use short-lived signed URLs for downloading client briefs            |
+---------------------------------------------------------------------------------+
```
