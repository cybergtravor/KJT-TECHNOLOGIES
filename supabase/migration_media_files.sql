-- =====================================================================
-- MIGRATION: Add media_files table (admin Media Library)
-- Run this once in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qgtscyyydsbmzyyiftmj/sql/new
-- =====================================================================

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

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can view media files"
ON public.media_files FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated admins can manage media files"
ON public.media_files FOR ALL TO authenticated USING (true) WITH CHECK (true);
