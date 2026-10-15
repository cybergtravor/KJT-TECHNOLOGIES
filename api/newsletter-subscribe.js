/**
 * =====================================================================
 * VERCEL SERVERLESS FUNCTION — Newsletter Subscribe
 * POST /api/newsletter-subscribe
 * =====================================================================
 * Uses Node's built-in `https` module — zero external dependencies,
 * works on every Node.js version Vercel supports (14, 16, 18, 20).
 * =====================================================================
 */

'use strict';

var https = require('https');

var EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

// ── HTML email builder ────────────────────────────────────────────────
function buildHtml(email, siteUrl, phone, replyEmail, year) {
  var u = siteUrl || 'https://kjttechnologies.com';
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>',
    '<title>Welcome to KJT TECHNOLOGIES Technology Digest</title></head>',
    '<body style="margin:0;padding:0;background:#0d1b2e;font-family:Arial,sans-serif;">',
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d1b2e;padding:32px 16px;">',
    '<tr><td align="center">',
    '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#0f2744;border-radius:12px;overflow:hidden;border:1px solid #1e3a5f;">',

    // Header
    '<tr><td style="background:#0a192f;padding:40px 36px 32px;text-align:center;border-bottom:1px solid #1e3a5f;">',
    '<p style="margin:0 0 16px;font-size:13px;font-weight:900;letter-spacing:.3em;color:#00D4FF;text-transform:uppercase;">KJT <span style="font-weight:600;color:#94a3b8;">TECHNOLOGIES</span></p>',
    '<div style="width:40px;height:2px;background:#00D4FF;margin:0 auto 20px;"></div>',
    '<h1 style="margin:0;font-size:24px;font-weight:800;color:#ffffff;line-height:1.3;">Welcome to the<br/><span style="color:#00D4FF;">Technology Digest</span></h1>',
    '<p style="margin:10px 0 0;font-size:12px;color:#64748b;letter-spacing:.15em;text-transform:uppercase;">Accelerating Innovation, Securing Data.</p>',
    '</td></tr>',

    // Body
    '<tr><td style="padding:32px 36px 28px;">',
    '<p style="margin:0 0 20px;font-size:16px;color:#cbd5e1;line-height:1.7;">Hello,</p>',
    '<p style="margin:0 0 24px;font-size:14px;color:#94a3b8;line-height:1.8;">Thank you for subscribing to the <strong style="color:#e2e8f0;">KJT TECHNOLOGIES Technology Digest</strong>. You are now part of our growing community of technology professionals and business leaders across <strong style="color:#e2e8f0;">Uganda and East Africa</strong>.</p>',

    '<p style="margin:0 0 12px;font-size:11px;font-weight:800;letter-spacing:.2em;color:#00D4FF;text-transform:uppercase;">What You\'ll Receive</p>',
    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">',

    '<tr><td style="padding:10px 0 10px 12px;border-bottom:1px solid #1e3a5f;font-size:14px;color:#94a3b8;line-height:1.6;">',
    '<strong style="color:#e2e8f0;display:block;margin-bottom:2px;">Cybersecurity Advisories</strong>',
    'Monthly threat briefings, zero-day alerts, and defence strategy guides.</td></tr>',

    '<tr><td style="padding:10px 0 10px 12px;border-bottom:1px solid #1e3a5f;font-size:14px;color:#94a3b8;line-height:1.6;">',
    '<strong style="color:#e2e8f0;display:block;margin-bottom:2px;">Software Engineering</strong>',
    'Architecture deep-dives, coding best practices, and dev tool reviews.</td></tr>',

    '<tr><td style="padding:10px 0 10px 12px;border-bottom:1px solid #1e3a5f;font-size:14px;color:#94a3b8;line-height:1.6;">',
    '<strong style="color:#e2e8f0;display:block;margin-bottom:2px;">Cloud &amp; Infrastructure</strong>',
    'AWS, Azure, and GCP tips. Cost optimisation and DevOps workflows.</td></tr>',

    '<tr><td style="padding:10px 0 10px 12px;border-bottom:1px solid #1e3a5f;font-size:14px;color:#94a3b8;line-height:1.6;">',
    '<strong style="color:#e2e8f0;display:block;margin-bottom:2px;">Networking &amp; CCTV</strong>',
    'IP surveillance, fiber cabling, and enterprise Wi-Fi 6/7 insights.</td></tr>',

    '<tr><td style="padding:10px 0 10px 12px;font-size:14px;color:#94a3b8;line-height:1.6;">',
    '<strong style="color:#e2e8f0;display:block;margin-bottom:2px;">KJT News &amp; Offers</strong>',
    'Service announcements, case studies, and exclusive client offers.</td></tr>',

    '</table>',

    '<div style="background:#0a192f;border-left:3px solid #00D4FF;border-radius:6px;padding:14px 18px;margin-bottom:28px;">',
    '<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;"><strong style="color:#e2e8f0;">Delivery:</strong> One focused edition per month. No filler, no spam, ever.</p>',
    '</div>',

    '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">',
    '<tr><td align="center">',
    '<a href="' + u + '/blog" style="display:inline-block;background:#00D4FF;color:#0a192f;font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:8px;">Browse Our Latest Articles</a>',
    '</td></tr>',
    '</table>',
    '</td></tr>',

    // Footer
    '<tr><td style="background:#091e38;border-top:1px solid #1e3a5f;padding:22px 36px;text-align:center;">',
    '<p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#cbd5e1;">KJT TECHNOLOGIES</p>',
    '<p style="margin:0 0 4px;font-size:11px;color:#475569;">Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda</p>',
    '<p style="margin:0 0 14px;font-size:11px;color:#475569;"><a href="tel:' + phone.replace(/\s/g, '') + '" style="color:#00D4FF;text-decoration:none;">' + phone + '</a> &nbsp;&middot;&nbsp; <a href="mailto:' + replyEmail + '" style="color:#00D4FF;text-decoration:none;">' + replyEmail + '</a></p>',
    '<p style="margin:0 0 10px;font-size:10px;color:#334155;line-height:1.6;">You received this because <strong style="color:#475569;">' + email + '</strong> subscribed at <a href="' + u + '" style="color:#475569;">' + u + '</a>.<br/>To unsubscribe reply with UNSUBSCRIBE in the subject line.</p>',
    '<p style="margin:0;font-size:10px;color:#1e3a5f;">&copy; ' + year + ' KJT Technologies Solutions Ltd. &middot; Kampala, Uganda</p>',
    '</td></tr>',

    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
    '</html>',
  ].join('\n');
}

// ── Promise wrapper around https.request ─────────────────────────────
function httpsPost(hostname, path, headers, body) {
  return new Promise(function (resolve, reject) {
    var bodyStr = JSON.stringify(body);
    var options = {
      hostname: hostname,
      path: path,
      method: 'POST',
      headers: Object.assign({}, headers, {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
      }),
    };

    var req = https.request(options, function (res) {
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        var raw = Buffer.concat(chunks).toString('utf8');
        var json = null;
        try { json = JSON.parse(raw); } catch (e) { json = { raw: raw }; }
        resolve({ status: res.statusCode, body: json });
      });
    });

    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

// ── Main handler ──────────────────────────────────────────────────────
module.exports = async function handler(req, res) {

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  // Parse body
  var body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ success: false, error: 'Invalid JSON body.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, error: 'Request body required.' });
  }

  var subscriberEmail = String(body.email || '').trim().toLowerCase();

  if (!subscriberEmail || !EMAIL_REGEX.test(subscriberEmail)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }

  var brevoKey = process.env.BREVO_API_KEY || '';

  // If key not configured, still return 200 so the subscribe button shows success
  if (!brevoKey || brevoKey.length < 30 || brevoKey.includes('REPLACE')) {
    console.warn('[newsletter] BREVO_API_KEY not configured — skipping send.');
    return res.status(200).json({ success: true, note: 'key-not-configured' });
  }

  var siteUrl = process.env.VITE_SITE_URL || 'https://kjttechnologies.com';
  var phone   = '+256 767 757 802';
  var replyTo = 'travortechguy@gmail.com';
  var year    = new Date().getFullYear();

  var html = buildHtml(subscriberEmail, siteUrl, phone, replyTo, year);
  var text = [
    'Welcome to the KJT TECHNOLOGIES Technology Digest!',
    '',
    'Thank you for subscribing. You will receive monthly insights on cybersecurity,',
    'software engineering, cloud infrastructure, networking, CCTV, and IT.',
    '',
    'Browse our latest articles: ' + siteUrl + '/blog',
    '',
    '---',
    'KJT TECHNOLOGIES — Accelerating Innovation, Securing Data.',
    'Plot 18 Lumumba Avenue, Kampala, Uganda',
    phone + ' | ' + replyTo,
    '',
    'To unsubscribe reply UNSUBSCRIBE.',
    'Copyright ' + year + ' KJT Technologies Solutions Ltd.',
  ].join('\n');

  try {
    var result = await httpsPost(
      'api.brevo.com',
      '/v3/smtp/email',
      { 'api-key': brevoKey },
      {
        sender:      { name: 'KJT TECHNOLOGIES', email: replyTo },
        to:          [{ email: subscriberEmail }],
        replyTo:     { email: replyTo, name: 'KJT TECHNOLOGIES' },
        subject:     'Welcome to the KJT TECHNOLOGIES Technology Digest',
        htmlContent: html,
        textContent: text,
        tags:        ['newsletter', 'welcome'],
      }
    );

    if (result.status >= 200 && result.status < 300) {
      console.log('[newsletter] Sent to', subscriberEmail, '— messageId:', result.body && result.body.messageId);
      return res.status(200).json({ success: true, messageId: result.body && result.body.messageId });
    }

    var errMsg = (result.body && result.body.message) || ('Brevo HTTP ' + result.status);
    console.error('[newsletter] Brevo error:', errMsg, '— body:', JSON.stringify(result.body));
    return res.status(502).json({ success: false, error: errMsg });

  } catch (err) {
    console.error('[newsletter] https error:', err && err.message);
    return res.status(500).json({ success: false, error: 'Internal server error. Please try again.' });
  }
};
