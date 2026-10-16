import React, { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen w-full bg-black flex flex-col justify-center items-center px-4 py-12 selection:bg-zinc-800 selection:text-white">
      {/* 3D Diagonal Metallic / Silky Lighting Background */}
      <AuthBackground />

      {/* Top-Left Fixed Navigation Link */}
      <div className="fixed top-8 left-8 z-20">
        <Link
          href="/"
          id="back-home-link"
          className="inline-flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-0.5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Centered Animated Auth Card */}
      <AuthCard>
        <BrandLogo />

        <h1 className="text-2xl font-semibold text-white tracking-tight text-center mt-6">
          Reset your password
        </h1>

        <p className="text-zinc-400 text-sm mt-2 text-center max-w-sm">
          Choose a new password for your Skill Nest account.
        </p>

        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </AuthCard>
    </main>
  );
}
