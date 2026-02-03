/**
 * Quote Generator Form Component
 * 
 * Form inputs for Quote Generator tool with 3 variants
 */

'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface QuoteGeneratorFormData {
  variant: 'inspirational' | 'philosophical' | 'humorous';
  topic: string;
  style: string;
  mood: string;
  language: string;
}

interface QuoteGeneratorFormProps {
  value: QuoteGeneratorFormData;
  onChange: (data: QuoteGeneratorFormData) => void;
  onVariantChange?: (variant: string) => void;
  disabled?: boolean;
}

export function QuoteGeneratorForm({
  value,
  onChange,
  onVariantChange,
  disabled = false,
}: QuoteGeneratorFormProps) {
  const t = useTranslations();

  const handleVariantChange = (variant: string) => {
    onChange({ ...value, variant: variant as QuoteGeneratorFormData['variant'] });
    onVariantChange?.(variant);
  };

  const handleFieldChange = (field: keyof QuoteGeneratorFormData, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-6">
      {/* Variant Selector - Tabs for 3 variants */}
      <div>
        <Label className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.variant')}
        </Label>
        <Tabs
          value={value.variant}
          onValueChange={handleVariantChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800 p-1">
            <TabsTrigger value="inspirational" disabled={disabled}>Inspirational</TabsTrigger>
            <TabsTrigger value="philosophical" disabled={disabled}>Philosophical</TabsTrigger>
            <TabsTrigger value="humorous" disabled={disabled}>Humorous</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Topic Input */}
      <div>
        <Label htmlFor="topic" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.topic')} <span className="text-red-400">*</span>
        </Label>
        <Input
          id="topic"
          value={value.topic}
          onChange={(e) => handleFieldChange('topic', e.target.value)}
          placeholder={t('forms.placeholder.topic')}
          disabled={disabled}
          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Style Select */}
      <div>
        <Label htmlFor="style" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.style')} <span className="text-red-400">*</span>
        </Label>
        <Select
          value={value.style}
          onValueChange={(val) => handleFieldChange('style', val)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder={t('forms.placeholder.style')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="modern">Modern</SelectItem>
            <SelectItem value="classic">Classic</SelectItem>
            <SelectItem value="minimalist">Minimalist</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mood Select */}
      <div>
        <Label htmlFor="mood" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.mood')} <span className="text-red-400">*</span>
        </Label>
        <Select
          value={value.mood}
          onValueChange={(val) => handleFieldChange('mood', val)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder={t('forms.placeholder.mood')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uplifting">Uplifting</SelectItem>
            <SelectItem value="thoughtful">Thoughtful</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="calm">Calm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language Select */}
      <div>
        <Label htmlFor="language" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.language')} <span className="text-red-400">*</span>
        </Label>
        <Select
          value={value.language}
          onValueChange={(val) => handleFieldChange('language', val)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder={t('forms.placeholder.language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="russian">Russian</SelectItem>
            <SelectItem value="arabic">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
