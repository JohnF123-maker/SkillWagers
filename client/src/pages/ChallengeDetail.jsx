import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  collection,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import {
  TrophyIcon,
  CurrencyDollarIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [proofText, setProofText] = useState('');
  const [showProofModal, setShowProofModal] = useState(false);

  const fetchChallenge = useCallback(async () => {
    try {
      const challengeDoc = await getDoc(doc(db, 'challenges', id));
      if (challengeDoc.exists()) {
        setChallenge({ id: challengeDoc.id, ...challengeDoc.data() });
      } else {
        toast.error('Challenge not found');
        navigate('/marketplace');
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast.error('Failed to load challenge');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleAcceptChallenge = async () => {
    if (!currentUser || !userProfile) {
      toast.error('You must be logged in to accept challenges');
      return;
    }

    if (!userProfile.ageVerified) {
      toast.error('You must verify your age before accepting challenges');
      return;
    }

    if (challenge.stakeAmount > (userProfile.betaBalance || 0)) {
      toast.error('Insufficient balance to accept this challenge');
      return;
    }

    try {
      setActionLoading(true);
      
      const challengeRef = doc(db, 'challenges', id);
      await updateDoc(challengeRef, {
        status: 'accepted',
        acceptorId: currentUser.uid,
        acceptorName: userProfile.displayName || currentUser.displayName,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Deduct stake from acceptor's balance
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        betaBalance: increment(-challenge.stakeAmount)
      });

      toast.success('Challenge accepted! Good luck!');
      fetchChallenge();
    } catch (error) {
      console.error('Error accepting challenge:', error);
      toast.error('Failed to accept challenge');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitProof = async () => {
    if (!proofText.trim()) {
      toast.error('Please provide proof description');
      return;
    }

    try {
      setActionLoading(true);
      
      const challengeRef = doc(db, 'challenges', id);
      await updateDoc(challengeRef, {
        proofSubmitted: true,
        proofText: proofText,
        proofSubmittedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setShowProofModal(false);
      setProofText('');
      toast.success('Proof submitted successfully!');
      fetchChallenge();
    } catch (error) {
      console.error('Error submitting proof:', error);
      toast.error('Failed to submit proof');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    try {
      setActionLoading(true);
      
      // Create dispute document
      await addDoc(collection(db, 'disputes'), {
        challengeId: id,
        challengeTitle: challenge.title,
        creatorId: challenge.creatorId,
        acceptorId: challenge.acceptorId,
        disputeRaisedBy: currentUser.uid,
        status: 'open',
        createdAt: serverTimestamp()
      });

      // Update challenge status
      const challengeRef = doc(db, 'challenges', id);
      await updateDoc(challengeRef, {
        status: 'disputed',
        disputeRaised: true,
        disputeRaisedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success('Dispute raised successfully');
      fetchChallenge();
    } catch (error) {
      console.error('Error raising dispute:', error);
      toast.error('Failed to raise dispute');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      'open': 'bg-blue-500 bg-opacity-20 text-blue-400',
      'accepted': 'bg-yellow-500 bg-opacity-20 text-yellow-400',
      'completed': 'bg-green-500 bg-opacity-20 text-green-400',
      'disputed': 'bg-red-500 bg-opacity-20 text-red-400',
      'cancelled': 'bg-gray-500 bg-opacity-20 text-gray-400'
    };
    return badges[status] || badges.open;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-gradient">
            <div className="animate-pulse">
              <div className="h-8 bg-dark-600 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-dark-600 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-dark-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-gradient">
            <h1 className="text-2xl font-bold gaming-text mb-6">Challenge Not Found</h1>
            <p className="text-gray-300">The challenge you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const isCreator = currentUser?.uid === challenge.creatorId;
  const isAcceptor = currentUser?.uid === challenge.acceptorId;
  const canAccept = challenge.status === 'open' && !isCreator && currentUser;
  const canSubmitProof = challenge.status === 'accepted' && isAcceptor && !challenge.proofSubmitted;
  const canRaiseDispute = challenge.status === 'accepted' && challenge.proofSubmitted && !challenge.disputeRaised;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-gradient">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold gaming-text mb-2">{challenge.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(challenge.status)}`}>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </span>
                <span className="text-gray-400 text-sm">Game: {challenge.game}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-primary-400 mb-1">
                <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                <span className="text-lg font-bold">{challenge.stakeAmount} SIM</span>
              </div>
              <p className="text-xs text-gray-400">Stake Amount</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Challenge Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="text-gray-300">{challenge.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rules</p>
                  <p className="text-gray-300">{challenge.rules}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Proof Requirements</p>
                  <p className="text-gray-300">{challenge.proofRequirements}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Participants</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-primary-400 mr-2" />
                  <div>
                    <p className="text-white font-medium">Creator: {challenge.creatorName}</p>
                    <p className="text-xs text-gray-400">Created {formatDate(challenge.createdAt)}</p>
                  </div>
                </div>
                
                {challenge.acceptorName && (
                  <div className="flex items-center">
                    <TrophyIcon className="h-5 w-5 text-accent-400 mr-2" />
                    <div>
                      <p className="text-white font-medium">Acceptor: {challenge.acceptorName}</p>
                      <p className="text-xs text-gray-400">Accepted {formatDate(challenge.acceptedAt)}</p>
                    </div>
                  </div>
                )}
              </div>

              {challenge.proofSubmitted && (
                <div className="mt-4 p-3 bg-dark-700 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Proof Submitted</p>
                  <p className="text-gray-300 text-sm">{challenge.proofText}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted {formatDate(challenge.proofSubmittedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {canAccept && (
              <button
                onClick={handleAcceptChallenge}
                disabled={actionLoading}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {actionLoading ? 'Accepting...' : 'Accept Challenge'}
              </button>
            )}

            {canSubmitProof && (
              <button
                onClick={() => setShowProofModal(true)}
                className="bg-success-600 hover:bg-success-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Submit Proof
              </button>
            )}

            {canRaiseDispute && (isCreator || isAcceptor) && (
              <button
                onClick={handleRaiseDispute}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                {actionLoading ? 'Raising Dispute...' : 'Raise Dispute'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Proof Submission Modal */}
      {showProofModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-dark-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">Submit Proof</h3>
            <textarea
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              placeholder="Describe your proof of completion..."
              rows={4}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitProof}
                disabled={actionLoading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {actionLoading ? 'Submitting...' : 'Submit Proof'}
              </button>
              <button
                onClick={() => setShowProofModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeDetail;
