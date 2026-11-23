import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const jobRoles = await prisma.jobRole.findMany({
            include: {
                skillRequirements: { include: { skill: true } },
                _count: { select: { assessments: true } },
            },
            orderBy: { domain: "asc" },
        });
        return NextResponse.json({ jobRoles });
    }
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { title, domain, description, minExperience, avgSalary, demandLevel } = await req.json();
        if (!title || !domain) {
            return NextResponse.json({ error: "Title and domain are required" }, { status: 400 });
        }
        const jobRole = await prisma.jobRole.create({
            data: { title, domain, description, minExperience, avgSalary, demandLevel },
        });
        return NextResponse.json({ jobRole }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id)
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.jobRole.delete({ where: { id } });
        return NextResponse.json({ message: "Job role deleted" });
    }
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
