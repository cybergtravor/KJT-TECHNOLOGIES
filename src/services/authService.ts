/**
 * =====================================================================
 * AUTH SERVICE - KJT TECHNOLOGIES CMS
 * =====================================================================
 * 
 * Reusable authentication service managing administrator sessions,
 * login verification, token persistence, and sign-out logic.
 * 
 * BACKEND SETUP:
 * Uses Supabase Auth (`supabase.auth`) when `VITE_SUPABASE_URL` and
 * `VITE_SUPABASE_ANON_KEY` are provided in your environment variables.
 * Falls back gracefully to local demo credentials when running in preview mode.
 * 
 * SECURITY NOTE:
 * // SECURITY: Never place a service-role key in frontend code.
 * Only the public anon key (`VITE_SUPABASE_ANON_KEY`) is used here.
 * Privileged operations must be executed on a serverless function or Supabase Edge Function.
 * =====================================================================
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AdminUser {
  id: string;
  email: string;
  role?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
}

const LOCAL_STORAGE_AUTH_KEY = 'kjt_admin_authenticated';
const LOCAL_STORAGE_EMAIL_KEY = 'kjt_admin_user_email';
const LOCAL_STORAGE_EXPIRY_KEY = 'kjt_admin_session_expiry';
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4-hour rolling session

/**
 * Write session expiry timestamp (rolling 4-hour window)
 */
function writeSessionExpiry(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_EXPIRY_KEY, String(Date.now() + SESSION_DURATION_MS));
}

/**
 * Check whether an administrator is currently authenticated
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) === 'true';
}

/**
 * Get current stored administrator email
 */
export function getAdminEmail(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(LOCAL_STORAGE_EMAIL_KEY) || 'admin@kjttechnologies.com';
}

/**
 * Authenticate administrator using email and password
 */
export async function signInAdmin(email: string, password: string): Promise<AuthResult> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { success: false, error: 'Email and password are required.' };
  }

  // 1. Supabase Cloud Authentication (Production & Staging)
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'true');
        localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, data.user.email || trimmedEmail);
        writeSessionExpiry();
        return {
          success: true,
          user: {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            role: data.user.role,
          },
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Authentication failed. Please check network connection.',
      };
    }
  }

  // 2. Demo / Preview fallback mode when Supabase is not yet configured
  // Allows testing dashboard views before database credentials are provisioned
  if (!isSupabaseConfigured()) {
    if (trimmedPassword.length >= 6) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'true');
      localStorage.setItem(LOCAL_STORAGE_EMAIL_KEY, trimmedEmail);
      writeSessionExpiry();
      return {
        success: true,
        user: {
          id: 'demo-admin-id',
          email: trimmedEmail,
          role: 'administrator',
        },
      };
    }
    return {
      success: false,
      error: 'In preview mode, password must be at least 6 characters.',
    };
  }

  return { success: false, error: 'Unable to authenticate. Please check your credentials.' };
}

/**
 * Sign out administrator and clear stored credentials
 */
export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase sign out error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    localStorage.removeItem(LOCAL_STORAGE_EMAIL_KEY);
    localStorage.removeItem(LOCAL_STORAGE_EXPIRY_KEY);
  }
}

/**
 * Get the current Supabase session
 */
export async function getCurrentAdminSession() {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (e) {
    return null;
  }
}
