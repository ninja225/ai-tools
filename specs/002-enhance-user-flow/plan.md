# Implementation Plan: UI Enhancement and User Flow Optimization

**Branch**: `002-enhance-user-flow` | **Date**: 2026-02-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-enhance-user-flow/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement complete UI for all six AI tools (Story Creator, Post Creator, Scene Creator, Quote Generator, Reels Creator, Scene Mood Describer) with consistent retro-themed components. Refactor card components to use shared BaseCard for DRY principles, enhance landing page with featured tools, add category-based filtering, install required shadcn/ui components, and remove duplicate src/prompts folder. No new dependencies - use existing 30 packages (framer-motion, lucide-react, @radix-ui, tailwindcss).

## Technical Context

**Language/Version**: TypeScript 5+ with strict mode, Next.js 16.1.6, React 19.2.3  
**Primary Dependencies**: @radix-ui (dialog, dropdown, select, tabs, toast), framer-motion 12.29.2, lucide-react 0.563.0, next-intl 4.8.1, tailwindcss 4, clsx/tailwind-merge for className composition  
**Storage**: N/A (client-side state, URL parameters for category filters)  
**Testing**: Manual testing, TypeScript type checking (`pnpm tsc --noEmit`)  
**Target Platform**: Web (Next.js App Router), responsive design 375px-1920px  
**Project Type**: Web application with App Router architecture  
**Performance Goals**: <2s page load, <100ms filter transitions, 60fps animations  
**Constraints**: Zero new npm packages (use existing 30 dependencies), maintain existing retro theme (--accent-brand: #f7b807, --accent-shadow: #984731), dark mode only  
**Scale/Scope**: 6 tools, 3 card component types, 3 page types (home, tools list, tool detail), 3 languages (en/ru/ar with RTL)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Tool Modularity
✅ **PASS** - Feature enhances UI for existing tools without changing tool boundaries. Each tool retains its own config file and prompts. Card refactoring improves shared UI components, not tool logic.

### II. System Prompt Excellence
✅ **PASS** - Feature removes duplicate src/prompts folder, consolidating on /prompts with proper multi-language support (en/ru/ar). No prompt changes required, only folder cleanup.

### III. Type Safety (NON-NEGOTIABLE)
✅ **PASS** - All components will maintain TypeScript strict mode. BaseCard and variant cards will have proper prop interfaces. Tool registry already typed. shadcn/ui components come with TypeScript definitions.

### IV. Modern Best Practices
✅ **PASS** - Uses Next.js 16 App Router, React Server Components where applicable, next-intl for i18n, TailwindCSS 4 for styling, component composition (BaseCard wrapper pattern), dark mode only.

### V. User Experience First
✅ **PASS** - Focus on consistent UX across all tools with retro aesthetic, proper loading states (15s timeout with retry), mobile responsive (375px+), smooth animations via framer-motion, category filtering for better discoverability.

### Prohibited Patterns Check
✅ No client-side only data fetching - using App Router patterns  
✅ No inline styles - using TailwindCSS classes  
✅ No theme toggle - dark mode only  
✅ All text will be internationalized via next-intl  
✅ Using lucide-react for tool icons (no generic icons for platform-specific content)

**Constitution Compliance**: ✅ ALL GATES PASSED - Proceed to Phase 0

**Post-Design Re-evaluation (Phase 1 Complete)**: ✅ ALL GATES STILL PASS

After completing design phase (data-model.md, contracts/, quickstart.md), all constitution principles remain satisfied:
- Tool Modularity: ✅ No changes to tool boundaries or configurations
- System Prompt Excellence: ✅ Only folder cleanup, prompts untouched
- Type Safety: ✅ All component interfaces defined with TypeScript strict mode
- Modern Best Practices: ✅ BaseCard uses composition pattern, proper RSC usage
- User Experience First: ✅ Consistent UX with 15s timeout, category filtering, responsive design

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                    # Landing page (enhance with featured tools)
│   │   ├── layout.tsx                  # Root layout
│   │   └── tools/
│   │       ├── page.tsx                # Tools list page (add category filtering)
│   │       └── [toolId]/
│   │           └── page.tsx            # Individual tool pages (implement for all 6 tools)
│   ├── api/
│   │   └── [tool-routes]/             # Existing API routes (no changes)
│   └── globals.css                     # Global styles (already has retro theme)
├── components/
│   ├── cards/
│   │   ├── base-card.tsx              # NEW: Shared card component
│   │   ├── tool-card.tsx              # REFACTOR: Use BaseCard
│   │   ├── variant-card.tsx           # REFACTOR: Use BaseCard
│   │   └── featured-tool-card.tsx     # NEW: For landing page
│   ├── ui/
│   │   ├── tabs.tsx                   # NEW: shadcn component
│   │   ├── select.tsx                 # NEW: shadcn component
│   │   ├── label.tsx                  # NEW: shadcn component
│   │   ├── input.tsx                  # NEW: shadcn component
│   │   ├── textarea.tsx               # NEW: shadcn component
│   │   ├── toast.tsx                  # NEW: shadcn component
│   │   └── [existing components]      # Keep existing UI components
│   ├── animations/
│   │   └── fade-in.tsx                # Existing, use for page transitions
│   ├── backgrounds/
│   │   └── retro-gradient.tsx         # Existing, use for all pages
│   └── tools/
│       └── [tool-specific components] # NEW: Form components for each tool
├── config/
│   ├── tools/
│   │   └── [tool configs]             # Existing tool configurations
│   └── site.ts                        # Existing site config
├── lib/
│   └── utils/                          # Existing utilities
└── messages/
    └── [en/ru/ar].json                 # i18n messages (add tool UI text)

prompts/                                 # Keep - active multi-language prompts
└── [tool]/[variant]/[lang].md

src/prompts/                             # DELETE - duplicate folder with old templates
└── story/[old-templates].md

tests/                                   # Manual testing documented in plan
```

**Structure Decision**: Web application using Next.js App Router architecture. Feature adds new BaseCard component, refactors existing cards, adds shadcn/ui components, and removes duplicate src/prompts folder. All tool pages follow same pattern: [locale]/tools/[toolId]/page.tsx.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations to track** - Feature fully complies with constitution principles.

---

## Phase Summary

### Phase 0: Research ✅ COMPLETE

**Output**: [research.md](research.md)

**Findings**:
- BaseCard architecture: Composition via wrapper component
- Category filtering: Client-side with useSearchParams + URL state
- Variant selection: Tabs for 2-4, dropdown for 5+ variants
- shadcn components: Install 6 components (tabs, select, label, input, textarea, toast)
- Responsive breakpoints: md:grid-cols-2 lg:grid-cols-3
- Timeout handling: AbortController with 15s timeout, retry/cancel buttons

**Technical Decisions**:
- No new dependencies (use existing 30 packages)
- Component composition over inheritance
- Client-side filtering for instant feedback
- URL state for shareable filtered views

**API Routes (Existing)**:
```text
src/app/api/
├── generate/
│   └── route.ts                    # Unified generation endpoint for all tools except Scene Mood Describer
├── analyze-scene-mood/
│   └── route.ts                    # Dedicated endpoint for Scene Mood Describer
├── tool/                            # Existing tool metadata endpoints
└── tools/                           # Existing tools registry endpoints
```

**Route Mapping**:
- Story Creator → `/api/generate` with tool_id parameter
- Post Creator → `/api/generate` with tool_id parameter
- Scene Creator → `/api/generate` with tool_id parameter
- Quote Generator → `/api/generate` with tool_id parameter
- Reels Creator → `/api/generate` with tool_id parameter
- Scene Mood Describer → `/api/analyze-scene-mood` (dedicated route)

### Phase 1: Design ✅ COMPLETE

**Outputs**:
- [data-model.md](data-model.md) - Component interfaces and data structures
- [contracts/card-components-api.md](contracts/card-components-api.md) - Public API contracts
- [quickstart.md](quickstart.md) - Development setup and implementation guide

**Artifacts Created**:
1. **Data Model**: Defined 8 core entities (Tool, BaseCard, ToolCard, FeaturedToolCard, VariantCard, CategoryFilter, ToolPageLayout, ToolFormState)
2. **Component Contracts**: Public API specifications for all card components with usage examples
3. **Implementation Guide**: 7-phase development workflow with testing checklists

**Agent Context Updated**: ✅ GitHub Copilot context file updated with TypeScript 5+, Next.js 16, React 19, @radix-ui, framer-motion, tailwindcss

### Phase 2: Planning (Current Phase)

**Status**: ✅ COMPLETE

**Deliverables**:
- ✅ Technical context defined
- ✅ Constitution check passed (all 5 principles + prohibited patterns)
- ✅ Project structure documented
- ✅ Phase 0 research completed
- ✅ Phase 1 design completed
- ✅ Agent context updated

**Ready for**: `/speckit.tasks` command to generate task breakdown

---

## Next Steps

1. **Run `/speckit.tasks`** to generate tasks.md with prioritized task breakdown
2. **Execute Phase 1 (Foundation)**: Create BaseCard component
3. **Execute Phase 2 (Refactoring)**: Update existing cards to use BaseCard
4. **Execute Phase 3-7**: Implement remaining features per quickstart.md

**Branch**: `002-enhance-user-flow`  
**Feature Spec**: [spec.md](spec.md)  
**Implementation Plan**: This file  
**Generated**: 2026-02-02
