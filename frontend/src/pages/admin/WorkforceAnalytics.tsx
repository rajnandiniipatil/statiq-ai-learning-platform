import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/client';
import { DepartmentAnalytics } from '../../types';
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';

export const WorkforceAnalyticsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await adminApi.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDepts = departments.filter(
    (d) =>
      d.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.departmentCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-slate-900">Workforce & Departmental Intelligence</h1>
          <span className="bg-indigo-100 text-gov-blue text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
            Cadre Analytics
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Comparative capacity evaluation across National Sample Survey (NSSO), National Accounts Division (NAD), Economic Statistics Division (ESD), and State DES offices.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search departments by name or division code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-gov-blue focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {filteredDepts.length} Divisions Active
        </span>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDepts.map((dept) => (
          <div
            key={dept.departmentId}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded">
                    {dept.departmentCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{dept.departmentName}</h3>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Officers</span>
                <span className="text-lg font-bold text-slate-800">{dept.employeeCount}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Avg Score</span>
                <span className="text-lg font-bold text-slate-800">{dept.averageCompetencyScore}/100</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Completion</span>
                <span className="text-lg font-bold text-emerald-600">{dept.trainingCompletionRate}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-rose-500 block">Critical Gaps</span>
                <span className="text-lg font-bold text-rose-600">{dept.criticalGapsCount}</span>
              </div>
            </div>

            {/* Competency Health Bar */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Cadre Competency Readiness</span>
                <span className="font-bold text-slate-800">{dept.averageCompetencyScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gov-blue h-2 rounded-full"
                  style={{ width: `${dept.averageCompetencyScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
