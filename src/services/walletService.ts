import { Transaction } from '../types';
import { getCurrentUser } from './authService';
import { API_URL } from '../config';

// Mock wallet data
const MOCK_WALLET = {
  balance: 500, // Initial balance of ₹500
};

// Mock transactions
let MOCK_TRANSACTIONS: Transaction[] = [];

export const getWalletBalance = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_WALLET.balance);
    }, 300);
  });
};

export const updateWalletBalance = async (amount: number): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      MOCK_WALLET.balance = amount;
      resolve(MOCK_WALLET.balance);
    }, 300);
  });
};

export const getTransactionHistory = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_TRANSACTIONS]);
    }, 300);
  });
};

export const giftCreator = async (videoId: string, creatorId: string, amount: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          reject(new Error('User not authenticated'));
          return;
        }

        // Check if user has enough balance
        if (MOCK_WALLET.balance < amount) {
          reject(new Error('Insufficient balance'));
          return;
        }

        // Deduct from wallet
        MOCK_WALLET.balance -= amount;

        // Add transaction record
        const transaction: Transaction = {
          id: `transaction_${Date.now()}`,
          amount: amount,
          type: 'gift',
          description: `Gift to creator for video`,
          createdAt: new Date().toISOString(),
          videoId,
          recipientId: creatorId
        };

        MOCK_TRANSACTIONS.push(transaction);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

export const recordPurchaseTransaction = async (videoId: string, amount: number): Promise<Transaction> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          reject(new Error('User not authenticated'));
          return;
        }

        // Add transaction record
        const transaction: Transaction = {
          id: `transaction_${Date.now()}`,
          amount: amount,
          type: 'purchase',
          description: `Purchase of video`,
          createdAt: new Date().toISOString(),
          videoId
        };

        MOCK_TRANSACTIONS.push(transaction);
        resolve(transaction);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};