import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { TrainingAnalytics } from '../../types';
import {
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Search,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TrainingAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<TrainingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTraining();
  }, []);

  const fetchTraining = async () => {
    try {
      const res = await adminApi.getTrainingAnalytics();
      setData(res);
    } catch (err) {
      console.error('Error fetching training analytics', err);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-slate-900">Training Utilization & iGOT Analytics</h1>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
            Cadre Capacity Building
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Tracking officer enrollment, progress velocities, and module completions across the integrated iGOT Karmayogi curriculum.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Total Enrollments</span>
            <BookOpen className="w-4 h-4 text-gov-blue" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{data?.totalEnrollments || 0}</div>
          <span className="text-[11px] text-slate-400">Across all 4 divisions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Completed Courses</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{data?.completedEnrollments || 0}</div>
          <span className="text-[11px] text-slate-400">Certified completions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Active in Training</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-2">{data?.activeEnrollments || 0}</div>
          <span className="text-[11px] text-slate-400">Currently in-flight</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-gov-blue" />
          </div>
          <div className="text-2xl font-extrabold text-gov-blue mt-2">{data?.overallCompletionRate || 0}%</div>
          <span className="text-[11px] text-slate-400">National statistical average</span>
        </div>
      </div>

      {/* Most Popular Courses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">Highest Demand Statistical Courses</h2>

        <div className="divide-y divide-slate-100">
          {(data?.mostPopularCourses || []).map((c) => (
            <div
              key={c.courseId}
              className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                    {c.courseCode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{c.courseTitle}</h4>
                </div>
                <p className="text-xs text-slate-400">Provider: {c.provider}</p>
              </div>

              <div className="flex items-center space-x-8 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Officers Enrolled</span>
                  <span className="text-sm font-bold text-slate-800">{c.enrollmentCount}</span>
                </div>

                <div className="w-32">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Avg Progress</span>
                    <span className="font-bold text-slate-800">{c.averageProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${c.averageProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
