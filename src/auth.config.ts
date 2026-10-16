import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

/**
 * Base Auth.js configuration
 * Edge-compatible configuration for Next.js middleware and route handlers.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  trustHost: true,
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
    Google({
      clientId: process.env.AUTH_GOOGLE_ID?.trim(),
      clientSecret: process.env.AUTH_GOOGLE_SECRET?.trim(),
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID?.trim(),
      clientSecret: process.env.AUTH_GITHUB_SECRET?.trim(),
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as { role?: string })?.role;
      const isAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");
      const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
      const isAdminPage = nextUrl.pathname.startsWith("/admin");
      const isStudentPreview = nextUrl.searchParams.get("view") === "student";

      // 1. Unauthenticated users cannot access /dashboard or /admin
      if ((isDashboardPage || isAdminPage) && !isLoggedIn) {
        return false; // Redirects to /login
      }

      // 2. Protect /admin routes: only "admin" accounts allowed. Standard users go to /dashboard
      if (isAdminPage && userRole !== "admin") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // 3. Admin visiting /dashboard is directed to /admin unless explicitly in student preview
      if (isDashboardPage && userRole === "admin" && !isStudentPreview) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      // 4. Authenticated users visiting /login or /register are redirected to their dedicated dashboard
      if (isAuthPage && isLoggedIn) {
        const destination = userRole === "admin" ? "/admin" : "/dashboard";
        return Response.redirect(new URL(destination, nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
