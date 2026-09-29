/**
 * =====================================================================
 * MEDIA LIBRARY PAGE - KJT TECHNOLOGIES CMS (/admin/media)
 * =====================================================================
 * 
 * Standalone media assets management for administrators:
 * - Direct drag-and-drop and file-picker image uploads
 * - Full asset gallery grid with live previews
 * - One-click image URL copying
 * - Alt text & caption editing
 * - Deletion with confirmation
 * - Supabase Storage backed with local fallback
 * =====================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  PlusCircle,
  FolderOpen,
  ArrowLeft,
  FileText,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  HardDrive,
} from 'lucide-react';
import { SEOHead } from '../../components/common/SEOHead';
import { getMediaFiles, saveMediaFile, deleteMediaFile } from '../../lib/articlesService';
import { uploadArticleImage, isSupabaseConfigured } from '../../lib/supabase';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  caption?: string;
  sizeBytes?: number;
  mimeType?: string;
  createdAt: string;
}

export const MediaLibraryPage: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Manual image URL input
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [manualUrl, setManualUrl] = useState<string>('');
  const [manualAlt, setManualAlt] = useState<string>('');
  const [manualCaption, setManualCaption] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await getMediaFiles();
      setItems(data);
      if (data.length > 0 && !selectedItem) {
        setSelectedItem(data[0]);
      }
    } catch (err) {
      console.error('Failed to load media files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    const file = files[0];

    // Validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image format (JPEG, PNG, WebP, SVG, or GIF).');
      setUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please compress or resize the file.');
      setUploading(false);
      return;
    }

    try {
      const res = await uploadArticleImage(file);
      if (res.error) {
        setUploadError(res.error);
        setUploading(false);
        return;
      }

      const newItem: MediaItem = {
        id: 'media_' + Date.now(),
        name: file.name,
        url: res.url,
        altText: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        sizeBytes: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString(),
      };

      await saveMediaFile(newItem);
      await loadMedia();
      setSelectedItem(newItem);
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddManualUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    const newItem: MediaItem = {
      id: 'media_' + Date.now(),
      name: manualUrl.split('/').pop() || 'Remote Image',
      url: manualUrl.trim(),
      altText: manualAlt.trim() || 'KJT Technologies media asset',
      caption: manualCaption.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await saveMediaFile(newItem);
    setManualUrl('');
    setManualAlt('');
    setManualCaption('');
    setShowUrlInput(false);
    await loadMedia();
    setSelectedItem(newItem);
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) {
      return;
    }
    await deleteMediaFile(id);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    loadMedia();
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.altText.toLowerCase().includes(q) ||
      (item.caption && item.caption.toLowerCase().includes(q))
    );
  });

  const totalBytes = items.reduce((acc, curr) => acc + (curr.sizeBytes || 150000), 0);
  const formattedStorage = (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';

  return (
    <div className="space-y-8">
      <SEOHead
        title="Media Library | KJT TECHNOLOGIES CMS"
        description="Media and image asset library for KJT TECHNOLOGIES administrator portal."
        noIndex={true}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/admin/dashboard" className="hover:text-[#00D4FF] transition">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#00D4FF]">Media Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderOpen className="w-7 h-7 text-[#00D4FF]" />
            <span>Media &amp; Image Assets Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload, browse, optimize, and manage high-resolution photos, graphics, and figures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#00D4FF]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Media Assets
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">{items.length}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D4FF] block">
            Storage Engine
          </span>
          <span className="text-sm font-semibold text-white mt-2 block">
            {isSupabaseConfigured() ? 'Supabase Storage' : 'Cloud CDN + Cache'}
          </span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            Approx. Storage Used
          </span>
          <span className="text-2xl font-bold text-white mt-1 block">{formattedStorage}</span>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Allowed Formats
          </span>
          <span className="text-xs font-semibold text-slate-300 mt-2 block">
            JPEG, PNG, WebP, SVG, GIF (Max 5MB)
          </span>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition text-center cursor-pointer ${
          isDragOver
            ? 'border-[#00D4FF] bg-[#00D4FF]/10'
            : 'border-slate-700 hover:border-[#00D4FF]/60 bg-slate-900/50 hover:bg-slate-900/80'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center mx-auto border border-[#00D4FF]/20">
            {uploading ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {uploading
                ? 'Uploading & Optimizing Media...'
                : 'Click to select image or drag and drop here'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPEG, PNG, WebP, SVG, or GIF up to 5MB. Directly synced with Supabase Storage.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(!showUrlInput);
              }}
              className="text-xs text-[#00D4FF] hover:underline font-semibold"
            >
              {showUrlInput ? 'Hide URL link input' : '+ Or import from external URL'}
            </button>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Manual URL Form */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Import Image from Direct URL</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              required
              className="sm:col-span-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
            />
            <input
              type="text"
              placeholder="Descriptive Alt Text"
              value={manualAlt}
              onChange={(e) => setManualAlt(e.target.value)}
              className="sm:col-span-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
            />
            <input
              type="text"
              placeholder="Optional Caption"
              value={manualCaption}
              onChange={(e) => setManualCaption(e.target.value)}
              className="sm:col-span-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-[#00D4FF] text-[#0A192F] font-bold text-xs hover:bg-[#00b8dc] transition"
            >
              Add to Library
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images by name or alt text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
          />
        </div>

        <button
          onClick={loadMedia}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Gallery</span>
        </button>
      </div>

      {/* Media Grid & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Gallery Grid (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 rounded-2xl border border-slate-800 p-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#00D4FF] mb-2" />
              <span>Loading media library...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">No media files found</p>
              <p className="text-xs text-slate-500">
                {searchQuery ? 'Try adjusting your search keywords.' : 'Drag & drop your first image above to populate the library.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`group relative rounded-xl overflow-hidden bg-slate-800 border cursor-pointer transition ${
                      isSelected
                        ? 'border-[#00D4FF] ring-2 ring-[#00D4FF]/40 shadow-lg'
                        : 'border-slate-700/80 hover:border-slate-500'
                    }`}
                  >
                    <div className="h-32 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                      <img
                        src={item.url}
                        alt={item.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-2 bg-slate-900/90 text-left">
                      <p className="text-[11px] font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{item.altText}</p>
                    </div>

                    {/* Quick copy overlay button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md text-white hover:text-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy Image URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Item Details Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3">
            Asset Details &amp; Inspector
          </h3>

          {selectedItem ? (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 max-h-56 flex items-center justify-center">
                <img
                  src={selectedItem.url}
                  alt={selectedItem.altText}
                  className="w-full h-full object-contain max-h-56"
                />
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">File Name</span>
                  <p className="text-white font-medium break-all mt-0.5">{selectedItem.name}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Alternative Text</span>
                  <p className="text-slate-300 mt-0.5">{selectedItem.altText || 'None'}</p>
                </div>

                {selectedItem.caption && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Caption</span>
                    <p className="text-slate-300 mt-0.5 italic">{selectedItem.caption}</p>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Asset URL</span>
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={selectedItem.url}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-300 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(selectedItem)}
                      className="p-2 rounded-lg bg-[#00D4FF] text-[#0A192F] hover:bg-[#00b8dc] transition font-bold"
                      title="Copy URL"
                    >
                      {copiedId === selectedItem.id ? (
                        <Check className="w-3.5 h-3.5 text-slate-950" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00D4FF] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(selectedItem.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Asset</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs">
              Select an image from the gallery to inspect its properties or copy its URL.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
