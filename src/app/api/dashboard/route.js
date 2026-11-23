import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import CandidateSkill from "@/models/CandidateSkill";
import CourseEnrollment from "@/models/CourseEnrollment";
import Assessment from "@/models/Assessment";
import LearningProgress from "@/models/LearningProgress";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await auth();
        let userId = session?.user?.id;

        // Fallback to demo candidate if guest
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

        let candidateSkills = [];
        let enrollments = [];
        let assessments = [];
        let recentProgress = [];

        // Try Mongoose first
        if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
            try {
                await connectToDatabase();
                const [mSkills, mEnrollments, mAssessments, mProgress] = await Promise.all([
                    CandidateSkill.find({ userId }).populate("skill").lean(),
                    CourseEnrollment.find({ userId }).populate("course").lean(),
                    Assessment.find({ userId }).populate("jobRole").sort({ createdAt: -1 }).lean(),
                    LearningProgress.find({ userId }).sort({ date: -1 }).limit(30).lean(),
                ]);

                candidateSkills = (mSkills || []).map((cs) => ({
                    id: cs._id.toString(),
                    proficiency: cs.proficiency,
                    skill: cs.skill ? {
                        id: cs.skill._id.toString(),
                        name: cs.skill.name,
                        category: cs.skill.category,
                        domain: cs.skill.domain,
                    } : { name: "Technical Skill", category: "TECHNICAL", domain: "General" },
                }));

                enrollments = (mEnrollments || []).map((e) => ({
                    id: e._id.toString(),
                    status: e.status,
                    progress: e.progress,
                    course: e.course ? {
                        id: e.course._id.toString(),
                        name: e.course.name,
                    } : null,
                }));

                assessments = (mAssessments || []).map((a) => ({
                    id: a._id.toString(),
                    score: a.score,
                    skillGap: a.skillGap,
                    status: a.status,
                    completedAt: a.completedAt,
                    jobRole: a.jobRole ? {
                        id: a.jobRole._id.toString(),
                        title: a.jobRole.title,
                    } : null,
                }));

                recentProgress = (mProgress || []).map((p) => ({
                    id: p._id.toString(),
                    skillName: p.skillName,
                    proficiency: p.proficiency,
                    date: p.date,
                }));
            } catch {
                // Ignore
            }
        }

        // Fallback to Prisma if empty
        if (candidateSkills.length === 0 && userId) {
            try {
                candidateSkills = await prisma.candidateSkill.findMany({
                    where: { userId },
                    include: { skill: true },
                });
                enrollments = await prisma.courseEnrollment.findMany({
                    where: { userId },
                    include: { course: true },
                });
                assessments = await prisma.assessment.findMany({
                    where: { userId },
                    include: { jobRole: true },
                    orderBy: { createdAt: "desc" },
                });
                recentProgress = await prisma.learningProgress.findMany({
                    where: { userId },
                    orderBy: { date: "desc" },
                    take: 30,
                });
            } catch {
                // Ignore
            }
        }

        const totalSkillsAssessed = candidateSkills.length;
        const averageProficiency = totalSkillsAssessed > 0
            ? Math.round(candidateSkills.reduce((sum, cs) => sum + (cs.proficiency || 0), 0) / totalSkillsAssessed)
            : 0;

        const latestAssessment = assessments.find((a) => a.status === "COMPLETED");
        const overallSkillGap = latestAssessment?.skillGap ?? 0;
        const coursesEnrolled = enrollments.length;
        const coursesCompleted = enrollments.filter((e) => e.status === "COMPLETED").length;

        const skillDistribution = candidateSkills.map((cs) => ({
            name: cs.skill?.name || "Skill",
            proficiency: cs.proficiency || 0,
            category: cs.skill?.category || "TECHNICAL",
            domain: cs.skill?.domain || "General",
        }));

        return NextResponse.json({
            stats: {
                totalSkillsAssessed,
                averageProficiency,
                overallSkillGap,
                coursesEnrolled,
                coursesCompleted,
            },
            latestAssessment,
            skillDistribution,
            recentProgress,
            assessments,
            enrollments,
        });
    } catch (error) {
        console.error("Dashboard fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
