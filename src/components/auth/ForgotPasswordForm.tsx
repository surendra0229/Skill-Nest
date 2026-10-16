"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { requestPasswordReset } from "@/actions/auth-actions";
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

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setIsSubmitting(true);
      const res = await requestPasswordReset(data);

      if (!res.success) {
        toast.error(res.error || "Failed to process password reset.");
        setIsSubmitting(false);
        return;
      }

      setSubmittedEmail(data.email);
      toast.success(res.message);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-6">
      {submittedEmail ? (
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-zinc-300">
            A password reset link has been dispatched to{" "}
            <span className="font-semibold text-white">{submittedEmail}</span>.
          </p>
          <p className="text-xs text-zinc-500">
            Check your inbox (or terminal console in development) to continue.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to log in</span>
            </Link>
          </div>
        </div>
      ) : (
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

            {/* Submit Button */}
            <Button
              type="submit"
              id="send-reset-link-btn"
              disabled={isSubmitting}
              className="w-full bg-[#111111] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 rounded-xl h-10 text-sm font-medium transition-all mt-2 cursor-pointer shadow-sm hover:shadow-black/60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send reset link</span>
              )}
            </Button>

            {/* Back to Log in link */}
            <div className="text-center pt-3">
              <Link
                href="/login"
                id="back-to-login-link"
                className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                <span>Back to log in</span>
              </Link>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
