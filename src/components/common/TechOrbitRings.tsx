/**
 * =====================================================================
 * TECH ORBIT RINGS - KJT TECHNOLOGIES
 * =====================================================================
 * Decorative animated orbit rings with rotating dots and glow pulses.
 * Used on hero and feature sections for a futuristic tech aesthetic.
 * =====================================================================
 */

import React from 'react';

interface TechOrbitRingsProps {
  size?: number;
  className?: string;
}

export const TechOrbitRings: React.FC<TechOrbitRingsProps> = ({
  size = 480,
  className = '',
}) => {
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      aria-hidden="true"
      className={`absolute pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outermost ring */}
        <circle
          cx={cx}
          cy={cy}
          r={cx - 4}
          stroke="rgba(0,212,255,0.08)"
          strokeWidth="1"
          strokeDasharray="6 14"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`360 ${cx} ${cy}`}
            dur="60s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Outer ring with rotating dots */}
        <circle
          cx={cx}
          cy={cy}
          r={cx - 40}
          stroke="rgba(0,212,255,0.12)"
          strokeWidth="0.75"
        />
        <circle cx={cx} cy={cy + 40 - cx} r="3.5" fill="rgba(0,212,255,0.6)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`360 ${cx} ${cy}`}
            dur="28s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={cx + cx - 40} cy={cy} r="2.5" fill="rgba(0,212,255,0.4)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`360 ${cx} ${cy}`}
            dur="28s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Middle ring */}
        <circle
          cx={cx}
          cy={cy}
          r={cx - 90}
          stroke="rgba(0,212,255,0.15)"
          strokeWidth="0.75"
          strokeDasharray="3 8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`-360 ${cx} ${cy}`}
            dur="20s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={cx} cy={90} r="3" fill="rgba(0,212,255,0.8)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`-360 ${cx} ${cy}`}
            dur="20s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="3;4.5;3"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Inner ring */}
        <circle
          cx={cx}
          cy={cy}
          r={cx - 140}
          stroke="rgba(0,212,255,0.2)"
          strokeWidth="1"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`360 ${cx} ${cy}`}
            dur="14s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={cx} cy={cx - 140 + cy} r="4" fill="#00D4FF">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`360 ${cx} ${cy}`}
            dur="14s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Central glow core */}
        <circle cx={cx} cy={cy} r="18" fill="rgba(0,212,255,0.08)">
          <animate
            attributeName="r"
            values="16;22;16"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx={cx} cy={cy} r="7" fill="rgba(0,212,255,0.6)" />
        <circle cx={cx} cy={cy} r="3" fill="#00D4FF">
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Cross-hair tick marks */}
        <line x1={cx} y1={cy - cx + 12} x2={cx} y2={cy - cx + 22} stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
        <line x1={cx} y1={cx + cy - 12} x2={cx} y2={cx + cy - 22} stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
        <line x1={12} y1={cy} x2={22} y2={cy} stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
        <line x1={size - 22} y1={cy} x2={size - 12} y2={cy} stroke="rgba(0,212,255,0.4)" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
