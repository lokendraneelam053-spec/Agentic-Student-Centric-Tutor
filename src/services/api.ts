import { StudentProfile, LearningPlan, AgentActivity, DiagnosticAssessment, EvaluationResult } from '../types';

export async function fetchGeneratedPlan(profile: StudentProfile): Promise<{
  plan: LearningPlan;
  agentActivities: AgentActivity[];
}> {
  const response = await fetch('/api/agent/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate plan: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    plan: {
      ...data.plan,
      id: `plan-${Date.now()}`,
      topic: profile.topic,
      totalDuration: profile.availableTime,
    },
    agentActivities: data.agentActivities || [],
  };
}

export async function fetchTutorResponse(payload: {
  profile: StudentProfile;
  currentStep: any;
  history: Array<{ role: string; content: string }>;
  userMessage: string;
  activeDocument?: {
    fileName: string;
    base64?: string;
    extractedText?: string;
  };
}) {
  const response = await fetch('/api/agent/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Tutor error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchPdfAnalysis(payload: {
  base64?: string;
  text?: string;
  fileName: string;
  action: 'summarize' | 'questions' | 'cheat_sheet';
  profile: StudentProfile;
}) {
  const response = await fetch('/api/agent/pdf-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`PDF Analysis error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchGeneratedAssessment(payload: {
  profile: StudentProfile;
  topic: string;
  conceptsCovered?: string[];
}): Promise<DiagnosticAssessment> {
  const response = await fetch('/api/agent/assessment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Assessment error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    id: `assess-${Date.now()}`,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function submitAssessmentEvaluation(payload: {
  profile: StudentProfile;
  questions: any[];
  answers: Record<string, string>;
  topic: string;
}): Promise<EvaluationResult> {
  const response = await fetch('/api/agent/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Evaluation error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export async function requestAdaptivePlan(payload: {
  currentPlan: LearningPlan;
  evaluationResult: EvaluationResult;
  profile: StudentProfile;
}) {
  const response = await fetch('/api/agent/adapt-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Adaptation error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAudioTranscription(payload: {
  audioBase64: string;
  mimeType?: string;
  prompt?: string;
}): Promise<{ transcription: string }> {
  const response = await fetch('/api/agent/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Transcription error: ${response.statusText}`);
  }

  return response.json();
}

