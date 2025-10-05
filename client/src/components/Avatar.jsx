import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const Avatar = ({ 
  src, 
  alt = 'User avatar', 
  size = 'md', 
  className = '',
  fallbackInitials = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7', 
    xl: 'h-10 w-10',
    '2xl': 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const renderFallback = () => {
    if (fallbackInitials) {
      return (
        <div className={`${sizeClasses[size]} ${className} rounded-full bg-blue-500 flex items-center justify-center text-white font-medium ${textSizeClasses[size]}`}>
          {fallbackInitials.slice(0, 2).toUpperCase()}
        </div>
      );
    }

    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full bg-gray-300 flex items-center justify-center text-gray-600`}>
        <UserIcon className={iconSizeClasses[size]} />
      </div>
    );
  };

  if (!src || imageError) {
    return renderFallback();
  }

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden border border-gray-300 bg-gray-100`}>
      {isLoading && (
        <div className="h-full w-full bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
          <UserIcon className={`${iconSizeClasses[size]} text-gray-400`} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${isLoading ? 'hidden' : 'block'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default Avatar;