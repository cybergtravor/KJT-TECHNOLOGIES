import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kjt_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kjt_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleEssential = () => {
    localStorage.setItem('kjt_cookie_consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-5 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-2xl text-slate-200">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-[#00D4FF]" />
            <span>Data Privacy &amp; Cookies</span>
          </div>
          <button
            onClick={handleEssential}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Close cookie consent banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          KJT TECHNOLOGIES uses cookies to ensure our portal operates securely, analyze traffic performance, and improve user experience in accordance with our{' '}
          <Link to="/privacy-policy" className="text-[#00D4FF] hover:underline">
            Privacy Policy
          </Link>.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-3 rounded-sm bg-[#00D4FF] text-[#0A192F] text-xs font-bold uppercase tracking-wider hover:brightness-110 transition cursor-pointer"
          >
            Accept All
          </button>
          <button
            onClick={handleEssential}
            className="flex-1 py-2 px-3 rounded-sm bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
};
