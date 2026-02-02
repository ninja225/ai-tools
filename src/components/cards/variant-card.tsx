'use client';

import { LucideIcon } from 'lucide-react';
import { SimpleIconWrapper } from '@/components/ui/simple-icon-wrapper';
import Image from 'next/image';

interface VariantCardProps {
  name: string;
  description?: string;
  icon?: LucideIcon;
  simpleIcon?: string;
  customIconPath?: string;
  lucideIconName?: string;
  onClick?: () => void;
}

export function VariantCard({ name, description, icon: Icon, simpleIcon, customIconPath, lucideIconName, onClick }: VariantCardProps) {
  return (
    <div className="bg-[var(--accent-brand)] rounded-2xl shadow-lg shadow-[var(--accent-brand)]/30">
      <button
        onClick={onClick}
        className="group overflow-hidden relative after:duration-500 before:duration-500 duration-500 hover:after:duration-500 hover:after:translate-x-24 hover:before:translate-y-12 hover:before:-translate-x-32 hover:duration-500 after:absolute after:w-24 after:h-24 after:bg-[var(--accent-brand)] after:rounded-full after:blur-xl after:bottom-32 after:right-16 after:w-12 after:h-12 after:opacity-20 before:absolute before:w-20 before:h-20 before:bg-[#ef4444] before:rounded-full before:blur-xl before:top-20 before:right-16 before:w-12 before:h-12 before:opacity-20 hover:rotate-6 flex justify-center items-center h-56 w-80 origin-bottom-right bg-neutral-900 rounded-2xl outline outline-[var(--accent-brand)]/40 -outline-offset-8 transition-all"
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
      </button>
    </div>
  );
}
