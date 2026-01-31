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

  // Load system prompt
  const systemPrompt = await loadSystemPrompt(variant);

  // Build user message from inputs
  const userMessage = buildUserMessage(tool, request.inputs);

  // Call OpenRouter
  const result = await createCompletion({
    model: modelId,
    systemPrompt,
    userMessage,
    maxTokens: tool.settings.maxTokens,
    temperature: tool.settings.temperature,
    topP: tool.settings.topP,
  });

  return {
    content: result.content,
    model: modelId,
    tokensUsed: result.tokensUsed,
  };
};

async function loadSystemPrompt(variant: ToolVariant): Promise<string> {
  try {
    const promptPath = path.join(
      process.cwd(),
      'src',
      'prompts',
      `${variant.systemPromptPath}`
    );
    const content = await fs.readFile(promptPath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(
      `Failed to load system prompt from "${variant.systemPromptPath}": ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

function buildUserMessage(
  tool: ToolConfig,
  inputs: Record<string, string | number>
): string {
  const lines: string[] = [];

  for (const input of tool.inputs) {
    const value = inputs[input.id];

    if (input.required && (value === undefined || value === '')) {
      throw new Error(`Required input "${input.label}" is missing`);
    }

    if (value !== undefined && value !== '') {
      lines.push(`${input.label}: ${value}`);
    }
  }

  return lines.join('\n\n');
}
