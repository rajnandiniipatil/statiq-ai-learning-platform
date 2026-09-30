import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../api/client';
import { Assessment } from '../../types';
import {
  Award,
  Plus,
  Clock,
  CheckCircle,
  PlayCircle,
  FileQuestion,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

export const AssessmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const data = await assessmentApi.getAllAssessments();
      setAssessments(data);
    } catch (err) {
      console.error('Error fetching assessments', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = assessments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.targetCompetencyName && a.targetCompetencyName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiff = selectedDifficulty === 'ALL' || a.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

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
            <h1 className="text-2xl font-bold text-slate-900">Cadre Assessments Registry</h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Published & Diagnostic
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage official skill validation assessments and diagnostic tests deployed for the National Statistical Cadre.
          </p>
        </div>

        <button
          onClick={() => navigate('/trainer/generator')}
          className="inline-flex items-center px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Synthesize New Assessment
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search assessments or competencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-gov-blue focus:outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-200">
            <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No assessments found</h3>
            <p className="text-xs text-slate-500 mt-1">Generate and publish assessments using the AI Question Studio.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                    {item.targetCompetencyCode || 'STAT-ASSESS'}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      item.difficulty === 'ADVANCED'
                        ? 'bg-rose-50 text-rose-700'
                        : item.difficulty === 'INTERMEDIATE'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Target Competency:</span>
                    <strong className="text-slate-800">{item.targetCompetencyName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Time Limit:</span>
                    <strong className="text-slate-800">{item.timeLimitMinutes || 15} mins</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Question Pool:</span>
                    <strong className="text-gov-blue font-bold">{item.questionCount} MCQs</strong>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Published
                </span>

                <button
                  onClick={() => navigate(`/learner/assessments/${item.id}`)}
                  className="px-3.5 py-1.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center"
                >
                  <PlayCircle className="w-3.5 h-3.5 mr-1.5" /> Test Assessment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
