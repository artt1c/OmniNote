'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { setAuthCookie } from '@/lib/auth-cookie';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Supabase-js automatically handles the hash/query params
        // when detectSessionInUrl is true, but we call getSession
        // to ensure it's processed and we get the latest session.
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.access_token) {
          // Set our app-specific auth cookie so our backend can verify it.
          setAuthCookie(session.access_token);
          
          // Redirect to the home page after a successful login.
          router.replace('/');
        } else {
          // No session found, redirect to login.
          router.replace('/login');
        }
      } catch (err) {
        console.error('Error during auth callback:', err);
        router.replace('/login?error=auth_callback_failed');
      }
    }

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-white">
      <Loader2 className="w-10 h-10 animate-spin text-[#4a6741]" />
      <div className="text-sm uppercase tracking-widest opacity-50">
        Verifying your Sanctuary access...
      </div>
    </div>
  );
}

/**
 * Authentication callback page for Supabase OAuth flows.
 * Handles the session exchange and synchronizes with the local auth cookie.
 */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackContent />
    </Suspense>
  );
}
