import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  runTransaction,
  increment 
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Challenge Service - Centralized Firestore operations for challenge management
 */

// Generate unique challenge ID
const generateChallengeId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Create a new challenge with escrow
export const createChallenge = async (uid, challengeData) => {
  if (!uid) throw new Error('User ID is required');
  if (!challengeData.title?.trim()) throw new Error('Challenge title is required');
  if (!challengeData.description?.trim()) throw new Error('Challenge description is required');
  if (typeof challengeData.stakeAmount !== 'number' || challengeData.stakeAmount <= 0) {
    throw new Error('Valid stake amount is required');
  }
  
  const challengeId = generateChallengeId();
  const userRef = doc(db, 'users', uid);
  const challengeRef = doc(db, 'challenges', challengeId);
  
  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const userData = userDoc.data();
    const currentBalance = userData.balance || 0;
    
    if (currentBalance < challengeData.stakeAmount) {
      throw new Error('Insufficient balance for stake amount');
    }
    
    // Create challenge document
    const challenge = {
      id: challengeId,
      title: challengeData.title.trim(),
      description: challengeData.description.trim(),
      stakeAmount: challengeData.stakeAmount,
      category: challengeData.category || 'General',
      rules: challengeData.rules?.trim() || '',
      successCriteria: challengeData.successCriteria?.trim() || '',
      judgeNotes: challengeData.judgeNotes?.trim() || '',
      creatorId: uid,
      status: 'open',
      participants: [uid],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: challengeData.expiresAt || null
    };
    
    transaction.set(challengeRef, challenge);
    
    // Deduct stake from creator's balance and add to escrow
    transaction.update(userRef, {
      balance: increment(-challengeData.stakeAmount),
      escrowAmount: increment(challengeData.stakeAmount),
      updatedAt: serverTimestamp()
    });
    
    return { ...challenge, id: challengeId };
  });
};

// Get challenge by ID
export const getChallenge = async (challengeId) => {
  if (!challengeId) throw new Error('Challenge ID is required');
  
  const challengeDoc = await getDoc(doc(db, 'challenges', challengeId));
  if (!challengeDoc.exists()) {
    throw new Error('Challenge not found');
  }
  
  return { id: challengeDoc.id, ...challengeDoc.data() };
};

// Get challenges by status
export const getChallengesByStatus = async (status, limitCount = 20) => {
  const challengesRef = collection(db, 'challenges');
  const q = query(
    challengesRef,
    where('status', '==', status),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get challenges created by a user
export const getUserChallenges = async (uid, limitCount = 20) => {
  if (!uid) throw new Error('User ID is required');
  
  const challengesRef = collection(db, 'challenges');
  const q = query(
    challengesRef,
    where('creatorId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get challenges where user is a participant
export const getUserParticipatedChallenges = async (uid, limitCount = 20) => {
  if (!uid) throw new Error('User ID is required');
  
  const challengesRef = collection(db, 'challenges');
  const q = query(
    challengesRef,
    where('participants', 'array-contains', uid),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Join a challenge
export const joinChallenge = async (challengeId, uid) => {
  if (!challengeId) throw new Error('Challenge ID is required');
  if (!uid) throw new Error('User ID is required');
  
  const challengeRef = doc(db, 'challenges', challengeId);
  const userRef = doc(db, 'users', uid);
  
  return await runTransaction(db, async (transaction) => {
    const [challengeDoc, userDoc] = await Promise.all([
      transaction.get(challengeRef),
      transaction.get(userRef)
    ]);
    
    if (!challengeDoc.exists()) {
      throw new Error('Challenge not found');
    }
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const challengeData = challengeDoc.data();
    const userData = userDoc.data();
    
    if (challengeData.status !== 'open') {
      throw new Error('Challenge is not open for participation');
    }
    
    if (challengeData.participants.includes(uid)) {
      throw new Error('User is already participating in this challenge');
    }
    
    const currentBalance = userData.balance || 0;
    if (currentBalance < challengeData.stakeAmount) {
      throw new Error('Insufficient balance to join challenge');
    }
    
    // Add user to participants and deduct stake
    transaction.update(challengeRef, {
      participants: [...challengeData.participants, uid],
      updatedAt: serverTimestamp()
    });
    
    transaction.update(userRef, {
      balance: increment(-challengeData.stakeAmount),
      escrowAmount: increment(challengeData.stakeAmount),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, challengeId, participantCount: challengeData.participants.length + 1 };
  });
};

// Complete a challenge (for creator/judge)
export const completeChallenge = async (challengeId, winnerId, judgmentNotes = '') => {
  if (!challengeId) throw new Error('Challenge ID is required');
  if (!winnerId) throw new Error('Winner ID is required');
  
  const challengeRef = doc(db, 'challenges', challengeId);
  
  return await runTransaction(db, async (transaction) => {
    const challengeDoc = await transaction.get(challengeRef);
    
    if (!challengeDoc.exists()) {
      throw new Error('Challenge not found');
    }
    
    const challengeData = challengeDoc.data();
    
    if (challengeData.status !== 'open') {
      throw new Error('Challenge is not open');
    }
    
    if (!challengeData.participants.includes(winnerId)) {
      throw new Error('Winner must be a participant in the challenge');
    }
    
    // Calculate total pot and distribute winnings
    const totalPot = challengeData.stakeAmount * challengeData.participants.length;
    const winnerRef = doc(db, 'users', winnerId);
    
    // Update challenge status
    transaction.update(challengeRef, {
      status: 'completed',
      winnerId,
      judgmentNotes: judgmentNotes.trim(),
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Award winnings to winner
    const winnerDoc = await transaction.get(winnerRef);
    if (winnerDoc.exists()) {
      transaction.update(winnerRef, {
        balance: increment(totalPot),
        escrowAmount: increment(-challengeData.stakeAmount), // Remove their stake from escrow
        totalWon: increment(totalPot),
        updatedAt: serverTimestamp()
      });
    }
    
    // Update escrow for other participants (losers)
    for (const participantId of challengeData.participants) {
      if (participantId !== winnerId) {
        const participantRef = doc(db, 'users', participantId);
        const participantDoc = await transaction.get(participantRef);
        if (participantDoc.exists()) {
          transaction.update(participantRef, {
            escrowAmount: increment(-challengeData.stakeAmount), // Remove from escrow
            totalLost: increment(challengeData.stakeAmount),
            updatedAt: serverTimestamp()
          });
        }
      }
    }
    
    return { 
      success: true, 
      challengeId, 
      winnerId, 
      totalPot,
      participantCount: challengeData.participants.length 
    };
  });
};

// Cancel a challenge (only by creator, only if no other participants)
export const cancelChallenge = async (challengeId, uid) => {
  if (!challengeId) throw new Error('Challenge ID is required');
  if (!uid) throw new Error('User ID is required');
  
  const challengeRef = doc(db, 'challenges', challengeId);
  const userRef = doc(db, 'users', uid);
  
  return await runTransaction(db, async (transaction) => {
    const [challengeDoc, userDoc] = await Promise.all([
      transaction.get(challengeRef),
      transaction.get(userRef)
    ]);
    
    if (!challengeDoc.exists()) {
      throw new Error('Challenge not found');
    }
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const challengeData = challengeDoc.data();
    
    if (challengeData.creatorId !== uid) {
      throw new Error('Only the challenge creator can cancel');
    }
    
    if (challengeData.status !== 'open') {
      throw new Error('Challenge is not open for cancellation');
    }
    
    if (challengeData.participants.length > 1) {
      throw new Error('Cannot cancel challenge with multiple participants');
    }
    
    // Refund stake to creator
    transaction.update(userRef, {
      balance: increment(challengeData.stakeAmount),
      escrowAmount: increment(-challengeData.stakeAmount),
      updatedAt: serverTimestamp()
    });
    
    // Mark challenge as cancelled
    transaction.update(challengeRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, challengeId, refundAmount: challengeData.stakeAmount };
  });
};

// Get challenge statistics for a user
export const getUserChallengeStats = async (uid) => {
  if (!uid) throw new Error('User ID is required');
  
  const challengesRef = collection(db, 'challenges');
  
  // Get challenges where user participated
  const participatedQuery = query(
    challengesRef,
    where('participants', 'array-contains', uid)
  );
  
  const participatedSnapshot = await getDocs(participatedQuery);
  const participatedChallenges = participatedSnapshot.docs.map(doc => doc.data());
  
  const stats = {
    totalChallenges: participatedChallenges.length,
    activeChallenges: participatedChallenges.filter(c => c.status === 'open').length,
    completedChallenges: participatedChallenges.filter(c => c.status === 'completed').length,
    wonChallenges: participatedChallenges.filter(c => c.status === 'completed' && c.winnerId === uid).length,
    createdChallenges: participatedChallenges.filter(c => c.creatorId === uid).length
  };
  
  stats.lostChallenges = stats.completedChallenges - stats.wonChallenges;
  stats.winRate = stats.completedChallenges > 0 ? (stats.wonChallenges / stats.completedChallenges * 100).toFixed(1) : 0;
  
  return stats;
};