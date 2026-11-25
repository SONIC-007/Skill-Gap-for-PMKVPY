import jwt from "jsonwebtoken";

function getJwtSecret() {
    return (
        process.env.JWT_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        "pmkvy-skill-gap-analyser-super-secret-key-2024"
    );
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
