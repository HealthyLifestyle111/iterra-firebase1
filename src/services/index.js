/**
 * Firebase Services - Replaces Base44 SDK
 * Central export point for all Firebase services
 * 
 * This provides a similar API to Base44 SDK but uses Firebase backend
 */

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

// Auth (already from Firebase)
export { auth as User } from '../firebase';

// Re-export firebase instances for direct use
export { auth, db, storage, functions } from '../firebase';
