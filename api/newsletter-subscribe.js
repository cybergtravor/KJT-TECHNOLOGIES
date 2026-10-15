'use strict';

// Vercel serverless function — Newsletter welcome email via Brevo
// Uses only Node.js built-ins (https, querystring) — zero dependencies

var https = require('https');

module.exports = function handler(req, res) {

  // Always allow CORS so the browser can reach this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  // Collect raw body chunks (handles both string and buffer bodies)
  var rawChunks = [];

  // If Vercel already parsed the body (req.body object), skip streaming
  if (req.body && typeof req.body === 'object') {
    processBody(req.body, req, res);
    return;
  }

  req.on('data', function (chunk) {
    rawChunks.push(chunk);
  });

  req.on('end', function () {
    var raw = Buffer.concat(rawChunks).toString('utf8');
    var body = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      res.status(400).json({ success: false, error: 'Invalid JSON' });
      return;
    }
    processBody(body, req, res);
  });

  req.on('error', function (err) {
    console.error('[newsletter] req stream error:', err.message);
    res.status(500).json({ success: false, error: 'Request stream error' });
  });
};

function processBody(body, req, res) {

  var email = String(body.email || '').trim().toLowerCase();

  // Basic email validation
  if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
    res.status(400).json({ success: false, error: 'Valid email required' });
    return;
  }

  var brevoKey = process.env.BREVO_API_KEY || '';

  // If key is missing, return success (so the subscribe button works)
  // and log a warning so you can see it in Vercel's Logs tab
  if (!brevoKey || brevoKey.length < 20 || brevoKey.indexOf('REPLACE') !== -1) {
    console.warn('[newsletter] BREVO_API_KEY not set. Subscriber:', email);
    res.status(200).json({ success: true, note: 'key-not-configured' });
    return;
  }

  var siteUrl = process.env.VITE_SITE_URL || 'https://kjttechnologies.com';
  var year    = new Date().getFullYear().toString();
  var fromEmail = 'travortechguy@gmail.com';

  var html = buildHtml(email, siteUrl, year, fromEmail);
  var text = buildText(email, siteUrl, year, fromEmail);

  var payload = JSON.stringify({
    sender:      { name: 'KJT TECHNOLOGIES', email: fromEmail },
    to:          [{ email: email }],
    replyTo:     { email: fromEmail },
    subject:     'Welcome to the KJT TECHNOLOGIES Technology Digest',
    htmlContent: html,
    textContent: text,
    tags:        ['newsletter', 'welcome']
  });

  var options = {
    hostname: 'api.brevo.com',
    path:     '/v3/smtp/email',
    method:   'POST',
    headers: {
      'api-key':        brevoKey,
      'Content-Type':   'application/json',
      'Accept':         'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  var brevoReq = https.request(options, function (brevoRes) {
    var chunks = [];
    brevoRes.on('data', function (c) { chunks.push(c); });
    brevoRes.on('end', function () {
      var body = '';
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
      catch (e) { body = {}; }

      if (brevoRes.statusCode >= 200 && brevoRes.statusCode < 300) {
        console.log('[newsletter] Email sent to', email, '| messageId:', body.messageId || 'n/a');
        res.status(200).json({ success: true, messageId: body.messageId || null });
      } else {
        var errMsg = body.message || ('Brevo HTTP ' + brevoRes.statusCode);
        console.error('[newsletter] Brevo rejected send for', email, ':', errMsg);
        res.status(502).json({ success: false, error: errMsg });
      }
    });
  });

  brevoReq.on('error', function (err) {
    console.error('[newsletter] https request error:', err.message);
    res.status(500).json({ success: false, error: 'Network error contacting Brevo' });
  });

  brevoReq.write(payload);
  brevoReq.end();
}

// ── Email content ─────────────────────────────────────────────────────

function buildText(email, siteUrl, year, fromEmail) {
  return [
    'Welcome to the KJT TECHNOLOGIES Technology Digest!',
    '',
    'Thank you for subscribing. Here is what you will receive every month:',
    '',
    '  * Cybersecurity advisories and zero-day threat alerts',
    '  * Software engineering best practices and architecture guides',
    '  * Cloud, DevOps, and infrastructure tips',
    '  * Networking, CCTV, and IT infrastructure updates',
    '  * KJT service news, case studies, and exclusive offers',
    '',
    'Read our latest articles: ' + siteUrl + '/blog',
    '',
    '---',
    'KJT TECHNOLOGIES',
    'Plot 18 Lumumba Avenue, Innovation Towers, Kampala, Uganda',
    'Tel: +256 767 757 802 | Email: ' + fromEmail,
    '',
    'You subscribed with: ' + email,
    'To unsubscribe reply to this email with UNSUBSCRIBE in the subject.',
    '',
    'Copyright ' + year + ' KJT Technologies Solutions Ltd.'
  ].join('\n');
}

function buildHtml(email, siteUrl, year, fromEmail) {
  return '<!DOCTYPE html>' +
  '<html lang="en"><head><meta charset="UTF-8"/>' +
  '<meta name="viewport" content="width=device-width,initial-scale=1.0"/>' +
  '<title>Welcome — KJT TECHNOLOGIES</title></head>' +
  '<body style="margin:0;padding:0;background:#0d1b2e;font-family:Arial,Helvetica,sans-serif;">' +

  // Outer table
  '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0d1b2e">' +
  '<tr><td align="center" style="padding:32px 16px;">' +

  // Card
  '<table width="600" cellpadding="0" cellspacing="0" border="0" ' +
  'style="max-width:600px;width:100%;background:#0f2744;border-radius:12px;' +
  'border:1px solid #1e3a5f;overflow:hidden;">' +

  // ── Header ──
  '<tr><td align="center" bgcolor="#0a192f" ' +
  'style="padding:40px 36px 32px;border-bottom:1px solid #1e3a5f;">' +
  '<p style="margin:0 0 12px;font-size:14px;font-weight:900;letter-spacing:4px;' +
  'color:#00D4FF;text-transform:uppercase;">KJT TECHNOLOGIES</p>' +
  '<div style="width:40px;height:2px;background:#00D4FF;margin:0 auto 20px;"></div>' +
  '<h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.3;">' +
  'Welcome to the<br/>' +
  '<span style="color:#00D4FF;">Technology Digest</span></h1>' +
  '<p style="margin:12px 0 0;font-size:12px;color:#64748b;letter-spacing:2px;text-transform:uppercase;">' +
  'Accelerating Innovation, Securing Data.</p>' +
  '</td></tr>' +

  // ── Body ──
  '<tr><td style="padding:32px 36px 28px;color:#94a3b8;">' +

  '<p style="margin:0 0 20px;font-size:16px;color:#cbd5e1;line-height:1.7;">Hello,</p>' +
  '<p style="margin:0 0 24px;font-size:14px;line-height:1.8;">' +
  'Thank you for subscribing to the ' +
  '<strong style="color:#e2e8f0;">KJT TECHNOLOGIES Technology Digest</strong>. ' +
  'You are now part of a growing community of technology professionals and business leaders across ' +
  '<strong style="color:#e2e8f0;">Uganda and East Africa</strong>.</p>' +

  '<p style="margin:0 0 14px;font-size:11px;font-weight:800;letter-spacing:3px;' +
  'color:#00D4FF;text-transform:uppercase;">What you\'ll receive every month</p>' +

  row('Cybersecurity Advisories',
      'Monthly threat briefings, zero-day alerts, and defence strategy guides.') +
  row('Software Engineering',
      'Architecture deep-dives, coding best practices, and dev tool reviews.') +
  row('Cloud &amp; Infrastructure',
      'AWS, Azure, and GCP tips. Cost optimisation and DevOps workflows.') +
  row('Networking &amp; CCTV',
      'IP surveillance, fiber cabling, and enterprise Wi-Fi 6/7 insights.') +
  row('KJT News &amp; Offers',
      'Service announcements, case studies, and exclusive client offers.') +

  // Note box
  '<div style="margin:24px 0;padding:14px 18px;background:#0a192f;' +
  'border-left:3px solid #00D4FF;border-radius:6px;">' +
  '<p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">' +
  '<strong style="color:#e2e8f0;">Delivery schedule:</strong> ' +
  'One focused edition per month. No filler, no spam, ever.</p>' +
  '</div>' +

  // CTA button
  '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">' +
  '<tr><td align="center" style="padding:8px 0;">' +
  '<a href="' + siteUrl + '/blog" ' +
  'style="display:inline-block;background:#00D4FF;color:#0a192f;font-size:13px;' +
  'font-weight:800;letter-spacing:2px;text-transform:uppercase;text-decoration:none;' +
  'padding:14px 36px;border-radius:8px;">Browse Latest Articles</a>' +
  '</td></tr></table>' +

  '</td></tr>' +

  // ── Footer ──
  '<tr><td align="center" bgcolor="#091e38" ' +
  'style="padding:24px 36px;border-top:1px solid #1e3a5f;">' +
  '<p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#cbd5e1;">' +
  'KJT TECHNOLOGIES</p>' +
  '<p style="margin:0 0 6px;font-size:11px;color:#475569;">' +
  'Plot 18 Lumumba Avenue, Innovation Towers, Kampala, Uganda</p>' +
  '<p style="margin:0 0 16px;font-size:11px;color:#475569;">' +
  '<a href="tel:+256767757802" style="color:#00D4FF;text-decoration:none;">' +
  '+256 767 757 802</a>' +
  '&nbsp;&middot;&nbsp;' +
  '<a href="mailto:' + fromEmail + '" style="color:#00D4FF;text-decoration:none;">' +
  fromEmail + '</a></p>' +
  '<p style="margin:0 0 8px;font-size:10px;color:#334155;line-height:1.6;">' +
  'You subscribed using <strong style="color:#475569;">' + email + '</strong> ' +
  'at <a href="' + siteUrl + '" style="color:#475569;">' + siteUrl + '</a>.<br/>' +
  'To unsubscribe reply with <strong>UNSUBSCRIBE</strong> in the subject line.</p>' +
  '<p style="margin:0;font-size:10px;color:#1e3a5f;">' +
  '&copy; ' + year + ' KJT Technologies Solutions Ltd.</p>' +
  '</td></tr>' +

  '</table>' + // end card
  '</td></tr>' +
  '</table>' + // end outer
  '</body></html>';
}

function row(title, desc) {
  return '<table width="100%" cellpadding="0" cellspacing="0" border="0" ' +
    'style="margin-bottom:2px;border-bottom:1px solid #1e3a5f;">' +
    '<tr><td style="padding:10px 0 10px 12px;">' +
    '<p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#e2e8f0;">' + title + '</p>' +
    '<p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">' + desc + '</p>' +
    '</td></tr></table>';
}
