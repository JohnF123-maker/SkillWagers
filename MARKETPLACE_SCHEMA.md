# Peer2Pool Beta - Marketplace Schema & Development Plan

## Overview
This document outlines the planned marketplace functionality for Peer2Pool Beta Phase 2 and beyond.

## Current Status (Beta Phase 1)
- ✅ User authentication and registration
- ✅ Fake currency system ($100 starting balance)
- ✅ Basic challenge creation
- ✅ Individual challenge management
- ✅ Firebase security rules
- ⏳ Marketplace implementation (Phase 2)

## Marketplace Schema Design

### Challenge Categories
```
- Fitness & Sports
  - Running/Cardio
  - Strength Training  
  - Team Sports
  - Individual Sports

- Skills & Learning
  - Coding Challenges
  - Language Learning
  - Creative Arts
  - Educational Goals

- Lifestyle & Habits
  - Health & Wellness
  - Productivity
  - Social Challenges
  - Environmental

- Gaming & Esports
  - Video Game Competitions
  - Board Game Challenges
  - Puzzle Solving
  - Strategy Games
```

### Marketplace Features Roadmap

#### Phase 2 (Q2 2024)
- **Public Challenge Browse**
  - Search and filter functionality
  - Category-based organization
  - Real-time challenge availability
  
- **Enhanced Challenge Types**
  - Time-based challenges
  - Multi-participant tournaments
  - Team vs team competitions
  
- **Social Features**
  - Challenge ratings and reviews
  - User reputation system
  - Following/followers system

#### Phase 3 (Q3 2024)
- **Advanced Matching**
  - Skill-based matchmaking
  - Automatic opponent pairing
  - Custom tournament brackets
  
- **Community Features**
  - Challenge groups/communities
  - Discussion forums
  - Live chat during challenges
  
- **Gamification**
  - Achievement badges
  - Leaderboards
  - Seasonal competitions

### Database Schema

#### Collections Structure

**challenges_public**
```javascript
{
  id: string,
  title: string,
  description: string,
  category: string,
  subcategory: string,
  creatorId: string,
  stakeAmount: number,
  maxParticipants: number,
  currentParticipants: number,
  participantIds: array,
  difficulty: string, // 'beginner', 'intermediate', 'advanced'
  timeLimit: number, // hours
  proofRequirements: {
    type: string, // 'photo', 'video', 'data', 'verification'
    description: string
  },
  tags: array,
  isPublic: boolean,
  status: string, // 'open', 'active', 'completed', 'cancelled'
  createdAt: timestamp,
  startDate: timestamp,
  endDate: timestamp,
  metadata: {
    featuredChallenge: boolean,
    sponsoredBy: string,
    prizeMoney: number
  }
}
```

**challenge_participants**
```javascript
{
  challengeId: string,
  userId: string,
  joinedAt: timestamp,
  stakeAmount: number,
  status: string, // 'active', 'completed', 'forfeited'
  proofSubmitted: boolean,
  proofTimestamp: timestamp,
  result: string // 'won', 'lost', 'pending'
}
```

**marketplace_categories**
```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string,
  parentCategory: string,
  isActive: boolean,
  challengeCount: number,
  popularityScore: number
}
```

#### Search & Filter Capabilities

**Search Parameters:**
- Title/description text search
- Category and subcategory filtering
- Stake amount range
- Difficulty level
- Time commitment
- Proof type requirements
- Geographic location (future)

**Sorting Options:**
- Recently created
- Stake amount (high to low)
- Most participants
- Ending soonest
- Popularity score

### Security Considerations

#### Marketplace-Specific Rules
```javascript
// Additional Firestore rules for marketplace
match /challenges_public/{challengeId} {
  // Public read access for browsing
  allow read: if true;
  
  // Only authenticated users can create public challenges
  allow create: if isAuthenticated() && 
               request.resource.data.creatorId == request.auth.uid &&
               request.resource.data.stakeAmount <= 100.00; // Beta limit
  
  // Creators can update their own challenges (within limits)
  allow update: if isAuthenticated() && 
               resource.data.creatorId == request.auth.uid &&
               resource.data.status == 'open'; // Only open challenges can be modified
}

match /challenge_participants/{participantId} {
  // Users can read their own participation records
  allow read: if isAuthenticated() && 
             resource.data.userId == request.auth.uid;
  
  // Users can join challenges (validated by Cloud Function)
  allow create: if isAuthenticated() && 
               request.resource.data.userId == request.auth.uid;
}
```

### API Endpoints (Planned)

#### Marketplace Browsing
- `GET /api/marketplace/challenges` - Browse public challenges
- `GET /api/marketplace/categories` - Get all categories
- `GET /api/marketplace/featured` - Get featured/sponsored challenges
- `GET /api/marketplace/search` - Advanced search functionality

#### Challenge Management
- `POST /api/marketplace/challenges` - Create public challenge
- `POST /api/marketplace/challenges/:id/join` - Join a public challenge
- `GET /api/marketplace/challenges/:id/participants` - Get participant list
- `PUT /api/marketplace/challenges/:id/status` - Update challenge status

#### Social Features
- `POST /api/marketplace/challenges/:id/rate` - Rate a completed challenge
- `GET /api/marketplace/users/:id/profile` - Get public user profile
- `POST /api/marketplace/users/:id/follow` - Follow another user

### Beta Testing Strategy

#### Phase 2 Beta Testing Focus
1. **Core Marketplace Functionality**
   - Challenge browsing and filtering
   - Joining public challenges
   - Multi-participant challenge management

2. **User Experience Testing**
   - Search and discovery workflows
   - Challenge creation flow for public challenges
   - Mobile responsiveness

3. **Performance Testing**
   - Database query optimization
   - Real-time updates for challenge status
   - Concurrent user handling

#### Success Metrics
- User engagement (time spent browsing)
- Challenge participation rates
- User retention after marketplace launch
- Challenge completion rates
- User feedback scores

### Implementation Timeline

**Week 1-2:** Database schema implementation and migration
**Week 3-4:** Core marketplace API development
**Week 5-6:** Frontend marketplace components
**Week 7-8:** Search and filtering functionality
**Week 9-10:** Testing and optimization
**Week 11-12:** Beta launch and user feedback collection

### Future Enhancements

#### Post-Beta Features
- **Premium Challenges:** Higher stakes with verification
- **Sponsored Challenges:** Brand partnerships
- **Virtual Coaching:** AI-powered challenge suggestions
- **Live Streaming:** Real-time challenge broadcasts
- **NFT Rewards:** Blockchain-based achievement tokens

### Beta Feedback Collection

#### Key Questions for Beta Users
1. What types of challenges interest you most?
2. How important is the social aspect (following users, ratings)?
3. What stake amounts feel appropriate for different challenge types?
4. What proof verification methods do you trust most?
5. What would motivate you to create public challenges?

#### Feedback Channels
- In-app feedback forms
- Beta user surveys
- Discord community discussions
- Direct email: beta@peer2pool.com

---

*This document will be updated as we progress through Beta phases and gather user feedback.*