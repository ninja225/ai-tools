'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  id: string;
  label: string;
  accept?: string;
  maxSize?: number;
  required?: boolean;
  onChange: (file: File | null) => void;
}

export function ImageUpload({
  id,
  label,
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 10 * 1024 * 1024, // 10MB default
  required = false,
  onChange,
}: ImageUploadProps) {
  const t = useTranslations('tools.imageUpload');
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      setError(t('errors.tooLarge', { maxSize: maxSizeMB }));
      setPreview(null);
      onChange(null);
      return;
    }

    // Validate file type
    const acceptedTypes = accept.split(',').map(t => t.trim());
    if (!acceptedTypes.includes(file.type)) {
      setError(t('errors.invalidType'));
      setPreview(null);
      onChange(null);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {!preview ? (
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            id={id}
            name={id}
            accept={accept}
            required={required}
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor={id}
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <span className="text-sm text-gray-400">
              {t('clickToUpload')}
            </span>
            <span className="text-xs text-gray-500">
              {t('supportedFormats', {
                formats: accept.replace(/image\//g, '').toUpperCase(),
                maxSize: Math.round(maxSize / (1024 * 1024)),
              })}
            </span>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-contain rounded-lg border border-gray-600"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleClear}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
