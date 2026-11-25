import mongoose from "mongoose";

const LearningProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        skillName: {
            type: String,
            required: true,
            trim: true,
        },
        proficiency: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        date: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

LearningProgressSchema.index({ userId: 1, date: -1 });

export default mongoose.models.LearningProgress || mongoose.model("LearningProgress", LearningProgressSchema);
