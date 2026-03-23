export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (response.status === 401) {
      // In a real app, you might attempt to refresh the token here.
      // Or rely on middleware to handle auth redirects.
      window.location.href = '/login';
      throw new ApiError(401, 'Unauthorized');
    }

    if (response.status === 403) {
      window.location.href = '/unauthorized';
      throw new ApiError(403, 'Forbidden');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || 'API request failed');
    }

    // Attempt to parse JSON
    const data = await response.json().catch(() => ({}));
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    
    // Handle network errors
    console.error('Network or parsing error:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
}
