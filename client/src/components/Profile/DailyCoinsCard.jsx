import React, { useState, useEffect } from 'react';
import { doc, getDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { GiftIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DailyCoinsCard = ({ currentUser, userProfile, refreshProfile }) => {
  const [loading, setLoading] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    if (userProfile?.lastDailyClaim) {
      const now = new Date();
      const lastClaim = userProfile.lastDailyClaim.toDate();
      const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
      
      if (now >= nextClaim) {
        setCanClaim(true);
        setTimeUntilNext('');
      } else {
        setCanClaim(false);
        const diff = nextClaim - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilNext(`${hours}h ${minutes}m`);
      }
    } else {
      setCanClaim(true);
    }
  }, [userProfile]);

  const handleClaim = async () => {
    if (!canClaim) return;

    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await transaction.get(userDocRef);
        
        if (!userDoc.exists()) {
          throw new Error('User document not found');
        }

        const userData = userDoc.data();
        const now = new Date();
        
        // Verify 24h eligibility
        if (userData.lastDailyClaim) {
          const lastClaim = userData.lastDailyClaim.toDate();
          const timeDiff = now - lastClaim;
          const hoursDiff = timeDiff / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            throw new Error('Must wait 24 hours between claims');
          }
        }

        // Update balance and claim time
        transaction.update(userDocRef, {
          balanceCoins: (userData.balanceCoins || 0) + 100,
          lastDailyClaim: serverTimestamp()
        });
      });

      await refreshProfile();
      setCanClaim(false);
      toast.success('100 coins claimed successfully!');
    } catch (error) {
      console.error('Error claiming daily coins:', error);
      toast.error(error.message || 'Failed to claim coins');
    } finally {
      setLoading(false);
    }
  };

  const balance = userProfile?.balanceCoins || 0;

  return (
    <div className="bg-gradient-to-r from-yellow-900 via-orange-900 to-red-900 bg-opacity-30 border border-yellow-600 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
            <GiftIcon className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-300">Daily Free Coins</h3>
            <p className="text-sm text-yellow-200">
              Current Balance: {balance} SIM
            </p>
          </div>
        </div>
        <div className="text-right">
          {canClaim ? (
            <button
              onClick={handleClaim}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <GiftIcon className="h-4 w-4" />
              <span>{loading ? 'Claiming...' : 'Claim 100 Coins'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-200">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">
                Available in {timeUntilNext}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-yellow-600 border-opacity-50">
        <div className="flex justify-between text-xs text-yellow-200">
          <span>24-hour cooldown</span>
          <span>Beta currency - no real value</span>
        </div>
      </div>
    </div>
  );
};

export default DailyCoinsCard;