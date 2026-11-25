import mongoose from "mongoose";

const CandidateSkillSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
            index: true,
        },
        proficiency: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        lastAssessedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

CandidateSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });

CandidateSkillSchema.virtual("skill", {
    ref: "Skill",
    localField: "skillId",
    foreignField: "_id",
    justOne: true,
});

export default mongoose.models.CandidateSkill || mongoose.model("CandidateSkill", CandidateSkillSchema);
