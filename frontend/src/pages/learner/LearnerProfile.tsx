import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/client';
import { UserProfile } from '../../types';
import { 
  UserCheck, 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Calendar, 
  Compass, 
  BookOpen, 
  FileText 
} from 'lucide-react';

export const LearnerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getCurrentUser();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching officer profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Profile Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gov-blue to-gov-navy text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {profile?.fullName ? profile.fullName.charAt(0) : 'O'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">{profile?.fullName}</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active Cadre
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {profile?.designation} • {profile?.departmentName}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Email: <span className="text-slate-600 font-mono">{profile?.email}</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400">Employee ID</span>
          <p className="text-sm font-extrabold text-gov-blue font-mono">{profile?.employeeId}</p>
        </div>
      </div>

      {/* Profile Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Career & Official Postings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3 border-slate-100">
            <Briefcase className="w-4 h-4 text-gov-blue" />
            <h2 className="text-sm font-bold text-slate-900">Official Posting & Cadre</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Department / Division</span>
              <p className="text-slate-800 font-semibold mt-0.5">{profile?.departmentName || 'National Sample Survey Office (NSSO)'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Designation</span>
              <p className="text-slate-800 font-semibold mt-0.5">{profile?.designation || 'Statistical Analyst'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Benchmark Job Role</span>
              <p className="text-slate-800 font-semibold mt-0.5">{profile?.jobRole || 'Statistical Analyst'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Total Experience in Official Statistics</span>
              <p className="text-slate-800 font-semibold mt-0.5">{profile?.yearsOfExperience || 3} Years</p>
            </div>
          </div>
        </div>

        {/* Academic Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b pb-3 border-slate-100">
            <GraduationCap className="w-4 h-4 text-gov-blue" />
            <h2 className="text-sm font-bold text-slate-900">Academic & Prior Training</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Highest Qualification</span>
              <p className="text-slate-800 font-semibold mt-0.5">{profile?.educationalQualification || 'M.Sc. Statistics'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Previous In-Service Training Programs</span>
              <p className="text-slate-800 font-semibold mt-0.5">
                {profile?.previousTraining || 'Induction Training at NSSTA, Basic Python for Data Analysis'}
              </p>
            </div>
          </div>
        </div>

        {/* Operational Assignment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2 border-b pb-3 border-slate-100">
            <FileText className="w-4 h-4 text-gov-blue" />
            <h2 className="text-sm font-bold text-slate-900">Current Assignment & Specialization Interests</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Current Operational Assignment</span>
              <p className="text-slate-800 font-medium mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                {profile?.currentAssignment || 'Periodic Labour Force Survey (PLFS) Microdata Validation & Anomaly Audits'}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Career Development & Technical Interests</span>
              <p className="text-slate-800 font-medium mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                {profile?.careerInterests || 'Advanced Machine Learning in Official Statistics, Geospatial Analytics, Automated Dissemination'}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
