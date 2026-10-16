import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const baseAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: {
    ...baseAdapter,
    async createUser(data) {
      // Auto-generate clean, unique username for OAuth users (Google/GitHub)
      const rawName = data.name || data.email?.split("@")[0] || "user";
      const cleanPrefix = rawName
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .slice(0, 15);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedUsername = `${cleanPrefix}_${randomSuffix}`;

      if (!baseAdapter.createUser) {
        throw new Error("DrizzleAdapter createUser is not defined");
      }

      const userToCreate = {
        ...data,
        name: data.name || rawName,
        username:
          "username" in data && typeof data.username === "string"
            ? data.username
            : generatedUsername,
        acceptedTerms: true,
      };

      return await baseAdapter.createUser(userToCreate);
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: "skillnest.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60,
      },
    },
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          return null;
        }

        const { email, password } = validated.data;
        const normalizedEmail = email.toLowerCase().trim();

        try {
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, normalizedEmail))
            .limit(1);

          if (!user || !user.passwordHash) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            password,
            user.passwordHash
          );

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            username: user.username,
          };
        } catch (error) {
          console.error("Credentials authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "user";
        token.username = user.username ?? null;
        token.email = user.email ?? null;
      }

      // Populate role, username, or email from DB if not yet set in token
      if (token.id && (!token.role || token.username === undefined)) {
        try {
          const [dbUser] = await db
            .select({
              role: users.role,
              username: users.username,
              email: users.email,
            })
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1);

          if (dbUser) {
            token.role = dbUser.role ?? "user";
            token.username = dbUser.username ?? null;
            if (dbUser.email) token.email = dbUser.email;
          }
        } catch (e) {
          console.error("Error fetching user details in JWT callback:", e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "user" | "admin") || "user";
        session.user.username = (token.username as string) || null;
        if (token.email) session.user.email = token.email as string;
      }
      return session;
    },
  },
});
