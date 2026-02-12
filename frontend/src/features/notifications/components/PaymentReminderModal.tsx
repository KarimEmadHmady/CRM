'use client';

import { useState } from 'react';
import { CreditCard, X } from 'lucide-react';

interface PaymentReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (daysBefore: number) => Promise<void>;
  loading: boolean;
}

export function PaymentReminderModal({ isOpen, onClose, onSubmit, loading }: PaymentReminderModalProps) {
  const [daysBefore, setDaysBefore] = useState(3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(daysBefore);
      onClose();
      setDaysBefore(3); // Reset to default
    } catch (error) {
      // Error is handled by the parent
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Create Payment Reminder Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Before Payment Due
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={daysBefore}
              onChange={(e) => setDaysBefore(parseInt(e.target.value) || 3)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter number of days before payment due"
            />
            <p className="text-sm text-gray-500 mt-1">
              Payment reminders will be sent to customers with payments due in {daysBefore} days
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Reminders'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
