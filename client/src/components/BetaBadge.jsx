import React from 'react';

const BetaBadge = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'px-1 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} font-semibold text-white rounded-full shadow-sm animate-pulse ${className}`} style={{ backgroundColor: '#6f4cff' }}>
      BETA
    </span>
  );
};

export default BetaBadge;
