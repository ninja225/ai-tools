# API Contract: Quote Generator

**Tool**: quote-generator  
**Purpose**: Generate 5-20 short, original quotes (<100 chars) for specific themes, avoiding clichés  
**Version**: 1.0.0

## Tool Configuration Endpoint

### GET /api/tools/quote-generator/config

Returns tool configuration for UI rendering.

**Response** (200 OK):
```json
{
  "id": "quote-generator",
  "name": "Quote Generator",
  "description": "Generate original, non-clichéd quotes for social media and design",
  "category": "content",
  "defaultModel": "arcee-ai/trinity-mini:free",
  "allowedModels": [
    "arcee-ai/trinity-mini:free",
    "openai/gpt-oss-120b:free"
  ],
  "inputs": [
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
    },
    {
      "id": "quantity",
      "label": "Number of Quotes",
      "type": "number",
      "required": true,
      "defaultValue": 10,
      "min": 5,
      "max": 20
    }
  ],
  "variants": [
    {
      "id": "motivation",
      "name": "Motivation",
      "description": "Action-focused motivational quotes",
      "systemPromptPath": "prompts/quote/motivation/{language}.md",
      "lucideIcon": "zap"
    },
    {
      "id": "wisdom",
      "name": "Wisdom",
      "description": "Thoughtful, paradoxical insights",
      "systemPromptPath": "prompts/quote/wisdom/{language}.md",
      "lucideIcon": "brain"
    },
    {
      "id": "life",
      "name": "Life",
      "description": "Relatable observations about daily life",
      "systemPromptPath": "prompts/quote/life/{language}.md",
      "lucideIcon": "heart"
    },
    {
      "id": "love",
      "name": "Love",
      "description": "Nuanced perspectives on connection",
      "systemPromptPath": "prompts/quote/love/{language}.md",
      "lucideIcon": "sparkles"
    },
    {
      "id": "success",
      "name": "Success",
      "description": "Process-focused success insights",
      "systemPromptPath": "prompts/quote/success/{language}.md",
      "lucideIcon": "trophy"
    },
    {
      "id": "happiness",
      "name": "Happiness",
      "description": "Grounded, authentic happiness quotes",
      "systemPromptPath": "prompts/quote/happiness/{language}.md",
      "lucideIcon": "smile"
    },
    {
      "id": "strength",
      "name": "Strength",
      "description": "Vulnerability-embracing strength quotes",
      "systemPromptPath": "prompts/quote/strength/{language}.md",
      "lucideIcon": "shield"
    },
    {
      "id": "creativity",
      "name": "Creativity",
      "description": "Anti-perfectionist creative insights",
      "systemPromptPath": "prompts/quote/creativity/{language}.md",
      "lucideIcon": "palette"
    }
  ]
}
```

---

## Generation Endpoint

### POST /api/generate

Generate themed quotes.

**Request Body**:
```json
{
  "toolId": "quote-generator",
  "variantId": "motivation",
  "model": "arcee-ai/trinity-mini:free",
  "inputs": {
    "language": "english",
    "quantity": 10
  }
}
```

**Validation Rules**:
- `language`: Must be one of "english", "russian", "arabic"
- `quantity`: Integer between 5 and 20 inclusive
- `variantId`: Must be one of 8 theme variants

**Response** (200 OK):
```json
{
  "id": "650e8400-e29b-41d4-a716-446655440001",
  "toolId": "quote-generator",
  "variantId": "motivation",
  "status": "completed",
  "content": "Start before you're ready. Momentum builds confidence, not the reverse.\nYour future self is watching. Make them proud today.\nSmall daily wins compound into unrecognizable transformation.\nDiscomfort is data. It's showing you exactly where to grow.\nAction cures overthinking. Five minutes of doing beats five hours of planning.\nProgress isn't linear. Some days you build, some days you maintain. Both count.\nThe work you avoid today becomes tomorrow's emergency. Start now.\nSkills aren't discovered, they're built. One awkward attempt at a time.\nYour comfort zone is a museum, not a home. Visit, don't live there.\nDone badly today beats perfect never. Iteration is the real magic.",
  "metadata": {
    "model": "arcee-ai/trinity-mini:free",
    "tokensUsed": 420,
    "processingTime": 2100,
    "systemPromptUsed": "prompts/quote/motivation/en.md",
    "quotesGenerated": 10,
    "avgCharLength": 78
  },
  "timestamp": "2026-02-02T10:35:00Z"
}
```

**Response** (400 Bad Request):
```json
{
  "error": "Validation failed",
  "details": {
    "quantity": "Must be between 5 and 20"
  }
}
```

---

## Output Format Specification

Quote generator returns plain text with one quote per line, no numbering or formatting.

**Format**:
```
Quote one text here.
Quote two text here.
Quote three text here.
...
```

**Constraints**:
- Each quote MUST be under 100 characters (strict limit for image overlay)
- No line numbers, bullet points, or markdown formatting
- No meta-commentary (e.g., "Here are your quotes:")
- Separated by newline character (`\n`)

**Quality Requirements**:
- No clichés (checked against database of common phrases)
- Fresh perspectives on theme
- Specific, concrete language (avoid abstractions)
- Modern, conversational tone (2026 slang acceptable)

---

## Usage Notes

- **Character Limit**: <100 chars ensures compatibility with image design tools
- **Theme Selection**: 8 variants provide different emotional/conceptual angles
- **Anti-Cliché Focus**: System prompts explicitly prohibit overused phrases
- **Quantity Range**: 5-20 quotes allows flexibility for batch generation
- **Language Support**: Full en/ru/ar support with culturally appropriate phrases
- **Use Case**: Designed for social media graphics, Instagram stories, motivational posters
