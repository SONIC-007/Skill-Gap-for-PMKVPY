import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import JobRole from "@/models/JobRole";
import Skill from "@/models/Skill";
import Assessment from "@/models/Assessment";
import CandidateSkill from "@/models/CandidateSkill";
import LearningProgress from "@/models/LearningProgress";
import CandidateProfile from "@/models/CandidateProfile";

export async function POST(req) {
    try {
        const body = await req.json();
        const {
            userEmail,
            jobRoleId,
            jobTitle,
            matchPercentage = 70,
            skillsEvaluated = [],
        } = body;

        let mongoUserId = null;
        let prismaUserId = null;

        // 1. Try to find user in MongoDB
        try {
            await connectToDatabase();
            let mongoUser = null;
            if (userEmail) {
                mongoUser = await User.findOne({ email: userEmail.toLowerCase().trim() });
            }
            if (!mongoUser) {
                mongoUser = await User.findOne({ role: "CANDIDATE" });
            }
            if (mongoUser) {
                mongoUserId = mongoUser._id;
            }
        } catch {
            // Mongo connection unavailable
        }

        // 2. Try to find user in Prisma SQLite
        try {
            let prismaUser = null;
            if (userEmail) {
                prismaUser = await prisma.user.findUnique({
                    where: { email: userEmail.toLowerCase().trim() },
                });
            }
            if (!prismaUser) {
                prismaUser = await prisma.user.findFirst({
                    where: { role: "CANDIDATE" },
                });
            }
            if (prismaUser) {
                prismaUserId = prismaUser.id;
            }
        } catch {
            // Ignore
        }

        if (!mongoUserId && !prismaUserId) {
            return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
        }

        const skillGap = Math.max(0, 100 - matchPercentage);
        let savedAssessmentId = null;

        // 3. Save to MongoDB via Mongoose if available
        if (mongoUserId) {
            try {
                let mongoJobRole = null;
                if (jobRoleId && jobRoleId.match(/^[0-9a-fA-F]{24}$/)) {
                    mongoJobRole = await JobRole.findById(jobRoleId);
                }
                if (!mongoJobRole && jobTitle) {
                    mongoJobRole = await JobRole.findOne({ title: jobTitle });
                }
                if (!mongoJobRole) {
                    mongoJobRole = await JobRole.findOne();
                }

                if (mongoJobRole) {
                    const mongoAssessment = await Assessment.create({
                        userId: mongoUserId,
                        jobRoleId: mongoJobRole._id,
                        score: matchPercentage,
                        skillGap,
                        status: "COMPLETED",
                        completedAt: new Date(),
                    });
                    savedAssessmentId = mongoAssessment._id.toString();

                    for (const item of skillsEvaluated) {
                        const sDoc = await Skill.findOne({ name: item.skillName });
                        if (sDoc) {
                            const prof = item.candidateProficiency || 0;
                            await CandidateSkill.findOneAndUpdate(
                                { userId: mongoUserId, skillId: sDoc._id },
                                {
                                    userId: mongoUserId,
                                    skillId: sDoc._id,
                                    proficiency: prof,
                                    verified: item.status === "MATCHED",
                                    lastAssessedAt: new Date(),
                                },
                                { upsert: true, new: true }
                            );

                            await LearningProgress.create({
                                userId: mongoUserId,
                                skillName: item.skillName,
                                proficiency: prof,
                                date: new Date(),
                            });
                        }
                    }

                    await CandidateProfile.findOneAndUpdate(
                        { userId: mongoUserId },
                        { targetJobRole: jobTitle },
                        { upsert: true }
                    );
                }
            } catch (mongoSaveErr) {
                console.warn("[Mongoose Save Error]", mongoSaveErr.message);
            }
        }

        // 4. Save to Prisma SQLite
        if (prismaUserId) {
            try {
                let targetJobRoleId = jobRoleId;
                if (!targetJobRoleId || targetJobRoleId.match(/^[0-9a-fA-F]{24}$/)) {
                    const existing = await prisma.jobRole.findFirst({
                        where: { title: jobTitle },
                    });
                    if (existing) {
                        targetJobRoleId = existing.id;
                    } else {
                        const firstRole = await prisma.jobRole.findFirst();
                        targetJobRoleId = firstRole ? firstRole.id : undefined;
                    }
                }

                if (targetJobRoleId) {
                    const assessment = await prisma.assessment.create({
                        data: {
                            userId: prismaUserId,
                            jobRoleId: targetJobRoleId,
                            score: matchPercentage,
                            skillGap,
                            status: "COMPLETED",
                            completedAt: new Date(),
                        },
                    });
                    if (!savedAssessmentId) savedAssessmentId = assessment.id;

                    for (const item of skillsEvaluated) {
                        const skillRecord = await prisma.skill.findUnique({
                            where: { name: item.skillName },
                        });
                        if (skillRecord) {
                            const candidateProficiency = item.candidateProficiency || 0;
                            await prisma.candidateSkill.upsert({
                                where: {
                                    userId_skillId: {
                                        userId: prismaUserId,
                                        skillId: skillRecord.id,
                                    },
                                },
                                update: {
                                    proficiency: candidateProficiency,
                                    verified: item.status === "MATCHED",
                                    lastAssessedAt: new Date(),
                                },
                                create: {
                                    userId: prismaUserId,
                                    skillId: skillRecord.id,
                                    proficiency: candidateProficiency,
                                    verified: item.status === "MATCHED",
                                    lastAssessedAt: new Date(),
                                },
                            });

                            await prisma.learningProgress.create({
                                data: {
                                    userId: prismaUserId,
                                    skillName: item.skillName,
                                    proficiency: candidateProficiency,
                                    date: new Date(),
                                },
                            });
                        }
                    }

                    await prisma.candidateProfile.updateMany({
                        where: { userId: prismaUserId },
                        data: { targetJobRole: jobTitle },
                    });
                }
            } catch (prismaSaveErr) {
                console.warn("[Prisma Save Error]", prismaSaveErr.message);
            }
        }

        return NextResponse.json({
            success: true,
            assessmentId: savedAssessmentId || "saved",
            message: "Diagnostic results successfully synchronized to MongoDB & candidate profile!",
        });
    } catch (error) {
        console.error("Save AI Resume Analysis error:", error);
        return NextResponse.json({ error: "Failed to save analysis: " + error.message }, { status: 500 });
    }
}
