import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import BetaBadge from '../components/BetaBadge';
import FakeCurrencyDisplay from '../components/FakeCurrencyDisplay';
import { 
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  EyeIcon,
  FireIcon
} from '@heroicons/react/24/outline';

const Wagers = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('active');

  // Mock wager data for Beta demonstration
  const mockWagers = {
    active: [
      {
        id: 1,
        title: 'Daily Running Challenge',
        description: 'Run 5 miles every day for a week',
        amount: 25.00,
        type: 'created',
        participants: 3,
        deadline: '2024-01-30',
        status: 'active',
        category: 'fitness'
      },
      {
        id: 2,
        title: 'Meditation Streak',
        description: '10 minutes meditation for 5 days',
        amount: 15.00,
        type: 'joined',
        participants: 2,
        deadline: '2024-01-28',
        status: 'active',
        category: 'wellness'
      },
      {
        id: 3,
        title: 'Reading Goal',
        description: 'Read 2 books this month',
        amount: 30.00,
        type: 'joined',
        participants: 1,
        deadline: '2024-01-31',
        status: 'pending_proof',
        category: 'education'
      }
    ],
    completed: [
      {
        id: 4,
        title: 'Push-up Challenge',
        description: '100 push-ups in one session',
        amount: 20.00,
        type: 'created',
        participants: 4,
        deadline: '2024-01-15',
        status: 'won',
        result: '+$60.00',
        category: 'fitness'
      },
      {
        id: 5,
        title: 'Water Drinking Goal',
        description: 'Drink 8 glasses of water daily for a week',
        amount: 10.00,
        type: 'joined',
        participants: 3,
        deadline: '2024-01-10',
        status: 'lost',
        result: '-$10.00',
        category: 'health'
      }
    ]
  };

  const getCategoryColor = (category) => {
    const colors = {
      fitness: 'bg-blue-100 text-blue-800',
      wellness: 'bg-green-100 text-green-800',
      education: 'bg-purple-100 text-purple-800',
      health: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'pending_proof':
        return <EyeIcon className="h-5 w-5 text-yellow-500" />;
      case 'won':
        return <TrophyIcon className="h-5 w-5 text-green-500" />;
      case 'lost':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'In Progress';
      case 'pending_proof':
        return 'Pending Proof';
      case 'won':
        return 'Won';
      case 'lost':
        return 'Lost';
      default:
        return 'Unknown';
    }
  };

  const WagerCard = ({ wager }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{wager.title}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(wager.category)}`}>
              {wager.category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{wager.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <CurrencyDollarIcon className="h-4 w-4" />
              <span>${wager.amount.toFixed(2)} (FAKE)</span>
            </div>
            <div className="flex items-center space-x-1">
              <FireIcon className="h-4 w-4" />
              <span>{wager.participants} participant{wager.participants !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>Due {new Date(wager.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon(wager.status)}
            <span className="text-sm font-medium text-gray-700">{getStatusText(wager.status)}</span>
          </div>
          
          {wager.type === 'created' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Creator
            </span>
          )}
          
          {wager.result && (
            <span className={`text-sm font-semibold ${wager.result.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {wager.result}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          {wager.status === 'active' && (
            <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              View Details
            </button>
          )}
          {wager.status === 'pending_proof' && (
            <button className="text-sm text-orange-600 hover:text-orange-500 font-medium">
              Submit Proof
            </button>
          )}
        </div>
        
        <Link
          to={`/challenge/${wager.id}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          View Challenge →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                My Wagers
                <BetaBadge size="sm" />
              </h1>
              <p className="text-gray-600 mt-1">Track your challenges and earnings</p>
            </div>
            <div className="flex items-center space-x-4">
              <FakeCurrencyDisplay className="bg-gray-100 px-4 py-2 rounded-lg" />
              <Link
                to="/create-challenge"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Wager
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'active'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Wagers ({mockWagers.active.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed Wagers ({mockWagers.completed.length})
            </button>
          </nav>
        </div>

        {/* Wagers List */}
        <div className="space-y-6">
          {mockWagers[activeTab].length > 0 ? (
            mockWagers[activeTab].map((wager) => (
              <WagerCard key={wager.id} wager={wager} />
            ))
          ) : (
            <div className="text-center py-12">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No wagers found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'active' 
                  ? "You don't have any active wagers. Create one to get started!"
                  : "You haven't completed any wagers yet."
                }
              </p>
              {activeTab === 'active' && (
                <div className="mt-6">
                  <Link
                    to="/create-challenge"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Wager
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Beta Notice */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-2">
            <BetaBadge size="sm" />
            <h3 className="text-lg font-semibold text-orange-800">Beta Testing Mode</h3>
          </div>
          <p className="text-sm text-orange-700">
            All wagers shown are simulated for Beta testing. Real money transactions are not processed during the Beta phase.
            Test the platform functionality and help us improve the experience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wagers;