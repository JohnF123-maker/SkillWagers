# SkillWagers - Complete Deployment Guide

A comprehensive step-by-step guide for deploying SkillWagers from development to production.

## Prerequisites

Before you begin, ensure you have:
- **Node.js LTS** (v18 or higher) and npm installed
- **Git** installed and configured
- A **Firebase** account
- A **Vercel** account
- Access to the SkillWagers GitHub repository

## Local Setup

### 1. Clone the Repository

```bash
# Clone your repo
git clone https://github.com/JohnF123-maker/SkillWagers.git
cd SkillWagers

# Verify Node.js version
node -v  # Should be v18+ 
npm -v   # Should be v8+
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies (if applicable)
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create your local environment file:

```bash
# Copy the example file (if it exists)
cp .env.local.example .env.local

# Or create a new .env.local file
touch .env.local
```

Edit `.env.local` with your Firebase configuration (see Firebase setup below).

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `skillwagers-production` (or your preferred name)
4. **Optional**: Enable Google Analytics
5. Click **"Create project"**

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider:
   - Click on **Google**
   - Toggle **Enable**
   - Set **Project support email**
   - Click **Save**
3. Under **Authorized domains**, add:
   - `localhost` (for development)
   - `skillwagers.com` (your production domain)
   - Your Vercel preview domains (added automatically)

### 3. Create Web App

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **Web app** icon (`</>`)
4. Enter app nickname: `skillwagers-web`
5. **Optional**: Check "Also set up Firebase Hosting"
6. Click **"Register app"**
7. **Copy the Firebase config object** - you'll need this for environment variables

### 4. Configure Firestore (Optional)

If your app uses Firestore:
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **Start in test mode** (for development)
4. Select your preferred location
5. Click **"Create"**

### 5. Environment Variables

Add these to your `.env.local` file:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

**Where to find these values:**
- Firebase Console → Project Settings → General → Web app config

## Local Development

### 1. Start Development Server

```bash
# From the project root
cd client
npm start

# Your app will open at http://localhost:3000
```

### 2. Test Google Sign-In

1. Open your browser to `http://localhost:3000`
2. Click **"Sign in with Google"** in the header
3. Complete the Google sign-in flow
4. Verify you can sign in/out and see your avatar/name

## Vercel Deployment

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository:
   - Connect GitHub (if not already connected)
   - Select **SkillWagers** repository
   - Click **"Import"**

### 2. Configure Build Settings

Vercel should auto-detect the React app, but verify:
- **Framework Preset**: Create React App
- **Root Directory**: `client` (if your React app is in the client folder)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3. Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```bash
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Deploy

1. Click **"Deploy"**
2. Wait for build to complete
3. Visit your deployed site (Vercel will provide a URL)

### 5. Custom Domain (Optional)

1. In Vercel → Project → Settings → **Domains**
2. Add your custom domain: `skillwagers.com`
3. Follow Vercel's DNS configuration instructions
4. **Important**: Add your custom domain to Firebase Authorized domains

## Firebase Security Configuration

### 1. Update Authorized Domains

In Firebase Console → Authentication → Settings → Authorized domains:
- Add your Vercel deployment URL
- Add `skillwagers.com` (your production domain)
- Keep `localhost` for development

### 2. Firestore Security Rules (If Using)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Example rules - customize for your app
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add your specific collection rules here
  }
}
```

## Testing & Validation

### 1. Test Authentication Flow

From your deployed site:
1. Click **"Sign in with Google"**
2. Complete sign-in process
3. Verify user avatar and name appear
4. Test sign-out functionality

### 2. Verify Marketing Copy

Ensure all copy reads:
> "Instant payouts for games that support it; otherwise up to 24 hours depending on the challenge."

### 3. Check Typography

Verify headings don't fade or clip trailing characters.

## Production Checklist

- [ ] Firebase project created and configured
- [ ] Google Authentication enabled and tested
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (if applicable)
- [ ] Authorized domains updated in Firebase
- [ ] Marketing copy updated correctly
- [ ] Typography issues resolved
- [ ] Wagering tab visible in navigation
- [ ] Beta popup shows single "Got it, let's test" button
- [ ] Password inputs have show/hide toggle
- [x] All Peer2Pool references replaced with SkillWagers

## Environment Variables Reference

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase Web API Key | Firebase Console → Project Settings → Web app config |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Firebase Console → Project Settings → Web app config |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase Project ID | Firebase Console → Project Settings → General |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Firebase Console → Project Settings → Web app config |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Firebase Console → Project Settings → Web app config |
| `REACT_APP_FIREBASE_APP_ID` | Firebase App ID | Firebase Console → Project Settings → Web app config |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Google Analytics Measurement ID (if enabled) |

## Security Notes

- **Never commit `.env.local`** - ensure it's in `.gitignore`
- **Environment variables are exposed** in the client bundle (normal for React apps)
- **Use Firebase Security Rules** to protect your data
- **Regularly review** Firebase Console for suspicious activity

## Troubleshooting

### Common Issues

**Build fails with "Module not found":**
- Ensure all dependencies are installed: `npm install`
- Check for case-sensitive import paths

**Authentication doesn't work:**
- Verify environment variables are set correctly
- Check Firebase Authorized domains include your deployment URL
- Ensure Google provider is enabled in Firebase Console

**"Firebase: No Firebase App '[DEFAULT]' has been created":**
- Check your Firebase configuration in `src/lib/firebase.js`
- Verify environment variables are properly prefixed with `REACT_APP_`

**Production deployment works but localhost doesn't:**
- Ensure `localhost` is in Firebase Authorized domains
- Check `.env.local` file exists and has correct variables

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure Firebase configuration matches your project
4. Review Vercel build logs for deployment issues

## Maintenance

### Regular Tasks

- **Monitor Firebase usage** in Firebase Console
- **Review authentication logs** for suspicious activity
- **Update dependencies** regularly: `npm audit` and `npm update`
- **Test authentication flow** after any Firebase changes

### Security Updates

- **Review Firebase Security Rules** periodically
- **Monitor for Firebase SDK updates**
- **Check Vercel security recommendations**

---

**Need help?** Check the troubleshooting section above or review the Firebase and Vercel documentation for the most up-to-date information.