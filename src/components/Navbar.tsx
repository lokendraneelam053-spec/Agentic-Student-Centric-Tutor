import React from 'react';
import { useTutor } from '../context/TutorContext';
import {
  GraduationCap,
  Sparkles,
  PlusCircle,
  Cpu,
  Cloud,
  LogOut,
  Radio,
  Mic,
  Volume2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    profile,
    firebaseUser,
    setShowOnboardingModal,
    handleSignOut,
    setIsLiveVoiceOpen,
    setIsTranscribeModalOpen,
  } = useTutor();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Agentic Student-Centric Tutor
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="w-3 h-3 mr-1 animate-pulse" />
                Adaptive AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden md:block">
              Personalized learning that adapts to you.
            </p>
          </div>
        </div>

        {/* Current Student Context & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Live Voice API Button */}
          <button
            onClick={() => setIsLiveVoiceOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
            title="Start real-time voice conversation with gemini-3.8-live"
          >
            <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="hidden sm:inline">Live Voice Tutor</span>
            <span className="sm:hidden">Live</span>
          </button>

          {/* Transcribe Audio Button */}
          <button
            onClick={() => setIsTranscribeModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition cursor-pointer"
            title="Transcribe speech using gemini-3.5-transcribe"
          >
            <Mic className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Transcribe</span>
          </button>

          {profile && (
            <div className="hidden xl:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/70 rounded-full px-3 py-1.5 text-xs text-slate-300">
              {firebaseUser?.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={profile.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
              <span className="font-semibold text-white">{profile.name}</span>
              <span className="text-slate-500">|</span>
              <span className="flex items-center text-cyan-400 font-medium text-[11px]">
                <Cloud className="w-3 h-3 mr-1" />
                Firestore
              </span>
            </div>
          )}

          <button
            onClick={() => setShowOnboardingModal(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition cursor-pointer"
            title="Create new plan or change subject"
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span className="hidden lg:inline">New Plan</span>
          </button>

          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-slate-400 text-xs sm:text-sm font-medium transition cursor-pointer"
            title="Sign out of student account"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

