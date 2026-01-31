# 🤖 AI Tools Platform

> Personal AI tools collection for content creation across multiple platforms

A modular AI-powered content creation platform built with Next.js 16, designed to leverage multiple LLM models via OpenRouter. Each tool operates independently with its own system instructions, model configurations, and output formats.

## ✨ Features

- 🎯 **Multiple AI Tools**: Story Creator, Social Media Post Generator, Image Prompt Generator
- 🔄 **Multiple Variants**: Each tool has platform-specific variants (Instagram, TikTok, VK, etc.)
- 🤖 **Multiple AI Models**: Support for Claude, GPT-4, Gemini via OpenRouter
- 📝 **Custom System Prompts**: Each variant uses tailored system instructions stored as markdown
- 🎨 **Modern UI**: Built with Next.js 16, TailwindCSS, and shadcn/ui
- ⚡ **Type-Safe**: Full TypeScript implementation

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
│   │   │   └── tools/          # Tools listing endpoint
│   │   ├── tools/              # Tools pages
│   │   └── layout.tsx          # Root layout
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

### 1. Story Creator
Generate engaging stories for social media and content platforms.

**Variants:**
- Instagram Reels
- TikTok Story
- General Story
- Short Form Content

**Use Cases:** Social media content, video scripts, blog posts

### 2. Social Media Post Generator
Create platform-specific posts optimized for engagement.

**Variants:**
- VKontakte (Russian)
- Yandex Dzen (Russian)
- Facebook
- Instagram
- General Social

**Use Cases:** Social media marketing, content planning

### 3. Image Prompt Generator
Create detailed prompts for AI image generators.

**Variants:**
- Midjourney Style
- DALL-E Style

**Use Cases:** AI art generation, creative projects

## 🔧 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| AI API | OpenRouter |
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
