import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorTooltip = ({ message, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!message) return null;

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 rotate-180',
    right: 'right-full top-1/2 transform -translate-y-1/2 rotate-90',
    left: 'left-full top-1/2 transform -translate-y-1/2 -rotate-90'
  };

  return (
    <div className="relative inline-flex">
      <ExclamationTriangleIcon 
        className="w-5 h-5 text-red-500 cursor-help hover:text-red-600 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <div className={`absolute z-[9999] px-3 py-2 text-sm text-white bg-red-600 rounded-lg shadow-lg whitespace-nowrap pointer-events-none ${positionClasses[position]}`}>
          {message}
          <div className={`absolute w-2 h-2 bg-red-600 transform rotate-45 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
};

export default ErrorTooltip;
