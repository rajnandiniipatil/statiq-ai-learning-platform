import React, { useEffect, useState } from 'react';
import { learningPathApi, igotApi } from '../../api/client';
import { LearningPath, LearningPathItem } from '../../types';
import {
  Route,
  CheckCircle,
  PlayCircle,
  Clock,
  Award,
  RefreshCw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';

export const LearningPathPage: React.FC = () => {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'TIMELINE'>('ROADMAP');

  useEffect(() => {
    fetchLearningPath();
  }, []);

  const fetchLearningPath = async () => {
    try {
      const data = await learningPathApi.getLearningPath();
      setLearningPath(data);
    } catch (err) {
      console.error('Error fetching learning path', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegeneratePath = async () => {
    setGenerating(true);
    try {
      const data = await learningPathApi.generateLearningPath();
      setLearningPath(data);
    } catch (err) {
      console.error('Error regenerating learning path', err);
    } finally {
      setGenerating(false);
    }
  };

  const getStatusBadge = (status: string, progress: number) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Completed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <PlayCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> In Progress ({progress}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> Pending
          </span>
        );
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Roadmap</h1>
            <span className="bg-indigo-100 text-gov-blue text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              Role: {learningPath?.targetRole || 'Statistical Analyst'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Sequenced capacity-building curriculum designed to systematically close identified competency gaps.
          </p>
        </div>

        <button
          onClick={handleRegeneratePath}
          disabled={generating}
          className="inline-flex items-center px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-sm font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Re-sequencing...' : 'Regenerate Dynamic Path'}
        </button>
      </div>

      {/* Progress Metric Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum</span>
            <span className="text-xs font-semibold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
              {learningPath?.title || 'Statistical Cadre Roadmap'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {learningPath?.title}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            {learningPath?.description ||
              'A customized sequential training track aligned with MoSPI capacity building standards.'}
          </p>
        </div>

        <div className="flex items-center space-x-8">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total Duration</span>
            <span className="text-xl font-bold text-slate-900">{learningPath?.totalEstimatedHours || 0} hrs</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Completed</span>
            <span className="text-xl font-bold text-emerald-600">{learningPath?.completedHours || 0} hrs</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium block">Milestone Progress</span>
            <span className="text-xl font-bold text-gov-blue">{learningPath?.overallProgressPercent || 0}%</span>
          </div>
        </div>
      </div>

      {/* Visual Roadmap Sequence */}
      <div className="relative pl-6 md:pl-10 space-y-8 before:absolute before:left-[19px] md:before:left-[35px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {(learningPath?.items || []).map((item, index) => {
          const isCompleted = item.status === 'COMPLETED';
          const isInProgress = item.status === 'IN_PROGRESS';

          return (
            <div key={item.id || index} className="relative flex items-start group">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-[30px] md:-left-[42px] top-1.5 w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-sm z-10 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : isInProgress
                    ? 'bg-amber-500 border-amber-600 text-white animate-pulse'
                    : 'bg-white border-slate-300 text-slate-500 group-hover:border-gov-blue'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : item.sequenceOrder}
              </div>

              {/* Milestone Card */}
              <div
                className={`w-full bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${
                  isInProgress
                    ? 'border-amber-300 bg-amber-50/15'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {item.courseCode}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{item.courseTitle}</h3>
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl">{item.courseDescription}</p>
                  </div>

                  <div className="flex-shrink-0">{getStatusBadge(item.status, item.progressPercent)}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {item.durationHours} hrs
                    </span>
                    <span className="flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {item.difficulty}
                    </span>
                    <span className="text-slate-400">Provider: {item.provider}</span>
                  </div>

                  {item.status !== 'COMPLETED' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400 text-xs">Sandbox Progress:</span>
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gov-blue h-2 rounded-full"
                          style={{ width: `${item.progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
