const express = require('express');
const Challenge = require('../models/Challenge');
const Escrow = require('../models/Escrow');
const User = require('../models/User');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { db, auth } = require('../config/firebase');

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(requireAdmin);

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [userStats, challengeStats, escrowStats] = await Promise.all([
      getUserStats(),
      getChallengeStats(),
      Escrow.getStats()
    ]);
    
    res.json({
      users: userStats,
      challenges: challengeStats,
      escrows: escrowStats,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      error: 'Stats Fetch Failed',
      message: 'Failed to fetch admin statistics'
    });
  }
});

// Get challenges requiring admin review
router.get('/challenges/review', async (req, res) => {
  try {
    const challenges = await Challenge.findForAdminReview();
    
    // Add participant info
    const challengesWithUsers = await Promise.all(
      challenges.map(async (challenge) => {
        const [creator, acceptor] = await Promise.all([
          User.findByUid(challenge.creatorId),
          challenge.acceptorId ? User.findByUid(challenge.acceptorId) : null
        ]);
        
        return {
          ...challenge.toObject(),
          id: challenge.id,
          creator: creator ? {
            uid: creator.uid,
            displayName: creator.displayName,
            email: creator.email
          } : null,
          acceptor: acceptor ? {
            uid: acceptor.uid,
            displayName: acceptor.displayName,
            email: acceptor.email
          } : null
        };
      })
    );
    
    res.json({
      challenges: challengesWithUsers,
      total: challengesWithUsers.length
    });
  } catch (error) {
    console.error('Error fetching challenges for review:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch challenges for review'
    });
  }
});

// Resolve challenge dispute
router.post('/challenges/:id/resolve', async (req, res) => {
  try {
    const { winnerId, notes } = req.body;
    
    if (!winnerId) {
      return res.status(400).json({
        error: 'Missing Winner',
        message: 'Winner ID is required'
      });
    }
    
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge Not Found',
        message: 'Challenge not found'
      });
    }
    
    // Complete challenge
    await challenge.complete(winnerId, req.user.uid);
    if (notes) {
      challenge.adminNotes = notes;
      await challenge.save();
    }
    
    // Release escrow
    const escrow = await Escrow.findByChallengeId(challenge.id);
    if (escrow) {
      const payout = await escrow.release(winnerId, req.user.uid);
      
      // Update winner's balance
      const winner = await User.findByUid(winnerId);
      if (winner) {
        await winner.updateBalance(payout.amount, 'add');
        
        // Update winner stats
        await winner.updateStats({ won: true, earnings: payout.amount });
      }
      
      // Update loser stats
      const loserId = winnerId === challenge.creatorId ? challenge.acceptorId : challenge.creatorId;
      const loser = await User.findByUid(loserId);
      if (loser) {
        await loser.updateStats({ won: false, earnings: 0 });
      }
      
      // Record transaction
      await db.collection('transactions').add({
        userId: winnerId,
        type: 'challenge_win',
        amount: payout.amount,
        challengeId: challenge.id,
        status: 'completed',
        createdAt: new Date()
      });
    }
    
    res.json({
      message: 'Challenge resolved successfully',
      challenge: {
        ...challenge.toObject(),
        id: challenge.id
      }
    });
  } catch (error) {
    console.error('Error resolving challenge:', error);
    res.status(500).json({
      error: 'Resolution Failed',
      message: error.message || 'Failed to resolve challenge'
    });
  }
});

// Refund challenge
router.post('/challenges/:id/refund', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge Not Found',
        message: 'Challenge not found'
      });
    }
    
    // Find and refund escrow
    const escrow = await Escrow.findByChallengeId(challenge.id);
    if (escrow) {
      const refund = await escrow.refund(req.user.uid);
      
      // Refund both participants
      const [creator, acceptor] = await Promise.all([
        User.findByUid(challenge.creatorId),
        challenge.acceptorId ? User.findByUid(challenge.acceptorId) : null
      ]);
      
      if (creator) {
        await creator.updateBalance(refund.creatorRefund, 'add');
        await db.collection('transactions').add({
          userId: creator.uid,
          type: 'refund',
          amount: refund.creatorRefund,
          challengeId: challenge.id,
          status: 'completed',
          createdAt: new Date()
        });
      }
      
      if (acceptor) {
        await acceptor.updateBalance(refund.acceptorRefund, 'add');
        await db.collection('transactions').add({
          userId: acceptor.uid,
          type: 'refund',
          amount: refund.acceptorRefund,
          challengeId: challenge.id,
          status: 'completed',
          createdAt: new Date()
        });
      }
    }
    
    // Update challenge status
    challenge.status = 'refunded';
    challenge.adminNotes = reason || 'Refunded by admin';
    await challenge.save();
    
    res.json({
      message: 'Challenge refunded successfully',
      challenge: {
        ...challenge.toObject(),
        id: challenge.id
      }
    });
  } catch (error) {
    console.error('Error refunding challenge:', error);
    res.status(500).json({
      error: 'Refund Failed',
      message: 'Failed to refund challenge'
    });
  }
});

// Ban user
router.post('/users/:userId/ban', async (req, res) => {
  try {
    const { reason, duration } = req.body; // duration in days, 0 for permanent
    const userId = req.params.userId;
    
    const user = await User.findByUid(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User not found'
      });
    }
    
    // Update user status
    user.status = 'banned';
    await user.save();
    
    // Set custom claim for banned user
    await auth.setCustomUserClaims(userId, { banned: true });
    
    // Record ban
    await db.collection('bans').add({
      userId: userId,
      adminId: req.user.uid,
      reason: reason || 'Violation of terms',
      duration: duration || 0,
      bannedAt: new Date(),
      expiresAt: duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null
    });
    
    res.json({
      message: 'User banned successfully',
      userId: userId,
      reason: reason
    });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({
      error: 'Ban Failed',
      message: 'Failed to ban user'
    });
  }
});

// Unban user
router.post('/users/:userId/unban', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findByUid(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User not found'
      });
    }
    
    // Update user status
    user.status = 'active';
    await user.save();
    
    // Remove banned claim
    await auth.setCustomUserClaims(userId, { banned: false });
    
    // Update ban record
    const banSnapshot = await db.collection('bans')
      .where('userId', '==', userId)
      .where('expiresAt', '==', null)
      .limit(1)
      .get();
    
    if (!banSnapshot.empty) {
      await banSnapshot.docs[0].ref.update({
        unbannedAt: new Date(),
        unbannedBy: req.user.uid
      });
    }
    
    res.json({
      message: 'User unbanned successfully',
      userId: userId
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({
      error: 'Unban Failed',
      message: 'Failed to unban user'
    });
  }
});

// Get all users for admin management
router.get('/users', async (req, res) => {
  try {
    const { limit = 50, status } = req.query;
    
    let query = db.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
    
    res.json({
      users,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch users'
    });
  }
});

// Helper functions
async function getUserStats() {
  const usersSnapshot = await db.collection('users').get();
  const users = usersSnapshot.docs.map(doc => doc.data());
  
  return {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    banned: users.filter(u => u.status === 'banned').length,
    ageVerified: users.filter(u => u.ageVerified).length,
    totalBalance: users.reduce((sum, u) => sum + (u.balance || 0), 0)
  };
}

async function getChallengeStats() {
  const challengesSnapshot = await db.collection('challenges').get();
  const challenges = challengesSnapshot.docs.map(doc => doc.data());
  
  return {
    total: challenges.length,
    open: challenges.filter(c => c.status === 'open').length,
    active: challenges.filter(c => c.status === 'accepted').length,
    completed: challenges.filter(c => c.status === 'completed').length,
    disputed: challenges.filter(c => c.status === 'disputed').length,
    totalVolume: challenges.reduce((sum, c) => sum + (c.totalPot || 0), 0)
  };
}

module.exports = router;