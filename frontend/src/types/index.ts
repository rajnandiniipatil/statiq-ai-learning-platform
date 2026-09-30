export type RoleType = 'ROLE_LEARNER' | 'ROLE_TRAINER' | 'ROLE_ADMIN';

export interface User {
  id: number;
  email: string;
  fullName: string;
  roles: RoleType[];
  profileId?: number;
  employeeId?: string;
  designation?: string;
  jobRole?: string;
  departmentName?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  profileId?: number;
  employeeId?: string;
  designation?: string;
  jobRole?: string;
  departmentName?: string;
}

export interface UserProfile {
  userId: number;
  email: string;
  fullName: string;
  roles: string[];
  profileId?: number;
  employeeId?: string;
  departmentId?: number;
  departmentName?: string;
  departmentCode?: string;
  designation?: string;
  jobRole?: string;
  educationalQualification?: string;
  yearsOfExperience?: number;
  currentAssignment?: string;
  previousTraining?: string;
  careerInterests?: string;
}

export interface Competency {
  id: number;
  code: string;
  name: string;
  category: 'STATISTICAL' | 'TECHNICAL' | 'DIGITAL_GOVERNANCE' | 'MANAGERIAL';
  categoryLabel: string;
  description: string;
}

export interface LearnerCompetency {
  id: number;
  competencyId: number;
  competencyCode: string;
  competencyName: string;
  category: 'STATISTICAL' | 'TECHNICAL' | 'DIGITAL_GOVERNANCE' | 'MANAGERIAL';
  score: number;
  confidenceLevel: string;
  lastAssessedAt: string;
}

export type GapClassification = 'STRONG' | 'MODERATE_GAP' | 'SIGNIFICANT_GAP' | 'CRITICAL_GAP';

export interface SkillGap {
  competencyId: number;
  competencyCode: string;
  competencyName: string;
  category: 'STATISTICAL' | 'TECHNICAL' | 'DIGITAL_GOVERNANCE' | 'MANAGERIAL';
  categoryLabel: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  classification: GapClassification;
  classificationLabel: string;
  explanation: string;
  recommendedAction: string;
  importanceWeight: number;
}

export interface SkillGapSummary {
  jobRole: string;
  averageCompetencyScore: number;
  averageRequiredScore: number;
  overallGap: number;
  criticalGapCount: number;
  significantGapCount: number;
  moderateGapCount: number;
  strongCount: number;
  gaps: SkillGap[];
}

export interface IGotCourse {
  id: number;
  courseCode: string;
  title: string;
  description: string;
  provider: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationHours: number;
  category: string;
  language: string;
  externalUrl?: string;
  isIgotCourse: boolean;
  competencyCodes?: string[];
  competencyNames?: string[];
  enrollmentStatus?: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent?: number;
}

export interface Enrollment {
  id: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  courseDescription: string;
  provider: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationHours: number;
  category: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface Recommendation {
  id: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  courseDescription: string;
  provider: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationHours: number;
  competencyId: number;
  competencyCode: string;
  competencyName: string;
  reason: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  expectedOutcome: string;
  isEnrolled: boolean;
  currentProgress: number;
  createdAt: string;
}

export interface LearningPathItem {
  id: number;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  courseDescription: string;
  provider: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationHours: number;
  sequenceOrder: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  targetRole: string;
  totalEstimatedHours: number;
  completedHours: number;
  overallProgressPercent: number;
  items: LearningPathItem[];
  createdAt: string;
}

export interface LearningProgressSummary {
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  inProgressCoursesCount: number;
  totalLearningHoursCompleted: number;
  overallCompletionRate: number;
  enrollments: Enrollment[];
}

export interface UploadedMaterial {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  characterCount?: number;
  previewText?: string;
  uploaderName: string;
  uploadedAt: string;
}

export interface Question {
  id?: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'MIXED';
  topic: string;
  sourceReference?: string;
  sequenceOrder?: number;
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  creatorId?: number;
  creatorName?: string;
  sourceMaterialId?: number;
  sourceMaterialName?: string;
  targetCompetencyId?: number;
  targetCompetencyName?: string;
  targetCompetencyCode?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  passingScore: number;
  timeLimitMinutes: number;
  published: boolean;
  questionCount: number;
  questions?: Question[];
  createdAt: string;
  hasAttempted?: boolean;
  latestScore?: number;
}

export interface QuestionEvaluation {
  questionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  topic: string;
}

export interface QuizResult {
  attemptId: number;
  assessmentId: number;
  assessmentTitle: string;
  targetCompetencyName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  aiFeedback: string;
  strengths: string;
  weaknesses: string;
  recommendedRevision?: string;
  competencyScoreBefore?: number;
  competencyScoreAfter?: number;
  competencyScoreDelta?: number;
  questionResults: QuestionEvaluation[];
  attemptedAt: string;
}

export interface AdminDashboardData {
  totalEmployees: number;
  activeLearners: number;
  averageCompetencyScore: number;
  trainingCompletionRate: number;
  criticalGapsCount: number;
  significantGapsCount: number;
  departmentAnalytics: DepartmentAnalytics[];
  topSkillGaps: CompetencyAnalytics[];
  emergingSkills: CompetencyAnalytics[];
  trainingAnalytics: TrainingAnalytics;
  gapDistribution: Record<string, number>;
}

export interface DepartmentAnalytics {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  employeeCount: number;
  averageCompetencyScore: number;
  criticalGapsCount: number;
  trainingCompletionRate: number;
}

export interface CompetencyAnalytics {
  competencyId: number;
  competencyCode: string;
  competencyName: string;
  category: string;
  averageScore: number;
  benchmarkScore: number;
  averageGap: number;
  affectedEmployeesCount: number;
  demandLevel: string;
}

export interface TrainingAnalytics {
  totalEnrollments: number;
  completedEnrollments: number;
  activeEnrollments: number;
  overallCompletionRate: number;
  mostPopularCourses: {
    courseId: number;
    courseCode: string;
    courseTitle: string;
    provider: string;
    enrollmentCount: number;
    averageProgress: number;
  }[];
}
