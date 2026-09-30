import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { aiApi, materialApi, competencyApi, assessmentApi } from '../../api/client';
import { UploadedMaterial, Competency, Question } from '../../types';
import {
  Sparkles,
  RefreshCw,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Send,
  Layers,
  Award,
  ChevronDown,
  Plus,
  Save,
  X
} from 'lucide-react';

export const QuestionGeneratorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const preselectedMaterialId = (location.state as { materialId?: number })?.materialId;

  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [loading, setLoading] = useState(true);

  // Generation parameters
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | undefined>(preselectedMaterialId);
  const [topic, setTopic] = useState<string>('NSSO Household Survey Sampling');
  const [difficulty, setDifficulty] = useState<string>('INTERMEDIATE');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [generating, setGenerating] = useState(false);

  // Generated questions list
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Question | null>(null);

  // Publishing form
  const [assessmentTitle, setAssessmentTitle] = useState('Diagnostic Assessment: Survey Design & Sampling');
  const [assessmentDesc, setAssessmentDesc] = useState(
    'Evaluates core principles of multistage stratified sampling, ratio estimation, and NSSO frame stratification.'
  );
  const [targetCompId, setTargetCompId] = useState<number | undefined>(undefined);
  const [timeLimit, setTimeLimit] = useState<number>(15);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mats, comps] = await Promise.all([
          materialApi.getAllMaterials(),
          competencyApi.getAllCompetencies(),
        ]);
        setMaterials(mats);
        setCompetencies(comps);
        if (comps.length > 0) {
          setTargetCompId(comps[0].id);
        }
      } catch (err) {
        console.error('Error fetching data for generator', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setPublishSuccess(null);
    try {
      const generated = await aiApi.generateMcqs({
        materialId: selectedMaterialId,
        topic: topic || undefined,
        difficulty,
        count: questionCount,
      });
      setQuestions(generated);
    } catch (err) {
      console.error('Error generating MCQs', err);
      alert('Failed to generate MCQs from AI service. Please verify parameters or use domain fallback.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...questions[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editForm) {
      setQuestions((prev) => {
        const copy = [...prev];
        copy[editingIndex] = editForm;
        return copy;
      });
      setEditingIndex(null);
      setEditForm(null);
    }
  };

  const handlePublishAssessment = async () => {
    if (questions.length === 0) {
      alert('Please generate at least one question before publishing.');
      return;
    }

    setPublishing(true);
    try {
      const payload = {
        title: assessmentTitle,
        description: assessmentDesc,
        targetCompetencyId: targetCompId,
        sourceMaterialId: selectedMaterialId,
        difficulty,
        timeLimitMinutes: timeLimit,
        published: true,
        questions: questions.map((q, idx) => ({
          ...q,
          sequenceOrder: idx + 1,
        })),
      };

      await assessmentApi.createAssessment(payload);
      setPublishSuccess(`Assessment "${assessmentTitle}" published successfully with ${questions.length} questions!`);
      setTimeout(() => {
        navigate('/trainer/assessments');
      }, 2000);
    } catch (err) {
      console.error('Error publishing assessment', err);
      alert('Failed to publish assessment.');
    } finally {
      setPublishing(false);
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
          <h1 className="text-2xl font-bold text-slate-900">AI MCQ & Assessment Studio</h1>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Bloom's Taxonomy Generator
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Synthesize high-validity diagnostic and formative multiple-choice questions from official statistical training materials.
        </p>
      </div>

      {/* Control Configuration Panel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Synthesis Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Source Document */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Source Material (Optional)
            </label>
            <select
              value={selectedMaterialId || ''}
              onChange={(e) =>
                setSelectedMaterialId(e.target.value ? parseInt(e.target.value, 10) : undefined)
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
            >
              <option value="">No material (Direct statistical corpus)</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fileName} ({m.fileType.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Statistical Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Sampling, Price Indices, National Accounts"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
            >
              <option value="BEGINNER">Beginner (Foundations & Recall)</option>
              <option value="INTERMEDIATE">Intermediate (Application & Analysis)</option>
              <option value="ADVANCED">Advanced (Synthesis & Evaluative)</option>
              <option value="MIXED">Mixed (Balanced Multi-Tier)</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-gov-blue"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            Generates 4 multiple choice options, official rationale, and source reference.
          </span>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Synthesizing with AI Service...' : `Generate ${questionCount} MCQs Now`}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {publishSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center shadow-sm">
          <CheckCircle className="w-5 h-5 mr-3 text-emerald-600 flex-shrink-0" />
          <span>{publishSuccess}</span>
        </div>
      )}

      {/* Question Review & Edit Section */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900">
                Generated Questions Review ({questions.length})
              </h2>
              <span className="bg-indigo-100 text-gov-blue text-xs font-semibold px-2 py-0.5 rounded">
                Trainer Editorial Mode
              </span>
            </div>

            <button
              onClick={handleGenerate}
              className="text-xs font-semibold text-gov-blue hover:underline flex items-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Regenerate All
            </button>
          </div>

          {/* List of Questions */}
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const isEditing = editingIndex === idx;

              if (isEditing && editForm) {
                return (
                  <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-gov-blue shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gov-blue">Editing Question {idx + 1}</span>
                      <button onClick={() => setEditingIndex(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Question Text</label>
                      <textarea
                        rows={2}
                        value={editForm.questionText}
                        onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Option A</label>
                        <input
                          type="text"
                          value={editForm.optionA}
                          onChange={(e) => setEditForm({ ...editForm, optionA: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Option B</label>
                        <input
                          type="text"
                          value={editForm.optionB}
                          onChange={(e) => setEditForm({ ...editForm, optionB: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Option C</label>
                        <input
                          type="text"
                          value={editForm.optionC}
                          onChange={(e) => setEditForm({ ...editForm, optionC: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Option D</label>
                        <input
                          type="text"
                          value={editForm.optionD}
                          onChange={(e) => setEditForm({ ...editForm, optionD: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Correct Answer</label>
                        <select
                          value={editForm.correctAnswer}
                          onChange={(e) => setEditForm({ ...editForm, correctAnswer: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Explanation & Formula</label>
                        <input
                          type="text"
                          value={editForm.explanation}
                          onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="px-3 py-1.5 border border-slate-200 text-xs font-semibold rounded-lg text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-1.5 bg-gov-blue text-white text-xs font-bold rounded-lg shadow-sm"
                      >
                        Save Question Edits
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                          Q{idx + 1}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{q.topic}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-relaxed">{q.questionText}</h3>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleStartEdit(idx)}
                        className="p-1.5 text-slate-400 hover:text-gov-blue hover:bg-slate-50 rounded-lg transition-colors"
                        title="Edit Question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {[
                      { key: 'A', text: q.optionA },
                      { key: 'B', text: q.optionB },
                      { key: 'C', text: q.optionC },
                      { key: 'D', text: q.optionD },
                    ].map(({ key, text }) => (
                      <div
                        key={key}
                        className={`p-2.5 rounded-lg border flex items-center space-x-2 ${
                          key === q.correctAnswer
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-bold">{key}.</span>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                      <strong className="text-slate-800">Explanation: </strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Publishing Assessment Drawer / Card */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Award className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Publish as Cadre Assessment</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Title</label>
                <input
                  type="text"
                  value={assessmentTitle}
                  onChange={(e) => setAssessmentTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-gov-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Competency</label>
                <select
                  value={targetCompId || ''}
                  onChange={(e) => setTargetCompId(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-gov-blue"
                >
                  {competencies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Learners will receive automated evaluation and Bayesian score updates upon submission.
              </span>
              <button
                onClick={handlePublishAssessment}
                disabled={publishing}
                className="inline-flex items-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {publishing ? 'Publishing Assessment...' : 'Publish Assessment to Learner Cadre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
