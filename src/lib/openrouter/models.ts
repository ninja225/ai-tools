export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing: {
    prompt: number;
    completion: number;
  };
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    contextLength: 200000,
    pricing: {
      prompt: 0.00025,
      completion: 0.00125,
    },
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    contextLength: 200000,
    pricing: {
      prompt: 0.003,
      completion: 0.015,
    },
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextLength: 200000,
    pricing: {
      prompt: 0.003,
      completion: 0.015,
    },
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    contextLength: 128000,
    pricing: {
      prompt: 0.00015,
      completion: 0.0006,
    },
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextLength: 128000,
    pricing: {
      prompt: 0.005,
      completion: 0.015,
    },
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini Flash 1.5',
    provider: 'Google',
    contextLength: 1000000,
    pricing: {
      prompt: 0.000075,
      completion: 0.0003,
    },
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    provider: 'Google',
    contextLength: 2000000,
    pricing: {
      prompt: 0.00125,
      completion: 0.005,
    },
  },
];

export const getModelById = (modelId: string): ModelInfo | undefined => {
  return AVAILABLE_MODELS.find((model) => model.id === modelId);
};

export const getDefaultModel = (): ModelInfo => {
  return AVAILABLE_MODELS[0]; // Claude 3 Haiku as default
};
