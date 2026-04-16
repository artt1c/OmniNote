"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RegisterFormValues } from "@/hooks/useRegisterForm";

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
}

export function RegisterForm({ form, isLoading, onSubmit, onGoogleSignIn }: RegisterFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="bg-[#151815] border border-[#242924] rounded-[2.5rem] shadow-2xl overflow-hidden">
      <div className="p-10 flex flex-col items-center">
        {/* Logo Area */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-[#4a6741]/20 blur-xl rounded-2xl" />
          <div className="relative w-16 h-16 bg-[#1a1f1a] border border-[#4a6741]/30 rounded-2xl flex items-center justify-center shadow-[inset_0_0_15px_rgba(74,103,65,0.1)]">
            <BookOpen className="w-8 h-8 text-[#4a6741]" />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-[#e2e8e0] mb-2 tracking-tight">Create Account</h1>
        <p className="text-[#7a634a] text-sm mb-10 text-center font-medium">Start your journey in the sanctuary.</p>

        <form onSubmit={onSubmit} className="w-full space-y-5">
          {errors.root && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-xs text-center animate-in fade-in slide-in-from-top-1">
              {errors.root.message}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7a634a]">
                Username
              </label>
              {errors.username && (
                <span className="text-[10px] text-destructive/80 font-medium lowercase italic">
                  {errors.username.message}
                </span>
              )}
            </div>
            <Input
              {...register("username")}
              type="text"
              placeholder="johndoe"
              className={cn(
                "h-12 bg-[#0f110f] border-[#242924] text-[#e2e8e0] placeholder:text-[#2d362d] rounded-xl focus-visible:ring-[#4a6741]/50 focus-visible:border-[#4a6741]/50 transition-all",
                errors.username && "border-destructive/30 focus-visible:ring-destructive/20 focus-visible:border-destructive/30"
              )}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7a634a]">
                Email Address
              </label>
              {errors.email && (
                <span className="text-[10px] text-destructive/80 font-medium lowercase italic">
                  {errors.email.message}
                </span>
              )}
            </div>
            <Input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={cn(
                "h-12 bg-[#0f110f] border-[#242924] text-[#e2e8e0] placeholder:text-[#2d362d] rounded-xl focus-visible:ring-[#4a6741]/50 focus-visible:border-[#4a6741]/50 transition-all",
                errors.email && "border-destructive/30 focus-visible:ring-destructive/20 focus-visible:border-destructive/30"
              )}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7a634a]">
                Password
              </label>
              {errors.password && (
                <span className="text-[10px] text-destructive/80 font-medium lowercase italic">
                  {errors.password.message}
                </span>
              )}
            </div>
            <Input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className={cn(
                "h-12 bg-[#0f110f] border-[#242924] text-[#e2e8e0] placeholder:text-[#2d362d] rounded-xl focus-visible:ring-[#4a6741]/50 focus-visible:border-[#4a6741]/50 transition-all",
                errors.password && "border-destructive/30 focus-visible:ring-destructive/20 focus-visible:border-destructive/30"
              )}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#7a634a]">
                Confirm Password
              </label>
              {errors.confirmPassword && (
                <span className="text-[10px] text-destructive/80 font-medium lowercase italic">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className={cn(
                "h-12 bg-[#0f110f] border-[#242924] text-[#e2e8e0] placeholder:text-[#2d362d] rounded-xl focus-visible:ring-[#4a6741]/50 focus-visible:border-[#4a6741]/50 transition-all",
                errors.confirmPassword && "border-destructive/30 focus-visible:ring-destructive/20 focus-visible:border-destructive/30"
              )}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#4a6741] hover:bg-[#5a7d4f] text-[#0f110f] font-bold rounded-xl transition-all shadow-lg shadow-[#4a6741]/10 active:scale-[0.98] disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#242924]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="bg-[#151815] px-4 text-[#7a634a]">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-transparent border-[#242924] hover:bg-[#1a1f1a] hover:text-[#e2e8e0] text-[#e2e8e0] font-medium rounded-xl transition-all gap-3"
            disabled={isLoading}
            onClick={onGoogleSignIn}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </form>
      </div>

      <div className="bg-[#1a1f1a]/50 p-6 flex justify-center border-t border-[#242924]">
        <p className="text-sm text-[#7a634a]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4a6741] font-semibold hover:text-[#5a7d4f] transition-colors ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
