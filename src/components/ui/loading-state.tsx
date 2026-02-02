'use client';

import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  estimatedSeconds?: number;
}

export function LoadingState({ message, estimatedSeconds }: LoadingStateProps) {
  const t = useTranslations('ui.loading');

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <div className="text-center space-y-2">
        <p className="text-lg font-medium">
          {message || t('generating')}
        </p>
        {estimatedSeconds && (
          <p className="text-sm text-muted-foreground">
            {t('estimatedTime', { seconds: estimatedSeconds })}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {t('pleaseWait')}
        </p>
      </div>
    </div>
  );
}
