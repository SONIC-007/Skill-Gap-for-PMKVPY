export interface SkillGapResult {
  skillId: string;
  skillName: string;
  category: string;
  requiredProficiency: number;
  candidateProficiency: number;
  gap: number;
  status: "met" | "improvement" | "missing";
}

export interface OverallSkillGap {
  overallGap: number;
  totalSkills: number;
  metSkills: number;
  improvementSkills: number;
  missingSkills: number;
  skills: SkillGapResult[];
}

export interface CourseRecommendation {
  id: string;
  name: string;
  description: string | null;
  provider: string | null;
  difficulty: string;
  duration: string | null;
  category: string | null;
  relevanceScore: number;
  skillsCovered: string[];
  isDemo: boolean;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  domain: string;
  description: string | null;
  readinessPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  avgSalary: string | null;
  demandLevel: string | null;
}

export interface DashboardStats {
  totalSkillsAssessed: number;
  averageProficiency: number;
  overallSkillGap: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  recommendedCourses: number;
  suggestedRoles: number;
}

export interface LearningProgressEntry {
  date: string;
  proficiency: number;
  skillName: string;
}
