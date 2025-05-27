// User types
export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
}

// Video types
export interface Video {
  id: string;
  title: string;
  description: string;
  videoType: 'short-form' | 'long-form';
  videoUrl: string;
  thumbnailUrl: string;
  price: number;
  purchased?: boolean;
  createdAt: string;
  views: number;
  creator: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  comments: Comment[];
}

export interface VideoUploadData {
  title: string;
  description: string;
  videoType: 'short-form' | 'long-form';
  videoUrl?: string;
  price?: number;
}

// Comment types
export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
}

// Wallet and Transaction types
export interface Transaction {
  id: string;
  amount: number;
  type: 'purchase' | 'gift';
  description: string;
  createdAt: string;
  videoId?: string;
  recipientId?: string;
}

// Auth types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}