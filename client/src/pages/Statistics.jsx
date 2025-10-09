import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { 
  TrophyIcon,
  ChartBarIcon,
  FireIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon
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

const Statistics = () => {
  const { currentUser } = useAuth();
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

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchProfileData = async () => {
      try {
        // Fetch user's challenges
        const challengesQuery = query(
          collection(db, 'challenges'),
          or(
            where('creatorId', '==', currentUser.uid),
            where('acceptorId', '==', currentUser.uid)
          ),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        const challengesSnapshot = await getDocs(challengesQuery);
        const challenges = challengesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate stats
        const totalChallenges = challenges.length;
        const completedChallenges = challenges.filter(c => c.status === 'completed');
        const wins = completedChallenges.filter(c => c.winnerId === currentUser.uid).length;
        const losses = completedChallenges.length - wins;
        const winRate = completedChallenges.length > 0 ? Math.round((wins / completedChallenges.length) * 100) : 0;
        const activeWagers = challenges.filter(c => ['accepted', 'pending_proof', 'in_dispute'].includes(c.status)).length;
        const totalEarnings = completedChallenges
          .filter(c => c.winnerId === currentUser.uid)
          .reduce((sum, c) => sum + (c.wagerAmount || 0), 0);

        setProfileData({
          totalChallenges,
          wins,
          losses,
          winRate,
          activeWagers,
          completedWagers: completedChallenges.length,
          totalEarnings,
          rank: winRate >= 80 ? 'Expert' : winRate >= 60 ? 'Advanced' : winRate >= 40 ? 'Intermediate' : winRate >= 20 ? 'Beginner' : 'Rookie'
        });

        // Recent activity (last 10 challenges)
        setRecentActivity(challenges.slice(0, 10));

      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Please log in to view statistics</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Statistics & Performance
          </h1>
          <p className="text-gray-400">
            Track your performance and gaming statistics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500 bg-opacity-20">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Challenges</p>
                <p className="text-2xl font-bold text-white">{profileData.totalChallenges}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500 bg-opacity-20">
                <TrophyIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-white">{profileData.winRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-500 bg-opacity-20">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Earnings</p>
                <p className="text-2xl font-bold text-white">{profileData.totalEarnings} SIM</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500 bg-opacity-20">
                <FireIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Rank</p>
                <p className="text-2xl font-bold text-white">{profileData.rank}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Breakdown */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Performance Breakdown
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wins</span>
                <span className="text-green-400 font-semibold">{profileData.wins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Losses</span>
                <span className="text-red-400 font-semibold">{profileData.losses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Active Wagers</span>
                <span className="text-blue-400 font-semibold">{profileData.activeWagers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed Wagers</span>
                <span className="text-gray-300 font-semibold">{profileData.completedWagers}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? recentActivity.slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-gray-400 text-sm">
                      {activity.status === 'completed' && activity.winnerId === currentUser.uid ? 'Won' : 
                       activity.status === 'completed' ? 'Lost' : 
                       activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{activity.wagerAmount} SIM</p>
                    <p className="text-gray-400 text-sm">
                      {activity.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-center py-4">
                  No activity yet. Start your first challenge!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <TrophyIcon className="h-5 w-5 mr-2" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${profileData.wins >= 1 ? 'bg-yellow-500 bg-opacity-20 border-yellow-500' : 'bg-gray-700 border-gray-600'}`}>
              <div className="text-center">
                <TrophyIcon className={`h-8 w-8 mx-auto mb-2 ${profileData.wins >= 1 ? 'text-yellow-400' : 'text-gray-500'}`} />
                <h4 className={`font-semibold ${profileData.wins >= 1 ? 'text-yellow-400' : 'text-gray-500'}`}>
                  First Victory
                </h4>
                <p className="text-gray-400 text-sm">Win your first challenge</p>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${profileData.wins >= 5 ? 'bg-blue-500 bg-opacity-20 border-blue-500' : 'bg-gray-700 border-gray-600'}`}>
              <div className="text-center">
                <FireIcon className={`h-8 w-8 mx-auto mb-2 ${profileData.wins >= 5 ? 'text-blue-400' : 'text-gray-500'}`} />
                <h4 className={`font-semibold ${profileData.wins >= 5 ? 'text-blue-400' : 'text-gray-500'}`}>
                  Hot Streak
                </h4>
                <p className="text-gray-400 text-sm">Win 5 challenges</p>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${profileData.winRate >= 80 ? 'bg-purple-500 bg-opacity-20 border-purple-500' : 'bg-gray-700 border-gray-600'}`}>
              <div className="text-center">
                <UserGroupIcon className={`h-8 w-8 mx-auto mb-2 ${profileData.winRate >= 80 ? 'text-purple-400' : 'text-gray-500'}`} />
                <h4 className={`font-semibold ${profileData.winRate >= 80 ? 'text-purple-400' : 'text-gray-500'}`}>
                  Elite Player
                </h4>
                <p className="text-gray-400 text-sm">Maintain 80%+ win rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;