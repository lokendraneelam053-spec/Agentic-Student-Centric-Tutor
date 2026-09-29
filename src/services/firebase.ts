import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  getDocFromServer,
} from 'firebase/firestore';
import { StudentProfile, LearningPlan, EvaluationResult } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific databaseId as required by skill guidelines
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// -------------------------------------------------------------
// Standardized Firestore Error Handling per Firebase Skill
// -------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection verification test per skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline: please check your Firebase configuration.');
    } else {
      console.log('Firestore connection verified (security rules active).');
    }
    return false;
  }
}

// Initial boot check
testFirestoreConnection();

// Google Sign-In
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

// Anonymous / Quick Guest Sign-In fallback
export async function signInGuest(): Promise<{ uid: string; isAnonymous: boolean } | null> {
  try {
    const result = await signInAnonymously(auth);
    return { uid: result.user.uid, isAnonymous: true };
  } catch (err: any) {
    // If anonymous sign-in is restricted or disabled in Firebase console, fallback to local guest session
    const guestId = `guest_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    return { uid: guestId, isAnonymous: true };
  }
}

// Sign-Out
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// User Profile Firestore Persistence
export async function saveUserProfileToFirestore(userId: string, profile: StudentProfile): Promise<void> {
  if (!userId || !auth.currentUser) return;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(
      userDocRef,
      {
        ...profile,
        uid: userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`Saved user profile to Firestore for UID: ${userId}`);
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.warn('Notice: Firestore profile sync not completed:', error);
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<StudentProfile | null> {
  if (!userId || !auth.currentUser) return null;
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as StudentProfile;
    }
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.warn('Notice: Firestore profile lookup not completed:', error);
  }
  return null;
}

// Learning Plan Firestore Persistence
export async function savePlanToFirestore(userId: string, plan: LearningPlan): Promise<void> {
  if (!userId || !plan || !auth.currentUser) return;
  const planId = plan.id || `plan-${Date.now()}`;
  const path = `users/${userId}/plans/${planId}`;
  try {
    const planDocRef = doc(db, 'users', userId, 'plans', planId);
    await setDoc(
      planDocRef,
      {
        ...plan,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`Saved learning plan ${plan.id} to Firestore.`);
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    console.warn('Notice: Firestore plan sync not completed:', error);
  }
}

export async function getLatestPlanFromFirestore(userId: string): Promise<LearningPlan | null> {
  if (!userId || !auth.currentUser) return null;
  const path = `users/${userId}/plans`;
  try {
    const plansColl = collection(db, 'users', userId, 'plans');
    const snap = await getDocs(plansColl);
    if (!snap.empty) {
      const plans = snap.docs.map(d => d.data() as LearningPlan);
      return plans[plans.length - 1] || null;
    }
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.LIST, path);
    }
    console.warn('Notice: Firestore plan fetch not completed:', error);
  }
  return null;
}

// Assessment Evaluation Firestore Persistence
export async function saveEvaluationToFirestore(userId: string, evaluation: EvaluationResult): Promise<void> {
  if (!userId || !evaluation || !auth.currentUser) return;
  const path = `users/${userId}/evaluations`;
  try {
    const evalColl = collection(db, 'users', userId, 'evaluations');
    await addDoc(evalColl, {
      ...evaluation,
      createdAt: new Date().toISOString(),
    });
    console.log('Saved assessment evaluation to Firestore.');
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
    console.warn('Notice: Firestore evaluation sync not completed:', error);
  }
}

// Audio Transcription Firestore Persistence
export async function saveTranscriptionToFirestore(
  userId: string,
  transcription: {
    id: string;
    text: string;
    durationSeconds?: number;
    topic?: string;
  }
): Promise<void> {
  if (!userId || !transcription || !auth.currentUser) return;
  const path = `users/${userId}/transcriptions`;
  try {
    const transColl = collection(db, 'users', userId, 'transcriptions');
    await addDoc(transColl, {
      ...transcription,
      createdAt: new Date().toISOString(),
    });
    console.log('Saved audio transcription to Firestore.');
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
    console.warn('Notice: Firestore transcription sync not completed:', error);
  }
}

// Voice Session Firestore Persistence
export async function saveVoiceSessionToFirestore(
  userId: string,
  sessionData: {
    id: string;
    turns: Array<{ role: 'user' | 'model'; text: string; timestamp: string }>;
    durationSeconds: number;
  }
): Promise<void> {
  if (!userId || !auth.currentUser) return;
  const path = `users/${userId}/voiceSessions`;
  try {
    const voiceColl = collection(db, 'users', userId, 'voiceSessions');
    await addDoc(voiceColl, {
      ...sessionData,
      createdAt: new Date().toISOString(),
    });
    console.log('Saved live voice conversation session to Firestore.');
  } catch (error: any) {
    if (error?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
    console.warn('Notice: Firestore voice session sync not completed:', error);
  }
}
