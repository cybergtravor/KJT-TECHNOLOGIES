/**
 * =====================================================================
 * ARTICLES & NEWS SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Central data layer unifying:
 * 1. Pre-compiled static sample articles (12 in-depth articles)
 * 2. Supabase Cloud Database (when VITE_SUPABASE_URL is configured)
 * 3. LocalStorage persistence (instant fallback for admin edits & new articles)
 * 
 * Provides transparent CRUD operations, draft filtering, and search.
 * =====================================================================
 */

import { BlogPostItem } from '../types';
import { blogData as defaultBlogData } from '../data/blogData';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  sanitizeArticleHtml,
  cleanArticleObject,
  detectGoogleAiStudioArtifacts,
  cleanTitle,
  generateCleanSlug,
} from './contentSanitizer';

const LOCAL_STORAGE_KEY = 'kjt_custom_articles_v1';

/**
 * Get custom articles saved in localStorage
 */
export function getLocalArticles(): BlogPostItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading articles from localStorage', e);
    return [];
  }
}

/**
 * Save custom articles to localStorage
 */
export function saveLocalArticles(articles: BlogPostItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Error writing articles to localStorage', e);
  }
}

/**
 * Fetch all published articles for public view
 */
export async function getPublishedArticles(): Promise<BlogPostItem[]> {
  // Try Supabase first if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map Supabase snake_case rows to BlogPostItem
        return data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          seoTitle: row.seo_title,
          metaDescription: row.meta_description,
          excerpt: row.excerpt,
          content: row.content,
          category: row.category,
          author: {
            name: row.author_name || 'KJT Engineering Team',
            role: row.author_role || 'Technology Analyst',
            bio: row.author_bio || '',
          },
          publishedAt: row.published_at || new Date().toISOString().split('T')[0],
          updatedAt: row.updated_at,
          readTime: row.read_time || '5 min read',
          coverImage: row.cover_image,
          imageAlt: row.image_alt,
          imageCaption: row.image_caption,
          tags: Array.isArray(row.tags) ? row.tags : [],
          relatedPostSlugs: row.related_post_slugs,
          status: 'published',
          isFeatured: row.is_featured,
          isTrending: row.is_trending,
          isEditorPick: row.is_editor_pick,
          isNews: row.is_news,
          originalSource: row.original_source,
          sourceUrl: row.source_url,
          eventDate: row.event_date,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local dataset', err);
    }
  }

  // Merge default articles with any local admin articles
  const localArticles = getLocalArticles();
  const allLocalIds = new Set(localArticles.map((a) => a.id));
  const allLocalSlugs = new Set(localArticles.map((a) => a.slug));

  // Custom published articles (drafts and scheduled are excluded)
  const customPublished = localArticles.filter((a) => a.status === 'published');

  // Any base article overridden or unpublished in local storage must NOT be re-published
  const baseFiltered = defaultBlogData
    .filter((a) => !allLocalIds.has(a.id) && !allLocalSlugs.has(a.slug))
    .map((a) => ({ ...a, isSample: a.isSample ?? true }));

  return [...customPublished, ...baseFiltered];
}

/**
 * Fetch all articles (including drafts & scheduled) for the Admin Dashboard
 */
export async function getAllAdminArticles(): Promise<BlogPostItem[]> {
  const localArticles = getLocalArticles();
  const localMap = new Map<string, BlogPostItem>();

  localArticles.forEach((a) => localMap.set(a.id, a));

  // Merge with base articles if not already customized
  const allArticles: BlogPostItem[] = [...localArticles];
  defaultBlogData.forEach((base) => {
    if (!localMap.has(base.id)) {
      allArticles.push({ ...base, isSample: base.isSample ?? true });
    }
  });

  return allArticles;
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<BlogPostItem | null> {
  const all = await getPublishedArticles();
  const found = all.find((a) => a.slug === slug || a.id === slug);
  if (found) return found;

  // Also check admin drafts if accessed directly
  const local = getLocalArticles();
  return local.find((a) => a.slug === slug || a.id === slug) || null;
}

/**
 * Create or update an article (supports both Supabase and LocalStorage)
 * Automatically sanitizes HTML content to guarantee no Google AI Studio,
 * inline styles, or unsafe tags are stored.
 */
export async function upsertArticle(article: BlogPostItem): Promise<{ success: boolean; error?: string }> {
  // Step 1: Clean and sanitize article content before saving
  const sanitizedContent = sanitizeArticleHtml(article.content || '', {
    articleTitle: article.title,
    promoteBoldParagraphsToHeadings: true,
    allowAnchorIds: true,
  });

  const sanitizedTitle = cleanTitle(article.title || '');
  const sanitizedSlug = generateCleanSlug(article.slug || sanitizedTitle);
  const sanitizedTags = (article.tags || []).map((t) => cleanTitle(t.replace(/^#+/, ''))).filter(Boolean);

  const cleanArticle: BlogPostItem = {
    ...article,
    title: sanitizedTitle,
    slug: sanitizedSlug || article.slug,
    content: sanitizedContent,
    tags: sanitizedTags,
  };

  // Step 2: Save to LocalStorage immediately
  try {
    const existing = getLocalArticles();
    const index = existing.findIndex((a) => a.id === cleanArticle.id || a.slug === cleanArticle.slug);
    
    let updated: BlogPostItem[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = { ...cleanArticle, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      updated = [
        {
          ...cleanArticle,
          publishedAt: cleanArticle.publishedAt || new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        },
        ...existing,
      ];
    }
    saveLocalArticles(updated);
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save article locally' };
  }

  // Step 3: Also save only the cleaned version to Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const dbPayload = {
        id: cleanArticle.id,
        slug: cleanArticle.slug,
        title: cleanArticle.title,
        seo_title: cleanArticle.seoTitle || cleanArticle.title,
        meta_description: cleanArticle.metaDescription || cleanArticle.excerpt,
        excerpt: cleanArticle.excerpt,
        content: cleanArticle.content,
        category: cleanArticle.category,
        author_name: cleanArticle.author.name,
        author_role: cleanArticle.author.role,
        author_avatar: cleanArticle.author.avatar,
        author_bio: cleanArticle.author.bio,
        published_at: cleanArticle.publishedAt,
        updated_at: new Date().toISOString(),
        read_time: cleanArticle.readTime,
        cover_image: cleanArticle.coverImage,
        image_alt: cleanArticle.imageAlt,
        image_caption: cleanArticle.imageCaption,
        tags: cleanArticle.tags,
        related_post_slugs: cleanArticle.relatedPostSlugs,
        status: cleanArticle.status || 'published',
        is_featured: !!cleanArticle.isFeatured,
        is_trending: !!cleanArticle.isTrending,
        is_editor_pick: !!cleanArticle.isEditorPick,
        is_news: !!cleanArticle.isNews,
        original_source: cleanArticle.originalSource,
        source_url: cleanArticle.sourceUrl,
        event_date: cleanArticle.eventDate,
      };

      const { error } = await supabase.from('articles').upsert(dbPayload);
      if (error) {
        console.warn('Supabase upsert returned error (saved to local storage):', error.message);
      }
    } catch (e: any) {
      console.warn('Supabase connection error, saved locally instead', e);
    }
  }

  return { success: true };
}

/**
 * Delete an article
 */
export async function deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = getLocalArticles();
    const filtered = existing.filter((a) => a.id !== id);
    saveLocalArticles(filtered);

    // If deleting a default article, add a tombstone in localStorage
    const tombstoneKey = 'kjt_deleted_default_articles';
    const rawTombstones = localStorage.getItem(tombstoneKey);
    const tombstones: string[] = rawTombstones ? JSON.parse(rawTombstones) : [];
    if (!tombstones.includes(id)) {
      tombstones.push(id);
      localStorage.setItem(tombstoneKey, JSON.stringify(tombstones));
    }

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('articles').delete().eq('id', id);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete article' };
  }
}

/**
 * Duplicate an article as a new draft
 */
export async function duplicateArticle(id: string): Promise<{ success: boolean; newArticle?: BlogPostItem; error?: string }> {
  const all = await getAllAdminArticles();
  const target = all.find((a) => a.id === id);
  if (!target) {
    return { success: false, error: 'Article not found for duplication.' };
  }

  const timestamp = Date.now();
  const cleanBaseTitle = target.title.replace(/\s*\(Copy\s*\d*\)/i, '').trim();
  const duplicatedTitle = `${cleanBaseTitle} (Copy)`;
  const duplicatedSlug = `${target.slug}-copy-${Math.random().toString(36).substring(2, 6)}`;

  const clone: BlogPostItem = {
    ...target,
    id: `art-${timestamp}`,
    slug: duplicatedSlug,
    title: duplicatedTitle,
    seoTitle: `${duplicatedTitle} | KJT TECHNOLOGIES`,
    status: 'draft',
    publishedAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    isFeatured: false,
    isTrending: false,
  };

  const res = await upsertArticle(clone);
  if (res.success) {
    return { success: true, newArticle: clone };
  }
  return { success: false, error: res.error };
}

/* =====================================================================
 * MEDIA LIBRARY SERVICE
 * ===================================================================== */

const MEDIA_STORAGE_KEY = 'kjt_media_library_v1';

const DEFAULT_MEDIA_FILES = [
  {
    id: 'media-1',
    name: 'cybersecurity-operations.jpg',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    altText: 'Security operations center engineers monitoring live data streams',
    caption: 'KJT cybersecurity operations monitoring real-time enterprise telemetry',
    sizeBytes: 842000,
    mimeType: 'image/jpeg',
    createdAt: '2026-09-01',
  },
  {
    id: 'media-2',
    name: 'ai-small-business.jpg',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    altText: 'Digital neural mesh visualization representing artificial intelligence workflows',
    caption: 'Modern AI and machine learning automation pipelines',
    sizeBytes: 624000,
    mimeType: 'image/jpeg',
    createdAt: '2026-09-02',
  },
  {
    id: 'media-3',
    name: 'cloud-server-rack.jpg',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    altText: 'Global cloud infrastructure node with high speed fiber optics',
    caption: 'High-availability data center and hybrid cloud infrastructure',
    sizeBytes: 915000,
    mimeType: 'image/jpeg',
    createdAt: '2026-09-03',
  },
  {
    id: 'media-4',
    name: 'cctv-surveillance.jpg',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
    altText: 'High-definition industrial IP surveillance camera mounted outdoors',
    caption: 'Enterprise optical surveillance and access perimeter defense',
    sizeBytes: 520000,
    mimeType: 'image/jpeg',
    createdAt: '2026-09-04',
  },
  {
    id: 'media-5',
    name: 'software-code-dev.jpg',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    altText: 'Clean software code displayed on a high resolution development monitor',
    caption: 'Full-stack enterprise application engineering',
    sizeBytes: 710000,
    mimeType: 'image/jpeg',
    createdAt: '2026-09-05',
  },
];

export async function getMediaFiles(): Promise<Array<{
  id: string;
  name: string;
  url: string;
  altText: string;
  caption?: string;
  sizeBytes?: number;
  mimeType?: string;
  createdAt: string;
}>> {
  if (typeof window === 'undefined') return DEFAULT_MEDIA_FILES;

  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    const customMedia = raw ? JSON.parse(raw) : [];

    // Try Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          url: row.url,
          altText: row.alt_text || row.name,
          caption: row.caption || '',
          sizeBytes: row.size_bytes,
          mimeType: row.mime_type,
          createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        }));
      }
    }

    // Merge custom with default assets
    const merged = [...customMedia, ...DEFAULT_MEDIA_FILES];
    const seen = new Set<string>();
    return merged.filter((item) => {
      if (seen.has(item.id) || seen.has(item.url)) return false;
      seen.add(item.id);
      seen.add(item.url);
      return true;
    });
  } catch (e) {
    console.error('Error fetching media files:', e);
    return DEFAULT_MEDIA_FILES;
  }
}

export async function saveMediaFile(media: {
  id: string;
  name: string;
  url: string;
  altText: string;
  caption?: string;
  sizeBytes?: number;
  mimeType?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const itemToSave = {
      ...media,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [itemToSave, ...existing.filter((m: any) => m.id !== media.id)];
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('media_files').upsert({
        id: media.id,
        name: media.name,
        url: media.url,
        alt_text: media.altText,
        caption: media.caption || '',
        size_bytes: media.sizeBytes,
        mime_type: media.mimeType,
        created_at: new Date().toISOString(),
      });
    }

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to save media item' };
  }
}

export async function deleteMediaFile(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    const updated = existing.filter((m: any) => m.id !== id);
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('media_files').delete().eq('id', id);
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to delete media item' };
  }
}

/**
 * Batch clean all articles formatting (administrator action)
 * Fulfills Requirement 6: "Clean All Existing Articles"
 * - Strips Google AI Studio, Docs, Word formatting & citation components
 * - Preserves article text, visible headings, paragraphs
 * - Does not alter titles, images, categories, or publication dates
 * - Reports which articles were successfully cleaned and any failures
 */
export async function batchCleanAllArticles(): Promise<{
  totalCount: number;
  cleanedCount: number;
  failedCount: number;
  results: Array<{ id: string; title: string; success: boolean; changesMade: boolean; error?: string }>;
}> {
  const allArticles = await getAllAdminArticles();
  const results: Array<{ id: string; title: string; success: boolean; changesMade: boolean; error?: string }> = [];
  let cleanedCount = 0;
  let failedCount = 0;

  for (const article of allArticles) {
    try {
      const cleanResult = cleanArticleObject(article);
      const saveRes = await upsertArticle(cleanResult.cleaned);
      if (saveRes.success) {
        cleanedCount++;
        results.push({
          id: article.id,
          title: article.title,
          success: true,
          changesMade: cleanResult.changed,
        });
      } else {
        failedCount++;
        results.push({
          id: article.id,
          title: article.title,
          success: false,
          changesMade: false,
          error: saveRes.error,
        });
      }
    } catch (err: any) {
      failedCount++;
      results.push({
        id: article.id,
        title: article.title,
        success: false,
        changesMade: false,
        error: err?.message || 'Error cleaning article',
      });
    }
  }

  return {
    totalCount: allArticles.length,
    cleanedCount,
    failedCount,
    results,
  };
}

