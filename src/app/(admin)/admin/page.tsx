import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  users,
  languageNotes,
  dsaQuestions,
  careerRoadmaps,
  rateLimits,
} from "@/db/schema";
import { desc } from "drizzle-orm";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch real-time metrics and data from all tables via Drizzle ORM
  const [usersList, notesList, dsaList, roadmapsList, rateLimitsList] =
    await Promise.all([
      db.select().from(users).orderBy(desc(users.createdAt)).limit(50),
      db.select().from(languageNotes).orderBy(desc(languageNotes.createdAt)),
      db.select().from(dsaQuestions).orderBy(desc(dsaQuestions.createdAt)),
      db.select().from(careerRoadmaps).orderBy(desc(careerRoadmaps.createdAt)),
      db.select().from(rateLimits).limit(100),
    ]);

  const stats = {
    totalUsers: usersList.length,
    totalNotes: notesList.length,
    totalDsa: dsaList.length,
    totalRoadmaps: roadmapsList.length,
    totalRateLimitBlocks: rateLimitsList.length,
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Platform Governance &amp; CMS
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Add curriculum resources, oversee student progression, and protect API token allocations.
        </p>
      </div>

      <AdminDashboardClient
        stats={stats}
        usersList={usersList}
        notesList={notesList}
        dsaList={dsaList}
        roadmapsList={roadmapsList}
      />
    </div>
  );
}
