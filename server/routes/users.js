const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    res.json({
      balance: user.balance,
      uid: user.uid
    });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch user balance'
    });
  }
});

// Get user leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, sortBy = 'rating' } = req.query;
    
    const validSortFields = ['rating', 'totalEarnings', 'totalWins', 'totalChallenges'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
    
    const snapshot = await db.collection('users')
      .where('status', '==', 'active')
      .orderBy(sortField, 'desc')
      .limit(parseInt(limit))
      .get();
    
    const leaderboard = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        rank: index + 1,
        uid: doc.id,
        displayName: data.displayName,
        rating: data.rating || 1000,
        totalEarnings: data.totalEarnings || 0,
        totalWins: data.totalWins || 0,
        totalChallenges: data.totalChallenges || 0,
        winRate: data.totalChallenges > 0 
          ? ((data.totalWins || 0) / data.totalChallenges * 100).toFixed(1)
          : '0.0'
      };
    });
    
    res.json({
      leaderboard,
      sortBy: sortField,
      total: leaderboard.length
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch leaderboard'
    });
  }
});

module.exports = router;