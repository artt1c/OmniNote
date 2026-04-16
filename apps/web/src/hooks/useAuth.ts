'use client';

import { useState, useEffect } from 'react';
import { getAuthCookie } from '@/lib/auth-cookie';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | undefined;
  isLoading: boolean;
}

/**
 * Reactive hook that reflects the current authentication state.
 * Reads from the `access_token` cookie. Re-checks on storage events
 * so UI updates immediately after login/logout.
 */
export function useAuth(): AuthState {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial read
    setToken(getAuthCookie());
    setIsLoading(false);

    // Re-read when the tab becomes visible again (e.g. after login in another tab)
    const onVisibilityChange = () => {
      setToken(getAuthCookie());
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return {
    isAuthenticated: !!token,
    token,
    isLoading,
  };
}
