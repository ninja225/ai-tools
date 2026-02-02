# Image Upload Best Practices for Next.js 16 App Router (2026)
## Research: Scene Mood Describer Tool - AI Vision Analysis

---

## 1. Recommended Approach for Image Upload in Next.js 16

### **Best Practice: Server Actions + FormData**

Next.js 16 App Router recommends using **Server Actions with FormData** for file uploads. This is the native, performant approach that leverages React Server Components.

#### Key Implementation Pattern:

```typescript
// app/actions/analyze-image.ts
'use server'

export async function analyzeImage(formData: FormData) {
  // Extract file from FormData
  const file = formData.get('image') as File
  
  if (!file) {
    return { error: 'No image provided' }
  }
  
  // Validate file
  const validation = await validateImage(file)
  if (!validation.valid) {
    return { error: validation.error }
  }
  
  // Process image...
}
```

```tsx
// Client Component
'use client'

import { analyzeImage } from '@/app/actions/analyze-image'

export function ImageUploadForm() {
  return (
    <form action={analyzeImage}>
      <input type="file" name="image" accept="image/*" />
      <button type="submit">Analyze Scene</button>
    </form>
  )
}
```

### **Why Server Actions?**

1. **Progressive Enhancement**: Forms work before JavaScript loads
2. **Server-Side Security**: Validation happens on the server
3. **Simplified Architecture**: No need for separate API routes
4. **Built-in File Handling**: FormData natively supports File objects
5. **Streaming Support**: Can use React Suspense and streaming responses

---

## 2. Sending Images to OpenRouter Vision Models

### **Format: Base64 Encoding**

OpenRouter vision models accept images in the OpenAI-compatible format using **base64-encoded data URLs**.

#### Image Content Structure:

```typescript
type ImageContentPart = {
  type: 'image_url';
  image_url: {
    url: string; // URL or base64 encoded image data
    detail?: string; // Optional, defaults to "auto"
  };
};
```

### **Implementation Example:**

```typescript
// lib/openrouter/vision.ts
import type { OpenRouterMessage } from './types';

export interface VisionAnalysisParams {
  model: string;
  imageBase64: string;
  prompt: string;
  maxTokens?: number;
}

export async function analyzeImageWithVision(
  params: VisionAnalysisParams
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  // Construct multimodal message
  const messages: OpenRouterMessage[] = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: params.prompt,
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${params.imageBase64}`,
            detail: 'auto', // 'low', 'high', or 'auto'
          },
        },
      ],
    },
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': siteUrl,
      'X-Title': 'AI Tools Platform',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: params.model,
      messages,
      max_tokens: params.maxTokens || 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenRouter API error: ${error.error?.message}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### **Converting File to Base64:**

```typescript
// lib/utils/image.ts

/**
 * Convert File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Convert File to base64 using Buffer (Node.js environment)
 * More efficient for Server Actions
 */
export async function fileToBase64Server(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString('base64');
}
```

### **OpenRouter Message Types Update:**

```typescript
// lib/openrouter/types.ts

export type TextContent = {
  type: 'text';
  text: string;
};

export type ImageContent = {
  type: 'image_url';
  image_url: {
    url: string; // Base64 data URL or regular URL
    detail?: 'low' | 'high' | 'auto';
  };
};

export type ContentPart = TextContent | ImageContent;

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[]; // Support multimodal content
  name?: string;
}
```

---

## 3. Client-Side Validation Patterns

### **Comprehensive Validation Strategy:**

```typescript
// lib/utils/validation.ts

export const IMAGE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Client-side image validation
 */
export function validateImageClient(file: File): ValidationResult {
  // Check file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${IMAGE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    const maxSizeMB = IMAGE_CONFIG.MAX_SIZE / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  // Check file dimensions (optional)
  return { valid: true };
}

/**
 * Validate image dimensions (requires loading the image)
 */
export function validateImageDimensions(
  file: File,
  maxWidth = 4096,
  maxHeight = 4096
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          error: `Image dimensions too large. Max: ${maxWidth}x${maxHeight}px`,
        });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: 'Failed to load image' });
    };

    img.src = url;
  });
}
```

### **Server-Side Validation (Critical!):**

```typescript
// app/actions/validate-image.ts
'use server'

import { IMAGE_CONFIG } from '@/lib/utils/validation';

export interface ServerValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Server-side validation (ALWAYS required)
 * Never trust client-side validation alone
 */
export async function validateImageServer(file: File): Promise<ServerValidationResult> {
  // Validate file exists
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }

  // Validate MIME type
  if (!IMAGE_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP`,
    };
  }

  // Validate file size
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  if (file.size > IMAGE_CONFIG.MAX_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 10MB`,
    };
  }

  // Validate file signature (magic bytes) for extra security
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check for valid image magic bytes
    const isValidImage = checkImageSignature(bytes, file.type);
    if (!isValidImage) {
      return { valid: false, error: 'File is not a valid image' };
    }
  } catch (error) {
    return { valid: false, error: 'Failed to read file' };
  }

  return { valid: true };
}

/**
 * Check file signature (magic bytes) to ensure it's actually an image
 */
function checkImageSignature(bytes: Uint8Array, mimeType: string): boolean {
  // JPEG: FF D8 FF
  if (mimeType === 'image/jpeg') {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mimeType === 'image/png') {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }

  // WebP: RIFF ... WEBP
  if (mimeType === 'image/webp') {
    return (
      bytes[0] === 0x52 && // R
      bytes[1] === 0x49 && // I
      bytes[2] === 0x46 && // F
      bytes[3] === 0x46 && // F
      bytes[8] === 0x57 && // W
      bytes[9] === 0x45 && // E
      bytes[10] === 0x42 && // B
      bytes[11] === 0x50 // P
    );
  }

  return false;
}
```

---

## 4. React Component Patterns for Image Upload UI

### **Complete Client Component with Preview:**

```tsx
// components/tools/image-upload.tsx
'use client'

import { useState, useRef, useTransition } from 'react';
import { useActionState } from 'react';
import { analyzeImage } from '@/app/actions/analyze-image';
import { validateImageClient, validateImageDimensions } from '@/lib/utils/validation';

interface AnalysisResult {
  success?: boolean;
  error?: string;
  analysis?: string;
}

export function ImageUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState<AnalysisResult, FormData>(
    analyzeImage,
    { success: false }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError('');
    
    if (!file) {
      setPreview(null);
      setFileName('');
      return;
    }

    // Client-side validation
    const validation = validateImageClient(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file');
      setPreview(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate dimensions (optional)
    const dimensionValidation = await validateImageDimensions(file);
    if (!dimensionValidation.valid) {
      setValidationError(dimensionValidation.error || 'Invalid dimensions');
      setPreview(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Create preview
    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleSubmit = async (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  const clearImage = () => {
    setPreview(null);
    setFileName('');
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            id="image-input"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isPending}
          />
          <label
            htmlFor="image-input"
            className="cursor-pointer block"
          >
            {preview ? (
              <div className="space-y-2">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg"
                />
                <p className="text-sm text-gray-600">{fileName}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, or WebP (max 10MB)
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {validationError}
          </div>
        )}

        {/* Server Error */}
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {state.error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!preview || isPending || !!validationError}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Analyzing...' : 'Analyze Scene Mood'}
          </button>
          
          {preview && (
            <button
              type="button"
              onClick={clearImage}
              disabled={isPending}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Analysis Result */}
      {state?.success && state.analysis && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Scene Analysis:</h3>
          <p className="text-green-800 whitespace-pre-wrap">{state.analysis}</p>
        </div>
      )}
    </div>
  );
}
```

### **Alternative: Using useFormStatus Hook:**

```tsx
// components/tools/submit-button.tsx
'use client'

import { useFormStatus } from 'react-dom';

export function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Analyzing...
        </span>
      ) : (
        'Analyze Scene Mood'
      )}
    </button>
  );
}
```

---

## 5. Error Handling Patterns

### **Comprehensive Error Handler:**

```typescript
// lib/utils/error-handler.ts

export class ImageUploadError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_TYPE' | 'TOO_LARGE' | 'EMPTY' | 'CORRUPTED' | 'NETWORK' | 'API'
  ) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

export function handleImageError(error: unknown): string {
  if (error instanceof ImageUploadError) {
    switch (error.code) {
      case 'INVALID_TYPE':
        return 'Please upload a JPEG, PNG, or WebP image.';
      case 'TOO_LARGE':
        return 'Image is too large. Maximum size is 10MB.';
      case 'EMPTY':
        return 'The file appears to be empty.';
      case 'CORRUPTED':
        return 'The image file is corrupted or invalid.';
      case 'NETWORK':
        return 'Network error. Please check your connection and try again.';
      case 'API':
        return 'Failed to analyze image. Please try again.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
```

### **Server Action with Error Handling:**

```typescript
// app/actions/analyze-image.ts
'use server'

import { validateImageServer } from './validate-image';
import { analyzeImageWithVision } from '@/lib/openrouter/vision';
import { fileToBase64Server } from '@/lib/utils/image';
import { ImageUploadError, handleImageError } from '@/lib/utils/error-handler';

export interface AnalysisResult {
  success: boolean;
  error?: string;
  analysis?: string;
}

export async function analyzeImage(
  prevState: AnalysisResult,
  formData: FormData
): Promise<AnalysisResult> {
  try {
    // Extract file
    const file = formData.get('image') as File;

    if (!file) {
      throw new ImageUploadError('No image provided', 'EMPTY');
    }

    // Server-side validation
    const validation = await validateImageServer(file);
    if (!validation.valid) {
      throw new ImageUploadError(
        validation.error || 'Invalid image',
        'INVALID_TYPE'
      );
    }

    // Convert to base64
    let base64: string;
    try {
      base64 = await fileToBase64Server(file);
    } catch (error) {
      throw new ImageUploadError(
        'Failed to process image',
        'CORRUPTED'
      );
    }

    // Call OpenRouter vision API
    let analysis: string;
    try {
      analysis = await analyzeImageWithVision({
        model: 'openai/gpt-4-vision-preview', // or another vision model
        imageBase64: base64,
        prompt: 'Analyze the mood and atmosphere of this scene. Describe the emotional tone, lighting, colors, and overall feeling the image conveys.',
        maxTokens: 500,
      });
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new ImageUploadError(
        'Failed to analyze image with AI',
        'API'
      );
    }

    return {
      success: true,
      analysis,
    };

  } catch (error) {
    return {
      success: false,
      error: handleImageError(error),
    };
  }
}
```

---

## 6. Next.js 16 Specific Considerations

### **Server Components vs Client Components:**

| Aspect | Server Component | Client Component |
|--------|------------------|------------------|
| **File Input** | ❌ Cannot render `<input type="file">` | ✅ Required for file inputs |
| **Preview** | ❌ Cannot use `URL.createObjectURL` | ✅ Required for preview |
| **Validation (client)** | ❌ No browser APIs | ✅ Use for immediate feedback |
| **Server Actions** | ✅ Can be called directly | ✅ Can be imported and called |
| **Form State** | ❌ No `useActionState` | ✅ Use for managing state |

### **Architecture Decision:**

```
┌─────────────────────────────────────┐
│   Server Component (Page/Layout)   │
│   - Can fetch data                  │
│   - Can be async                    │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Client Component (ImageUpload)     │
│  'use client'                        │
│  - File input                        │
│  - Preview                           │
│  - Client validation                 │
│  - Calls Server Action               │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│    Server Action (analyzeImage)     │
│    'use server'                      │
│    - Server validation               │
│    - Process image                   │
│    - Call OpenRouter API             │
└─────────────────────────────────────┘
```

### **Best Practices Summary:**

1. **Use Client Components** for forms with file inputs
2. **Server Actions** for processing uploaded files
3. **Always validate** on both client and server
4. **Never trust** client-side validation alone
5. **Use FormData** for native file handling
6. **Base64 encode** images for OpenRouter vision API
7. **Handle errors** gracefully with user-friendly messages
8. **Provide feedback** during upload and processing (loading states)
9. **Clean up** object URLs to prevent memory leaks
10. **Check file signatures** (magic bytes) for extra security

### **Performance Considerations:**

- **Image Size**: 10MB is reasonable for vision analysis
- **Base64 Overhead**: ~33% size increase (10MB → ~13.3MB base64)
- **Loading States**: Always show progress to users
- **Progressive Enhancement**: Form works without JS (degrades gracefully)
- **Error Recovery**: Allow users to retry failed uploads

---

## 7. Complete Implementation Checklist

### **Setup Phase:**
- [ ] Install Zod for validation (optional but recommended)
- [ ] Configure environment variables (OPENROUTER_API_KEY)
- [ ] Update OpenRouter types to support multimodal content
- [ ] Create image utility functions (validation, conversion)

### **Client Component:**
- [ ] File input with accept attribute
- [ ] Preview functionality with URL.createObjectURL
- [ ] Client-side validation
- [ ] Loading/pending states
- [ ] Error display
- [ ] Clear/reset functionality
- [ ] Accessibility (ARIA labels, keyboard navigation)

### **Server Action:**
- [ ] Extract file from FormData
- [ ] Server-side validation (type, size, signature)
- [ ] Convert to base64
- [ ] Call OpenRouter vision API
- [ ] Error handling and user-friendly messages
- [ ] Return structured result

### **Security:**
- [ ] Validate on server (never trust client)
- [ ] Check file signatures (magic bytes)
- [ ] Limit file size (10MB)
- [ ] Sanitize file names
- [ ] Rate limiting (if needed)

### **UX:**
- [ ] Clear error messages
- [ ] Loading indicators
- [ ] Disable submit during processing
- [ ] Success feedback
- [ ] Ability to retry

---

## 8. Vision Model Recommendations

### **OpenRouter Vision Models (2026):**

```typescript
export const VISION_MODELS = {
  'openai/gpt-4-vision-preview': {
    name: 'GPT-4 Vision',
    maxTokens: 4096,
    strengths: ['detailed analysis', 'nuanced understanding'],
  },
  'anthropic/claude-3-opus-vision': {
    name: 'Claude 3 Opus Vision',
    maxTokens: 4096,
    strengths: ['creative interpretation', 'emotional analysis'],
  },
  'google/gemini-pro-vision': {
    name: 'Gemini Pro Vision',
    maxTokens: 2048,
    strengths: ['fast processing', 'cost-effective'],
  },
} as const;
```

### **Prompt Template for Scene Mood:**

```typescript
export const SCENE_MOOD_PROMPT = `Analyze the mood and atmosphere of this image in detail.

Consider:
- **Emotional Tone**: What emotions does the scene evoke?
- **Lighting**: How does the lighting affect the mood?
- **Colors**: What is the color palette and its psychological impact?
- **Composition**: How do elements contribute to the overall feeling?
- **Atmosphere**: What is the general ambiance?

Provide a comprehensive analysis in 3-4 paragraphs.`;
```

---

## Conclusion

The recommended 2026 approach for image uploads in Next.js 16 App Router combines:

1. **Client Components** for the UI and file input
2. **Server Actions** for processing with FormData
3. **Base64 encoding** for sending to OpenRouter vision models
4. **Dual validation** (client + server) for security
5. **Progressive enhancement** for reliability

This architecture is performant, secure, and follows modern React Server Components patterns while providing an excellent user experience.
