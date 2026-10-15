/**
 * =====================================================================
 * VERCEL SERVERLESS FUNCTION — Newsletter Subscribe
 * POST /api/newsletter-subscribe
 * =====================================================================
 *
 * WHY THIS EXISTS:
 * The Brevo API key is a PRIVATE server-side secret. It must never be
 * placed in a VITE_ env var (which gets bundled into client JS and is
 * visible to anyone who reads the page source). This function keeps
 * the key on the server where it cannot be extracted by visitors.
 *
 * ENVIRONMENT VARIABLE REQUIRED (set in Vercel — NO VITE_ prefix):
 *   BREVO_API_KEY=xkeysib-your-actual-key
 *
 * Written as CommonJS (module.exports) so Vercel Node.js runtime
 * picks it up without any extra configuration.
 * =====================================================================
 */

'use strict';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/kjttechnologies\.com$/,
  /^https:\/\/www\.kjttechnologies\.com$/,
  /^https:\/\/.*\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some(function (re) { return re.test(origin); });
}

function buildWelcomeHtml(subscriberEmail, websiteUrl, phone, supportEmail, year) {
  return '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="UTF-8"/>\n' +
    '  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>\n' +
    '  <title>Welcome to KJT TECHNOLOGIES Technology Digest</title>\n' +
    '</head>\n' +
    '<body style="margin:0;padding:0;background:#0d1b2e;font-family:\'Segoe UI\',Arial,sans-serif;">\n' +
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d1b2e;padding:32px 16px;">\n' +
    '  <tr><td align="center">\n' +
    '  <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#0f2744;border-radius:16px;overflow:hidden;border:1px solid #1e3a5f;">\n' +

    '    <tr><td style="background:linear-gradient(135deg,#0a192f,#0c2340);padding:40px 40px 32px;text-align:center;border-bottom:1px solid #1e3a5f;">\n' +
    '      <div style="margin-bottom:14px;">\n' +
    '        <span style="font-size:13px;font-weight:900;letter-spacing:.35em;color:#00D4FF;text-transform:uppercase;">KJT</span>\n' +
    '        <span style="font-size:13px;font-weight:700;letter-spacing:.25em;color:#94a3b8;text-transform:uppercase;margin-left:6px;">TECHNOLOGIES</span>\n' +
    '      </div>\n' +
    '      <div style="width:48px;height:2px;background:#00D4FF;margin:0 auto 20px;border-radius:2px;"></div>\n' +
    '      <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;line-height:1.2;">Welcome to the<br/><span style="color:#00D4FF;">Technology Digest</span></h1>\n' +
    '      <p style="margin:12px 0 0;font-size:13px;color:#64748b;letter-spacing:.15em;text-transform:uppercase;font-weight:600;">Accelerating Innovation, Securing Data.</p>\n' +
    '    </td></tr>\n' +

    '    <tr><td style="padding:36px 40px 32px;">\n' +
    '      <p style="margin:0 0 16px;font-size:16px;color:#cbd5e1;line-height:1.7;">Hello,</p>\n' +
    '      <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.8;">Thank you for subscribing to the <strong style="color:#e2e8f0;">KJT TECHNOLOGIES Technology Digest</strong>. You are now part of a growing community of technology professionals and business leaders across <strong style="color:#e2e8f0;">Uganda and East Africa</strong>.</p>\n' +
    '      <p style="margin:0 0 14px;font-size:12px;font-weight:800;letter-spacing:.18em;color:#00D4FF;text-transform:uppercase;">What You\'ll Receive</p>\n' +
    '      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">\n' +
    '        <tr><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;">\n' +
    '          <table width="100%"><tr><td width="36" style="font-size:20px;vertical-align:top;padding-top:2px;">&#x1F6E1;&#xFE0F;</td><td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Cybersecurity Advisories</p><p style="margin:0;font-size:13px;color:#64748b;">Monthly threat briefings, zero-day alerts, and defence strategy guides.</p></td></tr></table>\n' +
    '        </td></tr>\n' +
    '        <tr><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;">\n' +
    '          <table width="100%"><tr><td width="36" style="font-size:20px;vertical-align:top;padding-top:2px;">&#x1F4BB;</td><td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Software Engineering</p><p style="margin:0;font-size:13px;color:#64748b;">Architecture deep-dives, coding best practices, and dev tool reviews.</p></td></tr></table>\n' +
    '        </td></tr>\n' +
    '        <tr><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;">\n' +
    '          <table width="100%"><tr><td width="36" style="font-size:20px;vertical-align:top;padding-top:2px;">&#x2601;&#xFE0F;</td><td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Cloud &amp; Infrastructure</p><p style="margin:0;font-size:13px;color:#64748b;">AWS, Azure, and GCP tips. Cost optimisation and DevOps workflows.</p></td></tr></table>\n' +
    '        </td></tr>\n' +
    '        <tr><td style="padding:10px 0;border-bottom:1px solid #1e3a5f;">\n' +
    '          <table width="100%"><tr><td width="36" style="font-size:20px;vertical-align:top;padding-top:2px;">&#x1F4E1;</td><td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Networking &amp; CCTV</p><p style="margin:0;font-size:13px;color:#64748b;">IP surveillance, fiber cabling, and enterprise Wi-Fi 6/7 insights.</p></td></tr></table>\n' +
    '        </td></tr>\n' +
    '        <tr><td style="padding:10px 0;">\n' +
    '          <table width="100%"><tr><td width="36" style="font-size:20px;vertical-align:top;padding-top:2px;">&#x1F680;</td><td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">KJT News &amp; Offers</p><p style="margin:0;font-size:13px;color:#64748b;">Service announcements, case studies, and exclusive client offers.</p></td></tr></table>\n' +
    '        </td></tr>\n' +
    '      </table>\n' +
    '      <div style="background:#0a192f;border:1px solid #1e3a5f;border-left:3px solid #00D4FF;border-radius:8px;padding:16px 20px;margin-bottom:28px;">\n' +
    '        <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">&#x1F4C5; <strong style="color:#e2e8f0;">Delivery:</strong> One focused edition per month. No filler, no spam, ever.</p>\n' +
    '      </div>\n' +
    '      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">\n' +
    '        <tr><td align="center">\n' +
    '          <a href="' + websiteUrl + '/blog" style="display:inline-block;background:linear-gradient(90deg,#00D4FF,#0055FF);color:#0a192f;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:8px;">Browse Our Latest Articles &#x2192;</a>\n' +
    '        </td></tr>\n' +
    '      </table>\n' +
    '    </td></tr>\n' +

    '    <tr><td style="background:#091e38;border-top:1px solid #1e3a5f;padding:24px 40px;text-align:center;">\n' +
    '      <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#cbd5e1;">KJT TECHNOLOGIES</p>\n' +
    '      <p style="margin:0 0 4px;font-size:11px;color:#475569;">Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda</p>\n' +
    '      <p style="margin:0 0 16px;font-size:11px;color:#475569;">' +
    '        <a href="tel:' + phone.replace(/\s/g, '') + '" style="color:#00D4FF;text-decoration:none;">' + phone + '</a>' +
    '        &nbsp;&middot;&nbsp;' +
    '        <a href="mailto:' + supportEmail + '" style="color:#00D4FF;text-decoration:none;">' + supportEmail + '</a>' +
    '      </p>\n' +
    '      <p style="margin:0 0 12px;font-size:10px;color:#334155;line-height:1.6;">You received this email because <strong style="color:#475569;">' + subscriberEmail + '</strong> subscribed on <a href="' + websiteUrl + '" style="color:#475569;text-decoration:none;">' + websiteUrl + '</a>.<br/>To unsubscribe, reply with <strong>UNSUBSCRIBE</strong> in the subject line.</p>\n' +
    '      <p style="margin:0;font-size:10px;color:#1e3a5f;">&copy; ' + year + ' KJT Technologies Solutions Ltd. &middot; Kampala, Uganda</p>\n' +
    '    </td></tr>\n' +

    '  </table>\n' +
    '  </td></tr>\n' +
    '</table>\n' +
    '</body>\n' +
    '</html>';
}

module.exports = async function handler(req, res) {
  var origin = req.headers['origin'] || '';

  // CORS — only allow requests from your own domain
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://kjttechnologies.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  // Handle CORS pre-flight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  // Parse body (Vercel provides parsed body automatically for JSON content-type)
  var body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ success: false, error: 'Invalid request body.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid request body.' });
  }

  var subscriberEmail = (body.email || '').trim().toLowerCase();

  // Validate email
  if (!subscriberEmail || !EMAIL_REGEX.test(subscriberEmail)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }
  if (subscriberEmail.length > 254) {
    return res.status(400).json({ success: false, error: 'Email address too long.' });
  }

  // Read the private Brevo API key from server environment — never exposed to browser
  var brevoKey = process.env.BREVO_API_KEY || '';

  if (!brevoKey || brevoKey.includes('xkeysib-REPLACE') || brevoKey.length < 20) {
    console.warn('[newsletter-subscribe] BREVO_API_KEY is not configured on this server.');
    // Return success so the subscriber UI is not broken during setup
    return res.status(200).json({ success: true, note: 'Key not configured — email skipped.' });
  }

  var websiteUrl = process.env.VITE_SITE_URL || 'https://kjttechnologies.com';
  var phone = '+256 767 757 802';
  var supportEmail = 'travortechguy@gmail.com';
  var year = new Date().getFullYear();

  var htmlContent = buildWelcomeHtml(subscriberEmail, websiteUrl, phone, supportEmail, year);
  var textContent = [
    'Welcome to the KJT TECHNOLOGIES Technology Digest!',
    '',
    'Thank you for subscribing. You will receive monthly insights on:',
    '  - Cybersecurity threat advisories',
    '  - Software engineering best practices',
    '  - Cloud infrastructure and DevOps',
    '  - Networking, CCTV, and IT infrastructure',
    '  - KJT service announcements and case studies',
    '',
    'Browse our latest articles: ' + websiteUrl + '/blog',
    '',
    '---',
    'KJT TECHNOLOGIES - Accelerating Innovation, Securing Data.',
    'Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda',
    phone + ' . ' + supportEmail,
    '',
    'To unsubscribe reply with UNSUBSCRIBE in the subject line.',
    'Copyright ' + year + ' KJT Technologies Solutions Ltd.',
  ].join('\n');

  try {
    var brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': brevoKey,
      },
      body: JSON.stringify({
        sender: { name: 'KJT TECHNOLOGIES', email: supportEmail },
        to: [{ email: subscriberEmail }],
        replyTo: { email: supportEmail, name: 'KJT TECHNOLOGIES Support' },
        subject: 'Welcome to the KJT TECHNOLOGIES Technology Digest',
        htmlContent: htmlContent,
        textContent: textContent,
        tags: ['newsletter', 'welcome'],
      }),
    });

    if (brevoRes.ok) {
      var data = await brevoRes.json();
      console.log('[newsletter-subscribe] Welcome email sent to', subscriberEmail, '— messageId:', data.messageId);
      return res.status(200).json({ success: true, messageId: data.messageId });
    }

    var errData = await brevoRes.json().catch(function () { return {}; });
    var errMsg = (errData && errData.message) ? errData.message : ('Brevo API error ' + brevoRes.status);
    console.error('[newsletter-subscribe] Brevo error for', subscriberEmail, ':', errMsg);
    return res.status(502).json({ success: false, error: 'Failed to send welcome email. Please try again.' });

  } catch (err) {
    console.error('[newsletter-subscribe] Network error:', err && err.message);
    return res.status(502).json({ success: false, error: 'Network error. Please try again.' });
  }
};
