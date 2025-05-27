import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Feed from './pages/feed/Feed';
import VideoUpload from './pages/upload/VideoUpload';
import VideoPlayer from './pages/player/VideoPlayer';
import Profile from './pages/profile/Profile';
import Footer from './components/layout/Footer';
import Toast from './components/ui/Toast';
import { ToastProvider } from './context/ToastContext';
import { VideoProvider } from './context/VideoContext';
import { WalletProvider } from './context/WalletContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <WalletProvider>
            <VideoProvider>
              <div className="min-h-screen bg-gray-900 text-white flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute>
                          <Feed />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/upload" 
                      element={
                        <ProtectedRoute>
                          <VideoUpload />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/video/:id" 
                      element={
                        <ProtectedRoute>
                          <VideoPlayer />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile/:username" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
                <Toast />
              </div>
            </VideoProvider>
          </WalletProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;