/**
 * =====================================================================
 * IMAGE UPLOADER COMPONENT - KJT ADMIN CMS
 * =====================================================================
 * 
 * Validates uploads:
 * - Safe formats: jpg, jpeg, png, webp, avif, svg
 * - Max size: 5MB limit with friendly alert
 * - Upload progress indicator
 * - Live image preview
 * - Meaningful alt-text required
 * - Replace or remove image
 * =====================================================================
 */

import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  RefreshCw,
  Eye,
  FolderOpen,
} from 'lucide-react';
import { uploadArticleImage } from '../../lib/supabase';
import { saveMediaFile } from '../../lib/articlesService';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ImageUploaderProps {
  label?: string;
  currentUrl?: string;
  currentAlt?: string;
  currentCaption?: string;
  onImageChange: (url: string, alt: string, caption?: string) => void;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Featured Article Image',
  currentUrl = '',
  currentAlt = '',
  currentCaption = '',
  onImageChange,
  required = false,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(currentUrl);
  const [imageAlt, setImageAlt] = useState<string>(currentAlt);
  const [imageCaption, setImageCaption] = useState<string>(currentCaption);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if parent updates currentUrl (e.g. on article load)
  React.useEffect(() => {
    setImageUrl(currentUrl);
  }, [currentUrl]);

  React.useEffect(() => {
    setImageAlt(currentAlt);
  }, [currentAlt]);

  React.useEffect(() => {
    setImageCaption(currentCaption);
  }, [currentCaption]);

  const handleFileSelect = async (file: File) => {
    setErrorMessage('');
    
    // Validate file type
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(fileExt)) {
      setErrorMessage(`Invalid format (.${fileExt}). Please upload JPG, PNG, WebP, AVIF, or SVG.`);
      return;
    }

    // Validate file size (5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 5MB.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    const result = await uploadArticleImage(file, (percent) => {
      setUploadProgress(percent);
    });

    setIsUploading(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.url) {
      setImageUrl(result.url);
      const generatedAlt = imageAlt || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setImageAlt(generatedAlt);
      onImageChange(result.url, generatedAlt, imageCaption);

      // Save to media library
      saveMediaFile({
        id: `media-${Date.now()}`,
        name: file.name,
        url: result.url,
        altText: generatedAlt,
        caption: imageCaption || '',
        sizeBytes: file.size,
        mimeType: file.type,
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setErrorMessage('');
    onImageChange('', '', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setImageAlt(val);
    onImageChange(imageUrl, val, imageCaption);
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setImageCaption(val);
    onImageChange(imageUrl, imageAlt, val);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {imageUrl && (
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Image Ready
          </span>
        )}
      </div>

      {/* Upload Dropzone if no image */}
      {!imageUrl ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? 'border-[#00D4FF] bg-[#00D4FF]/10'
              : 'border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.avif,.svg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-[#00D4FF]">
              {isUploading ? (
                <RefreshCw className="w-6 h-6 animate-spin" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>
            <div className="text-sm font-semibold text-white">
              {isUploading ? 'Uploading Image...' : 'Click to upload or drag and drop'}
            </div>
            <p className="text-xs text-slate-400">
              Accepted formats: JPG, PNG, WebP, AVIF, SVG (Max 5MB)
            </p>

            {/* Progress Bar */}
            {isUploading && (
              <div className="w-full max-w-xs pt-2">
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00D4FF] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {uploadProgress}%
                </span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMediaModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 text-[#00D4FF]" />
                <span>Or Choose from Media Library</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview & Details Card */
        <div className="bg-slate-800/70 rounded-xl border border-slate-700 p-4 space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-slate-800 aspect-video max-h-56">
            <img
              src={imageUrl}
              alt={imageAlt || 'Article preview'}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowMediaModal(true)}
                className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-sm border border-slate-700 flex items-center gap-1 transition cursor-pointer"
                title="Choose from Media Library"
              >
                <FolderOpen className="w-3 h-3 text-[#00D4FF]" />
                Media
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-sm border border-slate-700 flex items-center gap-1 transition"
                title="Replace Image"
              >
                <RefreshCw className="w-3 h-3" />
                Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded bg-rose-600/90 hover:bg-rose-500 text-white backdrop-blur-sm border border-rose-500 transition"
                title="Remove Image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.avif,.svg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          {/* Alt text field (mandatory for SEO and accessibility) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Descriptive Image Alt Text <span className="text-rose-400">*</span></span>
              <span className="text-[10px] text-slate-400">Required for SEO &amp; Screen Readers</span>
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={handleAltChange}
              placeholder="e.g. Modern laptop displaying responsive web analytics in office"
              required={required}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
            />
          </div>

          {/* Caption field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Optional Image Caption
            </label>
            <input
              type="text"
              value={imageCaption}
              onChange={handleCaptionChange}
              placeholder="e.g. Figure 1: Cloud backup architectures provide 99.999% uptime."
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00D4FF]"
            />
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        isSelectMode={true}
        onSelectImage={(url, alt, caption) => {
          setImageUrl(url);
          const chosenAlt = alt || imageAlt;
          setImageAlt(chosenAlt);
          if (caption) setImageCaption(caption);
          onImageChange(url, chosenAlt, caption || imageCaption);
          setShowMediaModal(false);
        }}
      />
    </div>
  );
};
