import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Learner Pages
import { LearnerDashboard } from './pages/learner/LearnerDashboard';
import { LearnerProfilePage } from './pages/learner/LearnerProfile';
import { CompetenciesPage } from './pages/learner/Competencies';
import { SkillGapsPage } from './pages/learner/SkillGaps';
import { RecommendationsPage } from './pages/learner/Recommendations';
import { LearningPathPage } from './pages/learner/LearningPath';
import { CoursesPage } from './pages/learner/Courses';
import { QuizViewPage } from './pages/learner/QuizView';
import { QuizResultsPage } from './pages/learner/QuizResults';
import { AIAssistantPage } from './pages/learner/AIAssistant';

// Trainer Pages
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { MaterialsUploadPage } from './pages/trainer/MaterialsUpload';
import { QuestionGeneratorPage } from './pages/trainer/QuestionGenerator';
import { AssessmentsListPage } from './pages/trainer/AssessmentsList';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { WorkforceAnalyticsPage } from './pages/admin/WorkforceAnalytics';
import { CompetencyMatrixPage } from './pages/admin/CompetencyMatrix';
import { SkillGapAnalyticsPage } from './pages/admin/SkillGapAnalytics';
import { TrainingAnalyticsPage } from './pages/admin/TrainingAnalytics';

const HomeRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user.roles.includes('ROLE_TRAINER')) {
    return <Navigate to="/trainer/dashboard" replace />;
  }
  return <Navigate to="/learner/dashboard" replace />;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main Authenticated Layout */}
      <Route element={<Layout />}>
        {/* Home Redirect */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Learner Routes */}
        <Route
          path="/learner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/profile"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <LearnerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/competencies"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <CompetenciesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/skill-gaps"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <SkillGapsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/recommendations"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <RecommendationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/learning-path"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <LearningPathPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/courses"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/assessments/:id"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <QuizViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/assessments/:id/results"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <QuizResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner/assistant"
          element={
            <ProtectedRoute allowedRoles={['ROLE_LEARNER', 'ROLE_TRAINER', 'ROLE_ADMIN']}>
              <AIAssistantPage />
            </ProtectedRoute>
          }
        />

        {/* Trainer Routes */}
        <Route
          path="/trainer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINER', 'ROLE_ADMIN']}>
              <TrainerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer/upload"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINER', 'ROLE_ADMIN']}>
              <MaterialsUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer/generator"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINER', 'ROLE_ADMIN']}>
              <QuestionGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer/assessments"
          element={
            <ProtectedRoute allowedRoles={['ROLE_TRAINER', 'ROLE_ADMIN']}>
              <AssessmentsListPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/workforce"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <WorkforceAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/competency-matrix"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <CompetencyMatrixPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/skill-gaps"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <SkillGapAnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/training-analytics"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <TrainingAnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
