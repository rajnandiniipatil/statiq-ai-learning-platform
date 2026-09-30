import React, { useEffect, useState } from 'react';
import { competencyApi } from '../../api/client';
import { Competency, LearnerCompetency } from '../../types';
import { 
  Target, 
  Search, 
  Filter, 
  Sliders, 
  CheckCircle2, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen 
} from 'lucide-react';

export const CompetenciesPage: React.FC = () => {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [myCompetencies, setMyCompetencies] = useState<Record<number, LearnerCompetency>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Self-assessment modal state
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [evalComp, setEvalComp] = useState<Competency | null>(null);
  const [evalScore, setEvalScore] = useState<number>(50);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    fetchCompetencies();
  }, []);

  const fetchCompetencies = async () => {
    try {
      const [allComp, myComp] = await Promise.all([
        competencyApi.getAllCompetencies(),
        competencyApi.getMyCompetencies(),
      ]);
      setCompetencies(allComp);

      const map: Record<number, LearnerCompetency> = {};
      myComp.forEach((mc) => {
        map[mc.competencyId] = mc;
      });
      setMyCompetencies(map);
    } catch (err) {
      console.error('Error fetching competencies', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEval = (comp: Competency) => {
    setEvalComp(comp);
    const existing = myCompetencies[comp.id]?.score || 50;
    setEvalScore(existing);
    setEvalModalOpen(true);
  };

  const handleSubmitEvaluation = async () => {
    if (!evalComp) return;
    setSubmitting(true);
    try {
      await competencyApi.submitAssessment({
        competencyId: evalComp.id,
        score: evalScore,
        assessmentType: 'SELF_EVALUATION',
      });
      setSuccessToast(`Competency '${evalComp.name}' successfully updated!`);
      setEvalModalOpen(false);
      await fetchCompetencies();
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error('Failed to submit assessment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { key: 'ALL', label: 'All Frameworks' },
    { key: 'STATISTICAL', label: 'Statistical Domain' },
    { key: 'TECHNICAL', label: 'Technical & Analytics' },
    { key: 'DIGITAL_GOVERNANCE', label: 'Digital Governance' },
    { key: 'MANAGERIAL', label: 'Managerial & Ethics' },
  ];

  const filtered = competencies.filter((c) => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Competency Framework</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official 32-competency architecture for India's Official Statistical System
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search competencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedCategory === cat.key
                ? 'bg-gov-blue text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((comp) => {
          const rating = myCompetencies[comp.id]?.score || 0;
          const confidence = myCompetencies[comp.id]?.confidenceLevel || 'UNVERIFIED';

          return (
            <div
              key={comp.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                    {comp.code}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    rating >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : (rating >= 50 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')
                  }`}>
                    {confidence}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-medium">Verified Score</span>
                  <span className="font-extrabold text-slate-900">{rating} / 100</span>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      rating >= 75 ? 'bg-emerald-500' : (rating >= 50 ? 'bg-gov-accent' : 'bg-amber-500')
                    }`}
                    style={{ width: `${rating}%` }}
                  ></div>
                </div>

                <button
                  onClick={() => handleOpenEval(comp)}
                  className="w-full mt-3 py-1.5 border border-slate-200 hover:border-gov-blue hover:text-gov-blue text-slate-600 text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Update / Self-Assess</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Self Assessment */}
      {evalModalOpen && evalComp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Assess Competency</h3>
              <button onClick={() => setEvalModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4">
              <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                {evalComp.code}
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">{evalComp.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{evalComp.description}</p>

              <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">Self-Assessed Capability Rating</label>
                  <span className="text-base font-extrabold text-gov-blue">{evalScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={evalScore}
                  onChange={(e) => setEvalScore(Number(e.target.value))}
                  className="w-full accent-gov-blue cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
                  <span>0 (Novice)</span>
                  <span>50 (Intermediate)</span>
                  <span>100 (Expert Cadre)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEvalModalOpen(false)}
                className="w-1/2 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitEvaluation}
                disabled={submitting}
                className="w-1/2 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Save Evaluation'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
