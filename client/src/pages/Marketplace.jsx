import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  TrophyIcon,
  UserIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Marketplace = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    game: '',
    maxStake: '',
    minStake: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const games = [
    'Call of Duty',
    'Fortnite',
    'Apex Legends',
    'FIFA',
    'NBA 2K',
    'Rocket League',
    'Valorant',
    'CS:GO',
    'League of Legends',
    'Other'
  ];

  useEffect(() => {
    fetchChallenges();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/challenges/open?limit=50`;
      
      if (filters.game) {
        url += `&game=${encodeURIComponent(filters.game)}`;
      }
      
      const response = await axios.get(url);
      let fetchedChallenges = response.data.challenges || [];
      
      // Apply local filters
      if (filters.minStake) {
        fetchedChallenges = fetchedChallenges.filter(c => c.stake >= parseFloat(filters.minStake));
      }
      if (filters.maxStake) {
        fetchedChallenges = fetchedChallenges.filter(c => c.stake <= parseFloat(filters.maxStake));
      }
      if (searchTerm) {
        fetchedChallenges = fetchedChallenges.filter(c => 
          c.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.gameMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.creator?.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setChallenges(fetchedChallenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChallenge = async (challengeId) => {
    if (!currentUser) {
      toast.error('Please sign in to accept challenges');
      navigate('/auth');
      return;
    }

    if (!userProfile?.ageVerified) {
      toast.error('Age verification required to participate');
      navigate('/profile');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/challenges/${challengeId}/accept`);
      toast.success('Challenge accepted successfully!');
      navigate(`/challenge/${challengeId}`);
    } catch (error) {
      console.error('Error accepting challenge:', error);
      toast.error(error.response?.data?.message || 'Failed to accept challenge');
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const challengeDate = new Date(date);
    const diffInHours = Math.floor((now - challengeDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Less than 1 hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 2000) return 'text-purple-400';
    if (rating >= 1500) return 'text-accent-400';
    if (rating >= 1200) return 'text-success-400';
    return 'text-gray-400';
  };

  const clearFilters = () => {
    setFilters({ game: '', maxStake: '', minStake: '' });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gaming-text mb-2">Challenge Marketplace</h1>
            <p className="text-gray-300">Find and accept challenges from players around the world</p>
          </div>
          
          {currentUser && (
            <button
              onClick={() => navigate('/create-challenge')}
              className="btn-primary mt-4 md:mt-0"
            >
              Create Challenge
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            {/* Game Filter */}
            <select
              value={filters.game}
              onChange={(e) => setFilters({ ...filters, game: e.target.value })}
              className="input-field"
            >
              <option value="">All Games</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
            
            {/* Stake Range */}
            <input
              type="number"
              placeholder="Min Stake ($)"
              value={filters.minStake}
              onChange={(e) => setFilters({ ...filters, minStake: e.target.value })}
              className="input-field"
              min="0"
            />
            
            <input
              type="number"
              placeholder="Max Stake ($)"
              value={filters.maxStake}
              onChange={(e) => setFilters({ ...filters, maxStake: e.target.value })}
              className="input-field"
              min="0"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FunnelIcon className="h-4 w-4" />
              <span>{challenges.length} challenges found</span>
            </div>
            
            {(filters.game || filters.minStake || filters.maxStake || searchTerm) && (
              <button
                onClick={clearFilters}
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Challenges Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-3"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : challenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="card-gradient hover:scale-105 transition-transform duration-300">
                {/* Challenge Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {challenge.game}
                    </h3>
                    <p className="text-sm text-gray-300">{challenge.gameMode}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold gaming-text">
                      ${challenge.stake}
                    </div>
                    <div className="text-xs text-gray-400">stake</div>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-center space-x-3 mb-4 p-3 bg-dark-700 rounded-lg">
                  <img
                    src={challenge.creator?.photoURL || 'https://via.placeholder.com/40'}
                    alt="Creator"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white text-sm">
                      {challenge.creator?.displayName || 'Anonymous'}
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`font-semibold ${getRatingColor(challenge.creator?.rating)}`}>
                        {challenge.creator?.rating || 1000} Rating
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">
                        {challenge.creator?.totalWins || 0}W/{challenge.creator?.totalChallenges || 0}L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Challenge Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <TrophyIcon className="h-4 w-4 text-accent-400" />
                    <span>Winner takes ${(challenge.stake * 2 - challenge.platformFee).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <ClockIcon className="h-4 w-4 text-primary-400" />
                    <span>{challenge.timeLimit}h time limit</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <UserIcon className="h-4 w-4 text-secondary-400" />
                    <span>Created {formatTimeAgo(challenge.createdAt)}</span>
                  </div>
                </div>

                {/* Rules Preview */}
                {challenge.rules && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-1">Rules:</p>
                    <p className="text-sm text-gray-300 line-clamp-2">
                      {challenge.rules}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/challenge/${challenge.id}`)}
                    className="btn-outline flex-1"
                  >
                    View Details
                  </button>
                  
                  {currentUser && challenge.creatorId !== currentUser.uid ? (
                    <button
                      onClick={() => handleAcceptChallenge(challenge.id)}
                      className="btn-primary flex-1"
                      disabled={!userProfile?.ageVerified || (userProfile?.balance || 0) < challenge.stake}
                    >
                      {!userProfile?.ageVerified 
                        ? 'Verify Age' 
                        : (userProfile?.balance || 0) < challenge.stake
                          ? 'Insufficient Balance'
                          : `Accept ($${challenge.stake})`
                      }
                    </button>
                  ) : currentUser && challenge.creatorId === currentUser.uid ? (
                    <div className="flex-1 text-center py-2 text-sm text-gray-400">
                      Your Challenge
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate('/auth')}
                      className="btn-primary flex-1"
                    >
                      Sign In to Accept
                    </button>
                  )}
                </div>

                {/* Platform Fee Notice */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Platform fee: ${challenge.platformFee.toFixed(2)} (5%)
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <TrophyIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Challenges Found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filters.game || filters.minStake || filters.maxStake
                ? 'Try adjusting your filters to see more challenges.'
                : 'Be the first to create a challenge!'
              }
            </p>
            
            {currentUser ? (
              <button
                onClick={() => navigate('/create-challenge')}
                className="btn-primary"
              >
                Create Challenge
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="btn-primary"
              >
                Sign In to Create Challenge
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;