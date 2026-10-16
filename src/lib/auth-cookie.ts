import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Session } from "next-auth";

export const SESSION_COOKIE_NAME = "skillnest.session-token";

/**
 * Reads the raw HTTP-only session token cookie in Next.js 15 Server Actions / Routes.
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Returns the currently authenticated Auth.js session, or null if not logged in.
 */
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const session = await auth();
    return session ?? null;
  } catch (error) {
    console.error("Error fetching current session:", error);
    return null;
  }
}

/**
 * Returns the current authenticated user object (with id, role, username, email), or null.
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

/**
 * Enforces authentication inside Server Actions or Server Components.
 * Redirects to /login if unauthenticated.
 */
export async function requireAuth(redirectTo: string = "/login") {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    redirect(redirectTo);
  }
  return user;
}

/**
 * Enforces role-based access control.
 * Throws or redirects if user is not in the allowed roles.
 */
export async function requireRole(
  allowedRoles: ("user" | "admin")[] = ["user", "admin"]
) {
  const user = await requireAuth();
  const role = user.role ?? "user";

  if (!allowedRoles.includes(role)) {
    redirect("/dashboard");
  }

  return user;
}

/**
 * Enforces admin-only access.
 * Redirects to /dashboard if logged in as a normal user.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}

/**
 * Server-side verification of user token and permissions for API Route Handlers.
 * Returns { authorized: boolean, user?: User, error?: string }
 */
export async function verifyApiAuth(requiredRole?: "user" | "admin") {
  const token = await getSessionToken();
  const session = await getCurrentSession();

  if (!session || !session.user) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized: Missing or invalid session token.",
      hasCookie: !!token,
    };
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return {
      authorized: false,
      status: 403,
      error: `Forbidden: Requires '${requiredRole}' role.`,
      user: session.user,
      hasCookie: !!token,
    };
  }

  return {
    authorized: true,
    status: 200,
    user: session.user,
    hasCookie: !!token,
  };
}
