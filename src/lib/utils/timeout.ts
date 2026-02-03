/**
 * Timeout Utility with AbortController
 * 
 * Provides a 15-second timeout for API requests with
 * AbortController support for manual cancellation.
 */

/**
 * Default timeout in milliseconds (15 seconds)
 */
export const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Create an AbortController with automatic timeout
 * 
 * @param timeoutMs - Timeout duration in milliseconds (default: 15000)
 * @returns Object with controller and cleanup function
 */
export function createTimeoutController(timeoutMs: number = DEFAULT_TIMEOUT_MS): {
  controller: AbortController;
  timeoutId: NodeJS.Timeout;
  cleanup: () => void;
} {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const cleanup = () => {
    clearTimeout(timeoutId);
  };

  return { controller, timeoutId, cleanup };
}

/**
 * Fetch with automatic timeout
 * 
 * Wrapper around fetch that adds automatic 15-second timeout
 * and cleanup on completion or error.
 * 
 * @param input - Fetch URL or Request
 * @param init - Fetch options (excluding signal)
 * @param timeoutMs - Timeout duration in milliseconds (default: 15000)
 * @returns Fetch Response promise
 * @throws Error if request times out or is aborted
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: Omit<RequestInit, 'signal'>,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const { controller, cleanup } = createTimeoutController(timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw error;
  } finally {
    cleanup();
  }
}

/**
 * Hook result for managing API requests with timeout
 */
export interface UseTimeoutControllerResult {
  /** AbortController instance */
  controller: AbortController | null;
  /** Create new controller with timeout */
  createController: () => AbortController;
  /** Cancel current request */
  cancelRequest: () => void;
  /** Cleanup on unmount */
  cleanup: () => void;
}

/**
 * React hook for managing AbortController with timeout
 * 
 * Use this in React components to manage API requests with
 * automatic timeout and manual cancellation.
 * 
 * @param timeoutMs - Timeout duration in milliseconds (default: 15000)
 * @returns Controller management functions
 * 
 * @example
 * ```tsx
 * const { createController, cancelRequest, cleanup } = useTimeoutController();
 * 
 * const handleGenerate = async () => {
 *   const controller = createController();
 *   
 *   try {
 *     const response = await fetch('/api/generate', {
 *       signal: controller.signal,
 *       // ... other options
 *     });
 *   } catch (error) {
 *     if (error.name === 'AbortError') {
 *       console.log('Request cancelled or timed out');
 *     }
 *   }
 * };
 * 
 * // Cleanup on unmount
 * useEffect(() => cleanup, [cleanup]);
 * ```
 */
export function useTimeoutController(
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): () => UseTimeoutControllerResult {
  return () => {
    let controller: AbortController | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const createController = (): AbortController => {
      // Clean up previous controller
      if (controller) {
        controller.abort();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Create new controller with timeout
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller?.abort();
      }, timeoutMs);

      return controller;
    };

    const cancelRequest = () => {
      if (controller) {
        controller.abort();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

    const cleanup = () => {
      cancelRequest();
      controller = null;
      timeoutId = null;
    };

    return {
      controller,
      createController,
      cancelRequest,
      cleanup,
    };
  };
}
