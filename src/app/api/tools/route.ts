import { NextResponse } from 'next/server';
import { toolRegistry } from '@/config/tools';
import type { ApiResponse, ToolsApiResponse } from '@/types/api';

export async function GET() {
  try {
    const tools = toolRegistry.getAll();

    const response: ApiResponse<ToolsApiResponse> = {
      success: true,
      data: { tools },
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: {
        message: 'Failed to fetch tools',
        code: 'FETCH_TOOLS_ERROR',
      },
    };

    return NextResponse.json(response, { status: 500 });
  }
}
