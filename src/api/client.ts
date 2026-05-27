/**
 * Reusable API Client for Gateway Communication
 * 
 * Gateway runs on ports 5000 (primary) and 5001 (fallback)
 * Base URL is configured via VITE_GATEWAY_BASE_URL environment variable
 * 
 * Example:
 *   const response = await apiClient.post('/api/identity/me', { credential: googleToken })
 */

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  ok: boolean;
  status: number;
  data: T;
}

/**
 * Get the base URL for the gateway API
 * Reads from VITE_GATEWAY_BASE_URL env variable
 */
function getGatewayBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_GATEWAY_BASE_URL;
  
  if (!baseUrl) {
    console.warn(
      'VITE_GATEWAY_BASE_URL not set, defaulting to http://localhost:5000'
    );
    return 'http://localhost:5000';
  }
  
  return baseUrl;
}

/**
 * Get Authorization header with Bearer token
 */
function getAuthHeader(token?: string): Record<string, string> {
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * Make an HTTP request to the gateway API
 * 
 * @param endpoint - API endpoint path (e.g., '/api/identity/me')
 * @param options - Fetch options (method, body, headers, etc.)
 * @param token - Optional auth token for Authorization header
 * @returns Parsed response data
 * @throws Error if request fails or response is not OK
 */
async function request<T = Record<string, unknown>>(
  endpoint: string,
  options: RequestOptions = {},
  token?: string
): Promise<T> {
  const baseUrl = getGatewayBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(token),
    ...options.headers,
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
      const apiError = error as Error & { status?: number; data?: unknown };
      apiError.status = response.status;
      apiError.data = errorData;
      throw error;
    }
    
    // Parse and return response data
    const data = await response.json() as T;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    const err = new Error(`Unknown error during API request: ${String(error)}`);
    Object.defineProperty(err, 'cause', { value: error });
    throw err;
  }
}

/**
 * Public API Client methods
 */
export const apiClient = {
  /**
   * POST request to the gateway
   * 
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param token - Optional auth token
   * @returns Parsed response data
   */
  post: async <T = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown>,
    token?: string
  ): Promise<T> => {
    return request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    );
  },

  /**
   * GET request to the gateway
   * 
   * @param endpoint - API endpoint path
   * @param token - Optional auth token
   * @returns Parsed response data
   */
  get: async <T = Record<string, unknown>>(
    endpoint: string,
    token?: string
  ): Promise<T> => {
    return request<T>(endpoint, { method: 'GET' }, token);
  },

  /**
   * PUT request to the gateway
   * 
   * @param endpoint - API endpoint path
   * @param body - Request body
   * @param token - Optional auth token
   * @returns Parsed response data
   */
  put: async <T = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown>,
    token?: string
  ): Promise<T> => {
    return request<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    );
  },

  /**
   * DELETE request to the gateway
   * 
   * @param endpoint - API endpoint path
   * @param token - Optional auth token
   * @returns Parsed response data
   */
  delete: async <T = Record<string, unknown>>(
    endpoint: string,
    token?: string
  ): Promise<T> => {
    return request<T>(endpoint, { method: 'DELETE' }, token);
  },
};

export type { ApiResponse };
