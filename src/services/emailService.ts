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
// Sends the welcome email via Web3Forms using an HTML message body.
// REQUIRED: VITE_WEB3FORMS_ACCESS_KEY must be set (already done).
// =====================================================================

/** Build the professional HTML welcome email (inline CSS for all email clients) */
function buildNewsletterWelcomeEmail(
  subscriberEmail: string,
  siteUrl: string,
  year: number
): string {
  const u = siteUrl.replace(/\/$/, '');

  const featureRow = (
    icon: string,
    accent: string,
    title: string,
    desc: string
  ) =>
    `<tr>
      <td style="padding:14px 16px;background:#0a192f;border-radius:10px;border-left:3px solid ${accent};">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="40" style="vertical-align:top;padding-top:1px;font-size:21px;">${icon}</td>
          <td style="vertical-align:top;padding-left:4px;">
            <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#e2e8f0;">${title}</p>
            <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">${desc}</p>
          </td>
        </tr></table>
      </td>
    </tr>
    <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Welcome to KJT TECHNOLOGIES Technology Digest</title>
</head>
<body style="margin:0;padding:0;background:#060f1e;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#060f1e;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0"
  style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid #1a3050;">

  <!-- Top accent bar -->
  <tr>
    <td style="height:4px;background:linear-gradient(90deg,#00D4FF 0%,#0055FF 50%,#00D4FF 100%);font-size:0;line-height:0;">&nbsp;</td>
  </tr>

  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(160deg,#0a192f 0%,#0c2340 60%,#071e38 100%);padding:44px 40px 36px;text-align:center;">
      <div style="font-size:0;line-height:0;margin-bottom:20px;">
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#00D4FF;margin:0 3px;opacity:.3;"></span>
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#00D4FF;margin:0 3px;opacity:.6;"></span>
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#00D4FF;margin:0 3px;"></span>
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#00D4FF;margin:0 3px;opacity:.6;"></span>
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#00D4FF;margin:0 3px;opacity:.3;"></span>
      </div>
      <div style="margin-bottom:20px;">
        <span style="font-size:22px;font-weight:900;letter-spacing:6px;color:#00D4FF;text-transform:uppercase;">KJT</span>
        <span style="font-size:22px;font-weight:400;letter-spacing:4px;color:#64748b;text-transform:uppercase;"> TECHNOLOGIES</span>
      </div>
      <div style="width:60px;height:2px;margin:0 auto 24px;background:linear-gradient(90deg,transparent,#00D4FF,transparent);"></div>
      <h1 style="margin:0 0 10px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.25;letter-spacing:-0.5px;">
        Welcome to the<br/><span style="color:#00D4FF;">Technology Digest</span>
      </h1>
      <p style="margin:0;font-size:12px;color:#475569;letter-spacing:3px;text-transform:uppercase;font-weight:600;">
        Accelerating Innovation &nbsp;&middot;&nbsp; Securing Data
      </p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="background:#0d1f38;padding:36px 40px 28px;">
      <p style="margin:0 0 8px;font-size:15px;color:#94a3b8;line-height:1.4;">Hello,</p>
      <p style="margin:0 0 24px;font-size:15px;color:#cbd5e1;line-height:1.8;">
        Thank you for subscribing to the
        <strong style="color:#ffffff;">KJT TECHNOLOGIES Technology Digest</strong>.
        You are now part of a growing community of technology professionals and
        business leaders across <strong style="color:#00D4FF;">Uganda and East Africa</strong>.
      </p>

      <p style="margin:0 0 16px;font-size:11px;font-weight:800;letter-spacing:3px;color:#00D4FF;text-transform:uppercase;">
        What you'll receive every month
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        ${featureRow('&#x1F6E1;&#xFE0F;', '#00D4FF', 'Cybersecurity Advisories',
          'Monthly threat briefings, zero-day alerts, and enterprise defence strategy guides.')}
        ${featureRow('&#x1F4BB;', '#3b82f6', 'Software Engineering',
          'Architecture deep-dives, full-stack best practices, and developer tool reviews.')}
        ${featureRow('&#x2601;&#xFE0F;', '#8b5cf6', 'Cloud &amp; Infrastructure',
          'AWS, Azure, and GCP insights. Cost optimisation, DevOps, and Kubernetes tips.')}
        ${featureRow('&#x1F4E1;', '#10b981', 'Networking &amp; CCTV',
          'IP surveillance, structured cabling, and enterprise Wi-Fi 6/7 deployment guides.')}
        ${featureRow('&#x1F680;', '#f59e0b', 'KJT News &amp; Offers',
          'Service announcements, client case studies, and exclusive subscriber offers.')}
      </table>

      <!-- Delivery note -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding:16px 20px;background:#071324;border-radius:10px;border:1px solid #1e3a5f;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="24" style="vertical-align:top;font-size:16px;">&#x1F4C5;</td>
              <td style="vertical-align:top;padding-left:8px;">
                <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
                  <strong style="color:#e2e8f0;">Delivery:</strong>
                  One focused edition per month. No filler, no spam &mdash; ever.
                </p>
              </td>
            </tr></table>
          </td>
        </tr>
      </table>

      <!-- CTA button -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
        <tr>
          <td align="center">
            <a href="${u}/blog"
              style="display:inline-block;background:linear-gradient(90deg,#00D4FF,#0055FF);
              color:#ffffff;font-size:14px;font-weight:800;letter-spacing:2px;
              text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:10px;">
              Browse Our Latest Articles &rarr;
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Stats strip -->
  <tr>
    <td style="background:#071324;border-top:1px solid #1a3050;border-bottom:1px solid #1a3050;padding:20px 40px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;">
            <p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;">250+</p>
            <p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;">Projects Done</p>
          </td>
          <td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;">
            <p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;">99.4%</p>
            <p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;">Client Retention</p>
          </td>
          <td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;">
            <p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;">50K+</p>
            <p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;">Systems Secured</p>
          </td>
          <td align="center" style="padding:0 8px;">
            <p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;">&lt;15min</p>
            <p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;">Support SLA</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#060f1e;padding:28px 40px;text-align:center;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#cbd5e1;letter-spacing:1px;">KJT TECHNOLOGIES</p>
      <p style="margin:0 0 4px;font-size:11px;color:#334155;">Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda</p>
      <p style="margin:0 0 18px;font-size:11px;color:#334155;">
        <a href="tel:+256767757802" style="color:#00D4FF;text-decoration:none;">+256 767 757 802</a>
        &nbsp;&middot;&nbsp;
        <a href="${u}" style="color:#00D4FF;text-decoration:none;">${u.replace('https://', '')}</a>
      </p>
      <div style="width:40px;height:1px;background:#1e3a5f;margin:0 auto 16px;"></div>
      <p style="margin:0 0 6px;font-size:10px;color:#1e3a5f;line-height:1.8;">
        You're receiving this because <strong style="color:#334155;">${subscriberEmail}</strong>
        subscribed at <a href="${u}" style="color:#334155;text-decoration:none;">${u}</a>.<br/>
        To unsubscribe, reply with <strong style="color:#475569;">UNSUBSCRIBE</strong> in the subject line.
      </p>
      <p style="margin:0;font-size:10px;color:#1a2d44;">&copy; ${year} KJT Technologies Solutions Ltd. &middot; Kampala, Uganda</p>
    </td>
  </tr>

  <!-- Bottom accent bar -->
  <tr>
    <td style="height:4px;background:linear-gradient(90deg,#00D4FF 0%,#0055FF 50%,#00D4FF 100%);font-size:0;line-height:0;">&nbsp;</td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * Subscribe a visitor to the KJT Technology Digest.
 * Sends a professional HTML welcome email via Web3Forms.
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

  const htmlEmail = buildNewsletterWelcomeEmail(trimmed, siteUrl, year);

  // Plain-text fallback for email clients that block HTML
  const plainText = [
    'Welcome to the KJT TECHNOLOGIES Technology Digest!',
    '',
    'Thank you for subscribing. Here is what you will receive every month:',
    '',
    '  * Cybersecurity Advisories — threat briefings and zero-day alerts',
    '  * Software Engineering — architecture guides and best practices',
    '  * Cloud & Infrastructure — AWS, Azure, GCP, and DevOps tips',
    '  * Networking & CCTV — IP surveillance and enterprise Wi-Fi guides',
    '  * KJT News & Offers — case studies and exclusive subscriber offers',
    '',
    `Browse our latest articles: ${siteUrl}/blog`,
    '',
    '---',
    'KJT TECHNOLOGIES — Accelerating Innovation, Securing Data.',
    'Plot 18 Lumumba Avenue, Innovation Towers, Kampala, Uganda',
    `+256 767 757 802  |  ${siteUrl}`,
    '',
    `You subscribed with: ${trimmed}`,
    'To unsubscribe, reply with UNSUBSCRIBE in the subject line.',
    `© ${year} KJT Technologies Solutions Ltd.`,
  ].join('\n');

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject:    'Welcome to the KJT TECHNOLOGIES Technology Digest',
        from_name:  'KJT TECHNOLOGIES',
        email:      trimmed,
        reply_to:   trimmed,
        name:       'New Subscriber',
        // html_message renders the HTML version in supporting clients
        html_message: htmlEmail,
        // message is the plain-text fallback
        message:    plainText,
      }),
    });

    const result: any = await response.json().catch(() => ({}));

    if (result?.success) {
      return { success: true, messageId: result?.data?.id || `w3f-${Date.now()}` };
    }
    return { success: false, error: result?.message || 'Subscription failed. Please try again.' };

  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error. Please try again.' };
  }
}
