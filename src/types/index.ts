export type KnowledgeLevel =
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced'
  | 'Adaptive (Beginner to Advanced)';

export type LearningGoal =
  | 'Concept Understanding'
  | 'Exam Preparation'
  | 'Practice'
  | 'Revision';

export type AvailableStudyTime = 15 | 30 | 45 | 60;

export interface StudentProfile {
  id?: string;
  uid?: string;
  name: string;
  email?: string;
  photoURL?: string;
  course?: string; // e.g. B.Tech / B.E., B.Sc, M.Tech, BCA, MCA, Diploma
  branch: string;
  semester: number | string;
  subject: string;
  topic: string;
  knowledgeLevel: KnowledgeLevel;
  goal: LearningGoal;
  availableTime: AvailableStudyTime;
  strengths: string[];
  improvementAreas: string[];
  completedTopics: string[];
  overallProgress: number; // 0 - 100
  sessionsCount: number;
  hasCompletedOnboarding?: boolean;
  cloudSyncEnabled?: boolean;
  registeredAt?: string;
  lastCloudSyncAt?: string;
}

export interface PlanStep {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  type:
    | 'prerequisite'
    | 'concept'
    | 'worked_example'
    | 'guided_practice'
    | 'assessment'
    | 'remedial'
    | 'advanced';
  description: string;
  learningObjective: string;
  status: 'pending' | 'in_progress' | 'completed';
  isRemedial?: boolean;
}

export interface LearningPlan {
  id: string;
  topic: string;
  planTitle: string;
  summary: string;
  totalDuration: number;
  steps: PlanStep[];
  adaptedCount?: number;
  lastAdaptedAt?: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'conceptual' | 'short_answer' | 'application';
  conceptTag: string;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DiagnosticAssessment {
  id: string;
  assessmentTitle: string;
  topic: string;
  questions: Question[];
  createdAt: string;
}

export interface QuestionEvaluation {
  questionId: string;
  conceptTag: string;
  isCorrect: boolean;
  studentAnswer: string;
  correctAnswer: string;
  feedback: string;
}

export interface ConceptMastery {
  concept: string;
  score: number; // 0 - 100
}

export interface RecommendedNextStep {
  title: string;
  rationale: string;
  actionType: 'remedial' | 'advance' | 'practice';
}

export interface EvaluationResult {
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  summary: string;
  questionEvaluations: QuestionEvaluation[];
  conceptMastery: ConceptMastery[];
  conceptsUnderstood: string[];
  conceptsNeedingImprovement: string[];
  recommendedNextStep: RecommendedNextStep;
  timestamp: string;
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'profile' | 'planning' | 'tutoring' | 'assessment' | 'analysis' | 'adaptation';
  status: 'completed' | 'in_progress';
}

export interface PdfDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  base64?: string;
  extractedText?: string;
  pageCount?: number;
  uploadedAt: string;
  analysis?: PdfAnalysisResult;
}

export interface PdfAnalysisResult {
  title: string;
  summary: string;
  keyConcepts: Array<{
    term: string;
    definition: string;
    importance: string;
  }>;
  keyFormulas: Array<{
    name: string;
    formula: string;
    explanation: string;
  }>;
  practiceQuestions?: Array<{
    question: string;
    answer: string;
    concept: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: 'tutor' | 'student' | 'system';
  content: string;
  timestamp: string;
  conceptCard?: {
    title: string;
    formula?: string;
    explanation: string;
  };
  hints?: string[];
  suggestedStudentResponses?: string[];
  agentAction?: string;
  pdfReference?: {
    fileName: string;
    snippet?: string;
  };
}

export type ActiveNavTab =
  | 'dashboard'
  | 'my-learning'
  | 'ai-tutor'
  | 'learning-plan'
  | 'assessments'
  | 'progress'
  | 'student-profile';
