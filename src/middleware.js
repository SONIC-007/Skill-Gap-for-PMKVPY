import { NextResponse } from "next/server";
export function middleware(req) {
    const { pathname } = req.nextUrl;
    // Session cookie check (Edge compatible)
    const sessionToken = req.cookies.get("authjs.session-token")?.value ||
        req.cookies.get("__Secure-authjs.session-token")?.value;
    const isLoggedIn = !!sessionToken;
    // Public entry routes: Landing page, auth pages, forgot-password
    const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(pathname);
    // Static assets and auth APIs
    if (pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico") ||
        pathname.startsWith("/api/auth") ||
        pathname === "/api/register") {
        return NextResponse.next();
    }
    // If user is NOT logged in and attempts to access internal portal features
    // (e.g. /dashboard, /resume-analyser, /courses, /assessment, /skill-gap, /admin, etc.)
    // Flow: First open the page, then login, then rest of the things!
    if (!isLoggedIn && !isPublicRoute) {
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "Unauthorized. Please sign in to access portal resources." }, { status: 401 });
        }
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }
    // If already logged in and visits login or register, direct to dashboard
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
