/**
 * =====================================================================
 * QUOTATION SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Handles submission, retrieval, status updates, and private file attachments
 * for the Multi-Step Smart Quotation Request system.
 * 
 * Features:
 * - Supabase Cloud Database integration (table: quotation_requests)
 * - Private Supabase Storage bucket ('quotation-files')
 * - Resilient LocalStorage fallback for zero-downtime demonstration & preview
 * - Reference number generation: KJT-Q-XXXX
 * - Web3Forms email notification relay
 * =====================================================================
 */

import { QuotationRequest, QuotationStatus, QuotationUploadedFile } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { companyConfig } from '../config/company';

const LOCAL_STORAGE_KEY = 'kjt_quotation_requests_v1';

/**
 * Read quotations stored locally
 */
export function getLocalQuotations(): QuotationRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading quotations from localStorage:', e);
    return [];
  }
}

/**
 * Save quotations list to localStorage
 */
export function saveLocalQuotations(list: QuotationRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving quotations to localStorage:', e);
  }
}

/**
 * Generate a sequential or unique reference number: KJT-Q-0001, KJT-Q-0002...
 */
export function generateQuotationReference(existingCount: number = 0): string {
  const sequence = (existingCount + 1).toString().padStart(4, '0');
  return `KJT-Q-${sequence}`;
}

/**
 * Upload an attached file to Supabase private storage bucket 'quotation-files'
 * If Supabase is not configured, converts file to a secure local object/data URL
 */
export async function uploadQuotationFile(
  file: File,
  quotationRef: string
): Promise<QuotationUploadedFile> {
  const fileExt = file.name.split('.').pop() || 'dat';
  const cleanBaseName = file.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filePath = `${quotationRef}/${Date.now()}_${cleanBaseName}.${fileExt}`;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('quotation-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Supabase storage upload error, using local fallback:', error.message);
      } else if (data?.path) {
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          path: data.path,
        };
      }
    } catch (err) {
      console.warn('Storage upload network exception:', err);
    }
  }

  // Fallback when storage is offline or in local preview: read as data URL or keep metadata
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        url: reader.result as string,
        path: filePath,
      });
    };
    reader.onerror = () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
      });
    };
    // If file is under 5MB in demo mode, store preview url
    if (file.size <= 5 * 1024 * 1024) {
      reader.readAsDataURL(file);
    } else {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath,
      });
    }
  });
}

/**
 * Create a secure signed URL for an administrator to view/download an uploaded file
 */
export async function getQuotationFileDownloadUrl(file: QuotationUploadedFile): Promise<string> {
  if (file.url) {
    return file.url;
  }
  if (file.path && isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('quotation-files')
        .createSignedUrl(file.path, 3600); // 1 hour signed URL
      if (!error && data?.signedUrl) {
        return data.signedUrl;
      }
    } catch (e) {
      console.warn('Error creating signed download URL:', e);
    }
  }
  return '#';
}

/**
 * Submit a new quotation request
 */
export async function submitQuotationRequest(
  payload: Omit<QuotationRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>
): Promise<{ success: boolean; quotation: QuotationRequest; error?: string }> {
  const localList = getLocalQuotations();
  const id = `quote-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const referenceNumber = generateQuotationReference(localList.length);
  const now = new Date().toISOString();

  const newQuotation: QuotationRequest = {
    ...payload,
    id,
    referenceNumber,
    createdAt: now,
    status: 'New',
  };

  // 1. Save to Supabase if configured
  let supabaseSuccess = false;
  if (isSupabaseConfigured() && supabase) {
    try {
      const dbRow = {
        id: newQuotation.id,
        reference_number: newQuotation.referenceNumber,
        full_name: newQuotation.fullName,
        company: newQuotation.company,
        email: newQuotation.email,
        phone: newQuotation.phone,
        whatsapp: newQuotation.whatsapp,
        location: newQuotation.location,
        preferred_contact_method: newQuotation.preferredContactMethod,
        services: newQuotation.services,
        other_service_description: newQuotation.otherServiceDescription || null,
        project_title: newQuotation.projectTitle,
        description: newQuotation.description,
        main_goals: newQuotation.mainGoals,
        target_users: newQuotation.targetUsers,
        required_features: newQuotation.requiredFeatures,
        existing_url: newQuotation.existingUrl || null,
        preferred_technology: newQuotation.preferredTechnology || null,
        project_type: newQuotation.projectType,
        files: newQuotation.files,
        currency: newQuotation.currency,
        budget_range: newQuotation.budgetRange,
        timeline: newQuotation.timeline,
        preferred_start_date: newQuotation.preferredStartDate || null,
        deadline: newQuotation.deadline || null,
        is_deadline_flexible: newQuotation.isDeadlineFlexible,
        additional_comments: newQuotation.additionalComments || null,
        privacy_consent: newQuotation.privacyConsent,
        accuracy_confirmed: newQuotation.accuracyConfirmed,
        status: newQuotation.status,
        created_at: newQuotation.createdAt,
      };

      const { error } = await supabase.from('quotation_requests').insert([dbRow]);
      if (error) {
        console.warn('Supabase quotation insert notice:', error.message);
      } else {
        supabaseSuccess = true;
      }
    } catch (err: any) {
      console.warn('Supabase quotation connection error:', err?.message || err);
    }
  }

  // 2. Always persist to localStorage for instant client & admin access
  saveLocalQuotations([newQuotation, ...localList]);

  // 3. Trigger email notification via Web3Forms if key exists
  const accessKey =
    ((import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string) ||
    companyConfig.contactFormKey;

  const isKeyConfigured =
    accessKey &&
    !accessKey.includes('YOUR_WEB3FORMS') &&
    accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';

  if (isKeyConfigured) {
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New Quotation Request [${newQuotation.referenceNumber}] - ${newQuotation.fullName} (${newQuotation.company || 'Individual'})`,
          from_name: 'KJT Quotation Engine',
          reference_number: newQuotation.referenceNumber,
          client_name: newQuotation.fullName,
          client_email: newQuotation.email,
          client_phone: newQuotation.phone,
          client_whatsapp: newQuotation.whatsapp,
          location: newQuotation.location,
          preferred_contact: newQuotation.preferredContactMethod,
          services: newQuotation.services.join(', '),
          project_title: newQuotation.projectTitle,
          project_type: newQuotation.projectType,
          budget_range: newQuotation.budgetRange,
          timeline: newQuotation.timeline,
          deadline: newQuotation.deadline || 'Not specified',
          project_description: newQuotation.description,
          main_goals: newQuotation.mainGoals,
          required_features: newQuotation.requiredFeatures,
          system_url: newQuotation.existingUrl || 'N/A',
          timestamp: newQuotation.createdAt,
        }),
      }).catch((e) => console.warn('Email gateway notice:', e));
    } catch (e) {
      // Non-blocking email dispatch
    }
  }

  return {
    success: true,
    quotation: newQuotation,
  };
}

/**
 * Fetch all quotation requests (admin access)
 */
export async function getAllQuotations(): Promise<QuotationRequest[]> {
  const localList = getLocalQuotations();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('quotation_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        // Map database columns to QuotationRequest interface
        const mapped: QuotationRequest[] = data.map((row: any) => ({
          id: row.id,
          referenceNumber: row.reference_number || row.id,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          status: row.status || 'New',
          fullName: row.full_name,
          company: row.company || '',
          email: row.email,
          phone: row.phone,
          whatsapp: row.whatsapp || '',
          location: row.location || '',
          preferredContactMethod: row.preferred_contact_method || 'email',
          services: Array.isArray(row.services) ? row.services : [],
          otherServiceDescription: row.other_service_description,
          projectTitle: row.project_title || '',
          description: row.description || '',
          mainGoals: row.main_goals || '',
          targetUsers: row.target_users || '',
          requiredFeatures: row.required_features || '',
          existingUrl: row.existing_url,
          preferredTechnology: row.preferred_technology,
          projectType: row.project_type || 'new',
          files: Array.isArray(row.files) ? row.files : [],
          currency: row.currency || 'UGX',
          budgetRange: row.budget_range || 'Not sure — I need guidance',
          timeline: row.timeline || 'Flexible',
          preferredStartDate: row.preferred_start_date,
          deadline: row.deadline,
          isDeadlineFlexible: !!row.is_deadline_flexible,
          additionalComments: row.additional_comments,
          privacyConsent: !!row.privacy_consent,
          accuracyConfirmed: !!row.accuracy_confirmed,
          adminNotes: row.admin_notes || '',
        }));

        // Merge with any local entries not yet in cloud
        const cloudIds = new Set(mapped.map((m) => m.id));
        const missingFromCloud = localList.filter((l) => !cloudIds.has(l.id));
        return [...mapped, ...missingFromCloud];
      }
    } catch (err) {
      console.warn('Supabase quotation query notice, using local records:', err);
    }
  }

  return localList;
}

/**
 * Update quotation status and admin notes
 */
export async function updateQuotation(
  id: string,
  updates: { status?: QuotationStatus; adminNotes?: string }
): Promise<boolean> {
  const localList = getLocalQuotations();
  const updatedList = localList.map((q) => {
    if (q.id === id) {
      return {
        ...q,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return q;
  });
  saveLocalQuotations(updatedList);

  if (isSupabaseConfigured() && supabase) {
    try {
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.adminNotes !== undefined) dbUpdates.admin_notes = updates.adminNotes;

      const { error } = await supabase
        .from('quotation_requests')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.warn('Supabase update notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase update error:', e);
    }
  }

  return true;
}

/**
 * Delete a quotation request (admin only)
 */
export async function deleteQuotation(id: string): Promise<boolean> {
  const localList = getLocalQuotations();
  const filtered = localList.filter((q) => q.id !== id);
  saveLocalQuotations(filtered);

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('quotation_requests').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  return true;
}
