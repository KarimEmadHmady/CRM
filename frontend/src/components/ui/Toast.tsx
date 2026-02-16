'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gray-800 border-gray-700';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-800 border-gray-700';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-white';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-white';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border shadow-lg transition-all duration-300 ${getBackgroundColor()} ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <p className={`text-sm font-medium ${getTextColor}`}>{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className={`ml-4 ${getTextColor} hover:opacity-70 transition-opacity`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast container component to manage multiple toasts
interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
