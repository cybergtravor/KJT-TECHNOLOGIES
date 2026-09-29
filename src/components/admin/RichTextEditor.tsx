/**
 * =====================================================================
 * PROFESSIONAL VISUAL RICH TEXT EDITOR - KJT CMS
 * =====================================================================
 * 
 * Provides an intuitive visual editing canvas:
 * - Headings (H2, H3), Paragraphs
 * - Bold, Italic, Underline
 * - Bullet lists, Numbered lists
 * - Quotations / Takeaway callouts
 * - Hyperlinks
 * - Tables with rows & columns
 * - Inline images with captions & alt text
 * - Visual editing (WYSIWYG) so users never write HTML or Markdown
 * - Code view toggle for advanced editing
 * =====================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link2,
  Table as TableIcon,
  Image as ImageIcon,
  Heading2,
  Heading3,
  Pilcrow,
  Code,
  Eye,
  Undo,
  Redo,
  Minus,
  Sparkles,
  HelpCircle,
  ClipboardCheck,
  Wand2,
  Check,
  X,
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import {
  sanitizeArticleHtml,
  cleanPlainText,
  detectGoogleAiStudioArtifacts,
} from '../../lib/contentSanitizer';

interface RichTextEditorProps {
  value: string;
  onChange: (htmlContent: string) => void;
  placeholder?: string;
  minHeight?: string;
}

interface PasteState {
  cleanHtml: string;
  plainHtml: string;
  activeMode: 'clean' | 'plain';
  hasArtifacts: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write or paste your article content here...',
  minHeight = '420px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState<boolean>(false);
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkText, setLinkText] = useState<string>('');
  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const [tableRows, setTableRows] = useState<number>(3);
  const [tableCols, setTableCols] = useState<number>(3);
  const [wordCount, setWordCount] = useState<number>(0);
  const savedSelectionRef = useRef<Range | null>(null);
  const [pasteState, setPasteState] = useState<PasteState | null>(null);
  const [cleanFeedback, setCleanFeedback] = useState<string>('');
  const [showPasteModal, setShowPasteModal] = useState<boolean>(false);
  const [manualPasteText, setManualPasteText] = useState<string>('');
  const [manualPasteMode, setManualPasteMode] = useState<'clean' | 'plain'>('clean');

  // Sync initial content or external updates if different
  useEffect(() => {
    if (editorRef.current && !isCodeView) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    // Calculate approximate word count
    const textOnly = (value || '').replace(/<[^>]*>?/gm, ' ').trim();
    const words = textOnly ? textOnly.split(/\s+/).length : 0;
    setWordCount(words);
  }, [value, isCodeView]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  const executeCommand = (command: string, arg?: string) => {
    if (isCodeView) return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleFormatBlock = (tag: string) => {
    if (isCodeView) return;
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    handleInput();
  };

  const handleInsertQuote = () => {
    if (isCodeView) return;
    editorRef.current?.focus();
    const selection = window.getSelection()?.toString() || 'Key takeaway or notable quotation from the industry.';
    const quoteHtml = `<blockquote class="border-l-4 border-[#00D4FF] bg-slate-800/60 pl-4 py-2.5 my-4 italic text-slate-200">${selection}</blockquote><p><br></p>`;
    document.execCommand('insertHTML', false, quoteHtml);
    handleInput();
  };

  const handleOpenLinkModal = () => {
    saveSelection();
    const selectedText = window.getSelection()?.toString() || '';
    setLinkText(selectedText);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    setShowLinkModal(false);
    restoreSelection();
    editorRef.current?.focus();

    if (!linkUrl) return;
    const formattedUrl = linkUrl.startsWith('http://') || linkUrl.startsWith('https://')
      ? linkUrl
      : `https://${linkUrl}`;

    if (linkText && (!savedSelectionRef.current || savedSelectionRef.current.collapsed)) {
      const anchorHtml = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer" class="text-[#00D4FF] hover:underline">${linkText}</a>`;
      document.execCommand('insertHTML', false, anchorHtml);
    } else {
      document.execCommand('createLink', false, formattedUrl);
    }
    handleInput();
  };

  const handleInsertTable = () => {
    setShowTableModal(false);
    editorRef.current?.focus();

    let tableHtml = `<div class="overflow-x-auto my-6"><table class="w-full text-left border-collapse border border-slate-700 text-sm"><thead><tr class="bg-slate-800 text-white font-semibold">`;
    for (let c = 1; c <= tableCols; c++) {
      tableHtml += `<th class="border border-slate-700 p-2.5">Header ${c}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;

    for (let r = 1; r <= tableRows; r++) {
      tableHtml += `<tr class="${r % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-900/80'}">`;
      for (let c = 1; c <= tableCols; c++) {
        tableHtml += `<td class="border border-slate-700 p-2.5">Row ${r}, Col ${c}</td>`;
      }
      tableHtml += `</tr>`;
    }

    tableHtml += `</tbody></table></div><p><br></p>`;
    document.execCommand('insertHTML', false, tableHtml);
    handleInput();
  };

  const handleInsertImageFromMedia = (url: string, altText: string, caption?: string) => {
    restoreSelection();
    editorRef.current?.focus();

    const imageHtml = `
      <figure class="my-6 block text-center">
        <img src="${url}" alt="${altText || 'Article image'}" class="rounded-xl mx-auto max-h-96 w-full object-cover shadow-lg border border-slate-800" />
        ${caption ? `<figcaption class="text-xs text-slate-400 mt-2 italic">${caption}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, imageHtml);
    handleInput();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (isCodeView) return;

    e.preventDefault();
    const clipboardData = e.clipboardData;
    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    const hasArtifacts = detectGoogleAiStudioArtifacts(htmlData);

    let cleanHtml = '';
    if (htmlData && htmlData.trim().length > 0) {
      cleanHtml = sanitizeArticleHtml(htmlData, {
        promoteBoldParagraphsToHeadings: true,
        allowAnchorIds: true,
      });
    } else if (textData && textData.trim().length > 0) {
      cleanHtml = cleanPlainText(textData);
    }

    const plainHtml = cleanPlainText(textData);

    // Save selection
    saveSelection();

    // Default action: Insert Clean Formatting
    document.execCommand('insertHTML', false, cleanHtml);
    handleInput();

    // Show paste options notification
    setPasteState({
      cleanHtml,
      plainHtml,
      activeMode: 'clean', // "Keep Clean Formatting" is the default
      hasArtifacts,
    });
  };

  const handleSwitchPasteMode = (targetMode: 'clean' | 'plain') => {
    if (!pasteState || pasteState.activeMode === targetMode) return;

    // Undo the previous insert
    document.execCommand('undo');

    // Insert the selected mode
    const toInsert = targetMode === 'clean' ? pasteState.cleanHtml : pasteState.plainHtml;
    document.execCommand('insertHTML', false, toInsert);
    handleInput();

    setPasteState((prev) => (prev ? { ...prev, activeMode: targetMode } : null));
  };

  const handleCleanEntireCanvas = () => {
    if (isCodeView) {
      const cleaned = sanitizeArticleHtml(value, {
        promoteBoldParagraphsToHeadings: true,
        allowAnchorIds: true,
      });
      onChange(cleaned);
      setCleanFeedback('HTML code cleaned: Removed inline styles, custom tags, and normalized headings.');
      setTimeout(() => setCleanFeedback(''), 4000);
      return;
    }

    if (editorRef.current) {
      const raw = editorRef.current.innerHTML;
      const cleaned = sanitizeArticleHtml(raw, {
        promoteBoldParagraphsToHeadings: true,
        allowAnchorIds: true,
      });
      editorRef.current.innerHTML = cleaned;
      onChange(cleaned);
      setCleanFeedback('Article canvas cleaned: Stripped Google AI Studio tags, inline font styles, and normalized headings.');
      setTimeout(() => setCleanFeedback(''), 4000);
    }
  };

  const handleApplyManualPaste = () => {
    if (!manualPasteText.trim()) {
      setShowPasteModal(false);
      return;
    }

    let toInsert = '';
    if (manualPasteMode === 'clean') {
      toInsert = sanitizeArticleHtml(manualPasteText, {
        promoteBoldParagraphsToHeadings: true,
        allowAnchorIds: true,
      });
    } else {
      toInsert = cleanPlainText(manualPasteText);
    }

    restoreSelection();
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, toInsert);
    handleInput();

    setManualPasteText('');
    setShowPasteModal(false);
    setCleanFeedback(manualPasteMode === 'clean' ? 'Clean formatted content inserted successfully.' : 'Plain text inserted successfully.');
    setTimeout(() => setCleanFeedback(''), 3500);
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-xl flex flex-col">
      {/* Editor Toolbar */}
      <div className="bg-slate-950/80 border-b border-slate-800 p-2 flex flex-wrap items-center justify-between gap-1 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* Paragraph / Heading Formats */}
          <button
            type="button"
            title="Normal Paragraph"
            onClick={() => handleFormatBlock('<p>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Pilcrow className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 2 (Section Title)"
            onClick={() => handleFormatBlock('<h2>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Heading 3 (Sub-section Title)"
            onClick={() => handleFormatBlock('<h3>')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Heading3 className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Inline Text Formatting */}
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onClick={() => executeCommand('bold')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onClick={() => executeCommand('italic')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onClick={() => executeCommand('underline')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Underline className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Lists */}
          <button
            type="button"
            title="Bullet List"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Numbered List"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Quote Callout Box"
            onClick={handleInsertQuote}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Link, Table, and Image */}
          <button
            type="button"
            title="Insert Link"
            onClick={handleOpenLinkModal}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Insert Table"
            onClick={() => setShowTableModal(true)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Insert Image from Media Library"
            onClick={() => {
              saveSelection();
              setShowMediaModal(true);
            }}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-[#00D4FF] hover:bg-[#00D4FF]/10 transition cursor-pointer flex items-center gap-1"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[11px] font-semibold hidden sm:inline">Add Image</span>
          </button>
          <button
            type="button"
            title="Divider Line"
            onClick={() => executeCommand('insertHorizontalRule')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Dedicated Clean Formatting Button */}
          <button
            type="button"
            title="Clean Formatting: Strips Google AI Studio, Word, inline styles & normalizes headings"
            onClick={handleCleanEntireCanvas}
            className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 transition cursor-pointer flex items-center gap-1 border border-amber-500/30"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-semibold hidden md:inline">Clean Formatting</span>
          </button>

          {/* Dedicated Paste Options Button */}
          <button
            type="button"
            title="Paste formatted or plain text content with options"
            onClick={() => {
              saveSelection();
              setShowPasteModal(true);
            }}
            className="p-1.5 rounded-lg hover:bg-[#00D4FF]/20 text-cyan-300 hover:text-white transition cursor-pointer flex items-center gap-1 border border-cyan-500/30"
          >
            <ClipboardCheck className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="text-[11px] font-semibold hidden sm:inline">Paste Options</span>
          </button>
        </div>

        {/* Right Tools (Undo, Redo, Code View Toggle) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Undo"
            onClick={() => executeCommand('undo')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Redo"
            onClick={() => executeCommand('redo')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => setIsCodeView(!isCodeView)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isCodeView
                ? 'bg-[#00D4FF] text-[#0A192F]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle between Visual Canvas and HTML Code"
          >
            {isCodeView ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
            <span>{isCodeView ? 'Visual View' : 'HTML Code'}</span>
          </button>
        </div>
      </div>

      {/* Momentary Clean Canvas Notification */}
      {cleanFeedback && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-4 py-2 flex items-center gap-2 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{cleanFeedback}</span>
        </div>
      )}

      {/* Floating Paste Options Notification */}
      {pasteState && (
        <div className="bg-slate-800/95 border-b border-[#00D4FF]/40 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex flex-wrap items-center gap-2 text-slate-200">
            <ClipboardCheck className="w-4 h-4 text-[#00D4FF] shrink-0" />
            <span className="font-semibold">
              {pasteState.hasArtifacts
                ? 'Pasted Google AI Studio / Web Content Cleaned:'
                : 'Formatted Content Pasted:'}
            </span>
            <div className="inline-flex rounded-lg bg-slate-900/90 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => handleSwitchPasteMode('clean')}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-1 ${
                  pasteState.activeMode === 'clean'
                    ? 'bg-[#00D4FF] text-[#0A192F]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {pasteState.activeMode === 'clean' && <Check className="w-3 h-3" />}
                <span>Keep Clean Formatting (Default)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSwitchPasteMode('plain')}
                className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-1 ${
                  pasteState.activeMode === 'plain'
                    ? 'bg-[#00D4FF] text-[#0A192F]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {pasteState.activeMode === 'plain' && <Check className="w-3 h-3" />}
                <span>Paste as Plain Text</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPasteState(null)}
            className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Main Canvas */}
      {isCodeView ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste or write HTML markup..."
          style={{ minHeight }}
          className="w-full p-6 bg-slate-950 font-mono text-xs text-emerald-400 leading-relaxed focus:outline-none resize-y border-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onPaste={handlePaste}
          style={{ minHeight }}
          className="w-full p-6 sm:p-8 bg-[#0B1528] text-slate-200 text-base leading-relaxed focus:outline-none overflow-y-auto rich-editor-canvas"
          data-placeholder={placeholder}
        />
      )}

      {/* Bottom Status Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>Approx. {Math.max(1, Math.ceil(wordCount / 200))} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span>Rich Visual Formatting Active</span>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#00D4FF]" />
              <span>Insert Hyperlink</span>
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Display Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Learn more about CCTV security"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Web Address (URL)</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or /services/cybersecurity"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyLink}
                className="px-4 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Insertion Modal */}
      {showTableModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-[#00D4FF]" />
              <span>Insert Responsive Data Table</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Number of Rows</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Number of Columns</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-[#00D4FF]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-4 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase cursor-pointer"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Paste Options Modal */}
      {showPasteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-[#00D4FF]">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Paste Formatted Content</h3>
                  <p className="text-xs text-slate-400">
                    Clean Google AI Studio, Google Docs, Word or web HTML on paste
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paste Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Choose Paste Cleaning Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setManualPasteMode('clean')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    manualPasteMode === 'clean'
                      ? 'border-[#00D4FF] bg-cyan-500/10 text-white'
                      : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00D4FF]" />
                      Keep Clean Formatting
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-400/20 text-[#00D4FF]">
                      Default
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Retains headings, bold text, lists, and safe links while stripping Google AI Studio tags, styles, and unwanted attributes.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setManualPasteMode('plain')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    manualPasteMode === 'plain'
                      ? 'border-[#00D4FF] bg-cyan-500/10 text-white'
                      : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-bold text-xs flex items-center gap-1.5">
                      <Pilcrow className="w-3.5 h-3.5 text-slate-300" />
                      Paste as Plain Text
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Strips all HTML tags and leaves only readable text and clean paragraph breaks.
                  </p>
                </button>
              </div>
            </div>

            {/* Paste Input Area */}
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Paste Content Here (Ctrl+V / Cmd+V)
              </label>
              <textarea
                value={manualPasteText}
                onChange={(e) => setManualPasteText(e.target.value)}
                placeholder="Paste copied content from Google AI Studio, Google Docs, Word, or web..."
                rows={6}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00D4FF]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setManualPasteText('');
                  setShowPasteModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyManualPaste}
                disabled={!manualPasteText.trim()}
                className="px-5 py-2 rounded-lg bg-[#00D4FF] hover:bg-[#00b8dc] disabled:opacity-50 text-[#0A192F] text-xs font-bold uppercase tracking-wider cursor-pointer transition shadow-md"
              >
                Clean &amp; Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Picker Modal */}
      <MediaLibraryModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        isSelectMode={true}
        onSelectImage={(url, alt, caption) => {
          handleInsertImageFromMedia(url, alt, caption);
        }}
      />
    </div>
  );
};
