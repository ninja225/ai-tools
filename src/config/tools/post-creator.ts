import type { ToolConfig } from '@/types/tool';

export const postCreatorTool: ToolConfig = {
  id: 'post-creator',
  name: 'Post Creator',
  description: 'Create platform-specific posts optimized for VK, Facebook, and Dzen',
  icon: 'share-2',
  category: 'social',
  
  defaultModel: 'arcee-ai/trinity-large-preview:free',
  allowedModels: [
    'arcee-ai/trinity-large-preview:free',
    'arcee-ai/trinity-mini:free',
    'openai/gpt-oss-120b:free',
    'deepseek/deepseek-r1-0528:free',
  ],
  
  inputs: [
    {
      id: 'platform',
      label: 'Platform',
      type: 'select',
      required: true,
      options: [
        { value: 'vk', label: 'VK Post (700-900 chars)' },
        { value: 'facebook', label: 'Facebook (40-80 chars)' },
        { value: 'dzen', label: 'Yandex Dzen Article (2000-2500 chars)' },
      ],
    },
    {
      id: 'topic',
      label: 'Topic or Message',
      type: 'textarea',
      placeholder: 'What do you want to post about?',
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
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      required: true,
      options: [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'enthusiastic', label: 'Enthusiastic' },
        { value: 'informative', label: 'Informative' },
      ],
    },
  ],
  
  variants: [
    {
      id: 'post-creator',
      name: 'Social Media Post',
      description: 'Create engaging social media posts',
      systemPromptPath: '/prompts/post/{lang}.md',
    },
  ],
  
  settings: {
    maxTokens: 1200,
    temperature: 0.7,
  },
};
