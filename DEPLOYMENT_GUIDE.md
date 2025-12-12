# iTerra Concierge Wellness Platform - Deployment Guide

This guide provides comprehensive instructions for deploying the iTerra Concierge Wellness Platform to Firebase.

## 🚀 Quick Start (One-Command Deployment)

```bash
./deploy-all.sh
```

This single command will:
1. Install all dependencies
2. Build the React application
3. Deploy to Firebase (Hosting, Functions, Firestore)
4. Verify the deployment

## 📋 Prerequisites

- **Node.js 18+** installed
- **Firebase CLI** installed: `npm install -g firebase-tools`
- **Firebase Project** created at [Firebase Console](https://console.firebase.google.com/)
- **Firebase services enabled**:
  - Authentication (Email/Password)
  - Firestore Database
  - Cloud Functions
  - Hosting

## 🔧 Step-by-Step Deployment

### Step 1: Configure Firebase

Run the interactive setup:

```bash
node scripts/setup-firebase.js
```

Or manually create `.env` file:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=iterra-app1.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=iterra-app1
REACT_APP_FIREBASE_STORAGE_BUCKET=iterra-app1.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_ADMIN_EMAIL=admin@iterrawellness.com
```

And create `.firebaserc`:

```json
{
  "projects": {
    "default": "iterra-app1"
  }
}
```

### Step 2: Deploy

Run the automated deployment:

```bash
node scripts/deploy.js
```

Or deploy manually:

```bash
# Install dependencies
npm install --legacy-peer-deps
cd functions && npm install && cd ..

# Build React app
npm run build

# Deploy to Firebase
firebase deploy
```

### Step 3: Seed Associates

After deployment, seed the database with associates:

```bash
node scripts/seed-associates.js
```

**Before seeding, update associate data:**

Edit `scripts/associates-data.js` with real associate information:

```javascript
const associates = [
  {
    name: "Jane Doe",
    email: "jane.doe@iterra.com",
    phone: "+15555555555",
    doterraUrl: "https://www.doterra.com/US/en/site/janedoe",
    role: "associate"  // or "admin"
  },
  // Add more associates...
];
```

**Note:** You'll need a Firebase service account JSON file:
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save as `firebase-service-account.json` in the project root
4. Set environment variable: `export FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json`

### Step 4: Verify Deployment

```bash
node scripts/verify-deployment.js
```

## 📊 Available Scripts

### `scripts/setup-firebase.js`
Interactive Firebase configuration setup. Creates `.env` and `.firebaserc` files.

```bash
node scripts/setup-firebase.js
```

### `scripts/deploy.js`
Complete automated deployment with environment validation, dependency installation, build, and Firebase deployment.

```bash
node scripts/deploy.js
```

### `scripts/seed-associates.js`
Seeds Firestore database with associate data from `associates-data.js`. Includes validation for email format (standard email regex) and phone format (E.164).

**Before running:**
1. Edit `scripts/associates-data.js` with real associate information
2. Ensure Firebase service account JSON is available

```bash
node scripts/seed-associates.js
```

**Data format in associates-data.js:**
- `name`: Full name (string, required)
- `email`: Valid email address (string, required, validated)
- `phone`: E.164 format phone (string, required, validated, e.g., +15555555555)
- `doterraUrl`: Associate's doTERRA URL (string, required)
- `role`: Either "associate" or "admin" (string, required)

Auto-generated fields:
- `slug`: Generated from email
- `referralCode`: 8-character unique code
- `referralCounter`: Initialized to 0
- `createdAt`/`updatedAt`: Timestamps

### `scripts/verify-deployment.js`
Verifies that hosting, functions, and Firestore are working correctly after deployment.

```bash
node scripts/verify-deployment.js
```

### `deploy-all.sh`
One-command deployment script that runs all steps automatically.

```bash
./deploy-all.sh
```

## 🔐 Security Setup

### Firestore Security Rules

The project includes security rules in `firestore.rules`:
- Public read access for associates (needed for redirects)
- Authenticated write for own records
- Admin-only delete permissions

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

### Firebase Authentication

Enable Email/Password authentication:
1. Go to Firebase Console > Authentication
2. Click "Get Started"
3. Enable "Email/Password" sign-in method
4. Save

## 🎯 Post-Deployment Tasks

1. **Test the Platform**
   - Visit: `https://iterra-app1.web.app`
   - Test associate signup at `/associate`
   - Test admin dashboard at `/admin`
   - Test referral links at `/go/:slug`

2. **Set Up Admin User**
   - Go to Firebase Console > Authentication > Users
   - Add a user with the email specified in `REACT_APP_ADMIN_EMAIL`
   - This user will have admin access to the dashboard

3. **Seed Real Associates**
   - Edit `scripts/seed-associates.js` with real associate data
   - Run: `node scripts/seed-associates.js`
   - Verify in Firebase Console > Firestore Database

4. **Configure Custom Domain** (Optional)
   - Go to Firebase Console > Hosting
   - Click "Add custom domain"
   - Follow DNS configuration instructions

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
rm -rf functions/node_modules functions/package-lock.json
npm install --legacy-peer-deps
cd functions && npm install && cd ..
npm run build
```

### Deployment Fails

```bash
# Verify Firebase login
firebase login

# Check project configuration
firebase projects:list
firebase use iterra-app1

# Deploy specific components
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

### Functions Not Working

```bash
# Check function logs
firebase functions:log

# Redeploy functions
firebase deploy --only functions
```

### Seeding Fails

Ensure you have:
1. Downloaded Firebase service account JSON
2. Set correct path: `export FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json`
3. Firestore is initialized in Firebase Console

## 📦 CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Create .env file
        run: |
          echo "REACT_APP_FIREBASE_API_KEY=${{ secrets.FIREBASE_API_KEY }}" > .env
          echo "REACT_APP_FIREBASE_AUTH_DOMAIN=${{ secrets.FIREBASE_AUTH_DOMAIN }}" >> .env
          echo "REACT_APP_FIREBASE_PROJECT_ID=${{ secrets.FIREBASE_PROJECT_ID }}" >> .env
          echo "REACT_APP_FIREBASE_STORAGE_BUCKET=${{ secrets.FIREBASE_STORAGE_BUCKET }}" >> .env
          echo "REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}" >> .env
          echo "REACT_APP_FIREBASE_APP_ID=${{ secrets.FIREBASE_APP_ID }}" >> .env
          echo "REACT_APP_ADMIN_EMAIL=${{ secrets.ADMIN_EMAIL }}" >> .env
      
      - name: Run deployment
        run: node scripts/deploy.js
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

Add secrets to GitHub repository:
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `ADMIN_EMAIL`
- `FIREBASE_TOKEN` (from `firebase login:ci`)

## 📊 Monitoring & Analytics

### Firebase Console Monitoring

1. **Hosting**: View traffic and bandwidth usage
2. **Functions**: Monitor invocations, errors, and execution time
3. **Firestore**: Track read/write operations
4. **Authentication**: Monitor user signups and activity

### Custom Analytics

Add Google Analytics to track:
- Referral link clicks
- Associate signups
- Admin dashboard usage
- Conversion rates

## 🔄 Updating the Platform

To deploy updates:

```bash
# Pull latest changes
git pull origin main

# Deploy
./deploy-all.sh
```

Or use the deployment script:

```bash
node scripts/deploy.js
```

## 📞 Support

For issues or questions:
1. Check Firebase Console logs
2. Run verification script: `node scripts/verify-deployment.js`
3. Review deployment logs
4. Check Firebase status: https://status.firebase.google.com/

---

**Project:** iTerra Concierge Wellness Platform  
**Firebase Project:** iterra-app1  
**Platform:** Firebase (Hosting, Functions, Firestore, Authentication)
