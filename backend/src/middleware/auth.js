// [BACKEND] JWT Auth Middleware (requireAuth, requireAdmin) | Used by: routes/* | Verified against pmkvy_token / Bearer header
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

let resolvedJwtSecret = null;

function getJwtSecret() {
    if (resolvedJwtSecret) return resolvedJwtSecret;

    const envSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (envSecret && envSecret.trim().length >= 16) {
        resolvedJwtSecret = envSecret.trim();
        return resolvedJwtSecret;
    }

    if (process.env.NODE_ENV === "production") {
        console.error(
            "[Security CRITICAL] JWT_SECRET is missing or too short (<16 chars) in production! Generating ephemeral runtime secret (sessions will reset on restart). Set JWT_SECRET in your environment."
        );
        resolvedJwtSecret = crypto.randomBytes(32).toString("hex");
        return resolvedJwtSecret;
    }

    if (envSecret && envSecret.trim().length > 0) {
        console.warn("[Security Warning] JWT_SECRET is shorter than 16 characters; using configured value in dev.");
        resolvedJwtSecret = envSecret.trim();
        return resolvedJwtSecret;
    }

    console.warn("[Security Warning] JWT_SECRET is not set in backend/.env; using development-only fallback secret.");
    resolvedJwtSecret = "pmkvy-dev-only-secret-change-me-in-production";
    return resolvedJwtSecret;
}

export function signAuthToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "CANDIDATE",
        },
        getJwtSecret(),
        { expiresIn: "7d" }
    );
}

export function extractTokenFromRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        const token = authHeader.slice(7).trim();
        if (token) return token;
    }
    if (req.cookies?.pmkvy_token) {
        return req.cookies.pmkvy_token;
    }
    return null;
}

export function verifyAuthToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, getJwtSecret());
    } catch {
        return null;
    }
}

export function requireAuth(req, res, next) {
    const token = extractTokenFromRequest(req);
    const decoded = verifyAuthToken(token);
    if (!decoded?.id) {
        return res.status(401).json({
            error: "Unauthorized. Please sign in to access portal resources.",
        });
    }
    req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || "CANDIDATE",
    };
    return next();
}

export function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Forbidden. Admin role required." });
    }
    return next();
}
