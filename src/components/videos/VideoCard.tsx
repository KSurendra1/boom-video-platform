import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '../../hooks/useInView';
import { Video } from '../../types';
import { useVideo } from '../../context/VideoContext';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import { Play, Clock, DollarSign } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, 0.5);
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const { purchaseVideo } = useVideo();
  const { balance } = useWallet();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isInView && isHovered && video.videoType === 'short-form' && !videoError) {
      videoRef.current.play()
        .catch(err => {
          console.error('Video play error:', err);
          setVideoError(true);
          showToast('Video format not supported or video unavailable', 'error');
        });
    } else if (videoRef.current) {
      videoRef.current.pause();
      // Reset video position when paused
      videoRef.current.currentTime = 0;
    }
  }, [isInView, isHovered, video.videoType, videoError]); // Removed showToast from dependencies

  const handleVideoClick = () => {
    navigate(`/video/${video.id}`);
  };

  const handlePurchase = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (balance < video.price) {
      showToast('Insufficient balance', 'error');
      return;
    }
    
    const success = await purchaseVideo(video.id, video.price);
    if (success) {
      navigate(`/video/${video.id}`);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div 
      ref={cardRef}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleVideoClick}
    >
      <div className="relative cursor-pointer">
        {video.videoType === 'short-form' ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-56 object-cover"
              muted={true}
              loop={true}
              playsInline={true}
              preload="metadata"
              poster={video.thumbnailUrl}
              onError={() => {
                setVideoError(true);
                showToast('Video format not supported or video unavailable', 'error');
              }}
            >
              {/* Support multiple video formats */}
              <source src={video.videoUrl} type="video/mp4" />
              <source src={video.videoUrl.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            {videoError && (
              <div className="absolute inset-0">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <p className="text-white text-sm">Video unavailable</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-56 object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              <Clock className="inline h-3 w-3 mr-1" />
              {formatDuration(Math.floor(Math.random() * 600) + 300)}
            </div>
          </>
        )}
        
        {/* Overlay for long-form videos */}
        {video.videoType === 'long-form' && (
          <div 
            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            {video.price > 0 && !video.purchased ? (
              <Button 
                onClick={handlePurchase}
                className="transform transition-transform duration-200 hover:scale-110"
              >
                <DollarSign className="mr-1 h-4 w-4" />
                Buy for ₹{video.price}
              </Button>
            ) : (
              <Button 
                variant="secondary"
                className="transform transition-transform duration-200 hover:scale-110"
              >
                <Play className="mr-1 h-4 w-4" />
                Watch Now
              </Button>
            )}
          </div>
        )}
        
        {/* Video type badge */}
        <div className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-opacity-75 bg-gray-900 text-white">
          {video.videoType === 'short-form' ? 'SHORT' : 'LONG'}
        </div>
        
        {/* Price badge for paid videos */}
        {video.videoType === 'long-form' && video.price > 0 && (
          <div className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded bg-opacity-75 bg-green-900 text-white flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            ₹{video.price}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex">
          <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden mr-3">
            {video.creator.profilePicture && (
              <img 
                src={video.creator.profilePicture} 
                alt={video.creator.username}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white truncate">{video.title}</h3>
            <Link to={`/profile/${video.creator.username}`} className="text-sm text-gray-400 hover:text-blue-400" onClick={(e) => e.stopPropagation()}>
              {video.creator.username}
            </Link>
            <p className="text-xs text-gray-500 mt-1">
              {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;