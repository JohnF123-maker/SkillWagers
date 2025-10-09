import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { GiftIcon, ClockIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DailyCoinsReward = () => {
  const { currentUser, userProfile } = useAuth();
  const [canClaim, setCanClaim] = useState(false);
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  const checkClaimStatus = useCallback(async () => {
    if (!currentUser?.uid || !userProfile) {
      return;
    }

    try {
      setLoading(true);
      
      const lastClaimDate = userProfile.lastDailyRewardClaim?.toDate();
      
      if (lastClaimDate) {
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastClaim = new Date(lastClaimDate);
        lastClaim.setHours(0, 0, 0, 0);
        
        if (lastClaim.getTime() === today.getTime()) {
          // Already claimed today
          setCanClaim(false);
          const nextClaim = new Date(today);
          nextClaim.setDate(nextClaim.getDate() + 1);
          setNextClaimTime(nextClaim);
        } else {
          // Can claim today
          setCanClaim(true);
          setNextClaimTime(null);
        }
      } else {
        // First time claiming
        setCanClaim(true);
        setNextClaimTime(null);
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
      toast.error('Failed to check daily reward status');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, userProfile]);

  useEffect(() => {
    if (currentUser && userProfile) {
      checkClaimStatus();
    }
  }, [currentUser, userProfile, checkClaimStatus]);

  const claimDailyCoins = async () => {
    if (!canClaim || claiming || !currentUser?.uid) return;

    try {
      setClaiming(true);
      
      // Call Cloud Function to claim daily reward
      const claimDailyReward = httpsCallable(functions, 'claimDailyReward');
      const result = await claimDailyReward({});
      
      if (result.data.success) {
        setCanClaim(false);
        const nextClaim = new Date();
        nextClaim.setDate(nextClaim.getDate() + 1);
        nextClaim.setHours(0, 0, 0, 0);
        setNextClaimTime(nextClaim);

        toast.success(result.data.message, { duration: 4000 });
      } else {
        throw new Error(result.data.message || 'Failed to claim daily reward');
      }

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
