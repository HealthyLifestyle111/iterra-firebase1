# Iterra Oils Platform

A React web application for the Iterra oils platform with Firebase Authentication and Firestore database.

## Features

- **Public Landing Page** (`/`): Features teasers about doTERRA essential oils with a "Shop Oils" button
- **Associate Signup** (`/associate`): Form to register as an associate with email/password and doTERRA URL
- **Admin Dashboard** (`/admin`): Protected dashboard showing all associates with referral counts
- **Redirect System** (`/go/:slug`): Proxies to associate's doTERRA URL and tracks referral counts

## Tech Stack

- React 19.2
- Firebase (Authentication & Firestore)
- React Router DOM
- Firebase Functions (for redirect handling)

## Prerequisites

- Node.js 18+ installed
- Firebase account and project created
- Firebase CLI installed globally: `npm install -g firebase-tools`

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd iterra-firebase1
```

### 2. Install Dependencies

```bash
npm install
cd functions
npm install
cd ..
```

### 3. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in Firebase Console → Authentication → Sign-in method
3. Create a Firestore database in Firebase Console → Firestore Database
4. Copy `.env.example` to `.env` and fill in your Firebase configuration:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_ADMIN_EMAIL=admin@example.com
```

### 4. Initialize Firebase

```bash
firebase login
firebase use --add  # Select your Firebase project
```

### 5. Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore
```

### 6. Run Locally

```bash
npm start
```

The app will open at `http://localhost:3000`

## Deployment

### Deploy to Firebase Hosting

1. Build the production app:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

This will deploy:
- React app to Firebase Hosting
- Cloud Functions for the redirect system
- Firestore rules and indexes

## Data Model

### Associates Collection

```javascript
{
  email: string,           // Associate's email
  doterraUrl: string,      // Associate's doTERRA URL
  slug: string,            // URL slug derived from email
  referrals: number,       // Count of referral clicks
  createdAt: string        // ISO timestamp
}
```

## Routes

- `/` - Public landing page with teasers
- `/associate` - Associate signup form
- `/admin` - Admin dashboard (requires admin email login)
- `/go/:slug` - Redirects to associate's doTERRA URL (or doterra.com if not found)
- `/go/default` - Direct redirect to doterra.com

## Admin Access

To access the admin dashboard:
1. Set `REACT_APP_ADMIN_EMAIL` in `.env` to your admin email
2. Create an account with that email via Firebase Console → Authentication
3. Login at `/admin` with admin credentials

## Security

- Firestore rules allow read access to associates but restrict write access
- Admin dashboard requires authentication with specific admin email
- All routes are client-side; sensitive operations use Firebase security rules

## Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build

# Deploy functions only
firebase deploy --only functions

# Deploy hosting only
firebase deploy --only hosting
```

## Environment Variables

Create a `.env` file (never commit this):
- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Firebase app ID
- `REACT_APP_ADMIN_EMAIL` - Admin email for dashboard access

## License

MIT
