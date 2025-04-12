import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("currentUser")?.value;
  const user = currentUser ? JSON.parse(currentUser) : null;

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];

  // Admin-only routes
  const adminRoutes = ["/admin"];

  // If trying to access a non-public route without being logged in
  if (!publicRoutes.includes(request.nextUrl.pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access admin routes without admin role
  if (
    adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) &&
    user?.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If trying to access client routes with admin role
  if (
    user?.role === "admin" &&
    !adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
