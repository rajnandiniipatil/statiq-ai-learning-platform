import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, ArrowRight, UserCheck, GraduationCap, BarChart3, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/learner/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async (role: 'learner' | 'trainer' | 'admin') => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin(role);
      if (role === 'learner') navigate('/learner/dashboard');
      else if (role === 'trainer') navigate('/trainer/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err: any) {
      setError('Could not connect to backend server. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gov-navy to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Header Branding */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gov-blue to-gov-accent shadow-xl text-white mb-4">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">StatIQ Platform</h1>
        <p className="mt-1 text-sm font-medium text-slate-300">
          AI Skill Intelligence & Personalized Learning System
        </p>
        <p className="text-xs text-sky-400 font-semibold tracking-wide uppercase mt-1">
          Ministry of Statistics & Programme Implementation (MoSPI) • SIH26101
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-100">
          
          {error && (
            <div className="mb-5 bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-start space-x-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo One-Click Access Buttons */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Instant Jury / Evaluator Access:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn('learner')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-gov-blue transition group"
              >
                <UserCheck className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Learner</span>
                <span className="text-[9px] text-blue-600">Officer Profile</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('trainer')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-800 transition group"
              >
                <GraduationCap className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Trainer</span>
                <span className="text-[9px] text-emerald-600">Question Studio</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('admin')}
                disabled={loading}
                className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-900 transition group"
              >
                <BarChart3 className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Admin</span>
                <span className="text-[9px] text-purple-600">Workforce KPIs</span>
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Official Government Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@statiq.gov"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-gov-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gov-blue focus:border-gov-blue"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Demo password: Statiq@2025</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gov-blue hover:bg-gov-navy focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-blue transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In to StatIQ
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>New officer? </span>
            <Link to="/register" className="font-semibold text-gov-blue hover:underline">
              Create an official profile
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
