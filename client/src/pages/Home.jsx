import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import BetaBadge from '../components/BetaBadge';
import FakeCurrencyDisplay from '../components/FakeCurrencyDisplay';
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

const Home = () => {
  const { currentUser, userProfile } = useAuth();

  // Mock statistics for Beta demonstration
  const mockStats = {
    totalWagers: 12,
    winRate: 68.5,
    totalEarnings: 245.50,
    activeWagers: 3,
    completedWagers: 9,
    rank: 'Bronze III'
  };

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
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P2P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SkillWagers</span>
            <BetaBadge size="xs" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to SkillWagers Beta</h2>
          <p className="text-gray-600 mb-4">
            Please sign in to access your dashboard and start wagering with fake currency.
          </p>
          <div className="space-y-2">
            <Link
              to="/login"
              className="block w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block w-full border border-orange-600 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-50 transition-colors"
            >
              Join Beta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                Welcome back, {userProfile?.displayName || currentUser.email?.split('@')[0]}
                <BetaBadge size="sm" />
              </h1>
              <p className="text-gray-600 mt-1">Ready to take on some challenges?</p>
            </div>
            <FakeCurrencyDisplay className="bg-gray-100 px-4 py-2 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Wagers</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.totalWagers}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.winRate}%</p>
              </div>
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${mockStats.totalEarnings}</p>
                <p className="text-xs text-gray-500">(FAKE CURRENCY)</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Rank</p>
                <p className="text-2xl font-bold text-orange-600">{mockStats.rank}</p>
              </div>
              <FireIcon className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/wagers"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <ChartBarIcon className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">My Wagers</span>
                  <span className="text-xs text-gray-500">{mockStats.activeWagers} active</span>
                </Link>
                
                <Link
                  to="/create-challenge"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <PlusIcon className="h-8 w-8 text-green-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Create Wager</span>
                  <span className="text-xs text-gray-500">Start earning</span>
                </Link>
                
                <Link
                  to="/marketplace"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <ShoppingBagIcon className="h-8 w-8 text-purple-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Marketplace</span>
                  <span className="text-xs text-gray-500">Browse challenges</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
                >
                  <UserGroupIcon className="h-8 w-8 text-orange-500 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Profile</span>
                  <span className="text-xs text-gray-500">View progress</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full bg-gray-100`}>
                        <IconComponent className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
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
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  to="/wagers"
                  className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-2">
            <BetaBadge size="sm" />
            <h3 className="text-lg font-semibold text-orange-800">Beta Testing Mode</h3>
          </div>
          <p className="text-sm text-orange-700">
            You're using SkillWagers Beta with fake currency for testing purposes. All wagers, earnings, and statistics are simulated. 
            Help us improve by reporting any issues you encounter!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;