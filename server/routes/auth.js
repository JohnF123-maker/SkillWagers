const express = require('express');
const { auth } = require('../config/firebase');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL, dateOfBirth } = req.body;
    
    // Validate required fields
    if (!uid || !email) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'UID and email are required'
      });
    }
    
    // Verify age (18+)
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        return res.status(400).json({
          error: 'Age Restriction',
          message: 'You must be 18 or older to use this platform'
        });
      }
    }
    
    // Check if user already exists
    const existingUser = await User.findByUid(uid);
    if (existingUser) {
      return res.status(409).json({
        error: 'User Exists',
        message: 'User already registered'
      });
    }
    
    // Create new user
    const userData = {
      uid,
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: photoURL || null,
      ageVerified: !!dateOfBirth,
      balance: 0,
      status: 'active'
    };
    
    const user = new User(userData);
    await user.save();
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        ageVerified: user.ageVerified,
        balance: user.balance,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration Failed',
      message: 'Failed to register user'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    // Get user statistics
    const [transactionHistory, challengeHistory] = await Promise.all([
      user.getTransactionHistory(5),
      user.getChallengeHistory(5)
    ]);
    
    res.json({
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        ageVerified: user.ageVerified,
        balance: user.balance,
        status: user.status,
        totalChallenges: user.totalChallenges,
        totalWins: user.totalWins,
        totalEarnings: user.totalEarnings,
        rating: user.rating,
        winRate: user.totalChallenges > 0 ? (user.totalWins / user.totalChallenges * 100).toFixed(1) : 0
      },
      recentTransactions: transactionHistory,
      recentChallenges: challengeHistory
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Profile Fetch Failed',
      message: 'Failed to fetch user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, preferences } = req.body;
    
    const user = await User.findByUid(req.user.uid);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    // Update allowed fields
    if (displayName) user.displayName = displayName;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    await user.save();
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        ageVerified: user.ageVerified,
        balance: user.balance,
        status: user.status,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile Update Failed',
      message: 'Failed to update user profile'
    });
  }
});

// Verify age (18+)
router.post('/verify-age', authenticateToken, async (req, res) => {
  try {
    const { dateOfBirth } = req.body;
    
    if (!dateOfBirth) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Date of birth is required'
      });
    }
    
    // Calculate age
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return res.status(400).json({
        error: 'Age Restriction',
        message: 'You must be 18 or older to use this platform'
      });
    }
    
    // Update user age verification
    const user = await User.findByUid(req.user.uid);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    user.ageVerified = true;
    await user.save();
    
    res.json({
      message: 'Age verification successful',
      ageVerified: true
    });
  } catch (error) {
    console.error('Age verification error:', error);
    res.status(500).json({
      error: 'Age Verification Failed',
      message: 'Failed to verify age'
    });
  }
});

// Check authentication status
router.get('/check', authenticateToken, (req, res) => {
  res.json({
    authenticated: true,
    uid: req.user.uid,
    email: req.user.email
  });
});

module.exports = router;