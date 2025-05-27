import React from 'react';
import { Video } from '../../types';
import { Link } from 'react-router-dom';
import VideoGridSkeleton from '../skeletons/VideoGridSkeleton';

interface VideoGridProps {
  videos: Video[];
  loading: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading }) => {
  if (loading) {
    return <VideoGridSkeleton />;
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No videos found</p>
        <Link to="/upload" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Upload a Video
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Link key={video.id} to={`/video/${video.id}`} className="block">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title} 
                className="w-full h-40 object-cover"
              />
              {video.videoType === 'long-form' && video.price > 0 && (
                <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded bg-green-600 text-white">
                  ₹{video.price}
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-black bg-opacity-75 text-white">
                {video.videoType === 'short-form' ? 'Short' : 'Long'}
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-white truncate">{video.title}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default VideoGrid;