# SkillWagers - Production Deployment Guide

A comprehensive step-by-step guide for deploying SkillWagers to production with Firebase backend and custom domain.

## Prerequisites

Before you begin, ensure you have:
- **Node.js LTS** (v18 or higher) and npm installed
- **Git** installed and configured
- **Firebase CLI** installed globally: `npm install -g firebase-tools`
- A **Firebase** account with billing enabled (for production features)
- A **Namecheap** account (for domain management)
- A **Vercel** account (for hosting)
- Access to the SkillWagers GitHub repository

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/JohnF123-maker/SkillWagers.git
cd SkillWagers

# Verify Node.js version
node -v  # Should be v18+ 
npm -v   # Should be v8+

# Install dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Firebase CLI Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify login
firebase projects:list
```

## Firebase Production Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `skillwagers-production`
4. **Enable Google Analytics** (recommended for production)
5. Select or create **Google Analytics account**
6. Click **"Create project"**

### 2. Configure Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider:
   - Click on **Google**
   - Toggle **Enable**
   - Add authorized domains:
     - `localhost` (for development)
     - `skillwagers.com` (production domain)
     - `*.vercel.app` (Vercel deployments)
   - Set **Project support email**
   - Click **Save**

### 3. Configure Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **Start in production mode** (we'll deploy custom rules)
4. Select **Multi-region** location (recommended for global performance)
5. Click **"Create"**

### 4. Setup Firebase Storage

1. Go to **Storage**
2. Click **"Get started"**
3. Choose **Start in production mode**
4. Select same region as Firestore
5. Click **"Done"**

### 5. Create Web App

1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **Web app** icon (`</>`)
4. Enter app nickname: `skillwagers-web`
5. **Check** "Also set up Firebase Hosting"
6. Click **"Register app"**
7. **Copy the Firebase config object** - save this for environment variables

### 6. Deploy Firebase Security Rules

From your project root directory:

```bash
# Initialize Firebase (if not already done)
firebase init

# Select the following services:
# ✓ Firestore: Configure security rules and indexes files
# ✓ Hosting: Configure files for Firebase Hosting

# When prompted:
# - Use existing project: skillwagers-production
# - Firestore rules file: firestore.rules (default)
# - Firestore indexes file: firestore.indexes.json (default)
# - Public directory: client/build
# - Single-page app: Yes
# - Automatic builds/deploys: No

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Verify deployment
firebase firestore:rules:list
```

### 7. Configure Environment Variables

Create `client/.env.production`:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=skillwagers-production.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=skillwagers-production
REACT_APP_FIREBASE_STORAGE_BUCKET=skillwagers-production.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Where to find these values:**
- Firebase Console → Project Settings → General → Your apps → Web app config

## Domain Setup with Namecheap

### 1. Purchase Domain

1. Go to [Namecheap.com](https://namecheap.com)
2. Search for `skillwagers.com`
3. Add to cart and complete purchase
4. Verify domain ownership via email

### 2. Configure DNS for Vercel

1. Login to **Namecheap account**
2. Go to **Domain List** → **Manage** next to skillwagers.com
3. Click **Advanced DNS** tab
4. **Delete all existing records**
5. Add the following records:

```
Type: A Record
Host: @
Value: 76.76.19.19
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

6. **Save all changes**
7. **Wait 24-48 hours** for DNS propagation

### 3. Verify DNS Propagation

```bash
# Check A record
nslookup skillwagers.com

# Check CNAME record  
nslookup www.skillwagers.com

# Should show Vercel IP addresses
```

## Vercel Production Deployment

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. **Import from GitHub**:
   - Connect GitHub account if needed
   - Select **SkillWagers** repository
   - Click **"Import"**

### 2. Configure Build Settings

Vercel should auto-detect React app. Verify these settings:

```
Framework Preset: Create React App
Root Directory: client
Build Command: npm run build
Output Directory: build
Install Command: npm install
Node.js Version: 18.x
```

### 3. Add Environment Variables

In **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

```bash
# Add these for Production environment:
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=skillwagers-production.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=skillwagers-production
REACT_APP_FIREBASE_STORAGE_BUCKET=skillwagers-production.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Add Custom Domain

1. In **Vercel** → **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `skillwagers.com`
4. Click **"Add"**
5. Add: `www.skillwagers.com`
6. Set `skillwagers.com` as **Primary Domain**
7. Enable **Redirect www to non-www**

### 5. Deploy to Production

1. Click **"Deploy"** in Vercel
2. Wait for build completion
3. Visit `https://skillwagers.com` to verify deployment

## Local Development Setup

### 1. Environment Configuration

Create `client/.env.local`:

```bash
# Firebase Configuration (Development)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=skillwagers-production.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=skillwagers-production
REACT_APP_FIREBASE_STORAGE_BUCKET=skillwagers-production.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 2. Start Development Server

```bash
# From project root
cd client
npm start

# App opens at http://localhost:3000
```

### 3. Test Firebase Integration

1. Test Google Sign-in
2. Create a test challenge
3. Verify Firestore data storage
4. Test avatar upload to Firebase Storage

## Security Configuration

### 1. Update Firebase Authorized Domains

In **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**:

- ✅ `localhost` (development)
- ✅ `skillwagers.com` (production)
- ✅ `www.skillwagers.com` (www redirect)
- ✅ `skillwagers-production.firebaseapp.com` (Firebase hosting)
- ✅ `*.vercel.app` (Vercel preview deployments)

### 2. Firestore Security Rules

The project includes comprehensive security rules in `firestore.rules`:

```javascript
// Key security features:
// ✓ Age verification (18+ required)
// ✓ Skill-based challenge validation
// ✓ Wager amount limits ($1-1000)
// ✓ User data protection
// ✓ Admin-only dispute resolution
// ✓ Transaction logging
```

### 3. Storage Security Rules

In **Firebase Console** → **Storage** → **Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User avatars
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && resource.size < 2 * 1024 * 1024; // 2MB limit
    }
    
    // Challenge proof uploads
    match /proofs/{challengeId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && resource.size < 10 * 1024 * 1024; // 10MB limit
    }
  }
}
```

## Production Testing & Validation

### 1. Authentication Flow Testing

From `https://skillwagers.com`:

```bash
# Test sequence:
1. ✓ Visit homepage while logged out
2. ✓ Click "Sign in with Google" 
3. ✓ Complete Google OAuth flow
4. ✓ Verify user avatar appears in navbar
5. ✓ Test navigation to Profile page
6. ✓ Verify user data loads from Firestore
7. ✓ Test sign out functionality
8. ✓ Verify redirect to landing page
```

### 2. Challenge Creation Testing

```bash
# Test sequence:
1. ✓ Navigate to "Create Challenge" 
2. ✓ Verify policy validation appears
3. ✓ Try creating gambling-related challenge (should be blocked)
4. ✓ Create valid skill-based challenge
5. ✓ Verify challenge appears in Firestore
6. ✓ Test challenge appears on Marketplace
```

### 3. Core Functionality Testing

```bash
# Dashboard functionality:
1. ✓ User statistics load from real Firestore data
2. ✓ Recent challenges display properly
3. ✓ Navigation between all pages works

# Avatar system:
1. ✓ Google profile photos display
2. ✓ Fallback initials show for missing photos
3. ✓ Avatar upload works in Profile page

# Wagering system:
1. ✓ Wagering tab visible in navigation
2. ✓ Can create wagers for challenges
3. ✓ Wager data stores in Firestore
```

### 4. Security Validation

```bash
# Firestore security:
1. ✓ Unauthenticated users cannot read/write protected data
2. ✓ Users can only access their own profile data
3. ✓ Age verification enforced for challenge creation
4. ✓ Skill-based validation blocks gambling content

# Authentication security:
1. ✓ Only authorized domains can authenticate
2. ✓ OAuth tokens properly managed
3. ✓ Session persistence works correctly
```

## Production Monitoring

### 1. Firebase Console Monitoring

**Daily checks:**
- Authentication usage and errors
- Firestore read/write operations
- Storage usage and costs
- Security rule violations

**Weekly checks:**
- User analytics and growth
- Popular challenge categories
- Performance metrics
- Error logs and debugging

### 2. Vercel Analytics

**Monitor:**
- Page load times
- Build success/failure rates
- Traffic patterns
- Error rates

**Alerts to set up:**
- Failed deployments
- High error rates
- Performance degradation
- Unusual traffic spikes

### 3. Domain and SSL Monitoring

**Monthly checks:**
- SSL certificate validity
- Domain renewal dates
- DNS configuration
- CDN performance

## Production Maintenance

### 1. Regular Updates

```bash
# Weekly dependency updates:
cd SkillWagers
npm audit
npm audit fix

cd client
npm audit
npm audit fix

cd ../server  
npm audit
npm audit fix

# Deploy updates:
git add .
git commit -m "Security updates"
git push origin main
```

### 2. Firebase Maintenance

**Monthly tasks:**
- Review Firestore usage and costs
- Update security rules if needed
- Clean up old authentication logs
- Review storage usage

**Quarterly tasks:**
- Audit user data and compliance
- Review and update authorized domains
- Performance optimization
- Backup critical data

### 3. Content Moderation

**Daily:**
- Review new challenges for policy violations
- Monitor user reports and disputes
- Check for inappropriate content

**Weekly:**
- Analyze user behavior patterns
- Update policy validation rules if needed
- Review challenge categories

## Backup and Recovery

### 1. Firestore Backup

```bash
# Set up automated Firestore backups:
# 1. Go to Firebase Console → Firestore → Backups
# 2. Enable daily backups
# 3. Set retention period (30 days recommended)
# 4. Configure backup location (multi-region)
```

### 2. Code Repository Backup

```bash
# Ensure multiple backup locations:
1. ✓ GitHub (primary repository)
2. ✓ Local development machines
3. ✓ Vercel deployment source
```

### 3. Recovery Procedures

**Database recovery:**
1. Access Firebase Console
2. Navigate to Firestore → Backups
3. Select backup date
4. Restore to new database instance
5. Update Firebase config if needed

**Application recovery:**
1. Revert to last known good commit
2. Deploy from GitHub to Vercel
3. Verify functionality
4. Update DNS if needed

## Performance Optimization

### 1. Firebase Optimization

```bash
# Firestore query optimization:
- Use composite indexes for complex queries
- Limit query results with pagination
- Cache frequently accessed data
- Optimize security rules for performance

# Storage optimization:
- Compress images before upload
- Use appropriate file formats
- Implement lazy loading
- Clean up unused files
```

### 2. Vercel Optimization

```bash
# Build optimization:
- Enable compression
- Optimize bundle size
- Use code splitting
- Cache static assets

# Performance monitoring:
- Set up Web Vitals tracking
- Monitor Core Web Vitals
- Optimize images and fonts
- Minimize third-party scripts
```

## Troubleshooting Guide

### 1. Common Authentication Issues

**Problem:** "Firebase: No Firebase App '[DEFAULT]' has been created"
```bash
Solution:
1. Check environment variables are properly set
2. Verify REACT_APP_ prefix on all variables
3. Restart development server
4. Check Firebase config in client/src/firebase.js
```

**Problem:** Google Sign-in not working on production
```bash
Solution:
1. Verify domain in Firebase Authorized domains
2. Check SSL certificate is valid
3. Confirm environment variables in Vercel
4. Check browser console for CORS errors
```

### 2. Common Database Issues

**Problem:** Firestore permission denied errors
```bash
Solution:
1. Check user is authenticated
2. Verify security rules allow the operation
3. Check document path is correct
4. Test rules in Firebase Console simulator
```

**Problem:** Data not appearing in production
```bash
Solution:
1. Verify environment points to correct Firebase project
2. Check data exists in production Firestore
3. Confirm network requests are successful
4. Check for JavaScript errors in console
```

### 3. Common Deployment Issues

**Problem:** Vercel build failing
```bash
Solution:
1. Check all dependencies are installed
2. Verify Node.js version compatibility
3. Check for missing environment variables
4. Review build logs for specific errors
```

**Problem:** Domain not pointing to Vercel
```bash
Solution:
1. Verify DNS records in Namecheap
2. Check DNS propagation (up to 48 hours)
3. Confirm domain added in Vercel
4. Check SSL certificate status
```

## Security Best Practices

### 1. Environment Security

```bash
# Never commit sensitive data:
- Add .env* to .gitignore
- Use different Firebase projects for dev/prod
- Rotate API keys regularly
- Monitor for exposed credentials

# Use principle of least privilege:
- Limit Firebase project access
- Use Firebase IAM roles
- Regular access reviews
- Monitor authentication logs
```

### 2. Application Security

```bash
# Input validation:
- Validate all user inputs
- Sanitize data before storage
- Use parameterized queries
- Implement rate limiting

# Content security:
- Validate file uploads
- Scan for malicious content
- Implement content moderation
- Monitor user reports
```

## Legal and Compliance

### 1. Privacy Policy

**Required sections:**
- Data collection practices
- Firebase/Google service usage
- Cookie usage
- User rights and data deletion
- Contact information

### 2. Terms of Service

**Required sections:**
- Skill-based gaming policies
- Prohibited activities
- Dispute resolution
- Age requirements (18+)
- Wager limits and rules

### 3. Compliance Monitoring

**Regular reviews:**
- GDPR compliance (if EU users)
- CCPA compliance (if CA users)
- Gambling law compliance
- Payment processing regulations

---

## Quick Reference Commands

### Firebase Commands
```bash
# Login and select project
firebase login
firebase use skillwagers-production

# Deploy rules and functions
firebase deploy --only firestore
firebase deploy --only storage
firebase deploy --only hosting

# View logs
firebase functions:log
```

### Development Commands
```bash
# Start local development
cd client && npm start

# Build for production
cd client && npm run build

# Test build locally
cd client && npx serve -s build
```

### Git Commands
```bash
# Deploy to production
git add .
git commit -m "Production updates"
git push origin main

# Create feature branch
git checkout -b feature/new-feature
```

## Support and Resources

### Documentation Links
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Namecheap DNS Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain)

### Emergency Contacts
- **Firebase Support:** Firebase Console → Support
- **Vercel Support:** Vercel Dashboard → Help
- **Namecheap Support:** Live chat or support tickets

---

**Last Updated:** January 2025  
**Version:** 2.0 (Production Ready)