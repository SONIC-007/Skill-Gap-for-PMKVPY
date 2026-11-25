import mongoose from "mongoose";

let cached = globalThis.__pmkvyMongoose || {
    conn: null,
    promise: null,
    lastFailedAt: 0,
};
globalThis.__pmkvyMongoose = cached;

export async function connectToDatabase() {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/pmkvy";
    const isLocalUri = /mongodb:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(mongoUri);

    if (isLocalUri && cached.lastFailedAt && Date.now() - cached.lastFailedAt < 15000) {
        throw new Error("Local MongoDB unavailable (cooldown). Configure MONGODB_URI in backend/.env.");
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: isLocalUri ? 1500 : 8000,
        };

        cached.promise = mongoose
            .connect(mongoUri, opts)
            .then((mongooseInstance) => {
                cached.lastFailedAt = 0;
                console.log(`[MongoDB] Connected to ${mongoUri.replace(/\/\/.*@/, "//***@")}`);
                return mongooseInstance;
            })
            .catch((err) => {
                cached.lastFailedAt = Date.now();
                cached.promise = null;
                console.warn(`[MongoDB] Connection failed (${err.message}). Check MONGODB_URI in backend/.env.`);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

export function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}

export default connectToDatabase;
