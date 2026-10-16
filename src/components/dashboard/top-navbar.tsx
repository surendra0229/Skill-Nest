"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Gamepad2,
  Flame,
  Shield,
  ShieldCheck,
  Moon,
  Sun,
  LogOut,
  Settings,
  Sparkles,
  Zap,
  Info,
} from "lucide-react";
import { logoutUser } from "@/actions/auth-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export type DashboardPillar = "learning" | "jobs" | "arcade";

export interface QuotaItem {
  action: string;
  label: string;
  limit: number;
  remaining: number;
  used: number;
  unit: string;
}

export interface QuotasData {
  isAdmin: boolean;
  quotas: QuotaItem[];
}

interface TopNavbarProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: "user" | "admin";
    username?: string | null;
    streak?: number;
  };
  quotas?: QuotasData;
  activePillar?: DashboardPillar;
  onPillarChange?: (pillar: DashboardPillar) => void;
}

export function TopNavbar({
  user,
  quotas,
  activePillar: controlledPillar,
  onPillarChange,
}: TopNavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Derive initial active pillar from prop, query parameter, or default to "learning"
  const urlPillar = (searchParams.get("pillar") as DashboardPillar) || "learning";
  const [internalPillar, setInternalPillar] = useState<DashboardPillar>(
    controlledPillar || urlPillar
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (controlledPillar) {
      setInternalPillar(controlledPillar);
    } else {
      const p = (searchParams.get("pillar") as DashboardPillar) || "learning";
      setInternalPillar(p);
    }
  }, [controlledPillar, searchParams]);

  const handleSelectPillar = (pillar: DashboardPillar) => {
    setInternalPillar(pillar);
    if (onPillarChange) {
      onPillarChange(pillar);
    } else {
      // Smooth URL sync without full page reload
      const params = new URLSearchParams(window.location.search);
      params.set("pillar", pillar);
      window.history.pushState(null, "", `?${params.toString()}`);
      // Dispatch custom event for dashboard listeners
      window.dispatchEvent(new CustomEvent("skillnest:pillarChange", { detail: pillar }));
    }
  };

  const currentPillar = controlledPillar || internalPillar;

  // Derive user display name & initial
  const displayName = user.name || user.username || user.email || "Student";
  const userInitial = displayName.charAt(0).toUpperCase();
  const streakCount = user.streak ?? 5;

  const defaultQuotas: QuotaItem[] = [
    { action: "ats_resume_analysis", label: "ATS Scans", limit: 5, remaining: 4, used: 1, unit: "daily" },
    { action: "latex_resume_build", label: "LaTeX Builds", limit: 10, remaining: 8, used: 2, unit: "hourly" },
    { action: "contest_room_create", label: "Contest Rooms", limit: 3, remaining: 3, used: 0, unit: "hourly" },
    { action: "ai_tutor_chat", label: "AI Tutor", limit: 25, remaining: 21, used: 4, unit: "hourly" },
    { action: "judge0_code_run", label: "Judge0 Code Runs", limit: 30, remaining: 28, used: 2, unit: "15-min" },
  ];

  const quotaList = quotas?.quotas && quotas.quotas.length > 0 ? quotas.quotas : defaultQuotas;
  const isAdmin = user.role === "admin" || quotas?.isAdmin;

  return (
    <header className="sticky top-0 z-40 w-full h-16 px-4 sm:px-6 flex items-center justify-between border-b bg-white/90 dark:bg-black/90 backdrop-blur-md border-slate-200/90 dark:border-zinc-900 transition-colors duration-200 select-none">
      {/* ---------------------------------------------------------------- */}
      {/* Left — Brand Identity                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="Skill Nest"
              width={22}
              height={22}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Skill Nest
          </span>
        </Link>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Center — Navbar Segmented Pill Switcher                          */}
      {/* Matches the exact Anatomy: Rounded Track + Active Blue Indicator */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center justify-center">
        <div
          role="tablist"
          aria-label="Dashboard View Switcher"
          className="inline-flex items-center p-1 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-inner"
        >
          {/* Pill 1: 🎓 Learning Path */}
          <button
            type="button"
            role="tab"
            aria-selected={currentPillar === "learning"}
            onClick={() => handleSelectPillar("learning")}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer focus:outline-none ${
              currentPillar === "learning"
                ? "text-white font-semibold"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {currentPillar === "learning" && (
              <motion.div
                layoutId="navbar-segmented-pill"
                className="absolute inset-0 bg-blue-600 rounded-full shadow-md shadow-blue-600/25"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
            <span className="relative z-10 whitespace-nowrap">Learning Path</span>
          </button>

          {/* Pill 2: 💼 Jobs & Resume */}
          <button
            type="button"
            role="tab"
            aria-selected={currentPillar === "jobs"}
            onClick={() => handleSelectPillar("jobs")}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer focus:outline-none ${
              currentPillar === "jobs"
                ? "text-white font-semibold"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {currentPillar === "jobs" && (
              <motion.div
                layoutId="navbar-segmented-pill"
                className="absolute inset-0 bg-blue-600 rounded-full shadow-md shadow-blue-600/25"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
            <span className="relative z-10 whitespace-nowrap">Jobs &amp; Resume</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Right — Arcade, Streak, Quota Shield, Theme Toggle & Profile     */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* 🎮 Arcade Button */}
        <button
          type="button"
          onClick={() => handleSelectPillar("arcade")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
            currentPillar === "arcade"
              ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/25"
              : "bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-800"
          }`}
          title="Switch to 15-Game Developer Arcade"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Arcade</span>
        </button>

        {/* 🔥 Streak Pill */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 text-xs font-semibold"
          title={`${streakCount} day study streak`}
        >
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{streakCount}d</span>
        </div>

        {/* 🛡️ API Rate-Limit Shield Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="p-2 rounded-full text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
              title="API Quotas & Rate Limit Shield"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-80 p-4 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 shadow-xl rounded-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  API Quota Shield
                </h4>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
              >
                {isAdmin ? "UNLIMITED" : "PROTECTED"}
              </Badge>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-zinc-400 my-2.5">
              Live rate-limiting safeguards third-party API tokens (Judge0, ATS AI, JSearch, and AI Tutor).
            </p>

            <div className="space-y-3 mt-3">
              {quotaList.map((item) => {
                const percent = Math.round((item.remaining / item.limit) * 100);
                return (
                  <div key={item.action} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-zinc-300">
                        {item.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                        {item.remaining} / {item.limit} ({item.unit})
                      </span>
                    </div>
                    <Progress
                      value={percent}
                      className="h-1.5 bg-slate-100 dark:bg-zinc-900"
                    />
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>

        {/* ☀️ / 🌙 Theme Toggle Button */}
        {mounted && (
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
            title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} mode`}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 transition-transform rotate-0 hover:-rotate-12" />
            )}
          </button>
        )}

        {/* 👤 User Avatar & Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs hover:ring-2 hover:ring-blue-500/40 transition-all cursor-pointer focus:outline-none"
              title={`Logged in as ${displayName}`}
            >
              {userInitial}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 p-1.5 bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl"
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-zinc-800">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                {user.email}
              </p>
              <Badge
                variant="outline"
                className="mt-1.5 text-[10px] font-mono capitalize px-1.5 py-0 border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
              >
                {user.role === "admin" ? "Platform Administrator" : "Student"}
              </Badge>
            </div>

            {user.role === "admin" && (
              <DropdownMenuItem asChild>
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 px-3 py-2 cursor-pointer rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin CMS Control
                </Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem asChild>
              <button
                type="button"
                onClick={() => handleSelectPillar("learning")}
                className="w-full flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                Learning Dashboard
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <button
                type="button"
                onClick={() => handleSelectPillar("jobs")}
                className="w-full flex items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 px-3 py-2 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                Jobs &amp; Resume Lab
              </button>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />

            <form action={logoutUser} className="w-full">
              <button
                type="submit"
                className="w-full flex items-center gap-2 text-xs text-red-600 dark:text-red-400 px-3 py-2 cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
