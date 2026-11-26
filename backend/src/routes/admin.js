// [BACKEND] Route: /api/admin/{stats,skills,job-roles,courses,candidates} | Used by: Frontend/src/app/admin/** | Requires: ADMIN role
import { Router } from "express";
import mongoose from "mongoose";
import { connectToDatabase } from "../config/db.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import CandidateProfile from "../models/CandidateProfile.js";
import Skill from "../models/Skill.js";
import JobRole from "../models/JobRole.js";
import JobSkillRequirement from "../models/JobSkillRequirement.js";
import CandidateSkill from "../models/CandidateSkill.js";
import TrainingCourse from "../models/TrainingCourse.js";
import CourseSkill from "../models/CourseSkill.js";
import CourseEnrollment from "../models/CourseEnrollment.js";
import Assessment from "../models/Assessment.js";
import AssessmentQuestion from "../models/AssessmentQuestion.js";

const router = Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
    try {
        await connectToDatabase();

        const [
            totalCandidates,
            totalSkills,
            totalJobRoles,
            totalCourses,
            totalAssessments,
            completedAssessments,
            recentCandidateDocs,
            domainGroups,
            popularGroups,
        ] = await Promise.all([
            User.countDocuments({ role: "CANDIDATE" }),
            Skill.countDocuments(),
            JobRole.countDocuments(),
            TrainingCourse.countDocuments(),
            Assessment.countDocuments(),
            Assessment.countDocuments({ status: "COMPLETED" }),
            User.find({ role: "CANDIDATE" })
                .sort({ createdAt: -1 })
                .limit(10)
                .select("_id name email createdAt")
                .lean(),
            Skill.aggregate([
                { $group: { _id: "$domain", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            CandidateSkill.aggregate([
                { $group: { _id: "$skillId", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 },
            ]),
        ]);

        const popularSkillIds = popularGroups.map((g) => g._id).filter(Boolean);
        const skillDetails = await Skill.find({ _id: { $in: popularSkillIds } }).lean();
        const skillNameMap = new Map(skillDetails.map((s) => [s._id.toString(), s.name]));

        const recentCandidates = recentCandidateDocs.map((c) => ({
            id: c._id.toString(),
            name: c.name,
            email: c.email,
            createdAt: c.createdAt,
        }));

        const skillsByDomain = domainGroups.map((g) => ({
            domain: g._id || "General",
            count: g.count,
            _count: { id: g.count },
        }));

        const popularSkills = popularGroups.map((g) => ({
            skillId: g._id?.toString(),
            skillName: skillNameMap.get(g._id?.toString()) || "Unknown",
            count: g.count,
            _count: { id: g.count },
        }));

        return res.json({
            stats: {
                totalCandidates,
                totalSkills,
                totalJobRoles,
                totalCourses,
                totalAssessments,
                completedAssessments,
            },
            recentCandidates,
            skillsByDomain,
            popularSkills,
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        return res.status(500).json({ error: "Failed to fetch admin telemetry" });
    }
});

// GET /api/admin/skills
router.get("/skills", async (req, res) => {
    try {
        await connectToDatabase();
        const [skillDocs, candCounts, jobReqCounts] = await Promise.all([
            Skill.find().sort({ domain: 1, name: 1 }).lean(),
            CandidateSkill.aggregate([{ $group: { _id: "$skillId", count: { $sum: 1 } } }]),
            JobSkillRequirement.aggregate([{ $group: { _id: "$skillId", count: { $sum: 1 } } }]),
        ]);

        const candMap = new Map(candCounts.map((c) => [c._id?.toString(), c.count]));
        const jobReqMap = new Map(jobReqCounts.map((j) => [j._id?.toString(), j.count]));

        const skills = skillDocs.map((s) => {
            const id = s._id.toString();
            return {
                id,
                name: s.name,
                category: s.category,
                domain: s.domain,
                description: s.description,
                createdAt: s.createdAt,
                _count: {
                    candidateSkills: candMap.get(id) || 0,
                    jobRequirements: jobReqMap.get(id) || 0,
                },
            };
        });

        return res.json({ skills });
    } catch (error) {
        console.error("Admin skills GET error:", error);
        return res.status(500).json({ error: "Failed to load skills" });
    }
});

router.post("/skills", async (req, res) => {
    try {
        await connectToDatabase();
        const { name, category, domain, description } = req.body || {};
        if (!name || !String(name).trim() || !domain || !String(domain).trim()) {
            return res.status(400).json({ error: "Name and domain are required" });
        }
        const normalizedCategory = String(category || "TECHNICAL").trim().toUpperCase();
        if (normalizedCategory !== "TECHNICAL" && normalizedCategory !== "SOFT") {
            return res.status(400).json({ error: "Category must be TECHNICAL or SOFT" });
        }
        const created = await Skill.create({
            name: String(name).trim(),
            category: normalizedCategory,
            domain: String(domain).trim(),
            description: description ? String(description).trim() : null,
        });
        return res.status(201).json({
            skill: {
                id: created._id.toString(),
                name: created.name,
                category: created.category,
                domain: created.domain,
                description: created.description,
            },
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ error: "A skill with this name already exists" });
        }
        console.error("Admin skills POST error:", error);
        return res.status(500).json({ error: "Failed to create skill" });
    }
});

router.put("/skills", async (req, res) => {
    try {
        await connectToDatabase();
        const { id, name, category, domain, description } = req.body || {};
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Valid skill ID required" });
        }

        const updatePayload = {};
        if (name !== undefined && String(name).trim()) updatePayload.name = String(name).trim();
        if (domain !== undefined && String(domain).trim()) updatePayload.domain = String(domain).trim();
        if (category !== undefined) {
            const normalizedCategory = String(category).trim().toUpperCase();
            if (normalizedCategory !== "TECHNICAL" && normalizedCategory !== "SOFT") {
                return res.status(400).json({ error: "Category must be TECHNICAL or SOFT" });
            }
            updatePayload.category = normalizedCategory;
        }
        if (description !== undefined) {
            updatePayload.description = description ? String(description).trim() : null;
        }

        const updated = await Skill.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
        if (!updated) {
            return res.status(404).json({ error: "Skill not found" });
        }
        return res.json({ skill: { ...updated, id: updated._id.toString() } });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ error: "A skill with this name already exists" });
        }
        console.error("Admin skills PUT error:", error);
        return res.status(500).json({ error: "Failed to update skill" });
    }
});

router.delete("/skills", async (req, res) => {
    try {
        await connectToDatabase();
        const id = req.query.id ? String(req.query.id) : "";
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Valid skill ID required" });
        }
        const deleted = await Skill.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Skill not found" });
        }
        await Promise.all([
            CandidateSkill.deleteMany({ skillId: id }),
            JobSkillRequirement.deleteMany({ skillId: id }),
            CourseSkill.deleteMany({ skillId: id }),
            AssessmentQuestion.deleteMany({ skillId: id }),
        ]);
        return res.json({ message: "Skill deleted" });
    } catch (error) {
        console.error("Admin skills DELETE error:", error);
        return res.status(500).json({ error: "Failed to delete skill" });
    }
});

// /api/admin/job-roles
router.get("/job-roles", async (req, res) => {
    try {
        await connectToDatabase();
        const [roleDocs, assessmentCounts] = await Promise.all([
            JobRole.find()
                .populate({
                    path: "skillRequirements",
                    populate: { path: "skill" },
                })
                .sort({ domain: 1, title: 1 })
                .lean(),
            Assessment.aggregate([{ $group: { _id: "$jobRoleId", count: { $sum: 1 } } }]),
        ]);

        const countMap = new Map(assessmentCounts.map((a) => [a._id?.toString(), a.count]));

        const jobRoles = roleDocs.map((jr) => {
            const id = jr._id.toString();
            return {
                id,
                title: jr.title,
                domain: jr.domain,
                description: jr.description,
                minExperience: jr.minExperience,
                avgSalary: jr.avgSalary,
                demandLevel: jr.demandLevel,
                skillRequirements: (jr.skillRequirements || []).map((sr) => ({
                    id: sr._id?.toString(),
                    skillId: sr.skillId?.toString(),
                    requiredProficiency: sr.requiredProficiency,
                    importance: sr.importance,
                    skill: sr.skill
                        ? {
                              id: sr.skill._id?.toString(),
                              name: sr.skill.name,
                              category: sr.skill.category,
                          }
                        : null,
                })),
                _count: { assessments: countMap.get(id) || 0 },
            };
        });

        return res.json({ jobRoles });
    } catch (error) {
        console.error("Admin job-roles GET error:", error);
        return res.status(500).json({ error: "Failed to fetch job roles" });
    }
});

router.post("/job-roles", async (req, res) => {
    try {
        await connectToDatabase();
        const { title, domain, description, minExperience, avgSalary, demandLevel } = req.body || {};
        if (!title || !String(title).trim() || !domain || !String(domain).trim()) {
            return res.status(400).json({ error: "Title and domain are required" });
        }
        const VALID_DEMAND = ["High", "Medium", "Low", "Critical", "HIGH", "MEDIUM", "LOW", "VERY HIGH"];
        const resolvedDemand = VALID_DEMAND.includes(demandLevel) ? demandLevel : "High";

        const created = await JobRole.create({
            title: String(title).trim(),
            domain: String(domain).trim(),
            description: description ? String(description).trim() : null,
            minExperience: minExperience ? String(minExperience).trim() : "0-2 Years",
            avgSalary: avgSalary ? String(avgSalary).trim() : "₹4.5 - 8.0 LPA",
            demandLevel: resolvedDemand,
        });
        return res.status(201).json({
            jobRole: {
                id: created._id.toString(),
                title: created.title,
                domain: created.domain,
                description: created.description,
                minExperience: created.minExperience,
                avgSalary: created.avgSalary,
                demandLevel: created.demandLevel,
            },
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ error: "A job role with this title already exists" });
        }
        console.error("Admin job-roles POST error:", error);
        return res.status(500).json({ error: "Failed to create job role" });
    }
});

router.delete("/job-roles", async (req, res) => {
    try {
        await connectToDatabase();
        const id = req.query.id ? String(req.query.id) : "";
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Valid job role ID required" });
        }
        const deleted = await JobRole.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Job role not found" });
        }
        await Promise.all([
            JobSkillRequirement.deleteMany({ jobRoleId: id }),
            Assessment.deleteMany({ jobRoleId: id }),
        ]);
        return res.json({ message: "Job role deleted" });
    } catch (error) {
        console.error("Admin job-roles DELETE error:", error);
        return res.status(500).json({ error: "Failed to delete job role" });
    }
});

// /api/admin/courses
router.get("/courses", async (req, res) => {
    try {
        await connectToDatabase();
        const [courseDocs, enrollmentCounts] = await Promise.all([
            TrainingCourse.find()
                .populate({
                    path: "courseSkills",
                    populate: { path: "skill" },
                })
                .populate("jobRoleId")
                .sort({ name: 1 })
                .lean(),
            CourseEnrollment.aggregate([{ $group: { _id: "$courseId", count: { $sum: 1 } } }]),
        ]);

        const enrollMap = new Map(enrollmentCounts.map((e) => [e._id?.toString(), e.count]));

        const courses = courseDocs.map((c) => {
            const id = c._id.toString();
            return {
                id,
                name: c.name,
                description: c.description,
                provider: c.provider,
                difficulty: c.difficulty,
                duration: c.duration,
                eligibility: c.eligibility,
                category: c.category,
                imageUrl: c.imageUrl,
                isDemo: c.isDemo,
                jobRole: c.jobRoleId?.title
                    ? { id: c.jobRoleId._id?.toString(), title: c.jobRoleId.title }
                    : null,
                courseSkills: (c.courseSkills || []).map((cs) => ({
                    id: cs._id?.toString(),
                    skill: cs.skill
                        ? { id: cs.skill._id?.toString(), name: cs.skill.name }
                        : null,
                })),
                _count: { enrollments: enrollMap.get(id) || 0 },
            };
        });

        return res.json({ courses });
    } catch (error) {
        console.error("Admin courses GET error:", error);
        return res.status(500).json({ error: "Failed to fetch courses" });
    }
});

router.post("/courses", async (req, res) => {
    try {
        await connectToDatabase();
        const {
            name,
            description,
            provider,
            difficulty,
            duration,
            eligibility,
            category,
            jobRoleId,
        } = req.body || {};

        if (!name || !String(name).trim()) {
            return res.status(400).json({ error: "Course name is required" });
        }
        const normalizedDifficulty = String(difficulty || "BEGINNER").trim().toUpperCase();
        const VALID_DIFF = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
        if (!VALID_DIFF.includes(normalizedDifficulty)) {
            return res.status(400).json({ error: "Invalid difficulty level" });
        }

        const created = await TrainingCourse.create({
            name: String(name).trim(),
            description: description ? String(description).trim() : null,
            provider: provider ? String(provider).trim() : "NSDC / PMKVY Partner",
            difficulty: normalizedDifficulty,
            duration: duration ? String(duration).trim() : "8 Weeks",
            eligibility: eligibility ? String(eligibility).trim() : "10+2 / ITI / Diploma",
            category: category ? String(category).trim() : "Web Development",
            jobRoleId:
                jobRoleId && mongoose.Types.ObjectId.isValid(jobRoleId) ? jobRoleId : null,
            isDemo: true,
        });

        return res.status(201).json({
            course: { ...created.toObject(), id: created._id.toString() },
        });
    } catch (error) {
        console.error("Admin courses POST error:", error);
        return res.status(500).json({ error: "Failed to create course" });
    }
});

router.delete("/courses", async (req, res) => {
    try {
        await connectToDatabase();
        const id = req.query.id ? String(req.query.id) : "";
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Valid course ID required" });
        }
        const deleted = await TrainingCourse.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Course not found" });
        }
        await Promise.all([
            CourseSkill.deleteMany({ courseId: id }),
            CourseEnrollment.deleteMany({ courseId: id }),
        ]);
        return res.json({ message: "Course deleted" });
    } catch (error) {
        console.error("Admin courses DELETE error:", error);
        return res.status(500).json({ error: "Failed to delete course" });
    }
});

// GET /api/admin/candidates
router.get("/candidates", async (req, res) => {
    try {
        await connectToDatabase();
        const users = await User.find({ role: "CANDIDATE" })
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        const userIds = users.map((u) => u._id);

        const [profiles, assessments, enrollments, skillCounts] = await Promise.all([
            CandidateProfile.find({ userId: { $in: userIds } }).lean(),
            Assessment.find({ userId: { $in: userIds } })
                .populate("jobRole")
                .sort({ createdAt: -1 })
                .lean(),
            CourseEnrollment.find({ userId: { $in: userIds } }).populate("course").lean(),
            CandidateSkill.aggregate([
                { $match: { userId: { $in: userIds } } },
                { $group: { _id: "$userId", count: { $sum: 1 } } },
            ]),
        ]);

        const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));
        const skillCountMap = new Map(skillCounts.map((s) => [s._id.toString(), s.count]));

        const assessmentsByUser = new Map();
        for (const a of assessments) {
            const uid = a.userId.toString();
            if (!assessmentsByUser.has(uid)) assessmentsByUser.set(uid, []);
            assessmentsByUser.get(uid).push({
                id: a._id.toString(),
                score: a.score,
                skillGap: a.skillGap,
                status: a.status,
                completedAt: a.completedAt,
                jobRole: a.jobRole
                    ? { id: a.jobRole._id.toString(), title: a.jobRole.title }
                    : null,
            });
        }

        const enrollmentsByUser = new Map();
        for (const e of enrollments) {
            const uid = e.userId.toString();
            if (!enrollmentsByUser.has(uid)) enrollmentsByUser.set(uid, []);
            enrollmentsByUser.get(uid).push({
                id: e._id.toString(),
                status: e.status,
                progress: e.progress,
                course: e.course
                    ? { id: e.course._id.toString(), name: e.course.name }
                    : null,
            });
        }

        const candidates = users.map((u) => {
            const uid = u._id.toString();
            return {
                id: uid,
                name: u.name,
                email: u.email,
                role: u.role,
                createdAt: u.createdAt,
                profile: profileMap.get(uid) || null,
                assessments: assessmentsByUser.get(uid) || [],
                enrollments: enrollmentsByUser.get(uid) || [],
                _count: { candidateSkills: skillCountMap.get(uid) || 0 },
            };
        });

        return res.json({ candidates });
    } catch (error) {
        console.error("Admin candidates GET error:", error);
        return res.status(500).json({ error: "Failed to load candidates" });
    }
});

export default router;
