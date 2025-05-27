import React from 'react';
import { Transaction } from '../../types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <p className="text-gray-400 text-lg">No transactions yet</p>
        <p className="text-gray-500 mt-2">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">Transaction History</h3>
        <p className="mt-1 text-sm text-gray-400">A record of your purchases and gifts</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {transaction.type === 'purchase' ? (
                      <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5 text-green-500 mr-2" />
                    )}
                    <span className="text-sm text-white capitalize">
                      {transaction.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{transaction.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    transaction.type === 'purchase' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {transaction.type === 'purchase' ? '-' : '+'} ₹{transaction.amount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;