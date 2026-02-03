import type { ToolConfig } from '@/types/tool';

export const sceneMoodDescriberTool: ToolConfig = {
  id: 'scene-mood-describer',
  name: 'Scene Mood Describer',
  description: 'Upload an image and get detailed AI regeneration prompts with mood, lighting, and composition analysis',
  icon: 'image',
  category: 'analysis',
  
  defaultModel: 'google/gemini-2.0-flash-exp:free',
  allowedModels: [
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.2-90b-vision-instruct:free',
  ],
  
  inputs: [
    {
      id: 'image',
      label: 'Upload Image',
      type: 'file',
      accept: 'image/jpeg,image/png,image/webp',
      maxSize: 10485760, // 10MB in bytes
      required: true,
    },
    {
      id: 'language',
      label: 'Output Language',
      type: 'select',
      required: true,
      options: [
        { value: 'english', label: 'English' },
        { value: 'russian', label: 'Russian' },
        { value: 'arabic', label: 'Arabic' },
      ],
    },
  ],
  
  variants: [
    {
      id: 'scene-mood-describer',
      name: 'Scene Mood Analysis',
      description: 'Analyze the mood and atmosphere of images',
      systemPromptPath: '/prompts/scene-mood/{lang}.md',
    },
  ],
  
  settings: {
    maxTokens: 1500,
    temperature: 0.6,
  },
};
