// [BACKEND] Zero-dependency in-memory sliding-window rate limiter | Used by: routes/auth.js, routes/resumeAnalyser.js
export function createRateLimiter({
    windowMs = 15 * 60 * 1000,
    max = 30,
    keyPrefix = "rl",
    keyGenerator = (req) => req.ip || req.socket?.remoteAddress || "unknown",
    message = "Too many requests. Please try again later.",
} = {}) {
    const store = new Map();

    const cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store.entries()) {
            if (entry.resetAt <= now) {
                store.delete(key);
            }
        }
    }, Math.max(60_000, windowMs));

    if (typeof cleanupTimer.unref === "function") {
        cleanupTimer.unref();
    }

    return function rateLimitMiddleware(req, res, next) {
        const identifier = String(keyGenerator(req) || "unknown");
        const key = `${keyPrefix}:${identifier}`;
        const now = Date.now();
        const existing = store.get(key);

        if (!existing || existing.resetAt <= now) {
            store.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        existing.count += 1;
        if (existing.count > max) {
            const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
            res.setHeader("Retry-After", String(retryAfterSec));
            return res.status(429).json({
                error: message,
                retryAfterSeconds: retryAfterSec,
            });
        }

        return next();
    };
}
