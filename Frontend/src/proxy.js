// [FRONTEND] Edge Proxy Guard (Next.js 16 Convention) | Protects workspace & /admin routes using pmkvy_token cookie set by Frontend/src/lib/api.js
import { NextResponse } from "next/server";

export function proxy(req) {
    const { pathname } = req.nextUrl;
    const sessionToken = req.cookies.get("pmkvy_token")?.value;
    const isLoggedIn = Boolean(sessionToken);

    const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/images") ||
        pathname.startsWith("/favicon.ico") ||
        /\.(?:png|jpe?g|webp|gif|svg|ico|woff2?|css|js)$/i.test(pathname)
    ) {
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
    matcher: ["/((?!_next/static|_next/image|images|favicon.ico|.*\\.(?:png|jpe?g|webp|gif|svg|ico|woff2?)$).*)"],
};
