# iTerra Concierge Wellness Platform

A comprehensive React-based web application for managing doTERRA associate referral links with automated tracking, analytics, and admin dashboard.

## 🚀 Quick Deploy

```bash
./deploy-all.sh
```

This single command handles everything: environment setup, dependency installation, building, and deployment to Firebase.

## ✨ Features

- 🔐 **Firebase Authentication** - Secure email/password authentication
- 📊 **Referral Tracking** - Real-time click tracking for each associate
- 🔗 **Smart URL Generation** - Automatic slug generation from email addresses
- 📈 **Admin Dashboard** - Monitor all associates, referral counts, and analytics
- ⚡ **Intelligent Redirects** - `/go/:slug` proxy system with fallback
- 🎨 **Responsive UI** - Beautiful, mobile-friendly interface
- 🔥 **Firebase Functions** - Server-side redirect handling
- 📱 **Production Ready** - Full CI/CD support

## 📋 Documentation

- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[Project Status](./PROJECT_STATUS.md)** - Current status and roadmap

## 🚀 Deployment to Production

### Quick Start

```bash
# One-command deployment
./deploy-all.sh

# Or step-by-step
npm run setup    # Configure Firebase
npm run deploy   # Deploy everything
npm run seed     # Seed database
npm run verify   # Verify deployment
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

---

**Project**: iTerra Concierge Wellness Platform  
**Firebase Project**: iterra-app1  
**Version**: 0.1.0  
**Status**: Production Ready ✅
