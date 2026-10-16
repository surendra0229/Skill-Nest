"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { loginWithCredentials } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OAuthButtons } from "./OAuthButtons";
import { TermsDialog } from "./terms-dialog";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsSubmitting(true);
      const res = await loginWithCredentials(data);

      if (res && !res.success) {
        toast.error(res.error || "Invalid credentials.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Welcome back to Skill Nest!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      // In Next.js server actions, redirect may bubble up as expected
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full">
      {/* Social OAuth Buttons */}
      <OAuthButtons labelPrefix="Log in" />

      {/* Divider with shadcn Separators */}
      <div className="relative my-6 flex items-center justify-center gap-3">
        <Separator className="flex-1 bg-zinc-800/80" />
        <span className="text-xs text-zinc-500 select-none lowercase">or</span>
        <Separator className="flex-1 bg-zinc-800/80" />
      </div>

      {/* shadcn React Hook Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-zinc-400 font-normal">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="alan.turing@example.com"
                    autoComplete="email"
                    className="bg-[#141414] border-zinc-800/90 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 rounded-xl h-10 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-150"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs text-zinc-400 font-normal">
                    Password
                  </FormLabel>
                  <Link
                    href="/forgot-password"
                    id="forgot-password-link"
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
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

          {/* Submit Button */}
          <Button
            type="submit"
            id="login-submit-btn"
            disabled={isSubmitting}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 rounded-xl h-10 text-sm font-medium transition-all mt-2 cursor-pointer shadow-sm hover:shadow-black/60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log in</span>
            )}
          </Button>
        </form>
      </Form>

      {/* Footer Legal Text */}
      <div className="text-[11px] text-zinc-500 text-center mt-6 leading-relaxed">
        By logging in, you agree to our{" "}
        <TermsDialog />
      </div>
    </div>
  );
}
