import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DisclaimerBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Check if banner was dismissed in this session
  useEffect(() => {
    const dismissed = localStorage.getItem('disclaimerBannerDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('disclaimerBannerDismissed', 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className="text-sm text-gray-800">
            <strong>SkillWagers Beta</strong> uses non-redeemable virtual coins for testing and entertainment only. 
            Coins have no cash value and cannot be converted to real currency.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-yellow-200 transition-colors"
          aria-label="Dismiss banner"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default DisclaimerBanner;