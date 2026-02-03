/**
 * Server-side validation and sanitization utilities
 * 
 * Defense-in-depth strategy: Re-validate all inputs on the server
 * even if client-side validation passed, and sanitize to prevent
 * injection attacks.
 */

import { z } from 'zod';

/**
 * Sanitize text input to prevent XSS and injection attacks
 * 
 * Removes HTML tags, script content, and dangerous characters
 * while preserving legitimate user text.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validate and sanitize a string field
 */
export function validateAndSanitizeString(
  input: unknown,
  fieldName: string,
  options: { minLength?: number; maxLength?: number; required?: boolean } = {}
): string {
  const { minLength = 0, maxLength = 5000, required = true } = options;

  // Type check
  if (typeof input !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  // Sanitize first
  const sanitized = sanitizeText(input);

  // Required check
  if (required && !sanitized) {
    throw new Error(`${fieldName} is required`);
  }

  // Length validation
  if (sanitized.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters`);
  }

  if (sanitized.length > maxLength) {
    throw new Error(`${fieldName} must be less than ${maxLength} characters`);
  }

  return sanitized;
}

/**
 * Validate enum value against allowed options
 */
export function validateEnum<T extends string>(
  input: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): T {
  if (typeof input !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  if (!allowedValues.includes(input as T)) {
    throw new Error(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }

  return input as T;
}

/**
 * Validate image file upload
 */
export function validateImageFile(
  file: unknown,
  fieldName: string
): { type: string; size: number; data: string } {
  // Type check
  if (!file || typeof file !== 'object') {
    throw new Error(`${fieldName} must be an object`);
  }

  const fileObj = file as Record<string, unknown>;

  // Check required properties
  if (!fileObj.type || typeof fileObj.type !== 'string') {
    throw new Error(`${fieldName}.type is required and must be a string`);
  }

  if (!fileObj.size || typeof fileObj.size !== 'number') {
    throw new Error(`${fieldName}.size is required and must be a number`);
  }

  if (!fileObj.data || typeof fileObj.data !== 'string') {
    throw new Error(`${fieldName}.data is required and must be a string`);
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(fileObj.type)) {
    throw new Error(`${fieldName} must be JPEG, PNG, WebP, or GIF`);
  }

  // Validate file size (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (fileObj.size > maxSize) {
    throw new Error(`${fieldName} size must be less than 10MB`);
  }

  // Validate base64 data format
  const base64Regex = /^data:image\/(jpeg|png|webp|gif);base64,/;
  if (!base64Regex.test(fileObj.data)) {
    throw new Error(`${fieldName} must be valid base64 image data`);
  }

  return {
    type: fileObj.type,
    size: fileObj.size,
    data: fileObj.data,
  };
}

/**
 * Validate API parameters
 */
export function validateApiParameters(params: unknown): {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
} {
  if (!params || typeof params !== 'object') {
    return {};
  }

  const paramsObj = params as Record<string, unknown>;
  const validated: Record<string, unknown> = {};

  // Validate model (optional)
  if (paramsObj.model && typeof paramsObj.model === 'string') {
    validated.model = sanitizeText(paramsObj.model);
  }

  // Validate temperature (optional, 0-2)
  if (paramsObj.temperature !== undefined) {
    const temp = Number(paramsObj.temperature);
    if (isNaN(temp) || temp < 0 || temp > 2) {
      throw new Error('temperature must be between 0 and 2');
    }
    validated.temperature = temp;
  }

  // Validate maxTokens (optional, 1-4000)
  if (paramsObj.maxTokens !== undefined) {
    const tokens = Number(paramsObj.maxTokens);
    if (isNaN(tokens) || tokens < 1 || tokens > 4000) {
      throw new Error('maxTokens must be between 1 and 4000');
    }
    validated.maxTokens = tokens;
  }

  // Validate topP (optional, 0-1)
  if (paramsObj.topP !== undefined) {
    const topP = Number(paramsObj.topP);
    if (isNaN(topP) || topP < 0 || topP > 1) {
      throw new Error('topP must be between 0 and 1');
    }
    validated.topP = topP;
  }

  return validated as {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
  };
}

/**
 * Create a safe error response that doesn't expose internal details
 */
export function createSafeErrorResponse(
  error: unknown,
  defaultMessage = 'An error occurred processing your request'
): { message: string; code: string } {
  // Log the actual error for security monitoring
  console.error('[Server Validation Error]', error);

  // Return sanitized error message
  if (error instanceof Error && error.message) {
    // Only return validation error messages, not system errors
    if (
      error.message.includes('must be') ||
      error.message.includes('required') ||
      error.message.includes('invalid')
    ) {
      return {
        message: error.message,
        code: 'VALIDATION_ERROR',
      };
    }
  }

  // Return generic message for system errors
  return {
    message: defaultMessage,
    code: 'SERVER_ERROR',
  };
}

/**
 * Validate request body exists and is an object
 */
export function validateRequestBody(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('Request body must be a valid object');
  }

  return body as Record<string, unknown>;
}

/**
 * Rate limiting check (placeholder for future implementation)
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): boolean {
  // TODO: Implement actual rate limiting with Redis or similar
  // For now, always allow
  return true;
}
