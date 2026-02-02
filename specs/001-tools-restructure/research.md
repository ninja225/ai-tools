# Research: Tools Platform Restructure

**Purpose**: Resolve all technical unknowns and establish implementation decisions for 6-tool restructure  
**Date**: 2026-02-02  
**Input**: Technical Context unknowns from [plan.md](plan.md)

## Research Areas

### 1. Image Upload for Scene Mood Describer

**Question**: How to handle image uploads in Next.js 16 App Router for AI vision analysis?

**Decision**: Server Actions + FormData with base64 encoding

**Rationale**:
- Next.js 16 Server Actions natively handle FormData (no custom API routes needed)
- Base64 encoding required for OpenRouter vision models
- Client Component for file input + preview, Server Action for validation + API call
- Dual validation (client + server) for security

**Implementation Approach**:

```typescript
// Client Component: Image upload UI
'use client';
export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  
  async function handleUpload(formData: FormData) {
    // Client validation: file size, type
    const file = formData.get('image') as File;
    if (file.size > 10 * 1024 * 1024) throw new Error('Max 10MB');
    
    // Preview
    setPreview(URL.createObjectURL(file));
    
    // Submit to Server Action
    const result = await analyzeSceneMood(formData);
  }
}

// Server Action: Validation + OpenRouter call
'use server';
export async function analyzeSceneMood(formData: FormData) {
  const file = formData.get('image') as File;
  
  // Server validation: magic bytes, MIME type, size
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  
  // OpenRouter multimodal format
  const response = await openrouter.chat({
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: systemPrompt },
        { type: 'image_url', image_url: { url: `data:${file.type};base64,${base64}` }}
      ]
    }]
  });
}
```

**Key Considerations**:
- File inputs require `'use client'` directive
- Validate file signatures (magic bytes) on server for security
- Use `useActionState` for form state management
- Progressive enhancement built-in with Server Actions
- Vision models support: OpenRouter supports `image_url` type in messages array

**Alternatives Considered**:
- ❌ Custom API Route: More boilerplate, Server Actions cleaner for Next.js 16
- ❌ Client-side OpenRouter call: Exposes API keys, no security validation
- ❌ Cloudinary/CDN: Unnecessary complexity for initial version, file system sufficient

---

### 2. System Prompt Engineering for New Tools

**Question**: What prompt structure and techniques should each new tool use?

#### 2.1 Scene Creator (Story → Video Prompts)

**Decision**: Professional Video Director role with 7-component scene structure

**Role Definition**:
```
You are a Professional Video Director and Cinematographer with 15 years experience 
in commercial and narrative video production. You specialize in translating written 
stories into detailed visual scene descriptions for AI video generation.
```

**Prompt Structure**:
1. **Role & Expertise** - Video director, cinematography knowledge
2. **Task Definition** - Convert story into 3-7 scenes depending on length
3. **Scene Components** (7 required elements per scene):
   - Visual Description (what's in frame, subject, environment)
   - Camera Work (shot type, angle, movement - e.g., "Wide shot, low angle, slow dolly in")
   - Lighting (quality, direction, mood - e.g., "Golden hour, backlit, soft shadows")
   - Action Details (what happens, character movements)
   - Mood & Atmosphere (emotional tone, pacing)
   - Duration (suggested length in seconds)
   - Transition (how scene connects to next)
4. **AI Video Constraints** - Static shots preferred for AI stability, avoid complex camera moves
5. **Output Format** - XML structure with `<scene>` tags for each scene
6. **Cinematography Vocabulary** - Shot types (CU, MS, WS, ECU), angles (eye-level, Dutch tilt), movements (pan, tilt, dolly, zoom)

**Example Scene Output**:
```xml
<scene number="1">
  <visual>A lone astronaut sits in a dimly lit spacecraft cockpit, surrounded by blinking console lights. Earth visible through window, distant and small.</visual>
  <camera>Medium shot, slight high angle, static</camera>
  <lighting>Practical lights from console (blue/green glow), rim light from Earth reflection</lighting>
  <action>Astronaut types slowly on keyboard, pauses, looks at Earth through window</action>
  <mood>Melancholic, isolated, contemplative</mood>
  <duration>8-10 seconds</duration>
  <transition>Fade to black, 1 second</transition>
</scene>
```

**DO's**:
- ✅ Use specific cinematography terms
- ✅ Consider AI video generation limitations (avoid complex motion)
- ✅ Maintain visual continuity between scenes
- ✅ Specify practical details (lighting sources, props)
- ✅ Include temporal pacing (scene duration)

**DON'Ts**:
- ❌ Vague descriptions ("nice lighting", "interesting angle")
- ❌ Complex camera choreography (AI can't handle intricate moves)
- ❌ Unrealistic scene changes (jarring transitions)
- ❌ Abstract concepts without visual grounding

---

#### 2.2 Quote Generator (Theme → Short Quotes)

**Decision**: Content Strategist & Aphorism Writer role with anti-cliché focus

**Role Definition**:
```
You are a Content Strategist and Aphorism Writer with expertise in crafting 
memorable, original quotes for social media. You specialize in avoiding clichés 
and creating fresh perspectives on timeless themes.
```

**Prompt Structure**:
1. **Role & Expertise** - Content strategy, linguistic craft
2. **Task Definition** - Generate 5-20 quotes under 100 characters for specific theme
3. **Freshness Requirement** - CRITICAL: Avoid clichés, database of 10,000+ overused phrases to avoid
4. **Character Limit** - Strict <100 char limit with precise counting logic
5. **Theme Guidelines** - Specific approach for each of 8 themes:
   - **Motivation**: Action-focused, second person, specific verbs
   - **Wisdom**: Paradoxes, unexpected insights, thought-provoking
   - **Life**: Observational, relatable, modern context
   - **Love**: Nuanced, non-romantic interpretations, contemporary
   - **Success**: Process over outcome, redefined metrics
   - **Happiness**: Subtle, anti-toxic-positivity, grounded
   - **Strength**: Vulnerability embrace, reframed weakness
   - **Creativity**: Process celebration, anti-perfectionism
6. **Linguistic Techniques** - Alliteration, parallel structure, unexpected juxtaposition, contemporary slang
7. **Output Format** - Plain text list, one quote per line, NO numbering
8. **Validation** - Each quote checked against cliché database before output

**Example Output** (Motivation theme):
```
Start before you're ready. Momentum builds confidence, not the reverse.
Your future self is watching. Make them proud today.
Small daily wins compound into unrecognizable transformation.
Discomfort is data. It's showing you exactly where to grow.
Action cures overthinking. Five minutes of doing beats five hours of planning.
```

**DO's**:
- ✅ Use modern, conversational language (2026 slang acceptable)
- ✅ Create unexpected perspectives on familiar themes
- ✅ Keep under 100 characters (critical for image overlay)
- ✅ Use specific, concrete imagery over abstractions
- ✅ Test each quote: "Would I actually share this?"

**DON'Ts**:
- ❌ Clichés: "follow your dreams", "be yourself", "live laugh love"
- ❌ Fortune cookie wisdom: "he who...", "a wise person..."
- ❌ Toxic positivity: "just be happy", "good vibes only"
- ❌ Overused metaphors: "journey of a thousand miles"
- ❌ Generic advice: "work hard", "never give up"

**Cliché Detection**:
Before finalizing output, check each quote against common patterns:
- Rhyming platitudes ("If you believe, you can achieve")
- Overused metaphors (light/darkness, journey, path, mountain)
- Instagram quote clichés (hustle culture, toxic positivity)
- Traditional proverbs rephrased

---

#### 2.3 Reels Creator (Topic → 3-Part Package)

**Decision**: Senior Short-Form Video Creator role with integrated output format

**Role Definition**:
```
You are a Senior Short-Form Video Creator with expertise in Instagram Reels, 
TikTok, and YouTube Shorts. You understand platform psychology, retention hooks, 
and the integration of concept, script, and visual elements.
```

**Prompt Structure**:
1. **Role & Expertise** - Short-form video mastery, platform psychology
2. **Task Definition** - Generate 3 integrated outputs: Concept + Voice-over Script + Video Prompts
3. **Platform Psychology** - Hooks (first 3 seconds), retention (pattern interrupts), closers (CTA/loop)
4. **Output Components**:
   - **Concept Idea** (2-3 sentences): The hook, message, why it works
   - **Voice-Over Script** (30-60 seconds): Natural speech with [PAUSE] markers, 140-160 words/min
   - **Video Prompts** (3-5 scenes): AI video generation prompts synchronized with script timing
5. **Timing Calculations** - Script: ~70-150 words for 30-60 sec, Scene duration matched to script segment
6. **Natural Speech Patterns** - Conversational, [PAUSE], [EMPHASIS], sentence fragments acceptable
7. **Hook Types** - Question hook, shocking statement, relatable problem, unexpected fact
8. **Output Format** - XML structure with `<concept>`, `<script>`, `<scenes>` tags

**Example Output**:
```xml
<concept>
Hook: "Stop researching before you start." Message: Action beats preparation in creative work. 
Why it works: Counterintuitive, challenges perfectionism, relatable pain point for creators.
</concept>

<script timing="45 seconds">
[PAUSE] You're not blocked [PAUSE] you're researching.

There's a difference between preparation [EMPHASIS] and procrastination. 
And honestly? [PAUSE] Most "research" is just fear dressed up as productivity.

Here's what actually works: Start [PAUSE] create the worst version [PAUSE] 
then improve it. You'll learn more in 10 minutes of making than 10 hours of researching.

Your first draft teaches you what your second draft should be. [PAUSE] 
So stop Googling "how to start" [PAUSE] and just [EMPHASIS] start.
</script>

<scenes>
  <scene duration="0-8 seconds">
    Close-up of person staring at laptop, multiple browser tabs open, overwhelmed expression. 
    Soft indoor lighting, shallow depth of field, frustrated energy.
  </scene>
  <scene duration="8-20 seconds">
    Split screen: left side shows "research" (endless scrolling), right side shows "creation" (hands actively working). 
    Contrasting energy, warm lighting on creation side, cool on research side.
  </scene>
  <scene duration="20-35 seconds">
    Person actively creating (drawing/writing/building), energized, making mistakes and fixing them quickly. 
    Fast-paced editing, natural lighting, dynamic angles.
  </scene>
  <scene duration="35-45 seconds">
    Final shot: proud creator looking at finished (imperfect) work, genuine smile. 
    Golden hour lighting, slight slow-motion, warm and accomplished mood.
  </scene>
</scenes>
```

**DO's**:
- ✅ Write for ear, not eye (conversational, contractions, fragments OK)
- ✅ Include [PAUSE] markers for natural rhythm
- ✅ Sync scene durations with script segments
- ✅ Strong hook in first 3 seconds (question, shock, relatability)
- ✅ End with subtle CTA or loop ("So next time..." → implies follow for more)

**DON'Ts**:
- ❌ Formal, written-language style ("One must consider...")
- ❌ Long, complex sentences (lose viewer attention)
- ❌ Mismatched visual-audio timing
- ❌ Weak hooks ("In this video I'll talk about...")
- ❌ Explicit "like and subscribe" begging (subtle CTAs only)

---

#### 2.4 Scene Mood Describer (Image → AI Regeneration Prompt)

**Decision**: Visual Analyst & AI Prompt Engineer role with 7-category analysis framework

**Role Definition**:
```
You are a Visual Analyst and AI Prompt Engineer specializing in translating 
photographic images into detailed text prompts for AI image generation. You 
combine technical photography knowledge with AI model optimization.
```

**Prompt Structure**:
1. **Role & Expertise** - Visual analysis, photography, AI prompt engineering
2. **Task Definition** - Analyze uploaded image, generate detailed prompt for AI regeneration
3. **Analysis Framework** (7 categories):
   - **Lighting** - Quality (hard/soft), direction, time of day, color temperature (Kelvin scale)
   - **Color Palette** - Dominant colors, saturation level, temperature (warm/cool), mood
   - **Composition** - Rule of thirds, leading lines, symmetry, framing, depth
   - **Atmosphere** - Mood, weather, environment, emotional tone
   - **Texture & Detail** - Surface qualities, fine details, material properties
   - **Subject Matter** - Main subject, secondary elements, spatial relationships
   - **Technical Specs** - Depth of field, focus point, perspective
4. **Photography Vocabulary** - Kelvin scale (3000K-7000K), f-stops, focal length implications, lighting ratios
5. **AI Optimization** - Specific model keywords (e.g., "volumetric lighting", "bokeh", "film grain")
6. **Output Format** - Single consolidated prompt paragraph (not checklist analysis)

**Example Output**:
```
A solitary figure stands on a misty pier at dawn, photographed with a 85mm lens 
creating shallow depth of field (f/2.8). Golden hour lighting (3200K color temperature) 
from camera right creates long shadows and rim lighting on the subject's silhouette. 
Soft diffused backlight through morning fog, low contrast, desaturated cool tones 
with warm highlights. Minimalist composition following rule of thirds, subject 
positioned right-third, vast negative space in left two-thirds emphasizes isolation. 
Atmospheric perspective with foggy background, wooden pier planks create leading lines 
toward horizon. Melancholic, contemplative mood. Fine film grain texture, slight vignette, 
muted color grading. Bokeh in foreground from water droplets on camera lens.
```

**DO's**:
- ✅ Use specific technical terminology (Kelvin, f-stops, focal length)
- ✅ Describe lighting direction and quality precisely
- ✅ Include color temperature and palette specifics
- ✅ Mention composition techniques by name
- ✅ Consolidate into single prompt paragraph (AI generators prefer this)
- ✅ Include mood/atmosphere descriptors
- ✅ Add technical photography details (depth of field, perspective)

**DON'Ts**:
- ❌ Generic descriptions ("nice lighting", "good composition")
- ❌ Checklist format (AI models want prose paragraphs)
- ❌ Omit technical details (temperature, lighting ratios)
- ❌ Forget atmosphere and mood descriptors
- ❌ Use vague terms ("somewhat bright", "kind of colorful")

**Vision Model Input**:
Scene mood describer receives image via OpenRouter vision models:
```typescript
{
  messages: [{
    role: 'user',
    content: [
      { type: 'text', text: systemPromptWithInstructions },
      { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,...' }}
    ]
  }]
}
```

---

### 3. Platform-Specific Content Best Practices

**Question**: What are optimal content strategies for VK, Facebook, and Yandex Dzen in 2026?

#### 3.1 VK (VKontakte) - Russian Social Network

**Optimal Length**: 700-900 characters (not words)

**Tone & Style**:
- Conversational, authentic, direct
- Russian audiences value substance over polish
- 2-4 emojis acceptable (not excessive)
- 3-7 hashtags at end of post (not inline)

**Content Structure**:
1. **Hook** (first 1-2 lines): Question or relatable statement
2. **Body** (main content): Personal stories, practical insights, community connection
3. **Hashtags** (end): #тег1 #тег2 #тег3 (Russian hashtags preferred)

**Cultural Considerations**:
- Authenticity > perfection (rough edges accepted)
- Community-oriented (less individualistic than US platforms)
- Direct communication preferred (avoid corporate speak)
- Humor: Self-deprecating, situational, observational

**2026 Trends**:
- Micro-communities within VK groups (niche targeting)
- Radical transparency (behind-scenes, failures shared)
- Anti-algorithm authenticity (real posts perform better than optimized)
- Video integration (short clips embedded in text posts)

**System Prompt Guidelines**:
```markdown
- Write in conversational Russian, 700-900 characters
- Start with relatable question or statement
- Include personal anecdote or practical insight
- Use 2-4 emojis naturally (not forced)
- End with 3-7 Russian hashtags: #практика #совет #личноемнение
- Authentic tone, avoid corporate/marketing language
- Community connection: "Кто-нибудь сталкивался?" "Поделитесь опытом"
```

---

#### 3.2 Facebook - Multi-language, International

**English Variant**:

**Optimal Length**: 40-80 characters (yes, very short!)

**Tone & Style**:
- Warm, inclusive, conversational
- 1-2 emojis maximum (less is more)
- Minimal hashtags (1-2 or none)
- Question-based or curiosity-driven

**Content Structure**:
1. **Hook** (entire post if 40-80 chars): Question or emotional trigger
2. **Optional elaboration** in comments (if needed)

**2026 Trends**:
- Facebook Groups prioritized by algorithm (community > public posts)
- Short posts massively outperform long (40-80 char sweet spot)
- AI transparency (users appreciate knowing if AI-generated)
- Cross-posting to Threads (owned by Meta, synergy benefits)

**Arabic Variant**:

**Optimal Length**: 60-120 characters (slightly longer than English)

**Tone & Style**:
- Respectful, family-centric, warm
- Formal enough to show respect (avoid overly casual slang)
- Emojis used sparingly (1-2, culturally appropriate)
- Hashtags: 2-3, can include English hashtags for reach

**Cultural Considerations**:
- Family and community central themes
- Avoid topics: politics, religion (unless explicitly appropriate), controversial social issues
- Modesty in language and topics
- Friday/weekend posts (Friday sacred, weekend family time)
- Ramadan awareness (if March-April timing)

**Content Structure**:
1. **Hook** (respectful, inclusive): "هل فكرت يومًا في..." (Have you ever thought about...)
2. **Value statement** (insight or question): Practical wisdom, family relevance
3. **Optional hashtags**: #تطوير_الذات #حياة_إيجابية

**2026 Trends**:
- Video dominates (even for text concepts, short video preferred)
- Community groups over public feed
- WhatsApp integration (cross-sharing to WhatsApp Status)

---

#### 3.3 Yandex Dzen - Russian Long-Form Content

**Optimal Length**: 2,000-2,500 characters (long-form article)

**Tone & Style**:
- Expert yet accessible (balance authority and readability)
- Structured with subheadings (scannable)
- 0-3 emojis (functional, not decorative - like ⚡ for key point)
- No hashtags (not part of Dzen culture)

**Content Structure**:
1. **Title** (compelling, keyword-rich): "Как [решить проблему]: [конкретный результат]"
2. **Hook paragraph** (2-3 sentences): Problem + promise
3. **Subheading 1**: First key point with explanation
4. **Subheading 2**: Second key point with example
5. **Subheading 3**: Third key point with actionable advice
6. **Conclusion**: Summary + soft CTA (subscribe to channel)

**Cultural Considerations**:
- Russian readers expect substance (no fluff)
- Practical, actionable advice valued
- Personal expertise + research citations (hybrid approach)
- Lists, numbered steps, clear structure preferred

**2026 Trends**:
- Video integration (embed short explainer videos in articles)
- Expert verification badges (credibility increasingly important)
- Quality > quantity (algorithm rewards depth over frequency)
- Series content (multi-part articles perform well)

**System Prompt Guidelines**:
```markdown
- Write structured article, 2,000-2,500 characters
- Create compelling title with practical promise
- Use 3-4 subheadings (## formatting)
- Include specific examples and actionable steps
- Balance expertise with accessibility
- Conclude with value summary + gentle CTA: "Подписывайтесь, чтобы не пропустить новые материалы"
- Minimal emojis (0-3, functional only)
- No hashtags
- Lists and numbered steps where appropriate
```

---

## Implementation Decisions Summary

| Area | Decision | Rationale |
|------|----------|-----------|
| **Image Upload** | Server Actions + base64 | Native Next.js 16, secure, no custom API routes needed |
| **Scene Creator Role** | Professional Video Director | Cinematography expertise, 7-component scene structure |
| **Quote Generator Focus** | Anti-cliché + <100 char | Freshness critical for social media, overlay length constraint |
| **Reels Creator Format** | 3-part XML output | Integrated concept/script/scenes for complete workflow |
| **Scene Mood Role** | Visual Analyst + AI Prompt Engineer | Photography + AI optimization expertise |
| **VK Strategy** | 700-900 chars, authentic | Community-oriented, substance over polish |
| **Facebook Strategy** | 40-80 chars (EN), 60-120 (AR) | Algorithm favors brevity, cultural sensitivity for Arabic |
| **Dzen Strategy** | 2,000-2,500 chars, structured | Long-form expertise, scannable subheadings |

---

## Next Steps: Phase 1

With research complete, Phase 1 will generate:
1. **data-model.md** - Entity definitions for ToolConfig, system prompts, generation requests
2. **contracts/** - API specifications for each new tool
3. **quickstart.md** - Developer guide for adding new tools
4. **Agent context update** - Update `.github/agents/copilot.md` with new tool technologies

All research unknowns now resolved. Ready to proceed to design phase.
