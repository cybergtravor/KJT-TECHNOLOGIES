'use strict';

/**
 * =====================================================================
 * Vercel Serverless Function — Newsletter Welcome Email
 * POST /api/newsletter-subscribe
 * =====================================================================
 * Uses Resend (https://resend.com) to send a professional HTML email
 * directly to the subscriber's inbox.
 *
 * Resend free tier: 3,000 emails/month, no credit card required.
 *
 * ENVIRONMENT VARIABLE required in Vercel (no VITE_ prefix):
 *   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
 * =====================================================================
 */

var https = require('https');

var EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

// ── HTML email builder ────────────────────────────────────────────────
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

  return '<!DOCTYPE html>' +
  '<html lang="en"><head>' +
  '<meta charset="UTF-8"/>' +
  '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
  '<title>Welcome to KJT TECHNOLOGIES Technology Digest</title>' +
  '</head>' +
  '<body style="margin:0;padding:0;background-color:#060f1e;font-family:Arial,Helvetica,sans-serif;">' +

  '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#060f1e">' +
  '<tr><td align="center" style="padding:32px 16px;">' +
  '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;border:1px solid #1a3050;">' +

  // Top cyan bar
  '<tr><td height="4" bgcolor="#00D4FF" style="font-size:0;line-height:0;">&nbsp;</td></tr>' +

  // Header
  '<tr><td bgcolor="#0a192f" align="center" style="padding:44px 40px 36px;background-color:#0a192f;">' +
  '<p style="margin:0 0 16px;font-size:22px;font-weight:900;letter-spacing:6px;color:#00D4FF;text-transform:uppercase;font-family:Arial,sans-serif;">KJT <span style="font-weight:400;color:#64748b;letter-spacing:4px;">TECHNOLOGIES</span></p>' +
  '<div style="width:60px;height:2px;background-color:#00D4FF;margin:0 auto 24px;"></div>' +
  '<h1 style="margin:0 0 10px;font-size:28px;font-weight:800;color:#ffffff;line-height:1.25;font-family:Arial,sans-serif;">Welcome to the<br/><span style="color:#00D4FF;">Technology Digest</span></h1>' +
  '<p style="margin:0;font-size:12px;color:#475569;letter-spacing:3px;text-transform:uppercase;font-weight:600;font-family:Arial,sans-serif;">Accelerating Innovation &middot; Securing Data</p>' +
  '</td></tr>' +

  // Body
  '<tr><td bgcolor="#0d1f38" style="padding:36px 40px 28px;background-color:#0d1f38;">' +

  '<p style="margin:0 0 8px;font-size:15px;color:#94a3b8;line-height:1.4;font-family:Arial,sans-serif;">Hello,</p>' +
  '<p style="margin:0 0 24px;font-size:15px;color:#cbd5e1;line-height:1.8;font-family:Arial,sans-serif;">' +
  'Thank you for subscribing to the <strong style="color:#ffffff;">KJT TECHNOLOGIES Technology Digest</strong>. ' +
  'You are now part of a growing community of technology professionals and business leaders across ' +
  '<strong style="color:#00D4FF;">Uganda and East Africa</strong>.' +
  '</p>' +

  '<p style="margin:0 0 16px;font-size:11px;font-weight:800;letter-spacing:3px;color:#00D4FF;text-transform:uppercase;font-family:Arial,sans-serif;">What you\'ll receive every month</p>' +

  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">' +
  row('#00D4FF', 'Cybersecurity Advisories', 'Monthly threat briefings, zero-day alerts, and enterprise defence strategy guides.') +
  row('#3b82f6', 'Software Engineering', 'Architecture deep-dives, full-stack best practices, and developer tool reviews.') +
  row('#8b5cf6', 'Cloud &amp; Infrastructure', 'AWS, Azure, and GCP insights. Cost optimisation, DevOps, and Kubernetes tips.') +
  row('#10b981', 'Networking &amp; CCTV', 'IP surveillance, structured cabling, and enterprise Wi-Fi 6/7 deployment guides.') +
  row('#f59e0b', 'KJT News &amp; Offers', 'Service announcements, client case studies, and exclusive subscriber offers.') +
  '</table>' +

  // Delivery note
  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">' +
  '<tr><td style="padding:16px 20px;background-color:#071324;border-radius:10px;border:1px solid #1e3a5f;">' +
  '<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;font-family:Arial,sans-serif;">' +
  '<strong style="color:#e2e8f0;">Delivery:</strong> One focused edition per month. No filler, no spam &mdash; ever.' +
  '</p></td></tr></table>' +

  // CTA
  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">' +
  '<tr><td align="center" style="padding:8px 0;">' +
  '<a href="' + u + '/blog" style="display:inline-block;background-color:#00D4FF;color:#0a192f;font-size:14px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-decoration:none;padding:16px 40px;border-radius:10px;font-family:Arial,sans-serif;">Browse Our Latest Articles &rarr;</a>' +
  '</td></tr></table>' +

  '</td></tr>' +

  // Stats strip
  '<tr><td bgcolor="#071324" style="padding:20px 40px;background-color:#071324;border-top:1px solid #1a3050;border-bottom:1px solid #1a3050;">' +
  '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
  '<td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">250+</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Projects Done</p></td>' +
  '<td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">99.4%</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Client Retention</p></td>' +
  '<td align="center" style="padding:0 8px;border-right:1px solid #1e3a5f;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">50K+</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Systems Secured</p></td>' +
  '<td align="center" style="padding:0 8px;"><p style="margin:0;font-size:19px;font-weight:900;color:#00D4FF;font-family:Arial,sans-serif;">&lt;15min</p><p style="margin:4px 0 0;font-size:9px;color:#475569;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">Support SLA</p></td>' +
  '</tr></table>' +
  '</td></tr>' +

  // Footer
  '<tr><td bgcolor="#060f1e" align="center" style="padding:28px 40px;background-color:#060f1e;">' +
  '<p style="margin:0 0 6px;font-size:14px;font-weight:800;color:#cbd5e1;letter-spacing:1px;font-family:Arial,sans-serif;">KJT TECHNOLOGIES</p>' +
  '<p style="margin:0 0 4px;font-size:11px;color:#334155;font-family:Arial,sans-serif;">Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda</p>' +
  '<p style="margin:0 0 18px;font-size:11px;color:#334155;font-family:Arial,sans-serif;"><a href="tel:+256767757802" style="color:#00D4FF;text-decoration:none;">+256 767 757 802</a> &nbsp;&middot;&nbsp; <a href="' + u + '" style="color:#00D4FF;text-decoration:none;">' + u.replace('https://', '') + '</a></p>' +
  '<div style="width:40px;height:1px;background-color:#1e3a5f;margin:0 auto 16px;"></div>' +
  '<p style="margin:0 0 6px;font-size:10px;color:#334155;line-height:1.8;font-family:Arial,sans-serif;">You\'re receiving this because <strong style="color:#475569;">' + email + '</strong> subscribed at <a href="' + u + '" style="color:#334155;text-decoration:none;">' + u + '</a>.<br/>To unsubscribe, reply with <strong style="color:#475569;">UNSUBSCRIBE</strong> in the subject line.</p>' +
  '<p style="margin:0;font-size:10px;color:#1a2d44;font-family:Arial,sans-serif;">&copy; ' + year + ' KJT Technologies Solutions Ltd. &middot; Kampala, Uganda</p>' +
  '</td></tr>' +

  // Bottom cyan bar
  '<tr><td height="4" bgcolor="#00D4FF" style="font-size:0;line-height:0;">&nbsp;</td></tr>' +

  '</table>' +
  '</td></tr>' +
  '</table>' +
  '</body></html>';
}

function buildPlainText(email, siteUrl, year) {
  var u = (siteUrl || 'https://kjttechnologies.com').replace(/\/$/, '');
  return [
    'KJT TECHNOLOGIES — Technology Digest',
    'Accelerating Innovation, Securing Data.',
    '',
    'Hello,',
    '',
    'Thank you for subscribing to the KJT TECHNOLOGIES Technology Digest!',
    '',
    'You are now part of a growing community of technology professionals and',
    'business leaders across Uganda and East Africa.',
    '',
    'WHAT YOU\'LL RECEIVE EVERY MONTH:',
    '',
    '  * Cybersecurity Advisories — monthly threat briefings and zero-day alerts',
    '  * Software Engineering — architecture deep-dives and best practices',
    '  * Cloud & Infrastructure — AWS, Azure, GCP, and DevOps tips',
    '  * Networking & CCTV — IP surveillance and enterprise Wi-Fi guides',
    '  * KJT News & Offers — case studies and exclusive subscriber offers',
    '',
    'One focused edition per month. No filler, no spam.',
    '',
    'Browse our latest articles: ' + u + '/blog',
    '',
    '────────────────────────────────────',
    'KJT TECHNOLOGIES',
    'Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda',
    '+256 767 757 802  |  ' + u,
    '',
    'You subscribed with: ' + email,
    'To unsubscribe reply with UNSUBSCRIBE in the subject line.',
    '© ' + year + ' KJT Technologies Solutions Ltd.',
  ].join('\n');
}

// ── HTTP helper using Node built-ins ─────────────────────────────────
function postJson(hostname, path, headers, payload) {
  return new Promise(function (resolve, reject) {
    var body = JSON.stringify(payload);
    var options = {
      hostname: hostname,
      path: path,
      method: 'POST',
      headers: Object.assign({}, headers, {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      }),
    };
    var req = https.request(options, function (res) {
      var chunks = [];
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () {
        var raw = Buffer.concat(chunks).toString('utf8');
        var json = {};
        try { json = JSON.parse(raw); } catch (e) { json = { raw: raw }; }
        resolve({ status: res.statusCode, body: json });
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ── Handler ───────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  // Parse body
  var body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) {
      return res.status(400).json({ success: false, error: 'Invalid JSON' });
    }
  }

  // Also handle raw stream body (some Vercel runtimes don't auto-parse)
  if (!body || typeof body !== 'object') {
    try {
      body = await new Promise(function (resolve, reject) {
        var chunks = [];
        req.on('data', function (c) { chunks.push(c); });
        req.on('end', function () {
          try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
          catch (e) { reject(e); }
        });
        req.on('error', reject);
      });
    } catch (e) {
      return res.status(400).json({ success: false, error: 'Could not parse request body' });
    }
  }

  var email = String((body && body.email) || '').trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, error: 'Valid email required' });
  }

  var resendKey = process.env.RESEND_API_KEY || '';

  if (!resendKey || resendKey.length < 10 || resendKey.indexOf('re_') !== 0) {
    console.warn('[newsletter] RESEND_API_KEY not configured. Subscriber:', email);
    return res.status(200).json({ success: true, note: 'key-not-configured' });
  }

  var siteUrl = process.env.VITE_SITE_URL || 'https://kjttechnologies.com';
  var year    = new Date().getFullYear();
  var from    = 'KJT TECHNOLOGIES <onboarding@resend.dev>';

  // If you have a verified domain on Resend, replace the `from` above with:
  // var from = 'KJT TECHNOLOGIES <noreply@kjttechnologies.com>';

  try {
    var result = await postJson(
      'api.resend.com',
      '/emails',
      { 'Authorization': 'Bearer ' + resendKey },
      {
        from:     from,
        to:       [email],
        subject:  'Welcome to the KJT TECHNOLOGIES Technology Digest',
        html:     buildHtml(email, siteUrl, year),
        text:     buildPlainText(email, siteUrl, year),
        tags:     [{ name: 'category', value: 'newsletter_welcome' }],
      }
    );

    if (result.status >= 200 && result.status < 300) {
      console.log('[newsletter] Sent to', email, '| id:', result.body && result.body.id);
      return res.status(200).json({ success: true, id: result.body && result.body.id });
    }

    var errMsg = (result.body && (result.body.message || result.body.error)) || ('Resend HTTP ' + result.status);
    console.error('[newsletter] Resend error:', errMsg, JSON.stringify(result.body));
    return res.status(502).json({ success: false, error: errMsg });

  } catch (err) {
    console.error('[newsletter] Network error:', err && err.message);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
