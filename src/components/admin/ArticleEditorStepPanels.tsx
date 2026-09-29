import React from 'react';
import {
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Tag,
  Plus,
  Trash2,
  X,
  FileText,
  ImageIcon,
  Globe,
  User,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { BlogPostItem } from '../../types';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';
import { generateCleanSlug } from '../../lib/contentSanitizer';
import { AuthorAvatar } from '../common/AuthorAvatar';
import { getAuthorInitials } from '../../lib/authorUtils';

export interface AdditionalImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
}

interface StepPanelsProps {
  formData: Partial<BlogPostItem>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<BlogPostItem>>>;
  setIsDirty: (dirty: boolean) => void;
  titleWarning: string | null;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  handleTitleBlur: () => void;
  handleRegenerateSlug: () => void;
  handleCalculateReadingTime: () => void;
  categories: string[];
  tagInput: string;
  setTagInput: (val: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  additionalImages: AdditionalImage[];
  handleAddAdditionalImage: () => void;
  handleUpdateAdditionalImage: (id: string, updates: Partial<AdditionalImage>) => void;
  handleRemoveAdditionalImage: (id: string) => void;
  seoTitleLength: number;
  metaDescLength: number;
}

/**
 * Step 1: Article Title, URL Slug & Excerpt
 */
export const Step1DetailsPanel: React.FC<StepPanelsProps> = ({
  formData,
  setFormData,
  setIsDirty,
  titleWarning,
  handleTitleChange,
  handleTitlePaste,
  handleTitleBlur,
  handleRegenerateSlug,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Step 1: Article Headline & Core Metadata
          </h2>
          <p className="text-xs text-slate-400">
            Provide a clean, journalistic title without hashtags, along with a permanent URL slug and concise summary.
          </p>
        </div>
      </div>

      {/* Article Title */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Article Title <span className="text-rose-400">*</span>
          </label>
          <span className="text-[10px] text-slate-400">
            No hashtags, excessive caps or exclamation marks
          </span>
        </div>
        <input
          type="text"
          value={formData.title || ''}
          onChange={handleTitleChange}
          onPaste={handleTitlePaste}
          onBlur={handleTitleBlur}
          placeholder="e.g. Ten Essential Cybersecurity Practices Every Enterprise Must Adopt"
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-base font-semibold placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
        />
        {titleWarning && (
          <div className="text-amber-400 text-xs flex items-center gap-1.5 pt-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{titleWarning}</span>
          </div>
        )}
        <p className="text-[11px] text-slate-400">
          Cleaned automatically: Any pasted hashtags or numbering prefixes will be formatted to professional press standards.
        </p>
      </div>

      {/* URL Slug with Regenerator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            URL Slug <span className="text-rose-400">*</span>
          </label>
          <button
            type="button"
            onClick={handleRegenerateSlug}
            className="text-[11px] text-[#00D4FF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Regenerate from Title</span>
          </button>
        </div>
        <div className="flex items-center">
          <span className="px-3 py-2.5 rounded-l-xl bg-slate-950 border border-r-0 border-slate-700 text-slate-500 text-xs font-mono">
            /blog/
          </span>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => {
              setIsDirty(true);
              setFormData({ ...formData, slug: generateCleanSlug(e.target.value) });
            }}
            placeholder="ten-essential-cybersecurity-practices"
            className="w-full px-3 py-2.5 rounded-r-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
          />
        </div>
        <p className="text-[10px] text-slate-400">
          Permanent permalink identifier for this story. Lowercase with hyphens only.
        </p>
      </div>

      {/* Summary Excerpt */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Article Summary / Excerpt <span className="text-rose-400">*</span>
          </label>
          <span className="text-[10px] text-slate-400">
            {formData.excerpt?.length || 0} characters
          </span>
        </div>
        <textarea
          rows={3}
          value={formData.excerpt || ''}
          onChange={(e) => {
            setIsDirty(true);
            setFormData({ ...formData, excerpt: e.target.value });
          }}
          placeholder="A concise 2-sentence summary that appears in article previews, search engine snippets, and news cards..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs leading-relaxed placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
        />
        <p className="text-[10px] text-slate-400">
          Displayed on news index cards, category feeds, and social share previews.
        </p>
      </div>
    </div>
  );
};

/**
 * Step 2: Featured Cover Image & Supplementary Media
 */
export const Step2MediaPanel: React.FC<StepPanelsProps> = ({
  formData,
  setFormData,
  setIsDirty,
  additionalImages,
  handleAddAdditionalImage,
  handleUpdateAdditionalImage,
  handleRemoveAdditionalImage,
}) => {
  return (
    <div className="space-y-6">
      {/* Featured Cover Image */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Step 2: Primary Cover Image & Visual Assets
            </h2>
            <p className="text-xs text-slate-400">
              Upload a high-resolution hero photo (16:9 ratio recommended) and supply descriptive alternative text for accessibility.
            </p>
          </div>
        </div>

        <ImageUploader
          label="Featured Hero Cover Image"
          currentUrl={formData.coverImage}
          currentAlt={formData.imageAlt}
          currentCaption={formData.imageCaption}
          required={true}
          onImageChange={(url, alt, caption) => {
            setIsDirty(true);
            setFormData((prev) => ({
              ...prev,
              coverImage: url,
              imageAlt: alt,
              imageCaption: caption,
            }));
          }}
        />
      </div>

      {/* Additional Article Images Gallery */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Additional Article Diagrams &amp; Media
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Attach supplementary charts, infographics, or photo assets with captions &amp; alt text
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddAdditionalImage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#00D4FF] text-xs font-bold transition cursor-pointer border border-slate-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Media Item</span>
          </button>
        </div>

        {additionalImages.length === 0 ? (
          <div className="py-8 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
            No additional images attached. Click &quot;Add Media Item&quot; to include architecture diagrams or inline graphs.
          </div>
        ) : (
          <div className="space-y-4">
            {additionalImages.map((img, idx) => (
              <div
                key={img.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    Media Item #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalImage(img.id)}
                    className="text-rose-400 hover:text-rose-300 p-1 rounded transition cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Image URL</label>
                    <input
                      type="url"
                      value={img.url}
                      onChange={(e) => handleUpdateAdditionalImage(img.id, { url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Alternative Text (Alt)</label>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={(e) => handleUpdateAdditionalImage(img.id, { alt: e.target.value })}
                      placeholder="Descriptive text for accessibility"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Caption</label>
                  <input
                    type="text"
                    value={img.caption}
                    onChange={(e) => handleUpdateAdditionalImage(img.id, { caption: e.target.value })}
                    placeholder="e.g. Figure 1: Network packet filtering flow chart."
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
                  />
                </div>

                {img.url && (
                  <div className="aspect-video max-h-40 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 mt-2">
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Step 3: WYSIWYG Content Editing & Sanitizer
 */
export const Step3ContentPanel: React.FC<StepPanelsProps> = ({
  formData,
  setFormData,
  setIsDirty,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Step 3: Article Body &amp; Visual Formatting
            </h2>
            <p className="text-xs text-slate-400">
              Format headings, bulleted lists, quotes, hyperlinks, code snippets and tables.
            </p>
          </div>
        </div>
      </div>

      {/* Editor Tip Box */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-[#00D4FF] flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-white">Intelligent Paste Sanitizer Active:</span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Content pasted from Google Docs or Word is automatically stripped of inline style artifacts,
            bold intro lines are converted into semantic &lt;h2&gt; headings, and hashtags are removed from section headings.
          </p>
        </div>
      </div>

      <RichTextEditor
        value={formData.content || ''}
        onChange={(html) => {
          setIsDirty(true);
          setFormData((prev) => ({ ...prev, content: html }));
        }}
        placeholder="Write or paste your article text here. Use the toolbar above to style headings, quotes, bullet points, and code..."
        minHeight="480px"
      />
    </div>
  );
};

/**
 * Step 4: Category, Tags & Estimated Reading Time
 */
export const Step4TaxonomyPanel: React.FC<StepPanelsProps> = ({
  formData,
  setFormData,
  setIsDirty,
  categories,
  tagInput,
  setTagInput,
  handleAddTag,
  handleRemoveTag,
  handleCalculateReadingTime,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center">
          <Tag className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Step 4: Classification &amp; Read Time
          </h2>
          <p className="text-xs text-slate-400">
            Categorize your article, assign searchable keywords without hashtags, and specify reading time.
          </p>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          Primary Category <span className="text-rose-400">*</span>
        </label>
        <select
          value={formData.category || 'Cybersecurity'}
          onChange={(e) => {
            setIsDirty(true);
            setFormData({ ...formData, category: e.target.value });
          }}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Tags & Keywords */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Tags and Keywords <span className="text-rose-400">*</span>
          </label>
          <span className="text-[10px] text-slate-400">
            Press Enter or click Add (clean labels, no hashtags)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Type a keyword and press Enter (e.g. Zero Trust, Cloud Migration)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#00D4FF] text-xs font-bold transition border border-slate-700 cursor-pointer"
          >
            Add Tag
          </button>
        </div>

        {/* Tag Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {(formData.tags || []).length === 0 ? (
            <span className="text-xs text-slate-500">No tags assigned yet.</span>
          ) : (
            (formData.tags || []).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition cursor-pointer"
                  title="Remove tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Reading Time with Auto-calculate */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Estimated Reading Time
          </label>
          <button
            type="button"
            onClick={handleCalculateReadingTime}
            className="text-[11px] text-[#00D4FF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span>Auto-calculate from article text</span>
          </button>
        </div>
        <input
          type="text"
          value={formData.readTime || '5 min read'}
          onChange={(e) => {
            setIsDirty(true);
            setFormData({ ...formData, readTime: e.target.value });
          }}
          placeholder="e.g. 6 min read"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
        />
      </div>
    </div>
  );
};

/**
 * Step 5: SEO, SERP Preview & Source Attribution
 */
export const Step5SeoPanel: React.FC<StepPanelsProps> = ({
  formData,
  setFormData,
  setIsDirty,
  seoTitleLength,
  metaDescLength,
}) => {
  return (
    <div className="space-y-6">
      {/* Search Engine Optimization */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Step 5: Search Engine Optimization (SEO) &amp; Attribution
            </h2>
            <p className="text-xs text-slate-400">
              Optimize how this story ranks on Google, Bing, and social search snippets.
            </p>
          </div>
        </div>

        {/* SEO Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 block">
              SEO Title Tag
            </label>
            <span
              className={`text-[11px] font-mono ${
                seoTitleLength > 65
                  ? 'text-rose-400'
                  : seoTitleLength >= 40
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {seoTitleLength} / 60 chars
            </span>
          </div>
          <input
            type="text"
            value={formData.seoTitle || ''}
            onChange={(e) => {
              setIsDirty(true);
              setFormData({ ...formData, seoTitle: e.target.value });
            }}
            placeholder="e.g. Ten Essential Cybersecurity Practices | KJT TECHNOLOGIES"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
          />
          <p className="text-[10px] text-slate-400">
            Optimal length is 50–60 characters. Appears as the blue clickable title in Google search results.
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 block">
              Meta Description
            </label>
            <span
              className={`text-[11px] font-mono ${
                metaDescLength > 165
                  ? 'text-rose-400'
                  : metaDescLength >= 120
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {metaDescLength} / 160 chars
            </span>
          </div>
          <textarea
            rows={2}
            value={formData.metaDescription || ''}
            onChange={(e) => {
              setIsDirty(true);
              setFormData({ ...formData, metaDescription: e.target.value });
            }}
            placeholder="Compelling search snippet summarizing the key insight for readers..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
          />
          <p className="text-[10px] text-slate-400">
            Optimal length is 140–160 characters. Appears below the title on search engine result pages.
          </p>
        </div>

        {/* SERP Preview Mockup */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Google Search Preview Mockup
          </span>
          <div className="text-xs text-[#00D4FF] hover:underline cursor-pointer truncate font-medium">
            {formData.seoTitle || formData.title || 'Article Title | KJT TECHNOLOGIES'}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono truncate">
            https://kjttechnologies.com/blog/{formData.slug || 'article-slug'}
          </div>
          <div className="text-[11px] text-slate-400 line-clamp-2">
            {formData.metaDescription || formData.excerpt || 'Article summary snippet shown on search engines...'}
          </div>
        </div>
      </div>

      {/* External Syndication & Source Attribution */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Original Source &amp; Event Attribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 block">Original Source Organization</label>
            <input
              type="text"
              value={formData.originalSource || ''}
              onChange={(e) => {
                setIsDirty(true);
                setFormData({ ...formData, originalSource: e.target.value });
              }}
              placeholder="e.g. Gartner Research, Reuters, KJT Press Desk"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 block">Original Source URL (Canonical)</label>
            <input
              type="url"
              value={formData.sourceUrl || ''}
              onChange={(e) => {
                setIsDirty(true);
                setFormData({ ...formData, sourceUrl: e.target.value });
              }}
              placeholder="https://example.com/original-report"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-[11px] text-slate-400 block">Event Date (If reporting from conference or summit)</label>
          <input
            type="date"
            value={formData.eventDate || ''}
            onChange={(e) => {
              setIsDirty(true);
              setFormData({ ...formData, eventDate: e.target.value });
            }}
            className="w-full sm:w-1/2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Step 6: Review, Editorial Curation & Publication
 */
export const Step6PublishPanel: React.FC<StepPanelsProps> = ({
  formData,
  setFormData,
  setIsDirty,
}) => {
  const isAllFilled =
    Boolean(formData.title?.trim()) &&
    Boolean(formData.slug?.trim()) &&
    Boolean(formData.excerpt?.trim()) &&
    Boolean(formData.coverImage?.trim()) &&
    Boolean(formData.content && formData.content.length > 30);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Step 6: Editorial Curation, Author &amp; Release
            </h2>
            <p className="text-xs text-slate-400">
              Verify author attribution, choose placement flags, set publication schedule, and publish live.
            </p>
          </div>
        </div>

        {/* Author Details (No Author Image Required - Professional Circular Initials Avatar) */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-4">
          {/* Live Initials Preview */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-3">
              <AuthorAvatar name={formData.author?.name || 'KJT Technologies'} size="md" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{formData.author?.name || 'KJT Technologies'}</span>
                  <span className="text-[10px] font-semibold text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded-full border border-[#00D4FF]/30">
                    Initials: {getAuthorInitials(formData.author?.name || 'KJT Technologies')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {formData.author?.role || 'Technology Analyst'} • Auto-generated circular initials avatar
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
              No photo required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author?.name || ''}
                onChange={(e) => {
                  setIsDirty(true);
                  setFormData({
                    ...formData,
                    author: { ...formData.author!, name: e.target.value },
                  });
                }}
                placeholder="e.g. Samuel K. Mutumba"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Author Role / Title
              </label>
              <input
                type="text"
                value={formData.author?.role || ''}
                onChange={(e) => {
                  setIsDirty(true);
                  setFormData({
                    ...formData,
                    author: { ...formData.author!, role: e.target.value },
                  });
                }}
                placeholder="e.g. Lead Cybersecurity Architect"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
              />
            </div>
          </div>

          {/* Author Biography */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Author Biography (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.author?.bio || ''}
              onChange={(e) => {
                setIsDirty(true);
                setFormData({
                  ...formData,
                  author: { ...formData.author!, bio: e.target.value },
                });
              }}
              placeholder="Short bio describing the author's expertise and focus areas..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF] resize-none"
            />
          </div>
        </div>

        {/* Publication Status & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Publication Status
            </label>
            <select
              value={formData.status || 'published'}
              onChange={(e) => {
                setIsDirty(true);
                setFormData({ ...formData, status: e.target.value as any });
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
            >
              <option value="published">Published (Visible to all public readers)</option>
              <option value="draft">Draft (Saved privately in CMS)</option>
              <option value="scheduled">Scheduled (Embargoed until date)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Publication Date
            </label>
            <input
              type="date"
              value={formData.publishedAt || ''}
              onChange={(e) => {
                setIsDirty(true);
                setFormData({ ...formData, publishedAt: e.target.value });
              }}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
            />
          </div>
        </div>

        {/* Curation Options */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
            Placement &amp; Spotlight Flags
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Featured */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer hover:border-slate-600 transition">
              <input
                type="checkbox"
                checked={!!formData.isFeatured}
                onChange={(e) => {
                  setIsDirty(true);
                  setFormData({ ...formData, isFeatured: e.target.checked });
                }}
                className="mt-0.5 rounded text-amber-400 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Featured Hero</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Spotlight in the top hero showcase.
                </p>
              </div>
            </label>

            {/* Trending */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer hover:border-slate-600 transition">
              <input
                type="checkbox"
                checked={!!formData.isTrending}
                onChange={(e) => {
                  setIsDirty(true);
                  setFormData({ ...formData, isTrending: e.target.checked });
                }}
                className="mt-0.5 rounded text-[#00D4FF] focus:ring-0 cursor-pointer"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span>Trending Badge</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Highlight in Trending Tech feed.
                </p>
              </div>
            </label>

            {/* Fast-breaking news */}
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer hover:border-slate-600 transition">
              <input
                type="checkbox"
                checked={!!formData.isNews}
                onChange={(e) => {
                  setIsDirty(true);
                  setFormData({ ...formData, isNews: e.target.checked });
                }}
                className="mt-0.5 rounded text-blue-400 focus:ring-0 cursor-pointer"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">
                  Breaking Dispatch
                </div>
                <p className="text-[10px] text-slate-400">
                  Tag as official press dispatch.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Pre-publication Verification Checklist */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pre-Publish Editorial Checklist
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isAllFilled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {isAllFilled ? 'Ready to Publish' : 'Action Required'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  formData.title ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span className={formData.title ? 'text-slate-300' : 'text-slate-500'}>
                Title verified (no hashtags)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  formData.slug ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span className={formData.slug ? 'text-slate-300' : 'text-slate-500'}>
                Clean permalink slug
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  formData.coverImage ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span className={formData.coverImage ? 'text-slate-300' : 'text-slate-500'}>
                Featured cover photo attached
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  formData.content && formData.content.length > 30
                    ? 'text-emerald-400'
                    : 'text-slate-600'
                }`}
              />
              <span
                className={
                  formData.content && formData.content.length > 30
                    ? 'text-slate-300'
                    : 'text-slate-500'
                }
              >
                Article body formatted
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  (formData.tags || []).length > 0 ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span
                className={
                  (formData.tags || []).length > 0 ? 'text-slate-300' : 'text-slate-500'
                }
              >
                Search keywords assigned
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  formData.author?.name ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span className={formData.author?.name ? 'text-slate-300' : 'text-slate-500'}>
                Author attributed
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
