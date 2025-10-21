import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const AdminReview = () => {
  const { currentUser, userProfile } = useAuth();
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState(new Set());

  // Simple admin check - you can replace this with your admin logic
  const isAdmin = userProfile?.email === 'admin@skillwagers.com' || 
                  userProfile?.role === 'admin' ||
                  process.env.REACT_APP_ADMIN_EMAILS?.includes(userProfile?.email);

  useEffect(() => {
    if (!currentUser || !isAdmin) {
      setLoading(false);
      return;
    }

    // Listen to pending challenges
    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const challenges = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPendingChallenges(challenges);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching pending challenges:', error);
      toast.error('Failed to load pending challenges');
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, isAdmin]);

  const handleApprove = async (challengeId) => {
    setProcessingIds(prev => new Set(prev).add(challengeId));
    
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        status: 'approved',
        approvedAt: serverTimestamp(),
        reviewerUid: currentUser.uid,
        reviewerDisplayName: userProfile?.displayName || 'Admin'
      });
      
      toast.success('Challenge approved!');
    } catch (error) {
      console.error('Error approving challenge:', error);
      toast.error('Failed to approve challenge');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(challengeId);
        return newSet;
      });
    }
  };

  const handleReject = async (challengeId, reviewNotes = '') => {
    const notes = reviewNotes || prompt('Enter rejection reason (optional):') || 'Rejected by moderator';
    
    setProcessingIds(prev => new Set(prev).add(challengeId));
    
    try {
      const challengeRef = doc(db, 'challenges', challengeId);
      await updateDoc(challengeRef, {
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        reviewerUid: currentUser.uid,
        reviewerDisplayName: userProfile?.displayName || 'Admin',
        reviewNotes: notes
      });
      
      toast.success('Challenge rejected');
    } catch (error) {
      console.error('Error rejecting challenge:', error);
      toast.error('Failed to reject challenge');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(challengeId);
        return newSet;
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Please log in to access admin features.</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">You don't have admin access.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading pending challenges...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Challenge Review</h1>
        
        {pendingChallenges.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-300">No pending challenges</h3>
            <p className="mt-1 text-sm text-gray-500">All challenges have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-dark-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-gray-300 mb-2">{challenge.description}</p>
                    <div className="text-sm text-gray-400">
                      <p>Category: {challenge.category}</p>
                      <p>Wager: {challenge.wagerAmount} SIM</p>
                      <p>Created by: {challenge.createdByDisplayName}</p>
                      <p>Created: {challenge.createdAt?.toDate?.()?.toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(challenge.id)}
                      disabled={processingIds.has(challenge.id)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      {processingIds.has(challenge.id) ? 'Approving...' : 'Approve'}
                    </button>
                    
                    <button
                      onClick={() => handleReject(challenge.id)}
                      disabled={processingIds.has(challenge.id)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <XCircleIcon className="h-4 w-4" />
                      {processingIds.has(challenge.id) ? 'Rejecting...' : 'Reject'}
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Rules:</h4>
                  <p className="text-sm text-gray-400">{challenge.rules}</p>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Proof Requirements:</h4>
                  <p className="text-sm text-gray-400">{challenge.proofRequirements}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReview;