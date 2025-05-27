import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import Button from '../ui/Button';
import { Menu, X, Video, Upload, LogOut, User, Wallet } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">Boom</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/upload" 
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Link>
              
              <div className="flex items-center text-green-400 px-3 py-2">
                <Wallet className="h-4 w-4 mr-1" />
                ₹{balance}
              </div>
              
              <div className="relative group">
                <button className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  <div className="h-8 w-8 rounded-full bg-gray-600 overflow-hidden">
                    {user.profilePicture && (
                      <img 
                        src={user.profilePicture} 
                        alt={user.username}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link 
                    to={`/profile/${user.username}`} 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {!user && (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <div className="flex items-center px-3 py-2 text-gray-300">
                  <div className="h-8 w-8 rounded-full bg-gray-600 overflow-hidden mr-2">
                    {user.profilePicture && (
                      <img 
                        src={user.profilePicture} 
                        alt={user.username}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <span>{user.username}</span>
                </div>
                
                <Link 
                  to="/" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Video className="h-5 w-5 inline mr-2" />
                  Feed
                </Link>
                
                <Link 
                  to="/upload" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Upload className="h-5 w-5 inline mr-2" />
                  Upload
                </Link>
                
                <Link 
                  to={`/profile/${user.username}`} 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5 inline mr-2" />
                  Profile
                </Link>
                
                <div className="text-green-400 block px-3 py-2 rounded-md text-base font-medium">
                  <Wallet className="h-5 w-5 inline mr-2" />
                  Balance: ₹{balance}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  <LogOut className="h-5 w-5 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;