# 🤖 AI Tools Platform - Project Plan

> Personal AI tools collection for content creation across multiple platforms

## 📋 Overview

A modular AI-powered content creation platform built with Next.js, designed to leverage multiple LLM models via OpenRouter. Each tool operates independently with its own system instructions, model configurations, and output formats.

---

## 🎯 Project Goals

### Phase 1: MVP (Current)
- [x] Core architecture setup
- [x] OpenRouter integration
- [x] 2-3 initial tools (Story Creator, Social Media Post Generator)
- [ ] Simple UI for tool selection and content generation
- [ ] Deploy to Netlify for testing

### Phase 2: Enhancement
- [ ] Add more tools
- [ ] Template/prompt library
- [ ] History/saved generations
- [ ] Export options (copy, download)

### Phase 3: Production Ready
- [ ] Authentication (NextAuth/Clerk)
- [ ] Rate limiting
- [ ] Queue system for heavy operations
- [ ] Usage analytics
- [ ] Database integration

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  Next.js App Router + React + TailwindCSS + shadcn/ui       │
├─────────────────────────────────────────────────────────────┤
│                        API Layer                             │
│  Next.js API Routes (Route Handlers)                        │
├─────────────────────────────────────────────────────────────┤
│                     Services Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ OpenRouter   │  │   Tools      │  │   Prompts    │      │
│  │   Service    │  │   Registry   │  │   Manager    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                    Configuration                             │
│  Tools Config │ Models Config │ System Instructions         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ai-tools/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Dashboard/Home
│   │   ├── tools/
│   │   │   ├── page.tsx              # Tools listing
│   │   │   └── [toolId]/
│   │   │       └── page.tsx          # Individual tool page
│   │   └── api/
│   │       ├── generate/
│   │       │   └── route.ts          # Main generation endpoint
│   │       └── tools/
│   │           └── route.ts          # Get available tools
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   ├── tools/
│   │   │   ├── tool-card.tsx
│   │   │   ├── tool-form.tsx
│   │   │   └── tool-output.tsx
│   │   └── common/
│   │       ├── loading.tsx
│   │       └── error-boundary.tsx
│   │
│   ├── lib/
│   │   ├── openrouter/
│   │   │   ├── client.ts             # OpenRouter API client
│   │   │   ├── models.ts             # Available models config
│   │   │   └── types.ts
│   │   ├── tools/
│   │   │   ├── registry.ts           # Tool registration system
│   │   │   ├── types.ts              # Tool type definitions
│   │   │   └── executor.ts           # Tool execution logic
│   │   └── utils/
│   │       ├── cn.ts                 # classnames utility
│   │       └── format.ts
│   │
│   ├── config/
│   │   ├── tools/                    # Tool configurations
│   │   │   ├── index.ts              # Export all tools
│   │   │   ├── story-creator.ts
│   │   │   ├── social-media-post.ts
│   │   │   ├── image-prompt.ts
│   │   │   └── ...
│   │   ├── models.ts                 # OpenRouter models config
│   │   └── site.ts                   # Site configuration
│   │
│   ├── prompts/                      # System instructions
│   │   ├── story/
│   │   │   ├── reels.md
│   │   │   ├── short-form.md
│   │   │   └── long-form.md
│   │   ├── social/
│   │   │   ├── vk.md
│   │   │   ├── dzen.md
│   │   │   ├── facebook.md
│   │   │   └── general.md
│   │   └── image/
│   │       ├── midjourney-style.md
│   │       └── dalle-style.md
│   │
│   ├── hooks/
│   │   ├── use-generation.ts         # Generation hook
│   │   ├── use-tools.ts              # Tools fetching
│   │   └── use-copy.ts               # Copy to clipboard
│   │
│   └── types/
│       ├── tool.ts
│       ├── generation.ts
│       └── api.ts
│
├── public/
│   └── icons/                        # Tool icons
│
├── .env.local                        # Environment variables
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| AI API | OpenRouter |
| State | React hooks + Context (simple) |
| Deployment | Netlify |
| Package Manager | pnpm |

---

## 🔧 Tool Configuration System

Each tool is defined by a configuration object:

```typescript
// src/lib/tools/types.ts
interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  
  // Model configuration
  defaultModel: string;
  allowedModels?: string[];
  
  // Input configuration
  inputs: ToolInput[];
  
  // Variants (different system instructions)
  variants: ToolVariant[];
  
  // Generation settings
  settings: {
    maxTokens: number;
    temperature: number;
    topP?: number;
  };
}

interface ToolVariant {
  id: string;
  name: string;
  description: string;
  systemPromptPath: string;  // Path to .md file
  language?: string;
}

interface ToolInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
}
```

### Example Tool Configuration

```typescript
// src/config/tools/story-creator.ts
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
      id: 'russian',
      name: 'Russian Story',
      description: 'Stories optimized for Russian audience',
      systemPromptPath: 'story/russian.md',
      language: 'ru',
    },
  ],
  
  settings: {
    maxTokens: 1500,
    temperature: 0.8,
  },
};
```

---

## 📱 Initial Tools (MVP)

### 1. Story Creator
- **Purpose**: Generate engaging stories
- **Variants**: Reels, TikTok, General, Language-specific
- **Inputs**: Topic, tone, length, target audience

### 2. Social Media Post Generator
- **Purpose**: Create platform-specific posts
- **Variants**: VK, Dzen, Facebook, Instagram, Twitter/X
- **Inputs**: Topic, platform, hashtag count, CTA type

### 3. Image Prompt Generator
- **Purpose**: Create prompts for AI image generators
- **Variants**: Midjourney style, DALL-E style, Stable Diffusion
- **Inputs**: Subject, style, mood, aspect ratio

### 4. Content Repurposer (Future)
- **Purpose**: Convert content between formats
- **Variants**: Blog → Thread, Video → Post, etc.

---

## 🔌 OpenRouter Integration

```typescript
// src/lib/openrouter/client.ts
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const createCompletion = async (params: {
  model: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens: number;
  temperature: number;
}): Promise<string> => {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL,
      'X-Title': 'AI Tools',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model,
      messages: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userMessage },
      ],
      max_tokens: params.maxTokens,
      temperature: params.temperature,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content;
};
```

---

## 🌐 API Routes

### POST /api/generate
Main generation endpoint

```typescript
// Request
{
  toolId: string;
  variantId: string;
  modelId?: string;        // Optional, uses default if not provided
  inputs: Record<string, string>;
}

// Response
{
  success: boolean;
  content: string;
  model: string;
  tokensUsed: number;
}
```

### GET /api/tools
Get all available tools

```typescript
// Response
{
  tools: ToolConfig[];
}
```

---

## 🎨 UI/UX Design

### Pages

1. **Home/Dashboard**
   - Quick access to recent tools
   - Tool categories grid
   - Quick generation shortcuts

2. **Tools List**
   - Categorized tool cards
   - Search/filter functionality

3. **Tool Page**
   - Input form on left
   - Output/preview on right
   - Variant selector
   - Model selector (collapsible/advanced)
   - Copy/export buttons

### Design Principles
- Clean, minimal interface
- Dark mode by default (with toggle)
- Responsive design
- Keyboard shortcuts for power users

---

## 🚀 Deployment (Netlify)

### Environment Variables
```env
OPENROUTER_API_KEY=sk-or-...
NEXT_PUBLIC_SITE_URL=https://your-app.netlify.app
```

### Build Settings
```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 📅 Development Phases

### Week 1: Foundation
- [x] Create project plan
- [x] Initialize Next.js project with TypeScript
- [x] Set up TailwindCSS + shadcn/ui
- [x] Create project structure
- [x] Implement OpenRouter client

### Week 2: Core Features
- [ ] Build tool configuration system
- [ ] Create tool registry
- [ ] Implement first tool (Story Creator)
- [ ] Build basic UI components

### Week 3: Polish & Deploy
- [ ] Add 2-3 more tools
- [ ] Build responsive layouts
- [ ] Add loading states & error handling
- [ ] Deploy to Netlify
- [ ] Test & iterate

---

## 🔮 Future Enhancements (Phase 2-3)

### Authentication
- NextAuth.js or Clerk
- Social login (Google, GitHub)
- Usage tracking per user

### Database
- Supabase or PlanetScale
- Save generation history
- User preferences
- Prompt templates

### Advanced Features
- Streaming responses
- Queue system (Upstash/BullMQ)
- Rate limiting
- API key management for multi-user
- Custom prompt editor
- A/B testing for prompts

### Analytics
- Usage metrics
- Popular tools tracking
- Model performance comparison

---

## 📝 Notes

- Keep initial implementation simple - no over-engineering
- System prompts stored as markdown for easy editing
- Use streaming for better UX when needed
- All tools should work offline (with mock data) for development

---

## 🔗 Resources

- [OpenRouter API Docs](https://openrouter.ai/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Netlify Next.js Plugin](https://docs.netlify.com/integrations/frameworks/next-js/overview/)
