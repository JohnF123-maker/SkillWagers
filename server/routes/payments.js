const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const { authenticateToken, requireAgeVerification } = require('../middleware/auth');
const { db } = require('../config/firebase');

const router = express.Router();

// Create payment intent for deposit
router.post('/deposit', authenticateToken, requireAgeVerification, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount < 5 || amount > 1000) {
      return res.status(400).json({
        error: 'Invalid Amount',
        message: 'Amount must be between $5 and $1000'
      });
    }
    
    const user = await User.findByUid(req.user.uid);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      metadata: {
        userId: user.uid,
        type: 'deposit'
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Payment Failed',
      message: 'Failed to create payment intent'
    });
  }
});

// Confirm deposit after Stripe payment
router.post('/confirm-deposit', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Missing Payment Intent',
        message: 'Payment intent ID is required'
      });
    }
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'Payment Not Completed',
        message: 'Payment was not successful'
      });
    }
    
    if (paymentIntent.metadata.userId !== req.user.uid) {
      return res.status(403).json({
        error: 'Payment Mismatch',
        message: 'Payment does not belong to this user'
      });
    }
    
    const user = await User.findByUid(req.user.uid);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    const amount = paymentIntent.amount / 100; // Convert from cents
    
    // Update user balance
    await user.updateBalance(amount, 'add');
    
    // Record transaction
    await db.collection('transactions').add({
      userId: user.uid,
      type: 'deposit',
      amount: amount,
      status: 'completed',
      paymentIntentId: paymentIntentId,
      createdAt: new Date()
    });
    
    res.json({
      message: 'Deposit confirmed successfully',
      amount: amount,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Error confirming deposit:', error);
    res.status(500).json({
      error: 'Confirmation Failed',
      message: 'Failed to confirm deposit'
    });
  }
});

// Request withdrawal
router.post('/withdraw', authenticateToken, requireAgeVerification, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount < 10) {
      return res.status(400).json({
        error: 'Invalid Amount',
        message: 'Minimum withdrawal amount is $10'
      });
    }
    
    const user = await User.findByUid(req.user.uid);
    if (!user) {
      return res.status(404).json({
        error: 'User Not Found',
        message: 'User profile not found'
      });
    }
    
    if (user.balance < amount) {
      return res.status(400).json({
        error: 'Insufficient Balance',
        message: 'Insufficient balance for withdrawal'
      });
    }
    
    // Deduct amount from balance (pending withdrawal)
    await user.updateBalance(amount, 'subtract');
    
    // Create withdrawal record
    const withdrawalRef = await db.collection('withdrawals').add({
      userId: user.uid,
      amount: amount,
      status: 'pending',
      requestedAt: new Date(),
      adminProcessed: false
    });
    
    // Record transaction
    await db.collection('transactions').add({
      userId: user.uid,
      type: 'withdrawal',
      amount: amount,
      status: 'pending',
      withdrawalId: withdrawalRef.id,
      createdAt: new Date()
    });
    
    res.json({
      message: 'Withdrawal request submitted successfully',
      withdrawalId: withdrawalRef.id,
      amount: amount,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({
      error: 'Withdrawal Failed',
      message: 'Failed to process withdrawal request'
    });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, type } = req.query;
    
    let query = db.collection('transactions')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit));
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    }));
    
    res.json({
      transactions,
      total: transactions.length
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      error: 'Fetch Failed',
      message: 'Failed to fetch transaction history'
    });
  }
});

module.exports = router;