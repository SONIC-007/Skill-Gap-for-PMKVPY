import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import JobRole from "@/models/JobRole";
import AssessmentQuestion from "@/models/AssessmentQuestion";
import Assessment from "@/models/Assessment";
import AssessmentResponse from "@/models/AssessmentResponse";
import CandidateSkill from "@/models/CandidateSkill";
import User from "@/models/User";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const jobRoleId = searchParams.get("jobRoleId");

        let jobRoles = [];
        // Try Mongoose first
        try {
            await connectToDatabase();
            const mongoRoles = await JobRole.find()
                .populate({
                    path: "skillRequirements",
                    populate: { path: "skill" },
                })
                .sort({ domain: 1 })
                .lean();

            if (mongoRoles && mongoRoles.length > 0) {
                jobRoles = mongoRoles.map((jr) => ({
                    id: jr._id.toString(),
                    title: jr.title,
                    domain: jr.domain,
                    description: jr.description,
                    skillRequirements: (jr.skillRequirements || []).map((sr) => ({
                        id: sr._id?.toString(),
                        skillId: sr.skillId?.toString(),
                        requiredProficiency: sr.requiredProficiency,
                        skill: sr.skill ? {
                            id: sr.skill._id?.toString(),
                            name: sr.skill.name,
                        } : null,
                    })),
                }));
            }
        } catch {
            // Fallback
        }

        if (jobRoles.length === 0) {
            try {
                jobRoles = await prisma.jobRole.findMany({
                    include: {
                        skillRequirements: {
                            include: { skill: true },
                        },
                    },
                    orderBy: { domain: "asc" },
                });
            } catch {
                // Ignore
            }
        }

        const domains = [...new Set(jobRoles.map((jr) => jr.domain))];
        let questions = [];

        if (jobRoleId) {
            const jobRole = jobRoles.find((jr) => jr.id === jobRoleId);
            if (jobRole) {
                const skillIds = jobRole.skillRequirements.map((sr) => sr.skillId);
                // Try Mongoose first
                try {
                    await connectToDatabase();
                    const mQuestions = await AssessmentQuestion.find({
                        skillId: { $in: skillIds },
                    }).populate("skill").lean();

                    if (mQuestions && mQuestions.length > 0) {
                        questions = mQuestions.map((q) => ({
                            id: q._id.toString(),
                            skillId: q.skillId?.toString(),
                            question: q.question,
                            type: q.type,
                            options: q.options,
                            difficulty: q.difficulty,
                            skill: q.skill ? {
                                id: q.skill._id?.toString(),
                                name: q.skill.name,
                            } : null,
                        }));
                    }
                } catch {
                    // Fallback
                }

                if (questions.length === 0) {
                    try {
                        questions = await prisma.assessmentQuestion.findMany({
                            where: { skillId: { in: skillIds } },
                            include: { skill: true },
                            orderBy: { skillId: "asc" },
                        });
                    } catch {
                        // Ignore
                    }
                }
            }
        }

        return NextResponse.json({ jobRoles, domains, questions });
    } catch (error) {
        console.error("Assessment GET error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        let userId = session?.user?.id;
        const body = await req.json();
        const { jobRoleId, responses } = body;

        if (!jobRoleId || !responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        // Try Mongoose first
        try {
            await connectToDatabase();
            if (!userId) {
                const mUser = await User.findOne({ role: "CANDIDATE" });
                if (mUser) userId = mUser._id.toString();
            }

            if (userId && userId.match(/^[0-9a-fA-F]{24}$/) && jobRoleId.match(/^[0-9a-fA-F]{24}$/)) {
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

                    await AssessmentResponse.create({
                        assessmentId: assessment._id,
                        questionId: r.questionId,
                        answer: String(r.answer),
                        score,
                    });

                    const question = await AssessmentQuestion.findById(r.questionId);
                    if (question) {
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

                const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 20 : 0;
                const skillGap = Math.max(0, 100 - averageScore);

                assessment.score = Math.round(averageScore);
                assessment.skillGap = Math.round(skillGap);
                await assessment.save();

                return NextResponse.json({
                    message: "Assessment submitted successfully to MongoDB",
                    assessmentId: assessment._id.toString(),
                    score: Math.round(averageScore),
                    skillGap: Math.round(skillGap),
                });
            }
        } catch {
            // Fallback to Prisma
        }

        // Fallback to Prisma SQLite
        if (!userId) {
            const defaultUser = await prisma.user.findFirst({
                where: { role: "CANDIDATE" },
            });
            if (defaultUser) userId = defaultUser.id;
        }

        const assessment = await prisma.assessment.create({
            data: {
                userId,
                jobRoleId,
                status: "COMPLETED",
                completedAt: new Date(),
            },
        });

        let totalScore = 0;
        let totalQuestions = 0;

        for (const r of responses) {
            const score = parseFloat(r.answer) || 0;
            totalScore += score;
            totalQuestions++;

            await prisma.assessmentResponse.create({
                data: {
                    assessmentId: assessment.id,
                    questionId: r.questionId,
                    answer: String(r.answer),
                    score,
                },
            });

            const question = await prisma.assessmentQuestion.findUnique({
                where: { id: r.questionId },
            });

            if (question) {
                const calculatedProficiency = Math.min(100, Math.round((score / 5) * 100));
                await prisma.candidateSkill.upsert({
                    where: {
                        userId_skillId: { userId, skillId: question.skillId },
                    },
                    update: {
                        proficiency: calculatedProficiency,
                        lastAssessedAt: new Date(),
                    },
                    create: {
                        userId,
                        skillId: question.skillId,
                        proficiency: calculatedProficiency,
                        lastAssessedAt: new Date(),
                    },
                });
            }
        }

        const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 20 : 0;
        const skillGap = Math.max(0, 100 - averageScore);

        await prisma.assessment.update({
            where: { id: assessment.id },
            data: {
                score: Math.round(averageScore),
                skillGap: Math.round(skillGap),
            },
        });

        return NextResponse.json({
            message: "Assessment submitted successfully",
            assessmentId: assessment.id,
            score: Math.round(averageScore),
            skillGap: Math.round(skillGap),
        });
    } catch (error) {
        console.error("Assessment submit error:", error);
        return NextResponse.json({ error: "Failed to submit assessment" }, { status: 500 });
    }
}
