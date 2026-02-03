'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { ToolPageLayout } from '@/components/layout/tool-page-layout';
import { StoryCreatorForm, type StoryCreatorFormData } from '@/components/tools/story-creator-form';
import { storyCreatorSchema } from '@/lib/validation/tool-input-schemas';
import { toast } from 'sonner';
import { z } from 'zod';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function StoryCreatorPage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState<StoryCreatorFormData>({
    variant: 'general',
    topic: '',
    tone: 'professional',
    length: 'medium',
    language: 'english',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleVariantChange = () => {
    // If generation is in progress, abort it
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setError(null);
      toast.info('Generation cancelled due to variant change');
    }
  };

  const handleGenerate = async () => {
    try {
      // Reset states
      setError(null);
      setResult(null);

      // Validate form data
      const validatedData = storyCreatorSchema.parse(formData);

      // Create AbortController with 120s timeout
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, 120000);

      setIsLoading(true);

      // Call API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId: 'story-creator',
          ...validatedData,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate story' }));
        throw new Error(errorData.message || 'Failed to generate story');
      }

      const data = await response.json();
      // Access nested data structure: data.data.content
      const generatedContent = data.data?.content || data.content || data.result || 'No content generated';
      setResult(generatedContent);
      toast.success('Story generated successfully!');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.issues[0];
        setError(firstError.message);
        toast.error(firstError.message);
      } else if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError(t('errors.timeout'));
          toast.error(t('errors.timeout'));
        } else {
          setError(err.message);
          toast.error(err.message);
        }
      } else {
        setError(t('errors.generation'));
        toast.error(t('errors.generation'));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setError(null);
      toast.info('Generation cancelled');
    }
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  return (
    <ToolPageLayout
      toolName={t('toolNames.storyCreator')}
      toolDescription={t('toolDescriptions.storyCreator')}
      formInputs={
        <StoryCreatorForm
          value={formData}
          onChange={setFormData}
          onVariantChange={handleVariantChange}
          disabled={isLoading}
        />
      }
      resultsDisplay={
        result ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Generated Story</h3>
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-neutral-300 bg-zinc-800/50 p-6 rounded-xl border border-zinc-700">
                {result}
              </div>
            </div>
          </div>
        ) : undefined
      }
      isLoading={isLoading}
      error={error}
      onGenerate={handleGenerate}
      onCancel={isLoading ? handleCancel : undefined}
      onRetry={error ? handleRetry : undefined}
      locale={locale}
    />
  );
}
