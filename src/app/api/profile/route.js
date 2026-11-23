import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import CandidateProfile from "@/models/CandidateProfile";

export async function GET() {
    try {
        const session = await auth();
        let userId = session?.user?.id;

        // Try Mongoose first
        if (userId) {
            try {
                await connectToDatabase();
                if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                    const mUser = await User.findById(userId).lean();
                    if (mUser) {
                        const mProfile = await CandidateProfile.findOne({ userId }).lean();
                        return NextResponse.json({
                            id: mUser._id.toString(),
                            name: mUser.name,
                            email: mUser.email,
                            role: mUser.role,
                            profile: mProfile || {},
                            isGuest: false,
                        });
                    }
                }
            } catch {
                // Ignore Mongo lookup error
            }
        }

        // Fallback to Prisma SQLite
        if (userId) {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    include: { profile: true },
                });
                if (user) {
                    const { password, ...userData } = user;
                    return NextResponse.json({ ...userData, isGuest: false });
                }
            } catch {
                // Ignore
            }
        }

        // Default candidate if guest
        try {
            await connectToDatabase();
            const defaultMUser = await User.findOne({ role: "CANDIDATE" }).lean();
            if (defaultMUser) {
                const defaultMProfile = await CandidateProfile.findOne({ userId: defaultMUser._id }).lean();
                return NextResponse.json({
                    id: defaultMUser._id.toString(),
                    name: defaultMUser.name,
                    email: defaultMUser.email,
                    role: defaultMUser.role,
                    profile: defaultMProfile || {},
                    isGuest: true,
                });
            }
        } catch {
            // Ignore
        }

        const defaultUser = await prisma.user.findFirst({
            where: { role: "CANDIDATE" },
            include: { profile: true },
        });

        if (defaultUser) {
            const { password, ...userData } = defaultUser;
            return NextResponse.json({ ...userData, isGuest: true });
        }

        return NextResponse.json({
            id: "guest-id",
            name: "Rahul Sharma",
            email: "candidate@pmkvy.com",
            role: "CANDIDATE",
            isGuest: true,
            profile: {
                phone: "+91 9876543210",
                education: "B.Tech in Computer Science & Engineering",
                experience: "1 Year",
                location: "Jaipur, Rajasthan",
                desiredCareerField: "Web Development",
                targetJobRole: "Full Stack Developer",
                bio: "Passionate aspiring software engineer.",
            },
        });
    } catch (error) {
        console.error("Profile GET error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await auth();
        let userId = session?.user?.id;
        if (!userId) {
            return NextResponse.json({
                message: "Profile updated for preview (Sign in to permanently save your changes)",
                isGuest: true,
            });
        }

        const body = await req.json();
        const { name, phone, education, experience, location, desiredCareerField, targetJobRole, bio } = body;

        // Try Mongoose first
        try {
            await connectToDatabase();
            if (userId.match(/^[0-9a-fA-F]{24}$/)) {
                await User.findByIdAndUpdate(userId, { name });
                await CandidateProfile.findOneAndUpdate(
                    { userId },
                    { phone, education, experience, location, desiredCareerField, targetJobRole, bio },
                    { upsert: true }
                );
                return NextResponse.json({ message: "Profile updated successfully in MongoDB" });
            }
        } catch {
            // Ignore
        }

        // Fallback to Prisma SQLite
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { name },
            });
            await prisma.candidateProfile.upsert({
                where: { userId },
                update: { phone, education, experience, location, desiredCareerField, targetJobRole, bio },
                create: { userId, phone, education, experience, location, desiredCareerField, targetJobRole, bio },
            });
        } catch (pErr) {
            console.warn("Prisma profile update error:", pErr.message);
        }

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Profile PUT error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
