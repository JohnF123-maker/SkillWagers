const { db } = require('../config/firebase');

class Challenge {
  constructor(challengeData) {
    this.id = challengeData.id;
    this.creatorId = challengeData.creatorId;
    this.acceptorId = challengeData.acceptorId;
    this.game = challengeData.game;
    this.gameMode = challengeData.gameMode;
    this.stake = challengeData.stake;
    this.platformFee = challengeData.platformFee || (challengeData.stake * 0.05);
    this.totalPot = challengeData.totalPot || (challengeData.stake * 2);
    this.status = challengeData.status || 'open'; // open, accepted, in_progress, completed, disputed, cancelled
    this.rules = challengeData.rules;
    this.proofRequirements = challengeData.proofRequirements;
    this.timeLimit = challengeData.timeLimit; // in hours
    this.createdAt = challengeData.createdAt || new Date();
    this.acceptedAt = challengeData.acceptedAt;
    this.completedAt = challengeData.completedAt;
    this.winnerId = challengeData.winnerId;
    this.proofSubmissions = challengeData.proofSubmissions || [];
    this.disputeReason = challengeData.disputeReason;
    this.adminNotes = challengeData.adminNotes;
    this.escrowId = challengeData.escrowId;
  }

  // Save challenge to Firestore
  async save() {
    try {
      if (this.id) {
        // Update existing challenge
        await db.collection('challenges').doc(this.id).update({
          ...this.toObject(),
          updatedAt: new Date()
        });
      } else {
        // Create new challenge
        const docRef = await db.collection('challenges').add({
          ...this.toObject(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        this.id = docRef.id;
      }
      return this;
    } catch (error) {
      console.error('Error saving challenge:', error);
      throw error;
    }
  }

  // Convert to plain object
  toObject() {
    return {
      creatorId: this.creatorId,
      acceptorId: this.acceptorId,
      game: this.game,
      gameMode: this.gameMode,
      stake: this.stake,
      platformFee: this.platformFee,
      totalPot: this.totalPot,
      status: this.status,
      rules: this.rules,
      proofRequirements: this.proofRequirements,
      timeLimit: this.timeLimit,
      createdAt: this.createdAt,
      acceptedAt: this.acceptedAt,
      completedAt: this.completedAt,
      winnerId: this.winnerId,
      proofSubmissions: this.proofSubmissions,
      disputeReason: this.disputeReason,
      adminNotes: this.adminNotes,
      escrowId: this.escrowId
    };
  }

  // Get challenge by ID
  static async findById(id) {
    try {
      const doc = await db.collection('challenges').doc(id).get();
      if (!doc.exists) {
        return null;
      }
      return new Challenge({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding challenge:', error);
      throw error;
    }
  }

  // Get open challenges
  static async findOpen(limit = 20, game = null) {
    try {
      let query = db.collection('challenges')
        .where('status', '==', 'open')
        .orderBy('createdAt', 'desc')
        .limit(limit);
      
      if (game) {
        query = query.where('game', '==', game);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => new Challenge({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding open challenges:', error);
      throw error;
    }
  }

  // Accept challenge
  async accept(acceptorId) {
    try {
      if (this.status !== 'open') {
        throw new Error('Challenge is not available for acceptance');
      }
      
      if (this.creatorId === acceptorId) {
        throw new Error('Cannot accept your own challenge');
      }
      
      this.acceptorId = acceptorId;
      this.status = 'accepted';
      this.acceptedAt = new Date();
      
      await this.save();
      return this;
    } catch (error) {
      console.error('Error accepting challenge:', error);
      throw error;
    }
  }

  // Submit proof
  async submitProof(userId, proof) {
    try {
      if (!this.acceptorId || this.status !== 'accepted') {
        throw new Error('Challenge is not in progress');
      }
      
      if (userId !== this.creatorId && userId !== this.acceptorId) {
        throw new Error('Only participants can submit proof');
      }
      
      // Check if user already submitted proof
      const existingProof = this.proofSubmissions.find(p => p.userId === userId);
      if (existingProof) {
        throw new Error('Proof already submitted');
      }
      
      const proofSubmission = {
        userId,
        proof,
        submittedAt: new Date(),
        verified: false
      };
      
      this.proofSubmissions.push(proofSubmission);
      
      // If both participants have submitted proof, move to review
      if (this.proofSubmissions.length === 2) {
        this.status = 'under_review';
      }
      
      await this.save();
      return this;
    } catch (error) {
      console.error('Error submitting proof:', error);
      throw error;
    }
  }

  // Complete challenge (admin or automatic)
  async complete(winnerId, adminId = null) {
    try {
      if (this.status !== 'accepted' && this.status !== 'under_review') {
        throw new Error('Challenge cannot be completed in current status');
      }
      
      if (winnerId !== this.creatorId && winnerId !== this.acceptorId) {
        throw new Error('Winner must be one of the participants');
      }
      
      this.winnerId = winnerId;
      this.status = 'completed';
      this.completedAt = new Date();
      
      if (adminId) {
        this.adminNotes = `Completed by admin: ${adminId}`;
      }
      
      await this.save();
      return this;
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }

  // Dispute challenge
  async dispute(userId, reason) {
    try {
      if (this.status !== 'accepted' && this.status !== 'under_review') {
        throw new Error('Challenge cannot be disputed in current status');
      }
      
      if (userId !== this.creatorId && userId !== this.acceptorId) {
        throw new Error('Only participants can dispute');
      }
      
      this.status = 'disputed';
      this.disputeReason = reason;
      
      await this.save();
      return this;
    } catch (error) {
      console.error('Error disputing challenge:', error);
      throw error;
    }
  }

  // Cancel challenge
  async cancel(userId) {
    try {
      if (this.status !== 'open') {
        throw new Error('Can only cancel open challenges');
      }
      
      if (userId !== this.creatorId) {
        throw new Error('Only creator can cancel challenge');
      }
      
      this.status = 'cancelled';
      
      await this.save();
      return this;
    } catch (error) {
      console.error('Error cancelling challenge:', error);
      throw error;
    }
  }

  // Get challenges requiring admin review
  static async findForAdminReview() {
    try {
      const snapshot = await db.collection('challenges')
        .where('status', 'in', ['under_review', 'disputed'])
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => new Challenge({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding challenges for admin review:', error);
      throw error;
    }
  }
}

module.exports = Challenge;