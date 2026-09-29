# KJT TECHNOLOGIES — TROUBLESHOOTING MANUAL

> **Company:** KJT TECHNOLOGIES  
> **Motto:** “Accelerating Innovation, Securing Data.”  
> **Target Audience:** Windows PowerShell users, administrators, and developers maintaining the platform.

---

## 1. Windows PowerShell & Node.js Issues

### Issue 1.1: “Execution of scripts is disabled on this system”
- **Symptoms:** Running `npm`, `npx`, or `vite` in PowerShell displays:  
  `File ... cannot be loaded because running scripts is disabled on this system.`
- **Cause:** Windows PowerShell execution policy restricts unsigned scripts by default.
- **Solution:**
  1. Open PowerShell as Administrator (Right-click PowerShell &rarr; **Run as Administrator**).
  2. Run the following command:
     ```powershell
     Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
     ```
  3. Press `Y` to confirm. Close and reopen your PowerShell window.

---

### Issue 1.2: “vite: command not found” or missing dependencies
- **Symptoms:** Running `npm run build` or `npm run dev` fails with `vite: not found`.
- **Cause:** `node_modules` is either missing or corrupted.
- **Solution:**
  In PowerShell, delete the lockfile and reinstall dependencies cleanly:
  ```powershell
  Remove-Item -Recurse -Force node_modules
  npm install
  npm run build
  ```

---

## 2. Supabase Cloud Database & Storage Issues

### Issue 2.1: “Supabase Configuration Notice” displayed on Login / Forms
- **Symptoms:** Yellow warning box appears stating that Supabase credentials are using demo placeholders.
- **Cause:** Your `.env.local` file is missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, or they contain placeholder text (`https://your-project.supabase.co`).
- **Solution:**
  1. Open your **Supabase Dashboard** &rarr; **Project Settings** &rarr; **API**.
  2. Copy your **Project URL** and **anon public key**.
  3. In your project root, open `.env.local` (or create it from `.env.example`).
  4. Add your real values:
     ```env
     VITE_SUPABASE_URL=https://abcdefghijkl.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
     ```
  5. Restart your dev server in PowerShell (`npm run dev`).

---

### Issue 2.2: “Row Level Security policy violated” when submitting forms
- **Symptoms:** Form submission displays error: `new row violates row-level security policy for table ...`
- **Cause:** The table RLS policies were not loaded or were modified without granting insert permission to `anon`.
- **Solution:**
  1. Open the Supabase Dashboard &rarr; **SQL Editor**.
  2. Re-run `supabase/setup.sql`. The script includes safe `DROP POLICY IF EXISTS` statements and will reinstall the exact permissions without erasing your existing data.

---

### Issue 2.3: Storage upload error: “Bucket not found” or “Access Denied”
- **Symptoms:** Trying to upload article cover photos or quotation documents fails with `Bucket not found`.
- **Cause:** The storage buckets `article-images` or `quotation-files` have not been initialized.
- **Solution:**
  1. Open Supabase Dashboard &rarr; **Storage**.
  2. Verify that two buckets exist:
     - `article-images` (Public bucket)
     - `quotation-files` (Private bucket)
  3. If missing, run **Section 5** and **Section 7** of `supabase/setup.sql` in the SQL Editor.

---

### Issue 2.4: Administrator Password Reset email not arriving
- **Symptoms:** Clicking "Forgot password?" and submitting email does not deliver an email.
- **Cause:** Supabase free-tier projects use a shared SMTP server with a limit of 3 emails per hour.
- **Solution:**
  1. Check your email's **Spam / Junk** folder.
  2. In the Supabase Dashboard &rarr; **Authentication** &rarr; **Email Templates**, ensure password recovery is enabled.
  3. Alternatively, an administrator can manually reset an admin's password directly inside the Supabase Dashboard under **Authentication** &rarr; **Users** &rarr; Select User &rarr; **Update User** &rarr; **Set Password**.

---

## 3. Vercel Cloud Hosting Issues

### Issue 3.1: 404 Not Found error when refreshing any subpage (e.g., `/blog` or `/admin`)
- **Symptoms:** Clicking links works, but refreshing the page directly on `https://kjttechnologies.com/services` gives a 404 error.
- **Cause:** Single Page Applications (SPAs) require all URL routes to route through `index.html`.
- **Solution:**
  Confirm that `vercel.json` exists in your repository root with this rewrite rule:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
  Push `vercel.json` to GitHub and Vercel will resolve it automatically.

---

### Issue 3.2: Environment variables not taking effect in production
- **Symptoms:** Code deployed to Vercel continues using fallback/demo data instead of Supabase.
- **Cause:** Environment variables were added to Vercel *after* the build finished.
- **Solution:**
  1. In the Vercel Dashboard, go to **Settings** &rarr; **Environment Variables**.
  2. Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are saved under **Production**, **Preview**, and **Development**.
  3. Navigate to the **Deployments** tab in Vercel, click the three dots (`...`) next to the latest deployment, and click **Redeploy**.

---

### Issue 3.3: Content Security Policy (CSP) blocking external images or fonts
- **Symptoms:** Browser console shows:  
  `Refused to load the image ... because it violates the following Content Security Policy directive...`
- **Cause:** An image was hosted on an unauthorized external domain not whitelisted in `vercel.json`.
- **Solution:**
  Open `vercel.json`, locate `img-src` or `connect-src`, and add the domain (e.g., `https://my-cdn.com`). Then commit and push to GitHub.

---

## 4. Content Management System (CMS) Issues

### Issue 4.1: Newly published article not visible on the public `/blog` page
- **Symptoms:** Article saved in CMS dashboard but public visitors cannot see it.
- **Cause:** Article status is set to `draft` or `scheduled` instead of `published`.
- **Solution:**
  1. Open `/admin/dashboard`.
  2. Click **Edit** on the article.
  3. In the sidebar, ensure the **Publish Status** dropdown is set to **Published**.
  4. Click **Update Article**. By RLS design, anonymous visitors can only read articles marked `published`.

---

### Issue 4.2: Administrator locked out: “Rate limit reached. Login locked for 60s”
- **Symptoms:** Admin login button is disabled with a red countdown banner.
- **Cause:** 5 consecutive incorrect passwords were submitted within the same browser session.
- **Solution:**
  1. Wait for the 60-second cooldown timer to reach 0.
  2. If the password was forgotten, click **Forgot password?** to dispatch a reset email, or reset it directly in the Supabase Dashboard under **Authentication &rarr; Users**.

---

### Issue 4.3: Administrator session expired suddenly
- **Symptoms:** While writing or editing an article, the screen redirects to `/admin/login`.
- **Cause:** For security compliance, administrative sessions automatically expire after 4 hours of inactivity.
- **Solution:**
  Log in again. Content auto-saves locally so unsaved drafts in the rich-text editor are preserved in browser cache upon re-entry.

---

## 5. Contact & Booking Form Issues

### Issue 5.1: Contact form submits but no email notification is received
- **Symptoms:** Green success message appears on `/contact`, but the company inbox (`info@kjttechnologies.com`) receives no notification.
- **Cause:** `VITE_WEB3FORMS_ACCESS_KEY` is not set or the key is inactive.
- **Solution:**
  1. Obtain a free access key at [web3forms.com](https://web3forms.com) for `info@kjttechnologies.com`.
  2. Add the key to your `.env.local` and Vercel Environment Variables:
     ```env
     VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here
     ```
  3. Check the recipient email's spam folder and mark Web3Forms as "Not Spam".

---

### Issue 5.2: “Double-booking conflict: This time slot is already reserved”
- **Symptoms:** A prospective client cannot select a particular time on the booking calendar.
- **Cause:** Another client has already booked that exact slot, or the date is a blocked corporate holiday.
- **Solution:**
  Select another available slot on the calendar. To open up that time, an administrator can change the status of the existing booking to `Cancelled` or `Rescheduled` in the `/admin/consultations` dashboard.
