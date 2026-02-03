/**
 * Reels Creator Form Component
 * 
 * Form inputs for Reels Creator tool with 3 variants
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

export interface ReelsCreatorFormData {
  variant: 'trending' | 'educational' | 'entertainment';
  topic: string;
  duration: string;
  style: string;
  language: string;
}

interface ReelsCreatorFormProps {
  value: ReelsCreatorFormData;
  onChange: (data: ReelsCreatorFormData) => void;
  onVariantChange?: (variant: string) => void;
  disabled?: boolean;
}

export function ReelsCreatorForm({
  value,
  onChange,
  onVariantChange,
  disabled = false,
}: ReelsCreatorFormProps) {
  const t = useTranslations();

  const handleVariantChange = (variant: string) => {
    onChange({ ...value, variant: variant as ReelsCreatorFormData['variant'] });
    onVariantChange?.(variant);
  };

  const handleFieldChange = (field: keyof ReelsCreatorFormData, fieldValue: string) => {
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
            <TabsTrigger value="trending" disabled={disabled}>Trending</TabsTrigger>
            <TabsTrigger value="educational" disabled={disabled}>Educational</TabsTrigger>
            <TabsTrigger value="entertainment" disabled={disabled}>Entertainment</TabsTrigger>
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

      {/* Duration Select */}
      <div>
        <Label htmlFor="duration" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.duration')} <span className="text-red-400">*</span>
        </Label>
        <Select
          value={value.duration}
          onValueChange={(val) => handleFieldChange('duration', val)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder={t('forms.placeholder.duration')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15s">15 seconds</SelectItem>
            <SelectItem value="30s">30 seconds</SelectItem>
            <SelectItem value="60s">60 seconds</SelectItem>
            <SelectItem value="90s">90 seconds</SelectItem>
          </SelectContent>
        </Select>
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
            <SelectItem value="fast-paced">Fast-paced</SelectItem>
            <SelectItem value="slow-burn">Slow-burn</SelectItem>
            <SelectItem value="dynamic">Dynamic</SelectItem>
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
