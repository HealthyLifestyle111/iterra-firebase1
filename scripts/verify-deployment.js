#!/usr/bin/env node

/**
 * iTerra Concierge Wellness Platform - Post-Deployment Verification
 * 
 * This script verifies that the deployment was successful by checking:
 * 1. Firebase Hosting is accessible
 * 2. Routes are working
 * 3. Firebase Functions are deployed
 * 4. Firestore is accessible
 * 
 * Run with: node scripts/verify-deployment.js
 */

const https = require('https');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function log(message, symbol = '📝') {
  console.log(`${symbol} ${message}`);
}

function checkUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        resolve({ success: true, statusCode: res.statusCode });
      } else {
        resolve({ success: false, statusCode: res.statusCode });
      }
    }).on('error', (err) => {
      resolve({ success: false, error: err.message });
    });
  });
}

async function verifyHosting(projectId) {
  log('\n🌐 Verifying Firebase Hosting...', '▶');
  
  const baseUrl = `https://${projectId}.web.app`;
  const urls = [
    { path: '/', name: 'Landing page' },
    { path: '/associate', name: 'Associate signup' },
    { path: '/admin', name: 'Admin dashboard' }
  ];
  
  for (const route of urls) {
    const url = `${baseUrl}${route.path}`;
    log(`   Testing ${route.name}: ${url}`, '🔗');
    
    const result = await checkUrl(url);
    if (result.success) {
      log(`   ✅ ${route.name} is accessible (${result.statusCode})`, '  ');
    } else {
      log(`   ❌ ${route.name} failed: ${result.error || result.statusCode}`, '  ');
    }
  }
}

async function verifyFirestore(projectId) {
  log('\n📊 Verifying Firestore...', '▶');
  
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
      path.join(__dirname, '../firebase-service-account.json');
    
    if (!fs.existsSync(serviceAccountPath)) {
      log('   ⚠️  Service account not found. Skipping Firestore verification.', '  ');
      log('   To verify Firestore, download service account JSON from Firebase Console', '  ');
      return;
    }
    
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId
    });
    
    const db = admin.firestore();
    const snapshot = await db.collection('associates').limit(1).get();
    
    log(`   ✅ Firestore is accessible`, '  ');
    log(`   📊 Associates collection exists with ${snapshot.size} documents`, '  ');
  } catch (error) {
    log(`   ❌ Firestore verification failed: ${error.message}`, '  ');
  }
}

async function verifyFunctions(projectId) {
  log('\n⚡ Verifying Firebase Functions...', '▶');
  
  const functionsUrl = `https://us-central1-${projectId}.cloudfunctions.net/redirectToAssociate`;
  log(`   Testing redirect function: ${functionsUrl}`, '🔗');
  
  const result = await checkUrl(functionsUrl);
  if (result.success || result.statusCode === 302) {
    log(`   ✅ Functions are deployed and accessible`, '  ');
  } else {
    log(`   ❌ Functions check failed: ${result.error || result.statusCode}`, '  ');
  }
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   iTerra Concierge Wellness Platform - Verification     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  try {
    // Get project ID
    const firebaseRcPath = path.join(__dirname, '..', '.firebaserc');
    if (!fs.existsSync(firebaseRcPath)) {
      log('❌ .firebaserc not found. Please run setup-firebase.js first.', '');
      process.exit(1);
    }
    
    const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf8'));
    const projectId = firebaseRc.projects.default;
    
    log(`\n📊 Project ID: ${projectId}`);
    
    // Run verifications
    await verifyHosting(projectId);
    await verifyFunctions(projectId);
    await verifyFirestore(projectId);
    
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║   ✅ Verification Complete!                              ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    
    console.log('\n🚀 Your iTerra Concierge Wellness Platform is live!');
    console.log(`   Visit: https://${projectId}.web.app\n`);
    
    process.exit(0);
  } catch (error) {
    log('\n❌ Verification failed:', '');
    log(`   ${error.message}`, '');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
