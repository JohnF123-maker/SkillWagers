import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import BetaBadge from '../components/BetaBadge';
import FakeCurrencyDisplay from '../components/FakeCurrencyDisplay';
import DailyCoinsReward from '../components/DailyCoinsReward';
import DisplayNameOnceForm from '../components/Profile/DisplayNameOnceForm';
import ChangePasswordWithEmail from '../components/Profile/ChangePasswordWithEmail';
import ProfilePictureUploader from '../components/Profile/ProfilePictureUploader';
import SignOutConfirm from '../components/Profile/SignOutConfirm';
import DailyCoinsCard from '../components/Profile/DailyCoinsCard';
import {
  TrophyIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChartBarIcon,
  PlusIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  or
} from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
  const { userProfile, currentUser } = useAuth();
  const [authLoading, setAuthLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    totalChallenges: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    activeWagers: 0,
    completedWagers: 0,
    totalEarnings: 0,
    rank: 'Unranked'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && userProfile) {
      fetchUserStats();
      fetchRecentActivity();
    }
  }, [currentUser, userProfile, fetchUserStats, fetchRecentActivity]);

  const fetchUserStats = useCallback(async () => {
    if (!currentUser?.uid) {
      console.warn('No current user ID available for fetching stats');
      return;
    }

    try {
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
      const totalChallenges = challenges.length;
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

      setProfileData({
        totalChallenges,
        wins: wonChallenges.length,
        losses: completedWagers - wonChallenges.length,
        winRate: Math.round(winRate * 10) / 10,
        activeWagers,
        completedWagers,
        totalEarnings,
        rank
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, [currentUser?.uid]);

  const fetchRecentActivity = useCallback(async () => {
    if (!currentUser?.uid) {
      console.warn('No current user ID available for fetching recent activity');
      return;
    }

    try {
      const challengesRef = collection(db, 'challenges');
      const recentQuery = query(
        challengesRef,
        where('participants', 'array-contains', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const snapshot = await getDocs(recentQuery);
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If no real data, use placeholder data
      if (activities.length === 0) {
        setRecentActivity([
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
        ]);
      } else {
        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  }, [currentUser?.uid]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Dashboard Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
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

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Coins Reward */}
        <DailyCoinsReward />
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Wagers</p>
                <p className="text-2xl font-bold text-white">{profileData.totalChallenges}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">{profileData.winRate}%</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">{profileData.totalEarnings} SIM</p>
                <p className="text-xs text-gray-500">(FAKE CURRENCY)</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Current Rank</p>
                <p className="text-2xl font-bold text-primaryAccent">{profileData.rank}</p>
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
                  <span className="text-xs text-gray-500">{profileData.activeWagers} active</span>
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
                  <ShoppingBagIcon className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-white">View Challenges</span>
                  <span className="text-xs text-gray-500">Browse wagers</span>
                </Link>
                
                <Link
                  to="/wallet"
                  className="flex flex-col items-center p-4 border border-gray-600 rounded-lg hover:border-purple-400 transition-colors"
                >
                  <UserGroupIcon className="h-8 w-8 text-purple-300 mb-2" />
                  <span className="text-sm font-medium text-white">Wallet</span>
                  <span className="text-xs text-gray-500">Manage funds</span>
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
                  className="text-sm text-primaryAccent hover:text-purple-300 font-medium"
                >
                  View all activity ?
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-purple-900 bg-opacity-30 border border-primaryAccent rounded-lg p-6 mb-8">
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

      {/* Profile Management Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Profile Settings</h2>
          <p className="text-gray-400">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <ProfilePictureUploader />
            </div>

            {/* Display Name */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Display Name</h2>
              <DisplayNameOnceForm />
            </div>

            {/* Daily Coins */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Daily Reward</h2>
              <DailyCoinsCard />
            </div>

            {/* Account Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Account</h2>
              <div className="space-y-4">
                <ChangePasswordWithEmail />
                <button
                  onClick={() => setShowSignOutModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Challenges</p>
                    <p className="text-2xl font-bold">{profileData.totalChallenges}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Wins</p>
                    <p className="text-2xl font-bold text-green-500">{profileData.wins}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Losses</p>
                    <p className="text-2xl font-bold text-red-500">{profileData.losses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <UserIcon className="h-8 w-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold text-blue-500">{profileData.winRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-400">Current Balance</p>
                    <p className="text-3xl font-bold text-green-500">
                      ${userProfile?.balance?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-gray-400">
                        Status: <span className="capitalize">{activity.status}</span>
                      </p>
                      <p className="text-sm text-gray-400">
                        Stake: ${activity.stake}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <SignOutConfirm onClose={() => setShowSignOutModal(false)} />
      )}
    </div>
  );
};

export default Profile;
