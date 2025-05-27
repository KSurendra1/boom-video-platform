import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { Video, Transaction } from '../../types';
import { fetchVideos } from '../../services/videoService';
import VideoGrid from '../../components/videos/VideoGrid';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import Button from '../../components/ui/Button';
import { Wallet } from 'lucide-react';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { balance, transactions, refreshBalance, refreshTransactions } = useWallet();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'transactions'>('videos');
  
  const isCurrentUser = user?.username === username;

  useEffect(() => {
    const loadUserVideos = async () => {
      setLoading(true);
      try {
        // In a real app, we would filter videos by user, but for the demo we'll just use all videos
        const allVideos = await fetchVideos(1, 10);
        setVideos(allVideos);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserVideos();
    
    if (isCurrentUser) {
      refreshBalance();
      refreshTransactions();
    }
  }, [username, isCurrentUser, refreshBalance, refreshTransactions]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Profile header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden mb-4 md:mb-0 md:mr-6">
            {user?.profilePicture && (
              <img 
                src={user.profilePicture} 
                alt={username} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="flex-grow">
            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-gray-400">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
            
            {isCurrentUser && (
              <div className="mt-3 flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-green-400" />
                <span className="font-medium">Wallet Balance:</span>
                <span className="ml-2 text-green-400 font-bold">₹{balance}</span>
              </div>
            )}
          </div>
          
          {isCurrentUser && (
            <div className="mt-4 md:mt-0">
              <Button>Edit Profile</Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs for videos and transactions */}
      {isCurrentUser && (
        <div className="flex mb-6 border-b border-gray-700">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'videos' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('videos')}
          >
            My Videos
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'transactions' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Transaction History
          </button>
        </div>
      )}
      
      {/* Content based on active tab */}
      {activeTab === 'videos' ? (
        <VideoGrid videos={videos} loading={loading} />
      ) : (
        <TransactionHistory transactions={transactions} />
      )}
    </div>
  );
};

export default Profile;