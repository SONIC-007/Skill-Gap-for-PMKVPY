import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const candidates = await prisma.user.findMany({
            where: { role: "CANDIDATE" },
            include: {
                profile: true,
                assessments: {
                    include: { jobRole: true },
                    orderBy: { createdAt: "desc" },
                },
                enrollments: {
                    include: { course: true },
                },
                _count: {
                    select: { candidateSkills: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ candidates });
    }
    catch (error) {
        console.error("Candidates error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
