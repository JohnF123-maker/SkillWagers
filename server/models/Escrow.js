const { db } = require('../config/firebase');

class Escrow {
  constructor(escrowData) {
    this.id = escrowData.id;
    this.challengeId = escrowData.challengeId;
    this.creatorId = escrowData.creatorId;
    this.acceptorId = escrowData.acceptorId;
    this.creatorStake = escrowData.creatorStake;
    this.acceptorStake = escrowData.acceptorStake;
    this.platformFee = escrowData.platformFee;
    this.totalAmount = escrowData.totalAmount;
    this.status = escrowData.status || 'pending'; // pending, locked, released, refunded
    this.createdAt = escrowData.createdAt || new Date();
    this.releasedAt = escrowData.releasedAt;
    this.releasedTo = escrowData.releasedTo;
    this.adminNotes = escrowData.adminNotes;
  }

  // Save escrow to Firestore
  async save() {
    try {
      if (this.id) {
        // Update existing escrow
        await db.collection('escrows').doc(this.id).update({
          ...this.toObject(),
          updatedAt: new Date()
        });
      } else {
        // Create new escrow
        const docRef = await db.collection('escrows').add({
          ...this.toObject(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        this.id = docRef.id;
      }
      return this;
    } catch (error) {
      console.error('Error saving escrow:', error);
      throw error;
    }
  }

  // Convert to plain object
  toObject() {
    return {
      challengeId: this.challengeId,
      creatorId: this.creatorId,
      acceptorId: this.acceptorId,
      creatorStake: this.creatorStake,
      acceptorStake: this.acceptorStake,
      platformFee: this.platformFee,
      totalAmount: this.totalAmount,
      status: this.status,
      createdAt: this.createdAt,
      releasedAt: this.releasedAt,
      releasedTo: this.releasedTo,
      adminNotes: this.adminNotes
    };
  }

  // Create escrow for challenge
  static async createForChallenge(challengeId, creatorId, acceptorId, stake) {
    try {
      const platformFee = stake * 0.05; // 5% platform fee
      const totalAmount = (stake * 2) + platformFee;
      
      const escrow = new Escrow({
        challengeId,
        creatorId,
        acceptorId,
        creatorStake: stake,
        acceptorStake: stake,
        platformFee,
        totalAmount,
        status: 'pending'
      });
      
      await escrow.save();
      return escrow;
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  }

  // Find escrow by challenge ID
  static async findByChallengeId(challengeId) {
    try {
      const snapshot = await db.collection('escrows')
        .where('challengeId', '==', challengeId)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return new Escrow({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding escrow:', error);
      throw error;
    }
  }

  // Lock escrow (both participants have staked)
  async lock() {
    try {
      if (this.status !== 'pending') {
        throw new Error('Escrow is not in pending status');
      }
      
      this.status = 'locked';
      await this.save();
      return this;
    } catch (error) {
      console.error('Error locking escrow:', error);
      throw error;
    }
  }

  // Release escrow to winner
  async release(winnerId, adminId = null) {
    try {
      if (this.status !== 'locked') {
        throw new Error('Escrow is not locked');
      }
      
      if (winnerId !== this.creatorId && winnerId !== this.acceptorId) {
        throw new Error('Winner must be one of the participants');
      }
      
      this.status = 'released';
      this.releasedTo = winnerId;
      this.releasedAt = new Date();
      
      if (adminId) {
        this.adminNotes = `Released by admin: ${adminId}`;
      }
      
      await this.save();
      
      // Calculate payout (total stakes minus platform fee)
      const winnerPayout = this.creatorStake + this.acceptorStake;
      
      return {
        winnerId,
        amount: winnerPayout,
        platformFee: this.platformFee
      };
    } catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  }

  // Refund escrow (split between participants)
  async refund(adminId = null) {
    try {
      if (this.status !== 'locked' && this.status !== 'pending') {
        throw new Error('Escrow cannot be refunded in current status');
      }
      
      this.status = 'refunded';
      this.releasedAt = new Date();
      
      if (adminId) {
        this.adminNotes = `Refunded by admin: ${adminId}`;
      }
      
      await this.save();
      
      return {
        creatorRefund: this.creatorStake,
        acceptorRefund: this.acceptorStake,
        platformFee: 0 // No fee on refunds
      };
    } catch (error) {
      console.error('Error refunding escrow:', error);
      throw error;
    }
  }

  // Get all escrows requiring admin action
  static async findForAdminReview() {
    try {
      const snapshot = await db.collection('escrows')
        .where('status', 'in', ['locked'])
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => new Escrow({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding escrows for admin review:', error);
      throw error;
    }
  }

  // Get escrow statistics
  static async getStats() {
    try {
      const [totalEscrows, lockedEscrows, releasedEscrows] = await Promise.all([
        db.collection('escrows').get(),
        db.collection('escrows').where('status', '==', 'locked').get(),
        db.collection('escrows').where('status', '==', 'released').get()
      ]);
      
      let totalVolume = 0;
      let totalFees = 0;
      
      releasedEscrows.docs.forEach(doc => {
        const data = doc.data();
        totalVolume += data.totalAmount || 0;
        totalFees += data.platformFee || 0;
      });
      
      return {
        totalEscrows: totalEscrows.size,
        lockedEscrows: lockedEscrows.size,
        releasedEscrows: releasedEscrows.size,
        totalVolume,
        totalFees
      };
    } catch (error) {
      console.error('Error getting escrow stats:', error);
      throw error;
    }
  }
}

module.exports = Escrow;