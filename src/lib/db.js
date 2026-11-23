import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import connectToDatabase, { isMongoConnected } from "./mongoose";
import * as models from "@/models";

const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;

export { mongoose, connectToDatabase, isMongoConnected, models };
export default prisma;
