import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import JobRole from "../models/JobRole.js";
import AssessmentQuestion from "../models/AssessmentQuestion.js";
import Assessment from "../models/Assessment.js";
import AssessmentResponse from "../models/AssessmentResponse.js";
import CandidateSkill from "../models/CandidateSkill.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const jobRoleId = req.query.jobRoleId ? String(req.query.jobRoleId) : null;

        const mongoRoles = await JobRole.find()
            .populate({
                path: "skillRequirements",
                populate: { path: "skill" },
            })
            .sort({ domain: 1 })
            .lean();

        const jobRoles = (mongoRoles || []).map((jr) => ({
            id: jr._id.toString(),
            title: jr.title,
            domain: jr.domain,
            description: jr.description,
            skillRequirements: (jr.skillRequirements || []).map((sr) => ({
                id: sr._id?.toString(),
                skillId: sr.skillId?.toString(),
                requiredProficiency: sr.requiredProficiency,
                skill: sr.skill
                    ? {
                          id: sr.skill._id?.toString(),
                          name: sr.skill.name,
                      }
                    : null,
            })),
        }));

        const domains = [...new Set(jobRoles.map((jr) => jr.domain).filter(Boolean))];
        let questions = [];

        if (jobRoleId) {
            const jobRole = jobRoles.find((jr) => jr.id === jobRoleId);
            if (jobRole) {
                const skillIds = jobRole.skillRequirements
                    .map((sr) => sr.skillId)
                    .filter((id) => id && mongoose.Types.ObjectId.isValid(id));

                const mQuestions = await AssessmentQuestion.find({
                    skillId: { $in: skillIds },
                })
                    .populate("skill")
                    .lean();

                questions = (mQuestions || []).map((q) => ({
                    id: q._id.toString(),
                    skillId: q.skillId?.toString(),
                    question: q.question,
                    type: q.type,
                    options: q.options,
                    difficulty: q.difficulty,
                    skill: q.skill
                        ? {
                              id: q.skill._id?.toString(),
                              name: q.skill.name,
                          }
                        : null,
                }));
            }
        }

        return res.json({ jobRoles, domains, questions });
    } catch (error) {
        console.error("Assessment GET error:", error);
        return res.status(500).json({ error: "Failed to load assessment questions" });
    }
});

router.post("/", requireAuth, async (req, res) => {
    try {
        await connectToDatabase();
        const userId = req.user.id;
        const { jobRoleId, responses } = req.body || {};

        if (!jobRoleId || !Array.isArray(responses) || responses.length === 0) {
            return res.status(400).json({ error: "Invalid assessment submission data" });
        }

        if (
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(jobRoleId)
        ) {
            return res.status(400).json({ error: "Invalid identifier" });
        }

        const assessment = await Assessment.create({
            userId,
            jobRoleId,
            status: "COMPLETED",
            completedAt: new Date(),
        });

        let totalScore = 0;
        let totalQuestions = 0;

        for (const r of responses) {
            const score = parseFloat(r.answer) || 0;
            totalScore += score;
            totalQuestions++;

            if (mongoose.Types.ObjectId.isValid(r.questionId)) {
                await AssessmentResponse.create({
                    assessmentId: assessment._id,
                    questionId: r.questionId,
                    answer: String(r.answer),
                    score,
                });

                const question = await AssessmentQuestion.findById(r.questionId).lean();
                if (question?.skillId) {
                    const calculatedProficiency = Math.min(100, Math.round((score / 5) * 100));
                    await CandidateSkill.findOneAndUpdate(
                        { userId, skillId: question.skillId },
                        {
                            userId,
                            skillId: question.skillId,
                            proficiency: calculatedProficiency,
                            lastAssessedAt: new Date(),
                        },
                        { upsert: true }
                    );
                }
            }
        }

        const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 20 : 0;
        const skillGap = Math.max(0, 100 - averageScore);

        assessment.score = Math.round(averageScore);
        assessment.skillGap = Math.round(skillGap);
        await assessment.save();

        return res.json({
            message: "Assessment submitted successfully to MongoDB",
            assessmentId: assessment._id.toString(),
            score: assessment.score,
            skillGap: assessment.skillGap,
        });
    } catch (error) {
        console.error("Assessment submit error:", error);
        return res.status(500).json({ error: "Failed to submit assessment" });
    }
});

export default router;
