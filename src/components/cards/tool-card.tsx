'use client';

import { LucideIcon } from 'lucide-react';
import { BaseCard } from './base-card';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: string;
  variantCount?: number;
  variantText?: string;
}

// Category-specific accent colors
const CATEGORY_COLORS = {
  content: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  social: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
  analysis: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  default: 'bg-[var(--accent-brand)]/20 text-[var(--accent-brand)] border-[var(--accent-brand)]/30',
};

export function ToolCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  category,
  variantCount,
  variantText = 'See more'
}: ToolCardProps) {
  const categoryColor = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
  
  return (
    <BaseCard 
      href={href}
      glowIntensity="low"
      className="h-[400px] p-6 flex flex-col items-start justify-between gap-4 group"
    >
      {/* Category badge - top right corner */}
      <div className="absolute top-4 right-4 z-20">
        <span className={cn(
          'text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border',
          categoryColor
        )}>
          {category === 'content' && 'Content'}
          {category === 'social' && 'Social'}
          {category === 'analysis' && 'Analysis'}
          {!['content', 'social', 'analysis'].includes(category) && category}
        </span>
      </div>
      
      {/* Icon/Image Area */}
      <div className="w-full h-48 bg-gradient-to-br from-[var(--accent-brand)]/20 to-[var(--accent-shadow)]/20 rounded-2xl flex items-center justify-center relative overflow-hidden border border-[var(--accent-brand)]/20">
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <Icon 
          className="w-24 h-24 text-[var(--accent-brand)] drop-shadow-[0_0_12px_rgba(247,184,7,0.6)] transition-transform duration-300 group-hover:scale-110 relative z-10" 
          strokeWidth={1.5} 
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <p className="font-extrabold text-xl text-white font-display">{title}</p>
        <p className="text-sm text-neutral-400 line-clamp-2">{description}</p>
      </div>
      
      {/* Button */}
      <button className="w-full bg-[var(--accent-brand)] text-black font-extrabold py-3 px-6 rounded-xl hover:brightness-110 transition-all duration-200 shadow-lg group-hover:shadow-[var(--accent-brand)]/50">
        {variantText} {variantCount && `(${variantCount})`}
      </button>
    </BaseCard>
  );
}
