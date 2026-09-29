import React from 'react';
import { useTutor } from '../context/TutorContext';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCheck2,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { profile, latestEvaluation, handleAdaptPlan, isAdaptingPlan, setActiveTab } = useTutor();

  const masteryData = latestEvaluation?.conceptMastery || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Student Progress & Mastery Analytics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Learning Mastery Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Continuously aggregated from tutoring interactions and diagnostic evaluations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl font-mono">
              Total Sessions: {profile.sessionsCount}
            </span>
          </div>
        </div>

        {/* 4 Key Academic Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">Overall Progress</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-mono mt-1">
              {profile.overallProgress}%
            </div>
            <div className="w-full h-1.5 bg-indigo-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${profile.overallProgress}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Recent Diagnostic</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-mono mt-1">
              {latestEvaluation ? `${latestEvaluation.scorePercentage}%` : '—'}
            </div>
            <span className="text-[11px] text-emerald-800 font-medium">
              {latestEvaluation ? 'Diagnostic score' : 'Not tested yet'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
            <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider">Completed Topics</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-950 font-mono mt-1">
              {profile.completedTopics.length}
            </div>
            <span className="text-[11px] text-sky-800 font-medium">Verified syllabus units</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Knowledge Gaps</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-950 font-mono mt-1">
              {profile.improvementAreas.length}
            </div>
            <span className="text-[11px] text-amber-800 font-medium">Targeted for remediation</span>
          </div>
        </div>
      </div>

      {/* Section 11: Recommended Next Step (Required) */}
      {latestEvaluation?.recommendedNextStep && (
        <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-white border border-amber-300 rounded-3xl p-6 shadow-xs">
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
                    {latestEvaluation.recommendedNextStep.actionType === 'remedial' ? 'Remedial Review' : 'Advance'}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                  {latestEvaluation.recommendedNextStep.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {latestEvaluation.recommendedNextStep.rationale}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAdaptPlan()}
              disabled={isAdaptingPlan}
              className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RotateCcw className={`w-4 h-4 ${isAdaptingPlan ? 'animate-spin' : ''}`} />
              <span>{isAdaptingPlan ? 'Adapting...' : 'Execute Recommended Step'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Detailed Mastery & Gap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Concept Mastery Visualizer */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
          <h3 className="font-extrabold text-base text-slate-900 mb-1">
            Topic & Sub-Concept Mastery
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Calibrated against recent diagnostic evaluation questions
          </p>

          {masteryData.length > 0 ? (
            <div className="space-y-4">
              {masteryData.map((item) => {
                const isWeak = item.score < 60;
                const isModerate = item.score >= 60 && item.score < 75;
                const isStrong = item.score >= 75;

                return (
                  <div key={item.concept} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.concept}</span>
                      <span
                        className={`font-mono font-bold ${
                          isWeak ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {item.score}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
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
          ) : (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-slate-200/70">
              <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-xs sm:text-sm text-slate-800">No Assessment Data Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Take a diagnostic test for <strong>{profile.topic}</strong> to measure your concept mastery across sub-topics and detect knowledge gaps.
              </p>
              <button
                onClick={() => setActiveTab('assessments')}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Take Diagnostic Assessment →</span>
              </button>
            </div>
          )}
        </div>

        {/* Strengths & Growth Areas */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Demonstrated Strengths</span>
            </div>
            <div className="space-y-2">
              {profile.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs font-semibold text-emerald-950 flex items-center justify-between"
                >
                  <span>{str}</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Mastered</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Areas Requiring Targeted Improvement</span>
            </div>
            <div className="space-y-2">
              {profile.improvementAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-xs font-semibold text-rose-950 flex items-center justify-between"
                >
                  <span>{area}</span>
                  <span className="text-[10px] text-rose-600 font-mono">Target Gap</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
