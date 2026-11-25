import mongoose from "mongoose";

const JobSkillRequirementSchema = new mongoose.Schema(
    {
        jobRoleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobRole",
            required: true,
            index: true,
        },
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
            index: true,
        },
        requiredProficiency: {
            type: Number,
            default: 70,
            min: 0,
            max: 100,
        },
        importance: {
            type: String,
            enum: ["Mandatory", "Required", "Preferred", "Recommended", "Nice-to-have"],
            default: "Required",
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

JobSkillRequirementSchema.index({ jobRoleId: 1, skillId: 1 }, { unique: true });

JobSkillRequirementSchema.virtual("skill", {
    ref: "Skill",
    localField: "skillId",
    foreignField: "_id",
    justOne: true,
});

JobSkillRequirementSchema.virtual("jobRole", {
    ref: "JobRole",
    localField: "jobRoleId",
    foreignField: "_id",
    justOne: true,
});

export default mongoose.models.JobSkillRequirement || mongoose.model("JobSkillRequirement", JobSkillRequirementSchema);
