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
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('omninote_user_profile');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {}
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      if (!isAuthenticated || !token) {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('omninote_user_profile');
        }
        setIsLoading(false);
        return;
      }

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchApi<{ user: UserProfile }>('/auth/me');
        if (isMounted) {
          setUser(data.user);
          if (typeof window !== 'undefined') {
            localStorage.setItem('omninote_user_profile', JSON.stringify(data.user));
          }
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('[useUser] Failed to fetch user profile:', err.message);
          setError(err.message);

          const isNetworkError = 
            (typeof navigator !== 'undefined' && !navigator.onLine) ||
            err.message?.includes('Failed to fetch') ||
            err.message?.includes('NetworkError') ||
            err.message?.includes('Load failed');

          if (!isNetworkError) {
            setUser(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('omninote_user_profile');
            }
            refreshAuth();
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchUser();

    if (typeof window !== 'undefined') {
      const handleOnline = () => fetchUser();
      window.addEventListener('online', handleOnline);
      return () => {
        isMounted = false;
        window.removeEventListener('online', handleOnline);
      };
    }

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
