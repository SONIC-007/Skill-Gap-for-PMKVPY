import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import CandidateSkill from "../models/CandidateSkill.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import Assessment from "../models/Assessment.js";
import LearningProgress from "../models/LearningProgress.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const [mSkills, mEnrollments, mAssessments, mProgress] = await Promise.all([
            CandidateSkill.find({ userId }).populate("skill").lean(),
            CourseEnrollment.find({ userId }).populate("course").lean(),
            Assessment.find({ userId }).populate("jobRole").sort({ createdAt: -1 }).lean(),
            LearningProgress.find({ userId }).sort({ date: -1 }).limit(30).lean(),
        ]);

        const candidateSkills = (mSkills || []).map((cs) => ({
            id: cs._id.toString(),
            proficiency: cs.proficiency,
            skill: cs.skill
                ? {
                      id: cs.skill._id.toString(),
                      name: cs.skill.name,
                      category: cs.skill.category,
                      domain: cs.skill.domain,
                  }
                : { name: "Technical Skill", category: "TECHNICAL", domain: "General" },
        }));

        const enrollments = (mEnrollments || []).map((e) => ({
            id: e._id.toString(),
            status: e.status,
            progress: e.progress,
            course: e.course
                ? {
                      id: e.course._id.toString(),
                      name: e.course.name,
                  }
                : null,
        }));

        const assessments = (mAssessments || []).map((a) => ({
            id: a._id.toString(),
            score: a.score,
            skillGap: a.skillGap,
            status: a.status,
            completedAt: a.completedAt,
            jobRole: a.jobRole
                ? {
                      id: a.jobRole._id.toString(),
                      title: a.jobRole.title,
                  }
                : null,
        }));

        const recentProgress = (mProgress || []).map((p) => ({
            id: p._id.toString(),
            skillName: p.skillName,
            proficiency: p.proficiency,
            date: p.date,
        }));

        const totalSkillsAssessed = candidateSkills.length;
        const averageProficiency =
            totalSkillsAssessed > 0
                ? Math.round(
                      candidateSkills.reduce((sum, cs) => sum + (cs.proficiency || 0), 0) /
                          totalSkillsAssessed
                  )
                : 0;

        const latestAssessment = assessments.find((a) => a.status === "COMPLETED") || null;
        const overallSkillGap = latestAssessment?.skillGap ?? 0;
        const coursesEnrolled = enrollments.length;
        const coursesCompleted = enrollments.filter((e) => e.status === "COMPLETED").length;

        const skillDistribution = candidateSkills.map((cs) => ({
            name: cs.skill?.name || "Skill",
            proficiency: cs.proficiency || 0,
            category: cs.skill?.category || "TECHNICAL",
            domain: cs.skill?.domain || "General",
        }));

        return res.json({
            stats: {
                totalSkillsAssessed,
                averageProficiency,
                overallSkillGap,
                coursesEnrolled,
                coursesCompleted,
            },
            latestAssessment,
            skillDistribution,
            recentProgress,
            assessments,
            enrollments,
        });
    } catch (error) {
        console.error("Dashboard fetch error:", error);
        return res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
});

export default router;
