/**
 * =====================================================================
 * ANIMATED TECH BACKGROUND - KJT TECHNOLOGIES
 * =====================================================================
 * Reusable SVG/CSS animated background: circuit nodes, scan lines,
 * floating data particles, pulsing connection rings.
 * Used as an overlay on hero / section backgrounds.
 * =====================================================================
 */

import React, { useEffect, useRef } from 'react';

interface AnimatedTechBgProps {
  variant?: 'circuit' | 'particles' | 'grid' | 'full';
  opacity?: number;
  className?: string;
}

export const AnimatedTechBg: React.FC<AnimatedTechBgProps> = ({
  variant = 'full',
  opacity = 0.18,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    // Particle node type
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      alphaDir: number;
    }

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 55;
    const CONNECTION_DIST = 130;
    const NODE_COLOR = '0, 212, 255';

    function resize() {
      width = canvas!.offsetWidth;
      height = canvas!.offsetHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.6 + 0.2,
          alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
        });
      }
    }

    function drawGrid() {
      const step = 40;
      ctx!.strokeStyle = `rgba(${NODE_COLOR}, 0.04)`;
      ctx!.lineWidth = 0.5;
      for (let x = 0; x <= width; x += step) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y <= height; y += step) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }
    }

    function drawParticles() {
      for (const p of particles) {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha > 0.8 || p.alpha < 0.1) p.alphaDir *= -1;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw node
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${NODE_COLOR}, ${p.alpha})`;
        ctx!.fill();

        // Draw pulse ring on larger nodes
        if (p.radius > 1.2) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx!.strokeStyle = `rgba(${NODE_COLOR}, ${p.alpha * 0.25})`;
          ctx!.lineWidth = 0.5;
          ctx!.stroke();
        }
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const strength = (1 - dist / CONNECTION_DIST) * 0.35;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.strokeStyle = `rgba(${NODE_COLOR}, ${strength})`;
            ctx!.lineWidth = 0.6;
            ctx!.stroke();
          }
        }
      }
    }

    function drawScanLine(t: number) {
      // Horizontal scan line
      const y = ((t * 0.03) % height);
      const grad = ctx!.createLinearGradient(0, y - 30, 0, y + 30);
      grad.addColorStop(0, `rgba(${NODE_COLOR}, 0)`);
      grad.addColorStop(0.5, `rgba(${NODE_COLOR}, 0.06)`);
      grad.addColorStop(1, `rgba(${NODE_COLOR}, 0)`);
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, y - 30, width, 60);
    }

    let t = 0;
    function animate() {
      ctx!.clearRect(0, 0, width, height);
      if (variant === 'grid' || variant === 'full' || variant === 'circuit') drawGrid();
      if (variant === 'particles' || variant === 'full') {
        drawConnections();
        drawParticles();
      }
      if (variant === 'full' || variant === 'circuit') drawScanLine(t);
      t++;
      rafRef.current = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    const ro = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
    />
  );
};
