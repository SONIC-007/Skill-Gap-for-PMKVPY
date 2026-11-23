import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Skill name is required"],
            unique: true,
            trim: true,
            index: true,
        },
        category: {
            type: String,
            enum: ["TECHNICAL", "SOFT"],
            default: "TECHNICAL",
            index: true,
        },
        domain: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
