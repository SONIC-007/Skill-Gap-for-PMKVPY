import mongoose from "mongoose";

const AssessmentQuestionSchema = new mongoose.Schema(
    {
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
            index: true,
        },
        question: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["RATING", "MCQ", "TRUE_FALSE"],
            default: "RATING",
        },
        options: {
            type: String, // JSON string for options array
            default: null,
        },
        correctAnswer: {
            type: String,
            default: null,
        },
        difficulty: {
            type: String,
            enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
            default: "INTERMEDIATE",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

AssessmentQuestionSchema.virtual("skill", {
    ref: "Skill",
    localField: "skillId",
    foreignField: "_id",
    justOne: true,
});

export default mongoose.models.AssessmentQuestion || mongoose.model("AssessmentQuestion", AssessmentQuestionSchema);
