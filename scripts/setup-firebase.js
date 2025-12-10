#!/usr/bin/env node

/**
 * iTerra Concierge Wellness Platform - Firebase Configuration Setup
 * 
 * This script sets up Firebase configuration files for the project.
 * Run with: node scripts/setup-firebase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function log(message, symbol = '📝') {
  console.log(`${symbol} ${message}`);
}

async function setupFirebaseConfig() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║   iTerra Concierge Wellness Platform - Firebase Setup   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  log('This script will help you configure Firebase for your project.');
  log('You can find these values in Firebase Console > Project Settings\n');
  
  const projectId = await question('Firebase Project ID (e.g., iterra-app1): ');
  const apiKey = await question('Firebase API Key: ');
  const authDomain = await question(`Auth Domain (default: ${projectId}.firebaseapp.com): `) || `${projectId}.firebaseapp.com`;
  const storageBucket = await question(`Storage Bucket (default: ${projectId}.appspot.com): `) || `${projectId}.appspot.com`;
  const messagingSenderId = await question('Messaging Sender ID: ');
  const appId = await question('App ID: ');
  const adminEmail = await question('Admin Email: ');
  
  // Create .env file
  const envContent = `# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=${apiKey}
REACT_APP_FIREBASE_AUTH_DOMAIN=${authDomain}
REACT_APP_FIREBASE_PROJECT_ID=${projectId}
REACT_APP_FIREBASE_STORAGE_BUCKET=${storageBucket}
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
REACT_APP_FIREBASE_APP_ID=${appId}

# Admin Configuration
REACT_APP_ADMIN_EMAIL=${adminEmail}
`;
  
  fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);
  log('Created .env file', '✅');
  
  // Create .firebaserc file
  const firebaseRcContent = JSON.stringify({
    projects: {
      default: projectId
    }
  }, null, 2);
  
  fs.writeFileSync(path.join(__dirname, '..', '.firebaserc'), firebaseRcContent);
  log('Created .firebaserc file', '✅');
  
  console.log('\n✅ Firebase configuration complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: firebase login');
  console.log('   3. Run: node scripts/deploy.js');
  console.log('   4. Run: node scripts/seed-associates.js (after deployment)\n');
  
  rl.close();
}

setupFirebaseConfig().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});
