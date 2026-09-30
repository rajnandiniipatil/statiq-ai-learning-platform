import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../api/client';
import { Assessment, Question, QuizResult } from '../../types';
import {
  Clock,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Flag,
  Sparkles
} from 'lucide-react';

export const QuizViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60); // 15 mins default
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAssessment(parseInt(id, 10));
    }
  }, [id]);

  const fetchAssessment = async (assessmentId: number) => {
    try {
      const data = await assessmentApi.getAssessmentById(assessmentId);
      setAssessment(data);
      if (data.timeLimitMinutes) {
        setTimeRemaining(data.timeLimitMinutes * 60);
      }
    } catch (err) {
      console.error('Error fetching assessment', err);
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (loading || !assessment || submitting) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, assessment, submitting]);

  const handleSelectOption = (questionId: number, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = async () => {
    if (!assessment || submitting) return;
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: parseInt(qId, 10),
        selectedAnswer: ans,
      }));

      const totalTimeSeconds = (assessment.timeLimitMinutes || 15) * 60 - timeRemaining;

      const result = await assessmentApi.submitAttempt(assessment.id, {
        answers: formattedAnswers,
        timeSpentSeconds: Math.max(1, totalTimeSeconds),
      });

      // Navigate to results page with result state
      navigate(`/learner/assessments/${assessment.id}/results`, { state: { result } });
    } catch (err) {
      console.error('Error submitting quiz attempt', err);
      alert('An error occurred while submitting your assessment. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="w-10 h-10 border-4 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800">Assessment Unavailable</h3>
        <p className="text-xs text-slate-500 mt-1">This assessment does not currently contain questions.</p>
        <button
          onClick={() => navigate('/learner/dashboard')}
          className="mt-4 px-4 py-2 bg-gov-blue text-white text-xs font-semibold rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const questions = assessment.questions;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isTimeCritical = timeRemaining < 120; // under 2 minutes

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar: Title & Timer */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
            Diagnostic Assessment
          </span>
          <h1 className="text-lg font-bold text-slate-900 mt-1">{assessment.title}</h1>
          <p className="text-xs text-slate-500">
            Target Competency: <strong className="text-slate-700">{assessment.targetCompetencyName}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Progress metric */}
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block">Progress</span>
            <span className="text-sm font-bold text-slate-800">
              {answeredCount}/{questions.length} Answered
            </span>
          </div>

          {/* Countdown Timer */}
          <div
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border ${
              isTimeCritical
                ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4 text-gov-blue" />
            <span className="font-mono font-bold text-base">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gov-blue h-1.5 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Question Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-bold text-gov-blue bg-blue-50 px-2.5 py-1 rounded-lg">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">{currentQuestion.topic}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>

        {/* Question Prompt */}
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
          {currentQuestion.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {[
            { key: 'A', label: currentQuestion.optionA },
            { key: 'B', label: currentQuestion.optionB },
            { key: 'C', label: currentQuestion.optionC },
            { key: 'D', label: currentQuestion.optionD },
          ].map(({ key, label }) => {
            const isSelected = answers[currentQuestion.id!] === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectOption(currentQuestion.id!, key)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center space-x-3.5 ${
                  isSelected
                    ? 'border-gov-blue bg-indigo-50/50 shadow-sm ring-1 ring-gov-blue'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-gov-blue text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {key}
                </div>
                <span className={`text-sm leading-relaxed ${isSelected ? 'font-semibold text-gov-navy' : 'text-slate-700'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Assessment
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              className="inline-flex items-center px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              Next <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}
        </div>
      </div>

      {/* Question Palette Navigation Grid */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-700">Question Navigation Palette</span>
          <div className="flex items-center space-x-3 text-[11px] text-slate-500">
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-gov-blue mr-1"></span> Answered</span>
            <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 mr-1"></span> Unanswered</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id!];
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'ring-2 ring-gov-blue ring-offset-2 bg-gov-blue text-white'
                    : isAnswered
                    ? 'bg-indigo-100 text-gov-blue font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-gov-blue">
              <Sparkles className="w-6 h-6 text-gov-blue" />
              <h3 className="text-base font-bold text-slate-900">Submit Assessment?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> of <strong>{questions.length}</strong> questions.
              {answeredCount < questions.length && (
                <span className="text-rose-600 font-semibold block mt-1">
                  Note: You have {questions.length - answeredCount} unanswered questions!
                </span>
              )}
            </p>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-gov-blue">
              Your responses will be graded by the continuous feedback engine to update your official competency profile and recalibrate skill gaps.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50"
              >
                Continue Quiz
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50"
              >
                {submitting ? 'Evaluating...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
