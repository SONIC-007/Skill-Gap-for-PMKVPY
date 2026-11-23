import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import CandidateProfile from "@/models/CandidateProfile";
import { registerSchema } from "@/lib/validations";

export async function POST(req) {
    try {
        const body = await req.json();
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            const errorMsg = validation.error.issues?.[0]?.message ||
                validation.error.errors?.[0]?.message ||
                "Invalid input data";
            return NextResponse.json({ error: errorMsg }, { status: 400 });
        }

        const { name, email, password } = validation.data;
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Check if user exists (Check Mongo first, then Prisma)
        let userExists = false;
        try {
            await connectToDatabase();
            const existingMongo = await User.findOne({ email: normalizedEmail });
            if (existingMongo) userExists = true;
        } catch {
            // Mongo not connected, check Prisma
        }

        if (!userExists) {
            try {
                const existingPrisma = await prisma.user.findUnique({
                    where: { email: normalizedEmail },
                });
                if (existingPrisma) userExists = true;
            } catch {
                // Ignore
            }
        }

        if (userExists) {
            return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        let createdUserId = null;

        // 2. Create in MongoDB via Mongoose if available
        try {
            await connectToDatabase();
            const mongoUser = await User.create({
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: "CANDIDATE",
            });
            await CandidateProfile.create({
                userId: mongoUser._id,
            });
            createdUserId = mongoUser._id.toString();
        } catch (mongoErr) {
            console.warn("MongoDB registration fallback to SQLite:", mongoErr.message);
        }

        // 3. Also synchronize or create in SQLite / Prisma for redundancy
        try {
            const prismaUser = await prisma.user.create({
                data: {
                    name,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role: "CANDIDATE",
                    profile: {
                        create: {},
                    },
                },
            });
            if (!createdUserId) createdUserId = prismaUser.id;
        } catch (prismaErr) {
            if (!createdUserId) {
                console.error("Prisma registration error:", prismaErr);
                return NextResponse.json({ error: "Failed to create user record." }, { status: 500 });
            }
        }

        return NextResponse.json({
            message: "Account created successfully",
            userId: createdUserId,
        }, { status: 201 });
    }
    catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
}
