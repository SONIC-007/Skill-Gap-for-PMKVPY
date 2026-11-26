// [FRONTEND] Client HTTP & Auth Token Helper | Used by: Frontend/src/lib/auth-context.jsx and all Frontend/src/app/** pages
// Same-origin by default ("" -> /api/* on port 3000); override NEXT_PUBLIC_API_URL only if splitting hosts.
const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function getApiBaseUrl() {
    return RAW_API_BASE;
}

export function getAuthToken() {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem("pmkvy_auth_token");
    } catch {
        return null;
    }
}

export function setAuthToken(token) {
    if (typeof window === "undefined") return;
    try {
        const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
        if (token) {
            localStorage.setItem("pmkvy_auth_token", token);
            document.cookie = `pmkvy_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax${secureFlag}`;
        } else {
            localStorage.removeItem("pmkvy_auth_token");
            document.cookie = `pmkvy_token=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
        }
    } catch {
        // Ignore storage errors in restricted contexts
    }
}

export async function apiFetch(path, options = {}) {
    const url = path.startsWith("http")
        ? path
        : `${RAW_API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
    const headers = new Headers(options.headers || {});
    const token = getAuthToken();
    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (
        res.status === 401 &&
        typeof window !== "undefined" &&
        !path.includes("/api/auth/login") &&
        !path.includes("/api/register")
    ) {
        setAuthToken(null);
        const publicPaths = ["/", "/login", "/register", "/forgot-password"];
        if (!publicPaths.includes(window.location.pathname)) {
            const callbackUrl = encodeURIComponent(window.location.pathname || "/dashboard");
            window.location.assign(`/login?callbackUrl=${callbackUrl}`);
        }
    }

    return res;
}
