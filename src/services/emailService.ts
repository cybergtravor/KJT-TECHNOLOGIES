/**
 * =====================================================================
 * EMAIL NOTIFICATION SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 *
 * Central email and webhook dispatch layer supporting flexible providers:
 *  1. Web3Forms — contact form, quotation, consultation notifications (client-safe public key)
 *  2. /api/newsletter-subscribe — Vercel serverless function holding the private BREVO_API_KEY
 *
 * SECURITY:
 *  - BREVO_API_KEY is a PRIVATE key and must NEVER be prefixed with VITE_.
 *    It lives only in Vercel project environment variables (server-side).
 *  - All Brevo calls go through api/newsletter-subscribe.js on the server.
 *  - Web3Forms uses a public access key (safe for the browser).
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
// SECURITY: The Brevo API key is a PRIVATE secret held server-side.
// The browser POSTs to /api/newsletter-subscribe (a Vercel serverless function).
// The serverless function reads process.env.BREVO_API_KEY and calls Brevo.
// The key is NEVER bundled into client JavaScript.
//
// REQUIRED ENV VARS (Vercel → Project → Settings → Environment Variables):
//   BREVO_API_KEY=xkeysib-your-actual-key       ← server-side, NO VITE_ prefix
//   VITE_WEB3FORMS_ACCESS_KEY=88d3b270-...      ← client-side, already set
// =====================================================================

/**
 * Subscribe a visitor to the KJT Technology Digest.
 *
 * Step 1 — Calls /api/newsletter-subscribe (Vercel serverless).
 *           The server sends a branded HTML welcome email via Brevo.
 * Step 2 — Notifies your admin inbox via Web3Forms (non-blocking).
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

  // ── Step 1: Serverless welcome email ──────────────────────────────
  try {
    const res = await fetch('/api/newsletter-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: trimmed }),
    });

    // Parse response regardless of status so we can surface the exact error
    const data: any = await res.json().catch(() => ({ error: `HTTP ${res.status} — empty response` }));

    if (!res.ok) {
      const message = data?.error || data?.message || `Server responded with HTTP ${res.status}`;
      return { success: false, error: message };
    }
  } catch (err: any) {
    return { success: false, error: `Could not reach /api/newsletter-subscribe: ${err?.message || 'network error'}` };
  }

  // ── Step 2: Non-blocking admin notification ────────────────────────
  const key = getWeb3FormsKey();
  if (isWeb3FormsConfigured(key)) {
    const currentDate = new Date().toLocaleDateString('en-UG', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `[KJT Digest] New Subscriber: ${trimmed}`,
        from_name: 'KJT Newsletter Engine',
        name: 'Newsletter System',
        email: trimmed,
        message: `New subscriber.\n\nEmail : ${trimmed}\nDate  : ${currentDate}\nSource: ${companyConfig.websiteUrl || 'https://kjttechnologies.com'}`,
      }),
    }).catch(() => {}); // intentionally non-blocking
  }

  return { success: true, messageId: `newsletter-${Date.now()}` };
}
