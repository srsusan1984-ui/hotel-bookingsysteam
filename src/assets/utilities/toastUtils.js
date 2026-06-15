import toast from 'react-hot-toast';

export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#fff',
      borderRadius: '8px',
      padding: '16px 24px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#fff',
      borderRadius: '8px',
      padding: '16px 24px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  });
};

export const showWarningToast = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#f59e0b',
      color: '#fff',
      borderRadius: '8px',
      padding: '16px 24px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#fff',
      borderRadius: '8px',
      padding: '16px 24px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  });
};
