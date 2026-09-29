import React from 'react';
import { getAuthorInitials, getAuthorColorTheme } from '../../lib/authorUtils';

export interface AuthorAvatarProps {
  /** The full name of the author (e.g. 'Jonathan Travor', 'Sarah Nakato') */
  name?: string | null;
  /** Size variant: xs (24px), sm (32px), md (44px), lg (56px), xl (64px) */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Optional custom CSS classes for fine-tuned positioning */
  className?: string;
  /** Optional tooltip text override */
  tooltip?: string;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px] min-w-6 min-h-6',
  sm: 'w-8 h-8 text-xs min-w-8 min-h-8',
  md: 'w-11 h-11 text-sm min-w-11 min-h-11',
  lg: 'w-14 h-14 text-base min-w-14 min-h-14',
  xl: 'w-16 h-16 text-lg min-w-16 min-h-16',
};

/**
 * AuthorAvatar Component - KJT TECHNOLOGIES
 * 
 * Replaces author profile photos with a sleek, circular initials avatar.
 * Adheres strictly to brand colors, high contrast WCAG standards, and screen reader accessibility.
 * 
 * Examples:
 * - Jonathan Travor → JT
 * - Sarah Nakato → SN
 * - KJT Technologies → KT
 * - Peter → P
 * - John Michael Okello → JO
 * - Empty name → KJ
 */
export const AuthorAvatar: React.FC<AuthorAvatarProps> = ({
  name,
  size = 'sm',
  className = '',
  tooltip,
}) => {
  const displayName = name && name.trim() ? name.trim() : 'KJT Technologies';
  const initials = getAuthorInitials(displayName);
  const theme = getAuthorColorTheme(displayName);
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.sm;
  const accessibleLabel = `Author: ${displayName}`;

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      title={tooltip || accessibleLabel}
      className={`
        relative inline-flex items-center justify-center rounded-full aspect-square shrink-0 select-none
        font-bold tracking-wider leading-none text-center
        border transition-all duration-200
        ${sizeClasses}
        ${theme.bgClass}
        ${theme.textClass}
        ${theme.borderClass}
        ${theme.shadowClass}
        ${className}
      `}
    >
      {/* Visual Uppercase Initials */}
      <span aria-hidden="true" className="font-mono font-bold uppercase pointer-events-none select-none">
        {initials}
      </span>

      {/* Screen-reader accessible label */}
      <span className="sr-only">{accessibleLabel}</span>
    </div>
  );
};

export default AuthorAvatar;
