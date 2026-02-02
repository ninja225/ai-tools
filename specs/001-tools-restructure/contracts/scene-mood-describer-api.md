# API Contract: Scene Mood Describer

**Tool**: scene-mood-describer  
**Purpose**: Analyze uploaded image and generate detailed AI regeneration prompt capturing mood, lighting, and composition  
**Version**: 1.0.0

## Tool Configuration Endpoint

### GET /api/tools/scene-mood-describer/config

Returns tool configuration for UI rendering.

**Response** (200 OK):
```json
{
  "id": "scene-mood-describer",
  "name": "Scene Mood Describer",
  "description": "Upload an image and get detailed prompts to recreate its mood and aesthetic",
  "category": "image",
  "defaultModel": "openai/gpt-4o-mini",
  "allowedModels": [
    "openai/gpt-4o-mini",
    "anthropic/claude-3-haiku:beta",
    "google/gemini-flash-1.5"
  ],
  "inputs": [
    {
      "id": "image",
      "label": "Upload Image",
      "type": "file",
      "required": true,
      "accept": "image/jpeg,image/png,image/webp",
      "maxSize": 10485760
    }
  ],
  "variants": [
    {
      "id": "general",
      "name": "Mood Analysis",
      "description": "Comprehensive scene analysis for AI regeneration",
      "systemPromptPath": "prompts/scene-mood/general/en.md",
      "lucideIcon": "image"
    }
  ]
}
```

---

## Generation Endpoint

### POST /api/generate

Analyze image and generate regeneration prompt.

**Request Body** (multipart/form-data or JSON with base64):
```json
{
  "toolId": "scene-mood-describer",
  "variantId": "general",
  "model": "openai/gpt-4o-mini",
  "inputs": {
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCE..."
  }
}
```

**Validation Rules**:
- `image`: Must be base64-encoded data URL
- MIME type: image/jpeg, image/png, or image/webp
- File size: Maximum 10MB
- Image dimensions: Minimum 200x200px (recommended)
- `model`: Must support vision/multimodal input

**Response** (200 OK):
```json
{
  "id": "850e8400-e29b-41d4-a716-446655440003",
  "toolId": "scene-mood-describer",
  "variantId": "general",
  "status": "completed",
  "content": "A solitary figure stands on a weathered wooden pier extending into misty water at dawn, photographed with an 85mm lens creating shallow depth of field (f/2.8 aperture). Golden hour lighting (approximately 3200K color temperature) from camera right creates long dramatic shadows and rim lighting on the subject's silhouette. Soft diffused backlight filters through morning fog creating volumetric atmospheric haze, low contrast aesthetic with desaturated cool tones (teal-blue water, muted gray fog) punctuated by warm highlights (golden rim light on figure's outline). Minimalist composition following rule of thirds with subject positioned at right-third vertical, vast negative space in left two-thirds emphasizes profound isolation. Atmospheric perspective with foggy background receding into infinite softness, wooden pier planks create strong leading lines toward vanishing point at horizon. Melancholic, contemplative, introspective mood pervades the scene. Fine film grain texture throughout, subtle vignette darkens corners drawing eye to subject, muted color grading reminiscent of analog film. Soft bokeh in extreme foreground from water droplets on camera lens adds depth layering. Technical specs: approximately 85mm focal length, f/2.8, ISO 400, slight underexposure for mood preservation.",
  "metadata": {
    "model": "openai/gpt-4o-mini",
    "tokensUsed": 520,
    "processingTime": 2800,
    "systemPromptUsed": "prompts/scene-mood/general/en.md",
    "imageAnalysis": {
      "dimensions": "1920x1080",
      "format": "image/jpeg",
      "size": 2458624,
      "dominantColors": ["#5A7B8C", "#D4A574", "#2C3E50"],
      "brightness": "low-medium",
      "contrast": "low"
    }
  },
  "timestamp": "2026-02-02T10:45:00Z"
}
```

**Response** (400 Bad Request - Invalid Image)**:
```json
{
  "error": "Invalid image",
  "details": {
    "image": "File size exceeds 10MB limit",
    "maxSize": 10485760,
    "actualSize": 12582912
  }
}
```

**Response** (400 Bad Request - Unsupported Format)**:
```json
{
  "error": "Unsupported image format",
  "details": {
    "image": "Only JPEG, PNG, and WebP formats are supported",
    "detectedFormat": "image/gif"
  }
}
```

---

## Output Format Specification

Scene mood describer generates a single consolidated paragraph prompt optimized for AI image generators.

**Components Included**:

1. **Subject & Composition** - What's in frame, spatial relationships
2. **Technical Photography Details** - Focal length, aperture (f-stop), perspective
3. **Lighting Analysis** - Quality (hard/soft), direction, color temperature (Kelvin scale), time of day
4. **Color Palette** - Dominant colors, saturation level, warm/cool temperature, specific hex codes if relevant
5. **Atmosphere & Mood** - Emotional tone, weather, environmental qualities
6. **Texture & Detail** - Surface qualities, film grain, material properties
7. **Composition Techniques** - Rule of thirds, leading lines, symmetry, negative space
8. **Post-Processing** - Color grading, vignette, bokeh, film effects

**Format**: Single paragraph, prose style (not checklist), approximately 150-300 words

**Optimization for AI Generators**:
- Uses specific technical terminology (Kelvin scale, f-stops, focal lengths)
- Includes composition rule names
- Specifies lighting direction and quality
- Describes mood with precise adjectives
- Consolidates into flowing prose (AI models prefer paragraphs over lists)

---

## Image Upload Implementation

Scene mood describer requires image upload infrastructure.

### Client-Side (React Component)
```typescript
'use client';

export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validation
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Max 10MB');
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, WebP supported');
    }
    
    // Preview
    setPreview(URL.createObjectURL(file));
    
    // Convert to base64 for API
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      // Submit to generation API
      await generateContent({ image: base64 });
    };
    reader.readAsDataURL(file);
  }
  
  return (
    <div>
      <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleUpload} />
      {preview && <img src={preview} alt="Preview" />}
    </div>
  );
}
```

### Server-Side (OpenRouter Vision API)
```typescript
'use server';

export async function analyzeSceneMood(base64Image: string) {
  const systemPrompt = await loadPrompt('prompts/scene-mood/general/en.md');
  
  const response = await openrouter.chat({
    model: 'openai/gpt-4o-mini',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: systemPrompt },
        { 
          type: 'image_url', 
          image_url: { url: base64Image } // data:image/jpeg;base64,...
        }
      ]
    }]
  });
  
  return response.choices[0].message.content;
}
```

---

## Usage Notes

- **Vision Models Required**: Only models with multimodal/vision capabilities supported
- **Base64 Encoding**: Images sent as data URLs to OpenRouter API
- **File Size Limit**: 10MB maximum for performance and API constraints
- **Language**: English only (vision models handle multilingual analysis, but output standardized in English)
- **Use Case**: Photographers/designers recreating aesthetic in AI generators (Midjourney, DALL-E, Stable Diffusion)
- **Security**: Server-side validation of file signatures (magic bytes) required
- **Performance**: Typically 2-4 seconds for analysis
