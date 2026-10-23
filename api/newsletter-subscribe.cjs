'use strict';

/**
 * =============================================================
 * Vercel Serverless Function — Newsletter Welcome Email
 * POST /api/newsletter-subscribe
 * =============================================================
 *
 * Provider: Resend (https://resend.com)
 * Free tier: 3,000 emails/month
 *
 * IMPORTANT — SENDER DOMAIN RESTRICTION:
 * Resend's free/testing plan only allows sending FROM the
 * onboarding@resend.dev sandbox address. When using this
 * sandbox sender, Resend ONLY delivers to the email address
 * that is the account owner (verified on signup).
 *
 * To send welcome emails to ALL subscribers you must:
 *   1. Own a domain (e.g. kjttechnologies.com)
 *   2. Verify it in Resend → Domains → Add Domain
 *   3. Add the DNS records Resend shows you
 *   4. Change the `from` variable below to use that domain:
 *      var from = 'KJT TECHNOLOGIES <hello@kjttechnologies.com>';
 *
 * Until then, set RESEND_SENDER_EMAIL in Vercel env vars to
 * your verified account email so test sends still work.
 *
 * Required Vercel environment variables (NO VITE_ prefix):
 *   RESEND_API_KEY      — your Resend API key (re_xxxx)
 *   RESEND_SENDER_EMAIL — verified sender address once you have a domain
 *                         (optional, defaults to onboarding@resend.dev sandbox)
 * =============================================================
 */

var EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

// ---------------------------------------------------------------------------
// HTML email builder — all inline CSS, works in Gmail/Outlook/Apple Mail
// ---------------------------------------------------------------------------
function buildHtml(email, siteUrl, year) {
  var u = (siteUrl || 'https://kjttechnologies.com').replace(/\/$/, '');

  function row(accent, title, desc) {
    return '<tr><td style="padding:0 0 8px;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
      '<tr><td style="padding:14px 16px;background:#0a192f;border-radius:10px;border-left:3px solid ' + accent + ';">' +
      '<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#e2e8f0;font-family:Arial,sans-serif;">' + title + '</p>' +
      '<p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;font-family:Arial,sans-serif;">' + desc + '</p>' +
      '</td></tr></table></td></tr>';
  }

  var features =
    row('#00D4FF', 'Cybersecurity Advisories', 'Monthly threat briefings, zero-day alerts, and enterprise defence strategy guides.') +
    row('#3b82f6', 'Software Engineering',     'Architecture deep-dives, full-stack best practices, and developer tool reviews.') +
    row('#8b5cf6', 'Cloud &amp; Infrastructure', 'AWS, Azure, and GCP insights. Cost optimisation, DevOps, and Kubernetes tips.') +
    row('#10b981', 'Networking &amp; CCTV',    'IP surveillance, structured cabling, and enterprise Wi-Fi 6/7 deployment guides.') +
    row('#f59e0b', 'KJT News &amp; Offers',    'Service announcements, client case studies, and exclusive subscriber offers.');

  return '<!DOCTYPE html>' +
    '<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
    '<title>Welcome to KJT TECHNOLOGIES Technology Digest</title></head>' +
    '<body style="margin:0;padding:0;background-color:#060f1e;font-family:Arial,Helvetica,sans-serif;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#060f1e"><tr><td align="center" style="padding:32px 16px;">' +
    '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid #1a3050;">' +
    // Top bar
    '<tr><td height="4" bgcolor="#00D4FF" style="font-size:0;line-height:0;">&nbsp;</td></tr>' +
    // Header
    '<tr><td bgcolor="#0a192f" align="center" style="padding:44px 40px 36px;">' +
    '<p style="margin:0 0 16px;font-size:22px;font-weight:900;letter-spacing:6px;color:#00D4FF;text-transform:uppercase;font-family:Arial,sans-serif;">KJT <span style="font-weight:400;color:#64748b;letter-spacing:4px;">TECHNOLOGIES</span></p>' +
    '<div style="width:60px;height:2px;background-color:#00D4FF;margin:0 auto 24px;"></div>' +
    '<h1 style="margin:0 0 10px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.25;font-family:Arial,sans-serif;">Welcome to the<br/><span style="color:#00D4FF;">Technology Digest</span></h1>' +
    '<p style="margin:0;font-size:12px;color:#475569;letter-spacing:3px;text-transform:uppercase;font-weight:600;font-family:Arial,sans-serif;">Accelerating Innovation &middot; Securing Data</p>' +
    '</td></tr>' +
    // Body
    '<tr><td bgcolor="#0d1f38" style="padding:36px 40px 28px;">' +
    '<p style="margin:0 0 8px;font-size:15px;color:#94a3b8;line-height:1.4;font-family:Arial,sans-serif;">Hello,</p>' +
    '<p style="margin:0 0 24px;font-size:15px;color:#cbd5e1;line-height:1.8;font-family:Arial,sans-serif;">' +
    'Thank you for subscribing to the <strong style="color:#ffffff;">KJT TECHNOLOGIES Technology Digest</strong>. ' +
    'You are now part of a growing community of technology professionals and business leaders across <strong style="color:#00D4FF;">Uganda and East Africa</strong>.' +
    '</p>' +
    '<p style="margin:0 0 16px;font-size:11px;font-weight:800;letter-spacing:3px;color:#00D4FF;text-transform:uppercase;font-family:Arial,sans-serif;">What you\'ll receive every month</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">' + features + '</table>' +
    // Delivery note
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">' +
    '<tr><td style="padding:16px 20px;background-color:#071324;border-radius:10px;border:1px solid #1e3a5f;">' +
    '<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;font-family:Arial,sans-serif;"><strong style="color:#e2e8f0;">Delivery:</strong> One focused edition per month. No filler, no spam &mdash; ever.</p>' +
    '</td></tr></table>' +
    // CTA
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">' +
    '<tr><td align="center" style="padding:8px 0;">' +
    '<a href="' + u + '/blog" style="display:inline-block;background-color:#00D4FF;color:#0a192f;font-size:14px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:10px;font-family:Arial,sans-serif;">Browse Our Latest Articles &rarr;</a>' +
    '</td></tr></table></td></tr>' +
    // Stats
    '<tr><td bgcolor="#071324" style="padding:20px 40px;border-top:1px solid #1a3050;border-bottom:1px solid #1a3050;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
    '<td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">250+</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Projects Done</p></td>' +
    '<td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">99.4%</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Client Retention</p></td>' +
    '<td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">50K+</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Systems Secured</p></td>' +
    '<td align="center" style="padding:0 8px;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">&lt;15min</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Support SLA</p></td>' +
    '</tr></table></td></tr>' +
    // Footer
    '<tr><td bgcolor="#060f1e" align="center" style="padding:28px 40px;">' +
    '<p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#cbd5e1;letter-spacing:1px;font-family:Arial,sans-serif;">KJT TECHNOLOGIES</p>' +
    '<p style="margin:0 0 4px;font-size:11px;color:#334155;font-family:Arial,sans-serif;">Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda</p>' +
    '<p style="margin:0 0 18px;font-size:11px;color:#334155;font-family:Arial,sans-serif;"><a href="tel:+256767757802" style="color:#00D4FF;text-decoration:none;">+256 767 757 802</a> &nbsp;&middot;&nbsp; <a href="' + u + '" style="color:#00D4FF;text-decoration:none;">' + u.replace('https://', '') + '</a></p>' +
    '<div style="width:40px;height:1px;background-color:#1e3a5f;margin:0 auto 16px;"></div>' +
    '<p style="margin:0 0 6px;font-size:10px;color:#334155;line-height:1.8;font-family:Arial,sans-serif;">You are receiving this because <strong style="color:#475569;">' + email + '</strong> subscribed at <a href="' + u + '" style="color:#334155;text-decoration:none;">' + u + '</a>.<br/>To unsubscribe, reply with <strong style="color:#475569;">UNSUBSCRIBE</strong> in the subject line.</p>' +
    '<p style="margin:0;font-size:10px;color:#1a2d44;font-family:Arial,sans-serif;">&copy; ' + year + ' KJT Technologies Solutions Ltd. &middot; Kampala, Uganda</p>' +
    '</td></tr>' +
    '<tr><td height="4" bgcolor="#00D4FF" style="font-size:0;line-height:0;">&nbsp;</td></tr>' +
    '</table></td></tr></table></body></html>';
}

function buildPlainText(email, siteUrl, year) {
  var u = (siteUrl || 'https://kjttechnologies.com').replace(/\/$/, '');
  return [
    'KJT TECHNOLOGIES - Technology Digest',
    'Accelerating Innovation, Securing Data.',
    '', 'Hello,', '',
    'Thank you for subscribing to the KJT TECHNOLOGIES Technology Digest!',
    '', 'You are now part of our growing community across Uganda and East Africa.', '',
    "WHAT YOU'LL RECEIVE EVERY MONTH:", '',
    '  * Cybersecurity Advisories - monthly threat briefings and zero-day alerts',
    '  * Software Engineering - architecture deep-dives and best practices',
    '  * Cloud & Infrastructure - AWS, Azure, GCP, and DevOps tips',
    '  * Networking & CCTV - IP surveillance and enterprise Wi-Fi guides',
    '  * KJT News & Offers - case studies and exclusive subscriber offers',
    '', 'One focused edition per month. No filler, no spam.',
    '', 'Browse our latest articles: ' + u + '/blog', '',
    '------------------------------------',
    'KJT TECHNOLOGIES',
    'Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda',
    '+256 767 757 802  |  ' + u, '',
    'You subscribed with: ' + email,
    'To unsubscribe reply with UNSUBSCRIBE in the subject line.',
    'Copyright ' + year + ' KJT Technologies Solutions Ltd.',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Main handler
// Uses native fetch (available in Node 18+ — Vercel's default runtime)
// instead of the https module to avoid bundling issues with @vercel/node
// ---------------------------------------------------------------------------
module.exports = async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Parse body — Vercel auto-parses JSON for Content-Type: application/json
    var body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); }
      catch (e) { return res.status(400).json({ success: false, error: 'Invalid JSON body' }); }
    }
    if (!body || typeof body !== 'object') {
      return res.status(400).json({ success: false, error: 'Request body is required' });
    }

    var email = String(body.email || '').trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }
    if (email.length > 254) {
      return res.status(400).json({ success: false, error: 'Email address is too long' });
    }

    var resendKey = process.env.RESEND_API_KEY || '';

    if (!resendKey || resendKey.length < 10 || resendKey.indexOf('re_') !== 0) {
      // Key not configured — return success so the UI doesn't show an error
      console.warn('[newsletter] RESEND_API_KEY not set. Subscriber:', email);
      return res.status(200).json({ success: true, note: 'key-not-configured' });
    }

    var siteUrl = process.env.VITE_SITE_URL || 'https://kjttechnologies.com';
    var year    = new Date().getFullYear();

    // -----------------------------------------------------------------------
    // SENDER ADDRESS
    // -----------------------------------------------------------------------
    // Default: onboarding@resend.dev (Resend sandbox)
    //   - Only delivers to the Resend account owner's verified email address.
    //   - All other recipients are rejected by Resend.
    //
    // To send to ALL subscribers, verify a domain you own in Resend:
    //   https://resend.com/domains
    // Then set RESEND_SENDER_EMAIL in Vercel env vars, e.g.:
    //   RESEND_SENDER_EMAIL=hello@kjttechnologies.com
    // -----------------------------------------------------------------------
    var senderEmail = process.env.RESEND_SENDER_EMAIL || '';
    var from = senderEmail
      ? 'KJT TECHNOLOGIES <' + senderEmail + '>'
      : 'KJT TECHNOLOGIES <onboarding@resend.dev>';

    var payload = {
      from:    from,
      to:      [email],
      subject: 'Welcome to the KJT TECHNOLOGIES Technology Digest',
      html:    buildHtml(email, siteUrl, year),
      text:    buildPlainText(email, siteUrl, year),
      tags:    [{ name: 'category', value: 'newsletter_welcome' }],
    };

    // Use native fetch — available in Node 18+ (Vercel default runtime)
    var resendRes = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        'Authorization': 'Bearer ' + resendKey,
      },
      body: JSON.stringify(payload),
    });

    var resendData = await resendRes.json().catch(function () { return {}; });

    if (resendRes.ok) {
      console.log('[newsletter] Email accepted by Resend for:', email, '| id:', resendData.id);
      return res.status(200).json({ success: true, id: resendData.id });
    }

    // Log the Resend error server-side (safe — no secrets in these fields)
    var resendError = resendData.message || resendData.error || ('Resend HTTP ' + resendRes.status);
    var resendName  = resendData.name || '';
    console.error('[newsletter] Resend rejected send for:', email,
      '| status:', resendRes.status,
      '| name:', resendName,
      '| message:', resendError);

    // Provide a clear client-facing message for the specific domain restriction error
    var clientError = 'Failed to send welcome email. Please try again.';
    if (resendName === 'validation_error' || resendError.indexOf('domain') !== -1 || resendError.indexOf('verified') !== -1) {
      // Resend sandbox sender domain restriction — subscriber still saved,
      // explain that domain verification is needed
      clientError = 'Subscription saved. Welcome email could not be sent — email sending domain not yet verified.';
    }

    return res.status(502).json({ success: false, error: clientError, resendStatus: resendRes.status });

  } catch (err) {
    // Never log auth headers or secrets
    console.error('[newsletter] Unhandled exception for request:', err && err.message);
    return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
};
