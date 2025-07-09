import React from 'react';

const LoadingSkeleton = ({ type = 'card', lines = 3, className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const skeletons = {
    card: (
      <div className={`p-6 bg-white rounded-lg shadow ${className}`}>
        <div className={`h-6 ${baseClasses} mb-4 w-3/4`}></div>
        <div className={`h-4 ${baseClasses} mb-2`}></div>
        <div className={`h-4 ${baseClasses} mb-2 w-5/6`}></div>
        <div className={`h-4 ${baseClasses} w-4/6`}></div>
      </div>
    ),
    
    text: (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 ${baseClasses} ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
          ></div>
        ))}
      </div>
    ),
    
    image: (
      <div className={`aspect-video ${baseClasses} ${className}`}></div>
    ),
    
    avatar: (
      <div className={`w-12 h-12 ${baseClasses} rounded-full ${className}`}></div>
    ),
    
    button: (
      <div className={`h-10 w-24 ${baseClasses} rounded ${className}`}></div>
    ),
    
    list: (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${baseClasses} rounded-full`}></div>
            <div className="flex-1 space-y-2">
              <div className={`h-4 ${baseClasses} w-3/4`}></div>
              <div className={`h-3 ${baseClasses} w-1/2`}></div>
            </div>
          </div>
        ))}
      </div>
    ),
    
    grid: (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 bg-white rounded-lg shadow">
            <div className={`h-48 ${baseClasses} mb-4`}></div>
            <div className={`h-6 ${baseClasses} mb-2 w-3/4`}></div>
            <div className={`h-4 ${baseClasses} mb-2`}></div>
            <div className={`h-4 ${baseClasses} w-5/6`}></div>
          </div>
        ))}
      </div>
    )
  };

  return skeletons[type] || skeletons.card;
};

export default LoadingSkeleton; 