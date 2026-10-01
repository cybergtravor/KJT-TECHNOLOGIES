/**
 * =====================================================================
 * PROFESSIONAL ARTICLE DETAIL PAGE - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Motto: “Accelerating Innovation, Securing Data.”
 * 
 * Newspaper & Tech-Magazine Layout:
 * - Category & Clean Headline with editorial serif typography
 * - Professional Introduction (Deck)
 * - Author metadata (avatar, name, role, publication date, last updated date, reading time)
 * - Large featured image with accessible caption
 * - Editorial Reading Paper Canvas (dark text on light background, 17-18px desktop, ~1.7 line-height)
 * - Table of contents for long articles (sticky on desktop, collapsible on mobile)
 * - Sources & attributions section
 * - Tags & topics
 * - Social-sharing buttons (WhatsApp, LinkedIn, X/Twitter, Facebook, Copy link)
 * - Previous and Next article links
 * - Related stories (3 cards)
 * - Newsletter section
 * - KJT TECHNOLOGIES call-to-action
 * =====================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  ChevronRight,
  Check,
  Copy,
  BookOpen,
  ExternalLink,
  Shield,
  Sparkles,
  Flame,
  List,
  Mail,
  RefreshCw,
  Newspaper,
  Eye,
} from 'lucide-react';
import { FaWhatsapp, FaLinkedinIn, FaXTwitter, FaFacebookF } from 'react-icons/fa6';
import { SEOHead } from '../components/common/SEOHead';
import { Button } from '../components/common/Button';
import { NewsletterForm } from '../components/common/NewsletterForm';
import { ArticleCard } from '../components/blog/ArticleCard';
import { AuthorAvatar } from '../components/common/AuthorAvatar';
import { getArticleBySlug, getPublishedArticles, trackArticleRead, getArticleReadCount } from '../lib/articlesService';
import { BlogPostItem } from '../types';
import { sanitizeArticleHtml, cleanTitle } from '../lib/contentSanitizer';

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [allArticles, setAllArticles] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTocId, setActiveTocId] = useState<string>('');
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [readCount, setReadCount] = useState<number>(0);

  useEffect(() => {
    const isAuth = typeof window !== 'undefined' && localStorage.getItem('kjt_admin_authenticated') === 'true';
    setIsAdmin(isAuth);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      const article = await getArticleBySlug(slug);
      const published = await getPublishedArticles();
      const isAuth = typeof window !== 'undefined' && localStorage.getItem('kjt_admin_authenticated') === 'true';

      // Security Check: Visitors cannot access drafts or scheduled unpublished articles
      if (article && article.status !== 'published' && !isAuth) {
        setPost(null);
        setAllArticles(published);
        setLoading(false);
        return;
      }

      setPost(article);
      setAllArticles(published);

      // Track the read — only for published articles viewed by non-admins (or admins too for preview)
      if (article && article.status === 'published') {
        const newCount = trackArticleRead(article.slug);
        setReadCount(newCount);
      } else if (article) {
        setReadCount(getArticleReadCount(article.slug));
      }

      setLoading(false);
    };
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Sanitize article content
  const sanitizedContentHtml = useMemo(() => {
    if (!post?.content) return '';
    return sanitizeArticleHtml(post.content, {
      articleTitle: post.title,
      promoteBoldParagraphsToHeadings: true,
      allowAnchorIds: true,
    });
  }, [post?.content, post?.title]);

  // Extract Table of Contents from headings
  const tableOfContents = useMemo(() => {
    if (!post) return [];
    if (post.tableOfContents && post.tableOfContents.length > 0) {
      return post.tableOfContents;
    }

    const headings: { id: string; title: string; level: number }[] = [];
    const contentToScan = sanitizedContentHtml || post.content;

    if (contentToScan.includes('<h2') || contentToScan.includes('<h3')) {
      const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
      const h3Regex = /<h3[^>]*>(.*?)<\/h3>/gi;
      const tagRegex = /<[^>]+>/g;

      let match;
      while ((match = h2Regex.exec(contentToScan)) !== null) {
        const title = match[1].replace(tagRegex, '').trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
        headings.push({ id, title, level: 2 });
      }

      while ((match = h3Regex.exec(contentToScan)) !== null) {
        const title = match[1].replace(tagRegex, '').trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
        headings.push({ id, title, level: 3 });
      }
      return headings;
    }

    // Otherwise parse Markdown headings
    const lines = post.content.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('## ')) {
        const title = trimmed.replace('## ', '').trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
        headings.push({ id, title, level: 2 });
      } else if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '').trim();
        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
        headings.push({ id, title, level: 3 });
      }
    });
    return headings;
  }, [post, sanitizedContentHtml]);

  // Compute Previous and Next Articles
  const { previousPost, nextPost } = useMemo(() => {
    if (!post || allArticles.length === 0) return { previousPost: null, nextPost: null };
    const currentIndex = allArticles.findIndex((a) => a.id === post.id || a.slug === post.slug);
    if (currentIndex === -1) return { previousPost: null, nextPost: null };

    const previous = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
    const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

    return { previousPost: previous, nextPost: next };
  }, [post, allArticles]);

  // Related Stories (3 matching articles)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    if (post.relatedPostSlugs && post.relatedPostSlugs.length > 0) {
      const matched = allArticles.filter(
        (p) => post.relatedPostSlugs?.includes(p.slug) || post.relatedPostSlugs?.includes(p.id)
      );
      if (matched.length > 0) return matched.slice(0, 3);
    }
    return allArticles
      .filter((p) => p.id !== post.id && (p.category === post.category || p.status === 'published'))
      .slice(0, 3);
  }, [post, allArticles]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareLinks = post
    ? {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${currentUrl}`)}`,
      }
    : null;

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToHeading = (id: string) => {
    setActiveTocId(id);
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071324] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400">Loading article dispatch...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#071324] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
          <p className="text-sm text-slate-400">
            The requested technical article or news dispatch could not be located. It may have been relocated or updated.
          </p>
          <Button to="/blog" variant="cyan" size="md">
            Return to Technology News &amp; Insights
          </Button>
        </div>
      </div>
    );
  }

  const cleanHeadline = cleanTitle(post.title);
  const isSamplePost = Boolean(
    post.isSample ||
    post.id?.startsWith('sample-') ||
    post.id?.startsWith('how-') ||
    post.id?.startsWith('ten-') ||
    post.id?.startsWith('why-')
  );

  return (
    <article className="min-h-screen bg-[#071324] text-slate-200">
      <SEOHead
        title={`${post.seoTitle ? cleanTitle(post.seoTitle) : cleanHeadline} | KJT TECHNOLOGIES`}
        description={post.metaDescription || post.excerpt}
        canonicalPath={`/blog/${post.slug}`}
        type="article"
        image={post.coverImage}
        noIndex={post.status !== 'published'}
        readCount={readCount}
        article={{
          publishedTime: post.publishedAt,
          modifiedTime: post.updatedAt || post.publishedAt,
          author: post.author.name,
          section: post.category,
          tags: post.tags,
        }}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'News & Insights', item: '/blog' },
          { name: post.category, item: '/blog' },
          { name: cleanHeadline, item: `/blog/${post.slug}` },
        ]}
      />

      {/* Admin Draft / Scheduled Banner */}
      {post.status !== 'published' && (
        <div className="bg-amber-500/15 border-b border-amber-500/40 text-amber-200 py-3 px-4 text-xs font-semibold">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold uppercase text-[10px] tracking-wider">
                {post.status === 'draft' ? 'Private Draft Mode' : 'Scheduled Publication'}
              </span>
              <span>
                This article is hidden from public visitors and search engine crawlers (noindex).
              </span>
            </div>
            <Link
              to={`/admin/articles/edit/${post.id}`}
              className="inline-flex items-center gap-1 text-white hover:text-[#00D4FF] underline font-bold whitespace-nowrap"
            >
              Open in Editor &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* 1. EDITORIAL ARTICLE HEADER */}
      <header className="relative bg-gradient-to-b from-[#0A192F] via-[#081528] to-[#071324] border-b border-slate-800/80 pt-8 pb-10 sm:pb-12">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#00D4FF 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Link to="/" className="hover:text-[#00D4FF] transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link to="/blog" className="hover:text-[#00D4FF] transition">
              News &amp; Insights
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[#00D4FF] truncate max-w-xs">{post.category}</span>
          </nav>

          {/* Category & Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-extrabold uppercase tracking-widest rounded-full">
              {post.category}
            </span>
            {post.isTrending && (
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Trending Analysis
              </span>
            )}
            {post.isNews && (
              <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Newspaper className="w-3.5 h-3.5" />
                News Dispatch
              </span>
            )}
            {isSamplePost && (
              <span className="px-2.5 py-1 bg-slate-800/90 border border-slate-700/90 text-slate-300 text-[11px] font-medium rounded-full flex items-center gap-1.5" title="Demonstration sample content provided for initial website deployment. Replace or edit in Website Administration.">
                <Sparkles className="w-3 h-3 text-[#00D4FF]" />
                Sample Demonstration Article
              </span>
            )}
          </div>

          {/* Clean Headline with Editorial Font */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-editorial">
            {cleanHeadline}
          </h1>

          {/* Professional Introduction (Deck) */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <AuthorAvatar name={post.author.name} size="md" />
              <div>
                <p className="font-bold text-white text-sm">{post.author.name}</p>
                <p className="text-slate-400 text-xs">{post.author.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>Published: {post.publishedAt}</span>
              </span>
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Updated: {post.updatedAt}</span>
                  </span>
                </>
              )}
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>{post.readTime}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5 text-slate-300" title="Total reads">
                <Eye className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>{readCount > 0 ? readCount.toLocaleString() : '—'} reads</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. LARGE FEATURED IMAGE & CAPTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 pt-6">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.imageAlt || post.title}
            loading="eager"
            width="1200"
            height="675"
            className="w-full aspect-[16/9] sm:h-[460px] lg:h-[520px] object-cover"
          />
          {post.imageCaption && (
            <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-400 italic text-center">
              {post.imageCaption}
            </div>
          )}
        </div>
      </section>

      {/* 3. MAIN ARTICLE READING LAYOUT (DARK TEXT ON LIGHT BACKGROUND PAPER CANVAS) */}
      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* MAIN EDITORIAL READING CANVAS (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Official Social Sharing Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-800/80 rounded-2xl border border-slate-700/70 flex flex-wrap items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Share2 className="w-4 h-4 text-[#00D4FF]" />
                  <span>Share Story:</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={shareLinks?.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share via WhatsApp"
                    className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition shadow"
                    title="Share via WhatsApp"
                  >
                    <FaWhatsapp size={15} />
                  </a>
                  <a
                    href={shareLinks?.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="w-8 h-8 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition shadow"
                    title="Share on LinkedIn"
                  >
                    <FaLinkedinIn size={15} />
                  </a>
                  <a
                    href={shareLinks?.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    className="w-8 h-8 rounded-lg bg-black text-white border border-slate-700 flex items-center justify-center hover:bg-slate-900 transition shadow"
                    title="Share on X"
                  >
                    <FaXTwitter size={14} />
                  </a>
                  <a
                    href={shareLinks?.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition shadow"
                    title="Share on Facebook"
                  >
                    <FaFacebookF size={14} />
                  </a>
                  <button
                    onClick={handleCopy}
                    aria-label="Copy link to clipboard"
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#00D4FF]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Table of Contents Dropdown */}
              {tableOfContents.length > 0 && (
                <div className="lg:hidden rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setMobileTocOpen(!mobileTocOpen)}
                    className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#00D4FF] hover:bg-slate-850"
                  >
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      <span>Table of Contents ({tableOfContents.length} sections)</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${mobileTocOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {mobileTocOpen && (
                    <ul className="p-4 pt-0 space-y-2 text-xs border-t border-slate-800 text-slate-300">
                      {tableOfContents.map((item) => (
                        <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className="text-left text-slate-300 hover:text-[#00D4FF] transition"
                          >
                            &bull; {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* EDITORIAL READING PAPER CONTAINER: Dark Text on Light Background */}
              <div className="article-reading-paper rounded-2xl sm:rounded-3xl border border-slate-300/80 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-6">
                {/* In-content quick Table of Contents for long articles */}
                {tableOfContents.length >= 3 && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 mb-8 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <List className="w-4 h-4 text-[#0055FF]" />
                      <span>Article Overview &amp; Key Sections</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {tableOfContents.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => scrollToHeading(item.id)}
                            className="text-left text-slate-800 hover:text-[#0055FF] font-medium transition cursor-pointer"
                          >
                            &bull; {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Article Body Content */}
                {sanitizedContentHtml.includes('<p>') || sanitizedContentHtml.includes('<h2') || sanitizedContentHtml.includes('<div') || sanitizedContentHtml.includes('<ul') ? (
                  <div
                    className="article-editorial-body article-editorial-body-paper text-[#1e293b] leading-relaxed text-[17px] sm:text-[18px]"
                    dangerouslySetInnerHTML={{ __html: sanitizedContentHtml }}
                  />
                ) : (
                  <div className="space-y-6 text-[#1e293b] leading-relaxed text-[17px] sm:text-[18px]">
                    {post.content.split('\n\n').map((block, i) => {
                      const trimmed = block.trim();

                      // Heading 2
                      if (trimmed.startsWith('## ')) {
                        const title = trimmed.replace('## ', '').trim();
                        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                        return (
                          <h2
                            key={i}
                            id={id}
                            className="text-2xl sm:text-3xl font-bold text-[#0f172a] pt-8 pb-2 border-b border-slate-200 scroll-mt-28 font-editorial tracking-tight"
                          >
                            {title}
                          </h2>
                        );
                      }

                      // Heading 3
                      if (trimmed.startsWith('### ')) {
                        const title = trimmed.replace('### ', '').trim();
                        const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
                        return (
                          <h3
                            key={i}
                            id={id}
                            className="text-xl sm:text-2xl font-bold text-[#1e293b] pt-6 pb-2 scroll-mt-28 font-editorial"
                          >
                            {title}
                          </h3>
                        );
                      }

                      // Callout / Blockquote
                      if (trimmed.startsWith('>')) {
                        const quoteText = trimmed.replace(/^>\s*/, '').trim();
                        return (
                          <blockquote
                            key={i}
                            className="my-6 p-5 rounded-r-2xl bg-blue-50/60 border-l-4 border-[#0055FF] border-y border-r border-blue-100 text-slate-800 italic font-editorial text-lg leading-relaxed"
                          >
                            {quoteText.replace(/\*\*/g, '')}
                          </blockquote>
                        );
                      }

                      // Bullet list
                      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                        const items = trimmed.split('\n').filter((l) => l.trim());
                        return (
                          <ul key={i} className="space-y-2.5 my-4 pl-4 text-slate-700 list-disc">
                            {items.map((item, idx) => {
                              const cleanItem = item.replace(/^[-*]\s*/, '');
                              return (
                                <li key={idx} className="leading-relaxed">
                                  {cleanItem}
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }

                      // Numbered list
                      if (/^\d+\.\s/.test(trimmed)) {
                        const items = trimmed.split('\n').filter((l) => l.trim());
                        return (
                          <ol key={i} className="space-y-2.5 my-4 pl-4 text-slate-700 list-decimal">
                            {items.map((item, idx) => {
                              const cleanItem = item.replace(/^\d+\.\s*/, '');
                              return (
                                <li key={idx} className="leading-relaxed">
                                  {cleanItem}
                                </li>
                              );
                            })}
                          </ol>
                        );
                      }

                      // Standard paragraph
                      return (
                        <p key={i} className="text-slate-700 leading-relaxed">
                          {trimmed}
                        </p>
                      );
                    })}
                  </div>
                )}

                {/* Sources & Attributions Block */}
                {(post.originalSource || post.sourceUrl || post.isNews) && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#0055FF] shrink-0" />
                        <span>
                          <strong>Source Attribution:</strong> {post.originalSource || 'KJT Engineering Intelligence Desk'}
                          {post.eventDate && <span> ({post.eventDate})</span>}
                        </span>
                      </div>
                      {post.sourceUrl && (
                        <a
                          href={post.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0055FF] hover:underline font-bold flex items-center gap-1 shrink-0"
                        >
                          <span>Verify Source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
                    Topics &amp; Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author Bio in Editorial Card */}
                <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                  <AuthorAvatar name={post.author.name} size="lg" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0055FF]">
                      Author Profile
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{post.author.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{post.author.role}</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      {post.author.bio ||
                        'Technology specialist and enterprise software architect contributing research and cybersecurity advisories at KJT TECHNOLOGIES.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. PREVIOUS AND NEXT ARTICLE NAVIGATION */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {previousPost ? (
                  <Link
                    to={`/blog/${previousPost.slug}`}
                    className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-[#00D4FF]/40 transition flex items-start gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-slate-800 text-[#00D4FF] group-hover:-translate-x-1 transition-transform shrink-0">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Previous Story
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00D4FF] transition line-clamp-2 leading-snug">
                        {previousPost.title}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {nextPost && (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-[#00D4FF]/40 transition flex items-start justify-between gap-3 text-right group"
                  >
                    <div className="min-w-0 space-y-1 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Next Story
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00D4FF] transition line-clamp-2 leading-snug">
                        {nextPost.title}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800 text-[#00D4FF] group-hover:translate-x-1 transition-transform shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* SIDEBAR (4 cols on desktop): Desktop TOC + CTA + Digest */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Desktop Sticky Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="hidden lg:block sticky top-28 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00D4FF] border-b border-slate-800 pb-2.5">
                    <List className="w-4 h-4" />
                    <span>Table of Contents</span>
                  </div>

                  <nav className="space-y-1 max-h-72 overflow-y-auto pr-1 text-xs scrollbar-none">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToHeading(item.id)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg transition leading-snug cursor-pointer ${
                          item.level === 3 ? 'pl-5 text-[11px]' : 'font-semibold'
                        } ${
                          activeTocId === item.id
                            ? 'bg-[#00D4FF]/15 text-[#00D4FF] font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* KJT TECHNOLOGIES CALL-TO-ACTION CARD */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800/90 to-[#0A192F] rounded-2xl border border-slate-700/80 p-6 space-y-4 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF]">
                    KJT TECHNOLOGIES
                  </span>
                  <h4 className="text-base font-bold text-white">
                    Accelerating Innovation, Securing Data
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    Deploying custom software, cybersecurity penetration tests, networking, CCTV, or cloud backup? Consult directly with our engineering team in Uganda.
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                  <Button to="/contact" variant="cyan" fullWidth size="sm">
                    Book Technical Consultation
                  </Button>
                  <Link
                    to="/services"
                    className="block text-center text-xs text-slate-400 hover:text-[#00D4FF] font-semibold transition"
                  >
                    View All Services &rarr;
                  </Link>
                </div>
              </div>

              {/* Newsletter Subscription Card */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00D4FF]" />
                  <span>Subscribe to KJT Digest</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Stay updated with our newest technical releases and vulnerability advisories.
                </p>
                <NewsletterForm />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 5. RELATED STORIES SECTION (3 cards) */}
      {relatedPosts.length > 0 && (
        <section className="py-14 sm:py-16 bg-[#0A192F] border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00D4FF] block">
                  Recommended Reading
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Related News &amp; Insights
                </h3>
              </div>
              <Link
                to="/blog"
                className="text-xs font-bold text-[#00D4FF] hover:underline flex items-center gap-1"
              >
                <span>Browse All Stories</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="standard" />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};
