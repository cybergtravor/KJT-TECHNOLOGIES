/**
 * =====================================================================
 * QUOTATION SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Central domain service for the 5-Step Smart Quotation Request system.
 * 
 * BACKEND SETUP:
 * // BACKEND SETUP: Supabase table 'public.quotation_requests' with Row Level Security.
 * - Anonymous visitors can INSERT new quotation requests.
 * - Authenticated administrators can SELECT, UPDATE, and DELETE quotation records.
 * 
 * SECURITY:
 * // SECURITY: Private client attachments are stored in the private 'quotation-files' bucket.
 * Download links are generated as short-lived signed URLs (5 minutes expiration).
 * =====================================================================
 */

import * as baseQuotationService from '../lib/quotationService';
import { uploadPrivateQuotationFile, createSignedDownloadUrl } from './storageService';

export const {
  getLocalQuotations,
  saveLocalQuotations,
  generateQuotationReference,
  submitQuotationRequest,
  getAllQuotations,
  updateQuotation,
  deleteQuotation,
} = baseQuotationService;

// Re-export storage helpers for quotation attachments
export { uploadPrivateQuotationFile, createSignedDownloadUrl };

export default baseQuotationService;
