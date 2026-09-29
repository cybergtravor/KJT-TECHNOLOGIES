# KJT TECHNOLOGIES — SECURITY ARCHITECTURE & CONTROLS

> **Company:** KJT TECHNOLOGIES  
> **Motto:** “Accelerating Innovation, Securing Data.”  
> **Scope:** Web Application, CMS Engine, Supabase Cloud Database & Storage, Vercel Hosting  

---

## 1. Executive Summary & Security Philosophy

No digital system or web platform can honestly be guaranteed to be 100% impenetrable. Modern cybersecurity relies on **defense-in-depth**: layering architectural controls, least-privilege access, strict database authorization, automated input sanitization, and cryptographic guarantees so that a failure in one layer does not compromise client confidentiality.

This document details the security controls implemented across the **KJT TECHNOLOGIES** platform, provides step-by-step guidance for administrators, and transparently identifies remaining risks and operational responsibilities.

---

## 2. Administrator Access & Authentication Security

### Controls Implemented:
1. **Supabase Cloud Authentication:**
   - Administrator sign-in uses Supabase Auth (`supabase.auth.signInWithPassword`), backed by bcrypt hashing and secure JSON Web Tokens (JWT).
   - Passwords are never transmitted in cleartext, never saved to browser storage, and never logged to console outputs.
2. **Brute-Force Rate Limiting & Cooldown Lockout:**
   - The login form (`src/pages/admin/AdminLoginPage.tsx`) monitors consecutive failed attempts.
   - After **5 failed attempts**, the login interface is temporarily locked for **60 seconds**, discouraging credential stuffing and automated password guessing.
3. **Session Expiry & Token Invalidation:**
   - Client sessions have an enforced **4-hour inactivity timeout** stored cryptographically.
   - When administrators click **Sign Out**, tokens are revoked via `supabase.auth.signOut()` and all local storage tokens (`kjt_admin_authenticated`, `kjt_admin_user_email`, `kjt_admin_session_expiry`) are expunged.
   - A live listener (`supabase.auth.onAuthStateChange`) triggers an automatic redirection to `/admin/login` if the session is revoked from another device.
4. **Search Engine Protection (`noindex`):**
   - The admin login page and CMS dashboard inject `<meta name="robots" content="noindex, nofollow, noarchive" />` via `SEOHead.tsx`, preventing Google and Bing from indexing administrative endpoints.
5. **Secure Password Recovery:**
   - Administrators can trigger a password recovery flow via Supabase Auth.
   - Responses use generic confirmations to prevent account enumeration (attackers cannot discover whether an email address is registered).
6. **Multi-Factor Authentication (MFA / 2FA):**
   - Supabase Auth supports TOTP (Google Authenticator, Microsoft Authenticator). Instructions for enabling MFA in the Supabase Dashboard are detailed below.

### How to Enable Multi-Factor Authentication (MFA) in Supabase:
1. Open your **Supabase Project Dashboard** (`https://supabase.com/dashboard`).
2. Navigate to **Authentication** &rarr; **MFA**.
3. Toggle **Enable TOTP Multi-Factor Authentication**.
4. Set enforcement to **Required** or **Optional** for all admin users.

---

## 3. Database Security & Row Level Security (RLS)

All database operations are governed by PostgreSQL **Row Level Security (RLS)** in `supabase/setup.sql`. The database itself enforces permissions, regardless of frontend code execution:

| Table / Resource | Anonymous Public Visitor Access | Authenticated Administrator Access |
| :--- | :--- | :--- |
| `public.articles` | `SELECT` ONLY where `status = 'published'` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` on all |
| `public.categories` | `SELECT` all categories | `ALL` permissions |
| `public.admin_profiles` | **DENIED** (no read access) | `SELECT` & `UPDATE` own profile (`auth.uid() = id`) |
| `public.quotation_requests` | `INSERT` only (submit RFP) | `ALL` (view, review, add admin notes, update status) |
| `public.consultation_bookings` | `INSERT` only (submit booking) | `ALL` (confirm, reschedule, review notes) |
| `public.public_booked_slots` (View) | `SELECT` date & time slots only | `SELECT` date & time slots |
| `public.consultation_availability` | `SELECT` (read business hours) | `ALL` (modify hours, lunch breaks, notice times) |
| `public.blocked_dates` | `SELECT` (read holiday blackout days) | `ALL` (add, remove holiday dates) |
| `storage.objects` (`article-images`) | `SELECT` (view public images) | `INSERT`, `DELETE` (upload / delete marketing assets) |
| `storage.objects` (`quotation-files`) | `INSERT` only (upload RFP document) | `SELECT`, `DELETE` via **5-minute Signed URLs** |

### Key Guarantees:
- **No Client Snooping:** Anonymous visitors **cannot query** other clients’ quotation requests, phone numbers, budgets, or consultation topics.
- **Double-Booking Prevention:** A PostgreSQL unique partial index (`idx_unique_booking_slot`) guarantees that two conflicting bookings for the same date and time slot cannot be inserted into the database, even under high concurrency.
- **Privacy-Safe Availability:** The `public_booked_slots` view exposes only `booking_date` and `start_time` to prospective clients so they can see which times are taken without exposing who booked them.

---

## 4. Input & HTML Sanitization (XSS & Injection Defense)

### Cross-Site Scripting (XSS) Prevention:
1. **DOMPurify HTML Sanitization (`src/lib/contentSanitizer.ts`):**
   - Applied to rich text before database saving, in live preview modals, and before public rendering in `BlogPostDetailPage.tsx`.
   - Strips `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`, `<input>`, and custom tags.
   - Forbids all inline event handlers (`onclick`, `onload`, `onerror`, etc.).
   - Eliminates dangerous URL schemes (`javascript:`, `data:`, `vbscript:`).
   - Sanitizes and removes pasted AI Studio, Microsoft Word, and Google Docs citation artifacts (`<source-footnote>`, `mso-*`, `ng-*`).
2. **Safe Heading & Anchor ID Generation:**
   - Headings are sanitized with strict regex `/[^\w\s-]/g` to ensure anchor tags do not inject arbitrary attributes.
3. **No Unsanitized `dangerouslySetInnerHTML`:**
   - Every single instance of `dangerouslySetInnerHTML` in the application receives content that has passed directly through `sanitizeArticleHtml`.
4. **SQL Injection Defense:**
   - No raw SQL strings are concatenated from user input. All database interactions execute via parameterized Supabase client queries (`supabase.from('...').insert(...)`), preventing SQL injection.

---

## 5. File Upload Security

File attachments for marketing articles and client RFPs are strictly regulated in `src/services/storageService.ts`:

1. **Dual Verification (MIME Type & Extension):**
   - The file’s extension is validated against an explicit whitelist.
   - The file’s MIME type (`file.type`) is independently validated against authorized formats.
2. **Forbidden Executables:**
   - Executable scripts and binaries (`.exe`, `.bat`, `.cmd`, `.sh`, `.bin`, `.php`, `.phtml`, `.py`, `.js`, `.vbs`, `.msi`, `.jar`) are strictly rejected with an explicit error.
3. **Path Traversal Prevention:**
   - Filenames are sanitized with `sanitizeStorageFileName()`, stripping directory slashes (`/`, `\`), null bytes (`\0`), and path navigation sequences (`../`).
4. **Collision-Resistant Unique Identifiers:**
   - Stored files are prefixed with a high-resolution timestamp and a cryptographic salt (e.g., `1741598400123_a9b2c_network_diagram.pdf`). This prevents unauthorized file enumeration and accidental overwrites.
5. **Private Quotation Storage & Signed URLs:**
   - Client quotation attachments reside in the private bucket `quotation-files`.
   - Files can only be downloaded by authenticated administrators through time-limited signed URLs that automatically expire after **300 seconds (5 minutes)**.

---

## 6. HTTP Security Headers (`vercel.json`)

When deployed to Vercel, the platform transmits production-grade HTTP security headers on all responses:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://api.web3forms.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.web3forms.com; frame-ancestors 'self' https://ai.studio https://*.run.app; object-src 'none'; base-uri 'self'; form-action 'self' https://api.web3forms.com;"
},
{
  "key": "Strict-Transport-Security",
  "value": "max-age=63072000; includeSubDomains; preload"
},
{
  "key": "X-Content-Type-Options",
  "value": "nosniff"
},
{
  "key": "X-Frame-Options",
  "value": "SAMEORIGIN"
},
{
  "key": "Referrer-Policy",
  "value": "strict-origin-when-cross-origin"
},
{
  "key": "Permissions-Policy",
  "value": "camera=(), microphone=(), geolocation=(), payment=()"
}
```

- **HSTS:** Enforces HTTPS for 2 years (`63072000` seconds) including subdomains and HSTS preload readiness.
- **X-Content-Type-Options:** Disables MIME-type sniffing (`nosniff`).
- **Permissions-Policy:** Restricts browser access to hardware sensors, camera, microphone, and geolocation.

---

## 7. Form Security & Anti-Spam Measures

1. **Honeypot Spam Traps:**
   - Quotation, consultation, newsletter, and contact forms include invisible honeypot fields (`botcheck`, `honeypot`).
   - Automated bots scanning the DOM fill all available inputs. When a submission contains a non-empty honeypot, the system silently discards the payload without allocating server resources.
2. **Input Length Constraints:**
   - Explicit `maxLength` limits on all fields prevent memory exhaustion and buffer overflow attacks.
3. **Throttling & Debouncing:**
   - Forms restrict rapid duplicate submissions, disabling submission buttons while network calls are in flight.
4. **Safe Logging (Zero Credential Exposure):**
   - The application does not log client phone numbers, email contents, passwords, or session tokens to browser dev tools or telemetry sinks.

---

## 8. Remaining Risks & Administrator Responsibilities

While the application employs robust security hardening, administrators must remain vigilant against operational and out-of-band threats:

| Threat Category | Nature of Risk | Recommended Operational Mitigation |
| :--- | :--- | :--- |
| **Phishing & Social Engineering** | Attackers may email administrators pretending to be Supabase or Vercel support. | Never enter credentials on links received via unsolicited email. Verify URL is `supabase.com` or your official domain. |
| **Service-Role Key Leakage** | Exposing `SUPABASE_SERVICE_ROLE_KEY` in frontend `.env` bypasses all Row Level Security. | **NEVER** put the service-role key in frontend `.env` or client repositories. Only use the public `anon` key in browser code. |
| **Weak Administrator Passwords** | Dictionary or brute-force attacks against weak credentials. | Mandate passwords of at least 12 characters with upper, lower, numeric, and symbol diversity. Enable MFA. |
| **Third-Party Dependency CVEs** | Vulnerabilities discovered in open-source npm packages. | Regularly run `npm audit` and update dependencies via `npm update`. |
| **Public Wi-Fi Inception** | Admins logging in over unencrypted public hotspots. | Always use HTTPS and enterprise VPNs when accessing the CMS from mobile or public networks. |

---

## 9. Security Incident Reporting

If you discover a security vulnerability, flaw, or data exposure in the KJT TECHNOLOGIES platform:

1. **Do not** disclose the vulnerability publicly or post it to public GitHub issues.
2. Send an encrypted email with full reproduction steps to:  
   **Email:** `security@kjttechnologies.com` (or `info@kjttechnologies.com`)  
   **Subject:** `[SECURITY DISCLOSURE] Vulnerability Report`  
3. Our engineering team acknowledges receipt within 24 hours and issues patches under a coordinated disclosure timeline.
