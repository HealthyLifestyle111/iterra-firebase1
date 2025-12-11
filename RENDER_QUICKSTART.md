# iTerra Wellness Platform - Render Quick Start

## 🚀 Deploy in 3 Steps

### Step 1: Configure Environment Variables

Go to **Render Dashboard** → **Your Service** → **Environment** and add:

```env
REACT_APP_FIREBASE_API_KEY=<paste-your-firebase-api-key>
REACT_APP_FIREBASE_PROJECT_ID=itterra-app1
REACT_APP_FIREBASE_AUTH_DOMAIN=itterra-app1.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://itterra-app1-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=itterra-app1.appspot.com
REACT_APP_ADMIN_EMAIL=<your-admin-email>
```

**Where to find your Firebase API Key:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `itterra-app1` project
3. Click ⚙️ Settings → Project Settings
4. Under "Your apps" → Web apps section
5. Copy the `apiKey` value

### Step 2: Verify Build Settings

In **Render Dashboard** → **Settings**:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment:** Node
- **Branch:** main (or your deployment branch)

### Step 3: Deploy

Click **Manual Deploy** → **Deploy latest commit**

Or push to your connected branch for automatic deployment.

---

## ✅ What Happens During Deployment

1. **Install Dependencies** - All 1,649 packages (30-60 seconds)
2. **Build Application** - Creates optimized production build (60-90 seconds)
   - Output: `build/` folder with 380KB JS + 12KB CSS (gzipped)
3. **Start Server** - Serves static files on Render's PORT
4. **Health Check** - Render verifies app is responding
5. **Go Live** - Your app is accessible at `https://your-service.onrender.com`

---

## 🔍 Verify Deployment

### Check Build Logs

Look for these success messages:

```
✓ npm install completed
✓ npm run build completed
File sizes after gzip:
  379.82 kB  build/static/js/main.*.js
  12.04 kB   build/static/css/main.*.css
✓ npm start - Server listening on PORT
```

### Test Your App

Visit your Render URL and verify:

- **Home Page:** `https://your-service.onrender.com/`
- **Back Office:** `/back-office`
- **Wellness Intake:** `/wellness-intake`
- **Specialized Intake:** `/specialized-intake`
- **Leadership Wisdom:** `/leadership-wisdom`
- **Home Essentials:** `/home-essentials`

### Firebase Connection Test

1. Open browser DevTools → Console
2. Should see no Firebase errors
3. Try signing in (tests Firebase Auth)
4. Try creating data (tests Firestore)

---

## 🐛 Troubleshooting

### Build Fails

**Problem:** "Cannot find module X"
- **Solution:** Check package.json has all dependencies, push changes

**Problem:** "Out of memory"
- **Solution:** Upgrade Render plan or add `NODE_OPTIONS=--max_old_space_size=4096`

### Firebase Connection Issues

**Problem:** "Firebase configuration error"
- **Solution:** Double-check all env vars are set correctly in Render
- **Solution:** Ensure no trailing spaces in values

**Problem:** "Permission denied" in Firestore
- **Solution:** Check firestore.rules are deployed: `firebase deploy --only firestore:rules`

### App Loads But Shows Errors

**Problem:** "Failed to fetch"
- **Solution:** Check Firebase project is active and billing enabled
- **Solution:** Verify Firestore indexes are deployed

**Problem:** Routes return 404
- **Solution:** Render should auto-detect SPA routing via `serve -s` flag
- **Solution:** Verify start command is `npm start`

---

## 📊 Performance

**Expected Build Time:** 90-120 seconds
**Expected Bundle Size:** 
- JavaScript: ~380KB (gzipped)
- CSS: ~12KB (gzipped)
- Total: ~400KB

**First Load:** ~1-2 seconds (depends on network)
**Subsequent Loads:** Instant (cached)

---

## 🔄 Updates & Redeployment

### Automatic Deployment

If you have auto-deploy enabled:
- Push to your connected branch
- Render automatically builds and deploys

### Manual Deployment

In Render Dashboard:
- Click **Manual Deploy** → **Deploy latest commit**
- Or click **Clear build cache & deploy** for fresh build

---

## 📚 Additional Resources

- **Full Deployment Guide:** [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- **Firebase Setup:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Project Status:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Deployment Checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🎯 Success Criteria

✅ Build completes without errors
✅ All environment variables set
✅ App loads at Render URL
✅ All 8 pages accessible
✅ Firebase Auth working
✅ Firestore reads/writes working
✅ No console errors
✅ Mobile responsive

---

## 💡 Tips

- **Custom Domain:** Configure in Render Settings → Custom Domain
- **SSL:** Automatically provided by Render
- **Logs:** Available in Render Dashboard → Logs tab
- **Metrics:** Available in Render Dashboard → Metrics tab
- **Scaling:** Upgrade plan for more resources/instances

---

**Need Help?** Check [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed troubleshooting and advanced configuration.
