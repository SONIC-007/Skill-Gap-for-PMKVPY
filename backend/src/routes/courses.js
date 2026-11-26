// [BACKEND] Route: GET /api/courses | Used by: Frontend/src/app/courses/page.jsx | Models: TrainingCourse, CourseEnrollment, CandidateSkill
import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import TrainingCourse from "../models/TrainingCourse.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import CandidateSkill from "../models/CandidateSkill.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        const category = req.query.category ? String(req.query.category) : null;
        const difficulty = req.query.difficulty ? String(req.query.difficulty) : null;

        const filter = {};
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;

        const [mCourses, mEnrollments, mSkills] = await Promise.all([
            TrainingCourse.find(filter)
                .populate({
                    path: "courseSkills",
                    populate: { path: "skill" },
                })
                .sort({ name: 1 })
                .lean(),
            mongoose.Types.ObjectId.isValid(userId)
                ? CourseEnrollment.find({ userId }).lean()
                : [],
            mongoose.Types.ObjectId.isValid(userId)
                ? CandidateSkill.find({ userId }).populate("skill").lean()
                : [],
        ]);

        const enrolledSet = new Set((mEnrollments || []).map((e) => e.courseId?.toString()));
        const candidateSkills = (mSkills || []).map((cs) => ({
            skillId: cs.skillId?.toString(),
            proficiency: cs.proficiency,
            skillName: cs.skill?.name,
        }));

        const coursesWithRelevance = (mCourses || []).map((course) => {
            const mappedSkills = (course.courseSkills || []).map((cs) => ({
                id: cs._id?.toString(),
                skill: cs.skill
                    ? {
                          id: cs.skill._id?.toString(),
                          name: cs.skill.name,
                      }
                    : null,
            }));

            let relevanceScore = 0;
            const skillsCovered = mappedSkills.map((cs) => cs.skill?.name).filter(Boolean);
            for (const cs of mappedSkills) {
                const candidateSkill = candidateSkills.find(
                    (s) => s.skillName === cs.skill?.name || s.skillId === cs.skill?.id
                );
                if (!candidateSkill || candidateSkill.proficiency < 50) {
                    relevanceScore += 10;
                } else if (candidateSkill.proficiency < 70) {
                    relevanceScore += 5;
                }
            }

            const courseId = course._id.toString();
            return {
                id: courseId,
                name: course.name,
                description: course.description,
                provider: course.provider,
                difficulty: course.difficulty,
                duration: course.duration,
                eligibility: course.eligibility,
                category: course.category,
                imageUrl: course.imageUrl,
                isDemo: course.isDemo,
                courseSkills: mappedSkills,
                relevanceScore,
                skillsCovered,
                isEnrolled: enrolledSet.has(courseId),
            };
        });

        coursesWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore);
        const categories = [
            ...new Set(coursesWithRelevance.map((c) => c.category).filter(Boolean)),
        ].sort();

        return res.json({ courses: coursesWithRelevance, categories });
    } catch (error) {
        console.error("Courses fetch error:", error);
        return res.status(500).json({ error: "Failed to fetch courses" });
    }
});

export default router;
