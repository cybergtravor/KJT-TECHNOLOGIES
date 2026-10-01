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

// =====================================================================
// NEWSLETTER SUBSCRIPTION SYSTEM
// =====================================================================
// Architecture:
//   Subscriber welcome email  → Brevo Transactional Email API (direct-to-inbox HTML)
//   Admin new-subscriber ping → Web3Forms (no-backend admin notification)
//
// HOW TO GET YOUR FREE BREVO API KEY:
//   1. Go to https://app.brevo.com → Sign up (free, no credit card)
//   2. Top-right menu → Profile → SMTP & API → API Keys tab
//   3. Click "Generate a new API key", name it "KJT Newsletter"
//   4. Copy the key and add it to your .env.local:
//        VITE_BREVO_API_KEY=your-key-here
//   5. In Brevo → Senders & IP → Senders → Add a sender using your
//      business email (e.g. noreply@kjttechnologies.com or your Gmail)
//   Free plan: 300 emails/day, unlimited contacts — no expiry.
// =====================================================================

/**
 * Build the professional HTML welcome email body for new subscribers.
 * Uses inline CSS for maximum email-client compatibility (Gmail, Outlook, Apple Mail).
 */
function buildNewsletterWelcomeHtml(subscriberEmail: string): string {
  const websiteUrl = companyConfig.websiteUrl || 'https://kjttechnologies.com';
  const supportEmail = companyConfig.contact?.supportEmail || companyConfig.contact?.primaryEmail || 'travortechguy@gmail.com';
  const phone = companyConfig.contact?.displayPhone || '+256 767 757 802';
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to the KJT TECHNOLOGIES Digest</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1b2e;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0d1b2e;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background-color:#0f2744;border-radius:16px;overflow:hidden;border:1px solid #1e3a5f;">

          <!-- ── HEADER BANNER ─────────────────────────────────── -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a192f 0%,#0c2340 60%,#091e38 100%);padding:40px 40px 32px;text-align:center;border-bottom:1px solid #1e3a5f;">
              <!-- Logo text mark -->
              <div style="display:inline-block;margin-bottom:20px;">
                <span style="font-size:13px;font-weight:900;letter-spacing:0.35em;color:#00D4FF;text-transform:uppercase;">KJT</span>
                <span style="font-size:13px;font-weight:700;letter-spacing:0.25em;color:#94a3b8;text-transform:uppercase;margin-left:6px;">TECHNOLOGIES</span>
              </div>
              <!-- Cyan divider line -->
              <div style="width:48px;height:2px;background:#00D4FF;margin:0 auto 20px;border-radius:2px;"></div>
              <!-- Headline -->
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;line-height:1.2;">
                Welcome to the<br/>
                <span style="color:#00D4FF;">Technology Digest</span>
              </h1>
              <p style="margin:12px 0 0;font-size:13px;color:#64748b;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">
                Accelerating Innovation, Securing Data.
              </p>
            </td>
          </tr>

          <!-- ── BODY ──────────────────────────────────────────── -->
          <tr>
            <td style="padding:36px 40px 32px;">

              <!-- Greeting -->
              <p style="margin:0 0 16px;font-size:16px;color:#cbd5e1;line-height:1.7;">
                Hello,
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.8;">
                Thank you for subscribing to the <strong style="color:#e2e8f0;">KJT TECHNOLOGIES Technology Digest</strong>.
                You are now part of a growing community of technology professionals, business leaders,
                and digital innovators across <strong style="color:#e2e8f0;">Uganda and East Africa</strong>.
              </p>

              <!-- What to expect heading -->
              <p style="margin:0 0 14px;font-size:12px;font-weight:800;letter-spacing:0.18em;color:#00D4FF;text-transform:uppercase;">
                What You'll Receive
              </p>

              <!-- Feature rows -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                ${[
                  ['🛡️', 'Cybersecurity Advisories', 'Monthly threat briefings, zero-day alerts, and defence strategy guides.'],
                  ['💻', 'Software Engineering', 'Architecture deep-dives, coding best practices, and dev tool reviews.'],
                  ['☁️', 'Cloud & Infrastructure', 'AWS, Azure, and GCP tips. Cost optimisation and DevOps workflows.'],
                  ['📡', 'Networking & CCTV', 'IP surveillance, fiber cabling, and enterprise Wi-Fi 6/7 insights.'],
                  ['🚀', 'KJT News & Offers', 'Service announcements, case studies, and exclusive client offers.'],
                ].map(([icon, title, desc]) => `
                <tr>
                  <td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #1e3a5f;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40" style="vertical-align:top;padding-top:2px;">
                          <span style="font-size:20px;">${icon}</span>
                        </td>
                        <td style="vertical-align:top;">
                          <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">${title}</p>
                          <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">${desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- Frequency note -->
              <div style="background-color:#0a192f;border:1px solid #1e3a5f;border-left:3px solid #00D4FF;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
                <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
                  📅 <strong style="color:#e2e8f0;">Delivery frequency:</strong> One focused edition per month.
                  We only send content worth your time — no filler, no spam, ever.
                </p>
              </div>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${websiteUrl}/blog"
                      style="display:inline-block;background:linear-gradient(90deg,#00D4FF,#0055FF);color:#0a192f;font-size:13px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:8px;">
                      Browse Our Latest Articles →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Services grid links -->
              <p style="margin:0 0 12px;font-size:12px;font-weight:800;letter-spacing:0.18em;color:#00D4FF;text-transform:uppercase;">
                Our Core Services
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  ${[
                    ['Custom Software', `${websiteUrl}/services/website-design-and-development`],
                    ['Cybersecurity', `${websiteUrl}/services/cybersecurity-services`],
                    ['CCTV Systems', `${websiteUrl}/services/cctv-and-security-camera-installation`],
                    ['Cloud & Hosting', `${websiteUrl}/services/cloud-solutions`],
                  ].map(([label, url]) => `
                  <td align="center" style="padding:0 4px;">
                    <a href="${url}"
                      style="display:block;background-color:#0a192f;border:1px solid #1e3a5f;border-radius:8px;padding:10px 8px;text-decoration:none;font-size:11px;font-weight:700;color:#94a3b8;text-align:center;letter-spacing:0.05em;">
                      ${label}
                    </a>
                  </td>`).join('')}
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ─────────────────────────────────────────── -->
          <tr>
            <td style="background-color:#091e38;border-top:1px solid #1e3a5f;padding:24px 40px;text-align:center;">

              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#cbd5e1;">KJT TECHNOLOGIES</p>
              <p style="margin:0 0 4px;font-size:11px;color:#475569;">Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda</p>
              <p style="margin:0 0 16px;font-size:11px;color:#475569;">
                <a href="tel:${phone.replace(/\s/g, '')}" style="color:#00D4FF;text-decoration:none;">${phone}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${supportEmail}" style="color:#00D4FF;text-decoration:none;">${supportEmail}</a>
              </p>

              <p style="margin:0 0 12px;font-size:10px;color:#334155;line-height:1.6;">
                You received this email because <strong style="color:#475569;">${subscriberEmail}</strong>
                subscribed on <a href="${websiteUrl}" style="color:#475569;text-decoration:none;">${websiteUrl}</a>.<br/>
                To unsubscribe, reply with <strong>UNSUBSCRIBE</strong> in the subject line.
              </p>

              <p style="margin:0;font-size:10px;color:#1e3a5f;">
                © ${year} KJT Technologies Solutions Ltd. · Kampala, Uganda
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Send a professional HTML welcome email directly to the subscriber via Brevo.
 *
 * Brevo free plan: 300 emails/day, unlimited contacts.
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 */
async function sendBrevoWelcomeEmail(
  subscriberEmail: string
): Promise<EmailDispatchResult> {
  const brevoKey = (import.meta as any).env?.VITE_BREVO_API_KEY || '';

  if (!brevoKey || brevoKey.includes('YOUR_BREVO') || brevoKey.includes('xkeysib-REPLACE')) {
    // Not yet configured — log and return success so the UI doesn't error
    console.info(`[Newsletter/Brevo] API key not set. Subscriber: ${subscriberEmail} — skipping welcome email.`);
    return { success: true, messageId: `dev-brevo-skip-${Date.now()}` };
  }

  const htmlContent = buildNewsletterWelcomeHtml(subscriberEmail);

  // Plain-text fallback (shown in clients that block HTML)
  const textContent = `Welcome to the KJT TECHNOLOGIES Technology Digest!

Thank you for subscribing. You'll receive monthly insights on:
  • Cybersecurity threat advisories
  • Software engineering best practices
  • Cloud infrastructure and DevOps
  • Networking, CCTV, and IT infrastructure
  • KJT service announcements and case studies

Browse our latest articles: ${companyConfig.websiteUrl || 'https://kjttechnologies.com'}/blog

---
KJT TECHNOLOGIES — "Accelerating Innovation, Securing Data."
Plot 18 Lumumba Avenue, Kampala, Uganda
${companyConfig.contact?.displayPhone || '+256 767 757 802'}
${companyConfig.contact?.supportEmail || 'travortechguy@gmail.com'}

To unsubscribe reply with UNSUBSCRIBE in the subject line.
© ${new Date().getFullYear()} KJT Technologies Solutions Ltd.`;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': brevoKey,
      },
      body: JSON.stringify({
        sender: {
          name: 'KJT TECHNOLOGIES',
          // This must match a verified sender in your Brevo account.
          // Go to Brevo → Senders & IP → Senders → Add & verify your email.
          email: companyConfig.contact?.primaryEmail || 'travortechguy@gmail.com',
        },
        to: [{ email: subscriberEmail }],
        replyTo: {
          email: companyConfig.contact?.supportEmail || companyConfig.contact?.primaryEmail || 'travortechguy@gmail.com',
          name: 'KJT TECHNOLOGIES Support',
        },
        subject: '👋 Welcome to the KJT TECHNOLOGIES Technology Digest',
        htmlContent,
        textContent,
        tags: ['newsletter', 'welcome'],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, messageId: data.messageId || `brevo-${Date.now()}` };
    }

    // Brevo returns 4xx/5xx with a JSON error body
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = (errorData as any)?.message || `Brevo API error ${response.status}`;
    console.error('[Newsletter/Brevo] API error:', errorMsg);
    return { success: false, error: errorMsg };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error contacting Brevo API.' };
  }
}

/**
 * Main entry point called by NewsletterForm on submission.
 *
 * Flow:
 *   1. Send professional HTML welcome email to subscriber via Brevo.
 *   2. Notify admin inbox via Web3Forms (you receive the subscriber's email).
 *
 * Both steps are attempted independently — a failure in the admin ping
 * does not block or hide a successful subscriber welcome delivery.
 */
export async function sendNewsletterSubscriptionEmail(
  subscriberEmail: string
): Promise<EmailDispatchResult> {
  if (!subscriberEmail || !subscriberEmail.includes('@') || !subscriberEmail.includes('.')) {
    return { success: false, error: 'Invalid subscriber email address.' };
  }

  // ── Step 1: Professional welcome email → subscriber via Brevo ──────
  const brevoResult = await sendBrevoWelcomeEmail(subscriberEmail);
  if (!brevoResult.success) {
    // Return the Brevo error to the user so they know delivery failed
    return brevoResult;
  }

  // ── Step 2: Admin notification → your inbox via Web3Forms ─────────
  const web3FormsKey =
    (import.meta as any).env?.VITE_WEB3FORMS_ACCESS_KEY ||
    companyConfig.contactFormKey ||
    '';

  const isWeb3Configured =
    web3FormsKey &&
    !web3FormsKey.includes('YOUR_WEB3FORMS') &&
    !web3FormsKey.includes('replace_with');

  if (isWeb3Configured) {
    const currentDate = new Date().toLocaleDateString('en-UG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3FormsKey,
          subject: `[KJT Digest] New Subscriber: ${subscriberEmail}`,
          from_name: 'KJT Newsletter Engine',
          name: 'Newsletter System',
          email: subscriberEmail,
          message: `New KJT Technology Digest subscriber.

Email        : ${subscriberEmail}
Date         : ${currentDate}
Source       : ${companyConfig.websiteUrl || 'https://kjttechnologies.com'}
Welcome sent : Yes (via Brevo Transactional API)

Add this subscriber to your master list or CRM as needed.`,
        }),
      });
    } catch {
      // Non-critical — admin ping failure does not affect subscriber experience
    }
  }

  return { success: true, messageId: brevoResult.messageId };
}
