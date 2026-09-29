# KJT TECHNOLOGIES — TESTING & QUALITY ASSURANCE MANUAL

> **Company:** KJT TECHNOLOGIES  
> **Motto:** “Accelerating Innovation, Securing Data.”  
> **Environment:** Windows PowerShell, React 18, Vite, TypeScript, Supabase, Vercel

---

## 1. Overview & Test Strategy

This manual provides clear, step-by-step procedures to thoroughly test the **KJT TECHNOLOGIES** web platform. Testing is organized into five operational categories:

1. **Static Analysis & Build Verification** (Command-line testing in Windows PowerShell)
2. **Frontend UI, Responsiveness & Accessibility Testing** (Cross-browser, mobile devices)
3. **Form Integrity, Validation & Anti-Spam Testing** (Quotes, Consultations, Contact, Newsletter)
4. **Backend, Database & Storage Security Testing** (Supabase RLS, Permissions, Signed URLs)
5. **Security Penetration & Injection Testing** (XSS, Path Traversal, Brute-Force Rate Limiting)

---

## 2. Automated Build & Linter Verification (Windows PowerShell)

Run these two commands before any code commit or production release:

### Test 2.1: Code Linting
Open PowerShell in the project directory:
```powershell
npm run lint
```
*Expected Result:* Clean exit with no syntax errors, missing imports, or unhandled exceptions.

### Test 2.2: Production Build Compilation
```powershell
npm run build
```
*Expected Result:* Vite successfully packages all TypeScript modules, Tailwind CSS rules, and static assets into the `dist/` directory without warnings.

### Test 2.3: Local Preview Server
```powershell
npm run preview
```
Open your browser at `http://localhost:4173` to test the production bundle locally before deploying.

---

## 3. Frontend & Responsive Layout Testing

| Test ID | Viewport / Screen Size | Target Check | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **UI-01** | Mobile (375px - 428px) | Navigation Drawer | Hamburger menu opens smoothly; all navigation links and contact buttons are clickable with &ge;44px touch targets; no horizontal scrollbar. |
| **UI-02** | Tablet (768px - 1024px) | Services Grid & Hero | Two-column cards display with balanced padding; typography scales down gracefully. |
| **UI-03** | Desktop (1280px - 1920px) | Multi-column layouts | Three-column service cards, full mega-footer, and sticky header render without clipping. |
| **UI-04** | Cross-Browser | Chrome, Edge, Firefox, Safari | Web fonts (`Plus Jakarta Sans`, `JetBrains Mono`) render cleanly; backdrop blur filters function properly. |
| **UI-05** | Accessibility (a11y) | Keyboard Tab Navigation | Pressing `Tab` focuses interactive elements with visible focus rings; Escape closes active modals. |

---

## 4. Form Validation & Anti-Spam Testing

### Test 4.1: General Contact Form (`/contact`)
1. **Empty Submission Test:** Click *Send Message* without typing anything.  
   *Expected Result:* Form prevents submission; red error text prompts for Full Name, Email, and Message.
2. **Invalid Email Test:** Type `user@domain` (no TLD).  
   *Expected Result:* Form rejects input with *"Please provide a valid corporate email address."*
3. **Spam Honeypot Test:** Using browser DevTools, set the hidden field `name="botcheck"` to `spam-bot` and submit.  
   *Expected Result:* The form silently stops without transmitting network calls.
4. **Successful Submission Test:** Enter valid details and click submit.  
   *Expected Result:* Green success banner appears; form fields reset.

### Test 4.2: 5-Step Smart Quotation Request (`/request-quote`)
1. **Step 1 (Client Info):** Enter Full Name, Email, Phone, and Location. Verify *Next Step* advances to Step 2.
2. **Step 2 (Services):** Select at least one service card (e.g., *Cybersecurity Audits*). Verify selection counter updates.
3. **Step 3 (Project Specs & Attachments):**
   - Type a project description (&ge;20 characters).
   - Try uploading an executable file (e.g., `test.exe` or `test.bat`).  
     *Expected Result:* System rejects file immediately with *"Forbidden file extension"* or *"Unsupported document format"*.
   - Upload a legitimate PDF or PNG under 10MB.  
     *Expected Result:* File appears in the uploaded attachment badge list with size indication.
4. **Step 4 (Budget & Timeline):** Choose budget bracket (e.g., `UGX 3,000,000–10,000,000`) and target completion period.
5. **Step 5 (Review & Submit):** Verify review card summarizes all selections accurately. Check the Privacy Consent box and click *Submit Quotation Request*.  
   *Expected Result:* Success confirmation screen appears displaying a unique reference number (e.g., `KJT-Q-202503-XXXX`).

### Test 4.3: Engineering Consultation Booking (`/book-consultation`)
1. **Calendar Date Selection:** Click a future business day.  
   *Expected Result:* Available time slots (Kampala time, UTC+3) generate dynamically.
2. **Time Slot Selection:** Click a slot (e.g., `10:00 AM - 10:45 AM`). Verify it highlights in cyan (`#00D4FF`).
3. **Double-Booking Prevention Test:**
   - Complete and submit a booking for `Tomorrow at 10:00 AM`.
   - In another browser tab or incognito window, select the exact same date.  
   *Expected Result:* The `10:00 AM` slot is marked as *Booked* or unavailable.
4. **Calendar Download (`.ics` file):**
   - On the booking confirmation screen, click *Download Calendar Event (.ics)*.  
   *Expected Result:* A valid `.ics` calendar invitation downloads, opening directly into Google Calendar, Outlook, or Apple Calendar.

---

## 5. Security & Penetration Validation

### Test 5.1: Cross-Site Scripting (XSS) Sanitization
1. Log into the CMS at `/admin/login`.
2. Go to **New Article** (`/admin/articles/new`).
3. In the article content field, paste the following XSS payload:
   ```html
   <p>Normal text</p>
   <script>alert('XSS-FAIL')</script>
   <img src="x" onerror="alert('XSS-IMG-FAIL')" />
   <a href="javascript:alert('XSS-LINK-FAIL')">Click me</a>
   ```
4. Click **Preview Article** and **Publish**.
5. Navigate to the published article on `/blog`.
6. Inspect the DOM with browser DevTools.  
   *Expected Result:* No alert dialog fires. The `<script>` tag is stripped; `onerror` attribute is stripped; `javascript:` link is removed or neutralized by DOMPurify.

### Test 5.2: Path Traversal Defense on File Uploads
1. Attempt uploading a file named `../../etc/passwd.jpg` or `..\..\boot.ini.png`.  
   *Expected Result:* `sanitizeStorageFileName` sanitizes the name to a clean timestamped string (e.g., `1741598000000_abc_passwd.jpg`), eliminating all directory traversal attempts.

### Test 5.3: Administrator Brute-Force Rate Limiting
1. Navigate to `/admin/login`.
2. Enter an incorrect password 5 times in a row.  
   *Expected Result:* After the 5th attempt, the form locks down with a prominent warning:  
   *“Rate limit reached. Login locked for 60s to protect against brute force attacks.”*
3. The submit button is disabled until the countdown finishes.

### Test 5.4: Supabase Row Level Security (RLS) Audit
Run this SQL query in the **Supabase SQL Editor** to test whether anonymous visitors can access confidential data:
```sql
-- Simulate an anonymous public visitor
SET ROLE anon;

-- Test 1: Should succeed (returns only published articles)
SELECT id, title, status FROM public.articles;

-- Test 2: Should fail or return 0 rows (anonymous visitors cannot view quotation records)
SELECT * FROM public.quotation_requests;

-- Test 3: Should fail or return 0 rows (anonymous visitors cannot view client bookings)
SELECT * FROM public.consultation_bookings;

-- Reset role back to postgres administrator
RESET ROLE;
```
*Expected Result:* Test 2 and Test 3 return zero rows, confirming that client data is protected at the database engine level.

---

## 6. Pre-Flight Deployment Checklist

Before announcing a new release:

- [ ] `npm run lint` passes with 0 errors.
- [ ] `npm run build` succeeds cleanly.
- [ ] Supabase credentials in Vercel environment variables are verified.
- [ ] All 5 navigation links in Header and Footer route to active pages.
- [ ] Admin CMS creates, updates, and deletes articles as expected.
- [ ] Quotation submissions appear under `/admin/quotations`.
- [ ] Consultation bookings appear under `/admin/consultations`.
- [ ] HTTP Security headers are active (`curl -I https://kjttechnologies.com`).
