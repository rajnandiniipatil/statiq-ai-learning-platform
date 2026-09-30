import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationApi, igotApi } from '../../api/client';
import { Recommendation } from '../../types';
import {
  Sparkles,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrollSuccessMessage, setEnrollSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await recommendationApi.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      console.error('Error fetching recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const fresh = await recommendationApi.generateRecommendations();
      setRecommendations(fresh);
      setEnrollSuccessMessage('AI recommendations successfully regenerated based on latest skill gaps!');
      setTimeout(() => setEnrollSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error regenerating recommendations', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleEnroll = async (courseId: number, title: string) => {
    setEnrollingId(courseId);
    try {
      await igotApi.enroll(courseId);
      setEnrollSuccessMessage(`Successfully enrolled in "${title}" via iGOT Karmayogi Sandbox!`);
      // Update local state
      setRecommendations((prev) =>
        prev.map((r) => (r.courseId === courseId ? { ...r, isEnrolled: true, currentProgress: 0 } : r))
      );
      setTimeout(() => setEnrollSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error enrolling in course', err);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredRecs = recommendations.filter((r) => {
    if (selectedPriority === 'ALL') return true;
    return r.priority === selectedPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Critical Priority
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            High Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            Recommended
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
            <h1 className="text-2xl font-bold text-slate-900">Personalized Learning Recommendations</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Dynamic course suggestions tailored to your official role benchmarks and measured competency deficits.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="inline-flex items-center px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-sm font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
          {regenerating ? 'Analyzing Gaps...' : 'Recalculate AI Recommendations'}
        </button>
      </div>

      {/* Success Notification */}
      {enrollSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center shadow-sm">
          <CheckCircle className="w-5 h-5 mr-3 text-emerald-600 flex-shrink-0" />
          <span>{enrollSuccessMessage}</span>
        </div>
      )}

      {/* iGOT Sandbox Context Notice */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
            iGOT Karmayogi Sandbox
          </span>
          <span>Courses mapped to Karmayogi competency dictionary for statistical cadres. Prototype environment.</span>
        </div>
        <button
          onClick={() => navigate('/learner/courses')}
          className="text-amber-800 hover:text-amber-950 font-semibold underline text-xs ml-2"
        >
          Browse Full Catalog &rarr;
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Recommendations' },
          { id: 'CRITICAL', label: 'Critical Priority' },
          { id: 'HIGH', label: 'High Priority' },
          { id: 'MEDIUM', label: 'Medium Priority' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedPriority(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedPriority === tab.id
                ? 'bg-gov-blue text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl p-12 text-center border border-slate-200">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No recommendations match the filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try selecting a different priority level or click Recalculate.</p>
          </div>
        ) : (
          filteredRecs.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {rec.courseCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{rec.courseTitle}</h3>
                  </div>
                  {getPriorityBadge(rec.priority)}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{rec.courseDescription}</p>

                {/* AI Justification Box */}
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-xs space-y-1">
                  <div className="flex items-center text-gov-blue font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    AI Recommendation Rationale
                  </div>
                  <p className="text-slate-700 leading-relaxed">{rec.reason}</p>
                  {rec.expectedOutcome && (
                    <p className="text-slate-600 text-[11px] pt-1">
                      <span className="font-semibold text-slate-700">Target Outcome: </span>
                      {rec.expectedOutcome}
                    </p>
                  )}
                </div>

                {/* Course Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {rec.durationHours} hrs
                  </div>
                  <div className="flex items-center">
                    <Award className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {rec.difficulty}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {rec.competencyName}
                  </div>
                  <span className="text-[11px] text-slate-400 ml-auto font-medium">
                    Provider: {rec.provider}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                {rec.isEnrolled ? (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Check className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Enrolled ({rec.currentProgress}% completed)
                  </span>
                ) : (
                  <button
                    onClick={() => handleEnroll(rec.courseId, rec.courseTitle)}
                    disabled={enrollingId === rec.courseId}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                  >
                    {enrollingId === rec.courseId ? (
                      'Enrolling...'
                    ) : (
                      <>
                        Enroll on iGOT Karmayogi <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => navigate('/learner/learning-path')}
                  className="text-xs text-slate-500 hover:text-gov-blue font-medium transition-colors"
                >
                  View in Roadmap &rarr;
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
