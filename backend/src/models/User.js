import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        role: {
            type: String,
            enum: ["CANDIDATE", "ADMIN"],
            default: "CANDIDATE",
        },
        image: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

UserSchema.virtual("profile", {
    ref: "CandidateProfile",
    localField: "_id",
    foreignField: "userId",
    justOne: true,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
