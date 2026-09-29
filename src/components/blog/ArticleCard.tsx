import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { BlogPostItem } from '../../types';
import { cleanTitle } from '../../lib/contentSanitizer';
import { AuthorAvatar } from '../common/AuthorAvatar';

interface ArticleCardProps {
  article: BlogPostItem;
  variant?: 'standard' | 'top-story' | 'latest-list' | 'sidebar-pick';
  showExcerpt?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  showExcerpt = true,
}) => {
  const displayTitle = cleanTitle(article.title);

  // Clean excerpt without raw HTML or markdown artifacts
  const cleanExcerpt = article.excerpt
    ? article.excerpt.replace(/<[^>]+>/g, '').replace(/[#*`_]/g, '').trim()
    : '';

  // Sidebar Pick Variant (Compact for Most Read / Editor's Picks)
  if (variant === 'sidebar-pick') {
    return (
      <Link
        to={`/blog/${article.slug}`}
        className="group flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 hover:border-[#00D4FF]/40 transition-all duration-200"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/50">
          <img
            src={article.coverImage}
            alt={article.imageAlt || displayTitle}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.isTrending && (
            <span className="absolute top-1 left-1 p-1 rounded-md bg-amber-500/90 text-slate-950 shadow">
              <Flame className="w-2.5 h-2.5" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <span className="text-[#00D4FF] truncate">{article.category}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors line-clamp-2 leading-snug">
            {displayTitle}
          </h4>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
            <AuthorAvatar name={article.author.name} size="xs" />
            <span className="truncate max-w-[110px]">{article.author.name}</span>
            <span>•</span>
            <span>{article.publishedAt}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Latest News Chronological List Item Variant (Smaller thumbnail, horizontal layout on sm+)
  if (variant === 'latest-list') {
    return (
      <article className="group bg-slate-800/30 hover:bg-slate-800/60 rounded-2xl border border-slate-700/60 hover:border-[#00D4FF]/40 p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-md">
        <div className="relative w-full sm:w-48 md:w-56 aspect-[16/10] sm:aspect-video rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700/40">
          <img
            src={article.coverImage}
            alt={article.imageAlt || displayTitle}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {article.isTrending && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow">
                <Flame className="w-3 h-3" />
                Trending
              </span>
            )}
            {article.isFeatured && (
              <span className="px-2 py-0.5 rounded-md bg-[#00D4FF] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-md bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/25 font-bold uppercase tracking-wider text-[10px]">
              {article.category}
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {article.publishedAt}
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {article.readTime}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00D4FF] transition-colors leading-snug">
            <Link to={`/blog/${article.slug}`}>
              {displayTitle}
            </Link>
          </h3>

          {showExcerpt && cleanExcerpt && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {cleanExcerpt}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <AuthorAvatar name={article.author.name} size="xs" />
              <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">
                {article.author.name}
              </span>
            </div>

            <Link
              to={`/blog/${article.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00D4FF] hover:text-white transition group-hover:translate-x-0.5"
            >
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Top Story Variant (Medium-sized image, prominent card)
  if (variant === 'top-story') {
    return (
      <article className="group bg-slate-800/40 hover:bg-slate-800/80 rounded-2xl border border-slate-700/70 hover:border-[#00D4FF]/50 p-5 transition-all duration-300 flex flex-col justify-between shadow-lg">
        <div className="space-y-3.5">
          {/* Featured Image */}
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50">
            <img
              src={article.coverImage}
              alt={article.imageAlt || displayTitle}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-sm text-[#00D4FF] border border-[#00D4FF]/30 text-[10px] font-extrabold uppercase tracking-wider shadow">
                {article.category}
              </span>
              {article.isTrending && (
                <span className="px-2 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow">
                  <Flame className="w-3 h-3" />
                  Trending
                </span>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {article.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {article.readTime}
            </span>
          </div>

          {/* Clean Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-[#00D4FF] transition-colors leading-snug line-clamp-2">
            <Link to={`/blog/${article.slug}`}>
              {displayTitle}
            </Link>
          </h3>

          {/* Short Summary */}
          {cleanExcerpt && (
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {cleanExcerpt}
            </p>
          )}
        </div>

        {/* Footer: Author & Read Article */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AuthorAvatar name={article.author.name} size="xs" />
            <span className="text-slate-300 font-medium truncate max-w-[130px]">
              {article.author.name}
            </span>
          </div>

          <Link
            to={`/blog/${article.slug}`}
            className="inline-flex items-center gap-1 text-[#00D4FF] font-bold group-hover:translate-x-0.5 transition-transform"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    );
  }

  // Standard Card Variant (Default for topic sections, search grids)
  return (
    <article className="group bg-slate-800/40 hover:bg-slate-800/70 rounded-2xl border border-slate-700/60 hover:border-[#00D4FF]/40 p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between shadow-lg">
      <div className="space-y-3">
        {/* Featured image with consistent aspect ratio */}
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50">
          <img
            src={article.coverImage}
            alt={article.imageAlt || displayTitle}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-sm text-[#00D4FF] border border-[#00D4FF]/30 text-[10px] font-extrabold uppercase tracking-wider shadow">
              {article.category}
            </span>
            {article.isTrending && (
              <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow">
                <Flame className="w-3 h-3" />
                Trending
              </span>
            )}
            {article.isFeatured && (
              <span className="px-2 py-0.5 rounded-md bg-[#00D4FF] text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {article.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {article.readTime}
          </span>
        </div>

        {/* Clean Title */}
        <h3 className="text-base font-bold text-white group-hover:text-[#00D4FF] transition-colors leading-snug line-clamp-2">
          <Link to={`/blog/${article.slug}`}>
            {displayTitle}
          </Link>
        </h3>

        {/* Short summary */}
        {showExcerpt && cleanExcerpt && (
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {cleanExcerpt}
          </p>
        )}
      </div>

      {/* Card Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <AuthorAvatar name={article.author.name} size="xs" />
          <span className="text-slate-300 font-medium text-xs truncate max-w-[120px]">
            {article.author.name}
          </span>
        </div>

        <Link
          to={`/blog/${article.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#00D4FF] hover:underline"
        >
          <span>Read Article</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
