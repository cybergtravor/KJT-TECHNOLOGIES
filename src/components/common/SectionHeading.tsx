import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';
  const alignmentClass =
    align === 'center'
      ? 'text-center mx-auto items-center'
      : align === 'right'
      ? 'text-right ml-auto items-end'
      : 'text-left items-start';

  return (
    <div className={`flex flex-col max-w-3xl ${alignmentClass} ${className}`}>
      {badge && (
        <span
          className="inline-block px-3.5 py-1 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-bold uppercase tracking-[0.2em] rounded-sm mb-4"
        >
          {badge}
        </span>
      )}
      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
