import { Toaster, toast } from 'react-hot-toast';
import { createContext, useContext } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const showToast = (message, type = 'default') => {
    const options = {
      duration: 4000,
      position: 'top-right',
      className: 'bg-base-200 text-white border border-base-300/50',
      style: {
        padding: '16px',
        borderRadius: '8px',
      },
    };

    switch (type) {
      case 'success':
        toast.success(message, {
          ...options,
          icon: '✅',
          className: 'bg-green-900/50 text-white border border-green-500/50',
        });
        break;
      case 'error':
        toast.error(message, {
          ...options,
          icon: '❌',
          className: 'bg-red-900/50 text-white border border-red-500/50',
        });
        break;
      case 'loading':
        return toast.loading(message, {
          ...options,
          className: 'bg-blue-900/50 text-white border border-blue-500/50',
        });
      default:
        toast(message, options);
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export default ToastProvider; 