import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import CandidateSkill from "../models/CandidateSkill.js";
import JobRole from "../models/JobRole.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const [candidateSkills, jobRoles] = await Promise.all([
            CandidateSkill.find({ userId }).populate("skill").lean(),
            JobRole.find()
                .populate({
                    path: "skillRequirements",
                    populate: { path: "skill" },
                })
                .lean(),
        ]);

        const recommendations = (jobRoles || []).map((role) => {
            const matchedSkills = [];
            const missingSkills = [];
            let totalRequired = 0;
            let totalMatched = 0;

            for (const reqItem of role.skillRequirements || []) {
                const reqSkillId = reqItem.skillId?.toString() || reqItem.skill?._id?.toString();
                const reqSkillName = reqItem.skill?.name || "Competency";
                const reqProf = reqItem.requiredProficiency || 70;

                const cs = (candidateSkills || []).find(
                    (c) =>
                        (reqSkillId && c.skillId?.toString() === reqSkillId) ||
                        c.skill?.name === reqSkillName
                );

                totalRequired += reqProf;
                if (cs && cs.proficiency >= reqProf * 0.7) {
                    matchedSkills.push(reqSkillName);
                    totalMatched += Math.min(cs.proficiency, reqProf);
                } else {
                    missingSkills.push(reqSkillName);
                    if (cs) {
                        totalMatched += cs.proficiency;
                    }
                }
            }

            const readinessPercentage =
                totalRequired > 0 ? Math.round((totalMatched / totalRequired) * 100) : 0;

            return {
                id: role._id.toString(),
                title: role.title,
                domain: role.domain,
                description: role.description,
                readinessPercentage: Math.min(100, readinessPercentage),
                matchedSkills,
                missingSkills,
                avgSalary: role.avgSalary,
                demandLevel: role.demandLevel,
            };
        });

        recommendations.sort((a, b) => b.readinessPercentage - a.readinessPercentage);
        return res.json({ recommendations, isGuest: false });
    } catch (error) {
        console.error("Career recommendations error:", error);
        return res.status(500).json({ error: "Failed to load career recommendations" });
    }
});

export default router;
