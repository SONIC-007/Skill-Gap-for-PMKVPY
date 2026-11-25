import mongoose from "mongoose";

const TrainingCourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Course name is required"],
            trim: true,
        },
        description: { type: String, default: null },
        provider: {
            type: String,
            default: "National Skill Development Corporation (NSDC)",
        },
        difficulty: {
            type: String,
            enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
            default: "BEGINNER",
            index: true,
        },
        duration: { type: String, default: "40 Hours" },
        eligibility: { type: String, default: "10+2 / Diploma / Graduate" },
        category: { type: String, index: true },
        imageUrl: { type: String, default: null },
        isDemo: { type: Boolean, default: true },
        jobRoleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobRole",
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

TrainingCourseSchema.virtual("courseSkills", {
    ref: "CourseSkill",
    localField: "_id",
    foreignField: "courseId",
});

export default mongoose.models.TrainingCourse || mongoose.model("TrainingCourse", TrainingCourseSchema);
