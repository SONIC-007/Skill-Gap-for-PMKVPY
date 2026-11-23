import connectToDatabase, { isMongoConnected } from "@/lib/mongoose";
import User from "./User";
import CandidateProfile from "./CandidateProfile";
import Skill from "./Skill";
import JobRole from "./JobRole";
import JobSkillRequirement from "./JobSkillRequirement";
import CandidateSkill from "./CandidateSkill";
import TrainingCourse from "./TrainingCourse";
import CourseSkill from "./CourseSkill";
import CourseEnrollment from "./CourseEnrollment";
import Assessment from "./Assessment";
import AssessmentQuestion from "./AssessmentQuestion";
import AssessmentResponse from "./AssessmentResponse";
import LearningProgress from "./LearningProgress";

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
