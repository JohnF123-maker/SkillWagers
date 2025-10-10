# SkillWagers - Skill-Based Gaming Platform (Beta)

🚨 **BETA VERSION** - Currently in testing phase with simulated currency only. Real money features are disabled.

A modern, secure gaming platform where players can create and accept skill-based challenges. Built with React, Node.js, and Firebase for a professional gaming experience.

## 🎮 What is SkillWagers?

SkillWagers is a competitive gaming platform that allows players to:
- **Create Challenges**: Set up gaming challenges with custom stakes and rules
- **Accept Challenges**: Browse and join challenges that match your skill level
- **Secure System**: Challenge system with dispute resolution
- **Gift Card Marketplace**: Trade gift cards for coins (Coming in Phase 2)
- **Beta Currency**: Test with fake $100 balance for development purposes

⚠️ **BETA NOTICE**: This version uses simulated currency ($100 fake balance) for testing purposes. No real money transactions are processed during Beta testing.

## 🏗️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **Tailwind CSS 3.4.0** - Utility-first styling
- **React Router 6** - Client-side routing
- **Headless UI** - Accessible UI components
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Firebase Admin SDK** - Backend Firebase integration
- **Payment Processing** - Disabled for Beta (Stripe commented out)
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

### Database & Services
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Firebase Storage** - File uploads
- **Firebase Functions** - Fake currency allocation for Beta
- **Payment Services** - Disabled for Beta testing
- **Hosting** - Local development / Firebase hosting

## 🚀 Key Features (Beta)

### For Players
- **User Authentication** - Secure registration and login
- **Profile Management** - Gaming profiles with stats and achievements
- **Challenge System** - Create and accept challenges (Beta functionality)
- **Fake Wallet System** - Test with $100 simulated balance
- **Proof Submission** - Upload screenshots/videos as challenge proof
- **Gift Card Marketplace** - Coming in Phase 2
- **Mobile Responsive** - Optimized for all devices

### For Beta Testers
- **Simulated Currency** - $100 fake balance for testing
- **No Real Payments** - All payment processing disabled
- **Feedback System** - Report issues and suggestions
- **Safe Testing Environment** - No financial risk during testing

### For Administrators
- **Admin Dashboard** - Complete platform management
- **User Moderation** - Ban, suspend, or verify users
- **Dispute Resolution** - Review and resolve challenge disputes
- **Financial Controls** - Manage escrow, refunds, and payouts
- **Analytics** - Track platform performance and revenue
- **Content Moderation** - Review proof submissions and reports

### Security & Compliance
- **Age Verification** - 18+ requirement with verification system
- **Secure Payments** - PCI-compliant Stripe integration
- **Fraud Detection** - Automated monitoring for suspicious activity
- **Data Protection** - GDPR/CCPA compliant data handling
- **Rate Limiting** - API protection against abuse
- **Firestore Security Rules** - Database-level access controls

## 🎯 Supported Games

- **Call of Duty** series (Warzone, Modern Warfare, etc.)
- **Fortnite** - Battle Royale and competitive modes
- **Apex Legends** - Battle Royale challenges
- **FIFA** series - 1v1 matches and tournaments
- **NBA 2K** series - Head-to-head competitions
- **Rocket League** - 1v1, 2v2, 3v3 matches
- **Valorant** - Competitive matches
- **CS:GO/CS2** - Aim duels and competitive matches
- **League of Legends** - 1v1 matches and tournaments
- **Custom Games** - Platform supports any competitive game

## 💰 Revenue Model

### Platform Commissions
- **Standard Users**: 5% commission on all challenge pots
- **Premium Users**: 3% commission with monthly subscription
- **High Volume**: 2% commission for users with $10k+ monthly volume

### Additional Revenue Streams
- **Premium Subscriptions**: $9.99/month for enhanced features
- **Tournament Entry Fees**: $5 entry fee for platform tournaments
- **Withdrawal Fees**: $2.50 per withdrawal (free for premium users)
- **Sponsored Tournaments**: Revenue from gaming brand partnerships

## 🛡️ Security Features

### Financial Security
- **Escrow System**: Funds held securely until challenge completion
- **Fraud Detection**: AI-powered suspicious activity monitoring
- **PCI Compliance**: Stripe handles all payment card data
- **Multi-layer Verification**: Identity and payment method verification

### Platform Security
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Controlled cross-origin requests
- **Input Validation**: Comprehensive request sanitization
- **Firestore Rules**: Granular database access controls

## 📱 User Experience

### Challenge Flow
1. **Browse Marketplace** - Find challenges matching your preferences
2. **Accept Challenge** - Review rules and submit stake
3. **Play Game** - Complete the challenge according to rules
4. **Submit Proof** - Upload screenshots or video evidence
5. **Receive Payout** - Automatic funds release upon verification

### Dispute Process
1. **Open Dispute** - Either party can contest results
2. **Submit Evidence** - Both parties provide proof and arguments
3. **Admin Review** - Platform moderators review all evidence
4. **Resolution** - Fair decision based on platform rules
5. **Fund Distribution** - Automatic payout to winning party

## 📊 Platform Statistics

### Target Metrics (Year 1)
- **10,000+** registered users
- **$500,000+** total transaction volume
- **$50,000+** monthly revenue
- **95%+** customer satisfaction rate
- **99.9%** uptime reliability

### Growth Projections
- **Month 1**: 200 users, $1,000 revenue
- **Month 3**: 1,000 users, $5,000 revenue
- **Month 6**: 3,000 users, $15,000 revenue
- **Month 12**: 10,000 users, $50,000 revenue

## 🌐 Deployment Architecture

### Production Setup
- **Frontend**: Vercel hosting with global CDN
- **Backend**: Firebase Functions (serverless)
- **Database**: Firebase Firestore (global)
- **Payments**: Stripe (global payment processing)
- **Monitoring**: Firebase Analytics + Sentry error tracking

### Development Setup
- **Frontend**: React development server (localhost:3000)
- **Backend**: Express server (localhost:5000)
- **Database**: Firebase Firestore (development project)
- **Payments**: Stripe test mode

## 📄 Documentation

- **Deployment Guide**: `DEPLOYMENT_GUIDE.txt` - Complete business and technical setup
- **API Documentation**: Available in server route files
- **Component Documentation**: JSDoc comments in React components
- **Database Schema**: Defined in Firestore security rules

## 🤝 Contributing

This is a commercial platform project. For business inquiries or technical questions:
- **Business**: admin@skillwagers.com
- **Support**: support@skillwagers.com
- **Technical**: Create an issue in this repository

## 📜 License

Proprietary - All rights reserved. This project is for commercial use by authorized parties only.

---

**Ready to turn your gaming skills into real money? Join SkillWagers today!**
