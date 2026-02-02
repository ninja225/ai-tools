# Data Model: UI Enhancement and User Flow Optimization

**Feature**: 002-enhance-user-flow  
**Date**: 2026-02-02

## Overview

This document defines the data structures and relationships for the UI enhancement feature. Since this is primarily a UI refactoring feature, the data model focuses on component prop interfaces, tool configuration types, and state management.

## Core Entities

### 1. Tool

Represents an AI tool in the platform (already defined in existing codebase).

**Location**: `src/types/tool.ts`, `src/config/tools/*.ts`

**TypeScript Interface**:
```typescript
interface ToolConfig {
  id: string;                    // Unique identifier (e.g., "story-creator")
  name: string;                  // Display name (i18n key)
  description: string;           // Brief description (i18n key)
  category: ToolCategory;        // Category for filtering/grouping
  icon: string;                  // Lucide icon name
  variants: ToolVariant[];       // Available variants for this tool
  inputs: ToolInput[];           // Required inputs for the tool
}

type ToolCategory = 
  | "Content Creation" 
  | "Image Analysis" 
  | "Social Media";

interface ToolVariant {
  id: string;                    // Variant identifier (e.g., "general", "tiktok")
  name: string;                  // Display name (i18n key)
  description?: string;          // Optional description (i18n key)
  promptTemplate: string;        // Path to prompt file
  icon?: string;                 // Optional variant-specific icon
  simpleIcon?: string;           // Optional simple-icons brand name
  customIconPath?: string;       // Optional custom SVG path
}

interface ToolInput {
  id: string;                    // Input field identifier
  type: "text" | "textarea" | "select";
  label: string;                 // Field label (i18n key)
  placeholder?: string;          // Placeholder text (i18n key)
  required: boolean;             // Whether field is required
  options?: string[];            // For select inputs
}
```

**Relationships**:
- Tool HAS MANY Variants (1:N)
- Tool HAS MANY Inputs (1:N)
- Tool BELONGS TO one Category (N:1)

**Validation Rules**:
- Tool ID must be kebab-case, unique across platform
- Category must be one of three defined categories
- Must have at least 1 variant
- Icon must be valid Lucide icon name or custom path

**State Transitions**: Static configuration, no state changes

---

### 2. BaseCard

Foundation component for all card types with shared styling props.

**Location**: `src/components/cards/base-card.tsx` (NEW)

**TypeScript Interface**:
```typescript
interface BaseCardProps {
  children: React.ReactNode;     // Card content
  className?: string;            // Additional Tailwind classes
  href?: string;                 // Optional link (renders as <Link> if provided)
  onClick?: () => void;          // Optional click handler
  glowIntensity?: "low" | "medium" | "high"; // Hover glow effect strength
  grainOpacity?: number;         // Grain texture opacity (0-1)
}
```

**Styling Constants**:
- Default grain opacity: 0.08
- Gradient border inset: 2px
- Border radius: rounded-2xl (16px)
- Backdrop blur: backdrop-blur-md

---

### 3. ToolCard

Card component for displaying tools in the grid view (REFACTOR existing).

**Location**: `src/components/cards/tool-card.tsx`

**TypeScript Interface**:
```typescript
interface ToolCardProps {
  tool: ToolConfig;              // Full tool configuration
  locale: string;                // Current locale for i18n
  // Inherits BaseCardProps through composition
}
```

**Computed Properties**:
- `variantCount`: `tool.variants.length`
- `categoryColor`: Derived from `tool.category` (Content Creation: amber, Image Analysis: blue, Social Media: purple)

**Rendering Logic**:
- Category badge in top-right corner (small uppercase label)
- Tool icon in center with glow effect
- Tool name and description with i18n lookup
- "See More (X)" button at bottom where X = variant count
- Links to `/[locale]/tools/[tool.id]`

---

### 4. FeaturedToolCard

Enhanced card for landing page featured tools (NEW).

**Location**: `src/components/cards/featured-tool-card.tsx`

**TypeScript Interface**:
```typescript
interface FeaturedToolCardProps {
  tool: ToolConfig;              // Full tool configuration
  locale: string;                // Current locale for i18n
  size?: "normal" | "large";     // Card size variant
  // Inherits BaseCardProps through composition
}
```

**Differences from ToolCard**:
- Larger dimensions (h-[320px] vs h-[400px])
- More prominent glow effects (opacity 0.4 on hover vs 0.3)
- Optional larger icon size for "hero" display
- Enhanced animation on hover (scale + rotate)

---

### 5. VariantCard

Selectable card for choosing tool variants (REFACTOR existing).

**Location**: `src/components/cards/variant-card.tsx`

**TypeScript Interface**:
```typescript
interface VariantCardProps {
  variant: ToolVariant;          // Variant configuration
  isSelected?: boolean;          // Whether this variant is currently selected
  onClick: () => void;           // Selection handler
  // Inherits BaseCardProps through composition
}
```

**Styling Logic**:
- Selected state: Enhanced border color, glow effect
- Icon centered with platform-specific icon support (lucide, simple-icons, custom)
- Variant name and optional description
- Hover state: Rotate and scale animation

---

### 6. CategoryFilter

Client-side filtering component for tools page (NEW).

**Location**: `src/components/tools/category-filter.tsx`

**TypeScript Interface**:
```typescript
interface CategoryFilterProps {
  categories: ToolCategory[];    // Available categories
  selectedCategory: ToolCategory | "all";
  onCategoryChange: (category: ToolCategory | "all") => void;
  toolCounts: Record<ToolCategory | "all", number>; // Tool count per category
}
```

**State Management**:
- URL parameter: `?category=Content%20Creation`
- State persisted via Next.js router
- Client component using `useSearchParams` + `useRouter`

**Rendering Options**:
- Tabs (@radix-ui/react-tabs) for horizontal layout
- Badge indicators showing count per category
- "All Tools" option resets filter

---

### 6a. ImageUpload (Existing Component)

**EXISTING** component for file upload functionality.

**Location**: `src/components/tools/image-upload.tsx` (already exists, reuse for Scene Creator and Scene Mood Describer)

**Purpose**: Handles image file selection, validation, and upload for image-based tools

**Usage in Feature**:
- Scene Creator (T024): Reuse existing ImageUpload component
- Scene Mood Describer (T033): Reuse existing ImageUpload component

**No changes required** - component will be imported and used as-is in form components.

---

### 7. ToolPageLayout

Shared layout for individual tool pages (NEW).

**Location**: `src/components/tools/tool-page-layout.tsx`

**TypeScript Interface**:
```typescript
interface ToolPageLayoutProps {
  tool: ToolConfig;              // Full tool configuration
  locale: string;                // Current locale
  children: React.ReactNode;     // Tool-specific form content
}
```

**Layout Structure**:
```
RetroGradient background
└─ Container
   ├─ Header (tool name, description, back button)
   ├─ Variant Selector (tabs or dropdown based on count)
   ├─ {children} (tool-specific form inputs)
   └─ Generation Controls (generate button, cancel, retry)
```

---

### 8. ToolFormState

Client-side state for tool generation forms (NEW).

**TypeScript Interface**:
```typescript
interface ToolFormState {
  selectedVariant: string;       // Currently selected variant ID
  inputs: Record<string, string>; // Input field values (id → value)
  isGenerating: boolean;         // Whether generation is in progress
  output: string | null;         // Generated output
  error: string | null;          // Error message if generation failed
}
```

**State Transitions**:
1. **Idle** → inputs empty, !isGenerating, !output, !error
2. **Generating** → isGenerating=true, abortController active
3. **Success** → !isGenerating, output populated, error=null
4. **Error** → !isGenerating, output=null, error populated
5. **Cancelled** → !isGenerating, output=null, error=null (back to Idle)

**Timeout Handling**:
- 15-second timeout via AbortController
- On timeout: Transition to Error state with retry button
- On cancel: Abort request, transition to Idle

---

## Component Hierarchy

```
Page Components (Server Components where possible)
├─ [locale]/page.tsx (Landing)
│  └─ FeaturedToolCard (client) × 2
│     └─ BaseCard
├─ [locale]/tools/page.tsx (Tools List)
│  ├─ CategoryFilter (client)
│  └─ ToolCard (client) × 6
│     └─ BaseCard
└─ [locale]/tools/[toolId]/page.tsx (Tool Detail)
   └─ ToolPageLayout (client)
      ├─ VariantCard × N
      │  └─ BaseCard
      └─ ToolForm (client)
         ├─ shadcn/ui components (Input, Textarea, Select, Label)
         └─ LoadingState (existing)
```

## Validation Rules Summary

### Tool Configuration
- ✅ Tool ID must be unique, kebab-case
- ✅ Category must be one of three defined values
- ✅ Must have ≥ 1 variant
- ✅ Icon must be valid Lucide icon name

### Form Inputs
- ✅ Required fields must be filled before generation
- ✅ Text inputs: min 3 characters
- ✅ Textarea inputs: min 10 characters
- ✅ Select inputs: must have valid selection

### URL Parameters
- ✅ Category filter: must be valid ToolCategory or "all"
- ✅ Tool ID route param: must match existing tool ID
- ✅ Invalid params: redirect to /tools page

## State Management Strategy

**Global State**: None required - all state is component-local or URL-based

**URL State**: 
- Category filter: `?category=<ToolCategory>`
- Managed via useSearchParams + useRouter

**Component State**:
- Form inputs: useState in ToolForm component
- Generation state: useState (isGenerating, output, error)
- Variant selection: useState (selectedVariant)

**Server State**: Tool configurations are static, loaded at build time from config files

## Data Flow

```
User Action → Component State → URL Update (if applicable) → UI Re-render
     ↓
API Call (if generation) → Loading State → Success/Error → Display Output
```

**Example: Category Filtering**
1. User clicks "Image Analysis" tab
2. CategoryFilter calls `onCategoryChange("Image Analysis")`
3. Parent component updates URL: `router.replace("?category=Image%20Analysis")`
4. useSearchParams triggers re-render
5. Filtered tools array computed from searchParams
6. ToolCard components re-render with filtered list

**Example: Tool Generation**
1. User fills form inputs (state: `inputs`)
2. User clicks "Generate" button
3. State: `isGenerating = true`
4. Fetch to `/api/generate` with AbortController (15s timeout)
5a. **Success**: State: `output = response, isGenerating = false`
5b. **Error/Timeout**: State: `error = message, isGenerating = false`
5c. **Cancel**: AbortController.abort(), State: reset to Idle
6. UI renders output or error with retry option

## Migration Notes

**Existing Components to Refactor**:
1. `tool-card.tsx` - Extract common styles to BaseCard, compose BaseCard
2. `variant-card.tsx` - Extract common styles to BaseCard, compose BaseCard
3. Landing page cards (inline) - Extract to FeaturedToolCard component

**New Components to Create**:
1. `base-card.tsx` - Foundation component with retro styling
2. `featured-tool-card.tsx` - Landing page featured tools
3. `category-filter.tsx` - Category filtering UI
4. `tool-page-layout.tsx` - Shared layout for tool pages
5. 6× tool-specific form components (one per tool)

**No Breaking Changes**: Existing API routes, tool configs, and prompt files remain unchanged.
