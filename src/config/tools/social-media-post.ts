import type { ToolConfig } from '@/types/tool';

export const socialMediaPostTool: ToolConfig = {
  id: 'social-media-post',
  name: 'Social Media Post Generator',
  description: 'Create platform-specific social media posts optimized for engagement',
  icon: 'share-2',
  category: 'social',
  
  defaultModel: 'arcee-ai/trinity-large-preview:free',
  allowedModels: [
    'arcee-ai/trinity-mini:free',
    'openai/gpt-oss-120b:free',
    'deepseek/deepseek-r1-0528:free',
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
      icon: 'vk',
    },
    {
      id: 'dzen',
      name: 'Yandex Dzen',
      description: 'Content for Yandex Dzen platform',
      systemPromptPath: 'social/dzen.md',
      language: 'ru',
      customIconPath: '/icons/yandex.svg',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Facebook-optimized posts',
      systemPromptPath: 'social/facebook.md',
      icon: 'facebook',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Instagram caption format',
      systemPromptPath: 'social/instagram.md',
      icon: 'instagram',
    },
    {
      id: 'general',
      name: 'General Social',
      description: 'Universal social media post',
      systemPromptPath: 'social/general.md',
      icon: 'share',
    },
  ],
  
  settings: {
    maxTokens: 800,
    temperature: 0.7,
  },
};
