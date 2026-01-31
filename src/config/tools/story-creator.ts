import type { ToolConfig } from '@/types/tool';

export const storyCreatorTool: ToolConfig = {
  id: 'story-creator',
  name: 'Story Creator',
  description: 'Generate engaging stories for social media, reels, or general content',
  icon: 'book-open',
  category: 'content',
  
  defaultModel: 'anthropic/claude-3-haiku',
  allowedModels: [
    'anthropic/claude-3-haiku',
    'anthropic/claude-3-sonnet',
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4o-mini',
    'google/gemini-flash-1.5',
  ],
  
  inputs: [
    {
      id: 'topic',
      label: 'Topic or Theme',
      type: 'textarea',
      placeholder: 'What should the story be about?',
      required: true,
    },
    {
      id: 'tone',
      label: 'Tone',
      type: 'select',
      required: true,
      options: [
        { value: 'engaging', label: 'Engaging' },
        { value: 'emotional', label: 'Emotional' },
        { value: 'funny', label: 'Funny' },
        { value: 'inspiring', label: 'Inspiring' },
        { value: 'dramatic', label: 'Dramatic' },
      ],
    },
    {
      id: 'length',
      label: 'Length',
      type: 'select',
      required: true,
      options: [
        { value: 'short', label: 'Short (30-60 sec read)' },
        { value: 'medium', label: 'Medium (1-2 min read)' },
        { value: 'long', label: 'Long (3-5 min read)' },
      ],
    },
  ],
  
  variants: [
    {
      id: 'reels',
      name: 'Instagram Reels',
      description: 'Hook-driven stories for short video content',
      systemPromptPath: 'story/reels.md',
    },
    {
      id: 'tiktok',
      name: 'TikTok Story',
      description: 'Viral-style storytelling for TikTok',
      systemPromptPath: 'story/tiktok.md',
    },
    {
      id: 'general',
      name: 'General Story',
      description: 'Classic storytelling format',
      systemPromptPath: 'story/general.md',
    },
    {
      id: 'short-form',
      name: 'Short Form Content',
      description: 'Quick, impactful stories',
      systemPromptPath: 'story/short-form.md',
    },
  ],
  
  settings: {
    maxTokens: 1500,
    temperature: 0.8,
  },
};
