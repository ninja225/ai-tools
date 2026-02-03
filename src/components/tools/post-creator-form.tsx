/**
 * Post Creator Form Component
 * 
 * Form inputs for Post Creator tool with platform selection (NO variants)
 */

'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface PostCreatorFormData {
  platform: 'vk' | 'facebook' | 'dzen';
  topic: string;
  tone: string;
  language: string;
}

interface PostCreatorFormProps {
  value: PostCreatorFormData;
  onChange: (data: PostCreatorFormData) => void;
  disabled?: boolean;
}

export function PostCreatorForm({
  value,
  onChange,
  disabled = false,
}: PostCreatorFormProps) {
  const t = useTranslations();

  const handleFieldChange = (field: keyof PostCreatorFormData, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-6">
      {/* Platform Select - NO variant selector, uses platform field */}
      <div>
        <Label htmlFor="platform" className="text-sm font-medium text-white mb-2 block">
          {t('forms.labels.platform')} <span className="text-red-400">*</span>
        </Label>
        <Select
          value={value.platform}
          onValueChange={(val) => handleFieldChange('platform', val)}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder={t('forms.placeholder.platform')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vk">VK</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="dzen">Dzen</SelectItem>
          </SelectContent>
        </Select>
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
