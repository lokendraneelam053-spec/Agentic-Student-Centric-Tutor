import React, { useState, useEffect, useRef } from 'react';
import { useTutor } from '../context/TutorContext';
import { StudentProfile, KnowledgeLevel, LearningGoal, AvailableStudyTime } from '../types';
import { SAMPLE_PRESETS, DEFAULT_STUDENT_PROFILE } from '../utils/defaults';
import { ACADEMIC_BRANCHES, ACADEMIC_SUBJECTS, getSubjectsForBranch } from '../utils/academicData';
import {
  GraduationCap,
  Sparkles,
  Cloud,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  User,
  Mail,
  BookOpen,
  Target,
  Clock,
  Layers,
  Cpu,
  RefreshCw,
  Zap,
  ChevronDown,
  Check,
  Search,
} from 'lucide-react';

const DEGREE_OPTIONS = [
  'B.Tech / B.E.',
  'B.Sc',
  'M.Tech / M.E.',
  'BCA / MCA',
  'Diploma / Polytechnic',
  'Other Degree',
];

export const AuthOnboardingView: React.FC = () => {
  const {
    firebaseUser,
    handleRegisterAccount,
    handleLoginAccount,
    savedAccounts,
    isGeneratingPlan,
    handleGoogleSignIn,
    handleGuestSignIn,
    isAuthLoading,
  } = useTutor();

  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Dropdown visibility states
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState<boolean>(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState<boolean>(false);
  const [branchQuery, setBranchQuery] = useState<string>('');
  const [subjectQuery, setSubjectQuery] = useState<string>('');
  const branchContainerRef = useRef<HTMLDivElement>(null);
  const subjectContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (branchContainerRef.current && !branchContainerRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (subjectContainerRef.current && !subjectContainerRef.current.contains(e.target as Node)) {
        setIsSubjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Registration Form State
  const [formData, setFormData] = useState<StudentProfile>({
    name: firebaseUser?.displayName || '',
    email: firebaseUser?.email || '',
    course: 'B.Tech / B.E.',
    branch: '',
    semester: '7',
    subject: '',
    topic: '',
    knowledgeLevel: 'Beginner',
    goal: 'Exam Preparation',
    availableTime: 30,
    strengths: [],
    improvementAreas: [],
    completedTopics: [],
    overallProgress: 0,
    sessionsCount: 0,
    cloudSyncEnabled: true,
  });

  useEffect(() => {
    if (firebaseUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || firebaseUser.displayName || '',
        email: prev.email || firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
        uid: firebaseUser.uid,
      }));
    }
  }, [firebaseUser]);

  const [selectedPresetLabel, setSelectedPresetLabel] = useState<string>('');

  // Computed branches: show all when clicking input, filter if user types
  const filteredBranches = branchQuery.trim()
    ? ACADEMIC_BRANCHES.filter(b => b.toLowerCase().includes(branchQuery.toLowerCase()))
    : ACADEMIC_BRANCHES;

  // Subjects strictly filtered by the selected academic branch
  const branchSubjects = getSubjectsForBranch(formData.branch);

  // Computed subjects: filtered by search query within the chosen branch
  const filteredSubjects = subjectQuery.trim()
    ? branchSubjects.filter(s =>
        s.name.toLowerCase().includes(subjectQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(subjectQuery.toLowerCase())
      )
    : branchSubjects;

  const matchedSubject = branchSubjects.find(s =>
    s.name.toLowerCase() === (formData.subject || '').trim().toLowerCase()
  ) || ACADEMIC_SUBJECTS.find(s =>
    s.name.toLowerCase() === (formData.subject || '').trim().toLowerCase()
  );

  const handleSelectBranch = (branchName: string) => {
    const newBranchSubjects = getSubjectsForBranch(branchName);
    const isCurrentSubjectValid = newBranchSubjects.some(
      s => s.name.toLowerCase() === (formData.subject || '').trim().toLowerCase()
    );
    const nextSubject = isCurrentSubjectValid ? formData.subject : (newBranchSubjects[0]?.name || '');
    const nextMatched = newBranchSubjects.find(s => s.name === nextSubject);
    const nextTopic = isCurrentSubjectValid ? formData.topic : (nextMatched?.popularTopics[0] || '');

    setFormData(prev => ({
      ...prev,
      branch: branchName,
      subject: nextSubject,
      topic: nextTopic,
    }));
    setBranchQuery('');
    setIsBranchDropdownOpen(false);
  };

  const KNOWLEDGE_LEVEL_MODES: Array<{
    level: KnowledgeLevel;
    title: string;
    badge: string;
    tagline: string;
    description: string;
  }> = [
    {
      level: 'Beginner',
      title: 'Beginner Mode',
      badge: 'Foundations',
      tagline: 'Intuitive Principles',
      description: 'Physical analogies, core concepts, and step-by-step intuition without intimidating math.',
    },
    {
      level: 'Intermediate',
      title: 'Intermediate Mode',
      badge: 'Formulations',
      tagline: 'Derivations & Problems',
      description: 'Mathematical equations, worked numerical examples, and standard analytical steps.',
    },
    {
      level: 'Advanced',
      title: 'Advanced Mode',
      badge: 'Synthesis',
      tagline: 'Deep Edge Cases',
      description: 'Higher-order dynamics, system-level trade-offs, and multi-parameter problem synthesis.',
    },
    {
      level: 'Adaptive (Beginner to Advanced)',
      title: 'Beginner ➔ Advanced',
      badge: 'Gradual / Progressive',
      tagline: 'All Levels (Adaptive)',
      description: 'Starts with foundational beginner mode and dynamically guides you up through intermediate derivations to advanced mastery gradually.',
    },
  ];

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedPresetLabel(preset.label);
    setFormData(prev => ({
      ...prev,
      name: prev.name || preset.profile.name || 'Lok',
      email: prev.email || `${preset.profile.name?.toLowerCase().replace(/\s+/g, '') || 'student'}@university.edu`,
      course: 'B.Tech / B.E.',
      branch: preset.profile.branch || 'Electrical and Electronics Engineering',
      semester: preset.profile.semester || '7',
      subject: preset.profile.subject || 'Power Systems',
      topic: preset.profile.topic || 'Power System Stability',
      knowledgeLevel: preset.profile.knowledgeLevel || 'Adaptive (Beginner to Advanced)',
      goal: preset.profile.goal || 'Exam Preparation',
      availableTime: preset.profile.availableTime || 30,
      cloudSyncEnabled: true,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.branch.trim() || !formData.subject.trim() || !formData.topic.trim()) return;

    const emailToUse = formData.email?.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '')}@student.edu`;
    const newProfile: StudentProfile = {
      ...formData,
      id: firebaseUser?.uid || `std-${Date.now()}`,
      uid: firebaseUser?.uid,
      email: emailToUse,
      hasCompletedOnboarding: true,
      registeredAt: new Date().toLocaleDateString(),
      lastCloudSyncAt: new Date().toLocaleTimeString(),
    };

    await handleRegisterAccount(newProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Agentic Student-Centric Tutor
            </span>
            <p className="text-xs text-slate-400 hidden sm:block">Personalized learning that adapts to you.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Cloud className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
            Cloud Learning System
          </span>
        </div>
      </header>

      {/* Main Registration / Sign-in Card */}
      <main className="relative z-10 max-w-3xl mx-auto w-full px-4 sm:px-6 my-auto py-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top Banner / Mode Toggle */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-800/80 to-slate-900 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Student Gateway & Academic Onboarding</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {mode === 'register' ? 'Register Your Student Account' : 'Welcome Back Student'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  {mode === 'register'
                    ? 'Enter your academic branch, semester, subject, and learning goal to initialize your adaptive AI tutor.'
                    : 'Select your registered student profile to resume your personalized learning session.'}
                </p>
              </div>

              {/* Toggle Buttons */}
              <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mode === 'register'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Sign In</span>
                  {savedAccounts.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {savedAccounts.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick 1-Click Academic Presets (Only in register mode) */}
            {mode === 'register' && (
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Fill Academic Presets</span>
                  </span>
                  <span className="text-slate-500">Click to autofill all fields</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                        selectedPresetLabel === preset.label
                          ? 'bg-indigo-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold truncate text-[11px] text-white">{preset.badge}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.profile.subject}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Content */}
          {mode === 'register' ? (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Google Sign-In Status Banner or Action Button */}
              {firebaseUser ? (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border border-indigo-500/40 flex items-center justify-between shadow-inner">
                  <div className="flex items-center space-x-3.5">
                    {firebaseUser.photoURL ? (
                      <img
                        src={firebaseUser.photoURL}
                        alt="User"
                        className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                        {firebaseUser.displayName?.charAt(0) || 'S'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">
                          {firebaseUser.displayName || 'Google Student'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Google Auth Active</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{firebaseUser.email}</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center text-xs text-cyan-300 font-bold bg-cyan-950/50 px-3 py-1.5 rounded-xl border border-cyan-800/50">
                    Step 2: Academic Setup
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isAuthLoading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm shadow-lg transition flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{isAuthLoading ? 'Connecting to Google...' : 'Continue with Google (Firebase Auth)'}</span>
                  </button>

                  <div className="relative flex items-center justify-center my-2">
                    <div className="border-t border-slate-800 w-full"></div>
                    <span className="bg-slate-900/90 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider relative shrink-0">
                      or register with email / roll id
                    </span>
                  </div>
                </>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                {/* Row 1: Student Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Student Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Lokendra"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Student Email / College ID *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. lokendra@university.edu"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                {/* Academic Degree / Program */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Academic Degree / Course Program
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {DEGREE_OPTIONS.map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setFormData({ ...formData, course: deg })}
                        className={`py-2 px-1.5 rounded-xl border text-[11px] font-semibold transition cursor-pointer text-center ${
                          formData.course === deg
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {deg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 2: Branch & Semester */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Branch with space-saving floating dropdown */}
                  <div ref={branchContainerRef} className="relative sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Academic Branch / Department *</span>
                      <span className="text-[10px] text-cyan-400 font-normal lowercase">click to choose from all branches</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.branch}
                        onFocus={() => {
                          setIsBranchDropdownOpen(true);
                          setBranchQuery('');
                        }}
                        onClick={() => {
                          setIsBranchDropdownOpen(true);
                          setBranchQuery('');
                        }}
                        onChange={e => {
                          setFormData({ ...formData, branch: e.target.value });
                          setBranchQuery(e.target.value);
                          setIsBranchDropdownOpen(true);
                        }}
                        placeholder="Click to choose from all branches or type..."
                        className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsBranchDropdownOpen(prev => {
                            if (!prev) setBranchQuery('');
                            return !prev;
                          });
                        }}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isBranchDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                      </button>
                    </div>

                    {/* Floating Branch Dropdown appearing on click without taking permanent screen space */}
                    {isBranchDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl divide-y divide-slate-800/60 backdrop-blur-md">
                        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold uppercase tracking-wider text-slate-300">
                            Academic Branches ({filteredBranches.length})
                          </span>
                          <span className="text-[10px] text-slate-500">Click any branch to select</span>
                        </div>
                        {filteredBranches.length > 0 ? (
                          filteredBranches.map(branchName => (
                            <button
                              key={branchName}
                              type="button"
                              onClick={() => handleSelectBranch(branchName)}
                              className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white transition flex items-center justify-between cursor-pointer"
                            >
                              <span>{branchName}</span>
                              {formData.branch === branchName && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2.5 text-xs text-slate-400 italic">
                            Press enter or continue typing custom branch "{formData.branch}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Year / Semester *
                    </label>
                    <select
                      value={formData.semester}
                      onChange={e => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 3: Target Subject & Specific Learning Topic */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject with floating dropdown */}
                  <div ref={subjectContainerRef} className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Target Academic Subject *</span>
                      <span className="text-[10px] text-cyan-400 font-normal lowercase">click to choose course</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onFocus={() => {
                          setIsSubjectDropdownOpen(true);
                          setSubjectQuery('');
                        }}
                        onClick={() => {
                          setIsSubjectDropdownOpen(true);
                          setSubjectQuery('');
                        }}
                        onChange={e => {
                          setFormData({ ...formData, subject: e.target.value });
                          setSubjectQuery(e.target.value);
                          setIsSubjectDropdownOpen(true);
                        }}
                        placeholder="Click to choose course/subject or type..."
                        className="w-full pl-4 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubjectDropdownOpen(prev => {
                            if (!prev) setSubjectQuery('');
                            return !prev;
                          });
                        }}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubjectDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                      </button>
                    </div>

                    {/* Floating Subject Dropdown */}
                    {isSubjectDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl divide-y divide-slate-800/60 backdrop-blur-md">
                        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold uppercase tracking-wider text-slate-300">
                            {formData.branch
                              ? `${formData.branch.split('(')[0].trim()} Subjects (${filteredSubjects.length})`
                              : `All Academic Subjects (${filteredSubjects.length})`}
                          </span>
                          <span className="text-[10px] text-cyan-400">
                            {formData.branch ? 'Branch-specific courses' : 'Select branch to narrow'}
                          </span>
                        </div>
                        {!formData.branch && (
                          <div className="px-4 py-1.5 bg-indigo-950/40 text-[10px] text-indigo-300 border-b border-slate-800 flex items-center space-x-1.5">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Select your Academic Branch above to filter subjects for your specific branch.</span>
                          </div>
                        )}
                        {filteredSubjects.length > 0 ? (
                          filteredSubjects.map(subj => (
                            <button
                              key={subj.name}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  subject: subj.name,
                                  topic: subj.popularTopics[0] || formData.topic,
                                });
                                setSubjectQuery('');
                                setIsSubjectDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-indigo-600 hover:text-white transition flex items-center justify-between cursor-pointer"
                            >
                              <div>
                                <span className="font-semibold text-white">{subj.name}</span>
                                <span className="ml-2 text-[10px] text-slate-400 font-mono">[{subj.category}]</span>
                              </div>
                              {formData.subject === subj.name && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-2.5 text-xs text-slate-400 italic">
                            Press enter or continue typing custom subject "{formData.subject}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Specific Learning Topic *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.topic}
                      onChange={e => setFormData({ ...formData, topic: e.target.value })}
                      placeholder="e.g. Power System Stability, Binary Trees, CPU Scheduling"
                      className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />

                    {/* Quick suggested topics from matched subject */}
                    {matchedSubject && matchedSubject.popularTopics.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400">Suggestions:</span>
                        {matchedSubject.popularTopics.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setFormData({ ...formData, topic: t })}
                            className={`px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                              formData.topic === t
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 4: Tutoring Calibration Mode (4 Modes including Adaptive) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                      Tutoring Calibration Mode
                    </label>
                    <span className="text-[11px] text-cyan-400">Controls AI explanation style & difficulty curve</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {KNOWLEDGE_LEVEL_MODES.map(item => {
                      const isSelected = formData.knowledgeLevel === item.level;
                      return (
                        <button
                          key={item.level}
                          type="button"
                          onClick={() => setFormData({ ...formData, knowledgeLevel: item.level })}
                          className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-950/90 text-cyan-200 ring-1 ring-cyan-400 shadow-md'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs sm:text-sm font-bold text-white">{item.title}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {item.badge}
                              </span>
                            </div>
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs"></span>}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                            {item.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 5: Learning Goal & Available Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Primary Learning Goal
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          'Exam Preparation',
                          'Concept Understanding',
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
                            className={`py-2 px-2 rounded-xl border text-center text-xs font-semibold transition cursor-pointer ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-950/80 text-cyan-300 font-bold ring-1 ring-cyan-400/50'
                                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {goal}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Available Session Duration
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {([15, 30, 45, 60] as AvailableStudyTime[]).map(time => {
                        const isSelected = formData.availableTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setFormData({ ...formData, availableTime: time })}
                            className={`py-2.5 px-2 rounded-xl border text-center font-mono transition cursor-pointer ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-950/80 text-cyan-300 font-bold ring-1 ring-cyan-400/50'
                                : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-sm font-bold">{time}</span>
                            <span className="text-[10px] text-slate-500 ml-0.5">min</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              {/* Cloud Sync Option */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <Cloud className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Cloud Learning Record Sync</span>
                    <span className="text-slate-400 text-[11px]">
                      Saves your learner model, diagnostic evaluations, and adaptive plan to student storage.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.cloudSyncEnabled}
                  onChange={e => setFormData({ ...formData, cloudSyncEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
              </div>

              {/* Register CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isGeneratingPlan}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingPlan ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Initializing Student Model & Synthesizing Plan...</span>
                    </>
                  ) : (
                    <>
                      <span>Register & Create My Learning Plan</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          ) : (
            /* Sign In Mode: Google Auth & saved student accounts */
            <div className="p-6 sm:p-8 space-y-6">
              {/* Google Sign-in */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm shadow-lg transition flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{isAuthLoading ? 'Connecting to Google...' : 'Sign In with Google (Firebase Auth)'}</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-900/90 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider relative shrink-0">
                  or choose a profile / guest access
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider">
                  Select Registered Student Profile
                </h3>
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={isAuthLoading}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline cursor-pointer"
                >
                  Quick Guest Access
                </button>
              </div>

              {savedAccounts.length === 0 ? (
                <div className="text-center py-10 p-6 rounded-2xl bg-slate-950 border border-slate-800">
                  <User className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No student profiles registered yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Please register a new account to begin.</p>
                  <button
                    onClick={() => setMode('register')}
                    className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Switch to Register
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedAccounts.map(account => (
                    <div
                      key={account.id || account.email}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/80 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center font-extrabold text-white text-base">
                          {account.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-white truncate">{account.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-cyan-300 border border-indigo-800">
                              {account.knowledgeLevel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {account.subject}: {account.topic} ({account.branch})
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleLoginAccount(account)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition cursor-pointer shrink-0"
                      >
                        Sign In →
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick load Lok button in login screen */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-cyan-300 block">Need a quick demo?</span>
                  <span className="text-[11px] text-slate-400">Load sample student Lok (Power Systems) immediately.</span>
                </div>
                <button
                  onClick={() => handleLoginAccount(DEFAULT_STUDENT_PROFILE)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  Load Lok Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info Strip */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        Agentic Student-Centric Tutor • Full-Stack Intelligent Academic Tutoring Application • Cruz AI Architecture Ready
      </footer>
    </div>
  );
};
