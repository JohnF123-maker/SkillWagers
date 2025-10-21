import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Validation schemas
const createWagerSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(500),
  wagerAmount: z.number().min(1).max(1000),
  category: z.enum(['fitness', 'learning', 'gaming', 'creative', 'other']),
  proofRequirements: z.string().min(10).max(200),
  timeframe: z.number().min(1).max(30) // days
});

// Create Wager Function
export const createWager = onCall(async (request) => {
  const { auth, data } = request;
  
  // Check authentication
  if (!auth?.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Validate input data
    const validatedData = createWagerSchema.parse(data);
    
    // Get user's profile to check balance
    const userDoc = await db.collection('users').doc(auth.uid).get();
    const userProfile = userDoc.data();
    
    if (!userProfile) {
      throw new HttpsError('not-found', 'User profile not found');
    }
    
    // Check if user has sufficient balance
    const userBalance = userProfile.betaBalance || 0;
    if (userBalance < validatedData.wagerAmount) {
      throw new HttpsError('failed-precondition', 'Insufficient balance');
    }
    
    // Create challenge document
    const challengeRef = db.collection('challenges').doc();
    const challengeData = {
      id: challengeRef.id,
      creatorId: auth.uid,
      creatorName: userProfile.displayName || 'Unknown',
      title: validatedData.title,
      description: validatedData.description,
      wagerAmount: validatedData.wagerAmount,
      category: validatedData.category,
      proofRequirements: validatedData.proofRequirements,
      timeframe: validatedData.timeframe,
      status: 'open',
      participants: [auth.uid],
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + (validatedData.timeframe * 24 * 60 * 60 * 1000))
    };
    
    // Create escrow document for holding wager funds
    const escrowRef = db.collection('escrow').doc();
    const escrowData = {
      challengeId: challengeRef.id,
      creatorId: auth.uid,
      amount: validatedData.wagerAmount,
      status: 'held',
      createdAt: FieldValue.serverTimestamp()
    };
    
    // Execute atomic transaction
    await db.runTransaction(async (transaction) => {
      // Deduct wager amount from user balance
      transaction.update(db.collection('users').doc(auth.uid), {
        betaBalance: FieldValue.increment(-validatedData.wagerAmount)
      });
      
      // Create challenge
      transaction.set(challengeRef, challengeData);
      
      // Create escrow entry
      transaction.set(escrowRef, escrowData);
    });
    
    logger.info(`Challenge created: ${challengeRef.id} by user: ${auth.uid}`);
    
    return {
      success: true,
      challengeId: challengeRef.id,
      message: 'Challenge created successfully'
    };
    
  } catch (error) {
    logger.error('Error creating challenge:', error);
    
    if (error instanceof z.ZodError) {
      throw new HttpsError('invalid-argument', `Validation error: ${error.message}`);
    }
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to create challenge');
  }
});

// Claim Daily Reward Function
export const claimDailyReward = onCall(async (request) => {
  const { auth } = request;
  
  // Check authentication
  if (!auth?.uid) {
    throw new HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    // Get user's profile
    const userRef = db.collection('users').doc(auth.uid);
    const userDoc = await userRef.get();
    const userProfile = userDoc.data();
    
    if (!userProfile) {
      throw new HttpsError('not-found', 'User profile not found');
    }
    
    // Check if user has already claimed today
    const lastClaimDate = userProfile.lastDailyRewardClaim?.toDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (lastClaimDate) {
      const lastClaim = new Date(lastClaimDate);
      lastClaim.setHours(0, 0, 0, 0);
      
      if (lastClaim.getTime() === today.getTime()) {
        throw new HttpsError('failed-precondition', 'Daily reward already claimed today');
      }
    }
    
    // Calculate reward amount (base 10 SIM, with streak bonus)
    const baseReward = 10;
    let currentStreak = userProfile.dailyStreakCount || 0;
    
    // Check if this maintains a streak (claimed yesterday)
    if (lastClaimDate) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastClaimDay = new Date(lastClaimDate);
      lastClaimDay.setHours(0, 0, 0, 0);
      
      if (lastClaimDay.getTime() === yesterday.getTime()) {
        currentStreak += 1;
      } else {
        currentStreak = 1; // Reset streak
      }
    } else {
      currentStreak = 1; // First time claiming
    }
    
    // Streak bonus: +1 SIM per day of streak (max 10 bonus)
    const streakBonus = Math.min(currentStreak - 1, 10);
    const totalReward = baseReward + streakBonus;
    
    // Update user profile with reward and streak
    await userRef.update({
      betaBalance: FieldValue.increment(totalReward),
      lastDailyRewardClaim: FieldValue.serverTimestamp(),
      dailyStreakCount: currentStreak,
      totalDailyRewardsClaimed: FieldValue.increment(1)
    });
    
    logger.info(`Daily reward claimed: ${totalReward} SIM by user: ${auth.uid}, streak: ${currentStreak}`);
    
    return {
      success: true,
      rewardAmount: totalReward,
      streakCount: currentStreak,
      message: `Claimed ${totalReward} SIM! ${currentStreak} day streak.`
    };
    
  } catch (error) {
    logger.error('Error claiming daily reward:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Failed to claim daily reward');
  }
});