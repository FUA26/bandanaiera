import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

/**
 * Role-based route protection in middleware
 * Provides quick role checks for known protected routes.
 * Full permission checks should be done in page components.
 *
 * Note: Middleware has limited access to database, so we only check
 * the role name from the JWT token. For granular permission checks,
 * use the ProtectedRoute component in your pages.
 */

// Manage routes - requires ADMIN role
const MANAGE_ROUTES = ["/manage"];

// Routes that require authentication (any role)
const PROTECTED_ROUTES = ["/dashboard"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const isOnDashboard = pathname.startsWith("/dashboard");
  const isOnManageRoute = MANAGE_ROUTES.some((route) => pathname.startsWith(route));
  const isOnAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/unauthorized");

  // Redirect unauthenticated users trying to access protected routes
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check manage routes - requires ADMIN role
  if (isOnManageRoute && isLoggedIn) {
    const userRole = req.auth?.user?.role?.name;

    if (!userRole || userRole !== "ADMIN") {
      // User is not admin, redirect to unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (isOnAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
