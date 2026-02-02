# 🤖 ToolKo Platform

> Personal AI tools collection for content creation across multiple platforms

A modular AI-powered content creation platform built with Next.js 16, designed to leverage multiple LLM models via OpenRouter. Each tool operates independently with placeholder-based prompts that adapt to user selections, supporting 3 languages (English, Russian, Arabic).

## ✨ Features

- 🎯 **6 AI Tools**: Story Creator, Post Creator, Scene Creator, Quote Generator, Reels Creator, Scene Mood Describer
- 🌐 **Multilingual**: Full support for English, Russian, and Arabic with native translations
- 📝 **Smart Prompts**: Placeholder-based system prompts ({{variant}}, {{platform}}, {{tone}}, etc.) for maintainability
- 🤖 **Multiple AI Models**: Support for Claude, GPT-4, Gemini via OpenRouter
- 🎨 **Modern UI**: Built with Next.js 16, React 19, TailwindCSS, and shadcn/ui
- ⚡ **Type-Safe**: Full TypeScript implementation with strict mode
- 🖼️ **Vision AI**: Image upload and analysis for Scene Mood Describer

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- OpenRouter API key ([get one here](https://openrouter.ai/keys))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-tools
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenRouter API key to `.env.local`:
```env
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
ai-tools/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── generate/       # Generation endpoint
   │   │   ├── tools/          # Tools listing endpoint
   │   │   └── analyze-scene-mood/ # Vision AI endpoint
   │   ├── [locale]/           # Internationalized pages
   │   │   ├── tools/          # Tools pages
   │   │   └── layout.tsx      # Localized layout
   │   └── globals.css         # Global styles
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   ├── tools/              # Tool-specific components
│   │   └── common/             # Common components
│   │
│   ├── lib/                    # Core libraries
│   │   ├── openrouter/         # OpenRouter client & types
│   │   ├── tools/              # Tool registry & executor
│   │   └── utils/              # Utility functions
│   │
│   ├── config/                 # Configuration
│   │   ├── tools/              # Tool configurations
│   │   ├── models.ts           # Available AI models
│   │   └── site.ts             # Site configuration
│   │
│   ├── prompts/                # System instructions (markdown)
│   │   ├── story/              # Story prompts
│   │   ├── social/             # Social media prompts
│   │   └── image/              # Image prompt prompts
│   │
│   ├── hooks/                  # React hooks
│   └── types/                  # TypeScript types
│
├── public/                     # Static assets
└── plan.md                     # Project plan
```

## 🛠️ Available Tools

### 1. Story Creator 📖 (P1 - MVP)
Generate engaging stories for social media, reels, or general content.

**Inputs:** Topic, Variant (General/Reels), Tone (8 options), Length, Language  
**Output:** Formatted story text optimized for selected variant  
**Use Cases:** Social media content, video scripts, blog posts

### 2. Post Creator 📱 (P1 - MVP)
Create platform-specific posts optimized for Russian social networks and Facebook.

**Inputs:** Topic, Platform (VK/Dzen/Facebook), Tone, Language  
**Output:** Platform-optimized post with proper length and formatting  
**Use Cases:** Social media marketing, content planning, engagement optimization

### 3. Scene Creator 🎬 (P2)
Convert story text into professional video scene descriptions with cinematography details.

**Inputs:** Story Text, Language  
**Output:** 3-7 XML-formatted scenes with visual, camera, lighting, action, mood, duration, transition  
**Use Cases:** Video production, AI video generation, storyboarding

### 4. Quote Generator 💬 (P2)
Generate fresh, non-clichéd quotes under 100 characters for 8 themes.

**Inputs:** Theme (Motivation/Wisdom/Life/Love/Success/Happiness/Strength/Creativity), Quantity, Language  
**Output:** Numbered list of original quotes  
**Use Cases:** Social media graphics, inspirational content, typography projects

### 5. Reels Creator 🎥 (P3)
Generate complete reels package: concept, voice-over script, and video scene prompts.

**Inputs:** Topic, Language  
**Output:** XML package with concept (hook/message/rationale), script (30-60s with [PAUSE]/[EMPHASIS] markers), 3-5 scenes  
**Use Cases:** Instagram Reels, TikTok, YouTube Shorts production

### 6. Scene Mood Describer 🖼️ (P3)
Upload an image and get detailed AI regeneration prompts with mood, lighting, and composition analysis.

**Inputs:** Image file (JPEG/PNG/WebP, max 10MB), Language  
**Output:** Single paragraph prompt (150-300 words) optimized for Midjourney, DALL-E, Stable Diffusion  
**Use Cases:** AI art recreation, aesthetic analysis, photography learning

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Frontend | React 19.2.3 |
| Language | TypeScript 5+ (Strict Mode) |
| Styling | TailwindCSS + shadcn/ui |
| I18n | next-intl 4.8.1 |
| AI API | OpenRouter |
| Validation | Zod 4.3.6 |
| Icons | Lucide React |
| Package Manager | pnpm |

## 📡 API Routes

### GET /api/tools
Get all available tools and their configurations.

**Response:**
```json
{
  "success": true,
  "data": {
    "tools": [...]
  }
}
```

### POST /api/generate
Generate content using a specific tool and variant.

**Request Body:**
```json
{
  "toolId": "story-creator",
  "variantId": "reels",
  "modelId": "anthropic/claude-3-haiku",
  "inputs": {
    "topic": "Your topic here",
    "tone": "engaging",
    "length": "short"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "Generated content here...",
    "model": "anthropic/claude-3-haiku",
    "tokensUsed": 250
  }
}
```

## 🎨 Adding New Tools

1. Create tool configuration in `src/config/tools/`:
```typescript
export const myNewTool: ToolConfig = {
  id: 'my-tool',
  name: 'My Tool',
  description: 'Tool description',
  // ... rest of config
};
```

2. Create system prompts in `src/prompts/`:
```markdown
# My Tool - Variant Name

System instructions here...
```

3. Register tool in `src/config/tools/index.ts`:
```typescript
import { myNewTool } from './my-new-tool';
toolRegistry.register(myNewTool);
```

## 🚀 Deployment

### Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
pnpm build
```

3. Deploy:
```bash
netlify deploy --prod
```

### Environment Variables
Make sure to set these in your deployment platform:
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 📝 Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 🗺️ Roadmap

See [plan.md](./plan.md) for the complete project roadmap.

**Phase 1: MVP** ✅
- [x] Core architecture
- [x] OpenRouter integration
- [x] 3 initial tools with variants
- [ ] Interactive UI components
- [ ] Deploy to Netlify

**Phase 2: Enhancement**
- [ ] More tools
- [ ] Template/prompt library
- [ ] History/saved generations
- [ ] Export options

**Phase 3: Production**
- [ ] Authentication
- [ ] Rate limiting
- [ ] Database integration
- [ ] Usage analytics

## 📄 License

This project is for personal use.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [OpenRouter](https://openrouter.ai/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ using Next.js and AI
