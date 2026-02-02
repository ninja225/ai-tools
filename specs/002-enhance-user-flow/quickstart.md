# Quickstart: UI Enhancement and User Flow Optimization

**Feature**: 002-enhance-user-flow  
**Branch**: `002-enhance-user-flow`  
**Date**: 2026-02-02

## Prerequisites

- Node.js 20+
- pnpm 9+
- Git repository initialized
- Existing AI Tools Platform codebase on `001-tools-restructure` branch

## Development Setup

### 1. Branch and Environment

```bash
# Ensure you're on the feature branch
git checkout 002-enhance-user-flow

# Install dependencies (if not already installed)
pnpm install

# Verify TypeScript setup
pnpm tsc --noEmit
```

### 2. Install shadcn/ui Components

```bash
# Install required UI components for tool pages
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add label
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add toast

# Verify components were added
ls src/components/ui/
# Should see: tabs.tsx, select.tsx, label.tsx, input.tsx, textarea.tsx, toast.tsx
```

### 3. Remove Duplicate Prompts Folder

```bash
# Delete old prompts folder
rm -rf src/prompts

# Verify deletion
ls -la src/ | grep prompts
# Should return nothing

# Keep root prompts folder (active multi-language prompts)
ls -la prompts/
# Should show: post/ quote/ reels/ scene/ scene-mood/ story/
```

### 4. Start Development Server

```bash
# Start Next.js dev server with Turbopack
pnpm dev

# Server runs on http://localhost:3000
```

## Implementation Order

Follow this sequence to implement the feature in logical, testable increments:

### Phase 1: Foundation (BaseCard Component)

**Goal**: Create reusable BaseCard component with retro styling

```bash
# Create BaseCard component
touch src/components/cards/base-card.tsx
```

**Test**: Create BaseCard with grain texture, gradient border, hover glow  
**Verify**: Import in a test page, confirm visual matches existing card style

---

### Phase 2: Card Refactoring

**Goal**: Refactor existing cards to use BaseCard

```bash
# Refactor existing cards
# Edit: src/components/cards/tool-card.tsx
# Edit: src/components/cards/variant-card.tsx
```

**Test**: Visit `/tools` page, verify cards render correctly  
**Verify**: No visual regression, cards maintain existing appearance

---

### Phase 3: Featured Tools on Landing Page

**Goal**: Add FeaturedToolCard component and update landing page

```bash
# Create FeaturedToolCard component
touch src/components/cards/featured-tool-card.tsx

# Edit landing page
# Edit: src/app/[locale]/page.tsx
```

**Test**: Visit `/` (landing page), verify 2 featured tools (Story Creator, Post Creator)  
**Verify**: Cards link to correct tool pages, animations smooth

---

### Phase 4: Category Filtering

**Goal**: Add category filter to tools page

```bash
# Create CategoryFilter component
touch src/components/tools/category-filter.tsx

# Update tools page
# Edit: src/app/[locale]/tools/page.tsx
```

**Test**: Visit `/tools`, click category tabs, verify filtering works  
**Verify**: URL updates with `?category=`, filtered tools display correctly, animations smooth

---

### Phase 5: Tool Page Layout

**Goal**: Create shared layout for tool pages

```bash
# Create ToolPageLayout component
touch src/components/tools/tool-page-layout.tsx
```

**Test**: Create test tool page using layout, verify structure  
**Verify**: Header, variant selector, form area, generation controls all render

---

### Phase 6: Individual Tool Pages (Repeat for Each Tool)

**Goal**: Implement dedicated page for each of 6 tools

```bash
# Create tool-specific form components
touch src/components/tools/story-creator-form.tsx
touch src/components/tools/post-creator-form.tsx
touch src/components/tools/scene-creator-form.tsx
touch src/components/tools/quote-generator-form.tsx
touch src/components/tools/reels-creator-form.tsx
touch src/components/tools/scene-mood-describer-form.tsx

# Tool pages already exist, add implementation
# Edit: src/app/[locale]/tools/story-creator/page.tsx
# Edit: src/app/[locale]/tools/post-creator/page.tsx
# Edit: src/app/[locale]/tools/scene-creator/page.tsx
# Edit: src/app/[locale]/tools/quote-generator/page.tsx
# Edit: src/app/[locale]/tools/reels-creator/page.tsx
# Edit: src/app/[locale]/tools/scene-mood-describer/page.tsx
```

**Test (per tool)**:
1. Visit `/tools/[tool-id]`
2. Verify variant selector (tabs if 2-4 variants, dropdown if 5+)
3. Fill form inputs
4. Click "Generate" button
5. Verify loading state displays
6. Verify generated output displays
7. Test timeout (wait 15s), verify retry button appears
8. Test cancel button during generation

---

### Phase 7: i18n Updates

**Goal**: Add missing UI text translations

```bash
# Edit translation files
# Edit: src/messages/en.json
# Edit: src/messages/ru.json
# Edit: src/messages/ar.json
```

**Add keys**:
- Category names (Content Creation, Image Analysis, Social Media)
- Filter UI text ("All Tools", "Showing X tools")
- Tool form labels and placeholders
- Error messages (timeout, generation failed)
- Success messages

**Test**: Switch languages, verify all text translates correctly  
**Verify**: RTL layout works for Arabic

---

## Testing Checklist

### Functionality Testing

**Landing Page**:
- [ ] Hero section renders with title, subtitle, CTA button
- [ ] 2 featured tools display (Story Creator, Post Creator)
- [ ] Featured cards link to correct tool pages
- [ ] Animations trigger on scroll (FadeIn with stagger)
- [ ] Hover states work on featured cards

**Tools List Page**:
- [ ] All 6 tools display in grid
- [ ] Category filter tabs render
- [ ] Clicking category filters tools correctly
- [ ] URL updates with `?category=` parameter
- [ ] Category badges show on each card
- [ ] Card hover states work
- [ ] Cards link to correct tool pages

**Tool Pages (Test Each)**:
- [ ] Tool page loads without errors
- [ ] Tool name and description display
- [ ] Variant selector shows (tabs if 2-4, dropdown if 5+)
- [ ] Selecting variant updates form
- [ ] All input fields render correctly
- [ ] Required field validation works
- [ ] Generate button triggers API call
- [ ] Loading state displays during generation
- [ ] Generated output displays on success
- [ ] Error message displays on failure
- [ ] Retry button works after error/timeout
- [ ] Cancel button aborts generation
- [ ] 15-second timeout triggers error message

### Visual Testing

**Desktop (1920x1080)**:
- [ ] 3-column grid on tools page
- [ ] Cards properly sized and spaced
- [ ] Text readable, not truncated
- [ ] Animations smooth (60fps)

**Tablet (768x1024)**:
- [ ] 2-column grid on tools page
- [ ] Cards resize appropriately
- [ ] Touch targets ≥ 44x44px

**Mobile (375x667)**:
- [ ] 1-column grid on tools page
- [ ] Cards full width, readable
- [ ] Form inputs accessible
- [ ] Buttons properly sized for touch

### Performance Testing

- [ ] Page load < 2 seconds (broadband)
- [ ] Filter transitions < 100ms
- [ ] No console errors
- [ ] No TypeScript errors (`pnpm tsc --noEmit`)
- [ ] No layout shift during page load

### i18n Testing

- [ ] Switch to English - all text displays
- [ ] Switch to Russian - all text displays
- [ ] Switch to Arabic - all text displays, RTL layout works
- [ ] Tool generation works in all languages

## Common Issues and Solutions

### Issue: shadcn components not themed correctly

**Solution**: Check `components.json` has correct CSS path:
```json
{
  "tailwind": {
    "css": "src/app/globals.css"
  }
}
```

Run `npx shadcn@latest add [component]` again if needed.

---

### Issue: Category filter not updating URL

**Solution**: Ensure component is marked `'use client'`:
```typescript
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
```

---

### Issue: Tool pages 404

**Solution**: Verify tool ID in URL matches tool config ID:
```typescript
// Tool config: id: "story-creator"
// URL must be: /tools/story-creator
```

---

### Issue: Timeout not working

**Solution**: Check AbortController is properly set up:
```typescript
const abortController = new AbortController();
const timeoutId = setTimeout(() => {
  abortController.abort();
}, 15000);

fetch(url, { signal: abortController.signal });
```

---

### Issue: BaseCard styling not applying

**Solution**: Verify Tailwind classes are not purged. Add to `tailwind.config.ts` if needed:
```typescript
content: [
  './src/components/**/*.{js,ts,jsx,tsx}',
  // ...
]
```

---

## Development Commands

```bash
# Type checking
pnpm tsc --noEmit

# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code (if prettier configured)
pnpm format
```

## File Structure Reference

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx                           # Landing page (Phase 3)
│   │   ├── tools/
│   │   │   ├── page.tsx                       # Tools list (Phase 4)
│   │   │   └── [toolId]/
│   │   │       └── page.tsx                   # Tool pages (Phase 6)
│   └── globals.css                            # Existing styles
├── components/
│   ├── cards/
│   │   ├── base-card.tsx                      # NEW (Phase 1)
│   │   ├── tool-card.tsx                      # REFACTOR (Phase 2)
│   │   ├── variant-card.tsx                   # REFACTOR (Phase 2)
│   │   └── featured-tool-card.tsx             # NEW (Phase 3)
│   ├── tools/
│   │   ├── category-filter.tsx                # NEW (Phase 4)
│   │   ├── tool-page-layout.tsx               # NEW (Phase 5)
│   │   └── [tool]-form.tsx × 6                # NEW (Phase 6)
│   └── ui/
│       ├── tabs.tsx                           # shadcn (Step 2)
│       ├── select.tsx                         # shadcn (Step 2)
│       ├── label.tsx                          # shadcn (Step 2)
│       ├── input.tsx                          # shadcn (Step 2)
│       ├── textarea.tsx                       # shadcn (Step 2)
│       └── toast.tsx                          # shadcn (Step 2)
└── messages/
    ├── en.json                                # i18n (Phase 7)
    ├── ru.json                                # i18n (Phase 7)
    └── ar.json                                # i18n (Phase 7)
```

## Next Steps After Implementation

1. ✅ Run full testing checklist
2. ✅ Verify TypeScript builds without errors
3. ✅ Test in all 3 languages (en, ru, ar)
4. ✅ Test on mobile, tablet, desktop
5. ✅ Commit changes with descriptive messages
6. ✅ Create pull request with summary
7. ✅ Deploy to staging for user testing

## Support

For questions or issues:
- Check data-model.md for component interfaces
- Check research.md for implementation decisions
- Review constitution.md for project standards
