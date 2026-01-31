import type { ToolConfig } from '@/types/tool';

export const imagePromptTool: ToolConfig = {
  id: 'image-prompt',
  name: 'Image Prompt Generator',
  description: 'Create detailed prompts for AI image generators like Midjourney and DALL-E',
  icon: 'image',
  category: 'image',
  
  defaultModel: 'anthropic/claude-3-haiku',
  allowedModels: [
    'anthropic/claude-3-haiku',
    'anthropic/claude-3-sonnet',
    'openai/gpt-4o-mini',
  ],
  
  inputs: [
    {
      id: 'subject',
      label: 'Subject',
      type: 'textarea',
      placeholder: 'What should be in the image?',
      required: true,
    },
    {
      id: 'style',
      label: 'Style',
      type: 'select',
      required: true,
      options: [
        { value: 'realistic', label: 'Realistic' },
        { value: 'artistic', label: 'Artistic' },
        { value: 'anime', label: 'Anime' },
        { value: 'cartoon', label: 'Cartoon' },
        { value: 'cinematic', label: 'Cinematic' },
        { value: 'minimalist', label: 'Minimalist' },
      ],
    },
    {
      id: 'mood',
      label: 'Mood',
      type: 'select',
      required: false,
      options: [
        { value: 'bright', label: 'Bright & Cheerful' },
        { value: 'dark', label: 'Dark & Moody' },
        { value: 'dramatic', label: 'Dramatic' },
        { value: 'calm', label: 'Calm & Peaceful' },
        { value: 'energetic', label: 'Energetic' },
      ],
    },
    {
      id: 'aspectRatio',
      label: 'Aspect Ratio',
      type: 'select',
      required: false,
      options: [
        { value: '1:1', label: 'Square (1:1)' },
        { value: '16:9', label: 'Landscape (16:9)' },
        { value: '9:16', label: 'Portrait (9:16)' },
        { value: '4:3', label: 'Classic (4:3)' },
      ],
    },
  ],
  
  variants: [
    {
      id: 'midjourney',
      name: 'Midjourney Style',
      description: 'Prompts optimized for Midjourney',
      systemPromptPath: 'image/midjourney-style.md',
    },
    {
      id: 'dalle',
      name: 'DALL-E Style',
      description: 'Prompts optimized for DALL-E',
      systemPromptPath: 'image/dalle-style.md',
    },
  ],
  
  settings: {
    maxTokens: 500,
    temperature: 0.6,
  },
};
