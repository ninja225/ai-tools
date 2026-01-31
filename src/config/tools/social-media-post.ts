import type { ToolConfig } from '@/types/tool';

export const socialMediaPostTool: ToolConfig = {
  id: 'social-media-post',
  name: 'Social Media Post Generator',
  description: 'Create platform-specific social media posts optimized for engagement',
  icon: 'share-2',
  category: 'social',
  
  defaultModel: 'anthropic/claude-3-haiku',
  allowedModels: [
    'anthropic/claude-3-haiku',
    'anthropic/claude-3-sonnet',
    'openai/gpt-4o-mini',
    'google/gemini-flash-1.5',
  ],
  
  inputs: [
    {
      id: 'topic',
      label: 'Topic or Message',
      type: 'textarea',
      placeholder: 'What do you want to post about?',
      required: true,
    },
    {
      id: 'cta',
      label: 'Call to Action',
      type: 'select',
      required: false,
      options: [
        { value: 'none', label: 'None' },
        { value: 'like', label: 'Like & Share' },
        { value: 'comment', label: 'Comment' },
        { value: 'visit', label: 'Visit Link' },
        { value: 'follow', label: 'Follow' },
      ],
    },
    {
      id: 'hashtagCount',
      label: 'Number of Hashtags',
      type: 'number',
      placeholder: '3-5',
      required: false,
    },
  ],
  
  variants: [
    {
      id: 'vk',
      name: 'VKontakte',
      description: 'Posts optimized for VK audience',
      systemPromptPath: 'social/vk.md',
      language: 'ru',
    },
    {
      id: 'dzen',
      name: 'Yandex Dzen',
      description: 'Content for Yandex Dzen platform',
      systemPromptPath: 'social/dzen.md',
      language: 'ru',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Facebook-optimized posts',
      systemPromptPath: 'social/facebook.md',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Instagram caption format',
      systemPromptPath: 'social/instagram.md',
    },
    {
      id: 'general',
      name: 'General Social',
      description: 'Universal social media post',
      systemPromptPath: 'social/general.md',
    },
  ],
  
  settings: {
    maxTokens: 800,
    temperature: 0.7,
  },
};
