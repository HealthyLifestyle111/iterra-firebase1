# iTerra Wellness Platform - Deployment Checklist

## Pre-Deployment Setup

### 1. Firebase Project Setup
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create or select project: `iterra-app1`
- [ ] Enable Firebase Authentication (Email/Password provider)
- [ ] Enable Cloud Firestore (Production mode)
- [ ] Enable Firebase Storage
- [ ] Enable Cloud Functions (requires Blaze plan)
- [ ] Enable Firebase Hosting

### 2. Get Firebase Credentials
From Firebase Console > Project Settings > General:
- [ ] Web API Key
- [ ] Project ID
- [ ] Storage Bucket
- [ ] Messaging Sender ID
- [ ] App ID

### 3. Configure Local Environment

Create `.env` file in project root:
```bash
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=iterra-app1.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=iterra-app1
REACT_APP_FIREBASE_STORAGE_BUCKET=iterra-app1.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_ADMIN_EMAIL=admin@yourdomain.com
```

Create `.firebaserc` file in project root:
```json
{
  "projects": {
    "default": "iterra-app1"
  }
}
```

### 4. Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
firebase login
```

## Deployment Options

### Option 1: Automated Deployment (Recommended)

**Quick setup and deploy:**
```bash
npm run setup    # Interactive Firebase configuration
npm run deploy   # Build and deploy everything
```

**Or use single command:**
```bash
./deploy-all.sh
```

### Option 2: Manual Step-by-Step Deployment

**Step 1: Install dependencies**
```bash
npm install
```

**Step 2: Build the React application**
```bash
npm run build
```

**Step 3: Deploy to Firebase**
```bash
firebase deploy
```

**Step 4: Deploy specific targets**
```bash
firebase deploy --only hosting          # Deploy hosting only
firebase deploy --only functions        # Deploy functions only
firebase deploy --only firestore:rules  # Deploy Firestore rules only
```

### Option 3: Individual Service Deployment

**Deploy hosting only:**
```bash
npm run deploy:hosting
```

**Deploy functions only:**
```bash
npm run deploy:functions
```

**Deploy Firestore rules only:**
```bash
npm run deploy:firestore
```

## Post-Deployment

### 1. Seed Associates Data

Edit `scripts/associates-data.js` with real associate information:
```javascript
const associates = [
  {
    name: "Jane Doe",
    email: "jane.doe@iterra.com",
    phone: "+15555555555",
    doterraUrl: "https://www.doterra.com/US/en/site/janedoe",
    role: "associate"
  }
];
```

**Download service account key:**
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save as `serviceAccountKey.json` in project root

**Seed the database:**
```bash
npm run seed
```

### 2. Verify Deployment

**Run verification script:**
```bash
npm run verify
```

**Manual verification:**
1. Visit your deployed site: `https://iterra-app1.web.app`
2. Test routes:
   - `/` - Home page
   - `/wellness-intake` - Wellness intake form
   - `/back-office` - Back office dashboard
   - `/home-essentials` - Home essentials
   - `/leadership-wisdom` - Leadership wisdom
3. Test authentication (create test account)
4. Test LotusAI chat assistant
5. Verify Firestore data access

### 3. Configure Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps
4. Wait for SSL certificate provisioning (up to 24 hours)

### 4. Set Up Monitoring

**Enable Google Analytics:**
1. Go to Firebase Console > Analytics
2. Enable Analytics for your project
3. Note your Measurement ID

**Enable Performance Monitoring:**
1. Go to Firebase Console > Performance
2. Enable Performance Monitoring

**Enable Crashlytics (optional):**
1. Go to Firebase Console > Crashlytics
2. Follow setup instructions

## Troubleshooting

### Build Errors

**Issue: Import errors**
- Verify all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules package-lock.json && npm install`

**Issue: Environment variables not found**
- Ensure `.env` file exists in project root
- Verify all `REACT_APP_*` variables are set
- Restart development server

### Deployment Errors

**Issue: Firebase CLI not authenticated**
```bash
firebase login
```

**Issue: Insufficient permissions**
- Ensure you're an owner/editor of the Firebase project
- Check IAM permissions in Firebase Console

**Issue: Functions deployment fails**
- Ensure Blaze plan is active
- Check function logs: `firebase functions:log`

**Issue: Firestore rules deployment fails**
- Validate rules syntax
- Check for rule conflicts

### Runtime Errors

**Issue: 404 errors on routes**
- Ensure Firebase Hosting rewrites are configured in `firebase.json`
- Redeploy hosting: `npm run deploy:hosting`

**Issue: Authentication not working**
- Verify Firebase Auth is enabled
- Check `.env` credentials are correct
- Verify auth provider (Email/Password) is enabled

**Issue: Firestore permission denied**
- Check Firestore security rules
- Verify user is authenticated
- Review rules in Firebase Console

## Production Checklist

Before going live:
- [ ] Test all pages and features
- [ ] Verify all forms submit correctly
- [ ] Test authentication flow
- [ ] Verify Firestore rules are secure
- [ ] Test file uploads
- [ ] Verify email notifications work
- [ ] Test LotusAI chat functionality
- [ ] Check mobile responsiveness
- [ ] Test in multiple browsers
- [ ] Set up error monitoring
- [ ] Configure backups
- [ ] Set up custom domain
- [ ] Update privacy policy and terms of service
- [ ] Test with real user accounts
- [ ] Monitor performance metrics
- [ ] Set up alerts for errors

## Support

If you encounter issues:
1. Check DEPLOYMENT_GUIDE.md for detailed instructions
2. Review PROJECT_STATUS.md for system architecture
3. Check Firebase Console logs
4. Review browser console for errors
5. Check Firebase Functions logs: `firebase functions:log`

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
