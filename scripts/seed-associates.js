#!/usr/bin/env node

/**
 * iTerra Concierge Wellness Platform - Associate Seeding Script
 * 
 * This script seeds the Firestore database with real associate data.
 * Run with: node scripts/seed-associates.js
 * 
 * Requirements:
 * - Firebase Admin SDK credentials (service account JSON)
 * - Environment variable: FIREBASE_SERVICE_ACCOUNT_PATH
 * - Associate data in scripts/associates-data.js
 * 
 * To update associates: Edit scripts/associates-data.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Load associate data from external file
const associates = require('./associates-data.js');

// Initialize Firebase Admin
function initializeFirebase() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
    path.join(__dirname, '../firebase-service-account.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Error: Firebase service account JSON not found!');
    console.error(`   Looking for: ${serviceAccountPath}`);
    console.error('   Please download it from Firebase Console > Project Settings > Service Accounts');
    process.exit(1);
  }

  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });

  console.log('✅ Firebase Admin initialized successfully');
  return admin.firestore();
}

// Validate email format
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (E.164)
function validatePhone(phone) {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

// Validate associate data
function validateAssociate(associate, index) {
  const errors = [];
  
  if (!associate.name || typeof associate.name !== 'string') {
    errors.push('name is required and must be a string');
  }
  
  if (!associate.email || !validateEmail(associate.email)) {
    errors.push('email is required and must be valid');
  }
  
  if (!associate.phone || !validatePhone(associate.phone)) {
    errors.push('phone is required and must be in E.164 format (e.g., +15555555555)');
  }
  
  if (!associate.doterraUrl || !associate.doterraUrl.startsWith('http')) {
    errors.push('doterraUrl is required and must be a valid URL');
  }
  
  if (!associate.role || !['associate', 'admin'].includes(associate.role)) {
    errors.push('role must be either "associate" or "admin"');
  }
  
  if (errors.length > 0) {
    console.error(`\n❌ Validation failed for associate at index ${index}:`);
    console.error(`   Name: ${associate.name || 'N/A'}`);
    errors.forEach(error => console.error(`   - ${error}`));
    return false;
  }
  
  return true;
}

// Generate slug from email
function generateSlug(email) {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Generate referral code (8 characters)
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Seed associates to Firestore
async function seedAssociates(db) {
  console.log('\n📊 Starting associate seeding...\n');
  console.log(`📝 Found ${associates.length} associates to process\n`);
  
  // Validate all associates first
  let validationPassed = true;
  for (let i = 0; i < associates.length; i++) {
    if (!validateAssociate(associates[i], i)) {
      validationPassed = false;
    }
  }
  
  if (!validationPassed) {
    console.error('\n❌ Validation failed! Please fix the errors above and try again.');
    process.exit(1);
  }
  
  console.log('✅ All associates validated successfully\n');
  
  const batch = db.batch();
  const results = [];
  
  for (const associate of associates) {
    const slug = generateSlug(associate.email);
    const referralCode = generateReferralCode();
    const timestamp = new Date().toISOString();
    
    const docData = {
      name: associate.name,
      email: associate.email,
      phone: associate.phone,
      doterraUrl: associate.doterraUrl,
      slug: slug,
      referralCode: referralCode,
      referralCounter: 0,  // Using referralCounter as per user's requirement
      role: associate.role,
      createdAt: timestamp,
      updatedAt: timestamp,
      active: true
    };
    
    // Create document with slug as ID for consistency
    const docId = slug;
    const docRef = db.collection('associates').doc(docId);
    batch.set(docRef, docData);
    
    results.push({
      name: associate.name,
      email: associate.email,
      phone: associate.phone,
      slug: slug,
      referralLink: `/go/${slug}`,
      referralCode: referralCode,
      role: associate.role
    });
    
    console.log(`✅ Prepared: ${associate.name}`);
    console.log(`   Email: ${associate.email}`);
    console.log(`   Phone: ${associate.phone}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Referral Link: /go/${slug}`);
    console.log(`   Referral Code: ${referralCode}`);
    console.log(`   Role: ${associate.role}\n`);
  }
  
  try {
    await batch.commit();
    console.log('✅ All associates seeded successfully!\n');
    
    console.log('📋 Summary:');
    console.log('═══════════════════════════════════════════════════════');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name} (${result.role})`);
      console.log(`   Email: ${result.email}`);
      console.log(`   Phone: ${result.phone}`);
      console.log(`   Referral Link: https://your-domain.web.app${result.referralLink}`);
      console.log(`   Referral Code: ${result.referralCode}`);
      console.log('');
    });
    console.log('═══════════════════════════════════════════════════════');
    
    return results;
  } catch (error) {
    console.error('❌ Error seeding associates:', error);
    throw error;
  }
}

// Verify seeding
async function verifySeeding(db) {
  console.log('\n🔍 Verifying seeded data...\n');
  
  const snapshot = await db.collection('associates').get();
  console.log(`✅ Total associates in database: ${snapshot.size}`);
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`   - ${data.name} (${data.role}) [${data.slug}]: ${data.referralCounter || 0} referrals`);
  });
  
  console.log('\n✅ Verification complete!');
}

// Main execution
async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   iTerra Concierge Wellness Platform - Data Seeding     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  try {
    const db = initializeFirebase();
    await seedAssociates(db);
    await verifySeeding(db);
    
    console.log('\n✨ Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { 
  seedAssociates, 
  generateSlug, 
  generateReferralCode,
  validateEmail,
  validatePhone,
  validateAssociate
};
