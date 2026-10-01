/**
 * =====================================================================
 * NEWSLETTER SUBSCRIPTION FORM - KJT TECHNOLOGIES
 * =====================================================================
 * Sends a welcome email to the subscriber and an admin notification
 * via the sendNewsletterSubscriptionEmail() service (Web3Forms).
 *
 * States:
 *   idle     → default form
 *   loading  → spinner while awaiting API response
 *   success  → confirmation message
 *   error    → inline error with retry option
 * =====================================================================
 */

import React, { useState } from 'react';
import { Mail, Check, Loader2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { sendNewsletterSubscriptionEmail } from '../../services/emailService';

interface NewsletterFormProps {
  theme?: 'dark' | 'light';
  className?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  theme = 'dark',
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const result = await sendNewsletterSubscriptionEmail(trimmed);

      if (result.success) {
        setStatus('success');
        setEmail('');
      } else {
        setErrorMsg(
          result.error || 'Subscription failed. Please try again or contact us directly.'
        );
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setErrorMsg('');
  };

  // ── Success state ──────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-emerald-300">Successfully subscribed!</p>
            <p className="text-[11px] text-emerald-400/80 leading-relaxed">
              A welcome email is on its way. You'll receive our monthly technology &amp;
              cybersecurity digest.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className={`w-full space-y-2 ${className}`}>
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-950/50 border border-rose-700/50 text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">{errorMsg}</p>
        </div>
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-1.5 text-[11px] text-[#00D4FF] hover:underline font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  // ── Default / Loading form ─────────────────────────────────────────
  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your corporate email"
            disabled={status === 'loading'}
            className="w-full pl-10 pr-4 py-2.5 rounded-sm text-sm transition focus:outline-none focus:border-[#00D4FF] bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-sm transition-all inline-flex items-center justify-center gap-1.5 shadow-lg shadow-[#00D4FF]/20 hover:brightness-110 active:brightness-90 flex-shrink-0 disabled:opacity-50 cursor-pointer"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#0A192F]" />
          ) : (
            <>
              <span>Subscribe</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0A192F]" />
            </>
          )}
        </button>
      </form>

      <p className="text-[11px] mt-2 text-slate-400">
        Monthly cybersecurity &amp; IT insights. No spam, ever.
      </p>
    </div>
  );
};
