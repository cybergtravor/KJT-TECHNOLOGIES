/**
 * =====================================================================
 * VERCEL SERVERLESS FUNCTION — Newsletter Subscribe
 * POST /api/newsletter-subscribe
 * =====================================================================
 *
 * WHY THIS EXISTS:
 * The Brevo API key is a PRIVATE server-side secret. It must never be
 * placed in a VITE_ env var (which gets bundled into client JS and is
 * visible to anyone who reads the page source). This Edge Function
 * keeps the key on the server where it cannot be extracted by visitors.
 *
 * ENVIRONMENT VARIABLE REQUIRED (set in Vercel, no VITE_ prefix):
 *   BREVO_API_KEY=xkeysib-your-actual-key
 *
 * The frontend sends: { email: "subscriber@example.com" }
 * This function calls the Brevo Transactional Email API and returns:
 *   { success: true }  or  { success: false, error: "..." }
 * =====================================================================
 */

// Input validation helpers
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/kjttechnologies\.com$/,
  /^https:\/\/.*\.vercel\.app$/,
  /^http:\/\/localhost:\d+$/,
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
}

function buildWelcomeHtml(subscriberEmail, websiteUrl, phone, supportEmail, year) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Welcome to KJT TECHNOLOGIES Technology Digest</title>
</head>
<body style="margin:0;padding:0;background:#0d1b2e;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d1b2e;padding:32px 16px;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" border="0"
    style="max-width:600px;width:100%;background:#0f2744;border-radius:16px;overflow:hidden;border:1px solid #1e3a5f;">

    <!-- HEADER -->
    <tr>
      <td style="background:linear-gradient(135deg,#0a192f,#0c2340);padding:40px 40px 32px;text-align:center;border-bottom:1px solid #1e3a5f;">
        <div style="margin-bottom:14px;">
          <span style="font-size:13px;font-weight:900;letter-spacing:.35em;color:#00D4FF;text-transform:uppercase;">KJT</span>
          <span style="font-size:13px;font-weight:700;letter-spacing:.25em;color:#94a3b8;text-transform:uppercase;margin-left:6px;">TECHNOLOGIES</span>
        </div>
        <div style="width:48px;height:2px;background:#00D4FF;margin:0 auto 20px;border-radius:2px;"></div>
        <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;line-height:1.2;">
          Welcome to the<br/><span style="color:#00D4FF;">Technology Digest</span>
        </h1>
        <p style="margin:12px 0 0;font-size:13px;color:#64748b;letter-spacing:.15em;text-transform:uppercase;font-weight:600;">
          Accelerating Innovation, Securing Data.
        </p>
      </td>
    </tr>

    <!-- BODY -->
    <tr>
      <td style="padding:36px 40px 32px;">
        <p style="margin:0 0 16px;font-size:16px;color:#cbd5e1;line-height:1.7;">Hello,</p>
        <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.8;">
          Thank you for subscribing to the <strong style="color:#e2e8f0;">KJT TECHNOLOGIES Technology Digest</strong>.
          You are now part of a growing community of technology professionals and business leaders across
          <strong style="color:#e2e8f0;">Uganda and East Africa</strong>.
        </p>
        <p style="margin:0 0 14px;font-size:12px;font-weight:800;letter-spacing:.18em;color:#00D4FF;text-transform:uppercase;">What You'll Receive</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
          <tr><td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #1e3a5f;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="36" style="vertical-align:top;padding-top:2px;font-size:20px;">🛡️</td>
              <td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Cybersecurity Advisories</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">Monthly threat briefings, zero-day alerts, and defence strategy guides.</p></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #1e3a5f;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="36" style="vertical-align:top;padding-top:2px;font-size:20px;">💻</td>
              <td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Software Engineering</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">Architecture deep-dives, coding best practices, and dev tool reviews.</p></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #1e3a5f;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="36" style="vertical-align:top;padding-top:2px;font-size:20px;">☁️</td>
              <td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Cloud &amp; Infrastructure</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">AWS, Azure, and GCP tips. Cost optimisation and DevOps workflows.</p></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:10px 0;vertical-align:top;border-bottom:1px solid #1e3a5f;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="36" style="vertical-align:top;padding-top:2px;font-size:20px;">📡</td>
              <td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">Networking &amp; CCTV</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">IP surveillance, fiber cabling, and enterprise Wi-Fi 6/7 insights.</p></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:10px 0;vertical-align:top;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td width="36" style="vertical-align:top;padding-top:2px;font-size:20px;">🚀</td>
              <td><p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#e2e8f0;">KJT News &amp; Offers</p><p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">Service announcements, case studies, and exclusive client offers.</p></td>
            </tr></table>
          </td></tr>
        </table>

        <div style="background:#0a192f;border:1px solid #1e3a5f;border-left:3px solid #00D4FF;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;">
            📅 <strong style="color:#e2e8f0;">Delivery:</strong> One focused edition per month. No filler, no spam, ever.
          </p>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
          <tr><td align="center">
            <a href="${websiteUrl}/blog"
              style="display:inline-block;background:linear-gradient(90deg,#00D4FF,#0055FF);color:#0a192f;font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;padding:14px 36px;border-radius:8px;">
              Browse Our Latest Articles →
            </a>
          </td></tr>
        </table>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background:#091e38;border-top:1px solid #1e3a5f;padding:24px 40px;text-align:center;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#cbd5e1;">KJT TECHNOLOGIES</p>
        <p style="margin:0 0 4px;font-size:11px;color:#475569;">Plot 18 Lumumba Avenue, Level 4 Innovation Towers, Kampala, Uganda</p>
        <p style="margin:0 0 16px;font-size:11px;color:#475569;">
          <a href="tel:${phone.replace(/\s/g,'')}" style="color:#00D4FF;text-decoration:none;">${phone}</a>
          &nbsp;·&nbsp;
          <a href="mailto:${supportEmail}" style="color:#00D4FF;text-decoration:none;">${supportEmail}</a>
        </p>
        <p style="margin:0 0 12px;font-size:10px;color:#334155;line-height:1.6;">
          You received this email because <strong style="color:#475569;">${subscriberEmail}</strong>
          subscribed on <a href="${websiteUrl}" style="color:#475569;text-decoration:none;">${websiteUrl}</a>.<br/>
          To unsubscribe, reply with <strong>UNSUBSCRIBE</strong> in the subject line.
        </p>
        <p style="margin:0;font-size:10px;color:#1e3a5f;">© ${year} KJT Technologies Solutions Ltd. · Kampala, Uganda</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;
}

export default async function handler(req, res) {
  const origin = req.headers['origin'] || '';

  // CORS — only allow requests from your own domain
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://kjttechnologies.com');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  // Pre-flight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  // Parse body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid request body.' });
  }

  const subscriberEmail = (body?.email || '').trim().toLowerCase();

  // Validate email
  if (!subscriberEmail || !EMAIL_REGEX.test(subscriberEmail)) {
    return res.status(400).json({ success: false, error: 'A valid email address is required.' });
  }

  // Max length guard
  if (subscriberEmail.length > 254) {
    return res.status(400).json({ success: false, error: 'Email address too long.' });
  }

  // Get the private Brevo key — server-side only, never exposed to browser
  const brevoKey = process.env.BREVO_API_KEY || '';

  if (!brevoKey || brevoKey.includes('xkeysib-REPLACE') || brevoKey.length < 20) {
    // Key not configured — log server-side, return success so UI is not broken
    console.warn('[newsletter-subscribe] BREVO_API_KEY is not configured on the server.');
    return res.status(200).json({ success: true, note: 'Simulated (key not configured).' });
  }

  const websiteUrl = process.env.VITE_SITE_URL || 'https://kjttechnologies.com';
  const phone = '+256 767 757 802';
  const supportEmail = 'travortechguy@gmail.com';
  const year = new Date().getFullYear();

  const htmlContent = buildWelcomeHtml(subscriberEmail, websiteUrl, phone, supportEmail, year);
  const textContent = `Welcome to the KJT TECHNOLOGIES Technology Digest!\n\nThank you for subscribing. You'll receive monthly insights on cybersecurity, software engineering, cloud infrastructure, networking, CCTV, and IT infrastructure.\n\nBrowse our latest articles: ${websiteUrl}/blog\n\n---\nKJT TECHNOLOGIES — Accelerating Innovation, Securing Data.\nPlot 18 Lumumba Avenue, Kampala, Uganda\n${phone} · ${supportEmail}\n\nTo unsubscribe reply with UNSUBSCRIBE in the subject line.\n© ${year} KJT Technologies Solutions Ltd.`;

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': brevoKey,
      },
      body: JSON.stringify({
        sender: { name: 'KJT TECHNOLOGIES', email: supportEmail },
        to: [{ email: subscriberEmail }],
        replyTo: { email: supportEmail, name: 'KJT TECHNOLOGIES Support' },
        subject: '👋 Welcome to the KJT TECHNOLOGIES Technology Digest',
        htmlContent,
        textContent,
        tags: ['newsletter', 'welcome'],
      }),
    });

    if (brevoRes.ok) {
      const data = await brevoRes.json();
      return res.status(200).json({ success: true, messageId: data.messageId });
    }

    const errData = await brevoRes.json().catch(() => ({}));
    const errMsg = errData?.message || `Brevo API error ${brevoRes.status}`;
    console.error('[newsletter-subscribe] Brevo error:', errMsg);
    return res.status(502).json({ success: false, error: 'Failed to send welcome email. Please try again.' });
  } catch (err) {
    console.error('[newsletter-subscribe] Network error:', err?.message);
    return res.status(502).json({ success: false, error: 'Network error sending welcome email.' });
  }
}
