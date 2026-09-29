import React from 'react';
import { useTutor } from '../context/TutorContext';
import { ActiveNavTab } from '../types';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquareCode,
  CalendarDays,
  FileCheck2,
  TrendingUp,
  UserCheck,
  Sparkles,
  ChevronRight,
  Clock,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, profile, plan, currentStepIndex } = useTutor();

  const navItems: Array<{ id: ActiveNavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'my-learning', label: 'My Learning', icon: <BookOpen className="w-5 h-5" />, badge: plan ? 'Active' : undefined },
    { id: 'ai-tutor', label: 'AI Tutor', icon: <MessageSquareCode className="w-5 h-5" /> },
    { id: 'learning-plan', label: 'Learning Plan', icon: <CalendarDays className="w-5 h-5" />, badge: plan ? `${plan.steps?.length} steps` : undefined },
    { id: 'assessments', label: 'Assessments', icon: <FileCheck2 className="w-5 h-5" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'student-profile', label: 'Student Profile', icon: <UserCheck className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Subject Topic Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-400">Current Unit</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
            {profile.availableTime}m
          </span>
        </div>
        <h3 className="font-bold text-sm text-slate-100 line-clamp-1" title={profile.topic}>
          {profile.topic}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-1">{profile.subject}</p>

        {plan && (
          <div className="mt-3 pt-2.5 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Plan Progress</span>
              <span className="font-mono text-indigo-400">
                Step {currentStepIndex + 1} of {plan.steps.length}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((currentStepIndex + 1) / plan.steps.length) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-200" />}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Student Profile Quick Card in Sidebar Bottom */}
      <div className="p-3 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white text-sm shadow">
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{profile.name}</p>
            <p className="text-[11px] text-slate-400 truncate">Sem {profile.semester} • {profile.goal}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
