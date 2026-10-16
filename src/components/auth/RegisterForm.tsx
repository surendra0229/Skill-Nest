"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { registerUser } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onTouched",
  });

  const acceptTermsValue = form.watch("acceptTerms");

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsSubmitting(true);
      const res = await registerUser(data);

      if (!res.success) {
        toast.error(res.error || "Failed to create account.");
        setIsSubmitting(false);
        return;
      }

      toast.success(res.message || "Account created successfully!");
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1200);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
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

      {/* 5-Field Registration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
          {/* 1. Full Name Field */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-zinc-400 font-normal">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    autoComplete="name"
                    className="bg-[#141414] border-zinc-800/90 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 rounded-xl h-10 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-150"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 2. Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-zinc-400 font-normal">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="nick name"
                    autoComplete="username"
                    className="bg-[#141414] border-zinc-800/90 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 rounded-xl h-10 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-150"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 3. Email Field */}
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
                    placeholder="Enter your mail"
                    autoComplete="email"
                    className="bg-[#141414] border-zinc-800/90 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-600 rounded-xl h-10 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all duration-150"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 4. Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-zinc-400 font-normal">
                  Password
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

          {/* 5. Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs text-zinc-400 font-normal">
                  Confirm Password
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

          {/* Mandatory Terms Checkbox */}
          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="space-y-1 pt-1">
                <div className="flex flex-row items-center space-x-2.5">
                  <FormControl>
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-zinc-700 bg-[#141414] data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-white rounded-[4px] cursor-pointer"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="acceptTerms"
                    className="text-xs text-zinc-400 font-normal select-none cursor-pointer leading-tight"
                  >
                    Accepting the terms and conditions
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            id="register-submit-btn"
            disabled={!acceptTermsValue || isSubmitting}
            className="w-full bg-[#111111] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 rounded-xl h-10 text-sm font-medium transition-all mt-3 cursor-pointer shadow-sm hover:shadow-black/60 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </Button>
        </form>
      </Form>

      {/* Footer Legal Text with Interactive Terms Dialog */}
      <div className="text-[11px] text-zinc-500 text-center mt-6 leading-relaxed">
        By signing up, you agree to our{" "}
        <TermsDialog />
      </div>
    </div>
  );
}
