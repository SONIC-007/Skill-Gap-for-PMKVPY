import mongoose from "mongoose";

const JobRoleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            unique: true,
            trim: true,
            index: true,
        },
        domain: {
            type: String,
            required: true,
            index: true,
        },
        description: { type: String, default: null },
        minExperience: { type: String, default: "0-2 Years" },
        avgSalary: { type: String, default: "₹4.5 - 8.0 LPA" },
        demandLevel: {
            type: String,
            enum: ["High", "Medium", "Low", "Critical", "HIGH", "MEDIUM", "LOW", "VERY HIGH"],
            default: "High",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

JobRoleSchema.virtual("skillRequirements", {
    ref: "JobSkillRequirement",
    localField: "_id",
    foreignField: "jobRoleId",
});

JobRoleSchema.virtual("courses", {
    ref: "TrainingCourse",
    localField: "_id",
    foreignField: "jobRoleId",
});

export default mongoose.models.JobRole || mongoose.model("JobRole", JobRoleSchema);
