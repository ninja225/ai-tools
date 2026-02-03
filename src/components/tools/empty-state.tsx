'use client';

import Link from 'next/link';
import { SearchX, PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface EmptyStateProps {
  /** The category that returned no results */
  category?: string;
}

export function EmptyState({ category }: EmptyStateProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800/50 ring-1 ring-zinc-700">
        <SearchX className="h-12 w-12 text-zinc-500" />
      </div>

      {/* Message */}
      <h3 className="mb-2 text-2xl font-bold text-white">
        {category ? `No tools found in ${category}` : 'No tools found'}
      </h3>
      <p className="mb-8 text-center text-neutral-400 max-w-md">
        {category 
          ? `We couldn't find any tools in this category. Try browsing all tools or select a different category.`
          : `We couldn't find any tools matching your criteria.`
        }
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/tools"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--accent-brand)] px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:brightness-110 shadow-lg hover:shadow-[var(--accent-brand)]/50"
        >
          <PackageOpen className="mr-2 h-4 w-4" />
          View All Tools
        </Link>
        
        {category && (
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800"
          >
            Clear Filters
          </Link>
        )}
      </div>
    </div>
  );
}
