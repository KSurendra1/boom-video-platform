import { User, LoginData, RegisterData } from '../types';
import { API_URL } from '../config';

// For demo purposes, we'll simulate API calls and use localStorage
const LOCAL_STORAGE_KEY = 'boom_user';

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    username: 'demo_user',
    email: 'demo@example.com',
    password: 'password123',
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    createdAt: new Date().toISOString()
  }
];

export const getCurrentUser = async (): Promise<User | null> => {
  const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storedUser) return null;
  
  try {
    const user = JSON.parse(storedUser);
    return user;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword as User);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500); // Simulate network delay
  });
};

export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if user already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        reject(new Error('User with this email already exists'));
        return;
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        password,
        profilePicture: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        createdAt: new Date().toISOString()
      };
      
      MOCK_USERS.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      
      resolve(userWithoutPassword as User);
    }, 500); // Simulate network delay
  });
};

export const logoutUser = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};