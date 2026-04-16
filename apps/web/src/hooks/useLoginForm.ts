import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { setAuthCookie } from "@/lib/auth-cookie";
import { getAllLocalNotes } from "@/lib/indexeddb-notes";
import { supabase } from "@/lib/supabase-client";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetchApi<{ user: any; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setAuthCookie(response.token);

      checkAndSyncLocalNotes();

      router.push("/");
    } catch (error: any) {
      form.setError("root", {
        type: "manual",
        message: error.message || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function checkAndSyncLocalNotes() {
    const localNotes = await getAllLocalNotes();

    if (localNotes.length > 0) {
      await fetchApi("/notes/sync", {
        method: "POST",
        body: JSON.stringify(localNotes.map((n) => ({ id: n.id, title: n.title }))),
      });
    }
  }

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      form.setError("root", {
        type: "manual",
        message: error.message || "Failed to sign in with Google",
      });
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
    onGoogleSignIn,
  };
}

