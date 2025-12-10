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
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

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

// Generate slug from email
function generateSlug(email) {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Generate referral code (8 characters)
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Associate data - REPLACE WITH REAL DATA
const associates = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@iterrawellness.com',
    phone: '+1-555-0101',
    doterraUrl: 'https://www.doterra.com/US/en/site/sarahjohnson',
    role: 'Wellness Advocate'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@iterrawellness.com',
    phone: '+1-555-0102',
    doterraUrl: 'https://www.doterra.com/US/en/site/michaelchen',
    role: 'Wellness Advocate'
  },
  {
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@iterrawellness.com',
    phone: '+1-555-0103',
    doterraUrl: 'https://www.doterra.com/US/en/site/emmarodriguez',
    role: 'Elite Wellness Advocate'
  },
  {
    name: 'David Thompson',
    email: 'david.thompson@iterrawellness.com',
    phone: '+1-555-0104',
    doterraUrl: 'https://www.doterra.com/US/en/site/davidthompson',
    role: 'Wellness Advocate'
  },
  {
    name: 'Lisa Martinez',
    email: 'lisa.martinez@iterrawellness.com',
    phone: '+1-555-0105',
    doterraUrl: 'https://www.doterra.com/US/en/site/lisamartinez',
    role: 'Elite Wellness Advocate'
  }
];

// Seed associates to Firestore
async function seedAssociates(db) {
  console.log('\n📊 Starting associate seeding...\n');
  
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
      referrals: 0,
      role: associate.role,
      createdAt: timestamp,
      updatedAt: timestamp,
      active: true
    };
    
    // Create document with email-based ID for consistency
    const docId = slug;
    const docRef = db.collection('associates').doc(docId);
    batch.set(docRef, docData);
    
    results.push({
      name: associate.name,
      slug: slug,
      referralLink: `/go/${slug}`,
      referralCode: referralCode
    });
    
    console.log(`✅ Prepared: ${associate.name}`);
    console.log(`   Slug: ${slug}`);
    console.log(`   Referral Link: /go/${slug}`);
    console.log(`   Referral Code: ${referralCode}\n`);
  }
  
  try {
    await batch.commit();
    console.log('✅ All associates seeded successfully!\n');
    
    console.log('📋 Summary:');
    console.log('═══════════════════════════════════════════════════════');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
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
    console.log(`   - ${data.name} (${data.slug}): ${data.referrals} referrals`);
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

module.exports = { seedAssociates, generateSlug, generateReferralCode };
