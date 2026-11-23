import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const courses = await prisma.trainingCourse.findMany({
            include: {
                courseSkills: { include: { skill: true } },
                jobRole: true,
                _count: { select: { enrollments: true } },
            },
            orderBy: { name: "asc" },
        });
        return NextResponse.json({ courses });
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
        const { name, description, provider, difficulty, duration, eligibility, category, jobRoleId } = await req.json();
        if (!name) {
            return NextResponse.json({ error: "Course name is required" }, { status: 400 });
        }
        const course = await prisma.trainingCourse.create({
            data: { name, description, provider, difficulty: difficulty || "BEGINNER", duration, eligibility, category, jobRoleId, isDemo: true },
        });
        return NextResponse.json({ course }, { status: 201 });
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
        await prisma.trainingCourse.delete({ where: { id } });
        return NextResponse.json({ message: "Course deleted" });
    }
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
