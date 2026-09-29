import React, { useState } from 'react';
import { Mail, Check, Loader2, ArrowRight } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 800);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`w-full ${className}`}>
      {status === 'success' ? (
        <div className="flex items-center gap-2 p-3.5 rounded-sm text-xs font-medium bg-emerald-950/60 border border-emerald-800 text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Subscribed! You will receive our monthly tech &amp; security dispatch.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your corporate email"
              className="w-full pl-10 pr-4 py-2.5 rounded-sm text-sm transition focus:outline-none focus:border-[#00D4FF] bg-slate-900/90 border border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-2.5 bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-sm transition-all inline-flex items-center justify-center gap-1.5 shadow-lg shadow-[#00D4FF]/20 hover:brightness-110 active:brightness-90 flex-shrink-0 disabled:opacity-50"
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
      )}
      <p className="text-[11px] mt-2 text-slate-400">
        Insights on cybersecurity, cloud scaling, and IT infrastructure. No spam, ever.
      </p>
    </div>
  );
};
