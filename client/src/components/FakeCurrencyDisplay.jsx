import React from 'react';
import { useAuth } from './AuthContext';
import BetaBadge from './BetaBadge';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const FakeCurrencyDisplay = ({ showLabel = true, className = '' }) => {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const balance = userProfile.balance || 0;
  const currency = userProfile.currency || 'fake';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-gray-500 font-medium">Beta Balance:</span>
      )}
      
      <div className="flex items-center space-x-1">
        <CurrencyDollarIcon className="h-4 w-4 text-green-500" />
        <span className="font-semibold text-green-600">
          ${balance.toFixed(2)}
        </span>
        {currency === 'fake' && (
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            (FAKE)
          </span>
        )}
      </div>
      
      <BetaBadge size="xs" />
    </div>
  );
};

export default FakeCurrencyDisplay;