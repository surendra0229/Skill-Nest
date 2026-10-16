import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRemainingQuotas } from "@/lib/rate-limit";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { FloatingWidgets } from "@/components/dashboard/floating-widgets";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch real-time rate limit quotas for the current user
  const quotas = await getRemainingQuotas(
    session.user.id,
    session.user.role ?? "user"
  );

  const aiQuota = quotas.quotas.find((q) => q.action === "ai_tutor_chat");

  return (
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-black text-slate-900 dark:text-zinc-100 flex flex-col justify-between overflow-x-hidden font-sans transition-colors duration-200">
      {/* Top Horizontal Navbar — Persistent Segmented Pill Switcher (NO Left Sidebar) */}
      <TopNavbar user={session.user} quotas={quotas} />

      {/* Full-Width Main Content Canvas */}
      <main className="flex-1 w-full">{children}</main>

      {/* Floating Action Widgets: JAM Board (bottom-left) & AI Tutor (bottom-right) */}
      <FloatingWidgets aiQuota={aiQuota} isAdmin={quotas.isAdmin} />

      {/* Clean Dual-Theme Footer */}
      <footer className="w-full border-t border-slate-200/90 dark:border-zinc-900/80 py-6 text-center text-xs text-slate-500 dark:text-zinc-500 bg-white/70 dark:bg-black/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Skill Nest • Interactive Engineering Ecosystem</p>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400 dark:text-zinc-500">
            <span>Auth.js v5 JWT</span>
            <span>•</span>
            <span>Multi-Tier Rate Limited</span>
            <span>•</span>
            <span>Drizzle ORM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
