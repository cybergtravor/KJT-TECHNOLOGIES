/**
 * =====================================================================
 * BRAND LOGO COMPONENT - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * CUSTOMIZATION GUIDE:
 * // CUSTOMIZE HERE: Replace the file in public/images/branding/kjt-technologies-logo.png with the official company logo.
 * 
 * This component renders the official logo image specified by companyConfig.logoPath.
 * It includes defined dimensions, maintains aspect ratio, prevents layout shift,
 * and includes a graceful vector fallback if the image is still being loaded or customized.
 * =====================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { companyConfig } from '../../config/company';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'auto';
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disableLink?: boolean;
  to?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showTagline = false,
  size = 'md',
  disableLink = false,
  to = '/',
}) => {
  // CUSTOMIZE HERE: Replace the file in public/images/branding/kjt-technologies-logo.png with the official company logo.
  const logoPath = companyConfig.logoPath || companyConfig.logo.path;
  const [imageError, setImageError] = useState(false);

  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
  }[size];

  const content = (
    <>
      {!imageError && logoPath ? (
        <div className="flex items-center">
          {/* CUSTOMIZE HERE: Replace the file in public/images/branding/kjt-technologies-logo.png with the official company logo. */}
          <img
            src={logoPath}
            alt="KJT TECHNOLOGIES — Accelerating Innovation, Securing Data"
            width={220}
            height={55}
            className={`${heightClasses} w-auto object-contain max-w-[240px] drop-shadow-sm transition-opacity duration-300`}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* Geometric Balance Icon Mark */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#00D4FF] to-[#0055FF] rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-[#00D4FF]/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            KJT
          </div>

          {/* Typography: KJT TECHNOLOGIES */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-xl sm:text-2xl tracking-tight text-white">
                KJT
              </span>
              <span className="font-light text-lg sm:text-xl tracking-wide text-[#00D4FF]">
                TECHNOLOGIES
              </span>
            </div>
            {showTagline && (
              <span className="text-[10px] font-semibold tracking-widest uppercase mt-1 text-slate-400">
                {companyConfig.motto}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (disableLink) {
    return (
      <div
        id="brand-logo-container"
        className={`inline-flex items-center gap-3 group rounded-lg p-1 ${className}`}
        aria-label={`${companyConfig.name} — Accelerating Innovation, Securing Data`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={to}
      id="brand-logo-link"
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] rounded-lg p-1 transition-transform duration-200 active:scale-98 ${className}`}
      aria-label={`${companyConfig.name} — Accelerating Innovation, Securing Data`}
    >
      {content}
    </Link>
  );
};
