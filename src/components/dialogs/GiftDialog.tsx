import React, { useState } from 'react';
import Button from '../ui/Button';
import { Gift, X } from 'lucide-react';

interface GiftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGift: (amount: number) => Promise<void>;
  creatorName: string;
  giftAmounts: number[];
}

const GiftDialog: React.FC<GiftDialogProps> = ({
  isOpen,
  onClose,
  onGift,
  creatorName,
  giftAmounts
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const amount = selectedAmount || Number(customAmount);
    
    if (!amount || amount <= 0) return;
    
    setIsSubmitting(true);
    
    try {
      await onGift(amount);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <Gift className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Gift {creatorName}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    Show your appreciation by sending a gift to the creator. Select an amount below.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {giftAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    className={`px-4 py-2 rounded-full text-white font-medium ${
                      selectedAmount === amount 
                        ? 'bg-blue-600 border-2 border-blue-400' 
                        : 'bg-gray-700 hover:bg-gray-600 border-2 border-transparent'
                    }`}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Or enter a custom amount:
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="bg-gray-700 focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-600 rounded-md text-white"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (!selectedAmount && !customAmount)}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? 'Sending...' : 'Send Gift'}
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftDialog;