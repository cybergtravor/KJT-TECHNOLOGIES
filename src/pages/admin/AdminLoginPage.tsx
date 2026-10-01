/**
 * =====================================================================
 * ADMIN LOGIN - KJT TECHNOLOGIES CMS
 * =====================================================================
 *
 * SECURITY CONTROLS:
 * - Rate limiting: Max 5 failed attempts per session with 60s cooldown
 * - Session expiry tracking (4 hours maximum session lifetime)
 * - Real Supabase error messages surfaced for easier diagnosing
 * - Fallback demo mode when Supabase is not configured
 * - Strict noindex — never indexed by search engines
 * =====================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  Info,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  WifiOff,
  Settings,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { BrandLogo } from '../../components/common/BrandLogo';
import { SEOHead } from '../../components/common/SEOHead';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;
const SESSION_DURATION_HOURS = 4;

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Password recovery
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const supabaseReady = isSupabaseConfigured();

  // Redirect if already logged in
  useEffect(() => {
    const isAuth = localStorage.getItem('kjt_admin_authenticated');
    const expiryStr = localStorage.getItem('kjt_admin_session_expiry');
    if (isAuth === 'true') {
      if (expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        if (!isNaN(expiry) && Date.now() < expiry) {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const emailTrimmed = email.trim().toLowerCase();
    const passwordTrimmed = password.trim();

    if (emailTrimmed.length > 150 || passwordTrimmed.length > 100) {
      setErrorMsg('Invalid credentials length.');
      setLoading(false);
      return;
    }

    // ── Supabase Auth ────────────────────────────────────────────────
    if (supabaseReady && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailTrimmed,
          password: passwordTrimmed,
        });

        if (error) {
          const newFail = failedAttempts + 1;
          setFailedAttempts(newFail);
          if (newFail >= MAX_FAILED_ATTEMPTS) {
            setLockoutRemaining(LOCKOUT_SECONDS);
            setErrorMsg(
              `Too many failed attempts. Try again in ${LOCKOUT_SECONDS} seconds.`
            );
          } else {
            // Show the real Supabase error — crucial for diagnosing production issues
            setErrorMsg(
              error.message === 'Invalid login credentials'
                ? 'Incorrect email or password. Make sure you have created an account in your Supabase dashboard under Authentication → Users.'
                : error.message
            );
          }
          setLoading(false);
          return;
        }

        if (data.session) {
          const expiryTime =
            Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;
          localStorage.setItem('kjt_admin_authenticated', 'true');
          localStorage.setItem('kjt_admin_user_email', emailTrimmed);
          localStorage.setItem('kjt_admin_session_expiry', String(expiryTime));
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      } catch (err: any) {
        // Network-level failure — Supabase unreachable
        setErrorMsg(
          'Cannot reach authentication server. Check that your Supabase URL and anon key are set in your Vercel environment variables.'
        );
        setLoading(false);
        return;
      }
    }

    // ── Demo / preview fallback ──────────────────────────────────────
    if (!supabaseReady) {
      if (emailTrimmed && passwordTrimmed.length >= 8) {
        const expiryTime = Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;
        localStorage.setItem('kjt_admin_authenticated', 'true');
        localStorage.setItem('kjt_admin_user_email', emailTrimmed);
        localStorage.setItem('kjt_admin_session_expiry', String(expiryTime));
        navigate('/admin/dashboard', { replace: true });
      } else {
        const newFail = failedAttempts + 1;
        setFailedAttempts(newFail);
        if (newFail >= MAX_FAILED_ATTEMPTS) {
          setLockoutRemaining(LOCKOUT_SECONDS);
          setErrorMsg(
            `Too many failed attempts. Try again in ${LOCKOUT_SECONDS} seconds.`
          );
        } else {
          setErrorMsg(
            'In demo mode (Supabase not configured), password must be at least 8 characters.'
          );
        }
      }
    }

    setLoading(false);
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoveryMessage('');
    setRecoveryLoading(true);

    const emailToReset = recoveryEmail.trim().toLowerCase();
    if (!emailToReset || !emailToReset.includes('@')) {
      setRecoveryError('Please enter a valid administrator email address.');
      setRecoveryLoading(false);
      return;
    }

    if (supabaseReady && supabase) {
      try {
        const productionUrl =
          (import.meta as any).env?.VITE_SITE_URL ||
          window.location.origin;
        await supabase.auth.resetPasswordForEmail(emailToReset, {
          redirectTo: `${productionUrl}/admin/login`,
        });
        setRecoveryMessage(
          'If an account exists for this email, a reset link has been sent. Check your inbox (and spam folder).'
        );
      } catch {
        setRecoveryMessage(
          'Password reset request processed. If this email is registered, instructions have been sent.'
        );
      }
    } else {
      setRecoveryMessage(
        'Supabase Auth is not configured. Once your environment variables are set on Vercel, password resets will work automatically.'
      );
    }

    setRecoveryLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#071324] text-slate-200 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEOHead
        title="Website Administration | KJT TECHNOLOGIES"
        description="Authorized Content Management System login for KJT TECHNOLOGIES."
        noIndex={true}
      />

      {/* Background dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Brand + title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4 text-center">
        <div className="flex justify-center">
          <BrandLogo size="lg" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Website Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Private Administrator Content Management System
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 py-8 px-6 sm:px-10 rounded-2xl border border-slate-800 shadow-2xl space-y-5">

          {/* ── Connection status banner ────────────────────────────── */}
          {!supabaseReady ? (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Supabase Not Configured</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                The environment variables <code className="bg-slate-800 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
                <code className="bg-slate-800 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> are not set on this
                deployment. You can still log in using any email and a password of 8+ characters (demo mode), but
                articles will only be saved to this browser's localStorage.
              </p>
              <Link
                to="/admin/setup"
                className="inline-flex items-center gap-1 text-[#00D4FF] hover:underline font-semibold text-[11px]"
              >
                <Settings className="w-3 h-3" />
                Open Setup &amp; Diagnostics →
              </Link>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Connected to Supabase Cloud Authentication</span>
            </div>
          )}

          {/* ── Lockout banner ─────────────────────────────────────── */}
          {lockoutRemaining > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span>
                Login locked for <strong>{lockoutRemaining}s</strong> — too many failed attempts.
              </span>
            </div>
          )}

          {/* ── Error ──────────────────────────────────────────────── */}
          {errorMsg && lockoutRemaining === 0 && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
              {/* Guide to setup page if it looks like a config issue */}
              {(errorMsg.includes('environment') ||
                errorMsg.includes('Supabase') ||
                errorMsg.includes('server')) && (
                <Link
                  to="/admin/setup"
                  className="inline-flex items-center gap-1 text-[#00D4FF] hover:underline font-semibold pl-6"
                >
                  <Settings className="w-3 h-3" />
                  Run diagnostics →
                </Link>
              )}
            </div>
          )}

          {/* ── Success ────────────────────────────────────────────── */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ── Login form ─────────────────────────────────────────── */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kjttechnologies.com"
                  maxLength={150}
                  required
                  disabled={lockoutRemaining > 0}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(true)}
                  className="text-[11px] text-[#00D4FF] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  maxLength={100}
                  required
                  disabled={lockoutRemaining > 0}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF] disabled:opacity-50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutRemaining > 0}
              className="w-full py-3 px-4 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-[#00D4FF]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to CMS</span>
                </>
              )}
            </button>
          </form>

          {/* ── Footer row ─────────────────────────────────────────── */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <Link
              to="/"
              className="text-slate-400 hover:text-[#00D4FF] transition inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </Link>
            <Link
              to="/admin/setup"
              className="text-slate-500 hover:text-[#00D4FF] transition inline-flex items-center gap-1 text-[11px]"
            >
              <Settings className="w-3 h-3" />
              <span>Diagnostics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Password recovery modal ──────────────────────────────────── */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-white">
              <KeyRound className="w-5 h-5 text-[#00D4FF]" />
              <h3 className="text-base font-bold">Administrator Password Reset</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your registered administrator email. A secure, time-limited reset link will
              be sent to your inbox.
            </p>

            {recoveryMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{recoveryMessage}</span>
              </div>
            )}
            {recoveryError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>{recoveryError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordRecovery} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="admin@kjttechnologies.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowRecoveryModal(false);
                    setRecoveryMessage('');
                    setRecoveryError('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="px-4 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] font-bold text-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {recoveryLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
