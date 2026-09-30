import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UserCheck,
  Target,
  AlertTriangle,
  Lightbulb,
  Route,
  BookOpen,
  ClipboardCheck,
  Bot,
  UploadCloud,
  FileQuestion,
  GraduationCap,
  BarChart3,
  Users,
  Compass,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const learnerNav = [
    { name: 'Dashboard', path: '/learner/dashboard', icon: LayoutDashboard },
    { name: 'Officer Profile', path: '/learner/profile', icon: UserCheck },
    { name: 'Competencies', path: '/learner/competencies', icon: Target },
    { name: 'Skill Gap Analysis', path: '/learner/skill-gaps', icon: AlertTriangle },
    { name: 'AI Recommendations', path: '/learner/recommendations', icon: Lightbulb },
    { name: 'Learning Roadmap', path: '/learner/learning-path', icon: Route },
    { name: 'iGOT Courses', path: '/learner/courses', icon: BookOpen },
    { name: 'Assessments & Quizzes', path: '/learner/quiz', icon: ClipboardCheck },
    { name: 'AI Learning Assistant', path: '/learner/assistant', icon: Bot },
  ];

  const trainerNav = [
    { name: 'Trainer Dashboard', path: '/trainer/dashboard', icon: GraduationCap },
    { name: 'Upload Materials', path: '/trainer/materials', icon: UploadCloud },
    { name: 'AI Question Generator', path: '/trainer/question-generator', icon: FileQuestion },
    { name: 'Manage Assessments', path: '/trainer/assessments', icon: Layers },
  ];

  const adminNav = [
    { name: 'Workforce Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Department Cadres', path: '/admin/workforce', icon: Users },
    { name: 'Competency Matrix', path: '/admin/competencies', icon: Target },
    { name: 'Skill Gap Analytics', path: '/admin/skill-gaps', icon: AlertTriangle },
    { name: 'Training Utilization', path: '/admin/analytics', icon: Compass },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen">
      
      {/* Cadre Indicator */}
      <div className="px-5 py-4 border-b border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Portal</span>
        <h2 className="text-sm font-semibold text-white mt-0.5">
          {role === 'ROLE_ADMIN' ? 'Ministry Administration' : (role === 'ROLE_TRAINER' ? 'Faculty & Training Studio' : 'Officer Learning Portal')}
        </h2>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        
        {/* Learner Navigation */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Learner Workspace
          </div>
          <div className="space-y-1">
            {learnerNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gov-blue text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Trainer Navigation (Shown if Trainer or Admin) */}
        {(role === 'ROLE_TRAINER' || role === 'ROLE_ADMIN') && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Training & Materials
            </div>
            <div className="space-y-1">
              {trainerNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

        {/* Admin Navigation (Shown if Admin) */}
        {role === 'ROLE_ADMIN' && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-purple-400">
              Executive Analytics
            </div>
            <div className="space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-purple-700 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}

      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300">National Statistical System</p>
        <p className="text-[10px] text-slate-400 mt-0.5">MoSPI • Capacity Building Unit</p>
      </div>

    </aside>
  );
};
