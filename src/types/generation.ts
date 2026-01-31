export interface GenerationRequest {
  toolId: string;
  variantId: string;
  modelId?: string;
  inputs: Record<string, string | number>;
}

export interface GenerationResponse {
  success: boolean;
  content?: string;
  model?: string;
  tokensUsed?: number;
  error?: string;
}

export interface GenerationHistory {
  id: string;
  toolId: string;
  variantId: string;
  model: string;
  inputs: Record<string, string | number>;
  output: string;
  tokensUsed: number;
  timestamp: Date;
}
