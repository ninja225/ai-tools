# Tasks: Tools Platform Restructure

**Input**: Design documents from `/specs/001-tools-restructure/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Tests are NOT requested in this feature specification. Focus on implementation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Web application structure:
- `src/` - Source code at repository root
- `prompts/` - System prompt markdown files
- `scripts/` - Command-line test scripts
- `public/` - Static assets

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Remove old tools and prepare foundation for 6-tool structure

- [X] T001 Remove image-prompt tool: delete src/config/tools/image-prompt.ts
- [X] T002 Remove image-prompt tool prompts: delete prompts/image-prompt/ directory
- [X] T003 [P] Update tool registry in src/config/tools/index.ts to remove image-prompt
- [X] T004 [P] Add file input type to ToolInput union in src/types/tool.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create ImageUpload component in src/components/tools/image-upload.tsx with client-side preview and validation
- [X] T006 Create prompt-loader utility in src/lib/utils/prompt-loader.ts for dynamic prompt loading with placeholder replacement
- [X] T007 [P] Add image upload translations to src/messages/en.json
- [X] T008 [P] Add image upload translations to src/messages/ru.json
- [X] T009 [P] Add image upload translations to src/messages/ar.json
- [X] T010 Audit all existing pages for missing translations - run scripts/audit-translations.js to compare src/app/**/page.tsx getTranslations() calls against src/messages/*.json keys, generate missing-keys.md report
- [X] T011 [P] Complete navigation and layout translations in src/messages/en.json (header, footer, navigation menu)
- [X] T012 [P] Complete navigation and layout translations in src/messages/ru.json with proper Russian terminology
- [X] T013 [P] Complete navigation and layout translations in src/messages/ar.json with RTL considerations
- [X] T014 [P] Add common UI element translations in src/messages/en.json (buttons, labels, placeholders, error messages)
- [X] T015 [P] Add common UI element translations in src/messages/ru.json
- [X] T016 [P] Add common UI element translations in src/messages/ar.json
- [X] T017 [P] Translate homepage content in src/messages/en.json
- [X] T018 [P] Translate homepage content in src/messages/ru.json
- [X] T019 [P] Translate homepage content in src/messages/ar.json
- [X] T020 [P] Translate about/documentation pages in src/messages/en.json
- [X] T021 [P] Translate about/documentation pages in src/messages/ru.json
- [X] T022 [P] Translate about/documentation pages in src/messages/ar.json
- [X] T023 [P] Implement loading state component in src/components/ui/loading-state.tsx with estimated time display (FR-031)
- [X] T024 [P] Implement copy-to-clipboard button component in src/components/ui/copy-button.tsx with success feedback (FR-032)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Story Content Creation (Priority: P1) 🎯 MVP

**Goal**: Keep and enhance existing story creator tool with verified system prompts

**Independent Test**: Select language/topic/tone/length, generate story, verify language enforcement and quality

### Implementation for User Story 1

- [X] T025 [P] [US1] Verify story-creator tool config in src/config/tools/story-creator.ts matches data model specifications
- [X] T026 [P] [US1] Verify existing system prompts in prompts/story/general/ (en.md, ru.md, ar.md) match modern prompt engineering structure from research.md
- [X] T027 [P] [US1] Update story creator translations in src/messages/en.json
- [X] T028 [P] [US1] Update story creator translations in src/messages/ru.json
- [X] T029 [P] [US1] Update story creator translations in src/messages/ar.json
- [X] T030 [US1] Test story creator with command-line script scripts/test-story-creator.js - verify English output
- [X] T031 [US1] Test story creator with Russian language - verify Cyrillic output with modern slang
- [X] T032 [US1] Test story creator with Arabic language - verify Arabic output with RTL formatting

**Checkpoint**: Story creator tool fully functional and tested across all 3 languages

---

## Phase 4: User Story 2 - Social Media Post Generation (Priority: P1) 🎯 MVP

**Goal**: Rename and enhance social-media-post tool to post-creator with VK, Facebook, Dzen optimizations

**Independent Test**: Select platform/topic/language, generate post, verify platform-specific optimization

### Implementation for User Story 2

- [ ] T033 [P] [US2] Rename social-media-post config: mv src/config/tools/social-media-post.ts src/config/tools/post-creator.ts
- [ ] T034 [P] [US2] Update tool ID and name in post-creator config to match new naming
- [ ] T035 [P] [US2] Rename prompt directory: mv prompts/social-media-post prompts/post
- [ ] T036 [P] [US2] Create VK system prompt in prompts/post/vk/en.md following research.md guidelines (700-900 chars, authentic tone, 3-7 hashtags)
- [ ] T037 [P] [US2] Create VK system prompt in prompts/post/vk/ru.md with Russian-specific cultural considerations
- [ ] T038 [P] [US2] Create VK system prompt in prompts/post/vk/ar.md with Arabic cultural considerations
- [ ] T039 [P] [US2] Create Facebook system prompt in prompts/post/facebook/en.md (40-80 chars, warm tone, minimal hashtags)
- [ ] T040 [P] [US2] Create Facebook system prompt in prompts/post/facebook/ru.md
- [ ] T041 [P] [US2] Create Facebook system prompt in prompts/post/facebook/ar.md (60-120 chars, respectful/formal, family-centric)
- [ ] T042 [P] [US2] Create Dzen system prompt in prompts/post/dzen/en.md (2000-2500 chars, structured article, subheadings)
- [ ] T043 [P] [US2] Create Dzen system prompt in prompts/post/dzen/ru.md with practical/actionable Russian content style
- [ ] T044 [P] [US2] Create Dzen system prompt in prompts/post/dzen/ar.md
- [ ] T045 [P] [US2] Add post creator translations to src/messages/en.json
- [ ] T046 [P] [US2] Add post creator translations to src/messages/ru.json
- [ ] T047 [P] [US2] Add post creator translations to src/messages/ar.json
- [ ] T048 [US2] Create command-line test script scripts/test-post-creator.js
- [ ] T049 [US2] Test VK variant with Russian language - verify 700-900 char limit and hashtag placement
- [ ] T050 [US2] Test Facebook variant with English language - verify 40-80 char brevity
- [ ] T051 [US2] Test Dzen variant with Russian language - verify 2000-2500 char article format with subheadings

**Checkpoint**: Post creator tool fully functional with all 3 platforms, tested across languages

---

## Phase 5: User Story 3 - Video Scene Generation from Story (Priority: P2)

**Goal**: Create scene creator tool that converts story text into 3-7 detailed video scene prompts

**Independent Test**: Paste story text, generate scenes, verify 7-component structure (visual/camera/lighting/action/mood/duration/transition)

### Implementation for User Story 3

- [ ] T052 [P] [US3] Create scene-creator tool config in src/config/tools/scene-creator.ts following data model
- [ ] T053 [P] [US3] Add scene creator to tool registry in src/config/tools/index.ts
- [ ] T054 [P] [US3] Create scene creator system prompt in prompts/scene/general/en.md (Professional Video Director role, 7-component structure)
- [ ] T055 [P] [US3] Create scene creator system prompt in prompts/scene/general/ru.md with cinematography terminology in Russian
- [ ] T056 [P] [US3] Create scene creator system prompt in prompts/scene/general/ar.md
- [ ] T057 [P] [US3] Add scene creator translations to src/messages/en.json
- [ ] T058 [P] [US3] Add scene creator translations to src/messages/ru.json
- [ ] T059 [P] [US3] Add scene creator translations to src/messages/ar.json
- [ ] T060 [US3] Create command-line test script scripts/test-scene-creator.js
- [ ] T061 [US3] Test scene creator with 300-word story in English - verify 3-5 scenes with all 7 components
- [ ] T062 [US3] Test scene creator with 1000-word story in Russian - verify 5-7 scenes with proper transitions
- [ ] T063 [US3] Verify XML output structure matches contracts/scene-creator-api.md specification

**Checkpoint**: Scene creator tool generates properly formatted video scene prompts

---

## Phase 6: User Story 4 - Quote Generation (Priority: P2)

**Goal**: Create quote generator tool with 8 theme variants, generating non-clichéd quotes under 100 characters

**Independent Test**: Select theme/language, generate quotes, verify <100 char limit and freshness (no clichés)

### Implementation for User Story 4

- [ ] T064 [P] [US4] Create quote-generator tool config in src/config/tools/quote-generator.ts with 8 variants
- [ ] T065 [P] [US4] Add quote generator to tool registry in src/config/tools/index.ts
- [ ] T066 [P] [US4] Create motivation theme prompt in prompts/quote/motivation/en.md (action-focused, second person)
- [ ] T067 [P] [US4] Create motivation theme prompt in prompts/quote/motivation/ru.md
- [ ] T068 [P] [US4] Create motivation theme prompt in prompts/quote/motivation/ar.md
- [ ] T069 [P] [US4] Create wisdom theme prompt in prompts/quote/wisdom/en.md (paradoxes, unexpected insights)
- [ ] T070 [P] [US4] Create wisdom theme prompt in prompts/quote/wisdom/ru.md
- [ ] T071 [P] [US4] Create wisdom theme prompt in prompts/quote/wisdom/ar.md
- [ ] T072 [P] [US4] Create life theme prompt in prompts/quote/life/en.md (observational, relatable)
- [ ] T073 [P] [US4] Create life theme prompt in prompts/quote/life/ru.md
- [ ] T074 [P] [US4] Create life theme prompt in prompts/quote/life/ar.md
- [ ] T075 [P] [US4] Create love theme prompt in prompts/quote/love/en.md (nuanced, non-romantic)
- [ ] T076 [P] [US4] Create love theme prompt in prompts/quote/love/ru.md
- [ ] T077 [P] [US4] Create love theme prompt in prompts/quote/love/ar.md
- [ ] T078 [P] [US4] Create success theme prompt in prompts/quote/success/en.md (process over outcome)
- [ ] T079 [P] [US4] Create success theme prompt in prompts/quote/success/ru.md
- [ ] T080 [P] [US4] Create success theme prompt in prompts/quote/success/ar.md
- [ ] T081 [P] [US4] Create happiness theme prompt in prompts/quote/happiness/en.md (grounded, anti-toxic-positivity)
- [ ] T082 [P] [US4] Create happiness theme prompt in prompts/quote/happiness/ru.md
- [ ] T083 [P] [US4] Create happiness theme prompt in prompts/quote/happiness/ar.md
- [ ] T084 [P] [US4] Create strength theme prompt in prompts/quote/strength/en.md (vulnerability-embracing)
- [ ] T085 [P] [US4] Create strength theme prompt in prompts/quote/strength/ru.md
- [ ] T086 [P] [US4] Create strength theme prompt in prompts/quote/strength/ar.md
- [ ] T087 [P] [US4] Create creativity theme prompt in prompts/quote/creativity/en.md (anti-perfectionism)
- [ ] T088 [P] [US4] Create creativity theme prompt in prompts/quote/creativity/ru.md
- [ ] T089 [P] [US4] Create creativity theme prompt in prompts/quote/creativity/ar.md
- [ ] T090 [P] [US4] Add quote generator translations to src/messages/en.json
- [ ] T091 [P] [US4] Add quote generator translations to src/messages/ru.json
- [ ] T092 [P] [US4] Add quote generator translations to src/messages/ar.json
- [ ] T093 [US4] Create command-line test script scripts/test-quote-generator.js
- [ ] T094 [US4] Test motivation theme in English - verify all quotes <100 chars, no clichés
- [ ] T095 [US4] Test wisdom theme in Russian - verify fresh perspectives, contemporary language
- [ ] T096 [US4] Test love theme in Arabic - verify culturally appropriate, non-romantic interpretations
- [ ] T097 [US4] Validate output format matches contracts/quote-generator-api.md (plain text, newline-separated, no numbering)

**Checkpoint**: Quote generator produces fresh, non-clichéd quotes for all 8 themes across 3 languages

---

## Phase 7: User Story 5 - Reels Content Creation (Priority: P3)

**Goal**: Create reels creator tool that generates complete package: concept, voice-over script, and video prompts

**Independent Test**: Input topic, generate reel package, verify 3 components (concept/script/scenes) with proper timing sync

### Implementation for User Story 5

- [ ] T098 [P] [US5] Create reels-creator tool config in src/config/tools/reels-creator.ts
- [ ] T099 [P] [US5] Add reels creator to tool registry in src/config/tools/index.ts
- [ ] T100 [P] [US5] Create reels creator system prompt in prompts/reels/general/en.md (Senior Short-Form Video Creator role, 3-part XML output)
- [ ] T101 [P] [US5] Create reels creator system prompt in prompts/reels/general/ru.md with natural Russian speech patterns
- [ ] T102 [P] [US5] Create reels creator system prompt in prompts/reels/general/ar.md
- [ ] T103 [P] [US5] Add reels creator translations to src/messages/en.json
- [ ] T104 [P] [US5] Add reels creator translations to src/messages/ru.json
- [ ] T105 [P] [US5] Add reels creator translations to src/messages/ar.json
- [ ] T106 [US5] Create command-line test script scripts/test-reels-creator.js
- [ ] T107 [US5] Test reels creator with topic "creator burnout" in English - verify concept hook, 30-60 sec script with [PAUSE] markers, 3-5 scenes
- [ ] T108 [US5] Test reels creator with Russian topic - verify natural speech patterns, scene timing sync with script segments
- [ ] T109 [US5] Validate output format matches contracts/reels-creator-api.md (XML with concept/script/scenes tags)

**Checkpoint**: Reels creator generates complete short-form video package ready for production

---

## Phase 8: User Story 6 - Scene Mood Analysis from Image (Priority: P3)

**Goal**: Create scene mood describer tool with image upload that generates detailed AI regeneration prompts

**Independent Test**: Upload image, receive detailed prompt with 7-category analysis (lighting/color/composition/atmosphere/texture/subject/technical)

### Implementation for User Story 6

- [ ] T110 [P] [US6] Create scene-mood-describer tool config in src/config/tools/scene-mood-describer.ts with file input type
- [ ] T111 [P] [US6] Add scene mood describer to tool registry in src/config/tools/index.ts
- [ ] T112 [P] [US6] Create scene mood describer system prompt in prompts/scene-mood/general/en.md (Visual Analyst role, 7-category framework, consolidated prose output)
- [ ] T113 [P] [US6] Add scene mood describer translations to src/messages/en.json
- [ ] T114 [P] [US6] Add scene mood describer translations to src/messages/ru.json
- [ ] T115 [P] [US6] Add scene mood describer translations to src/messages/ar.json
- [ ] T116 [US6] Create Server Action in src/app/api/analyze-scene-mood/route.ts for base64 image handling
- [ ] T117 [US6] Implement server-side image validation (magic bytes, MIME type, 10MB limit) in Server Action (FR-028, FR-035)
- [ ] T118 [US6] Implement OpenRouter vision API call with multimodal message format (image_url type)
- [ ] T119 [US6] Test scene mood describer with moody sunset image - verify golden hour lighting, warm palette, composition details in prompt
- [ ] T120 [US6] Test scene mood describer with high-contrast B&W image - verify dramatic lighting, tonal range description
- [ ] T121 [US6] Validate output format matches contracts/scene-mood-describer-api.md (single paragraph, 150-300 words, technical terminology)

**Checkpoint**: Scene mood describer analyzes images and generates AI-regeneration-ready prompts

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple tools

- [ ] T122 [P] Update README.md with complete list of 6 tools and their capabilities
- [ ] T123 [P] Update main tools listing page to display all 6 tools with correct icons
- [ ] T124 Verify all tools follow quickstart.md patterns for consistency
- [ ] T125 Run TypeScript type checking: tsc --noEmit
- [ ] T126 Test all tools in production build: pnpm build && pnpm start
- [ ] T127 [P] Document system prompt maintenance workflow in repository
- [ ] T128 [P] Implement input truncation for 10,000+ word inputs with warning message (FR-034)
- [ ] T129 [P] Implement unsupported language detection and default to English with error message (FR-035)
- [ ] T130 [P] Implement content moderation filter for quote generator to block offensive content (FR-036)
- [ ] T131 [P] Implement user-friendly API error handling with retry button (FR-037)
- [ ] T132 [P] Implement request queuing for concurrent requests from same user (FR-038)
- [ ] T133 [P] Final translation consistency audit across all src/messages/ files - verify no missing keys between en/ru/ar
- [ ] T134 [P] Test complete user journey in Russian language - verify all pages, navigation, and tools display properly
- [ ] T135 [P] Test complete user journey in Arabic language - verify RTL layout, all pages, navigation, and tools display properly
- [ ] T136 Verify constitution compliance checklist for all 6 tools

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1 (Story Creator) and US2 (Post Creator) are P1 - highest priority
  - US3 (Scene Creator) and US4 (Quote Generator) are P2 - can start after P1 complete OR in parallel if capacity
  - US5 (Reels Creator) and US6 (Scene Mood Describer) are P3 - lowest priority
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Story Creator - P1)**: Can start after Foundational - INDEPENDENT
- **US2 (Post Creator - P1)**: Can start after Foundational - INDEPENDENT
- **US3 (Scene Creator - P2)**: Can start after Foundational - INDEPENDENT (doesn't depend on US1/US2)
- **US4 (Quote Generator - P2)**: Can start after Foundational - INDEPENDENT
- **US5 (Reels Creator - P3)**: Can start after Foundational - INDEPENDENT (conceptually similar to US3 but separate)
- **US6 (Scene Mood Describer - P3)**: Can start after Foundational - INDEPENDENT (only tool with image upload)

### Within Each User Story

- Config files before prompt files (need structure to reference)
- All language variants of prompts can be created in parallel [P]
- Translations can be done in parallel [P]
- Command-line testing after all prompts exist
- Language-specific testing can be done in parallel

### Parallel Opportunities

**Phase 1 Setup**: All 4 tasks can run in parallel
**Phase 2 Foundational**: T007-T009 (translations) can run in parallel

**Once Foundational completes, ALL 6 user stories can start in parallel if team capacity allows:**

- Developer A: US1 (Story Creator) + US2 (Post Creator) - P1 tools
- Developer B: US3 (Scene Creator) + US4 (Quote Generator) - P2 tools
- Developer C: US5 (Reels Creator) + US6 (Scene Mood Describer) - P3 tools

**Within each user story, massive parallelization:**
- All prompt file creation tasks marked [P] (24 prompts for quote generator!)
- All translation tasks marked [P]
- Different themes/variants can be created simultaneously

---

## Parallel Example: User Story 4 (Quote Generator)

Quote generator has 8 themes × 3 languages = 24 prompt files. These can be created in parallel by multiple developers or AI assistants:

```bash
# Launch all motivation theme prompts together:
T051 [P] [US4] prompts/quote/motivation/en.md
T052 [P] [US4] prompts/quote/motivation/ru.md
T053 [P] [US4] prompts/quote/motivation/ar.md

# Launch all wisdom theme prompts together:
T054 [P] [US4] prompts/quote/wisdom/en.md
T055 [P] [US4] prompts/quote/wisdom/ru.md
T056 [P] [US4] prompts/quote/wisdom/ar.md

# ... and so on for all 8 themes
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only) - Recommended

1. Complete Phase 1: Setup (remove old image-prompt tool)
2. Complete Phase 2: Foundational (image upload, prompt loader)
3. Complete Phase 3: User Story 1 (Story Creator P1)
4. Complete Phase 4: User Story 2 (Post Creator P1)
5. **STOP and VALIDATE**: Test both P1 tools independently
6. Deploy/demo if ready - **Platform has core value with just 2 tools**

### Incremental Delivery Strategy

1. Foundation (Phase 1-2) → Infrastructure ready
2. Add US1 (Story Creator) → Test → **MVP v1.0**
3. Add US2 (Post Creator) → Test → **MVP v1.1**
4. Add US3 (Scene Creator) → Test → **v1.2**
5. Add US4 (Quote Generator) → Test → **v1.3**
6. Add US5 (Reels Creator) → Test → **v1.4**
7. Add US6 (Scene Mood Describer) → Test → **v2.0 - Full Platform**

Each story adds value without breaking previous stories!

### Parallel Team Strategy (Maximum Speed)

With 3 developers:

1. **Week 1**: Everyone works on Phase 1-2 (Foundation) together
2. **Week 2** (Foundation complete):
   - Developer A: US1 + US2 (P1 tools - 36 tasks)
   - Developer B: US3 + US4 (P2 tools - 46 tasks with 24 quote prompts!)
   - Developer C: US5 + US6 (P3 tools - 24 tasks)
3. **Week 3**: Integration, testing, polish
4. Stories complete independently, integrate smoothly

---

## Task Count Summary

- **Phase 1 (Setup)**: 4 tasks
- **Phase 2 (Foundational)**: 20 tasks (includes comprehensive translation audit + loading states + copy button)
- **Phase 3 (US1 - Story Creator P1)**: 8 tasks
- **Phase 4 (US2 - Post Creator P1)**: 19 tasks
- **Phase 5 (US3 - Scene Creator P2)**: 12 tasks
- **Phase 6 (US4 - Quote Generator P2)**: 34 tasks (8 themes × 3 languages!)
- **Phase 7 (US5 - Reels Creator P3)**: 12 tasks
- **Phase 8 (US6 - Scene Mood Describer P3)**: 12 tasks
- **Phase 9 (Polish)**: 15 tasks (includes edge case handling + translation verification + language journey testing)

**Total: 136 tasks**

**Parallelizable tasks**: 108 marked with [P] (79% can run in parallel!)

---

## Notes

- Constitution compliance verified: All tools follow modularity, system prompt excellence, type safety, modern practices, UX-first principles
- No tests requested in spec - focus is on implementation and manual validation via command-line scripts
- Massive parallelization opportunity in prompt file creation (49 prompt files total)
- Each user story delivers independent value and can be deployed separately
- Scene mood describer (US6) is the only tool requiring new infrastructure (image upload) - already built in Foundational phase
- Stop at any checkpoint to validate story works independently before proceeding
