import React, { useState, useRef, useEffect } from 'react';
import { useTutor } from '../context/TutorContext';
import { StudentProfile, KnowledgeLevel, LearningGoal, AvailableStudyTime } from '../types';
import { SAMPLE_PRESETS } from '../utils/defaults';
import { ACADEMIC_BRANCHES, ACADEMIC_SUBJECTS, getSubjectsForBranch } from '../utils/academicData';
import {
  Sparkles,
  GraduationCap,
  Clock,
  Target,
  BookOpen,
  Layers,
  X,
  Check,
  ChevronRight,
  User,
  ChevronDown,
  Search,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const {
    profile,
    showOnboardingModal,
    setShowOnboardingModal,
    handleCreatePlan,
    isGeneratingPlan,
  } = useTutor();

  const [formData, setFormData] = useState<StudentProfile>(profile);

  // Dropdown states for space-saving select-on-click
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isSubjectOpen, setIsSubjectOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

  const branchRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);

  // Sync formData when profile changes
  useEffect(() => {
    if (showOnboardingModal) {
      setFormData(profile);
      setBranchSearch('');
      setSubjectSearch('');
    }
  }, [showOnboardingModal, profile]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setIsBranchOpen(false);
      }
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
        setIsSubjectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!showOnboardingModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreatePlan(formData);
    setShowOnboardingModal(false);
  };

  const handleApplyPreset = (preset: Partial<StudentProfile>) => {
    setFormData(prev => ({
      ...prev,
      ...preset,
    }));
  };

  // Branches filtered only if user explicitly typed a search, else show all
  const displayedBranches = branchSearch.trim()
    ? ACADEMIC_BRANCHES.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()))
    : ACADEMIC_BRANCHES;

  // Subjects strictly filtered by the selected academic branch
  const branchSubjects = getSubjectsForBranch(formData.branch);

  // Subjects filtered within the selected branch
  const displayedSubjects = subjectSearch.trim()
    ? branchSubjects.filter(
        s =>
          s.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
          s.category.toLowerCase().includes(subjectSearch.toLowerCase())
      )
    : branchSubjects;

  const matchedSubject = branchSubjects.find(
    s => s.name.toLowerCase() === (formData.subject || '').trim().toLowerCase()
  ) || ACADEMIC_SUBJECTS.find(
    s => s.name.toLowerCase() === (formData.subject || '').trim().toLowerCase()
  );

  const handleSelectBranch = (branchName: string) => {
    const newBranchSubjects = getSubjectsForBranch(branchName);
    const isCurrentSubjectValid = newBranchSubjects.some(
      s => s.name.toLowerCase() === (formData.subject || '').trim().toLowerCase()
    );
    const nextSubject = isCurrentSubjectValid ? formData.subject : (newBranchSubjects[0]?.name || '');
    const nextMatchedSubj = newBranchSubjects.find(s => s.name === nextSubject);
    const nextTopic = isCurrentSubjectValid ? formData.topic : (nextMatchedSubj?.popularTopics[0] || '');

    setFormData(prev => ({
      ...prev,
      branch: branchName,
      subject: nextSubject,
      topic: nextTopic,
    }));
    setBranchSearch('');
    setIsBranchOpen(false);
  };

  const KNOWLEDGE_MODES: Array<{
    level: KnowledgeLevel;
    title: string;
    badge: string;
    desc: string;
  }> = [
    {
      level: 'Beginner',
      title: 'Beginner',
      badge: 'Foundations',
      desc: 'Intuitive analogies & physical concepts without complex math',
    },
    {
      level: 'Intermediate',
      title: 'Intermediate',
      badge: 'Analytical',
      desc: 'Mathematical formulas, derivations & standard numerical problems',
    },
    {
      level: 'Advanced',
      title: 'Advanced',
      badge: 'Mastery',
      desc: 'Deep multi-parameter synthesis, boundary conditions & edge cases',
    },
    {
      level: 'Adaptive (Beginner to Advanced)',
      title: 'Beginner ➔ Advanced',
      badge: 'Gradual / Progressive',
      desc: 'Starts at Beginner mode and advances step-by-step to Advanced mastery gradually',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={() => setShowOnboardingModal(false)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Student Onboarding & Goal Profiling</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Create Your Personalized Learning Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Configure your academic course and subject. The AI tutor dynamically calibrates curriculum depth, pacing, and diagnostic assessments.
          </p>
        </div>

        {/* Quick Academic Presets */}
        <div className="p-5 bg-slate-50 border-b border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Quick Academic Presets
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.profile)}
                className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  formData.topic === preset.profile.topic
                    ? 'bg-indigo-50/90 border-indigo-500 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-indigo-700">{preset.badge}</span>
                  <span className="text-slate-400 font-mono">{preset.profile.availableTime}m</span>
                </div>
                <div className="font-bold text-xs text-slate-800 line-clamp-1">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Onboarding Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Row 1: Name, Branch, Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Lok"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Academic Branch - space-saving dropdown on click */}
            <div ref={branchRef} className="relative sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Academic Branch</span>
                <span className="text-[10px] text-indigo-600 font-semibold lowercase">click to select one</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.branch}
                  onClick={() => setIsBranchOpen(true)}
                  onFocus={() => setIsBranchOpen(true)}
                  onChange={e => {
                    setFormData({ ...formData, branch: e.target.value });
                    setBranchSearch(e.target.value);
                    setIsBranchOpen(true);
                  }}
                  placeholder="Click to view all branches..."
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setIsBranchOpen(prev => !prev)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isBranchOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
              </div>

              {/* Floating dropdown overlay appearing on click without taking permanent screen space */}
              {isBranchOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl py-1 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50 flex items-center justify-between">
                    <span>Select Academic Branch</span>
                    <span>{displayedBranches.length} branches</span>
                  </div>
                  {displayedBranches.map(branchName => (
                    <button
                      key={branchName}
                      type="button"
                      onClick={() => handleSelectBranch(branchName)}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-medium">{branchName}</span>
                      {formData.branch === branchName && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Subject & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Academic Subject - space-saving list of main courses */}
            <div ref={subjectRef} className="relative">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Target Academic Subject</span>
                <span className="text-[10px] text-indigo-600 font-semibold lowercase">click to choose course</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onClick={() => setIsSubjectOpen(true)}
                  onFocus={() => setIsSubjectOpen(true)}
                  onChange={e => {
                    setFormData({ ...formData, subject: e.target.value });
                    setSubjectSearch(e.target.value);
                    setIsSubjectOpen(true);
                  }}
                  placeholder="Click to choose subject or type..."
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => setIsSubjectOpen(prev => !prev)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubjectOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
              </div>

              {/* Floating dropdown for Main Academic Courses / Subjects */}
              {isSubjectOpen && (
                <div className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl py-1 divide-y divide-slate-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider bg-slate-50 flex items-center justify-between">
                    <span>
                      {formData.branch
                        ? `${formData.branch.split('(')[0].trim()} Subjects (${displayedSubjects.length})`
                        : `All Academic Subjects (${displayedSubjects.length})`}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold">
                      {formData.branch ? 'Branch-specific courses' : 'Select branch to filter'}
                    </span>
                  </div>
                  {!formData.branch && (
                    <div className="px-3 py-1.5 bg-indigo-50 text-[10px] text-indigo-700 border-b border-indigo-100">
                      Select an Academic Branch above to view branch-specific courses.
                    </div>
                  )}
                  {displayedSubjects.map(subj => (
                    <button
                      key={subj.name}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          subject: subj.name,
                          topic: subj.popularTopics[0] || formData.topic,
                        });
                        setSubjectSearch('');
                        setIsSubjectOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 transition flex items-center justify-between cursor-pointer"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{subj.name}</div>
                        <div className="text-[10px] text-slate-400">{subj.category}</div>
                      </div>
                      {formData.subject === subj.name && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Learning Topic
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Power System Stability"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />

              {/* Quick suggestions from selected subject */}
              {matchedSubject && matchedSubject.popularTopics.length > 0 && (
                <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="text-slate-400">Suggestions:</span>
                  {matchedSubject.popularTopics.slice(0, 3).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, topic: t })}
                      className={`px-2 py-0.5 rounded-md border transition cursor-pointer truncate max-w-[180px] ${
                        formData.topic === t
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Tutoring Calibration Mode - 4 modes including Progressive (Beginner to Advanced) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tutoring Calibration Mode
              </label>
              <span className="text-[11px] text-indigo-600 font-medium">Difficulty & Explanation Progression</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {KNOWLEDGE_MODES.map(item => {
                const isSelected = formData.knowledgeLevel === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setFormData({ ...formData, knowledgeLevel: item.level })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-1 ring-indigo-500 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-normal leading-snug">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Learning Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Learning Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(
                [
                  'Concept Understanding',
                  'Exam Preparation',
                  'Practice',
                  'Revision',
                ] as LearningGoal[]
              ).map(goal => {
                const isSelected = formData.goal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal })}
                    className={`py-2.5 px-2.5 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Available Study Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Available Study Time
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {([15, 30, 45, 60] as AvailableStudyTime[]).map(time => {
                const isSelected = formData.availableTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({ ...formData, availableTime: time })}
                    className={`py-2.5 px-2 rounded-xl border text-center font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold ring-1 ring-indigo-500'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-bold">{time}</span>
                    <span className="text-xs text-slate-500 ml-1">min</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isGeneratingPlan}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPlan ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Synthesizing Adaptive Plan...</span>
                </>
              ) : (
                <>
                  <span>Create My Learning Plan</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

