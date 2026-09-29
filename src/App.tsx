/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TutorProvider, useTutor } from './context/TutorContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';
import { AuthOnboardingView } from './views/AuthOnboardingView';
import { DashboardView } from './views/DashboardView';
import { MyLearningView } from './views/MyLearningView';
import { AITutorView } from './views/AITutorView';
import { LearningPlanView } from './views/LearningPlanView';
import { AssessmentsView } from './views/AssessmentsView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquareCode,
  CalendarDays,
  FileCheck2,
  TrendingUp,
  UserCheck,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    activeTab,
    setActiveTab,
    handleSignOut,
    profile,
    isLiveVoiceOpen,
    setIsLiveVoiceOpen,
    isTranscribeModalOpen,
    setIsTranscribeModalOpen,
    handleSendMessage,
  } = useTutor();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not yet authenticated / has not registered their account, show the starting registration/sign-in view!
  if (!isAuthenticated) {
    return <AuthOnboardingView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'my-learning':
        return <MyLearningView />;
      case 'ai-tutor':
        return <AITutorView />;
      case 'learning-plan':
        return <LearningPlanView />;
      case 'assessments':
        return <AssessmentsView />;
      case 'progress':
        return <ProgressView />;
      case 'student-profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'my-learning', label: 'Learning', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'ai-tutor', label: 'Tutor', icon: <MessageSquareCode className="w-5 h-5" /> },
    { id: 'learning-plan', label: 'Plan', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'assessments', label: 'Assess', icon: <FileCheck2 className="w-5 h-5" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'student-profile', label: 'Profile', icon: <UserCheck className="w-5 h-5" /> },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Mobile Nav Toggle Bar */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-bold text-slate-200">{profile.name}</span>
          <span className="text-slate-500 text-xs">•</span>
          <span className="text-xs text-indigo-300 truncate max-w-[120px]">{profile.topic}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Switch Account"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1">
          {mobileNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Dynamic View Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      <OnboardingModal />
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />
      <AudioTranscribeModal
        isOpen={isTranscribeModalOpen}
        onClose={() => setIsTranscribeModalOpen(false)}
        onSendToChat={(text) => {
          setActiveTab('ai-tutor');
          handleSendMessage(text);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <TutorProvider>
      <AppContent />
    </TutorProvider>
  );
}
