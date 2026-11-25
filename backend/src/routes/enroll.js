import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import CourseEnrollment from "../models/CourseEnrollment.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        const { courseId } = req.body || {};

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: "Valid Course ID is required" });
        }

        const existing = await CourseEnrollment.findOne({ userId, courseId }).lean();
        if (existing) {
            return res.status(200).json({
                error: "Already enrolled in this course",
                enrollment: { ...existing, id: existing._id.toString() },
            });
        }

        const enrollment = await CourseEnrollment.create({
            userId,
            courseId,
            status: "ENROLLED",
            progress: 0,
        });

        return res.json({
            enrollment: { ...enrollment.toObject(), id: enrollment._id.toString() },
            message: "Enrolled successfully in PMKVY course",
        });
    } catch (error) {
        console.error("Enrollment error:", error);
        return res.status(500).json({ error: "Failed to enroll in course" });
    }
});

export default router;
