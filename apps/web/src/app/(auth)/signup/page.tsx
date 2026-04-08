"use client";

import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export default function RegisterPage() {
  const { form, isLoading, onSubmit } = useRegisterForm();

  return (
    <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
      <RegisterForm 
        form={form} 
        isLoading={isLoading} 
        onSubmit={onSubmit} 
      />
    </div>
  );
}
