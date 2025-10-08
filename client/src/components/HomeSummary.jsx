import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BetaBadge from './BetaBadge';
import FakeCurrencyDisplay from './FakeCurrencyDisplay';
import DailyCoinsReward from './DailyCoinsReward';
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
  PlusIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const HomeSummary = () => {
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

  const fetchUserStats = async () => {
    if (!currentUser) return;

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

  useEffect(() => {
    fetchUserStats();
  }, [currentUser]);

  const recentActivity = [
    {
      id: 1,
      type: 'wager_won',
      title: 'Push-up Challenge Won',
      amount: '+$25.00',
      time: '2 hours ago',
      icon: TrophyIcon,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'wager_created',
      title: 'Running Challenge Created',
      amount: '-$15.00',
      time: '1 day ago',
      icon: PlusIcon,
      color: 'text-blue-500'
    },
    {
      id: 3,
      type: 'wager_joined',
      title: 'Meditation Challenge Joined',
      amount: '-$10.00',
      time: '2 days ago',
      icon: UserGroupIcon,
      color: 'text-purple-500'
    }
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center space-x-3">
                Welcome back, {userProfile?.displayName || currentUser.email?.split('@')[0]}
                <BetaBadge size="sm" />
              </h1>
              <p className="text-gray-300 mt-1">Ready to take on some challenges?</p>
            </div>
            <FakeCurrencyDisplay className="bg-gray-700 px-4 py-2 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Daily Coins Reward */}
        <DailyCoinsReward />
        
        {/* Stats Grid */}
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

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-600">
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/wagers"
                  className="flex flex-col items-center p-4 border border-gray-600 rounded-lg hover:border-purple-400 transition-colors"
                >
                  <ChartBarIcon className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-white">My Wagers</span>
                  <span className="text-xs text-gray-500">{loading ? '...' : userStats.activeWagers} active</span>
                </Link>
                
                <Link
                  to="/create-challenge"
                  className="flex flex-col items-center p-4 border border-gray-600 rounded-lg hover:border-purple-400 transition-colors"
                >
                  <PlusIcon className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-white">Create Wager</span>
                  <span className="text-xs text-gray-500">Start earning</span>
                </Link>
                
                <Link
                  to="/wagering"
                  className="flex flex-col items-center p-4 border border-gray-600 rounded-lg hover:border-purple-400 transition-colors"
                >
                  <ShoppingBagIcon className="h-8 w-8 text-brand mb-2" />
                  <span className="text-sm font-medium text-white">View Challenges</span>
                  <span className="text-xs text-gray-500">Browse wagers</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex flex-col items-center p-4 border border-gray-600 rounded-lg hover:border-purple-400 transition-colors"
                >
                  <UserGroupIcon className="h-8 w-8 text-brand mb-2" />
                  <span className="text-sm font-medium text-white">Profile</span>
                  <span className="text-xs text-gray-500">View progress</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg shadow border border-gray-700">
            <div className="p-6 border-b border-gray-600">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full bg-gray-700`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500 flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                      <div className="text-sm font-semibold">
                        <span className={activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                          {activity.amount}
                        </span>
                        <div className="text-xs text-gray-500">(FAKE)</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-600">
                <Link
                  to="/wagers"
                  className="text-sm text-brand hover:text-purple-300 font-medium"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-purple-900 bg-opacity-30 border border-brand rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-2">
            <BetaBadge size="sm" />
            <h3 className="text-lg font-semibold text-purple-200">Beta Testing Mode</h3>
          </div>
          <p className="text-sm text-purple-100">
            You're using SkillWagers Beta with fake currency for testing purposes. All wagers, earnings, and statistics are simulated. 
            Help us improve by reporting any issues you encounter!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeSummary;
