import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { competencyApi } from '../../api/client';
import { SkillGap, SkillGapSummary, GapClassification } from '../../types';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  BookOpen,
  Filter,
  Search,
  ArrowRight,
  Sparkles,
  Info,
  ShieldAlert,
  Layers
} from 'lucide-react';

export const SkillGapsPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<SkillGapSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSkillGaps();
  }, []);

  const fetchSkillGaps = async () => {
    try {
      const data = await competencyApi.getSkillGapSummary();
      setSummary(data);
    } catch (err) {
      console.error('Error fetching skill gaps', err);
    } finally {
      setLoading(false);
    }
  };

  const getClassificationBadge = (classification: GapClassification) => {
    switch (classification) {
      case 'CRITICAL_GAP':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" />
            Critical Gap (51–100)
          </span>
        );
      case 'SIGNIFICANT_GAP':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Significant Gap (26–50)
          </span>
        );
      case 'MODERATE_GAP':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Info className="w-3.5 h-3.5 mr-1" />
            Moderate Gap (11–25)
          </span>
        );
      case 'STRONG':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1" />
            Strong (0–10)
          </span>
        );
      default:
        return null;
    }
  };

  const filteredGaps = (summary?.gaps || []).filter((g) => {
    const matchesFilter =
      selectedFilter === 'ALL' ||
      (selectedFilter === 'CRITICAL' && g.classification === 'CRITICAL_GAP') ||
      (selectedFilter === 'SIGNIFICANT' && g.classification === 'SIGNIFICANT_GAP') ||
      (selectedFilter === 'MODERATE' && g.classification === 'MODERATE_GAP') ||
      (selectedFilter === 'STRONG' && g.classification === 'STRONG');

    const matchesSearch =
      g.competencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.competencyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">Skill Gap Detection Engine</h1>
            <span className="bg-indigo-100 text-gov-blue text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              Role: {summary?.jobRole || 'Statistical Analyst'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Algorithmic benchmark comparison against official cadre standards for India's Statistical System.
          </p>
        </div>

        <button
          onClick={() => navigate('/learner/recommendations')}
          className="inline-flex items-center px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-sm font-medium rounded-xl shadow-sm transition-colors"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          View AI Remedial Training
        </button>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Benchmark Alignment</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {Math.max(0, 100 - (summary?.overallGap || 0))}%
            </span>
            <span className="text-xs text-slate-400">Target 100%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gov-blue h-1.5 rounded-full"
              style={{ width: `${Math.max(0, 100 - (summary?.overallGap || 0))}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-sm">
          <span className="text-xs font-semibold text-rose-700">Critical Gaps</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-rose-700">{summary?.criticalGapCount || 0}</span>
            <span className="text-xs text-rose-500 font-medium">Gap &gt; 50 pts</span>
          </div>
          <p className="text-[11px] text-rose-600 mt-2">Urgent intervention recommended</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <span className="text-xs font-semibold text-amber-700">Significant Gaps</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-700">{summary?.significantGapCount || 0}</span>
            <span className="text-xs text-amber-500 font-medium">Gap 26–50 pts</span>
          </div>
          <p className="text-[11px] text-amber-600 mt-2">Targeted capacity building needed</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm">
          <span className="text-xs font-semibold text-blue-700">Moderate Gaps</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-700">{summary?.moderateGapCount || 0}</span>
            <span className="text-xs text-blue-500 font-medium">Gap 11–25 pts</span>
          </div>
          <p className="text-[11px] text-blue-600 mt-2">Refresher modular training</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700">Strong Competencies</span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-700">{summary?.strongCount || 0}</span>
            <span className="text-xs text-emerald-500 font-medium">At benchmark</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-2">Meets cadre requirements</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search competency, code or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gov-blue"
          />
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'CRITICAL', label: 'Critical' },
            { id: 'SIGNIFICANT', label: 'Significant' },
            { id: 'MODERATE', label: 'Moderate' },
            { id: 'STRONG', label: 'Strong' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === tab.id
                  ? 'bg-gov-blue text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Skill Gap Cards */}
      <div className="space-y-4">
        {filteredGaps.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No skill gaps found in this filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or filter tags.</p>
          </div>
        ) : (
          filteredGaps.map((gap) => (
            <div
              key={gap.competencyId}
              className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${
                gap.classification === 'CRITICAL_GAP'
                  ? 'border-rose-200 bg-rose-50/10'
                  : gap.classification === 'SIGNIFICANT_GAP'
                  ? 'border-amber-200 bg-amber-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Competency info */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {gap.competencyCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{gap.competencyName}</h3>
                    {getClassificationBadge(gap.classification)}
                  </div>
                  <p className="text-xs text-slate-500">{gap.categoryLabel}</p>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    <span className="font-semibold text-slate-700">Diagnosis: </span>
                    {gap.explanation}
                  </p>
                  <div className="flex items-center text-xs text-indigo-700 bg-indigo-50/80 px-2.5 py-1.5 rounded-lg border border-indigo-100 mt-2">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-indigo-600" />
                    <span><strong>Action Plan: </strong>{gap.recommendedAction}</span>
                  </div>
                </div>

                {/* Score and Gap Gauge */}
                <div className="flex flex-col sm:flex-row items-center gap-6 lg:border-l lg:border-slate-100 lg:pl-6">
                  <div className="w-full sm:w-48 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Current Level</span>
                      <span className="font-bold text-slate-900">{gap.currentLevel}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          gap.currentLevel >= gap.requiredLevel
                            ? 'bg-emerald-500'
                            : gap.currentLevel >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${gap.currentLevel}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Cadre Required</span>
                      <span className="font-bold text-gov-blue">{gap.requiredLevel}/100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gov-blue"
                        style={{ width: `${gap.requiredLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Calculated Gap Badge & Action */}
                  <div className="text-center sm:text-right flex flex-row sm:flex-col items-center justify-between sm:justify-center w-full sm:w-32 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Identified Gap</span>
                      <span
                        className={`text-xl font-extrabold ${
                          gap.gap > 50
                            ? 'text-rose-600'
                            : gap.gap > 25
                            ? 'text-amber-600'
                            : gap.gap > 10
                            ? 'text-blue-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {gap.gap > 0 ? `-${gap.gap}` : '0'} pts
                      </span>
                    </div>

                    <button
                      onClick={() => navigate('/learner/recommendations')}
                      className="text-xs font-semibold text-gov-blue hover:text-gov-navy flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Remediate <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
