/**
 * =====================================================================
 * SUPABASE CLIENT & AUTH CONFIGURATION - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * BACKEND SETUP:
 * // BACKEND SETUP: Add the Supabase URL through an environment variable.
 * Safely initializes the Supabase client using environment variables:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_ANON_KEY
 * 
 * SECURITY RULES:
 * // SECURITY: Never place a service-role key in frontend code.
 * The service-role key bypasses all Row Level Security (RLS) policies.
 * Only the public anon key (`VITE_SUPABASE_ANON_KEY`) may be used in this client code.
 * 
 * If credentials are not provided or remain placeholders, this module
 * provides a graceful fallback mode so that:
 * - The public website works seamlessly with local data
 * - The admin dashboard allows demo preview, local drafting, and testing
 * - Clear diagnostics and setup SQL instructions are provided
 * =====================================================================
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// BACKEND SETUP: Load client-accessible environment variables via Vite meta.env
const metaEnv = (import.meta as any).env || {};
const supabaseUrl: string = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey: string = metaEnv.VITE_SUPABASE_ANON_KEY || '';

// SECURITY: Verify the Supabase credentials are valid production/staging URLs and not placeholders
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes('replace_with') ||
    supabaseAnonKey.includes('replace_with') ||
    supabaseUrl.includes('example.com')
  ) {
    return false;
  }
  return supabaseUrl.startsWith('https://') && supabaseAnonKey.length > 20;
}

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Storage bucket name for article images
 */
export const ARTICLE_IMAGES_BUCKET = 'article-images';

// IMAGE UPLOAD: This uploads a validated image to Supabase Storage.
/**
 * Upload image to Supabase Storage with local data URL fallback
 */
export async function uploadArticleImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; error?: string }> {
  // Safe format check
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      url: '',
      error: 'Invalid file format. Please upload JPG, PNG, WebP, AVIF, or SVG.',
    };
  }

  // 5MB size limit
  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      url: '',
      error: 'File size exceeds 5MB limit. Please compress your image.',
    };
  }

  onProgress?.(25);

  // If Supabase is configured and online, upload to the storage bucket
  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      onProgress?.(50);

      const { data, error: uploadError } = await supabase.storage
        .from(ARTICLE_IMAGES_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Supabase storage upload failed:', uploadError.message);
      } else if (data) {
        onProgress?.(85);
        const { data: publicUrlData } = supabase.storage
          .from(ARTICLE_IMAGES_BUCKET)
          .getPublicUrl(filePath);

        onProgress?.(100);
        return { url: publicUrlData.publicUrl };
      }
    } catch (e: any) {
      console.warn('Supabase upload exception:', e?.message);
    }
  }

  // Fallback: Read as base64 Data URL so user can preview and test immediately
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      onProgress?.(100);
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Failed to read image file' });
    };
    reader.readAsDataURL(file);
  });
}
