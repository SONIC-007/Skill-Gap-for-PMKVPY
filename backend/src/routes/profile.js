import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import CandidateProfile from "../models/CandidateProfile.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const mUser = await User.findById(userId).select("-password").lean();
        if (!mUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const mProfile = await CandidateProfile.findOne({ userId }).lean();
        return res.json({
            id: mUser._id.toString(),
            name: mUser.name,
            email: mUser.email,
            role: mUser.role,
            profile: mProfile || {},
            isGuest: false,
        });
    } catch (error) {
        console.error("Profile GET error:", error);
        return res.status(500).json({ error: "Failed to load profile" });
    }
});

router.put("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const {
            name,
            phone,
            education,
            experience,
            location,
            desiredCareerField,
            targetJobRole,
            bio,
        } = req.body || {};

        if (name && String(name).trim().length >= 2) {
            await User.findByIdAndUpdate(userId, { name: String(name).trim() });
        }

        const updatedProfile = await CandidateProfile.findOneAndUpdate(
            { userId },
            { phone, education, experience, location, desiredCareerField, targetJobRole, bio },
            { upsert: true, new: true }
        ).lean();

        return res.json({
            message: "Profile updated successfully in MongoDB",
            profile: updatedProfile,
        });
    } catch (error) {
        console.error("Profile PUT error:", error);
        return res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;
