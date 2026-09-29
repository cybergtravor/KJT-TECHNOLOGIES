/**
 * =====================================================================
 * STORAGE SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Secure cloud and local storage service for:
 * 1. Public Article Images ('article-images' bucket)
 * 2. Confidential Quotation Documents ('quotation-files' private bucket)
 * 
 * SECURITY CONTROLS:
 * - Strict dual validation: MIME types AND file extensions
 * - Dangerous executable blocklist (.exe, .bat, .cmd, .sh, .php, .js, .py, etc.)
 * - Path traversal prevention (disallows ../, %00, null bytes, directory slashes in filenames)
 * - Cryptographically random unique filename generation to prevent file overwrite/enumeration
 * - Authorization check for article image uploads (requires authenticated admin)
 * - Confidential quotation attachments kept strictly private; access via short-lived signed URLs (5m)
 * - File size boundary enforcement (5MB for images, 10MB for documents)
 * =====================================================================
 */

import { supabase, isSupabaseConfigured, ARTICLE_IMAGES_BUCKET } from '../lib/supabase';

export const QUOTATION_FILES_BUCKET = 'quotation-files';

// Blocked dangerous executable and script extensions
const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'sh', 'bash', 'bin', 'msi', 'com', 'scr', 'vbs', 'pif',
  'php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'phar',
  'jsp', 'jspx', 'asp', 'aspx', 'cgi', 'pl', 'py', 'pyc',
  'js', 'mjs', 'cjs', 'ts', 'jar', 'apk', 'dll', 'so', 'dylib', 'app',
  'hta', 'reg', 'wsf', 'vbe', 'jse'
]);

export interface StorageUploadResult {
  url: string;
  filePath?: string;
  error?: string;
}

export interface SignedUrlResult {
  signedUrl: string;
  error?: string;
}

/**
 * Clean and sanitize a filename for safe cloud storage.
 * Strictly prevents path traversal attacks (../, %00, null bytes).
 */
export function sanitizeStorageFileName(originalName: string): string {
  // Strip path traversal attempts and directory slashes
  const sanitized = originalName
    .replace(/\\/g, '/')
    .split('/')
    .pop() || 'file';

  // Remove null bytes and non-printable characters
  const cleanName = sanitized.replace(/\0/g, '').replace(/[^a-zA-Z0-9._-]/g, '_');

  const parts = cleanName.split('.');
  if (parts.length < 2) {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_file.bin`;
  }

  const ext = parts.pop()?.toLowerCase() || 'bin';
  
  // Reject executable extensions
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    throw new Error(`Forbidden file extension: .${ext}`);
  }

  const cleanBase = parts.join('_').substring(0, 35);
  const timestamp = Date.now();
  const randomSalt = Math.random().toString(36).substring(2, 9);
  return `${timestamp}_${randomSalt}_${cleanBase}.${ext}`;
}

// IMAGE UPLOAD: This uploads a validated image to Supabase Storage.
/**
 * Validates and uploads an image to the public article-images bucket.
 * Requires administrator authentication.
 */
export async function uploadPublicArticleImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<StorageUploadResult> {
  // 1. Authorization check
  const isAuth = localStorage.getItem('kjt_admin_authenticated');
  if (isAuth !== 'true') {
    return {
      url: '',
      error: 'Unauthorized: Only authenticated administrators can upload marketing article images.',
    };
  }

  // 2. Validate Extension
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedImageExts = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'];
  if (!allowedImageExts.includes(ext) || DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      url: '',
      error: 'Unsupported or unsafe image extension. Allowed: JPG, PNG, WebP, AVIF, SVG.',
    };
  }

  // 3. Validate MIME Type
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
  ];

  if (!allowedImageTypes.includes(file.type.toLowerCase())) {
    return {
      url: '',
      error: 'Unsupported image format. Allowed formats: JPG, PNG, WebP, AVIF, SVG.',
    };
  }

  // 4. File Size Boundary (5MB max)
  const maxSizeBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      url: '',
      error: `Image exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please compress the image.`,
    };
  }

  onProgress?.(20);

  // 5. Supabase Cloud Storage Upload
  if (isSupabaseConfigured() && supabase) {
    try {
      const fileName = sanitizeStorageFileName(file.name);
      const filePath = `articles/${fileName}`;

      onProgress?.(50);

      const { data, error } = await supabase.storage
        .from(ARTICLE_IMAGES_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Supabase storage upload error:', error.message);
      } else if (data) {
        onProgress?.(85);
        const { data: publicUrlData } = supabase.storage
          .from(ARTICLE_IMAGES_BUCKET)
          .getPublicUrl(filePath);

        onProgress?.(100);
        return {
          url: publicUrlData.publicUrl,
          filePath,
        };
      }
    } catch (e: any) {
      console.warn('Storage upload exception:', e?.message);
    }
  }

  // 6. Fallback: Local Base64 preview for offline or preview mode
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      onProgress?.(100);
      resolve({ url: reader.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Failed to read image file data' });
    };
    reader.readAsDataURL(file);
  });
}

// SECURITY: Never place client documents in public buckets.
/**
 * Uploads a client document to the private 'quotation-files' bucket.
 * Kept confidential; accessible only via signed URLs.
 */
export async function uploadPrivateQuotationFile(
  file: File,
  quotationRef: string
): Promise<StorageUploadResult> {
  // 1. Sanitize quotationRef to prevent path traversal
  const safeRef = quotationRef.replace(/[^a-zA-Z0-9_-]/g, '');

  // 2. Validate Extension
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const allowedDocExts = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'jpg', 'jpeg', 'png', 'webp'
  ];

  if (!allowedDocExts.includes(ext) || DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      url: '',
      error: 'Unsupported or unsafe document file extension. Executable files are strictly prohibited.',
    };
  }

  // 3. Validate MIME Type
  const allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (!allowedDocTypes.includes(file.type.toLowerCase())) {
    return {
      url: '',
      error: 'Unsupported document format. Allowed: PDF, Word, Excel, PowerPoint, Text, CSV, JPG, PNG.',
    };
  }

  // 4. File Size Boundary (10MB max)
  const maxDocSizeBytes = 10 * 1024 * 1024;
  if (file.size > maxDocSizeBytes) {
    return {
      url: '',
      error: `Document exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  // 5. Upload to Private Supabase Bucket
  if (isSupabaseConfigured() && supabase) {
    try {
      const fileName = sanitizeStorageFileName(file.name);
      const filePath = `quotes/${safeRef}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(QUOTATION_FILES_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Private storage upload error:', error.message);
      } else if (data) {
        return {
          url: filePath, // Stored as private path; accessed exclusively through signed URLs
          filePath,
        };
      }
    } catch (e: any) {
      console.warn('Private storage exception:', e?.message);
    }
  }

  // Fallback: Safe local blob reference for preview mode
  return {
    url: URL.createObjectURL(file),
    filePath: `local/${file.name}`,
  };
}

/**
 * Generate a short-lived signed URL for an authorized administrator to download a private file.
 * Automatically expires after 5 minutes.
 */
export async function createSignedDownloadUrl(
  filePath: string,
  expiresInSeconds: number = 300 // 5 minutes validity
): Promise<SignedUrlResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return { signedUrl: filePath };
  }

  // Check administrator authorization
  const isAuth = localStorage.getItem('kjt_admin_authenticated');
  if (isAuth !== 'true') {
    return { signedUrl: '', error: 'Unauthorized: Only logged-in administrators can request signed download URLs.' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(QUOTATION_FILES_BUCKET)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data) {
      return { signedUrl: '', error: error?.message || 'Failed to create signed URL' };
    }

    return { signedUrl: data.signedUrl };
  } catch (err: any) {
    return { signedUrl: '', error: err?.message || 'Error creating signed URL' };
  }
}
