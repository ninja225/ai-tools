import { z } from 'zod';

/**
 * Client-side validation schemas for tool inputs
 * 
 * These schemas validate user inputs before sending to the server,
 * providing immediate feedback and reducing invalid server requests.
 */

// Common validation rules
const MIN_TEXT_LENGTH = 3;
const MIN_TEXTAREA_LENGTH = 10;
const MAX_TEXT_LENGTH = 500;
const MAX_TEXTAREA_LENGTH = 5000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Text input validation
export const textInputSchema = z
  .string()
  .min(MIN_TEXT_LENGTH, `Must be at least ${MIN_TEXT_LENGTH} characters`)
  .max(MAX_TEXT_LENGTH, `Must be less than ${MAX_TEXT_LENGTH} characters`)
  .trim();

// Textarea validation
export const textareaSchema = z
  .string()
  .min(MIN_TEXTAREA_LENGTH, `Must be at least ${MIN_TEXTAREA_LENGTH} characters`)
  .max(MAX_TEXTAREA_LENGTH, `Must be less than ${MAX_TEXTAREA_LENGTH} characters`)
  .trim();

// Optional text fields
export const optionalTextSchema = z
  .string()
  .max(MAX_TEXT_LENGTH, `Must be less than ${MAX_TEXT_LENGTH} characters`)
  .trim()
  .optional();

// File upload validation
export const imageFileSchema = z.object({
  type: z.string().refine(
    (type) => ALLOWED_IMAGE_TYPES.includes(type),
    'File must be JPEG, PNG, WebP, or GIF'
  ),
  size: z.number().refine(
    (size) => size <= MAX_FILE_SIZE,
    `File size must be less than 10MB`
  ),
  data: z.string().refine(
    (data) => data.startsWith('data:image/'),
    'Data must be a valid base64 image data URL'
  ),
});

// Story Creator validation
export const storyCreatorSchema = z.object({
  variant: z.enum(['general', 'tiktok', 'reels', 'short'], {
    message: 'Please select a story variant',
  }),
  topic: textInputSchema,
  tone: z.enum(['professional', 'casual', 'friendly', 'enthusiastic', 'informative'], {
    message: 'Please select a tone',
  }),
  length: z.enum(['short', 'medium', 'long'], {
    message: 'Please select a length',
  }),
  language: z.enum(['english', 'russian', 'arabic'], {
    message: 'Please select output language',
  }),
});

// Post Creator validation
export const postCreatorSchema = z.object({
  platform: z.enum(['vk', 'facebook', 'dzen'], {
    message: 'Please select a platform',
  }),
  topic: textareaSchema,
  tone: z.enum(['professional', 'casual', 'friendly', 'enthusiastic', 'informative'], {
    message: 'Please select a tone',
  }),
  language: z.enum(['english', 'russian', 'arabic'], {
    message: 'Please select output language',
  }),
});

// Scene Creator validation
export const sceneCreatorSchema = z.object({
  variant: z.enum(['general', 'detailed', 'cinematic'], {
    message: 'Please select a scene variant',
  }),
  image: imageFileSchema,
  description: textareaSchema.optional(),
  language: z.enum(['english', 'russian', 'arabic'], {
    message: 'Please select output language',
  }),
});

// Quote Generator validation
export const quoteGeneratorSchema = z.object({
  variant: z.enum(['inspirational', 'philosophical', 'humorous'], {
    message: 'Please select a quote variant',
  }),
  topic: textInputSchema,
  style: z.enum(['modern', 'classic', 'minimalist'], {
    message: 'Please select a style',
  }),
  mood: z.enum(['uplifting', 'thoughtful', 'bold', 'calm'], {
    message: 'Please select a mood',
  }),
  language: z.enum(['english', 'russian', 'arabic'], {
    message: 'Please select output language',
  }),
});

// Reels Creator validation
export const reelsCreatorSchema = z.object({
  variant: z.enum(['trending', 'educational', 'entertainment'], {
    message: 'Please select a reels variant',
  }),
  topic: textInputSchema,
  duration: z.enum(['15s', '30s', '60s', '90s'], {
    message: 'Please select duration',
  }),
  style: z.enum(['fast-paced', 'slow-burn', 'dynamic'], {
    message: 'Please select a style',
  }),
  language: z.enum(['english', 'russian', 'arabic'], {
    message: 'Please select output language',
  }),
});

// Scene Mood Describer validation
export const sceneMoodDescriberSchema = z.object({
  variant: z.enum(['basic', 'detailed'], {
    message: 'Please select analysis depth',
  }),
  image: imageFileSchema,
  analysisDepth: z.enum(['quick', 'comprehensive'], {
    message: 'Please select analysis depth',
  }),
  language: z.enum(['english', 'russian', 'arabic'], {
    message: 'Please select output language',
  }),
});

// API parameters validation
export const apiParametersSchema = z.object({
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  topP: z.number().min(0).max(1).optional(),
});

// Export type inference helpers
export type StoryCreatorInput = z.infer<typeof storyCreatorSchema>;
export type PostCreatorInput = z.infer<typeof postCreatorSchema>;
export type SceneCreatorInput = z.infer<typeof sceneCreatorSchema>;
export type QuoteGeneratorInput = z.infer<typeof quoteGeneratorSchema>;
export type ReelsCreatorInput = z.infer<typeof reelsCreatorSchema>;
export type SceneMoodDescriberInput = z.infer<typeof sceneMoodDescriberSchema>;
export type ApiParameters = z.infer<typeof apiParametersSchema>;
