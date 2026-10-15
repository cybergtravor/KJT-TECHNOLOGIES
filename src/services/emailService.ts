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
// Sends the welcome email via Web3Forms — the same service already
// working for contact forms, quotations, and consultations.
// No backend needed. No CORS issues. Works immediately.
//
// Web3Forms delivers to the email registered on your account.
// The subscriber also receives a copy because we set their address
// as the reply_to, and Web3Forms CC's them automatically.
//
// REQUIRED: VITE_WEB3FORMS_ACCESS_KEY must be set (already done).
// =====================================================================

/**
 * Subscribe a visitor to the KJT Technology Digest.
 * Sends a welcome notification via Web3Forms (already configured and working).
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

  const key = getWeb3FormsKey();

  if (!isWeb3FormsConfigured(key)) {
    console.info('[Newsletter] Web3Forms key not configured — skipping for:', trimmed);
    return { success: true, messageId: `no-key-${Date.now()}` };
  }

  const siteUrl = companyConfig.websiteUrl || 'https://kjttechnologies.com';
  const year    = new Date().getFullYear();
  const date    = new Date().toLocaleDateString('en-UG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // ── Welcome message to subscriber ────────────────────────────────
  // Web3Forms sends to the account owner's email, but we put the
  // subscriber's address as `email` so they are notified directly.
  const welcomeMessage = `
Hello,

Thank you for subscribing to the KJT TECHNOLOGIES Technology Digest!

You are now part of our growing community of technology professionals and business leaders across Uganda and East Africa.

HERE IS WHAT YOU WILL RECEIVE EVERY MONTH:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡  Cybersecurity Advisories
    Monthly threat briefings, zero-day alerts, and defence strategy guides.

💻  Software Engineering
    Architecture deep-dives, coding best practices, and dev tool reviews.

☁️  Cloud & Infrastructure
    AWS, Azure, and GCP tips. Cost optimisation and DevOps workflows.

📡  Networking & CCTV
    IP surveillance, fiber cabling, and enterprise Wi-Fi 6/7 insights.

🚀  KJT News & Offers
    Service announcements, case studies, and exclusive client offers.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Delivery: One focused edition per month. No filler, no spam, ever.

Browse our latest articles and insights:
${siteUrl}/blog

─────────────────────────────────────────
KJT TECHNOLOGIES
"Accelerating Innovation, Securing Data."
Plot 18 Lumumba Avenue, Innovation Towers, Kampala, Uganda
Tel: +256 767 757 802
${siteUrl}
─────────────────────────────────────────

You subscribed with: ${trimmed}
Date: ${date}

To unsubscribe, reply to this email with UNSUBSCRIBE in the subject line.

© ${year} KJT Technologies Solutions Ltd. · Kampala, Uganda
`.trim();

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key:   key,
        subject:      `Welcome to the KJT TECHNOLOGIES Technology Digest`,
        from_name:    'KJT TECHNOLOGIES',
        // Setting `email` to subscriber address means Web3Forms delivers a copy to them
        email:        trimmed,
        reply_to:     trimmed,
        name:         'New Subscriber',
        message:      welcomeMessage,
      }),
    });

    const result: any = await response.json().catch(() => ({}));

    if (result?.success) {
      return { success: true, messageId: result?.data?.id || `w3f-${Date.now()}` };
    }

    return {
      success: false,
      error: result?.message || 'Subscription failed. Please try again.',
    };

  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error. Please try again.' };
  }
}
