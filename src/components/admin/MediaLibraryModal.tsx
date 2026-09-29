/**
 * =====================================================================
 * MEDIA LIBRARY COMPONENT - KJT TECHNOLOGIES CMS
 * =====================================================================
 * 
 * Features:
 * - Responsive grid of uploaded media files
 * - Search by filename or alt text
 * - Copy image URL to clipboard with feedback
 * - Reuse image in article editor
 * - Delete unused image after confirmation
 * - Direct image upload with drag-and-drop
 * =====================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Upload,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  X,
  Plus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { getMediaFiles, saveMediaFile, deleteMediaFile } from '../../lib/articlesService';
import { uploadArticleImage } from '../../lib/supabase';

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

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string, altText: string, caption?: string) => void;
  isSelectMode?: boolean;
}

export const MediaLibraryModal: React.FC<MediaLibraryProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  isSelectMode = false,
}) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    const files = await getMediaFiles();
    setItems(files);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    await deleteMediaFile(id);
    setDeleteConfirmId(null);
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
    loadMedia();
  };

  const handleFileUpload = async (file: File) => {
    setUploadError('');
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(ext)) {
      setUploadError(`Invalid format (.${ext}). Please upload JPG, PNG, WebP, AVIF, or SVG.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`File exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const result = await uploadArticleImage(file, (percent) => {
      setUploadProgress(percent);
    });

    setIsUploading(false);

    if (result.error) {
      setUploadError(result.error);
    } else if (result.url) {
      const generatedAlt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const newMedia: MediaItem = {
        id: `media-${Date.now()}`,
        name: file.name,
        url: result.url,
        altText: generatedAlt,
        caption: '',
        sizeBytes: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString().split('T')[0],
      };

      await saveMediaFile(newMedia);
      await loadMedia();
      setSelectedItem(newMedia);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.altText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D4FF]/10 text-[#00D4FF] flex items-center justify-center border border-[#00D4FF]/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Media Library</h3>
              <p className="text-xs text-slate-400">
                {isSelectMode
                  ? 'Select an image to insert or upload a new asset'
                  : 'Manage, inspect, and reuse uploaded article media assets'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.avif,.svg"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upload error banner */}
        {uploadError && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-2.5 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Upload progress banner */}
        {isUploading && (
          <div className="bg-[#00D4FF]/10 border-b border-[#00D4FF]/20 px-6 py-2.5 text-xs text-[#00D4FF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading asset to storage ({uploadProgress}%)...</span>
            </div>
            <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00D4FF] transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by name or description..."
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
            />
          </div>
          <div className="text-xs text-slate-400">
            {filteredItems.length} {filteredItems.length === 1 ? 'asset' : 'assets'} available
          </div>
        </div>

        {/* Body: Grid & Details */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Grid of Images */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#00D4FF]" />
                <span>Loading media assets...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-400 text-xs">No media files found matching your search.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-[#00D4FF] hover:underline cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload an image now</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#00D4FF] ring-2 ring-[#00D4FF]/30'
                          : 'border-slate-800 hover:border-slate-600 bg-slate-800/40'
                      }`}
                    >
                      <div className="aspect-square bg-slate-950 overflow-hidden relative">
                        <img
                          src={item.url}
                          alt={item.altText}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#00D4FF] text-[#0A192F] flex items-center justify-center shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 bg-slate-900/90 text-left">
                        <div className="text-xs font-semibold text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.altText}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          {selectedItem && (
            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-800 bg-slate-950/40 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.altText}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white break-all">{selectedItem.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{selectedItem.altText}</p>
                  {selectedItem.caption && (
                    <p className="text-[10px] text-slate-500 italic mt-1">"{selectedItem.caption}"</p>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 space-y-1 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span className="text-slate-300">{selectedItem.createdAt}</span>
                  </div>
                  {selectedItem.sizeBytes && (
                    <div className="flex justify-between">
                      <span>File size:</span>
                      <span className="text-slate-300">
                        {(selectedItem.sizeBytes / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  )}
                </div>

                {/* Copy URL */}
                <button
                  onClick={() => handleCopyUrl(selectedItem)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  {copiedId === selectedItem.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Image URL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-6 space-y-2">
                {isSelectMode && onSelectImage && (
                  <button
                    onClick={() => {
                      onSelectImage(selectedItem.url, selectedItem.altText, selectedItem.caption);
                      onClose();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#00D4FF] hover:bg-[#00b8dc] text-[#0A192F] text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-lg shadow-[#00D4FF]/20"
                  >
                    Select This Image
                  </button>
                )}

                <button
                  onClick={() => setDeleteConfirmId(selectedItem.id)}
                  className="w-full py-2 px-3 rounded-lg hover:bg-rose-500/10 text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Image</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertCircle className="w-6 h-6" />
                <h4 className="text-base font-bold text-white">Delete Media Item?</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete this media asset? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
