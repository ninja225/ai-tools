'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { ToolPageLayout } from '@/components/layout/tool-page-layout';
import { SceneMoodDescriberForm, type SceneMoodDescriberFormData } from '@/components/tools/scene-mood-describer-form';
import { sceneMoodDescriberSchema } from '@/lib/validation/tool-input-schemas';
import { toast } from 'sonner';
import { z } from 'zod';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function SceneMoodDescriberPage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState<SceneMoodDescriberFormData>({
    variant: 'basic',
    image: null,
    analysisDepth: 'quick',
    language: 'english',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleVariantChange = (variant: string) => {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setError(null);
      toast.info('Generation cancelled due to variant change');
    }
  };

  const handleGenerate = async () => {
    try {
      setError(null);
      setResult(null);

      const validatedData = sceneMoodDescriberSchema.parse(formData);

      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, 120000);

      setIsLoading(true);

      // Scene Mood Describer uses dedicated API route
      const response = await fetch('/api/analyze-scene-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to analyze scene mood' }));
        throw new Error(errorData.message || 'Failed to analyze scene mood');
      }

      const data = await response.json();
      // Access nested data structure: data.data.content
      const generatedContent = data.data?.content || data.content || data.result || 'No content generated';
      setResult(generatedContent);
      toast.success('Scene mood analyzed successfully!');
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
      toast.info('Analysis cancelled');
    }
  };

  const handleRetry = () => {
    setError(null);
    handleGenerate();
  };

  return (
    <ToolPageLayout
      toolName={t('toolNames.sceneMoodDescriber')}
      toolDescription={t('toolDescriptions.sceneMoodDescriber')}
      formInputs={
        <SceneMoodDescriberForm
          value={formData}
          onChange={setFormData}
          onVariantChange={handleVariantChange}
          disabled={isLoading}
        />
      }
      resultsDisplay={
        result ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Scene Mood Analysis</h3>
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
