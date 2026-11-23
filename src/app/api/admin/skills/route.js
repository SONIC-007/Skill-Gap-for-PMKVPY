import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const skills = await prisma.skill.findMany({
            include: {
                _count: { select: { candidateSkills: true, jobRequirements: true } },
            },
            orderBy: { domain: "asc" },
        });
        return NextResponse.json({ skills });
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
        const { name, category, domain, description } = await req.json();
        if (!name || !domain) {
            return NextResponse.json({ error: "Name and domain are required" }, { status: 400 });
        }
        const skill = await prisma.skill.create({
            data: { name, category: category || "TECHNICAL", domain, description },
        });
        return NextResponse.json({ skill }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
export async function PUT(req) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id, name, category, domain, description } = await req.json();
        if (!id)
            return NextResponse.json({ error: "ID required" }, { status: 400 });
        const skill = await prisma.skill.update({
            where: { id },
            data: { name, category, domain, description },
        });
        return NextResponse.json({ skill });
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
        await prisma.skill.delete({ where: { id } });
        return NextResponse.json({ message: "Skill deleted" });
    }
    catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
