import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutUser } from "@/actions/auth-actions";
import { Shield, Eye, LogOut, LayoutDashboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const adminName = session.user.name || session.user.username || "Admin";
  const initial = adminName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-900 selection:text-white flex flex-col justify-between font-sans">
      {/* Dedicated Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full h-16 bg-black/95 backdrop-blur border-b border-zinc-900 px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Admin Control Badge */}
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner group-hover:border-amber-600/50 transition-colors">
              <Image
                src="/logo.png"
                alt="Skill Nest"
                width={20}
                height={20}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-white tracking-tight text-base group-hover:text-amber-300 transition-colors">
              Skill Nest Admin CMS
            </span>
          </Link>
          <Badge
            variant="outline"
            className="border-amber-500/40 bg-amber-950/40 text-amber-400 text-[10px] font-mono uppercase px-2 py-0.5 tracking-wider hidden sm:inline-flex items-center gap-1"
          >
            <Shield className="w-3 h-3 text-amber-400" />
            ADMIN CONTROL
          </Badge>
        </div>

        {/* Right: Preview Student View & Admin Profile / Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard?view=student"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            title="Preview student platform interface"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Preview Student View</span>
          </Link>

          {/* Admin Avatar */}
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-black font-bold text-xs flex items-center justify-center uppercase shadow-md shadow-amber-950/30"
            title={`Logged in as ${adminName} (Administrator)`}
          >
            {initial}
          </div>

          {/* Logout Form */}
          <form action={logoutUser}>
            <button
              type="submit"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-900/50 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-zinc-900 py-5 text-center text-xs text-zinc-600 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Skill Nest • Central Platform Management &amp; CMS</p>
          <p className="font-mono text-[11px] text-zinc-500">
            Drizzle ORM • Supabase RLS Protected • Zero Student Cross-Pollution
          </p>
        </div>
      </footer>
    </div>
  );
}
