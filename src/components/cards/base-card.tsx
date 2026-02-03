'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BaseCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Child elements to render inside the card */
  children: React.ReactNode;
  
  /** Additional Tailwind classes to merge with base styles */
  className?: string;
  
  /** Optional href - renders as Next.js Link if provided */
  href?: string;
  
  /** Optional click handler - renders as button if provided (mutually exclusive with href) */
  onClick?: () => void;
  
  /** Glow effect intensity on hover */
  glowIntensity?: "low" | "medium" | "high";
  
  /** Opacity of grain texture overlay (0-1) */
  grainOpacity?: number;
}

const GLOW_INTENSITY_MAP = {
  low: 'hover:shadow-[0_0_30px_rgba(247,184,7,0.2)]',
  medium: 'hover:shadow-[0_0_40px_rgba(247,184,7,0.3)]',
  high: 'hover:shadow-[0_0_50px_rgba(247,184,7,0.4)]',
};

export function BaseCard({
  children,
  className,
  href,
  onClick,
  glowIntensity = 'medium',
  grainOpacity = 0.08,
  ...props
}: BaseCardProps) {
  const glowClass = GLOW_INTENSITY_MAP[glowIntensity];
  
  const baseStyles = cn(
    // Base structure
    'relative overflow-hidden rounded-2xl',
    // Border and background
    'border border-[var(--accent-brand)]/20',
    'bg-gradient-to-br from-zinc-900/90 to-zinc-950/90',
    // Hover effects
    'transition-all duration-300 ease-out',
    'hover:scale-[1.02] hover:border-[var(--accent-brand)]/40',
    glowClass,
    className
  );

  const content = (
    <>
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          opacity: grainOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />
      
      {/* Content area with backdrop blur */}
      <div className="relative z-20 h-full w-full backdrop-blur-md">
        {children}
      </div>
    </>
  );

  // Render as Link if href provided
  if (href) {
    return (
      <Link href={href} className={baseStyles} {...props}>
        {content}
      </Link>
    );
  }

  // Render as button if onClick provided
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(baseStyles, 'cursor-pointer')}
        {...props}
      >
        {content}
      </button>
    );
  }

  // Render as div by default
  return (
    <div className={baseStyles} {...props}>
      {content}
    </div>
  );
}
