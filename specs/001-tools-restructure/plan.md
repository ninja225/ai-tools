# Implementation Plan: Tools Platform Restructure

**Branch**: `001-tools-restructure` | **Date**: 2026-02-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-tools-restructure/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Reorganize AI Tools Platform to support 6 essential content creation tools: Story Creator (keep/enhance), Post Creator for VK/Facebook/Dzen (rename from social-media-post), Scene Creator (text-to-video prompts), Quote Generator (themed quotes for design), Reels Creator (concept + script + video prompts), and Scene Mood Describer (image analysis to prompt). Remove image-prompt tool. All tools support en/ru/ar languages with system prompt excellence and independent operation per constitution.

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode, React 19.2.3, Next.js 16.1.6  
**Primary Dependencies**: next-intl 4.8.1 (i18n), OpenRouter API client, Zod 4.3.6 (validation), simple-icons 16.6.1 + Lucide React (icons), Framer Motion (animations)  
**Storage**: File system for system prompts (markdown files in `prompts/[tool]/[variant]/[lang].md`), no database required  
**Testing**: Command-line test scripts (Node.js) for system prompt validation, TypeScript compiler (`tsc --noEmit`), manual testing across languages  
**Target Platform**: Web application (Next.js App Router), browser-based, responsive design, dark mode only  
**Project Type**: Web application (frontend-focused with API routes)  
**Performance Goals**: <10 seconds UI response time (excluding LLM processing), <200ms page navigation, smooth 60fps animations  
**Constraints**: OpenRouter API rate limits, free-tier models only initially, client-side image upload <10MB for scene mood describer, no CDN/cloud storage initially  
**Scale/Scope**: Personal/small business use (not enterprise), 6 tools total, 3 languages (en/ru/ar), ~15-20 tool variants across all tools

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Tool Modularity
**Status**: PASS  
**Rationale**: Feature adds 4 new independent tools and restructures 2 existing ones. Each tool will have separate config files in `src/config/tools/`, dedicated system prompts in `prompts/[tool]/`, and unique TypeScript interfaces. No cross-tool dependencies. Removing image-prompt tool will not affect other tools (validates modularity principle).

### ✅ II. System Prompt Excellence
**Status**: PASS  
**Rationale**: All 6 tools require system prompts following modern prompt engineering (role definition, examples, constraints, output specs). Each tool×variant×language needs dedicated prompt file (e.g., `prompts/scene-creator/general/en.md`). Existing story-creator prompts demonstrate the pattern. New tools will follow same structure with {{placeholder}} tokens. Command-line testing required before UI integration per constitution.

### ✅ III. Type Safety (NON-NEGOTIABLE)
**Status**: PASS  
**Rationale**: All tools require TypeScript interfaces extending `ToolConfig`, `ToolVariant`, `ToolInput` types. Scene mood describer needs new `image` input type added to `ToolInput` union. All OpenRouter responses validated with Zod schemas. No `any` types permitted. Existing codebase demonstrates pattern.

### ✅ IV. Modern Best Practices
**Status**: PASS  
**Rationale**: Feature uses existing Next.js 16 App Router architecture, React Server Components, next-intl for i18n, TailwindCSS 4. No architectural changes needed. New tool pages follow `[locale]/tools/[toolId]/page.tsx` pattern with `React.use()` for async params. All modern patterns already established.

### ✅ V. User Experience First
**Status**: PASS  
**Rationale**: Each tool gets unique icon (simple-icons for brands, Lucide for concepts, custom SVG where needed). Language selection enforces output language in prompts. Scene mood describer adds new capability (image upload) enhancing UX. All 6 tools independently testable. Loading states and i18n already established in existing UI.

**GATE RESULT**: ✅ **PASS** - All 5 constitution principles satisfied. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-tools-restructure/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── scene-creator-api.md
│   ├── quote-generator-api.md
│   ├── reels-creator-api.md
│   └── scene-mood-describer-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx
│       └── tools/
│           ├── page.tsx                    # Tools listing (6 tools)
│           └── [toolId]/
│               └── page.tsx                # Tool detail pages
├── components/
│   ├── ui/                                 # shadcn/ui components
│   ├── backgrounds/
│   │   └── retro-gradient.tsx
│   ├── cards/
│   │   ├── tool-card.tsx                   # Tool listing cards
│   │   └── variant-card.tsx                # Variant selection cards
│   └── tools/
│       ├── image-upload.tsx                # NEW: For scene mood describer
│       └── output-display.tsx              # Reusable output component
├── config/
│   └── tools/
│       ├── index.ts                        # Tool registry
│       ├── story-creator.ts                # KEEP/ENHANCE
│       ├── post-creator.ts                 # RENAME from social-media-post.ts
│       ├── scene-creator.ts                # NEW
│       ├── quote-generator.ts              # NEW
│       ├── reels-creator.ts                # NEW
│       └── scene-mood-describer.ts         # NEW
├── lib/
│   ├── openrouter/
│   │   ├── client.ts
│   │   └── types.ts
│   └── utils/
│       ├── cn.ts
│       └── prompt-loader.ts                # Load system prompts from files
├── types/
│   └── tool.ts                             # ToolConfig, ToolVariant, ToolInput interfaces
└── messages/
    ├── en.json
    ├── ru.json
    └── ar.json

prompts/
├── story/
│   ├── general/
│   │   ├── en.md
│   │   ├── ru.md
│   │   └── ar.md
│   ├── instagram/
│   └── tiktok/
├── post/                                    # RENAME from social-media-post
│   ├── vk/
│   │   ├── en.md
│   │   ├── ru.md
│   │   └── ar.md
│   ├── facebook/
│   └── dzen/
├── scene/                                   # NEW
│   └── general/
│       ├── en.md
│       ├── ru.md
│       └── ar.md
├── quote/                                   # NEW
│   ├── motivation/
│   │   ├── en.md
│   │   ├── ru.md
│   │   └── ar.md
│   ├── wisdom/
│   ├── life/
│   ├── love/
│   ├── success/
│   ├── happiness/
│   ├── strength/
│   └── creativity/
├── reels/                                   # NEW
│   └── general/
│       ├── en.md
│       ├── ru.md
│       └── ar.md
└── scene-mood/                              # NEW
    └── general/
        └── en.md                            # Vision models handle multilingual output

scripts/
├── test-story-creator.js                    # EXISTING
├── test-scene-creator.js                    # NEW
├── test-quote-generator.js                  # NEW
├── test-reels-creator.js                    # NEW
└── test-post-creator.js                     # NEW (for refactored post creator)

public/
└── icons/
    └── custom/
        └── yandex.svg
```

**Structure Decision**: Web application architecture using Next.js App Router. Frontend-focused with API routes for OpenRouter integration. File-based system prompts enable non-deployment prompt updates (constitution requirement). Each tool operates independently with dedicated config/prompts/types following Tool Modularity principle. Image upload for scene mood describer handled client-side initially (no backend storage infrastructure needed).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations detected. All 5 core principles satisfied without exceptions.

---

## Phase 1 Re-Evaluation: Constitution Check

*Post-design verification of constitution compliance*

### ✅ I. Tool Modularity
**Status**: PASS (CONFIRMED)  
**Evidence**: 
- Data model shows 6 independent Tool entities with separate configs
- 49 system prompt files organized by tool/variant/language (clear boundaries)
- API contracts demonstrate no cross-tool dependencies
- Each tool can be added/removed without affecting others (validated in quickstart)

### ✅ II. System Prompt Excellence
**Status**: PASS (CONFIRMED)  
**Evidence**:
- Research phase defined modern prompt engineering structure for all 4 new tools
- Scene Creator: Professional Video Director role, 7-component scene structure, cinematography vocabulary
- Quote Generator: Anti-cliché focus, <100 char constraint, theme-specific approaches
- Reels Creator: 3-part integrated output (concept/script/scenes), natural speech patterns
- Scene Mood Describer: 7-category analysis framework, photography terminology, AI optimization
- All prompts include role definition, examples, constraints, DO/DON'T lists, output specs
- Command-line testing workflow documented in quickstart

### ✅ III. Type Safety (NON-NEGOTIABLE)
**Status**: PASS (CONFIRMED)  
**Evidence**:
- Data model defines explicit TypeScript interfaces: ToolConfig, ToolInput, ToolVariant, GenerationRequest, GeneratedContent, ContentMetadata
- New `file` input type added to ToolInput union for scene mood describer
- All entities have validation rules specified
- Contracts show typed request/response structures with Zod validation
- Quickstart enforces type safety in Step 7 checklist

### ✅ IV. Modern Best Practices
**Status**: PASS (CONFIRMED)  
**Evidence**:
- Research shows Server Actions + FormData for image upload (Next.js 16 native pattern)
- File-based system prompts enable non-deployment updates (constitution requirement)
- Data model uses Next.js 16 compatible patterns (React Server Components)
- Contracts follow RESTful conventions with proper status codes
- Agent context updated with current tech stack

### ✅ V. User Experience First
**Status**: PASS (CONFIRMED)  
**Evidence**:
- Icon strategy: simple-icons (brands), Lucide (generic), custom SVG (specialized) documented in data model
- Language enforcement implemented in all prompt structures
- Image upload UX researched with client-side preview + validation
- API contracts include loading states, error messages, metadata for UI feedback
- Quickstart includes UX verification checklist (Step 6)

**FINAL GATE RESULT**: ✅ **PASS** - All 5 constitution principles validated post-design. Feature design maintains full compliance. Ready for Phase 2 (tasks generation).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
