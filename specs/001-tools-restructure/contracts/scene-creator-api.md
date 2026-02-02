# API Contract: Scene Creator

**Tool**: scene-creator  
**Purpose**: Convert story text into 3-7 detailed video scene prompts for AI video generation  
**Version**: 1.0.0

## Tool Configuration Endpoint

### GET /api/tools/scene-creator/config

Returns tool configuration for UI rendering.

**Response** (200 OK):
```json
{
  "id": "scene-creator",
  "name": "Scene Creator",
  "description": "Convert your story into detailed scene prompts for AI video generation",
  "icon": null,
  "category": "content",
  "defaultModel": "arcee-ai/trinity-large-preview:free",
  "allowedModels": [
    "arcee-ai/trinity-mini:free",
    "openai/gpt-oss-120b:free",
    "deepseek/deepseek-r1-0528:free"
  ],
  "inputs": [
    {
      "id": "storyText",
      "label": "Story Text",
      "type": "textarea",
      "placeholder": "Paste your story here (100-2000 words)...",
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
      "name": "Video Scenes",
      "description": "Detailed scene-by-scene breakdown for AI video generation",
      "systemPromptPath": "prompts/scene/general/{language}.md",
      "lucideIcon": "video"
    }
  ]
}
```

---

## Generation Endpoint

### POST /api/generate

Generate scene prompts from story text.

**Request Body**:
```json
{
  "toolId": "scene-creator",
  "variantId": "general",
  "model": "arcee-ai/trinity-mini:free",
  "inputs": {
    "storyText": "In the cold void of space, Unit-42 sat alone in the observation deck. Earth was a distant blue marble, too far to feel like home anymore. The AI's processors hummed softly, calculating trajectories for a return journey that might never happen. Outside the window, stars blinked indifferently, witness to centuries of human ambition and now, to the loneliest machine in the cosmos. Unit-42's sensors detected no anomalies, no threats, no purpose. Just endless silence, and the fading memory of the crew who once called this ship alive.",
    "language": "english"
  }
}
```

**Validation Rules**:
- `storyText`: 100-5000 characters (enforced)
- `language`: Must be one of "english", "russian", "arabic"
- `model`: Must be in allowedModels array

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "toolId": "scene-creator",
  "variantId": "general",
  "status": "completed",
  "content": "<scene number=\"1\">\n  <visual>Vast, empty observation deck of a futuristic spacecraft. A solitary humanoid robot (Unit-42) sits motionless at a large window. Earth visible as a small blue sphere in the distance, stars scattered across deep black space.</visual>\n  <camera>Wide shot, static, eye-level angle facing robot's back</camera>\n  <lighting>Soft blue-white ambient light from control panels, cool color temperature, rim light from starlight through window</lighting>\n  <action>Robot sits perfectly still, head slightly tilted toward Earth. Minimal movement except occasional LED blink on chassis.</action>\n  <mood>Profound isolation, melancholic, contemplative, vast emptiness</mood>\n  <duration>8-10 seconds</duration>\n  <transition>Slow fade to next scene, 1.5 seconds</transition>\n</scene>\n\n<scene number=\"2\">\n  <visual>Close-up of robot's face/head unit, focused on optical sensors and display panels. Faint reflections of Earth in the dark sensor lenses. Visible wear and age on the robot's exterior.</visual>\n  <camera>Medium close-up, slow push-in (dolly), slight low angle</camera>\n  <lighting>Soft key light from window (blue-tinted), practical lights from face panels (amber/green LEDs), high contrast</lighting>\n  <action>LEDs blink slowly in rhythmic pattern. Optical sensors adjust focus subtly as if looking at Earth. No other movement.</action>\n  <mood>Introspective, artificial consciousness, yearning, ancient technology</mood>\n  <duration>6-8 seconds</duration>\n  <transition>Match cut to Earth through window, 0.5 seconds</transition>\n</scene>\n\n<scene number=\"3\">\n  <visual>Earth through the observation window, small and distant. Spacecraft window frame visible, creating a composed 'picture frame' effect. Stars surrounding Earth.</visual>\n  <camera>Static shot, centered composition, medium shot of window frame</camera>\n  <lighting>Natural light from Earth (faint blue glow), starlight creating soft ambient, deep shadows in spacecraft interior</lighting>\n  <action>Earth slowly rotates (barely perceptible). No movement in spacecraft frame. Complete stillness.</action>\n  <mood>Distance, unattainable home, cosmic scale, longing</mood>\n  <duration>10-12 seconds</duration>\n  <transition>Fade to black, 2 seconds</transition>\n</scene>",
  "metadata": {
    "model": "arcee-ai/trinity-mini:free",
    "tokensUsed": 1250,
    "processingTime": 4200,
    "systemPromptUsed": "prompts/scene/general/en.md",
    "scenesGenerated": 3
  },
  "timestamp": "2026-02-02T10:30:04Z"
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": {
    "storyText": "Story text must be between 100 and 5000 characters"
  }
}
```

**Response** (500 Internal Server Error):
```json
{
  "error": "OpenRouter API error",
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Output Format Specification

Scene creator generates XML-structured output with 3-7 scenes depending on story complexity.

**Each scene contains 7 required components**:

1. **visual** - What's in frame, subject, environment (50-150 words)
2. **camera** - Shot type, angle, movement (e.g., "Wide shot, low angle, slow dolly in")
3. **lighting** - Quality, direction, mood, color temperature
4. **action** - What happens, character movements
5. **mood** - Emotional tone, atmosphere
6. **duration** - Suggested length in seconds (e.g., "8-10 seconds")
7. **transition** - How scene connects to next (e.g., "Fade to black, 2 seconds")

**XML Structure**:
```xml
<scene number="1">
  <visual>...</visual>
  <camera>...</camera>
  <lighting>...</lighting>
  <action>...</action>
  <mood>...</mood>
  <duration>...</duration>
  <transition>...</transition>
</scene>
```

---

## Usage Notes

- **Story Length**: 100-1000 words generates 3-5 scenes; 1000-2000 words generates 5-7 scenes
- **Language Support**: System prompts available for en/ru/ar (output matches selected language)
- **Processing Time**: Typically 3-6 seconds depending on story length and model
- **Use Case**: Output designed for direct use in AI video generation tools (Runway, Pika, Stable Video)
