import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  LogOut, 
  User as UserIcon, 
  Sparkles, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout, quickDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (target: 'learner' | 'trainer' | 'admin') => {
    await quickDemoLogin(target);
    if (target === 'learner') navigate('/learner/dashboard');
    else if (target === 'trainer') navigate('/trainer/dashboard');
    else if (target === 'admin') navigate('/admin/dashboard');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-purple-200">Admin</span>;
      case 'ROLE_TRAINER':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">Trainer</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-200">Learner</span>;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Ministry Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gov-blue to-gov-navy flex items-center justify-center text-white font-bold shadow-md">
            <span className="text-xl tracking-tighter">SQ</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">StatIQ</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300">
                SIH26101
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              India's Official Statistical System • MoSPI / NSSO Capacity Building
            </p>
          </div>
        </div>

        {/* Center: iGOT Integration Status Sandbox Badge */}
        <div className="hidden md:flex items-center bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
          <span>iGOT Integration — Prototype / Sandbox</span>
        </div>

        {/* Right: User Menu & Role Switcher */}
        <div className="flex items-center space-x-4">
          
          {/* Quick Demo Switcher */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-400 px-2 font-medium">Demo Role:</span>
            <button
              onClick={() => handleRoleSwitch('learner')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                role === 'ROLE_LEARNER'
                  ? 'bg-white text-gov-blue shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Learner
            </button>
            <button
              onClick={() => handleRoleSwitch('trainer')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                role === 'ROLE_TRAINER'
                  ? 'bg-white text-emerald-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trainer
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                role === 'ROLE_ADMIN'
                  ? 'bg-white text-purple-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* User Badge */}
          <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-sm">
              {user?.fullName ? user.fullName.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-slate-800 leading-none">{user?.fullName || 'Officer'}</span>
                {getRoleBadge()}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {user?.designation || user?.jobRole || 'Official'}
              </span>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
