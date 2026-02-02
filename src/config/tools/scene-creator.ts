import type { ToolConfig } from '@/types/tool';

export const sceneCreatorTool: ToolConfig = {
  id: 'scene-creator',
  name: 'Scene Creator',
  description: 'Convert story text into detailed video scene prompts (3-7 scenes)',
  icon: 'video',
  category: 'content',
  
  defaultModel: 'allenai/molmo-2-8b:free', //vision model supports image/video input
  allowedModels: [
    
    'arcee-ai/trinity-mini:free',
    'openai/gpt-oss-120b:free',
    'deepseek/deepseek-r1-0528:free',
  ],
  
  inputs: [
    {
      id: 'storyText',
      label: 'Story Text',
      type: 'textarea',
      placeholder: 'Paste your story text here...',
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
    maxTokens: 2000,
    temperature: 0.7,
  },
};
