'use client';

import { LucideIcon } from 'lucide-react';
import { SimpleIconWrapper } from '@/components/ui/simple-icon-wrapper';
import Image from 'next/image';
import { BaseCard } from './base-card';

interface VariantCardProps {
  name: string;
  description?: string;
  icon?: LucideIcon;
  simpleIcon?: string;
  customIconPath?: string;
  lucideIconName?: string;
  onClick?: () => void;
}

export function VariantCard({ 
  name, 
  description, 
  icon: Icon, 
  simpleIcon, 
  customIconPath, 
  lucideIconName, 
  onClick 
}: VariantCardProps) {
  return (
    <BaseCard
      onClick={onClick}
      glowIntensity="medium"
      className="h-56 w-80 flex justify-center items-center group"
    >
      <div className="z-10 flex flex-col items-center gap-3">
        {customIconPath ? (
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-[0_0_12px_rgba(247,184,7,0.6)] transition-transform group-hover:scale-110">
            <Image 
              src={customIconPath} 
              alt={name} 
              width={64} 
              height={64}
              className="object-contain"
            />
          </div>
        ) : simpleIcon ? (
          <div className="w-16 h-16 flex items-center justify-center drop-shadow-[0_0_12px_rgba(247,184,7,0.6)] transition-transform group-hover:scale-110">
            <SimpleIconWrapper iconName={simpleIcon} size={64} />
          </div>
        ) : Icon ? (
          <Icon 
            className="text-[var(--accent-brand)] w-16 h-16 drop-shadow-[0_0_12px_rgba(247,184,7,0.6)] transition-transform group-hover:scale-110" 
            strokeWidth={1.5}
          />
        ) : null}
        <span className="text-white text-2xl font-bold font-display text-center px-4">
          {name}
        </span>
        {description && (
          <p className="text-gray-400 text-sm text-center px-6 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </BaseCard>
  );
}
