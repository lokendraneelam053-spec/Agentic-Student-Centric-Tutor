import React from 'react';
import { useTutor } from '../context/TutorContext';
import {
  UserCheck,
  Target,
  FileSpreadsheet,
  GraduationCap,
  FileCheck2,
  LineChart,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdaptiveCycleWidget: React.FC = () => {
  const { activeTab, plan, latestEvaluation } = useTutor();

  // Determine current cycle stage
  let currentStageIndex = 0;
  if (latestEvaluation && plan?.adaptedCount && plan.adaptedCount > 0) {
    currentStageIndex = 7; // ADAPT LEARNING PLAN / CONTINUE
  } else if (latestEvaluation) {
    currentStageIndex = 5; // ANALYZE PERFORMANCE / IDENTIFY GAPS
  } else if (activeTab === 'assessments') {
    currentStageIndex = 4; // ASSESS
  } else if (activeTab === 'ai-tutor' || activeTab === 'my-learning') {
    currentStageIndex = 3; // TEACH
  } else if (plan) {
    currentStageIndex = 2; // CREATE LEARNING PLAN
  } else {
    currentStageIndex = 0; // UNDERSTAND STUDENT
  }

  const cycleSteps = [
    { title: 'Understand Student', icon: <UserCheck className="w-4 h-4" /> },
    { title: 'Set Goal', icon: <Target className="w-4 h-4" /> },
    { title: 'Create Plan', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { title: 'Teach', icon: <GraduationCap className="w-4 h-4" /> },
    { title: 'Assess', icon: <FileCheck2 className="w-4 h-4" /> },
    { title: 'Analyze', icon: <LineChart className="w-4 h-4" /> },
    { title: 'Identify Gaps', icon: <AlertTriangle className="w-4 h-4" /> },
    { title: 'Adapt Plan', icon: <RefreshCw className="w-4 h-4" /> },
    { title: 'Continue Learning', icon: <ArrowRight className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Intelligent Adaptive Learning Cycle
          </h4>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
          Stage {currentStageIndex + 1} of 9: <strong className="text-indigo-600">{cycleSteps[currentStageIndex].title}</strong>
        </span>
      </div>

      {/* Cycle Horizontal Flow */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 sm:gap-2 pt-1">
        {cycleSteps.map((step, idx) => {
          const isCurrent = idx === currentStageIndex;
          const isCompleted = idx < currentStageIndex;

          return (
            <div
              key={step.title}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                isCurrent
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 ring-offset-1 shadow-md scale-105 z-10'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                  : 'bg-slate-50 text-slate-500 border border-slate-200/60'
              }`}
            >
              <div className={`mb-1 ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                {step.icon}
              </div>
              <span className={`text-[10px] leading-tight font-semibold line-clamp-2 ${isCurrent ? 'text-white' : ''}`}>
                {step.title}
              </span>
              {isCompleted && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
