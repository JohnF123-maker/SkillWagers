# Peer2Pool MVP - Skill-Based Gaming Platform

Peer2Pool is a peer-to-peer gaming platform where players can create and accept challenges in skill-based games with real money stakes. The platform features secure escrow, dispute resolution, and age verification for a safe and fair gaming experience.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React.js, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: Stripe
- **Hosting**: Vercel (Frontend), Firebase Functions (Backend)

### Key Features
- ✅ User registration with age verification (18+)
- ✅ Secure escrow system for stakes
- ✅ Challenge creation and marketplace
- ✅ Proof submission and dispute resolution
- ✅ Admin panel for platform management
- ✅ Real-time balance updates
- ✅ Responsive esports-themed UI

## 📁 Project Structure

```
peer2pool/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS and Tailwind
│   │   ├── App.jsx         # Main app component
│   │   └── index.js        # Entry point
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth and validation
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json            # Root package.json
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase account
- Stripe account (for payments)
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd peer2pool

# Install dependencies
npm run install-all
```

### 2. Environment Setup

Copy the environment template and configure:

```bash
# Copy environment templates
cp .env.example .env
cp client/.env.example client/.env
```

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Email/Password
4. Enable Firestore Database
5. Generate service account key:
   - Project Settings → Service Accounts
   - Generate new private key (downloads JSON)
   - Copy values to `.env` file

#### Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers → API Keys
3. Use test keys for development
4. Copy keys to `.env` files

### 3. Configure Environment Variables

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"

STRIPE_SECRET_KEY=sk_test_your_secret_key
```

Edit `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 4. Run the Application

```bash
# Start both frontend and backend
npm run dev

# Or run separately:
npm run server  # Backend only (port 5000)
npm run client  # Frontend only (port 3000)
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🏗️ Development

### Available Scripts

```bash
# Root level
npm run dev          # Start both client and server
npm run client       # Start React development server
npm run server       # Start Node.js server
npm run build        # Build client for production
npm run install-all  # Install all dependencies

# Client level (cd client)
npm start           # Start development server
npm run build       # Create production build
npm test            # Run tests

# Server level (cd server)
npm start           # Start production server
npm run dev         # Start with nodemon (auto-restart)
```

### Database Schema

#### Users Collection
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  balance: number,
  ageVerified: boolean,
  status: 'active' | 'suspended' | 'banned',
  totalChallenges: number,
  totalWins: number,
  totalEarnings: number,
  rating: number,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Challenges Collection
```javascript
{
  creatorId: string,
  acceptorId: string,
  game: string,
  gameMode: string,
  stake: number,
  platformFee: number,
  totalPot: number,
  status: 'open' | 'accepted' | 'completed' | 'disputed' | 'cancelled',
  rules: string,
  proofRequirements: string,
  timeLimit: number,
  winnerId: string,
  proofSubmissions: array,
  disputeReason: string,
  escrowId: string,
  createdAt: timestamp,
  completedAt: timestamp
}
```

#### Escrows Collection
```javascript
{
  challengeId: string,
  creatorId: string,
  acceptorId: string,
  creatorStake: number,
  acceptorStake: number,
  platformFee: number,
  totalAmount: number,
  status: 'pending' | 'locked' | 'released' | 'refunded',
  releasedTo: string,
  adminNotes: string,
  createdAt: timestamp,
  releasedAt: timestamp
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/verify-age` - Verify age (18+)

#### Challenges
- `GET /api/challenges/open` - Get open challenges
- `POST /api/challenges` - Create challenge
- `GET /api/challenges/:id` - Get challenge details
- `POST /api/challenges/:id/accept` - Accept challenge
- `POST /api/challenges/:id/proof` - Submit proof
- `POST /api/challenges/:id/dispute` - Dispute challenge

#### Payments
- `POST /api/payments/deposit` - Create deposit intent
- `POST /api/payments/confirm-deposit` - Confirm deposit
- `POST /api/payments/withdraw` - Request withdrawal
- `GET /api/payments/transactions` - Get transaction history

#### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/challenges/review` - Challenges for review
- `POST /api/admin/challenges/:id/resolve` - Resolve dispute
- `POST /api/admin/users/:id/ban` - Ban user

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from client directory**
   ```bash
   cd client
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all `REACT_APP_*` variables from `client/.env`
   - Update `REACT_APP_API_URL` to your backend URL

4. **Custom Domain (Optional)**
   - Go to Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain

### Backend Deployment Options

#### Option 1: Firebase Functions (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Functions**
   ```bash
   firebase init functions
   # Choose JavaScript
   # Install dependencies: Yes
   ```

3. **Deploy Functions**
   ```bash
   # Copy server files to functions/
   cp -r server/* functions/
   
   # Deploy
   firebase deploy --only functions
   ```

4. **Update CORS settings**
   ```javascript
   // In functions/index.js
   const cors = require('cors')({
     origin: ['https://your-domain.vercel.app']
   });
   ```

#### Option 2: Railway/Render

1. **Create account** on Railway or Render
2. **Connect GitHub repository**
3. **Set environment variables** in dashboard
4. **Deploy automatically** on git push

#### Option 3: Digital Ocean/AWS

1. **Create droplet/EC2 instance**
2. **Install Node.js and PM2**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   sudo npm install -g pm2
   ```

3. **Clone repository and setup**
   ```bash
   git clone <your-repo>
   cd peer2pool
   npm install
   cd server && npm install
   ```

4. **Start with PM2**
   ```bash
   pm2 start server/index.js --name "peer2pool"
   pm2 startup
   pm2 save
   ```

5. **Setup reverse proxy** (Nginx)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Database Security Rules

Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read open challenges
    match /challenges/{challengeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.creatorId || 
         request.auth.uid == resource.data.acceptorId);
    }
    
    // Only challenge participants can read escrows
    match /escrows/{escrowId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.creatorId || 
         request.auth.uid == resource.data.acceptorId);
    }
    
    // Only users can read their own transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Firebase security rules deployed
- [ ] Stripe webhook endpoints configured
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured
- [ ] Backup strategy implemented
- [ ] Rate limiting configured
- [ ] Admin user created

## 🔧 Configuration

### Stripe Webhooks

For production, configure Stripe webhooks:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-api-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to environment variables

### Admin User Setup

To create an admin user:

1. Register normally through the app
2. Use Firebase Admin SDK to set custom claims:
   ```javascript
   await admin.auth().setCustomUserClaims(uid, { admin: true });
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Permission Denied**
   - Check Firebase security rules
   - Verify user authentication
   - Ensure correct project ID

2. **Stripe Payment Fails**
   - Verify API keys are correct
   - Check Stripe dashboard for errors
   - Ensure webhook is configured

3. **CORS Errors**
   - Update CORS origin in server
   - Check CLIENT_URL environment variable
   - Verify domain configuration

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify environment variables

### Logs and Monitoring

- **Frontend**: Browser Developer Tools
- **Backend**: Server logs and Firebase Functions logs
- **Database**: Firebase Console → Firestore
- **Payments**: Stripe Dashboard → Logs

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

## 📞 Support

For support and questions:
- Email: support@peer2pool.com
- Documentation: [docs.peer2pool.com](https://docs.peer2pool.com)
- Discord: [discord.gg/peer2pool](https://discord.gg/peer2pool)

---

**⚠️ Important Security Notes:**
- Never commit `.env` files to version control
- Use strong, unique passwords for all services
- Regularly rotate API keys and secrets
- Monitor logs for suspicious activity
- Keep dependencies updated for security patches