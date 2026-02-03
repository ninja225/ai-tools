/**
 * Story Creator Form Component
 * 
 * Form inputs for Story Creator tool with 4 variants (General, TikTok, Reels, Short)
 */

'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface StoryCreatorFormData {
  variant: 'general' | 'tiktok' | 'reels' | 'short';
  topic: string;
  tone: string;
  length: string;
  language: string;
}

interface StoryCreatorFormProps {
  value: StoryCreatorFormData;
  onChange: (data: StoryCreatorFormData) => void;
  onVariantChange?: (variant: string) => void;
  disabled?: boolean;
}

export function StoryCreatorForm({
  value,
  onChange,
  onVariantChange,
  disabled = false,
}: StoryCreatorFormProps) {
  const t = useTranslations();

  const handleVariantChange = (variant: string) => {
    onChange({ ...value, variant: variant as StoryCreatorFormData['variant'] });
    onVariantChange?.(variant);
  };

  const handleFieldChange = (field: keyof StoryCreatorFormData, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-6">
      {/* Variant Selector - Tabs for 4 variants */}
      <div>
        <Label className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.variant')}
        </Label>
        <Tabs
          value={value.variant}
          onValueChange={handleVariantChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-zinc-800 p-1">
            <TabsTrigger value="general" disabled={disabled}>General</TabsTrigger>
            <TabsTrigger value="tiktok" disabled={disabled}>TikTok</TabsTrigger>
            <TabsTrigger value="reels" disabled={disabled}>Reels</TabsTrigger>
            <TabsTrigger value="short" disabled={disabled}>Short</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Topic Input */}
      <div>
        <Label htmlFor="topic" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.topic')} <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="topic"
          value={value.topic}
          onChange={(e) => handleFieldChange('topic', e.target.value)}
          placeholder={t('forms.placeholder.topic')}
          disabled={disabled}
          className="min-h-[100px] bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Tone Select */}
      <div>
        <Label htmlFor="tone" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.tone')} <span className="text-red-400">*</span>
        </Label>
        <Select
          value={value.tone}
          onValueChange={(val) => handleFieldChange('tone', val)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder={t('forms.placeholder.tone')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            <SelectItem value="informative">Informative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Length Select */}
      <div>
        <Label htmlFor="length" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.length')} <span className="text-red-400">*</span>
        </Label>
        <Select
          value={value.length}
          onValueChange={(val) => handleFieldChange('length', val)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder={t('forms.placeholder.length')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
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
