/**
 * =====================================================================
 * ARTICLE SERVICE - KJT TECHNOLOGIES CMS
 * =====================================================================
 * 
 * Central domain service for reading, drafting, sanitizing, publishing,
 * and deleting Technology News & Insights articles.
 * 
 * ARTICLE STORAGE:
 * // ARTICLE STORAGE: This function saves sanitized article content.
 * All incoming article HTML and titles are processed through `contentSanitizer`
 * to eliminate malicious scripts, invalid markup, or unwanted AI artifacts.
 * 
 * BACKEND ARCHITECTURE:
 * // BACKEND SETUP: Supabase PostgreSQL table 'public.articles' with Row Level Security.
 * - Anonymous visitors can SELECT articles where status = 'published'.
 * - Authenticated administrators can SELECT, INSERT, UPDATE, and DELETE all records.
 * =====================================================================
 */

import { BlogPostItem } from '../types';
import * as baseArticleService from '../lib/articlesService';
import { uploadPublicArticleImage } from './storageService';

export const {
  getLocalArticles,
  saveLocalArticles,
  getPublishedArticles,
  getAllAdminArticles,
  getArticleBySlug,
  upsertArticle,
  deleteArticle,
  duplicateArticle,
} = baseArticleService;

// Friendly alias
export const getAllArticlesAdmin = baseArticleService.getAllAdminArticles;
export const saveArticle = baseArticleService.upsertArticle;

/**
 * Upload an article featured or body image through the unified storage service
 */
export async function uploadArticleCoverImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; error?: string }> {
  return uploadPublicArticleImage(file, onProgress);
}

export default baseArticleService;
