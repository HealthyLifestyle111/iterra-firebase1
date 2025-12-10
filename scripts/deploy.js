#!/usr/bin/env node

/**
 * iTerra Concierge Wellness Platform - Deployment Script
 * 
 * This script handles the complete deployment process:
 * 1. Environment validation
 * 2. Dependency installation
 * 3. React build
 * 4. Firebase deployment (Hosting, Functions, Firestore)
 * 5. Post-deployment verification
 * 
 * Run with: node scripts/deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execute(command, description) {
  log(`\n▶ ${description}...`, 'cyan');
  try {
    const output = execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    log(`✅ ${description} completed`, 'green');
    return output;
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    throw error;
  }
}

function checkFile(filePath, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ Missing: ${description}`, 'red');
    log(`   Expected path: ${filePath}`, 'yellow');
    return false;
  }
  log(`✅ Found: ${description}`, 'green');
  return true;
}

function validateEnvironment() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
  log('║         Environment Validation                           ║', 'bright');
  log('╚══════════════════════════════════════════════════════════╝', 'bright');
  
  const projectRoot = path.join(__dirname, '..');
  const required = [
    { path: path.join(projectRoot, '.env'), name: '.env file' },
    { path: path.join(projectRoot, 'package.json'), name: 'package.json' },
    { path: path.join(projectRoot, 'firebase.json'), name: 'firebase.json' },
    { path: path.join(projectRoot, 'firestore.rules'), name: 'firestore.rules' },
    { path: path.join(projectRoot, 'firestore.indexes.json'), name: 'firestore.indexes.json' },
    { path: path.join(projectRoot, 'src', 'App.js'), name: 'src/App.js' },
    { path: path.join(projectRoot, 'functions', 'index.js'), name: 'functions/index.js' }
  ];
  
  let allValid = true;
  for (const item of required) {
    if (!checkFile(item.path, item.name)) {
      allValid = false;
    }
  }
  
  if (!allValid) {
    log('\n❌ Environment validation failed!', 'red');
    log('   Please ensure all required files are present.', 'yellow');
    process.exit(1);
  }
  
  // Check .env variables
  log('\n📋 Checking environment variables...', 'cyan');
  const envContent = fs.readFileSync(path.join(projectRoot, '.env'), 'utf8');
  const requiredVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_ADMIN_EMAIL'
  ];
  
  for (const varName of requiredVars) {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
      log(`   ✅ ${varName}`, 'green');
    } else {
      log(`   ⚠️  ${varName} not configured`, 'yellow');
    }
  }
  
  log('\n✅ Environment validation passed!', 'green');
}

function installDependencies() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
  log('║         Installing Dependencies                          ║', 'bright');
  log('╚══════════════════════════════════════════════════════════╝', 'bright');
  
  // Install root dependencies
  execute('npm install --legacy-peer-deps', 'Installing React app dependencies');
  
  // Install function dependencies
  execute('cd functions && npm install', 'Installing Firebase Functions dependencies');
}

function buildReactApp() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
  log('║         Building React Application                       ║', 'bright');
  log('╚══════════════════════════════════════════════════════════╝', 'bright');
  
  execute('npm run build', 'Building production React app');
  
  // Verify build output
  const buildPath = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildPath)) {
    log('❌ Build directory not created!', 'red');
    process.exit(1);
  }
  
  const buildFiles = fs.readdirSync(buildPath);
  log(`\n✅ Build successful! Generated ${buildFiles.length} files/folders`, 'green');
}

function deployToFirebase() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
  log('║         Deploying to Firebase                            ║', 'bright');
  log('╚══════════════════════════════════════════════════════════╝', 'bright');
  
  // Deploy Firestore rules and indexes first
  log('\n📊 Deploying Firestore rules and indexes...', 'cyan');
  execute('firebase deploy --only firestore', 'Deploying Firestore configuration');
  
  // Deploy Functions
  log('\n⚡ Deploying Firebase Functions...', 'cyan');
  execute('firebase deploy --only functions', 'Deploying Firebase Functions');
  
  // Deploy Hosting
  log('\n🌐 Deploying to Firebase Hosting...', 'cyan');
  execute('firebase deploy --only hosting', 'Deploying React app to Hosting');
  
  log('\n✅ Full deployment completed!', 'green');
}

function getDeploymentInfo() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
  log('║         Deployment Information                           ║', 'bright');
  log('╚══════════════════════════════════════════════════════════╝', 'bright');
  
  try {
    // Get project ID
    const firebaseRc = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '.firebaserc'), 'utf8')
    );
    const projectId = firebaseRc.projects.default || 'iterra-app1';
    
    log(`\n🚀 Deployment URLs:`, 'bright');
    log(`   Hosting: https://${projectId}.web.app`, 'cyan');
    log(`   Hosting: https://${projectId}.firebaseapp.com`, 'cyan');
    log(`\n📊 Firebase Console:`, 'bright');
    log(`   https://console.firebase.google.com/project/${projectId}`, 'cyan');
    
    return projectId;
  } catch (error) {
    log('\n⚠️  Could not retrieve project info', 'yellow');
    return null;
  }
}

async function main() {
  const startTime = Date.now();
  
  log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
  log('║   iTerra Concierge Wellness Platform - Deployment       ║', 'bright');
  log('╚══════════════════════════════════════════════════════════╝', 'bright');
  
  try {
    // Step 1: Validate environment
    validateEnvironment();
    
    // Step 2: Install dependencies
    installDependencies();
    
    // Step 3: Build React app
    buildReactApp();
    
    // Step 4: Deploy to Firebase
    deployToFirebase();
    
    // Step 5: Show deployment info
    const projectId = getDeploymentInfo();
    
    // Calculate duration
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    
    log('\n╔══════════════════════════════════════════════════════════╗', 'bright');
    log('║   ✨ Deployment Successful! ✨                           ║', 'green');
    log('╚══════════════════════════════════════════════════════════╝', 'bright');
    log(`\n⏱️  Total deployment time: ${duration}s`, 'cyan');
    
    if (projectId) {
      log('\n📝 Next steps:', 'bright');
      log('   1. Visit your deployed site', 'cyan');
      log('   2. Test associate signup at /associate', 'cyan');
      log('   3. Test admin dashboard at /admin', 'cyan');
      log('   4. Test referral links at /go/:slug', 'cyan');
      log('   5. Seed associates with: node scripts/seed-associates.js', 'cyan');
    }
    
    process.exit(0);
  } catch (error) {
    log('\n❌ Deployment failed!', 'red');
    log(`   Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateEnvironment, installDependencies, buildReactApp, deployToFirebase };
