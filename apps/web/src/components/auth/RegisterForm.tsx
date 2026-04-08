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
}

export function RegisterForm({ form, isLoading, onSubmit }: RegisterFormProps) {
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
                Full Name
              </label>
              {errors.name && (
                <span className="text-[10px] text-destructive/80 font-medium lowercase italic">
                  {errors.name.message}
                </span>
              )}
            </div>
            <Input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className={cn(
                "h-12 bg-[#0f110f] border-[#242924] text-[#e2e8e0] placeholder:text-[#2d362d] rounded-xl focus-visible:ring-[#4a6741]/50 focus-visible:border-[#4a6741]/50 transition-all",
                errors.name && "border-destructive/30 focus-visible:ring-destructive/20 focus-visible:border-destructive/30"
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
