import mongoose from "mongoose";

const CandidateProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },
        phone: { type: String, default: null },
        dateOfBirth: { type: Date, default: null },
        gender: { type: String, default: null },
        education: { type: String, default: null },
        experience: { type: String, default: null },
        location: { type: String, default: null },
        desiredCareerField: { type: String, default: null },
        targetJobRole: { type: String, default: null },
        bio: { type: String, default: null },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.CandidateProfile || mongoose.model("CandidateProfile", CandidateProfileSchema);
