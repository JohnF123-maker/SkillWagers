import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  runTransaction 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * User Service - Centralized Firestore operations for user management
 */

// Get user profile document
export const getUserProfile = async (uid) => {
  if (!uid) throw new Error('User ID is required');
  
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }
  return { id: userDoc.id, ...userDoc.data() };
};

// Create or update user profile
export const createOrUpdateUserProfile = async (uid, userData) => {
  if (!uid) throw new Error('User ID is required');
  
  const userRef = doc(db, 'users', uid);
  const existingDoc = await getDoc(userRef);
  
  if (existingDoc.exists()) {
    // Update existing profile
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
  } else {
    // Create new profile with defaults
    await setDoc(userRef, {
      displayName: userData.displayName || '',
      email: userData.email || '',
      photoURL: userData.photoURL || '',
      balance: 1000, // Starting balance
      escrowAmount: 0,
      totalWagered: 0,
      totalWon: 0,
      totalLost: 0,
      rank: 'Beginner',
      isEligibleForDailyReward: true,
      lastDailyRewardClaim: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...userData
    });
  }
  
  return await getUserProfile(uid);
};

// Update user balance with transaction safety
export const updateUserBalance = async (uid, amount, reason = 'Balance update') => {
  if (!uid) throw new Error('User ID is required');
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  
  const userRef = doc(db, 'users', uid);
  
  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document does not exist');
    }
    
    const currentBalance = userDoc.data().balance || 0;
    const newBalance = currentBalance + amount;
    
    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }
    
    transaction.update(userRef, {
      balance: newBalance,
      updatedAt: serverTimestamp()
    });
    
    return newBalance;
  });
};

// Claim daily reward with 24-hour cooldown
export const claimDailyReward = async (uid) => {
  if (!uid) throw new Error('User ID is required');
  
  const userRef = doc(db, 'users', uid);
  const DAILY_REWARD_AMOUNT = 100;
  const COOLDOWN_HOURS = 24;
  
  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document does not exist');
    }
    
    const userData = userDoc.data();
    const now = new Date();
    const lastClaim = userData.lastDailyRewardClaim?.toDate();
    
    // Check cooldown period
    if (lastClaim) {
      const hoursSinceLastClaim = (now - lastClaim) / (1000 * 60 * 60);
      if (hoursSinceLastClaim < COOLDOWN_HOURS) {
        const remainingHours = COOLDOWN_HOURS - hoursSinceLastClaim;
        throw new Error(`Daily reward on cooldown. ${remainingHours.toFixed(1)} hours remaining.`);
      }
    }
    
    // Update user with reward
    transaction.update(userRef, {
      balance: increment(DAILY_REWARD_AMOUNT),
      lastDailyRewardClaim: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      success: true,
      amount: DAILY_REWARD_AMOUNT,
      newBalance: (userData.balance || 0) + DAILY_REWARD_AMOUNT
    };
  });
};

// Check if user is eligible for daily reward
export const checkDailyRewardEligibility = (lastClaimTimestamp) => {
  if (!lastClaimTimestamp) return { eligible: true, timeRemaining: 0 };
  
  const lastClaim = lastClaimTimestamp.toDate();
  const now = new Date();
  const hoursSinceLastClaim = (now - lastClaim) / (1000 * 60 * 60);
  const COOLDOWN_HOURS = 24;
  
  if (hoursSinceLastClaim >= COOLDOWN_HOURS) {
    return { eligible: true, timeRemaining: 0 };
  }
  
  const remainingHours = COOLDOWN_HOURS - hoursSinceLastClaim;
  return { 
    eligible: false, 
    timeRemaining: remainingHours * 60 * 60 * 1000 // in milliseconds
  };
};

// Update user display name (one-time only)
export const updateDisplayName = async (uid, displayName) => {
  if (!uid) throw new Error('User ID is required');
  if (!displayName?.trim()) throw new Error('Display name is required');
  
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new Error('User profile not found');
  }
  
  const userData = userDoc.data();
  if (userData.displayName && userData.displayName.trim() !== '') {
    throw new Error('Display name can only be set once');
  }
  
  await updateDoc(userRef, {
    displayName: displayName.trim(),
    updatedAt: serverTimestamp()
  });
  
  return displayName.trim();
};

// Update user photo URL
export const updateUserPhotoURL = async (uid, photoURL) => {
  if (!uid) throw new Error('User ID is required');
  if (!photoURL) throw new Error('Photo URL is required');
  
  await updateDoc(doc(db, 'users', uid), {
    photoURL,
    updatedAt: serverTimestamp()
  });
  
  return photoURL;
};