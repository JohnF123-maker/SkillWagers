/**
 * Cloud Functions for Peer2Pool Beta
 * Handles user creation, fake currency allocation, and secure balance management
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const logger = require("firebase-functions/logger");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// For cost control, set maximum container instances
setGlobalOptions({ maxInstances: 10 });

/**
 * Automatically triggered when a new user document is created
 * Allocates $100 fake currency to new Beta users
 */
exports.onUserCreate = onDocumentCreated("users/{userId}", async (event) => {
  const snap = event.data;
  const userId = event.params.userId;
  
  if (!snap) {
    logger.warn("No data associated with the event");
    return;
  }

  const userData = snap.data();
  logger.info(`New user created: ${userId}`, userData);

  try {
    // Allocate $100 fake currency for Beta testing
    await snap.ref.update({
      balance: 100.00,
      balanceUpdatedAt: new Date(),
      hasClaimed: true,
      currency: "fake",
      betaUser: true
    });

    // Log the allocation
    await db.collection("transactions").add({
      userId: userId,
      type: "beta_allocation",
      amount: 100.00,
      description: "Beta welcome bonus - $100 fake currency",
      timestamp: new Date(),
      status: "completed"
    });

    logger.info(`Successfully allocated $100 fake currency to user ${userId}`);
  } catch (error) {
    logger.error(`Failed to allocate beta funds to user ${userId}:`, error);
  }
});

/**
 * Callable function to manually claim dev funds (for testing purposes)
 * Only allows claiming once per user and includes security checks
 */
exports.claimDevFunds = onCall({ 
  enforceAppCheck: false // Set to true in production with App Check
}, async (request) => {
  const { auth } = request;
  
  // Check if user is authenticated
  if (!auth) {
    throw new Error("User must be authenticated to claim dev funds");
  }

  const userId = auth.uid;
  
  try {
    // Get user document reference
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error("User profile not found");
    }

    const userData = userDoc.data();
    
    // Check if user has already claimed dev funds
    if (userData.hasClaimed) {
      throw new Error("Dev funds have already been claimed");
    }

    // Use Firestore transaction to ensure atomic operation
    await db.runTransaction(async (transaction) => {
      const freshUserDoc = await transaction.get(userRef);
      
      if (!freshUserDoc.exists) {
        throw new Error("User document was deleted");
      }
      
      const freshUserData = freshUserDoc.data();
      
      // Double-check claiming status within transaction
      if (freshUserData.hasClaimed) {
        throw new Error("Dev funds have already been claimed");
      }
      
      // Update user balance and claim status
      transaction.update(userRef, {
        balance: (freshUserData.balance || 0) + 100.00,
        hasClaimed: true,
        balanceUpdatedAt: new Date(),
        currency: "fake",
        betaUser: true
      });
      
      // Create transaction record
      const transactionRef = db.collection("transactions").doc();
      transaction.set(transactionRef, {
        userId: userId,
        type: "manual_dev_claim",
        amount: 100.00,
        description: "Manual dev funds claim - $100 fake currency",
        timestamp: new Date(),
        status: "completed"
      });
    });

    logger.info(`Successfully processed dev funds claim for user ${userId}`);
    
    return {
      success: true,
      message: "Successfully claimed $100 fake currency!",
      amount: 100.00
    };
    
  } catch (error) {
    logger.error(`Failed to process dev funds claim for user ${userId}:`, error);
    throw new Error(error.message || "Failed to claim dev funds");
  }
});

/**
 * Health check function for monitoring
 */
exports.healthCheck = onCall(async (request) => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0-beta"
  };
});