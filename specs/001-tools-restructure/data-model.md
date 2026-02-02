# Data Model: Tools Platform Restructure

**Purpose**: Define entities and their relationships for 6-tool platform restructure  
**Date**: 2026-02-02  
**Input**: Requirements from [spec.md](spec.md) and research from [research.md](research.md)

## Core Entities

### Tool

Represents a content generation tool with configuration and metadata.

**Attributes**:
- `id` (string, required): Unique identifier (kebab-case, e.g., "scene-creator")
- `name` (string, required): Display name (e.g., "Scene Creator")
- `description` (string, required): Brief description for tool listing
- `icon` (string, optional): Lucide icon name for generic tools
- `category` (ToolCategory, required): One of 'content' | 'social' | 'image' | 'productivity' | 'other'
- `defaultModel` (string, required): Default OpenRouter model ID
- `allowedModels` (string[], required): List of compatible model IDs
- `inputs` (ToolInput[], required): Form inputs for user configuration
- `variants` (ToolVariant[], optional): Platform/format-specific versions

**Relationships**:
- Has many ToolInput (form configuration)
- Has many ToolVariant (platform-specific variants)

**Validation Rules**:
- `id` must be unique across all tools
- `id` must match directory name in `src/config/tools/` and `prompts/`
- At least 1 input required
- At least 1 model in `allowedModels`

**State Transitions**: N/A (static configuration)

---

### ToolInput

Represents a form input field for tool configuration.

**Attributes**:
- `id` (string, required): Unique identifier within tool (e.g., "topic", "language")
- `label` (string, required): Display label for form field
- `type` (InputType, required): One of 'text' | 'textarea' | 'select' | 'number' | 'file'
- `placeholder` (string, optional): Placeholder text for input
- `required` (boolean, required): Whether input is mandatory
- `options` (Option[], optional): For 'select' type, array of {value, label}
- `defaultValue` (string | number, optional): Pre-filled value
- `accept` (string, optional): For 'file' type, accepted MIME types (e.g., "image/jpeg,image/png")
- `maxSize` (number, optional): For 'file' type, max file size in bytes

**Relationships**:
- Belongs to Tool

**Validation Rules**:
- If `type` is 'select', `options` must be non-empty array
- If `type` is 'file', `accept` and `maxSize` should be defined
- `id` must be unique within parent Tool
- `id` must match placeholder tokens in system prompts (e.g., `{{topic}}`)

**Examples**:
```typescript
// Text input
{
  id: 'topic',
  label: 'Topic or Theme',
  type: 'textarea',
  placeholder: 'What should the story be about?',
  required: true
}

// Select input
{
  id: 'language',
  label: 'Output Language',
  type: 'select',
  required: true,
  options: [
    { value: 'english', label: 'English' },
    { value: 'russian', label: 'Russian' },
    { value: 'arabic', label: 'Arabic' }
  ]
}

// File input (scene mood describer)
{
  id: 'image',
  label: 'Upload Image',
  type: 'file',
  required: true,
  accept: 'image/jpeg,image/png,image/webp',
  maxSize: 10485760 // 10MB
}
```

---

### ToolVariant

Represents a platform or format-specific version of a tool (e.g., VK post, Instagram story).

**Attributes**:
- `id` (string, required): Unique identifier within tool (e.g., "vk", "facebook", "dzen")
- `name` (string, required): Display name (e.g., "VK Post")
- `description` (string, required): Brief description of variant
- `systemPromptPath` (string, required): Path to markdown system prompt (e.g., "prompts/post/vk/{language}.md")
- `language` (string, optional): Fixed language for variant (if not user-selectable)
- `icon` (string, optional): Simple-icons slug for brand icons (e.g., "vk", "facebook")
- `customIconPath` (string, optional): Path to custom SVG icon (e.g., "/icons/custom/yandex.svg")
- `lucideIcon` (string, optional): Lucide icon name for generic variants (e.g., "book-text", "zap")

**Relationships**:
- Belongs to Tool
- References SystemPrompt (via `systemPromptPath`)

**Validation Rules**:
- Exactly one of `icon`, `customIconPath`, or `lucideIcon` must be defined
- `systemPromptPath` must use {language} placeholder if tool supports multiple languages
- `id` must be unique within parent Tool

**Examples**:
```typescript
// Brand icon variant (VK)
{
  id: 'vk',
  name: 'VK Post',
  description: 'Optimized for VKontakte audience',
  systemPromptPath: 'prompts/post/vk/{language}.md',
  icon: 'vk' // simple-icons
}

// Custom icon variant (Yandex Dzen)
{
  id: 'dzen',
  name: 'Yandex Dzen Article',
  description: 'Long-form content for Dzen',
  systemPromptPath: 'prompts/post/dzen/{language}.md',
  customIconPath: '/icons/custom/yandex.svg'
}

// Lucide icon variant (General story)
{
  id: 'general',
  name: 'General Story',
  description: 'Universal story format',
  systemPromptPath: 'prompts/story/general/{language}.md',
  lucideIcon: 'book-text'
}
```

---

### SystemPrompt

Represents a markdown file containing LLM instructions with placeholder tokens.

**Attributes**:
- `path` (string, required): File system path (e.g., "prompts/story/general/en.md")
- `tool` (string, required): Parent tool ID
- `variant` (string, required): Parent variant ID
- `language` (LanguageCode, required): One of 'en' | 'ru' | 'ar'
- `content` (string, required): Raw markdown content with {{placeholders}}
- `placeholders` (string[], required): List of {{tokens}} to replace (e.g., ["{{topic}}", "{{tone}}"])

**Relationships**:
- Belongs to ToolVariant

**Validation Rules**:
- File must exist at `path`
- All `placeholders` must exist in `content`
- All placeholders in `content` must match ToolInput IDs
- Language-specific content rules:
  - Russian (`ru`): Must include Cyrillic text enforcement
  - Arabic (`ar`): Must include Arabic text enforcement
  - English (`en`): Must include English-only enforcement

**State Transitions**: N/A (static files, loaded at runtime)

**Example**:
```markdown
# Professional Screenwriter

You are an experienced screenwriter...

## Task Parameters
- **Topic**: {{topic}}
- **Tone**: {{tone}}
- **Length**: {{length}}

CRITICAL REQUIREMENTS:
- Write EXCLUSIVELY in {{language}}
...
```

---

### GenerationRequest

Represents a user's content generation request with inputs and configuration.

**Attributes**:
- `id` (string, required): Unique request ID (UUID)
- `toolId` (string, required): Tool being used
- `variantId` (string, optional): Variant being used (if applicable)
- `model` (string, required): OpenRouter model ID
- `inputs` (Record<string, any>, required): User-provided input values (key = ToolInput.id)
- `language` (LanguageCode, optional): User-selected language (if tool supports multiple)
- `timestamp` (Date, required): Request creation time
- `status` (RequestStatus, required): One of 'pending' | 'processing' | 'completed' | 'failed'

**Relationships**:
- References Tool
- References ToolVariant (optional)
- Produces GeneratedContent (1:1)

**Validation Rules**:
- All required inputs must have values
- Input values must match ToolInput types
- If file upload, `inputs.image` must be base64-encoded data URL
- `model` must be in Tool's `allowedModels` array
- If tool supports multiple languages, `language` must be provided

**State Transitions**:
```
pending → processing → completed
pending → processing → failed
```

**Example**:
```typescript
{
  id: '550e8400-e29b-41d4-a716-446655440000',
  toolId: 'story-creator',
  variantId: 'general',
  model: 'arcee-ai/trinity-mini:free',
  inputs: {
    topic: 'lonely robot in space',
    tone: 'emotional',
    length: 'medium'
  },
  language: 'en',
  timestamp: new Date('2026-02-02T10:30:00Z'),
  status: 'pending'
}
```

---

### GeneratedContent

Represents the LLM output for a generation request.

**Attributes**:
- `id` (string, required): Unique content ID (matches GenerationRequest.id)
- `requestId` (string, required): Foreign key to GenerationRequest
- `rawOutput` (string, required): Unprocessed LLM response
- `formattedOutput` (string, optional): Post-processed output (formatting, cleaning)
- `metadata` (ContentMetadata, required): Generation metadata
- `timestamp` (Date, required): Completion time
- `error` (string, optional): Error message if generation failed

**Relationships**:
- Belongs to GenerationRequest (1:1)

**Validation Rules**:
- If GenerationRequest.status is 'completed', `rawOutput` must be non-empty
- If GenerationRequest.status is 'failed', `error` must be defined
- `timestamp` must be >= GenerationRequest.timestamp

**Example**:
```typescript
{
  id: '550e8400-e29b-41d4-a716-446655440000',
  requestId: '550e8400-e29b-41d4-a716-446655440000',
  rawOutput: 'In the cold void of space, Unit-42 sat alone...',
  formattedOutput: '<p>In the cold void of space, Unit-42 sat alone...</p>',
  metadata: {
    model: 'arcee-ai/trinity-mini:free',
    tokensUsed: 852,
    processingTime: 3400, // milliseconds
    systemPromptUsed: 'prompts/story/general/en.md'
  },
  timestamp: new Date('2026-02-02T10:30:04Z'),
  error: null
}
```

---

### ContentMetadata

Embedded metadata for generated content.

**Attributes**:
- `model` (string, required): Model used for generation
- `tokensUsed` (number, required): Total tokens consumed
- `processingTime` (number, required): Generation duration in milliseconds
- `systemPromptUsed` (string, required): Path to system prompt file used
- `temperature` (number, optional): Model temperature setting
- `topP` (number, optional): Model top_p setting
- `maxTokens` (number, optional): Max tokens setting

**Relationships**:
- Embedded in GeneratedContent

---

## Supporting Types

### LanguageCode
```typescript
type LanguageCode = 'en' | 'ru' | 'ar';
```

### InputType
```typescript
type InputType = 'text' | 'textarea' | 'select' | 'number' | 'file';
```

### ToolCategory
```typescript
type ToolCategory = 'content' | 'social' | 'image' | 'productivity' | 'other';
```

### RequestStatus
```typescript
type RequestStatus = 'pending' | 'processing' | 'completed' | 'failed';
```

### Option
```typescript
interface Option {
  value: string;
  label: string;
}
```

---

## Entity Relationships Diagram

```
┌─────────────┐
│    Tool     │
│ (config)    │
└──────┬──────┘
       │
       │ 1:N
       ├───────────────┐
       │               │
       ▼               ▼
┌──────────────┐  ┌────────────────┐
│  ToolInput   │  │  ToolVariant   │
│  (form)      │  │  (platform)    │
└──────────────┘  └────────┬───────┘
                           │
                           │ 1:N
                           ▼
                  ┌─────────────────┐
                  │  SystemPrompt   │
                  │  (markdown)     │
                  └─────────────────┘

┌──────────────────────┐
│  GenerationRequest   │
│  (user input)        │
└──────────┬───────────┘
           │
           │ 1:1
           ▼
┌──────────────────────┐
│  GeneratedContent    │
│  (LLM output)        │
│  ├─ ContentMetadata  │
└──────────────────────┘
```

---

## 6 Tools Data Model

### 1. Story Creator (Keep/Enhance)
- **Tool**: story-creator
- **Variants**: general, instagram, tiktok
- **Inputs**: topic (textarea), language (select: en/ru/ar), tone (select: 8 options), length (select: short/medium/long)
- **System Prompts**: 9 files (3 variants × 3 languages)

### 2. Post Creator (Rename from social-media-post)
- **Tool**: post-creator
- **Variants**: vk, facebook, dzen
- **Inputs**: topic (textarea), language (select: en/ru/ar), tone (select)
- **System Prompts**: 9 files (3 variants × 3 languages)

### 3. Scene Creator (NEW)
- **Tool**: scene-creator
- **Variants**: general (single variant)
- **Inputs**: storyText (textarea), language (select: en/ru/ar)
- **System Prompts**: 3 files (1 variant × 3 languages)

### 4. Quote Generator (NEW)
- **Tool**: quote-generator
- **Variants**: motivation, wisdom, life, love, success, happiness, strength, creativity (8 theme variants)
- **Inputs**: language (select: en/ru/ar), quantity (number: 5-20)
- **System Prompts**: 24 files (8 variants × 3 languages)

### 5. Reels Creator (NEW)
- **Tool**: reels-creator
- **Variants**: general (single variant)
- **Inputs**: topic (textarea), language (select: en/ru/ar)
- **System Prompts**: 3 files (1 variant × 3 languages)

### 6. Scene Mood Describer (NEW)
- **Tool**: scene-mood-describer
- **Variants**: general (single variant)
- **Inputs**: image (file: JPEG/PNG/WebP, max 10MB)
- **System Prompts**: 1 file (English only - vision models handle multilingual)

**Total System Prompts**: 49 markdown files (existing story-creator prompts can be reused/enhanced)

---

## Validation Summary

All entities follow constitution principles:
- ✅ **Tool Modularity**: Each Tool is self-contained with own config/prompts
- ✅ **System Prompt Excellence**: SystemPrompt entity enforces file-based prompts with placeholders
- ✅ **Type Safety**: All entities have explicit TypeScript interfaces defined
- ✅ **Modern Best Practices**: File-based system, Next.js 16 Server Components compatible
- ✅ **User Experience First**: ToolInput supports all required field types including file upload
