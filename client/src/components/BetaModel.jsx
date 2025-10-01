import React, { useState, useEffect } from 'react';

const BetaModel = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the beta modal
    const hasSeenBetaModel = localStorage.getItem('hasSeenBetaModel');
    if (!hasSeenBetaModel) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenBetaModel', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome to SkillWagers (Beta)</h2>
        <p className="text-gray-600 mb-4">
          You're in early access. All currency is fake for testing. Let's run through a quick demo.
        </p>
        
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-orange-800 mb-2">Beta Features:</h4>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• $100 free starting balance (fake currency)</li>
            <li>• Test challenges and wagers</li>
            <li>• Limited marketplace functionality</li>
            <li>• Development features for testing</li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Important:</h4>
          <p className="text-xs text-gray-600">
            This is not real money. All transactions are simulated for testing purposes. 
            Data may be reset during development.
          </p>
        </div>
        
        <button
          className="w-full rounded-xl px-4 py-3 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
          onClick={handleClose}
        >
          Got it, let's test
        </button>
      </div>
    </div>
  );
};

export default BetaModel;