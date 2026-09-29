# KJT TECHNOLOGIES - TECHNOLOGY NEWS & INSIGHTS CMS GUIDE
**Company:** KJT TECHNOLOGIES  
**Motto:** *“Accelerating Innovation, Securing Data.”*

This comprehensive guide covers everything required to manage, customize, publish, and scale the **KJT Technology News and Insights Hub** and the **Supabase Content Management System (CMS)**.

---

## 📑 Table of Contents
1. [Overview & Architecture](#1-overview--architecture)
2. [How to Connect Supabase](#2-how-to-connect-supabase)
3. [Database Schema & Table Creation](#3-database-schema--table-creation)
4. [Row Level Security (RLS) Policies](#4-row-level-security-rls-policies)
5. [Storage Bucket Setup (`article-images`)](#5-storage-bucket-setup-article-images)
6. [Creating an Administrator Account](#6-creating-an-administrator-account)
7. [Managing Articles via Admin Dashboard & Editorial Workflow](#7-managing-articles-via-admin-dashboard--editorial-workflow)
8. [Adding Articles Manually in Code](#8-adding-articles-manually-in-code)
9. [Recommended Image Specs & Formats](#9-recommended-image-specs--formats)
10. [SEO & Social Sharing Best Practices](#10-seo--social-sharing-best-practices)
11. [Routing & Deployment Verification (SPA Rewrites & Vercel)](#11-routing--deployment-verification-spa-rewrites--vercel)
12. [Responsive Layout Specifications](#12-responsive-layout-specifications)

---

## 1. Overview & Architecture

The KJT News & Insights hub is built with a **resilient hybrid architecture**:
- **Public View:** Renders 12 pre-compiled in-depth articles immediately (`src/data/blogData.ts`), alongside any newly published articles from Supabase or localStorage.
- **Admin CMS (`/admin/*`):** Secure authenticated dashboard (`/admin/dashboard`) and article creator/editor (`/admin/articles/new`, `/admin/articles/edit/:id`) with:
  - Live preview & draft mode
  - Supabase Auth + local fallback mode
  - Supabase Storage image uploader with drag-and-drop & validation
  - Real-time SEO character counters and structured snippet insertion
  - Editorial flags (`isFeatured`, `isTrending`, `isNews`)
- **Single Source of Truth:** `src/lib/articlesService.ts` automatically manages synchronizing data between Supabase Cloud and local caches.

---

## 2. How to Connect Supabase

Follow these 4 simple steps to connect your own Supabase cloud database:

### Step 2.1: Create a Free Supabase Project
1. Visit [supabase.com](https://supabase.com) and create an account or sign in.
2. Click **New Project** and name it `kjt-technologies-cms`.
3. Choose your preferred region (e.g. Frankfurt, Johannesburg, or London for optimal East Africa latency) and set a secure database password.

### Step 2.2: Retrieve API Keys
1. In your project dashboard, navigate to **Project Settings &rarr; API**.
2. Locate:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Project API Keys &rarr; `anon` `public` key** (a JWT starting with `eyJhbGciOi...`)

### Step 2.3: Configure Environment Variables
Set these two variables in your environment secrets or `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

*(Note: Never commit your actual keys to public Git repositories. The repository only tracks `.env.example` as a placeholder.)*

---

## 3. Database Schema & Table Creation

The full database schema is located in `/supabase/schema.sql`.

### Quick Setup:
1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New Query**.
3. Copy and paste the following SQL script and click **Run**:

```sql
-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Authors Table
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Articles Table (Main News & Insights Table)
CREATE TABLE IF NOT EXISTS public.articles (
    id VARCHAR(150) PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    seo_title VARCHAR(300),
    meta_description TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(150),
    author_avatar TEXT,
    author_bio TEXT,
    published_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_time VARCHAR(50) DEFAULT '5 min read',
    cover_image TEXT NOT NULL,
    image_alt VARCHAR(300),
    image_caption TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    related_post_slugs JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
    scheduled_for TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_editor_pick BOOLEAN DEFAULT FALSE,
    is_news BOOLEAN DEFAULT FALSE,
    original_source VARCHAR(200),
    source_url TEXT,
    event_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_trending ON public.articles(is_trending);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON public.articles(is_featured);
```

---

## 4. Row Level Security (RLS) Policies

Supabase Row Level Security ensures that:
- **Public visitors** can **only read** articles where `status = 'published'`.
- Visitors **cannot** create, modify, or delete articles.
- **Drafts and scheduled articles** remain strictly private.
- Only authenticated administrators have full CRUD access.

Run these policies in the **SQL Editor**:

```sql
-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

-- Policy 1: Visitors can only read published articles
CREATE POLICY "Public visitors can only view published articles"
ON public.articles
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- Policy 2: Authenticated admins have full CRUD access
CREATE POLICY "Authenticated admins can manage all articles"
ON public.articles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 3: Public can read categories & authors
CREATE POLICY "Public can view categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view authors" ON public.authors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage authors" ON public.authors FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## 5. Storage Bucket Setup (`article-images`)

For storing featured images and inside-article graphics:

1. In the Supabase dashboard, go to **Storage &rarr; Buckets**.
2. Click **New Bucket**.
3. Name the bucket: `article-images`.
4. Toggle **Public Bucket** to **ON** (so image URLs can be displayed in browser).
5. Click **Save**.

### Storage Policies
Run the following in the SQL Editor:

```sql
-- Public read access to article images
CREATE POLICY "Public read article images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

-- Only authenticated admins can upload images
CREATE POLICY "Admins upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Only authenticated admins can delete article images
CREATE POLICY "Admins delete article images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');
```

---

## 6. Creating an Administrator Account

To log into `/admin/login` using Supabase Auth:

1. In the Supabase dashboard, navigate to **Authentication &rarr; Users**.
2. Click **Add User** &rarr; **Create User**.
3. Enter your administrator email (e.g. `admin@kjttechnologies.com`) and a strong password (minimum 8 characters).
4. Toggle **Auto Confirm User** to **ON** so you can log in immediately without requiring email verification.
5. Click **Create User**.
6. Navigate to `https://your-site.com/admin/login` and sign in!

> **Fallback Demo Mode:** If Supabase credentials are not yet configured, the portal operates in **Demo Testing Mode** so editors can test drafting, publishing, and local previews directly.

---

## 7. Managing Articles via Admin Dashboard & Editorial Workflow

### 7.1 Accessing the Administrator CMS
1. Scroll to the footer of any public page on the website.
2. Locate the **Website Administration** bar at the bottom and click **Administrator Login** (or **Manage News & Articles** if currently authenticated).
3. Alternatively, navigate directly to `/admin/login`.

### 7.2 Administrator Sign In
- If Supabase is connected: Sign in with your registered admin email and password.
- If running in local testing mode: A convenient demo login button is provided with instant fallback testing credentials.
- After logging in, you are redirected to the **Articles Dashboard** at `/admin/dashboard`.

### 7.3 Creating a New Article (6-Step Guided Flow)
Click **Create Article** or **New Article** (`/admin/articles/new`):
1. **Step 1: Core Details & Title:**
   - Enter your article title.
   - *Automatic Sanitization:* The CMS automatically removes hashtags (`#`) and emojis from titles, headings, and URL slugs while preserving the core text.
   - The URL slug is auto-generated cleanly (e.g. `emerging-technology-trends-2026`).
2. **Step 2: Media & Imagery:**
   - Upload a high-resolution cover image using drag-and-drop or select from the Media Library.
   - Add accessible Alt Text and an optional editorial image caption.
   - Add supplementary inline images if needed.
3. **Step 3: Content & Artifact Stripping:**
   - Compose or paste your article in the rich text editor.
   - *Clean Paste Intelligence:* When pasting from Google AI Studio, Google Docs, or Word, the editor automatically strips unwanted styling, citation chips (`<source-footnote>`), and converts bold lines into proper semantic `<h2>` headings.
   - Click **Clean Existing Formatting** at any time to inspect and sanitize legacy articles.
4. **Step 4: Category & Tags:**
   - Select the target technology category (e.g., *Cybersecurity*, *Artificial Intelligence*, *Cloud Computing*).
   - Add clean tags (leading `#` characters are automatically stripped).
5. **Step 5: SEO & Social Card Preview:**
   - Inspect live character counters for your SEO Title Tag (50–60 chars) and Meta Description (140–160 chars).
   - Check the Google SERP preview snippet and social card generator.
6. **Step 6: Author, Flags & Release:**
   - Verify the author's name, role, and avatar.
   - Set placement toggles: **Featured Spotlight Lead**, **Trending Tech News**, or **News Dispatch**.
   - Select status:
     - **Published:** Live immediately on the public website and included in search engine feeds.
     - **Draft:** Saved privately in the CMS; visitors and search engines receive a 404 / noindex.
     - **Scheduled:** Embargoed until a specified target date and time.
   - Click **Publish Article Live** or **Save as Draft**.

### 7.4 How to Unpublish an Article
To unpublish any article immediately:
1. Open the **Admin Dashboard** (`/admin/dashboard`).
2. In the articles table, locate the article and click its status dropdown or click **Edit**.
3. Change its status from **Published** to **Draft**.
4. The article is instantly removed from the public website (`/blog`, `/news`, and home feeds) and returns a 404 to non-admin visitors.

### 7.5 Batch Cleaning Legacy Articles
If you have multiple older articles with unwanted hashtags, emojis, or inline styles:
1. Click **Batch Clean All Articles** in the Admin Dashboard header.
2. Review the safety confirmation modal.
3. Click **Execute Batch Sanitization**. The system cleans titles, headings, slugs, and tags across all stored articles and reports the exact count of sanitized items.

---

## 8. Adding Articles Manually in Code

If you prefer to maintain articles as static TypeScript files in Git:

1. Open `src/data/blogData.ts`.
2. Add a new object following the `BlogPostItem` interface:

```typescript
{
  id: "my-custom-article-slug",
  slug: "my-custom-article-slug",
  title: "Your Comprehensive Technical Title",
  seoTitle: "Your Comprehensive Technical Title | KJT TECHNOLOGIES",
  metaDescription: "150-character summary for Google search snippet...",
  excerpt: "Short 2-sentence teaser for cards and hero sections...",
  content: `## First Major Heading

Write your technical guidance here...

> **Key Takeaway:** Strategic executive summary quote here.

### Sub-Section

- Point 1
- Point 2`,
  category: "Cybersecurity", // Choose from supported categories
  author: {
    name: "Eng. Samuel K.",
    role: "Enterprise Security Architect",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Senior systems engineer at KJT TECHNOLOGIES.",
  },
  publishedAt: "2026-09-07",
  readTime: "6 min read",
  coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  imageAlt: "Descriptive alt text for screen readers and SEO",
  imageCaption: "Optional image caption",
  tags: ["Cybersecurity", "Zero Trust", "Uganda Tech"],
  status: "published",
  isFeatured: false,
  isTrending: false, // Only set to true for verified trending articles
  isNews: false,
}
```

---

## 9. Recommended Image Specs & Formats

To ensure fast loading speeds across mobile connections in East Africa:
- **Aspect Ratio:** 16:9 or 1.91:1 (ideal for social cards).
- **Recommended Dimensions:**
  - **Cover Images:** 1200 x 630 px (or 1200 x 675 px).
  - **Inline Images:** 800 x 450 px minimum width.
  - **Author Avatars:** 400 x 400 px (square, 1:1).
- **Supported Formats:** WebP (recommended for smallest size), AVIF, JPG, PNG, SVG.
- **Maximum File Size:** Under 5MB (CMS enforces a 5MB limit).
- **Alt Text:** Always write descriptive alt text stating what the image depicts (e.g. *"Technician configuring fiber optic patch panel in data center rack"*).

---

## 10. SEO & Social Sharing Best Practices

1. **Title Length:** Keep titles between 50 and 65 characters.
2. **Meta Description:** Keep descriptions between 140 and 160 characters.
3. **Headings:**
   - Use `## ` for major sections (automatically parsed into the Table of Contents).
   - Use `### ` for sub-sections.
4. **Social Cards:**
   - The `<SEOHead />` component automatically generates Open Graph (`og:image`, `og:title`, `og:description`) and Twitter Card (`summary_large_image`) tags.
   - When shared on WhatsApp, LinkedIn, X/Twitter, or Facebook, the cover image and summary appear automatically.
5. **XML Sitemap:** Submit your sitemap at `https://kjttechnologies.com/sitemap.xml` to Google Search Console to speed up indexation.

---

## 11. Routing & Deployment Verification (SPA Rewrites & Vercel)

All routes are fully configured for Single Page Application (SPA) hosting on Vercel:
- `/news` &rarr; Technology News & Insights Hub
- `/blog` &rarr; Technology News & Insights Hub
- `/blog/:slug` &rarr; Article Reading View with full Article JSON-LD
- `/admin/login` &rarr; Administrator Login Portal
- `/admin/dashboard` &rarr; Protected Articles CMS
- `/admin/articles/new` &rarr; Article Creator

All rewrites in `vercel.json` direct requests to `/index.html` with appropriate security headers (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`). Direct links and browser refreshes on any route will not produce a Vercel 404 error.

---

## 12. Responsive Layout Specifications

The website and CMS are tested and optimized across all major breakpoints:
- **320px (Small Mobile):** Single-column cards, full-width touch targets, collapsed mobile navigation.
- **375px (Standard Mobile - iPhone SE):** Enhanced spacing, clean article reading typography.
- **768px (Tablet / iPad):** 2-column article grids, side-by-side author metadata.
- **1024px (Desktop):** Full mega-navigation menu, 3-column topic sections, sticky table of contents.
- **1440px (Wide Desktop):** Centered max-w-7xl canvas with generous negative space and sharp contrast.

---

*Documented by KJT TECHNOLOGIES Engineering Team — “Accelerating Innovation, Securing Data.”*
