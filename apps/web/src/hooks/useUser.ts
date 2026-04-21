'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
}

/**
 * Hook to manage and fetch current user profile data.
 * Uses the /auth/me endpoint to sync user state.
 */
export function useUser() {
  const { isAuthenticated, token, refresh: refreshAuth } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      if (!isAuthenticated || !token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchApi<{ user: UserProfile }>('/auth/me');
        if (isMounted) {
          setUser(data.user);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('[useUser] Failed to fetch user profile:', err.message);
          setError(err.message);
          setUser(null);
          refreshAuth();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token, refreshAuth]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
  };
}
