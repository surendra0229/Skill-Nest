import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { BrandLogo } from "@/components/auth/BrandLogo";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthCard } from "@/components/auth/AuthCard";

export default function LoginPage() {
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
          Log in to Skill Nest
        </h1>

        <p className="text-zinc-400 text-sm mt-2 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            id="switch-to-register-link"
            className="text-white font-medium hover:underline underline-offset-4 transition-all"
          >
            Sign up.
          </Link>
        </p>

        <LoginForm />
      </AuthCard>
    </main>
  );
}
