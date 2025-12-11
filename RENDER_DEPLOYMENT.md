# Render.com Deployment Guide for iTerra Wellness Platform

This guide provides complete step-by-step instructions for deploying the iTerra Concierge Wellness Platform to Render.com.

## Prerequisites

- GitHub repository connected to Render
- Firebase project created (project ID: `itterra-app1`)
- Firebase configuration credentials
- Admin email for platform access

## Quick Start

### Option 1: Automated Deployment (Recommended)

Render will automatically detect `render.yaml` and configure your service.

1. **Connect to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will auto-detect `render.yaml`

2. **Configure Environment Variables** (in Render Dashboard):
   ```
   REACT_APP_FIREBASE_API_KEY=<your-firebase-api-key>
   REACT_APP_FIREBASE_PROJECT_ID=itterra-app1
   REACT_APP_FIREBASE_AUTH_DOMAIN=itterra-app1.firebaseapp.com
   REACT_APP_FIREBASE_DATABASE_URL=https://itterra-app1-default-rtdb.firebaseio.com
   REACT_APP_FIREBASE_STORAGE_BUCKET=itterra-app1.appspot.com
   REACT_APP_ADMIN_EMAIL=<your-admin-email>
   ```

3. **Deploy**: Click "Apply" and Render will build and deploy automatically

### Option 2: Manual Service Creation

1. **Create New Web Service**:
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the branch with your code

2. **Configure Build Settings**:
   ```
   Name: iterra-wellness-platform
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Add Environment Variables** (Settings → Environment):
   - `REACT_APP_FIREBASE_API_KEY` - Your Firebase API key (from Firebase Console)
   - `REACT_APP_FIREBASE_PROJECT_ID` - `itterra-app1`
   - `REACT_APP_FIREBASE_AUTH_DOMAIN` - `itterra-app1.firebaseapp.com`
   - `REACT_APP_FIREBASE_DATABASE_URL` - `https://itterra-app1-default-rtdb.firebaseio.com`
   - `REACT_APP_FIREBASE_STORAGE_BUCKET` - `itterra-app1.appspot.com`
   - `REACT_APP_ADMIN_EMAIL` - Your admin email

4. **Deploy**: Save and Render will trigger the first deployment

## Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `itterra-app1`
3. Navigate to **Project Settings** (gear icon) → **General**
4. Scroll to **Your apps** section
5. Find your web app or click "Add app" → Web
6. Copy the config values:
   - `apiKey` → `REACT_APP_FIREBASE_API_KEY`
   - `projectId` → `REACT_APP_FIREBASE_PROJECT_ID`
   - `authDomain` → `REACT_APP_FIREBASE_AUTH_DOMAIN`
   - `databaseURL` → `REACT_APP_FIREBASE_DATABASE_URL`
   - `storageBucket` → `REACT_APP_FIREBASE_STORAGE_BUCKET`

## Post-Deployment

### 1. Verify Deployment

Once deployed, Render will provide a URL like: `https://iterra-wellness-platform.onrender.com`

Test these routes:
- `/` - Home page
- `/back-office` - Back office dashboard
- `/wellness-intake` - Wellness intake form
- `/specialized-intake` - Specialized intake
- `/admin` - Admin dashboard (requires admin login)

### 2. Check Build Logs

In Render Dashboard → Logs, verify:
- `npm install` completed successfully
- `npm run build` completed without errors
- `npm start` running serve on the correct PORT
- No Firebase connection errors

### 3. Seed Associates (Optional)

If you need to seed the database with associates:

```bash
# Locally, with Firebase credentials configured
npm run seed
```

Or use the Firebase Console to manually add associates to the `associates` collection.

### 4. Configure Custom Domain (Optional)

1. In Render Dashboard → Settings → Custom Domains
2. Add your domain (e.g., `app.iterra.com`)
3. Update DNS records as instructed by Render
4. Enable automatic SSL certificate

## Troubleshooting

### Build Fails with "Module not found"

**Issue**: Missing dependencies in package.json

**Solution**: Ensure all dependencies are listed in `package.json`. The build command installs them automatically.

### Firebase Connection Errors

**Issue**: Environment variables not set correctly

**Solution**:
1. Verify all `REACT_APP_FIREBASE_*` variables are set in Render
2. Ensure no typos in variable names
3. Check Firebase project is active and billing is enabled
4. Verify Firebase config values match your project

### App Shows Blank Page

**Issue**: JavaScript errors or routing issues

**Solution**:
1. Check browser console for errors
2. Verify build completed successfully in Render logs
3. Ensure `serve` package is serving files correctly
4. Check `startCommand` is `npm start` (not `npm run start`)

### 404 on Routes

**Issue**: SPA routing not configured properly

**Solution**: The `serve -s` flag (single-page app mode) is already configured in `package.json`. If issues persist:
1. Check Render logs for serve configuration
2. Verify all routes work on localhost first
3. Ensure build folder has `index.html`

### Deployment Takes Too Long

**Issue**: Free tier build limitations

**Solution**:
1. Free tier has limited CPU/memory
2. Consider upgrading to paid plan for faster builds
3. Build typically takes 3-5 minutes on free tier

## Environment Variables Reference

| Variable | Value | Description |
|----------|-------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | `<your-api-key>` | Firebase Web API Key |
| `REACT_APP_FIREBASE_PROJECT_ID` | `itterra-app1` | Firebase Project ID |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `itterra-app1.firebaseapp.com` | Firebase Auth Domain |
| `REACT_APP_FIREBASE_DATABASE_URL` | `https://itterra-app1-default-rtdb.firebaseio.com` | Realtime Database URL |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `itterra-app1.appspot.com` | Cloud Storage Bucket |
| `REACT_APP_ADMIN_EMAIL` | `<your-email>` | Admin dashboard access email |

## Monitoring and Logs

### Access Logs

1. Go to Render Dashboard → Your Service
2. Click "Logs" tab
3. View real-time application logs

### Monitor Performance

1. In Render Dashboard → Metrics
2. View:
   - Response times
   - Memory usage
   - CPU usage
   - Request volume

### Set Up Alerts

1. In Render Dashboard → Settings → Notifications
2. Configure email or Slack notifications for:
   - Deployment failures
   - Service health issues
   - High resource usage

## Alternative Deployment Options

### Firebase Hosting (Recommended for Full Integration)

If you prefer Firebase Hosting for better Firebase integration:

```bash
npm run setup    # Configure Firebase credentials
npm run deploy   # Build and deploy to Firebase
```

Benefits:
- Automatic SSL
- CDN distribution
- Better Firebase integration
- Free tier with generous limits

### Manual Build & Deploy to Any Static Host

```bash
npm install
npm run build
# Upload build/ folder to your host
```

Compatible with: Netlify, Vercel, AWS S3, GitHub Pages, etc.

## Support

For issues specific to:
- **Render Platform**: [Render Support](https://render.com/docs)
- **Firebase**: [Firebase Support](https://firebase.google.com/support)
- **iTerra Platform**: Check repository issues or documentation

## Next Steps

1. ✅ Deploy to Render
2. ✅ Verify all routes work
3. ⬜ Add associates data
4. ⬜ Configure custom domain
5. ⬜ Set up monitoring
6. ⬜ Enable analytics
7. ⬜ Configure backup strategy

---

**Deployment Status**: Production Ready
**Build Time**: ~3-5 minutes
**Bundle Size**: 380KB JS (gzipped), 12KB CSS (gzipped)
**Supported Platforms**: Render, Firebase Hosting, Netlify, Vercel, and any static host
