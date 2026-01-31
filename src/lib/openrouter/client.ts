import type { OpenRouterRequest, OpenRouterResponse, OpenRouterError } from './types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface CreateCompletionParams {
  model: string;
  systemPrompt: string;
  userMessage: string;
  maxTokens: number;
  temperature: number;
  topP?: number;
}

export interface CompletionResult {
  content: string;
  tokensUsed: number;
}

export const createCompletion = async (
  params: CreateCompletionParams
): Promise<CompletionResult> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const requestBody: OpenRouterRequest = {
    model: params.model,
    messages: [
      { role: 'system', content: params.systemPrompt },
      { role: 'user', content: params.userMessage },
    ],
    max_tokens: params.maxTokens,
    temperature: params.temperature,
    ...(params.topP && { top_p: params.topP }),
  };

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': 'AI Tools Platform',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData: OpenRouterError = await response.json();
      throw new Error(
        `OpenRouter API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data: OpenRouterResponse = await response.json();

    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens || 0,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while calling OpenRouter API');
  }
};
