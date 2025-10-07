import React from 'react';
import { Link } from 'react-router-dom';
import BetaBadge from '../components/BetaBadge';
import { 
  ShoppingBagIcon,
  ClockIcon,
  BellIcon,
  ArrowPathIcon,
  PlusIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Marketplace = () => {
  const upcomingFeatures = [
    {
      icon: ShoppingBagIcon,
      title: 'Gift Card Trading',
      description: 'Buy and sell gift cards for coins with other users',
      timeline: 'Phase 2'
    },
    {
      icon: TrophyIcon,
      title: 'Verified Sellers',
      description: 'Trusted seller badges and reputation system for safe trading',
      timeline: 'Phase 2'
    },
    {
      icon: BellIcon,
      title: 'Trade Notifications',
      description: 'Real-time alerts for new gift card listings and trades',
      timeline: 'Phase 3'
    },
    {
      icon: ArrowPathIcon,
      title: 'Auto-Matching',
      description: 'Automatic matching for gift card buyers and sellers',
      timeline: 'Phase 3'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center space-x-3">
              <ShoppingBagIcon className="h-8 w-8" />
              Gift Card Marketplace
              <BetaBadge size="sm" />
            </h1>
            <p className="text-gray-300 mt-2">Buy and sell gift cards for coins - Coming Soon in Beta Phase 2</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Coming Soon Banner */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-primaryAccent to-red-500 rounded-full flex items-center justify-center mb-6">
            <ClockIcon className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Gift Card Marketplace Coming Soon!
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            We're building an amazing marketplace where you can buy and sell gift cards for coins 
            with other users. Trade your gift cards safely and securely within our community!
          </p>

          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primaryAccent"></div>
            <span className="text-sm text-gray-500">Currently in development...</span>
          </div>
        </div>

        {/* What's Coming */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Planned Gift Card Trading Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-900 bg-opacity-30 rounded-lg">
                      <IconComponent className="h-6 w-6 text-purple-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 bg-opacity-30 text-blue-300">
                          {feature.timeline}
                        </span>
                      </div>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Beta Features */}
        <div className="bg-purple-900 bg-opacity-30 border border-brand rounded-lg p-8 mb-8">
          <div className="text-center">
            <BetaBadge size="md" className="mb-4" />
            <h3 className="text-xl font-semibold text-purple-200 mb-4">
              What You Can Do Now in Beta
            </h3>
            <p className="text-purple-100 mb-6">
              While we're building the marketplace, you can still test core features:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <Link
                to="/create-challenge"
                className="flex items-center justify-center space-x-2 bg-gray-800 border border-primaryAccent rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5 text-purple-300" />
                <span className="text-purple-200 font-medium">Create Challenges</span>
              </Link>
              
              <Link
                to="/wagering"
                className="flex items-center justify-center space-x-2 bg-gray-800 border border-primaryAccent rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <TrophyIcon className="h-5 w-5 text-purple-300" />
                <span className="text-purple-200 font-medium">Browse Challenges</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Beta Feedback */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Help Shape the Gift Card Marketplace
          </h3>
          <p className="text-gray-400 mb-6">
            Your feedback during Beta testing helps us build the gift card trading features you actually want. 
            Tell us what types of gift cards and trading features would be most valuable to you!
          </p>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-400">
              Send feedback to: <strong className="text-purple-300">beta@skillwagers.com</strong>
            </div>
            <div className="text-sm text-gray-400">
              Gift Card Trading Launch: <strong className="text-purple-300">Q2 2024</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
