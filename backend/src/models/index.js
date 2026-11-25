import connectToDatabase, { isMongoConnected } from "../config/db.js";
import User from "./User.js";
import CandidateProfile from "./CandidateProfile.js";
import Skill from "./Skill.js";
import JobRole from "./JobRole.js";
import JobSkillRequirement from "./JobSkillRequirement.js";
import CandidateSkill from "./CandidateSkill.js";
import TrainingCourse from "./TrainingCourse.js";
import CourseSkill from "./CourseSkill.js";
import CourseEnrollment from "./CourseEnrollment.js";
import Assessment from "./Assessment.js";
import AssessmentQuestion from "./AssessmentQuestion.js";
import AssessmentResponse from "./AssessmentResponse.js";
import LearningProgress from "./LearningProgress.js";

export {
    connectToDatabase,
    isMongoConnected,
    User,
    CandidateProfile,
    Skill,
    JobRole,
    JobSkillRequirement,
    CandidateSkill,
    TrainingCourse,
    CourseSkill,
    CourseEnrollment,
    Assessment,
    AssessmentQuestion,
    AssessmentResponse,
    LearningProgress,
};

export default {
    connectToDatabase,
    isMongoConnected,
    User,
    CandidateProfile,
    Skill,
    JobRole,
    JobSkillRequirement,
    CandidateSkill,
    TrainingCourse,
    CourseSkill,
    CourseEnrollment,
    Assessment,
    AssessmentQuestion,
    AssessmentResponse,
    LearningProgress,
};
