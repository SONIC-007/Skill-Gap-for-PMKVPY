// [BACKEND] Route: /api/auth/login, /api/register, /api/auth/me, /api/auth/logout | Used by: Frontend login/page.jsx, register/page.jsx, auth-context.jsx | Models: User, CandidateProfile
import { Router } from "express";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../config/db.js";
import User from "../models/User.js";
import CandidateProfile from "../models/CandidateProfile.js";
import { loginSchema, registerSchema } from "../utils/validations.js";
import { requireAuth, signAuthToken } from "../middleware/auth.js";

const router = Router();

router.post("/auth/login", async (req, res) => {
    try {
        const validation = loginSchema.safeParse(req.body || {});
        if (!validation.success) {
            const msg = validation.error.issues?.[0]?.message || "Email and password are required";
            return res.status(400).json({ error: msg });
        }

        await connectToDatabase();
        const normalizedEmail = validation.data.email.toLowerCase().trim();
        const userDoc = await User.findOne({ email: normalizedEmail }).lean();

        if (!userDoc) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(validation.data.password, userDoc.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = {
            id: userDoc._id.toString(),
            email: userDoc.email,
            name: userDoc.name,
            role: userDoc.role || "CANDIDATE",
        };
        const token = signAuthToken(user);

        return res.json({ token, user });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Authentication service error. Check MongoDB connection." });
    }
});

router.post("/register", async (req, res) => {
    try {
        const validation = registerSchema.safeParse(req.body || {});
        if (!validation.success) {
            const msg =
                validation.error.issues?.[0]?.message ||
                validation.error.errors?.[0]?.message ||
                "Invalid input data";
            return res.status(400).json({ error: msg });
        }

        await connectToDatabase();
        const { name, email, password } = validation.data;
        const normalizedEmail = email.toLowerCase().trim();

        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ error: "An account with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const createdUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "CANDIDATE",
        });

        await CandidateProfile.create({ userId: createdUser._id });

        const user = {
            id: createdUser._id.toString(),
            email: createdUser.email,
            name: createdUser.name,
            role: createdUser.role,
        };
        const token = signAuthToken(user);

        return res.status(201).json({
            message: "Account created successfully",
            userId: user.id,
            token,
            user,
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Failed to register user. Check MongoDB connection." });
    }
});

router.get("/auth/me", requireAuth, async (req, res) => {
    return res.json({ user: req.user });
});

router.post("/auth/logout", (req, res) => {
    return res.json({ ok: true });
});

export default router;
