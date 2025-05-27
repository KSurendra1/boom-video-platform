import React from 'react';

const VideoGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="bg-gray-800 rounded-lg overflow-hidden shadow">
          <div className="h-40 bg-gray-700 animate-pulse"></div>
          <div className="p-3">
            <div className="h-5 bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGridSkeleton;