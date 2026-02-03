/**
 * Scene Creator Form Component
 * 
 * Form inputs for Scene Creator tool with 3 variants and image upload
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

export interface SceneCreatorFormData {
  variant: 'general' | 'detailed' | 'cinematic';
  image: { type: string; size: number; data: string } | null;
  description?: string;
  language: string;
}

interface SceneCreatorFormProps {
  value: SceneCreatorFormData;
  onChange: (data: SceneCreatorFormData) => void;
  onVariantChange?: (variant: string) => void;
  disabled?: boolean;
}

export function SceneCreatorForm({
  value,
  onChange,
  onVariantChange,
  disabled = false,
}: SceneCreatorFormProps) {
  const t = useTranslations();

  const handleVariantChange = (variant: string) => {
    onChange({ ...value, variant: variant as SceneCreatorFormData['variant'] });
    onVariantChange?.(variant);
  };

  const handleFieldChange = (field: keyof SceneCreatorFormData, fieldValue: string | File | { type: string; size: number; data: string } | null) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert(t('errors.fileType'));
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(t('errors.fileSize'));
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = {
        type: file.type,
        size: file.size,
        data: reader.result as string,
      };
      handleFieldChange('image', imageData);
    };
    reader.readAsDataURL(file);
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
            <TabsTrigger value="general" disabled={disabled}>General</TabsTrigger>
            <TabsTrigger value="detailed" disabled={disabled}>Detailed</TabsTrigger>
            <TabsTrigger value="cinematic" disabled={disabled}>Cinematic</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Image Upload */}
      <div>
        <Label htmlFor="image" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.image')} <span className="text-red-400">*</span>
        </Label>
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageUpload}
          disabled={disabled}
          className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent-brand)] file:text-black hover:file:brightness-110 file:cursor-pointer cursor-pointer bg-zinc-800 border border-zinc-700 rounded-xl p-2"
        />
        {value.image && (
          <p className="text-xs text-neutral-400 mt-2">
            {(value.image.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      {/* Description (Optional) */}
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.description')} ({t('forms.optional')})
        </Label>
        <Textarea
          id="description"
          value={value.description || ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder={t('forms.placeholder.description')}
          disabled={disabled}
          className="min-h-[80px] bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
        />
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
