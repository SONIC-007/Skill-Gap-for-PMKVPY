import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import TrainingCourse from "@/models/TrainingCourse";
import CandidateSkill from "@/models/CandidateSkill";
import User from "@/models/User";

export async function GET(req) {
    try {
        const session = await auth();
        let userId = session?.user?.id;

        // Try Mongoose first for courses
        let courses = [];
        try {
            await connectToDatabase();
            const { searchParams } = new URL(req.url);
            const category = searchParams.get("category");
            const difficulty = searchParams.get("difficulty");
            const filter = {};
            if (category) filter.category = category;
            if (difficulty) filter.difficulty = difficulty;

            const mCourses = await TrainingCourse.find(filter)
                .populate({
                    path: "courseSkills",
                    populate: { path: "skill" },
                })
                .sort({ name: 1 })
                .lean();

            if (mCourses && mCourses.length > 0) {
                courses = mCourses.map((c) => ({
                    id: c._id.toString(),
                    name: c.name,
                    description: c.description,
                    provider: c.provider,
                    difficulty: c.difficulty,
                    duration: c.duration,
                    eligibility: c.eligibility,
                    category: c.category,
                    imageUrl: c.imageUrl,
                    isDemo: c.isDemo,
                    courseSkills: (c.courseSkills || []).map((cs) => ({
                        id: cs._id?.toString(),
                        skill: cs.skill ? {
                            id: cs.skill._id?.toString(),
                            name: cs.skill.name,
                        } : null,
                    })),
                    enrollments: [],
                }));
            }
        } catch {
            // Mongoose unavailable
        }

        // Fallback to Prisma SQLite
        if (courses.length === 0) {
            try {
                const { searchParams } = new URL(req.url);
                const category = searchParams.get("category");
                const difficulty = searchParams.get("difficulty");
                const where = {};
                if (category) where.category = category;
                if (difficulty) where.difficulty = difficulty;

                courses = await prisma.trainingCourse.findMany({
                    where,
                    include: {
                        courseSkills: { include: { skill: true } },
                        jobRole: true,
                        enrollments: userId ? { where: { userId } } : false,
                    },
                    orderBy: { name: "asc" },
                });
            } catch (err) {
                console.warn("[Prisma courses fallback error]", err.message);
            }
        }

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
        if (userId) {
            try {
                await connectToDatabase();
                if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                    const mSkills = await CandidateSkill.find({ userId }).populate("skill").lean();
                    candidateSkills = mSkills.map((cs) => ({
                        skillId: cs.skillId?.toString(),
                        proficiency: cs.proficiency,
                        skillName: cs.skill?.name,
                    }));
                }
            } catch {
                // Ignore
            }

            if (candidateSkills.length === 0) {
                try {
                    const pSkills = await prisma.candidateSkill.findMany({
                        where: { userId },
                        include: { skill: true },
                    });
                    candidateSkills = pSkills.map((s) => ({
                        skillId: s.skillId,
                        proficiency: s.proficiency,
                        skillName: s.skill?.name,
                    }));
                } catch {
                    // Ignore
                }
            }
        }

        const coursesWithRelevance = courses.map((course) => {
            let relevanceScore = 0;
            const skillsCovered = (course.courseSkills || []).map((cs) => cs.skill?.name).filter(Boolean);
            for (const cs of course.courseSkills || []) {
                const candidateSkill = candidateSkills.find(
                    (s) => s.skillName === cs.skill?.name || s.skillId === cs.skill?.id
                );
                if (!candidateSkill || candidateSkill.proficiency < 50) {
                    relevanceScore += 10;
                } else if (candidateSkill.proficiency < 70) {
                    relevanceScore += 5;
                }
            }
            return {
                ...course,
                relevanceScore,
                skillsCovered,
                isEnrolled: (course.enrollments || []).length > 0,
            };
        });

        coursesWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore);
        const categories = [...new Set(coursesWithRelevance.map((c) => c.category).filter(Boolean))].sort();
        return NextResponse.json({ courses: coursesWithRelevance, categories });
    } catch (error) {
        console.error("Courses fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}
