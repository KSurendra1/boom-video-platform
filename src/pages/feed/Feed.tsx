import React, { useEffect, useRef, useState } from 'react';
import { useVideo } from '../../context/VideoContext';
import VideoCard from '../../components/videos/VideoCard';
import { Video } from '../../types';
import FeedSkeleton from '../../components/skeletons/FeedSkeleton';
import { useInView } from '../../hooks/useInView';

const Feed = () => {
  const { videos, loading, loadMoreVideos } = useVideo();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isLoadMoreVisible = useInView(loadMoreRef);

  // When load more element comes into view, load more videos
  useEffect(() => {
    if (isLoadMoreVisible && !loading) {
      loadMoreVideos();
    }
  }, [isLoadMoreVisible, loading, loadMoreVideos]);

  if (videos.length === 0 && loading) {
    return <FeedSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Discover Videos</h1>
      
      <div className="space-y-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}

        {/* Load more trigger element */}
        <div 
          ref={loadMoreRef} 
          className="py-4 flex justify-center"
        >
          {loading && (
            <div className="text-gray-400">Loading more videos...</div>
          )}
        </div>
      </div>
      
      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No videos found</p>
          <p className="text-gray-500">Be the first to upload a video!</p>
        </div>
      )}
    </div>
  );
};

export default Feed;