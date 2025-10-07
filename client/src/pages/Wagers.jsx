import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Wagers() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">My Challenges</h1>
          <p className="text-gray-400 mb-8">Coming soon! For now, browse and create challenges from other pages.</p>
          <Link
            to="/create-challenge"
            className="inline-flex items-center px-4 py-2 bg-primaryAccent hover:bg-secondary-600 text-white font-medium rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Challenge
          </Link>
        </div>
      </div>
    </div>
  );
}
