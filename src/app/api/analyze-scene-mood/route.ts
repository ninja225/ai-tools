import { NextRequest, NextResponse } from 'next/server';
import { sceneMoodDescriberSchema } from '@/lib/validation/tool-input-schemas';
import { z } from 'zod';
import path from 'path';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod schema
    let validatedData;
    try {
      validatedData = sceneMoodDescriberSchema.parse(body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: err.issues },
          { status: 400 }
        );
      }
      throw err;
    }

    const { variant, image, analysisDepth, language } = validatedData;

    // Image is an object with { type, size, data } where data is base64 string
    if (!image || !image.data) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    const imageData = image.data; // Base64 string

    // Extract MIME type for metadata
    const mimeMatch = imageData.match(/data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/unknown';

    // Estimate file size for metadata
    const base64Data = imageData.split(',')[1];
    const estimatedSize = (base64Data.length * 3) / 4;

    // Map language to file suffix
    const langMap: Record<string, string> = {
      'english': 'en',
      'russian': 'ru',
      'arabic': 'ar',
      'en': 'en',
      'ru': 'ru',
      'ar': 'ar',
    };
    const langCode = langMap[language.toLowerCase()] || 'en';

    // Load system prompt based on language
    const systemPromptPath = path.join(
      process.cwd(),
      `prompts/scene-mood/${langCode}.md`
    );
    const fs = await import('fs/promises');
    let systemPrompt = await fs.readFile(systemPromptPath, 'utf-8');

    // Replace placeholders in system prompt
    systemPrompt = systemPrompt.replace(/\{\{language\}\}/g, language);
    systemPrompt = systemPrompt.replace(/\{\{variant\}\}/g, variant);
    systemPrompt = systemPrompt.replace(/\{\{analysisDepth\}\}/g, analysisDepth);

    // Add variant-specific instructions
    if (variant === 'detailed') {
      systemPrompt += '\n\nProvide a DETAILED analysis with:' +
        '\n- Comprehensive mood description (emotions, atmosphere)' +
        '\n- Detailed lighting analysis (source, quality, color temperature, direction)' +
        '\n- In-depth composition breakdown (rule of thirds, leading lines, balance, focal points)' +
        '\n- Color palette analysis' +
        '\n- Texture and depth assessment';
    }

    // Add analysis depth instructions
    if (analysisDepth === 'comprehensive') {
      systemPrompt += '\n\nPerform a COMPREHENSIVE analysis covering all visual aspects in detail.';
    }

    // Select model based on analysisDepth (comprehensive gets more capable model)
    const model = analysisDepth === 'comprehensive' 
      ? 'meta-llama/llama-3.2-90b-vision-instruct:free'
      : 'google/gemini-2.0-flash-exp:free';

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
              { type: 'image_url', image_url: { url: imageData } },
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
      result: content, // Use 'result' to match the page component expectation
      content, // Keep 'content' for backward compatibility
      metadata: {
        variant,
        analysisDepth,
        language,
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
