// [FRONTEND] Edge Session Guard | Protects workspace & /admin routes using pmkvy_token cookie set by Frontend/src/lib/api.js
import { NextResponse } from "next/server";

export function middleware(req) {
    const { pathname } = req.nextUrl;
    const sessionToken = req.cookies.get("pmkvy_token")?.value;
    const isLoggedIn = Boolean(sessionToken);

    const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
