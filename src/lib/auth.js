import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                let user = null;

                // 1. Check MongoDB via Mongoose first
                try {
                    await connectToDatabase();
                    const mongoUser = await User.findOne({
                        email: credentials.email.toLowerCase().trim(),
                    }).lean();

                    if (mongoUser) {
                        user = {
                            id: mongoUser._id.toString(),
                            email: mongoUser.email,
                            name: mongoUser.name,
                            role: mongoUser.role || "CANDIDATE",
                            password: mongoUser.password,
                        };
                    }
                } catch (mongoErr) {
                    // Mongoose connection not available, fall back to SQLite
                }

                // 2. Fall back to SQLite / Prisma if not resolved via MongoDB
                if (!user) {
                    try {
                        const prismaUser = await prisma.user.findUnique({
                            where: { email: credentials.email.toLowerCase().trim() },
                        });
                        if (prismaUser) {
                            user = prismaUser;
                        }
                    } catch (prismaErr) {
                        console.warn("Prisma user lookup error:", prismaErr.message);
                    }
                }

                if (!user) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
});
