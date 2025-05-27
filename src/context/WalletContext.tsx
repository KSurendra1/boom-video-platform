import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction } from '../types';
import { 
  getWalletBalance, 
  giftCreator, 
  getTransactionHistory 
} from '../services/walletService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  giftCreator: (videoId: string, creatorId: string, amount: number) => Promise<boolean>;
  deductBalance: (amount: number) => void;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      refreshBalance();
      refreshTransactions();
    }
  }, [user]);

  const refreshBalance = async () => {
    if (!user) return;
    
    try {
      const currentBalance = await getWalletBalance();
      setBalance(currentBalance);
    } catch (err) {
      console.error('Failed to fetch wallet balance:', err);
    }
  };

  const refreshTransactions = async () => {
    if (!user) return;
    
    try {
      const history = await getTransactionHistory();
      setTransactions(history);
    } catch (err) {
      console.error('Failed to fetch transaction history:', err);
    }
  };

  const giftCreatorHandler = async (videoId: string, creatorId: string, amount: number) => {
    setLoading(true);
    try {
      if (balance < amount) {
        showToast('Insufficient balance', 'error');
        return false;
      }
      
      const success = await giftCreator(videoId, creatorId, amount);
      if (success) {
        setBalance(prevBalance => prevBalance - amount);
        showToast(`Successfully gifted ₹${amount} to creator!`, 'success');
        await refreshTransactions();
        return true;
      }
      return false;
    } catch (err) {
      showToast('Failed to send gift', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deductBalance = (amount: number) => {
    setBalance(prevBalance => prevBalance - amount);
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        loading,
        giftCreator: giftCreatorHandler,
        deductBalance,
        refreshBalance,
        refreshTransactions
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};