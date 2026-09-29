import React from 'react';
import { useTutor } from '../context/TutorContext';
import { AdaptiveCycleWidget } from '../components/AdaptiveCycleWidget';
import { AgentActivityFeed } from '../components/AgentActivityFeed';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Clock,
  Target,
  BarChart3,
  Lightbulb,
  Play,
  RotateCcw,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    profile,
    plan,
    currentStepIndex,
    setActiveTab,
    latestEvaluation,
    handleGenerateAssessment,
    handleAdaptPlan,
    isGeneratingAssessment,
    isAdaptingPlan,
    setShowOnboardingModal,
  } = useTutor();

  const activeStep = plan?.steps?.[currentStepIndex];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome & Student Context Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Intelligent Tutoring Session Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Curriculum dynamically calibrated for <strong className="text-white">{profile.subject}</strong>: <span className="text-indigo-300 font-semibold">{profile.topic}</span> ({profile.branch}, Sem {profile.semester}).
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition flex items-center space-x-2 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Resume AI Tutor</span>
            </button>
            <button
              onClick={() => handleGenerateAssessment()}
              disabled={isGeneratingAssessment}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>{isGeneratingAssessment ? 'Generating...' : 'Take Assessment'}</span>
            </button>
          </div>
        </div>

        {/* Quick Context Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Knowledge Level</span>
            <span className="font-bold text-white text-sm">{profile.knowledgeLevel}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Learning Goal</span>
            <span className="font-bold text-indigo-300 text-sm">{profile.goal}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Allocated Time</span>
            <span className="font-bold text-white text-sm font-mono">{profile.availableTime} Minutes</span>
          </div>
          <div>
            <span className="text-slate-400 block">Overall Progress</span>
            <span className="font-bold text-emerald-400 text-sm font-mono">{profile.overallProgress}%</span>
          </div>
        </div>
      </div>

      {/* Adaptive Learning Cycle Flow */}
      <AdaptiveCycleWidget />

      {/* Recommended Next Step Section (Prominent requirement) */}
      {latestEvaluation?.recommendedNextStep && (
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-white border border-amber-300/80 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Recommended Next Step
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                    {latestEvaluation.recommendedNextStep.actionType === 'remedial' ? 'Targeted Remediation' : 'Advancement'}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {latestEvaluation.recommendedNextStep.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {latestEvaluation.recommendedNextStep.rationale}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => handleAdaptPlan()}
                disabled={isAdaptingPlan}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${isAdaptingPlan ? 'animate-spin' : ''}`} />
                <span>{isAdaptingPlan ? 'Adapting Plan...' : 'Adapt Learning Plan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Learning Plan Overview + Knowledge Gap Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Current Learning Plan Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900">Personalized Learning Plan</h3>
                <p className="text-xs text-slate-500">
                  {plan ? plan.planTitle : `${profile.topic} — ${profile.availableTime}-Minute Schedule`}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('learning-plan')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {plan ? (
              <div className="space-y-3">
                {plan.steps.map((step, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  const isDone = step.status === 'completed';

                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500/30'
                          : isDone
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200/80 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                              {step.title}
                            </span>
                            {step.isRemedial && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                Adaptive Remedial
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{step.learningObjective}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {step.durationMinutes}m
                        </span>
                        {isCurrent && (
                          <button
                            onClick={() => setActiveTab('ai-tutor')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition cursor-pointer"
                          >
                            Teach Now
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No active plan generated yet</p>
                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition cursor-pointer"
                >
                  Generate Plan Now
                </button>
              </div>
            )}
          </div>

          {/* Diagnostic Knowledge Gap Analysis Card */}
          {latestEvaluation ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Diagnostic Knowledge Gap Analysis</h3>
                    <p className="text-[11px] text-slate-400">Concept mastery derived from recent assessment</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  Overall Score: {latestEvaluation.scorePercentage}%
                </span>
              </div>

              {/* Concept Mastery Bars */}
              <div className="space-y-3.5">
                {latestEvaluation.conceptMastery.map((item) => {
                  const isWeak = item.score < 60;
                  const isModerate = item.score >= 60 && item.score < 75;
                  const isStrong = item.score >= 75;

                  return (
                    <div key={item.concept}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-800 font-semibold">{item.concept}</span>
                        <span
                          className={`font-mono font-bold ${
                            isWeak ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {item.score}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWeak
                              ? 'bg-rose-500'
                              : isModerate
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Understood vs Requiring Improvement pills */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Concepts Understood</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {latestEvaluation.conceptsUnderstood.length > 0 ? (
                      latestEvaluation.conceptsUnderstood.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded bg-white text-emerald-900 border border-emerald-200 text-[11px] font-medium">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Requires baseline reinforcement</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/70">
                  <div className="flex items-center space-x-1.5 text-rose-800 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Concepts Requiring Improvement</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {latestEvaluation.conceptsNeedingImprovement.length > 0 ? (
                      latestEvaluation.conceptsNeedingImprovement.map(c => (
                        <span key={c} className="px-2 py-0.5 rounded bg-white text-rose-900 border border-rose-200 text-[11px] font-medium">
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-emerald-700 italic text-[11px]">All evaluated concepts meet mastery threshold!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Diagnostic Knowledge Gap Analysis</h3>
                  <p className="text-[11px] text-slate-400">Concept mastery derived from diagnostic assessments</p>
                </div>
              </div>
              <div className="text-center py-6 px-4 bg-slate-50/70 rounded-2xl border border-slate-200/70">
                <FileCheck2 className="w-9 h-9 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-800">No Assessments Completed Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Take a quick diagnostic test for <strong>{profile.topic}</strong> to measure your concept strengths and unlock targeted knowledge gap detection.
                </p>
                <button
                  onClick={() => setActiveTab('assessments')}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5 mx-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Take Diagnostic Assessment →</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: High-level Agent Activity Feed */}
        <div className="space-y-6">
          <AgentActivityFeed limit={7} />

          {/* Quick Info Card: Cruz AI Architecture Readiness */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Architecture Note</span>
            </div>
            <h4 className="font-bold text-sm text-slate-100">Intelligent Academic Tutoring Engine</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Designed for expansion into full MERN-stack architecture with Cruz AI agentic layer. Maintains localized student state, dynamic planning, diagnostic grading, and adaptive replanning loops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
