-- =====================================================================
-- KJT TECHNOLOGIES - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- =====================================================================
-- Copy and run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- =====================================================================

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

-- 5. Create Article Images (Media Library) Table
CREATE TABLE IF NOT EXISTS public.article_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id VARCHAR(150) REFERENCES public.articles(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    alt_text VARCHAR(300) NOT NULL,
    caption TEXT,
    size_bytes BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5b. Create Media Library Table (used by admin Media Library)
CREATE TABLE IF NOT EXISTS public.media_files (
    id VARCHAR(150) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    alt_text VARCHAR(300),
    caption TEXT,
    size_bytes BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for Blazing Fast Queries
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_trending ON public.articles(is_trending);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON public.articles(is_featured);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- Policy A: Public Visitors Can Read Only Published Articles
-- ---------------------------------------------------------------------
CREATE POLICY "Public visitors can only view published articles"
ON public.articles
FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- ---------------------------------------------------------------------
-- Policy B: Authenticated Admins Have Full Access (CRUD)
-- ---------------------------------------------------------------------
CREATE POLICY "Authenticated admins can manage all articles"
ON public.articles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ---------------------------------------------------------------------
-- Policy C: Public Visitors Can Read Categories & Authors
-- ---------------------------------------------------------------------
CREATE POLICY "Public visitors can view categories"
ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated admins can manage categories"
ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public visitors can view authors"
ON public.authors FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated admins can manage authors"
ON public.authors FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------
-- Policy C2: Media Library access
-- ---------------------------------------------------------------------
CREATE POLICY "Public visitors can view media files"
ON public.media_files FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated admins can manage media files"
ON public.media_files FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------------------------------------------------------------------
-- Policy D: Storage Bucket Configuration for 'article-images'
-- ---------------------------------------------------------------------
-- Run this in Storage settings or SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to images
CREATE POLICY "Public can read article images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'article-images');

-- Only authenticated users can upload images
CREATE POLICY "Authenticated users can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Only authenticated users can delete article images
CREATE POLICY "Authenticated users can delete article images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');
