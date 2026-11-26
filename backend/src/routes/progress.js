// [BACKEND] Route: GET/PUT /api/progress | Used by: Frontend/src/app/progress/page.jsx | Models: CourseEnrollment, CourseSkill, CandidateSkill, LearningProgress
import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import CourseSkill from "../models/CourseSkill.js";
import CandidateSkill from "../models/CandidateSkill.js";
import LearningProgress from "../models/LearningProgress.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const [mEnrollments, mSkills, mProgress] = await Promise.all([
            CourseEnrollment.find({ userId })
                .populate({
                    path: "course",
                    populate: {
                        path: "courseSkills",
                        populate: { path: "skill" },
                    },
                })
                .sort({ enrolledAt: -1 })
                .lean(),
            CandidateSkill.find({ userId }).populate("skill").sort({ proficiency: -1 }).lean(),
            LearningProgress.find({ userId }).sort({ date: 1 }).lean(),
        ]);

        const enrollments = (mEnrollments || []).map((e) => ({
            id: e._id.toString(),
            status: e.status,
            progress: e.progress,
            enrolledAt: e.enrolledAt,
            completedAt: e.completedAt,
            course: e.course
                ? {
                      id: e.course._id.toString(),
                      name: e.course.name,
                      provider: e.course.provider,
                      duration: e.course.duration,
                      difficulty: e.course.difficulty,
                      category: e.course.category,
                      courseSkills: (e.course.courseSkills || []).map((cs) => ({
                          id: cs._id?.toString(),
                          skill: cs.skill
                              ? {
                                    id: cs.skill._id?.toString(),
                                    name: cs.skill.name,
                                }
                              : null,
                      })),
                  }
                : null,
        }));

        const candidateSkills = (mSkills || []).map((cs) => ({
            id: cs._id.toString(),
            skillId: cs.skillId?.toString(),
            proficiency: cs.proficiency,
            verified: cs.verified,
            lastAssessedAt: cs.lastAssessedAt,
            skill: cs.skill
                ? {
                      id: cs.skill._id.toString(),
                      name: cs.skill.name,
                      category: cs.skill.category,
                      domain: cs.skill.domain,
                  }
                : null,
        }));

        const progressHistory = (mProgress || []).map((p) => ({
            id: p._id.toString(),
            skillName: p.skillName,
            proficiency: p.proficiency,
            date: p.date,
        }));

        return res.json({
            enrollments,
            candidateSkills,
            progressHistory,
            isGuest: false,
        });
    } catch (error) {
        console.error("Progress GET error:", error);
        return res.status(500).json({ error: "Failed to fetch progress" });
    }
});

router.put("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        const { enrollmentId, progress, status } = req.body || {};

        if (!enrollmentId || !mongoose.Types.ObjectId.isValid(enrollmentId)) {
            return res.status(400).json({ error: "Valid Enrollment ID is required" });
        }

        const updateFields = {};
        if (progress !== undefined) updateFields.progress = progress;
        if (status) updateFields.status = status;
        if (status === "COMPLETED") updateFields.completedAt = new Date();

        const enrollment = await CourseEnrollment.findOneAndUpdate(
            { _id: enrollmentId, userId },
            updateFields,
            { new: true }
        ).lean();

        if (!enrollment) {
            return res.status(404).json({ error: "Enrollment not found" });
        }

        // Boost related candidate skills when course is completed
        if (status === "COMPLETED" && enrollment.courseId) {
            const linkedSkills = await CourseSkill.find({ courseId: enrollment.courseId })
                .populate("skill")
                .lean();

            for (const cs of linkedSkills) {
                if (!cs.skillId) continue;
                const existing = await CandidateSkill.findOne({ userId, skillId: cs.skillId });
                const currentProf = existing?.proficiency || 0;
                const nextProf = Math.min(100, currentProf + 15);

                await CandidateSkill.findOneAndUpdate(
                    { userId, skillId: cs.skillId },
                    {
                        userId,
                        skillId: cs.skillId,
                        proficiency: nextProf,
                        verified: true,
                        lastAssessedAt: new Date(),
                    },
                    { upsert: true }
                );

                if (cs.skill?.name) {
                    await LearningProgress.create({
                        userId,
                        skillName: cs.skill.name,
                        proficiency: nextProf,
                        date: new Date(),
                    });
                }
            }
        }

        return res.json({
            enrollment: {
                id: enrollment._id.toString(),
                progress: enrollment.progress,
                status: enrollment.status,
                completedAt: enrollment.completedAt,
            },
        });
    } catch (error) {
        console.error("Progress update error:", error);
        return res.status(500).json({ error: "Failed to update progress" });
    }
});

export default router;
