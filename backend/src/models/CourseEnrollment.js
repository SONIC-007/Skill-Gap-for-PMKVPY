import mongoose from "mongoose";

const CourseEnrollmentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingCourse",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["ENROLLED", "IN_PROGRESS", "COMPLETED"],
            default: "ENROLLED",
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        enrolledAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
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

CourseEnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

CourseEnrollmentSchema.virtual("course", {
    ref: "TrainingCourse",
    localField: "courseId",
    foreignField: "_id",
    justOne: true,
});

export default mongoose.models.CourseEnrollment || mongoose.model("CourseEnrollment", CourseEnrollmentSchema);
