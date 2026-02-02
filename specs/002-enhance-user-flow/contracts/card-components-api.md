# Component Contracts: Card Components

**Feature**: 002-enhance-user-flow  
**Date**: 2026-02-02

This document defines the public API contracts for the card component system.

## BaseCard Component

**Purpose**: Foundation component providing shared retro styling for all card variants

**Location**: `src/components/cards/base-card.tsx`

### Props Contract

```typescript
interface BaseCardProps {
  /** Child elements to render inside the card */
  children: React.ReactNode;
  
  /** Additional Tailwind classes to merge with base styles */
  className?: string;
  
  /** Optional href - renders as Next.js Link if provided */
  href?: string;
  
  /** Optional click handler - renders as button if provided (mutually exclusive with href) */
  onClick?: () => void;
  
  /** Glow effect intensity on hover */
  glowIntensity?: "low" | "medium" | "high";
  
  /** Opacity of grain texture overlay (0-1) */
  grainOpacity?: number;
  
  /** Additional props passed to root element */
  [key: string]: any;
}
```

### Default Values

```typescript
{
  glowIntensity: "medium",
  grainOpacity: 0.08
}
```

### Usage Examples

**Basic wrapper (composition pattern)**:
```typescript
<BaseCard className="p-6 h-[400px]">
  <h3>Card Content</h3>
  <p>Any child elements</p>
</BaseCard>
```

**As link**:
```typescript
<BaseCard href="/tools/story-creator" className="p-6">
  <h3>Story Creator</h3>
</BaseCard>
```

**With click handler**:
```typescript
<BaseCard onClick={() => setSelected(true)} className="cursor-pointer">
  <h3>Click Me</h3>
</BaseCard>
```

**Custom styling**:
```typescript
<BaseCard 
  glowIntensity="high" 
  grainOpacity={0.15}
  className="p-8 h-[500px] bg-gradient-to-br from-purple-900/20"
>
  <h3>Custom Styled Card</h3>
</BaseCard>
```

### Styling Guarantees

BaseCard **always** provides:
- Rounded corners (`rounded-2xl` / 16px)
- Grain texture overlay (positioned absolute, pointer-events-none)
- Gradient border effect via inset shadow
- Hover glow transition (300ms duration)
- Backdrop blur effect on inner content area
- Proper z-index layering (overlay → border → content)

BaseCard **never** applies:
- Fixed width or height (consumer controls via className)
- Specific padding (consumer controls via className)
- Content layout (flexbox, grid, etc. - consumer controls)
- Color scheme beyond base card background (consumer can override)

---

## ToolCard Component

**Purpose**: Display AI tool in grid view with icon, description, category badge

**Location**: `src/components/cards/tool-card.tsx`

### Props Contract

```typescript
interface ToolCardProps {
  /** Tool configuration object */
  tool: ToolConfig;
  
  /** Current locale for i18n lookups */
  locale: string;
  
  /** Text for variant count label (i18n key) */
  variantText?: string;
}

// ToolConfig interface (from existing codebase)
interface ToolConfig {
  id: string;
  name: string;              // i18n key
  description: string;       // i18n key
  category: ToolCategory;
  icon: string;              // Lucide icon name
  variants: ToolVariant[];
}
```

### Default Values

```typescript
{
  variantText: "tools.seeMore"  // i18n key for "See more"
}
```

### Usage Example

```typescript
import { toolRegistry } from '@/config/tools';
import { ToolCard } from '@/components/cards/tool-card';

const tools = toolRegistry.getAll();

{tools.map(tool => (
  <ToolCard 
    key={tool.id}
    tool={tool}
    locale={locale}
  />
))}
```

### Rendering Behavior

ToolCard **always** renders:
- BaseCard wrapper with link to `/[locale]/tools/[tool.id]`
- Category badge (top-right, small uppercase label with category color)
- Tool icon (centered, large with glow effect)
- Tool name (bold, font-display)
- Tool description (truncated to 2 lines with ellipsis)
- "See More (X)" button (bottom, shows variant count)

ToolCard **never** renders:
- Without a category badge
- With placeholder/dummy data
- In a loading state (parent handles skeleton/loading)

### Category Color Mapping

```typescript
const categoryColors = {
  "Content Creation": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Image Analysis": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Social Media": "bg-purple-500/20 text-purple-400 border-purple-500/30"
};
```

### Accessibility

- Link has accessible name from tool name
- Icon has `aria-hidden="true"` (decorative)
- Description uses semantic markup
- Keyboard navigable (standard link behavior)
- Focus visible indicator (outline-ring)

---

## FeaturedToolCard Component

**Purpose**: Enhanced tool card for landing page hero section

**Location**: `src/components/cards/featured-tool-card.tsx`

### Props Contract

```typescript
interface FeaturedToolCardProps {
  /** Tool configuration object */
  tool: ToolConfig;
  
  /** Current locale for i18n lookups */
  locale: string;
  
  /** Card size variant */
  size?: "normal" | "large";
  
  /** Index for staggered animation delay */
  animationDelay?: number;
}
```

### Default Values

```typescript
{
  size: "normal",
  animationDelay: 0
}
```

### Usage Example

```typescript
<FeaturedToolCard 
  tool={storyCreatorTool}
  locale={locale}
  size="large"
  animationDelay={0.1}
/>
```

### Differences from ToolCard

| Feature | ToolCard | FeaturedToolCard |
|---------|----------|------------------|
| Height | h-[400px] | h-[320px] or h-[400px] (size-dependent) |
| Glow intensity | medium | high |
| Icon size | w-24 h-24 | w-24 h-24 or w-32 h-32 (size-dependent) |
| Hover animation | scale(1.05) | scale(1.08) + rotate(2deg) |
| Description lines | 2 | 3 |
| Call-to-action | "See More (X)" | "Learn More →" |

### Animation Integration

FeaturedToolCard integrates with FadeIn component:
```typescript
<FadeIn delay={animationDelay} direction="up">
  <FeaturedToolCard tool={tool} locale={locale} />
</FadeIn>
```

---

## VariantCard Component

**Purpose**: Selectable card for choosing tool variants

**Location**: `src/components/cards/variant-card.tsx`

### Props Contract

```typescript
interface VariantCardProps {
  /** Variant configuration */
  variant: ToolVariant;
  
  /** Whether this variant is currently selected */
  isSelected?: boolean;
  
  /** Click handler for variant selection */
  onClick: () => void;
  
  /** Optional Lucide icon override */
  icon?: LucideIcon;
  
  /** Optional simple-icons brand name */
  simpleIcon?: string;
  
  /** Optional custom icon path */
  customIconPath?: string;
}

// ToolVariant interface (from existing codebase)
interface ToolVariant {
  id: string;
  name: string;              // i18n key
  description?: string;      // i18n key (optional)
  icon?: string;
  simpleIcon?: string;
  customIconPath?: string;
}
```

### Default Values

```typescript
{
  isSelected: false
}
```

### Usage Example

```typescript
const [selectedVariant, setSelectedVariant] = useState(variants[0].id);

{variants.map(variant => (
  <VariantCard
    key={variant.id}
    variant={variant}
    isSelected={selectedVariant === variant.id}
    onClick={() => setSelectedVariant(variant.id)}
  />
))}
```

### Selection States

**Unselected (default)**:
- Border: outline-[var(--accent-brand)]/40
- Opacity: 90%
- Scale: 1
- Rotation: 0deg

**Selected (isSelected=true)**:
- Border: outline-[var(--accent-brand)] (full opacity)
- Opacity: 100%
- Scale: 1.02
- Glow: Enhanced shadow with accent color

**Hover (any state)**:
- Scale: 1.05 (or 1.07 if selected)
- Rotation: 6deg
- Glow particles animate (decorative blur effects)

### Icon Priority

VariantCard resolves icon in this order:
1. `customIconPath` prop (if provided) → renders Image component
2. `simpleIcon` prop (if provided) → renders SimpleIconWrapper
3. `icon` prop (if provided) → renders Lucide icon
4. Variant config values (same priority)
5. No icon → centered text only

### Accessibility

- Renders as `<button>` (not div with onClick)
- Has accessible name from variant name
- Selected state indicated via `aria-selected="true"`
- Keyboard navigable with arrow keys (when in group)
- Focus visible indicator

---

## Component Composition Patterns

### Pattern 1: Direct Composition

```typescript
// ToolCard composes BaseCard internally
export function ToolCard({ tool, locale }: ToolCardProps) {
  return (
    <BaseCard 
      href={`/${locale}/tools/${tool.id}`}
      className="h-[400px] p-6 flex flex-col"
    >
      {/* Tool-specific content */}
    </BaseCard>
  );
}
```

### Pattern 2: Wrapper + Children

```typescript
// Consumer wraps own content with BaseCard
<BaseCard className="p-6">
  <CustomToolContent />
</BaseCard>
```

### Pattern 3: Conditional Rendering

```typescript
// VariantCard adapts based on isSelected prop
<BaseCard 
  className={cn(
    "transition-all duration-300",
    isSelected && "outline-[var(--accent-brand)] scale-102"
  )}
  onClick={onClick}
>
  {/* Variant content */}
</BaseCard>
```

---

## Breaking Changes Policy

### Non-Breaking (Safe to Change)

- Internal styling implementation (as long as visual output matches)
- Default prop values (backwards compatible)
- Adding optional props
- Performance optimizations

### Breaking (Requires Major Version)

- Removing required props
- Changing prop types
- Removing default values that consumers rely on
- Changing className behavior (e.g., switching from merge to override)
- Changing component export name

---

## Testing Contract

Each card component **must**:
1. Render without errors when given minimum required props
2. Handle missing optional props gracefully (use defaults)
3. Properly forward className (merge, not override)
4. Maintain visual consistency across all card types (via BaseCard)
5. Support keyboard navigation (when interactive)
6. Work in all three locales (en/ru/ar) with RTL support

Each card component **must not**:
1. Cause layout shift during hydration
2. Break responsive grid when used in collections
3. Throw runtime errors on invalid locale
4. Render unstyled flash before CSS loads
5. Block user interaction during non-critical updates
