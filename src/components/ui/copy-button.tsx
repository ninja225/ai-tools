'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  text: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function CopyButton({
  text,
  variant = 'outline',
  size = 'sm',
  className,
}: CopyButtonProps) {
  const t = useTranslations('ui.copyButton');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      aria-label={copied ? t('copied') : t('copy')}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          {t('copied')}
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          {t('copy')}
        </>
      )}
    </Button>
  );
}
