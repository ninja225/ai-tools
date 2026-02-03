import type { ToolConfig } from '@/types/tool';

export const quoteGeneratorTool: ToolConfig = {
  id: 'quote-generator',
  name: 'Quote Generator',
  description: 'Generate fresh, non-clichéd quotes under 100 characters for 8 themes',
  icon: 'quote',
  category: 'content',
  
  defaultModel: 'arcee-ai/trinity-large-preview:free',
  allowedModels: [
    'arcee-ai/trinity-large-preview:free',
    'arcee-ai/trinity-mini:free',
    'openai/gpt-oss-120b:free',
    'deepseek/deepseek-r1-0528:free',
  ],
  
  inputs: [
    {
      id: 'theme',
      label: 'Theme',
      type: 'select',
      required: true,
      options: [
        { value: 'motivation', label: 'Motivation' },
        { value: 'wisdom', label: 'Wisdom' },
        { value: 'life', label: 'Life' },
        { value: 'love', label: 'Love' },
        { value: 'success', label: 'Success' },
        { value: 'happiness', label: 'Happiness' },
        { value: 'strength', label: 'Strength' },
        { value: 'creativity', label: 'Creativity' },
      ],
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
      id: 'quantity',
      label: 'Number of Quotes',
      type: 'number',
      placeholder: '5-20',
      required: true,
      defaultValue: 10,
    },
  ],
  
  variants: [
    {
      id: 'quote-generator',
      name: 'Quote Generator',
      description: 'Generate inspiring and engaging quotes',
      systemPromptPath: '/prompts/quote/{lang}.md',
    },
  ],
  
  settings: {
    maxTokens: 1000,
    temperature: 0.9,
  },
};
