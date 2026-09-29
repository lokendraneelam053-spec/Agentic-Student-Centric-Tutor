import React, { useState } from 'react';
import { useTutor } from '../context/TutorContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Send,
  AlertTriangle,
  Lightbulb,
  Check,
} from 'lucide-react';

export const AssessmentsView: React.FC = () => {
  const {
    profile,
    currentAssessment,
    latestEvaluation,
    handleGenerateAssessment,
    handleSubmitAssessment,
    handleAdaptPlan,
    isGeneratingAssessment,
    isEvaluating,
    isAdaptingPlan,
  } = useTutor();

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResultTab, setShowResultTab] = useState<boolean>(Boolean(latestEvaluation));

  const questions = currentAssessment?.questions || [];

  const handleSelectOption = (questionId: string, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) return;
    await handleSubmitAssessment(selectedAnswers);
    setShowResultTab(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1.5">
              <FileCheck2 className="w-4 h-4" />
              <span>Academic Diagnostic Assessment & Evaluation</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {currentAssessment ? currentAssessment.assessmentTitle : `Diagnostic Assessment: ${profile.topic}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Formative evaluation measuring concept mastery across multiple cognitive domains (conceptual, analytical, and application-based).
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                handleGenerateAssessment();
                setShowResultTab(false);
              }}
              disabled={isGeneratingAssessment}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingAssessment ? 'Generating New Test...' : 'Generate Fresh Assessment'}</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle if Results Exist */}
        {latestEvaluation && (
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={() => setShowResultTab(false)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                !showResultTab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Current Questions
            </button>
            <button
              onClick={() => setShowResultTab(true)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                showResultTab
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Diagnostic Analysis & Gaps ({latestEvaluation.scorePercentage}%)</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {showResultTab && latestEvaluation ? (
        /* ================= RESULTS & KNOWLEDGE GAP ANALYSIS ================= */
        <div className="space-y-6">
          {/* Top Score & Performance Summary Card */}
          <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Diagnostic Score Report
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{latestEvaluation.timestamp}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  {latestEvaluation.scorePercentage >= 70 ? 'Satisfactory Concept Retention' : 'Knowledge Gaps Detected'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {latestEvaluation.summary}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 min-w-[130px]">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {latestEvaluation.scorePercentage}%
                </span>
                <span className="text-[11px] text-slate-300 font-medium">
                  {latestEvaluation.totalScore} / {latestEvaluation.maxScore} Correct
                </span>
              </div>
            </div>
          </div>

          {/* Section 7: Knowledge Gap Analysis & Concept Mastery Bars */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Learning Analysis: Concept Mastery</h3>
                <p className="text-xs text-slate-500">Fine-grained competency breakdown derived from your answers</p>
              </div>
            </div>

            <div className="space-y-4">
              {latestEvaluation.conceptMastery.map((item) => {
                const isWeak = item.score < 60;
                const isModerate = item.score >= 60 && item.score < 75;
                const isStrong = item.score >= 75;

                return (
                  <div key={item.concept} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{item.concept}</span>
                        {isWeak && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            Knowledge Gap
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-mono font-bold text-sm ${
                          isWeak ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {item.score}%
                      </span>
                    </div>

                    {/* Progress visual bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
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

            {/* Split pills for Understood vs Needing Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Concepts Understood</span>
                </div>
                <div className="space-y-1.5">
                  {latestEvaluation.conceptsUnderstood.length > 0 ? (
                    latestEvaluation.conceptsUnderstood.map(c => (
                      <div key={c} className="flex items-center space-x-2 text-xs text-emerald-950 font-semibold bg-white p-2 rounded-xl border border-emerald-100 shadow-2xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No concepts reached mastery benchmark.</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80">
                <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Concepts Requiring Improvement</span>
                </div>
                <div className="space-y-1.5">
                  {latestEvaluation.conceptsNeedingImprovement.length > 0 ? (
                    latestEvaluation.conceptsNeedingImprovement.map(c => (
                      <div key={c} className="flex items-center space-x-2 text-xs text-rose-950 font-semibold bg-white p-2 rounded-xl border border-rose-100 shadow-2xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-700 italic">No significant knowledge gaps detected!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Adaptive Replanning Callout & Trigger */}
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/5 to-white border border-amber-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Agentic Adaptive Action
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base mt-0.5">
                      {latestEvaluation.recommendedNextStep?.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {latestEvaluation.recommendedNextStep?.rationale}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleAdaptPlan(latestEvaluation)}
                  disabled={isAdaptingPlan}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RotateCcw className={`w-4 h-4 ${isAdaptingPlan ? 'animate-spin' : ''}`} />
                  <span>{isAdaptingPlan ? 'Adapting Plan...' : 'Adapt Learning Plan Now'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 6: Question-by-Question Evaluation & Mistake Explanations */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-100">
              Detailed Question Analysis & Explanation of Mistakes
            </h3>

            <div className="space-y-4">
              {latestEvaluation.questionEvaluations.map((evalItem, idx) => (
                <div
                  key={evalItem.questionId}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    evalItem.isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          evalItem.isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}
                      >
                        {evalItem.isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">
                        Question #{idx + 1}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                      {evalItem.conceptTag}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 mt-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <strong className="text-slate-900">Your Answer: </strong>
                      <span className={evalItem.isCorrect ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                        {evalItem.studentAnswer}
                      </span>
                    </div>

                    {!evalItem.isCorrect && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                        <strong className="text-emerald-900">Correct Answer: </strong>
                        <span>{evalItem.correctAnswer}</span>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-white border border-slate-200 mt-2">
                      <p className="font-semibold text-slate-900 mb-0.5">Tutor Feedback & Analysis:</p>
                      <p className="text-slate-600 leading-relaxed">{evalItem.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ================= QUESTION TAKING RUNNER ================= */
        <form onSubmit={onSubmit} className="space-y-6">
          {questions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FileCheck2 className="w-8 h-8" />
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Calibrated for {profile.knowledgeLevel} Level</span>
              </div>
              <h3 className="font-extrabold text-xl text-slate-900">
                Ready to Test Your Understanding in {profile.topic}?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
                Take a diagnostic formative evaluation on <strong>{profile.subject}: {profile.topic}</strong>. The AI will generate multiple choice questions, calculate your exact concept mastery, and pinpoint any misconceptions with step-by-step guidance.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handleGenerateAssessment()}
                  disabled={isGeneratingAssessment}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingAssessment ? 'Generating Assessment Questions...' : `Start Diagnostic Assessment (${profile.topic})`}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-bold text-indigo-700 uppercase tracking-wider text-[11px]">
                      Question {idx + 1} of {questions.length} • {q.type.toUpperCase().replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px]">
                      Tag: {q.conceptTag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 leading-relaxed">
                    {q.prompt}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {(q.options || []).map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt)}
                          className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold ring-1 ring-indigo-500 shadow-2xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Submit CTA */}
              <div className="p-4 bg-white border border-slate-200 rounded-3xl shadow-xs flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {Object.keys(selectedAnswers).length} of {questions.length} questions answered
                </span>
                <button
                  type="submit"
                  disabled={isEvaluating || Object.keys(selectedAnswers).length === 0}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isEvaluating ? 'Evaluating Answers...' : 'Submit Diagnostic Assessment'}</span>
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
};
