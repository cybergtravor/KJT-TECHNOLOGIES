import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ArrowUp } from 'lucide-react';
import { CookieConsent } from '../common/CookieConsent';
import { WhatsAppButton } from '../common/WhatsAppButton';

export const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [pathname]);

  // Back to top visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A192F] text-slate-200 selection:bg-[#00D4FF] selection:text-[#0A192F]">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Corporate Footer */}
      <Footer />

      {/* Cookie Consent Notification */}
      <CookieConsent />

      {/* Floating Action Buttons Container */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* WhatsApp Quick Inquiries Float */}
        <WhatsAppButton />

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            id="back-to-top-button"
            className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 text-[#00D4FF] border border-slate-700/80 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
            aria-label="Scroll back to top"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
