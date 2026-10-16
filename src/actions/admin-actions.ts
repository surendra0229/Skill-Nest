"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import {
  users,
  languageNotes,
  dsaQuestions,
  careerRoadmaps,
  rateLimits,
} from "@/db/schema";
import { eq, like } from "drizzle-orm";

/**
 * Helper to enforce admin authorization for Server Actions.
 */
async function verifyAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session.user;
}

// -----------------------------------------------------------------------------
// 1. Language Notes CMS Actions
// -----------------------------------------------------------------------------

export async function createLanguageNote(formData: {
  language: string;
  title: string;
  category: string;
  content: string;
  useCases: string;
  codeExample?: string;
}) {
  await verifyAdminAuth();

  if (!formData.language || !formData.title || !formData.category || !formData.content) {
    return { success: false, error: "Missing required fields for Language Note." };
  }

  try {
    const [created] = await db
      .insert(languageNotes)
      .values({
        language: formData.language.trim(),
        title: formData.title.trim(),
        category: formData.category.trim(),
        content: formData.content.trim(),
        useCases: formData.useCases?.trim() || "General Engineering",
        codeExample: formData.codeExample?.trim() || null,
      })
      .returning();

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/learning");

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create language note:", error);
    return { success: false, error: "Failed to create language note in database." };
  }
}

export async function deleteLanguageNote(id: string) {
  await verifyAdminAuth();

  try {
    await db.delete(languageNotes).where(eq(languageNotes.id, id));
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/learning");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete language note:", error);
    return { success: false, error: "Failed to delete language note." };
  }
}

// -----------------------------------------------------------------------------
// 2. DSA Questions CMS Actions
// -----------------------------------------------------------------------------

export async function createDsaQuestion(formData: {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string;
  description: string;
  starterCode?: string;
  testCases?: string;
  leetcodeUrl?: string;
}) {
  await verifyAdminAuth();

  if (!formData.title || !formData.difficulty || !formData.pattern || !formData.description) {
    return { success: false, error: "Missing required fields for DSA Question." };
  }

  try {
    const [created] = await db
      .insert(dsaQuestions)
      .values({
        title: formData.title.trim(),
        difficulty: formData.difficulty,
        pattern: formData.pattern.trim(),
        description: formData.description.trim(),
        starterCode: formData.starterCode?.trim() || null,
        testCases: formData.testCases?.trim() || null,
        leetcodeUrl: formData.leetcodeUrl?.trim() || null,
      })
      .returning();

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/dsa");

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create DSA question:", error);
    return { success: false, error: "Failed to create DSA question." };
  }
}

export async function deleteDsaQuestion(id: string) {
  await verifyAdminAuth();

  try {
    await db.delete(dsaQuestions).where(eq(dsaQuestions.id, id));
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/dsa");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete DSA question:", error);
    return { success: false, error: "Failed to delete question." };
  }
}

// -----------------------------------------------------------------------------
// 3. Career Roadmaps CMS Actions
// -----------------------------------------------------------------------------

export async function createCareerRoadmap(formData: {
  roleTitle: string;
  description: string;
  skillsRequired: string;
  estimatedDuration: string;
}) {
  await verifyAdminAuth();

  if (!formData.roleTitle || !formData.description || !formData.skillsRequired) {
    return { success: false, error: "Missing required fields for Career Roadmap." };
  }

  try {
    const [created] = await db
      .insert(careerRoadmaps)
      .values({
        roleTitle: formData.roleTitle.trim(),
        description: formData.description.trim(),
        skillsRequired: formData.skillsRequired.trim(),
        estimatedDuration: formData.estimatedDuration.trim() || "3-6 Months",
      })
      .returning();

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/roadmaps");

    return { success: true, data: created };
  } catch (error) {
    console.error("Failed to create career roadmap:", error);
    return { success: false, error: "Failed to create career roadmap." };
  }
}

export async function deleteCareerRoadmap(id: string) {
  await verifyAdminAuth();

  try {
    await db.delete(careerRoadmaps).where(eq(careerRoadmaps.id, id));
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/roadmaps");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete career roadmap:", error);
    return { success: false, error: "Failed to delete roadmap." };
  }
}

// -----------------------------------------------------------------------------
// 4. Users & Rate-Limits Management Actions
// -----------------------------------------------------------------------------

export async function resetUserRateLimits(userId: string) {
  await verifyAdminAuth();

  try {
    await db.delete(rateLimits).where(like(rateLimits.id, `${userId}:%`));
    revalidatePath("/admin");
    return { success: true, message: `Reset rate limits and quotas for user.` };
  } catch (error) {
    console.error("Failed to reset user rate limits:", error);
    return { success: false, error: "Failed to reset user quotas." };
  }
}

export async function toggleUserRole(userId: string, newRole: "user" | "admin") {
  const currentAdmin = await verifyAdminAuth();

  if (currentAdmin.id === userId && newRole !== "admin") {
    return { success: false, error: "Cannot revoke your own admin privilege." };
  }

  try {
    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
    revalidatePath("/admin");
    return { success: true, message: `Updated user role to ${newRole.toUpperCase()}.` };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { success: false, error: "Failed to update role." };
  }
}

export async function deleteUserAccount(userId: string) {
  const currentAdmin = await verifyAdminAuth();

  if (currentAdmin.id === userId) {
    return { success: false, error: "Cannot delete your own account while logged in." };
  }

  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin");
    return { success: true, message: "User account deleted successfully." };
  } catch (error) {
    console.error("Failed to delete user account:", error);
    return { success: false, error: "Failed to delete user." };
  }
}
