import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * Users Table
 * Stores user profiles, authentication credentials, roles, and dashboard tracking metrics.
 */
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"), // Full Name
  username: text("username").unique(), // Unique username
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"), // bcryptjs hash
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  dsaSolved: integer("dsa_solved").default(0).notNull(),
  contestSolved: integer("contest_solved").default(0).notNull(),
  modulesCompleted: integer("modules_completed").default(0).notNull(),
  atsChecksCount: integer("ats_checks_count").default(0).notNull(),
  latestAtsScore: integer("latest_ats_score"),
  atsAverageScore: integer("ats_average_score"),
  xp: integer("xp").default(0).notNull(),
  streak: integer("streak").default(5).notNull(),
  acceptedTerms: boolean("accepted_terms").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

/**
 * Accounts Table
 * Stores OAuth links for Auth.js v5 (Google, GitHub, etc.)
 */
export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

/**
 * Sessions Table
 * Stores database sessions for Auth.js
 */
export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * Verification Tokens Table
 * Stores email verification tokens
 */
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [
    primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  ]
);

/**
 * Password Reset Tokens Table
 * Stores temporary tokens generated for the Forgot Password flow.
 */
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

/**
 * Rate Limits Table
 * Persistent fallback for API rate limiting when Redis is unavailable.
 */
export const rateLimits = pgTable("rate_limits", {
  id: text("id").primaryKey(), // ${identifier}:${action}
  action: text("action").notNull(),
  count: integer("count").default(0).notNull(),
  resetAt: timestamp("reset_at", { mode: "date" }).notNull(),
});

/**
 * Language Notes Table (Admin CMS)
 * Stores programming language theory notes, syntax rules, and use cases.
 */
export const languageNotes = pgTable("language_notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  language: text("language").notNull(), // e.g. "Python", "Java", "C++", "JavaScript", "TypeScript", "Rust"
  title: text("title").notNull(), // e.g. "Pointers & Memory Management"
  category: text("category").notNull(), // e.g. "Fundamentals", "OOP", "Advanced"
  content: text("content").notNull(), // Detailed explanation / Markdown notes
  useCases: text("use_cases").notNull(), // Real-world industry use cases
  codeExample: text("code_example"), // Code snippet
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

/**
 * DSA Questions Table (Admin CMS)
 * Stores algorithmic problem sets, patterns, starter code, and test cases.
 */
export const dsaQuestions = pgTable("dsa_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(), // e.g. "Two Sum", "Reverse Linked List"
  difficulty: text("difficulty", { enum: ["Easy", "Medium", "Hard"] }).notNull(),
  pattern: text("pattern").notNull(), // e.g. "Arrays & Hashing", "Two Pointers", "Trees", "Dynamic Programming"
  description: text("description").notNull(),
  starterCode: text("starter_code"),
  testCases: text("test_cases"), // JSON string of input/expected output pairs
  leetcodeUrl: text("leetcode_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

/**
 * Career Roadmaps Table (Admin CMS)
 * Stores software engineering career paths, milestone requirements, and timeline.
 */
export const careerRoadmaps = pgTable("career_roadmaps", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roleTitle: text("role_title").notNull(), // e.g. "Full-Stack Developer", "AI/ML Engineer"
  description: text("description").notNull(),
  skillsRequired: text("skills_required").notNull(), // JSON list of milestones or comma-separated
  estimatedDuration: text("estimated_duration").notNull(), // e.g. "6 Months"
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;
export type LanguageNote = typeof languageNotes.$inferSelect;
export type NewLanguageNote = typeof languageNotes.$inferInsert;
export type DsaQuestion = typeof dsaQuestions.$inferSelect;
export type NewDsaQuestion = typeof dsaQuestions.$inferInsert;
export type CareerRoadmap = typeof careerRoadmaps.$inferSelect;
export type NewCareerRoadmap = typeof careerRoadmaps.$inferInsert;
