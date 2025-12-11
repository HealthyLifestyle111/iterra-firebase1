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
  signIn: (email, password) => auth.signInWithEmailAndPassword(email, password),
  signOut: () => auth.signOut(),
  signUp: (email, password) => auth.createUserWithEmailAndPassword(email, password),
};

export const aiService = aiOperations;
export const emailService = emailOperations;

// Auth (already from Firebase)
export { auth as User } from '../firebase';

// Re-export firebase instances for direct use
export { auth, db, storage, functions } from '../firebase';
