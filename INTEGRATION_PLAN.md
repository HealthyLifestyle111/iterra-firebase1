# iTerra Wellness Platform - Firebase Integration Plan

## Overview
Migrating complete iTerra Wellness application from Base44 SDK to Firebase backend.

## Base44 → Firebase Mapping

### Database Entities (Firestore Collections)
| Base44 Entity | Firestore Collection | Fields |
|---------------|---------------------|---------|
| WellnessIntake | `wellnessIntakes` | userId, answers, results, createdAt, updatedAt |
| Service | `services` | name, description, price, duration, active |
| Consultation | `consultations` | userId, serviceId, date, status, notes |
| Manifestation | `manifestations` | userId, goal, action, progress, createdAt |
| TrainingContent | `trainingContent` | title, content, category, order, published |
| MonthlyUpdate | `monthlyUpdates` | month, year, content, highlights, published |
| SpecializedIntake | `specializedIntakes` | userId, type, answers, results, createdAt |

### Authentication
- **Base44**: `base44.auth`
- **Firebase**: Already implemented with `firebase/auth`
- Status: ✅ No changes needed

### Integrations

#### 1. InvokeLLM (AI/LLM Integration)
- **Base44**: `base44.integrations.Core.InvokeLLM`
- **Firebase**: Firebase Functions + OpenAI API
- **Implementation**: Create Cloud Function `invokeLLM` that calls OpenAI API
- **Environment**: Add `OPENAI_API_KEY` to Firebase Functions config

#### 2. SendEmail
- **Base44**: `base44.integrations.Core.SendEmail`
- **Firebase**: Firebase Functions + SendGrid/Nodemailer
- **Implementation**: Create Cloud Function `sendEmail`
- **Environment**: Add email service credentials

#### 3. UploadFile / UploadPrivateFile
- **Base44**: `base44.integrations.Core.UploadFile`
- **Firebase**: Firebase Storage
- **Implementation**: 
  - Public files: Storage bucket with public rules
  - Private files: Storage bucket with authenticated rules
  - Helper functions in `src/services/storage.js`

#### 4. GenerateImage
- **Base44**: `base44.integrations.Core.GenerateImage`
- **Firebase**: Firebase Functions + OpenAI DALL-E API
- **Implementation**: Create Cloud Function `generateImage`

#### 5. ExtractDataFromUploadedFile
- **Base44**: `base44.integrations.Core.ExtractDataFromUploadedFile`
- **Firebase**: Firebase Functions + OCR/Document AI
- **Implementation**: Create Cloud Function `extractData` using Google Cloud Vision API

#### 6. CreateFileSignedUrl
- **Base44**: `base44.integrations.Core.CreateFileSignedUrl`
- **Firebase**: Storage signed URLs
- **Implementation**: Use Firebase Admin SDK `getSignedUrl()`

## Migration Steps

### Phase 1: Firebase Service Layer (Current)
1. ✅ Create `src/services/firebase.js` - Firebase config
2. ⏳ Create `src/services/firestore.js` - Database operations
3. ⏳ Create `src/services/storage.js` - File operations
4. ⏳ Create `src/services/ai.js` - LLM integrations
5. ⏳ Update `functions/` with new Cloud Functions

### Phase 2: UI Integration
1. Copy Tailwind configuration
2. Copy UI components from `src/components/ui/`
3. Migrate pages
4. Update imports to use Firebase services

### Phase 3: Build & Deploy
1. Update package.json dependencies
2. Configure build system (Vite or CRA)
3. Test locally
4. Deploy to Firebase

## File Structure (Target)
```
src/
├── api/                    # REMOVE - Base44 specific
├── services/              # NEW - Firebase services
│   ├── firebase.js        # Firebase config
│   ├── firestore.js       # Database operations  
│   ├── storage.js         # File operations
│   └── ai.js              # AI/LLM operations
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Portal.jsx
│   ├── ManifestationManager.jsx
│   └── ...
├── pages/
│   ├── BackOffice.jsx
│   ├── WellnessIntake.jsx
│   ├── SpecializedIntake.jsx
│   └── ...
└── utils/

functions/
├── index.js
├── invokeLLM.js           # NEW
├── sendEmail.js           # NEW  
├── generateImage.js       # NEW
├── extractData.js         # NEW
└── redirect.js            # EXISTING
```

## Dependencies to Add
- Firebase packages already included
- `@radix-ui/*` - UI components
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `react-hook-form` - Forms
- `zod` - Validation

## Dependencies to Remove
- `@base44/sdk` - Replaced with Firebase

## Environment Variables Required
```
# Existing
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_ADMIN_EMAIL

# New for Functions
OPENAI_API_KEY
SENDGRID_API_KEY (or SMTP credentials)
```

## Notes
- Keep existing deployment automation
- Maintain Firebase Auth integration
- Preserve referral tracking system
- Add new features without breaking existing ones
