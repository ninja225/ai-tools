import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, language = 'english', model = 'google/gemini-2.0-flash-exp:free' } = body;

    // Validation
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image data', details: { image: 'Base64 image data required' } },
        { status: 400 }
      );
    }

    // Validate base64 data URL format
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format', details: { image: 'Must be base64 data URL (data:image/...)' } },
        { status: 400 }
      );
    }

    // Extract MIME type
    const mimeMatch = image.match(/data:(image\/[a-z]+);base64,/);
    if (!mimeMatch) {
      return NextResponse.json(
        { error: 'Invalid image format', details: { image: 'Could not parse MIME type' } },
        { status: 400 }
      );
    }

    const mimeType = mimeMatch[1];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(mimeType)) {
      return NextResponse.json(
        {
          error: 'Unsupported image format',
          details: {
            image: 'Only JPEG, PNG, and WebP formats are supported',
            detectedFormat: mimeType,
          },
        },
        { status: 400 }
      );
    }

    // Estimate file size (base64 is ~1.33x larger than binary)
    const base64Data = image.split(',')[1];
    const estimatedSize = (base64Data.length * 3) / 4;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (estimatedSize > maxSize) {
      return NextResponse.json(
        {
          error: 'Invalid image',
          details: {
            image: 'File size exceeds 10MB limit',
            maxSize,
            estimatedSize: Math.round(estimatedSize),
          },
        },
        { status: 400 }
      );
    }

    // Load system prompt (English only - vision models handle multilingual)
    const systemPromptPath = `/home/dr-ninja/Desktop/dev_general/ai-tools/prompts/scene-mood/en.md`;
    const fs = await import('fs/promises');
    let systemPrompt = await fs.readFile(systemPromptPath, 'utf-8');

    // Replace {{language}} placeholder
    systemPrompt = systemPrompt.replace(/\{\{language\}\}/g, language);

    // Call OpenRouter vision API
    const apiKey = process.env.OPENROUTER_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const startTime = Date.now();
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': siteUrl,
        'X-Title': 'ToolKo Platform',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: systemPrompt },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
        max_tokens: 1500,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;
    const content = data.choices[0]?.message?.content || '';

    return NextResponse.json({
      id: crypto.randomUUID(),
      toolId: 'scene-mood-describer',
      status: 'completed',
      content,
      metadata: {
        model,
        tokensUsed: data.usage?.total_tokens || 0,
        processingTime,
        systemPromptUsed: 'prompts/scene-mood/en.md',
        imageAnalysis: {
          format: mimeType,
          estimatedSize: Math.round(estimatedSize),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Scene mood analysis error:', error);

    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      },
      { status: 500 }
    );
  }
}
