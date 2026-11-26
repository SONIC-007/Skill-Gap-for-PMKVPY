// [BACKEND] Route: GET/POST /api/assessment | Used by: Frontend/src/app/assessment/page.jsx | Models: JobRole, AssessmentQuestion, Assessment, AssessmentResponse, CandidateSkill, LearningProgress
import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import JobRole from "../models/JobRole.js";
import AssessmentQuestion from "../models/AssessmentQuestion.js";
import Assessment from "../models/Assessment.js";
import AssessmentResponse from "../models/AssessmentResponse.js";
import CandidateSkill from "../models/CandidateSkill.js";
import LearningProgress from "../models/LearningProgress.js";

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
            .sort({ domain: 1, title: 1 })
            .lean();

        const jobRoles = (mongoRoles || []).map((jr) => ({
            id: jr._id.toString(),
            title: jr.title,
            domain: jr.domain,
            description: jr.description,
            minExperience: jr.minExperience,
            avgSalary: jr.avgSalary,
            demandLevel: jr.demandLevel,
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
                              category: q.skill.category,
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

        const roleExists = await JobRole.exists({ _id: jobRoleId });
        if (!roleExists) {
            return res.status(404).json({ error: "Target job role not found" });
        }

        const questionIds = responses
            .map((r) => r?.questionId)
            .filter((id) => id && mongoose.Types.ObjectId.isValid(id));

        const questionDocs = await AssessmentQuestion.find({
            _id: { $in: questionIds },
        })
            .populate("skill")
            .lean();

        const questionMap = new Map(questionDocs.map((q) => [q._id.toString(), q]));

        const assessment = await Assessment.create({
            userId,
            jobRoleId,
            status: "COMPLETED",
            completedAt: new Date(),
        });

        let totalScore = 0;
        let totalQuestions = 0;
        const skillScores = new Map();

        for (const r of responses) {
            const qId = String(r?.questionId || "");
            const question = questionMap.get(qId);
            if (!question) continue;

            const rawAnswer = String(r?.answer ?? "").trim();
            let normalizedScore = 0;

            if (question.type === "RATING") {
                const parsed = Number(rawAnswer);
                if (Number.isFinite(parsed)) {
                    // Support 0-100 percentage slider directly, or 1-5 rating if explicitly small without percentage score
                    const pct =
                        parsed >= 0 && parsed <= 5 && r?.score === undefined && rawAnswer.length === 1
                            ? parsed * 20
                            : parsed;
                    normalizedScore = Math.max(0, Math.min(100, Math.round(pct)));
                }
            } else {
                const expected = String(question.correctAnswer ?? "0").trim();
                normalizedScore = rawAnswer === expected ? 100 : 30;
            }

            totalScore += normalizedScore;
            totalQuestions += 1;

            await AssessmentResponse.findOneAndUpdate(
                { assessmentId: assessment._id, questionId: question._id },
                {
                    assessmentId: assessment._id,
                    questionId: question._id,
                    answer: rawAnswer.slice(0, 200) || "0",
                    score: normalizedScore,
                },
                { upsert: true }
            );

            if (question.skillId) {
                const sid = question.skillId.toString();
                if (!skillScores.has(sid)) {
                    skillScores.set(sid, {
                        skillId: question.skillId,
                        skillName: question.skill?.name || null,
                        scores: [],
                        mcqPassed: false,
                    });
                }
                const entry = skillScores.get(sid);
                entry.scores.push(normalizedScore);
                if (question.type !== "RATING" && normalizedScore === 100) {
                    entry.mcqPassed = true;
                }
            }
        }

        if (totalQuestions === 0) {
            await Assessment.findByIdAndDelete(assessment._id);
            return res.status(400).json({ error: "No valid assessment question responses found" });
        }

        const now = new Date();
        for (const entry of skillScores.values()) {
            const avgSkillProficiency = Math.max(
                0,
                Math.min(
                    100,
                    Math.round(entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length)
                )
            );
            await CandidateSkill.findOneAndUpdate(
                { userId, skillId: entry.skillId },
                {
                    userId,
                    skillId: entry.skillId,
                    proficiency: avgSkillProficiency,
                    verified: entry.mcqPassed || avgSkillProficiency >= 75,
                    lastAssessedAt: now,
                },
                { upsert: true }
            );

            if (entry.skillName) {
                await LearningProgress.create({
                    userId,
                    skillName: entry.skillName,
                    proficiency: avgSkillProficiency,
                    date: now,
                });
            }
        }

        const averageScore = Math.max(0, Math.min(100, Math.round(totalScore / totalQuestions)));
        const skillGap = Math.max(0, 100 - averageScore);

        assessment.score = averageScore;
        assessment.skillGap = skillGap;
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
