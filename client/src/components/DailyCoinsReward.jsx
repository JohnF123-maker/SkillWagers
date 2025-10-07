import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { GiftIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DailyCoinsReward = () => {
  const { currentUser, userProfile } = useAuth();
  const [canClaim, setCanClaim] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (currentUser) {
      checkClaimStatus();
    }
  }, [currentUser, checkClaimStatus]);

  const checkClaimStatus = useCallback(async () => {
    if (!currentUser?.uid) {
      console.warn('No current user available for checking claim status');
      return;
    }

    try {
      setLoading(true);
      const dailyRewardRef = doc(db, 'dailyRewards', currentUser.uid);
      const dailyRewardDoc = await getDoc(dailyRewardRef);
      
      if (dailyRewardDoc.exists()) {
        const data = dailyRewardDoc.data();
        const lastClaimTime = data.lastClaimTime?.toDate();
        
        if (lastClaimTime) {
          const now = new Date();
          const timeDiff = now - lastClaimTime;
          const hoursPassed = timeDiff / (1000 * 60 * 60);
          
          if (hoursPassed >= 24) {
            setCanClaim(true);
            setNextClaimTime(null);
          } else {
            setCanClaim(false);
            const nextClaim = new Date(lastClaimTime.getTime() + (24 * 60 * 60 * 1000));
            setNextClaimTime(nextClaim);
          }
        } else {
          setCanClaim(true);
        }
      } else {
        // First time claiming
        setCanClaim(true);
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
      toast.error('Failed to check daily reward status');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  const claimDailyCoins = async () => {
    if (!canClaim || claiming || !currentUser?.uid) return;

    try {
      setClaiming(true);
      const now = new Date();
      
      // Update user's balance
      const userRef = doc(db, 'users', currentUser.uid);
      const currentBalance = userProfile?.betaBalance || 0;
      const newBalance = currentBalance + 100;
      
      await updateDoc(userRef, {
        betaBalance: newBalance
      });

      // Record the claim
      const dailyRewardRef = doc(db, 'dailyRewards', currentUser.uid);
      await setDoc(dailyRewardRef, {
        lastClaimTime: now,
        totalClaimed: (userProfile?.totalDailyClaimed || 0) + 100,
        claimCount: (userProfile?.dailyClaimCount || 0) + 1
      }, { merge: true });

      // Update user profile with daily claim stats
      await updateDoc(userRef, {
        totalDailyClaimed: (userProfile?.totalDailyClaimed || 0) + 100,
        dailyClaimCount: (userProfile?.dailyClaimCount || 0) + 1
      });

      setCanClaim(false);
      const nextClaim = new Date(now.getTime() + (24 * 60 * 60 * 1000));
      setNextClaimTime(nextClaim);

      toast.success('🎉 Claimed 100 SIM! Come back in 24 hours for more!', {
        duration: 4000
      });

    } catch (error) {
      console.error('Error claiming daily coins:', error);
      toast.error('Failed to claim daily coins. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const formatTimeRemaining = (nextClaim) => {
    const now = new Date();
    const timeDiff = nextClaim - now;
    
    if (timeDiff <= 0) {
      checkClaimStatus();
      return null;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (!currentUser || loading) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-900 via-purple-900 to-red-900 bg-opacity-30 border border-yellow-600 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
            <GiftIcon className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-300">Daily Free Coins</h3>
            <p className="text-sm text-yellow-200">
              {canClaim ? 'Claim your daily 100 SIM!' : 'Come back tomorrow for more coins!'}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {canClaim ? (
            <button
              onClick={claimDailyCoins}
              disabled={claiming}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <GiftIcon className="h-4 w-4" />
              <span>{claiming ? 'Claiming...' : 'Claim 100 SIM'}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-yellow-200">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">
                {nextClaimTime ? formatTimeRemaining(nextClaimTime) : 'Loading...'}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress/Stats */}
      <div className="mt-3 pt-3 border-t border-yellow-600 border-opacity-50">
        <div className="flex justify-between text-xs text-yellow-200">
          <span>Total Daily Claims: {userProfile?.dailyClaimCount || 0}</span>
          <span>Total Daily SIM: {userProfile?.totalDailyClaimed || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default DailyCoinsReward;
