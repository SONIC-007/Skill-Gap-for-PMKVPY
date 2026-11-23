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
        const enrollments = userId
            ? await prisma.courseEnrollment.findMany({
                where: { userId },
                include: { course: { include: { courseSkills: { include: { skill: true } } } } },
                orderBy: { enrolledAt: "desc" },
            })
            : [];
        const candidateSkills = userId
            ? await prisma.candidateSkill.findMany({
                where: { userId },
                include: { skill: true },
                orderBy: { proficiency: "desc" },
            })
            : [];
        const progressHistory = userId
            ? await prisma.learningProgress.findMany({
                where: { userId },
                orderBy: { date: "asc" },
            })
            : [];
        return NextResponse.json({ enrollments, candidateSkills, progressHistory, isGuest: !session?.user });
    }
    catch (error) {
        console.error("Progress error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
export async function PUT(req) {
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
        const { enrollmentId, progress, status } = await req.json();
        if (!enrollmentId) {
            return NextResponse.json({ error: "Enrollment ID required" }, { status: 400 });
        }
        const enrollment = await prisma.courseEnrollment.update({
            where: { id: enrollmentId },
            data: {
                progress: progress !== undefined ? progress : undefined,
                status: status || undefined,
                completedAt: status === "COMPLETED" ? new Date() : undefined,
            },
        });
        return NextResponse.json({ enrollment });
    }
    catch (error) {
        console.error("Progress update error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
