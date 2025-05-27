import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVideo } from '../../context/VideoContext';
import { useWallet } from '../../context/WalletContext';
import { useToast } from '../../context/ToastContext';
import { Video, Comment } from '../../types';
import Button from '../../components/ui/Button';
import CommentSection from '../../components/comments/CommentSection';
import VideoPlayerSkeleton from '../../components/skeletons/VideoPlayerSkeleton';
import GiftDialog from '../../components/dialogs/GiftDialog';
import { Heart, Share2 } from 'lucide-react';
import { GIFT_AMOUNTS } from '../../config';

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const { getVideoById, addCommentToVideo, purchaseVideo } = useVideo();
  const { balance, giftCreator } = useWallet();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const videoData = await getVideoById(id);
        if (videoData) {
          setVideo(videoData);
        } else {
          showToast('Video not found', 'error');
          navigate('/');
        }
      } catch (error) {
        showToast('Failed to load video', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadVideo();
  }, [id, getVideoById, navigate, showToast]);

  const handlePurchase = async () => {
    if (!video) return;
    
    if (balance < video.price) {
      showToast('Insufficient balance', 'error');
      return;
    }
    
    const success = await purchaseVideo(video.id, video.price);
    if (success) {
      setVideo({ ...video, purchased: true });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!video || !commentText.trim()) return;
    
    try {
      await addCommentToVideo(video.id, commentText);
      setCommentText('');
      
      // Refresh the video to get updated comments
      const updatedVideo = await getVideoById(video.id);
      if (updatedVideo) {
        setVideo(updatedVideo);
      }
    } catch (error) {
      showToast('Failed to add comment', 'error');
    }
  };

  const handleGift = async (amount: number) => {
    if (!video) return;
    
    if (balance < amount) {
      showToast('Insufficient balance', 'error');
      return;
    }
    
    const success = await giftCreator(video.id, video.creator.id, amount);
    if (success) {
      setShowGiftDialog(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('Link copied to clipboard', 'success');
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      showToast('Video added to your favorites', 'success');
    }
  };

  if (loading || !video) {
    return <VideoPlayerSkeleton />;
  }

  const canWatch = video.videoType === 'short-form' || video.price === 0 || video.purchased;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Video player */}
        <div className="aspect-video bg-black relative">
          {canWatch ? (
            video.videoType === 'short-form' ? (
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <iframe
                src={video.videoUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
              <div className="text-center">
                <h3 className="text-xl font-bold">Premium Content</h3>
                <p className="text-gray-400 mb-4">This video requires a one-time purchase</p>
                <div className="text-2xl font-bold text-green-500 mb-4">₹{video.price}</div>
                <Button onClick={handlePurchase}>
                  Buy for ₹{video.price}
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Video info */}
        <div className="p-4">
          <h1 className="text-xl font-bold">{video.title}</h1>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden">
                {video.creator.profilePicture && (
                  <img 
                    src={video.creator.profilePicture} 
                    alt={video.creator.username}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">{video.creator.username}</p>
                <p className="text-sm text-gray-400">{video.views} views</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleLike}
                className={liked ? 'text-red-500' : ''}
              >
                <Heart className={`mr-2 h-5 w-5 ${liked ? 'fill-current text-red-500' : ''}`} />
                Like
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </Button>
              
              {canWatch && (
                <Button 
                  variant="primary"
                  onClick={() => setShowGiftDialog(true)}
                >
                  Gift Creator
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-4 bg-gray-700 p-3 rounded-md">
            <p className="text-gray-300 whitespace-pre-line">{video.description}</p>
          </div>
        </div>
      </div>
      
      {/* Comments section (only show if the user can watch the video) */}
      {canWatch && (
        <CommentSection 
          comments={video.comments}
          commentText={commentText}
          setCommentText={setCommentText}
          onSubmit={handleCommentSubmit}
        />
      )}
      
      {/* Gift dialog */}
      <GiftDialog
        isOpen={showGiftDialog}
        onClose={() => setShowGiftDialog(false)}
        onGift={handleGift}
        creatorName={video.creator.username}
        giftAmounts={GIFT_AMOUNTS}
      />
    </div>
  );
};

export default VideoPlayer;