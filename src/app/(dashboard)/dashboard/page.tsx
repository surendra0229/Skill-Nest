import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  users,
  languageNotes,
  dsaQuestions,
  careerRoadmaps,
} from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardCanvas } from "@/components/dashboard/dashboard-canvas";
import type { DashboardPillar } from "@/components/dashboard/top-navbar";

interface PageProps {
  searchParams: Promise<{ pillar?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const initialPillar = (resolvedParams?.pillar as DashboardPillar) || "learning";

  // Fetch real-time user stats and Admin-managed CMS resources directly from Supabase PostgreSQL
  let userStats = {
    name: session.user.name,
    username: session.user.username,
    email: session.user.email,
    role: session.user.role,
    dsaSolved: 0,
    contestSolved: 0,
    atsChecksCount: 0,
    latestAtsScore: null as number | null,
    modulesCompleted: 0,
    xp: 0,
    streak: 5,
  };

  let notesList: Array<typeof languageNotes.$inferSelect> = [];
  let dsaList: Array<typeof dsaQuestions.$inferSelect> = [];
  let roadmapsList: Array<typeof careerRoadmaps.$inferSelect> = [];

  try {
    const [dbUser, notesData, dsaData, roadmapsData] = await Promise.all([
      db
        .select({
          name: users.name,
          username: users.username,
          email: users.email,
          role: users.role,
          dsaSolved: users.dsaSolved,
          contestSolved: users.contestSolved,
          atsChecksCount: users.atsChecksCount,
          latestAtsScore: users.latestAtsScore,
          modulesCompleted: users.modulesCompleted,
          xp: users.xp,
          streak: users.streak,
        })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1),
      db
        .select()
        .from(languageNotes)
        .orderBy(desc(languageNotes.createdAt))
        .limit(6),
      db
        .select()
        .from(dsaQuestions)
        .orderBy(desc(dsaQuestions.createdAt))
        .limit(10),
      db
        .select()
        .from(careerRoadmaps)
        .orderBy(desc(careerRoadmaps.createdAt))
        .limit(6),
    ]);

    if (dbUser[0]) {
      userStats = {
        ...userStats,
        ...dbUser[0],
      };
    }

    notesList = notesData;
    dsaList = dsaData;
    roadmapsList = roadmapsData;
  } catch (error) {
    console.error("Failed to load dashboard data from Supabase DB:", error);
  }

  return (
    <DashboardCanvas
      initialPillar={initialPillar}
      userStats={userStats}
      notes={notesList}
      dsaQuestions={dsaList}
      roadmaps={roadmapsList}
    />
  );
}
