import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { getAnalyserCatalog, runResumeAnalysis } from "../services/aiAnalyser.js";
import User from "../models/User.js";
import JobRole from "../models/JobRole.js";
import Skill from "../models/Skill.js";
import Assessment from "../models/Assessment.js";
import CandidateSkill from "../models/CandidateSkill.js";
import LearningProgress from "../models/LearningProgress.js";
import CandidateProfile from "../models/CandidateProfile.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        const data = await getAnalyserCatalog();
        return res.json(data);
    } catch (error) {
        console.error("AI Resume Analyser GET error:", error);
        return res.status(500).json({ error: "Failed to load AI Resume Analyser metadata" });
    }
});

router.post("/", requireAuth, async (req, res) => {
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

        if (!resumeText || String(resumeText).trim().length < 15) {
            return res
                .status(400)
                .json({ error: "Please provide a valid resume text or document content." });
        }

        const diagnostic = await runResumeAnalysis({
            resumeText: String(resumeText),
            targetMode,
            jobRoleId,
            linkedinUrl,
            jobDescriptionText,
            domain,
            apiKey,
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
            userEmail,
            jobRoleId,
            jobTitle,
            matchPercentage = 70,
            skillsEvaluated = [],
        } = req.body || {};

        let mongoUser = null;
        if (mongoose.Types.ObjectId.isValid(req.user.id)) {
            mongoUser = await User.findById(req.user.id);
        }
        if (!mongoUser && userEmail) {
            mongoUser = await User.findOne({ email: String(userEmail).toLowerCase().trim() });
        }

        if (!mongoUser) {
            return res.status(404).json({ error: "Candidate not found in MongoDB." });
        }

        const skillGap = Math.max(0, 100 - matchPercentage);

        let mongoJobRole = null;
        if (jobRoleId && mongoose.Types.ObjectId.isValid(jobRoleId)) {
            mongoJobRole = await JobRole.findById(jobRoleId);
        }
        if (!mongoJobRole && jobTitle) {
            mongoJobRole = await JobRole.findOne({ title: jobTitle });
        }
        if (!mongoJobRole) {
            mongoJobRole = await JobRole.findOne();
        }

        let savedAssessmentId = null;
        if (mongoJobRole) {
            const mongoAssessment = await Assessment.create({
                userId: mongoUser._id,
                jobRoleId: mongoJobRole._id,
                score: matchPercentage,
                skillGap,
                status: "COMPLETED",
                completedAt: new Date(),
            });
            savedAssessmentId = mongoAssessment._id.toString();
        }

        for (const item of skillsEvaluated) {
            const sDoc = await Skill.findOne({ name: item.skillName });
            if (sDoc) {
                const prof = item.candidateProficiency || 0;
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
                    skillName: item.skillName,
                    proficiency: prof,
                    date: new Date(),
                });
            }
        }

        if (jobTitle) {
            await CandidateProfile.findOneAndUpdate(
                { userId: mongoUser._id },
                { targetJobRole: jobTitle },
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
