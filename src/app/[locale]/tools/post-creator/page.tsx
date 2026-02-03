'use client';

import { useState, useEffect, useRef } from 'react';
import { use } from 'react';
import { useTranslations } from 'next-intl';
import { ToolPageLayout } from '@/components/layout/tool-page-layout';
import { PostCreatorForm, type PostCreatorFormData } from '@/components/tools/post-creator-form';
import { postCreatorSchema } from '@/lib/validation/tool-input-schemas';
import { toast } from 'sonner';
import { z } from 'zod';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function PostCreatorPage({ params }: PageProps) {
  const { locale } = use(params);
  const t = useTranslations();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState<PostCreatorFormData>({
    platform: 'vk',
    topic: '',
    tone: 'professional',
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

  const handleGenerate = async () => {
    try {
      setError(null);
      setResult(null);

      // Validate form data
      const validatedData = postCreatorSchema.parse(formData);

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
          toolId: 'post-creator',
          ...validatedData,
        }),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate post' }));
        throw new Error(errorData.message || 'Failed to generate post');
      }

      const data = await response.json();
      // Access nested data structure: data.data.content
      const generatedContent = data.data?.content || data.content || data.result || 'No content generated';
      setResult(generatedContent);
      toast.success('Post generated successfully!');
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
      toolName={t('toolNames.socialMediaPost')}
      toolDescription={t('toolDescriptions.socialMediaPost')}
      formInputs={
        <PostCreatorForm
          value={formData}
          onChange={setFormData}
          disabled={isLoading}
        />
      }
      resultsDisplay={
        result ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Generated Post</h3>
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
