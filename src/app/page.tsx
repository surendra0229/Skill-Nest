import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Terminal, Sparkles, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { AuthBackground } from "@/components/auth/AuthBackground";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-zinc-800 selection:text-white flex flex-col justify-between overflow-hidden">
      <AuthBackground />

      {/* Navigation Bar */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-center shadow-inner">
            <Image
              src="/logo.png"
              alt="Skill Nest"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">
            Skill Nest
          </span>
        </div>

        <nav className="flex items-center gap-3">
          {session?.user ? (
            <Link
              href="/dashboard"
              id="nav-dashboard-link"
              className="bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800/90 rounded-xl px-4 py-2 text-xs font-medium transition-all flex items-center gap-2"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-login-link"
                className="text-zinc-400 hover:text-white text-xs font-medium px-3 py-2 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                id="nav-register-link"
                className="bg-[#111111] hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800/90 rounded-xl px-4 py-2 text-xs font-medium transition-all shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-300 text-xs font-medium mb-8 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Next-Generation Career &amp; Code Mastery</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl leading-[1.15]">
          Sharpen your craft. <br />
          <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            Build your future at Skill Nest.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
          Interactive coding challenges, comprehensive interview prep, and
          industry-aligned skill roadmaps powered by resilient developer tooling.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <Link
            href="/register"
            id="hero-get-started-btn"
            className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-black font-medium text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <Link
            href="/login"
            id="hero-login-btn"
            className="w-full sm:w-auto bg-[#111111] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800/90 font-medium text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Log in to your account</span>
          </Link>
        </div>

        {/* Highlights Row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900/80 backdrop-blur-sm">
            <Terminal className="w-5 h-5 text-zinc-400 mb-3" />
            <h2 className="text-sm font-semibold text-white">Interactive Practice</h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Hands-on algorithms and practical system design scenarios.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900/80 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-zinc-400 mb-3" />
            <h2 className="text-sm font-semibold text-white">Production Auth</h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Secure OAuth &amp; Credentials powered by Auth.js v5 and Drizzle ORM.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-900/80 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 text-zinc-400 mb-3" />
            <h2 className="text-sm font-semibold text-white">Supabase Cloud</h2>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Resilient PostgreSQL data storage with automated connection pooling.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-900/80 py-8 text-center text-xs text-zinc-600">
        <p>© 2026 Skill Nest. All rights reserved.</p>
      </footer>
    </div>
  );
}
