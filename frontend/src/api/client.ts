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

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data.data as AuthResponse;
  },
  register: async (data: any) => {
    const res = await api.post('/auth/register', data);
    return res.data.data as AuthResponse;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data.data as UserProfile;
  },
};

export const competencyApi = {
  getAllCompetencies: async () => {
    const res = await api.get('/competencies');
    return res.data.data as Competency[];
  },
  getMyCompetencies: async () => {
    const res = await api.get('/competencies/me');
    return res.data.data as LearnerCompetency[];
  },
  getMySkillGaps: async () => {
    const res = await api.get('/competencies/gaps');
    return res.data.data as SkillGap[];
  },
  getSkillGapSummary: async () => {
    const res = await api.get('/competencies/summary');
    return res.data.data as SkillGapSummary;
  },
  submitAssessment: async (data: { competencyId: number; score: number; assessmentType?: string }) => {
    const res = await api.post('/competencies/assessment', data);
    return res.data.data as LearnerCompetency;
  },
};

export const recommendationApi = {
  getRecommendations: async () => {
    const res = await api.get('/recommendations');
    return res.data.data as Recommendation[];
  },
  generateRecommendations: async () => {
    const res = await api.post('/recommendations/generate');
    return res.data.data as Recommendation[];
  },
};

export const igotApi = {
  getCourses: async () => {
    const res = await api.get('/igot/courses');
    return res.data.data as IGotCourse[];
  },
  getCourseById: async (id: number) => {
    const res = await api.get(`/igot/courses/${id}`);
    return res.data.data as IGotCourse;
  },
  searchCourses: async (query: string) => {
    const res = await api.get(`/igot/search?q=${encodeURIComponent(query)}`);
    return res.data.data as IGotCourse[];
  },
  enroll: async (courseId: number) => {
    const res = await api.post('/igot/enroll', { courseId });
    return res.data;
  },
  getProgress: async () => {
    const res = await api.get('/igot/progress');
    return res.data.data as LearningProgressSummary;
  },
};

export const learningPathApi = {
  getLearningPath: async () => {
    const res = await api.get('/learning-path');
    return res.data.data as LearningPath;
  },
  generateLearningPath: async () => {
    const res = await api.post('/learning-path/generate');
    return res.data.data as LearningPath;
  },
  getProgress: async () => {
    const res = await api.get('/learning/progress');
    return res.data.data as LearningProgressSummary;
  },
};

export const materialApi = {
  uploadMaterial: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data as UploadedMaterial;
  },
  getAllMaterials: async () => {
    const res = await api.get('/materials');
    return res.data.data as UploadedMaterial[];
  },
};

export const assessmentApi = {
  getAllAssessments: async () => {
    const res = await api.get('/assessments');
    return res.data.data as Assessment[];
  },
  getAssessmentById: async (id: number) => {
    const res = await api.get(`/assessments/${id}`);
    return res.data.data as Assessment;
  },
  createAssessment: async (data: any) => {
    const res = await api.post('/assessments', data);
    return res.data.data as Assessment;
  },
  submitAttempt: async (id: number, submission: { answers: { questionId: number; selectedAnswer: string }[]; timeSpentSeconds?: number }) => {
    const res = await api.post(`/assessments/${id}/attempt`, submission);
    return res.data.data as QuizResult;
  },
  getResults: async (id: number) => {
    const res = await api.get(`/assessments/${id}/results`);
    return res.data.data as QuizResult;
  },
};

export const aiApi = {
  generateMcqs: async (params: { materialId?: number; topic?: string; difficulty?: string; count?: number }) => {
    const res = await api.post('/ai/generate-mcq', params);
    return res.data.data as Question[];
  },
  askAssistant: async (data: { query: string; contextTopic?: string }) => {
    const res = await api.post('/ai/assistant', data);
    return res.data.data as {
      answer: string;
      sourceReferences: string[];
      suggestedFollowUps: string[];
      relevantCompetencies: string[];
    };
  },
};

export const adminApi = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data.data as AdminDashboardData;
  },
  getCompetencies: async () => {
    const res = await api.get('/admin/competencies');
    return res.data.data as CompetencyAnalytics[];
  },
  getSkillGaps: async () => {
    const res = await api.get('/admin/skill-gaps');
    return res.data.data as CompetencyAnalytics[];
  },
  getDepartments: async () => {
    const res = await api.get('/admin/departments');
    return res.data.data as DepartmentAnalytics[];
  },
  getTrainingAnalytics: async () => {
    const res = await api.get('/admin/training-analytics');
    return res.data.data as TrainingAnalytics;
  },
};

export default api;
