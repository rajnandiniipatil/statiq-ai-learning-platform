import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/client';
import { AdminDashboardData } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Download
} from 'lucide-react';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await adminApi.getDashboard();
      setData(res);
    } catch (err) {
      console.error('Error fetching admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const deptChartData = (data?.departmentAnalytics || []).map((d) => ({
    name: d.departmentCode,
    fullName: d.departmentName,
    avgScore: d.averageCompetencyScore,
    completionRate: d.trainingCompletionRate,
    criticalGaps: d.criticalGapsCount,
  }));

  const gapPieData = [
    { name: 'Critical Gap', value: data?.criticalGapsCount || 0, color: '#EF4444' },
    { name: 'Significant Gap', value: data?.significantGapsCount || 0, color: '#F59E0B' },
    { name: 'Moderate Gap', value: 8, color: '#3B82F6' },
    { name: 'Strong / Benchmarked', value: 14, color: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">National Statistical Workforce Intelligence</h1>
            <span className="bg-blue-100 text-gov-blue text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
              Executive Cadre Overview
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Ministry of Statistics and Programme Implementation (MoSPI) &bull; Official Statistical System Dashboard
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/admin/workforce')}
            className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Cadre Deep Dive &rarr;
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cadre Officers</span>
            <Users className="w-4 h-4 text-gov-blue" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{data?.totalEmployees || 0}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {data?.activeLearners || 0} Active Learners
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Cadre Health Index</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">
            {data?.averageCompetencyScore || 0}/100
          </div>
          <div className="text-[11px] text-slate-400 mt-1">National Benchmark: 75</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Training Completion</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">
            {data?.trainingCompletionRate || 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across 22 iGOT modules</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700">Critical Gaps</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-700 mt-2">
            {data?.criticalGapsCount || 0}
          </div>
          <div className="text-[11px] text-rose-600 mt-1">Immediate intervention</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Significant Gaps</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-2">
            {data?.significantGapsCount || 0}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Requires capacity building</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Departmental Comparison Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Departmental Competency & Training Benchmarks
              </h2>
              <p className="text-xs text-slate-500">
                Comparing NSSO, National Accounts (NAD), Price/Economic Statistics (ESD), and State DES
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `${val}%`,
                    name === 'avgScore' ? 'Avg Competency' : 'Completion Rate',
                  ]}
                  labelFormatter={(name) => `Department: ${name}`}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="avgScore" name="Avg Competency Score" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completionRate" name="Training Completion %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Gap Proportion Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">National Gap Distribution</h2>
            <p className="text-xs text-slate-500">Cadre competency alignment tiers</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gapPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gapPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {gapPieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables: Top Skill Gaps & Emerging Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Critical Gaps */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">Top Cadre Competency Deficits</h2>
            </div>
            <button
              onClick={() => navigate('/admin/skill-gaps')}
              className="text-xs font-semibold text-gov-blue hover:underline"
            >
              View All Gaps &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {(data?.topSkillGaps || []).slice(0, 5).map((gap) => (
              <div
                key={gap.competencyId}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                      {gap.competencyCode}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">{gap.competencyName}</h4>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                    <span>Avg Score: {gap.averageScore}/100</span>
                    <span>&bull;</span>
                    <span>Benchmark: {gap.benchmarkScore}/100</span>
                    <span>&bull;</span>
                    <span className="text-rose-600 font-semibold">{gap.affectedEmployeesCount} Officers Affected</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-rose-600">
                    -{gap.averageGap} pts
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">Avg Deficit</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emerging Skills Demand */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-gov-blue" />
              <h2 className="text-base font-bold text-slate-900">Emerging Statistical Technologies</h2>
            </div>
            <button
              onClick={() => navigate('/admin/competency-matrix')}
              className="text-xs font-semibold text-gov-blue hover:underline"
            >
              Competency Matrix &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {(data?.emergingSkills || []).slice(0, 5).map((skill) => (
              <div
                key={skill.competencyId}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {skill.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">{skill.competencyName}</h4>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                    <span>Cadre Demand: <strong className="text-slate-700">{skill.demandLevel}</strong></span>
                    <span>&bull;</span>
                    <span>Required for Digital DPI & ML</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
                  Target: {skill.benchmarkScore}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
