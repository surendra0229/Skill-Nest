"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { resetPassword } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  if (!token) {
    return (
      <div className="w-full mt-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center mx-auto text-red-400">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-medium text-red-200">Invalid or Missing Token</h3>
        <p className="text-xs text-zinc-400">
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="text-xs text-white underline underline-offset-4 hover:text-zinc-200"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      setIsSubmitting(true);
      const res = await resetPassword(data);

      if (!res.success) {
        toast.error(res.error || "Failed to reset password.");
        setIsSubmitting(false);
        return;
      }

      toast.success(res.message);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...form.register("token")} value={token} />

          {/* New Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-zinc-400 font-normal">
                  New Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      className="bg-[#141414] border-zinc-800/90 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 rounded-xl h-10 px-3.5 pr-10 text-sm text-zinc-100 placeholder:text-zinc-500 tracking-wider transition-all duration-150"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-transparent transition-colors p-0 cursor-pointer focus-visible:ring-0"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm New Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-zinc-400 font-normal">
                  Confirm New Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      className="bg-[#141414] border-zinc-800/90 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 rounded-xl h-10 px-3.5 pr-10 text-sm text-zinc-100 placeholder:text-zinc-500 tracking-wider transition-all duration-150"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-500 hover:text-zinc-300 hover:bg-transparent transition-colors p-0 cursor-pointer focus-visible:ring-0"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            id="reset-password-submit-btn"
            disabled={isSubmitting}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 rounded-xl h-10 text-sm font-medium transition-all mt-2 cursor-pointer shadow-sm hover:shadow-black/60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span>Resetting password...</span>
              </>
            ) : (
              <span>Reset password</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
