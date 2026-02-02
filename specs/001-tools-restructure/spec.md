# Feature Specification: Tools Platform Restructure

**Feature Branch**: `001-tools-restructure`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "Reorganize AI tools platform to include 6 essential content creation tools: story creator, post creator for social media, scene creator for video prompts, quotes generator, content creation tool for reels, and scene mood describer for image analysis"

## User Scenarios & Testing

### User Story 1 - Story Content Creation (Priority: P1)

As a content creator, I need to generate engaging stories or content pieces in multiple languages (Russian, English, Arabic) with different tones and lengths for my social media channels.

**Why this priority**: Core content generation capability - foundational for all other tools. Without quality story generation, the platform has no value.

**Independent Test**: Can be fully tested by selecting language, topic, tone, and length, then generating a story. Success means receiving a well-structured story in the requested language that matches the specified tone.

**Acceptance Scenarios**:

1. **Given** I'm on the story creator tool, **When** I input topic "lonely robot", select English language, engaging tone, and medium length, **Then** I receive a 250-400 word story in English with an engaging tone
2. **Given** I select Russian language, **When** I generate a story, **Then** the output contains only Russian text with modern 2026 slang and colloquialisms
3. **Given** I select Arabic language, **When** I generate a story, **Then** the output is in Arabic with proper RTL formatting

---

### User Story 2 - Social Media Post Generation (Priority: P1)

As a social media manager, I need to create platform-specific posts for VK, Facebook, or long-form articles for Yandex Dzen in multiple languages.

**Why this priority**: Direct monetization path - social media posts drive engagement and traffic. Equally critical as story generation for platform viability.

**Independent Test**: Can be tested by selecting a platform (VK/Facebook/Dzen), topic, language, and generating a post. Success means receiving platform-optimized content with appropriate length, style, and formatting.

**Acceptance Scenarios**:

1. **Given** I select VK as platform, **When** I input a topic and generate, **Then** I receive a post optimized for VK's character limits and audience style
2. **Given** I select Yandex Dzen, **When** I generate content, **Then** I receive a longer article format suitable for Dzen's blog-style platform
3. **Given** I select Facebook, **When** I generate in Arabic, **Then** the post is culturally appropriate for Arabic-speaking Facebook audiences

---

### User Story 3 - Video Scene Generation from Story (Priority: P2)

As a video creator, I need to convert my written story into detailed scene prompts that I can use with AI video generation tools to create visual content.

**Why this priority**: Enables video content production workflow - bridges text-to-video gap. Lower priority than core content generation but enables important use case.

**Independent Test**: Can be tested by pasting a story text and generating scene prompts. Success means receiving detailed, actionable scene descriptions with visual details, camera angles, mood, and timing.

**Acceptance Scenarios**:

1. **Given** I paste a 300-word story, **When** I generate scene prompts, **Then** I receive 3-5 distinct scene descriptions with visual details
2. **Given** a scene prompt is generated, **When** I review it, **Then** it includes camera angle, lighting, mood, action description, and duration suggestion
3. **Given** I have multiple scenes, **When** reviewing the output, **Then** scenes flow logically with smooth transitions

---

### User Story 4 - Quote Generation (Priority: P2)

As a designer/marketer, I need to generate inspirational or themed quotes in multiple languages that I can overlay on images for social media posting.

**Why this priority**: Quick content wins - quotes drive high engagement with low production effort. P2 because it's standalone value, not dependent on other tools.

**Independent Test**: Can be tested by selecting theme, language, and generating quotes. Success means receiving 5-10 short, impactful quotes suitable for image overlay.

**Acceptance Scenarios**:

1. **Given** I select "motivation" theme in English, **When** I generate quotes, **Then** I receive 5-10 motivational quotes under 100 characters each
2. **Given** I select Russian language, **When** I generate quotes, **Then** quotes use contemporary Russian expressions and are culturally relevant
3. **Given** generated quotes, **When** I review them, **Then** none are clichéd or overused phrases

---

### User Story 5 - Reels Content Creation (Priority: P3)

As a short-form video creator, I need a complete package: the concept idea, script text for voice-over, and video generation prompts for creating Instagram Reels or TikTok content.

**Why this priority**: Comprehensive workflow tool. P3 because it combines multiple outputs - can be delivered after core generation tools are stable.

**Independent Test**: Can be tested by selecting reel topic and generating. Success means receiving three components: concept summary, voice-over script, and scene-by-scene video prompts.

**Acceptance Scenarios**:

1. **Given** I input a reel topic, **When** I generate, **Then** I receive a concept idea (2-3 sentences), voice-over script (30-60 seconds), and 3-5 video prompts
2. **Given** the voice-over script is generated, **When** I copy it to text-to-speech tool, **Then** it reads naturally with appropriate pacing markers
3. **Given** video prompts are generated, **When** I use them in AI video tools, **Then** they produce coherent short-form video scenes

---

### User Story 6 - Scene Mood Describer (Priority: P3)

As a photographer/designer, I need to upload an image and receive detailed prompt descriptions capturing the scene's mood, lighting, composition, and atmosphere so I can recreate similar vibes.

**Why this priority**: Reverse engineering tool - valuable but specialized use case. P3 because it requires image upload/analysis infrastructure.

**Independent Test**: Can be tested by uploading an image and receiving a prompt. Success means getting detailed description of mood, lighting, colors, composition, and atmosphere that could recreate the scene.

**Acceptance Scenarios**:

1. **Given** I upload a moody sunset image, **When** analysis completes, **Then** I receive prompt describing golden hour lighting, warm color palette, silhouette composition
2. **Given** I upload a high-contrast black and white image, **When** analysis completes, **Then** the prompt captures dramatic lighting, tonal range, and noir atmosphere
3. **Given** generated prompt, **When** I use it in image generation AI, **Then** it produces images with similar mood and aesthetic

---

### Edge Cases

**Resolved in Requirements:**
- **FR-034**: System MUST truncate input text exceeding 10,000 words with warning message before generation
- **FR-035**: System MUST display error message "Language not supported" for non-en/ru/ar language selection and default to English
- **FR-028**: Handles corrupted images (server validation with magic bytes)
- **FR-036**: Quote generator MUST filter outputs through content moderation check before display (block offensive content)
- **FR-037**: System MUST show user-friendly error "Service temporarily unavailable" when OpenRouter API fails, with retry button
- **FR-038**: System MUST queue concurrent requests from same user with "Request queued" status indicator

## Requirements

### Functional Requirements

**Core Generation:**
- **FR-001**: System MUST support three languages (English, Russian, Arabic) with proper RTL formatting for Arabic
- **FR-002**: System MUST enforce output language in system prompts to prevent LLM from responding in unintended language
- **FR-003**: All tools MUST use OpenRouter API with configurable model selection
- **FR-004**: System MUST validate all user inputs before API calls

**Story Creator Tool:**
- **FR-005**: Story creator MUST accept inputs: topic (text), language (en/ru/ar), tone (engaging/emotional/funny/dramatic/sad/hopeful/motivational/fantasy), length (short/medium/long)
- **FR-006**: Story creator MUST generate stories with lengths: short (100-150 words), medium (250-400 words), long (600-900 words)
- **FR-007**: Generated stories MUST follow modern prompt engineering structure with role definition, architecture, and quality guidelines

**Post Creator Tool:**
- **FR-008**: Post creator MUST support platforms: VK, Facebook, Yandex Dzen
- **FR-009**: Post creator MUST accept inputs: platform, topic, language, tone
- **FR-010**: VK posts MUST be optimized for 700-900 characters with authentic tone and 3-7 hashtags
- **FR-011**: Facebook posts MUST be 40-80 characters (English) or 60-120 characters (Arabic), use warm tone with engaging questions, minimal hashtags, family-centric for Arabic audiences
- **FR-012**: Dzen articles MUST be longer format (2000-2500 characters) with structured sections and subheadings

**Scene Creator Tool:**
- **FR-013**: Scene creator MUST accept story text as input (paste or upload)
- **FR-014**: Scene creator MUST generate 3-7 scenes depending on story length
- **FR-015**: Each scene MUST include: visual description, camera angle/movement, lighting/mood, action details, suggested duration
- **FR-016**: Scenes MUST maintain narrative continuity and logical transitions

**Quote Generator Tool:**
- **FR-017**: Quote generator MUST accept inputs: theme, language (en/ru/ar), quantity (5-20)
- **FR-018**: Generated quotes MUST be under 100 characters for easy image overlay
- **FR-019**: Quotes MUST avoid clichés and overused phrases
- **FR-020**: System MUST support themes: motivation, wisdom, life, love, success, happiness, strength, creativity

**Reels Content Tool:**
- **FR-021**: Reels tool MUST generate three outputs: concept idea, voice-over script, video prompts
- **FR-022**: Voice-over script MUST be optimized for 30-60 second duration
- **FR-023**: Video prompts MUST be 3-5 scenes suitable for 15-60 second reels
- **FR-024**: Concept idea MUST summarize the reel's hook and message

**Scene Mood Describer Tool:**
- **FR-025**: Scene mood describer MUST accept image uploads (JPEG, PNG, WebP formats, max 10MB)
- **FR-026**: System MUST analyze: lighting conditions, color palette, composition, mood/atmosphere, subject matter
- **FR-027**: Generated prompt MUST be detailed enough to recreate similar aesthetic in AI image generators
- **FR-028**: System MUST handle common image issues (low resolution, motion blur) gracefully

**UI/UX Requirements:**
- **FR-029**: Tool listing page MUST display all 6 tools with unique icons and descriptions
- **FR-030**: Each tool page MUST show input form, generation button, and output display area
- **FR-031**: System MUST show loading states during generation (estimated time)
- **FR-032**: Generated content MUST be copyable with one-click copy button
- **FR-033**: System MUST show error messages in user's selected UI language

### Key Entities

- **Tool**: Represents a content generation tool with unique identifier, name, description, icon, input schema, and supported variants
- **Tool Variant**: Platform or format-specific version of a tool (e.g., VK post, Facebook post, Dzen article)
- **Generation Request**: User's input parameters for content generation including tool, variant, language, and custom inputs
- **Generated Content**: LLM output including raw text, formatted text, metadata (tokens, model, timestamp), and processing status
- **System Prompt**: Template-based instructions for LLM with placeholders for dynamic content, stored per tool/variant/language combination

### Assumptions

- Users have basic understanding of AI content generation
- OpenRouter API remains primary provider (no fallback providers in initial version)
- Image upload for scene mood describer uses client-side upload (no CDN initially)
- Token costs are acceptable for free-tier OpenRouter models
- Users are creating content for personal/small business use (not enterprise scale)
- Generated content may require human editing before publication

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can generate content in any supported tool within 10 seconds (excluding LLM processing time)
- **SC-002**: Generated content matches requested language 100% of time (verified through testing)
- **SC-003**: Story creator produces stories within specified word count ranges (±10% tolerance)
- **SC-004**: Scene prompts from scene creator are detailed enough for AI video generation (minimum 50 words per scene)
- **SC-005**: Quote generator produces non-clichéd quotes (verified by human review - less than 10% overlap with common quote databases)
- **SC-006**: Reels content includes all three required components (concept, script, video prompts) in every generation
- **SC-007**: Scene mood describer generates prompts that capture visual essence (verified through regeneration similarity testing)
- **SC-008**: Platform experiences zero downtime from tool-specific bugs (tools are independent per constitution)
- **SC-009**: Tool configuration changes can be made without code deployment (prompts stored as markdown files)
- **SC-010**: Users can navigate between all 6 tools without page reloads (smooth SPA experience)

## Notes

This feature involves significant refactoring:
- Remove existing `image-prompt` tool (no longer needed)
- Rename/restructure `social-media-post` to `post-creator` with clearer platform focus
- Add 4 new tools: `scene-creator`, `quote-generator`, `reels-creator`, `scene-mood-describer`
- Each tool requires separate configuration files, system prompts (×3 languages where applicable), and UI components
- Scene mood describer is the only tool requiring image upload capability (new infrastructure)
