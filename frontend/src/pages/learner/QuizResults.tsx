import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../api/client';
import { QuizResult, QuestionEvaluation } from '../../types';
import {
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  RefreshCw,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const QuizResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<QuizResult | null>(
    (location.state as { result?: QuizResult })?.result || null
  );
  const [loading, setLoading] = useState(!result);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!result && id) {
      fetchResults(parseInt(id, 10));
    }
  }, [id, result]);

  const fetchResults = async (assessmentId: number) => {
    try {
      const data = await assessmentApi.getResults(assessmentId);
      setResult(data);
    } catch (err) {
      console.error('Error fetching quiz results', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (qId: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">Result Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">Unable to locate your evaluation records for this assessment.</p>
        <button
          onClick={() => navigate('/learner/dashboard')}
          className="mt-4 px-4 py-2 bg-gov-blue text-white text-xs font-semibold rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const passed = result.accuracyPercent >= 60;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div
        className={`rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${
          passed
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${
              passed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            {passed ? <CheckCircle className="w-9 h-9" /> : <Award className="w-9 h-9" />}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Evaluation Completed
            </span>
            <h1 className="text-xl font-bold text-slate-900">{result.assessmentTitle}</h1>
            <p className="text-xs text-slate-600">
              Evaluated Competency:{' '}
              <strong className="text-gov-blue font-bold">{result.targetCompetencyName}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
            <span className="text-2xl font-extrabold text-slate-900">{result.score}/100</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
            <span className={`text-2xl font-extrabold ${passed ? 'text-emerald-700' : 'text-amber-700'}`}>
              {result.accuracyPercent}%
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Correct</span>
            <span className="text-2xl font-extrabold text-slate-900">
              {result.correctAnswers}/{result.totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* CONTINUOUS FEEDBACK LOOP - Competency Score Update Card */}
      <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-gov-blue">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Continuous Competency Feedback Engine (Bayesian Calibration)
              </h2>
              <p className="text-[11px] text-slate-500">
                Algorithm: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">S_new = (0.65 × S_old) + (0.35 × QuizAccuracy)</code>
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
            Real-time Profile Recalibration
          </span>
        </div>

        {/* Delta Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium">Previous Competency Score</span>
            <div className="text-xl font-bold text-slate-700 mt-1">
              {result.competencyScoreBefore !== undefined ? `${result.competencyScoreBefore}/100` : 'Baseline'}
            </div>
          </div>

          <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200 text-center">
            <span className="text-xs text-gov-blue font-semibold">Updated Competency Score</span>
            <div className="text-xl font-bold text-gov-blue mt-1">
              {result.competencyScoreAfter !== undefined ? `${result.competencyScoreAfter}/100` : `${result.score}/100`}
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-center">
            <span className="text-xs text-emerald-800 font-semibold">Competency Delta</span>
            <div className="text-xl font-bold text-emerald-700 mt-1 flex items-center justify-center">
              {result.competencyScoreDelta !== undefined && result.competencyScoreDelta >= 0 ? '+' : ''}
              {result.competencyScoreDelta !== undefined ? result.competencyScoreDelta : '+0'} pts
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          The continuous feedback loop prevents sudden score volatility by blending historical demonstrated mastery with this latest assessment attempt. Your skill gaps and personalized learning paths have automatically refreshed.
        </p>
      </div>

      {/* AI Diagnostic Feedback */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-gov-blue">
          <Sparkles className="w-5 h-5 text-gov-blue" />
          <h2 className="text-base font-bold text-slate-900">AI Diagnostic Insights & Next Steps</h2>
        </div>

        <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-slate-700 leading-relaxed">
          {result.aiFeedback || 'Performance verified across core statistical concepts. Continuous engagement recommended.'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-1.5">
            <span className="text-xs font-bold text-emerald-800 flex items-center">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Demonstrated Strengths
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result.strengths || 'Solid foundational knowledge demonstrated.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-1.5">
            <span className="text-xs font-bold text-amber-800 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              Areas for Revision
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {result.weaknesses || 'Focus on advanced sampling configurations and edge cases.'}
            </p>
          </div>
        </div>

        {result.recommendedRevision && (
          <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong>Recommended Modular Focus: </strong> {result.recommendedRevision}
          </div>
        )}
      </div>

      {/* Question by Question Detailed Review */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Detailed Answer Review ({result.questionResults?.length || 0})</h2>

        {(result.questionResults || []).map((q, idx) => {
          const isExpanded = expandedQuestions[q.questionId] !== false; // default open

          return (
            <div
              key={q.questionId || idx}
              className={`bg-white rounded-xl border transition-all ${
                q.isCorrect ? 'border-emerald-200' : 'border-rose-200'
              }`}
            >
              {/* Question summary row */}
              <div
                onClick={() => toggleExpand(q.questionId)}
                className="p-4 cursor-pointer flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      q.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{q.questionText}</h3>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span>Topic: {q.topic}</span>
                      <span>&bull;</span>
                      <span>
                        Your answer: <strong className={q.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>{q.selectedAnswer || 'Not answered'}</strong>
                      </span>
                      <span>&bull;</span>
                      <span>Correct: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {q.isCorrect ? (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Correct
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      Incorrect
                    </span>
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs space-y-3">
                  <p className="text-slate-800 font-medium">{q.questionText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'A', text: q.optionA },
                      { key: 'B', text: q.optionB },
                      { key: 'C', text: q.optionC },
                      { key: 'D', text: q.optionD },
                    ].map(({ key, text }) => {
                      const isCorrect = key === q.correctAnswer;
                      const isSelected = key === q.selectedAnswer;

                      return (
                        <div
                          key={key}
                          className={`p-2.5 rounded-lg border text-xs flex items-center space-x-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : isSelected && !isCorrect
                              ? 'bg-rose-50 border-rose-300 text-rose-900 font-medium'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold">{key}.</span>
                          <span>{text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                      <span className="font-semibold text-slate-900 block text-[11px]">Explanation & Statistical Context:</span>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={() => navigate('/learner/skill-gaps')}
          className="w-full sm:w-auto px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center"
        >
          View Recalculated Skill Gaps <ArrowRight className="w-4 h-4 ml-2" />
        </button>

        <button
          onClick={() => navigate('/learner/recommendations')}
          className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center"
        >
          Explore Updated Recommendations
        </button>
      </div>
    </div>
  );
};
