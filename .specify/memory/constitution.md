<!--
SYNC IMPACT REPORT
==================
Version: 0.1.0 → 1.0.0 (MAJOR - Initial constitution establishment)
Date: 2026-02-02
Agent: GitHub Copilot (Claude Sonnet 4.5)

Changes:
- Initial constitution created for AI Tools Platform
- Established 5 core principles: Tool Modularity, System Prompt Excellence, Type Safety, Modern Best Practices, User Experience First
- Added Technology Stack Standards section
- Added Development Workflow section
- Defined governance rules and amendment procedures

Templates Status:
✅ plan-template.md - Reviewed, no updates required (general template structure compatible)
✅ spec-template.md - Reviewed, no updates required (user story prioritization aligns)
✅ tasks-template.md - Reviewed, no updates required (phase-based structure compatible)
✅ Agent files - Reviewed, speckit.constitution.agent.md references this file correctly

Follow-up TODOs:
- None - all placeholders filled
-->

# AI Tools Platform Constitution

## Core Principles

### I. Tool Modularity
Each AI tool MUST operate independently with clear boundaries:
- Each tool has its own configuration file in `src/config/tools/`
- Each tool variant has dedicated system prompts in `prompts/[tool]/[variant]/`
- Tools are registered in a central registry with explicit type definitions
- No cross-tool dependencies - each tool is self-contained
- Tool changes MUST NOT affect other tools

**Rationale**: Independent tools enable parallel development, easier testing, and safer deployments. If one tool breaks, others continue functioning.

### II. System Prompt Excellence
System prompts are first-class citizens requiring professional engineering:
- ALL prompts MUST follow modern prompt engineering best practices (role definition, concrete examples, structured thinking, output specifications
Clear role definition with specific expertise
Concrete examples and constraints
Structured thinking process
Output format specifications
Chain-of-thought prompting
Specific prohibitions
Quality criteria
Professional terminology
)
- Each language variant (en/ru/ar) MUST maintain consistent quality and structure
- Prompts use placeholder tokens (e.g., `{{topic}}`, `{{tone}}`) for dynamic content
- Prompts stored as markdown files in version control, never hardcoded
- Changes to prompts MUST be tested via command-line scripts before UI deployment
- Professional terminology required: "show don't tell", sensory details, contemporary language

**Rationale**: System prompts directly determine AI output quality. Treating them as code ensures consistency, testability, and maintainability across languages and iterations.

### III. Type Safety (NON-NEGOTIABLE)
TypeScript strict mode enforced throughout the codebase:
- All tool configurations MUST have explicit type definitions (`ToolConfig`, `ToolVariant`, `ToolInput`)
- API responses MUST be validated with Zod schemas
- No `any` types unless absolutely justified with inline comment
- Props interfaces required for all React components
- OpenRouter client responses MUST be typed

**Rationale**: Type safety catches errors at compile time, provides better IDE support, and serves as living documentation. This is non-negotiable for production reliability.

### IV. Modern Best Practices
Follow current (2026) web development standards:
- Next.js 16 App Router with React Server Components
- Async params handled with `React.use()` pattern
- i18n via next-intl with locale routing
- TailwindCSS 4 for styling with custom CSS variables
- Component composition over prop drilling
- Dark mode only (simplified, no theme toggle complexity)

**Rationale**: Modern patterns improve performance, reduce bugs, and ensure the codebase remains maintainable as the ecosystem evolves.

### V. User Experience First
User-facing features prioritized over developer convenience:
- Icons MUST be platform-specific (simple-icons for brands, Lucide for generic concepts)
- Language selection MUST enforce output language in system prompts
- UI animations MUST enhance (not distract): retro aesthetic with animated gradients, glow effects on interaction
- Loading states and error messages MUST be clear and actionable
- All user-facing text MUST be internationalized (en/ru/ar with RTL support)

**Rationale**: The platform exists to serve users. Technical excellence that doesn't translate to better UX is wasted effort.

## Technology Stack Standards

### Mandatory Technologies
- **Framework**: Next.js 16+ with App Router (Turbopack for dev)
- **Language**: TypeScript 5+ with strict mode
- **Styling**: TailwindCSS 4+ with custom design tokens
- **AI Provider**: OpenRouter with multi-model support
- **Icons**: simple-icons (brands) + Lucide React (generic) + custom SVG support
- **i18n**: next-intl with locale routing
- **State Management**: Zustand (when needed)
- **Validation**: Zod for runtime validation
- **Package Manager**: pnpm

### Prohibited Patterns
- ❌ Client-side only data fetching (use React Server Components)
- ❌ Inline styles (use TailwindCSS classes)
- ❌ Theme toggle complexity (dark mode only)
- ❌ Hardcoded text (use i18n)
- ❌ Generic icons for platform-specific content
- ❌ Chaining terminal commands with `&&` (use separate lines or `;`)

## Development Workflow

### Feature Development Process
1. **Specification**: Create feature spec using `/speckit.specify` with user stories prioritized (P1/P2/P3)
2. **Planning**: Generate implementation plan with `/speckit.plan` including constitution check
3. **Constitution Check**: Verify feature aligns with all 5 core principles before Phase 0 research
4. **Tasks**: Generate task list with `/speckit.tasks` organized by user story for independent implementation
5. **Implementation**: Execute tasks following TDD if tests requested, ensure type safety
6. **Testing**: Test via command-line scripts before UI integration
7. **Review**: Verify constitution compliance before merge

### Testing Strategy
- Command-line test scripts for system prompts (see `scripts/test-story-creator.js`)
- Manual testing across all supported languages (en/ru/ar)
- Type checking with `tsc --noEmit`
- Output quality evaluation before production deployment
- Integration tests for API routes when needed

### Prompt Engineering Workflow
1. Create/modify prompt markdown files in `prompts/[tool]/[variant]/`
2. Test via command-line script with real OpenRouter models
3. Evaluate output quality across multiple test cases
4. Apply same enhancements across all language variants (en/ru/ar)
5. Update UI integration only after command-line validation

## Governance

This constitution supersedes all other development practices and guidelines.

### Amendment Process
1. Propose change with clear rationale
2. Document impact on existing features and templates
3. Update affected templates in `.specify/templates/`
4. Update agent files in `.github/agents/` if needed
5. Increment version following semantic versioning:
   - **MAJOR**: Backward incompatible principle removal/redefinition
   - **MINOR**: New principle added or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
6. Create Sync Impact Report in HTML comment at top of file

### Compliance Requirements
- All feature specs MUST pass constitution check before Phase 0
- All PRs MUST verify compliance with applicable principles
- Complexity that violates principles MUST be explicitly justified in plan.md
- Template updates MUST maintain consistency with constitution principles

### Version Control
**Version**: 1.0.0 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02
