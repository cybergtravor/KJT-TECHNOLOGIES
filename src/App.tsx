/**
 * =====================================================================
 * KJT TECHNOLOGIES - MAIN APPLICATION ROUTER & ROUTE DIRECTORY
 * =====================================================================
 * 
 * ROUTING ARCHITECTURE:
 * This file configures the single-page application (SPA) client-side routes
 * using React Router. All navigation occurs without reloading the page.
 * 
 * Public Routes: Wrapped within <Layout />, sharing the common Navbar and Footer.
 * Protected Admin Routes: Wrapped within <AdminLayout />, protected by authentication.
 * 
 * HOSTING:
 * // HOSTING: This rewrite supports React Router routes on Vercel.
 * On Vercel, `vercel.json` provides a catch-all rewrite rule (`"source": "/(.*)", "destination": "/index.html"`)
 * so that direct browser visits to any nested path (e.g., /services/cybersecurity or /request-quote)
 * are served the SPA bundle and resolved by this router.
 * =====================================================================
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostDetailPage } from './pages/BlogPostDetailPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { QuoteRequestPage } from './pages/QuoteRequestPage';
import { ConsultationBookingPage } from './pages/ConsultationBookingPage';

// Admin CMS Components
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ArticleEditorPage } from './pages/admin/ArticleEditorPage';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';
import { AdminQuotationsPage } from './pages/admin/AdminQuotationsPage';
import { AdminConsultationsPage } from './pages/admin/AdminConsultationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================================
            1. PUBLIC WEBSITE ROUTES
            Wrapped with <Layout /> for global header, navigation, and footer.
           ================================================================= */}
        <Route path="/" element={<Layout />}>
          {/* Home Page: Corporate overview, hero, metrics, core services, and trust signals */}
          <Route index element={<HomePage />} />

          {/* About Us: 9 comprehensive corporate identity and team engineering sections */}
          <Route path="about" element={<AboutPage />} />

          {/* Services Catalog & Dynamic Single Service Deep-Dive Pages */}
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/:slug" element={<ServiceDetailPage />} />

          {/* Portfolio & Case Studies: Enterprise projects, metrics, and architecture */}
          <Route path="projects" element={<ProjectsPage />} />

          {/* Technology News & Insights Hub */}
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostDetailPage />} />
          <Route path="news" element={<BlogPage />} />
          <Route path="news/:slug" element={<BlogPostDetailPage />} />

          {/* Smart Multi-Step Quotation Request System */}
          <Route path="request-quote" element={<QuoteRequestPage />} />
          <Route path="quote" element={<QuoteRequestPage />} />

          {/* Dynamic Kampala-Time Consultation Booking System */}
          <Route path="book-consultation" element={<ConsultationBookingPage />} />
          <Route path="consultation" element={<ConsultationBookingPage />} />

          {/* Frequently Asked Questions */}
          <Route path="faq" element={<FAQPage />} />

          {/* Contact Us: Direct hotline, Kampala office map, and message dispatch */}
          <Route path="contact" element={<ContactPage />} />

          {/* Legal Compliance & Terms */}
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms-and-conditions" element={<TermsPage />} />
          <Route path="terms-of-service" element={<TermsPage />} />
          <Route path="terms" element={<TermsPage />} />

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* =================================================================
            2. ADMINISTRATOR CMS ROUTES
            Protected behind <AdminLayout /> with session verification.
           ================================================================= */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="articles" element={<AdminDashboardPage />} />
          <Route path="quotations" element={<AdminQuotationsPage />} />
          <Route path="consultations" element={<AdminConsultationsPage />} />
          <Route path="articles/new" element={<ArticleEditorPage />} />
          <Route path="articles/edit/:id" element={<ArticleEditorPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

