import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from './AuthContext';

const BalanceBadge = () => {
  const { currentUser, userProfile, claimDailyReward } = useAuth();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [timeUntilReward, setTimeUntilReward] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const panelRef = useRef(null);

  // Check reward eligibility
  useEffect(() => {
    if (!userProfile?.lastDailyRewardAt) {
      setIsEligible(true);
      setTimeUntilReward(null);
      return;
    }

    const checkEligibility = () => {
      const lastReward = userProfile.lastDailyRewardAt.toDate();
      const now = new Date();
      const timeDiff = now - lastReward;
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (timeDiff >= twentyFourHours) {
        setIsEligible(true);
        setTimeUntilReward(null);
      } else {
        setIsEligible(false);
        const remaining = twentyFourHours - timeDiff;
        setTimeUntilReward(remaining);
      }
    };

    checkEligibility();
    const interval = setInterval(checkEligibility, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userProfile?.lastDailyRewardAt]);

  // Handle click outside panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTimeRemaining = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleClaimReward = async () => {
    if (!isEligible || !currentUser || isClaimingReward) return;

    setIsClaimingReward(true);
    try {
      await claimDailyReward();
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert(error.message || 'Failed to claim reward. Please try again.');
    } finally {
      setIsClaimingReward(false);
    }
  };

  if (!currentUser) return null;

  const balance = userProfile?.betaBalance || 0;

  return (
    <div className="relative" ref={panelRef}>
      <div 
        className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 hover:border-primaryAccent transition-colors cursor-pointer"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        <span className="text-yellow-400 text-sm">🪙</span>
        <span className="text-white font-medium text-sm">{balance.toLocaleString()}</span>
        <button
          className={`p-1 rounded-full transition-colors ${
            isEligible 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isEligible}
          title={isEligible ? 'Claim daily reward' : 'Daily reward not available yet'}
        >
          <PlusIcon className="w-3 h-3" />
        </button>
      </div>

      {isPanelOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-2">Daily Reward</div>
            <div className="text-yellow-400 text-2xl mb-3">🪙 +100</div>
            
            {isEligible ? (
              <div>
                <p className="text-gray-300 text-sm mb-4">
                  You can claim your daily reward now!
                </p>
                <button
                  onClick={handleClaimReward}
                  disabled={isClaimingReward}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {isClaimingReward ? 'Claiming...' : 'Claim Reward'}
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-300 text-sm mb-2">
                  Next reward available in:
                </p>
                <div className="text-primaryAccent font-mono text-lg mb-4">
                  {timeUntilReward ? formatTimeRemaining(timeUntilReward) : 'Calculating...'}
                </div>
                <button
                  disabled
                  className="w-full bg-gray-600 text-gray-400 font-medium py-2 px-4 rounded-lg cursor-not-allowed"
                >
                  Reward Claimed
                </button>
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-400">
                💡 Daily rewards reset every 24 hours. Come back tomorrow for another +100 coins!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceBadge;
