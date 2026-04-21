import { useState, useEffect, useCallback } from 'react';
import { getAuthCookie } from '@/lib/auth-cookie';

export interface AuthState {
  isAuthenticated: boolean;
  token: string | undefined;
  isLoading: boolean;
  refresh: () => void;
}

export function useAuth(): AuthState {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setToken(getAuthCookie());
  }, []);

  useEffect(() => {
    refresh();
    setIsLoading(false);

    document.addEventListener('visibilitychange', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [refresh]);

  return {
    isAuthenticated: !!token,
    token,
    isLoading,
    refresh,
  };
}
