import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import {
  TrophyIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChartBarIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { userProfile, currentUser, refreshProfile, verifyAge } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userProfile) {
      fetchProfileData();
    }
  }, [currentUser, userProfile]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent transactions
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      
      // Fetch user's challenges
      const challengesQuery = query(
        collection(db, 'challenges'),
        where('creatorId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      
      const [transactionsSnapshot, challengesSnapshot] = await Promise.all([
        getDocs(transactionsQuery),
        getDocs(challengesQuery)
      ]);
      
      const transactionsData = transactionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const challengesData = challengesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTransactions(transactionsData);
      setChallenges(challengesData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAgeVerification = async (e) => {
    e.preventDefault();
    
    if (!dateOfBirth) {
      toast.error('Please enter your date of birth');
      return;
    }

    try {
      setLoading(true);
      await verifyAge(dateOfBirth);
      toast.success('Age verification successful!');
      setShowAgeVerification(false);
      await refreshProfile();
    } catch (error) {
      console.error('Age verification error:', error);
      toast.error(error.response?.data?.message || 'Age verification failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'open': 'status-pending',
      'accepted': 'status-active',
      'completed': 'status-completed',
      'disputed': 'status-disputed',
      'cancelled': 'bg-gray-500 bg-opacity-20 text-gray-400'
    };
    return badges[status] || 'status-pending';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stats = [
    {
      label: 'Total Challenges',
      value: userProfile?.totalChallenges || 0,
      icon: TrophyIcon,
      color: 'text-primary-400'
    },
    {
      label: 'Wins',
      value: userProfile?.totalWins || 0,
      icon: StarIcon,
      color: 'text-success-400'
    },
    {
      label: 'Win Rate',
      value: userProfile?.totalChallenges > 0 
        ? `${((userProfile.totalWins / userProfile.totalChallenges) * 100).toFixed(1)}%`
        : '0%',
      icon: ChartBarIcon,
      color: 'text-accent-400'
    },
    {
      label: 'Total Earnings',
      value: `$${(userProfile?.totalEarnings || 0).toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'text-success-400'
    }
  ];

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="card-gradient mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar
              src={userProfile.photoURL}
              alt="Profile"
              size="2xl"
              className="border-4 border-primary-500"
              fallbackInitials={userProfile.displayName ? userProfile.displayName.charAt(0) : userProfile.email?.charAt(0) || 'U'}
            />
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {userProfile.displayName}
              </h1>
              <p className="text-gray-300 mb-4">{userProfile.email}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm text-gray-300">
                    Rating: <span className="text-white font-semibold">{userProfile.rating || 1000}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm text-gray-300">
                    Joined: {formatDate(userProfile.createdAt)}
                  </span>
                </div>
                
                <div className={`status-badge ${
                  userProfile.ageVerified ? 'status-completed' : 'status-pending'
                }`}>
                  {userProfile.ageVerified ? 'Age Verified' : 'Age Verification Required'}
                </div>
                
                <div className={`status-badge ${
                  userProfile.status === 'active' ? 'status-active' : 'status-disputed'
                }`}>
                  {userProfile.status}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold gaming-text mb-1">
                ${userProfile.balance?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-400">Available Balance</p>
              <button
                onClick={() => navigate('/wallet')}
                className="btn-primary mt-2"
              >
                Manage Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Age Verification Alert */}
        {!userProfile.ageVerified && (
          <div className="bg-accent-500 bg-opacity-20 border border-accent-500 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-accent-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-accent-400">
                  Age Verification Required
                </h3>
                <div className="mt-2 text-sm text-accent-300">
                  <p>
                    To participate in challenges with real money stakes, you must verify that you are 18 years or older.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowAgeVerification(true)}
                    className="btn-accent"
                  >
                    Verify Age
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card text-center">
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white capitalize">
                        {transaction.type}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      transaction.type === 'deposit' || transaction.type === 'challenge_win'
                        ? 'text-success-400'
                        : 'text-gray-300'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'challenge_win' ? '+' : '-'}
                      ${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/wallet')}
                  className="w-full text-center text-primary-400 hover:text-primary-300 text-sm mt-3"
                >
                  View All Transactions
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No transactions yet</p>
            )}
          </div>

          {/* Recent Challenges */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">Recent Challenges</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-700 rounded"></div>
                ))}
              </div>
            ) : challenges.length > 0 ? (
              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <div key={index} className="p-3 bg-dark-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-white">
                        {challenge.game} - {challenge.gameMode}
                      </div>
                      <span className={`status-badge ${getStatusBadge(challenge.status)}`}>
                        {challenge.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      Stake: ${challenge.stake}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(challenge.createdAt)}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full text-center text-primary-400 hover:text-primary-300 text-sm mt-3"
                >
                  View All Challenges
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No challenges yet</p>
                <button
                  onClick={() => navigate('/create-challenge')}
                  className="btn-primary"
                >
                  Create Your First Challenge
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Age Verification Modal */}
        {showAgeVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="card-gradient max-w-md w-full m-4">
              <h3 className="text-xl font-bold text-white mb-4">Age Verification</h3>
              
              <form onSubmit={handleAgeVerification}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    You must be 18 years or older to use this platform
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAgeVerification(false)}
                    className="btn-outline flex-1"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Age'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;