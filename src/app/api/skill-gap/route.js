import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import JobRole from "@/models/JobRole";
import Assessment from "@/models/Assessment";
import CandidateSkill from "@/models/CandidateSkill";
import User from "@/models/User";

export async function GET(req) {
    try {
        const session = await auth();
        let userId = session?.user?.id;

        // Try Mongoose first for job roles
        let jobRoles = [];
        try {
            await connectToDatabase();
            const mongoRoles = await JobRole.find()
                .populate({
                    path: "skillRequirements",
                    populate: { path: "skill" },
                })
                .sort({ title: 1 })
                .lean();

            if (mongoRoles && mongoRoles.length > 0) {
                jobRoles = mongoRoles.map((r) => ({
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
                        skill: sr.skill ? {
                            id: sr.skill._id?.toString(),
                            name: sr.skill.name,
                            domain: sr.skill.domain,
                            category: sr.skill.category,
                        } : null,
                    })),
                }));
            }
        } catch {
            // Mongoose unavailable
        }

        // Fallback to Prisma if Mongoose returned empty
        if (jobRoles.length === 0) {
            try {
                jobRoles = await prisma.jobRole.findMany({
                    include: {
                        skillRequirements: { include: { skill: true } },
                    },
                    orderBy: { title: "asc" },
                });
            } catch (err) {
                console.warn("[Prisma fallback error]", err.message);
            }
        }

        // If guest, pick candidate
        if (!userId) {
            try {
                await connectToDatabase();
                const mUser = await User.findOne({ role: "CANDIDATE" });
                if (mUser) userId = mUser._id.toString();
            } catch {
                // Ignore
            }
            if (!userId) {
                const defaultUser = await prisma.user.findFirst({
                    where: { role: "CANDIDATE" },
                });
                if (defaultUser) userId = defaultUser.id;
            }
        }

        const { searchParams } = new URL(req.url);
        const jobRoleId = searchParams.get("jobRoleId");

        if (!jobRoleId) {
            let assessments = [];
            if (userId) {
                try {
                    await connectToDatabase();
                    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
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
                            jobRole: a.jobRole ? {
                                id: a.jobRole._id.toString(),
                                title: a.jobRole.title,
                                domain: a.jobRole.domain,
                            } : null,
                        }));
                    }
                } catch {
                    // Ignore
                }

                if (assessments.length === 0) {
                    try {
                        assessments = await prisma.assessment.findMany({
                            where: { userId, status: "COMPLETED" },
                            include: { jobRole: true },
                            orderBy: { completedAt: "desc" },
                        });
                    } catch {
                        // Ignore
                    }
                }
            }
            return NextResponse.json({ jobRoles, assessments });
        }

        const selectedRole = jobRoles.find((r) => r.id === jobRoleId) || jobRoles[0];
        if (!selectedRole) {
            return NextResponse.json({ error: "Job role not found", jobRoles }, { status: 404 });
        }

        let candidateSkills = [];
        if (userId) {
            try {
                await connectToDatabase();
                if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                    const mSkills = await CandidateSkill.find({ userId }).populate("skill").lean();
                    candidateSkills = mSkills.map((cs) => ({
                        id: cs._id.toString(),
                        skillId: cs.skillId?.toString(),
                        proficiency: cs.proficiency,
                        skill: cs.skill ? {
                            id: cs.skill._id.toString(),
                            name: cs.skill.name,
                        } : null,
                    }));
                }
            } catch {
                // Ignore
            }

            if (candidateSkills.length === 0) {
                try {
                    candidateSkills = await prisma.candidateSkill.findMany({
                        where: { userId },
                        include: { skill: true },
                    });
                } catch {
                    // Ignore
                }
            }
        }

        const skillGapResults = (selectedRole.skillRequirements || []).map((req) => {
            const cs = candidateSkills.find(
                (c) => c.skill?.name === req.skill?.name || c.skillId === req.skill?.id
            );
            const currentProficiency = cs?.proficiency || 0;
            const required = req.requiredProficiency || 70;
            const gapPercent = required > 0
                ? Math.max(0, Math.round(((required - currentProficiency) / required) * 100))
                : 0;
            const uiStatus = gapPercent <= 10 ? "met" : gapPercent <= 50 ? "improvement" : "missing";
            return {
                skillId: req.skill?.id,
                skillName: req.skill?.name || "Skill",
                category: req.skill?.category || "TECHNICAL",
                domain: req.skill?.domain,
                requiredProficiency: required,
                candidateProficiency: currentProficiency,
                currentProficiency,
                gap: gapPercent,
                importance: req.importance || "Required",
                status: uiStatus,
                gapStatus: gapPercent <= 10 ? "MET" : gapPercent <= 50 ? "MODERATE_GAP" : "CRITICAL_GAP",
            };
        });

        const totalRequired = skillGapResults.reduce((acc, curr) => acc + curr.requiredProficiency, 0);
        const totalCurrent = skillGapResults.reduce((acc, curr) => acc + Math.min(curr.currentProficiency, curr.requiredProficiency), 0);
        const overallMatchPercentage = totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 0;
        const overallGap = Math.max(0, 100 - overallMatchPercentage);

        return NextResponse.json({
            jobRole: selectedRole,
            skills: skillGapResults,
            skillGapResults,
            overallGap,
            overallMatchPercentage,
            jobRoles,
        });
    } catch (error) {
        console.error("Skill gap analysis error:", error);
        return NextResponse.json({ error: "Failed to perform skill gap analysis" }, { status: 500 });
    }
}
