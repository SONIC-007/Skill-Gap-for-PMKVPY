import mongoose from "mongoose";

const AssessmentResponseSchema = new mongoose.Schema(
    {
        assessmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assessment",
            required: true,
            index: true,
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AssessmentQuestion",
            required: true,
            index: true,
        },
        answer: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

AssessmentResponseSchema.index({ assessmentId: 1, questionId: 1 }, { unique: true });

export default mongoose.models.AssessmentResponse || mongoose.model("AssessmentResponse", AssessmentResponseSchema);
