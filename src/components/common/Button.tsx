import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cyan' | 'secondary' | 'outline' | 'outline-white' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  external?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  external = false,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs font-bold gap-1.5 uppercase tracking-wider',
    md: 'px-6 py-2.5 text-sm font-bold gap-2 uppercase tracking-widest',
    lg: 'px-8 py-4 text-sm font-bold gap-2.5 uppercase tracking-widest',
  };

  const variantClasses = {
    // Primary: Electric gradient from #00D4FF to #0055FF
    primary:
      'bg-gradient-to-r from-[#00D4FF] to-[#0055FF] text-white hover:brightness-110 active:opacity-90 shadow-lg shadow-[#00D4FF]/20 transition-all duration-200',
    // Electric Cyan high-energy CTA (signature Geometric Balance button)
    cyan:
      'bg-[#00D4FF] text-[#0A192F] font-bold hover:bg-white hover:text-[#0A192F] active:bg-[#00D4FF]/90 shadow-lg shadow-[#00D4FF]/20 transition-all duration-200',
    // Clean secondary neutral
    secondary:
      'bg-slate-800/60 text-slate-200 hover:bg-slate-700/80 active:bg-slate-800 border border-slate-700/60 transition-colors',
    // Corporate outline
    outline:
      'bg-transparent text-slate-200 hover:text-[#00D4FF] border border-slate-700 hover:border-[#00D4FF]/60 hover:bg-[#00D4FF]/10 transition-all',
    // Light outline for dark headers / hero banners
    'outline-white':
      'bg-transparent text-white hover:text-[#00D4FF] border border-slate-700 hover:border-[#00D4FF]/60 hover:bg-slate-800 transition-all',
    // Ghost
    ghost:
      'bg-transparent text-slate-300 hover:text-[#00D4FF] hover:bg-slate-800/50 transition-colors',
    // WhatsApp Direct Action
    whatsapp:
      'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all duration-200',
  };

  const baseClasses = `inline-flex items-center justify-center rounded-sm cursor-pointer whitespace-nowrap transition-all duration-150 active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF] disabled:opacity-50 disabled:pointer-events-none ${
    fullWidth ? 'w-full' : ''
  } ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {content}
    </button>
  );
};
