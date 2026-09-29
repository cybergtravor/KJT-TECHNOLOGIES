/**
 * =====================================================================
 * OFFICIAL SOCIAL MEDIA ICONS - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Features:
 * - Uses official brand symbols from react-icons/fa6:
 *     * Facebook: Brand Blue (#1877F2)
 *     * Instagram: Recognized Gradient / Vibrant Brand Styling
 *     * LinkedIn: LinkedIn Blue (#0A66C2)
 *     * YouTube: Brand Red (#FF0000) with white play icon
 *     * X/Twitter: Sleek Dark / White (#000000 / #0F172A)
 *     * TikTok: High-contrast Dark with cyan/rose neon edge accents
 *     * WhatsApp: WhatsApp Green (#25D366) with white icon
 * - Circular or softly rounded button enclosures
 * - Touch-friendly mobile sizing (min 44x44px hit area)
 * - Accessible aria-labels and platform name tooltips
 * - External link safety: target="_blank" rel="noopener noreferrer"
 * - Automatically HIDES any platform whose link is empty in companyConfig
 * - Does NOT suggest third-party endorsement or sponsorship
 * =====================================================================
 */

import React, { useState } from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa6';
import { companyConfig } from '../../config/company';

// CUSTOMIZE HERE: Add the official KJT TECHNOLOGIES social media profile links.

export interface SocialMediaIconsProps {
  className?: string;
  variant?: 'circular' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  showTooltips?: boolean;
  align?: 'left' | 'center' | 'right';
  theme?: 'colored' | 'outline' | 'glass';
}

interface PlatformConfig {
  key: keyof typeof companyConfig.socialLinks;
  name: string;
  icon: React.ElementType;
  iconSize: number;
  bgClass: string;
  hoverBgClass: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
  brandHex: string;
}

export const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({
  className = '',
  variant = 'circular',
  size = 'md',
  showTooltips = true,
  align = 'left',
  theme = 'colored',
}) => {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  // Platform definitions matching exact brand colors & official symbols
  const platforms: PlatformConfig[] = [
    {
      key: 'facebook',
      name: 'Facebook',
      icon: FaFacebookF,
      iconSize: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
      bgClass: 'bg-[#1877F2]',
      hoverBgClass: 'hover:bg-[#166fe5]',
      textColor: 'text-white',
      borderColor: 'border-[#1877F2]/40',
      shadowColor: 'hover:shadow-[#1877F2]/40',
      brandHex: '#1877F2',
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      iconSize: size === 'sm' ? 15 : size === 'lg' ? 21 : 17,
      bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
      hoverBgClass: 'hover:brightness-110',
      textColor: 'text-white',
      borderColor: 'border-[#dc2743]/40',
      shadowColor: 'hover:shadow-[#dc2743]/40',
      brandHex: '#E4405F',
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      iconSize: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
      bgClass: 'bg-[#0A66C2]',
      hoverBgClass: 'hover:bg-[#095196]',
      textColor: 'text-white',
      borderColor: 'border-[#0A66C2]/40',
      shadowColor: 'hover:shadow-[#0A66C2]/40',
      brandHex: '#0A66C2',
    },
    {
      key: 'youtube',
      name: 'YouTube',
      icon: FaYoutube,
      iconSize: size === 'sm' ? 15 : size === 'lg' ? 21 : 17,
      bgClass: 'bg-[#FF0000]',
      hoverBgClass: 'hover:bg-[#cc0000]',
      textColor: 'text-white',
      borderColor: 'border-[#FF0000]/40',
      shadowColor: 'hover:shadow-[#FF0000]/40',
      brandHex: '#FF0000',
    },
    {
      key: 'twitter',
      name: 'X (formerly Twitter)',
      icon: FaXTwitter,
      iconSize: size === 'sm' ? 14 : size === 'lg' ? 20 : 16,
      bgClass: 'bg-black',
      hoverBgClass: 'hover:bg-slate-900',
      textColor: 'text-white',
      borderColor: 'border-slate-700',
      shadowColor: 'hover:shadow-white/20',
      brandHex: '#000000',
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      icon: FaTiktok,
      iconSize: size === 'sm' ? 14 : size === 'lg' ? 19 : 15,
      bgClass: 'bg-[#010101]',
      hoverBgClass: 'hover:bg-[#121212]',
      textColor: 'text-white',
      borderColor: 'border-[#25F4EE]/40',
      shadowColor: 'hover:shadow-[#FE2C55]/30',
      brandHex: '#FE2C55',
    },
    {
      key: 'whatsapp',
      name: 'WhatsApp',
      icon: FaWhatsapp,
      iconSize: size === 'sm' ? 15 : size === 'lg' ? 21 : 17,
      bgClass: 'bg-[#25D366]',
      hoverBgClass: 'hover:bg-[#20bd5a]',
      textColor: 'text-white',
      borderColor: 'border-[#25D366]/40',
      shadowColor: 'hover:shadow-[#25D366]/40',
      brandHex: '#25D366',
    },
  ];

  // Filter out any platforms that have empty links in companyConfig
  const activePlatforms = platforms.filter((p) => {
    const link = companyConfig.socialLinks[p.key];
    return typeof link === 'string' && link.trim().length > 0;
  });

  if (activePlatforms.length === 0) {
    return null;
  }

  // Size styling classes
  const sizeClasses = {
    sm: 'w-8 h-8 min-w-[32px] min-h-[32px]',
    md: 'w-10 h-10 min-w-[40px] min-h-[40px] sm:w-11 sm:h-11 sm:min-w-[44px] sm:min-h-[44px]',
    lg: 'w-12 h-12 min-w-[48px] min-h-[48px] sm:w-13 sm:h-13 sm:min-w-[52px] sm:min-h-[52px]',
  };

  const shapeClasses = variant === 'circular' ? 'rounded-full' : 'rounded-xl';

  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${alignClasses[align]} ${className}`}
      role="group"
      aria-label="Official KJT TECHNOLOGIES social media channels"
    >
      {activePlatforms.map((p) => {
        const Icon = p.icon;
        const link = companyConfig.socialLinks[p.key] as string;
        const isHovered = hoveredPlatform === p.key;

        // Visual presentation based on theme prop
        let styleClasses = '';
        if (theme === 'colored') {
          styleClasses = `${p.bgClass} ${p.hoverBgClass} ${p.textColor} shadow-md ${p.shadowColor} border border-white/10`;
        } else if (theme === 'outline') {
          styleClasses = `bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:border-transparent ${p.hoverBgClass} hover:text-white ${p.shadowColor}`;
        } else {
          // glass
          styleClasses = `bg-slate-800/60 backdrop-blur-sm text-slate-200 border border-slate-700/60 ${p.hoverBgClass} hover:text-white ${p.shadowColor}`;
        }

        return (
          <div key={p.key} className="relative inline-flex items-center justify-center">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredPlatform(p.key)}
              onMouseLeave={() => setHoveredPlatform(null)}
              onFocus={() => setHoveredPlatform(p.key)}
              onBlur={() => setHoveredPlatform(null)}
              aria-label={`Visit KJT TECHNOLOGIES on ${p.name} (opens in a new tab)`}
              className={`relative inline-flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A192F] ${sizeClasses[size]} ${shapeClasses} ${styleClasses}`}
            >
              <Icon size={p.iconSize} className="flex-shrink-0 transition-transform duration-200 drop-shadow-sm" />
            </a>

            {/* Accessible hover tooltip */}
            {showTooltips && isHovered && (
              <div
                role="tooltip"
                className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950 text-white text-[11px] font-semibold tracking-wide rounded-md shadow-xl border border-slate-700/80 whitespace-nowrap pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150"
              >
                {p.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
