import React, { useState } from 'react';
import { useTutor } from '../context/TutorContext';
import { SAMPLE_PRESETS } from '../utils/defaults';
import {
  UserCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  Target,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Edit3,
  Check,
  Cloud,
  LogOut,
  Mail,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    profile,
    updateProfile,
    setShowOnboardingModal,
    handleSelectPreset,
    latestEvaluation,
    handleSignOut,
    resetAllData,
  } = useTutor();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Learner Model Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-indigo-500/20">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{profile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {profile.knowledgeLevel}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <Cloud className="w-3 h-3 mr-1" />
                  Cloud Synced
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center space-x-2">
                <span>{profile.branch} • Semester {profile.semester}</span>
                {profile.email && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 font-mono text-xs">{profile.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Change Subject</span>
            </button>
            <button
              onClick={handleSignOut}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              title="Sign out or switch student account"
            >
              <LogOut className="w-4 h-4" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="py-6 border-b border-slate-100 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Update Student Profile Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Student Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Email / Student ID</label>
                <input
                  type="text"
                  value={editForm.email || ''}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Academic Branch</label>
                <input
                  type="text"
                  value={editForm.branch}
                  onChange={e => setEditForm({ ...editForm, branch: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Semester</label>
                <input
                  type="text"
                  value={editForm.semester}
                  onChange={e => setEditForm({ ...editForm, semester: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition cursor-pointer flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* Current Active Course Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Current Subject</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{profile.subject}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Current Topic</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{profile.topic}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Target Learning Goal</span>
            <span className="font-bold text-indigo-700 text-sm mt-0.5 block">{profile.goal}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block font-medium">Available Time</span>
            <span className="font-bold text-emerald-700 text-sm mt-0.5 block font-mono">{profile.availableTime} Minutes</span>
          </div>
        </div>
      </div>

      {/* Learner Competencies: Strengths vs Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstrated Academic Strengths</span>
          </div>
          <div className="space-y-2">
            {profile.strengths.length > 0 ? (
              profile.strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs font-semibold text-emerald-950 flex items-center justify-between"
                >
                  <span>{str}</span>
                  <span className="text-[10px] font-mono text-emerald-600">Mastered</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-2">Complete diagnostic assessments to record verified strengths.</p>
            )}
          </div>
        </div>

        {/* Improvement Areas */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-4">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Target Areas Requiring Improvement</span>
          </div>
          <div className="space-y-2">
            {profile.improvementAreas.length > 0 ? (
              profile.improvementAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs font-semibold text-rose-950 flex items-center justify-between"
                >
                  <span>{area}</span>
                  <span className="text-[10px] font-mono text-rose-600">Intervention</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-700 italic py-2">No active knowledge gaps identified!</p>
            )}
          </div>
        </div>
      </div>

      {/* Switch to Preset Examples */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-3">
          Quickly Switch Academic Focus / Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset.profile)}
              className="text-left p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-indigo-700">{preset.badge}</span>
                <span className="text-slate-400 font-mono text-[11px]">{preset.profile.availableTime} min</span>
              </div>
              <div className="font-bold text-xs text-slate-900">{preset.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{preset.profile.topic}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reset State Option */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-800 block">Session & Storage Reset</span>
          <span>Clear locally cached student profile and restore default simulation records.</span>
        </div>
        <button
          onClick={resetAllData}
          className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-rose-100 hover:text-rose-800 text-slate-700 font-bold transition cursor-pointer"
        >
          Reset All Data
        </button>
      </div>
    </div>
  );
};
