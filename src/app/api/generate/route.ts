import { NextRequest, NextResponse } from 'next/server';
import { toolRegistry } from '@/config/tools';
import { executeTool } from '@/lib/tools/executor';
import type { GenerationRequest, GenerationResponse } from '@/types/generation';
import type { ApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();

    // Validate request
    if (!body.toolId || !body.variantId || !body.inputs) {
      const response: ApiResponse<GenerationResponse> = {
        success: false,
        error: {
          message: 'Missing required fields: toolId, variantId, and inputs',
          code: 'INVALID_REQUEST',
        },
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Get tool from registry
    const tool = toolRegistry.getById(body.toolId);
    if (!tool) {
      const response: ApiResponse<GenerationResponse> = {
        success: false,
        error: {
          message: `Tool "${body.toolId}" not found`,
          code: 'TOOL_NOT_FOUND',
        },
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Execute tool
    const result = await executeTool(tool, body);

    const response: ApiResponse<GenerationResponse> = {
      success: true,
      data: {
        success: true,
        content: result.content,
        model: result.model,
        tokensUsed: result.tokensUsed,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generation error:', error);

    const response: ApiResponse<GenerationResponse> = {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: 'GENERATION_ERROR',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
