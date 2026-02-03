'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

export type ToolCategory = 'all' | 'content' | 'social' | 'analysis';

export interface CategoryFilterProps {
  /** Currently selected category */
  selected: ToolCategory;
  
  /** Callback when category changes */
  onCategoryChange: (category: ToolCategory) => void;
  
  /** Tool counts per category */
  counts?: {
    all: number;
    content: number;
    social: number;
    analysis: number;
  };
}

export function CategoryFilter({
  selected,
  onCategoryChange,
  counts,
}: CategoryFilterProps) {
  const t = useTranslations();

  const categories: { value: ToolCategory; label: string }[] = [
    { value: 'all', label: t('categories.all') },
    { value: 'content', label: t('categories.contentCreation') },
    { value: 'social', label: t('categories.socialMedia') },
    { value: 'analysis', label: t('categories.imageAnalysis') },
  ];

  return (
    <div className="mb-12">
      <Tabs
        value={selected}
        onValueChange={(value) => onCategoryChange(value as ToolCategory)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 bg-zinc-900/50 p-1.5 h-auto gap-1">
          {categories.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="relative data-[state=active]:bg-[var(--accent-brand)] data-[state=active]:text-black font-semibold text-sm py-3 px-4 transition-all duration-300"
            >
              <span className="relative z-10">{label}</span>
              {counts && counts[value] > 0 && (
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-zinc-700 data-[state=active]:bg-black/20 px-2 py-0.5 text-xs font-medium">
                  {counts[value]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
