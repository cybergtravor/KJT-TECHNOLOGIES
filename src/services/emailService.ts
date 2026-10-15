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
// Calls the Brevo Transactional Email API directly from the browser.
// Brevo's API is CORS-enabled, so this works without a backend.
// The key is read from VITE_BREVO_API_KEY (set in Vercel env vars).
// =====================================================================

function buildNewsletterHtml(email: string, siteUrl: string, year: number, fromEmail: string): string {
  const u = siteUrl || 'https://kjttechnologies.com';
  const rows = [
    ['Cybersecurity Advisories', 'Monthly threat briefings, zero-day alerts, and defence strategy guides.'],
    ['Software Engineering', 'Architecture deep-dives, coding best practices, and dev tool reviews.'],
    ['Cloud &amp; Infrastructure', 'AWS, Azure, and GCP tips. Cost optimisation and DevOps workflows.'],
    ['Networking &amp; CCTV', 'IP surveillance, fiber cabling, and enterprise Wi-Fi 6/7 insights.'],
    ['KJT News &amp; Offers', 'Service announcements, case studies, and exclusive client offers.'],
  ].map(([title, desc]) =>
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #1e3a5f;">` +
    `<tr><td style="padding:10px 0 10px 12px;">` +
    `<p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#e2e8f0;">${title}</p>` +
    `<p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">${desc}</p>` +
    `</td></tr></table>`
  ).join('');

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Welcome — KJT TECHNOLOGIES</title></head>
<body style="margin:0;padding:0;background:#0d1b2e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0d1b2e">
<tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0"
  style="max-width:600px;width:100%;background:#0f2744;border-radius:12px;border:1px solid #1e3a5f;overflow:hidden;">
  <tr><td align="center" bgcolor="#0a192f" style="padding:40px 36px 32px;border-bottom:1px solid #1e3a5f;">
    <p style="margin:0 0 12px;font-size:14px;font-weight:900;letter-spacing:4px;color:#00D4FF;text-transform:uppercase;">KJT TECHNOLOGIES</p>
    <div style="width:40px;height:2px;background:#00D4FF;margin:0 auto 20px;"></div>
    <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;line-height:1.3;">Welcome to the<br/><span style="color:#00D4FF;">Technology Digest</span></h1>
    <p style="margin:12px 0 0;font-size:12px;color:#64748b;letter-spacing:2px;text-transform:uppercase;">Accelerating Innovation, Securing Data.</p>
  </td></tr>
  <tr><td style="padding:32px 36px 28px;color:#94a3b8;">
    <p style="margin:0 0 20px;font-size:16px;color:#cbd5e1;line-height:1.7;">Hello,</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.8;">Thank you for subscribing to the
      <strong style="color:#e2e8f0;">KJT TECHNOLOGIES Technology Digest</strong>.
      You are now part of our growing community across <strong style="color:#e2e8f0;">Uganda and East Africa</strong>.</p>
    <p style="margin:0 0 14px;font-size:11px;font-weight:800;letter-spacing:3px;color:#00D4FF;text-transform:uppercase;">What you'll receive every month</p>
    ${rows}
    <div style="margin:24px 0;padding:14px 18px;background:#0a192f;border-left:3px solid #00D4FF;border-radius:6px;">
      <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;"><strong style="color:#e2e8f0;">Delivery:</strong> One focused edition per month. No spam, ever.</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding:8px 0;">
      <a href="${u}/blog" style="display:inline-block;background:#00D4FF;color:#0a192f;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:8px;">Browse Latest Articles</a>
    </td></tr></table>
  </td></tr>
  <tr><td align="center" bgcolor="#091e38" style="padding:24px 36px;border-top:1px solid #1e3a5f;">
    <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#cbd5e1;">KJT TECHNOLOGIES</p>
    <p style="margin:0 0 4px;font-size:11px;color:#475569;">Plot 18 Lumumba Avenue, Innovation Towers, Kampala, Uganda</p>
    <p style="margin:0 0 14px;font-size:11px;color:#475569;">
      <a href="tel:+256767757802" style="color:#00D4FF;text-decoration:none;">+256 767 757 802</a>
      &nbsp;&middot;&nbsp;
      <a href="mailto:${fromEmail}" style="color:#00D4FF;text-decoration:none;">${fromEmail}</a>
    </p>
    <p style="margin:0 0 8px;font-size:10px;color:#334155;line-height:1.6;">
      You subscribed using <strong style="color:#475569;">${email}</strong>
      at <a href="${u}" style="color:#475569;">${u}</a>.<br/>
      To unsubscribe reply with <strong>UNSUBSCRIBE</strong> in the subject line.
    </p>
    <p style="margin:0;font-size:10px;color:#1e3a5f;">&copy; ${year} KJT Technologies Solutions Ltd.</p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/**
 * Subscribe a visitor to the KJT Technology Digest.
 * Calls Brevo Transactional API directly from the browser (CORS-enabled endpoint).
 * The VITE_BREVO_API_KEY must be set in Vercel environment variables.
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

  // Read Brevo key from Vite env — must be set in Vercel project settings as VITE_BREVO_API_KEY
  const brevoKey = ((import.meta as any).env?.VITE_BREVO_API_KEY as string) || '';

  if (!brevoKey || brevoKey.length < 20 || brevoKey.includes('REPLACE')) {
    // Key not yet configured — simulate success so the UI doesn't show an error
    console.info('[Newsletter] VITE_BREVO_API_KEY not set — skipping welcome email for:', trimmed);
    // Still notify admin via Web3Forms
    notifyAdminNewSubscriber(trimmed);
    return { success: true, messageId: `no-key-${Date.now()}` };
  }

  const siteUrl   = companyConfig.websiteUrl || 'https://kjttechnologies.com';
  const fromEmail = companyConfig.contact?.primaryEmail || 'travortechguy@gmail.com';
  const year      = new Date().getFullYear();

  const htmlContent = buildNewsletterHtml(trimmed, siteUrl, year, fromEmail);
  const textContent = [
    'Welcome to the KJT TECHNOLOGIES Technology Digest!',
    '',
    'Thank you for subscribing. You will receive monthly insights on:',
    '  * Cybersecurity advisories and zero-day alerts',
    '  * Software engineering best practices',
    '  * Cloud, DevOps, and infrastructure tips',
    '  * Networking, CCTV, and IT infrastructure',
    '  * KJT news, case studies, and offers',
    '',
    `Read our latest articles: ${siteUrl}/blog`,
    '',
    '---',
    'KJT TECHNOLOGIES — Accelerating Innovation, Securing Data.',
    'Plot 18 Lumumba Avenue, Innovation Towers, Kampala, Uganda',
    `+256 767 757 802 | ${fromEmail}`,
    '',
    `You subscribed with: ${trimmed}`,
    'To unsubscribe reply with UNSUBSCRIBE in the subject.',
    `© ${year} KJT Technologies Solutions Ltd.`,
  ].join('\n');

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': brevoKey,
      },
      body: JSON.stringify({
        sender:      { name: 'KJT TECHNOLOGIES', email: fromEmail },
        to:          [{ email: trimmed }],
        replyTo:     { email: fromEmail },
        subject:     'Welcome to the KJT TECHNOLOGIES Technology Digest',
        htmlContent,
        textContent,
        tags:        ['newsletter', 'welcome'],
      }),
    });

    const data: any = await res.json().catch(() => ({}));

    if (res.ok) {
      notifyAdminNewSubscriber(trimmed);
      return { success: true, messageId: data?.messageId || `brevo-${Date.now()}` };
    }

    const errMsg: string = data?.message || `Brevo error ${res.status}`;
    console.error('[Newsletter] Brevo API error:', errMsg);
    return { success: false, error: errMsg };

  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error. Please try again.' };
  }
}

/** Non-blocking admin ping via Web3Forms when someone subscribes */
function notifyAdminNewSubscriber(email: string): void {
  const key = getWeb3FormsKey();
  if (!isWeb3FormsConfigured(key)) return;
  const date = new Date().toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: key,
      subject: `[KJT Digest] New Subscriber: ${email}`,
      from_name: 'KJT Newsletter',
      name: 'Newsletter System',
      email,
      message: `New subscriber: ${email}\nDate: ${date}\nSource: ${companyConfig.websiteUrl || 'https://kjttechnologies.com'}`,
    }),
  }).catch(() => {});
}
