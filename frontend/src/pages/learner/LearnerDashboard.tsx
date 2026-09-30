import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  competencyApi,
  recommendationApi,
  learningPathApi,
  igotApi,
  assessmentApi
} from '../../api/client';
import {
  SkillGapSummary,
  Recommendation,
  LearningPath,
  LearningProgressSummary,
  Assessment
} from '../../types';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import {
  Award,
  AlertTriangle,
  BookOpen,
  Route,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<SkillGapSummary | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState<LearningProgressSummary | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, recRes, pathRes, progRes, assRes] = await Promise.all([
          competencyApi.getSkillGapSummary(),
          recommendationApi.getRecommendations(),
          learningPathApi.getLearningPath(),
          igotApi.getProgress(),
          assessmentApi.getAllAssessments(),
        ]);
        setSummary(sumRes);
        setRecommendations(recRes);
        setLearningPath(pathRes);
        setProgress(progRes);
        setAssessments(assRes);
      } catch (err) {
        console.error('Error fetching learner dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-semibold text-slate-500">Loading Officer Intelligence Dashboard...</p>
        </div>
      </div>
    );
  }

  // Prepare Radar Chart Data from top competencies
  const radarData = summary?.gaps?.slice(0, 7).map((g) => ({
    subject: g.competencyName.length > 14 ? g.competencyCode : g.competencyName,
    Current: g.currentLevel,
    Required: g.requiredLevel,
    fullMark: 100,
  })) || [];

  return (
    <div className="space-y-6">
      
      {/* Officer Welcome Banner */}
      <div className="bg-gradient-to-r from-gov-blue via-gov-navy to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-white/20 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                Emp ID: {user?.employeeId || 'MOSPI-SED-2024'}
              </span>
              <span className="text-sky-300 text-xs font-medium">
                {user?.departmentName || 'National Sample Survey Office'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-1">
              Welcome, {user?.fullName || 'Statistical Analyst'}
            </h1>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
              Assigned Benchmark: <strong className="text-white underline">{user?.jobRole || 'Statistical Analyst'}</strong>. 
              The AI Skill Intelligence Engine has analyzed your competencies against MoSPI benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/learner/quiz')}
              className="px-4 py-2 bg-gov-accent hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow transition flex items-center"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Take Diagnostic Quiz
            </button>
            <button
              onClick={() => navigate('/learner/courses')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition flex items-center"
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              iGOT Catalog
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Average Verified Competency</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{summary?.averageCompetencyScore || 0}%</span>
              <span className="text-[11px] font-semibold text-emerald-600">Target: {summary?.averageRequiredScore || 0}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Critical Skill Deficits</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-red-600">{summary?.criticalGapCount || 0}</span>
              <span className="text-[11px] font-semibold text-amber-600">+{summary?.significantGapCount || 0} Significant</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">iGOT Courses Enrolled</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{progress?.enrolledCoursesCount || 0}</span>
              <span className="text-[11px] font-semibold text-slate-400">Sandbox</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Route className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Learning Roadmap Progress</p>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900">{learningPath?.overallProgressPercent || 0}%</span>
              <span className="text-[11px] font-semibold text-slate-400">{learningPath?.totalEstimatedHours || 0} hrs total</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Radar Chart + Critical Gap Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Competency Verification Radar</h2>
              <p className="text-xs text-slate-500">Current verified capability vs Role Benchmark ({user?.jobRole || 'Statistical Analyst'})</p>
            </div>
            <button
              onClick={() => navigate('/learner/competencies')}
              className="text-xs font-semibold text-gov-blue hover:underline flex items-center"
            >
              Full Framework <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Verified Score" dataKey="Current" stroke="#0284c7" fill="#0284c7" fillOpacity={0.4} />
                <Radar name="Required Level" dataKey="Required" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Action Center */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">High-Impact Skill Gaps</h2>
              <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                Action Required
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Prioritized by distance from official job role performance benchmarks.
            </p>

            <div className="space-y-3">
              {summary?.gaps?.filter(g => g.gap > 20).slice(0, 3).map((gap) => (
                <div key={gap.competencyId} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{gap.competencyName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      gap.classification === 'CRITICAL_GAP'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {gap.gap} pt gap
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>Current: <strong className="text-slate-700">{gap.currentLevel}</strong></span>
                    <span>Target: <strong className="text-slate-700">{gap.requiredLevel}</strong></span>
                  </div>

                  {/* Progress bar comparing current vs target */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-gov-blue h-full rounded-full transition-all"
                      style={{ width: `${gap.currentLevel}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2 italic">
                    {gap.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/learner/skill-gaps')}
            className="w-full mt-4 py-2 border border-gov-blue text-gov-blue hover:bg-blue-50 text-xs font-bold rounded-lg transition"
          >
            View Detailed Gap Analysis
          </button>
        </div>

      </div>

      {/* Recommended Courses & Roadmap Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommended iGOT Courses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Personalized iGOT Training Recommendations</h2>
              <p className="text-xs text-slate-500">Catering to detected competency deficits</p>
            </div>
            <button
              onClick={() => navigate('/learner/recommendations')}
              className="text-xs font-semibold text-gov-blue hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                      {rec.courseCode}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                      {rec.priority} Priority
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1.5">{rec.courseTitle}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{rec.reason}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {rec.durationHours} hrs • {rec.difficulty}
                  </span>
                  <button
                    onClick={() => navigate('/learner/courses')}
                    className="text-xs font-bold text-gov-blue hover:text-gov-navy flex items-center"
                  >
                    Enroll Sandbox <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Personalized Learning Roadmap</h2>
                <p className="text-xs text-slate-500">Step-by-step career upskilling trajectory</p>
              </div>
              <button
                onClick={() => navigate('/learner/learning-path')}
                className="text-xs font-semibold text-gov-blue hover:underline"
              >
                Full Roadmap
              </button>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 my-2">
              {learningPath?.items?.slice(0, 3).map((item, idx) => (
                <div key={item.id} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-500 border-white'
                      : (item.status === 'IN_PROGRESS' ? 'bg-gov-blue border-white animate-pulse' : 'bg-slate-300 border-white')
                  }`}></div>
                  
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Milestone 0{idx + 1} • {item.durationHours} Hours
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 mt-0.5">{item.courseTitle}</h4>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded mt-1 ${
                    item.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : (item.status === 'IN_PROGRESS' ? 'bg-blue-100 text-gov-blue' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/learner/learning-path')}
            className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
          >
            Explore Visual Roadmap
          </button>
        </div>

      </div>

    </div>
  );
};
