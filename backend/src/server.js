import "dotenv/config";
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

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const rawOrigins = process.env.FRONTEND_URL || "http://localhost:3000,http://127.0.0.1:3000";
const allowedOrigins = rawOrigins
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(
    cors({
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
    })
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        service: "PMKVY Skill Gap Analyser Backend API",
        database: "MongoDB (Mongoose)",
        status: "running",
    });
});

app.get("/health", async (req, res) => {
    try {
        await connectToDatabase();
    } catch {
        // Return degraded status cleanly without crashing health check
    }
    res.json({
        status: "ok",
        mongoConnected: isMongoConnected(),
        aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
});

app.use("/api", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/assessment", assessmentRouter);
app.use("/api/skill-gap", skillGapRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/enroll", enrollRouter);
app.use("/api/progress", progressRouter);
app.use("/api/career", careerRouter);
app.use("/api/ai-resume-analyser", resumeAnalyserRouter);
app.use("/api/admin", adminRouter);

app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    console.error("Unhandled Express error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`[Backend] Express API listening on http://localhost:${PORT}`);
    connectToDatabase().catch(() => {
        console.warn("[Backend] Started without active MongoDB yet — configure MONGODB_URI in backend/.env");
    });
});
