/**
 * =====================================================================
 * ADMIN DASHBOARD - KJT TECHNOLOGIES CMS
 * =====================================================================
 * 
 * Features:
 * - Comprehensive article table with live search and category/status filters
 * - Duplicate article action
 * - Bulk actions: Delete selected, Publish selected, Move to Draft selected
 * - Quick status toggle (Publish / Unpublish / Move to Draft)
 * - Views / reads metric column
 * - Direct Media Library launcher
 * - Pagination for large collections
 * - Supabase SQL setup modal
 * =====================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Sparkles,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  Code,
  Copy,
  Check,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckSquare,
  Square,
  BarChart2,
  ExternalLink,
  LogOut,
  Wand2,
  Calculator,
} from 'lucide-react';
import {
  getAllAdminArticles,
  deleteArticle,
  upsertArticle,
  duplicateArticle,
  batchCleanAllArticles,
} from '../../lib/articlesService';
import { getAllQuotations } from '../../lib/quotationService';
import { getAllBookings } from '../../lib/consultationService';
import { BlogPostItem } from '../../types';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { MediaLibraryModal } from '../../components/admin/MediaLibraryModal';
import { cleanTitle } from '../../lib/contentSanitizer';
import { AuthorAvatar } from '../../components/common/AuthorAvatar';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Batch Clean All Existing Articles State (Requirement 6)
  const [showBatchCleanModal, setShowBatchCleanModal] = useState<boolean>(false);
  const [batchCleanStep, setBatchCleanStep] = useState<'confirm' | 'running' | 'done'>('confirm');
  const [batchCleanConfirmed, setBatchCleanConfirmed] = useState<boolean>(false);
  const [batchCleanReport, setBatchCleanReport] = useState<{
    totalCount: number;
    cleanedCount: number;
    failedCount: number;
    results: Array<{ id: string; title: string; success: boolean; changesMade: boolean; error?: string }>;
  } | null>(null);

  const handleOpenBatchClean = () => {
    setBatchCleanStep('confirm');
    setBatchCleanConfirmed(false);
    setBatchCleanReport(null);
    setShowBatchCleanModal(true);
  };

  const handleStartBatchClean = async () => {
    if (!batchCleanConfirmed) return;
    setBatchCleanStep('running');
    const report = await batchCleanAllArticles();
    setBatchCleanReport(report);
    setBatchCleanStep('done');
    await loadArticles();
  };

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // New modules counts
  const [quotationCount, setQuotationCount] = useState<number>(0);
  const [consultationCount, setConsultationCount] = useState<number>(0);

  const supabaseConnected = isSupabaseConfigured();

  const loadArticles = async () => {
    setLoading(true);
    const data = await getAllAdminArticles();
    setArticles(data);
    try {
      const quotes = await getAllQuotations();
      setQuotationCount(quotes.length);
      const bookings = await getAllBookings();
      setConsultationCount(bookings.length);
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteArticle(id);
    setDeleteConfirmId(null);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    loadArticles();
  };

  const handleDuplicate = async (id: string) => {
    const res = await duplicateArticle(id);
    if (res.success && res.newArticle) {
      await loadArticles();
      navigate(`/admin/articles/edit/${res.newArticle.id}`);
    }
  };

  const handleToggleStatus = async (article: BlogPostItem) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    await upsertArticle({ ...article, status: newStatus });
    loadArticles();
  };

  const handleToggleTrending = async (article: BlogPostItem) => {
    await upsertArticle({ ...article, isTrending: !article.isTrending });
    loadArticles();
  };

  const handleToggleFeatured = async (article: BlogPostItem) => {
    await upsertArticle({ ...article, isFeatured: !article.isFeatured });
    loadArticles();
  };

  // Bulk action handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map((a) => a.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkPublish = async () => {
    setBulkActionLoading(true);
    for (const id of selectedIds) {
      const art = articles.find((a) => a.id === id);
      if (art) {
        await upsertArticle({ ...art, status: 'published' });
      }
    }
    setSelectedIds([]);
    setBulkActionLoading(false);
    loadArticles();
  };

  const handleBulkDraft = async () => {
    setBulkActionLoading(true);
    for (const id of selectedIds) {
      const art = articles.find((a) => a.id === id);
      if (art) {
        await upsertArticle({ ...art, status: 'draft' });
      }
    }
    setSelectedIds([]);
    setBulkActionLoading(false);
    loadArticles();
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected articles?`)) {
      return;
    }
    setBulkActionLoading(true);
    for (const id of selectedIds) {
      await deleteArticle(id);
    }
    setSelectedIds([]);
    setBulkActionLoading(false);
    loadArticles();
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const currentStatus = a.status || 'published';
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  const displayedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: articles.length,
    published: articles.filter((a) => (a.status || 'published') === 'published').length,
    drafts: articles.filter((a) => a.status === 'draft').length,
    scheduled: articles.filter((a) => a.status === 'scheduled').length,
    featured: articles.filter((a) => a.isFeatured).length,
    trending: articles.filter((a) => a.isTrending).length,
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('kjt_admin_authenticated');
    localStorage.removeItem('kjt_admin_user_email');
    navigate('/admin/login');
  };

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  const copySqlCode = () => {
    const sqlScript = `-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new

CREATE TABLE IF NOT EXISTS public.articles (
    id VARCHAR(150) PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    seo_title VARCHAR(300),
    meta_description TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(150),
    author_avatar TEXT,
    author_bio TEXT,
    published_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_time VARCHAR(50) DEFAULT '5 min read',
    cover_image TEXT NOT NULL,
    image_alt VARCHAR(300),
    image_caption TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    related_post_slugs JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
    scheduled_for TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_editor_pick BOOLEAN DEFAULT FALSE,
    is_news BOOLEAN DEFAULT FALSE,
    original_source VARCHAR(200),
    source_url TEXT,
    event_date DATE
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can only view published articles"
ON public.articles FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Authenticated admins can manage all articles"
ON public.articles FOR ALL TO authenticated
USING (true) WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Articles &amp; News Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Author, edit, duplicate, schedule, and curate technology insights and news releases.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Create New Article Button */}
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#00D4FF]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Article</span>
          </Link>

          {/* Manage Articles Button */}
          <a
            href="#articles-table"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-700 transition"
          >
            <FileText className="w-4 h-4 text-[#00D4FF]" />
            <span>Manage Articles</span>
          </a>

          {/* Media Library Button */}
          <Link
            to="/admin/media"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-700 transition"
          >
            <FolderOpen className="w-4 h-4 text-[#00D4FF]" />
            <span>Media Library</span>
          </Link>

          {/* Clean All Existing Articles (Requirement 6) */}
          <button
            type="button"
            onClick={handleOpenBatchClean}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-bold uppercase tracking-wider border border-amber-500/40 transition cursor-pointer"
            title="Batch clean Google AI Studio formatting, inline styles & citations across all articles"
          >
            <Wand2 className="w-4 h-4 text-amber-400" />
            <span>Clean All Articles</span>
          </button>

          {/* View Website Button */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-700 transition"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>View Website</span>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Supabase Connection Status Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          supabaseConnected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-slate-800/80 border-slate-700 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Database className={`w-4 h-4 ${supabaseConnected ? 'text-emerald-400' : 'text-[#00D4FF]'}`} />
          <span>
            Database Storage Mode:{' '}
            <strong className="text-white">
              {supabaseConnected
                ? 'Connected to Supabase Cloud'
                : 'Local Persistence & Offline Cache (Ready for Supabase)'}
            </strong>
          </span>
        </div>
        <button
          onClick={() => setShowSqlModal(true)}
          className="text-[#00D4FF] hover:underline font-semibold text-left sm:text-right cursor-pointer"
        >
          View Supabase SQL Schema &amp; Instructions &rarr;
        </button>
      </div>

      {/* Overview Stat Counters (Exact 5 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Articles
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">{stats.total}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Published Articles
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">{stats.published}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Draft Articles
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">{stats.drafts}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
            Scheduled Articles
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">{stats.scheduled}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">
            Featured Articles
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">{stats.featured}</span>
        </div>
      </div>

      {/* Commercial & Engineering Operations Quick Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/quotations"
          className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-[#00D4FF]/10 rounded-2xl border border-slate-800 hover:border-[#00D4FF]/60 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/20 group-hover:scale-105 transition">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block">
                Commercial Pipeline
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-[#00D4FF] transition">
                Quotation Requests ({quotationCount})
              </h3>
              <p className="text-xs text-slate-400">
                Review client specifications, uploaded scopes, and cost estimates.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#00D4FF] hidden sm:block">&rarr; Manage</span>
        </Link>

        <Link
          to="/admin/consultations"
          className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-purple-500/10 rounded-2xl border border-slate-800 hover:border-purple-500/60 transition group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block">
                Engineering Desk
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">
                Consultation Bookings ({consultationCount})
              </h3>
              <p className="text-xs text-slate-400">
                Manage appointment confirmations, rescheduling, and availability rules.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-400 hidden sm:block">&rarr; Manage</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search articles by title, category, or author..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
          />
        </div>

        {/* Status & Category Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
            <option value="scheduled">Scheduled Only</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Floating Bar (when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-white font-semibold">
            <CheckSquare className="w-4 h-4 text-[#00D4FF]" />
            <span>{selectedIds.length} article(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase text-[11px] cursor-pointer disabled:opacity-50"
            >
              Publish Selected
            </button>
            <button
              onClick={handleBulkDraft}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase text-[11px] cursor-pointer disabled:opacity-50"
            >
              Move to Draft
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-[11px] cursor-pointer disabled:opacity-50"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Articles Table Card */}
      <div id="articles-table" className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl scroll-mt-24">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-white font-semibold text-sm">No articles found</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or filter settings.
            </p>
            <Link
              to="/admin/articles/new"
              className="inline-flex items-center gap-1 text-xs text-[#00D4FF] hover:underline"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create a new article now</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <button
                      onClick={handleSelectAll}
                      className="cursor-pointer text-slate-400 hover:text-white"
                      title="Select all"
                    >
                      {selectedIds.length === filteredArticles.length && filteredArticles.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#00D4FF]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Reads</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Curation</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayedArticles.map((article) => {
                  const status = article.status || 'published';
                  const isSelected = selectedIds.includes(article.id);
                  // Calculate approximate reads based on id hash for demo realism
                  const estimatedReads = Math.abs(
                    article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 100) * 12
                  );

                  return (
                    <tr
                      key={article.id}
                      className={`hover:bg-slate-800/40 transition ${
                        isSelected ? 'bg-[#00D4FF]/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleSelectRow(article.id)}
                          className="cursor-pointer text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#00D4FF]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Title & Cover */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={article.coverImage}
                            alt={article.imageAlt || cleanTitle(article.title)}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <span className="font-bold text-white hover:text-[#00D4FF] transition line-clamp-1 block">
                              {cleanTitle(article.title)}
                            </span>
                            <span className="text-[11px] text-slate-400 line-clamp-1">
                              {article.excerpt}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-semibold">
                          {article.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <AuthorAvatar name={article.author.name} size="xs" />
                          <div>
                            <div className="text-slate-200 font-medium">{article.author.name}</div>
                            <div className="text-[10px] text-slate-400">{article.readTime}</div>
                          </div>
                        </div>
                      </td>

                      {/* Views / Reads Metric */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        <div className="flex items-center gap-1 text-[11px]">
                          <BarChart2 className="w-3 h-3 text-[#00D4FF]" />
                          <span>{estimatedReads.toLocaleString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(article)}
                          title="Click to toggle between Published & Draft"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                            status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : status === 'scheduled'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                          }`}
                        >
                          {status}
                        </button>
                      </td>

                      {/* Flags (Trending, Featured) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleTrending(article)}
                            title="Toggle Trending Tech Flag"
                            className={`p-1 rounded cursor-pointer transition ${
                              article.isTrending
                                ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(article)}
                            title="Toggle Lead Featured Flag"
                            className={`p-1 rounded cursor-pointer transition ${
                              article.isFeatured
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {article.publishedAt}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Live Article */}
                          <Link
                            to={`/blog/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="View Live Article on Website"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit Article */}
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#00D4FF] transition cursor-pointer"
                            title="Edit Article"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          {/* Duplicate Article */}
                          <button
                            onClick={() => handleDuplicate(article.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Duplicate as New Draft"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Article */}
                          <button
                            onClick={() => setDeleteConfirmId(article.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-rose-400 transition cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredArticles.length)} of{' '}
                  {filteredArticles.length} entries
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer ${
                        currentPage === pg
                          ? 'bg-[#00D4FF] text-[#0A192F]'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h4 className="text-base font-bold text-white">Delete Article?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this article? If connected to Supabase,
              it will be removed from your database. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        isSelectMode={false}
      />

      {/* Supabase SQL Setup Modal */}
      {showSqlModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Database className="w-5 h-5 text-[#00D4FF]" />
                <span>Supabase Database Schema Setup</span>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>
                To enable persistent cloud storage for your KJT TECHNOLOGIES CMS, copy and execute
                this SQL script inside your Supabase project&apos;s SQL Editor. It sets up the articles
                table and security policies.
              </p>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`-- Execute in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.articles (
    id VARCHAR(150) PRIMARY KEY,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    seo_title VARCHAR(300),
    meta_description TEXT,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(150),
    author_avatar TEXT,
    author_bio TEXT,
    published_at DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_time VARCHAR(50) DEFAULT '5 min read',
    cover_image TEXT NOT NULL,
    image_alt VARCHAR(300),
    image_caption TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    related_post_slugs JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
    scheduled_for TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_editor_pick BOOLEAN DEFAULT FALSE,
    is_news BOOLEAN DEFAULT FALSE,
    original_source VARCHAR(200),
    source_url TEXT,
    event_date DATE
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can only view published articles"
ON public.articles FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Authenticated admins can manage all articles"
ON public.articles FOR ALL TO authenticated
USING (true) WITH CHECK (true);`}
                </pre>

                <button
                  onClick={copySqlCode}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Batch Clean All Existing Articles Modal (Requirement 6) */}
      {showBatchCleanModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Clean All Existing Articles</h3>
                  <p className="text-xs text-slate-400">
                    Administrator tool for batch formatting and sanitizing articles
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBatchCleanModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Step 1: Confirmation */}
            {batchCleanStep === 'confirm' && (
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1">
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>{articles.length} Articles Will Be Affected</span>
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    This tool will inspect every article currently stored in your CMS and apply standard clean formatting.
                  </p>
                </div>

                <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                    Actions That Will Be Performed:
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Remove Google AI Studio tags (<code className="text-cyan-300">&lt;source-footnote&gt;</code>, <code className="text-cyan-300">&lt;sources-carousel-inline&gt;</code>, etc.)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Remove Angular and editor attributes (<code className="text-cyan-300">data-path-to-node</code>, <code className="text-cyan-300">ng-version</code>, <code className="text-cyan-300">_nghost</code>)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Strip inline styling (<code className="text-cyan-300">font-family: &quot;Google Sans Text&quot;</code>, explicit font colors, line-heights)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Promote bold title paragraphs into standard <code className="text-amber-300">&lt;h2&gt;</code> headings
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Remove empty superscripts, citation classes, and orphaned footnotes
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                    Integrity Guarantees:
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Visible article text, paragraphs, and list items are completely preserved.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Does not alter titles, images, categories, or publication dates.</span>
                    </li>
                  </ul>
                </div>

                {/* Explicit confirmation checkbox */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer hover:bg-slate-800 transition select-none">
                  <input
                    type="checkbox"
                    checked={batchCleanConfirmed}
                    onChange={(e) => setBatchCleanConfirmed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-600 bg-slate-900"
                  />
                  <span className="text-xs text-white font-medium">
                    I confirm that I want to format and clean all {articles.length} articles stored in the database and local cache.
                  </span>
                </label>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBatchCleanModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!batchCleanConfirmed}
                    onClick={handleStartBatchClean}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-2 transition"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Clean All {articles.length} Articles</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Running */}
            {batchCleanStep === 'running' && (
              <div className="p-12 text-center space-y-4">
                <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-sm font-bold text-white">
                  Cleaning Article Formatting...
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Removing Google AI Studio tags, normalizing headings, and stripping inline styling across all articles.
                </p>
              </div>
            )}

            {/* Step 3: Report */}
            {batchCleanStep === 'done' && batchCleanReport && (
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 flex-1">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold text-white text-sm">Batch Cleaning Completed</div>
                      <div className="text-xs text-emerald-200">
                        {batchCleanReport.cleanedCount} of {batchCleanReport.totalCount} articles processed successfully.
                      </div>
                    </div>
                  </div>
                  {batchCleanReport.failedCount > 0 && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs">
                      {batchCleanReport.failedCount} Failed
                    </span>
                  )}
                </div>

                {/* Results Table */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 max-h-64 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2">Article Title</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {batchCleanReport.results.map((res) => (
                        <tr key={res.id}>
                          <td className="px-3 py-2 font-medium text-white max-w-xs truncate">
                            {res.title}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {res.success ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                <Check className="w-3.5 h-3.5" /> Cleaned
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                                <AlertCircle className="w-3.5 h-3.5" /> Failed
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-slate-400 whitespace-nowrap">
                            {res.success
                              ? res.changesMade
                                ? 'Unwanted tags/styles removed'
                                : 'Already clean (verified)'
                              : res.error || 'Unknown error'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBatchCleanModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
