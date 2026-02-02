# API Contract: Reels Creator

**Tool**: reels-creator  
**Purpose**: Generate complete reel package - concept, voice-over script, and video prompts  
**Version**: 1.0.0

## Tool Configuration Endpoint

### GET /api/tools/reels-creator/config

Returns tool configuration for UI rendering.

**Response** (200 OK):
```json
{
  "id": "reels-creator",
  "name": "Reels Creator",
  "description": "Complete package for short-form video: concept, script, and video prompts",
  "category": "content",
  "defaultModel": "arcee-ai/trinity-large-preview:free",
  "allowedModels": [
    "arcee-ai/trinity-mini:free",
    "openai/gpt-oss-120b:free",
    "deepseek/deepseek-r1-0528:free"
  ],
  "inputs": [
    {
      "id": "topic",
      "label": "Reel Topic",
      "type": "textarea",
      "placeholder": "What's your reel about? (e.g., 'why creators burn out')",
      "required": true
    },
    {
      "id": "language",
      "label": "Output Language",
      "type": "select",
      "required": true,
      "options": [
        { "value": "english", "label": "English" },
        { "value": "russian", "label": "Russian" },
        { "value": "arabic", "label": "Arabic" }
      ]
    }
  ],
  "variants": [
    {
      "id": "general",
      "name": "Short-Form Reel",
      "description": "30-60 second reel with concept, script, and visuals",
      "systemPromptPath": "prompts/reels/general/{language}.md",
      "lucideIcon": "film"
    }
  ]
}
```

---

## Generation Endpoint

### POST /api/generate

Generate complete reel package (concept + script + video prompts).

**Request Body**:
```json
{
  "toolId": "reels-creator",
  "variantId": "general",
  "model": "arcee-ai/trinity-mini:free",
  "inputs": {
    "topic": "why creators burn out",
    "language": "english"
  }
}
```

**Validation Rules**:
- `topic`: 10-200 characters (enforced)
- `language`: Must be one of "english", "russian", "arabic"
- `model`: Must be in allowedModels array

**Response** (200 OK):
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440002",
  "toolId": "reels-creator",
  "variantId": "general",
  "status": "completed",
  "content": "<concept>\nHook: \"You're not lazy, you're exhausted.\" Message: Creator burnout stems from constant output without creative input. Solution: Schedule 'consumption' time intentionally. Why it works: Counterintuitive, challenges hustle culture, offers actionable framework.\n</concept>\n\n<script timing=\"45 seconds\">\n[PAUSE] You're not lazy [PAUSE] you're exhausted.\n\nAnd there's a difference.\n\nCreators burn out because we treat content like a factory. [PAUSE] Input, output. Input, output. But creativity doesn't work like that.\n\nYou know what every burned-out creator I've met has in common? [EMPHASIS] They stopped consuming.\n\nNo reading. No art. No walks without a camera. [PAUSE] Just constant production.\n\nHere's the fix: [PAUSE] Schedule your input time like you schedule your output time. \n\nMonday morning? [PAUSE] That's reading time. Not \"productive\" reading. Just [EMPHASIS] interesting reading.\n\nBecause creativity isn't about grinding harder [PAUSE] it's about refilling the well.\n\nSo next time you feel stuck [PAUSE] ask yourself: when did I last fill up instead of pour out?\n</script>\n\n<scenes>\n  <scene duration=\"0-8 seconds\">\n    Creator sitting exhausted at desk, surrounded by Ring light, camera, notes. Dark under-eyes, defeated posture. Cool fluorescent lighting, cluttered workspace, tired energy.\n  </scene>\n  <scene duration=\"8-20 seconds\">\n    Split-screen animation: left side shows endless content upload cycle (hamster wheel visual), right side shows empty creative well. Contrasting colors: left (muted grays), right (depleted colors). Symbolic representation of exhaustion.\n  </scene>\n  <scene duration=\"20-32 seconds\">\n    Person reading book in natural light, taking notes leisurely. Then walking through park observing surroundings (no phone). Then watching art in gallery. Warm golden hour lighting, relaxed body language, curiosity in eyes.\n  </scene>\n  <scene duration=\"32-45 seconds\">\n    Same creator from opening, now energized at desk, creating with genuine enthusiasm. Better lighting, cleaner space, vibrant energy. Visual callback to scene 1 but transformed mood.\n  </scene>\n</scenes>",
  "metadata": {
    "model": "arcee-ai/trinity-mini:free",
    "tokensUsed": 980,
    "processingTime": 5200,
    "systemPromptUsed": "prompts/reels/general/en.md",
    "scriptDuration": "45 seconds",
    "scenesGenerated": 4
  },
  "timestamp": "2026-02-02T10:40:00Z"
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": {
    "topic": "Topic must be between 10 and 200 characters"
  }
}
```

---

## Output Format Specification

Reels creator generates XML-structured output with 3 required components.

### 1. Concept (2-3 sentences)
- **Hook**: Opening line that stops scroll
- **Message**: Core idea/lesson
- **Why it works**: Psychological/strategic rationale

### 2. Voice-Over Script (30-60 seconds)
- Natural speech patterns (contractions, fragments OK)
- `[PAUSE]` markers for pacing
- `[EMPHASIS]` markers for stress
- 70-150 words total (140-160 words/minute speech rate)
- Conversational, "written for ear" style

### 3. Video Prompts (3-5 scenes)
- Each scene synchronized with script timing (duration in seconds)
- Visual description suitable for AI video generation
- Lighting, mood, energy specified
- Logical flow and visual storytelling

**XML Structure**:
```xml
<concept>
Hook: "..." Message: ... Why it works: ...
</concept>

<script timing="[duration] seconds">
[Voice-over text with [PAUSE] and [EMPHASIS] markers]
</script>

<scenes>
  <scene duration="[start]-[end] seconds">
    [Visual description with lighting, mood, composition]
  </scene>
  ...
</scenes>
```

---

## Usage Notes

- **Complete Package**: All 3 components integrate for full production workflow
- **Voice-Over Ready**: Script can be directly copied to text-to-speech tools
- **Video Generation Ready**: Scene prompts designed for AI video tools (Runway, Pika)
- **Timing Sync**: Scene durations align with script segments for easy editing
- **Platform Agnostic**: Works for Instagram Reels, TikTok, YouTube Shorts
- **Language Support**: Full en/ru/ar support with culturally appropriate hooks
- **Hook Psychology**: First 3 seconds optimized for retention (question, shock, relatability)
