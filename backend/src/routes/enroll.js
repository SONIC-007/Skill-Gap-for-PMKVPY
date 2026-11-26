// [BACKEND] Route: POST /api/enroll | Used by: Frontend/src/app/courses/page.jsx | Models: CourseEnrollment, TrainingCourse
import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import TrainingCourse from "../models/TrainingCourse.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        const { courseId } = req.body || {};

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: "Valid Course ID is required" });
        }

        const courseExists = await TrainingCourse.exists({ _id: courseId });
        if (!courseExists) {
            return res.status(404).json({ error: "Course not found" });
        }

        const existing = await CourseEnrollment.findOne({ userId, courseId }).lean();
        if (existing) {
            return res.status(200).json({
                message: "Already enrolled in this course",
                alreadyEnrolled: true,
                enrollment: { ...existing, id: existing._id.toString() },
            });
        }

        const enrollment = await CourseEnrollment.create({
            userId,
            courseId,
            status: "ENROLLED",
            progress: 0,
        });

        return res.status(201).json({
            enrollment: { ...enrollment.toObject(), id: enrollment._id.toString() },
            message: "Enrolled successfully in PMKVY course",
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(200).json({
                message: "Already enrolled in this course",
                alreadyEnrolled: true,
            });
        }
        console.error("Enrollment error:", error);
        return res.status(500).json({ error: "Failed to enroll in course" });
    }
});

export default router;
