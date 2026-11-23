import mongoose from "mongoose";

const AssessmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        jobRoleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobRole",
            required: true,
            index: true,
        },
        score: { type: Number, default: null },
        skillGap: { type: Number, default: null },
        status: {
            type: String,
            enum: ["IN_PROGRESS", "COMPLETED"],
            default: "IN_PROGRESS",
        },
        completedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

AssessmentSchema.virtual("jobRole", {
    ref: "JobRole",
    localField: "jobRoleId",
    foreignField: "_id",
    justOne: true,
});

AssessmentSchema.virtual("responses", {
    ref: "AssessmentResponse",
    localField: "_id",
    foreignField: "assessmentId",
});

export default mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);
