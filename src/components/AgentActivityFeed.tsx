import React from 'react';
import { useTutor } from '../context/TutorContext';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Cpu,
  Brain,
  Layers,
  Activity,
} from 'lucide-react';

export const AgentActivityFeed: React.FC<{ limit?: number }> = ({ limit = 8 }) => {
  const { agentActivities } = useTutor();
  const displayedActivities = agentActivities.slice(0, limit);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'profile':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-700">Profile</span>;
      case 'planning':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">Planner</span>;
      case 'tutoring':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">Tutor</span>;
      case 'assessment':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">Diagnostic</span>;
      case 'analysis':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">Gap Analysis</span>;
      case 'adaptation':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700">Adaptation</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">Agent</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Learning Agent Activity</h3>
            <p className="text-[11px] text-slate-400">Autonomous curriculum & pedagogical system events</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-ping"></span>
          Agent Online
        </span>
      </div>

      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {displayedActivities.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">No agent actions recorded yet.</p>
        ) : (
          displayedActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="mt-0.5 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {act.title}
                  </span>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    {getCategoryBadge(act.category)}
                    <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
