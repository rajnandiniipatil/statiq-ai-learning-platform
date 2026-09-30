import axios from 'axios';
import {
  AuthResponse,
  UserProfile,
  Competency,
  LearnerCompetency,
  SkillGap,
  SkillGapSummary,
  IGotCourse,
  Recommendation,
  LearningPath,
  LearningProgressSummary,
  UploadedMaterial,
  Assessment,
  Question,
  QuizResult,
  AdminDashboardData,
  DepartmentAnalytics,
  CompetencyAnalytics,
  TrainingAnalytics
} from '../types';

import {
  MOCK_USER_LEARNER,
  MOCK_USER_TRAINER,
  MOCK_USER_ADMIN,
  MOCK_COMPETENCIES,
  MOCK_LEARNER_COMPETENCIES,
  MOCK_SKILL_GAPS,
  MOCK_SKILL_GAP_SUMMARY,
  MOCK_IGOT_COURSES,
  MOCK_RECOMMENDATIONS,
  MOCK_LEARNING_PATH,
  MOCK_ASSESSMENTS,
  MOCK_ADMIN_DASHBOARD
} from './mockData';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Interceptor to add JWT Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('statiq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('statiq_token');
        localStorage.removeItem('statiq_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// In-memory demo state for resilient offline/Vercel demonstration
let activeUser: UserProfile = MOCK_USER_LEARNER;
let activeAssessments = [...MOCK_ASSESSMENTS];
let activeCompetencies = [...MOCK_LEARNER_COMPETENCIES];
let activeRecommendations = [...MOCK_RECOMMENDATIONS];
let activeMaterials: UploadedMaterial[] = [
  {
    id: 1,
    fileName: 'NSS_78th_Round_Survey_Design_Manual.pdf',
    fileType: 'PDF',
    fileSize: 2457600,
    status: 'PROCESSED',
    characterCount: 142000,
    previewText: 'National Sample Survey Office (NSSO) 78th Round Manual on Multiple Indicator Survey. Concepts of Stratification, Allocation of Sample Units across States and Sectors, and Listing Methodology.',
    uploaderName: 'Dr. Rameshwar Sharma',
    uploadedAt: '2026-09-25T10:00:00Z'
  },
  {
    id: 2,
    fileName: 'National_Accounts_Statistics_SNA_2008_Guide.docx',
    fileType: 'DOCX',
    fileSize: 1146880,
    status: 'PROCESSED',
    characterCount: 88500,
    previewText: 'Sources and Methods for Indian National Accounts Statistics (2024 Base). Compiling Gross Value Added by Economic Activity, Financial Intermediation, and Capital Stock.',
    uploaderName: 'Dr. Rameshwar Sharma',
    uploadedAt: '2026-09-26T14:30:00Z'
  }
];

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    try {
      const res = await api.post('/auth/login', credentials);
      return res.data.data as AuthResponse;
    } catch (err) {
      console.warn('Backend offline or unreachable, using instant demo authentication fallback.');
      let targetUser = MOCK_USER_LEARNER;
      if (credentials.email.includes('trainer')) targetUser = MOCK_USER_TRAINER;
      if (credentials.email.includes('admin')) targetUser = MOCK_USER_ADMIN;
      activeUser = targetUser;

      return {
        token: `demo-token-${Date.now()}`,
        type: 'Bearer',
        id: targetUser.userId,
        email: targetUser.email,
        fullName: targetUser.fullName,
        roles: targetUser.roles,
        profileId: targetUser.profileId,
        employeeId: targetUser.employeeId,
        designation: targetUser.designation,
        jobRole: targetUser.jobRole,
        departmentName: targetUser.departmentName,
      };
    }
  },
  register: async (data: any): Promise<AuthResponse> => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data.data as AuthResponse;
    } catch (err) {
      console.warn('Backend unreachable, creating local registered session.');
      const roleStr = data.role === 'ADMIN' ? 'ROLE_ADMIN' : data.role === 'TRAINER' ? 'ROLE_TRAINER' : 'ROLE_LEARNER';
      const newUser: UserProfile = {
        userId: Math.floor(Math.random() * 1000) + 10,
        email: data.email,
        fullName: data.fullName,
        roles: [roleStr],
        profileId: 10,
        employeeId: data.employeeId || 'STAT-DEMO-01',
        designation: data.designation || 'Statistical Investigator',
        jobRole: data.jobRole || 'Statistical Investigator',
        departmentName: 'MoSPI National Cadre',
        educationalQualification: data.educationalQualification,
        yearsOfExperience: data.yearsOfExperience,
        currentAssignment: data.currentAssignment,
        careerInterests: data.careerInterests
      };
      activeUser = newUser;

      return {
        token: `demo-token-${Date.now()}`,
        type: 'Bearer',
        id: newUser.userId,
        email: newUser.email,
        fullName: newUser.fullName,
        roles: newUser.roles,
        profileId: newUser.profileId,
        employeeId: newUser.employeeId,
        designation: newUser.designation,
        jobRole: newUser.jobRole,
        departmentName: newUser.departmentName,
      };
    }
  },
  getCurrentUser: async (): Promise<UserProfile> => {
    try {
      const res = await api.get('/auth/me');
      return res.data.data as UserProfile;
    } catch (err) {
      return activeUser;
    }
  },
};

export const competencyApi = {
  getAllCompetencies: async (): Promise<Competency[]> => {
    try {
      const res = await api.get('/competencies');
      return res.data.data as Competency[];
    } catch (err) {
      return MOCK_COMPETENCIES;
    }
  },
  getMyCompetencies: async (): Promise<LearnerCompetency[]> => {
    try {
      const res = await api.get('/competencies/me');
      return res.data.data as LearnerCompetency[];
    } catch (err) {
      return activeCompetencies;
    }
  },
  getMySkillGaps: async (): Promise<SkillGap[]> => {
    try {
      const res = await api.get('/competencies/gaps');
      return res.data.data as SkillGap[];
    } catch (err) {
      return MOCK_SKILL_GAPS;
    }
  },
  getSkillGapSummary: async (): Promise<SkillGapSummary> => {
    try {
      const res = await api.get('/competencies/summary');
      return res.data.data as SkillGapSummary;
    } catch (err) {
      return MOCK_SKILL_GAP_SUMMARY;
    }
  },
  submitAssessment: async (data: { competencyId: number; score: number; assessmentType?: string }): Promise<LearnerCompetency> => {
    try {
      const res = await api.post('/competencies/assessment', data);
      return res.data.data as LearnerCompetency;
    } catch (err) {
      // Local self-assessment update
      const existingIdx = activeCompetencies.findIndex(c => c.competencyId === data.competencyId);
      if (existingIdx >= 0) {
        activeCompetencies[existingIdx].score = data.score;
        activeCompetencies[existingIdx].lastAssessedAt = new Date().toISOString();
        return activeCompetencies[existingIdx];
      }
      const newComp: LearnerCompetency = {
        id: Date.now(),
        competencyId: data.competencyId,
        competencyCode: 'STAT-CUSTOM',
        competencyName: 'Assessed Competency',
        category: 'STATISTICAL',
        score: data.score,
        confidenceLevel: data.score >= 70 ? 'HIGH' : 'MEDIUM',
        lastAssessedAt: new Date().toISOString()
      };
      activeCompetencies.push(newComp);
      return newComp;
    }
  },
};

export const recommendationApi = {
  getRecommendations: async (): Promise<Recommendation[]> => {
    try {
      const res = await api.get('/recommendations');
      return res.data.data as Recommendation[];
    } catch (err) {
      return activeRecommendations;
    }
  },
  generateRecommendations: async (): Promise<Recommendation[]> => {
    try {
      const res = await api.post('/recommendations/generate');
      return res.data.data as Recommendation[];
    } catch (err) {
      return MOCK_RECOMMENDATIONS;
    }
  },
};

export const igotApi = {
  getCourses: async (): Promise<IGotCourse[]> => {
    try {
      const res = await api.get('/igot/courses');
      return res.data.data as IGotCourse[];
    } catch (err) {
      return MOCK_IGOT_COURSES;
    }
  },
  getCourseById: async (id: number): Promise<IGotCourse> => {
    try {
      const res = await api.get(`/igot/courses/${id}`);
      return res.data.data as IGotCourse;
    } catch (err) {
      return MOCK_IGOT_COURSES.find(c => c.id === id) || MOCK_IGOT_COURSES[0];
    }
  },
  searchCourses: async (query: string): Promise<IGotCourse[]> => {
    try {
      const res = await api.get(`/igot/search?q=${encodeURIComponent(query)}`);
      return res.data.data as IGotCourse[];
    } catch (err) {
      return MOCK_IGOT_COURSES.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
  enroll: async (courseId: number): Promise<any> => {
    try {
      const res = await api.post('/igot/enroll', { courseId });
      return res.data;
    } catch (err) {
      const found = MOCK_IGOT_COURSES.find(c => c.id === courseId);
      if (found) {
        found.enrollmentStatus = 'ENROLLED';
        found.progressPercent = 0;
      }
      return { success: true, message: 'Enrolled successfully in iGOT Sandbox' };
    }
  },
  getProgress: async (): Promise<LearningProgressSummary> => {
    try {
      const res = await api.get('/igot/progress');
      return res.data.data as LearningProgressSummary;
    } catch (err) {
      return {
        enrolledCoursesCount: 2,
        completedCoursesCount: 1,
        inProgressCoursesCount: 1,
        totalLearningHoursCompleted: 38,
        overallCompletionRate: 34,
        enrollments: [
          {
            id: 1,
            courseId: 1,
            courseCode: 'iGOT-AI-201',
            courseTitle: 'Applied Machine Learning for National Statistics',
            courseDescription: 'Learn modern machine learning techniques applied to official statistical operations.',
            provider: 'NSSTA',
            difficulty: 'INTERMEDIATE',
            durationHours: 24,
            category: 'Technical',
            status: 'IN_PROGRESS',
            progressPercent: 35,
            enrolledAt: '2026-09-20T10:00:00Z'
          }
        ]
      };
    }
  },
};

export const learningPathApi = {
  getLearningPath: async (): Promise<LearningPath> => {
    try {
      const res = await api.get('/learning-path');
      return res.data.data as LearningPath;
    } catch (err) {
      return MOCK_LEARNING_PATH;
    }
  },
  generateLearningPath: async (): Promise<LearningPath> => {
    try {
      const res = await api.post('/learning-path/generate');
      return res.data.data as LearningPath;
    } catch (err) {
      return MOCK_LEARNING_PATH;
    }
  },
  getProgress: async (): Promise<LearningProgressSummary> => {
    return igotApi.getProgress();
  },
};

export const materialApi = {
  uploadMaterial: async (file: File): Promise<UploadedMaterial> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/materials/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data as UploadedMaterial;
    } catch (err) {
      const newMat: UploadedMaterial = {
        id: activeMaterials.length + 1,
        fileName: file.name,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'PDF',
        fileSize: file.size,
        status: 'PROCESSED',
        characterCount: Math.round(file.size * 0.8),
        previewText: `Extracted text from official statistical manual: ${file.name}. Validated for automatic MCQ generation according to Bloom's taxonomy.`,
        uploaderName: activeUser.fullName,
        uploadedAt: new Date().toISOString()
      };
      activeMaterials.unshift(newMat);
      return newMat;
    }
  },
  getAllMaterials: async (): Promise<UploadedMaterial[]> => {
    try {
      const res = await api.get('/materials');
      return res.data.data as UploadedMaterial[];
    } catch (err) {
      return activeMaterials;
    }
  },
};

export const assessmentApi = {
  getAllAssessments: async (): Promise<Assessment[]> => {
    try {
      const res = await api.get('/assessments');
      return res.data.data as Assessment[];
    } catch (err) {
      return activeAssessments;
    }
  },
  getAssessmentById: async (id: number): Promise<Assessment> => {
    try {
      const res = await api.get(`/assessments/${id}`);
      return res.data.data as Assessment;
    } catch (err) {
      const found = activeAssessments.find(a => a.id === id);
      return found || activeAssessments[0];
    }
  },
  createAssessment: async (data: any): Promise<Assessment> => {
    try {
      const res = await api.post('/assessments', data);
      return res.data.data as Assessment;
    } catch (err) {
      const newAssmt: Assessment = {
        id: activeAssessments.length + 1,
        title: data.title,
        description: data.description,
        targetCompetencyId: data.targetCompetencyId || 6,
        targetCompetencyName: 'AI & Machine Learning for Official Statistics',
        targetCompetencyCode: 'TECH-AIM',
        difficulty: data.difficulty || 'INTERMEDIATE',
        passingScore: 60,
        timeLimitMinutes: data.timeLimitMinutes || 15,
        published: true,
        questionCount: data.questions?.length || 5,
        questions: data.questions,
        createdAt: new Date().toISOString()
      };
      activeAssessments.unshift(newAssmt);
      return newAssmt;
    }
  },
  submitAttempt: async (id: number, submission: { answers: { questionId: number; selectedAnswer: string }[]; timeSpentSeconds?: number }): Promise<QuizResult> => {
    try {
      const res = await api.post(`/assessments/${id}/attempt`, submission);
      return res.data.data as QuizResult;
    } catch (err) {
      // CONTINUOUS FEEDBACK LOOP: Compute evaluation and apply Bayesian score update
      const assmt = activeAssessments.find(a => a.id === id) || activeAssessments[0];
      const questions = assmt.questions || [];
      const totalQ = questions.length || 4;

      let correctCount = 0;
      const questionResults = questions.map((q) => {
        const userAns = submission.answers.find(a => a.questionId === q.id)?.selectedAnswer || 'A';
        const isCorrect = userAns === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id!,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          selectedAnswer: userAns,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
          topic: q.topic
        };
      });

      const accuracy = Math.round((correctCount / totalQ) * 100);
      const score = accuracy;

      // Apply Bayesian smoothing: S_new = round(0.65 * S_old + 0.35 * ExamAccuracy)
      const targetComp = activeCompetencies.find(c => c.competencyId === assmt.targetCompetencyId) || activeCompetencies[5];
      const scoreBefore = targetComp.score;
      const scoreAfter = Math.round((scoreBefore * 0.65) + (accuracy * 0.35));
      const delta = scoreAfter - scoreBefore;
      targetComp.score = scoreAfter;
      targetComp.lastAssessedAt = new Date().toISOString();

      return {
        attemptId: Date.now(),
        assessmentId: assmt.id,
        assessmentTitle: assmt.title,
        targetCompetencyName: assmt.targetCompetencyName || 'AI & Machine Learning for Official Statistics',
        score,
        totalQuestions: totalQ,
        correctAnswers: correctCount,
        accuracyPercent: accuracy,
        timeSpentSeconds: submission.timeSpentSeconds || 240,
        aiFeedback: `Demonstrated strong conceptual grasp of core statistical methodologies. Diagnostic accuracy: ${accuracy}%. Bayesian competency score adjusted from ${scoreBefore} to ${scoreAfter} (${delta >= 0 ? '+' : ''}${delta} pts).`,
        strengths: 'Solid comprehension of objective classification metrics, multistage frame stratification, and design weights.',
        weaknesses: accuracy < 80 ? 'Review multivariate anomaly detection algorithms and ratio estimation variance formulas.' : 'No major conceptual blind spots detected.',
        recommendedRevision: 'Module 3: Advanced Sampling & Survey Weighting in Official Statistics.',
        competencyScoreBefore: scoreBefore,
        competencyScoreAfter: scoreAfter,
        competencyScoreDelta: delta,
        questionResults,
        attemptedAt: new Date().toISOString()
      };
    }
  },
  getResults: async (id: number): Promise<QuizResult> => {
    try {
      const res = await api.get(`/assessments/${id}/results`);
      return res.data.data as QuizResult;
    } catch (err) {
      return {
        attemptId: 101,
        assessmentId: id,
        assessmentTitle: 'Diagnostic Assessment: AI & Machine Learning in Official Statistics',
        targetCompetencyName: 'AI & Machine Learning for Official Statistics',
        score: 75,
        totalQuestions: 4,
        correctAnswers: 3,
        accuracyPercent: 75,
        timeSpentSeconds: 310,
        aiFeedback: 'Official competency assessment completed. Demonstrates practical competence in classification architectures.',
        strengths: 'Natural Language Processing and Classification loss functions.',
        weaknesses: 'High dimensional anomaly detection in complex survey frames.',
        competencyScoreBefore: 35,
        competencyScoreAfter: 51,
        competencyScoreDelta: 16,
        questionResults: [],
        attemptedAt: new Date().toISOString()
      };
    }
  },
};

export const aiApi = {
  generateMcqs: async (params: { materialId?: number; topic?: string; difficulty?: string; count?: number }): Promise<Question[]> => {
    try {
      const res = await api.post('/ai/generate-mcq', params);
      return res.data.data as Question[];
    } catch (err) {
      const count = params.count || 5;
      const topicName = params.topic || 'Official Statistical Survey Design';
      const samplePool: Question[] = [
        {
          questionText: `In complex multistage survey designs across ${topicName}, how does the intra-cluster correlation coefficient influence effective sample size?`,
          optionA: 'Increases the required sample size due to higher design variance within primary sampling units',
          optionB: 'Reduces the required sample size by eliminating between-cluster variance',
          optionC: 'Has no impact on standard errors',
          optionD: 'Converts cluster sampling into simple random sampling',
          correctAnswer: 'A',
          explanation: 'When units within a cluster are homogeneous (positive intra-cluster correlation), clustering provides less unique information per respondent, raising the design effect and requiring a larger sample.',
          difficulty: 'INTERMEDIATE',
          topic: topicName
        },
        {
          questionText: `When compiling quarterly GDP estimates using Gross Value Added (GVA) at basic prices, how are net product taxes treated?`,
          optionA: 'GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies',
          optionB: 'GDP at market prices = GVA at factor cost - Corporate Income Tax',
          optionC: 'GDP at basic prices includes all indirect excise levies',
          optionD: 'Product subsidies are added directly to GVA at basic prices',
          correctAnswer: 'A',
          explanation: 'Under SNA 2008 and India\'s National Accounts 2011-12 base methodology, GDP at market prices is derived from GVA at basic prices by adding product taxes and subtracting product subsidies.',
          difficulty: 'ADVANCED',
          topic: 'National Accounts Compilation'
        },
        {
          questionText: 'What is the primary formula for the Paasche Price Index relative to the Laspeyres Price Index in price statistics?',
          optionA: 'Paasche uses current-period quantity basket weights while Laspeyres uses base-period quantity weights',
          optionB: 'Paasche holds base year prices constant while Laspeyres floats prices',
          optionC: 'Paasche is the arithmetic mean of Laspeyres and Fisher indices',
          optionD: 'Paasche is only applicable to export-import terms of trade',
          correctAnswer: 'A',
          explanation: 'The Paasche index weights price relatives with current-period consumption quantities Q_t, whereas the Laspeyres index holds baseline weights Q_0 constant.',
          difficulty: 'INTERMEDIATE',
          topic: 'Price Statistics'
        },
        {
          questionText: 'In the Periodic Labour Force Survey (PLFS), how is the Current Weekly Status (CWS) of employment classified for an individual?',
          optionA: 'Worked for at least 1 hour on any day during the 7-day survey reference period',
          optionB: 'Worked continuously for at least 30 days in the preceding 3 months',
          optionC: 'Had an active employment contract on the date of interview',
          optionD: 'Was enrolled in government employment guarantee programs',
          correctAnswer: 'A',
          explanation: 'Under NSSO guidelines, the 1-hour priority criterion is used for Current Weekly Status to capture short-term and intermittent economic activity.',
          difficulty: 'BEGINNER',
          topic: 'Labour Statistics'
        },
        {
          questionText: 'Which statistical method is recommended by MoSPI for anonymizing individual survey records prior to public microdata release?',
          optionA: 'Top-coding high income values and cell suppression for small geographic clusters',
          optionB: 'Deleting all integer numeric values from the database',
          optionC: 'Converting all continuous variables into random uniform noise',
          optionD: 'Replacing all weights with unit 1.0 values',
          correctAnswer: 'A',
          explanation: 'Statistical Disclosure Control (SDC) guidelines recommend top-coding extreme outlier values, collapsing rare occupation classifications, and suppressing small geographic identifiers to prevent identity disclosure.',
          difficulty: 'ADVANCED',
          topic: 'Data Privacy & Governance'
        }
      ];

      return samplePool.slice(0, count);
    }
  },
  askAssistant: async (data: { query: string; contextTopic?: string }) => {
    try {
      const res = await api.post('/ai/assistant', data);
      return res.data.data;
    } catch (err) {
      const q = data.query.toLowerCase();
      if (q.includes('sampling') || q.includes('survey') || q.includes('nsso')) {
        return {
          answer: 'Multistage Stratified Sampling in NSSO household surveys uses districts as strata, Census villages / urban frame survey (UFS) blocks as First Stage Units (selected via Probability Proportional to Size), and listed households as Ultimate Stage Units.\n\nKey estimation properties:\n• Balanced field investigator travel logistics\n• Self-weighting multi-tier design within domains\n• Robust standard error compilation via Jackknife or Linearization.',
          sourceReferences: ['NSSO Survey Design & Methodology Manual', 'MoSPI National Statistical Architecture Handbook'],
          suggestedFollowUps: ['How is Design Effect (Deff) calculated?', 'What is PPS with replacement vs without replacement?'],
          relevantCompetencies: ['Sampling Theory & Survey Design (STAT-SMP)', 'Data Quality Frameworks (STAT-DQF)']
        };
      } else if (q.includes('cpi') || q.includes('price') || q.includes('inflation')) {
        return {
          answer: 'Consumer Price Index (CPI) in India is compiled monthly by the National Statistical Office (NSO) with base year 2012=100 across Rural, Urban, and Combined sectors.\n\nMethodology:\n• Modified Laspeyres Price Index formula\n• Elementary price aggregation uses geometric mean across quotation shops\n• Commodity basket weighting derived from Household Consumer Expenditure Survey (CES).',
          sourceReferences: ['MoSPI Technical Advisory Committee on Price Indices Guidelines', 'Handbook of Price Statistics in India'],
          suggestedFollowUps: ['Explain difference between CPI and WPI', 'How does Fisher ideal index resolve index bias?'],
          relevantCompetencies: ['Price Statistics (STAT-PRI)', 'National Accounts (STAT-NAC)']
        };
      } else {
        return {
          answer: `Regarding "${data.query}": In India's Official Statistical System, data integrity adheres to the UN Fundamental Principles of Official Statistics and the National Data Sharing & Accessibility Policy (NDSAP).\n\nStatIQ provides automated skill diagnostic quizzes, iGOT Karmayogi curriculum roadmaps, and Bayesian score adjustments to ensure statistical cadres remain at peak operational readiness.`,
          sourceReferences: ['UN Fundamental Principles of Official Statistics', 'MoSPI Cadre Competency Matrix 2024'],
          suggestedFollowUps: ['Check my critical skill gaps', 'Enroll in iGOT Machine Learning course', 'Take a diagnostic assessment'],
          relevantCompetencies: ['AI & Machine Learning (TECH-AIM)', 'Statistical Ethics (MGT-ETH)']
        };
      }
    }
  },
};

export const adminApi = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    try {
      const res = await api.get('/admin/dashboard');
      return res.data.data as AdminDashboardData;
    } catch (err) {
      return MOCK_ADMIN_DASHBOARD;
    }
  },
  getCompetencies: async (): Promise<CompetencyAnalytics[]> => {
    try {
      const res = await api.get('/admin/competencies');
      return res.data.data as CompetencyAnalytics[];
    } catch (err) {
      return MOCK_ADMIN_DASHBOARD.topSkillGaps;
    }
  },
  getSkillGaps: async (): Promise<CompetencyAnalytics[]> => {
    try {
      const res = await api.get('/admin/skill-gaps');
      return res.data.data as CompetencyAnalytics[];
    } catch (err) {
      return MOCK_ADMIN_DASHBOARD.topSkillGaps;
    }
  },
  getDepartments: async (): Promise<DepartmentAnalytics[]> => {
    try {
      const res = await api.get('/admin/departments');
      return res.data.data as DepartmentAnalytics[];
    } catch (err) {
      return MOCK_ADMIN_DASHBOARD.departmentAnalytics;
    }
  },
  getTrainingAnalytics: async (): Promise<TrainingAnalytics> => {
    try {
      const res = await api.get('/admin/training-analytics');
      return res.data.data as TrainingAnalytics;
    } catch (err) {
      return MOCK_ADMIN_DASHBOARD.trainingAnalytics;
    }
  },
};

export default api;
