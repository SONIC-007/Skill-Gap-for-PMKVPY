// [BACKEND] Unified Single Server Entry (Port 3000) | Mounts Express /api/* + /health and Next.js Frontend/ handler
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase, isMongoConnected } from "./config/db.js";
import authRouter from "./routes/auth.js";
import dashboardRouter from "./routes/dashboard.js";
import profileRouter from "./routes/profile.js";
import assessmentRouter from "./routes/assessment.js";
import skillGapRouter from "./routes/skillGap.js";
import coursesRouter from "./routes/courses.js";
import enrollRouter from "./routes/enroll.js";
import progressRouter from "./routes/progress.js";
import careerRouter from "./routes/career.js";
import resumeAnalyserRouter from "./routes/resumeAnalyser.js";
import adminRouter from "./routes/admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(BACKEND_DIR, "..");
const FRONTEND_DIR = path.resolve(REPO_ROOT, "Frontend");

// Load backend/.env explicitly regardless of whether server is launched from repo root or backend/
dotenv.config({ path: path.resolve(BACKEND_DIR, ".env") });

const PORT = Number(process.env.PORT) || 3000;
const DEV = process.env.NODE_ENV !== "production";

const app = express();
const httpServer = http.createServer(app);

const rawOrigins = process.env.FRONTEND_URL || `http://localhost:${PORT},http://127.0.0.1:${PORT}`;
const allowedOrigins = rawOrigins
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

const apiCors = cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/$/, "");
        if (allowedOrigins.includes("*") || allowedOrigins.includes(normalized)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

app.get("/health", async (req, res) => {
    try {
        await connectToDatabase();
    } catch {
        // Return degraded status cleanly without crashing health check
    }
    res.json({
        status: "ok",
        mode: "unified-single-server",
        mongoConnected: isMongoConnected(),
        aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
});

// Scoped JSON/cookie parsing for Express /api routes only (leaves Next.js request bodies untouched)
const apiRouter = express.Router();
apiRouter.use(apiCors);
apiRouter.use(express.json({ limit: "2mb" }));
apiRouter.use(cookieParser());

apiRouter.use("/", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/profile", profileRouter);
apiRouter.use("/assessment", assessmentRouter);
apiRouter.use("/skill-gap", skillGapRouter);
apiRouter.use("/courses", coursesRouter);
apiRouter.use("/enroll", enrollRouter);
apiRouter.use("/progress", progressRouter);
apiRouter.use("/career", careerRouter);
apiRouter.use("/ai-resume-analyser", resumeAnalyserRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use((req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.use("/api", apiRouter);

async function startServer() {
    if (process.env.API_ONLY !== "true") {
        const frontendRequire = createRequire(path.resolve(FRONTEND_DIR, "package.json"));
        const next = frontendRequire("next");
        const nextApp = next({
            dev: DEV,
            dir: FRONTEND_DIR,
            turbopack: true,
            port: PORT,
            httpServer,
        });
        const nextHandler = nextApp.getRequestHandler();

        await nextApp.prepare();

        const upgradeHandler = nextApp.getUpgradeHandler();
        httpServer.on("upgrade", (req, socket, head) => {
            upgradeHandler(req, socket, head);
        });

        app.use((req, res) => nextHandler(req, res));
    }

    app.use((err, req, res, next) => {
        console.error("Unhandled server error:", err.message);
        if (res.headersSent) return next(err);
        res.status(500).json({ error: err.message || "Internal server error" });
    });

    httpServer.listen(PORT, () => {
        console.log(
            `[Server] Unified Frontend + Backend listening on http://localhost:${PORT} (${DEV ? "development" : "production"})`
        );
        connectToDatabase().catch(() => {
            console.warn(
                "[Server] Started without active MongoDB yet — configure MONGODB_URI in backend/.env"
            );
        });
    });
}

startServer().catch((err) => {
    console.error("Failed to start unified server:", err);
    process.exit(1);
});
