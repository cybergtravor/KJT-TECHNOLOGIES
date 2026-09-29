/**
 * =====================================================================
 * KJT TECHNOLOGY NEWS & INSIGHTS - MAIN EDITORIAL HUB
 * =====================================================================
 * 
 * Motto: “Accelerating Innovation, Securing Data.”
 * 
 * Architecture:
 * 1. Compact Editorial Header:
 *    - "Technology News & Insights" title
 *    - Official introduction statement
 *    - Search box (searches title, summary, category, tags)
 *    - Category navigation pills
 *    - Live latest-news indicator ticker
 * 
 * 2. News Layering Hierarchy:
 *    - Lead Story (large image, category, strong headline, excerpt, author, date, read time, Read Full Story button)
 *    - Top Stories (2-4 prominent stories with medium-sized images)
 *    - Latest News (chronological stream with smaller thumbnails, categories, dates, summaries)
 *    - 10 Topic Sections with "View All" filters:
 *        • Trending Technology
 *        • Artificial Intelligence
 *        • Cybersecurity
 *        • Software and Applications
 *        • Business Technology
 *        • Emerging Technology
 *        • African Technology
 *        • Technology in Uganda
 *        • Tutorials and Guides
 *        • KJT TECHNOLOGIES Updates
 *    - Most Read & Editor's Picks sidebar (desktop) / bottom section (mobile)
 * 
 * 3. Search & Filter Controls:
 *    - Title, summary, category, and tag matching
 *    - Category filter tabs
 *    - Sort by Newest / Oldest
 *    - Featured and Trending filter toggles
 *    - Clear all filters
 *    - Load More pagination & professional empty results state
 * =====================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Cpu,
  Bookmark,
  Share2,
  BookOpen,
  Filter,
  CheckCircle2,
  Flame,
  Globe,
  Radio,
  ArrowUpDown,
  X,
  Code,
  Layers,
  GraduationCap,
  Building2,
  Zap,
  Tag,
  Mail,
  HelpCircle,
  Newspaper,
  Compass,
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { NewsletterForm } from '../components/common/NewsletterForm';
import { ArticleCard } from '../components/blog/ArticleCard';
import { AuthorAvatar } from '../components/common/AuthorAvatar';
import { getPublishedArticles } from '../lib/articlesService';
import { BlogPostItem } from '../types';

// Suggested categories matching specification
const CATEGORIES = [
  { label: 'All News', id: 'All News' },
  { label: 'Latest', id: 'Latest' },
  { label: 'Trending', id: 'Trending' },
  { label: 'Artificial Intelligence', id: 'Artificial Intelligence' },
  { label: 'Cybersecurity', id: 'Cybersecurity' },
  { label: 'Software', id: 'Software' },
  { label: 'Business Technology', id: 'Business Technology' },
  { label: 'Emerging Technology', id: 'Emerging Technology' },
  { label: 'Africa', id: 'Africa' },
  { label: 'Uganda', id: 'Uganda' },
  { label: 'Tutorials', id: 'Tutorials' },
  { label: 'KJT Updates', id: 'KJT Updates' },
] as const;

export const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All News');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [onlyTrending, setOnlyTrending] = useState<boolean>(false);
  const [visibleFilteredCount, setVisibleFilteredCount] = useState<number>(9);
  const [visibleLatestCount, setVisibleLatestCount] = useState<number>(6);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const data = await getPublishedArticles();
      setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  // Determine latest news story for the live ticker
  const latestArticleForTicker = useMemo(() => {
    if (articles.length === 0) return null;
    return [...articles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )[0];
  }, [articles]);

  // Lead Story: Curated featured article or first article
  const leadArticle = useMemo(() => {
    if (articles.length === 0) return null;
    return (
      articles.find((a) => a.isFeatured && a.category !== 'KJT TECHNOLOGIES Updates') ||
      articles.find((a) => a.isFeatured) ||
      articles[0]
    );
  }, [articles]);

  // Top Stories: 2 to 4 important stories excluding the lead
  const topStories = useMemo(() => {
    if (!leadArticle) return [];
    return articles
      .filter((a) => a.id !== leadArticle.id)
      .slice(0, 3);
  }, [articles, leadArticle]);

  // Latest News (Chronological list excluding lead)
  const chronologicalLatestNews = useMemo(() => {
    const sorted = [...articles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    if (!leadArticle) return sorted;
    return sorted.filter((a) => a.id !== leadArticle.id);
  }, [articles, leadArticle]);

  // Most Read & Editor's Picks
  const editorsPicks = useMemo(() => {
    return articles
      .filter((a) => a.isEditorPick || a.isFeatured)
      .slice(0, 4);
  }, [articles]);

  const trendingSidebar = useMemo(() => {
    return articles
      .filter((a) => a.isTrending)
      .slice(0, 4);
  }, [articles]);

  // Category matching helper
  const matchesCategory = (article: BlogPostItem, cat: string): boolean => {
    const catLower = cat.toLowerCase();
    const articleCatLower = article.category.toLowerCase();
    const tagsLower = article.tags.map((t) => t.toLowerCase());

    if (cat === 'All News') return true;
    if (cat === 'Latest') return true;
    if (cat === 'Trending') return Boolean(article.isTrending);
    if (cat === 'Artificial Intelligence') {
      return articleCatLower.includes('artificial') || tagsLower.includes('ai') || tagsLower.includes('artificial intelligence');
    }
    if (cat === 'Cybersecurity') {
      return articleCatLower.includes('cyber') || tagsLower.some((t) => t.includes('security') || t.includes('cyber'));
    }
    if (cat === 'Software') {
      return articleCatLower.includes('software') || tagsLower.some((t) => t.includes('software') || t.includes('app'));
    }
    if (cat === 'Business Technology') {
      return articleCatLower.includes('business') || tagsLower.some((t) => t.includes('business') || t.includes('enterprise'));
    }
    if (cat === 'Emerging Technology') {
      return articleCatLower.includes('emerging') || tagsLower.some((t) => t.includes('emerging') || t.includes('trends'));
    }
    if (cat === 'Africa') {
      return articleCatLower.includes('africa') || tagsLower.some((t) => t.includes('africa') || t.includes('african'));
    }
    if (cat === 'Uganda') {
      return articleCatLower.includes('uganda') || tagsLower.some((t) => t.includes('uganda') || t.includes('ugandan'));
    }
    if (cat === 'Tutorials') {
      return articleCatLower.includes('tutorial') || articleCatLower.includes('guide') || tagsLower.some((t) => t.includes('tutorial') || t.includes('guide') || t.includes('practice'));
    }
    if (cat === 'KJT Updates') {
      return articleCatLower.includes('kjt') || tagsLower.some((t) => t.includes('kjt') || t.includes('company news'));
    }

    return articleCatLower === catLower || tagsLower.includes(catLower);
  };

  // 10 Topic Sections data sets
  const topicSections = useMemo(() => {
    return [
      {
        id: 'Trending Technology',
        title: 'Trending Technology',
        categoryTarget: 'Trending',
        icon: Flame,
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        articles: articles.filter((a) => a.isTrending).slice(0, 3),
      },
      {
        id: 'Artificial Intelligence',
        title: 'Artificial Intelligence',
        categoryTarget: 'Artificial Intelligence',
        icon: Cpu,
        badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
        articles: articles.filter((a) => matchesCategory(a, 'Artificial Intelligence')).slice(0, 3),
      },
      {
        id: 'Cybersecurity',
        title: 'Cybersecurity & Threat Intelligence',
        categoryTarget: 'Cybersecurity',
        icon: Shield,
        badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        articles: articles.filter((a) => matchesCategory(a, 'Cybersecurity')).slice(0, 3),
      },
      {
        id: 'Software and Applications',
        title: 'Software & Applications',
        categoryTarget: 'Software',
        icon: Code,
        badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
        articles: articles.filter((a) => matchesCategory(a, 'Software')).slice(0, 3),
      },
      {
        id: 'Business Technology',
        title: 'Business Technology & Strategy',
        categoryTarget: 'Business Technology',
        icon: Building2,
        badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        articles: articles.filter((a) => matchesCategory(a, 'Business Technology')).slice(0, 3),
      },
      {
        id: 'Emerging Technology',
        title: 'Emerging Technology & Innovation',
        categoryTarget: 'Emerging Technology',
        icon: Zap,
        badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
        articles: articles.filter((a) => matchesCategory(a, 'Emerging Technology')).slice(0, 3),
      },
      {
        id: 'African Technology',
        title: 'African Technology Ecosystem',
        categoryTarget: 'Africa',
        icon: Globe,
        badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        articles: articles.filter((a) => matchesCategory(a, 'Africa')).slice(0, 3),
      },
      {
        id: 'Technology in Uganda',
        title: 'Technology in Uganda',
        categoryTarget: 'Uganda',
        icon: Compass,
        badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        articles: articles.filter((a) => matchesCategory(a, 'Uganda')).slice(0, 3),
      },
      {
        id: 'Tutorials and Guides',
        title: 'Tutorials & Practical Guides',
        categoryTarget: 'Tutorials',
        icon: BookOpen,
        badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
        articles: articles.filter((a) => matchesCategory(a, 'Tutorials')).slice(0, 3),
      },
      {
        id: 'KJT TECHNOLOGIES Updates',
        title: 'KJT TECHNOLOGIES Updates',
        categoryTarget: 'KJT Updates',
        icon: Sparkles,
        badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
        articles: articles.filter((a) => matchesCategory(a, 'KJT Updates')).slice(0, 3),
      },
    ];
  }, [articles]);

  // Filtered & Searched results
  const isFiltering = Boolean(
    searchQuery.trim() ||
      selectedCategory !== 'All News' ||
      onlyFeatured ||
      onlyTrending
  );

  const filteredArticles = useMemo(() => {
    let result = articles.filter((post) => {
      // 1. Search Query filter (matches title, summary/excerpt, category, tags)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesExcerpt = post.excerpt.toLowerCase().includes(q);
        const matchesCategoryName = post.category.toLowerCase().includes(q);
        const matchesTags = post.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesExcerpt && !matchesCategoryName && !matchesTags) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All News') {
        if (!matchesCategory(post, selectedCategory)) {
          return false;
        }
      }

      // 3. Featured filter
      if (onlyFeatured && !post.isFeatured) {
        return false;
      }

      // 4. Trending filter
      if (onlyTrending && !post.isTrending) {
        return false;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [articles, searchQuery, selectedCategory, sortBy, onlyFeatured, onlyTrending]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All News');
    setSortBy('newest');
    setOnlyFeatured(false);
    setOnlyTrending(false);
    setVisibleFilteredCount(9);
  };

  const selectCategoryAndScroll = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setVisibleFilteredCount(9);
    window.scrollTo({ top: 260, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#071324] text-slate-200">
      <SEOHead
        title="Technology News & Insights | KJT TECHNOLOGIES"
        description="Stay informed with the latest technology news, expert insights, emerging trends, practical guides and digital-security updates from KJT TECHNOLOGIES."
        canonicalPath="/blog"
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Technology News & Insights', item: '/blog' },
        ]}
      />

      {/* 1. COMPACT EDITORIAL HEADER */}
      <header className="relative bg-gradient-to-b from-[#0A192F] via-[#081528] to-[#071324] border-b border-slate-800/80 pt-6 pb-6 lg:pt-8 lg:pb-8">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 z-10">
          {/* Top Bar: Breadcrumb + Live Latest-News Indicator Ticker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-400">
              <Link to="/" className="hover:text-[#00D4FF] transition">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#00D4FF]">Technology News &amp; Insights</span>
            </div>

            {/* Latest-News Live Indicator */}
            {latestArticleForTicker && (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/70 rounded-full px-3 py-1 shadow-sm max-w-full sm:max-w-xl overflow-hidden">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 shrink-0">
                  Latest News:
                </span>
                <Link
                  to={`/blog/${latestArticleForTicker.slug}`}
                  className="text-xs text-slate-200 hover:text-[#00D4FF] truncate font-medium transition"
                  title={latestArticleForTicker.title}
                >
                  {latestArticleForTicker.title}
                </Link>
                <span className="text-[10px] text-slate-500 shrink-0 hidden md:inline">
                  • {latestArticleForTicker.publishedAt}
                </span>
              </div>
            )}
          </div>

          {/* Masthead Headline & Short Introduction */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-[11px] font-bold uppercase tracking-widest">
                <Newspaper className="w-3.5 h-3.5" />
                <span>KJT Editorial Desk • Accelerating Innovation, Securing Data</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-editorial">
                Technology News &amp; Insights
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Stay informed with the latest technology news, expert insights, emerging trends, practical guides and digital-security updates from KJT TECHNOLOGIES.
              </p>
            </div>

            {/* Compact Article Search Box */}
            <div className="lg:col-span-5">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleFilteredCount(9);
                  }}
                  placeholder="Search articles by title, category, summary, or tags..."
                  aria-label="Search technology articles"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#00D4FF] focus:ring-2 focus:ring-[#00D4FF]/20 shadow-md transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Navigation Pills & Quick Controls */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-slate-800/70">
            {/* Scrollable Category Navigation */}
            <nav
              aria-label="Article categories"
              className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0"
            >
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setVisibleFilteredCount(9);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-[#00D4FF] text-[#0A192F] shadow-sm font-extrabold'
                        : 'bg-slate-800/70 border border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </nav>

            {/* Secondary Controls: Sort & Badges Filter */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Featured toggle */}
              <button
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  onlyFeatured
                    ? 'bg-[#00D4FF]/20 border border-[#00D4FF] text-[#00D4FF]'
                    : 'bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-white'
                }`}
                title="Show featured stories only"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Featured</span>
              </button>

              {/* Trending toggle */}
              <button
                onClick={() => setOnlyTrending(!onlyTrending)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  onlyTrending
                    ? 'bg-amber-500/20 border border-amber-500 text-amber-400'
                    : 'bg-slate-800/70 border border-slate-700/60 text-slate-400 hover:text-white'
                }`}
                title="Show trending stories only"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Trending</span>
              </button>

              {/* Sort By Newest / Oldest */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                  aria-label="Sort articles"
                  className="bg-slate-800/90 border border-slate-700/70 text-slate-300 hover:text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#00D4FF] cursor-pointer"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                </select>
              </div>

              {/* Clear Filters Button (conditional) */}
              {isFiltering && (
                <button
                  onClick={clearAllFilters}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition flex items-center gap-1 cursor-pointer"
                  title="Clear all active search and filters"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Loading KJT Technology dispatches...</p>
          </div>
        )}

        {/* MODE A: FILTERED / SEARCH RESULTS VIEW */}
        {!loading && isFiltering && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF]">
                  Search &amp; Filter Results
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {searchQuery ? `Articles matching "${searchQuery}"` : `${selectedCategory}`}
                </h2>
                <p className="text-xs text-slate-400 pt-1">
                  Showing {Math.min(visibleFilteredCount, filteredArticles.length)} of {filteredArticles.length} articles found
                </p>
              </div>

              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#00D4FF] hover:underline font-bold"
              >
                <span>Return to Editorial Front Page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Empty Results State */}
            {filteredArticles.length === 0 ? (
              <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
                  <Search className="w-7 h-7 text-[#00D4FF]" />
                </div>
                <h3 className="text-lg font-bold text-white">No articles found</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                  We could not find any technology dispatches matching your current search parameters. Try adjusting keywords or browse popular categories below.
                </p>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 rounded-xl bg-[#00D4FF] text-[#0A192F] font-bold text-xs hover:bg-[#00D4FF]/90 transition cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => selectCategoryAndScroll('Cybersecurity')}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#00D4FF] text-xs font-semibold transition"
                  >
                    Browse Cybersecurity
                  </button>
                  <button
                    onClick={() => selectCategoryAndScroll('Artificial Intelligence')}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:border-[#00D4FF] text-xs font-semibold transition"
                  >
                    Browse Artificial Intelligence
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(0, visibleFilteredCount).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="standard" />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleFilteredCount < filteredArticles.length && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setVisibleFilteredCount((prev) => prev + 6)}
                      className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      Load More Articles ({filteredArticles.length - visibleFilteredCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* MODE B: STANDARD EDITORIAL NEWSPAPER LAYERED VIEW */}
        {!loading && !isFiltering && (
          <>
            {/* 1. LEAD STORY & TOP STORIES GRID */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* ONE LARGE FEATURED LEAD STORY (7 cols) */}
                {leadArticle && (
                  <article className="lg:col-span-7 bg-slate-800/40 rounded-3xl border border-slate-700/70 hover:border-[#00D4FF]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group">
                    <div className="space-y-4">
                      {/* Large Image with preserved aspect ratio */}
                      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900">
                        <img
                          src={leadArticle.coverImage}
                          alt={leadArticle.imageAlt || leadArticle.title}
                          loading="eager"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-3 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md text-[#00D4FF] border border-[#00D4FF]/30 text-xs font-extrabold uppercase tracking-wider shadow">
                            {leadArticle.category}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-[#00D4FF] text-[#0A192F] text-xs font-black uppercase tracking-wider shadow">
                            Lead Story
                          </span>
                        </div>
                      </div>

                      {/* Lead Story Content */}
                      <div className="p-5 sm:p-6 space-y-3">
                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#00D4FF]" />
                            {leadArticle.publishedAt}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
                            {leadArticle.readTime}
                          </span>
                        </div>

                        {/* Strong Headline */}
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-[#00D4FF] transition-colors leading-tight font-editorial">
                          <Link to={`/blog/${leadArticle.slug}`}>
                            {leadArticle.title}
                          </Link>
                        </h2>

                        {/* Short Introduction */}
                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
                          {leadArticle.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Lead Story Footer: Author & Read Full Story button */}
                    <div className="p-5 sm:p-6 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-4 mt-2">
                      <div className="flex items-center gap-3">
                        <AuthorAvatar name={leadArticle.author.name} size="md" />
                        <div>
                          <p className="text-xs font-bold text-white">{leadArticle.author.name}</p>
                          <p className="text-[11px] text-slate-400">{leadArticle.author.role}</p>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${leadArticle.slug}`}
                        className="px-4 py-2.5 rounded-xl bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0A192F] font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-[#00D4FF]/20"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                )}

                {/* TOP STORIES (5 cols - 2 to 3 important stories) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
                        Top Stories
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Curated Editorial
                    </span>
                  </div>

                  <div className="space-y-4 flex-1">
                    {topStories.map((story) => (
                      <ArticleCard
                        key={story.id}
                        article={story}
                        variant="top-story"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. CHRONOLOGICAL LATEST NEWS & SIDEBAR SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
              {/* LEFT COLUMN: Latest News + All Topic Sections (8 cols) */}
              <div className="lg:col-span-8 space-y-12">
                {/* LATEST NEWS: Chronological article list with smaller thumbnails */}
                <section className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[#00D4FF]" />
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        Latest News &amp; Dispatches
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      Chronological Order
                    </span>
                  </div>

                  <div className="space-y-4">
                    {chronologicalLatestNews.slice(0, visibleLatestCount).map((item) => (
                      <ArticleCard
                        key={item.id}
                        article={item}
                        variant="latest-list"
                      />
                    ))}
                  </div>

                  {visibleLatestCount < chronologicalLatestNews.length && (
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setVisibleLatestCount((prev) => prev + 4)}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 uppercase tracking-wider transition cursor-pointer"
                      >
                        Load More Latest Stories
                      </button>
                    </div>
                  )}
                </section>

                {/* 10 TOPIC SECTIONS WITH VIEW ALL BUTTONS */}
                <div className="space-y-12 pt-4">
                  {topicSections.map((section) => {
                    const SectionIcon = section.icon;
                    if (section.articles.length === 0) return null;

                    return (
                      <section
                        key={section.id}
                        id={section.id.toLowerCase().replace(/\s+/g, '-')}
                        className="space-y-5 pt-6 border-t border-slate-800/80"
                      >
                        {/* Topic Section Header */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2.5">
                            <span className={`p-1.5 rounded-lg border ${section.badgeColor}`}>
                              <SectionIcon className="w-4 h-4" />
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                              {section.title}
                            </h3>
                          </div>

                          {/* View All Button that opens filtered category */}
                          <button
                            onClick={() => selectCategoryAndScroll(section.categoryTarget)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#00D4FF] hover:underline cursor-pointer group shrink-0"
                          >
                            <span>View All</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        {/* Topic Articles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {section.articles.map((art) => (
                            <ArticleCard
                              key={art.id}
                              article={art}
                              variant="standard"
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN: MOST READ & EDITOR'S PICKS SIDEBAR (4 cols on desktop, below on mobile) */}
              <aside className="lg:col-span-4 space-y-8">
                {/* Editor's Picks Widget */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#00D4FF]" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                        Editor&apos;s Picks
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Curated
                    </span>
                  </div>

                  <div className="space-y-3">
                    {editorsPicks.map((pick) => (
                      <ArticleCard
                        key={pick.id}
                        article={pick}
                        variant="sidebar-pick"
                      />
                    ))}
                  </div>
                </div>

                {/* Most Read / Trending Sidebar Area */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                        Trending Insights
                      </h4>
                    </div>
                    <span className="text-[10px] text-amber-400 font-semibold uppercase">
                      High Impact
                    </span>
                  </div>

                  <div className="space-y-3">
                    {trendingSidebar.map((item, idx) => (
                      <div key={item.id} className="relative flex items-start gap-3">
                        <span className="text-2xl font-black text-slate-600 w-6 shrink-0 text-center font-editorial">
                          0{idx + 1}
                        </span>
                        <div className="flex-1">
                          <ArticleCard
                            article={item}
                            variant="sidebar-pick"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enterprise Consultation Callout Card */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800/90 to-[#0A192F] rounded-2xl border border-slate-700/80 p-6 space-y-4 shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] flex items-center justify-center">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF]">
                      KJT Enterprise Advisory
                    </span>
                    <h4 className="text-base font-bold text-white">
                      Accelerating Innovation, Securing Data
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      Need custom enterprise software, cybersecurity audit, cloud infrastructure, or surveillance systems? Speak directly with our certified technical engineers.
                    </p>
                  </div>
                  <div className="pt-2 space-y-2">
                    <Link
                      to="/contact"
                      className="block w-full py-2.5 px-4 rounded-xl bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#0A192F] text-center font-bold text-xs uppercase tracking-wider transition shadow-md shadow-[#00D4FF]/20"
                    >
                      Request Technical Consultation
                    </Link>
                    <Link
                      to="/services"
                      className="block text-center text-xs text-slate-400 hover:text-[#00D4FF] font-semibold transition"
                    >
                      Explore Enterprise Services &rarr;
                    </Link>
                  </div>
                </div>

                {/* Newsletter Subscription Card */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-3 shadow-xl">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#00D4FF]" />
                    <span>Technology Intelligence Digest</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Receive our weekly cybersecurity threat advisories, software design blueprints, and East Africa tech analysis directly to your inbox.
                  </p>
                  <NewsletterForm />
                </div>

                {/* Topic Tags Cloud */}
                <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Tag className="w-3.5 h-3.5 text-[#00D4FF]" />
                    <span>Explore Hot Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Artificial Intelligence',
                      'Cybersecurity',
                      'Cloud Computing',
                      'Automation',
                      'Uganda',
                      'Small Business',
                      '2FA',
                      'CCTV',
                      'Mobile Money',
                      'SEO',
                      'Digital Transformation',
                    ].map((topic) => (
                      <button
                        key={topic}
                        onClick={() => {
                          setSearchQuery(topic);
                          window.scrollTo({ top: 260, behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-[#00D4FF]/10 text-slate-300 hover:text-[#00D4FF] border border-slate-700 hover:border-[#00D4FF]/30 transition cursor-pointer"
                      >
                        #{topic}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
