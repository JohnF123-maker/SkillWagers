import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  ClockIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../components/AuthContext';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as limitQuery
} from 'firebase/firestore';
import { db } from '../firebase';

const Wagering = () => {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    skillLevel: 'all',
    wagerRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      
      let q = query(
        collection(db, 'challenges'),
        where('status', '==', 'open'),
        orderBy('createdAt', 'desc'),
        limitQuery(20)
      );

      const querySnapshot = await getDocs(q);
      const challengeList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));

      setChallenges(challengeList);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [filters]);

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const formatCurrency = (amount) => {
    return `${amount} SIM`;
  };

  const getSkillLevelBadge = (level) => {
    const colors = {
      'beginner': 'bg-green-900 bg-opacity-30 text-green-300 border border-green-600',
      'intermediate': 'bg-yellow-900 bg-opacity-30 text-yellow-300 border border-yellow-600',
      'advanced': 'bg-red-900 bg-opacity-30 text-red-300 border border-red-600'
    };
    return `${colors[level] || colors.beginner} px-2 py-1 rounded-full text-xs font-medium`;
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'all' || challenge.category === filters.category;
    const matchesSkillLevel = filters.skillLevel === 'all' || challenge.skillLevel === filters.skillLevel;
    
    let matchesWagerRange = true;
    if (filters.wagerRange !== 'all') {
      const wager = challenge.wagerAmount || 0;
      switch (filters.wagerRange) {
        case 'low':
          matchesWagerRange = wager <= 10;
          break;
        case 'medium':
          matchesWagerRange = wager > 10 && wager <= 50;
          break;
        case 'high':
          matchesWagerRange = wager > 50;
          break;
        default:
          matchesWagerRange = true;
      }
    }

    return matchesSearch && matchesCategory && matchesSkillLevel && matchesWagerRange;
  });

  return (
    <main className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Available Challenges</h1>
            <p className="text-gray-400">
              Browse and join skill-based challenges. Test your abilities and compete with others!
            </p>
          </div>
          {currentUser && (
            <Link
              to="/create-challenge"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Challenge
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primaryAccent focus:border-primaryAccent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryAccent focus:border-primaryAccent"
              >
                <option value="all">All Categories</option>
                <option value="gaming">Gaming</option>
                <option value="trivia">Trivia</option>
                <option value="sports">Sports Knowledge</option>
                <option value="puzzle">Puzzle Solving</option>
                <option value="creative">Creative</option>
              </select>

              <select
                value={filters.skillLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, skillLevel: e.target.value }))}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryAccent focus:border-primaryAccent"
              >
                <option value="all">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={filters.wagerRange}
                onChange={(e) => setFilters(prev => ({ ...prev, wagerRange: e.target.value }))}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-primaryAccent focus:border-primaryAccent"
              >
                <option value="all">All Wager Amounts</option>
                <option value="low">1-10 SIM</option>
                <option value="medium">11-50 SIM</option>
                <option value="high">50+ SIM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Challenge Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryAccent mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading challenges...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-12">
              <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No challenges found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filters.category !== 'all' || filters.skillLevel !== 'all' || filters.wagerRange !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'No challenges are currently available. Check back later!'}
              </p>
              <Link
                to="/create-challenge"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand hover:bg-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
              >
                Create the First Challenge
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChallenges.map((challenge) => (
                <Link
                  key={challenge.id}
                  to={`/challenge/${challenge.id}`}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:bg-gray-750 transition-colors duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                        {challenge.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={getSkillLevelBadge(challenge.skillLevel)}>
                      {challenge.skillLevel || 'Beginner'}
                    </span>
                    <div className="flex items-center text-purple-300 font-semibold">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      {formatCurrency(challenge.wagerAmount || 0)}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>Created {formatDate(challenge.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Beta notice */}
        <div className="bg-purple-900 bg-opacity-30 border border-primaryAccent rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-purple-200 mb-2">Beta Testing Notice</h3>
          <p className="text-purple-100">
            All challenges in this beta use fake SIM currency. You start with 100 SIM in test funds to experiment with the platform. 
            No real money transactions occur during beta testing.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Wagering;
