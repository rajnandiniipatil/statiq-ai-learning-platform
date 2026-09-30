import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialApi, assessmentApi } from '../../api/client';
import { UploadedMaterial, Assessment } from '../../types';
import {
  UploadCloud,
  Sparkles,
  FileText,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Plus,
  Users,
  Award,
  Layers
} from 'lucide-react';

export const TrainerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mats, asmts] = await Promise.all([
          materialApi.getAllMaterials(),
          assessmentApi.getAllAssessments(),
        ]);
        setMaterials(mats);
        setAssessments(asmts);
      } catch (err) {
        console.error('Error fetching trainer dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalQuestions = assessments.reduce((acc, a) => acc + (a.questionCount || 0), 0);

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
            <h1 className="text-2xl font-bold text-slate-900">Training Officer Studio</h1>
            <span className="bg-indigo-100 text-gov-blue text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              Role: Master Trainer &bull; Capacity Building
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Authoritative material processing, AI question generation, and assessment deployment for the National Statistical Cadre.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/trainer/upload')}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <UploadCloud className="w-4 h-4 mr-1.5 text-gov-blue" /> Upload Material
          </button>
          <button
            onClick={() => navigate('/trainer/generator')}
            className="inline-flex items-center px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-1.5" /> AI MCQ Studio
          </button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Processed Materials</span>
            <div className="text-2xl font-bold text-slate-900">{materials.length}</div>
            <span className="text-[11px] text-slate-400">PDF, DOCX, PPTX, TXT</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Assessments Created</span>
            <div className="text-2xl font-bold text-slate-900">{assessments.length}</div>
            <span className="text-[11px] text-emerald-600 font-medium">Published & Active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">MCQs Synthesized</span>
            <div className="text-2xl font-bold text-slate-900">{totalQuestions}</div>
            <span className="text-[11px] text-slate-400">Bloom's Taxonomy Mapped</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500">Target Statistical Cadres</span>
            <div className="text-2xl font-bold text-slate-900">4</div>
            <span className="text-[11px] text-slate-400">NSSO, NAD, ESD, State DES</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Materials and Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uploaded Materials Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gov-blue" />
              <h2 className="text-base font-bold text-slate-900">Training Materials & Curricula</h2>
            </div>
            <button
              onClick={() => navigate('/trainer/upload')}
              className="text-xs font-semibold text-gov-blue hover:text-gov-navy flex items-center"
            >
              Upload New &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {materials.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No materials uploaded yet. Upload a syllabus, handbook, or survey guideline to generate quizzes.
              </div>
            ) : (
              materials.slice(0, 5).map((mat) => (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-[10px] text-gov-blue uppercase">
                      {mat.fileType}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{mat.fileName}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span>{(mat.fileSize / 1024).toFixed(1)} KB</span>
                        <span>&bull;</span>
                        <span>{new Date(mat.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/trainer/generator', { state: { materialId: mat.id } })}
                    className="text-xs font-semibold text-gov-blue hover:underline flex items-center"
                  >
                    Generate MCQs <Sparkles className="w-3 h-3 ml-1" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published Assessments Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-gov-blue" />
              <h2 className="text-base font-bold text-slate-900">Active Assessments</h2>
            </div>
            <button
              onClick={() => navigate('/trainer/assessments')}
              className="text-xs font-semibold text-gov-blue hover:text-gov-navy flex items-center"
            >
              Manage All &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {assessments.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No assessments published yet. Generate MCQs from training materials to publish assessments.
              </div>
            ) : (
              assessments.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">{a.title}</h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span>Competency: {a.targetCompetencyName}</span>
                      <span>&bull;</span>
                      <span>{a.questionCount} Questions</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600 font-semibold">Published</span>
                    </div>
                  </div>

                  <span className="font-mono text-xs font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                    {a.difficulty}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
