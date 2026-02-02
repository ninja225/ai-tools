import type { ToolConfig } from '@/types/tool';

export const reelsCreatorTool: ToolConfig = {
  id: 'reels-creator',
  name: 'Reels Creator',
  description: 'Generate complete reels package: concept + script + video scene prompts',
  icon: 'video',
  category: 'content',
  
  defaultModel: 'arcee-ai/trinity-large-preview:free',
  allowedModels: [
    'arcee-ai/trinity-mini:free',
    'openai/gpt-oss-120b:free',
    'deepseek/deepseek-r1-0528:free',
  ],
  
  inputs: [
    {
      id: 'topic',
      label: 'Topic',
      type: 'text',
      placeholder: 'What is your reel about?',
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
  
  variants: [],
  
  settings: {
    maxTokens: 3000,
    temperature: 0.8,
  },
};
