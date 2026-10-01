/**
 * =====================================================================
 * STATS COUNTER - KJT TECHNOLOGIES
 * =====================================================================
 * Animated counting numbers that increment from 0 on viewport enter.
 * Uses IntersectionObserver for performant lazy-start animation.
 * =====================================================================
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { companyConfig } from '../../config/company';
import { ShieldCheck, CheckCircle, Clock, Server } from 'lucide-react';

const icons = [CheckCircle, ShieldCheck, Server, Clock];
const accentColors = ['#00D4FF', '#34D399', '#A78BFA', '#F59E0B'];

/** Parse a stat value string like "500+" → { number: 500, suffix: "+" } */
function parseStatValue(value: string): { number: number; suffix: string; prefix: string } {
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? '';
  const suffix = value.match(/[^0-9.]+$/)?.[0] ?? '';
  const numStr = value.replace(prefix, '').replace(suffix, '');
  const number = parseFloat(numStr) || 0;
  return { number, suffix, prefix };
}

interface AnimatedNumberProps {
  target: number;
  suffix: string;
  prefix: string;
  duration?: number;
  started: boolean;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  target,
  suffix,
  prefix,
  duration = 1800,
  started,
}) => {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;
    startTimeRef.current = null;

    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target, duration]);

  return (
    <span>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
};

export const StatsCounter: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
      {companyConfig.stats.map((stat, idx) => {
        const Icon = icons[idx % icons.length];
        const accentColor = accentColors[idx % accentColors.length];
        const parsed = parseStatValue(stat.value);

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: 'easeOut' }}
            className="relative bg-slate-800/40 p-6 sm:p-7 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
            style={{ borderLeftColor: accentColor, borderLeftWidth: 3 }}
          >
            {/* Background corner glow */}
            <div
              className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            <div className="flex items-center justify-between mb-3">
              {/* Animated number */}
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight transition-colors" style={{ color: hasStarted ? accentColor : 'white' }}>
                <AnimatedNumber
                  target={parsed.number}
                  suffix={parsed.suffix}
                  prefix={parsed.prefix}
                  duration={1600 + idx * 150}
                  started={hasStarted}
                />
              </span>

              {/* Icon badge */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}35` }}
              >
                <Icon className="w-5 h-5" style={{ color: accentColor }} />
              </div>
            </div>

            <h3 className="font-bold text-white text-sm mb-1">{stat.label}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{stat.description}</p>

            {/* Bottom accent bar */}
            <div
              className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl"
              style={{ backgroundColor: accentColor }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};
