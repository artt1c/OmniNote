import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

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

      // Storage
      localStorage.setItem("access_token", response.token);
      localStorage.setItem("user_email", response.user.email);

      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      // Set error on the root so it shows the general error message
      form.setError("root", {
        type: "manual",
        message: error.message || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
