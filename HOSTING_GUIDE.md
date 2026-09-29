# KJT TECHNOLOGIES — COMPLETE HOSTING & DEPLOYMENT GUIDE

> **Company:** KJT TECHNOLOGIES  
> **Motto:** “Accelerating Innovation, Securing Data.”  
> **Target Audience:** Beginners and administrators using **Windows PowerShell**, **GitHub**, **Supabase**, and **Vercel**.

---

## Overview

This guide walks you through publishing the **KJT TECHNOLOGIES** enterprise website and Content Management System from your local Windows PC to the global web with free, enterprise-grade cloud infrastructure:

- **Source Code Repository:** GitHub (private or public repository)
- **Cloud Database & Auth:** Supabase (PostgreSQL, Row Level Security, Object Storage)
- **Global CDN & Edge Hosting:** Vercel (automatic HTTPS, continuous deployment)
- **Custom Domain:** `kjttechnologies.com` (DNS configuration)

---

## Prerequisites (What You Need Before Starting)

1. A computer running **Windows 10 or 11**.
2. **Git for Windows** installed ([git-scm.com](https://git-scm.com/download/win)).
3. **Node.js LTS (v18 or v20+)** installed ([nodejs.org](https://nodejs.org/)).
4. A free **GitHub account** ([github.com](https://github.com)).
5. A free **Supabase account** ([supabase.com](https://supabase.com)).
6. A free **Vercel account** ([vercel.com](https://vercel.com)).

---

## Phase 1: Prepare the Project on Windows (Using PowerShell)

1. Open **Windows PowerShell** on your PC:
   - Press the `Windows Key`, type `PowerShell`, and click **Run as Administrator** (or open normal PowerShell).

2. Navigate to your project folder:
   ```powershell
   cd "C:\Path\To\kjt-technologies"
   ```

3. Verify that your project compiles cleanly without any errors:
   ```powershell
   npm run build
   ```
   *Expected result:* You will see `✓ built in ...ms` and a `dist/` folder will be generated.

4. Initialize a Git repository (if you haven't already):
   ```powershell
   git init
   git add .
   git commit -m "feat: complete KJT TECHNOLOGIES production build"
   ```

---

## Phase 2: Push Code to GitHub

1. Open your browser, sign in to [GitHub](https://github.com), and click **New Repository**.
2. Name your repository: `kjt-technologies-website`.
3. Keep it **Private** (recommended for corporate security) or Public. Do **not** check "Initialize with README".
4. Click **Create repository**.
5. Copy the commands shown under *"push an existing repository from the command line"*, paste them into PowerShell, and press Enter:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/kjt-technologies-website.git
   git push -u origin main
   ```
   *(Replace `YOUR_GITHUB_USERNAME` with your real GitHub username).*

---

## Phase 3: Set Up the Supabase Database & Cloud Storage

1. Navigate to [Supabase](https://supabase.com) and click **Sign In**.
2. Click **New Project** and configure:
   - **Name:** `kjt-technologies-db`
   - **Database Password:** Choose a strong password (at least 14 characters, letters + numbers + symbols). Store this safely.
   - **Region:** Choose a region close to your primary audience (e.g., **East US**, **West Europe**, or **South Africa**).
   - **Pricing Plan:** Free Tier.
3. Click **Create new project** and wait ~2 minutes for provisioning.

### Running the Database Schema:
1. In the left navigation menu of your Supabase project, click **SQL Editor** (the terminal/script icon).
2. Click **New query**.
3. In your project code on Windows, open the file `supabase/setup.sql`.
4. Copy the entire contents of `supabase/setup.sql` (Ctrl+A, Ctrl+C).
5. Paste it into the Supabase SQL Editor and click the green **Run** button (or press Ctrl+Enter).
6. You will see `Success. No rows returned.` All 10 tables, Row Level Security rules, storage buckets (`article-images`, `quotation-files`), and initial categories are now created.

### Creating Your First Administrator Account:
1. In the left menu of Supabase, click **Authentication** &rarr; **Users**.
2. Click **Add User** &rarr; **Create user**.
3. Enter your administrator email (e.g., `admin@kjttechnologies.com`) and choose a strong password.
4. Check **Auto Confirm User?** so you don't need to confirm via email.
5. Click **Create user**.

### Copying Your API Keys:
1. In the left menu, click **Project Settings** (gear icon at the bottom) &rarr; **API**.
2. Copy the following two values:
   - **Project URL:** (Looks like `https://abcdefghijkl.supabase.co`)
   - **anon / public key:** (A long string starting with `eyJhbGciOi...`)
   > ⚠️ **CRITICAL SECURITY NOTE:** Never copy or share the `service_role` key! Only copy the **anon public key**.

---

## Phase 4: Deploy the Website to Vercel

1. Navigate to [Vercel](https://vercel.com) and sign in (choose **Continue with GitHub**).
2. Click **Add New...** &rarr; **Project**.
3. In the list of GitHub repositories, find `kjt-technologies-website` and click **Import**.
4. In the **Configure Project** window:
   - **Framework Preset:** `Vite` (automatically detected).
   - **Root Directory:** `./` (default).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** `dist` (default).
5. Expand the **Environment Variables** section and add the following keys:

| Key Name | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://abcdefghijkl.supabase.co` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase public Anon key |
| `VITE_WEB3FORMS_ACCESS_KEY` | `YOUR_ACCESS_KEY` | Optional: Web3Forms access key for instant email alerts |

6. Click **Deploy**.
7. Wait 45–60 seconds. You will see a confetti screen with **Congratulations! What will you ship next?**
8. Click the preview image to view your live website on your temporary Vercel domain (e.g., `https://kjt-technologies-website.vercel.app`).

---

## Phase 5: Connect Your Custom Domain (`kjttechnologies.com`)

1. In your Vercel Project Dashboard, click **Settings** &rarr; **Domains**.
2. Type your domain: `kjttechnologies.com` and click **Add**.
3. Vercel will recommend adding both:
   - `kjttechnologies.com`
   - `www.kjttechnologies.com` (redirecting to the apex domain or vice versa).
4. Vercel will display the required **DNS Records**:
   - **Type A Record:**
     - **Name / Host:** `@`
     - **Value / Points to:** `76.76.21.21`
   - **Type CNAME Record:**
     - **Name / Host:** `www`
     - **Value / Points to:** `cname.vercel-dns.com`
5. Log into your domain registrar (GoDaddy, Namecheap, Google Domains, Cloudflare, etc.).
6. Open your **DNS Management / DNS Zone** settings.
7. Add the A Record and CNAME Record provided by Vercel.
8. Wait 10 to 60 minutes for global DNS propagation. Vercel will automatically issue a free **Let's Encrypt SSL Certificate** with HTTPS enabled.

---

## Phase 6: Post-Deployment Verification Checklist

Once your site is live, perform these 5 verification tests:

- [ ] **Public Pages:** Visit `https://kjttechnologies.com` and click through *About Us*, *Services*, *Portfolio*, *Consultation*, and *Blog*.
- [ ] **Admin Login:** Visit `https://kjttechnologies.com/admin/login`. Sign in using the administrator email and password you created in Supabase.
- [ ] **CMS Article Test:** In the admin dashboard, create a test article, upload a cover photo, and save it. Verify that it appears on the public `/blog` page.
- [ ] **Quotation Submission:** Fill out the quotation form at `/request-quote`. Check that a reference number is generated and that the submission appears under `/admin/quotations`.
- [ ] **Consultation Booking:** Schedule an advisory appointment at `/book-consultation`. Verify that the slot displays on `/admin/consultations`.

---

## Updating Your Website in the Future

Whenever you make improvements to the website on your Windows PC:

1. Open PowerShell in the project directory:
   ```powershell
   git add .
   git commit -m "Update company news and services"
   git push origin main
   ```
2. Vercel automatically detects the push to GitHub and deploys your changes within 60 seconds with zero downtime!
