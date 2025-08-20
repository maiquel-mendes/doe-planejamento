import { authService } from '@/contexts/auth-context';

// Store the accessToken in memory.
let accessToken: string | null = null;

// Function to set the access token.
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Function to get the access token.
export const getAccessToken = () => accessToken;

// Function to refresh the token.
const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await fetch('/api/auth/refresh', { method: 'POST' });
    if (!res.ok) {
      throw new Error('Failed to refresh token');
    }
    const { accessToken: newAccessToken } = await res.json();
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    setAccessToken(null);
    // Trigger logout from auth context if refresh fails
    authService.logout();
    return null;
  }
};

// Custom fetch wrapper
export const api = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAccessToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  options.headers = headers;

  let response = await fetch(url, options);

  // If response is unauthorized and it's not a retry
  if (response.status === 401 && !options.headers.has('X-Retry')) {
    const newAccessToken = await refreshToken();

    if (newAccessToken) {
      // Add a header to indicate this is a retry
      const newHeaders = new Headers(options.headers);
      newHeaders.set('Authorization', `Bearer ${newAccessToken}`);
      newHeaders.set('X-Retry', 'true');
      options.headers = newHeaders;

      // Retry the original request
      response = await fetch(url, options);
    }
  }

  return response;
};

// We need a way to inject the authService later to avoid circular dependencies
// This will be done in the AuthProvider.
export const injectAuthService = (service: { logout: () => void }) => {
  Object.assign(authService, service);
};
