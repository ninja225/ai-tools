import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * Load a system prompt from the prompts directory and replace placeholders
 * 
 * @param promptPath - Path relative to prompts/ directory (e.g., "story/general/en.md")
 * @param placeholders - Object mapping placeholder names to values (e.g., { topic: "robots", language: "english" })
 * @returns The loaded prompt with placeholders replaced
 */
export async function loadPrompt(
  promptPath: string,
  placeholders: Record<string, string>
): Promise<string> {
  try {
    // Construct full path from project root
    const fullPath = join(process.cwd(), 'prompts', promptPath);
    
    // Read the markdown file
    let content = await readFile(fullPath, 'utf-8');
    
    // Replace all placeholders in the format {{key}}
    Object.entries(placeholders).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      content = content.replaceAll(placeholder, value);
    });
    
    return content;
  } catch (error) {
    console.error(`Failed to load prompt from ${promptPath}:`, error);
    throw new Error(`Failed to load system prompt: ${promptPath}`);
  }
}

/**
 * Resolve system prompt path with language placeholder
 * 
 * @param pathTemplate - Template with {language} placeholder (e.g., "story/general/{language}.md")
 * @param language - Language code (e.g., "en", "ru", "ar")
 * @returns Resolved path
 */
export function resolvePromptPath(pathTemplate: string, language: string): string {
  return pathTemplate.replace('{language}', language);
}

/**
 * Validate that all required placeholders are provided
 * 
 * @param content - Prompt content to check
 * @param providedPlaceholders - Placeholders that were provided
 * @returns Array of missing placeholder names (empty if all provided)
 */
export function findMissingPlaceholders(
  content: string,
  providedPlaceholders: Record<string, string>
): string[] {
  const placeholderRegex = /\{\{(\w+)\}\}/g;
  const found = new Set<string>();
  let match;
  
  while ((match = placeholderRegex.exec(content)) !== null) {
    found.add(match[1]);
  }
  
  const missing: string[] = [];
  found.forEach(placeholder => {
    if (!(placeholder in providedPlaceholders)) {
      missing.push(placeholder);
    }
  });
  
  return missing;
}
