import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import BetaBadge from '../components/BetaBadge';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-700">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold text-white">SkillWagers</span>
          <BetaBadge size="xs" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Welcome to SkillWagers Beta</h2>
        <p className="text-gray-400 mb-4">
          {currentUser 
            ? "Ready to take on some challenges? Check your dashboard and start wagering with fake currency."
            : "Please sign in to access your dashboard and start wagering with fake currency."
          }
        </p>
        <div className="space-y-2">
          {currentUser ? (
            <>
              <Link
                to="/profile"
                className="block w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
              >
                View Dashboard
              </Link>
              <Link
                to="/wagering"
                className="block w-full border border-orange-600 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-900 hover:bg-opacity-20"
              >
                Browse Challenges
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="block w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="block w-full border border-orange-600 text-orange-600 px-4 py-2 rounded-md hover:bg-orange-900 hover:bg-opacity-20"
              >
                Join Beta
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;