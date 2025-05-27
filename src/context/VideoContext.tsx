import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video, VideoUploadData } from '../types';
import { 
  fetchVideos, 
  uploadVideo, 
  fetchVideoById, 
  addComment, 
  purchaseVideo 
} from '../services/videoService';
import { useToast } from './ToastContext';
import { useWallet } from './WalletContext';

interface VideoContextType {
  videos: Video[];
  loading: boolean;
  error: string | null;
  uploadVideo: (videoData: VideoUploadData, file: File | null) => Promise<void>;
  getVideoById: (id: string) => Promise<Video | null>;
  addCommentToVideo: (videoId: string, text: string) => Promise<void>;
  purchaseVideo: (videoId: string, price: number) => Promise<boolean>;
  loadMoreVideos: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { showToast } = useToast();
  const { deductBalance } = useWallet();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const newVideos = await fetchVideos(page);
      if (newVideos.length === 0) {
        setHasMore(false);
      } else {
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (err) {
      setError('Failed to load videos');
      showToast('Failed to load videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadVideoHandler = async (videoData: VideoUploadData, file: File | null) => {
    setLoading(true);
    try {
      await uploadVideo(videoData, file);
      showToast('Video uploaded successfully!', 'success');
      // Refresh videos after upload
      setVideos([]);
      setPage(1);
      setHasMore(true);
      loadVideos();
    } catch (err) {
      setError('Failed to upload video');
      showToast('Failed to upload video', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getVideoById = async (id: string): Promise<Video | null> => {
    setLoading(true);
    try {
      const video = await fetchVideoById(id);
      return video;
    } catch (err) {
      setError('Failed to load video');
      showToast('Failed to load video', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addCommentToVideo = async (videoId: string, text: string) => {
    try {
      await addComment(videoId, text);
      // Update the local video state to include the new comment
      const updatedVideo = await fetchVideoById(videoId);
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId ? updatedVideo : video
        )
      );
    } catch (err) {
      showToast('Failed to add comment', 'error');
      throw err;
    }
  };

  const purchaseVideoHandler = async (videoId: string, price: number) => {
    try {
      const success = await purchaseVideo(videoId, price);
      if (success) {
        // Deduct from wallet balance
        deductBalance(price);
        
        // Update video status in the list
        setVideos(prevVideos => 
          prevVideos.map(video => 
            video.id === videoId ? { ...video, purchased: true } : video
          )
        );
        
        showToast('Video purchased successfully!', 'success');
        return true;
      }
      return false;
    } catch (err) {
      showToast('Failed to purchase video', 'error');
      return false;
    }
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        loading,
        error,
        uploadVideo: uploadVideoHandler,
        getVideoById,
        addCommentToVideo,
        purchaseVideo: purchaseVideoHandler,
        loadMoreVideos: loadVideos
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};