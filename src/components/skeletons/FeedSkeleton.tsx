import React from 'react';

const FeedSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="h-8 w-48 bg-gray-700 rounded mb-6 animate-pulse"></div>
      
      <div className="space-y-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="h-56 bg-gray-700 animate-pulse"></div>
            <div className="p-4">
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
                <div className="ml-3 flex-1">
                  <div className="h-5 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedSkeleton;