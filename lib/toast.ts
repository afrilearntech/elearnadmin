"use client";

import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  icon?: string;
}

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: options?.duration || 4000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#FFFFFF',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      fontFamily: 'Poppins, sans-serif',
      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.3), 0 8px 10px -6px rgba(16, 185, 129, 0.2)',
      width: 'auto',
      minWidth: '280px',
      maxWidth: 'min(400px, 90vw)',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#10B981',
    },
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: options?.duration || 5000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
      padding: '16px 20px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      fontFamily: 'Poppins, sans-serif',
      boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3), 0 8px 10px -6px rgba(239, 68, 68, 0.2)',
      width: 'auto',
      minWidth: '280px',
      maxWidth: 'min(400px, 90vw)',
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#EF4444',
    },
  });
};

export const formatErrorMessage = (error: string): string => {
  const errorMappings: Record<string, string> = {
    'email': 'Please check your email address and try again.',
    'password': 'Password must be at least 6 characters long.',
    'phone': 'Please enter a valid phone number.',
    'name': 'Please enter your full name.',
    'network': 'Network error. Please check your connection and try again.',
    'server': 'Server error. Please try again later.',
    'unauthorized': 'You are not authorized to perform this action.',
    'not found': 'The requested resource was not found.',
  };

  const lowerError = error.toLowerCase();
  
  for (const [key, message] of Object.entries(errorMappings)) {
    if (lowerError.includes(key)) {
      return message;
    }
  }

  if (error.length > 100) {
    return 'An error occurred. Please check your input and try again.';
  }

  return error;
};

