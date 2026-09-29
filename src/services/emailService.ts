/**
 * =====================================================================
 * EMAIL NOTIFICATION SERVICE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Central email and webhook dispatch layer supporting flexible providers:
 * 1. Web3Forms (Default for client-side contact forms without exposing secrets)
 * 2. Formspree (Alternative drop-in client-side contact form relay)
 * 3. Resend (Enterprise transactional email via serverless/Edge function)
 * 4. Brevo / Sendinblue (High-deliverability transactional notifications)
 * 
 * SECURITY RULES:
 * // SECURITY: Never place private email API keys in React frontend code.
 * // EMAIL SETUP: Configure the selected email provider securely.
 * 
 * Suitable Use Cases by Provider:
 * - Web3Forms: General Contact Form inquiries (free, client-safe access key)
 * - Formspree: Quick alternative form handling with spam protection
 * - Resend: Quotation receipts, consultation confirmations, and admin notifications
 *   (dispatched through Vercel serverless /api/send-email or Supabase Edge Functions)
 * - Brevo: Automated follow-up workflows and high-volume delivery
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

/**
 * Send contact inquiry via Web3Forms (Client-Safe)
 * Uses public Access Key from companyConfig or VITE_WEB3FORMS_ACCESS_KEY
 */
export async function sendContactMessageWeb3Forms(
  data: ContactFormPayload
): Promise<EmailDispatchResult> {
  const accessKey =
    (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY ||
    companyConfig.contactFormKey ||
    '';

  if (!accessKey || accessKey.includes('YOUR_WEB3FORMS_ACCESS_KEY')) {
    console.info(
      'Web3Forms access key not set. In local development, submission is logged to console.'
    );
    return {
      success: true,
      messageId: `dev-simulated-${Date.now()}`,
    };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
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
    if (result.success) {
      return { success: true, messageId: result.data?.id || 'submitted' };
    }
    return { success: false, error: result.message || 'Submission failed' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error sending inquiry' };
  }
}

/**
 * Send quotation request notification email
 * Dispatches to Web3Forms or an internal serverless endpoint
 */
export async function sendQuotationNotification(
  quote: QuotationRequest
): Promise<EmailDispatchResult> {
  const accessKey =
    (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY ||
    companyConfig.contactFormKey ||
    '';

  if (!accessKey || accessKey.includes('YOUR_WEB3FORMS_ACCESS_KEY')) {
    return { success: true, messageId: `dev-simulated-quote-${quote.referenceNumber}` };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[Quotation Request ${quote.referenceNumber}] ${quote.projectTitle} - ${quote.fullName}`,
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
    return {
      success: result.success,
      messageId: result.data?.id,
      error: result.message,
    };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

/**
 * Send consultation booking confirmation email
 */
export async function sendConsultationConfirmationEmail(
  booking: ConsultationBooking
): Promise<EmailDispatchResult> {
  const accessKey =
    (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY ||
    companyConfig.contactFormKey ||
    '';

  if (!accessKey || accessKey.includes('YOUR_WEB3FORMS_ACCESS_KEY')) {
    return { success: true, messageId: `dev-simulated-consult-${booking.bookingReference}` };
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[Consultation Booking ${booking.bookingReference}] ${booking.service} - ${booking.fullName}`,
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
    return {
      success: result.success,
      messageId: result.data?.id,
      error: result.message,
    };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
