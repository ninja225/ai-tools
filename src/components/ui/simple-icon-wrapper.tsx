import React from 'react';
import * as SimpleIcons from 'simple-icons';

interface SimpleIconWrapperProps {
  iconName: string;
  size?: number;
  className?: string;
}

interface SimpleIconData {
  title: string;
  slug: string;
  path: string;
  hex: string;
  source: string;
  guidelines?: string;
}

export function SimpleIconWrapper({ 
  iconName, 
  size = 24, 
  className = '' 
}: SimpleIconWrapperProps) {
  // Convert icon name to Simple Icons format
  // e.g., 'facebook' -> 'siFacebook', 'vk' -> 'siVk', 'yandex' -> 'siYandex'
  const siName = `si${iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')}`;
  
  // Get the icon data from Simple Icons
  const iconData = (SimpleIcons as Record<string, SimpleIconData>)[siName];
  
  if (!iconData || !iconData.path) {
    // Fallback to a generic icon if not found
    console.warn(`Icon "${iconName}" (${siName}) not found in Simple Icons`);
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs font-bold">?</span>
        </div>
      </div>
    );
  }
  
  // Render SVG from icon data object
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      fill={`#${iconData.hex}`}
      aria-label={iconData.title}
    >
      <path d={iconData.path} />
    </svg>
  );
}
