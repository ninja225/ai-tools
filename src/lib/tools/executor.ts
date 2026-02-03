import type { ToolConfig, ToolVariant } from '@/types/tool';
import type { GenerationRequest } from '@/types/generation';
import { createCompletion } from '@/lib/openrouter/client';
import { promises as fs } from 'fs';
import path from 'path';

export interface ExecutionResult {
  content: string;
  model: string;
  tokensUsed: number;
}

export const executeTool = async (
  tool: ToolConfig,
  request: GenerationRequest
): Promise<ExecutionResult> => {
  // Validate variant exists
  const variant = tool.variants.find((v) => v.id === request.variantId);
  if (!variant) {
    throw new Error(`Variant "${request.variantId}" not found for tool "${tool.id}"`);
  }

  // Determine model to use
  const modelId = request.modelId || tool.defaultModel;

  // Validate model is allowed
  if (tool.allowedModels && !tool.allowedModels.includes(modelId)) {
    throw new Error(`Model "${modelId}" is not allowed for this tool`);
  }

  // Extract language from inputs and load appropriate system prompt
  const language = String(request.inputs.language || 'english');
  let systemPrompt = await loadSystemPrompt(variant, language);

  // Replace placeholders in system prompt with actual user values
  systemPrompt = replacePlaceholders(systemPrompt, request.inputs, variant);

  // Build user message from inputs
  const userMessage = buildUserMessage(tool, request.inputs, variant);

  // Log the prompts for debugging
  console.log('\n' + '='.repeat(80));
  console.log(`[TOOL EXECUTOR] Tool: ${tool.id} | Variant: ${variant.name} | Language: ${language}`);
  console.log('='.repeat(80));
  console.log('\n[SYSTEM PROMPT]');
  console.log('-'.repeat(80));
  console.log(systemPrompt);
  console.log('-'.repeat(80));
  console.log('\n[USER MESSAGE]');
  console.log('-'.repeat(80));
  console.log(userMessage);
  console.log('-'.repeat(80));

  // Call OpenRouter
  const result = await createCompletion({
    model: modelId,
    systemPrompt,
    userMessage,
    maxTokens: tool.settings.maxTokens,
    temperature: tool.settings.temperature,
    topP: tool.settings.topP,
  });

  // Log the response
  console.log('\n[MODEL RESPONSE]');
  console.log('-'.repeat(80));
  console.log(`Model: ${modelId}`);
  console.log(`Tokens Used: ${result.tokensUsed}`);
  console.log('-'.repeat(80));
  console.log(result.content);
  console.log('-'.repeat(80));
  console.log('\n' + '='.repeat(80) + '\n');

  return {
    content: result.content,
    model: modelId,
    tokensUsed: result.tokensUsed,
  };
};

async function loadSystemPrompt(variant: ToolVariant, language: string): Promise<string> {
  try {
    // Map language input to file suffix
    const langMap: Record<string, string> = {
      'english': 'en',
      'russian': 'ru',
      'arabic': 'ar',
      'en': 'en',
      'ru': 'ru',
      'ar': 'ar',
    };
    
    const langCode = langMap[language.toLowerCase()] || 'en';
    
    // Replace the language placeholder in systemPromptPath
    // e.g., '/prompts/story/{lang}.md' -> '/prompts/story/en.md'
    const promptPath = path.join(
      process.cwd(),
      variant.systemPromptPath.replace('{lang}', langCode)
    );
    
    const content = await fs.readFile(promptPath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(
      `Failed to load system prompt from "${variant.systemPromptPath}" for language "${language}": ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

function replacePlaceholders(
  prompt: string,
  inputs: Record<string, string | number>,
  variant: ToolVariant
): string {
  let result = prompt;

  // Replace {{variant}} with variant name
  result = result.replace(/\{\{variant\}\}/g, variant.name);

  // Replace all input values ({{topic}}, {{tone}}, {{length}}, {{language}}, etc.)
  for (const [key, value] of Object.entries(inputs)) {
    const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(placeholder, String(value));
  }

  // Log warning if any placeholders remain
  const remainingPlaceholders = result.match(/\{\{[^}]+\}\}/g);
  if (remainingPlaceholders) {
    console.warn('[EXECUTOR] Warning: Unresolved placeholders:', remainingPlaceholders);
  }

  return result;
}

function buildUserMessage(
  tool: ToolConfig,
  inputs: Record<string, string | number>,
  variant: ToolVariant
): string {
  const lines: string[] = [];

  // Add variant context if it's meaningful (not just the tool name)
  if (variant.id !== tool.id) {
    lines.push(`Content Type: ${variant.name}`);
  }

  for (const input of tool.inputs) {
    const value = inputs[input.id];

    if (input.required && (value === undefined || value === '')) {
      throw new Error(`Required input "${input.label}" is missing`);
    }

    // Skip language as it's used for prompt selection, not content
    if (input.id === 'language') {
      continue;
    }

    if (value !== undefined && value !== '') {
      lines.push(`${input.label}: ${value}`);
    }
  }

  return lines.join('\n\n');
}
