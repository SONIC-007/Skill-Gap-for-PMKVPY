import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import JobRole from "../models/JobRole.js";
import Assessment from "../models/Assessment.js";
import CandidateSkill from "../models/CandidateSkill.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        const jobRoleId = req.query.jobRoleId ? String(req.query.jobRoleId) : null;

        const mongoRoles = await JobRole.find()
            .populate({
                path: "skillRequirements",
                populate: { path: "skill" },
            })
            .sort({ title: 1 })
            .lean();

        const jobRoles = (mongoRoles || []).map((r) => ({
            id: r._id.toString(),
            title: r.title,
            domain: r.domain,
            description: r.description,
            minExperience: r.minExperience,
            avgSalary: r.avgSalary,
            demandLevel: r.demandLevel,
            skillRequirements: (r.skillRequirements || []).map((sr) => ({
                id: sr._id?.toString(),
                requiredProficiency: sr.requiredProficiency,
                importance: sr.importance,
                skill: sr.skill
                    ? {
                          id: sr.skill._id?.toString(),
                          name: sr.skill.name,
                          domain: sr.skill.domain,
                          category: sr.skill.category,
                      }
                    : null,
            })),
        }));

        if (!jobRoleId) {
            let assessments = [];
            if (mongoose.Types.ObjectId.isValid(userId)) {
                const mAssessments = await Assessment.find({ userId, status: "COMPLETED" })
                    .populate("jobRole")
                    .sort({ completedAt: -1 })
                    .lean();
                assessments = mAssessments.map((a) => ({
                    id: a._id.toString(),
                    jobRoleId: a.jobRoleId?.toString() || a.jobRole?._id?.toString(),
                    score: a.score,
                    skillGap: a.skillGap,
                    completedAt: a.completedAt,
                    jobRole: a.jobRole
                        ? {
                              id: a.jobRole._id.toString(),
                              title: a.jobRole.title,
                              domain: a.jobRole.domain,
                          }
                        : null,
                }));
            }
            return res.json({ jobRoles, assessments });
        }

        const selectedRole = jobRoles.find((r) => r.id === jobRoleId) || jobRoles[0];
        if (!selectedRole) {
            return res.status(404).json({ error: "Job role not found", jobRoles });
        }

        let candidateSkills = [];
        if (mongoose.Types.ObjectId.isValid(userId)) {
            const mSkills = await CandidateSkill.find({ userId }).populate("skill").lean();
            candidateSkills = mSkills.map((cs) => ({
                id: cs._id.toString(),
                skillId: cs.skillId?.toString(),
                proficiency: cs.proficiency,
                skill: cs.skill
                    ? {
                          id: cs.skill._id.toString(),
                          name: cs.skill.name,
                      }
                    : null,
            }));
        }

        const skillGapResults = (selectedRole.skillRequirements || []).map((reqItem) => {
            const cs = candidateSkills.find(
                (c) => c.skill?.name === reqItem.skill?.name || c.skillId === reqItem.skill?.id
            );
            const currentProficiency = cs?.proficiency || 0;
            const required = reqItem.requiredProficiency || 70;
            const gapPercent =
                required > 0
                    ? Math.max(0, Math.round(((required - currentProficiency) / required) * 100))
                    : 0;
            const uiStatus = gapPercent <= 10 ? "met" : gapPercent <= 50 ? "improvement" : "missing";

            return {
                skillId: reqItem.skill?.id,
                skillName: reqItem.skill?.name || "Skill",
                category: reqItem.skill?.category || "TECHNICAL",
                domain: reqItem.skill?.domain,
                requiredProficiency: required,
                candidateProficiency: currentProficiency,
                currentProficiency,
                gap: gapPercent,
                importance: reqItem.importance || "Required",
                status: uiStatus,
                gapStatus:
                    gapPercent <= 10
                        ? "MET"
                        : gapPercent <= 50
                        ? "MODERATE_GAP"
                        : "CRITICAL_GAP",
            };
        });

        const totalRequired = skillGapResults.reduce((acc, curr) => acc + curr.requiredProficiency, 0);
        const totalCurrent = skillGapResults.reduce(
            (acc, curr) => acc + Math.min(curr.currentProficiency, curr.requiredProficiency),
            0
        );
        const overallMatchPercentage =
            totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 0;
        const overallGap = Math.max(0, 100 - overallMatchPercentage);

        return res.json({
            jobRole: selectedRole,
            skills: skillGapResults,
            skillGapResults,
            overallGap,
            overallMatchPercentage,
            jobRoles,
        });
    } catch (error) {
        console.error("Skill gap analysis error:", error);
        return res.status(500).json({ error: "Failed to perform skill gap analysis" });
    }
});

export default router;
