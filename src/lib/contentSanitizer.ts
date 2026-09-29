/**
 * =====================================================================
 * ARTICLE CONTENT SANITIZER & HTML CLEANER - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Trusted sanitization using DOMPurify with specialized pre-processing for:
 * 1. Google AI Studio, Google Docs, Microsoft Word pasted artifacts
 * 2. Citation components (<source-footnote>, <sources-carousel-inline>, <source-inline-chip>, empty <sup>)
 * 3. Angular directives & custom element cleanup (ng-*, _nghost, _ngcontent)
 * 4. Inline style stripping (e.g. font-family: "Google Sans Text"; line-height: 1.15)
 * 5. Intelligent heading promotion: converts bold short paragraphs to <h2>
 * 6. Safe link formatting (target="_blank" rel="noopener noreferrer")
 * 7. Empty element stripping & duplicate whitespace reduction
 * =====================================================================
 */

import DOMPurifyModule from 'dompurify';
import { BlogPostItem } from '../types';

let purifyInstance: any = null;

function getDOMPurify(): any {
  if (purifyInstance) return purifyInstance;
  if (typeof window !== 'undefined') {
    if (typeof (DOMPurifyModule as any) === 'function') {
      purifyInstance = (DOMPurifyModule as any)(window);
    } else if ((DOMPurifyModule as any)?.sanitize) {
      purifyInstance = DOMPurifyModule;
    } else if ((DOMPurifyModule as any)?.default) {
      const def = (DOMPurifyModule as any).default;
      purifyInstance = typeof def === 'function' ? def(window) : def;
    }
  }
  return purifyInstance;
}

export interface CleanOptions {
  promoteBoldParagraphsToHeadings?: boolean;
  articleTitle?: string;
  allowAnchorIds?: boolean;
}

/**
 * Strips hashtags, emojis, excessive punctuation, and extra whitespace from titles and headings.
 * Preserves the meaningful word after any hashtag:
 * e.g. "#AI and #Cybersecurity Trends 🚀!!!" -> "AI and Cybersecurity Trends!"
 */
export function cleanTitle(rawTitle: string): string {
  if (!rawTitle || typeof rawTitle !== 'string') return '';

  let cleaned = rawTitle;

  // 1. Remove emojis (covers emoticons, symbols, pictographs, transport, flags)
  try {
    cleaned = cleaned.replace(/\p{Extended_Pictographic}/gu, '');
  } catch {
    cleaned = cleaned.replace(
      /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
      ''
    );
  }

  // 2. Remove hash symbols without deleting the word attached to it
  // E.g. "#AI and #Cybersecurity Trends" -> "AI and Cybersecurity Trends"
  cleaned = cleaned.replace(/#+/g, '');

  // 3. Normalize excessive punctuation (e.g. multiple ! or ? or ....)
  cleaned = cleaned.replace(/!{2,}/g, '!');
  cleaned = cleaned.replace(/\?{2,}/g, '?');
  cleaned = cleaned.replace(/\.{4,}/g, '...');

  // 4. Collapse multiple whitespace and tabs into a single space
  cleaned = cleaned.replace(/\s+/g, ' ');

  // 5. Trim leading and trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Generates a clean URL slug:
 * - Lowercase
 * - No hashtags or emojis
 * - Replaces spaces/special characters with hyphens
 * - Collapses multiple hyphens into a single hyphen
 * - Trims leading and trailing hyphens
 */
export function generateCleanSlug(titleOrText: string): string {
  if (!titleOrText || typeof titleOrText !== 'string') return '';
  const cleaned = cleanTitle(titleOrText);
  return cleaned
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if content contains raw Google AI Studio or other pasted artifacts
 */
export function detectGoogleAiStudioArtifacts(content: string): boolean {
  if (!content) return false;
  const indicators = [
    'data-path-to-node',
    'citation-',
    'source-footnote',
    'sources-carousel-inline',
    'source-inline-chip',
    'Google Sans',
    'Google Sans Text',
    'ng-version',
    '_nghost',
    '_ngcontent',
    'mso-',
    'MsoNormal',
  ];
  return indicators.some((ind) => content.includes(ind));
}

/**
 * Convert plain text into well-formatted HTML paragraphs
 */
export function cleanPlainText(rawText: string): string {
  if (!rawText) return '';
  // Strip any existing HTML tags
  const stripped = rawText.replace(/<[^>]*>/g, '').trim();
  if (!stripped) return '';

  const paragraphs = stripped
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs
    .map((p) => {
      // Escape HTML special characters
      const escaped = p
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<p>${escaped.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');
}

/**
 * Core reusable article HTML sanitization function
 * Consistently used across:
 * - RichTextEditor on paste
 * - ArticleEditorPage on save
 * - BlogPostDetailPage on public render
 * - Live preview modal
 * - Batch cleaner utility
 */
export function sanitizeArticleHtml(dirtyHtml: string, options: CleanOptions = {}): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  const {
    promoteBoldParagraphsToHeadings = true,
    articleTitle = '',
    allowAnchorIds = true,
  } = options;

  // In non-browser environments (e.g. SSR if any), use DOMPurify directly
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
    const purifier = getDOMPurify();
    if (!purifier) return dirtyHtml;
    return purifier.sanitize(dirtyHtml, {
      ALLOWED_TAGS: [
        'p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption',
        'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'code', 'pre',
      ],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'id'],
    });
  }

  // 1. DOM Parsing Phase
  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');
  const body = doc.body;

  // 2. Remove forbidden and unwanted tags entirely (scripts, styles, unwanted custom tags)
  const removeSelectors = [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'source-footnote',
    'sources-carousel-inline',
    'source-inline-chip',
    'app-root',
    'custom-style',
  ];

  removeSelectors.forEach((sel) => {
    const els = body.querySelectorAll(sel);
    els.forEach((el) => el.remove());
  });

  // Also remove any custom elements with hyphens that are not standard (e.g. <custom-element>)
  const allElements = Array.from(body.querySelectorAll('*'));
  for (const el of allElements) {
    const tagName = el.tagName.toLowerCase();
    if (tagName.includes('-') && !['math-field'].includes(tagName)) {
      // If it contains text, unwrap it; otherwise remove
      if (el.textContent && el.textContent.trim().length > 0) {
        unwrapElement(el);
      } else {
        el.remove();
      }
    }
  }

  // 3. Remove citation wrappers and empty superscript elements
  // Empty superscript elements
  const sups = body.querySelectorAll('sup');
  sups.forEach((sup) => {
    if (!sup.textContent || sup.textContent.trim() === '') {
      sup.remove();
    }
  });

  // Citation spans: e.g. <span class="citation-79">Visible text <source-footnote><sup></sup></source-footnote></span>
  const allSpans = Array.from(body.querySelectorAll('span'));
  allSpans.forEach((span) => {
    const className = span.getAttribute('class') || '';
    if (className.includes('citation') || span.hasAttribute('data-citation-id')) {
      // First remove any footnotes inside
      const footnotes = span.querySelectorAll('source-footnote, sources-carousel-inline, source-inline-chip, sup');
      footnotes.forEach((fn) => {
        if (fn.tagName.toLowerCase() === 'sup' && fn.textContent && fn.textContent.trim().length > 0) {
          // keep non-empty sup text
        } else {
          fn.remove();
        }
      });
      // Unwrap the span so visible text is preserved without citation styling
      unwrapElement(span);
    }
  });

  // 4. Attribute sanitization and cleaning across ALL elements
  const remainingElements = Array.from(body.querySelectorAll('*'));
  remainingElements.forEach((el) => {
    const attrs = Array.from(el.attributes);
    attrs.forEach((attr) => {
      const name = attr.name.toLowerCase();

      // Remove inline style attributes completely
      if (name === 'style') {
        el.removeAttribute(attr.name);
      }
      // Remove class attributes completely (public styles handle typography cleanly)
      else if (name === 'class') {
        el.removeAttribute(attr.name);
      }
      // Remove data-* attributes (like data-path-to-node, data-is-last-node, etc.)
      else if (name.startsWith('data-')) {
        el.removeAttribute(attr.name);
      }
      // Remove Angular attributes (ng-*, _nghost, _ngcontent)
      else if (name.startsWith('ng-') || name.startsWith('_ng')) {
        el.removeAttribute(attr.name);
      }
      // Remove event handlers (onclick, onload, etc.)
      else if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      // Keep ID only on headings if allowAnchorIds is true
      else if (name === 'id') {
        if (!allowAnchorIds || !['h2', 'h3', 'h4'].includes(el.tagName.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      }
      // Retain only explicitly allowed attributes
      else if (!['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height'].includes(name)) {
        el.removeAttribute(attr.name);
      }
    });

    // Clean links (a tags)
    if (el.tagName.toLowerCase() === 'a') {
      const href = el.getAttribute('href') || '';
      if (
        href.toLowerCase().startsWith('javascript:') ||
        href.toLowerCase().startsWith('data:') ||
        href.toLowerCase().startsWith('vbscript:')
      ) {
        el.removeAttribute('href');
      } else if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  // 5. Clean all existing headings (Never display hashtags in headings)
  const existingHeadings = Array.from(body.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  existingHeadings.forEach((h) => {
    const rawHeading = h.textContent || '';
    const cleanedHeading = cleanTitle(rawHeading);
    h.textContent = cleanedHeading;
    if (allowAnchorIds && ['h2', 'h3', 'h4'].includes(h.tagName.toLowerCase())) {
      const id = generateCleanSlug(cleanedHeading);
      if (id) {
        h.setAttribute('id', id);
      }
    }
  });

  // 5b. Intelligent Heading Detection (Promote bold paragraphs to proper <h2> headings)
  if (promoteBoldParagraphsToHeadings) {
    const paragraphs = Array.from(body.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      // Check if paragraph is purely bold text
      const trimmedText = p.textContent?.trim() || '';
      if (!trimmedText) return;

      // Check if it should be treated as a heading
      const isHeadingCandidate = checkIfHeadingCandidate(p, trimmedText, articleTitle);

      if (isHeadingCandidate) {
        const h2 = doc.createElement('h2');
        // Clean out any hashtags, emojis, or excessive punctuation
        const cleanHeading = cleanTitle(trimmedText);
        h2.textContent = cleanHeading;

        if (allowAnchorIds) {
          const id = generateCleanSlug(cleanHeading);
          if (id) {
            h2.setAttribute('id', id);
          }
        }
        p.replaceWith(h2);
      }
    });
  }

  // 6. Unwrap redundant or empty span elements
  const allSpansRemaining = Array.from(body.querySelectorAll('span'));
  allSpansRemaining.forEach((span) => {
    // If span has no attributes left, unwrap its contents
    if (span.attributes.length === 0) {
      unwrapElement(span);
    } else if (!span.textContent || span.textContent.trim() === '') {
      span.remove();
    }
  });

  // 7. Remove empty paragraphs & excessive breaks
  const finalParagraphs = Array.from(body.querySelectorAll('p'));
  finalParagraphs.forEach((p) => {
    const innerHtml = p.innerHTML.trim();
    const text = p.textContent?.trim() || '';
    const hasMedia = p.querySelector('img, figure, table');

    if (!hasMedia && (innerHtml === '' || innerHtml === '<br>' || innerHtml === '<br/>' || text === '&nbsp;' || text === '')) {
      p.remove();
    }
  });

  const intermediateHtml = body.innerHTML;

  // 8. Final DOMPurify verification pass
  const purifier = getDOMPurify();
  if (!purifier) return intermediateHtml;

  const cleanHtml = purifier.sanitize(intermediateHtml, {
    ALLOWED_TAGS: [
      'p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption',
      'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'code', 'pre',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'id'],
    FORBID_TAGS: [
      'script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button',
      'source-footnote', 'sources-carousel-inline', 'source-inline-chip',
    ],
    FORBID_ATTR: ['style', 'class'],
  });

  return cleanHtml;
}

/**
 * Helper to unwrap an element, preserving its children/text
 */
function unwrapElement(el: Element): void {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

/**
 * Helper to determine if a <p> containing bold text is actually a section heading
 */
function checkIfHeadingCandidate(p: HTMLParagraphElement, text: string, articleTitle: string): boolean {
  // Must be reasonably short (<= 120 chars, <= 15 words)
  if (text.length > 120 || text.length < 3) return false;
  const words = text.split(/\s+/).length;
  if (words > 15) return false;

  // Must not end like a standard long paragraph sentence (e.g. doesn't end with a period '.')
  // (Note: headings can end with nothing, or ':', '?', '!', or ')')
  if (text.endsWith('.')) return false;

  // Must not be identical to the article title
  if (articleTitle && text.toLowerCase() === articleTitle.trim().toLowerCase()) return false;

  // Check if all significant content in p is enclosed in bold or strong
  const children = Array.from(p.childNodes);
  const nonWhitespaceChildren = children.filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent || '').trim().length > 0;
    }
    return true;
  });

  if (nonWhitespaceChildren.length === 1) {
    const single = nonWhitespaceChildren[0];
    if (single.nodeType === Node.ELEMENT_NODE) {
      const tag = (single as Element).tagName.toLowerCase();
      if (tag === 'b' || tag === 'strong') {
        return true;
      }
    }
  }

  // Also check if p innerHTML starts with <b> or <strong> and covers the entire text
  const inner = p.innerHTML.trim();
  if (
    (/^<(b|strong)[^>]*>.*<\/\1>$/i.test(inner)) ||
    (p.querySelectorAll('b, strong').length > 0 && p.textContent?.trim() === text)
  ) {
    // Check that there's no non-bold text outside
    const clone = p.cloneNode(true) as HTMLElement;
    const bolds = clone.querySelectorAll('b, strong');
    bolds.forEach((b) => b.remove());
    if (clone.textContent?.trim() === '') {
      return true;
    }
  }

  return false;
}

/**
 * Cleans an entire BlogPostItem object (content, title, excerpt, tags)
 */
export function cleanArticleObject(article: BlogPostItem): {
  cleaned: BlogPostItem;
  changed: boolean;
  details: string[];
} {
  const details: string[] = [];
  let changed = false;

  // Clean title (strip hashtags, emojis, excessive punctuation)
  const originalTitle = article.title || '';
  const sanitizedTitle = cleanTitle(originalTitle);
  if (sanitizedTitle !== originalTitle) {
    details.push('Removed hashtag symbol(s), emojis, or normalized punctuation in title');
    changed = true;
  }

  // Clean slug
  const originalSlug = article.slug || '';
  const sanitizedSlug = generateCleanSlug(originalSlug || sanitizedTitle);
  if (sanitizedSlug !== originalSlug) {
    changed = true;
  }

  // Clean tags (strip any leading hashtags)
  const cleanTags = (article.tags || []).map((t) => {
    const noHash = t.replace(/^#+/, '').trim();
    if (noHash !== t) {
      changed = true;
    }
    return noHash;
  }).filter(Boolean);

  // Clean content
  const originalContent = article.content || '';
  const cleanedContent = sanitizeArticleHtml(originalContent, {
    articleTitle: sanitizedTitle,
    promoteBoldParagraphsToHeadings: true,
    allowAnchorIds: true,
  });

  if (cleanedContent !== originalContent) {
    changed = true;
    if (detectGoogleAiStudioArtifacts(originalContent)) {
      details.push('Removed Google AI Studio tags, citations, and data-attributes');
    }
    if (originalContent.includes('style=')) {
      details.push('Stripped inline styles and font-family declarations');
    }
    if (originalContent.includes('<source-footnote') || originalContent.includes('citation-')) {
      details.push('Removed citation footnotes and source chips');
    }
    details.push('Promoted bold section titles to <h2> headings and formatted paragraphs');
  }

  const cleanedArticle: BlogPostItem = {
    ...article,
    title: sanitizedTitle,
    slug: sanitizedSlug || article.slug,
    tags: cleanTags,
    content: cleanedContent,
  };

  return {
    cleaned: cleanedArticle,
    changed,
    details,
  };
}
