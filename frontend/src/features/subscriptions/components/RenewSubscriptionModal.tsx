'use client';

import { useState } from 'react';
import { Calendar, DollarSign } from 'lucide-react';

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newEndDate: string, price: number) => void;
  loading?: boolean;
  currentEndDate: string;
  currentPrice: number;
}

export function RenewSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  currentEndDate,
  currentPrice
}: RenewSubscriptionModalProps) {
  const [newEndDate, setNewEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [price, setPrice] = useState(currentPrice.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }

    onConfirm(newEndDate, priceNum);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Renew Subscription</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Current End Date:</div>
            <div className="font-medium text-gray-900">
              {new Date(currentEndDate).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600 mb-1 mt-2">Current Price:</div>
            <div className="font-medium text-gray-900">${currentPrice}</div>
          </div>

          {/* New End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              New End Date
            </label>
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>

          {/* New Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              New Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
              placeholder="Enter price"
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Renewing...</span>
                </>
              ) : (
                <span>Renew Subscription</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
