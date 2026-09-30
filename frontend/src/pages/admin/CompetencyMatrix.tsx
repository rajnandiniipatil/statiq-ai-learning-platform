import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { CompetencyAnalytics } from '../../types';
import {
  Grid,
  Search,
  Filter,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export const CompetencyMatrixPage: React.FC = () => {
  const [competencies, setCompetencies] = useState<CompetencyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCompetencies();
  }, []);

  const fetchCompetencies = async () => {
    try {
      const data = await adminApi.getCompetencies();
      setCompetencies(data);
    } catch (err) {
      console.error('Error fetching competency matrix', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = competencies.filter((c) => {
    const matchesCat = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesSearch =
      c.competencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.competencyCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
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
          <h1 className="text-2xl font-bold text-slate-900">National Competency Matrix</h1>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            32 Cadre Competencies Mapped
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Enterprise workforce capability mapping across Statistical, Technical, Digital Governance, and Managerial domains.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search competency or code (e.g. STAT-SAMP, TECH-PYT)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'ALL', label: 'All 4 Domains' },
            { id: 'STATISTICAL', label: 'Statistical Core' },
            { id: 'TECHNICAL', label: 'Technical & Data Science' },
            { id: 'DIGITAL_GOVERNANCE', label: 'Digital Governance' },
            { id: 'MANAGERIAL', label: 'Behavioural & Management' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Competency Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Competency Name</th>
                <th className="py-3.5 px-4">Domain Category</th>
                <th className="py-3.5 px-4 text-center">Cadre Average</th>
                <th className="py-3.5 px-4 text-center">Benchmark</th>
                <th className="py-3.5 px-4 text-center">Average Gap</th>
                <th className="py-3.5 px-4 text-center">Cadre Demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.competencyId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-gov-blue">
                    {item.competencyCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.competencyName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800">
                    {item.averageScore}/100
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-gov-blue">
                    {item.benchmarkScore}/100
                  </td>
                  <td className="py-3 px-4 text-center font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.averageGap > 25
                          ? 'bg-rose-100 text-rose-700'
                          : item.averageGap > 10
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {item.averageGap > 0 ? `-${item.averageGap}` : '0'} pts
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.demandLevel === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : item.demandLevel === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.demandLevel || 'MEDIUM'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
