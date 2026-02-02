# Research: UI Enhancement and User Flow Optimization

**Feature**: 002-enhance-user-flow  
**Date**: 2026-02-02

## Overview

This document consolidates research findings for implementing complete UI for all six AI tools with consistent components, refactored card architecture, category filtering, and improved user flow.

## Research Tasks Completed

### 1. BaseCard Component Architecture Pattern

**Research Question**: What's the best pattern for sharing common card styling across three different card types (FeaturedToolCard, ToolCard, VariantCard) in React with TypeScript?

**Decision**: Composition via wrapper component

**Rationale**:
- React composition patterns are more flexible than inheritance
- Allows each card type to customize layout while inheriting base styles
- TypeScript interfaces can extend base props easily
- Avoids CSS class duplication across three card implementations
- Enables single source of truth for retro styling (grain texture, gradient borders, glow effects)

**Alternatives Considered**:
- CSS class utility approach: Would require maintaining parallel Tailwind classes across three files
- HOC pattern: Adds unnecessary complexity and TypeScript typing challenges
- Render props: Overkill for styling composition, harder to read

**Implementation Approach**:
```typescript
// BaseCard exports styled wrapper with common retro effects
export const BaseCard = ({ children, className, ...props }) => (
  <div className={cn("relative overflow-hidden rounded-2xl", className)} {...props}>
    {/* Grain texture overlay */}
    <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{...}} />
    {/* Gradient border effect */}
    <div className="absolute inset-[2px] bg-card/90 backdrop-blur-md">{children}</div>
  </div>
);

// Tool cards compose BaseCard
export const ToolCard = (props) => (
  <BaseCard className="h-[400px] hover:shadow-[var(--accent-brand)]/40">
    {/* Tool-specific content */}
  </BaseCard>
);
```

### 2. Category Filtering Implementation

**Research Question**: How to implement client-side category filtering with URL state persistence in Next.js App Router?

**Decision**: useSearchParams + useRouter with client component

**Rationale**:
- Next.js 16 App Router uses useSearchParams for URL query parameter access
- Client-side filtering provides instant feedback (no server roundtrip)
- URL parameters make filtered states shareable via links
- useRouter's replace method updates URL without adding history entries
- Fits within existing architecture (no new dependencies)

**Implementation Approach**:
```typescript
'use client';
const searchParams = useSearchParams();
const router = useRouter();
const category = searchParams.get('category') || 'all';

const handleCategoryChange = (newCategory: string) => {
  const params = new URLSearchParams(searchParams);
  if (newCategory === 'all') params.delete('category');
  else params.set('category', newCategory);
  router.replace(`?${params.toString()}`);
};

const filteredTools = tools.filter(tool => 
  category === 'all' || tool.category === category
);
```

**Alternatives Considered**:
- Server-side filtering: Slower, unnecessary server load for static tool list
- Local state only: Loses shareability benefit
- Query string libraries: Adds dependency, useSearchParams is sufficient

### 3. Variant Selection UI Pattern (Tabs vs Dropdown)

**Research Question**: When should tool pages use tabs vs dropdown for variant selection?

**Decision**: Tabs for 2-4 variants, Dropdown for 5+ variants

**Rationale**:
- **Cognitive Load**: Tabs show all options at once (good for ≤4 choices), dropdown hides options (better for 5+)
- **Visual Hierarchy**: Tabs feel more primary/important, dropdowns more utilitarian
- **Current Tool Distribution**:
  - Story Creator: 4 variants (General, TikTok, Reels, Short) → **Tabs**
  - Post Creator: Likely 3-5 variants → **Context-dependent**
  - Scene Creator: 2-3 variants → **Tabs**
  - Quote Generator: 2-3 variants → **Tabs**
  - Reels Creator: 2-3 variants → **Tabs**
  - Scene Mood Describer: 1-2 variants → **Tabs** (or just show default)

**Implementation**:
- Use @radix-ui/react-tabs for tab pattern
- Use @radix-ui/react-select for dropdown pattern
- Conditional rendering based on `variants.length` check

**Alternatives Considered**:
- Always tabs: Visual clutter for 5+ variants
- Always dropdown: Hides options unnecessarily for 2-3 variants
- Radio buttons: Takes more vertical space, less modern feel

### 4. shadcn/ui Component Installation

**Research Question**: Which shadcn/ui components are needed and how to install without breaking existing setup?

**Decision**: Install tabs, select, label, input, textarea, toast via CLI

**Components Required**:
1. **tabs** - For variant selection (2-4 variants)
2. **select** - For variant selection (5+ variants)
3. **label** - For form field labels on tool pages
4. **input** - For text inputs (topic, title fields)
5. **textarea** - For longer text inputs (description, content fields)
6. **toast** - For success/error notifications after generation

**Installation Command**:
```bash
npx shadcn@latest add tabs select label input textarea toast
```

**Rationale**:
- Components already configured in components.json (New York style, Tailwind 4, TypeScript)
- CLI installation ensures proper theming with existing CSS variables
- @radix-ui primitives already in dependencies, just adds pre-styled wrappers
- Zero new core dependencies, only adds component files

**Alternatives Considered**:
- Building custom components: Reinvents wheel, more maintenance
- Using @radix-ui directly: Requires custom styling, inconsistent design
- Different component library: Violates "no new dependencies" constraint

### 5. Mobile Responsive Breakpoints

**Research Question**: What Tailwind breakpoints should be used for the 3-column → 2-column → 1-column grid adaptation?

**Decision**: Use `md:grid-cols-2 lg:grid-cols-3` pattern

**Breakpoint Strategy**:
- **Mobile (< 768px)**: 1 column (default, no prefix)
- **Tablet (≥ 768px, `md:`)**: 2 columns
- **Desktop (≥ 1024px, `lg:`)**: 3 columns

**Rationale**:
- Aligns with Tailwind's default breakpoints (md: 768px, lg: 1024px)
- Success criteria specifies 375px minimum (well below md breakpoint)
- 2-column layout at 768px prevents cards from being too narrow
- 3-column layout at 1024px utilizes wider screens efficiently

**Implementation**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

**Alternatives Considered**:
- Custom breakpoints: Unnecessary complexity, default breakpoints proven
- 4-column on xl: Too many columns, cards become small
- 2-column only: Wastes space on large monitors

### 6. Loading States and Timeout Handling

**Research Question**: How to implement 15-second timeout with retry/cancel functionality for API calls?

**Decision**: Use AbortController with setTimeout and toast notifications

**Implementation Pattern**:
```typescript
const [isLoading, setIsLoading] = useState(false);
const abortControllerRef = useRef<AbortController | null>(null);

const handleGenerate = async () => {
  abortControllerRef.current = new AbortController();
  const timeoutId = setTimeout(() => {
    abortControllerRef.current?.abort();
    toast.error("Request timed out. Please try again.");
  }, 15000);

  try {
    setIsLoading(true);
    const response = await fetch('/api/generate', {
      signal: abortControllerRef.current.signal,
      // ...
    });
    clearTimeout(timeoutId);
    // Handle success
  } catch (error) {
    if (error.name === 'AbortError') {
      // Timeout occurred, already toasted
    } else {
      toast.error("Generation failed. Please retry.");
    }
  } finally {
    setIsLoading(false);
  }
};

const handleCancel = () => {
  abortControllerRef.current?.abort();
  setIsLoading(false);
  toast.info("Generation cancelled");
};
```

**Rationale**:
- AbortController is standard Web API, no dependencies
- 15-second timeout balances patience (AI generation time) with user control
- Retry button is just re-invoking handleGenerate()
- Cancel button provides user control during long requests
- LoadingState component (already exists) displays spinner during isLoading

**Alternatives Considered**:
- No timeout: Poor UX, user stuck waiting indefinitely
- Shorter timeout (10s): Too aggressive, AI generation can take 10-15s
- Promise.race pattern: More complex, AbortController more standard

## Summary of Findings

All research questions resolved with actionable implementation decisions:

1. ✅ **BaseCard Architecture**: Composition via wrapper component
2. ✅ **Category Filtering**: Client-side with useSearchParams + URL state
3. ✅ **Variant Selection**: Tabs for 2-4, dropdown for 5+ variants
4. ✅ **shadcn Components**: Install 6 components via CLI (tabs, select, label, input, textarea, toast)
5. ✅ **Responsive Grid**: md:grid-cols-2 lg:grid-cols-3 pattern
6. ✅ **Timeout Handling**: AbortController with 15s timeout, retry/cancel buttons

No technical blockers identified. All solutions use existing dependencies and align with constitution principles.
