#!/usr/bin/env node

/**
 * Script to replace Base44 SDK imports with Firebase services
 * Replaces all @/api/base44Client imports with Firebase service calls
 */

const fs = require('fs');
const path = require('path');

const replacements = [
  // Import statements
  { 
    from: /import\s*{\s*base44\s*}\s*from\s*["']@\/api\/base44Client["'];?/g, 
    to: "import { firestoreService, authService, aiService, emailService } from '../services';" 
  },
  { 
    from: /import\s*{\s*base44\s*}\s*from\s*["']@\/api\/base44Client["'];?/g, 
    to: "import { firestoreService, authService, aiService, emailService } from '@/services';" 
  },
  
  // Auth methods
  { from: /base44\.auth\.isAuthenticated\(\)/g, to: "authService.isAuthenticated()" },
  { from: /base44\.auth\.me\(\)/g, to: "authService.getCurrentUser()" },
  { from: /base44\.auth\.updateMe\(/g, to: "authService.updateUser(authService.currentUser.uid, " },
  { from: /base44\.auth\.logout\(/g, to: "authService.signOut().then(() => window.location.href = " },
  { from: /base44\.auth\.redirectToLogin\(/g, to: "authService.signIn(" },
  
  // Entity methods - WellnessIntake
  { from: /base44\.entities\.WellnessIntake\.create\(/g, to: "firestoreService.createIntake(" },
  { from: /base44\.entities\.WellnessIntake\.filter\(/g, to: "firestoreService.getIntake(" },
  { from: /base44\.entities\.WellnessIntake\.list\(/g, to: "firestoreService.listIntakes(" },
  { from: /base44\.entities\.WellnessIntake\.update\(/g, to: "firestoreService.updateIntake(" },
  { from: /base44\.entities\.WellnessIntake\.delete\(/g, to: "firestoreService.deleteIntake(" },
  
  // Entity methods - SpecializedIntake
  { from: /base44\.entities\.SpecializedIntake\.create\(/g, to: "firestoreService.createIntake(" },
  { from: /base44\.entities\.SpecializedIntake\.filter\(/g, to: "firestoreService.getIntake(" },
  { from: /base44\.entities\.SpecializedIntake\.list\(/g, to: "firestoreService.listIntakes(" },
  { from: /base44\.entities\.SpecializedIntake\.update\(/g, to: "firestoreService.updateIntake(" },
  
  // Entity methods - User
  { from: /base44\.entities\.User\.filter\(/g, to: "firestoreService.getUserByEmail(" },
  { from: /base44\.entities\.User\.create\(/g, to: "firestoreService.createUser(" },
  { from: /base44\.entities\.User\.list\(/g, to: "firestoreService.listUsers(" },
  { from: /base44\.entities\.User\.update\(/g, to: "firestoreService.updateUser(" },
  
  // Entity methods - Manifestation
  { from: /base44\.entities\.Manifestation\.create\(/g, to: "firestoreService.createRecommendation(" },
  { from: /base44\.entities\.Manifestation\.filter\(/g, to: "firestoreService.getRecommendation(" },
  { from: /base44\.entities\.Manifestation\.list\(/g, to: "firestoreService.listRecommendations(" },
  { from: /base44\.entities\.Manifestation\.update\(/g, to: "firestoreService.updateRecommendation(" },
  { from: /base44\.entities\.Manifestation\.delete\(/g, to: "firestoreService.deleteRecommendation(" },
  
  // Integration methods - LLM
  { from: /base44\.integrations\.Core\.InvokeLLM\(/g, to: "aiService.invokeLLM(" },
  
  // Integration methods - Email
  { from: /base44\.integrations\.Core\.SendEmail\(/g, to: "emailService.sendEmail(" },
  
  // Integration methods - File uploads
  { from: /base44\.integrations\.Core\.UploadFile\(/g, to: "storageService.uploadFile(" },
  
  // Path aliases
  { from: /@\/api\//g, to: "@/services/" },
];

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Migrated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error migrating ${filePath}:`, error.message);
    return false;
  }
}

function findFilesRecursively(dir, pattern = /\.(jsx?|tsx?)$/) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'build') {
        results = results.concat(findFilesRecursively(filePath, pattern));
      }
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Main execution
const srcDir = path.join(__dirname, '..', 'src');
console.log('🔄 Starting Base44 to Firebase migration...\n');

const files = findFilesRecursively(srcDir);
let migratedCount = 0;

files.forEach(file => {
  if (migrateFile(file)) {
    migratedCount++;
  }
});

console.log(`\n✅ Migration complete! ${migratedCount} file(s) migrated.`);

if (migratedCount === 0) {
  console.log('ℹ️  No Base44 imports found. Files may have already been migrated.');
}
