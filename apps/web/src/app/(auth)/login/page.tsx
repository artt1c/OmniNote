"use client";

import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginPage() {
  const { form, isLoading, onSubmit, onGoogleSignIn } = useLoginForm();

  return (
    <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
      <LoginForm 
        form={form} 
        isLoading={isLoading} 
        onSubmit={onSubmit} 
        onGoogleSignIn={onGoogleSignIn}
      />
    </div>
  );
}
