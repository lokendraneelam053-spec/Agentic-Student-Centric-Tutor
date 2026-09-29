import React from 'react';
import { useTutor } from '../context/TutorContext';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const LearningPlanView: React.FC = () => {
  const {
    plan,
    profile,
    currentStepIndex,
    setCurrentStepIndex,
    setActiveTab,
    handleAdaptPlan,
    isAdaptingPlan,
    latestEvaluation,
  } = useTutor();

  const handleStartStep = (idx: number) => {
    setCurrentStepIndex(idx);
    setActiveTab('ai-tutor');
  };

  const getStepTypeBadge = (type: string, isRemedial?: boolean) => {
    if (isRemedial) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          ⚡ Adaptively Inserted Remedial
        </span>
      );
    }
    switch (type) {
      case 'prerequisite':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">Prerequisite</span>;
      case 'concept':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Concept Theory</span>;
      case 'worked_example':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Worked Example</span>;
      case 'guided_practice':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Guided Practice</span>;
      case 'assessment':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Diagnostic Assessment</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">Core Phase</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>Personalized Adaptive Curriculum</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {plan ? plan.planTitle : `${profile.topic} — ${profile.availableTime}-Minute Learning Plan`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {plan?.summary || `Generated for ${profile.name} based on ${profile.knowledgeLevel} knowledge level and ${profile.goal} objective.`}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => handleAdaptPlan()}
              disabled={isAdaptingPlan || !latestEvaluation}
              className="px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold transition flex items-center space-x-2 cursor-pointer disabled:opacity-40"
              title="Re-run adaptation loop based on diagnostic assessment"
            >
              <RotateCcw className={`w-4 h-4 text-amber-600 ${isAdaptingPlan ? 'animate-spin' : ''}`} />
              <span>{isAdaptingPlan ? 'Adapting...' : 'Trigger Adaptive Replanning'}</span>
            </button>
          </div>
        </div>

        {/* Plan Parameters Strip */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Topic / Subject</span>
            <span className="font-bold text-slate-800">{profile.topic}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Knowledge Level</span>
            <span className="font-bold text-indigo-700">{profile.knowledgeLevel}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Target Goal</span>
            <span className="font-bold text-slate-800">{profile.goal}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Budgeted Duration</span>
            <span className="font-bold text-emerald-700 font-mono">{profile.availableTime} Minutes</span>
          </div>
        </div>

        {plan?.adaptedCount && plan.adaptedCount > 0 ? (
          <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Adaptive Intervention Active:</strong> The agent re-structured this plan to insert targeted remediation based on diagnostic assessment results.
            </span>
          </div>
        ) : null}
      </div>

      {/* Plan Timeline Steps */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wider px-1">
          Curriculum Timeline & Learning Phases
        </h3>

        {plan ? (
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
            {plan.steps.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isCompleted = step.status === 'completed';

              return (
                <div key={step.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                        : 'bg-white border-2 border-slate-300 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>

                  {/* Step Card */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                        : isCompleted
                        ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-extrabold text-base text-slate-900">
                          {idx + 1}. {step.title}
                        </span>
                        {getStepTypeBadge(step.type, step.isRemedial)}
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{step.durationMinutes} min</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 font-semibold">Mastery Objective: </strong>
                        <span>{step.learningObjective}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-xs font-medium">
                        {isCompleted ? (
                          <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Phase Completed</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="text-indigo-700 font-semibold">Current Active Phase</span>
                        ) : (
                          <span className="text-slate-400">Scheduled</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStartStep(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                            : 'bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isCurrent ? 'Teach in AI Tutor' : 'Jump to this Phase'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No active learning plan created yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
