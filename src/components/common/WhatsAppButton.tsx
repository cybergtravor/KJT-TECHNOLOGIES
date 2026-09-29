/**
 * =====================================================================
 * REUSABLE WHATSAPP BUTTON COMPONENT - KJT TECHNOLOGIES
 * =====================================================================
 * 
 * Standards Compliant Implementation:
 * - Official WhatsApp green: #25D366 (hover: #20bd5a)
 * - Recognizable white FaWhatsapp icon from react-icons/fa
 * - High-contrast accessible labels and tooltips
 * - Number validation: validates international phone format
 * - Prevents continuous shaking or flashing animations
 * - Contextual pre-filled message generator
 * 
 * Supported Variants:
 * 1. 'floating': Circular fixed floating button with tooltip
 * 2. 'standard': Full rounded button with icon and text
 * 3. 'service': Service inquiry button with dynamic service name
 * 4. 'quote-followup': Quote reference follow-up button
 * 5. 'consultation-followup': Scheduled booking confirmation follow-up
 * 6. 'admin': Administrator direct client-contact button
 * 7. 'social': Small circular icon for header/footer social sections
 * 8. 'icon-only': Compact icon button with tooltip
 * =====================================================================
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { companyConfig } from '../../config/company';
import { servicesData } from '../../data/servicesData';

export type WhatsAppButtonVariant =
  | 'floating'
  | 'standard'
  | 'service'
  | 'quote-followup'
  | 'consultation-followup'
  | 'admin'
  | 'social'
  | 'icon-only';

export interface WhatsAppButtonProps {
  variant?: WhatsAppButtonVariant;
  className?: string;
  label?: string;
  customMessage?: string;
  serviceName?: string;
  quoteReference?: string;
  bookingDetails?: {
    reference: string;
    date: string;
    time: string;
  };
  clientPhoneOrWhatsapp?: string;
  clientName?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  tooltipText?: string;
  ariaLabel?: string;
  id?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

/**
 * Validates whether the configured phone number is a valid international format
 * and not an unconfigured placeholder (e.g. 256XXXXXXXXX or 00000000).
 */
export function isWhatsAppNumberValid(phone: string | undefined): boolean {
  if (!phone) return false;
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length < 8 || clean.length > 15) return false;
  // Check for placeholder patterns like 256XXXXXXXXX, 0000000, 1234567
  if (/^2560{6,}/.test(clean) || /^0{8,}/.test(clean)) return false;
  if (/X/i.test(phone)) return false;
  return true;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  variant = 'floating',
  className = '',
  label,
  customMessage,
  serviceName,
  quoteReference,
  bookingDetails,
  clientPhoneOrWhatsapp,
  clientName,
  size = 'md',
  showTooltip = true,
  tooltipText,
  ariaLabel,
  id,
  target = '_blank',
  rel = 'noopener noreferrer',
  onClick,
}) => {
  const { pathname } = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [showConfigWarning, setShowConfigWarning] = useState(false);

  // 1. Determine Target Phone Number
  // CUSTOMIZE HERE: Enter the KJT TECHNOLOGIES WhatsApp number in international format without +, spaces or brackets.
  const targetNumber =
    variant === 'admin' && clientPhoneOrWhatsapp
      ? clientPhoneOrWhatsapp
      : companyConfig.whatsappNumber || companyConfig.contact.whatsappNumber || '256700000000';

  const cleanNumber = targetNumber.replace(/[^0-9]/g, '');
  const isValid = isWhatsAppNumberValid(cleanNumber);

  // 2. Derive Auto Service Name if on a service page
  let detectedServiceName = serviceName;
  if (!detectedServiceName && pathname.startsWith('/services/')) {
    const slug = pathname.replace('/services/', '').split('/')[0];
    const match = servicesData.find((s) => s.slug === slug || s.id === slug);
    if (match) detectedServiceName = match.title;
  }

  // 3. Formulate Context-Specific Pre-filled Message
  let message = '';
  if (customMessage) {
    message = customMessage;
  } else if (variant === 'service' || detectedServiceName) {
    message = `Hello KJT TECHNOLOGIES. I would like to learn more about ${detectedServiceName || 'your services'}.`;
  } else if (variant === 'quote-followup' || quoteReference) {
    message = `Hello KJT TECHNOLOGIES. I submitted quotation request ${quoteReference || ''} and would like to follow up.`;
  } else if (variant === 'consultation-followup' || bookingDetails) {
    message = `Hello KJT TECHNOLOGIES. I booked consultation ${bookingDetails?.reference || ''} for ${bookingDetails?.date || ''} at ${bookingDetails?.time || ''}.`;
  } else if (variant === 'admin') {
    message = `Hello ${clientName || 'Client'}, this is KJT TECHNOLOGIES regarding your project inquiry.`;
  } else {
    message = 'Hello KJT TECHNOLOGIES. I would like to learn more about your technology services.';
  }

  // 4. Formulate URL
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  // 5. Formulate Accessible Label and Text
  const defaultLabel = (() => {
    switch (variant) {
      case 'service':
        return 'Ask About This Service';
      case 'quote-followup':
        return 'Follow Up on Your Quote';
      case 'consultation-followup':
        return 'Confirm on WhatsApp';
      case 'admin':
        return 'Contact Client on WhatsApp';
      case 'standard':
      default:
        return 'Chat on WhatsApp';
    }
  })();

  const effectiveLabel = label || defaultLabel;
  const effectiveAriaLabel =
    ariaLabel ||
    `${effectiveLabel} - KJT TECHNOLOGIES WhatsApp (${cleanNumber})`;

  const effectiveTooltip = tooltipText || effectiveLabel;

  // Handle click when number is unconfigured placeholder
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (!isValid) {
      // In development or when the number is the template placeholder, alert gently
      console.warn(
        `[KJT TECHNOLOGIES WhatsApp] Notice: The phone number "${targetNumber}" is using the default placeholder. Please configure 'companyConfig.whatsappNumber' in 'src/config/company.ts' with your verified corporate WhatsApp number.`
      );
      setShowConfigWarning(true);
      setTimeout(() => setShowConfigWarning(false), 5000);
    }
  };

  // ---------------------------------------------------------------------------
  // VARIANT: Floating Circular Button (Default)
  // ---------------------------------------------------------------------------
  if (variant === 'floating') {
    return (
      <div
        className="relative flex items-center group pointer-events-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div
            id="whatsapp-floating-tooltip"
            role="tooltip"
            className={`absolute right-full mr-3 whitespace-nowrap px-3.5 py-1.5 rounded-lg bg-[#0A192F] text-white text-xs font-semibold shadow-xl border border-slate-700/80 transition-all duration-200 pointer-events-none ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            }`}
          >
            <span>Chat on WhatsApp</span>
            <span className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-[#0A192F]" />
          </div>
        )}

        {/* Floating Button */}
        <a
          href={whatsappUrl}
          target={target}
          rel={rel}
          onClick={handleClick}
          id={id || 'floating-whatsapp-contact-button'}
          aria-label={effectiveAriaLabel}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer ${className}`}
        >
          <span className="flex items-center justify-center text-white drop-shadow-sm">
            <FaWhatsapp size={28} />
          </span>
        </a>

        {/* Development configuration warning tooltip if clicked on placeholder */}
        {showConfigWarning && (
          <div className="absolute right-0 bottom-full mb-3 w-64 p-3 bg-slate-900 border border-amber-500/70 text-amber-200 text-xs rounded-xl shadow-2xl z-50 animate-fadeIn">
            <p className="font-bold text-amber-300 mb-1">WhatsApp Setup Notice:</p>
            <p>
              Corporate WhatsApp number is set to placeholder <code className="text-white bg-slate-800 px-1 py-0.5 rounded">{targetNumber}</code>. Configure your real number in <code className="text-white bg-slate-800 px-1 py-0.5 rounded">src/config/company.ts</code>.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT: Small Social Icon (Header / Footer / Social Media Bar)
  // ---------------------------------------------------------------------------
  if (variant === 'social') {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
    const boxSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';

    return (
      <a
        href={whatsappUrl}
        target={target}
        rel={rel}
        onClick={handleClick}
        id={id}
        aria-label={effectiveAriaLabel}
        title={effectiveTooltip}
        className={`rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-sm hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25D366]/50 cursor-pointer ${boxSize} ${className}`}
      >
        <FaWhatsapp size={iconSize} />
      </a>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT: Icon Only Button (With Tooltip)
  // ---------------------------------------------------------------------------
  if (variant === 'icon-only') {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
    const boxPadding = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2.5';

    return (
      <a
        href={whatsappUrl}
        target={target}
        rel={rel}
        onClick={handleClick}
        id={id}
        aria-label={effectiveAriaLabel}
        title={effectiveTooltip}
        className={`rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/40 flex items-center justify-center transition-all duration-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#25D366] cursor-pointer ${boxPadding} ${className}`}
      >
        <FaWhatsapp size={iconSize} />
      </a>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANTS: Standard, Service, Quote Follow-up, Consultation Follow-up, Admin
  // ---------------------------------------------------------------------------
  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs gap-1.5';
      case 'lg':
        return 'px-6 py-3.5 text-sm gap-2.5';
      case 'md':
      default:
        return 'px-4 py-2.5 text-xs gap-2';
    }
  })();

  const iconDimensions = size === 'sm' ? 15 : size === 'lg' ? 20 : 17;

  return (
    <a
      href={whatsappUrl}
      target={target}
      rel={rel}
      onClick={handleClick}
      id={id}
      aria-label={effectiveAriaLabel}
      title={effectiveTooltip}
      className={`inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md hover:shadow-[#25D366]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#0A192F] cursor-pointer ${sizeClasses} ${className}`}
    >
      <span className="flex-shrink-0 flex items-center justify-center">
        <FaWhatsapp size={iconDimensions} />
      </span>
      <span className="whitespace-nowrap">{effectiveLabel}</span>
    </a>
  );
};
