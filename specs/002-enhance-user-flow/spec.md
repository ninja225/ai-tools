# Feature Specification: UI Enhancement and User Flow Optimization

**Feature Branch**: `002-enhance-user-flow`  
**Created**: February 2, 2026  
**Status**: Draft  
**Input**: User description: "Implement all tools in the UI with proper components following best practices. Maintain existing theme, styles, and colors. Check existing packages before installing new ones. Enhance user flow for landing page, tools page, and category-specific tool pages."

## Clarifications

### Session 2026-02-02

- Q: Which tools should be featured on the landing page (spec mentions "2-3 prominent tool previews")? → A: Feature the most-used tools based on the primary use case (Story Creator and Post Creator as shown in current implementation)
- Q: For the variant selection interface on tool pages, which UI pattern should be used (spec allows "dropdowns, tabs, or radio groups")? → A: Use tabs for 2-4 variants, dropdown for 5+ variants (progressive disclosure based on cognitive load)
- Q: Should category filtering on the tools page be client-side or server-side? → A: Client-side filtering with URL parameter updates (instant feedback + shareable URLs)
- Q: What timeout duration and user actions should be provided when API endpoints are slow? → A: 15-second timeout with retry button and cancel option (balanced between patience and user control)
- Q: How should category badges be styled on tool cards (visual treatment: color, size, position)? → A: Small uppercase label in top-right corner with category-specific accent colors
- Q: How should the three different card designs be organized (landing page cards, tool-card, variant-card)? → A: Extract shared styling into a separate reusable BaseCard component file (components/cards/base-card.tsx) that all card variants import and compose, eliminating duplication while maintaining consistency
- Q: Should the duplicate prompts folder (src/prompts with old story templates) be removed? → A: Yes, remove src/prompts folder as the active prompts are in /prompts with proper multi-language support

### Session 2026-02-03

- Q: Does installing shadcn/ui components via CLI violate the zero-dependency constraint since FR-002 says "no new dependencies" but FR-019 requires installing shadcn components? → A: shadcn/ui adds component source files to the project (not npm packages), so it does not violate the zero-dependency constraint
- Q: What input validation and sanitization strategy should be implemented to prevent security issues (injection attacks, malformed data)? → A: Both client and server: Validate on client for UX using Zod schemas, re-validate on server for security (defense-in-depth). Zod package is already installed in dependencies.
- Q: What UI should be displayed when category filtering returns zero tools (e.g., user filters by a category with no tools)? → A: Empty state with "No tools found in [Category]" message, illustration/icon, and "Clear filters" or "View All Tools" link
- Q: What should happen when a user switches variants while a generation is in progress (concurrent interaction scenario)? → A: Cancel current generation: Abort the in-flight API request (using AbortController), update variant selection, require user to click Generate again
- Q: What specific animation values should be used for card and component animations (opacity, scale, duration)? → A: opacity: 0→1 (300ms), scale: 0.95→1 (300ms) - industry-standard subtle entrance animations

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete Tool Implementation with Consistent UI (Priority: P1)

A user visits the tools page and sees all six tools (Story Creator, Post Creator, Scene Creator, Quote Generator, Reels Creator, Scene Mood Describer) with consistent styling, clear descriptions, and intuitive navigation. Each tool has a dedicated page with proper components that follow the existing retro-themed design.

**Why this priority**: This is the core functionality that delivers immediate value by making all tools accessible and usable. Without complete tool implementation, users cannot access the full platform capabilities.

**Independent Test**: Can be fully tested by navigating to /tools and verifying all six tools are displayed with proper cards, icons, and links, and clicking each tool navigates to its dedicated page with functional UI components.

**Acceptance Scenarios**:

1. **Given** a user is on the landing page, **When** they click "Explore Tools" button, **Then** they are taken to the tools page showing all six tools in an organized grid layout with consistent styling
2. **Given** a user is on the tools page, **When** they view the tool cards, **Then** each card displays the tool name, description, icon, category, and variant count using the existing retro theme (dark background, accent brand colors, grain texture)
3. **Given** a user clicks on any tool card, **When** the tool page loads, **Then** they see a properly structured page with tool variants, input options, and generation controls following existing component patterns
4. **Given** a user interacts with tool components, **When** they select variants or input data, **Then** all UI components (buttons, dropdowns, inputs) use existing shadcn/ui components from the project without introducing new dependencies

---

### User Story 2 - Enhanced Landing Page Experience (Priority: P2)

A first-time visitor lands on the home page and immediately understands the platform's purpose, sees featured tools prominently displayed, and is guided toward exploring the full tool collection. The page provides a compelling introduction with smooth animations and clear call-to-action.

**Why this priority**: The landing page is the first impression and primary entry point. An optimized landing page improves user engagement and conversion to tool usage, but the tools themselves (P1) must work first.

**Independent Test**: Can be tested independently by loading the home page and verifying hero section clarity, featured tool previews are compelling, animations load smoothly, and the "Explore Tools" CTA is prominent and functional.

**Acceptance Scenarios**:

1. **Given** a new user visits the landing page, **When** the page loads, **Then** they see a clear hero section with the platform title, subtitle describing the purpose, and a prominent "Explore Tools" button with retro-shadow styling
2. **Given** a user scrolls down the landing page, **When** they view the featured tools section, **Then** they see 2 highlight tools (Story Creator and Post Creator) with preview cards that use the existing card design pattern (gradient borders, grain texture, hover glow effects)
3. **Given** a user views the landing page, **When** elements come into view, **Then** smooth fade-in animations trigger using the existing FadeIn component with staggered delays
4. **Given** a user hovers over featured tool cards, **When** their cursor enters the card area, **Then** the card displays enhanced visual feedback (increased glow opacity, scale transformation) consistent with existing hover states

---

### User Story 3 - Tool Categorization and Navigation (Priority: P3)

Users can browse tools by category (Content Creation, Image Analysis, Social Media) with clear visual grouping on the tools page. Category filters or tabs allow quick access to specific tool types, improving discoverability for users with specific needs.

**Why this priority**: This improves user experience for returning users and those with specific needs, but is less critical than having all tools visible and functional (P1) and an effective landing page (P2).

**Independent Test**: Can be tested by navigating to the tools page and verifying tools are grouped by category, filters/tabs function correctly, and category indicators are visible on each tool card.

**Acceptance Scenarios**:

1. **Given** a user is on the tools page, **When** they view the tool grid, **Then** tools are organized with category headers or tags showing "Content Creation" (Story Creator, Post Creator, Reels Creator), "Image Analysis" (Scene Creator, Scene Mood Describer), and "Social Media" (Quote Generator)
2. **Given** a user wants to filter tools, **When** they interact with category tabs or filter controls, **Then** only tools in the selected category are displayed while maintaining the existing grid layout
3. **Given** a user views a tool card, **When** they look at the category indicator, **Then** each card displays its category as a small uppercase label in the top-right corner with category-specific accent colors
4. **Given** a user interacts with category navigation, **When** they switch between categories, **Then** transitions are smooth using framer-motion animations already in the project

---

### User Story 4 - Code Organization and Component Refactoring (Priority: P3)

Developers maintain a clean, organized codebase with unified card components that share common styling logic, eliminating code duplication. Unused files are removed, and necessary shadcn/ui components are properly installed for consistent form controls.

**Why this priority**: This improves maintainability and developer experience but doesn't directly impact end-user functionality. It should be done alongside other UI work to prevent technical debt.

**Independent Test**: Can be tested by verifying the src/prompts folder is deleted, card components share a base component, shadcn components are installed and functional, and no duplicate styling code exists across card types.

**Acceptance Scenarios**:

1. **Given** a developer reviews the project structure, **When** they check the prompts folders, **Then** only /prompts exists with multi-language support and src/prompts (old story templates) is deleted
2. **Given** a developer examines card components, **When** they review the code, **Then** all three card types (FeaturedToolCard, ToolCard, VariantCard) import and compose the separate BaseCard component (components/cards/base-card.tsx) which contains common retro styling (grain texture, gradient borders, glow effects)
3. **Given** a developer needs to use form controls on tool pages, **When** they import shadcn components, **Then** tabs, select, label, input, textarea, and toast components are available and properly styled with the project theme
4. **Given** a developer modifies card styling, **When** they update the BaseCard component, **Then** changes automatically apply to all card variants without needing to update multiple files

---

### Edge Cases

- What happens when a user has JavaScript disabled and animations cannot run? The page must remain functional with content still accessible, falling back to static layout.
- How does the system handle tools with many variants (5+ options)? The UI must prevent overwhelming the user by implementing scrollable variant lists or grouped variant presentation.
- What happens when a tool's API endpoint is slow or unresponsive? Loading states must be displayed using the existing LoadingState component with a 15-second timeout, then show error message with retry button and cancel option.
- What happens when a user switches tool variants while a generation is currently in progress? The system must immediately cancel the in-flight API request using AbortController, update the variant selection, and require the user to click Generate again, preventing race conditions and ensuring users understand they must explicitly start the new generation.
- How does the layout adapt on mobile devices with narrow screens? The grid must collapse to single-column, cards must remain readable, and touch targets must be appropriately sized.
- What happens when a user filters by a category that currently has no tools? The system must display an empty state with "No tools found in [Category]" message, an icon, and a "Clear filters" or "View All Tools" link, preventing user confusion about whether the filter is broken or the category is genuinely empty.
- What happens when a user navigates directly to a tool URL that doesn't exist? A 404 page should display with navigation back to the tools page, maintaining the site theme.
- What happens when a user submits invalid input that fails client-side validation? Clear, specific error messages must be displayed inline near the invalid field using toast notifications or field-level error text, with actionable guidance on how to correct the input.
- What happens if malicious input bypasses client validation and reaches the server? Server-side validation must catch and reject the request with appropriate HTTP error codes (400 Bad Request), log the attempt for security monitoring, and return sanitized error messages that don't expose internal system details.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all six tools (Story Creator, Post Creator, Scene Creator, Quote Generator, Reels Creator, Scene Mood Describer) on the tools page with consistent card components
- **FR-002**: System MUST use only existing packages listed in package.json (framer-motion, lucide-react, @radix-ui components, tailwindcss, zod, etc.) without adding new npm dependencies (Note: shadcn/ui components add source files to the project, not npm packages, so they do not violate this constraint)
- **FR-003**: All tool pages MUST follow the existing design system including retro-shadow text effects, gradient card borders, grain textures, and the defined color palette (--accent-brand: #f7b807, --accent-shadow: #984731)
- **FR-004**: Landing page MUST feature 2 prominent tool previews (Story Creator and Post Creator) with direct links to those tool pages
- **FR-005**: Tool cards MUST display tool name, description, icon, category, and variant count in a consistent layout
- **FR-006**: System MUST categorize tools into logical groups: "Content Creation", "Image Analysis", and "Social Media"
- **FR-007**: Each tool page MUST include variant selection interface: tabs (@radix-ui/react-tabs) for tools with 2-4 variants, dropdown (@radix-ui/react-select) for tools with 5+ variants
- **FR-007a**: Post Creator is an exception that uses platform input selection (VK/Facebook/Dzen) instead of variants, as configured in src/config/tools/post-creator.ts with variants:[] and platform select input field
- **FR-008**: All animations MUST use the existing FadeIn component or framer-motion library already installed with standardized animation values (see FR-024 for specific timing and transformation values)
- **FR-009**: All interactive elements (buttons, cards, links) MUST provide hover states consistent with existing patterns (glow effects, opacity changes, scale transforms)
- **FR-010**: Mobile responsive design MUST adapt grid layouts from 3 columns (desktop) to 2 columns (tablet) to 1 column (mobile) using existing Tailwind breakpoints
- **FR-011**: System MUST use existing icon components from lucide-react for tool representations (BookOpen, Share2, Image, Video, Quote, Camera, etc.)
- **FR-012**: All component files MUST follow existing project structure conventions (components/cards/, components/ui/, components/animations/)
- **FR-013**: Tool pages MUST implement loading states using the existing LoadingState component during API calls
- **FR-014**: Navigation MUST be accessible via existing Next.js Link component with proper locale handling from next-intl
- **FR-015**: Category filtering on tools page MUST use client-side filtering with URL parameter updates to preserve filter state (enables instant feedback and shareable URLs)
- **FR-016**: Category badges on tool cards MUST be displayed as small uppercase labels positioned in the top-right corner with category-specific accent colors distinguishing each category type
- **FR-017**: System MUST remove the duplicate src/prompts folder (contains old story templates) as the active multi-language prompts are maintained in /prompts root folder
- **FR-018**: Card components MUST be refactored into a unified component system with a separate, reusable BaseCard component file (components/cards/base-card.tsx) that exports shared styling as a composable component, which FeaturedToolCard, ToolCard, and VariantCard import and wrap to eliminate code duplication
- **FR-019**: Required shadcn/ui components MUST be added to the project using the shadcn CLI (npx shadcn@latest add <component>): tabs, select, label, input, textarea, and toast components for tool page functionality. These are added as source files in components/ui/, not as npm package dependencies.
- **FR-020**: System MUST implement client-side input validation using Zod schemas (already installed: zod ^4.3.6) to validate prompt inputs, file sizes, file types, and API parameters before sending requests, providing immediate user feedback and reducing invalid server requests.
- **FR-021**: System MUST implement server-side input validation and sanitization in all API route handlers to re-validate inputs, sanitize user text to prevent injection attacks, and ensure security boundaries cannot be bypassed (defense-in-depth strategy).
- **FR-022**: When category filtering returns zero tools, system MUST display an empty state UI with "No tools found in [Category Name]" message, an illustration or icon from lucide-react, and a prominent "Clear filters" button or "View All Tools" link to help users recover from the empty state.
- **FR-023**: When a user switches tool variants during an active generation, system MUST immediately abort the in-flight API request using AbortController, update the variant selection in the UI, and require the user to manually click the Generate button again to start a new generation with the newly selected variant (prevents race conditions and ensures clean state management).
- **FR-024**: All card and component entrance animations MUST use the following standardized values: opacity transition from 0 to 1 over 300ms, scale transition from 0.95 to 1 over 300ms, using easing functions from framer-motion (e.g., ease-out). These values ensure smooth, professional animations that enhance UX without being distracting.

### Key Entities

- **BaseCard**: Separate reusable component file (components/cards/base-card.tsx) containing shared retro styling (grain texture overlay, gradient borders, hover glow effects, transition animations) exported as a composable wrapper component that other card types import and use to ensure consistency and eliminate duplication.
- **Tool Card**: Represents a tool in the grid view with name, description, icon, category badge, variant count, and interactive hover state. Composes BaseCard. Links to the tool's dedicated page.
- **Featured Tool Card**: Enhanced tool card for landing page with larger dimensions, more prominent visual effects, and additional marketing copy. Composes BaseCard with promotional styling overrides.
- **Variant Card**: Selectable card for choosing tool variants within a tool page, featuring centered icon/logo, variant name, and optional description. Composes BaseCard with selection state styling.
- **Tool Page**: Full-page view for a single tool including header section with tool name/description, variant selector, input area, generation controls, and output display. Follows the existing page structure with RetroGradient background.
- **Category**: Logical grouping of tools (Content Creation, Image Analysis, Social Media) displayed as badges on cards and used for filtering/organization.
- **Tool Variant**: Different configurations of a tool (e.g., "General Story", "TikTok Story", "Reels Story") selectable by the user within a tool page.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate from landing page to any of the six tool pages in under 3 clicks (Home → Explore Tools → Tool Selection → Tool Page)
- **SC-002**: All tool cards and pages load with complete styling and functionality without any console errors related to missing dependencies or components
- **SC-003**: 100% of interactive elements (buttons, cards, links) display proper hover states and visual feedback consistent with the existing design system
- **SC-004**: Mobile users on screens 375px wide can access and use all tool features with readable text and properly sized touch targets (minimum 44x44px)
- **SC-005**: Page load times remain under 2 seconds on standard broadband connections with all animations and styling fully rendered
- **SC-006**: Zero new npm packages are installed, all UI functionality is implemented using the existing 30 dependencies in package.json
- **SC-007**: Users successfully complete tool generation tasks with 95% success rate using the implemented UI components and workflows
