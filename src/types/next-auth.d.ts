import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role?: "user" | "admin";
    username?: string | null;
    dsaSolved?: number;
    contestSolved?: number;
    modulesCompleted?: number;
    atsAverageScore?: number | null;
    xp?: number;
    streak?: number;
  }

  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      username?: string | null;
      dsaSolved?: number;
      contestSolved?: number;
      modulesCompleted?: number;
      atsAverageScore?: number | null;
      xp?: number;
      streak?: number;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "user" | "admin";
    username?: string | null;
  }
}
