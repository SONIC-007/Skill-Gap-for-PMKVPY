import mongoose from "mongoose";

const CourseSkillSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingCourse",
            required: true,
            index: true,
        },
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Skill",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

CourseSkillSchema.index({ courseId: 1, skillId: 1 }, { unique: true });

CourseSkillSchema.virtual("skill", {
    ref: "Skill",
    localField: "skillId",
    foreignField: "_id",
    justOne: true,
});

export default mongoose.models.CourseSkill || mongoose.model("CourseSkill", CourseSkillSchema);
