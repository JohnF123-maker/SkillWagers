const express = require('express');
const Challenge = require('../models/Challenge');
const Escrow = require('../models/Escrow');
const User = require('../models/User');
const { authenticateToken, requireAgeVerification } = require('../middleware/auth');

const router = express.Router();

// Get all open challenges
router.get('/open', async (req, res) => {
  try {
    const { game, limit = 20 } = req.query;
    const challenges = await Challenge.findOpen(parseInt(limit), game);
    
    // Add creator info to each challenge
    const challengesWithCreators = await Promise.all(
      challenges.map(async (challenge) => {
        const creator = await User.findByUid(challenge.creatorId);
        return {
          ...challenge.toObject(),
          id: challenge.id,
          creator: creator ? {
            displayName: creator.displayName,
            rating: creator.rating,
            totalChallenges: creator.totalChallenges,
            totalWins: creator.totalWins
          } : null
        };
      })
    );
    
    res.json({
      challenges: challengesWithCreators,
      total: challengesWithCreators.length
    });
  } catch (error) {
    console.error('Error fetching open challenges:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch open challenges'
    });
  }
});

// Create new challenge
router.post('/', authenticateToken, requireAgeVerification, async (req, res) => {
  try {
    const {
      game,
      gameMode,
      stake,
      rules,
      proofRequirements,
      timeLimit
    } = req.body;
    
    // Validate required fields
    if (!game || !gameMode || !stake || !rules || !proofRequirements) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'All fields are required'
      });
    }
    
    if (stake < 1 || stake > 1000) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Stake must be between $1 and $1000'
      });
    }
    
    // Check user balance
    const user = await User.findByUid(req.user.uid);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    if (user.balance < stake) {
      return res.status(400).json({
        error: 'Insufficient Balance',
        message: 'Insufficient balance to create challenge'
      });
    }
    
    // Create challenge
    const challengeData = {
      creatorId: req.user.uid,
      game,
      gameMode,
      stake,
      platformFee: stake * 0.05,
      totalPot: stake * 2,
      rules,
      proofRequirements,
      timeLimit: timeLimit || 24,
      status: 'open'
    };
    
    const challenge = new Challenge(challengeData);
    await challenge.save();
    
    // Deduct stake from user balance (held until challenge is accepted or cancelled)
    await user.updateBalance(stake, 'subtract');
    
    res.status(201).json({
      message: 'Challenge created successfully',
      challenge: {
        ...challenge.toObject(),
        id: challenge.id
      }
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      error: 'Creation Failed',
      message: 'Failed to create challenge'
    });
  }
});

// Get challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge Not Found',
        message: 'Challenge not found'
      });
    }
    
    // Get participant info
    const [creator, acceptor] = await Promise.all([
      User.findByUid(challenge.creatorId),
      challenge.acceptorId ? User.findByUid(challenge.acceptorId) : null
    ]);
    
    res.json({
      challenge: {
        ...challenge.toObject(),
        id: challenge.id,
        creator: creator ? {
          uid: creator.uid,
          displayName: creator.displayName,
          rating: creator.rating,
          totalChallenges: creator.totalChallenges,
          totalWins: creator.totalWins
        } : null,
        acceptor: acceptor ? {
          uid: acceptor.uid,
          displayName: acceptor.displayName,
          rating: acceptor.rating,
          totalChallenges: acceptor.totalChallenges,
          totalWins: acceptor.totalWins
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch challenge'
    });
  }
});

// Accept challenge
router.post('/:id/accept', authenticateToken, requireAgeVerification, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge Not Found',
        message: 'Challenge not found'
      });
    }
    
    // Check user balance
    const user = await User.findByUid(req.user.uid);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    if (user.balance < challenge.stake) {
      return res.status(400).json({
        error: 'Insufficient Balance',
        message: 'Insufficient balance to accept challenge'
      });
    }
    
    // Accept challenge
    await challenge.accept(req.user.uid);
    
    // Deduct stake from acceptor balance
    await user.updateBalance(challenge.stake, 'subtract');
    
    // Create escrow
    const escrow = await Escrow.createForChallenge(
      challenge.id,
      challenge.creatorId,
      challenge.acceptorId,
      challenge.stake
    );
    
    // Lock escrow
    await escrow.lock();
    
    // Update challenge with escrow ID
    challenge.escrowId = escrow.id;
    await challenge.save();
    
    res.json({
      message: 'Challenge accepted successfully',
      challenge: {
        ...challenge.toObject(),
        id: challenge.id
      }
    });
  } catch (error) {
    console.error('Error accepting challenge:', error);
    res.status(500).json({
      error: 'Accept Failed',
      message: error.message || 'Failed to accept challenge'
    });
  }
});

// Submit proof
router.post('/:id/proof', authenticateToken, async (req, res) => {
  try {
    const { proof } = req.body;
    
    if (!proof || !proof.description) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Proof description is required'
      });
    }
    
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge Not Found',
        message: 'Challenge not found'
      });
    }
    
    await challenge.submitProof(req.user.uid, proof);
    
    res.json({
      message: 'Proof submitted successfully',
      challenge: {
        ...challenge.toObject(),
        id: challenge.id
      }
    });
  } catch (error) {
    console.error('Error submitting proof:', error);
    res.status(500).json({
      error: 'Submission Failed',
      message: error.message || 'Failed to submit proof'
    });
  }
});

// Dispute challenge
router.post('/:id/dispute', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Dispute reason is required'
      });
    }
    
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge Not Found',
        message: 'Challenge not found'
      });
    }
    
    await challenge.dispute(req.user.uid, reason);
    
    res.json({
      message: 'Challenge disputed successfully',
      challenge: {
        ...challenge.toObject(),
        id: challenge.id
      }
    });
  } catch (error) {
    console.error('Error disputing challenge:', error);
    res.status(500).json({
      error: 'Dispute Failed',
      message: error.message || 'Failed to dispute challenge'
    });
  }
});

// Cancel challenge (creator only)
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({
        error: 'Challenge Not Found',
        message: 'Challenge not found'
      });
    }
    
    await challenge.cancel(req.user.uid);
    
    // Refund stake to creator
    const creator = await User.findByUid(challenge.creatorId);
    if (creator) {
      await creator.updateBalance(challenge.stake, 'add');
    }
    
    res.json({
      message: 'Challenge cancelled successfully',
      challenge: {
        ...challenge.toObject(),
        id: challenge.id
      }
    });
  } catch (error) {
    console.error('Error cancelling challenge:', error);
    res.status(500).json({
      error: 'Cancel Failed',
      message: error.message || 'Failed to cancel challenge'
    });
  }
});

// Get user's challenges
router.get('/user/:userId', async (req, res) => {
  try {
    const { status, limit = 10 } = req.query;
    const userId = req.params.userId;
    
    let query = db.collection('challenges')
      .where('participants', 'array-contains', userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    const challenges = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      challenges,
      total: challenges.length
    });
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch user challenges'
    });
  }
});

module.exports = router;