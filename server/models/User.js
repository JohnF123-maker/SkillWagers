const { db } = require('../config/firebase');

class User {
  constructor(userData) {
    this.uid = userData.uid;
    this.email = userData.email;
    this.displayName = userData.displayName;
    this.photoURL = userData.photoURL;
    this.createdAt = userData.createdAt || new Date();
    this.balance = userData.balance || 0;
    this.ageVerified = userData.ageVerified || false;
    this.status = userData.status || 'active'; // active, suspended, banned
    this.totalChallenges = userData.totalChallenges || 0;
    this.totalWins = userData.totalWins || 0;
    this.totalEarnings = userData.totalEarnings || 0;
    this.rating = userData.rating || 1000;
    this.preferences = userData.preferences || {};
  }

  // Save user to Firestore
  async save() {
    try {
      await db.collection('users').doc(this.uid).set({
        uid: this.uid,
        email: this.email,
        displayName: this.displayName,
        photoURL: this.photoURL,
        createdAt: this.createdAt,
        balance: this.balance,
        ageVerified: this.ageVerified,
        status: this.status,
        totalChallenges: this.totalChallenges,
        totalWins: this.totalWins,
        totalEarnings: this.totalEarnings,
        rating: this.rating,
        preferences: this.preferences,
        updatedAt: new Date()
      });
      return this;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  // Get user by UID
  static async findByUid(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      if (!doc.exists) {
        return null;
      }
      return new User(doc.data());
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // Update user balance
  async updateBalance(amount, type = 'add') {
    try {
      const userRef = db.collection('users').doc(this.uid);
      
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error('User not found');
        }
        
        const currentBalance = userDoc.data().balance || 0;
        let newBalance;
        
        if (type === 'add') {
          newBalance = currentBalance + amount;
        } else if (type === 'subtract') {
          if (currentBalance < amount) {
            throw new Error('Insufficient balance');
          }
          newBalance = currentBalance - amount;
        } else {
          newBalance = amount; // set
        }
        
        transaction.update(userRef, {
          balance: newBalance,
          updatedAt: new Date()
        });
        
        this.balance = newBalance;
      });
      
      return this.balance;
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error;
    }
  }

  // Get user's transaction history
  async getTransactionHistory(limit = 10) {
    try {
      const snapshot = await db.collection('transactions')
        .where('userId', '==', this.uid)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  }

  // Get user's challenge history
  async getChallengeHistory(limit = 10) {
    try {
      const snapshot = await db.collection('challenges')
        .where('participants', 'array-contains', this.uid)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting challenge history:', error);
      throw error;
    }
  }

  // Update user statistics
  async updateStats(challengeResult) {
    try {
      const userRef = db.collection('users').doc(this.uid);
      
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error('User not found');
        }
        
        const userData = userDoc.data();
        const updates = {
          totalChallenges: (userData.totalChallenges || 0) + 1,
          updatedAt: new Date()
        };
        
        if (challengeResult.won) {
          updates.totalWins = (userData.totalWins || 0) + 1;
          updates.totalEarnings = (userData.totalEarnings || 0) + challengeResult.earnings;
          updates.rating = Math.min(3000, (userData.rating || 1000) + 25);
        } else {
          updates.rating = Math.max(100, (userData.rating || 1000) - 15);
        }
        
        transaction.update(userRef, updates);
        
        // Update local instance
        Object.assign(this, updates);
      });
      
      return this;
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }
}

module.exports = User;