import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  const { pathname } = request.nextUrl;

  console.log("Middleware triggered for path:", pathname);
  console.log("Current session state:", session);
  const publicRoutes = ["/", "/login", "/public", "/favicon.ico"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (!session.isLoggedIn && !isPublicRoute) {
    console.log("User is not logged in. Redirecting to /login...");
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session.isLoggedIn && pathname === "/login") {
    console.log("User is already logged in. Redirecting to /dashboard...");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
