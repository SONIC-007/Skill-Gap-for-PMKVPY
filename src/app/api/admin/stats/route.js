import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const totalCandidates = await prisma.user.count({ where: { role: "CANDIDATE" } });
        const totalSkills = await prisma.skill.count();
        const totalJobRoles = await prisma.jobRole.count();
        const totalCourses = await prisma.trainingCourse.count();
        const totalAssessments = await prisma.assessment.count();
        const completedAssessments = await prisma.assessment.count({ where: { status: "COMPLETED" } });
        const recentCandidates = await prisma.user.findMany({
            where: { role: "CANDIDATE" },
            orderBy: { createdAt: "desc" },
            take: 10,
            select: { id: true, name: true, email: true, createdAt: true },
        });
        const skillsByDomain = await prisma.skill.groupBy({
            by: ["domain"],
            _count: { id: true },
        });
        const popularSkills = await prisma.candidateSkill.groupBy({
            by: ["skillId"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 10,
        });
        const skillDetails = await prisma.skill.findMany({
            where: { id: { in: popularSkills.map(ps => ps.skillId) } },
        });
        const popularSkillsWithNames = popularSkills.map(ps => ({
            ...ps,
            skillName: skillDetails.find(s => s.id === ps.skillId)?.name || "Unknown",
        }));
        return NextResponse.json({
            stats: {
                totalCandidates,
                totalSkills,
                totalJobRoles,
                totalCourses,
                totalAssessments,
                completedAssessments,
            },
            recentCandidates,
            skillsByDomain,
            popularSkills: popularSkillsWithNames,
        });
    }
    catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
