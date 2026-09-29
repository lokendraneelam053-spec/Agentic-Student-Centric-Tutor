import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StudentProfile,
  LearningPlan,
  PlanStep,
  AgentActivity,
  ChatMessage,
  DiagnosticAssessment,
  EvaluationResult,
  ActiveNavTab,
  PdfDocument,
  PdfAnalysisResult,
} from '../types';
import {
  DEFAULT_STUDENT_PROFILE,
  INITIAL_AGENT_ACTIVITIES,
} from '../utils/defaults';
import {
  fetchGeneratedPlan,
  fetchTutorResponse,
  fetchPdfAnalysis,
  fetchGeneratedAssessment,
  submitAssessmentEvaluation,
  requestAdaptivePlan,
} from '../services/api';
import {
  auth,
  signInWithGoogle,
  signInGuest,
  logOut as firebaseLogOut,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  savePlanToFirestore,
  getLatestPlanFromFirestore,
  saveEvaluationToFirestore,
  testFirestoreConnection,
} from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface TutorContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  savedAccounts: StudentProfile[];
  profile: StudentProfile;
  updateProfile: (updates: Partial<StudentProfile>) => void;
  plan: LearningPlan | null;
  setPlan: React.Dispatch<React.SetStateAction<LearningPlan | null>>;
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  activeStep: PlanStep | null;
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  agentActivities: AgentActivity[];
  addAgentActivity: (title: string, description: string, category: AgentActivity['category']) => void;
  chatMessages: ChatMessage[];
  uploadedDocument: PdfDocument | null;
  setUploadedDocument: (doc: PdfDocument | null) => void;
  isAnalyzingPdf: boolean;
  handleUploadPdfFile: (file: File) => Promise<void>;
  handleLoadSamplePdf: () => void;
  handleAnalyzePdf: (action: 'summarize' | 'questions' | 'cheat_sheet') => Promise<void>;
  handleRemoveDocument: () => void;
  isTutorTyping: boolean;
  isGeneratingPlan: boolean;
  isGeneratingAssessment: boolean;
  isEvaluating: boolean;
  isAdaptingPlan: boolean;
  currentAssessment: DiagnosticAssessment | null;
  latestEvaluation: EvaluationResult | null;
  firebaseUser: FirebaseUser | null;
  isAuthLoading: boolean;
  handleGoogleSignIn: () => Promise<void>;
  handleGuestSignIn: () => Promise<void>;
  isLiveVoiceOpen: boolean;
  setIsLiveVoiceOpen: (open: boolean) => void;
  isTranscribeModalOpen: boolean;
  setIsTranscribeModalOpen: (open: boolean) => void;
  handleRegisterAccount: (profileData: StudentProfile) => Promise<void>;
  handleLoginAccount: (account: StudentProfile) => void;
  handleSignOut: () => void;
  handleCreatePlan: (profileData: StudentProfile) => Promise<void>;
  handleSendMessage: (text: string) => Promise<void>;
  handleGenerateAssessment: () => Promise<void>;
  handleSubmitAssessment: (answers: Record<string, string>) => Promise<EvaluationResult>;
  handleAdaptPlan: (evalResult?: EvaluationResult) => Promise<void>;
  handleSelectPreset: (presetProfile: Partial<StudentProfile>) => void;
  handleCompleteCurrentStep: () => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  resetAllData: () => void;
}

const TutorContext = createContext<TutorContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'ast_is_authenticated',
  PROFILE: 'ast_student_profile',
  ACCOUNTS: 'ast_saved_student_accounts',
  PLAN: 'ast_learning_plan',
  STEP_IDX: 'ast_current_step_idx',
  ACTIVITIES: 'ast_agent_activities',
  CHATS: 'ast_chat_messages',
  EVAL: 'ast_latest_evaluation',
};

export const TutorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Authentication / Onboarding state: defaults to false if not previously authenticated!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const authVal = localStorage.getItem(STORAGE_KEYS.AUTH);
      return authVal === 'true';
    } catch {
      return false;
    }
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState<boolean>(false);
  const [isTranscribeModalOpen, setIsTranscribeModalOpen] = useState<boolean>(false);

  const [savedAccounts, setSavedAccounts] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        ...DEFAULT_STUDENT_PROFILE,
        id: 'std-lok-default',
        email: 'lok@university.edu',
        registeredAt: 'Demo Registered',
        cloudSyncEnabled: true,
      },
    ];
  });

  // Current logged in student profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  });

  const [plan, setPlan] = useState<LearningPlan | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STEP_IDX);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : INITIAL_AGENT_ACTIVITIES;
    } catch {
      return INITIAL_AGENT_ACTIVITIES;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-welcome',
        role: 'tutor',
        content: `Welcome to your personalized session, ${profile.name}! I am your Academic Intelligent Tutor for **${profile.subject}: ${profile.topic}**.\n\nSince you are working at the **${profile.knowledgeLevel}** level preparing for **${profile.goal}**, we will build physical intuition first before deriving mathematical stability criteria. Are you ready to begin?`,
        timestamp: 'Just now',
        conceptCard: {
          title: `${profile.topic} — System Balance`,
          formula: 'P_mech = P_elec (Equilibrium)',
          explanation: 'Rotor acceleration occurs whenever mechanical input power deviates from electrical power transfer.',
        },
        suggestedStudentResponses: [
          'Yes, let us begin with the prerequisite check.',
          'What is the physical meaning of rotor angle δ?',
          'Can you explain why faults cause instability?',
        ],
        agentAction: `Initialized student-centric dialogue calibrated for ${profile.knowledgeLevel} level in ${profile.subject}.`,
      },
    ];
  });

  const [currentAssessment, setCurrentAssessment] = useState<DiagnosticAssessment | null>(null);

  // PDF Document State
  const [uploadedDocument, setUploadedDocument] = useState<PdfDocument | null>(() => {
    try {
      const saved = localStorage.getItem('ast_uploaded_document');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState<boolean>(false);

  const [latestEvaluation, setLatestEvaluation] = useState<EvaluationResult | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVAL);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Loading states
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [isTutorTyping, setIsTutorTyping] = useState<boolean>(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAdaptingPlan, setIsAdaptingPlan] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const cloudProfile = await getUserProfileFromFirestore(user.uid);
          if (
            cloudProfile &&
            cloudProfile.hasCompletedOnboarding &&
            cloudProfile.branch &&
            cloudProfile.subject &&
            cloudProfile.topic
          ) {
            setProfile(cloudProfile);
            const cloudPlan = await getLatestPlanFromFirestore(user.uid);
            if (cloudPlan) setPlan(cloudPlan);
            setIsAuthenticated(true);
          } else {
            // New account or onboarding not yet completed:
            // Do not assume default profile or jump straight to dashboard!
            // Pre-fill name and email from Google auth, but leave academic fields to be chosen.
            setProfile(prev => ({
              ...prev,
              id: user.uid,
              uid: user.uid,
              name: user.displayName || prev.name || '',
              email: user.email || prev.email || '',
              photoURL: user.photoURL || undefined,
              branch: cloudProfile?.branch || '',
              subject: cloudProfile?.subject || '',
              topic: cloudProfile?.topic || '',
              hasCompletedOnboarding: false,
              cloudSyncEnabled: true,
              registeredAt: new Date().toLocaleDateString(),
            }));
            setIsAuthenticated(false);
          }
        } catch (e) {
          console.error('Error syncing user profile from Firestore:', e);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      if (uploadedDocument) {
        localStorage.setItem('ast_uploaded_document', JSON.stringify(uploadedDocument));
      } else {
        localStorage.removeItem('ast_uploaded_document');
      }
    } catch (e) {
      console.warn('LocalStorage error saving uploaded document', e);
    }
  }, [uploadedDocument]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated.toString());
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(savedAccounts));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [savedAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      if (plan) localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [plan]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STEP_IDX, currentStepIndex.toString());
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [currentStepIndex]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(agentActivities));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [agentActivities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [chatMessages]);

  useEffect(() => {
    try {
      if (latestEvaluation) localStorage.setItem(STORAGE_KEYS.EVAL, JSON.stringify(latestEvaluation));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, [latestEvaluation]);

  const activeStep = plan && plan.steps ? plan.steps[currentStepIndex] || null : null;

  const addAgentActivity = (title: string, description: string, category: AgentActivity['category']) => {
    const newAct: AgentActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title,
      description,
      category,
      status: 'completed',
    };
    setAgentActivities(prev => [newAct, ...prev]);
  };

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      // Also update in savedAccounts
      setSavedAccounts(accs => accs.map(a => (a.id === updated.id || a.email === updated.email ? updated : a)));
      if (firebaseUser?.uid) {
        saveUserProfileToFirestore(firebaseUser.uid, updated);
      }
      return updated;
    });
  };

  // Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      const user = await signInWithGoogle();
      addAgentActivity(
        'Google Authentication Successful',
        `Authenticated as ${user.displayName || user.email} with Firebase Auth. Firestore cloud sync enabled.`,
        'profile'
      );
      // Check if user already has an existing completed profile in Firestore
      const cloudProfile = await getUserProfileFromFirestore(user.uid);
      if (
        cloudProfile &&
        cloudProfile.hasCompletedOnboarding &&
        cloudProfile.branch &&
        cloudProfile.subject &&
        cloudProfile.topic
      ) {
        setProfile(cloudProfile);
        const cloudPlan = await getLatestPlanFromFirestore(user.uid);
        if (cloudPlan) setPlan(cloudPlan);
        setIsAuthenticated(true);
        setActiveTab('dashboard');
      } else {
        // New account or not yet completed onboarding:
        // Keep isAuthenticated = false so the user can configure their course, branch, semester, subject, topic, and modes!
        setProfile(prev => ({
          ...prev,
          id: user.uid,
          uid: user.uid,
          name: user.displayName || prev.name || '',
          email: user.email || prev.email || '',
          photoURL: user.photoURL || undefined,
          branch: cloudProfile?.branch || '',
          subject: cloudProfile?.subject || '',
          topic: cloudProfile?.topic || '',
          hasCompletedOnboarding: false,
          cloudSyncEnabled: true,
          registeredAt: new Date().toLocaleDateString(),
        }));
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      addAgentActivity(
        'Authentication Notice',
        `Google Sign-In: ${err?.message || 'Login cancelled or popup blocked'}. You may also register a profile or continue with guest access.`,
        'profile'
      );
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Quick Guest / Anonymous Sign-In
  const handleGuestSignIn = async () => {
    setIsAuthLoading(true);
    try {
      const guestResult = await signInGuest();
      const guestUid = guestResult?.uid || `guest_${Date.now().toString(36)}`;
      addAgentActivity(
        'Guest Sign-In Active',
        `Guest session initialized (ID: ${guestUid.slice(0, 10)}...).`,
        'profile'
      );
      // For guest, let them configure what they want to study
      setProfile(prev => ({
        ...prev,
        id: guestUid,
        uid: guestUid,
        name: prev.name && prev.name !== 'Lok' ? prev.name : 'Guest Student',
        email: `guest-${guestUid.slice(0, 6)}@student.edu`,
        branch: '',
        subject: '',
        topic: '',
        hasCompletedOnboarding: false,
      }));
      setIsAuthenticated(false);
    } catch (err: any) {
      const fallbackUid = `guest_${Date.now().toString(36)}`;
      setProfile(prev => ({
        ...prev,
        id: fallbackUid,
        uid: fallbackUid,
        name: 'Guest Student',
        email: `guest-${fallbackUid.slice(0, 6)}@student.edu`,
        branch: '',
        subject: '',
        topic: '',
        hasCompletedOnboarding: false,
      }));
      setIsAuthenticated(false);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign Out Flow
  const handleSignOut = async () => {
    try {
      await firebaseLogOut();
    } catch (e) {
      console.warn('Firebase logout warning:', e);
    }
    setFirebaseUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  // Register New Student Account Flow (Starting point!)
  const handleRegisterAccount = async (newProfile: StudentProfile) => {
    setIsGeneratingPlan(true);
    const completedProfile: StudentProfile = {
      ...newProfile,
      hasCompletedOnboarding: true,
      lastCloudSyncAt: new Date().toLocaleTimeString(),
    };
    setProfile(completedProfile);

    // Wipe any old evaluation or assessment so new student starts fresh with no fake scores!
    setLatestEvaluation(null);
    setCurrentAssessment(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.EVAL);
    } catch {}

    if (firebaseUser?.uid) {
      saveUserProfileToFirestore(firebaseUser.uid, completedProfile);
    }

    // Save to accounts list
    setSavedAccounts(prev => {
      const filtered = prev.filter(a => a.email !== completedProfile.email && a.id !== completedProfile.id);
      return [completedProfile, ...filtered];
    });

    try {
      const { plan: newPlan, agentActivities: newActs } = await fetchGeneratedPlan(completedProfile);
      setPlan(newPlan);
      setCurrentStepIndex(0);

      if (firebaseUser?.uid) {
        savePlanToFirestore(firebaseUser.uid, newPlan);
      }

      // Add high-level registration agent activities
      const regAct: AgentActivity = {
        id: `act-reg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        title: 'Student Academic Profile Configured',
        description: `Created profile for ${completedProfile.name} in branch ${completedProfile.branch} (${completedProfile.subject}: ${completedProfile.topic}). Cloud sync enabled.`,
        category: 'profile',
        status: 'completed',
      };

      setAgentActivities([regAct, ...newActs]);

      // Initialize welcome chat message for this topic
      const welcomeMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'tutor',
        content: `Greetings ${completedProfile.name}! Your academic profile for **${completedProfile.subject}: ${completedProfile.topic}** is ready.\n\nI have generated your **${completedProfile.availableTime}-minute personalized learning plan** calibrated for **${completedProfile.knowledgeLevel}** level and **${completedProfile.goal}**.\n\nWe will start with **${newPlan.steps[0]?.title || 'Prerequisite Check'}**.\n\n${newPlan.steps[0]?.description || 'Let us review the fundamental concepts.'}\n\nWhat is your current familiarity with this topic?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedStudentResponses: [
          `I am familiar with the basics, let's dive into ${completedProfile.topic}.`,
          `Please explain the foundational concepts simply.`,
          `Can you provide an intuitive real-world analogy?`,
        ],
        agentAction: `Personalized curriculum loaded for ${completedProfile.knowledgeLevel} level, ${completedProfile.goal}.`,
      };
      setChatMessages([welcomeMsg]);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Error registering account and generating plan:', err);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Sign In to Existing Account
  const handleLoginAccount = (account: StudentProfile) => {
    setProfile(account);
    if (firebaseUser?.uid) {
      saveUserProfileToFirestore(firebaseUser.uid, account);
    }
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    addAgentActivity(
      'Student signed in',
      `Session resumed for ${account.name} (${account.branch}, Sem ${account.semester}) studying ${account.topic}.`,
      'profile'
    );
  };

  // Generate Personalized Plan
  const handleCreatePlan = async (newProfile: StudentProfile) => {
    setIsGeneratingPlan(true);
    updateProfile(newProfile);
    try {
      const { plan: newPlan, agentActivities: newActs } = await fetchGeneratedPlan(newProfile);
      setPlan(newPlan);
      setCurrentStepIndex(0);
      setAgentActivities(prev => [...newActs, ...prev]);

      if (firebaseUser?.uid) {
        savePlanToFirestore(firebaseUser.uid, newPlan);
      }

      const welcomeMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'tutor',
        content: `Greetings ${newProfile.name}! I have generated your **${newProfile.availableTime}-minute personalized learning plan** for **${newProfile.topic}** (${newProfile.subject}).\n\nWe will start with **${newPlan.steps[0]?.title || 'Prerequisite Check'}**.\n\n${newPlan.steps[0]?.description || 'Let us review the fundamental concepts.'}\n\nWhat is your current understanding of this topic?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedStudentResponses: [
          `I am familiar with the basics, let's dive into ${newProfile.topic}.`,
          `Please explain the foundational concepts simply.`,
          `Can you provide an intuitive real-world analogy?`,
        ],
        agentAction: `Personalized curriculum loaded for ${newProfile.knowledgeLevel} level, ${newProfile.goal}.`,
      };
      setChatMessages([welcomeMsg]);
      setActiveTab('learning-plan');
    } catch (err) {
      console.error('Error generating plan:', err);
      addAgentActivity('Plan Generation Notification', 'Applied resilient academic curriculum template.', 'planning');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // PDF Management Handlers
  const handleUploadPdfFile = async (file: File) => {
    setIsAnalyzingPdf(true);
    addAgentActivity(
      'Document uploaded to AI Tutor',
      `Ingested "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Reading file and preparing document intelligence...`,
      'tutoring'
    );

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const newDoc: PdfDocument = {
          id: `doc-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type || 'application/pdf',
          base64: base64Data,
          uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setUploadedDocument(newDoc);

        // Run deep PDF analysis
        try {
          const { analysis, agentAction } = await fetchPdfAnalysis({
            base64: base64Data,
            fileName: file.name,
            action: 'summarize',
            profile,
          });

          setUploadedDocument(prev => prev ? { ...prev, analysis } : null);

          // Add tutor notification in chat
          const docMsg: ChatMessage = {
            id: `msg-doc-${Date.now()}`,
            role: 'tutor',
            content: `📄 **Document Ingested: "${file.name}"**\n\n${analysis.summary}\n\nI have extracted **${analysis.keyConcepts?.length || 4} key concepts** and **${analysis.keyFormulas?.length || 3} governing formulas** from this document. You can now ask any specific question about this document, request step-by-step problem solutions, or generate practice questions!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedStudentResponses: [
              `Summarize the key formulas from ${file.name}.`,
              `Generate practice problems based on ${file.name}.`,
              `Explain the main theorem in ${file.name}.`,
            ],
            agentAction: agentAction || `Parsed and indexed "${file.name}".`,
            pdfReference: { fileName: file.name },
          };

          setChatMessages(prev => [...prev, docMsg]);
          if (agentAction) {
            addAgentActivity('PDF Document Analyzed', agentAction, 'analysis');
          }
        } catch (err) {
          console.error('PDF analysis error:', err);
        } finally {
          setIsAnalyzingPdf(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to read file:', err);
      setIsAnalyzingPdf(false);
    }
  };

  const handleLoadSamplePdf = () => {
    const sampleDoc: PdfDocument = {
      id: 'doc-sample-1',
      name: `${profile.topic.replace(/\s+/g, '_')}_Lecture_Notes.pdf`,
      size: 248500,
      type: 'application/pdf',
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      analysis: {
        title: `${profile.topic} — Academic Lecture & Derivation Guide`,
        summary: `Comprehensive academic lecture notes on ${profile.subject}: ${profile.topic}. Covers electromechanical swing kinetics, rotor angle definitions, governing differential models, Equal Area Criterion energy balances, and protective relay fault clearing boundaries.`,
        keyConcepts: [
          {
            term: 'Rotor Angle Stability',
            definition: 'The ability of synchronous machines of an interconnected power system to remain in synchronism after being subjected to a disturbance.',
            importance: 'Essential metric to prevent generator pole-slipping and grid separation.',
          },
          {
            term: 'Equal Area Criterion',
            definition: 'A graphical energy conservation criterion equating the accelerating area A1 to the decelerating area A2 on the power-angle curve.',
            importance: 'Direct determination of transient stability without numerical differential equation solvers.',
          },
          {
            term: 'Critical Clearing Time (CCT)',
            definition: 'Maximum permissible duration between fault occurrence and fault isolation by circuit breakers before stability is lost.',
            importance: 'Specifies protective relay operating speed thresholds.',
          },
        ],
        keyFormulas: [
          {
            name: 'Swing Equation',
            formula: 'M (d²δ/dt²) = P_m - P_e = P_acc',
            explanation: 'M is angular momentum (2H/ωs), δ is rotor angle, Pm is mechanical shaft power, and Pe is electrical grid transfer.',
          },
          {
            name: 'Power Transfer Equation',
            formula: 'P_e = (E\' * V / X_transfer) * sin(δ)',
            explanation: 'E\' is internal voltage, V is infinite bus voltage, and X_transfer is total reactance.',
          },
        ],
        practiceQuestions: [
          {
            question: 'Under what physical condition does rotor acceleration d²δ/dt² become zero during system operation?',
            answer: 'When electrical power output Pe exactly equals mechanical shaft input Pm (net accelerating power Pa = 0).',
            concept: 'Power Equilibrium',
          },
          {
            question: 'How does clearing a fault beyond the Critical Clearing Time (CCT) lead to instability?',
            answer: 'Accelerating area A1 exceeds maximum available decelerating area A2, so kinetic energy cannot be fully dissipated before δmax.',
            concept: 'Transient Stability Limits',
          },
        ],
      },
    };

    setUploadedDocument(sampleDoc);
    addAgentActivity(
      'Sample PDF Loaded to AI Tutor',
      `Loaded and indexed "${sampleDoc.name}" for ${profile.topic}.`,
      'tutoring'
    );

    const docMsg: ChatMessage = {
      id: `msg-doc-sample-${Date.now()}`,
      role: 'tutor',
      content: `📄 **Academic Document Loaded: "${sampleDoc.name}"**\n\n${sampleDoc.analysis?.summary}\n\nI have indexed the equations and theorems from this document. You can now ask specific questions about formulas, definitions, or worked problems directly from this text!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedStudentResponses: [
        `Explain the swing equation from ${sampleDoc.name}.`,
        `How is Equal Area Criterion derived in ${sampleDoc.name}?`,
        `Generate 3 practice questions from this document.`,
      ],
      agentAction: `Indexed ${sampleDoc.name} with key concept cards.`,
      pdfReference: { fileName: sampleDoc.name },
    };
    setChatMessages(prev => [...prev, docMsg]);
  };

  const handleAnalyzePdf = async (action: 'summarize' | 'questions' | 'cheat_sheet') => {
    if (!uploadedDocument) return;
    setIsAnalyzingPdf(true);
    addAgentActivity('PDF Document Analysis Requested', `Executing "${action}" on "${uploadedDocument.name}".`, 'analysis');

    try {
      const { analysis, agentAction } = await fetchPdfAnalysis({
        base64: uploadedDocument.base64,
        text: uploadedDocument.extractedText,
        fileName: uploadedDocument.name,
        action,
        profile,
      });

      setUploadedDocument(prev => prev ? { ...prev, analysis } : null);

      let contentText = '';
      if (action === 'summarize') {
        contentText = `📋 **Executive Academic Summary of "${uploadedDocument.name}"**:\n\n${analysis.summary}\n\n**Core Takeaways:**\n${analysis.keyConcepts?.map((c: any) => `• **${c.term}**: ${c.definition}`).join('\n')}`;
      } else if (action === 'questions') {
        contentText = `📝 **Exam-Style Practice Questions from "${uploadedDocument.name}"**:\n\n` +
          analysis.practiceQuestions?.map((pq: any, i: number) => `**Q${i + 1} (${pq.concept}):** ${pq.question}\n*Answer/Solution:* ${pq.answer}\n`).join('\n');
      } else {
        contentText = `📐 **Formula & Definition Sheet for "${uploadedDocument.name}"**:\n\n` +
          analysis.keyFormulas?.map((kf: any) => `• **${kf.name}**:\n  \`${kf.formula}\`\n  ${kf.explanation}`).join('\n\n');
      }

      const msg: ChatMessage = {
        id: `msg-act-${Date.now()}`,
        role: 'tutor',
        content: contentText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentAction,
        pdfReference: { fileName: uploadedDocument.name },
      };

      setChatMessages(prev => [...prev, msg]);
    } catch (e) {
      console.error('PDF action error:', e);
    } finally {
      setIsAnalyzingPdf(false);
    }
  };

  const handleRemoveDocument = () => {
    setUploadedDocument(null);
    addAgentActivity('Document Removed', 'Cleared active PDF context from AI Tutor.', 'tutoring');
  };

  // Interactive Tutor Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'student',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pdfReference: uploadedDocument ? { fileName: uploadedDocument.name } : undefined,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsTutorTyping(true);

    try {
      const historyContext = chatMessages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const response = await fetchTutorResponse({
        profile,
        currentStep: activeStep,
        history: [...historyContext, { role: 'student', content: text }],
        userMessage: text,
        activeDocument: uploadedDocument
          ? {
              fileName: uploadedDocument.name,
              base64: uploadedDocument.base64,
              extractedText: uploadedDocument.extractedText,
            }
          : undefined,
      });

      const tutorMsg: ChatMessage = {
        id: `msg-${Date.now()}-tutor`,
        role: 'tutor',
        content: response.tutorMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        conceptCard: response.conceptCard,
        hints: response.hints,
        suggestedStudentResponses: response.suggestedStudentResponses,
        agentAction: response.agentAction,
        pdfReference: uploadedDocument ? { fileName: uploadedDocument.name } : undefined,
      };

      setChatMessages(prev => [...prev, tutorMsg]);

      if (response.agentAction) {
        addAgentActivity('Tutoring interaction adapted', response.agentAction, 'tutoring');
      }
    } catch (error) {
      console.error('Tutor response failed:', error);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        role: 'tutor',
        content: `Regarding your question on **"${text}"**: In academic analysis of **${profile.topic}**, we examine the governing dynamic equilibrium and parameter boundaries. Consider the balance of system forces and how they impact stability limits.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedStudentResponses: [
          'Can you show the exact formula with each variable explained?',
          'Let us try a worked example step-by-step.',
          'Give me a hint on how to conceptualize this.',
        ],
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTutorTyping(false);
    }
  };

  // Generate Assessment
  const handleGenerateAssessment = async () => {
    setIsGeneratingAssessment(true);
    addAgentActivity('Assessment generated', `Synthesizing diagnostic questions for ${profile.topic} tailored to ${profile.knowledgeLevel} level.`, 'assessment');
    try {
      const assessmentData = await fetchGeneratedAssessment({
        profile,
        topic: profile.topic,
        conceptsCovered: [profile.topic, 'Physical Balance', 'Governing Equations'],
      });
      setCurrentAssessment(assessmentData);
      setActiveTab('assessments');
    } catch (err) {
      console.error('Assessment generation failed:', err);
    } finally {
      setIsGeneratingAssessment(false);
    }
  };

  // Submit Assessment Evaluation
  const handleSubmitAssessment = async (answers: Record<string, string>): Promise<EvaluationResult> => {
    setIsEvaluating(true);
    addAgentActivity('Evaluating assessment', `Analyzing student responses and scoring concept mastery dimensions.`, 'analysis');
    try {
      const evaluation = await submitAssessmentEvaluation({
        profile,
        questions: currentAssessment?.questions || [],
        answers,
        topic: profile.topic,
      });

      setLatestEvaluation(evaluation);

      // Update student profile with new strengths / improvement areas
      updateProfile({
        strengths: Array.from(new Set([...profile.strengths, ...(evaluation.conceptsUnderstood || [])])),
        improvementAreas: evaluation.conceptsNeedingImprovement || [],
        overallProgress: Math.min(100, Math.round(profile.overallProgress + (evaluation.scorePercentage >= 70 ? 15 : 8))),
        sessionsCount: profile.sessionsCount + 1,
      });

      addAgentActivity(
        'Performance analyzed',
        `Diagnostic Score: ${evaluation.scorePercentage}%. Evaluated ${evaluation.questionEvaluations.length} concepts.`,
        'analysis'
      );

      if (evaluation.conceptsNeedingImprovement.length > 0) {
        addAgentActivity(
          `Knowledge gap identified: ${evaluation.conceptsNeedingImprovement[0]}`,
          `Identified low retention in ${evaluation.conceptsNeedingImprovement.join(', ')}. Triggering adaptive replanning.`,
          'analysis'
        );
      } else {
        addAgentActivity(
          'Mastery verified',
          `Student scored ${evaluation.scorePercentage}%. Preparing higher difficulty application.`,
          'analysis'
        );
      }

      if (firebaseUser?.uid) {
        saveEvaluationToFirestore(firebaseUser.uid, evaluation);
      }

      return evaluation;
    } finally {
      setIsEvaluating(false);
    }
  };

  // Adaptive Replanning
  const handleAdaptPlan = async (evalResult?: EvaluationResult) => {
    const resultToUse = evalResult || latestEvaluation;
    if (!resultToUse || !plan) return;

    setIsAdaptingPlan(true);
    addAgentActivity('Adapting learning plan', `Re-structuring curriculum steps based on recent diagnostic score (${resultToUse.scorePercentage}%).`, 'adaptation');

    try {
      const adaptData = await requestAdaptivePlan({
        currentPlan: plan,
        evaluationResult: resultToUse,
        profile,
      });

      const adaptedSteps: PlanStep[] = adaptData.adaptation.adaptedSteps || [];

      // Combine current completed steps with newly adapted steps
      const completedSteps = plan.steps.slice(0, currentStepIndex + 1).map(s => ({ ...s, status: 'completed' as const }));
      const newStepsList = [...completedSteps, ...adaptedSteps];

      const updatedPlan: LearningPlan = {
        ...plan,
        steps: newStepsList,
        summary: adaptData.adaptation.adaptationSummary || plan.summary,
        adaptedCount: (plan.adaptedCount || 0) + 1,
        lastAdaptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setPlan(updatedPlan);

      if (firebaseUser?.uid) {
        savePlanToFirestore(firebaseUser.uid, updatedPlan);
      }

      setCurrentStepIndex(completedSteps.length);

      if (adaptData.agentActivities) {
        setAgentActivities(prev => [...adaptData.agentActivities, ...prev]);
      }

      const adaptationMsg: ChatMessage = {
        id: `msg-adapt-${Date.now()}`,
        role: 'tutor',
        content: `**Learning Path Adapted by Agent:**\n\n${adaptData.adaptation.adaptationSummary}\n\n**Next Focus:** ${adaptData.adaptation.newRecommendedAction || 'Let us address the identified concepts together.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedStudentResponses: [
          'Yes, please explain this concept with an intuitive visual analogy.',
          'Let us work through a guided problem step-by-step.',
          'Can you clarify where my reasoning went wrong?',
        ],
        agentAction: `Plan adapted: ${resultToUse.scorePercentage < 70 ? 'Inserted remedial scaffolding' : 'Inserted advanced application'}.`,
      };

      setChatMessages(prev => [...prev, adaptationMsg]);
      setActiveTab('learning-plan');
    } catch (err) {
      console.error('Failed to adapt plan:', err);
    } finally {
      setIsAdaptingPlan(false);
    }
  };

  const handleSelectPreset = (preset: Partial<StudentProfile>) => {
    const updated = { ...profile, ...preset };
    updateProfile(updated);
    handleCreatePlan(updated as StudentProfile);
  };

  const handleCompleteCurrentStep = () => {
    if (!plan) return;
    setPlan(prev => {
      if (!prev) return null;
      const updatedSteps = [...prev.steps];
      if (updatedSteps[currentStepIndex]) {
        updatedSteps[currentStepIndex].status = 'completed';
      }
      return { ...prev, steps: updatedSteps };
    });

    if (currentStepIndex < plan.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setProfile(DEFAULT_STUDENT_PROFILE);
    setPlan(null);
    setCurrentStepIndex(0);
    setAgentActivities(INITIAL_AGENT_ACTIVITIES);
    setLatestEvaluation(null);
    setActiveTab('dashboard');
  };

  return (
    <TutorContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        savedAccounts,
        profile,
        updateProfile,
        plan,
        setPlan,
        currentStepIndex,
        setCurrentStepIndex,
        activeStep,
        activeTab,
        setActiveTab,
        agentActivities,
        addAgentActivity,
        chatMessages,
        uploadedDocument,
        setUploadedDocument,
        isAnalyzingPdf,
        handleUploadPdfFile,
        handleLoadSamplePdf,
        handleAnalyzePdf,
        handleRemoveDocument,
        isTutorTyping,
        isGeneratingPlan,
        isGeneratingAssessment,
        isEvaluating,
        isAdaptingPlan,
        currentAssessment,
        latestEvaluation,
        firebaseUser,
        isAuthLoading,
        handleGoogleSignIn,
        handleGuestSignIn,
        isLiveVoiceOpen,
        setIsLiveVoiceOpen,
        isTranscribeModalOpen,
        setIsTranscribeModalOpen,
        handleRegisterAccount,
        handleLoginAccount,
        handleSignOut,
        handleCreatePlan,
        handleSendMessage,
        handleGenerateAssessment,
        handleSubmitAssessment,
        handleAdaptPlan,
        handleSelectPreset,
        handleCompleteCurrentStep,
        showOnboardingModal,
        setShowOnboardingModal,
        resetAllData,
      }}
    >
      {children}
    </TutorContext.Provider>
  );
};

export const useTutor = () => {
  const context = useContext(TutorContext);
  if (!context) {
    throw new Error('useTutor must be used within a TutorProvider');
  }
  return context;
};
