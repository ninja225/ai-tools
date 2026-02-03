/**
 * ToolPageLayout Component
 * 
 * Shared layout for all tool pages with consistent structure:
 * - Header with tool name and back button
 * - Variant selector (tabs or dropdown based on count)
 * - Form inputs
 * - Generate button with loading state and cancel
 * - Results display area
 * - Error handling with retry button
 */

'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ToolPageLayoutProps {
  /** Tool display name */
  toolName: string;
  /** Tool description */
  toolDescription?: string;
  /** Variant selector component (Tabs or Select) */
  variantSelector?: ReactNode;
  /** Form inputs component */
  formInputs: ReactNode;
  /** Results display component */
  resultsDisplay?: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
  /** Generate button handler */
  onGenerate: () => void;
  /** Cancel button handler */
  onCancel?: () => void;
  /** Retry button handler */
  onRetry?: () => void;
  /** Locale for back link */
  locale: string;
}

export function ToolPageLayout({
  toolName,
  toolDescription,
  variantSelector,
  formInputs,
  resultsDisplay,
  isLoading = false,
  error = null,
  onGenerate,
  onCancel,
  onRetry,
  locale,
}: ToolPageLayoutProps) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/tools`}
              className="flex items-center gap-2 text-neutral-400 hover:text-[var(--accent-brand)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t('tools.backToTools')}</span>
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-extrabold text-white font-display">{toolName}</h1>
            {toolDescription && (
              <p className="text-neutral-400 text-sm mt-1">{toolDescription}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="space-y-6">
            {/* Variant Selector */}
            {variantSelector && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                {variantSelector}
              </div>
            )}

            {/* Form Inputs */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
              {formInputs}

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
                {isLoading && onCancel ? (
                  <button
                    onClick={onCancel}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    {t('forms.buttons.cancel')}
                  </button>
                ) : (
                  <button
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="flex-1 bg-[var(--accent-brand)] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-[var(--accent-brand)]/50"
                  >
                    {isLoading ? 'Generating...' : t('forms.buttons.generate')}
                  </button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4">
                  <p className="text-red-400 text-sm mb-2">{error}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="text-sm text-[var(--accent-brand)] hover:underline"
                    >
                      {t('forms.buttons.retry')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[var(--accent-brand)] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-neutral-400 text-sm">Generating content...</p>
                </div>
              </div>
            ) : resultsDisplay ? (
              resultsDisplay
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-neutral-500 text-center">
                  Fill in the form and click Generate to see results
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
