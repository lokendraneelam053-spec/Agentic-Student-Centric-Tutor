import React from 'react';
import { useTutor } from '../context/TutorContext';
import {
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Bookmark,
  Cpu,
} from 'lucide-react';

export const MyLearningView: React.FC = () => {
  const {
    profile,
    plan,
    currentStepIndex,
    setCurrentStepIndex,
    setActiveTab,
    handleGenerateAssessment,
    isGeneratingAssessment,
    handleCompleteCurrentStep,
  } = useTutor();

  const activeStep = plan?.steps?.[currentStepIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Active Learning Module Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Current Academic Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {profile.topic}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {profile.subject} • {profile.branch} (Semester {profile.semester})
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition flex items-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Enter Tutoring Session</span>
            </button>
          </div>
        </div>

        {/* Progress Strip */}
        {plan && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Course Unit Progress</span>
              <span className="font-mono text-indigo-400 font-bold">
                {Math.round(((currentStepIndex + 1) / plan.steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(((currentStepIndex + 1) / plan.steps.length) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid: Active Phase Card + Key Concept Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Phase Focus */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  Step {currentStepIndex + 1} of {plan?.steps?.length || 5}
                </span>
                <span className="text-xs text-slate-500">• In Progress</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {activeStep?.durationMinutes || 7} min
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-2">
              {activeStep?.title || 'Prerequisite Check & System Context'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              {activeStep?.description ||
                'Examine baseline physical properties and establish boundary equations.'}
            </p>

            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 mb-6">
              <p className="font-bold text-indigo-900 mb-1">Target Mastery Objective:</p>
              <p className="leading-relaxed">{activeStep?.learningObjective}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCompleteCurrentStep}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mark Step Completed</span>
              </button>

              <button
                onClick={() => setActiveTab('ai-tutor')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center space-x-2 cursor-pointer"
              >
                <span>Launch Interactive Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Module Step Navigation Cards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider mb-4">
              All Units in this Lesson
            </h3>

            <div className="space-y-2.5">
              {plan?.steps.map((st, i) => {
                const isSelected = i === currentStepIndex;
                const isDone = st.status === 'completed';

                return (
                  <div
                    key={st.id}
                    onClick={() => setCurrentStepIndex(i)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500'
                        : isDone
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isDone ? '✓' : i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {st.title}
                          </span>
                          {st.isRemedial && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              Remedial
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{st.learningObjective}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-medium text-slate-400 shrink-0">
                      {st.durationMinutes}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Subject Summary Card & Diagnostic Test Trigger */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-800 mb-2">Subject Context</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Branch</span>
                <span className="font-bold text-slate-800 text-xs">{profile.branch}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester / Term</span>
                <span className="font-bold text-slate-800 text-xs">Semester {profile.semester}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pedagogical Profile</span>
                <span className="font-bold text-indigo-700 text-xs">{profile.knowledgeLevel} • {profile.goal}</span>
              </div>
            </div>

            <button
              onClick={() => handleGenerateAssessment()}
              disabled={isGeneratingAssessment}
              className="mt-5 w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isGeneratingAssessment ? 'Preparing...' : 'Take Unit Diagnostic Test'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
