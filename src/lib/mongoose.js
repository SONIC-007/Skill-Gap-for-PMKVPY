import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/pmkvy";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless execution environments in Next.js.
 */
let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null, lastFailedAt: 0 };
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    const isLocalUri = /mongodb:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(MONGODB_URI);
    if (isLocalUri && cached.lastFailedAt && Date.now() - cached.lastFailedAt < 15000) {
        throw new Error("Local MongoDB unavailable (cooldown)");
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: isLocalUri ? 1200 : 5000,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            cached.lastFailedAt = 0;
            console.log(`[MongoDB] Connected successfully to ${MONGODB_URI.replace(/\/\/.*@/, "//***@")}`);
            return mongooseInstance;
        }).catch((err) => {
            cached.lastFailedAt = Date.now();
            console.warn(`[MongoDB] Connection warning (${err.message}). Check MONGODB_URI in .env.`);
            cached.promise = null;
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}

export default connectToDatabase;
