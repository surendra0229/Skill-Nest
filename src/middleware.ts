import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRole = (req.auth?.user as { role?: string })?.role;

  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard");
  const isAdminPage = nextUrl.pathname.startsWith("/admin");
  const isStudentPreview = nextUrl.searchParams.get("view") === "student";

  // 1. Unauthenticated users cannot access /dashboard or /admin
  if ((isDashboardPage || isAdminPage) && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Protect /admin routes: allow only role === "admin", redirect standard "user" to /dashboard
  if (isAdminPage && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // 3. Admin user visiting /dashboard is directed to /admin unless in student preview mode
  if (isDashboardPage && userRole === "admin" && !isStudentPreview) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  // 4. Logged-in users visiting /login or /register are redirected to their designated platform
  if (isAuthPage && isLoggedIn) {
    const destination = userRole === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(destination, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static, _next/image
     * - favicon.ico, icon.png, logo.png
     */
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|logo.png|.*\\.png$).*)",
  ],
};
