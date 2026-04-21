import { getAuthCookie, getRefreshTokenCookie, setAuthCookie, removeAuthCookie } from './auth-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const getHeaders = (token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    const currentToken = token || getAuthCookie();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    return headers;
  };

  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
  });

  if (response.status === 401 && !path.includes('/auth/refresh')) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          resolve(fetchApi(path, { ...options, headers: getHeaders(token) }));
        });
      });
    }

    const refreshToken = getRefreshTokenCookie();
    if (!refreshToken) {
      removeAuthCookie();
      throw new Error('Session expired. Please login again.');
    }

    isRefreshing = true;
    try {
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Refresh failed');
      }

      const { token, refreshToken: newRefreshToken } = await refreshResponse.json();
      setAuthCookie(token, newRefreshToken);
      isRefreshing = false;
      onRefreshed(token);

      return fetchApi(path, { ...options, headers: getHeaders(token) });
    } catch (err) {
      isRefreshing = false;
      removeAuthCookie();
      throw new Error('Session expired. Please login again.');
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || errorBody.error || `API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
