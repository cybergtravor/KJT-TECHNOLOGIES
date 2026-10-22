/**
 * =====================================================================
 * EMAIL NOTIFICATION SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 *
 * Dispatch layer for all outbound email across the website:
 *
 *  1. Web3Forms  — contact form, quotation requests, consultation
 *                  booking confirmations. Uses a public access key
 *                  (safe for the browser bundle).
 *
 *  2. Resend     — newsletter welcome email. API key is private and
 *                  lives server-side in api/newsletter-subscribe.cjs.
 *                  The browser POSTs to /api/newsletter-subscribe and
 *                  the Vercel serverless function makes the Resend call.
 *
 * Environment variables required:
 *   VITE_WEB3FORMS_ACCESS_KEY  — client-side, already configured
 *   RESEND_API_KEY             — server-side, set in Vercel env vars
 * =====================================================================
 */

import { companyConfig } from '../config/company';
import { QuotationRequest, ConsultationBooking } from '../types';

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  serviceInterest?: string;
}

// Strict email regex — reused across all email functions
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/** Resolve the Web3Forms access key from env or config */
function getWeb3FormsKey(): string {
  return (
    ((import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY as string) ||
    companyConfig.contactFormKey ||
    ''
  );
}

/** Returns true if the Web3Forms key looks real (not a placeholder) */
function isWeb3FormsConfigured(key: string): boolean {
  return (
    !!key &&
    !key.includes('YOUR_WEB3FORMS') &&
    !key.includes('replace_with') &&
    key !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE'
  );
}

// =====================================================================
// 1. CONTACT FORM
// =====================================================================

/**
 * Send contact inquiry via Web3Forms (client-safe public key).
 */
export async function sendContactMessageWeb3Forms(
  data: ContactFormPayload
): Promise<EmailDispatchResult> {
  const key = getWeb3FormsKey();
  if (!isWeb3FormsConfigured(key)) {
    console.info('[ContactForm] Web3Forms key not configured — simulating success.');
    return { success: true, messageId: `dev-simulated-${Date.now()}` };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `New Inquiry from ${data.name}: ${data.subject || 'Website Contact'}`,
        from_name: `${companyConfig.name} Website Portal`,
        name: data.name,
        email: data.email,
        phone: data.phone || 'Not provided',
        service_interest: data.serviceInterest || 'General',
        message: data.message,
      }),
    });
    const result = await response.json();
    if (result.success) return { success: true, messageId: result.data?.id || 'submitted' };
    return { success: false, error: result.message || 'Submission failed' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error sending inquiry' };
  }
}

// =====================================================================
// 2. QUOTATION NOTIFICATION
// =====================================================================

export async function sendQuotationNotification(
  quote: QuotationRequest
): Promise<EmailDispatchResult> {
  const key = getWeb3FormsKey();
  if (!isWeb3FormsConfigured(key)) {
    return { success: true, messageId: `dev-simulated-quote-${quote.referenceNumber}` };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `[Quotation ${quote.referenceNumber}] ${quote.projectTitle} — ${quote.fullName}`,
        from_name: 'KJT Quotation Engine',
        reply_to: quote.email,
        reference_number: quote.referenceNumber,
        client_name: quote.fullName,
        company: quote.company || 'Individual',
        email: quote.email,
        phone: quote.phone,
        whatsapp: quote.whatsapp || 'N/A',
        services: quote.services.join(', '),
        budget_range: `${quote.currency} ${quote.budgetRange}`,
        timeline: quote.timeline,
        project_description: quote.description,
        attached_files_count: quote.files.length,
      }),
    });
    const result = await response.json();
    return { success: result.success, messageId: result.data?.id, error: result.message };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// =====================================================================
// 3. CONSULTATION BOOKING CONFIRMATION
// =====================================================================

export async function sendConsultationConfirmationEmail(
  booking: ConsultationBooking
): Promise<EmailDispatchResult> {
  const key = getWeb3FormsKey();
  if (!isWeb3FormsConfigured(key)) {
    return { success: true, messageId: `dev-simulated-consult-${booking.bookingReference}` };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `[Booking ${booking.bookingReference}] ${booking.service} — ${booking.fullName}`,
        from_name: 'KJT Booking Desk',
        reply_to: booking.email,
        reference: booking.bookingReference,
        client_name: booking.fullName,
        organization: booking.organization || 'Individual',
        email: booking.email,
        phone: booking.phone,
        service: booking.service,
        topic: booking.topic,
        date: booking.date,
        time: `${booking.startTime} - ${booking.endTime} (${booking.timeZone})`,
        meeting_method: booking.meetingMethod,
        notes: booking.additionalNotes || 'None',
      }),
    });
    const result = await response.json();
    return { success: result.success, messageId: result.data?.id, error: result.message };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

// =====================================================================
// 4. NEWSLETTER SUBSCRIPTION
// =====================================================================
// POSTs to /api/newsletter-subscribe — a Vercel serverless function
// (api/newsletter-subscribe.cjs) that sends a branded HTML welcome
// email via the Resend transactional email API.
//
// The RESEND_API_KEY is kept server-side (no VITE_ prefix) and is
// never bundled into the browser JavaScript.
//
// To enable: add RESEND_API_KEY=re_xxxx in Vercel project settings.
// Get a free key at https://resend.com (3,000 emails/month).
// =====================================================================

/**
 * Subscribe a visitor to the KJT Technology Digest.
 * POSTs to /api/newsletter-subscribe which sends the HTML email via Resend.
 */
export async function sendNewsletterSubscriptionEmail(
  subscriberEmail: string
): Promise<EmailDispatchResult> {
  const trimmed = subscriberEmail.trim().toLowerCase();

  if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (trimmed.length > 254) {
    return { success: false, error: 'Email address is too long.' };
  }

  try {
    const res = await fetch('/api/newsletter-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed }),
    });

    const data: any = await res.json().catch(() => ({}));

    if (res.ok) {
      return { success: true, messageId: data?.id || data?.messageId || `ok-${Date.now()}` };
    }

    return {
      success: false,
      error: data?.error || data?.message || `Server error ${res.status}`,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error. Please try again.' };
  }
}
