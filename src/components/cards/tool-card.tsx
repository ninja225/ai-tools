'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: string;
  variantCount?: number;
  variantText?: string;
}

export function ToolCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  category,
  variantCount,
  variantText = 'See more'
}: ToolCardProps) {
  return (
    <Link 
      href={href}
      className="w-full h-[400px] bg-neutral-800 rounded-3xl text-neutral-300 p-6 flex flex-col items-start justify-between gap-4 hover:bg-gray-900 hover:shadow-2xl hover:shadow-[var(--accent-brand)]/40 transition-all duration-300 group"
    >
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
        <div className="mb-1">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--accent-brand)]/20 text-[var(--accent-brand)] border border-[var(--accent-brand)]/30">
            {category}
          </span>
        </div>
        <p className="font-extrabold text-xl text-white font-display">{title}</p>
        <p className="text-sm text-neutral-400 line-clamp-2">{description}</p>
      </div>
      
      {/* Button */}
      <button className="w-full bg-[var(--accent-brand)] text-black font-extrabold py-3 px-6 rounded-xl hover:brightness-110 transition-all duration-200 shadow-lg group-hover:shadow-[var(--accent-brand)]/50">
        {variantText} {variantCount && `(${variantCount})`}
      </button>
    </Link>
  );
}
