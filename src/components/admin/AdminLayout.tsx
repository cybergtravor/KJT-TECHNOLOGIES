/**
 * =====================================================================
 * ADMIN LAYOUT - KJT TECHNOLOGIES CMS
 * =====================================================================
 *
 * Secure administrator shell with:
 * - Session expiry enforcement (4-hour rolling timeout)
 * - Live Supabase auth listener (auto logout on revoked tokens)
 * - Search engine indexing blocked (<SEOHead noIndex={true} />)
 * - Mobile responsive drawer navigation for all admin tabs
 *
 * FIXES APPLIED:
 * - handleLogout hoisted with useCallback so useEffect can safely depend on it
 * - Auth check runs only once on mount via authChecked ref (no navigate loops)
 * - Supabase listener cleanup properly scoped inside conditional block
 * =====================================================================
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  ExternalLink,
  LogOut,
  FolderOpen,
  Calculator,
  Calendar,
  Menu,
  X,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { SEOHead } from '../common/SEOHead';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authChecked = useRef(false);

  // ── Logout handler (useCallback so useEffect dependency is stable) ──
  const handleLogout = useCallback(async () => {
    // Sign out from Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Non-blocking — clear local state regardless
      }
    }
    localStorage.removeItem('kjt_admin_authenticated');
    localStorage.removeItem('kjt_admin_user_email');
    localStorage.removeItem('kjt_admin_session_expiry');
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  // ── Auth guard — runs once on mount ──────────────────────────────────
  useEffect(() => {
    if (authChecked.current) return;
    authChecked.current = true;

    const isAuth = localStorage.getItem('kjt_admin_authenticated');
    if (isAuth !== 'true') {
      navigate('/admin/login', { replace: true });
      return;
    }

    // Session expiry check
    const expiryStr = localStorage.getItem('kjt_admin_session_expiry');
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      if (!isNaN(expiry) && Date.now() > expiry) {
        handleLogout();
        return;
      }
    }

    // Supabase real-time auth state listener
    if (isSupabaseConfigured() && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (
          event === 'SIGNED_OUT' ||
          (!session && localStorage.getItem('kjt_admin_authenticated') === 'true')
        ) {
          handleLogout();
        }
      });
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [navigate, handleLogout]);

  const navItems = [
    { label: 'Articles', path: '/admin/dashboard', icon: FileText },
    { label: 'Quotations', path: '/admin/quotations', icon: Calculator },
    { label: 'Consultations', path: '/admin/consultations', icon: Calendar },
    { label: 'New Article', path: '/admin/articles/new', icon: PlusCircle },
    { label: 'Media', path: '/admin/media', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-[#071324] text-slate-200 flex flex-col">
      <SEOHead
        title="Admin Management Portal | KJT TECHNOLOGIES"
        description="Internal Content Management System for KJT TECHNOLOGIES."
        noIndex={true}
      />

      {/* ── Top Navbar ───────────────────────────────────────────────── */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          {/* Brand + Desktop nav */}
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="flex items-center gap-3 group">
              <BrandLogo size="sm" disableLink />
              <div className="hidden sm:block">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00D4FF] block group-hover:text-white transition-colors">
                  CMS Engine
                </span>
                <span className="text-[10px] text-slate-400">Content Administration</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/admin/dashboard' && location.pathname === '/admin/articles');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'bg-[#00D4FF] text-[#0A192F]'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-[#00D4FF] bg-slate-800/60 border border-slate-700/60 transition-colors"
            >
              <span>Public Blog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Sign-out button — calls stable handleLogout reference */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle admin menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Dropdown ───────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-[#00D4FF] text-[#0A192F]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <Link
                to="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-[#00D4FF] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Public Blog</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-white hover:bg-rose-600/20 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
