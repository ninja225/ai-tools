import { NextRequest, NextResponse } from 'next/server';
import { toolRegistry } from '@/config/tools';
import { executeTool } from '@/lib/tools/executor';
import type { GenerationRequest, GenerationResponse } from '@/types/generation';
import type { ApiResponse } from '@/types/api';
import {
  storyCreatorSchema,
  postCreatorSchema,
  sceneCreatorSchema,
  quoteGeneratorSchema,
  reelsCreatorSchema,
} from '@/lib/validation/tool-input-schemas';
import {
  validateRequestBody,
  createSafeErrorResponse,
} from '@/lib/validation/server-validators';
import { z } from 'zod';

// Map tool IDs to their validation schemas
const toolSchemas: Record<string, z.ZodSchema | null> = {
  'story-creator': storyCreatorSchema,
  'post-creator': postCreatorSchema,
  'scene-creator': sceneCreatorSchema,
  'quote-generator': quoteGeneratorSchema,
  'reels-creator': reelsCreatorSchema,
  // Scene mood describer uses dedicated /api/analyze-scene-mood route
};

export async function POST(request: NextRequest) {
  try {
    // Validate request body exists
    const rawBody = await request.json();
    const body = validateRequestBody(rawBody);

    // Extract toolId
    const { toolId, ...inputData } = body;

    if (!toolId || typeof toolId !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'toolId is required and must be a string',
            code: 'VALIDATION_ERROR',
          },
        },
        { status: 400 }
      );
    }

    // Get tool from registry
    const tool = toolRegistry.getById(toolId);
    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Tool "${toolId}" not found`,
            code: 'TOOL_NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    // Get validation schema for this tool
    const schema = toolSchemas[toolId];
    if (!schema) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Tool "${toolId}" does not use this API route`,
            code: 'INVALID_TOOL',
          },
        },
        { status: 400 }
      );
    }

    // Validate inputs with Zod schema
    let validatedData: Record<string, unknown>;
    try {
      validatedData = schema.parse(inputData) as Record<string, unknown>;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const firstError = err.issues[0];
        return NextResponse.json(
          {
            success: false,
            error: {
              message: firstError.message,
              code: 'VALIDATION_ERROR',
              field: firstError.path.join('.'),
            },
          },
          { status: 400 }
        );
      }
      throw err;
    }

    // Execute tool (old structure compatibility - needs updating in executor)
    // For now, construct the old format
    const generationRequest: GenerationRequest = {
      toolId,
      variantId: (validatedData.variant as string) || toolId,
      inputs: validatedData as Record<string, string | number>,
    };

    const result = await executeTool(tool, generationRequest);

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
    console.error('[API /generate] Error:', error);

    const safeError = createSafeErrorResponse(error, 'Failed to generate content');

    return NextResponse.json(
      {
        success: false,
        error: {
          message: safeError.message,
          code: safeError.code,
        },
      },
      { status: 500 }
    );
  }
}
