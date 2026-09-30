import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { CompetencyAnalytics } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Users,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

export const SkillGapAnalyticsPage: React.FC = () => {
  const [gaps, setGaps] = useState<CompetencyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [demandFilter, setDemandFilter] = useState('ALL');

  useEffect(() => {
    fetchGaps();
  }, []);

  const fetchGaps = async () => {
    try {
      const data = await adminApi.getSkillGaps();
      setGaps(data);
    } catch (err) {
      console.error('Error fetching skill gaps', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = gaps.filter((g) => {
    const matchesDemand = demandFilter === 'ALL' || g.demandLevel === demandFilter;
    const matchesSearch =
      g.competencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.competencyCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDemand && matchesSearch;
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
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-slate-900">Cadre Skill Gap Intelligence</h1>
          <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-200">
            Deficit Analysis
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Identified statistical and analytical deficits across the official cadre to prioritize ministerial training investments.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search deficits by competency or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={demandFilter}
            onChange={(e) => setDemandFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-gov-blue focus:outline-none"
          >
            <option value="ALL">All Demand Priorities</option>
            <option value="CRITICAL">Critical Urgency</option>
            <option value="HIGH">High Demand</option>
            <option value="MEDIUM">Medium Demand</option>
          </select>
        </div>
      </div>

      {/* Skill Gaps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.competencyId}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.competencyCode}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    item.demandLevel === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {item.demandLevel} Demand
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{item.competencyName}</h3>
              <p className="text-xs text-slate-500">Domain: {item.category}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Current Cadre Mean:</span>
                  <strong className="text-slate-800">{item.averageScore}/100</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cadre Benchmark:</span>
                  <strong className="text-gov-blue">{item.benchmarkScore}/100</strong>
                </div>
                <div className="flex justify-between text-rose-600 font-semibold pt-1 border-t border-slate-200">
                  <span>Cadre Deficit:</span>
                  <span>-{item.averageGap} pts</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center">
                <Users className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {item.affectedEmployeesCount} Officers Need Upgrading
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
