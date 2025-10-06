import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import DailyCoinsReward from '../components/DailyCoinsReward';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { db, storage, auth } from '../firebase';
import toast from 'react-hot-toast';
import {
  TrophyIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChartBarIcon,
  CalendarIcon,
  StarIcon,
  PencilIcon,
  PhotoIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { userProfile, currentUser, refreshProfile, verifyAge, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [displayNameChanged, setDisplayNameChanged] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && userProfile) {
      fetchProfileData();
      setEditDisplayName(userProfile.displayName || '');
      // Check if display name has been changed before
      setDisplayNameChanged(userProfile.displayNameChanged || false);
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

  // --- NEW PROFILE EDITING FUNCTIONALITY (Oct 2025) ---
  const handleDisplayNameUpdate = async (e) => {
    e.preventDefault();
    
    if (!editDisplayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    if (displayNameChanged) {
      toast.error('Display name can only be changed once');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: editDisplayName.trim(),
        displayNameChanged: true,
        updatedAt: serverTimestamp()
      });
      
      toast.success('Display name updated successfully!');
      setShowEditProfile(false);
      setDisplayNameChanged(true);
      await refreshProfile();
    } catch (error) {
      console.error('Error updating display name:', error);
      toast.error('Failed to update display name');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error('Failed to send password reset email');
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    try {
      setIsUploadingPhoto(true);
      
      // Upload to Firebase Storage
      const imageRef = ref(storage, `avatars/${currentUser.uid}/${profilePicture.name}`);
      await uploadBytes(imageRef, profilePicture);
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update user profile
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: serverTimestamp()
      });
      
      toast.success('Profile picture updated successfully!');
      setProfilePicture(null);
      setProfilePicturePreview('');
      await refreshProfile();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
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
      color: 'text-orange-400'
    },
    {
      label: 'Wins',
      value: userProfile?.totalWins || 0,
      icon: StarIcon,
      color: 'text-green-400'
    },
    {
      label: 'Win Rate',
      value: userProfile?.totalChallenges > 0 
        ? `${((userProfile.totalWins / userProfile.totalChallenges) * 100).toFixed(1)}%`
        : '0%',
      icon: ChartBarIcon,
      color: 'text-blue-400'
    },
    {
      label: 'Total Earnings',
      value: `$${(userProfile?.totalEarnings || 0).toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-400'
    }
  ];

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar
                src={profilePicturePreview || userProfile.photoURL}
                alt="Profile"
                size="2xl"
                className="border-4 border-orange-500"
                fallbackInitials={userProfile.displayName ? userProfile.displayName.charAt(0) : userProfile.email?.charAt(0) || 'U'}
              />
              <button
                onClick={() => document.getElementById('profilePictureInput').click()}
                className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors"
              >
                <PhotoIcon className="w-4 h-4" />
              </button>
              <input
                id="profilePictureInput"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">
                  {userProfile.displayName}
                </h1>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="text-orange-400 hover:text-orange-300 p-1"
                  disabled={displayNameChanged}
                  title={displayNameChanged ? "Display name can only be changed once" : "Edit profile"}
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-300 mb-4">{userProfile.email}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-300">
                    Rating: <span className="text-white font-semibold">{userProfile.rating || 1000}</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-orange-400" />
                  <span className="text-sm text-gray-300">
                    Joined: {formatDate(userProfile.createdAt)}
                  </span>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userProfile.ageVerified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {userProfile.ageVerified ? 'Age Verified' : 'Age Verification Required'}
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userProfile.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {userProfile.status}
                </div>
              </div>

              {/* Profile Picture Upload Section */}
              {profilePicture && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img 
                      src={profilePicturePreview} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">New profile picture ready</p>
                      <p className="text-gray-400 text-sm">File: {profilePicture.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleProfilePictureUpload}
                        disabled={isUploadingPhoto}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                      >
                        {isUploadingPhoto ? 'Uploading...' : 'Upload'}
                      </button>
                      <button
                        onClick={() => {
                          setProfilePicture(null);
                          setProfilePicturePreview('');
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handlePasswordReset}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <KeyIcon className="w-4 h-4" />
                  Reset Password
                </button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                ${userProfile.balance?.toFixed(2) || '0.00'} SIM
              </div>
              <p className="text-sm text-gray-400">Available Balance</p>
              <button
                onClick={() => navigate('/wallet')}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors mt-2"
              >
                Manage Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Daily Coins Reward */}
        <DailyCoinsReward />

        {/* Age Verification Alert */}
        {!userProfile.ageVerified && (
          <div className="bg-yellow-900 bg-opacity-50 border border-yellow-600 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-400">
                  Age Verification Required
                </h3>
                <div className="mt-2 text-sm text-yellow-300">
                  <p>
                    To participate in challenges with real money stakes, you must verify that you are 18 years or older.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowAgeVerification(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
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
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center">
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
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Transactions */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
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
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
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
                        ? 'text-green-400'
                        : 'text-gray-300'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'challenge_win' ? '+' : '-'}
                      ${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/wallet')}
                  className="w-full text-center text-orange-400 hover:text-orange-300 text-sm mt-3"
                >
                  View All Transactions
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No transactions yet</p>
            )}
          </div>

          {/* Recent Challenges */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
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
                  <div key={index} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-white">
                        {challenge.game} - {challenge.gameMode}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(challenge.status)}`}>
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
                  className="w-full text-center text-orange-400 hover:text-orange-300 text-sm mt-3"
                >
                  View All Challenges
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No challenges yet</p>
                <button
                  onClick={() => navigate('/create-challenge')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Your First Challenge
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="text-center">
          <button
            onClick={() => setShowSignOutModal(true)}
            className="bg-red-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>

        {/* Age Verification Modal */}
        {showAgeVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full m-4">
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
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Age'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full m-4">
              <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
              
              <form onSubmit={handleDisplayNameUpdate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                    disabled={displayNameChanged}
                  />
                  {displayNameChanged && (
                    <p className="text-xs text-yellow-400 mt-1">
                      Display name can only be changed once
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    disabled={loading || displayNameChanged}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sign Out Confirmation Modal */}
        {showSignOutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full m-4">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Sign Out</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to sign out?</p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;