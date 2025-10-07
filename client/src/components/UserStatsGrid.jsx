import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  or
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  CurrencyDollarIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const UserStatsGrid = () => {
  const { currentUser, userProfile } = useAuth();
  const [userStats, setUserStats] = useState({
    totalWagers: 0,
    winRate: 0,
    totalEarnings: 0,
    activeWagers: 0,
    completedWagers: 0,
    rank: 'Unranked'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserStats();
    }
  }, [currentUser]);

  const fetchUserStats = async () => {
    if (!currentUser?.uid) {
      console.warn('No current user available for fetching stats');
      return;
    }

    try {
      setLoading(true);
      
      // Get user's challenges (created or participated)
      const q = query(
        collection(db, 'challenges'),
        or(
          where('createdBy', '==', currentUser.uid),
          where('acceptedBy', '==', currentUser.uid)
        )
      );

      const querySnapshot = await getDocs(q);
      const challenges = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate statistics
      const totalWagers = challenges.length;
      const activeWagers = challenges.filter(c => ['open', 'pending_proof', 'disputed'].includes(c.status)).length;
      const completedWagers = challenges.filter(c => ['won', 'lost', 'completed'].includes(c.status)).length;
      
      const wonChallenges = challenges.filter(c => {
        if (c.status === 'completed' || c.status === 'won') {
          // User won if they were creator and winner is creator, or participant and winner is participant
          return (c.createdBy === currentUser.uid && c.winner === c.createdBy) ||
                 (c.acceptedBy === currentUser.uid && c.winner === c.acceptedBy);
        }
        return false;
      });

      const winRate = completedWagers > 0 ? (wonChallenges.length / completedWagers * 100) : 0;
      const totalEarnings = wonChallenges.reduce((sum, challenge) => sum + (challenge.wagerAmount || 0), 0);
      
      // Simple ranking system based on total earnings
      let rank = 'Unranked';
      if (totalEarnings >= 500) rank = 'Gold';
      else if (totalEarnings >= 200) rank = 'Silver';
      else if (totalEarnings >= 50) rank = 'Bronze';

      setUserStats({
        totalWagers,
        winRate: Math.round(winRate * 10) / 10,
        totalEarnings,
        activeWagers,
        completedWagers,
        rank
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Total Wagers</p>
            <p className="text-2xl font-bold text-white">{loading ? '...' : userStats.totalWagers}</p>
          </div>
          <ChartBarIcon className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Win Rate</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '...' : userStats.winRate}%</p>
          </div>
          <TrophyIcon className="h-8 w-8 text-yellow-500" />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Total Earnings</p>
            <p className="text-2xl font-bold text-green-600">{loading ? '...' : userStats.totalEarnings} SIM</p>
            <p className="text-xs text-gray-500">(FAKE CURRENCY)</p>
          </div>
          <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Current Rank</p>
            <p className="text-2xl font-bold text-brand">{loading ? '...' : userStats.rank}</p>
          </div>
          <FireIcon className="h-8 w-8 text-purple-300" />
        </div>
      </div>
    </div>
  );
};

export default UserStatsGrid;
