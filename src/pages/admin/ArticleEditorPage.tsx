/**
 * =====================================================================
 * PROFESSIONAL ARTICLE & NEWS EDITOR - KJT TECHNOLOGIES CMS
 * =====================================================================
 * 
 * Features:
 * - Professional WYSIWYG Rich Text Editor (Headings, quotes, links, tables, media)
 * - Title validation: enforces professional guidelines (no hashtags, no excessive caps)
 * - Featured image and additional article images with previews, alt text & captions
 * - SEO Title and Meta Description live character counters
 * - URL slug generator with custom override
 * - Category selector & clean tag manager (auto-strips leading hashtags)
 * - Author profile, source attribution, and event date
 * - Editorial toggles: Lead Featured story, Trending tech news
 * - Workflow: Save Draft, Publish, Schedule Publication, Cancel, Live Preview modal
 * - Autosave to local storage + unsaved changes warning before leaving
 * =====================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Save,
  Eye,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Clock,
  Calendar,
  Tag,
  CheckCircle,
  AlertCircle,
  Link2,
  FileText,
  User,
  Plus,
  Trash2,
  X,
  Share2,
  HelpCircle,
  CalendarClock,
  RotateCcw,
  Wand2,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
  Send,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { BlogPostItem } from '../../types';
import { getAllAdminArticles, upsertArticle } from '../../lib/articlesService';
import { AuthorAvatar } from '../../components/common/AuthorAvatar';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import {
  ArticleEditorStepBar,
  StepNavigationControls,
} from '../../components/admin/ArticleEditorStepBar';
import {
  Step1DetailsPanel,
  Step2MediaPanel,
  Step3ContentPanel,
  Step4TaxonomyPanel,
  Step5SeoPanel,
  Step6PublishPanel,
} from '../../components/admin/ArticleEditorStepPanels';
import {
  sanitizeArticleHtml,
  cleanArticleObject,
  detectGoogleAiStudioArtifacts,
  cleanTitle,
  generateCleanSlug,
} from '../../lib/contentSanitizer';

const CATEGORIES = [
  'Artificial Intelligence',
  'Cybersecurity',
  'Software and Apps',
  'Smartphones and Devices',
  'Cloud Computing',
  'Business Technology',
  'Emerging Technology',
  'African Technology',
  'Ugandan Technology',
  'Education Technology',
  'Tutorials and Guides',
];

interface AdditionalImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
}

export const ArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState<boolean>(isEditing);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');

  // Clean Existing Article Formatting state (Requirement 6)
  const [showCleanModal, setShowCleanModal] = useState<boolean>(false);
  const [cleanPreviewData, setCleanPreviewData] = useState<{
    originalHtml: string;
    cleanedHtml: string;
    hasArtifacts: boolean;
    activeTab: 'visual' | 'code' | 'raw';
  }>({
    originalHtml: '',
    cleanedHtml: '',
    hasArtifacts: false,
    activeTab: 'visual',
  });

  // Title validation state
  const [titleWarning, setTitleWarning] = useState<string>('');

  // Additional article images
  const [additionalImages, setAdditionalImages] = useState<AdditionalImage[]>([]);

  // Main Article Data
  const [formData, setFormData] = useState<Partial<BlogPostItem>>({
    id: `art-${Date.now()}`,
    slug: '',
    title: '',
    seoTitle: '',
    metaDescription: '',
    excerpt: '',
    content: '',
    category: 'Cybersecurity',
    author: {
      name: 'KJT Engineering Team',
      role: 'Technology Systems Architect',
      bio: 'Enterprise systems engineers and cloud security specialists at KJT TECHNOLOGIES.',
    },
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: '6 min read',
    coverImage: '',
    imageAlt: '',
    imageCaption: '',
    tags: ['Cybersecurity', 'Uganda Tech', 'Best Practices'],
    status: 'published',
    isFeatured: false,
    isTrending: false,
    isNews: false,
    originalSource: '',
    sourceUrl: '',
    eventDate: '',
  });

  const [tagInput, setTagInput] = useState<string>('');

  // 6-Step Article Creation Workflow
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [workflowMode, setWorkflowMode] = useState<'stepper' | 'all'>('stepper');

  const WORKFLOW_STEPS = [
    {
      step: 1,
      name: 'Article Details',
      shortDesc: 'Title, slug & summary',
      icon: FileText,
    },
    {
      step: 2,
      name: 'Featured & Media',
      shortDesc: 'Cover photo & gallery',
      icon: ImageIcon,
    },
    {
      step: 3,
      name: 'Article Content',
      shortDesc: 'WYSIWYG & sanitizer',
      icon: Sparkles,
    },
    {
      step: 4,
      name: 'Category & Tags',
      shortDesc: 'Topics & reading time',
      icon: Tag,
    },
    {
      step: 5,
      name: 'SEO & Attribution',
      shortDesc: 'Meta SERP & source',
      icon: Globe,
    },
    {
      step: 6,
      name: 'Review & Publish',
      shortDesc: 'Curation & release',
      icon: Send,
    },
  ];

  const isStepComplete = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return Boolean(formData.title?.trim() && formData.slug?.trim() && formData.excerpt?.trim());
      case 2:
        return Boolean(formData.coverImage?.trim());
      case 3:
        return Boolean(formData.content && formData.content.trim().length > 30);
      case 4:
        return Boolean(formData.category && formData.tags && formData.tags.length > 0);
      case 5:
        return Boolean(formData.seoTitle || formData.metaDescription || formData.originalSource);
      case 6:
        return Boolean(formData.status);
      default:
        return false;
    }
  };

  // Warn user if leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Load existing article if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchArticle = async () => {
        setLoading(true);
        const all = await getAllAdminArticles();
        const found = all.find((a) => a.id === id || a.slug === id);
        if (found) {
          setFormData(found);
          // Check if there are additional images stored in article
          if ((found as any).additionalImages) {
            setAdditionalImages((found as any).additionalImages);
          }
        } else {
          setErrorMessage('Article not found.');
        }
        setLoading(false);
      };
      fetchArticle();
    } else {
      // Check for local unsaved draft recovery
      const draftKey = 'kjt_unsaved_new_article';
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData(parsed);
          setLastAutoSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch {
          // ignore corrupted draft
        }
      }
    }
  }, [id, isEditing]);

  // Autosave interval (every 30 seconds if dirty)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty) {
        const key = isEditing && id ? `kjt_draft_${id}` : 'kjt_unsaved_new_article';
        localStorage.setItem(key, JSON.stringify({ ...formData, additionalImages }));
        setLastAutoSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [isDirty, formData, additionalImages, isEditing, id]);

  // Validate title on change
  const validateTitle = (text: string) => {
    let warning = '';
    if (text.includes('#')) {
      warning = 'Notice: Hashtags are not allowed in article titles. They will be removed.';
    } else if (/!{2,}/.test(text)) {
      warning = 'Notice: Please avoid multiple exclamation marks (e.g. !!) in professional editorial titles.';
    } else if (text.length > 5 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
      warning = 'Notice: Avoid ALL-CAPS titles. Please use standard sentence or title case.';
    }
    setTitleWarning(warning);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Auto-clean hashtags and invalid characters using cleanTitle
    const cleanedTitle = cleanTitle(rawVal);
    validateTitle(rawVal);
    setIsDirty(true);

    const generatedSlug = generateCleanSlug(cleanedTitle);

    setFormData((prev) => ({
      ...prev,
      title: cleanedTitle,
      slug: prev.slug || generatedSlug,
      seoTitle: prev.seoTitle || (cleanedTitle ? `${cleanedTitle} | KJT TECHNOLOGIES` : ''),
    }));
  };

  const handleTitlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain');
    const cleaned = cleanTitle(pasted);
    const target = e.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    const current = formData.title || '';
    const newTitle = current.slice(0, start) + cleaned + current.slice(end);
    const cleanedFinal = cleanTitle(newTitle);
    const generatedSlug = generateCleanSlug(cleanedFinal);

    validateTitle(cleanedFinal);
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      title: cleanedFinal,
      slug: prev.slug || generatedSlug,
      seoTitle: prev.seoTitle || (cleanedFinal ? `${cleanedFinal} | KJT TECHNOLOGIES` : ''),
    }));
  };

  const handleTitleBlur = () => {
    if (formData.title) {
      const cleaned = cleanTitle(formData.title);
      if (cleaned !== formData.title) {
        setFormData((prev) => ({ ...prev, title: cleaned }));
      }
    }
  };

  const handleAddTag = () => {
    let cleanTag = tagInput.trim().replace(/^#+/, ''); // strip leading #
    if (cleanTag && !formData.tags?.includes(cleanTag)) {
      setIsDirty(true);
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), cleanTag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove) || [],
    }));
  };

  const handleRegenerateSlug = () => {
    const cleanedTitle = cleanTitle(formData.title || '');
    const newSlug = generateCleanSlug(cleanedTitle);
    setFormData((prev) => ({ ...prev, slug: newSlug }));
    setIsDirty(true);
  };

  const handleCalculateReadingTime = () => {
    const text = (formData.content || '').replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setFormData((prev) => ({ ...prev, readTime: `${minutes} min read` }));
    setIsDirty(true);
  };

  const handleAddAdditionalImage = () => {
    setIsDirty(true);
    setAdditionalImages((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        url: '',
        alt: '',
        caption: '',
      },
    ]);
  };

  const handleUpdateAdditionalImage = (id: string, updates: Partial<AdditionalImage>) => {
    setIsDirty(true);
    setAdditionalImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  const handleRemoveAdditionalImage = (id: string) => {
    setIsDirty(true);
    setAdditionalImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        'You have unsaved changes in this article. Are you sure you want to discard them and leave?'
      );
      if (!confirmDiscard) return;
    }
    navigate('/admin/dashboard');
  };

  const handleSubmit = async (saveStatus?: 'draft' | 'published' | 'scheduled') => {
    setErrorMessage('');
    setSuccessMessage('');

    const finalCleanTitle = cleanTitle(formData.title || '');
    if (!finalCleanTitle) {
      setErrorMessage('Article title is required and cannot consist only of symbols or hashtags.');
      return;
    }

    const finalCleanSlug = generateCleanSlug(formData.slug || finalCleanTitle);
    if (!finalCleanSlug) {
      setErrorMessage('A valid URL Slug is required.');
      return;
    }

    const isPublishing = (saveStatus || formData.status) === 'published' || (saveStatus || formData.status) === 'scheduled';
    if (isPublishing) {
      if (!formData.excerpt?.trim()) {
        setErrorMessage('Summary excerpt is required before publishing.');
        return;
      }
      if (!formData.content?.trim()) {
        setErrorMessage('Article body content is required before publishing.');
        return;
      }
      if (!formData.coverImage?.trim()) {
        setErrorMessage('Featured cover image is required before publishing.');
        return;
      }
    }

    setSaving(true);

    const articleToSave: BlogPostItem & { additionalImages?: AdditionalImage[] } = {
      id: formData.id || `art-${Date.now()}`,
      slug: finalCleanSlug,
      title: finalCleanTitle,
      seoTitle: formData.seoTitle ? cleanTitle(formData.seoTitle) : `${finalCleanTitle} | KJT TECHNOLOGIES`,
      metaDescription: formData.metaDescription || formData.excerpt || '',
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      category: formData.category || 'Cybersecurity',
      author: {
        name: formData.author?.name || 'KJT Engineering Team',
        role: formData.author?.role || 'Technology Analyst',
        bio: formData.author?.bio || '',
      },
      publishedAt: formData.publishedAt || new Date().toISOString().split('T')[0],
      readTime: formData.readTime || '5 min read',
      coverImage: formData.coverImage || '',
      imageAlt: formData.imageAlt || finalCleanTitle,
      imageCaption: formData.imageCaption,
      tags: formData.tags || [],
      status: saveStatus || formData.status || 'published',
      isFeatured: !!formData.isFeatured,
      isTrending: !!formData.isTrending,
      isNews: !!formData.isNews,
      originalSource: formData.originalSource,
      sourceUrl: formData.sourceUrl,
      eventDate: formData.eventDate,
      additionalImages: additionalImages,
    };

    // ARTICLE STORAGE: This function saves sanitized article content.
    const res = await upsertArticle(articleToSave);
    setSaving(false);

    if (res.success) {
      setIsDirty(false);
      // Clear draft storage
      const draftKey = isEditing && id ? `kjt_draft_${id}` : 'kjt_unsaved_new_article';
      localStorage.removeItem(draftKey);

      setSuccessMessage(
        saveStatus === 'draft'
          ? 'Draft successfully saved!'
          : saveStatus === 'scheduled'
          ? 'Article scheduled for future publication!'
          : 'Article successfully published to KJT TECHNOLOGIES!'
      );
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1200);
    } else {
      setErrorMessage(res.error || 'Failed to save article.');
    }
  };

  const handleScheduleConfirm = () => {
    if (!scheduledDateTime) {
      setErrorMessage('Please select a target date and time for scheduled release.');
      return;
    }
    const [datePart] = scheduledDateTime.split('T');
    setFormData((prev) => ({
      ...prev,
      publishedAt: datePart,
      status: 'scheduled',
    }));
    setShowScheduleModal(false);
    handleSubmit('scheduled');
  };

  const handleOpenCleanModal = () => {
    const rawContent = formData.content || '';
    const cleanedContent = sanitizeArticleHtml(rawContent, {
      articleTitle: formData.title || '',
      promoteBoldParagraphsToHeadings: true,
      allowAnchorIds: true,
    });
    const hasArtifacts = detectGoogleAiStudioArtifacts(rawContent);

    setCleanPreviewData({
      originalHtml: rawContent,
      cleanedHtml: cleanedContent,
      hasArtifacts,
      activeTab: 'visual',
    });
    setShowCleanModal(true);
  };

  const handleApplyCleanFormatting = (saveImmediately = false) => {
    const updatedContent = cleanPreviewData.cleanedHtml;
    setFormData((prev) => ({
      ...prev,
      content: updatedContent,
      title: (prev.title || '').replace(/^#+\s*/, '').trim(),
      tags: (prev.tags || []).map((t) => t.replace(/^#+/, '').trim()).filter(Boolean),
    }));
    setIsDirty(true);
    setShowCleanModal(false);
    setSuccessMessage('Article formatting cleaned! Removed Google AI Studio tags, inline font styles, and normalized headings.');
    setTimeout(() => setSuccessMessage(''), 4000);

    if (saveImmediately) {
      setTimeout(() => {
        handleSubmit(formData.status || 'published');
      }, 200);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs">
        Loading article data...
      </div>
    );
  }

  // Live SEO Counters
  const seoTitleLength = formData.seoTitle?.length || 0;
  const metaDescLength = formData.metaDescription?.length || 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {isEditing ? 'Edit Article' : 'Author New Article'}
              </h1>
              {isDirty && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-semibold">
                  Unsaved edits
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {lastAutoSaved ? `Autosaved at ${lastAutoSaved}` : 'Changes autosaved every 30 seconds'}
            </p>
          </div>
        </div>

        {/* Action Button Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cancel button */}
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>

          {/* Preview button */}
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Eye className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>Preview</span>
          </button>

          {/* Clean Existing Article Formatting (Requirement 6) */}
          <button
            type="button"
            onClick={handleOpenCleanModal}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-amber-500/40"
            title="Clean Google AI Studio formatting, inline styles & citation components"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Clean Formatting</span>
          </button>

          {/* Save Draft / Unpublish button */}
          {formData.status === 'published' ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('draft')}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/40 transition cursor-pointer disabled:opacity-50"
              title="Convert this live article back to an internal draft"
            >
              Unpublish (To Draft)
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit('draft')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 transition cursor-pointer disabled:opacity-50"
            >
              Save Draft
            </button>
          )}

          {/* Schedule Publication button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => setShowScheduleModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/30 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>

          {/* Publish button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSubmit('published')}
            className="px-4 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#00D4FF]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 6-Step Workflow Stepper Bar */}
      <ArticleEditorStepBar
        steps={WORKFLOW_STEPS}
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        isStepComplete={isStepComplete}
        workflowMode={workflowMode}
        onToggleMode={(mode) => setWorkflowMode(mode)}
      />

      {/* Main Content Area: Stepper Mode or All Sections Mode */}
      {workflowMode === 'stepper' ? (
        <div className="space-y-6">
          {currentStep === 1 && (
            <Step1DetailsPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />
          )}

          {currentStep === 2 && (
            <Step2MediaPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />
          )}

          {currentStep === 3 && (
            <Step3ContentPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />
          )}

          {currentStep === 4 && (
            <Step4TaxonomyPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />
          )}

          {currentStep === 5 && (
            <Step5SeoPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />
          )}

          {currentStep === 6 && (
            <Step6PublishPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />
          )}

          {/* Stepper Navigation Footer */}
          <StepNavigationControls
            currentStep={currentStep}
            totalSteps={WORKFLOW_STEPS.length}
            onPrev={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            onNext={() => setCurrentStep((prev) => Math.min(WORKFLOW_STEPS.length, prev + 1))}
            onSaveDraft={() => handleSubmit('draft')}
            onPublish={() => handleSubmit('published')}
            saving={saving}
            isCurrentStepComplete={isStepComplete(currentStep)}
          />
        </div>
      ) : (
        /* All-in-One Expanded Layout */
        <div className="space-y-8">
          <Step1DetailsPanel
            formData={formData}
            setFormData={setFormData}
            setIsDirty={setIsDirty}
            titleWarning={titleWarning}
            handleTitleChange={handleTitleChange}
            handleTitlePaste={handleTitlePaste}
            handleTitleBlur={handleTitleBlur}
            handleRegenerateSlug={handleRegenerateSlug}
            handleCalculateReadingTime={handleCalculateReadingTime}
            categories={CATEGORIES}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            additionalImages={additionalImages}
            handleAddAdditionalImage={handleAddAdditionalImage}
            handleUpdateAdditionalImage={handleUpdateAdditionalImage}
            handleRemoveAdditionalImage={handleRemoveAdditionalImage}
            seoTitleLength={seoTitleLength}
            metaDescLength={metaDescLength}
          />

          <Step2MediaPanel
            formData={formData}
            setFormData={setFormData}
            setIsDirty={setIsDirty}
            titleWarning={titleWarning}
            handleTitleChange={handleTitleChange}
            handleTitlePaste={handleTitlePaste}
            handleTitleBlur={handleTitleBlur}
            handleRegenerateSlug={handleRegenerateSlug}
            handleCalculateReadingTime={handleCalculateReadingTime}
            categories={CATEGORIES}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            additionalImages={additionalImages}
            handleAddAdditionalImage={handleAddAdditionalImage}
            handleUpdateAdditionalImage={handleUpdateAdditionalImage}
            handleRemoveAdditionalImage={handleRemoveAdditionalImage}
            seoTitleLength={seoTitleLength}
            metaDescLength={metaDescLength}
          />

          <Step3ContentPanel
            formData={formData}
            setFormData={setFormData}
            setIsDirty={setIsDirty}
            titleWarning={titleWarning}
            handleTitleChange={handleTitleChange}
            handleTitlePaste={handleTitlePaste}
            handleTitleBlur={handleTitleBlur}
            handleRegenerateSlug={handleRegenerateSlug}
            handleCalculateReadingTime={handleCalculateReadingTime}
            categories={CATEGORIES}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            additionalImages={additionalImages}
            handleAddAdditionalImage={handleAddAdditionalImage}
            handleUpdateAdditionalImage={handleUpdateAdditionalImage}
            handleRemoveAdditionalImage={handleRemoveAdditionalImage}
            seoTitleLength={seoTitleLength}
            metaDescLength={metaDescLength}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Step4TaxonomyPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />

            <Step5SeoPanel
              formData={formData}
              setFormData={setFormData}
              setIsDirty={setIsDirty}
              titleWarning={titleWarning}
              handleTitleChange={handleTitleChange}
              handleTitlePaste={handleTitlePaste}
              handleTitleBlur={handleTitleBlur}
              handleRegenerateSlug={handleRegenerateSlug}
              handleCalculateReadingTime={handleCalculateReadingTime}
              categories={CATEGORIES}
              tagInput={tagInput}
              setTagInput={setTagInput}
              handleAddTag={handleAddTag}
              handleRemoveTag={handleRemoveTag}
              additionalImages={additionalImages}
              handleAddAdditionalImage={handleAddAdditionalImage}
              handleUpdateAdditionalImage={handleUpdateAdditionalImage}
              handleRemoveAdditionalImage={handleRemoveAdditionalImage}
              seoTitleLength={seoTitleLength}
              metaDescLength={metaDescLength}
            />
          </div>

          <Step6PublishPanel
            formData={formData}
            setFormData={setFormData}
            setIsDirty={setIsDirty}
            titleWarning={titleWarning}
            handleTitleChange={handleTitleChange}
            handleTitlePaste={handleTitlePaste}
            handleTitleBlur={handleTitleBlur}
            handleRegenerateSlug={handleRegenerateSlug}
            handleCalculateReadingTime={handleCalculateReadingTime}
            categories={CATEGORIES}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            additionalImages={additionalImages}
            handleAddAdditionalImage={handleAddAdditionalImage}
            handleUpdateAdditionalImage={handleUpdateAdditionalImage}
            handleRemoveAdditionalImage={handleRemoveAdditionalImage}
            seoTitleLength={seoTitleLength}
            metaDescLength={metaDescLength}
          />
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Public Article Preview (Reader View)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reader Canvas (Comfortable reading width, dark on light, high typography hierarchy) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-12">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Category label */}
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0055FF] text-xs font-bold uppercase tracking-wider">
                  {formData.category}
                </span>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                  {formData.title || 'Untitled Article'}
                </h1>

                {/* Excerpt / Intro */}
                {formData.excerpt && (
                  <p className="text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-[#0055FF] pl-4 py-1 italic">
                    {formData.excerpt}
                  </p>
                )}

                {/* Author & Meta */}
                <div className="flex items-center gap-3 py-3 border-y border-slate-100 text-xs text-slate-500">
                  <AuthorAvatar name={formData.author?.name || 'KJT Engineering Team'} size="sm" />
                  <div>
                    <div className="font-semibold text-slate-800">{formData.author?.name || 'KJT Engineering Team'}</div>
                    {formData.author?.role && <div className="text-[11px] text-slate-500">{formData.author.role}</div>}
                  </div>
                  <span>&bull;</span>
                  <span>{formData.publishedAt}</span>
                  <span>&bull;</span>
                  <span>{formData.readTime}</span>
                </div>

                {/* Featured Cover Image */}
                {formData.coverImage && (
                  <figure className="my-6">
                    <img
                      src={formData.coverImage}
                      alt={formData.imageAlt || formData.title || ''}
                      className="w-full h-80 sm:h-96 object-cover rounded-2xl shadow-md"
                    />
                    {formData.imageCaption && (
                      <figcaption className="text-xs text-slate-500 mt-2 text-center italic">
                        {formData.imageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* Article Body Content */}
                <div
                  className="article-editorial-body leading-relaxed text-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeArticleHtml(formData.content || '<p>No content entered yet.</p>', {
                      articleTitle: formData.title,
                      allowAnchorIds: true,
                    }),
                  }}
                />

                {/* Tags */}
                {formData.tags && formData.tags.length > 0 && (
                  <div className="pt-8 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Filed Under
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Profile Bio Preview */}
                <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start gap-4">
                  <AuthorAvatar name={formData.author?.name || 'KJT Engineering Team'} size="lg" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0055FF]">
                      Author Profile
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {formData.author?.name || 'KJT Engineering Team'}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      {formData.author?.role || 'Technology Analyst'}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                      {formData.author?.bio ||
                        'Enterprise systems engineers and cloud security specialists at KJT TECHNOLOGIES.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Matches the live public website typography and reading column
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Publication Modal */}
      {showScheduleModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#00D4FF]">
              <CalendarClock className="w-5 h-5" />
              <h4 className="text-base font-bold text-white">Schedule Publication</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Select the future date and time when this article should automatically be released to visitors.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Release Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00D4FF]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleConfirm}
                className="px-4 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase cursor-pointer"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Clean Existing Article Formatting Modal (Requirement 6) */}
      {showCleanModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Clean Existing Article Formatting</span>
                    {cleanPreviewData.hasArtifacts && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                        Google AI Studio Detected
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Removes messy inline styles, citation components, and data attributes while preserving headings &amp; text.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCleanModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanatory Banner */}
            <div className="bg-slate-950/60 border-b border-slate-800 px-6 py-3 text-xs text-slate-300 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Safe Cleaning Process: </span>
                <span>
                  Preserves all visible text, paragraphs, lists, and links. Promotes section titles to standard <code className="text-amber-300">&lt;h2&gt;</code> headings. Eliminates <code className="text-cyan-300">font-family: Google Sans Text</code>, citations, and Angular tags.
                </span>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-900">
              <button
                type="button"
                onClick={() => setCleanPreviewData((p) => ({ ...p, activeTab: 'visual' }))}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 cursor-pointer ${
                  cleanPreviewData.activeTab === 'visual'
                    ? 'border-[#00D4FF] text-[#00D4FF] bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Clean Visual Preview
              </button>
              <button
                type="button"
                onClick={() => setCleanPreviewData((p) => ({ ...p, activeTab: 'code' }))}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 cursor-pointer ${
                  cleanPreviewData.activeTab === 'code'
                    ? 'border-[#00D4FF] text-[#00D4FF] bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Clean HTML Code
              </button>
              <button
                type="button"
                onClick={() => setCleanPreviewData((p) => ({ ...p, activeTab: 'raw' }))}
                className={`px-4 py-2 text-xs font-bold rounded-t-lg transition border-b-2 cursor-pointer ${
                  cleanPreviewData.activeTab === 'raw'
                    ? 'border-[#00D4FF] text-[#00D4FF] bg-slate-800/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Original Raw Code (Before)
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/40">
              {cleanPreviewData.activeTab === 'visual' && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-800 shadow-inner">
                  <div
                    className="article-editorial-body text-slate-800"
                    dangerouslySetInnerHTML={{ __html: cleanPreviewData.cleanedHtml || '<p>No content to preview.</p>' }}
                  />
                </div>
              )}

              {cleanPreviewData.activeTab === 'code' && (
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {cleanPreviewData.cleanedHtml || '<!-- No cleaned content -->'}
                </pre>
              )}

              {cleanPreviewData.activeTab === 'raw' && (
                <div className="space-y-2">
                  <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Raw markup before cleaning:</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {cleanPreviewData.originalHtml || '<!-- No original content -->'}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950">
              <span className="text-xs text-slate-400">
                Requires confirmation before updating stored content.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCleanModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCleanFormatting(false)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Apply Cleaned Content</span>
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleApplyCleanFormatting(true)}
                    className="px-4 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Confirm &amp; Save to Database</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
