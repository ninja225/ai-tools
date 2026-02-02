import type { ToolConfig } from '@/types/tool';

export const storyCreatorTool: ToolConfig = {
  id: 'story-creator',
  name: 'Story Creator',
  description: 'Generate engaging stories for social media, reels, or general content',
  icon: 'book-open',
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
      label: 'Topic or Theme',
      type: 'textarea',
      placeholder: 'What should the story be about?',
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
        { value: 'engaging', label: 'Engaging' },
        { value: 'emotional', label: 'Emotional' },
        { value: 'funny', label: 'Funny' },
        { value: 'dramatic', label: 'Dramatic' },
        { value: 'sad', label: 'Sad' },
        { value: 'hopeful', label: 'Hopeful' },
        { value: 'motivational', label: 'Motivational' },
        { value: 'fantasy', label: 'Fantasy' },

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
      icon: 'instagram',
    },
    {
      id: 'tiktok',
      name: 'TikTok Story',
      description: 'Viral-style storytelling for TikTok',
      systemPromptPath: 'story/tiktok.md',
      icon: 'tiktok',
    },
    {
      id: 'general',
      name: 'General Story',
      description: 'Classic storytelling format',
      systemPromptPath: 'story/general.md',
      lucideIcon: 'book-text',
    },
    // {
    //   id: 'short-form',
    //   name: 'Short Form Content',
    //   description: 'Quick, impactful stories',
    //   systemPromptPath: 'story/short-form.md',
    //   lucideIcon: 'zap',
    // },
  ],
  
  settings: {
    maxTokens: 1500,
    temperature: 0.8,
  },
};
