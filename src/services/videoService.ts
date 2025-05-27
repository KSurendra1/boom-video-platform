import { Video, VideoUploadData, Comment } from '../types';
import { getCurrentUser } from './authService';
import { API_URL } from '../config';

// Mock data storage
let MOCK_VIDEOS: Video[] = [];
let MOCK_PURCHASES: { userId: string; videoId: string }[] = [];

// Initialize with some mock videos
const initMockData = () => {
  if (MOCK_VIDEOS.length === 0) {
    // Short-form videos
    for (let i = 1; i <= 5; i++) {
      MOCK_VIDEOS.push({
        id: `short_${i}`,
        title: `Amazing Short Video ${i}`,
        description: `This is a short video demonstration #${i}`,
        videoType: 'short-form',
        videoUrl: `https://assets.mixkit.co/videos/preview/mixkit-people-walking-in-a-city-sidewalk-${40348 + i}-large.mp4`,
        thumbnailUrl: `https://picsum.photos/seed/short${i}/400/225`,
        price: 0,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        views: Math.floor(Math.random() * 10000),
        creator: {
          id: '1',
          username: 'demo_user',
          profilePicture: 'https://i.pravatar.cc/150?img=1'
        },
        comments: [
          {
            id: `comment_short_${i}_1`,
            text: 'This is amazing!',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            user: {
              id: '2',
              username: 'viewer1',
              profilePicture: 'https://i.pravatar.cc/150?img=2'
            }
          }
        ]
      });
    }

    // Long-form videos
    for (let i = 1; i <= 5; i++) {
      MOCK_VIDEOS.push({
        id: `long_${i}`,
        title: `Deep Dive Into Topic ${i}`,
        description: `A comprehensive tutorial on an interesting topic #${i}`,
        videoType: 'long-form',
        videoUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
        thumbnailUrl: `https://picsum.photos/seed/long${i}/400/225`,
        price: i % 2 === 0 ? 0 : 29 * i,
        createdAt: new Date(Date.now() - i * 7200000).toISOString(),
        views: Math.floor(Math.random() * 5000),
        creator: {
          id: '1',
          username: 'demo_user',
          profilePicture: 'https://i.pravatar.cc/150?img=1'
        },
        comments: [
          {
            id: `comment_long_${i}_1`,
            text: 'Very informative, thanks!',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            user: {
              id: '3',
              username: 'viewer2',
              profilePicture: 'https://i.pravatar.cc/150?img=3'
            }
          }
        ]
      });
    }
  }
};

// Initialize mock data
initMockData();

export const fetchVideos = async (page: number, limit: number = 5): Promise<Video[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedVideos = MOCK_VIDEOS.slice(start, end);
      
      // Check if videos are purchased by the current user
      getCurrentUser().then(user => {
        if (user) {
          const videosWithPurchaseStatus = paginatedVideos.map(video => {
            const isPurchased = MOCK_PURCHASES.some(
              p => p.userId === user.id && p.videoId === video.id
            );
            return { ...video, purchased: isPurchased };
          });
          resolve(videosWithPurchaseStatus);
        } else {
          resolve(paginatedVideos);
        }
      });
    }, 500);
  });
};

export const fetchVideoById = async (id: string): Promise<Video> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const video = MOCK_VIDEOS.find(v => v.id === id);
      
      if (video) {
        // Check if video is purchased by the current user
        getCurrentUser().then(user => {
          if (user) {
            const isPurchased = MOCK_PURCHASES.some(
              p => p.userId === user.id && p.videoId === video.id
            );
            resolve({ ...video, purchased: isPurchased });
          } else {
            resolve(video);
          }
        });
      } else {
        reject(new Error('Video not found'));
      }
    }, 500);
  });
};

export const uploadVideo = async (videoData: VideoUploadData, file: File | null): Promise<Video> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          reject(new Error('User not authenticated'));
          return;
        }

        // Create a mock video URL (in a real app, this would be an upload process)
        let videoUrl = '';
        if (videoData.videoType === 'short-form' && file) {
          // In a real app, we would upload the file and get a URL
          videoUrl = URL.createObjectURL(file);
        } else if (videoData.videoType === 'long-form' && videoData.videoUrl) {
          videoUrl = videoData.videoUrl;
        } else {
          reject(new Error('Invalid video data'));
          return;
        }

        const newVideo: Video = {
          id: `video_${Date.now()}`,
          title: videoData.title,
          description: videoData.description,
          videoType: videoData.videoType,
          videoUrl: videoUrl,
          thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/400/225`,
          price: videoData.price || 0,
          createdAt: new Date().toISOString(),
          views: 0,
          creator: {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture
          },
          comments: []
        };

        // Add to mock database
        MOCK_VIDEOS.unshift(newVideo);
        resolve(newVideo);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

export const addComment = async (videoId: string, text: string): Promise<Comment> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          reject(new Error('User not authenticated'));
          return;
        }

        const videoIndex = MOCK_VIDEOS.findIndex(v => v.id === videoId);
        if (videoIndex === -1) {
          reject(new Error('Video not found'));
          return;
        }

        const newComment: Comment = {
          id: `comment_${Date.now()}`,
          text,
          createdAt: new Date().toISOString(),
          user: {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture
          }
        };

        // Add comment to video
        MOCK_VIDEOS[videoIndex].comments.unshift(newComment);
        resolve(newComment);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

export const purchaseVideo = async (videoId: string, price: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          reject(new Error('User not authenticated'));
          return;
        }

        // Check if video exists
        const video = MOCK_VIDEOS.find(v => v.id === videoId);
        if (!video) {
          reject(new Error('Video not found'));
          return;
        }

        // Add to purchases
        MOCK_PURCHASES.push({
          userId: user.id,
          videoId
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};