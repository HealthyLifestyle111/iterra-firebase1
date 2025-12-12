/**
 * Firebase Services - Replaces Base44 SDK
 * Central export point for all Firebase services
 * 
 * This provides a similar API to Base44 SDK but uses Firebase backend
 */

import * as firestoreOperations from './firestore';
import * as storageOperations from './storage';
import * as aiOperations from './ai';
import * as emailOperations from './email';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword } from 'firebase/auth';

// Database entities
export {
  WellnessIntake,
  Service,
  Consultation,
  Manifestation,
  TrainingContent,
  MonthlyUpdate,
  SpecializedIntake,
  Associate
} from './firestore';

// File operations
export {
  uploadFile,
  uploadPrivateFile,
  uploadFileWithProgress,
  deleteFile,
  listFiles,
  createFileSignedUrl
} from './storage';

// AI/LLM operations
export {
  invokeLLM,
  generateImage,
  extractDataFromFile,
  analyzeWellnessIntake,
  generateManifestationGuidance
} from './ai';

// Email operations
export {
  sendEmail,
  sendWellnessIntakeResults,
  sendConsultationConfirmation,
  sendAssociateWelcome
} from './email';

// Service collections for convenient access
export const firestoreService = {
  ...firestoreOperations,
  // Convenience methods
  createIntake: firestoreOperations.WellnessIntake.create,
  getIntake: firestoreOperations.WellnessIntake.get,
  updateIntake: firestoreOperations.WellnessIntake.update,
  listIntakes: firestoreOperations.WellnessIntake.list,
  createRecommendation: firestoreOperations.Manifestation.create,
  listRecommendations: firestoreOperations.Manifestation.list,
};

export const authService = {
  currentUser: () => auth.currentUser,
  signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
  signOut: () => firebaseSignOut(auth),
  signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  isAuthenticated: () => Promise.resolve(!!auth.currentUser),
  getCurrentUser: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    // Get user data from Firestore
    const userDoc = await firestoreOperations.Associate.get(user.uid);
    if (userDoc) return userDoc;
    // Fallback to email lookup
    const users = await firestoreOperations.Associate.list({ email: user.email });
    return users.length > 0 ? users[0] : null;
  },
};

export const aiService = aiOperations;
export const emailService = emailOperations;

// Auth (already from Firebase)
export { auth as User } from '../firebase';

// Re-export firebase instances for direct use
export { auth, db, storage, functions } from '../firebase';
