import React, { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const BetaModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the beta modal
    const hasSeenBetaModal = localStorage.getItem('hasSeenBetaModal');
    if (!hasSeenBetaModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenBetaModal', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-semibold text-gray-900">
                Welcome to Peer2Pool Beta
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-3">
                  You're accessing the <strong>Beta version</strong> of Peer2Pool. This is a preview release for testing and feedback purposes.
                </p>
                
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mb-3">
                  <h4 className="text-sm font-medium text-orange-800 mb-1">Beta Features:</h4>
                  <ul className="text-xs text-orange-700 space-y-1">
                    <li>• Fake currency system ($100 starting balance)</li>
                    <li>• Test challenges and wagers</li>
                    <li>• Limited marketplace functionality</li>
                    <li>• Development features for testing</li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-800 mb-1">Important:</h4>
                  <p className="text-xs text-gray-600">
                    This is not real money. All transactions are simulated for testing purposes. 
                    Data may be reset during development.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              onClick={handleClose}
            >
              Got it, let's test!
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
              onClick={handleClose}
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaModal;