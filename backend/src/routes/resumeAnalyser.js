// [BACKEND] Route: GET/POST /api/ai-resume-analyser & POST /save | Used by: Frontend/src/app/resume-analyser/page.jsx | Uses: services/aiAnalyser.js
import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { createRateLimiter } from "../middleware/rateLimit.js";
import { getAnalyserCatalog, runResumeAnalysis } from "../services/aiAnalyser.js";
import { extractResumeTextFromPdfBuffer } from "../services/pdfParser.js";
import User from "../models/User.js";
import JobRole from "../models/JobRole.js";
import Skill from "../models/Skill.js";
import Assessment from "../models/Assessment.js";
import CandidateSkill from "../models/CandidateSkill.js";
import LearningProgress from "../models/LearningProgress.js";
import CandidateProfile from "../models/CandidateProfile.js";

const router = Router();

const MAX_PDF_BYTES = 4 * 1024 * 1024;
const aiLimiter = createRateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 30,
    keyPrefix: "ai-resume",
    keyGenerator: (req) => req.user?.id || req.ip,
    message: "Too many AI analysis requests. Please wait a few minutes.",
});

router.get("/", requireAuth, async (req, res) => {
    try {
        const data = await getAnalyserCatalog();
        return res.json(data);
    } catch (error) {
        console.error("AI Resume Analyser GET error:", error);
        return res.status(500).json({ error: "Failed to load AI Resume Analyser metadata" });
    }
});

router.post("/parse-pdf", requireAuth, aiLimiter, async (req, res) => {
    try {
        const { pdfBase64, fileName } = req.body || {};
        if (!pdfBase64 || typeof pdfBase64 !== "string") {
            return res.status(400).json({ error: "Missing pdfBase64 payload." });
        }
        const cleanedBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/i, "");
        const estimatedBytes = Math.floor((cleanedBase64.length * 3) / 4);
        if (estimatedBytes > MAX_PDF_BYTES) {
            return res.status(413).json({ error: "PDF file exceeds the 4 MB limit." });
        }

        const buffer = Buffer.from(cleanedBase64, "base64");
        if (buffer.length > MAX_PDF_BYTES) {
            return res.status(413).json({ error: "PDF file exceeds the 4 MB limit." });
        }
        if (buffer.length < 20 || buffer.subarray(0, 4).toString("latin1") !== "%PDF") {
            return res.status(400).json({ error: "Invalid PDF binary file." });
        }
        const result = await extractResumeTextFromPdfBuffer(buffer, { allowAiFallback: true });
        if (!result.success || !result.text) {
            return res.status(422).json({
                error: "Could not read readable text from this PDF (may be an encrypted or scanned image PDF).",
                partialText: result.text || "",
            });
        }
        const safeName = String(fileName || "resume.pdf").replace(/[\r\n<>:"/\\|?*]/g, "_").slice(0, 120);
        return res.json({
            success: true,
            fileName: safeName,
            text: result.text,
            method: result.method,
        });
    } catch (error) {
        console.error("PDF extract error:", error);
        return res.status(500).json({ error: "Failed to extract PDF text: " + error.message });
    }
});

router.post("/", requireAuth, aiLimiter, async (req, res) => {
    try {
        const {
            resumeText,
            targetMode = "QP_NOS",
            jobRoleId,
            linkedinUrl,
            jobDescriptionText,
            domain = "Web Development",
            apiKey,
        } = req.body || {};

        const cleanResume = String(resumeText || "").trim();
        if (cleanResume.length < 15) {
            return res
                .status(400)
                .json({ error: "Please provide a valid resume text or document content." });
        }
        if (cleanResume.length > 40000) {
            return res.status(400).json({ error: "Resume text exceeds maximum allowed length (40,000 characters)." });
        }

        const diagnostic = await runResumeAnalysis({
            resumeText: cleanResume,
            targetMode: targetMode === "LINKEDIN" ? "LINKEDIN" : "QP_NOS",
            jobRoleId,
            linkedinUrl: linkedinUrl ? String(linkedinUrl).slice(0, 500) : undefined,
            jobDescriptionText: jobDescriptionText ? String(jobDescriptionText).slice(0, 15000) : undefined,
            domain: String(domain || "Web Development").slice(0, 120),
            apiKey: typeof apiKey === "string" ? apiKey.trim().slice(0, 200) : undefined,
        });

        return res.json({ success: true, diagnostic });
    } catch (error) {
        console.error("AI Resume Analyser error:", error);
        return res.status(500).json({
            error: "Failed to process resume analysis: " + error.message,
        });
    }
});

router.post("/save", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const {
            jobRoleId,
            jobTitle,
            matchPercentage = 70,
            skillsEvaluated = [],
        } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({ error: "Invalid authenticated user ID." });
        }

        const mongoUser = await User.findById(req.user.id);
        if (!mongoUser) {
            return res.status(404).json({ error: "Candidate not found in MongoDB." });
        }

        const clampedMatch = Math.max(0, Math.min(100, Math.round(Number(matchPercentage) || 0)));
        const skillGap = Math.max(0, 100 - clampedMatch);

        let mongoJobRole = null;
        if (jobRoleId && mongoose.Types.ObjectId.isValid(jobRoleId)) {
            mongoJobRole = await JobRole.findById(jobRoleId);
        }
        if (!mongoJobRole && jobTitle) {
            mongoJobRole = await JobRole.findOne({ title: String(jobTitle).trim() });
        }
        if (!mongoJobRole) {
            mongoJobRole = await JobRole.findOne();
        }

        let savedAssessmentId = null;
        if (mongoJobRole) {
            const mongoAssessment = await Assessment.create({
                userId: mongoUser._id,
                jobRoleId: mongoJobRole._id,
                score: clampedMatch,
                skillGap,
                status: "COMPLETED",
                completedAt: new Date(),
            });
            savedAssessmentId = mongoAssessment._id.toString();
        }

        const safeSkills = Array.isArray(skillsEvaluated) ? skillsEvaluated.slice(0, 30) : [];
        const allSkills = safeSkills.length > 0 ? await Skill.find().lean() : [];
        const skillByLowerName = new Map(allSkills.map((s) => [s.name.toLowerCase(), s]));

        for (const item of safeSkills) {
            const rawName = String(item?.skillName || "").trim();
            if (!rawName) continue;

            const sDoc = skillByLowerName.get(rawName.toLowerCase());
            if (sDoc) {
                const prof = Math.max(0, Math.min(100, Math.round(Number(item.candidateProficiency) || 0)));
                await CandidateSkill.findOneAndUpdate(
                    { userId: mongoUser._id, skillId: sDoc._id },
                    {
                        userId: mongoUser._id,
                        skillId: sDoc._id,
                        proficiency: prof,
                        verified: item.status === "MATCHED",
                        lastAssessedAt: new Date(),
                    },
                    { upsert: true, new: true }
                );

                await LearningProgress.create({
                    userId: mongoUser._id,
                    skillName: sDoc.name,
                    proficiency: prof,
                    date: new Date(),
                });
            }
        }

        if (jobTitle && String(jobTitle).trim()) {
            await CandidateProfile.findOneAndUpdate(
                { userId: mongoUser._id },
                { targetJobRole: String(jobTitle).trim().slice(0, 160) },
                { upsert: true }
            );
        }

        return res.json({
            success: true,
            assessmentId: savedAssessmentId || "saved",
            message: "Diagnostic results successfully synchronized to MongoDB & candidate profile!",
        });
    } catch (error) {
        console.error("Save AI Resume Analysis error:", error);
        return res.status(500).json({ error: "Failed to save analysis: " + error.message });
    }
});

export default router;
