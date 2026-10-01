/**
 * =====================================================================
 * ADMIN SETUP & DIAGNOSTICS - KJT TECHNOLOGIES CMS
 * =====================================================================
 *
 * Accessible at /admin/setup (no auth required — needed when login is broken).
 *
 * Checks performed live in-browser:
 *   1. All required Vite env vars are present and not placeholder values
 *   2. Supabase URL is reachable (HTTP HEAD request)
 *   3. Supabase anon key looks structurally valid (JWT format)
 *   4. Supabase Auth endpoint responds
 *   5. Web3Forms key is set
 *   6. Brevo key is set
 *
 * Shows a clear checklist with exact instructions for each failing check.
 * =====================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { BrandLogo } from '../../components/common/BrandLogo';

// ── Types ─────────────────────────────────────────────────────────────

type CheckStatus = 'pending' | 'running' | 'pass' | 'fail' | 'warn';

interface DiagCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  fix?: string;
  docsUrl?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────

function getEnv(key: string): string {
  return ((import.meta as any).env?.[key] as string) || '';
}

function isPlaceholder(val: string): boolean {
  if (!val) return true;
  return (
    val.includes('replace_with') ||
    val.includes('YOUR_') ||
    val.includes('xkeysib-REPLACE') ||
    val.includes('example.com')
  );
}

function isJwt(val: string): boolean {
  // A Supabase anon key is a JWT: three base64 segments separated by dots
  return /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(val);
}

// ── Diagnostic runner ─────────────────────────────────────────────────

async function runAllChecks(
  update: (id: string, patch: Partial<DiagCheck>) => void
): Promise<void> {
  const supabaseUrl = getEnv('VITE_SUPABASE_URL');
  const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY');
  const web3Key = getEnv('VITE_WEB3FORMS_ACCESS_KEY');
  const brevoKey = getEnv('VITE_BREVO_API_KEY');

  // ── Check 1: VITE_SUPABASE_URL ──────────────────────────────────────
  update('supabase_url', { status: 'running' });
  await new Promise((r) => setTimeout(r, 120));
  if (!supabaseUrl || isPlaceholder(supabaseUrl)) {
    update('supabase_url', {
      status: 'fail',
      detail: 'VITE_SUPABASE_URL is missing or is a placeholder.',
      fix: 'In Vercel → Project → Settings → Environment Variables, add VITE_SUPABASE_URL with your Supabase project URL (e.g. https://abcdefgh.supabase.co). Then redeploy.',
      docsUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    });
  } else if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
    update('supabase_url', {
      status: 'warn',
      detail: `URL looks unusual: "${supabaseUrl}". Expected format: https://YOURREF.supabase.co`,
      fix: 'Double-check the URL in your Supabase dashboard under Settings → API.',
    });
  } else {
    update('supabase_url', {
      status: 'pass',
      detail: supabaseUrl,
    });
  }

  // ── Check 2: VITE_SUPABASE_ANON_KEY ────────────────────────────────
  update('supabase_key', { status: 'running' });
  await new Promise((r) => setTimeout(r, 80));
  if (!supabaseKey || isPlaceholder(supabaseKey)) {
    update('supabase_key', {
      status: 'fail',
      detail: 'VITE_SUPABASE_ANON_KEY is missing or is a placeholder.',
      fix: 'In Vercel → Project → Settings → Environment Variables, add VITE_SUPABASE_ANON_KEY. Get it from Supabase → Settings → API → anon public key.',
      docsUrl: 'https://supabase.com/dashboard/project/_/settings/api',
    });
  } else if (!isJwt(supabaseKey)) {
    update('supabase_key', {
      status: 'warn',
      detail: 'Value does not look like a valid JWT anon key.',
      fix: 'Make sure you copied the "anon public" key from Supabase, not the service role key.',
    });
  } else {
    update('supabase_key', {
      status: 'pass',
      detail: `Key present — starts with "${supabaseKey.substring(0, 12)}..."`,
    });
  }

  // ── Check 3: Supabase reachability ──────────────────────────────────
  update('supabase_reach', { status: 'running' });
  if (supabaseUrl && !isPlaceholder(supabaseUrl)) {
    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        update('supabase_reach', {
          status: 'pass',
          detail: `Auth endpoint responded ${res.status} OK.`,
        });
      } else {
        update('supabase_reach', {
          status: 'warn',
          detail: `Auth endpoint returned HTTP ${res.status}.`,
          fix: 'Your Supabase project may be paused (inactive projects pause after 1 week on the free plan). Go to your Supabase dashboard and click "Restore project".',
          docsUrl: 'https://supabase.com/dashboard',
        });
      }
    } catch (err: any) {
      const isTimeout = err?.name === 'TimeoutError' || err?.name === 'AbortError';
      update('supabase_reach', {
        status: 'fail',
        detail: isTimeout
          ? 'Connection timed out after 8 seconds.'
          : `Network error: ${err?.message || 'unknown'}`,
        fix: 'The most common cause is a Content-Security-Policy header blocking the request. The vercel.json in this project has been fixed — make sure you have redeployed after the latest code push.',
      });
    }
  } else {
    update('supabase_reach', {
      status: 'fail',
      detail: 'Skipped — Supabase URL is not configured.',
      fix: 'Fix VITE_SUPABASE_URL first (check #1 above).',
    });
  }

  // ── Check 4: Admin user exists ──────────────────────────────────────
  update('admin_user', { status: 'running' });
  await new Promise((r) => setTimeout(r, 80));
  // We cannot verify user existence from the client (no service role key).
  // We just remind the user to create one.
  update('admin_user', {
    status: 'warn',
    detail:
      'Cannot verify from the browser. You must manually create an admin user in Supabase.',
    fix: 'Go to Supabase → Authentication → Users → Add user → enter your email and password → click Create. Use those same credentials on the login page.',
    docsUrl: 'https://supabase.com/dashboard/project/_/auth/users',
  });

  // ── Check 5: Web3Forms key ──────────────────────────────────────────
  update('web3forms', { status: 'running' });
  await new Promise((r) => setTimeout(r, 60));
  if (!web3Key || isPlaceholder(web3Key)) {
    update('web3forms', {
      status: 'warn',
      detail: 'VITE_WEB3FORMS_ACCESS_KEY is not set. Contact forms and admin notifications will not be sent.',
      fix: 'Add VITE_WEB3FORMS_ACCESS_KEY in Vercel env vars. Get a free key at web3forms.com.',
      docsUrl: 'https://web3forms.com',
    });
  } else {
    update('web3forms', {
      status: 'pass',
      detail: `Key present — ${web3Key.substring(0, 8)}...`,
    });
  }

  // ── Check 6: Brevo key ──────────────────────────────────────────────
  update('brevo', { status: 'running' });
  await new Promise((r) => setTimeout(r, 60));
  if (!brevoKey || isPlaceholder(brevoKey)) {
    update('brevo', {
      status: 'warn',
      detail: 'VITE_BREVO_API_KEY is not set. Newsletter welcome emails will not be sent.',
      fix: 'Add VITE_BREVO_API_KEY in Vercel env vars. Sign up free at app.brevo.com.',
      docsUrl: 'https://app.brevo.com',
    });
  } else {
    update('brevo', {
      status: 'pass',
      detail: `Key present — ${brevoKey.substring(0, 14)}...`,
    });
  }
}

// ── Component ──────────────────────────────────────────────────────────

const INITIAL_CHECKS: DiagCheck[] = [
  { id: 'supabase_url',   label: 'Supabase URL configured',        status: 'pending', detail: 'Waiting...' },
  { id: 'supabase_key',   label: 'Supabase anon key configured',   status: 'pending', detail: 'Waiting...' },
  { id: 'supabase_reach', label: 'Supabase auth endpoint reachable', status: 'pending', detail: 'Waiting...' },
  { id: 'admin_user',     label: 'Admin user account exists',      status: 'pending', detail: 'Waiting...' },
  { id: 'web3forms',      label: 'Web3Forms key set',              status: 'pending', detail: 'Waiting...' },
  { id: 'brevo',          label: 'Brevo email key set',            status: 'pending', detail: 'Waiting...' },
];

const StatusIcon: React.FC<{ status: CheckStatus }> = ({ status }) => {
  if (status === 'pending') return <div className="w-4 h-4 rounded-full border-2 border-slate-600 flex-shrink-0" />;
  if (status === 'running') return <Loader2 className="w-4 h-4 text-[#00D4FF] animate-spin flex-shrink-0" />;
  if (status === 'pass')    return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
  if (status === 'warn')    return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />;
  return <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />;
};

export const AdminSetupPage: React.FC = () => {
  const [checks, setChecks] = useState<DiagCheck[]>(INITIAL_CHECKS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const update = (id: string, patch: Partial<DiagCheck>) => {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  const runChecks = async () => {
    setRunning(true);
    setDone(false);
    setChecks(INITIAL_CHECKS);
    await runAllChecks(update);
    setRunning(false);
    setDone(true);
  };

  useEffect(() => {
    runChecks();
  }, []);

  const passing = checks.filter((c) => c.status === 'pass').length;
  const failing = checks.filter((c) => c.status === 'fail').length;
  const warning = checks.filter((c) => c.status === 'warn').length;

  const vercelEnvSnippet = `VITE_SUPABASE_URL=https://YOUR_REF.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
VITE_SITE_URL=https://your-vercel-domain.vercel.app
VITE_WEB3FORMS_ACCESS_KEY=88d3b270-ced2-4608-b9ca-cdc567db9d56
VITE_BREVO_API_KEY=xkeysib-your-brevo-key`;

  const copySnippet = () => {
    navigator.clipboard.writeText(vercelEnvSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#071324] text-slate-200 py-10 px-4 sm:px-6">
      <SEOHead
        title="CMS Setup & Diagnostics | KJT TECHNOLOGIES"
        description="Admin setup and environment diagnostics for KJT TECHNOLOGIES CMS."
        noIndex={true}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <BrandLogo size="sm" />
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              CMS Setup &amp; Diagnostics
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live environment checks — run after deployment or when login isn't working
            </p>
          </div>
        </div>

        {/* Summary bar */}
        {done && (
          <div className={`p-4 rounded-xl border text-sm font-semibold flex items-center gap-3 ${
            failing > 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : warning > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            {failing > 0 ? (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            ) : warning > 0 ? (
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
            )}
            <span>
              {failing > 0
                ? `${failing} critical issue${failing > 1 ? 's' : ''} found — login will not work until fixed.`
                : warning > 0
                ? `${passing} checks passed, ${warning} warning${warning > 1 ? 's' : ''}. Login should work but some features may be limited.`
                : 'All checks passed. Login should work correctly.'}
            </span>
          </div>
        )}

        {/* Checks list */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800">
          {checks.map((check, idx) => (
            <div key={check.id} className="p-4 space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusIcon status={check.status} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-bold ${
                      check.status === 'pass' ? 'text-white' :
                      check.status === 'fail' ? 'text-rose-300' :
                      check.status === 'warn' ? 'text-amber-300' :
                      'text-slate-300'
                    }`}>
                      {idx + 1}. {check.label}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      check.status === 'pass'    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      check.status === 'fail'    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                      check.status === 'warn'    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      check.status === 'running' ? 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30' :
                      'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {check.status === 'running' ? 'checking' : check.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{check.detail}</p>

                  {(check.status === 'fail' || check.status === 'warn') && check.fix && (
                    <div className="mt-2 p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1.5">
                      <p className="text-[11px] font-bold text-white uppercase tracking-wider">How to fix:</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{check.fix}</p>
                      {check.docsUrl && (
                        <a
                          href={check.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#00D4FF] hover:underline font-semibold"
                        >
                          Open in browser
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Re-run button */}
        <button
          type="button"
          onClick={runChecks}
          disabled={running}
          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-bold text-slate-200 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin' : ''}`} />
          {running ? 'Running checks...' : 'Re-run all checks'}
        </button>

        {/* Vercel env var guide */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white">
            Required Vercel Environment Variables
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Go to{' '}
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00D4FF] hover:underline"
            >
              Vercel Dashboard
            </a>{' '}
            → your project → <strong className="text-slate-200">Settings</strong> →{' '}
            <strong className="text-slate-200">Environment Variables</strong> and add each of
            these. After adding them, click{' '}
            <strong className="text-slate-200">Redeploy</strong> for them to take effect.
          </p>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
{vercelEnvSnippet}
            </pre>
            <button
              type="button"
              onClick={copySnippet}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Quick step guide */}
          <ol className="space-y-2 text-xs text-slate-400 list-none">
            {[
              ['Get Supabase URL + anon key', 'https://supabase.com/dashboard/project/_/settings/api', 'Supabase → Settings → API'],
              ['Create an admin user', 'https://supabase.com/dashboard/project/_/auth/users', 'Supabase → Authentication → Users → Add user'],
              ['Add all vars to Vercel', 'https://vercel.com/dashboard', 'Vercel → Project → Settings → Environment Variables'],
              ['Redeploy the project', 'https://vercel.com/dashboard', 'Vercel → Deployments → Redeploy latest'],
            ].map(([step, url, label], i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>
                  {step} —{' '}
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="text-[#00D4FF] hover:underline">
                    {label} <ExternalLink className="w-2.5 h-2.5 inline" />
                  </a>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link to="/admin/login" className="inline-flex items-center gap-1.5 hover:text-[#00D4FF] transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>
          <Link to="/" className="hover:text-[#00D4FF] transition">
            ← Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
