# Quickstart Guide: Adding New Tools

**Purpose**: Developer guide for adding new AI tools to the platform  
**Audience**: Developers extending the AI Tools Platform  
**Date**: 2026-02-02

## Overview

The AI Tools Platform is designed for modularity - each tool operates independently with its own configuration, system prompts, and UI. This guide walks you through adding a new tool following constitution principles.

---

## Prerequisites

Before adding a new tool, ensure you have:
- ✅ Node.js 18+ and pnpm installed
- ✅ OpenRouter API key configured in `.env.local`
- ✅ Basic understanding of Next.js 16 App Router
- ✅ TypeScript knowledge
- ✅ Read the [constitution](.specify/memory/constitution.md) (especially Tool Modularity principle)

---

## Step 1: Define Tool Configuration

Create a new file: `src/config/tools/your-tool-name.ts`

```typescript
import type { ToolConfig } from '@/types/tool';

export const yourToolName: ToolConfig = {
  id: 'your-tool-name', // Must be kebab-case, unique
  name: 'Your Tool Name', // Display name
  description: 'Brief description for tool listing page',
  icon: 'icon-name', // Optional: Lucide icon name
  category: 'content', // 'content' | 'social' | 'image' | 'productivity' | 'other'
  
  defaultModel: 'arcee-ai/trinity-mini:free',
  allowedModels: [
    'arcee-ai/trinity-mini:free',
    'openai/gpt-oss-120b:free',
    'deepseek/deepseek-r1-0528:free',
  ],
  
  inputs: [
    {
      id: 'inputId', // Must match {{placeholder}} in system prompt
      label: 'Display Label',
      type: 'text', // 'text' | 'textarea' | 'select' | 'number' | 'file'
      placeholder: 'Optional placeholder text',
      required: true,
    },
    {
      id: 'language',
      label: 'Output Language',
      type: 'select',
      required: true,
      options: [
        { value: 'english', label: 'English' },
        { value: 'russian', label: 'Russian' },
        { value: 'arabic', label: 'Arabic' },
      ],
    },
  ],
  
  variants: [
    {
      id: 'variant-id',
      name: 'Variant Name',
      description: 'Variant description',
      systemPromptPath: 'prompts/your-tool/variant-id/{language}.md',
      lucideIcon: 'icon-name', // OR icon: 'simple-icon-slug' OR customIconPath: '/path/to/icon.svg'
    },
  ],
};
```

**Key Points**:
- `id` must match directory names in `src/config/tools/` and `prompts/`
- Each `input.id` must have corresponding `{{inputId}}` placeholder in system prompts
- Use `{language}` placeholder in `systemPromptPath` for multi-language tools
- Choose ONE icon type: `lucideIcon` (generic), `icon` (brand), or `customIconPath` (custom SVG)

---

## Step 2: Register Tool

Add your tool to the registry: `src/config/tools/index.ts`

```typescript
import { storyCreatorTool } from './story-creator';
import { postCreatorTool } from './post-creator';
import { yourToolName } from './your-tool-name'; // Add import

export const tools: ToolConfig[] = [
  storyCreatorTool,
  postCreatorTool,
  yourToolName, // Add to array
];

export function getToolById(id: string): ToolConfig | undefined {
  return tools.find(tool => tool.id === id);
}
```

---

## Step 3: Create System Prompts

Create directory structure: `prompts/your-tool/`

**For single variant tool**:
```
prompts/your-tool/
└── general/
    ├── en.md
    ├── ru.md
    └── ar.md
```

**For multi-variant tool**:
```
prompts/your-tool/
├── variant-one/
│   ├── en.md
│   ├── ru.md
│   └── ar.md
└── variant-two/
    ├── en.md
    ├── ru.md
    └── ar.md
```

**System Prompt Template** (`en.md`):
```markdown
# Professional [Role Name]

## Role
You are a [role with expertise]. You specialize in [specific expertise].

**CRITICAL REQUIREMENTS**: 
- Write EXCLUSIVELY in English
- Use contemporary, natural language
- No foreign words or transliterations

---

## Task Parameters
- **Parameter 1**: {{parameter1}}
- **Parameter 2**: {{parameter2}}

---

## [Section 1 Name]

**Goal**: [What this section achieves]

[Detailed instructions]

### Examples
[Concrete examples]

---

## [Section 2 Name]

[Continue with structured approach]

---

## Technical Requirements

### [Requirements category]:
✅ **DO:**
- Specific guideline
- Another guideline

❌ **DON'T:**
- What to avoid
- Another thing to avoid

---

## Output Format

**Strictly follow:**
1. Instruction
2. Another instruction
3. NO meta-commentary

---

## Assignment

Create [output type] about:
**"{{parameter1}}"**

Begin directly with the [output]. [Final instruction].
```

**Best Practices**:
- Follow modern prompt engineering (role definition, examples, constraints, output specs)
- Include DO/DON'T lists for clarity
- Use XML tags for structured outputs (e.g., `<scene>`, `<concept>`)
- Add language enforcement for each language variant
- Test prompts via command-line script before UI integration

---

## Step 4: Create Test Script

Create: `scripts/test-your-tool.js`

```javascript
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  toolId: 'your-tool-name',
  variantId: 'general',
  model: 'arcee-ai/trinity-mini:free',
  inputs: {
    parameter1: 'test value',
    parameter2: 'another test value',
    language: 'english'
  }
};

async function loadPrompt(promptPath, inputs) {
  const language = inputs.language || 'english';
  const langCode = { english: 'en', russian: 'ru', arabic: 'ar' }[language];
  const fullPath = promptPath.replace('{language}', langCode);
  
  let content = fs.readFileSync(path.join(__dirname, '..', fullPath), 'utf8');
  
  // Replace placeholders
  for (const [key, value] of Object.entries(inputs)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(placeholder, value);
  }
  
  return content;
}

async function testGeneration() {
  console.log('🤖 Testing Your Tool Name Generation\n');
  console.log('Configuration:', JSON.stringify(TEST_CONFIG, null, 2));
  
  // Load and display system prompt
  const systemPrompt = await loadPrompt(
    'prompts/your-tool/general/{language}.md',
    TEST_CONFIG.inputs
  );
  
  console.log('\n📄 System Prompt Preview (first 500 chars):');
  console.log(systemPrompt.substring(0, 500) + '...\n');
  
  // Call OpenRouter API
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: TEST_CONFIG.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate based on the parameters provided.' }
      ],
    }),
  });
  
  const data = await response.json();
  
  console.log('✅ Generation Complete\n');
  console.log('📊 Metadata:');
  console.log(`- Model: ${data.model}`);
  console.log(`- Tokens: ${data.usage?.total_tokens || 'N/A'}`);
  console.log('\n📝 Generated Content:');
  console.log(data.choices[0].message.content);
}

testGeneration().catch(console.error);
```

**Run test**:
```bash
node scripts/test-your-tool.js
```

**Verify**:
- ✅ Prompt loads correctly with placeholders replaced
- ✅ Output is in correct language
- ✅ Output matches expected format
- ✅ No errors or malformed content

---

## Step 5: Add Translations

Add i18n keys to `src/messages/en.json`, `ru.json`, `ar.json`:

```json
{
  "tools": {
    "your-tool-name": {
      "name": "Your Tool Name",
      "description": "Brief description",
      "inputs": {
        "parameter1": {
          "label": "Parameter 1 Label",
          "placeholder": "Placeholder text"
        }
      }
    }
  }
}
```

---

## Step 6: Test UI Integration

1. **Start dev server**: `pnpm dev`
2. **Navigate to**: `http://localhost:3000/tools`
3. **Verify**:
   - ✅ Tool appears in listing with correct icon and description
   - ✅ Tool detail page loads (`/tools/your-tool-name`)
   - ✅ All input fields render correctly
   - ✅ Variants display with correct icons
   - ✅ Language selection works (if applicable)
   - ✅ Generation produces expected output
   - ✅ Loading states show during generation
   - ✅ Copy button works for output

---

## Step 7: Constitution Check

Before committing, verify compliance:

### ✅ Tool Modularity
- [ ] Tool has own config file in `src/config/tools/`
- [ ] Tool has dedicated prompts in `prompts/your-tool/`
- [ ] Tool is registered in `src/config/tools/index.ts`
- [ ] Tool does NOT depend on other tools
- [ ] Tool can be removed without affecting others

### ✅ System Prompt Excellence
- [ ] Prompts follow modern prompt engineering structure
- [ ] Role definition with specific expertise
- [ ] Concrete examples and constraints included
- [ ] Output format specifications clear
- [ ] DO/DON'T lists for quality
- [ ] Language enforcement for each variant
- [ ] Tested via command-line script

### ✅ Type Safety
- [ ] Tool config uses `ToolConfig` interface
- [ ] Inputs use `ToolInput` type
- [ ] Variants use `ToolVariant` type
- [ ] No `any` types used
- [ ] All props have explicit types

### ✅ Modern Best Practices
- [ ] Uses Next.js 16 App Router conventions
- [ ] System prompts are file-based (not hardcoded)
- [ ] i18n keys added for all languages
- [ ] Dark mode styling compatible

### ✅ User Experience First
- [ ] Appropriate icon selected (brand/generic/custom)
- [ ] Input labels are clear and descriptive
- [ ] Loading states implemented
- [ ] Error messages are actionable
- [ ] Output is copyable

---

## Common Patterns

### File Upload Tool
For tools requiring image/file upload (like scene mood describer):

```typescript
{
  id: 'image',
  label: 'Upload Image',
  type: 'file',
  required: true,
  accept: 'image/jpeg,image/png,image/webp',
  maxSize: 10485760 // 10MB in bytes
}
```

### Multi-Platform Tool
For tools with platform variants (like post creator):

```typescript
variants: [
  {
    id: 'platform-one',
    name: 'Platform One',
    description: 'Optimized for Platform One',
    systemPromptPath: 'prompts/tool/platform-one/{language}.md',
    icon: 'platform-one-slug' // simple-icons
  },
  {
    id: 'platform-two',
    name: 'Platform Two',
    description: 'Optimized for Platform Two',
    systemPromptPath: 'prompts/tool/platform-two/{language}.md',
    customIconPath: '/icons/custom/platform-two.svg'
  },
]
```

### Theme-Based Tool
For tools with theme variants (like quote generator):

```typescript
variants: [
  { id: 'theme-one', name: 'Theme One', description: '...', systemPromptPath: '...', lucideIcon: 'icon-name' },
  { id: 'theme-two', name: 'Theme Two', description: '...', systemPromptPath: '...', lucideIcon: 'other-icon' },
  // ... more themes
]
```

---

## Troubleshooting

### Tool Not Appearing in Listing
- Check tool is added to `src/config/tools/index.ts` registry
- Verify `id` is unique
- Clear Next.js cache: `rm -rf .next && pnpm dev`

### Prompts Not Loading
- Verify file paths match `systemPromptPath` in config
- Check `{language}` placeholder is used correctly
- Ensure prompt files exist for all languages (en/ru/ar)

### Icons Not Rendering
- For Lucide: Check icon name exists in `lucide-react`
- For simple-icons: Verify slug matches simple-icons package
- For custom: Ensure SVG file exists at specified path

### Generation Fails
- Check OpenRouter API key in `.env.local`
- Verify model ID is correct and available
- Test prompt via command-line script first
- Check placeholder tokens match input IDs

---

## Next Steps

- **Add More Variants**: Expand tool with additional platform/theme variants
- **Enhance Prompts**: Iterate on system prompts based on output quality
- **Add Features**: Implement advanced features (streaming, history, favorites)
- **Optimize**: Profile performance, add caching if needed

---

## Reference Examples

- **Simple Tool**: `src/config/tools/scene-creator.ts` (single variant)
- **Multi-Variant Tool**: `src/config/tools/post-creator.ts` (platform variants)
- **Theme Tool**: `src/config/tools/quote-generator.ts` (8 theme variants)
- **File Upload Tool**: `src/config/tools/scene-mood-describer.ts` (image upload)

---

For questions or contributions, see [README.md](../README.md) or constitution at [.specify/memory/constitution.md](../.specify/memory/constitution.md).
