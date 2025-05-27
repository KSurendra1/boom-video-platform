import React from 'react';
import { useToast, ToastType } from '../../context/ToastContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = () => {
  const { toasts, hideToast } = useToast();

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getToastClasses = (type: ToastType) => {
    const baseClasses = "max-w-md w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1";
    
    switch (type) {
      case 'success':
        return `${baseClasses} ring-green-500`;
      case 'error':
        return `${baseClasses} ring-red-500`;
      case 'warning':
        return `${baseClasses} ring-yellow-500`;
      case 'info':
      default:
        return `${baseClasses} ring-blue-500`;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 p-4 flex flex-col space-y-4 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={getToastClasses(toast.type)}
          style={{ 
            animation: 'slideInUp 0.3s ease-out forwards'
          }}
        >
          <div className="flex-1 p-4 flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {getToastIcon(toast.type)}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{toast.message}</p>
            </div>
          </div>
          <div className="flex border-l border-gray-700">
            <button
              onClick={() => hideToast(toast.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;