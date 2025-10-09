import React, { useState } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function ErrorTooltip({ id, message }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!message) return null;
  
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ExclamationTriangleIcon 
          className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-600 transition-colors" 
          aria-hidden="true" 
        />
        {isHovered && (
          <div
            id={id}
            className="absolute right-0 top-7 z-20 min-w-max max-w-xs bg-red-600 text-white text-xs px-3 py-2 rounded-md shadow-lg whitespace-nowrap"
            role="tooltip"
            aria-live="polite"
          >
            {message}
            <div className="absolute -top-1 right-3 w-2 h-2 bg-red-600 transform rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
}