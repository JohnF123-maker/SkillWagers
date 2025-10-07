#!/usr/bin/env node

// Validation script for SkillWagers deployment
const fs = require('fs');
const path = require('path');

console.log('🔍 SkillWagers Deployment Validation');
console.log('=====================================\n');

let errors = 0;

// 1. Check manifest.json
console.log('1. Checking manifest.json...');
const manifestPath = path.join(__dirname, 'client', 'public', 'manifest.json');
try {
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('   ✅ manifest.json exists and is valid JSON');
    
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length === 0) {
      console.log('   ✅ All required fields present');
    } else {
      console.log('   ❌ Missing required fields:', missingFields.join(', '));
      errors++;
    }
  } else {
    console.log('   ❌ manifest.json not found');
    errors++;
  }
} catch (e) {
  console.log('   ❌ manifest.json is invalid JSON:', e.message);
  errors++;
}

// 2. Check Firebase config
console.log('\n2. Checking Firebase configuration...');
const firebaseConfigPath = path.join(__dirname, 'client', 'src', 'firebase.js');
try {
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');
    
    if (firebaseConfig.includes('process.env.REACT_APP_FIREBASE_API_KEY')) {
      console.log('   ✅ Firebase config uses environment variables');
    } else {
      console.log('   ❌ Firebase config not using environment variables');
      errors++;
    }
    
    if (firebaseConfig.includes('requiredEnvVars')) {
      console.log('   ✅ Environment variable validation present');
    } else {
      console.log('   ⚠️  No environment variable validation found');
    }
  } else {
    console.log('   ❌ firebase.js not found');
    errors++;
  }
} catch (e) {
  console.log('   ❌ Error reading firebase.js:', e.message);
  errors++;
}

// 3. Check .env.example
console.log('\n3. Checking environment configuration...');
const envExamplePath = path.join(__dirname, 'client', '.env.example');
try {
  if (fs.existsSync(envExamplePath)) {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    
    const requiredVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID'
    ];
    
    const hasAllVars = requiredVars.every(varName => envExample.includes(varName));
    
    if (hasAllVars) {
      console.log('   ✅ .env.example contains required Firebase variables');
    } else {
      console.log('   ❌ .env.example missing required Firebase variables');
      errors++;
    }
    
    if (envExample.includes('VERCEL DEPLOYMENT')) {
      console.log('   ✅ Vercel deployment instructions present');
    } else {
      console.log('   ⚠️  No Vercel deployment instructions found');
    }
  } else {
    console.log('   ❌ .env.example not found');
    errors++;
  }
} catch (e) {
  console.log('   ❌ Error reading .env.example:', e.message);
  errors++;
}

// 4. Check .gitignore
console.log('\n4. Checking .gitignore...');
const gitignorePath = path.join(__dirname, '.gitignore');
try {
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    
    if (gitignore.includes('.env.local') && gitignore.includes('.env.production')) {
      console.log('   ✅ .gitignore properly excludes environment files');
    } else {
      console.log('   ❌ .gitignore missing environment file exclusions');
      errors++;
    }
  } else {
    console.log('   ❌ .gitignore not found');
    errors++;
  }
} catch (e) {
  console.log('   ❌ Error reading .gitignore:', e.message);
  errors++;
}

// Summary
console.log('\n=====================================');
if (errors === 0) {
  console.log('🎉 All validation checks passed!');
  console.log('\nNext steps:');
  console.log('1. Copy .env.example to .env.local and fill in Firebase values');
  console.log('2. Add environment variables to Vercel dashboard');
  console.log('3. Add authorized domains to Firebase Console');
  console.log('4. Deploy to Vercel and test');
} else {
  console.log(`❌ ${errors} validation error(s) found. Please fix before deploying.`);
  process.exit(1);
}