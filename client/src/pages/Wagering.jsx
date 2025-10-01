import React from 'react';
import { Link } from 'react-router-dom';
import BetaBadge from '../components/BetaBadge';

const Wagering = () => {
  return (
    <main className="max-w-6xl mx-auto p-6 pt-24">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Video Game Wagers</h1>
        <BetaBadge />
      </div>
      
      <p className="text-gray-600 mb-8">
        Create or join simple skill-based challenges. This beta uses test currency only.
      </p>
      
      {/* Placeholder actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3">Create a Challenge</h2>
          <p className="text-gray-600 mb-4">Choose a game, stake, and rules.</p>
          <Link 
            to="/create-challenge"
            className="inline-block rounded-xl border border-orange-600 bg-orange-600 text-white px-6 py-2 hover:bg-orange-700 transition-colors"
          >
            Start
          </Link>
        </div>
        
        <div className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3">Join a Challenge</h2>
          <p className="text-gray-600 mb-4">Browse open lobbies and stake.</p>
          <Link 
            to="/wagers"
            className="inline-block rounded-xl border border-orange-600 text-orange-600 px-6 py-2 hover:bg-orange-50 transition-colors"
          >
            Browse
          </Link>
        </div>
      </div>

      {/* Beta notice */}
      <div className="mt-12 bg-orange-50 border border-orange-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">Beta Testing Notice</h3>
        <p className="text-orange-700">
          All wagers in this beta use fake currency. You start with $100 in test funds to experiment with the platform. 
          No real money transactions occur during beta testing.
        </p>
      </div>
    </main>
  );
};

export default Wagering;