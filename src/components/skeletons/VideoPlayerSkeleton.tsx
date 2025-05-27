import React from 'react';

const VideoPlayerSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Video player skeleton */}
        <div className="aspect-video bg-gray-700 animate-pulse"></div>
        
        {/* Video info skeleton */}
        <div className="p-4">
          <div className="h-6 bg-gray-700 rounded w-3/4 animate-pulse mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
              <div className="ml-3">
                <div className="h-4 bg-gray-700 rounded w-24 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="h-9 w-20 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-9 w-20 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="mt-4 h-20 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      
      {/* Comments section skeleton */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <div className="h-6 bg-gray-700 rounded w-40 animate-pulse mb-4"></div>
        
        <div className="h-24 bg-gray-700 rounded animate-pulse mb-6"></div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;