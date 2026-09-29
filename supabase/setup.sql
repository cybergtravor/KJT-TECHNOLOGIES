-- =====================================================================
-- KJT TECHNOLOGIES - COMPLETE SUPABASE POSTGRESQL SCHEMA & SECURITY RULES
-- =====================================================================
-- Company: KJT TECHNOLOGIES
-- Motto: "Accelerating Innovation, Securing Data."
-- 
-- HOW TO RUN THIS SCRIPT (POWERSHELL / BROWSER):
-- 1. Open your browser and navigate to your Supabase project dashboard:
--    https://supabase.com/dashboard/project/_/sql/new
-- 2. Copy the entire contents of this file.
-- 3. Paste into the SQL Editor and click the green "Run" button.
-- 4. All tables, constraints, indexes, Row Level Security (RLS) policies,
--    and storage buckets will be created automatically.
-- =====================================================================

-- =====================================================================
-- SECTION 1: ADMINISTRATOR PROFILES TABLE
-- Stores profile metadata linked directly to Supabase Auth (auth.users).
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
    avatar_initials VARCHAR(10) DEFAULT 'KT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin search
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles (email);

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Admins can view and update their own profiles
DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admin_profiles;
CREATE POLICY "Admins can view their own profile"
ON public.admin_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admin_profiles;
CREATE POLICY "Admins can update their own profile"
ON public.admin_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================================
-- SECTION 2: CATEGORIES TABLE
-- Organizes technology news, articles, and whitepapers.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    accent_color VARCHAR(50) DEFAULT '#00D4FF',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
ON public.categories FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated admins can manage categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed initial categories for KJT TECHNOLOGIES
INSERT INTO public.categories (id, name, slug, description, accent_color)
VALUES 
    ('cat-cybersecurity', 'Cybersecurity', 'cybersecurity', 'Threat intelligence, penetration testing, and zero trust architectures.', '#00D4FF'),
    ('cat-software', 'Software Engineering', 'software-engineering', 'Enterprise web applications, mobile platforms, and system architecture.', '#3B82F6'),
    ('cat-cloud', 'Cloud & DevOps', 'cloud-devops', 'Cloud migrations, automated CI/CD pipelines, and multi-region resilience.', '#10B981'),
    ('cat-networking', 'Network Infrastructure', 'network-infrastructure', 'Structured fiber cabling, data centers, and enterprise switching.', '#F59E0B'),
    ('cat-surveillance', 'CCTV & Surveillance', 'cctv-surveillance', 'AI-powered optical security, smart NVRs, and perimeter analytics.', '#8B5CF6'),
    ('cat-transformation', 'Digital Transformation', 'digital-transformation', 'School management systems, ERP modernization, and automated workflows.', '#EC4899')
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- SECTION 3: ARTICLES & TECHNOLOGY NEWS TABLE
-- Central repository for corporate publications, case studies, and insights.
-- =====================================================================
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
    author_role VARCHAR(150) DEFAULT 'Technology Analyst',
    author_avatar TEXT,
    author_bio TEXT,
    published_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_time VARCHAR(50) DEFAULT '5 min read',
    cover_image TEXT NOT NULL,
    image_alt VARCHAR(300),
    image_caption TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
    scheduled_for TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_editor_pick BOOLEAN DEFAULT FALSE,
    is_news BOOLEAN DEFAULT FALSE,
    original_source VARCHAR(200),
    source_url TEXT,
    event_date DATE,
    additional_images JSONB DEFAULT '[]'::jsonb
);

-- Indexes for rapid search and sorting
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles (published_at DESC);

-- Enable RLS on articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- A) Public visitors can ONLY view published articles
DROP POLICY IF EXISTS "Public visitors can only view published articles" ON public.articles;
CREATE POLICY "Public visitors can only view published articles"
ON public.articles FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- B) Authenticated administrators have complete management access
DROP POLICY IF EXISTS "Authenticated admins can manage all articles" ON public.articles;
CREATE POLICY "Authenticated admins can manage all articles"
ON public.articles FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================================
-- SECTION 4: MEDIA LIBRARY ASSETS TABLE
-- Tracks images, diagrams, and technical drawings uploaded by authors.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.media_library (
    id VARCHAR(150) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'image',
    size VARCHAR(50),
    uploaded_by VARCHAR(150) DEFAULT 'Admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Public can view media assets
DROP POLICY IF EXISTS "Public view media assets" ON public.media_library;
CREATE POLICY "Public view media assets"
ON public.media_library FOR SELECT
TO anon, authenticated
USING (true);

-- Authenticated admins manage media library
DROP POLICY IF EXISTS "Admins manage media assets" ON public.media_library;
CREATE POLICY "Admins manage media assets"
ON public.media_library FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================================
-- SECTION 5: PUBLIC STORAGE BUCKET FOR ARTICLE IMAGES
-- Stores featured photos and inline illustrations for news articles.
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for article images
DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
CREATE POLICY "Public can view article images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'article-images');

-- Only authenticated admins can upload article images
DROP POLICY IF EXISTS "Admins can upload article images" ON storage.objects;
CREATE POLICY "Admins can upload article images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'article-images');

-- Only authenticated admins can delete article images
DROP POLICY IF EXISTS "Admins can delete article images" ON storage.objects;
CREATE POLICY "Admins can delete article images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'article-images');

-- =====================================================================
-- SECTION 6: SMART QUOTATION REQUESTS TABLE
-- Stores comprehensive multi-step requests submitted by prospective clients.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.quotation_requests (
    id VARCHAR(150) PRIMARY KEY,
    reference_number VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    company VARCHAR(200),
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(100),
    location VARCHAR(200),
    preferred_contact_method VARCHAR(50) DEFAULT 'email',
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    other_service_description TEXT,
    project_title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    main_goals TEXT NOT NULL,
    target_users TEXT,
    required_features TEXT,
    existing_url TEXT,
    preferred_technology VARCHAR(200),
    project_type VARCHAR(50) DEFAULT 'new',
    files JSONB DEFAULT '[]'::jsonb,
    currency VARCHAR(10) DEFAULT 'UGX',
    budget_range VARCHAR(100) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    preferred_start_date DATE,
    deadline DATE,
    is_deadline_flexible BOOLEAN DEFAULT TRUE,
    additional_comments TEXT,
    privacy_consent BOOLEAN DEFAULT TRUE,
    accuracy_confirmed BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Reviewing', 'Contacted', 'Quotation Prepared', 'Accepted', 'Declined', 'Completed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index quotation requests
CREATE INDEX IF NOT EXISTS idx_quotations_status ON public.quotation_requests (status);
CREATE INDEX IF NOT EXISTS idx_quotations_ref ON public.quotation_requests (reference_number);
CREATE INDEX IF NOT EXISTS idx_quotations_email ON public.quotation_requests (email);
CREATE INDEX IF NOT EXISTS idx_quotations_created ON public.quotation_requests (created_at DESC);

-- Enable RLS on quotation_requests
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;

-- Visitors can submit their quotation request
DROP POLICY IF EXISTS "Visitors can submit quotation requests" ON public.quotation_requests;
CREATE POLICY "Visitors can submit quotation requests"
ON public.quotation_requests FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated admins can view, update, and manage quotation records
DROP POLICY IF EXISTS "Admins can view and manage all quotation requests" ON public.quotation_requests;
CREATE POLICY "Admins can view and manage all quotation requests"
ON public.quotation_requests FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================================
-- SECTION 7: PRIVATE STORAGE BUCKET FOR CONFIDENTIAL QUOTATION ATTACHMENTS
-- Stores client specifications, NDAs, architectural briefs, and RFPs.
-- STRICT SECURITY: Non-public bucket. Access requires signed URLs.
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotation-files', 'quotation-files', false)
ON CONFLICT (id) DO NOTHING;

-- Prospective clients can upload brief files when submitting a quote
DROP POLICY IF EXISTS "Visitors can upload quotation files" ON storage.objects;
CREATE POLICY "Visitors can upload quotation files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'quotation-files');

-- Only authenticated administrators can read and download quotation attachments
DROP POLICY IF EXISTS "Only authenticated admins can view quotation documents" ON storage.objects;
CREATE POLICY "Only authenticated admins can view quotation documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'quotation-files');

-- Only authenticated administrators can delete quotation documents
DROP POLICY IF EXISTS "Only authenticated admins can delete quotation documents" ON storage.objects;
CREATE POLICY "Only authenticated admins can delete quotation documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'quotation-files');

-- =====================================================================
-- SECTION 8: CONSULTATION AVAILABILITY & OPERATING HOURS TABLE
-- Configures business opening/closing hours, lunch break, and buffer times.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.consultation_availability (
    id VARCHAR(100) PRIMARY KEY DEFAULT 'default_availability',
    available_weekdays JSONB DEFAULT '[1,2,3,4,5]'::jsonb,
    opening_time VARCHAR(10) DEFAULT '08:30',
    closing_time VARCHAR(10) DEFAULT '17:30',
    consultation_duration_minutes INT DEFAULT 45,
    break_periods JSONB DEFAULT '[{"start":"13:00","end":"14:00"}]'::jsonb,
    max_bookings_per_day INT DEFAULT 6,
    minimum_booking_notice_hours INT DEFAULT 12,
    max_advance_booking_days INT DEFAULT 60,
    time_zone VARCHAR(100) DEFAULT 'Africa/Kampala',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default configuration
INSERT INTO public.consultation_availability (id)
VALUES ('default_availability')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on consultation_availability
ALTER TABLE public.consultation_availability ENABLE ROW LEVEL SECURITY;

-- Public can view availability settings to calculate slots
DROP POLICY IF EXISTS "Public can view availability configuration" ON public.consultation_availability;
CREATE POLICY "Public can view availability configuration"
ON public.consultation_availability FOR SELECT
TO anon, authenticated
USING (true);

-- Admins can update availability configuration
DROP POLICY IF EXISTS "Admins manage availability configuration" ON public.consultation_availability;
CREATE POLICY "Admins manage availability configuration"
ON public.consultation_availability FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================================
-- SECTION 9: BLOCKED DATES & HOLIDAY BLACKOUT TABLE
-- Blocks specific calendar days for public holidays, maintenance, or events.
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id VARCHAR(150) PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    reason VARCHAR(255) DEFAULT 'Reserved date',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on blocked_dates
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Public can view blocked dates to hide unavailable calendar days
DROP POLICY IF EXISTS "Public can view blocked dates" ON public.blocked_dates;
CREATE POLICY "Public can view blocked dates"
ON public.blocked_dates FOR SELECT
TO anon, authenticated
USING (true);

-- Admins can add and remove blocked dates
DROP POLICY IF EXISTS "Admins manage blocked dates" ON public.blocked_dates;
CREATE POLICY "Admins manage blocked dates"
ON public.blocked_dates FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================================
-- SECTION 10: CONSULTATION BOOKINGS TABLE
-- Stores scheduled advisory sessions in Kampala time (Africa/Kampala, UTC+3).
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.consultation_bookings (
    id VARCHAR(150) PRIMARY KEY,
    booking_reference VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    organization VARCHAR(200),
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(100),
    service VARCHAR(200) NOT NULL,
    topic VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    booking_date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    time_zone VARCHAR(100) DEFAULT 'Africa/Kampala',
    meeting_method VARCHAR(100) NOT NULL CHECK (meeting_method IN ('Telephone call', 'WhatsApp call', 'Google Meet', 'Zoom', 'Physical meeting')),
    additional_notes TEXT,
    privacy_consent BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled', 'No Show')),
    admin_notes TEXT,
    rescheduled_from JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STRICT DOUBLE-BOOKING PREVENTION CONSTRAINT
-- No two clients can hold active reservations on the same date and start time
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_booking_slot
ON public.consultation_bookings (booking_date, start_time)
WHERE (status NOT IN ('Cancelled'));

-- Query indexes
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.consultation_bookings (booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.consultation_bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.consultation_bookings (email);

-- Enable RLS on consultation_bookings
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Visitors can submit bookings
DROP POLICY IF EXISTS "Visitors can submit consultation bookings" ON public.consultation_bookings;
CREATE POLICY "Visitors can submit consultation bookings"
ON public.consultation_bookings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins have complete management access
DROP POLICY IF EXISTS "Admins manage all consultation bookings" ON public.consultation_bookings;
CREATE POLICY "Admins manage all consultation bookings"
ON public.consultation_bookings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================================
-- SECTION 11: PRIVACY-SAFE PUBLIC BOOKED SLOTS VIEW
-- Allows prospective clients to see WHICH date & time slots are taken
-- WITHOUT exposing client names, phone numbers, emails, or topics.
-- =====================================================================
CREATE OR REPLACE VIEW public.public_booked_slots AS
SELECT booking_date, start_time, end_time
FROM public.consultation_bookings
WHERE status NOT IN ('Cancelled');

-- Grant read access on the privacy-safe view to anonymous visitors
GRANT SELECT ON public.public_booked_slots TO anon, authenticated;

-- =====================================================================
-- END OF SCHEMA SETUP SCRIPT
-- =====================================================================
