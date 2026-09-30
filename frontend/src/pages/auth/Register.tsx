import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('LEARNER');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Statistical Analyst');
  const [jobRole, setJobRole] = useState('Statistical Analyst');
  const [departmentId, setDepartmentId] = useState(1);
  const [yearsOfExperience, setYearsOfExperience] = useState(3);
  const [educationalQualification, setEducationalQualification] = useState('M.Sc. Statistics');
  const [currentAssignment, setCurrentAssignment] = useState('Sample Survey Processing');
  const [careerInterests, setCareerInterests] = useState('AI/ML & Data Science');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        fullName,
        email,
        password,
        role,
        employeeId: employeeId || `MOSPI-${Math.floor(1000 + Math.random() * 9000)}`,
        designation,
        jobRole,
        departmentId,
        yearsOfExperience,
        educationalQualification,
        currentAssignment,
        careerInterests,
      });
      navigate('/learner/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gov-blue text-white shadow-md mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Officer Registration</h2>
          <p className="text-xs text-slate-500 mt-1">
            Official Statistical Cadre • Capacity Building Platform
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Officer Name"
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Government Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@statiq.gov"
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs bg-white"
              >
                <option value="LEARNER">Statistical Officer / Learner</option>
                <option value="TRAINER">Trainer / Faculty Member</option>
                <option value="ADMIN">Ministry Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Job Role Benchmark</label>
              <select
                value={jobRole}
                onChange={(e) => {
                  setJobRole(e.target.value);
                  setDesignation(e.target.value);
                }}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs bg-white"
              >
                <option value="Statistical Analyst">Statistical Analyst</option>
                <option value="Statistical Investigator">Statistical Investigator</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Data Processing Officer">Data Processing Officer</option>
                <option value="GIS Analyst">GIS Analyst</option>
                <option value="Survey Officer">Survey Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Department</label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs bg-white"
              >
                <option value={1}>NSSO - Socio-Economic Division</option>
                <option value={2}>National Accounts Division (NAD)</option>
                <option value={3}>Economic Statistics Division (ESD)</option>
                <option value={4}>State Directorate of Economics (DES)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Years of Experience</label>
              <input
                type="number"
                min="0"
                max="40"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Educational Qualification</label>
              <input
                type="text"
                value={educationalQualification}
                onChange={(e) => setEducationalQualification(e.target.value)}
                placeholder="e.g. M.Sc. Statistics"
                className="mt-1 w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Current Assignment</label>
            <input
              type="text"
              value={currentAssignment}
              onChange={(e) => setCurrentAssignment(e.target.value)}
              placeholder="e.g. Periodic Labour Force Survey Microdata"
              className="mt-1 w-full px-3 py-2 border rounded-lg text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center py-2.5 px-4 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow transition disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-gov-blue hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};
