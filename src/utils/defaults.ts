import { StudentProfile, LearningPlan, AgentActivity, EvaluationResult } from '../types';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Lok',
  branch: 'Electrical and Electronics Engineering',
  semester: '7',
  subject: 'Power Systems',
  topic: 'Power System Stability',
  knowledgeLevel: 'Beginner',
  goal: 'Exam Preparation',
  availableTime: 30,
  strengths: ['Network Impedance Models', 'Per-Unit System', 'Synchronous Generator Basics'],
  improvementAreas: ['Equal Area Criterion', 'Transient Stability Under Symmetrical Faults'],
  completedTopics: ['Per-Unit Fundamentals', 'Gauss-Seidel Load Flow'],
  overallProgress: 42,
  sessionsCount: 3,
};

export const SAMPLE_PRESETS: Array<{
  label: string;
  badge: string;
  profile: Partial<StudentProfile>;
}> = [
  {
    label: 'Power Systems (Requested Default)',
    badge: 'Electrical Engineering',
    profile: {
      name: 'Lok',
      branch: 'Electrical and Electronics Engineering',
      semester: '7',
      subject: 'Power Systems',
      topic: 'Power System Stability',
      knowledgeLevel: 'Beginner',
      goal: 'Exam Preparation',
      availableTime: 30,
    },
  },
  {
    label: 'Artificial Intelligence & Neural Networks',
    badge: 'Computer Science',
    profile: {
      name: 'Aria Chen',
      branch: 'Computer Science and Engineering',
      semester: '6',
      subject: 'Artificial Intelligence',
      topic: 'Backpropagation and Gradient Descent',
      knowledgeLevel: 'Intermediate',
      goal: 'Concept Understanding',
      availableTime: 45,
    },
  },
  {
    label: 'Control Systems Engineering',
    badge: 'Instrumentation',
    profile: {
      name: 'Marcus Vance',
      branch: 'Electrical & Instrumentation',
      semester: '5',
      subject: 'Control Systems',
      topic: 'Bode Plots & Gain/Phase Margins',
      knowledgeLevel: 'Beginner',
      goal: 'Exam Preparation',
      availableTime: 30,
    },
  },
  {
    label: 'Algorithms & Complexity',
    badge: 'Information Technology',
    profile: {
      name: 'Priya Sharma',
      branch: 'Information Technology',
      semester: '4',
      subject: 'Design & Analysis of Algorithms',
      topic: 'Dijkstra and A* Shortest Paths',
      knowledgeLevel: 'Intermediate',
      goal: 'Practice',
      availableTime: 45,
    },
  },
];

export const INITIAL_AGENT_ACTIVITIES: AgentActivity[] = [
  {
    id: 'act-init-1',
    timestamp: '10:00:12 AM',
    title: 'Student profile analyzed',
    description: "Ingested Lok's profile: Electrical and Electronics Engineering (Sem 7), Beginner level.",
    category: 'profile',
    status: 'completed',
  },
  {
    id: 'act-init-2',
    timestamp: '10:00:15 AM',
    title: 'Learning goal identified',
    description: 'Calibrated curriculum for Exam Preparation in Power System Stability within 30 minutes.',
    category: 'planning',
    status: 'completed',
  },
  {
    id: 'act-init-3',
    timestamp: '10:00:20 AM',
    title: 'Personalized plan created',
    description: 'Generated 5 pedagogical phases: Prerequisite Check, Concept, Worked Example, Guided Practice, Assessment.',
    category: 'planning',
    status: 'completed',
  },
  {
    id: 'act-init-4',
    timestamp: '10:00:22 AM',
    title: 'Learning activity selected',
    description: 'Initialized active Socratic tutoring session targeting physical power equilibrium and the swing equation.',
    category: 'tutoring',
    status: 'completed',
  },
];

export const INITIAL_EVALUATION_SAMPLE: EvaluationResult = {
  totalScore: 2,
  maxScore: 4,
  scorePercentage: 50,
  timestamp: 'Previous Session',
  summary: 'Diagnostic assessment revealed solid intuition for voltage levels, but highlighted critical gaps in Equal Area Criterion and transient swing kinetics.',
  questionEvaluations: [
    {
      questionId: 'q1',
      conceptTag: 'Rotor Angle Stability',
      isCorrect: true,
      studentAnswer: 'A) Electrical power output abruptly drops while turbine input remains constant',
      correctAnswer: 'A) Electrical power output abruptly drops while turbine input remains constant',
      feedback: 'Correct! Rotor acceleration is initiated by Pm > Pe.',
    },
    {
      questionId: 'q2',
      conceptTag: 'Equal Area Criterion',
      isCorrect: false,
      studentAnswer: 'D) Accelerating area is strictly greater than decelerating area',
      correctAnswer: 'A) Decelerating area (A2) must equal or exceed accelerating area (A1)',
      feedback: 'Incorrect. If accelerating area exceeds decelerating area, kinetic energy cannot be fully dissipated, driving the machine out of step.',
    },
    {
      questionId: 'q3',
      conceptTag: 'Voltage Stability',
      isCorrect: true,
      studentAnswer: 'A) P-V (Power-Voltage) Nose Curve',
      correctAnswer: 'A) P-V (Power-Voltage) Nose Curve',
      feedback: 'Correct! The nose curve illustrates the maximum power transfer and voltage breakdown point.',
    },
    {
      questionId: 'q4',
      conceptTag: 'Transient Stability Limits',
      isCorrect: false,
      studentAnswer: 'B) The system remains stable with reduced damping',
      correctAnswer: 'A) System loses synchronism because clearing time exceeded CCT',
      feedback: 'Incorrect. Clearing beyond critical clearing time leads directly to loss of synchronism.',
    },
  ],
  conceptMastery: [
    { concept: 'Voltage Stability', score: 80 },
    { concept: 'Rotor Angle Stability', score: 70 },
    { concept: 'Transient Stability Limits', score: 50 },
    { concept: 'Equal Area Criterion', score: 40 },
  ],
  conceptsUnderstood: ['Voltage Stability', 'Rotor Angle Stability'],
  conceptsNeedingImprovement: ['Equal Area Criterion', 'Transient Stability Limits'],
  recommendedNextStep: {
    title: 'Strengthen Equal Area Criterion before moving forward',
    rationale: 'Assessment revealed uncertainty in balancing accelerating and decelerating energy areas during fault transients.',
    actionType: 'remedial',
  },
};
