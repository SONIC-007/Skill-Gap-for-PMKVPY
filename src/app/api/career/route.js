import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const session = await auth();
        let userId = session?.user?.id;
        if (!userId) {
            const defaultUser = await prisma.user.findFirst({
                where: { role: "CANDIDATE" },
            });
            if (defaultUser) {
                userId = defaultUser.id;
            }
        }
        const candidateSkills = userId
            ? await prisma.candidateSkill.findMany({
                where: { userId },
                include: { skill: true },
            })
            : [];
        const jobRoles = await prisma.jobRole.findMany({
            include: {
                skillRequirements: { include: { skill: true } },
            },
        });
        const recommendations = jobRoles.map((role) => {
            let matchedSkills = [];
            let missingSkills = [];
            let totalRequired = 0;
            let totalMatched = 0;
            for (const req of role.skillRequirements) {
                const cs = candidateSkills.find((c) => c.skillId === req.skillId);
                totalRequired += req.requiredProficiency;
                if (cs && cs.proficiency >= req.requiredProficiency * 0.7) {
                    matchedSkills.push(req.skill.name);
                    totalMatched += Math.min(cs.proficiency, req.requiredProficiency);
                }
                else {
                    missingSkills.push(req.skill.name);
                    if (cs)
                        totalMatched += cs.proficiency;
                }
            }
            const readinessPercentage = totalRequired > 0 ? Math.round((totalMatched / totalRequired) * 100) : 0;
            return {
                id: role.id,
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
        return NextResponse.json({ recommendations, isGuest: !session?.user });
    }
    catch (error) {
        console.error("Career recommendations error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
