'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { customerApi } from '@/features/customers/api/customer.api';
import { Customer } from '@/features/customers/types/customer.types';

interface WelcomeNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerId: string, message: string) => Promise<void>;
  loading: boolean;
}

export function WelcomeNotificationModal({ isOpen, onClose, onSubmit, loading }: WelcomeNotificationModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [message, setMessage] = useState('Welcome to our CRM system! We\'re excited to have you as a customer.');
  const [customersLoading, setCustomersLoading] = useState(false);

  // Fetch customers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    setCustomersLoading(true);
    try {
      const response = await customerApi.getAllCustomers();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setCustomersLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId.trim()) {
      alert('Please select a customer');
      return;
    }
    try {
      await onSubmit(selectedCustomerId, message);
      onClose();
      setSelectedCustomerId('');
      setMessage('Welcome to our CRM system! We\'re excited to have you as a customer.'); // Reset to default
    } catch (error) {
      // Error is handled by the parent
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Create Welcome Notification</h3>
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
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={customersLoading}
            >
              <option value="">
                {customersLoading ? 'Loading customers...' : 'Choose a customer...'}
              </option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Select a customer to send the welcome notification
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Welcome Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter welcome message"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              This message will be sent to the selected customer
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || customersLoading || !selectedCustomerId}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Send Welcome'}
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
